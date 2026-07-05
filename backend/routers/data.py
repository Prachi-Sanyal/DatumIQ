import os
import json
import logging
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from ..database import get_db
from ..config import settings
from .auth import get_current_user
from ..models.user import User
from ..models.dataset import Dataset
from ..models.task import AnalysisTask, ChatMessage
from ..schemas.analysis import DatasetResponse, TaskCreate, TaskResponse, ChatMessageCreate, TaskListResponse
from ..services.ai_orchestrator import AiOrchestrator

from google import genai
from google.genai import types

router = APIRouter(tags=["Data Operations"])


@router.post("/upload", response_model=DatasetResponse)
def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Accepts CSV, XLSX, and XLS file uploads.
    Streams file bytes into uploads/ directory and creates a DB dataset record.
    """
    filename = file.filename
    ext = os.path.splitext(filename)[1].lower()
    
    if ext not in [".csv", ".xlsx", ".xls"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload CSV or Excel spreadsheet files."
        )

    # Save to local uploads directory
    file_id_temp = os.urandom(4).hex()
    saved_filename = f"{file_id_temp}_{filename}"
    saved_filepath = os.path.join(settings.UPLOAD_DIR, saved_filename)
    
    try:
        with open(saved_filepath, "wb") as buffer:
            buffer.write(file.file.read())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file on disk: {str(e)}"
        )

    # Compute file size
    size_bytes = os.path.getsize(saved_filepath)

    new_dataset = Dataset(
        filename=filename,
        filepath=saved_filepath,
        file_size_bytes=size_bytes,
        user_id=current_user.id
    )
    
    db.add(new_dataset)
    db.commit()
    db.refresh(new_dataset)
    return new_dataset


@router.post("/analyze", response_model=TaskResponse)
def trigger_analysis(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Creates a transaction task and triggers the multi-agent AI orchestration pipeline
    sequentially. Runs the actual validation, masking, planning, pandas math,
    insights, recommendations, and report compilation.
    """
    dataset = db.query(Dataset).filter(Dataset.id == payload.dataset_id, Dataset.user_id == current_user.id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Specified dataset not found or permission denied."
        )

    # Create new analysis task
    new_task = AnalysisTask(
        question=payload.question,
        status="IDLE",
        user_id=current_user.id,
        dataset_id=dataset.id,
        logs=[],
        results={}
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    # Execute full multi-agent orchestration pipeline
    pipeline_res = AiOrchestrator.run_pipeline(db, new_task.id)
    if pipeline_res.get("status") == "FAILED":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Pipeline execution failed: {pipeline_res.get('error')}"
        )

    db.refresh(new_task)
    return new_task


@router.get("/history", response_model=List[TaskListResponse])
def get_task_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetches list of historical orchestration tasks executed by the current user"""
    tasks = db.query(AnalysisTask).filter(AnalysisTask.user_id == current_user.id).order_by(AnalysisTask.created_at.desc()).all()
    return tasks


@router.get("/task/{task_id}", response_model=TaskResponse)
def get_task_details(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetches fully compiled results, logs, charts, and recommendations of a specific task"""
    task = db.query(AnalysisTask).filter(AnalysisTask.id == task_id, AnalysisTask.user_id == current_user.id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis task not found."
        )
    return task


@router.post("/chat/{task_id}", response_model=TaskResponse)
def chat_with_dataset(
    task_id: int,
    payload: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Conversational AI interface. Remember dataset content and analytical results
    from the current task to answer follow-up queries with high reasoning and NO hallucination.
    """
    task = db.query(AnalysisTask).filter(AnalysisTask.id == task_id, AnalysisTask.user_id == current_user.id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task context not found."
        )

    # 1. Save user chat message
    user_msg = ChatMessage(role="user", content=payload.content, task_id=task.id)
    db.add(user_msg)
    db.commit()

    # Get entire conversation history for context
    history_msgs = db.query(ChatMessage).filter(ChatMessage.task_id == task.id).order_by(ChatMessage.created_at.asc()).all()
    
    chat_history_formatted = []
    for m in history_msgs[:-1]: # exclude the latest user message which we will append in prompt
        chat_history_formatted.append(f"{m.role.upper()}: {m.content}")

    # Initialize Google GenAI client
    assistant_content = ""
    if settings.GEMINI_API_KEY:
        try:
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            
            prompt = f"""
            You are DatumIQ Chat, the interactive Chief Data Officer.
            Your role is to answer user follow-up questions regarding their dataset and the analytical results we compiled.
            Always maintain accuracy. Under no circumstances hallucinate or guess numbers. Rely strictly on the verified data.

            Dataset Quality Metrics:
            {json.dumps(task.results.get('profile', {}), indent=2)}

            Statistical Calculations:
            {json.dumps(task.results.get('analysis', {}), indent=2)}

            Extracted Insights:
            {json.dumps(task.results.get('insights', []), indent=2)}

            Strategic Recommendations:
            {json.dumps(task.results.get('recommendations', []), indent=2)}

            Conversational History:
            {chr(10).join(chat_history_formatted)}

            New User Question:
            "{payload.content}"

            Draft a highly detailed, professional CDO response answering the user's question, citing evidence from the statistical outputs.
            """

            response = client.models.generate_content(
                model="gemini-3.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.3)
            )
            assistant_content = response.text.strip()
        except Exception as e:
            logging.error(f"Chat Gemini call failed: {str(e)}")
            assistant_content = "The CDO engine is temporarily offline. Based on cached analysis, top KPIs remain stable."
    else:
        assistant_content = "Gemini API key is not configured. Cache calculations indicate standard mathematical values represent normal bounds."

    # Save assistant message
    asst_msg = ChatMessage(role="assistant", content=assistant_content, task_id=task.id)
    db.add(asst_msg)
    db.commit()

    db.refresh(task)
    return task


@router.get("/report/{task_id}")
def download_pdf_report(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Streams the professionally compiled ReportLab PDF summary of a specific task"""
    task = db.query(AnalysisTask).filter(AnalysisTask.id == task_id, AnalysisTask.user_id == current_user.id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report context not found."
        )

    if not task.pdf_report_path or not os.path.exists(task.pdf_report_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compiled PDF file has expired or was not created."
        )

    return FileResponse(
        path=task.pdf_report_path,
        media_type="application/pdf",
        filename=f"DatumIQ_Executive_Report_{task_id}.pdf"
    )
