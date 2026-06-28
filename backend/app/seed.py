import datetime
import os
import sys

# Add parent directory to path so app can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base, SessionLocal
import app.models as models

def seed_database():
    print("Resetting database...")
    # Drop and recreate all tables to apply the status column
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Seeding EPR Partners...")
        epr_partners = [
            models.EPRPartner(
                company_name="Vinamilk Vietnam",
                contact_name="Nguyễn Văn An",
                email="an.nguyen@vinamilk.com.vn",
                phone="0901234567",
                annual_plastic_waste=12500.0,
                needs_epr_cert=True,
                status="Replied",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=10)
            ),
            models.EPRPartner(
                company_name="Unilever Vietnam",
                contact_name="Trần Thị Bình",
                email="binh.tran@unilever.com",
                phone="0908889999",
                annual_plastic_waste=45000.0,
                needs_epr_cert=True,
                status="Pending",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=5)
            ),
            models.EPRPartner(
                company_name="TH True Milk",
                contact_name="Lê Hoàng Giang",
                email="giang.lh@thmilk.vn",
                phone="0912345678",
                annual_plastic_waste=28000.0,
                needs_epr_cert=False,
                status="Starting",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
            ),
            models.EPRPartner(
                company_name="Coca-Cola Vietnam",
                contact_name="Phạm Minh Châu",
                email="chau.pham@coca-cola.com.vn",
                phone="0933445566",
                annual_plastic_waste=85000.0,
                needs_epr_cert=True,
                status="Pending",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=18)
            ),
            models.EPRPartner(
                company_name="Masan Group",
                contact_name="Nguyễn Thu Thảo",
                email="thao.nt@masangroup.com",
                phone="0955667788",
                annual_plastic_waste=32000.0,
                needs_epr_cert=True,
                status="Replied",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=12)
            ),
            models.EPRPartner(
                company_name="Nestlé Vietnam",
                contact_name="Vũ Huy Phong",
                email="phong.vu@nestle.vn",
                phone="0977889900",
                annual_plastic_waste=55000.0,
                needs_epr_cert=True,
                status="Starting",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=4)
            )
        ]
        db.add_all(epr_partners)

        print("Seeding Green Projects...")
        green_projects = [
            models.GreenProject(
                contact_name="Kiến trúc sư Trịnh Cổ",
                email="co.trinh@greenstudio.vn",
                phone="0907777777",
                surface_area=450.0,
                location="Bình Thạnh, TP. Hồ Chí Minh",
                ventilation_consult=True,
                status="Replied",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=8)
            ),
            models.GreenProject(
                contact_name="Hoàng Minh Tuấn",
                email="tuanhm@ecopark.vn",
                phone="0918888888",
                surface_area=320.0,
                location="Khu đô thị EcoPark, Hưng Yên",
                ventilation_consult=True,
                status="Pending",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=4)
            ),
            models.GreenProject(
                contact_name="Đặng Thị Mai",
                email="mai.dang@sala.vn",
                phone="0929999999",
                surface_area=180.0,
                location="Khu đô thị Sala, Quận 2, TP.HCM",
                ventilation_consult=False,
                status="Starting",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
            ),
            models.GreenProject(
                contact_name="Ngô Quốc Bảo",
                email="bao.ngo@resortdesign.com",
                phone="0935555555",
                surface_area=1200.0,
                location="Ngũ Hành Sơn, Đà Nẵng",
                ventilation_consult=True,
                status="Replied",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=15)
            ),
            models.GreenProject(
                contact_name="Nguyễn Xuân Tiến",
                email="tiennx@dalatdesign.vn",
                phone="0947778888",
                surface_area=250.0,
                location="Đường Trần Hưng Đạo, Đà Lạt",
                ventilation_consult=False,
                status="Pending",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=12)
            )
        ]
        db.add_all(green_projects)

        print("Seeding Collectors...")
        collectors = [
            models.Collector(
                name="Vựa Ve Chai Bà Mười",
                email="muoi.vechai@gmail.com",
                phone="0988776655",
                collector_type="scrap_yard",
                address="123 Lê Hồng Phong, Quận 5, TP.HCM",
                status="Replied",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=14)
            ),
            models.Collector(
                name="Trần Văn Hùng",
                email="hungtran@gmail.com",
                phone="0911223344",
                collector_type="individual",
                address="Xã Phong Phú, Bình Chánh, TP.HCM",
                status="Pending",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=3)
            ),
            models.Collector(
                name="Vựa Phế Liệu Minh Phát",
                email="phat.minh@gmail.com",
                phone="0933221100",
                collector_type="scrap_yard",
                address="456 Quốc Lộ 1A, Linh Trung, Thủ Đức, TP.HCM",
                status="Starting",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
            ),
            models.Collector(
                name="Nguyễn Thị Hoa",
                email="hoanguyen@gmail.com",
                phone="0977665544",
                collector_type="individual",
                address="Phường Tân Chánh Hiệp, Quận 12, TP.HCM",
                status="Pending",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=6)
            ),
            models.Collector(
                name="Vựa Tái Chế Thuận Phát",
                email="thuanphat@gmail.com",
                phone="0944332211",
                collector_type="scrap_yard",
                address="789 Nguyễn Văn Linh, Quận 7, TP.HCM",
                status="Replied",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=20)
            )
        ]
        db.add_all(collectors)
        
        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Failed to seed database: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
