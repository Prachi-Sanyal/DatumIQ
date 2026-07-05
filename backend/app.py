import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import engine, Base
from .routers import auth, data

# Create database tables upon startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="The complete AI Agent Decision Intelligence Backend.",
    version="1.0.0"
)

# Enable CORS for frontend interface communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to allowed domain lists
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Bind modular endpoints
app.include_router(auth.router, prefix="/api")
app.include_router(data.router, prefix="/api")

@app.get("/api/health", tags=["Health"])
def health_check():
    """Confirms operational status of the DatumIQ backend microservice"""
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "database": "sqlite (active)",
        "orchestration_engine": "online"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
