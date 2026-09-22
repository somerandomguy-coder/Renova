import os
import datetime
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.config import settings
from app.database import engine, Base, get_db
import app.models as models
import app.schemas as schemas
from app.services.calculators import run_esg_calculations, run_epr_calculations
from app.services.spreadsheets import (
    log_epr_partner_registration,
    log_green_project_registration,
    log_collector_registration
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get(f"{settings.API_V1_STR}/health", status_code=status.HTTP_200_OK)
def health_check():
    return {"status": "healthy", "database": "connected", "service": "RENOVA Platform"}

# --- CALCULATOR ENDPOINTS ---

@app.post(
    f"{settings.API_V1_STR}/calculate/esg",
    response_model=schemas.ESGCalcResponse,
    status_code=status.HTTP_200_OK,
    summary="Calculate ESG environmental impacts"
)
def calculate_esg(req: schemas.ESGCalcRequest):
    try:
        return run_esg_calculations(req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"ESG Calculation failed: {str(e)}"
        )

@app.post(
    f"{settings.API_V1_STR}/calculate/epr",
    response_model=schemas.EPRCashflowResponse,
    status_code=status.HTTP_200_OK,
    summary="Calculate EPR compliance cashflow benefits"
)
def calculate_epr(req: schemas.EPRCashflowRequest):
    try:
        return run_epr_calculations(req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"EPR Cashflow Calculation failed: {str(e)}"
        )

# --- REGISTRATION ENDPOINTS (Saved to DB & CSV) ---

@app.post(
    f"{settings.API_V1_STR}/register/epr-partner",
    response_model=schemas.EPRPartnerResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new EPR partner company"
)
def register_epr_partner(partner: schemas.EPRPartnerCreate, db: Session = Depends(get_db)):
    try:
        from app.services.security import encrypt_field, hash_email
        db_partner = models.EPRPartner(
            company_name=encrypt_field(partner.company_name),
            contact_name=encrypt_field(partner.contact_name),
            email=encrypt_field(partner.email),
            email_hash=hash_email(partner.email),
            phone=encrypt_field(partner.phone),
            annual_plastic_waste=partner.annual_plastic_waste,
            needs_epr_cert=partner.needs_epr_cert
        )
        db.add(db_partner)
        db.commit()
        db.refresh(db_partner)
        
        decrypted_data = {
            "id": db_partner.id,
            "company_name": partner.company_name,
            "contact_name": partner.contact_name,
            "email": partner.email,
            "phone": partner.phone,
            "annual_plastic_waste": db_partner.annual_plastic_waste,
            "needs_epr_cert": db_partner.needs_epr_cert,
            "status": db_partner.status,
            "created_at": db_partner.created_at
        }

        # Log to local CSV spreadsheet
        try:
            log_epr_partner_registration(
                id_val=decrypted_data["id"],
                company_name=decrypted_data["company_name"],
                contact_name=decrypted_data["contact_name"],
                email=decrypted_data["email"],
                phone=decrypted_data["phone"],
                annual_plastic_waste=decrypted_data["annual_plastic_waste"],
                needs_epr_cert=decrypted_data["needs_epr_cert"],
                created_at=decrypted_data["created_at"]
            )
        except Exception as csv_err:
            print(f"[CSV LOG ERROR] Failed to log EPR partner to CSV: {str(csv_err)}")
        
        return decrypted_data
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit EPR Partner registration: {str(e)}"
        )

@app.post(
    f"{settings.API_V1_STR}/register/green-project",
    response_model=schemas.GreenProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a green construction project"
)
def register_green_project(project: schemas.GreenProjectCreate, db: Session = Depends(get_db)):
    try:
        from app.services.security import encrypt_field, hash_email
        db_project = models.GreenProject(
            contact_name=encrypt_field(project.contact_name),
            email=encrypt_field(project.email),
            email_hash=hash_email(project.email),
            phone=encrypt_field(project.phone),
            surface_area=project.surface_area,
            location=encrypt_field(project.location),
            ventilation_consult=project.ventilation_consult
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        
        decrypted_data = {
            "id": db_project.id,
            "contact_name": project.contact_name,
            "email": project.email,
            "phone": project.phone,
            "surface_area": db_project.surface_area,
            "location": project.location,
            "ventilation_consult": db_project.ventilation_consult,
            "status": db_project.status,
            "created_at": db_project.created_at
        }

        # Log to local CSV spreadsheet
        try:
            log_green_project_registration(
                id_val=decrypted_data["id"],
                contact_name=decrypted_data["contact_name"],
                email=decrypted_data["email"],
                phone=decrypted_data["phone"],
                surface_area=decrypted_data["surface_area"],
                location=decrypted_data["location"],
                ventilation_consult=decrypted_data["ventilation_consult"],
                created_at=decrypted_data["created_at"]
            )
        except Exception as csv_err:
            print(f"[CSV LOG ERROR] Failed to log Green Project to CSV: {str(csv_err)}")
        
        return decrypted_data
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit Green Project registration: {str(e)}"
        )

@app.post(
    f"{settings.API_V1_STR}/register/collector",
    response_model=schemas.CollectorResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a material waste collector"
)
def register_collector(collector: schemas.CollectorCreate, db: Session = Depends(get_db)):
    try:
        from app.services.security import encrypt_field, hash_email
        db_collector = models.Collector(
            name=encrypt_field(collector.name),
            email=encrypt_field(collector.email),
            email_hash=hash_email(collector.email),
            phone=encrypt_field(collector.phone),
            collector_type=collector.collector_type,
            address=encrypt_field(collector.address) if collector.address else None
        )
        db.add(db_collector)
        db.commit()
        db.refresh(db_collector)
        
        decrypted_data = {
            "id": db_collector.id,
            "name": collector.name,
            "email": collector.email,
            "phone": collector.phone,
            "collector_type": db_collector.collector_type,
            "address": collector.address,
            "status": db_collector.status,
            "created_at": db_collector.created_at
        }

        # Log to local CSV spreadsheet
        try:
            log_collector_registration(
                id_val=decrypted_data["id"],
                name=decrypted_data["name"],
                email=decrypted_data["email"],
                phone=decrypted_data["phone"],
                collector_type=decrypted_data["collector_type"],
                address=decrypted_data["address"],
                created_at=decrypted_data["created_at"]
            )
        except Exception as csv_err:
            print(f"[CSV LOG ERROR] Failed to log Collector to CSV: {str(csv_err)}")
        
        return decrypted_data
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit Collector registration: {str(e)}"
        )

@app.post(
    f"{settings.API_V1_STR}/register/takeback",
    response_model=schemas.BrickTakebackResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a brick takeback and receive discount voucher"
)
def register_brick_takeback(takeback: schemas.BrickTakebackCreate, db: Session = Depends(get_db)):
    try:
        from app.services.security import encrypt_field, hash_email
        db_takeback = models.BrickTakeback(
            customer_name=encrypt_field(takeback.customer_name),
            phone=encrypt_field(takeback.phone),
            email=encrypt_field(takeback.email) if takeback.email else None,
            email_hash=hash_email(takeback.email) if takeback.email else None,
            collection_address=encrypt_field(takeback.collection_address),
            estimated_quantity=takeback.estimated_quantity,
            brick_condition=takeback.brick_condition,
            image_url=takeback.image_url,
            voucher_code="RENOVA-VOUCHER-XANH-2026"
        )
        db.add(db_takeback)
        db.commit()
        db.refresh(db_takeback)
        
        decrypted_data = {
            "id": db_takeback.id,
            "customer_name": takeback.customer_name,
            "phone": takeback.phone,
            "email": takeback.email,
            "collection_address": takeback.collection_address,
            "estimated_quantity": db_takeback.estimated_quantity,
            "brick_condition": db_takeback.brick_condition,
            "image_url": db_takeback.image_url,
            "voucher_code": db_takeback.voucher_code,
            "status": db_takeback.status,
            "created_at": db_takeback.created_at
        }
        return decrypted_data
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit brick takeback registration: {str(e)}"
        )

# --- AI CHAT ENDPOINTS ---

from app.services.ai_chat import chat as ai_chat, chat_stream as ai_chat_stream

@app.post(
    f"{settings.API_V1_STR}/ai/chat",
    response_model=schemas.ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Chat with RENOVA AI sustainability advisor"
)
def chat_with_ai(req: schemas.ChatRequest):
    """RAG-powered chatbot endpoint (non-streaming, backward compatible)."""
    try:
        history = [{"role": m.role, "content": m.content} for m in req.history]
        result = ai_chat(
            message=req.message,
            history=history,
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Chat failed: {str(e)}"
        )

@app.post(
    f"{settings.API_V1_STR}/ai/chat/stream",
    summary="Chat with RENOVA AI (streaming SSE)"
)
def chat_with_ai_stream(req: schemas.ChatRequest):
    """RAG-powered chatbot endpoint with Server-Sent Events streaming."""
    history = [{"role": m.role, "content": m.content} for m in req.history]

    return StreamingResponse(
        ai_chat_stream(
            message=req.message,
            history=history,
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )

# --- SERVE STATIC FRONTEND (1-Service Architecture on Render) ---
# When deployed as a single service, FastAPI serves the static Next.js export from frontend/out
_project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_frontend_out_dir = os.path.join(_project_root, "frontend", "out")

if os.path.isdir(_frontend_out_dir):
    app.mount("/", StaticFiles(directory=_frontend_out_dir, html=True), name="frontend_static")
