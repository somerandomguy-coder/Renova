from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime

# --- FORM SCHEMAS ---

class EPRPartnerCreate(BaseModel):
    company_name: str = Field(..., min_length=2, example="FMCG Global")
    contact_name: str = Field(..., min_length=2, example="Nguyễn Văn A")
    email: EmailStr = Field(..., example="partner@fmcg.com")
    phone: str = Field(..., min_length=8, example="0901234567")
    annual_plastic_waste: float = Field(..., gt=0, description="Sản lượng rác thải nhựa phát sinh hàng năm (kg)")
    needs_epr_cert: bool = Field(True, description="Nhu cầu lấy chứng nhận EPR")

class EPRPartnerResponse(EPRPartnerCreate):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class GreenProjectCreate(BaseModel):
    contact_name: str = Field(..., min_length=2, example="Kiến trúc sư Trần")
    email: EmailStr = Field(..., example="architect@greenstudio.vn")
    phone: str = Field(..., min_length=8, example="0918765432")
    surface_area: float = Field(..., gt=0, description="Diện tích bề mặt cần lắp đặt (m2)")
    location: str = Field(..., min_length=2, example="Quận 2, TP. Hồ Chí Minh")
    ventilation_consult: bool = Field(True, description="Mong muốn tư vấn thiết kế thông gió")

class GreenProjectResponse(GreenProjectCreate):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class CollectorCreate(BaseModel):
    name: str = Field(..., min_length=2, description="Tên vựa ve chai hoặc cá nhân")
    email: EmailStr = Field(..., example="vechai.quan5@gmail.com")
    phone: str = Field(..., min_length=8, example="0988776655")
    collector_type: str = Field(..., description="Loại hình: 'scrap_yard' hoặc 'individual'")
    address: Optional[str] = Field(None, example="123 Hùng Vương, Quận 5, TP.HCM")

class CollectorResponse(CollectorCreate):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- CALCULATOR SCHEMAS ---

class ESGCalcRequest(BaseModel):
    num_bricks: int = Field(..., gt=0, description="Số lượng gạch")
    plastic_ratio: float = Field(50.0, ge=0, le=100, description="Tỷ lệ % nhựa MLP (default 50%)")
    husk_ratio: float = Field(50.0, ge=0, le=100, description="Tỷ lệ % vỏ trấu (default 50%)")

class ESGCalcResponse(BaseModel):
    mlp_rescued_kg: float = Field(..., description="Khối lượng nhựa MLP giải cứu (kg)")
    husk_consumed_kg: float = Field(..., description="Khối lượng vỏ trấu tiêu thụ (kg)")
    co2_reduced_kg: float = Field(..., description="Lượng CO2 cắt giảm (kg)")
    trees_equivalent: float = Field(..., description="Tương đương số cây xanh hấp thụ CO2 trong 1 năm")


class EPRCashflowRequest(BaseModel):
    packaging_volume_kg: float = Field(..., gt=0, description="Khối lượng bao bì MLP thải ra thị trường (kg/năm)")
    brick_price_vnd: float = Field(45000.0, gt=0, description="Giá bán gạch RENOVA dự kiến (VND/viên)")

class EPRCashflowResponse(BaseModel):
    packaging_volume_kg: float
    standard_epr_fee_vnd: float = Field(..., description="Nghĩa vụ đóng quỹ EPR tiêu chuẩn (VND)")
    optimized_epr_fee_vnd: float = Field(..., description="Nghĩa vụ đóng quỹ EPR sau tối ưu hóa (VND)")
    epr_savings_vnd: float = Field(..., description="Số tiền tiết kiệm từ nghĩa vụ EPR (VND)")
    
    # RENOVA Purchase dynamic analysis
    renova_bricks_needed: int = Field(..., description="Số lượng gạch RENOVA cần mua để offset hoàn toàn lượng nhựa")
    total_brick_cost_vnd: float = Field(..., description="Tổng chi phí mua gạch RENOVA (VND)")
    net_cost_after_epr_offset_vnd: float = Field(..., description="Chi phí thực tế sau khi bù trừ khấu hao EPR (VND)")
    net_savings_percentage: float = Field(..., description="Phần trăm tiết kiệm được nhờ bù trừ")


# --- ADMIN SCHEMAS ---

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class AdminLoginResponse(BaseModel):
    token: str
    username: str
    success: bool

class BulkStatusUpdateRequest(BaseModel):
    type: str  # "epr", "architecture", "collection"
    ids: List[int]
    status: str  # "Starting", "Pending", "Replied"

class AdminSendEmailRequest(BaseModel):
    type: str  # "epr", "architecture", "collection"
    id: int
    email_content: str
    subject: str

class GlobalActivityItem(BaseModel):
    id: int
    type: str  # "epr", "architecture", "collection"
    title: str
    subtitle: str
    email: str
    status: str
    created_at: datetime

class OverviewStatsResponse(BaseModel):
    total_records: int
    total_pending: int
    total_success: int
    epr_stats: Dict[str, int]
    architecture_stats: Dict[str, int]
    collection_stats: Dict[str, int]
