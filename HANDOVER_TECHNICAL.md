# TÀI LIỆU KỸ THUẬT & HƯỚNG DẪN VẬN HÀNH RENOVA
### *(DÀNH CHO ĐỘI NGŨ KỸ THUẬT / DEVELOPER / SYSADMIN)*

> **Nhánh mã nguồn bàn giao:** `client-release`  
> **Kiến trúc:** Next.js (Frontend) + FastAPI Python (Backend) + ChromaDB (Vector DB cục bộ) + DeepSeek AI (LLM RAG)  
> **Nền tảng triển khai:** 1-Platform duy nhất trên **Render.com** (qua file `render.yaml`)

---

## 1. KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

```text
                               ┌────────────────────────────────┐
                               │     Client Browser / Mobile    │
                               └──────────────┬─────────────────┘
                                              │
                                              ▼
                               ┌────────────────────────────────┐
                               │  Frontend Service (Next.js)    │
                               │  - App Router / Tailwind CSS   │
                               │  - Port 3000 / Web Service     │
                               └──────────────┬─────────────────┘
                                              │ REST / SSE Stream
                                              ▼
                               ┌────────────────────────────────┐
                               │   Backend Service (FastAPI)    │
                               │   - REST API (/api/v1)         │
                               │   - Calculators (ESG, EPR)     │
                               │   - SQLite (renova.db) & CSVs  │
                               └───────┬────────────────┬───────┘
                                       │                │
                        Query Semantic │                │ LLM Completion
                                       ▼                ▼
┌──────────────────────────────────────────────┐   ┌───────────────────────────┐
│       ChromaDB Vector Store (Persistent)     │   │      DeepSeek API         │
│  - all-MiniLM-L6-v2 embeddings (local on CPU)│   │  - Model: deepseek-chat   │
│  - Mount path: /.../ai/chroma_db (1GB Disk)  │   │  - Base: api.deepseek.com │
└──────────────────────────────────────────────┘   └───────────────────────────┘
```

### Các quyết định thiết kế cốt lõi trên nhánh `client-release`:
* **Zero-Config Defaults:** Hệ thống tự động gán giá trị mặc định cho toàn bộ biến môi trường; backend chỉ yêu cầu đúng 1 biến bí mật: `DEEPSEEK_API_KEY`.
* **Loại bỏ Admin & Token Auth:** Xóa bỏ route `/admin`, JWT tokens và encryption keys (`JWT_SECRET_KEY`, `ENCRYPTION_KEY`) nhằm loại bỏ hoàn toàn các lỗ hổng bảo mật và sự phụ thuộc vào secret keys.
* **Loại bỏ Langfuse:** Gỡ toàn bộ wrapper/decorator và dependency Langfuse. RAG engine gọi trực tiếp DeepSeek qua thư viện `openai.OpenAI` tiêu chuẩn.
* **Loại bỏ Turso:** Toàn bộ lưu trữ quan hệ sử dụng SQLite cục bộ (`renova.db`), tự động sinh khi chạy lần đầu qua SQLAlchemy.
* **Dual Storage & Webhook:** Biểu mẫu lưu vào SQLite, ghi tiếp vào file CSV (`utf-8-sig` mở Excel không lỗi font) và chuyển tiếp webhook về Google Sheets nếu có cấu hình `GOOGLE_SHEET_WEBHOOK_URL`.

---

## 2. CẤU TRÚC THƯ MỤC CHI TIẾT

```text
Renova/
│
├── render.yaml                 # Bản thiết kế tự động dựng 2 service trên Render.com
├── HANDOVER_BUSINESS.md        # Bản hướng dẫn dành cho chủ doanh nghiệp / non-tech
├── HANDOVER_TECHNICAL.md       # Bản tài liệu kỹ thuật chi tiết này
│
├── frontend/                   # ỨNG DỤNG GIAO DIỆN NGƯỜI DÙNG (Next.js 16)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Trang chủ RENOVA
│   │   │   ├── ai-assistant/   # Trang trợ lý AI chuyên biệt
│   │   │   ├── terms/          # Trang điều khoản dịch vụ
│   │   │   ├── privacy/        # Trang chính sách bảo mật
│   │   │   └── globals.css     # CSS Tokens (Theme Terracotta Clay #914724)
│   │   └── components/         # Các component giao diện (Hero, Calculators, Forms...)
│   ├── package.json            # Node.js dependencies
│   └── .env.example            # Biến môi trường frontend (NEXT_PUBLIC_API_URL)
│
├── backend/                    # MÁY CHỦ DỊCH VỤ API (FastAPI / Python)
│   ├── app/
│   │   ├── main.py             # Điểm khởi chạy FastAPI, cấu hình CORS, endpoints
│   │   ├── config.py           # Quản lý cấu hình toàn hệ thống (Pydantic Settings)
│   │   ├── database.py         # SQLAlchemy engine kết nối SQLite renova.db
│   │   ├── models.py           # ORM Models (EPRPartner, GreenProject, Collector, BrickTakeback)
│   │   ├── schemas.py          # Pydantic Schemas cho request / response validation
│   │   └── services/
│   │       ├── calculators.py  # Thuật toán tính toán ESG & bài toán kinh tế EPR
│   │       ├── spreadsheets.py # Thread-safe CSV logger (UTF-8-BOM cho Excel)
│   │       ├── ai_chat.py      # Tầng dịch vụ chuyển tiếp chat và SSE streaming
│   │       └── emails.py       # Email dispatcher (tự động bypass nếu không có SMTP)
│   ├── renova.db               # File database SQLite cục bộ
│   ├── epr_partners.csv        # Log đăng ký đối tác EPR
│   ├── green_projects.csv      # Log đăng ký dự án công trình xanh
│   ├── collectors.csv          # Log đăng ký mạng lưới ve chai
│   ├── requirements.txt        # Thư viện Python cho backend
│   └── .env.example            # Mẫu biến môi trường backend
│
└── ai/                         # MÔ-ĐUN TRÍ TUỆ NHÂN TẠO RAG
    ├── knowledge/              # THƯ MỤC CHỨA TÀI LIỆU CỦA DOANH NGHIỆP
    │   ├── faq.md              # Câu hỏi thường gặp & giải thưởng của RENOVA
    │   ├── product_specs.md    # Thông số kỹ thuật gạch bông gió
    │   ├── epr_regulations.md  # Quy định EPR và pháp lý môi trường
    │   └── esg_formulas.md     # Công thức quy đổi phát thải CO2, trấu, nhựa
    ├── chroma_db/              # Thư mục lưu trữ vector index của ChromaDB
    ├── rag/
    │   ├── engine.py           # RAG pipeline: Tìm kiếm tài liệu + Gửi prompt đến DeepSeek
    │   ├── vector_store.py     # ChromaDB client, Cosine search, lazy collection init
    │   ├── config.py           # Cấu hình RAG (Model, chunk size, top_k=5)
    │   └── ingest.py           # Script nạp tài liệu markdown vào ChromaDB
    └── requirements.txt        # Dependencies riêng cho AI (openai, chromadb)
```

---

## 3. CẤU HÌNH BIẾN MÔI TRƯỜNG (ENVIRONMENT VARIABLES)

### Backend (`backend/.env` hoặc cấu hình trên Render Environment):
```env
# [BẮT BUỘC] API Key của DeepSeek (Lấy tại https://platform.deepseek.com)
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# [TÙY CHỌN] Webhook nhận dữ liệu form về Google Sheets
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/xxxx/exec

# [TÙY CHỌN] CORS Origins cho phép frontend gọi tới (Mặc định: ["*"])
CORS_ORIGINS=["*"]

# [TÙY CHỌN] Đường dẫn SQLite Database (Mặc định: sqlite:///./renova.db)
DATABASE_URL=sqlite:///./renova.db
```

### Frontend (`frontend/.env.local` hoặc cấu hình trên Render Environment):
```env
# URL trỏ tới dịch vụ backend (Khi dùng render.yaml, giá trị này được tự động liên kết)
NEXT_PUBLIC_API_URL=https://renova-backend.onrender.com
```

---

## 4. QUY TRÌNH QUẢN TRỊ CHROMADB & CẬP NHẬT KIẾN THỨC AI

### Nguyên lý hoạt động:
1. File tài liệu nằm trong thư mục `ai/knowledge/*.md`.
2. Script `ai/rag/ingest.py` sử dụng hàm `_chunk_text()` để chia tài liệu thành từng đoạn (chunk size ~500 từ, overlap 50 từ) dựa trên ranh giới đoạn văn.
3. ChromaDB nhúng văn bản bằng mô hình mã nguồn mở `all-MiniLM-L6-v2` (chạy trên CPU cục bộ, zero latency, zero cost) và lưu vào `ai/chroma_db/`.
4. Khi có câu hỏi: ChromaDB thực hiện Cosine Distance Search để tìm top 5 chunks sát nghĩa nhất, gắn vào context prompt và gửi đến endpoint `https://api.deepseek.com/chat/completions` với model `deepseek-chat`.

### Lệnh chạy Re-index dữ liệu:
Mỗi khi có file tài liệu mới được cập nhật trong `ai/knowledge/`, chạy lệnh sau từ thư mục gốc dự án:
```bash
python -m ai.rag.ingest
# Hoặc: python ai/rag/ingest.py
```
*Thời gian xử lý: ~2 đến 4 giây. Sau khi chạy xong, dữ liệu trong `ai/chroma_db/` sẽ được cập nhật hoàn toàn mới mà không cần khởi động lại server.*

---

## 5. TRIỂN KHAI TRÊN RENDER.COM (1-CLICK BLUEPRINT)

File `render.yaml` ở thư mục gốc đã định nghĩa sẵn 2 Web Services trong cùng 1 cụm:

1. **`renova-backend` (Python Web Service):**
   * Runtime: `Python 3.11`
   * Region: `singapore`
   * Root Directory: `backend`
   * Build Command: `pip install -r requirements.txt`
   * Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   * **Persistent Disk:** Tên `renova-chroma-storage`, dung lượng 1GB, mount tại `/opt/render/project/src/ai/chroma_db`. *(Giúp giữ nguyên toàn bộ dữ liệu vector của ChromaDB khi redeploy hoặc restart)*.
2. **`renova-frontend` (Node.js Web Service):**
   * Runtime: `Node 20`
   * Root Directory: `frontend`
   * Build Command: `npm install && npm run build`
   * Start Command: `npm run start`
   * `NEXT_PUBLIC_API_URL`: Tự động nhận URL từ `renova-backend.host`.

### Các bước deploy trên giao diện Render:
1. Đăng nhập [dashboard.render.com](https://dashboard.render.com) -> **New +** -> **Blueprint**.
2. Kết nối repo GitHub -> Chọn nhánh **`client-release`**.
3. Điền giá trị cho ô `DEEPSEEK_API_KEY`.
4. Nhấn **Apply**.

---

## 6. TÍCH HỢP WEBHOOK GOOGLE SHEETS (DÀNH CHO DEV)

Khi người dùng submit form tại các endpoint `/api/v1/register/*`, hàm `forward_to_google_sheet(form_type, data)` trong `backend/app/main.py` sẽ thực hiện một HTTP POST bất đồng bộ tới URL được khai báo trong `GOOGLE_SHEET_WEBHOOK_URL`.

### Định dạng Payload gửi đi:
```json
{
  "form_type": "epr_partner", // hoặc "green_project", "collector", "takeback"
  "company_name": "Công ty TNHH Nhựa ABC",
  "contact_name": "Nguyễn Văn A",
  "email": "contact@abc.vn",
  "phone": "0901234567",
  "annual_plastic_waste": 15000,
  "needs_epr_cert": true,
  "created_at": "2026-09-22 23:45:00"
}
```

### Code mẫu Google Apps Script để nhận dữ liệu:
```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),
      data.form_type || "",
      data.company_name || data.contact_name || data.name || "",
      data.email || "",
      data.phone || "",
      data.annual_plastic_waste || data.surface_area || data.collector_type || "",
      JSON.stringify(data)
    ]);
    
    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}
```

---

## 7. CHẠY VÀ KIỂM THỬ LOCAL (DEVELOPER WORKFLOW)

### Khởi động Backend:
```bash
cd backend
python -m venv .venv
# Kích hoạt venv (Windows: .venv\Scripts\activate | Unix: source .venv/bin/activate)
pip install -r requirements.txt

# Kiểm tra ingest dữ liệu vector
python -m ai.rag.ingest

# Chạy server development
uvicorn app.main:app --reload --port 8000
```
Swagger UI Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Khởi động Frontend:
```bash
cd frontend
npm install
npm run dev
```
Local Web App: [http://localhost:3000](http://localhost:3000)

### Kiểm tra build production của Frontend:
```bash
cd frontend
npm run build
```
*(Xác nhận: Biên dịch thành công 100% trong ~2.8 giây, 7 static routes, không phụ thuộc vào admin types).*
