# DỰ ÁN WEBSITE DU LỊCH & ĐẶT VÉ MÁY BAY VIETJET
## HỆ THỐNG TÀI LIỆU VIBE CODING DÀNH CHO GOOGLE ANTIGRAVITY

Chào mừng bạn đến với bộ tài liệu hoàn chỉnh để phát triển website du lịch **Vietjet** bằng công cụ hỗ trợ lập trình **Antigravity**.

Toàn bộ hệ thống được thiết kế theo kiến trúc **Pure Frontend (HTML5, CSS3, Vanilla JavaScript)**, sử dụng cơ sở dữ liệu **SQLite (WebAssembly qua sql.js)** chạy trực tiếp trên trình duyệt, không cần bất kỳ máy chủ backend nào.

---

## 1. DANH MỤC CÁC FILE TÀI LIỆU (.MD) ĐÃ TẠO

Dưới đây là các tài liệu markdown được chuẩn bị sẵn sàng trong thư mục dự án:

| File | Mô tả nội dung | Mục đích sử dụng |
| :--- | :--- | :--- |
| **`GEMINI.md`** | File ngữ cảnh và quy tắc cốt lõi cho Antigravity | Antigravity tự động đọc file này để nắm rõ toàn bộ ràng buộc kỹ thuật, màu sắc `#ee1d23`, nền sáng và quy tắc dự án. |
| **`PRD.md`** | Tài liệu yêu cầu sản phẩm (Product Requirements Document) | Mô tả chi tiết hành vi, luồng người dùng (User Flows) và yêu cầu tính năng của cả 6 trang: Trang chủ, Chuyến bay, Chi tiết chuyến bay, Tour, Chi tiết Tour, Giỏ hàng & Thanh toán. |
| **`DATABASE_SCHEMA.md`** | Thiết kế cơ sở dữ liệu SQLite trong trình duyệt | Cung cấp toàn bộ câu lệnh SQL DDL (8 bảng), script nạp dữ liệu mẫu (Seed Data với 8 tour nổi bật, các chuyến bay, các hãng hàng không) và mã nguồn wrapper `database.js`. |
| **`UI_UX_SPEC.md`** | Quy chuẩn thiết kế giao diện & trải nghiệm người dùng | Quy định bảng màu thương hiệu (Màu đỏ `#ee1d23`, màu vàng `#ffc107`, nền trắng sáng), typography, layout 2 cột, kích thước ảnh thumbnail 600x400 px, thiết kế card chọn hạng vé Eco/SkyBoss. |
| **`ARCHITECTURE.md`** | Kiến trúc hệ thống & cấu trúc mã nguồn | Sơ đồ tổ chức thư mục `css/`, `js/db/`, `js/services/`, `js/components/`, `js/pages/`, cơ chế lưu trữ bền vững SQLite và luồng gửi email xác nhận từ `nvhai061993@gmail.com`. |
| **`ROADMAP_TASKS.md`** | Kế hoạch triển khai phân rã từng bước | Danh sách công việc phân rã từ Phase 1 đến Phase 7 với các hộp kiểm (checkbox) để theo dõi tiến độ thi công. |
| **`PROMPTS.md`** | Bộ câu lệnh (Prompts) thực chiến cho Antigravity | Các câu lệnh mẫu bằng tiếng Việt được soạn sẵn, bạn chỉ việc copy-paste gửi cho Antigravity để xây dựng từng tính năng từ A đến Z. |

---

## 2. ĐẶC ĐIỂM NỔI BẬT CỦA WEBSITE

1. **Công nghệ thuần khiết (Pure Frontend):**
   - Chỉ sử dụng HTML5, CSS3 hiện đại (Flexbox, Grid, CSS Variables) và JavaScript ES6+.
   - Hoàn toàn độc lập, không cần cài đặt Node.js, Express, Python hay cơ sở dữ liệu máy chủ.
2. **Cơ sở dữ liệu SQLite nhúng trong trình duyệt (sql.js):**
   - Chạy trực tiếp engine SQLite thông qua WebAssembly.
   - Hỗ trợ đầy đủ câu lệnh SQL: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `JOIN`.
   - Cơ chế tự động đồng bộ hóa với `localStorage` / `IndexedDB`, bảo đảm dữ liệu giỏ hàng và đơn hàng không bị mất khi F5 hoặc chuyển trang.
3. **Màu sắc thương hiệu Vietjet:**
   - Tone màu sáng, nền trắng (`#ffffff`), nền phụ (`#f8f9fa`).
   - Màu chủ đạo là màu đỏ rực rỡ Vietjet (`#ee1d23`).
   - Màu nhấn vàng ánh kim (`#ffc107`) cho hạng vé cao cấp và huy hiệu ưu đãi.
4. **Trang Chủ (`index.html`):**
   - Khung tìm kiếm chuyến bay đa năng (Khứ hồi / Một chiều, điểm xuất phát, điểm đến, ngày đi, ngày về, số khách).
   - Danh sách đúng **8 Tour du lịch nổi bật** với ảnh tỉ lệ chuẩn **600x400 px**, hiển thị hãng du lịch, số ngày/đêm và giá tour.
   - Dải logo các hãng hàng không đối tác (VietJet Air, Vietnam Airlines, Singapore Airlines, Bamboo Airways...), click vào sẽ dẫn đến trang Chuyến bay đã được lọc theo hãng.
5. **Trang Chuyến Bay (`flights.html`) & Chi Tiết (`flight-detail.html`):**
   - Layout 2 cột: Bộ lọc đa tiêu chí bên trái (giá tăng/giảm, loại vé, bay thẳng, nhiều thành phố, hãng bay, giờ cất cánh, hạng dịch vụ) và danh sách chuyến bay bên phải.
   - Trang chi tiết chuyến bay cung cấp bảng so sánh 2 hạng vé trực quan: **Hạng Phổ Thông (Eco)** và **Hạng Thương Gia (SkyBoss / Business)**.
6. **Trang Tour (`tours.html`) & Chi Tiết Tour (`tour-detail.html`):**
   - Bộ lọc tour và danh sách tour du lịch phong phú.
   - Lịch trình chi tiết theo từng ngày (Day-by-Day Itinerary).
7. **Giỏ Hàng & Thanh Toán (`cart.html`):**
   - Quản lý các chuyến bay và tour đã đặt, có thể tăng giảm số lượng hoặc xóa mục.
   - Form thông tin khách hàng (Họ tên, SĐT, Email, CCCD, Ghi chú).
   - Nút đăng ký xác nhận -> Tạo mã đặt chỗ `VJ-XXXXXX` -> Lưu vào SQLite.
   - Tự động kích hoạt dịch vụ gửi email xác nhận từ **`nvhai061993@gmail.com`** tới hộp thư của khách hàng.
8. **Trang Quản Trị Hệ Thống (`admin.html`):**
   - Bảng điều khiển (Dashboard) thống kê tổng quan: Tổng chuyến bay, tour, đơn hàng, doanh số.
   - Quản lý chuyến bay: Thêm mới, chỉnh sửa giá/giờ bay/hãng, xóa chuyến bay.
   - Quản lý tour du lịch: Thêm tour, sửa thông tin, cờ hiển thị 8 tour nổi bật (`is_featured`), xóa tour.
   - Quản lý đơn hàng: Xem danh sách chi tiết vé khách đặt, đổi trạng thái đơn (CONFIRMED, COMPLETED, CANCELLED).
   - Sao lưu & Khôi phục CSDL: Tải file `vietjet.db` về máy tính, nhập file CSDL từ máy, hoặc khôi phục mặc định.

---

## 3. HƯỚNG DẪN BẮT ĐẦU VIBE CODING VỚI ANTIGRAVITY

### Cách 1: Cho Antigravity tự động triển khai toàn bộ dự án
Bạn chỉ cần gửi tin nhắn:
> *"Hãy đọc các file GEMINI.md, PRD.md, DATABASE_SCHEMA.md, UI_UX_SPEC.md, ARCHITECTURE.md và bắt đầu code hoàn thiện toàn bộ dự án theo từng Phase trong ROADMAP_TASKS.md!"*

### Cách 2: Triển khai từng bước bằng các câu lệnh trong `PROMPTS.md`
Mở file `PROMPTS.md` và gửi lần lượt từng câu lệnh:
1. **Prompt 01:** Khởi tạo cấu trúc & Database SQLite.
2. **Prompt 02:** Tạo CSS giao diện chung & Header, Footer.
3. **Prompt 03:** Xây dựng Trang chủ (`index.html`).
4. **Prompt 04:** Xây dựng Trang danh sách Chuyến bay (`flights.html`).
5. **Prompt 05:** Xây dựng Trang Chi tiết chuyến bay & Chọn hạng vé (`flight-detail.html`).
6. **Prompt 06:** Xây dựng Trang Tour & Chi tiết tour (`tours.html`, `tour-detail.html`).
7. **Prompt 07:** Xây dựng Trang Giỏ hàng & Tích hợp gửi Email (`cart.html`).
8. **Prompt 08:** Kiểm thử tổng thể & Tối ưu Responsive.

---

## 4. HƯỚNG DẪN KHỞI CHẠY DỰ ÁN TRÊN MÁY TÍNH

Vì dự án là Pure Frontend sử dụng WebAssembly (sql.js), bạn nên chạy qua một máy chủ web tĩnh cục bộ để tránh các hạn chế về bảo mật CORS cục bộ (file:/// protocol):

### Lựa chọn 1: Dùng VS Code Live Server (Khuyên dùng)
- Cài đặt extension **Live Server** trên VS Code.
- Nhấp chuột phải vào file `index.html` và chọn **"Open with Live Server"**.
- Trình duyệt sẽ tự động mở tại địa chỉ `http://127.0.0.1:5500`.

### Lựa chọn 2: Dùng Python
Mở Terminal / PowerShell tại thư mục dự án và chạy:
```bash
python -m http.server 8000
```
Sau đó mở trình duyệt truy cập: `http://localhost:8000`.

### Lựa chọn 3: Dùng Node.js npx serve
```bash
npx serve .
```

---

## 5. HƯỚNG DẪN CẤU HÌNH GỬI EMAIL THỰC TẾ (EMAILJS)

Mặc định trong code, `emailService.js` đã có cơ chế mô phỏng (Simulator) sẵn sàng in nội dung thư và hiển thị popup thông báo gửi từ `nvhai061993@gmail.com`.

Khi bạn muốn gửi email thật 100% đến hộp thư người nhận:
1. Đăng ký tài khoản miễn phí tại [https://www.emailjs.com](https://www.emailjs.com).
2. Tạo Email Service kết nối với tài khoản Gmail `nvhai061993@gmail.com`.
3. Tạo Email Template với các biến: `{{to_name}}`, `{{to_email}}`, `{{booking_code}}`, `{{total_amount}}`, `{{order_details}}`.
4. Mở file `js/services/emailService.js` và điền 3 thông số:
   ```javascript
   const EMAILJS_SERVICE_ID = "service_xxxxxxx";
   const EMAILJS_TEMPLATE_ID = "template_xxxxxxx";
   const EMAILJS_PUBLIC_KEY = "your_public_key";
   ```
Mỗi khi khách hàng nhấn đăng ký trên web, một email thực tế sẽ được gửi ngay lập tức tới email của khách hàng!
