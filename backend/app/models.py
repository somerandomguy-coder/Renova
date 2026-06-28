import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from app.database import Base

class EPRPartner(Base):
    __tablename__ = "epr_partners"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    contact_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    annual_plastic_waste = Column(Float, nullable=False)  # in kg
    needs_epr_cert = Column(Boolean, default=True)  # Nhu cầu lấy chứng nhận EPR
    status = Column(String, default="Starting", nullable=False)  # "Starting", "Pending", "Replied"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class GreenProject(Base):
    __tablename__ = "green_projects"

    id = Column(Integer, primary_key=True, index=True)
    contact_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    surface_area = Column(Float, nullable=False)  # in m2 (Diện tích bề mặt)
    location = Column(String, nullable=False)  # Địa điểm thi công
    ventilation_consult = Column(Boolean, default=True)  # Mong muốn tư vấn thiết kế thông gió
    status = Column(String, default="Starting", nullable=False)  # "Starting", "Pending", "Replied"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Collector(Base):
    __tablename__ = "collectors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # Vựa ve chai hoặc cá nhân
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    collector_type = Column(String, nullable=False)  # "scrap_yard" or "individual"
    address = Column(String, nullable=True)  # Địa chỉ thu gom
    status = Column(String, default="Starting", nullable=False)  # "Starting", "Pending", "Replied"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
