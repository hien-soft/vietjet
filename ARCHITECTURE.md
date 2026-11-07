# ARCHITECTURE.md - KIẾN TRÚC HỆ THỐNG & CẤU TRÚC MÃ NGUỒN (SYSTEM ARCHITECTURE)
## DỰ ÁN: WEBSITE DU LỊCH & ĐẶT VÉ MÁY BAY VIETJET

---

## 1. TỔNG QUAN MÔ HÌNH KIẾN TRÚC

Website được thiết kế theo mô hình **Client-Side Multi-Page Application (MPA)** kết hợp cơ sở dữ liệu nhúng **SQLite WebAssembly** và dịch vụ gửi thư phía trình duyệt.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       TRÌNH DUYỆT (BROWSER CLIENT)                     │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                        TẦNG GIAO DIỆN (UI)                      │   │
│   │  index.html | flights.html | flight-detail.html | tours.html... │   │
│   │  Components: Header, Footer, FlightCard, TourCard, Modal...     │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
│                                   │                                     │
│   ┌───────────────────────────────▼─────────────────────────────────┐   │
│   │                       TẦNG NGHIỆP VỤ (SERVICES)                 │   │
│   │  flightService | tourService | cartService | orderService       │   │
│   └───────────────────────┬─────────────────────────┬───────────────┘   │
│                           │                         │                   │
│   ┌───────────────────────▼──────────────┐   ┌──────▼───────────────┐   │
│   │     TẦNG DỮ LIỆU SQLITE (SQL.JS)     │   │   EMAIL SERVICE      │   │
│   │  WebAssembly Engine (In-Memory DB)   │   │   (EmailJS Client)   │   │
│   └───────────────────────┬──────────────┘   └──────┬───────────────┘   │
│                           │                         │                   │
│   ┌───────────────────────▼──────────────┐          │                   │
│   │       LOCALSTORAGE / INDEXEDDB       │          │                   │
│   │  Lưu trữ file nhị phân SQLite (.db)  │          │                   │
│   └──────────────────────────────────────┘          │                   │
└─────────────────────────────────────────────────────┼───────────────────┘
                                                      │ Gửi qua HTTPS API
                                                      ▼
                                       ┌─────────────────────────────┐
                                       │     HỆ THỐNG GỬI EMAIL      │
                                       │   (EmailJS Cloud Service)   │
                                       │  Từ: nvhai061993@gmail.com  │
                                       │  Tới: Email Khách Hàng      │
                                       └─────────────────────────────┘
```

---

## 2. CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT DIRECTORY TREE)

```
vietjet/
├── GEMINI.md                  # Hướng dẫn và quy tắc hệ thống cho Antigravity
├── PRD.md                     # Tài liệu yêu cầu sản phẩm chi tiết
├── DATABASE_SCHEMA.md         # Thiết kế DDL SQLite, quan hệ bảng & Seed data
├── UI_UX_SPEC.md              # Quy chuẩn thiết kế màu sắc, layout, component
├── ARCHITECTURE.md            # Tài liệu kiến trúc hệ thống và cấu trúc code
├── ROADMAP_TASKS.md           # Kế hoạch công việc phân rã từng bước
├── PROMPTS.md                 # Bộ câu lệnh (Prompts) thực chiến cho Antigravity
├── README.md                  # Hướng dẫn tổng quan và hướng dẫn chạy nhanh
│
├── index.html                 # Trang chủ: Tìm kiếm chuyến bay, 8 tour, đối tác
├── flights.html               # Trang danh sách chuyến bay & bộ lọc
├── flight-detail.html         # Trang chi tiết chuyến bay & chọn hạng vé
├── tours.html                 # Trang danh sách tour & bộ lọc
├── tour-detail.html           # Trang chi tiết tour & lịch trình chuyến đi
├── cart.html                  # Trang giỏ hàng, thông tin khách & đặt chỗ
│
├── css/
│   ├── base.css               # Reset CSS, CSS Variables, Typography, Tiện ích
│   ├── components.css         # Navbar, Footer, Buttons, Cards, Badges, Modals
│   └── pages/
│       ├── home.css           # Giao diện riêng cho Trang chủ
│       ├── flights.css        # Giao diện trang Danh sách chuyến bay & Filter
│       ├── flight-detail.css  # Giao diện trang Chi tiết chuyến bay & Hạng vé
│       ├── tours.css          # Giao diện trang Tour du lịch
│       ├── tour-detail.css    # Giao diện trang Chi tiết Tour & Timeline
│       └── cart.css           # Giao diện Giỏ hàng & Form thanh toán
│
├── js/
│   ├── db/
│   │   ├── database.js        # Engine SQLite qua sql.js WASM + sync LocalStorage
│   │   ├── schema.js          # Khai báo các câu lệnh CREATE TABLE (DDL)
│   │   └── seed.js            # Khai báo dữ liệu mẫu chuyến bay, tour, hãng bay
│   │
│   ├── services/
│   │   ├── flightService.js   # Tìm kiếm, lọc chuyến bay, sân bay, hãng hàng không
│   │   ├── tourService.js     # Lấy danh sách 8 tour nổi bật, lọc tour, lịch trình
│   │   ├── cartService.js     # Thêm/Sửa/Xóa/Đếm giỏ hàng, tính tổng tiền
│   │   ├── orderService.js    # Tạo đơn hàng, sinh mã VJ-XXXXXX, lưu SQLite
│   │   └── emailService.js    # Gửi email từ nvhai061993@gmail.com qua EmailJS
│   │
│   ├── components/
│   │   ├── header.js          # Sinh Header & đồng bộ số lượng giỏ hàng
│   │   ├── footer.js          # Sinh Footer thông tin doanh nghiệp
│   │   └── notification.js    # Toast thông báo & Modal popup xác nhận
│   │
│   └── pages/
│       ├── home.js            # Điều khiển logic tìm chuyến bay & render 8 tour
│       ├── flights.js         # Điều khiển bộ lọc đa năng & render danh sách bay
│       ├── flight-detail.js   # Render chi tiết chuyến bay & chọn hạng Eco/Business
│       ├── tours.js           # Điều khiển bộ lọc tour & render danh sách tour
│       ├── tour-detail.js     # Render chi tiết tour, timeline & thêm vào giỏ
│       └── cart.js            # Render bảng giỏ hàng, validate form & đặt chỗ
│
└── images/
    ├── Logo.jpg               # Logo thương hiệu Vietjet (đã có sẵn)
    ├── plane.jpg              # Ảnh máy bay làm nền Banner (đã có sẵn)
    └── (Ảnh tour & icon nếu tải offline)
```

---

## 3. CÁCH THỨC HOẠT ĐỘNG CỦA CÁC MODULE CHÍNH

### 3.1. SQLite WebAssembly Persistence Flow
Khi người dùng tải trang:
1. `database.js` kiểm tra `localStorage.getItem('vietjet_sqlite_db_v1')`.
2. Nếu đã tồn tại: Chuyển chuỗi base64 thành mảng byte `Uint8Array` và nạp vào `new SQL.Database(bytes)`.
3. Nếu chưa tồn tại: Chạy `schema.js` để tạo bảng và chạy `seed.js` để nạp 8 tour nổi bật, các chuyến bay, các hãng hàng không.
4. Bất kỳ thao tác nào làm biến đổi dữ liệu (ví dụ: `cartService.addToCart(...)` hay `orderService.createOrder(...)`) đều gọi hàm `db.export()`, sau đó mã hóa Base64 và lưu đè vào `localStorage`.

### 3.2. Cart Service & Đồng Bộ Trạng Thái Giữa Các Trang
- Bảng `cart_items` trong SQLite lưu trữ:
  - `item_type`: `'flight'` hoặc `'tour'`
  - `item_id`: Khóa ngoại tham chiếu `flights(id)` hoặc `tours(id)`
  - `ticket_class`: `'economy'` hoặc `'business'` (nếu là vé máy bay)
  - `quantity`: Số lượng hành khách / vé
  - `unit_price`: Đơn giá tại thời điểm thêm
- `header.js` trên mỗi trang luôn gọi `cartService.getCartCount()` để cập nhật số lượng hiển thị trên Badge đỏ của icon Giỏ Hàng.

### 3.3. Dịch Vụ Gửi Email Không Cần Backend (`emailService.js`)
Dự án sử dụng dịch vụ **EmailJS Browser SDK**:
1. Khách hàng hoàn tất nhập thông tin tại `cart.html` và nhấn nút "Đăng Ký".
2. `orderService.js` tạo mã đặt chỗ duy nhất (ví dụ: `VJ-749215`) và lưu đơn hàng vào SQLite.
3. `emailService.sendBookingConfirmation(orderData)` được kích hoạt:
   - Gửi payload qua API của EmailJS:
     ```javascript
     const emailParams = {
         from_name: "Vietjet Travel (nvhai061993@gmail.com)",
         to_name: orderData.customer_name,
         to_email: orderData.customer_email,
         customer_phone: orderData.customer_phone,
         booking_code: orderData.booking_code,
         total_amount: orderData.total_amount.toLocaleString('vi-VN') + ' đ',
         order_details: orderData.itemsSummary,
         support_email: "nvhai061993@gmail.com"
     };
     ```
4. **Cơ chế Fallback thông minh:**
   - Khi chạy môi trường thử nghiệm (chưa điền Service ID / Public Key thực tế của EmailJS), hàm `emailService.js` tự động in nội dung email chi tiết ra Console trình duyệt và hiển thị thông báo popup mô phỏng trực quan: *"Email đã được gửi thành công từ nvhai061993@gmail.com tới [email]!"*.
   - Khi người dùng cấu hình tài khoản EmailJS thực tế, chỉ cần thay đổi 3 thông số cấu hình trong `emailService.js`:
     - `EMAILJS_SERVICE_ID`
     - `EMAILJS_TEMPLATE_ID`
     - `EMAILJS_PUBLIC_KEY`

---

## 4. QUY ƯỚC QUẢN LÝ DỮ LIỆU & URL PARAMETERS GIỮA CÁC TRANG

| Hành động | Trang nguồn | Trang đích | Tham số truyền qua URL (Query String) |
| :--- | :--- | :--- | :--- |
| **Tìm kiếm chuyến bay** | `index.html` | `flights.html` | `?from=SGN&to=HAN&date=2026-11-20&trip=round` |
| **Nhấp logo hãng bay** | `index.html` | `flights.html` | `?airline=1` (ID hãng bay) |
| **Chọn chuyến bay** | `flights.html` | `flight-detail.html` | `?id=1` (ID chuyến bay) |
| **Xem chi tiết tour** | `index.html` hoặc `tours.html` | `tour-detail.html` | `?id=1` (ID tour du lịch) |
| **Xem giỏ hàng** | Mọi trang | `cart.html` | Không cần tham số (lấy dữ liệu từ SQLite) |
| **Hoàn tất đặt chỗ** | `cart.html` | `cart.html` | Hiển thị Modal hoàn thành & xóa giỏ hàng |
