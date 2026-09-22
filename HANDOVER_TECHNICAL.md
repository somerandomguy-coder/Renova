# TÀI LIỆU KỸ THUẬT & HƯỚNG DẪN VẬN HÀNH RENOVA
### *(DÀNH CHO ĐỘI NGŨ KỸ THUẬT / DEVELOPER / SYSADMIN)*

> **Nhánh mã nguồn bàn giao:** `client-release`  
> **Kiến trúc:** 1-Service Monolith — Next.js Static Export được mount trực tiếp vào FastAPI Python + ChromaDB (Vector DB cục bộ) + DeepSeek AI (LLM RAG)  
> **Nền tảng triển khai:** 1 Web Service duy nhất trên **Render.com** (qua file `render.yaml`), cùng chung domain, không lo lỗi CORS.

---

## 1. KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

```text
                               ┌────────────────────────────────┐
                               │     Client Browser / Mobile    │
                               └──────────────┬─────────────────┘
                                              │ https://renova.onrender.com/
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    RENDER.COM WEB SERVICE (1 SERVICE DUY NHẤT)               │
│                                                                              │
│   FastAPI Server (uvicorn app.main:app)                                      │
│   ├── Static Mount: /           ──> Phục vụ giao diện Next.js (frontend/out)  │
│   ├── API Routes:   /api/v1/... ──> Máy tính ESG/EPR, Đăng ký Form           │
│   ├── Docs:         /docs       ──> Swagger UI tương tác trực tiếp           │
│   └── AI Engine:    /api/v1/ai  ──> RAG Pipeline                             │
│                                                                              │
│   Storage Cục bộ:                                                            │
│   ├── SQLite: renova.db (Lưu trữ quan hệ tự động)                           │
│   └── Spreadsheets: *.csv (Excel UTF-8-BOM)                                  │
└───────────────────────┬───────────────────────────────┬──────────────────────┘
                        │                               │
         Query Semantic │                               │ LLM Completion
                        ▼                               ▼
┌──────────────────────────────────────────────┐   ┌───────────────────────────┐
│       ChromaDB Vector Store (Persistent)     │   │      DeepSeek API         │
│  - all-MiniLM-L6-v2 embeddings (local on CPU)│   │  - Model: deepseek-chat   │
│  - Mount path: /.../ai/chroma_db (1GB Disk)  │   │  - Base: api.deepseek.com │
└──────────────────────────────────────────────┘   └───────────────────────────┘
```

### Các ưu điểm vượt trội của kiến trúc 1-Service:
* **Same-Origin (Không cần CORS):** Vì FastAPI phục vụ trực tiếp cả giao diện HTML/CSS/JS tĩnh lẫn các endpoint API trên cùng 1 domain và cổng mạng, các lệnh gọi API từ frontend là đường dẫn tương đối (`/api/v1/...`). Hoàn toàn không bao giờ gặp lỗi CORS trên trình duyệt.
* **Tiết kiệm 50% chi phí máy chủ:** Thay vì phải tốn 2 service (1 cho Node.js frontend, 1 cho Python backend), hệ thống chỉ chạy đúng 1 Web Service duy nhất trên Render (~7$/tháng).
* **Zero-Config Deployment:** Chỉ cần khai báo đúng 1 biến bí mật duy nhất: `DEEPSEEK_API_KEY`.
* **Loại bỏ hoàn toàn phụ thuộc bên ngoài:** Không cần máy chủ SMTP email (tránh lỗi spam/hết quota), không cần cấu hình tài khoản Google Sheets phụ phức tạp. Dữ liệu đăng ký được ghi trực tiếp vào SQLite và các file Excel CSV chuẩn tiếng Việt.

---

## 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
Renova/
│
├── render.yaml                 # Bản thiết kế tự động dựng 1 service trên Render.com
├── HANDOVER_BUSINESS.md        # Bản hướng dẫn dành cho chủ doanh nghiệp / non-tech
├── HANDOVER_TECHNICAL.md       # Bản tài liệu kỹ thuật chi tiết này
│
├── frontend/                   # MÃ NGUỒN GIAO DIỆN (Next.js 16)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Trang chủ RENOVA
│   │   │   ├── ai-assistant/   # Trang trợ lý AI chuyên biệt
│   │   │   ├── terms/          # Trang điều khoản dịch vụ
│   │   │   ├── privacy/        # Trang chính sách bảo mật
│   │   │   └── globals.css     # CSS Tokens (Theme Terracotta Clay #914724)
│   │   └── components/         # Các khối UI (Hero, Máy tính ESG/EPR, Form...)
│   ├── out/                    # Thư mục HTML tĩnh xuất ra sau khi chạy `npm run build`
│   └── package.json            # Quản lý thư viện frontend
│
├── backend/                    # MÁY CHỦ DỊCH VỤ & API (FastAPI / Python)
│   ├── app/
│   │   ├── main.py             # FastAPI app, mount frontend/out, endpoints API
│   │   ├── config.py           # Quản lý cài đặt (DEEPSEEK_API_KEY, database)
│   │   ├── database.py         # SQLAlchemy kết nối SQLite renova.db
│   │   ├── models.py           # Bảng dữ liệu ORM
│   │   ├── schemas.py          # Pydantic Schemas cho API
│   │   └── services/
│   │       ├── calculators.py  # Thuật toán tính toán ESG & EPR
│   │       ├── spreadsheets.py # Thread-safe CSV logger (UTF-8-BOM cho Excel)
│   │       └── ai_chat.py      # Tầng dịch vụ chuyển tiếp chat và SSE streaming
│   ├── renova.db               # File database SQLite cục bộ (tự sinh)
│   ├── epr_partners.csv        # Log đăng ký đối tác EPR
│   ├── green_projects.csv      # Log đăng ký dự án công trình xanh
│   ├── collectors.csv          # Log đăng ký mạng lưới ve chai
│   ├── requirements.txt        # Thư viện Python cho backend
│   └── .env.example            # Mẫu biến môi trường backend
│
└── ai/                         # MÔ-ĐUN TRÍ TUỆ NHÂN TẠO RAG
    ├── knowledge/              # THƯ MỤC TÀI LIỆU DOANH NGHIỆP
    │   ├── faq.md              # Câu hỏi thường gặp & giải thưởng của RENOVA
    │   ├── product_specs.md    # Thông số kỹ thuật gạch bông gió
    │   ├── epr_regulations.md  # Quy định EPR và pháp lý môi trường
    │   └── esg_formulas.md     # Công thức quy đổi phát thải
    ├── chroma_db/              # Thư mục lưu trữ vector index của ChromaDB
    ├── rag/
    │   ├── engine.py           # RAG pipeline: Tìm kiếm tài liệu + Gọi DeepSeek
    │   ├── vector_store.py     # ChromaDB client, Cosine search cục bộ
    │   ├── config.py           # Cấu hình RAG (Model, chunk size, top_k=5)
    │   └── ingest.py           # Script nạp tài liệu markdown vào ChromaDB
    └── requirements.txt        # Dependencies riêng cho AI (openai, chromadb)
```

---

## 3. CẤU HÌNH BIẾN MÔI TRƯỜNG (ENVIRONMENT VARIABLES)

Hệ thống được thiết kế với triết lý **Zero-Config Defaults**.

Khi deploy lên Render (hoặc chạy local trong `backend/.env`), bạn **CHỈ CẦN DUY NHẤT 1 BIẾN**:
```env
# [BẮT BUỘC] API Key của DeepSeek (Lấy tại https://platform.deepseek.com)
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

*(Tất cả các biến khác như `DATABASE_URL`, `PORT`, `PYTHON_VERSION` đều đã được Render và code tự động xử lý).*

---

## 4. QUY TRÌNH QUẢN TRỊ CHROMADB & CẬP NHẬT KIẾN THỨC AI

### Cơ chế hoạt động:
1. File tài liệu nằm trong thư mục `ai/knowledge/*.md`.
2. Script `ai/rag/ingest.py` sử dụng hàm `_chunk_text()` để chia nhỏ tài liệu dựa trên ranh giới đoạn văn.
3. ChromaDB nhúng văn bản bằng mô hình `all-MiniLM-L6-v2` (chạy trên CPU máy chủ, hoàn toàn miễn phí, tốc độ vài mili-giây) và lưu vào `ai/chroma_db/`.
4. Khi khách hỏi: ChromaDB tìm top 5 đoạn tài liệu sát nhất, gắn vào context prompt và gửi đến DeepSeek (`deepseek-chat`) để sinh câu trả lời.

### Lệnh chạy Re-index dữ liệu:
Mỗi khi có nội dung mới trong `ai/knowledge/`, chạy lệnh sau:
```bash
python ai/rag/ingest.py
```
*Thời gian chạy: ~2 đến 4 giây. ChromaDB tự động cập nhật dữ liệu mới mà không cần khởi động lại máy chủ.*

---

## 5. TRIỂN KHAI TRÊN RENDER.COM (1-CLICK DEPLOY)

File `render.yaml` ở thư mục gốc tự động dựng 1 Web Service hợp nhất:

```yaml
services:
  - type: web
    name: renova
    runtime: python
    region: singapore
    plan: starter
    buildCommand: npm --prefix frontend install && npm --prefix frontend run build && pip install -r backend/requirements.txt
    startCommand: cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
    disk:
      name: renova-chroma-storage
      mountPath: /opt/render/project/src/ai/chroma_db
      sizeGB: 1
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.9
      - key: NODE_VERSION
        value: 20.14.0
      - key: DEEPSEEK_API_KEY
        sync: false
```

### Các bước deploy:
1. Đăng nhập [dashboard.render.com](https://dashboard.render.com) -> **New +** -> **Blueprint**.
2. Kết nối repo GitHub -> Chọn nhánh **`client-release`**.
3. Điền giá trị cho ô `DEEPSEEK_API_KEY`.
4. Nhấn **Apply**.
5. Render sẽ tự động build frontend, cài backend và khởi chạy website tại đường link `https://renova.onrender.com`.

---

## 6. CHẠY VÀ KIỂM THỬ LOCAL (DEVELOPER WORKFLOW)

### Bước 1: Build Frontend tĩnh
```bash
cd frontend
npm install
npm run build
```
*(Kết quả sinh ra thư mục `frontend/out/` chứa toàn bộ trang web tĩnh)*.

### Bước 2: Chạy Backend & Phục vụ Website
```bash
cd ../backend
python -m venv .venv
# Kích hoạt venv (Windows: .venv\Scripts\activate | macOS/Linux: source .venv/bin/activate)
pip install -r requirements.txt

# Nạp dữ liệu AI lần đầu
python ../ai/rag/ingest.py

# Khởi chạy server hợp nhất
uvicorn app.main:app --reload --port 8000
```

* **Truy cập Website:** Mở [http://localhost:8000](http://localhost:8000) (Trình duyệt sẽ hiển thị website RENOVA đầy đủ chức năng).
* **Truy cập Swagger API Docs:** Mở [http://localhost:8000/docs](http://localhost:8000/docs).
