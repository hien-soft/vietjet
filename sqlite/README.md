# HỆ THỐNG CƠ SỞ DỮ LIỆU SQLITE CHO DỰ ÁN VIETJET TRAVEL
## THƯ MỤC: `sqlite/`

---

## 1. DANH SÁCH CÁC FILE SQL

Thư mục này chứa toàn bộ các script SQL chuẩn cho SQLite của dự án website du lịch Vietjet:

| Tên File | Chức năng | Chi tiết nội dung |
| :--- | :--- | :--- |
| [**`schema.sql`**](file:///d:/HienHV/Vibe%20Coding/Vietjet/sqlite/schema.sql) | **Định nghĩa cấu trúc bảng (DDL)** | Tạo 8 bảng: `airlines`, `airports`, `flights`, `tours`, `tour_itineraries`, `cart_items`, `orders`, `order_items` với khóa chính, khóa ngoại, ràng buộc check và giá trị mặc định. |
| [**`seed.sql`**](file:///d:/HienHV/Vibe%20Coding/Vietjet/sqlite/seed.sql) | **Dữ liệu khởi tạo mẫu (Seed Data)** | Nạp dữ liệu 5 hãng hàng không, 7 sân bay, 25 chuyến bay đa khung giờ, **đúng 8 tour du lịch nổi bật (ảnh 600x400)** và lịch trình chi tiết từng ngày cho toàn bộ 8 tour. |
| [**`init.sql`**](file:///d:/HienHV/Vibe%20Coding/Vietjet/sqlite/init.sql) | **File tổng hợp (All-in-One)** | Kết hợp cả `schema.sql` và `seed.sql` trong một khối giao dịch (`TRANSACTION`), có lệnh xóa bảng cũ (`DROP TABLE IF EXISTS`) để tạo mới database chỉ với 1 lệnh duy nhất. |

---

## 2. HƯỚNG DẪN KIỂM TRA & TẠO FILE DATABASE CỤC BỘ

### Cách 1: Sử dụng Python (Đã có sẵn trên máy)
Bạn có thể chạy lệnh sau trong Terminal / PowerShell để tạo ngay file `vietjet.db`:

```bash
python -c "import sqlite3; conn = sqlite3.connect('sqlite/vietjet.db'); conn.executescript(open('sqlite/init.sql', encoding='utf-8').read()); print('✅ Đã tạo thành công sqlite/vietjet.db');"
```

### Cách 2: Sử dụng công cụ SQLite CLI
```bash
sqlite3 sqlite/vietjet.db < sqlite/init.sql
```

---

## 3. CẤU TRÚC 8 BẢNG TRONG DATABASE

1. **`airlines`**: Quản lý các hãng bay (VietJet Air, Vietnam Airlines, Singapore Airlines, Bamboo Airways, Qatar Airways) kèm logo SVG/PNG.
2. **`airports`**: Danh sách sân bay Tân Sơn Nhất (SGN), Nội Bài (HAN), Đà Nẵng (DAD), Cam Ranh (CXR), Phú Quốc (PQC), Changi (SIN), Suvarnabhumi (BKK).
3. **`flights`**: Danh sách chuyến bay với giờ cất cánh/hạ cánh, thời gian bay, loại máy bay (Airbus A321neo, Boeing 787-9...), giá vé Hạng Phổ Thông, giá vé Hạng Thương Gia, tiện ích (hành lý, suất ăn).
4. **`tours`**: Danh sách tour du lịch với hình ảnh thumbnail chuẩn 600x400 px, điểm đến, hãng hàng không đồng hành, thời lượng (ngày/đêm), giá tour, cờ `is_featured = 1` cho 8 tour trang chủ.
5. **`tour_itineraries`**: Lịch trình chi tiết từng ngày (Ngày 1, Ngày 2, Ngày 3, Ngày 4...) kèm thông tin bữa ăn, khách sạn và các hoạt động tham quan.
6. **`cart_items`**: Lưu trạng thái giỏ hàng của người dùng (vé máy bay hoặc tour, hạng vé Eco/Business, số lượng, đơn giá).
7. **`orders`**: Lưu trữ đơn đặt chỗ thành công (Mã đặt chỗ `VJ-XXXXXX`, họ tên khách hàng, email, số điện thoại, số CCCD, tổng tiền thanh toán).
8. **`order_items`**: Chi tiết từng dịch vụ trong đơn hàng đã hoàn tất.
