import os
import csv
import threading
from datetime import datetime

# Thread lock to prevent concurrent write issues across requests
file_write_lock = threading.Lock()

# Define spreadsheet file paths in the backend directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EPR_PARTNERS_FILE = os.path.join(BASE_DIR, "epr_partners.csv")
GREEN_PROJECTS_FILE = os.path.join(BASE_DIR, "green_projects.csv")
COLLECTORS_FILE = os.path.join(BASE_DIR, "collectors.csv")

def init_csv_file(file_path: str, headers: list):
    """
    Initializes the CSV file with headers and UTF-8 BOM if the file does not exist.
    'utf-8-sig' ensures Excel opens Vietnamese characters properly without format import dialogs.
    """
    if not os.path.exists(file_path):
        with open(file_path, mode="w", encoding="utf-8-sig", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(headers)

def append_to_csv(file_path: str, headers: list, row_data: list):
    """
    Appends a row to the CSV file safely using a thread lock.
    """
    with file_write_lock:
        init_csv_file(file_path, headers)
        with open(file_path, mode="a", encoding="utf-8-sig", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(row_data)

def log_epr_partner_registration(
    id_val: int, 
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
        "Tên công ty / Tập đoàn (Company Name)",
        "Họ tên người liên hệ (Contact Name)",
        "Email",
        "Số điện thoại (Phone)",
        "Sản lượng rác thải nhựa hàng năm - kg (Annual Waste)",
        "Yêu cầu ký kết dịch vụ EPR (Needs EPR Certificate)",
        "Thời gian đăng ký (Created At)"
    ]
    row = [
        id_val,
        company_name,
        contact_name,
        email,
        phone,
        annual_plastic_waste,
        "Có (Yes)" if needs_epr_cert else "Không (No)",
        created_at.strftime("%Y-%m-%d %H:%M:%S")
    ]
    append_to_csv(EPR_PARTNERS_FILE, headers, row)

def log_green_project_registration(
    id_val: int, 
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
        "Họ tên chủ đầu tư / KTS (Contact Name)",
        "Email",
        "Số điện thoại (Phone)",
        "Diện tích bề mặt lắp đặt - m2 (Surface Area)",
        "Địa điểm thi công (Location)",
        "Tư vấn thiết kế thông gió & cách nhiệt (Ventilation Consult)",
        "Thời gian đăng ký (Created At)"
    ]
    row = [
        id_val,
        contact_name,
        email,
        phone,
        surface_area,
        location,
        "Có (Yes)" if ventilation_consult else "Không (No)",
        created_at.strftime("%Y-%m-%d %H:%M:%S")
    ]
    append_to_csv(GREEN_PROJECTS_FILE, headers, row)

def log_collector_registration(
    id_val: int, 
    name: str, 
    email: str, 
    phone: str, 
    collector_type: str, 
    address: str, 
    created_at: datetime
):
    headers = [
        "Mã đăng ký (ID)",
        "Tên vựa / Họ tên (Name)",
        "Email",
        "Số điện thoại (Phone)",
        "Hình thức thu gom (Collector Type)",
        "Địa chỉ điểm gom hàng (Address)",
        "Thời gian đăng ký (Created At)"
    ]
    type_label = "Vựa ve chai (Scrap Yard)" if collector_type == "scrap_yard" else "Cá nhân (Individual)"
    row = [
        id_val,
        name,
        email,
        phone,
        type_label,
        address or "Không cung cấp (Not provided)",
        created_at.strftime("%Y-%m-%d %H:%M:%S")
    ]
    append_to_csv(COLLECTORS_FILE, headers, row)
