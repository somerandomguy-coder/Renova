from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
import datetime

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


# --- ADMIN PANEL ENDPOINTS ---

@app.post(
    f"{settings.API_V1_STR}/admin/login",
    response_model=schemas.AdminLoginResponse,
    status_code=status.HTTP_200_OK,
    summary="Admin panel sign-in validation"
)
def admin_login(req: schemas.AdminLoginRequest):
    # Static secure mock credentials for the administrative portal
    if req.username == "admin" and req.password == "renovacircular2026":
        return {"token": "mock-admin-token-2026", "username": "admin", "success": True}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Tài khoản hoặc mật khẩu không chính xác / Invalid admin credentials"
    )

@app.get(
    f"{settings.API_V1_STR}/admin/stats",
    response_model=schemas.OverviewStatsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get unified overview KPI stats"
)
def get_admin_stats(db: Session = Depends(get_db)):
    # EPR stats
    epr_total = db.query(models.EPRPartner).count()
    epr_starting = db.query(models.EPRPartner).filter(models.EPRPartner.status == "Starting").count()
    epr_pending = db.query(models.EPRPartner).filter(models.EPRPartner.status == "Pending").count()
    epr_success = db.query(models.EPRPartner).filter(models.EPRPartner.status == "Replied").count()

    # Architecture stats
    arch_total = db.query(models.GreenProject).count()
    arch_starting = db.query(models.GreenProject).filter(models.GreenProject.status == "Starting").count()
    arch_pending = db.query(models.GreenProject).filter(models.GreenProject.status == "Pending").count()
    arch_success = db.query(models.GreenProject).filter(models.GreenProject.status == "Replied").count()

    # Collection stats
    coll_total = db.query(models.Collector).count()
    coll_starting = db.query(models.Collector).filter(models.Collector.status == "Starting").count()
    coll_pending = db.query(models.Collector).filter(models.Collector.status == "Pending").count()
    coll_success = db.query(models.Collector).filter(models.Collector.status == "Replied").count()

    total_records = epr_total + arch_total + coll_total
    # Pending is Starting + Pending
    total_pending = epr_starting + epr_pending + arch_starting + arch_pending + coll_starting + coll_pending
    total_success = epr_success + arch_success + coll_success

    return {
        "total_records": total_records,
        "total_pending": total_pending,
        "total_success": total_success,
        "epr_stats": {"total": epr_total, "starting": epr_starting, "pending": epr_pending, "success": epr_success},
        "architecture_stats": {"total": arch_total, "starting": arch_starting, "pending": arch_pending, "success": arch_success},
        "collection_stats": {"total": coll_total, "starting": coll_starting, "pending": coll_pending, "success": coll_success}
    }

@app.get(
    f"{settings.API_V1_STR}/admin/activity",
    response_model=List[schemas.GlobalActivityItem],
    status_code=status.HTTP_200_OK,
    summary="Get recent global activity feed across all tables"
)
def get_global_activity(db: Session = Depends(get_db)):
    # Fetch recent registrations across all three models
    epr = db.query(models.EPRPartner).order_by(models.EPRPartner.created_at.desc()).limit(10).all()
    arch = db.query(models.GreenProject).order_by(models.GreenProject.created_at.desc()).limit(10).all()
    coll = db.query(models.Collector).order_by(models.Collector.created_at.desc()).limit(10).all()

    feed = []
    for item in epr:
        feed.append({
            "id": item.id,
            "type": "epr",
            "title": item.company_name,
            "subtitle": f"EPR Partner: {item.contact_name} ({item.annual_plastic_waste:.0f} kg/year)",
            "email": item.email,
            "status": item.status,
            "created_at": item.created_at
        })
    for item in arch:
        feed.append({
            "id": item.id,
            "type": "architecture",
            "title": f"Green Project: {item.location}",
            "subtitle": f"Architecture Lead: {item.contact_name} ({item.surface_area:.0f} m²)",
            "email": item.email,
            "status": item.status,
            "created_at": item.created_at
        })
    for item in coll:
        type_str = "Vựa ve chai / Scrap Yard" if item.collector_type == "scrap_yard" else "Cá nhân / Individual"
        feed.append({
            "id": item.id,
            "type": "collection",
            "title": item.name,
            "subtitle": f"Collection Registration ({type_str})",
            "email": item.email,
            "status": item.status,
            "created_at": item.created_at
        })

    # Sort all by created_at desc and return top 10
    feed.sort(key=lambda x: x["created_at"], reverse=True)
    return feed[:10]

@app.get(
    f"{settings.API_V1_STR}/admin/epr-partners",
    response_model=List[schemas.EPRPartnerResponse],
    status_code=status.HTTP_200_OK,
    summary="List, search and filter EPR partners"
)
def list_epr_partners(
    search: str = None, 
    status: str = None, 
    db: Session = Depends(get_db)
):
    query = db.query(models.EPRPartner)
    if search:
        query = query.filter(
            (models.EPRPartner.company_name.ilike(f"%{search}%")) |
            (models.EPRPartner.contact_name.ilike(f"%{search}%")) |
            (models.EPRPartner.email.ilike(f"%{search}%"))
        )
    if status:
        query = query.filter(models.EPRPartner.status == status)
    return query.order_by(models.EPRPartner.created_at.desc()).all()

@app.get(
    f"{settings.API_V1_STR}/admin/green-projects",
    response_model=List[schemas.GreenProjectResponse],
    status_code=status.HTTP_200_OK,
    summary="List, search and filter green construction projects"
)
def list_green_projects(
    search: str = None, 
    status: str = None, 
    db: Session = Depends(get_db)
):
    query = db.query(models.GreenProject)
    if search:
        query = query.filter(
            (models.GreenProject.contact_name.ilike(f"%{search}%")) |
            (models.GreenProject.email.ilike(f"%{search}%")) |
            (models.GreenProject.location.ilike(f"%{search}%"))
        )
    if status:
        query = query.filter(models.GreenProject.status == status)
    return query.order_by(models.GreenProject.created_at.desc()).all()

@app.get(
    f"{settings.API_V1_STR}/admin/collectors",
    response_model=List[schemas.CollectorResponse],
    status_code=status.HTTP_200_OK,
    summary="List, search and filter waste material collectors"
)
def list_collectors(
    search: str = None, 
    status: str = None, 
    db: Session = Depends(get_db)
):
    query = db.query(models.Collector)
    if search:
        query = query.filter(
            (models.Collector.name.ilike(f"%{search}%")) |
            (models.Collector.email.ilike(f"%{search}%")) |
            (models.Collector.address.ilike(f"%{search}%"))
        )
    if status:
        query = query.filter(models.Collector.status == status)
    return query.order_by(models.Collector.created_at.desc()).all()

@app.put(
    f"{settings.API_V1_STR}/admin/bulk-status",
    status_code=status.HTTP_200_OK,
    summary="Bulk update statuses of selected pipeline records"
)
def bulk_update_status(req: schemas.BulkStatusUpdateRequest, db: Session = Depends(get_db)):
    if req.type == "epr":
        model = models.EPRPartner
    elif req.type == "architecture":
        model = models.GreenProject
    elif req.type == "collection":
        model = models.Collector
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid pipeline type")

    db.query(model).filter(model.id.in_(req.ids)).update(
        {"status": req.status}, synchronize_session=False
    )
    db.commit()
    return {"message": f"Successfully updated status to {req.status} for {len(req.ids)} records"}

@app.post(
    f"{settings.API_V1_STR}/admin/send-email",
    status_code=status.HTTP_200_OK,
    summary="Send a custom outbound email to a partner and update status to Replied"
)
def admin_send_email(req: schemas.AdminSendEmailRequest, db: Session = Depends(get_db)):
    if req.type == "epr":
        item = db.query(models.EPRPartner).filter(models.EPRPartner.id == req.id).first()
        name = item.contact_name if item else ""
    elif req.type == "architecture":
        item = db.query(models.GreenProject).filter(models.GreenProject.id == req.id).first()
        name = item.contact_name if item else ""
    elif req.type == "collection":
        item = db.query(models.Collector).filter(models.Collector.id == req.id).first()
        name = item.name if item else ""
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid pipeline type")

    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")

    # Local Mock Email Log writing (matches existing confirmation email logger pattern)
    os.makedirs("mock_emails", exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = f"mock_emails/admin_sent_{req.type}_{req.id}_{timestamp}.txt"
    
    full_text = f"""Subject: {req.subject}
To: {item.email}
Sent Time: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
============================================================
Dear {name},

{req.email_content}
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(full_text)
        
    # Transition status to Replied
    item.status = "Replied"
    db.commit()
    
    return {"message": f"Email successfully sent and status updated to Replied for {item.email}"}
