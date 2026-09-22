"""
RENOVA / ECOVAL Backend — Application Settings

Ultra-simplified settings for 1-service deployment on Render.
Only requires DEEPSEEK_API_KEY to operate the AI Chatbot.
"""

import os
import json
from pydantic_settings import BaseSettings
from typing import List, Union, Any, Optional
from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "RENOVA Circular Materials & ESG Platform"
    API_V1_STR: str = "/api/v1"
    
    # Database configuration (Defaults to local SQLite 'renova.db')
    DATABASE_URL: str = "sqlite:///./renova.db"

    # DeepSeek API Key for AI Chatbot (Only required variable)
    DEEPSEEK_API_KEY: Optional[str] = None
    
    # Internal default keys (used for hashing/field protection)
    ENCRYPTION_KEY: str = "ULgXQZxIRcrPGGC4gO8he5D8Vor8G08oiWzagVp2948="
    JWT_SECRET_KEY: str = "renova-default-secret-key-2026"
    
    # Permissive CORS to allow frontend and any origin to connect
    CORS_ORIGINS: Any = ["*"]
    
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

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

settings = Settings()
