# HƯỚNG DẪN QUẢN TRỊ & VẬN HÀNH RENOVA
### *(DÀNH CHO CHỦ DOANH NGHIỆP / NON-TECH / BUSINESS OWNER)*

> **Tài liệu này viết riêng cho các nhà sáng lập, quản lý và nhân sự vận hành không chuyên về lập trình.** Tài liệu giải thích website hoạt động như thế nào, chi phí hàng tháng, dữ liệu khách hàng nằm ở đâu và cách cập nhật thông tin khi doanh nghiệp có thay đổi.

---

## 1. HỆ THỐNG WEBSITE & AI CỦA BẠN HOẠT ĐỘNG NHƯ THẾ NÀO?

Nền tảng RENOVA gồm 3 phần chính gắn liền với hoạt động kinh doanh:
1. **Trang web giới thiệu & Tính toán (Giao diện):** Khách hàng truy cập để xem sản phẩm, thử tính toán số lượng gạch, diện tích tường, lượng rác thải nhựa được cứu và chi phí EPR được tối ưu.
2. **Trợ lý AI tư vấn tự động (RENOVA AI Chatbot):** Đóng vai trò như một chuyên viên tư vấn 24/7. Trợ lý này **chỉ trả lời dựa trên đúng tài liệu thật của RENOVA** (không bịa đặt), trả lời mượt mà cả tiếng Việt lẫn tiếng Anh.
3. **Bộ thu thập thông tin khách hàng:** Khi đối tác EPR, kiến trúc sư hoặc các vựa ve chai điền form liên hệ, thông tin sẽ được tự động lưu lại vào hệ thống để đội ngũ kinh doanh liên hệ chăm sóc.

---

## 2. WEBSITE VÀ DỮ LIỆU ĐANG ĐƯỢC ĐẶT Ở ĐÂU? CHI PHÍ BAO NHIÊU?

Toàn bộ hệ thống được gom gọn vào **1 dịch vụ duy nhất trên Render.com**, bạn không cần mua thêm tên miền nếu muốn tiết kiệm:

| Hạng mục | Đặt ở đâu? | Chi phí ước tính | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Máy chủ Web & AI** | **Render.com** (1 dịch vụ duy nhất) | ~7 USD/tháng | Chạy toàn bộ trang web và trợ lý AI. Bạn nhận được link web miễn phí dạng `https://renova.onrender.com` có sẵn ổ khóa bảo mật HTTPS. |
| **Trí tuệ nhân tạo (AI)** | **DeepSeek API** | ~1 - 2 USD/tháng | Trí tuệ xử lý ngôn ngữ giúp chatbot trả lời khách. Chi phí tính theo số lượng câu hỏi thực tế (cực kỳ tiết kiệm). |
| **Dữ liệu đăng ký** | **File Excel & Database** | Miễn phí | Tự động lưu trên máy chủ, có thể tải về file Excel bất cứ lúc nào. Không cần cài đặt email hay tài khoản phụ phức tạp. |
| **Tên miền (Domain)** | *Không bắt buộc* | 0 đ (hoặc ~250k/năm nếu muốn dùng tên miền riêng sau này) | Dùng ngay đường link Render được cấp miễn phí, không tốn thêm tiền mua tên miền. |

> 💡 **Khuyến nghị cho chủ doanh nghiệp:** Bạn nên tự lập tài khoản Render.com và DeepSeek bằng email công ty, sau đó cài đặt **hạn mức chi tiêu tối đa (Spending Limit) là 5 USD/tháng** trên DeepSeek để hoàn toàn yên tâm về chi phí.

---

## 3. KHÁCH ĐIỀN FORM THÌ THÔNG TIN NẰM Ở ĐÂU?

Khi có người gửi thông tin trên website (đăng ký tư vấn EPR, đăng ký dự án xanh, đăng ký thu gom ve chai):
* Toàn bộ thông tin (Tên công ty, Người liên hệ, Số điện thoại, Email, Sản lượng rác...) được tự động lưu vào các file Excel chuẩn Tiếng Việt ngay trên máy chủ:
  * `epr_partners.csv` (Đối tác EPR)
  * `green_projects.csv` (Dự án công trình xanh)
  * `collectors.csv` (Mạng lưới thu gom ve chai)
* Bất cứ lúc nào bạn cần, bạn hoặc nhân sự IT chỉ cần tải các file này về để mở xem bằng Excel bình thường. Hệ thống không phụ thuộc vào hòm thư email hay các dịch vụ bên thứ ba.

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
  Bạn chỉ cần gửi file này cho IT và nói: *"Anh/em đã sửa file faq.md rồi, nhờ em chạy lệnh nạp lại vào AI giúp anh/chị nhé"*. (Việc này chỉ mất đúng 5 giây của IT).
  Ngay sau đó, khách lên web hỏi câu mới, AI sẽ tự động trả lời chính xác thông tin bạn vừa thêm!

---

## 5. DANH SÁCH TÀI KHOẢN BẠN CẦN NẮM GIỮ (BÀN GIAO CHỦ SỞ HỮU)

Để đảm bảo toàn quyền sở hữu doanh nghiệp của mình, hãy lưu lại các thông tin này:

1. **Tài khoản Render.com:** Nơi máy chủ web đang chạy.
2. **Tài khoản DeepSeek (platform.deepseek.com):** Nơi nạp tiền (nạp 5$ là dùng được vài tháng) và lấy mã API Key.
3. **Mã nguồn dự án (GitHub / Git Repository):** Lưu trữ toàn bộ mã nguồn của RENOVA trên nhánh **`client-release`**.

---

*Nếu cần kiểm tra kỹ thuật sâu hơn hoặc bảo trì code, hãy gửi tài liệu **`HANDOVER_TECHNICAL.md`** cho nhân sự lập trình.*
