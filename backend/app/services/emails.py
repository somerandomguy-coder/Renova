import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

def send_bilingual_confirmation_email(to_email: str, recipient_name: str, form_type: str, form_data: dict):
    """
    Sends a bilingual (VI/EN) confirmation email to a registering partner.
    Falls back to writing a local file if settings.USE_MOCK_EMAIL is True or SMTP is unconfigured.
    """
    
    # Define templates based on form type
    if form_type == "epr_partner":
        subject = "RENOVA: Xác nhận Đăng ký Tư vấn Đối tác EPR / EPR Partnership Consultation Confirmation"
        body_vi = f"""
        Chào {recipient_name},
        
        Cảm ơn công ty {form_data.get('company_name')} đã đăng ký tư vấn giải pháp xử lý rác thải nhựa EPR cùng RENOVA.
        
        Chúng tôi đã ghi nhận các thông tin sau:
        - Tên công ty: {form_data.get('company_name')}
        - Sản lượng rác thải nhựa phát sinh hàng năm: {form_data.get('annual_plastic_waste')} kg
        - Nhu cầu ký kết chứng nhận EPR: {"Có" if form_data.get('needs_epr_cert') else "Không"}
        
        Đội ngũ RENOVA sẽ liên hệ với bạn trong vòng 24-48 giờ làm việc để trao đổi về quy trình thu gom, tái chế và cấp chứng chỉ ESG/EPR điện tử.
        
        Trân trọng,
        Đội ngũ RENOVA Circular.
        """
        body_en = f"""
        Dear {recipient_name},
        
        Thank you, {form_data.get('company_name')}, for registering for the EPR plastic waste solution consultation with RENOVA.
        
        We have recorded the following details:
        - Company Name: {form_data.get('company_name')}
        - Annual Plastic Waste Generated: {form_data.get('annual_plastic_waste')} kg
        - Need for EPR certification: {"Yes" if form_data.get('needs_epr_cert') else "No"}
        
        The RENOVA team will contact you within 24-48 business hours to discuss the collection, recycling process, and the issuance of your digital ESG/EPR certificate.
        
        Best regards,
        The RENOVA Circular Team.
        """
        
    elif form_type == "green_project":
        subject = "RENOVA: Xác nhận Đăng ký Tư vấn Công trình Xanh / Green Project Design Consultation Confirmation"
        body_vi = f"""
        Chào {recipient_name},
        
        Cảm ơn bạn đã đăng ký tư vấn giải pháp gạch bông gió di sản RENOVA cho công trình xanh của mình.
        
        Chúng tôi đã ghi nhận các thông tin sau:
        - Diện tích bề mặt lắp đặt: {form_data.get('surface_area')} m²
        - Địa điểm thi công: {form_data.get('location')}
        - Yêu cầu tư vấn thiết kế thông gió: {"Có" if form_data.get('ventilation_consult') else "Không"}
        
        Đội ngũ kỹ thuật của RENOVA sẽ liên hệ để gửi các phương án thiết kế thông gió thụ động và cách nhiệt phù hợp nhất với dự án của bạn.
        
        Trân trọng,
        Đội ngũ RENOVA Circular.
        """
        body_en = f"""
        Dear {recipient_name},
        
        Thank you for requesting a consultation on RENOVA's heritage breeze block solutions for your green project.
        
        We have recorded the following details:
        - Surface Area for Installation: {form_data.get('surface_area')} m²
        - Construction Location: {form_data.get('location')}
        - Passively ventilated design request: {"Yes" if form_data.get('ventilation_consult') else "No"}
        
        RENOVA's engineering team will reach out to provide you with custom passive ventilation and thermal insulation design proposals tailored to your project.
        
        Best regards,
        The RENOVA Circular Team.
        """
        
    else:  # collector
        subject = "RENOVA: Xác nhận Đăng ký Thu gom Nguyên liệu / Raw Material Supplier Registration Confirmation"
        type_str = "Vựa ve chai" if form_data.get('collector_type') == "scrap_yard" else "Cá nhân"
        type_str_en = "Scrap Yard" if form_data.get('collector_type') == "scrap_yard" else "Individual"
        
        body_vi = f"""
        Chào {recipient_name},
        
        Cảm ơn bạn đã đăng ký trở thành đối tác thu gom cung ứng nguyên liệu thô (nhựa đa lớp MLP) cho dự án RENOVA.
        
        Chúng tôi đã ghi nhận các thông tin sau:
        - Hình thức đăng ký: {type_str}
        - Số điện thoại liên lạc: {form_data.get('phone')}
        - Địa chỉ: {form_data.get('address') or 'Không cung cấp'}
        
        Chúng tôi sẽ liên hệ để hướng dẫn phương thức đóng gói, phân loại và lên lịch gom hàng hoặc tiếp nhận tại xưởng RENOVA.
        
        Trân trọng,
        Đội ngũ RENOVA Circular.
        """
        body_en = f"""
        Dear {recipient_name},
        
        Thank you for registering to supply raw materials (multi-layer plastic MLP) to the RENOVA project.
        
        We have recorded the following details:
        - Registration Type: {type_str_en}
        - Contact Phone: {form_data.get('phone')}
        - Address: {form_data.get('address') or 'Not provided'}
        
        We will contact you to explain the packaging and sorting guidelines, and schedule collection or drop-off at the RENOVA workshop.
        
        Best regards,
        The RENOVA Circular Team.
        """

    full_text = f"""Subject: {subject}
To: {to_email}
============================================================
[TIẾNG VIỆT / VIETNAMESE]
{body_vi}
============================================================
[ENGLISH / TIẾNG ANH]
{body_en}
"""

    # Local Mock Email System
    if settings.USE_MOCK_EMAIL or not settings.SMTP_USER:
        mock_dir = "mock_emails"
        os.makedirs(mock_dir, exist_ok=True)
        filename = f"{mock_dir}/email_{form_type}_{datetime_now_str()}.txt"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(full_text)
        print(f"[MOCK EMAIL] Saved confirmation to local file: {filename}")
        return True

    # Real SMTP system
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.EMAIL_FROM
        msg["To"] = to_email
        
        html_content = f"""
        <html>
            <body>
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <div style="border-bottom: 2px solid #059669; padding-bottom: 10px;">
                        <h2 style="color: #059669;">RENOVA Circular</h2>
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <h3 style="color: #0d9488;">[Tiếng Việt]</h3>
                        <p style="white-space: pre-line;">{body_vi}</p>
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;" />
                    
                    <div>
                        <h3 style="color: #0d9488;">[English]</h3>
                        <p style="white-space: pre-line;">{body_en}</p>
                    </div>
                    
                    <div style="margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px;">
                        Email này được gửi tự động từ hệ thống RENOVA. Vui lòng không trả lời trực tiếp email này.
                        <br/>
                        This is an automated email from RENOVA. Please do not reply directly.
                    </div>
                </div>
            </body>
        </html>
        """
        
        part1 = MIMEText(full_text, "plain", "utf-8")
        part2 = MIMEText(html_content, "html", "utf-8")
        msg.attach(part1)
        msg.attach(part2)
        
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.EMAIL_FROM, to_email, msg.as_string())
        
        print(f"[SMTP EMAIL] Successfully sent email to {to_email}")
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send SMTP email: {str(e)}. Falling back to mock save.")
        # Fallback to mock file write on SMTP failure
        mock_dir = "mock_emails"
        os.makedirs(mock_dir, exist_ok=True)
        filename = f"{mock_dir}/email_fallback_{form_type}_{datetime_now_str()}.txt"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(f"--- SMTP FALLBACK DUE TO ERROR: {str(e)} ---\n" + full_text)
        return False

def datetime_now_str() -> str:
    import datetime
    return datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
