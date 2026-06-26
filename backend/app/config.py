import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "RENOVA Circular & ESG API"
    API_V1_STR: str = "/api/v1"
    
    # Database configuration
    # By default, use SQLite located in the backend folder
    DATABASE_URL: str = "sqlite:///./renova.db"
    
    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Email configurations (Mocked by default if not set)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "info@renova.vn"
    USE_MOCK_EMAIL: bool = True  # True will log email to file instead of trying to send it

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
