# UI_UX_SPEC.md - QUY CHUẨN THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX SPECIFICATION)
## DỰ ÁN: WEBSITE DU LỊCH & ĐẶT VÉ MÁY BAY VIETJET

---

## 1. HỆ THỐNG MÀU SẮC & THƯƠNG HIỆU (DESIGN TOKENS)

Website áp dụng phong cách thiết kế hiện đại của các nền tảng OTA (Online Travel Agency) hàng đầu, tôn vinh bộ nhận diện thương hiệu Vietjet với nền sáng, sạch sẽ và các điểm nhấn nổi bật.

```css
:root {
  /* Màu thương hiệu chính */
  --color-primary: #ee1d23;        /* Đỏ Vietjet đặc trưng */
  --color-primary-hover: #d0161b;  /* Đỏ đậm khi hover */
  --color-primary-light: #fff0f1;  /* Đỏ siêu nhạt cho background badge/active */
  
  /* Màu nhấn phụ */
  --color-accent-yellow: #ffc107;  /* Vàng Vietjet - dùng cho nhãn SkyBoss/Khuyến mãi */
  --color-accent-gold: #ff9800;    /* Vàng cam phụ trợ */
  
  /* Màu nền & Nền sáng */
  --color-bg-body: #f8f9fa;        /* Nền tổng thể trang web (sáng dịu mắt) */
  --color-bg-card: #ffffff;        /* Nền thẻ trắng tinh khôi */
  --color-bg-alt: #f1f3f5;         /* Nền khu vực phụ, bảng tóm tắt */
  
  /* Màu chữ & Text Hierarchy */
  --color-text-main: #212529;      /* Chữ chính (tiêu đề, tên chuyến bay, giá) */
  --color-text-sub: #495057;       /* Chữ phụ (thời gian, mô tả ngắn, tiện ích) */
  --color-text-muted: #6c757d;     /* Chữ mờ (nhãn phụ, placeholder) */
  --color-text-white: #ffffff;     /* Chữ trắng trên nền đỏ/vàng */
  
  /* Màu viền & Phân cách */
  --color-border: #dee2e6;
  --color-border-light: #e9ecef;
  
  /* Màu thông báo trạng thái */
  --color-success: #28a745;        /* Xanh lá: Đặt vé thành công, bay thẳng */
  --color-warning: #ffc107;        /* Vàng cảnh báo */
  --color-danger: #dc3545;         /* Đỏ báo lỗi */
  --color-info: #17a2b8;           /* Xanh dương tiện ích */
  
  /* Đổ bóng & Bo góc */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.12);
}
```

---

## 2. TYPOGRAPHY & PHÔNG CHỮ
- **Phông chữ hệ thống:** `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;`
- **Tỉ lệ kích thước chữ:**
  - `H1`: 32px – 36px, `font-weight: 700`, line-height: 1.2
  - `H2`: 24px – 28px, `font-weight: 700`, margin-bottom: 16px
  - `H3`: 18px – 20px, `font-weight: 600`
  - `Body`: 15px – 16px, `font-weight: 400`, line-height: 1.5
  - `Small/Badge`: 12px – 13px, `font-weight: 500`
  - `Price Display`: 20px – 26px, `font-weight: 700`, màu đỏ `--color-primary`.

---

## 3. BỐ CỤC LƯỚI & RESPONSIVE BREAKPOINTS

- **Container chuẩn:** `max-width: 1200px`, căn giữa tự động `margin: 0 auto; padding: 0 16px;`.
- **Breakpoints chuẩn:**
  - **Desktop (>= 1024px):** Layout 2 cột (Cột Sidebar lọc cố định `300px`, Cột danh sách kết quả `flex: 1`).
  - **Tablet (768px – 1023px):** Thu gọn sidebar, grid tour hiển thị 2 cột.
  - **Mobile (< 768px):** 1 cột đơn. Bộ lọc chuyển sang dạng nút bấm mở Modal/Drawer hoặc thanh trượt ngang.

---

## 4. CHI TIẾT THIẾT KẾ TỪNG THÀNH PHẦN (COMPONENTS)

### 4.1. Header & Navigation Bar
- Chiều cao cố định: `70px`, dính đỉnh trang (`position: sticky; top: 0; z-index: 1000; background: #fff; box-shadow: var(--shadow-sm);`).
- Bên trái: Logo Vietjet (`images/Logo.jpg`), chiều cao cân đối khoảng 45px.
- Ở giữa: Menu liên kết chính (Trang chủ, Chuyến bay, Tour du lịch) với hiệu ứng gạch chân đỏ khi active hoặc hover.
- Bên phải:
  - Nút Giỏ Hàng (`cart.html`): Biểu tượng xe đẩy siêu thị kèm **Badge tròn màu đỏ** hiển thị số lượng vé/tour hiện tại (ví dụ: `2`).
  - Hotline hỗ trợ: `1900 1886` nổi bật với icon tai nghe.

### 4.2. Khung Tìm Kiếm Chuyến Bay Hero Banner (`index.html`)
- **Nền Banner:** Sử dụng file `images/plane.jpg` làm ảnh nền với lớp phủ gradient tối nhẹ (`linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.5))`).
- **Hộp thoại tìm kiếm (Search Box):** Nổi ở giữa/dưới banner, nền trắng, bo góc 12px, bóng đổ sâu `var(--shadow-lg)`.
  - Phía trên là 2 tab lựa chọn: `Khứ hồi` và `Một chiều`.
  - Hàng nhập liệu dạng lưới:
    - Ô Điểm xuất phát (có icon máy bay cất cánh).
    - Nút hoán đổi 2 chiều (Swap button xoay 180 độ).
    - Ô Điểm đến (có icon máy bay hạ cánh).
    - Ô Ngày đi & Ngày về (Datepicker tích hợp).
    - Ô Số hành khách (Dropdown chọn 1-5 khách).
  - Nút **"TÌM CHUYẾN BAY"**: Nền đỏ rực `#ee1d23`, chữ in hoa trắng đậm, bo góc 8px, hover phóng to nhẹ (`transform: scale(1.02);`).

### 4.3. Thẻ Tour Du Lịch Nổi Bật (8 Tour Featured Cards)
- Bố cục: Grid 4 cột x 2 hàng trên Desktop (tổng cộng đúng 8 tour).
- Thẻ tour (Tour Card):
  - **Hình ảnh Thumbnail:** Tỉ lệ chuẩn **600x400 px** (`aspect-ratio: 3/2; object-fit: cover; border-top-left-radius: 8px; border-top-right-radius: 8px;`).
  - **Huy hiệu trên ảnh (Badge Overlay):**
    - Góc trái: Tag thời lượng `4N3Đ` nền đen mờ bo tròn.
    - Góc phải: Tag tên hãng bay / du lịch (Vietjet Travel) nền đỏ chữ trắng.
  - **Phần thân thẻ:**
    - Tên tour: Tối đa 2 dòng (`display: -webkit-box; -webkit-line-clamp: 2; overflow: hidden;`), chữ đậm 16px.
    - Điểm khởi hành & Ngày khởi hành kèm icon lịch.
  - **Phần chân thẻ:**
    - Giá tour: Hiển thị nổi bật dạng `4.590.000 đ` màu đỏ Vietjet.
    - Nút phụ "Xem Chi Tiết": Nền trắng viền đỏ, hover nền đỏ chữ trắng.

### 4.4. Dải Logo Đối Tác Hàng Không (Airline Partners)
- Bố cục flex wrap ngang gồm các khối hình chữ nhật bo góc viền nhẹ `#dee2e6`.
- Mỗi khối chứa logo và tên hãng: VietJet Air, Vietnam Airlines, Singapore Airlines, Bamboo Airways, Qatar Airways.
- Hiệu ứng tương tác: Khi rê chuột vào khối nào, viền chuyển màu đỏ `#ee1d23` và con trỏ chuột hiển thị `pointer`. Click sẽ chuyển hướng trực tiếp tới trang chuyến bay đã được lọc theo hãng đó.

### 4.5. Thẻ Chuyến Bay Danh Sách (`flights.html`)
- Bố cục thẻ nằm ngang trên nền trắng bo góc 8px, viền mờ `#e9ecef`:
  - **Khối 1 (Hãng & Mã bay):** Logo hãng hàng không (40px) + Tên hãng + Mã hiệu chuyến bay (vd: `VJ-128`) + Tag loại tàu bay `Airbus A321neo`.
  - **Khối 2 (Lịch trình thời gian):**
    - Giờ cất cánh (vd: `08:15`) to đậm, mã sân bay `SGN`.
    - Thanh tiến trình ở giữa: Thời gian bay `2h 10m` nằm trên đường kẻ ngang có icon máy bay nhỏ, nhãn xanh lá "Bay thẳng".
    - Giờ hạ cánh (vd: `10:25`) to đậm, mã sân bay `HAN`.
  - **Khối 3 (Tiện ích):** Các icon nhỏ xinh: Hành lý 7kg, Nước uống, Suất ăn.
  - **Khối 4 (Giá & Đặt vé):**
    - Nhãn "Giá chỉ từ".
    - Số tiền: `1.450.000 đ` font 22px đỏ đậm.
    - Nút **"Chọn chuyến bay"**: Nền đỏ `#ee1d23` chữ trắng.

### 4.6. Khu Vực Chọn Hạng Vé Chi Tiết Chuyến Bay (`flight-detail.html`)
Gồm 2 cột so sánh trực quan như màn hình đặt vé chuẩn quốc tế:

| Tiêu chí | Hạng Phổ Thông (Eco) | Hạng Thương Gia (SkyBoss / Business) |
| :--- | :--- | :--- |
| **Header thẻ** | Nền xám nhạt `#f1f3f5`, chữ đen | Nền đỏ vàng chuyển sắc (Gradient `#ee1d23` sang `#ff9800`), chữ trắng |
| **Giá vé** | `1.290.000 đ` / khách | `3.890.000 đ` / khách |
| **Hành lý xách tay** | ✔️ 07 kg xách tay | ✔️ 14 kg xách tay (2 kiện) |
| **Hành lý ký gửi** | ❌ Mua thêm | ✔️ 30 kg ký gửi miễn phí |
| **Phòng chờ VIP** | ❌ Không bao gồm | ✔️ Miễn phí phòng chờ Business Lounge |
| **Ưu tiên thủ tục** | ❌ Check-in thường | ✔️ Lối đi ưu tiên & xe đưa đón riêng |
| **Suất ăn trên tàu** | ❌ Mua riêng | ✔️ Suất ăn nóng cao cấp + Đồ uống đặc biệt |
| **Đổi vé / Hoàn vé** | Thu phí chênh lệch | ✔️ Miễn phí thay đổi ngày/giờ bay |
| **Nút bấm** | `[Chọn Hạng Phổ Thông]` (Viền đỏ) | `[Chọn Hạng Thương Gia]` (Nền đỏ đậm) |

### 4.7. Trang Giỏ Hàng & Form Thanh Toán (`cart.html`)
- **Bảng Giỏ Hàng:**
  - Header bảng: Dịch Vụ, Loại Vé / Hạng, Đơn Giá, Số Lượng, Thành Tiền, Thao Tác.
  - Nút tăng giảm số lượng (+ / -) dễ bấm, không giật lag.
  - Nút Xóa (Icon thùng rác màu xám, hover chuyển đỏ).
  - Nút "Xóa Giỏ Hàng": Đặt góc dưới bảng để làm sạch nhanh.
- **Form Thông Tin Khách Hàng:**
  - Được chia 2 cột với các trường input có viền rõ ràng, focus chuyển viền đỏ `#ee1d23`.
  - Báo lỗi validate ngay dưới từng input (ví dụ: *"Vui lòng nhập đúng định dạng email"*).
- **Hộp Tổng Kết Đơn Hàng:**
  - Tạm tính vé máy bay & tour.
  - Thuế phí sân bay (hiển thị minh bạch).
  - **TỔNG CỘNG THANH TOÁN:** Chữ cỡ lớn 26px màu đỏ `#ee1d23`.
  - Nút **"XÁC NHẬN ĐĂNG KÝ & ĐẶT VÉ"**: To rộng toàn bộ chiều ngang hộp tổng kết, màu đỏ rực rỡ.

### 4.8. Modal Thông Báo Đặt Chỗ Thành Công & Gửi Email
- Modal xuất hiện ở giữa màn hình với nền mờ tối (Backdrop blur).
- Icon vòng tròn xanh lá lớn với dấu tích chữ V `✔` hoạt họa nảy nhẹ.
- Tiêu đề: **"ĐẶT CHỖ THÀNH CÔNG!"**
- Khung mã đặt chỗ: Mã vé màu đỏ đậm viền nét đứt (Ví dụ: `VJ-852194`).
- Thông báo minh bạch:
  > *"Cảm ơn quý khách **Nguyễn Văn A**! Đơn hàng của quý khách đã được hệ thống ghi nhận. Chúng tôi đã gửi email xác nhận và chi tiết vé từ **nvhai061993@gmail.com** tới hộp thư **khachhang@gmail.com** của quý khách."*
- Nút bấm điều hướng: "Về Trang Chủ" và "Xem Lại Giỏ Hàng".
