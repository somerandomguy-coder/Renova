# TÀI LIỆU BÀN GIAO KỸ THUẬT & HƯỚNG DẪN VẬN HÀNH DỰ ÁN RENOVA
*(Phiên bản Nhánh: `client-release` — Tối ưu triển khai trên Render.com & Tích hợp DeepSeek AI)*

---

## 1. TỔNG QUAN HỆ THỐNG (SYSTEM OVERVIEW)

Hệ thống RENOVA là nền tảng số hóa giải pháp kinh tế tuần hoàn, tính toán chỉ số phát thải ESG/EPR và tích hợp trợ lý AI thông minh chuyên tư vấn vật liệu sinh thái từ rác thải nhựa và phế phẩm vỏ trấu.

### 🌟 Đặc điểm nổi bật của nhánh `client-release`:
* **Zero-Config Defaults:** Hệ thống đã được cấu hình sẵn các giá trị tối ưu. Khách hàng **chỉ cần nhập duy nhất 1 API key của DeepSeek** là toàn bộ nền tảng có thể hoạt động hoàn hảo.
* **1-Platform Hosting (Render.com):** Đã tích hợp sẵn file Blueprint `render.yaml`. Cả Frontend và Backend được triển khai trên cùng 1 dashboard duy nhất.
* **Cơ sở dữ liệu Vector Cục bộ (ChromaDB):** Sử dụng mô hình nhúng mã nguồn mở `all-MiniLM-L6-v2` chạy trực tiếp trên máy chủ, **hoàn toàn miễn phí**, không phát sinh chi phí embedding hàng tháng.
* **Lưu trữ dữ liệu form linh hoạt:** Dữ liệu đối tác đăng ký (EPR, KTS công trình xanh, Vựa ve chai) được tự động lưu vào file database SQLite `renova.db` và xuất trực tiếp ra 3 file Excel/CSV chuẩn Tiếng Việt. Hỗ trợ tùy chọn tự động đẩy về **Google Sheets** chỉ bằng 1 đường link Webhook.
* **Đã loại bỏ các thành phần phức tạp:** Trang quản trị Admin, hệ thống telemetry Langfuse và cloud database Turso đã được gỡ bỏ để giảm thiểu rủi ro bảo mật và đơn giản hóa công tác bảo trì.

---

## 2. CƠ CẤU THƯ MỤC DỰ ÁN (PROJECT DIRECTORY)

```text
Renova/
│
├── render.yaml                 # File tự động triển khai 1-click trên Render.com
├── HANDOVER_GUIDE.md           # Tài liệu hướng dẫn bàn giao này
│
├── frontend/                   # ỨNG DỤNG GIAO DIỆN NGƯỜI DÙNG (Next.js)
│   ├── src/
│   │   ├── app/                # Các trang (Trang chủ, Điều khoản, Chính sách bảo mật)
│   │   └── components/         # Các khối giao diện (Hero, Máy tính ESG, Máy tính EPR, Biểu mẫu...)
│   ├── public/                 # Logo, hình ảnh, icon
│   ├── package.json            # Quản lý thư viện Node.js
│   └── .env.example            # Mẫu biến môi trường frontend
│
├── backend/                    # MÁY CHỦ DỊCH VỤ API (FastAPI / Python)
│   ├── app/
│   │   ├── main.py             # Khởi tạo API, xử lý CORS và định tuyến các endpoint
│   │   ├── config.py           # Cấu hình cài đặt toàn hệ thống
│   │   ├── database.py         # Kết nối cơ sở dữ liệu SQLite 'renova.db'
│   │   ├── models.py           # Định nghĩa bảng dữ liệu lưu trữ
│   │   └── services/           # Logic tính toán ESG/EPR, ghi file CSV và chuyển tiếp Webhook
│   ├── renova.db               # File database SQLite (tự sinh khi chạy)
│   ├── epr_partners.csv        # Dữ liệu đối tác EPR đăng ký
│   ├── green_projects.csv      # Dữ liệu dự án công trình xanh đăng ký
│   ├── collectors.csv          # Dữ liệu mạng lưới thu gom ve chai đăng ký
│   ├── requirements.txt        # Thư viện Python của backend
│   └── .env.example            # Mẫu biến môi trường backend
│
└── ai/                         # ĐỘNG CƠ TRỢ LÝ TRÍ TUỆ NHÂN TẠO (RAG ENGINE)
    ├── knowledge/              # THƯ MỤC CHỨA TÀI LIỆU CỦA DOANH NGHIỆP
    │   ├── faq.md              # Bộ câu hỏi & trả lời thường gặp của RENOVA
    │   └── ...                 # Có thể thêm các file .md giới thiệu sản phẩm khác vào đây
    ├── chroma_db/              # Nơi lưu trữ vector ngữ nghĩa (ChromaDB)
    ├── rag/
    │   ├── engine.py           # Logic sinh câu trả lời với DeepSeek AI
    │   ├── vector_store.py     # Tìm kiếm ngữ nghĩa trong ChromaDB
    │   ├── config.py           # Cấu hình tham số AI
    │   └── ingest.py           # Script nạp tài liệu từ knowledge/ vào chroma_db/
    └── requirements.txt        # Thư viện Python cho mô-đun AI
```

---

## 3. HƯỚNG DẪN CẬP NHẬT KIẾN THỨC CHO CHATBOT (CHROMADB)

Hệ thống AI của RENOVA hoạt động theo cơ chế **RAG (Retrieval-Augmented Generation)**: Khi khách hàng đặt câu hỏi, hệ thống sẽ tìm kiếm các đoạn văn bản liên quan nhất trong file tài liệu của bạn trước khi đưa cho DeepSeek trả lời, đảm bảo câu trả lời luôn đúng sự thật và không bị "bịa đặt" (hallucination).

### Các bước cập nhật nội dung mới:
Mỗi khi RENOVA đạt giải thưởng mới, thay đổi chính sách giá, bổ sung sản phẩm hoặc cập nhật quy trình EPR:

#### Bước 1: Chỉnh sửa tài liệu
Mở file `ai/knowledge/faq.md` (hoặc tạo thêm file markdown mới trong thư mục `ai/knowledge/`).
* Soạn thảo theo định dạng Markdown đơn giản:
  ```markdown
  ### Câu hỏi hoặc chủ đề cần giải thích?
  Nội dung câu trả lời hoặc thông số kỹ thuật chi tiết tại đây.
  ```

#### Bước 2: Chạy lệnh cập nhật Vector Database (Re-indexing)
Mở cửa sổ dòng lệnh tại thư mục gốc dự án và chạy lệnh:
```bash
python -m ai.rag.ingest
```
* **Kết quả:** Hệ thống sẽ tự động đọc toàn bộ các file trong thư mục `ai/knowledge/`, phân đoạn, tạo vector và nạp vào thư mục `ai/chroma_db/`.
* Quá trình này chỉ mất 3 - 5 giây và hoàn toàn miễn phí.

---

## 4. HƯỚNG DẪN TRIỂN KHAI TRÊN RENDER.COM (1-CLICK DEPLOY)

Toàn bộ dự án đã được tích hợp sẵn file Blueprint `render.yaml`, cho phép triển khai cả Frontend và Backend chỉ trong một lần thiết lập.

### Các bước thực hiện:
1. Đăng nhập vào trang quản trị: [https://dashboard.render.com](https://dashboard.render.com)
2. Nhấn nút **New +** ở góc phải trên cùng -> Chọn **Blueprint**.
3. Kết nối với tài khoản GitHub chứa mã nguồn RENOVA -> Chọn repository và chọn nhánh **`client-release`**.
4. Render sẽ tự động quét file `render.yaml` và liệt kê 2 dịch vụ:
   * **`renova-backend`** (Python Web Service + Ổ đĩa Disk 1GB cho ChromaDB).
   * **`renova-frontend`** (Node.js Web Service cho giao diện Next.js).
5. **Điền thông tin biến môi trường:**
   * Render sẽ hiển thị ô yêu cầu nhập: **`DEEPSEEK_API_KEY`**.
   * Dán mã khóa API DeepSeek của bạn vào (Lấy key tại: [https://platform.deepseek.com](https://platform.deepseek.com)).
   * *(Tùy chọn)*: Nếu có webhook Google Sheet thì dán vào ô `GOOGLE_SHEET_WEBHOOK_URL`, nếu không thì để trống.
6. Nhấn **Apply**.
7. Chờ 3 - 5 phút để Render build và khởi chạy. Khi hoàn tất, bạn sẽ nhận được 2 đường link truy cập chính thức!

---

## 5. HƯỚNG DẪN ĐẨY DỮ LIỆU ĐĂNG KÝ VỀ GOOGLE SHEETS (TÙY CHỌN)

Mặc định, khi khách hàng điền form liên hệ (EPR, KTS công trình xanh, Vựa thu gom), dữ liệu sẽ được lưu vào file `renova.db` và ghi vào các file CSV `epr_partners.csv`, `green_projects.csv`, `collectors.csv`.

Nếu bạn muốn mỗi khi có người đăng ký, dữ liệu **tự động nhảy vào bảng tính Google Sheets của bạn trong thời gian thực**:

### Bước 1: Tạo Google Apps Script
1. Mở một Google Sheet mới trên Google Drive của bạn.
2. Vào menu **Tiện ích mở rộng (Extensions)** -> Chọn **Apps Script**.
3. Xóa code cũ và dán đoạn mã sau:
   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);
     
     // Thêm một dòng mới với thời gian và nội dung đăng ký
     sheet.appendRow([
       new Date(),
       data.form_type || "N/A",
       data.company_name || data.contact_name || data.name || "N/A",
       data.email || "N/A",
       data.phone || "N/A",
       JSON.stringify(data)
     ]);
     
     return ContentService.createTextOutput("SUCCESS").setMimeType(ContentService.MimeType.TEXT);
   }
   ```
4. Nhấn **Triển khai (Deploy)** -> **Triển khai mới (New deployment)**.
5. Chọn loại **Ứng dụng web (Web app)**:
   * Người có quyền truy cập: **Bất kỳ ai (Anyone)**.
6. Sao chép đường link **URL ứng dụng web** (Web app URL).

### Bước 2: Cấu hình vào hệ thống
* Thêm biến môi trường vào Backend trên Render (hoặc file `.env` local):
  ```env
  GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
  ```
* Từ thời điểm này, mọi đơn đăng ký sẽ tự động hiển thị trên Google Sheet của bạn!

---

## 6. HƯỚNG DẪN CHẠY VÀ KIỂM THỬ TRÊN MÁY TÍNH CÁ NHÂN (LOCAL RUN)

### Khởi chạy Backend (Python):
```bash
cd backend
python -m venv venv
# Trên Windows: venv\Scripts\activate | Trên macOS/Linux: source venv/bin/activate
pip install -r requirements.txt

# Nạp dữ liệu kiến thức AI lần đầu
python -m ai.rag.ingest

# Khởi chạy server
uvicorn app.main:app --reload --port 8000
```
* Tài liệu API tương tác: Truy cập [http://localhost:8000/docs](http://localhost:8000/docs)

### Khởi chạy Frontend (Next.js):
```bash
cd frontend
npm install
npm run dev
```
* Trang web giao diện: Truy cập [http://localhost:3000](http://localhost:3000)

---

## 7. QUẢN LÝ CHI PHÍ & TỐI ƯU VẬN HÀNH

1. **Chi phí DeepSeek API:**
   * Mô hình `deepseek-chat` hiện tại có mức phí rất rẻ (khoảng ~0.14 USD cho 1 triệu token). Với mức độ truy cập thông thường của một website doanh nghiệp, chi phí AI mỗi tháng chỉ khoảng từ 1 - 3 USD.
   * Khuyến nghị: Vào mục cài đặt tài khoản trên [platform.deepseek.com](https://platform.deepseek.com) để đặt hạn mức tối đa (Monthly Spending Limit) khoảng 5 USD/tháng để yên tâm vận hành.
2. **Chi phí Hosting Render:**
   * Gói Starter trên Render khoảng 7 USD/tháng cho mỗi dịch vụ, tích hợp sẵn HTTPS SSL miễn phí và tự động khởi động lại nếu có sự cố.
