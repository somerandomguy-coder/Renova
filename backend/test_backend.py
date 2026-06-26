import os
import shutil
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config import settings
from app.database import Base, get_db
from app.main import app

# Set up test database (SQLite in memory or separate file)
TEST_DATABASE_URL = "sqlite:///./test_renova.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override get_db dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables
    Base.metadata.drop_all(bind=engine)
    # Dispose of engine to release file locks on Windows
    engine.dispose()
    # Clean up test files
    if os.path.exists("test_renova.db"):
        try:
            os.remove("test_renova.db")
        except Exception:
            pass
    if os.path.exists("mock_emails"):
        # We can keep it or delete it. Let's keep it but remove test email logs if needed
        pass

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "database": "connected"}

def test_esg_calculator():
    payload = {
        "num_bricks": 1000,
        "plastic_ratio": 50.0,
        "husk_ratio": 50.0
    }
    response = client.post("/api/v1/calculate/esg", json=payload)
    assert response.status_code == 200
    data = response.json()
    # 1000 bricks * 50% * 1.5 = 750kg plastic, 750kg husk
    assert data["mlp_rescued_kg"] == 750.0
    assert data["husk_consumed_kg"] == 750.0
    # co2 = 750 * 1.95 + 750 * 1.20 = 1462.5 + 900 = 2362.5
    assert data["co2_reduced_kg"] == 2362.5
    assert data["trees_equivalent"] == round(2362.5 / 22.0, 1)

def test_epr_calculator():
    payload = {
        "packaging_volume_kg": 1000,
        "brick_price_vnd": 40000
    }
    response = client.post("/api/v1/calculate/epr", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["standard_epr_fee_vnd"] == 1000 * 15000.0
    assert data["optimized_epr_fee_vnd"] == (1000 * 15000.0) * 0.60
    assert data["renova_bricks_needed"] == pytest.approx(1334, rel=1) # 1000 / 0.75 = 1333.33 -> ceil is 1334

def test_register_epr_partner():
    payload = {
        "company_name": "Test Company",
        "contact_name": "Test Contact",
        "email": "test@company.com",
        "phone": "0987654321",
        "annual_plastic_waste": 1500.0,
        "needs_epr_cert": True
    }
    response = client.post("/api/v1/register/epr-partner", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["company_name"] == "Test Company"
    
    # Confirm email log is generated
    assert len(os.listdir("mock_emails")) > 0

def test_register_green_project():
    payload = {
        "contact_name": "Architect Test",
        "email": "arch@test.com",
        "phone": "0912345678",
        "surface_area": 120.0,
        "location": "Hanoi, Vietnam",
        "ventilation_consult": True
    }
    response = client.post("/api/v1/register/green-project", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["surface_area"] == 120.0

def test_register_collector():
    payload = {
        "name": "Scrap Yard A",
        "email": "scrappy@test.com",
        "phone": "0988888888",
        "collector_type": "scrap_yard",
        "address": "456 District 5, HCMC"
    }
    response = client.post("/api/v1/register/collector", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["collector_type"] == "scrap_yard"
