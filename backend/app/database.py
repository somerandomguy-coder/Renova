"""
RENOVA / ECOVAL Backend — Database Engine

Simple, zero-maintenance local SQLite database storage.
Automatically creates 'renova.db' upon first launch.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

db_url = settings.DATABASE_URL or "sqlite:///./renova.db"

# SQLite requires check_same_thread=False when used with FastAPI threads
connect_args = {}
if "sqlite" in db_url:
    connect_args = {"check_same_thread": False}

engine = create_engine(
    db_url,
    connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency providing database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
