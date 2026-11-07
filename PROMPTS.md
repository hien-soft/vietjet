# PROMPTS.md - BỘ CÂU LỆNH (PROMPTS) THỰC CHIẾN DÙNG CHO ANTIGRAVITY
## DỰ ÁN: WEBSITE DU LỊCH & ĐẶT VÉ MÁY BAY VIETJET

> **Cách sử dụng:** Đây là các câu lệnh (prompts) chuẩn bằng tiếng Việt được thiết kế theo đúng quy trình Vibe Coding. Bạn có thể copy từng câu lệnh bên dưới và gửi cho Antigravity để xây dựng từng tính năng một cách hoàn hảo và chính xác nhất.

---

### PROMPT 01: KHỞI TẠO CẤU TRÚC & NỀN TẢNG SQLITE TRÊN TRÌNH DUYỆT (SQL.JS)

```text
Hãy đọc kỹ các file GEMINI.md, PRD.md, DATABASE_SCHEMA.md và ARCHITECTURE.md.

Bây giờ hãy thực hiện PHASE 1:
1. Tạo đầy đủ cấu trúc thư mục của dự án theo ARCHITECTURE.md:
   - css/
   - css/pages/
   - js/
   - js/db/
   - js/services/
   - js/components/
   - js/pages/
2. Tạo file js/db/schema.js chứa các câu lệnh CREATE TABLE (DDL) chuẩn xác từ DATABASE_SCHEMA.md cho 8 bảng: airlines, airports, flights, tours, tour_itineraries, cart_items, orders, order_items.
3. Tạo file js/db/seed.js chứa toàn bộ dữ liệu mẫu ban đầu: các hãng hàng không, các sân bay, các chuyến bay, đúng 8 tour du lịch nổi bật (với ảnh 600x400) và lịch trình tour từng ngày.
4. Tạo file js/db/database.js tích hợp thư viện sql.js (WebAssembly) từ CDN, cơ chế nạp/lưu SQLite database vào localStorage để bảo toàn dữ liệu khi F5 hoặc chuyển trang, cùng các hàm query() và execute().
5. Tạo các file service cơ bản:
   - js/services/flightService.js
   - js/services/tourService.js
   - js/services/cartService.js
   - js/services/orderService.js
   - js/services/emailService.js

Hãy viết code hoàn chỉnh, không dùng mã rút gọn hay placeholder.
```

---

### PROMPT 02: HỆ THỐNG GIAO DIỆN CHUNG & HEADER, FOOTER

```text
Hãy đọc kỹ UI_UX_SPEC.md và GEMINI.md.

Bây giờ hãy thực hiện PHASE 2:
1. Tạo file css/base.css:
   - Khai báo toàn bộ CSS Custom Properties: màu đỏ thương hiệu #ee1d23, nền sáng #ffffff và #f8f9fa, màu chữ, font-family, radius, shadow.
   - Reset CSS chuẩn hóa và Typography.
   - Utility classes tiện dụng cho layout (container, flex, grid, gap, text-center...).
2. Tạo file css/components.css:
   - Định dạng các loại Button: nút chính màu đỏ #ee1d23, nút outline viền đỏ, nút badge.
   - Định dạng Card sản phẩm, thẻ badge thời lượng (4N3Đ), badge hạng vé (Eco, SkyBoss).
   - Định dạng bảng giỏ hàng, form controls (input, select, textarea).
   - Định dạng Toast thông báo và Modal xác nhận.
3. Tạo file js/components/header.js:
   - Render thanh điều hướng chuẩn: Logo từ images/Logo.jpg, menu liên kết (Trang chủ, Chuyến bay, Tour, Giỏ hàng).
   - Tự động lấy số lượng món trong giỏ hàng từ cartService và hiển thị lên Badge đỏ của icon Giỏ hàng.
4. Tạo file js/components/footer.js:
   - Render chân trang với thông tin Vietjet Travel, hotline 1900 1886, email liên hệ nvhai061993@gmail.com.
5. Tạo file js/components/notification.js:
   - Cung cấp hàm hiển thị Toast thông báo (showToast) và hàm mở/đóng Modal (showModal).

Hãy đảm bảo giao diện sáng, tinh tế, đúng quy chuẩn thương hiệu Vietjet.
```

---

### PROMPT 03: PHÁT TRIỂN TRANG CHỦ (`index.html`)

```text
Hãy đọc kỹ PRD.md và UI_UX_SPEC.md phần Trang Chủ.

Bây giờ hãy thực hiện PHASE 3:
1. Tạo file index.html:
   - Tích hợp CDN sql.js và EmailJS.
   - Tích hợp header và footer dùng chung.
   - Phần Banner Hero: Sử dụng ảnh images/plane.jpg làm nền, phía trên là Khung Tìm Kiếm Chuyến Bay:
     + Lựa chọn Vé Khứ Hồi / Vé Một Chiều (radio/tab chuyển đổi).
     + Điểm đi (mặc định SGN), Nút đảo chiều, Điểm đến (mặc định HAN).
     + Ngày đi (date picker), Ngày về (tự động khóa nếu chọn Một chiều).
     + Số hành khách (người lớn, trẻ em).
     + Nút "Tìm Kiếm Chuyến Bay" màu đỏ #ee1d23. Khi bấm sẽ thu thập tham số và chuyển hướng tới flights.html kèm query params.
   - Phần 8 Tour Du Lịch Nổi Bật:
     + Tiêu đề mục nổi bật.
     + Grid hiển thị đúng 8 tour du lịch (truy vấn SQLite is_featured = 1).
     + Mỗi tour card có ảnh thumbnail 600x400 px, badge thời lượng (ví dụ 4N3Đ), badge hãng du lịch/hàng không, giá tour màu đỏ to rõ, nút "Xem Tour" dẫn tới tour-detail.html hoặc tours.html.
   - Phần Hãng Hàng Không Đối Tác:
     + Hiển thị logo/khối hãng bay: VietJet Air, Vietnam Airlines, Singapore Airlines, Bamboo Airways, Qatar Airways.
     + Nhấp vào logo hãng nào sẽ chuyển sang flights.html và kích hoạt bộ lọc hãng đó.
2. Tạo css/pages/home.css và js/pages/home.js để xử lý toàn bộ logic trên.
```

---

### PROMPT 04: TRANG DANH SÁCH CHUYẾN BAY (`flights.html`)

```text
Hãy đọc kỹ PRD.md và UI_UX_SPEC.md phần Trang Chuyến Bay (Flights).

Bây giờ hãy thực hiện PHASE 4 (Phần danh sách):
1. Tạo file flights.html:
   - Cấu trúc 2 cột rõ ràng (Desktop: Cột trái 300px, Cột phải còn lại).
   - Cột bên trái (Bộ lọc Filter Sidebar):
     + Sắp xếp giá vé: Tăng dần, Giảm dần, Giờ bay sớm nhất.
     + Loại vé: Khứ hồi, Một chiều, Bay thẳng, Nhiều thành phố.
     + Bộ lọc các hãng hàng không (checkbox VietJet Air, Vietnam Airlines, Singapore Airlines...).
     + Thời gian cất cánh: Sáng sớm (00:00 - 06:00), Sáng (06:00 - 12:00), Chiều (12:00 - 18:00), Tối (18:00 - 24:00).
     + Hạng dịch vụ: Phổ thông, Thương gia.
     + Nút "Đặt lại bộ lọc".
   - Cột bên phải (Danh sách chuyến bay):
     + Thanh tóm tắt chặng bay và số lượng chuyến bay tìm thấy.
     + Thẻ chuyến bay (Flight Card): Logo hãng, mã hiệu bay, thời gian cất cánh - hạ cánh, thời gian bay, nhãn bay thẳng, tiện ích đính kèm (hành lý, suất ăn), giá vé rẻ nhất hiển thị màu đỏ #ee1d23 to rõ.
     + Nút "Chọn chuyến bay" -> Chuyển hướng sang flight-detail.html?id=[id].
2. Tạo css/pages/flights.css và js/pages/flights.js:
   - Đọc query params từ URL (from, to, date, airline) khi tải trang.
   - Truy vấn SQLite và cập nhật danh sách chuyến bay tương ứng theo thời gian thực mỗi khi người dùng thay đổi bất kỳ tiêu chí lọc nào.
```

---

### PROMPT 05: TRANG CHI TIẾT CHUYẾN BAY & CHỌN HẠNG VÉ (`flight-detail.html`)

```text
Hãy đọc kỹ PRD.md và UI_UX_SPEC.md phần Chi Tiết Chuyến Bay.

Bây giờ hãy thực hiện tiếp PHASE 4 (Phần chi tiết & hạng vé):
1. Tạo file flight-detail.html:
   - Lấy tham số id từ URL (?id=...).
   - Hiển thị khối thông tin chi tiết hành trình: Sân bay cất cánh, Sân bay hạ cánh, Ngày bay, Giờ bay, Thời lượng bay, Tên hãng hàng không, Loại máy bay (Boeing 787, Airbus A321neo...).
   - Khối Lựa Chọn Hạng Vé (Ticket Class Selector - giống giao diện đặt vé thực tế):
     + Cột 1: Hạng Phổ Thông (Eco) với giá vé, danh sách quyền lợi (7kg xách tay, ghế tiêu chuẩn, phí đổi vé) và nút "Chọn Hạng Phổ Thông".
     + Cột 2: Hạng Thương Gia (SkyBoss / Business) với thiết kế viền vàng/đỏ cao cấp, giá vé thương gia, danh sách quyền lợi VIP (14kg xách tay + 30kg ký gửi, phòng chờ thương gia Lounge, lối đi ưu tiên, suất ăn cao cấp, miễn phí đổi vé) và nút "Chọn Hạng Thương Gia".
   - Khi nhấn chọn bất kỳ hạng vé nào:
     + Thêm mục vào bảng cart_items trong SQLite thông qua cartService.
     + Cập nhật badge giỏ hàng trên Header.
     + Hiển thị thông báo Toast thành công.
     + Điều hướng người dùng sang cart.html.
2. Tạo css/pages/flight-detail.css và js/pages/flight-detail.js.
```

---

### PROMPT 06: TRANG TOUR & CHI TIẾT TOUR (`tours.html` & `tour-detail.html`)

```text
Hãy đọc kỹ PRD.md và UI_UX_SPEC.md phần Tour và Chi Tiết Tour.

Bây giờ hãy thực hiện PHASE 5:
1. Tạo file tours.html:
   - Bố cục 2 cột (Cột trái: Bộ lọc tour theo giá tăng/giảm, hãng hàng không, thời gian khởi hành; Cột phải: Danh sách các tour du lịch).
   - Render thẻ tour với ảnh thumbnail 600x400 px, tên tour, điểm đến, hãng bay, thời lượng, giá tiền màu đỏ #ee1d23, dịch vụ kèm theo.
   - Nút "Xem Chi Tiết Tour" -> Dẫn sang tour-detail.html?id=[id].
2. Tạo file tour-detail.html:
   - Lấy thông tin tour từ SQLite theo id.
   - Hiển thị điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay di chuyển.
   - Render Lịch trình chuyến đi chi tiết (Day-by-Day Itinerary) lấy từ bảng tour_itineraries trong SQLite (Ngày 1, Ngày 2, Ngày 3... các hoạt động, bữa ăn, khách sạn).
   - Khung đặt tour: Chọn số lượng người đi tour, hiển thị tổng tiền tạm tính.
   - Nút "Đặt Tour Ngay / Thêm Vào Giỏ" -> Lưu vào bảng cart_items và chuyển sang cart.html.
3. Tạo css/pages/tours.css, css/pages/tour-detail.css, js/pages/tours.js, js/pages/tour-detail.js.
```

---

### PROMPT 07: TRANG GIỎ HÀNG, THANH TOÁN & GỬI EMAIL (`cart.html`)

```text
Hãy đọc kỹ PRD.md, ARCHITECTURE.md và DATABASE_SCHEMA.md phần Giỏ hàng & Email.

Bây giờ hãy thực hiện PHASE 6:
1. Tạo file cart.html:
   - Khu vực Danh sách dịch vụ trong giỏ hàng:
     + Lấy dữ liệu từ bảng cart_items trong SQLite.
     + Hiển thị bảng chi tiết: Tên chuyến bay/tour, Hạng vé/Thời lượng, Đơn giá, Nút tăng/giảm số lượng (+ / -), Thành tiền, Nút xóa từng mục.
     + Nút "Xóa Tất Cả Giỏ Hàng".
     + Tổng kết chi phí: Tạm tính, Thuế phí sân bay, Tổng tiền thanh toán (màu đỏ to đậm).
   - Khu vực Form Thông Tin Khách Hàng:
     + Họ và tên (bắt buộc).
     + Số điện thoại (bắt buộc, validate số ĐT Việt Nam).
     + Email khách hàng (bắt buộc, validate email hợp lệ).
     + Số CCCD / Hộ chiếu (bắt buộc).
     + Ghi chú bổ sung (tùy chọn).
   - Nút "XÁC NHẬN ĐĂNG KÝ & ĐẶT CHỖ":
     + Validate dữ liệu người dùng nhập vào.
     + Tạo mã đặt chỗ duy nhất dạng VJ-XXXXXX.
     + Lưu đơn hàng vào bảng orders và order_items trong SQLite.
     + Làm sạch giỏ hàng cart_items và cập nhật badge Header về 0.
     + Gửi email xác nhận từ nvhai061993@gmail.com tới email của khách hàng qua EmailJS (kèm mã vé, thông tin chuyến bay/tour, tổng tiền).
     + Có cơ chế fallback: nếu chưa cấu hình API key EmailJS thực tế, hiển thị log chi tiết email ra Console và hiển thị nội dung trên popup.
     + Mở Modal thông báo hoàn thành đơn hàng trang trọng, hiển thị mã đơn hàng và thông báo đã gửi email xác nhận.
2. Tạo css/pages/cart.css và js/pages/cart.js.
```

---

### PROMPT 08: KIỂM THỬ, TỐI ƯU GIAO DIỆN & RESPONSIVE

```text
Hãy rà soát toàn bộ dự án Vietjet:
1. Kiểm tra xem toàn bộ các trang index.html, flights.html, flight-detail.html, tours.html, tour-detail.html, cart.html đã liên kết trơn tru với nhau chưa.
2. Kiểm tra tính năng lưu trữ của SQLite (sql.js): Đảm bảo khi người dùng F5 làm mới trang hoặc chuyển trang, giỏ hàng và dữ liệu không bị mất.
3. Đảm bảo đúng 8 tour nổi bật ở trang chủ có ảnh chuẩn 600x400.
4. Đảm bảo màu sắc chủ đạo là màu đỏ #ee1d23 trên nền trắng sáng ở tất cả các trang.
5. Kiểm tra tính năng gửi email xác nhận từ nvhai061993@gmail.com tới email khách hàng khi đặt chỗ thành công.
6. Kiểm tra Responsive trên các kích thước màn hình Mobile, Tablet và Desktop.
```
