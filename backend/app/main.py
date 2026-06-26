from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from app.config import settings
from app.database import engine, Base, get_db
import app.models as models
import app.schemas as schemas
from app.services.calculators import run_esg_calculations, run_epr_calculations
from app.services.emails import send_bilingual_confirmation_email
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

@app.get("/")
def read_root():
    return {"message": "Welcome to RENOVA Circular & ESG Platform API", "docs": "/docs"}

@app.get(f"{settings.API_V1_STR}/health", status_code=status.HTTP_200_OK)
def health_check():
    return {"status": "healthy", "database": "connected"}

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

# --- REGISTRATION ENDPOINTS ---

@app.post(
    f"{settings.API_V1_STR}/register/epr-partner",
    response_model=schemas.EPRPartnerResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new EPR partner company"
)
def register_epr_partner(partner: schemas.EPRPartnerCreate, db: Session = Depends(get_db)):
    try:
        db_partner = models.EPRPartner(
            company_name=partner.company_name,
            contact_name=partner.contact_name,
            email=partner.email,
            phone=partner.phone,
            annual_plastic_waste=partner.annual_plastic_waste,
            needs_epr_cert=partner.needs_epr_cert
        )
        db.add(db_partner)
        db.commit()
        db.refresh(db_partner)
        
        # Log to local CSV spreadsheet
        try:
            log_epr_partner_registration(
                id_val=db_partner.id,
                company_name=db_partner.company_name,
                contact_name=db_partner.contact_name,
                email=db_partner.email,
                phone=db_partner.phone,
                annual_plastic_waste=db_partner.annual_plastic_waste,
                needs_epr_cert=db_partner.needs_epr_cert,
                created_at=db_partner.created_at
            )
        except Exception as csv_err:
            print(f"[CSV LOG ERROR] Failed to log EPR partner to CSV: {str(csv_err)}")
        
        # Trigger email notification
        send_bilingual_confirmation_email(
            to_email=db_partner.email,
            recipient_name=db_partner.contact_name,
            form_type="epr_partner",
            form_data={
                "company_name": db_partner.company_name,
                "annual_plastic_waste": db_partner.annual_plastic_waste,
                "needs_epr_cert": db_partner.needs_epr_cert
            }
        )
        
        return db_partner
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
        db_project = models.GreenProject(
            contact_name=project.contact_name,
            email=project.email,
            phone=project.phone,
            surface_area=project.surface_area,
            location=project.location,
            ventilation_consult=project.ventilation_consult
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        
        # Log to local CSV spreadsheet
        try:
            log_green_project_registration(
                id_val=db_project.id,
                contact_name=db_project.contact_name,
                email=db_project.email,
                phone=db_project.phone,
                surface_area=db_project.surface_area,
                location=db_project.location,
                ventilation_consult=db_project.ventilation_consult,
                created_at=db_project.created_at
            )
        except Exception as csv_err:
            print(f"[CSV LOG ERROR] Failed to log Green Project to CSV: {str(csv_err)}")
        
        # Trigger email notification
        send_bilingual_confirmation_email(
            to_email=db_project.email,
            recipient_name=db_project.contact_name,
            form_type="green_project",
            form_data={
                "surface_area": db_project.surface_area,
                "location": db_project.location,
                "ventilation_consult": db_project.ventilation_consult
            }
        )
        
        return db_project
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
        db_collector = models.Collector(
            name=collector.name,
            email=collector.email,
            phone=collector.phone,
            collector_type=collector.collector_type,
            address=collector.address
        )
        db.add(db_collector)
        db.commit()
        db.refresh(db_collector)
        
        # Log to local CSV spreadsheet
        try:
            log_collector_registration(
                id_val=db_collector.id,
                name=db_collector.name,
                email=db_collector.email,
                phone=db_collector.phone,
                collector_type=db_collector.collector_type,
                address=db_collector.address,
                created_at=db_collector.created_at
            )
        except Exception as csv_err:
            print(f"[CSV LOG ERROR] Failed to log Collector to CSV: {str(csv_err)}")
        
        # Trigger email notification
        send_bilingual_confirmation_email(
            to_email=db_collector.email,
            recipient_name=db_collector.name,
            form_type="collector",
            form_data={
                "collector_type": db_collector.collector_type,
                "phone": db_collector.phone,
                "address": db_collector.address
            }
        )
        
        return db_collector
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit Collector registration: {str(e)}"
        )
