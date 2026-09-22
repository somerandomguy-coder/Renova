# TÀI LIỆU BÀN GIAO DỰ ÁN RENOVA (HANDOVER HUB)
### *(Phiên bản Nhánh: `client-release` — Tối ưu triển khai trên Render.com & DeepSeek AI)*

Chào mừng bạn đến với bộ tài liệu bàn giao hệ thống RENOVA! Để thuận tiện nhất cho việc theo dõi, tài liệu bàn giao đã được chia thành **2 phiên bản riêng biệt** tương ứng với từng đối tượng:

---

### 📌 1. BẢN DÀNH CHO CHỦ DOANH NGHIỆP / QUẢN LÝ (NON-TECH)
👉 **Mở tài liệu tại đây:** [`HANDOVER_BUSINESS.md`](file:///c:/Users/Nam/Projects/Web%20Development%20(On-going)/Renova/HANDOVER_BUSINESS.md)

* **Nội dung trọng tâm:**
  * Toàn bộ website và dữ liệu đang được đặt ở đâu?
  * Chi phí vận hành máy chủ và trí tuệ nhân tạo (AI) hàng tháng (chỉ khoảng vài USD).
  * Khách hàng điền form liên hệ thì dữ liệu chạy về đâu (xem ngay trên Google Sheets điện thoại hoặc file Excel).
  * Hướng dẫn 2 bước đơn giản khi công ty có thông tin mới (đổi giá, thêm giải thưởng, thêm sản phẩm).
  * Danh sách 5 tài khoản quan trọng chủ doanh nghiệp cần nắm giữ.
* **Đặc điểm:** Không dùng thuật ngữ lập trình khó hiểu, trình bày ngắn gọn, trực quan, tập trung vào mục đích kinh doanh.

---

### ⚙️ 2. BẢN DÀNH CHO ĐỘI NGŨ KỸ THUẬT / LẬP TRÌNH VIÊN (TECHNICAL)
👉 **Mở tài liệu tại đây:** [`HANDOVER_TECHNICAL.md`](file:///c:/Users/Nam/Projects/Web%20Development%20(On-going)/Renova/HANDOVER_TECHNICAL.md)

* **Nội dung trọng tâm:**
  * Sơ đồ kiến trúc hệ thống (Next.js App Router, FastAPI, SQLite, ChromaDB, DeepSeek API).
  * Cấu trúc cây thư mục và vai trò của từng file.
  * Danh mục biến môi trường `.env` tối giản (Zero-Config Defaults).
  * Hướng dẫn chi tiết cách ChromaDB hoạt động, lệnh Re-index dữ liệu: `python -m ai.rag.ingest`.
  * Hướng dẫn triển khai 1-click lên Render.com qua file `render.yaml` (có gắn Ổ đĩa Persistent Disk 1GB cho ChromaDB).
  * Code mẫu Google Apps Script để nhận dữ liệu Webhook từ form đăng ký về Google Sheets.
  * Các lệnh chạy và kiểm thử Local (`uvicorn`, `npm run dev`, `npm run build`).

---

### 🚀 BẮT ĐẦU NHANH:
* Nếu bạn là **Chủ doanh nghiệp**: Đọc [`HANDOVER_BUSINESS.md`](file:///c:/Users/Nam/Projects/Web%20Development%20(On-going)/Renova/HANDOVER_BUSINESS.md).
* Nếu bạn là **Lập trình viên / IT phụ trách triển khai**: Đọc [`HANDOVER_TECHNICAL.md`](file:///c:/Users/Nam/Projects/Web%20Development%20(On-going)/Renova/HANDOVER_TECHNICAL.md).
