from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import datetime

class DatasetResponse(BaseModel):
    id: int
    filename: str
    file_size_bytes: int
    row_count: Optional[int] = None
    col_count: Optional[int] = None
    profile_data: Optional[Dict[str, Any]] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    question: str
    dataset_id: int

class ChatMessageCreate(BaseModel):
    content: str

class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class TaskResponse(BaseModel):
    id: int
    question: str
    status: str
    logs: Optional[List[Dict[str, Any]]] = None
    results: Optional[Dict[str, Any]] = None
    pdf_report_path: Optional[str] = None
    dataset_id: int
    created_at: datetime.datetime
    chat_messages: List[ChatMessageResponse] = []

    class Config:
        from_attributes = True

class TaskListResponse(BaseModel):
    id: int
    question: str
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True
