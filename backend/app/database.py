from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from app.config import settings

db_url = settings.DATABASE_URL
# Automatically normalize Turso direct libsql/wss schemas for SQLAlchemy-libsql dialect
if db_url.startswith("libsql://"):
    db_url = db_url.replace("libsql://", "sqlite+libsql://", 1)
elif db_url.startswith("wss://"):
    db_url = db_url.replace("wss://", "sqlite+libsql://", 1)

# Configure Turso connection parameters dynamically to prevent 308 redirects
if "turso.io" in db_url:
    if "secure=true" not in db_url:
        separator = "&" if "?" in db_url else "?"
        db_url += f"{separator}secure=true"
    
    # Inject token from settings or environment if present and not already in URL query
    token = settings.TURSO_AUTH_TOKEN or os.environ.get("TURSO_AUTH_TOKEN") or os.environ.get("TURSO_TOKEN") or os.environ.get("TURSO_DB_TOKEN")
    if token and "authToken=" not in db_url:
        separator = "&" if "?" in db_url else "?"
        db_url += f"{separator}authToken={token}"

# Print masked database URL for secure deploy logging
import re
masked_url = db_url
if "authToken=" in masked_url:
    masked_url = re.sub(r"authToken=[^&]+", "authToken=***", masked_url)
print(f"[Database] Connecting to: {masked_url}", flush=True)

connect_args = {}
if "sqlite" in db_url or "libsql" in db_url:
    connect_args = {"check_same_thread": False}

engine = create_engine(
    db_url,
    connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get db session in endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
