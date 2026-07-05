from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
import datetime
from ..database import Base

class AnalysisTask(Base):
    __tablename__ = "analysis_tasks"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    status = Column(String, default="IDLE")  # IDLE, RUNNING, COMPLETED, FAILED
    
    # Store dynamic orchestration execution logs: List of dicts with step name, status, message, and timestamp
    logs = Column(JSON, nullable=True)
    
    # Results dictionary containing:
    # - report: { title, executiveSummary, conclusion, nextSteps }
    # - insights: List of business insights with explanatory details
    # - recommendations: Strategic dynamic recommendation objects
    # - charts: Plotly JSON structures
    results = Column(JSON, nullable=True)
    
    # Path to compiled ReportLab board-ready PDF
    pdf_report_path = Column(String, nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="tasks")
    dataset = relationship("Dataset", back_populates="tasks")
    chat_messages = relationship("ChatMessage", back_populates="task", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, nullable=False)  # user, assistant
    content = Column(Text, nullable=False)
    
    task_id = Column(Integer, ForeignKey("analysis_tasks.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    task = relationship("AnalysisTask", back_populates="chat_messages")
