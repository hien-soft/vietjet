# ROADMAP_TASKS.md - KẾ HOẠCH TRIỂN KHAI & DANH MỤC CÔNG VIỆC PHÂN RÃ
## DỰ ÁN: WEBSITE DU LỊCH & ĐẶT VÉ MÁY BAY VIETJET

> **Hướng dẫn:** Sử dụng tài liệu này để theo dõi tiến độ thực hiện dự án. Bạn có thể yêu cầu Antigravity hoàn thành từng Phase hoặc từng Task cụ thể theo thứ tự.

---

## BẢNG TIẾN ĐỘ TỔNG THỂ

- [x] **Phase 1:** Khởi tạo Cấu trúc & Nền tảng Dữ liệu SQLite WebAssembly
- [x] **Phase 2:** Xây dựng Hệ thống Giao diện & Linh kiện Chung (Global Layout & Components)
- [x] **Phase 3:** Phát triển Trang Chủ (`index.html`)
- [x] **Phase 4:** Phát triển Trang Chuyến Bay (`flights.html`) & Chi Tiết (`flight-detail.html`)
- [x] **Phase 5:** Phát triển Trang Tour (`tours.html`) & Chi Tiết Tour (`tour-detail.html`)
- [x] **Phase 6:** Phát triển Trang Giỏ Hàng & Tích Hợp Gửi Email (`cart.html`)
- [x] **Phase 7:** Kiểm Thử, Tối Ưu Hóa & Đảm Bảo Responsive Đa Thiết Bị

---

## CHI TIẾT TỪNG GIAI ĐOẠN (DETAILED TASKS)

### PHASE 1: NỀN TẢNG DỮ LIỆU SQLITE (SQL.JS) & CÁC SERVICES
- [ ] **Task 1.1: Thiết lập cấu trúc thư mục**
  - Tạo các thư mục `css/pages/`, `js/db/`, `js/services/`, `js/components/`, `js/pages/`.
- [ ] **Task 1.2: Định nghĩa Schema & Dữ liệu mẫu (Seed Data)**
  - Tạo file `js/db/schema.js`: DDL cho 8 bảng (`airlines`, `airports`, `flights`, `tours`, `tour_itineraries`, `cart_items`, `orders`, `order_items`).
  - Tạo file `js/db/seed.js`: Nạp dữ liệu các hãng hàng không, các sân bay, các chuyến bay, đúng 8 tour du lịch nổi bật và lịch trình chi tiết.
- [ ] **Task 1.3: Hiện thực hóa SQLite Engine (`js/db/database.js`)**
  - Tải và nạp thư viện `sql-wasm.js` qua CDN.
  - Xây dựng cơ chế khôi phục từ `localStorage` và tự động lưu `db.export()` khi có thay đổi.
  - Viết các phương thức hỗ trợ: `query(sql, params)` và `execute(sql, params)`.
- [ ] **Task 1.4: Xây dựng các tầng dịch vụ (Services Layer)**
  - `flightService.js`: Tìm kiếm chuyến bay theo điểm đi/đến, ngày bay, lọc theo hãng/giá/giờ bay.
  - `tourService.js`: Lấy danh sách tour, 8 tour nổi bật, chi tiết tour, lịch trình chi tiết.
  - `cartService.js`: Thêm vào giỏ, cập nhật số lượng, xóa từng mục, làm trống giỏ hàng, đếm tổng số lượng và tính tổng tiền.
  - `orderService.js`: Tạo đơn hàng mới, sinh mã vé `VJ-XXXXXX`, lưu thông tin khách hàng vào SQLite.
  - `emailService.js`: Cấu hình gửi email từ `nvhai061993@gmail.com` qua EmailJS đến email khách hàng; kèm cơ chế fallback log trực quan.

---

### PHASE 2: HỆ THỐNG GIAO DIỆN & LINH KIỆN CHUNG
- [ ] **Task 2.1: Xây dựng CSS Nền tảng (`css/base.css`)**
  - Khai báo CSS Variables (màu đỏ `#ee1d23`, nền trắng, text, spacing, radius).
  - Reset CSS chuẩn hóa và Typography.
  - Utility classes (container, text-center, flex, grid, d-none...).
- [ ] **Task 2.2: Xây dựng Thư viện Linh kiện (`css/components.css`)**
  - Định dạng nút bấm (Primary Red Button, Outline Button, Ghost Button).
  - Định dạng Card sản phẩm, Badge nhãn (Eco, SkyBoss, Bay thẳng, Thời lượng).
  - Định dạng bảng giỏ hàng, form inputs, modal popup và thanh toast thông báo.
- [ ] **Task 2.3: Thành phần Header & Footer dùng chung**
  - `js/components/header.js`: Tự động render Header, Logo `images/Logo.jpg`, menu và cập nhật Badge số lượng giỏ hàng tức thời.
  - `js/components/footer.js`: Tự động render Footer với thông tin Vietjet, email hỗ trợ `nvhai061993@gmail.com`.
- [ ] **Task 2.4: Linh kiện Thông báo Toast & Modal (`js/components/notification.js`)**
  - Toast thông báo nổi khi thêm vào giỏ hàng thành công.
  - Modal xác nhận xóa hoặc popup chúc mừng hoàn thành đơn hàng.

---

### PHASE 3: TRANG CHỦ (`index.html`)
- [ ] **Task 3.1: Banner Hero & Khung Tìm Kiếm Chuyến Bay**
  - Hiển thị banner dùng ảnh `images/plane.jpg`.
  - Thiết kế Form tìm kiếm chuyến bay: Chọn Khứ hồi / Một chiều; Điểm đi (SGN, HAN, DAD...); Điểm đến; Ngày đi & Ngày về; Số khách.
  - Bắt sự kiện submit form: Thu thập dữ liệu và chuyển trang tới `flights.html?from=...&to=...`.
- [ ] **Task 3.2: Khu vực 8 Tour Du Lịch Nổi Bật**
  - Truy vấn SQLite lấy 8 tour (`is_featured = 1`).
  - Render Card tour với kích thước ảnh thumbnail chuẩn **600x400 px**.
  - Hiển thị đầy đủ: Tên hãng du lịch/hàng không, thời lượng (ngày/đêm), giá tour màu đỏ đậm `#ee1d23`.
  - Nhấp vào chuyển hướng sang trang `tours.html` hoặc `tour-detail.html?id=...`.
- [ ] **Task 3.3: Khu vực Hãng Hàng Không Đối Tác**
  - Hiển thị khối logo: VietJet Air, Vietnam Airlines, Singapore Airlines, Bamboo Airways, Qatar Airways.
  - Gắn sự kiện click: Chuyển hướng tới `flights.html?airline=[id]`.

---

### PHASE 4: TRANG CHUYẾN BAY & CHI TIẾT CHUYẾN BAY
- [ ] **Task 4.1: Trang Danh Sách Chuyến Bay (`flights.html`)**
  - Bố cục 2 cột (Cột trái: Bộ lọc Sidebar, Cột phải: Danh sách kết quả).
  - Tự động nhận tham số từ URL (`from`, `to`, `airline`, `date`).
- [ ] **Task 4.2: Bộ lọc Chuyến Bay (Filter Sidebar)**
  - Sắp xếp giá tăng dần / giảm dần.
  - Lọc loại vé: Khứ hồi, Một chiều, Bay thẳng.
  - Checkbox lọc nhiều hãng hàng không đồng thời.
  - Lọc khung giờ cất cánh (Sáng sớm, Sáng, Chiều, Tối).
  - Lọc hạng dịch vụ (Phổ thông, Thương gia).
- [ ] **Task 4.3: Hiển thị Thẻ Chuyến Bay (Flight Cards)**
  - Render danh sách chuyến bay: Logo, mã hiệu bay, giờ cất cánh - hạ cánh, thời gian bay, dịch vụ đính kèm, giá vé.
  - Nút "Chọn chuyến bay" -> Chuyển sang `flight-detail.html?id=[id]`.
- [ ] **Task 4.4: Trang Chi Tiết Chuyến Bay (`flight-detail.html`)**
  - Lấy thông tin chuyến bay từ SQLite theo ID trên URL.
  - Hiển thị đầy đủ: Điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay (Airbus A321neo / Boeing 787).
- [ ] **Task 4.5: Khối Lựa Chọn Hạng Vé (Ticket Class Selector)**
  - Hiển thị 2 card so sánh: **Hạng Phổ Thông** và **Hạng Thương Gia** với bảng quyền lợi chi tiết.
  - Nút chọn từng hạng vé: Ghi nhận thông tin hạng vé và giá tương ứng.
- [ ] **Task 4.6: Xử lý Thêm vào Giỏ Hàng**
  - Ghi bản ghi vào `cart_items` trong SQLite.
  - Cập nhật số lượng trên icon Header.
  - Hiển thị toast thông báo và điều hướng tới `cart.html`.

---

### PHASE 5: TRANG TOUR & CHI TIẾT TOUR
- [ ] **Task 5.1: Trang Danh Sách Tour (`tours.html`)**
  - Bố cục 2 cột: Bộ lọc tour bên trái, danh sách tour bên phải.
  - Bộ lọc: Giá vé tăng/giảm, hãng hàng không/đối tác, thời gian khởi hành.
- [ ] **Task 5.2: Hiển thị Danh Sách Tour**
  - Card tour gồm thumbnail 600x400, hãng bay, ngày cất cánh, thời gian bay, giá tiền, dịch vụ bao gồm.
  - Nút "Xem chi tiết" -> Chuyển sang `tour-detail.html?id=[id]`.
- [ ] **Task 5.3: Trang Chi Tiết Tour (`tour-detail.html`)**
  - Lấy dữ liệu tour và bảng `tour_itineraries` từ SQLite theo ID.
  - Hiển thị thông số: Điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay.
  - Render khối **Lịch trình chuyến đi (Day-by-Day Itinerary)** chi tiết từng ngày.
- [ ] **Task 5.4: Chức năng Đặt Tour**
  - Cho phép chọn số lượng người tham gia tour.
  - Nút "Đặt Tour / Thêm Vào Giỏ" -> Lưu vào SQLite và chuyển hướng sang `cart.html`.

---

### PHASE 6: GIỎ HÀNG, THANH TOÁN & GỬI EMAIL
- [ ] **Task 6.1: Bảng Quản Lý Giỏ Hàng (`cart.html`)**
  - Lấy toàn bộ danh sách vé máy bay và tour từ bảng `cart_items`.
  - Hiển thị bảng: Thông tin chi tiết, hạng vé, đơn giá, nút tăng/giảm số lượng, thành tiền, nút xóa.
  - Nút "Xóa toàn bộ giỏ hàng".
  - Tính toán tổng tiền chính xác.
- [ ] **Task 6.2: Form Nhập Thông Tin Khách Hàng**
  - Các trường: Họ và tên, Số điện thoại, Email, Số CCCD/Hộ chiếu, Ghi chú.
  - Kiểm tra tính hợp lệ dữ liệu (Validation).
- [ ] **Task 6.3: Quy trình Đăng Ký & Đặt Chỗ (Checkout)**
  - Sinh Mã Đặt Chỗ (Booking Code) dạng `VJ-XXXXXX`.
  - Lưu bản ghi vào bảng `orders` và `order_items`.
  - Xóa sạch giỏ hàng `cart_items`.
- [ ] **Task 6.4: Tích hợp Gửi Email qua EmailJS**
  - Gửi email từ `nvhai061993@gmail.com` tới email khách hàng đã nhập.
  - Nội dung email gồm: Mã đặt chỗ, Họ tên, Danh sách vé/tour đã đặt, Tổng số tiền cần thanh toán.
  - Bổ sung cơ chế mô phỏng khi chưa gắn Key thực tế.
- [ ] **Task 6.5: Modal Thông Báo Hoàn Thành**
  - Hiển thị popup chúc mừng Đặt Chỗ Thành Công, hiển thị Mã Đặt Chỗ, ghi rõ email xác nhận đã gửi đến địa chỉ của khách hàng.

---

### PHASE 7: KIỂM THỬ TỔNG THỂ & TỐI ƯU
- [ ] **Task 7.1:** Kiểm tra tính độc lập (Không cần bất kỳ backend Node/Python nào).
- [ ] **Task 7.2:** Kiểm tra tính năng lưu trữ SQLite bền vững khi F5 hoặc chuyển qua lại giữa các trang.
- [ ] **Task 7.3:** Kiểm tra Responsive trên các thiết bị Desktop, Tablet và Mobile.
- [ ] **Task 7.4:** Rà soát hình ảnh, logo, màu sắc đỏ `#ee1d23`, nền sáng và định dạng tiền tệ VND.
