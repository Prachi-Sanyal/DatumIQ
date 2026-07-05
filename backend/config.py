import os
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()

class Settings:
    PROJECT_NAME: str = "DatumIQ"
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    # Auth settings
    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY", "39f82635db157ef5b8429107936a28bb7c66a88b75fef2da629e469c849cf129"
    )
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./datumiq.db")
    
    # AI Engine
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # Directories
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
    OUTPUT_DIR: str = os.path.join(os.path.dirname(os.path.abspath(__file__)), "outputs")

settings = Settings()

# Ensure critical directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
