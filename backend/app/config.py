import os
import json
from pydantic_settings import BaseSettings
from typing import List, Union, Any, Optional
from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "RENOVA Circular & ESG API"
    API_V1_STR: str = "/api/v1"
    
    # Database configuration
    # By default, use SQLite located in the backend folder
    DATABASE_URL: str = "sqlite:///./renova.db"
    TURSO_AUTH_TOKEN: Optional[str] = None
    
    # CORS Origins
    CORS_ORIGINS: Any = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
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
        # Automatically strip trailing slashes to prevent browser CORS mismatches
        return [origin.rstrip("/") for origin in origins]
    
    # Email configurations (Mocked by default if not set)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "info@renova.vn"
    USE_MOCK_EMAIL: bool = True  # True will log email to file instead of trying to send it

    # Security and Encryption Configurations
    JWT_SECRET_KEY: str = "renova-admin-secret-key-2026-super-secure"
    ENCRYPTION_KEY: str = "ULgXQZxIRcrPGGC4gO8he5D8Vor8G08oiWzagVp2948="

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
