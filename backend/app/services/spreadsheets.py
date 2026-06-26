import os
import csv
import threading
from datetime import datetime

# Thread lock to prevent concurrent write issues across requests
file_write_lock = threading.Lock()

# Check if running under pytest
IS_TESTING = "PYTEST_CURRENT_TEST" in os.environ

# Define spreadsheet file paths in the backend directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

if IS_TESTING:
    EPR_PARTNERS_FILE = os.path.join(BASE_DIR, "test_epr_partners.csv")
    GREEN_PROJECTS_FILE = os.path.join(BASE_DIR, "test_green_projects.csv")
    COLLECTORS_FILE = os.path.join(BASE_DIR, "test_collectors.csv")
else:
    EPR_PARTNERS_FILE = os.path.join(BASE_DIR, "epr_partners.csv")
    GREEN_PROJECTS_FILE = os.path.join(BASE_DIR, "green_projects.csv")
    COLLECTORS_FILE = os.path.join(BASE_DIR, "collectors.csv")

def get_next_csv_id(file_path: str) -> int:
    """
    Reads the CSV file to find the last sequential ID, and returns the next ID (starting at 1).
    Ensures spreadsheet row numbers are perfectly sequential and independent of database resets.
    """
    if not os.path.exists(file_path):
        return 1
    try:
        with open(file_path, mode="r", encoding="utf-8-sig") as f:
            reader = list(csv.reader(f))
            if len(reader) <= 1:  # Only headers exist
                return 1
            last_row = reader[-1]
            if last_row and last_row[0].isdigit():
                return int(last_row[0]) + 1
    except Exception:
        pass
    return 1

def init_csv_file(file_path: str, headers: list):
    """
    Initializes the CSV file with headers and UTF-8 BOM if the file does not exist.
    'utf-8-sig' ensures Excel opens Vietnamese characters properly without format import dialogs.
    """
    if not os.path.exists(file_path):
        with open(file_path, mode="w", encoding="utf-8-sig", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(headers)

def append_to_csv(file_path: str, headers: list, row_generator_fn) -> int:
    """
    Appends a row to the CSV file safely using a thread lock.
    Uses a generator function/callback that accepts the computed next ID 
    so that ID computation is guaranteed thread-safe.
    """
    with file_write_lock:
        init_csv_file(file_path, headers)
        next_id = get_next_csv_id(file_path)
        row_data = row_generator_fn(next_id)
        with open(file_path, mode="a", encoding="utf-8-sig", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(row_data)
        return next_id

def log_epr_partner_registration(
    id_val: int,  # database ID
    company_name: str, 
    contact_name: str, 
    email: str, 
    phone: str, 
    annual_plastic_waste: float, 
    needs_epr_cert: bool, 
    created_at: datetime
):
    headers = [
        "Mã đăng ký (ID)",
        "Mã cơ sở dữ liệu (DB ID)",
        "Tên công ty / Tập đoàn (Company Name)",
        "Họ tên người liên hệ (Contact Name)",
        "Email",
        "Số điện thoại (Phone)",
        "Sản lượng rác thải nhựa hàng năm - kg (Annual Waste)",
        "Yêu cầu ký kết dịch vụ EPR (Needs EPR Certificate)",
        "Thời gian đăng ký (Created At)"
    ]
    
    def generate_row(next_id):
        return [
            next_id,
            id_val,
            company_name,
            contact_name,
            email,
            phone,
            annual_plastic_waste,
            "Có (Yes)" if needs_epr_cert else "Không (No)",
            created_at.strftime("%Y-%m-%d %H:%M:%S")
        ]
        
    append_to_csv(EPR_PARTNERS_FILE, headers, generate_row)

def log_green_project_registration(
    id_val: int,  # database ID
    contact_name: str, 
    email: str, 
    phone: str, 
    surface_area: float, 
    location: str, 
    ventilation_consult: bool, 
    created_at: datetime
):
    headers = [
        "Mã đăng ký (ID)",
        "Mã cơ sở dữ liệu (DB ID)",
        "Họ tên chủ đầu tư / KTS (Contact Name)",
        "Email",
        "Số điện thoại (Phone)",
        "Diện tích bề mặt lắp đặt - m2 (Surface Area)",
        "Địa điểm thi công (Location)",
        "Tư vấn thiết kế thông gió & cách nhiệt (Ventilation Consult)",
        "Thời gian đăng ký (Created At)"
    ]
    
    def generate_row(next_id):
        return [
            next_id,
            id_val,
            contact_name,
            email,
            phone,
            surface_area,
            location,
            "Có (Yes)" if ventilation_consult else "Không (No)",
            created_at.strftime("%Y-%m-%d %H:%M:%S")
        ]
        
    append_to_csv(GREEN_PROJECTS_FILE, headers, generate_row)

def log_collector_registration(
    id_val: int,  # database ID
    name: str, 
    email: str, 
    phone: str, 
    collector_type: str, 
    address: str, 
    created_at: datetime
):
    headers = [
        "Mã đăng ký (ID)",
        "Mã cơ sở dữ liệu (DB ID)",
        "Tên vựa / Họ tên (Name)",
        "Email",
        "Số điện thoại (Phone)",
        "Hình thức thu gom (Collector Type)",
        "Địa chỉ điểm gom hàng (Address)",
        "Thời gian đăng ký (Created At)"
    ]
    
    def generate_row(next_id):
        type_label = "Vựa ve chai (Scrap Yard)" if collector_type == "scrap_yard" else "Cá nhân (Individual)"
        return [
            next_id,
            id_val,
            name,
            email,
            phone,
            type_label,
            address or "Không cung cấp (Not provided)",
            created_at.strftime("%Y-%m-%d %H:%M:%S")
        ]
        
    append_to_csv(COLLECTORS_FILE, headers, generate_row)
