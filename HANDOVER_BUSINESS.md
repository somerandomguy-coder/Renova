# HƯỚNG DẪN QUẢN TRỊ & VẬN HÀNH RENOVA
### *(DÀNH CHO CHỦ DOANH NGHIỆP / NON-TECH / BUSINESS OWNER)*

> **Tài liệu này viết riêng cho các nhà sáng lập, quản lý và nhân sự vận hành không chuyên về lập trình.** Tài liệu giải thích website hoạt động như thế nào, chi phí hàng tháng, dữ liệu khách hàng nằm ở đâu và cách cập nhật thông tin khi doanh nghiệp có thay đổi.

---

## 1. HỆ THỐNG WEBSITE & AI CỦA BẠN HOẠT ĐỘNG NHƯ THẾ NÀO?

Nền tảng RENOVA gồm 3 phần chính gắn liền với hoạt động kinh doanh:
1. **Trang web giới thiệu & Tính toán (Frontend):** Khách hàng truy cập để xem sản phẩm, thử tính toán số lượng gạch, diện tích tường, lượng rác thải nhựa được cứu và chi phí EPR được tối ưu.
2. **Trợ lý AI tư vấn tự động (RENOVA AI Chatbot):** Đóng vai trò như một chuyên viên tư vấn 24/7. Trợ lý này **chỉ trả lời dựa trên đúng tài liệu thật của RENOVA**, không bịa đặt và hỗ trợ cả tiếng Việt lẫn tiếng Anh.
3. **Bộ thu thập thông tin khách hàng:** Khi đối tác EPR, kiến trúc sư hoặc các vựa ve chai điền form liên hệ, thông tin sẽ được lưu lại để đội ngũ kinh doanh chăm sóc.

---

## 2. WEBSITE VÀ DỮ LIỆU ĐANG ĐƯỢC ĐẶT Ở ĐÂU?

Toàn bộ hệ thống được gom về **1 nền tảng duy nhất** để bạn dễ quản lý tài khoản và thanh toán:

| Hạng mục | Đặt ở đâu? | Chi phí ước tính | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Máy chủ Web & AI** | **Render.com** | ~7 - 14 USD/tháng | Nơi chạy toàn bộ website, máy tính ESG và trợ lý AI. Có sẵn chứng chỉ bảo mật HTTPS (ổ khóa xanh). |
| **Trí tuệ nhân tạo (AI)** | **DeepSeek API** | ~1 - 3 USD/tháng | Trí tuệ xử lý ngôn ngữ giúp chatbot trả lời khách. Chi phí tính theo số lượng câu hỏi thực tế (cực kỳ tiết kiệm). |
| **Dữ liệu đăng ký** | **Google Sheets** hoặc **Excel** | Miễn phí | Dữ liệu khách điền form tự động lưu vào file Excel và có thể đồng bộ về trang tính Google Sheet của bạn. |
| **Tên miền (Domain)** | Nhà cung cấp tên miền của bạn (PA Việt Nam, Mắt Bão, GoDaddy...) | ~200.000 - 350.000 đ/năm | Tên miền thương hiệu của bạn (ví dụ: `renova.vn` hoặc `ecoval.vn`). |

> 💡 **Khuyến nghị cho chủ doanh nghiệp:** Bạn nên tự lập tài khoản Render.com và DeepSeek bằng email công ty, sau đó cài đặt **hạn mức chi tiêu tối đa (Spending Limit) là 5 USD/tháng** trên DeepSeek để hoàn toàn yên tâm về chi phí.

---

## 3. KHÁCH ĐIỀN FORM THÌ THÔNG TIN CHẠY VỀ ĐÂU?

Khi có người gửi thông tin trên website (đăng ký EPR, đăng ký dự án xanh, đăng ký thu gom):
1. **Cách 1: Nhận ngay trên Google Sheets (Khuyên dùng):**
   * Đội ngũ kỹ thuật đã tích hợp sẵn tính năng đồng bộ. Mỗi khi có khách gửi thông tin, một dòng mới chứa ngày giờ, tên công ty, số điện thoại và nhu cầu sẽ **tự động nhảy vào bảng tính Google Sheet của bạn trong 1 giây**.
   * Bạn có thể mở điện thoại xem khách hàng mới mọi lúc, mọi nơi.
2. **Cách 2: File Excel lưu trên máy chủ:**
   * Hệ thống luôn tự động lưu dự phòng vào các file Excel (`epr_partners.csv`, `green_projects.csv`, `collectors.csv`). Nhân sự kỹ thuật có thể tải về gửi cho bạn bất kỳ lúc nào.

---

## 4. KHI DOANH NGHIỆP CÓ THÔNG TIN MỚI, CẬP NHẬT NHƯ THẾ NÀO?

*(Ví dụ: RENOVA đạt giải thưởng mới, đổi giá bán gạch bông gió, cập nhật địa chỉ xưởng hoặc bổ sung câu hỏi thường gặp)*

Toàn bộ kiến thức của Trợ lý AI được lưu trong một file văn bản có tên là **`faq.md`** (nằm trong thư mục `ai/knowledge/`).

### Bạn chỉ cần làm 2 bước:
* **Bước 1: Soạn thảo nội dung:**
  Mở file `ai/knowledge/faq.md` (có thể mở bằng Notepad, Word hoặc trình duyệt trên máy tính). Bạn chỉ cần viết thêm câu hỏi và câu trả lời như một văn bản bình thường:
  ```text
  ### RENOVA vừa đạt giải thưởng gì mới trong năm 2026?
  RENOVA vừa xuất sắc đạt Giải Đặc Biệt cuộc thi Innostar 2026 và Top 10 The NextGen 2026.
  ```
* **Bước 2: Báo nhân sự kỹ thuật chạy cập nhật:**
  Bạn chỉ cần gửi nội dung này cho nhân sự kỹ thuật hoặc IT và nói: *"Anh/em đã sửa file faq.md rồi, nhờ em chạy lệnh nạp lại vào AI giúp anh/chị nhé"*. (Việc này chỉ mất đúng 5 giây của IT).
  Ngay sau đó, khách lên web hỏi câu mới, AI sẽ tự động biết câu trả lời chính xác!

---

## 5. DANH SÁCH TÀI KHOẢN BẠN CẦN NẮM GIỮ (BÀN GIAO CHỦ SỞ HỮU)

Để đảm bảo toàn quyền sở hữu doanh nghiệp của mình, hãy lưu lại các thông tin này:

1. **Tài khoản Render.com:** Quản trị máy chủ, xem trạng thái hoạt động của website.
2. **Tài khoản DeepSeek (platform.deepseek.com):** Nơi nạp tiền (nạp 5$ là dùng được vài tháng) và lấy mã API Key.
3. **Tài khoản quản lý Tên miền (Domain Registrar):** Nơi trỏ tên miền công ty về máy chủ website.
4. **Link Google Sheet nhận khách hàng:** Nơi bạn và đội ngũ bán hàng theo dõi đơn liên hệ mỗi ngày.
5. **Mã nguồn dự án (GitHub / Git Repository):** Lưu trữ toàn bộ mã nguồn của RENOVA trên nhánh **`client-release`**.

---

*Nếu cần nâng cấp tính năng mới hoặc gặp sự cố truy cập, hãy gửi tài liệu **`HANDOVER_TECHNICAL.md`** cho nhân sự lập trình để họ xử lý nhanh nhất.*
