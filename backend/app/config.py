"""
RENOVA / ECOVAL Backend — Application Settings

Zero-config settings with production-safe defaults for Render deployment.
"""

import os
import json
from pydantic_settings import BaseSettings
from typing import List, Union, Any, Optional
from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "RENOVA / ECOVAL Circular Materials & ESG API"
    API_V1_STR: str = "/api/v1"
    
    # Database configuration (Defaults to local SQLite)
    DATABASE_URL: str = "sqlite:///./renova.db"
    
    # Optional Webhook URL to push form registrations directly to Google Sheets
    GOOGLE_SHEET_WEBHOOK_URL: Optional[str] = None

    # DeepSeek API Key for AI Chatbot
    DEEPSEEK_API_KEY: Optional[str] = None
    
    # CORS Origins (Permissive default to prevent CORS errors on new deploy URLs)
    CORS_ORIGINS: Any = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    origins = json.loads(v)
                except Exception:
                    origins = [item.strip() for item in v.split(",") if item.strip()]
            else:
                origins = [item.strip() for item in v.split(",") if item.strip()]
        else:
            origins = v
        return [origin.strip("\"'").rstrip("/") for origin in origins]
    
    # Email configurations (Mocked to log file by default, no SMTP account needed)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "info@renova.vn"
    USE_MOCK_EMAIL: bool = True

    # Legacy encryption keys kept as safe dummy defaults
    JWT_SECRET_KEY: str = "renova-safe-default-key-2026"
    ENCRYPTION_KEY: str = "ULgXQZxIRcrPGGC4gO8he5D8Vor8G08oiWzagVp2948="

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

settings = Settings()
