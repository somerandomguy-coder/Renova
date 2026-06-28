import os
import hashlib
import datetime
import jwt
from cryptography.fernet import Fernet
from app.config import settings

# Enforce secure encryption key fallback or load from config
ENCRYPTION_KEY = settings.ENCRYPTION_KEY
fernet = Fernet(ENCRYPTION_KEY.encode())

def encrypt_field(value: str) -> str:
    if not value:
        return ""
    return fernet.encrypt(value.encode()).decode()

def decrypt_field(value: str) -> str:
    if not value:
        return ""
    try:
        return fernet.decrypt(value.encode()).decode()
    except Exception:
        # Fallback to plain text if decryption fails (e.g. for existing unencrypted seed data)
        return value

def hash_email(email: str) -> str:
    if not email:
        return ""
    # Standard SHA-256 with static salt for deterministic exact-matching lookup
    salt = "renova-salt-2026"
    return hashlib.sha256((email.strip().lower() + salt).encode()).hexdigest()

# JWT Auth helpers
JWT_SECRET = settings.JWT_SECRET_KEY
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: datetime.timedelta = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(hours=8)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
