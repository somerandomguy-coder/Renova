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
        
        # Clean decrypted dict representation for external outputs and response
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
        
        # Trigger email notification
        send_bilingual_confirmation_email(
            to_email=decrypted_data["email"],
            recipient_name=decrypted_data["contact_name"],
            form_type="epr_partner",
            form_data={
                "company_name": decrypted_data["company_name"],
                "annual_plastic_waste": decrypted_data["annual_plastic_waste"],
                "needs_epr_cert": decrypted_data["needs_epr_cert"]
            }
        )
        
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
        
        # Clean decrypted dict representation for external outputs and response
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
        
        # Trigger email notification
        send_bilingual_confirmation_email(
            to_email=decrypted_data["email"],
            recipient_name=decrypted_data["contact_name"],
            form_type="green_project",
            form_data={
                "surface_area": decrypted_data["surface_area"],
                "location": decrypted_data["location"],
                "ventilation_consult": decrypted_data["ventilation_consult"]
            }
        )
        
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
        
        # Clean decrypted dict representation for external outputs and response
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
        
        # Trigger email notification
        send_bilingual_confirmation_email(
            to_email=decrypted_data["email"],
            recipient_name=decrypted_data["name"],
            form_type="collector",
            form_data={
                "collector_type": decrypted_data["collector_type"],
                "phone": decrypted_data["phone"],
                "address": decrypted_data["address"]
            }
        )
        
        return decrypted_data
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit Collector registration: {str(e)}"
        )


# --- ADMIN PANEL ENDPOINTS ---

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.security import verify_token, create_access_token, decrypt_field

security_scheme = HTTPBearer()

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload or payload.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Mã xác thực không hợp lệ hoặc đã hết hạn / Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload

@app.post(
    f"{settings.API_V1_STR}/admin/login",
    response_model=schemas.AdminLoginResponse,
    status_code=status.HTTP_200_OK,
    summary="Admin panel sign-in validation"
)
def admin_login(req: schemas.AdminLoginRequest):
    # Static secure mock credentials for the administrative portal
    if req.username == "admin" and req.password == "renovacircular2026":
        access_token = create_access_token(data={"sub": "admin", "role": "admin"})
        return {"token": access_token, "username": "admin", "success": True}
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
def get_admin_stats(db: Session = Depends(get_db), admin_user: dict = Depends(get_current_admin)):
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
def get_global_activity(db: Session = Depends(get_db), admin_user: dict = Depends(get_current_admin)):
    # Fetch recent registrations across all three models
    epr = db.query(models.EPRPartner).order_by(models.EPRPartner.created_at.desc()).limit(10).all()
    arch = db.query(models.GreenProject).order_by(models.GreenProject.created_at.desc()).limit(10).all()
    coll = db.query(models.Collector).order_by(models.Collector.created_at.desc()).limit(10).all()

    feed = []
    for item in epr:
        feed.append({
            "id": item.id,
            "type": "epr",
            "title": decrypt_field(item.company_name),
            "subtitle": f"EPR Partner: {decrypt_field(item.contact_name)} ({item.annual_plastic_waste:.0f} kg/year)",
            "email": decrypt_field(item.email),
            "status": item.status,
            "created_at": item.created_at
        })
    for item in arch:
        feed.append({
            "id": item.id,
            "type": "architecture",
            "title": f"Green Project: {decrypt_field(item.location)}",
            "subtitle": f"Architecture Lead: {decrypt_field(item.contact_name)} ({item.surface_area:.0f} m²)",
            "email": decrypt_field(item.email),
            "status": item.status,
            "created_at": item.created_at
        })
    for item in coll:
        type_str = "Vựa ve chai / Scrap Yard" if item.collector_type == "scrap_yard" else "Cá nhân / Individual"
        feed.append({
            "id": item.id,
            "type": "collection",
            "title": decrypt_field(item.name),
            "subtitle": f"Collection Registration ({type_str})",
            "email": decrypt_field(item.email),
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
    db: Session = Depends(get_db),
    admin_user: dict = Depends(get_current_admin)
):
    query = db.query(models.EPRPartner)
    if status:
        query = query.filter(models.EPRPartner.status == status)
    records = query.order_by(models.EPRPartner.created_at.desc()).all()
    
    decrypted = []
    for item in records:
        decrypted.append({
            "id": item.id,
            "company_name": decrypt_field(item.company_name),
            "contact_name": decrypt_field(item.contact_name),
            "email": decrypt_field(item.email),
            "phone": decrypt_field(item.phone),
            "annual_plastic_waste": item.annual_plastic_waste,
            "needs_epr_cert": item.needs_epr_cert,
            "status": item.status,
            "created_at": item.created_at
        })
        
    if search:
        s = search.lower()
        decrypted = [
            r for r in decrypted
            if s in r["company_name"].lower() or 
               s in r["contact_name"].lower() or 
               s in r["email"].lower()
        ]
    return decrypted

@app.get(
    f"{settings.API_V1_STR}/admin/green-projects",
    response_model=List[schemas.GreenProjectResponse],
    status_code=status.HTTP_200_OK,
    summary="List, search and filter green construction projects"
)
def list_green_projects(
    search: str = None, 
    status: str = None, 
    db: Session = Depends(get_db),
    admin_user: dict = Depends(get_current_admin)
):
    query = db.query(models.GreenProject)
    if status:
        query = query.filter(models.GreenProject.status == status)
    records = query.order_by(models.GreenProject.created_at.desc()).all()
    
    decrypted = []
    for item in records:
        decrypted.append({
            "id": item.id,
            "contact_name": decrypt_field(item.contact_name),
            "email": decrypt_field(item.email),
            "phone": decrypt_field(item.phone),
            "surface_area": item.surface_area,
            "location": decrypt_field(item.location),
            "ventilation_consult": item.ventilation_consult,
            "status": item.status,
            "created_at": item.created_at
        })
        
    if search:
        s = search.lower()
        decrypted = [
            r for r in decrypted
            if s in r["contact_name"].lower() or 
               s in r["email"].lower() or 
               s in r["location"].lower()
        ]
    return decrypted

@app.get(
    f"{settings.API_V1_STR}/admin/collectors",
    response_model=List[schemas.CollectorResponse],
    status_code=status.HTTP_200_OK,
    summary="List, search and filter waste material collectors"
)
def list_collectors(
    search: str = None, 
    status: str = None, 
    db: Session = Depends(get_db),
    admin_user: dict = Depends(get_current_admin)
):
    query = db.query(models.Collector)
    if status:
        query = query.filter(models.Collector.status == status)
    records = query.order_by(models.Collector.created_at.desc()).all()
    
    decrypted = []
    for item in records:
        decrypted.append({
            "id": item.id,
            "name": decrypt_field(item.name),
            "email": decrypt_field(item.email),
            "phone": decrypt_field(item.phone),
            "collector_type": item.collector_type,
            "address": decrypt_field(item.address) if item.address else None,
            "status": item.status,
            "created_at": item.created_at
        })
        
    if search:
        s = search.lower()
        decrypted = [
            r for r in decrypted
            if s in r["name"].lower() or 
               s in r["email"].lower() or 
               (r["address"] and s in r["address"].lower())
        ]
    return decrypted

@app.put(
    f"{settings.API_V1_STR}/admin/bulk-status",
    status_code=status.HTTP_200_OK,
    summary="Bulk update statuses of selected pipeline records"
)
def bulk_update_status(
    req: schemas.BulkStatusUpdateRequest, 
    db: Session = Depends(get_db),
    admin_user: dict = Depends(get_current_admin)
):
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
def admin_send_email(
    req: schemas.AdminSendEmailRequest, 
    db: Session = Depends(get_db),
    admin_user: dict = Depends(get_current_admin)
):
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

    email_plain = decrypt_field(item.email)
    name_plain = decrypt_field(name)

    # Local Mock Email Log writing (matches existing confirmation email logger pattern)
    os.makedirs("mock_emails", exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = f"mock_emails/admin_sent_{req.type}_{req.id}_{timestamp}.txt"
    
    full_text = f"""Subject: {req.subject}
To: {email_plain}
Sent Time: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
============================================================
Dear {name_plain},

{req.email_content}
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(full_text)
        
    # Transition status to Replied
    item.status = "Replied"
    db.commit()
    
    return {"message": f"Email successfully sent and status updated to Replied for {email_plain}"}
