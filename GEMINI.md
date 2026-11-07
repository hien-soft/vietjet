# GEMINI.md - Vietjet Travel Web Application (Antigravity System Context)

> **Mục đích:** File này cung cấp toàn bộ quy tắc, tiêu chuẩn kỹ thuật và định hướng kiến trúc cho Antigravity AI khi thực hiện việc lập trình và sinh mã nguồn cho dự án website du lịch **Vietjet**.

---

## 1. TỔNG QUAN DỰ ÁN
- **Tên dự án:** Vietjet Travel & Flight Booking Portal
- **Lĩnh vực:** Du lịch, Vé máy bay, Tour du lịch trọn gói
- **Đặc điểm kiến trúc:** **Pure Frontend (HTML5, CSS3, Vanilla JavaScript ES6+) - TUYỆT ĐỐI KHÔNG DÙNG BACKEND SERVER**.
- **Database:** **SQLite** chạy trực tiếp trên trình duyệt Client qua WebAssembly (**sql.js**), lưu trữ bền vững (persist) vào `IndexedDB` hoặc `localStorage`.
- **Tone màu chủ đạo:**
  - Nền trang: Trắng sáng (`#ffffff` và `#f8f9fa`)
  - Màu thương hiệu chính (Primary Red): `#ee1d23` (Đỏ Vietjet đặc trưng)
  - Màu nhấn (Accent Gold/Yellow): `#ffc107`
  - Màu tương phản: Đen than (`#212529`), xám đậm (`#495057`), viền xám nhạt (`#dee2e6`)

---

## 2. QUY TẮC CÔNG NGHỆ & LẬP TRÌNH BẮT BUỘC

### 2.1. Ngôn ngữ & Thư viện
1. **HTML5 Semantics:** Sử dụng đúng các thẻ chuẩn semantic: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
2. **CSS3 Hiện đại:**
   - Không bắt buộc dùng framework nặng (như Bootstrap hay Tailwind) để giữ code thuần khiết, dễ tùy biến. Dùng CSS Variables (Custom Properties), Flexbox và CSS Grid.
   - Thiết kế chuẩn Responsive Mobile-First hoặc Desktop-First (tương thích màn hình Desktop >= 1200px, Tablet 768px - 1024px, Mobile < 768px).
3. **JavaScript (ES6+ Pure):**
   - Không dùng React, Vue, Angular, Node.js hay Express.
   - Code được tổ chức theo module/service: `database.js`, `flightService.js`, `tourService.js`, `cartService.js`, `emailService.js`.
   - Sử dụng `async/await`, Fetch API, Event Listeners chuẩn.
4. **Cơ sở dữ liệu SQLite trong trình duyệt:**
   - Sử dụng thư viện `sql.js` (WebAssembly) tải từ CDN (`https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js`).
   - Tự động nạp DDL bảng và dữ liệu mẫu (Seed Data) khi khởi chạy ứng dụng lần đầu.
   - Khi có thay đổi (thêm đơn hàng, giỏ hàng), gọi `db.export()` lưu binary buffer vào `localStorage` hoặc `IndexedDB` để dữ liệu không bị mất khi F5 / làm mới trang.
5. **Gửi Email phía Client (Không cần Backend):**
   - Tích hợp thư viện EmailJS SDK (`https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js`).
   - Cấu hình gửi email từ hòm thư quản trị `nvhai061993@gmail.com` đến địa chỉ email của khách hàng sau khi hoàn tất đặt vé/tour, kèm theo mã vé (Booking Code) và tóm tắt dịch vụ.
   - Có cơ chế fallback hiển thị modal/thông báo chi tiết trong trường hợp người dùng chưa cấu hình EmailJS Key.

---

## 3. DANH SÁCH CÁC TRANG & YÊU CẦU CHỨC NĂNG

| Trang | File HTML | Tính năng chính |
| :--- | :--- | :--- |
| **Trang chủ** | `index.html` | - Thanh tìm kiếm chuyến bay (Khứ hồi / Một chiều, Điểm đi, Điểm đến, Ngày đi, Ngày về, Hành khách). Nút "Tìm Kiếm" -> chuyển sang `flights.html` kèm query parameters.<br>- Mục 8 Tour du lịch nổi bật: Ảnh thumbnail 600x400, tên hãng du lịch/hàng không, thời lượng (ngày/đêm), giá tour. Click -> chuyển sang `tours.html` / `tour-detail.html`.<br>- Mục Đối tác Hãng hàng không: Logo VietJet Air, Vietnam Airlines, Singapore Airlines, Bamboo Airways... Click logo -> lọc chuyến bay hãng đó tại `flights.html`. |
| **Chuyến bay** | `flights.html` | **Layout 2 cột:**<br>- **Cột trái (Filter Sidebar):** Sắp xếp giá tăng/giảm, Loại vé (khứ hồi, 1 chiều, bay thẳng, nhiều điểm), Bộ lọc hãng hàng không (checkbox), Lọc theo giờ cất cánh (sáng, chiều, tối), Lọc hạng dịch vụ (Phổ thông, Thương gia).<br>- **Cột phải (Listing):** Danh sách các chuyến bay truy vấn từ SQLite: logo hãng, tên hãng, giờ cất cánh - hạ cánh, thời gian bay, dịch vụ đính kèm, giá tiền. Nút "Chọn chuyến bay" -> chuyển sang `flight-detail.html?id=...`. |
| **Chi tiết Chuyến bay** | `flight-detail.html` | - Chi tiết hành trình: Điểm đi, Điểm đến, Thời gian bay, Hãng bay, Loại máy bay (Boeing 787, Airbus A321neo...).<br>- Lựa chọn giá vé: Hạng Phổ Thông (Eco) vs Hạng Thương Gia (SkyBoss/Business) với so sánh quyền lợi trực quan.<br>- Nút "Chọn chuyến bay" -> Lưu vào SQLite Cart / LocalStorage và chuyển đến `cart.html`. |
| **Tour du lịch** | `tours.html` | **Layout 2 cột:**<br>- **Cột trái (Filter):** Sắp xếp giá tăng/giảm, Hãng hàng không / Đối tác tour, Thời gian khởi hành.<br>- **Cột phải (Listing):** Danh sách tour du lịch truy vấn từ SQLite: thumbnail 600x400, hãng bay đồng hành, ngày khởi hành, thời lượng, giá tiền, tiện ích. Nút "Xem chi tiết" -> `tour-detail.html?id=...`. |
| **Chi tiết Tour** | `tour-detail.html` | - Thông tin tổng quan: Điểm đi, điểm đến, hãng bay vận chuyển, loại máy bay, thời lượng.<br>- Lịch trình chi tiết (Itinerary): Hành trình từng ngày (Ngày 1, Ngày 2, Ngày 3...).<br>- Nút "Chọn tour này" -> Lưu vào Giỏ Hàng (`cart.html`). |
| **Giỏ Hàng & Thanh Toán** | `cart.html` | - Bảng giỏ hàng hiển thị các chuyến bay & tour đã chọn (thông tin, hạng vé, số lượng, đơn giá, thành tiền). Cho phép xóa từng mục hoặc làm trống giỏ hàng.<br>- Form thông tin khách hàng: Họ tên, Số điện thoại, Email, Số CCCD/Passport, Ghi chú.<br>- Nút "Đăng Ký / Hoàn Tất Đặt Chỗ":<br>  1. Validate form.<br>  2. Lưu đơn hàng vào SQLite (`orders` và `order_items`).<br>  3. Gửi email xác nhận từ `nvhai061993@gmail.com` đến email khách hàng.<br>  4. Hiện popup/thông báo Đặt Chỗ Thành Công kèm Mã Đặt Chỗ (Booking Code). |
| **Quản Trị Viên (Admin)** | `admin.html` | - Bảng điều khiển (Dashboard) thống kê tổng quan (chuyến bay, tour, đơn hàng, doanh số).<br>- Thêm mới, chỉnh sửa, xóa chuyến bay & tour du lịch.<br>- Quản lý đơn hàng của khách, đổi trạng thái đơn (CONFIRMED, COMPLETED, CANCELLED).<br>- Sao lưu & Khôi phục CSDL: Xuất tải file `vietjet.db` về máy, nhập file `.db` từ máy, reset CSDL về mặc định. |

---

## 4. QUY TẮC THIẾT KẾ UI & TÀI NGUYÊN (ASSETS)
- **Logo:** Tận dụng ảnh có sẵn tại `images/Logo.jpg`.
- **Banner/Máy bay:** Tận dụng ảnh có sẵn tại `images/plane.jpg`.
- **Thumbnail Tour:** Kích thước cố định tỉ lệ 600x400 px, hiển thị sắc nét, dùng ảnh du lịch chất lượng cao (Unsplash hoặc placeholder chuyên nghiệp).
- **Màu sắc & Nút bấm:**
  - Nút Primary: Background `#ee1d23`, chữ trắng, bo góc 6px - 8px, hover chuyển màu `#d0161b`.
  - Nút Secondary / Outline: Viền `#ee1d23`, chữ `#ee1d23`, hover nền `#ee1d23` chữ trắng.
  - Badge giá tiền: Chữ đậm, màu đỏ `#ee1d23`, định dạng tiền tệ Việt Nam `xxx.xxx.xxx đ` (VND).
  - Badge khuyến mãi/nổi bật: Màu vàng `#ffc107` chữ đen hoặc nền đỏ chữ trắng.

---

## 5. BỘ TÀI LIỆU .MD THAM CHIẾU TRONG DỰ ÁN
Khi cần phát triển chi tiết, Antigravity hãy đọc các tài liệu sau theo thứ tự:
1. `PRD.md`: Chi tiết yêu cầu sản phẩm, luồng người dùng (User Flows), logic chuyển trang.
2. `DATABASE_SCHEMA.md`: Cấu trúc DDL SQLite, quan hệ bảng, script nạp dữ liệu mẫu Seed Data và Wrapper truy vấn SQLite WebAssembly.
3. `UI_UX_SPEC.md`: Toàn bộ quy chuẩn về bố cục, màu sắc, typography, kích thước card và linh kiện UI.
4. `ARCHITECTURE.md`: Cấu trúc file, thư mục, mô hình luồng dữ liệu (Data Flow) và tích hợp EmailJS.
5. `ROADMAP_TASKS.md`: Danh sách công việc phân rã chi tiết để Antigravity lần lượt hiện thực hóa.
6. `PROMPTS.md`: Các câu lệnh mẫu (prompts) chuẩn cho người dùng khi tương tác cùng Antigravity.
