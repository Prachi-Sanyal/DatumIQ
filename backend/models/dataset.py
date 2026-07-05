from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
import datetime
from ..database import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    row_count = Column(Integer, nullable=True)
    col_count = Column(Integer, nullable=True)
    
    # Store dynamic schema profile: column names, data types, null counts, cardinalities, duplicates
    profile_data = Column(JSON, nullable=True)
    
    # Masked dataset file path for PII compliance
    masked_filepath = Column(String, nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="datasets")
    tasks = relationship("AnalysisTask", back_populates="dataset", cascade="all, delete-orphan")
