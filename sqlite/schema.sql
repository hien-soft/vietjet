-- ====================================================================
-- CƠ SỞ DỮ LIỆU SQLITE CHO DỰ ÁN VIETJET TRAVEL
-- File: sqlite/schema.sql
-- ====================================================================

-- 1. Bảng Hãng Hàng Không (Airlines)
CREATE TABLE IF NOT EXISTS airlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL
);

-- 2. Bảng Sân Bay (Airports)
CREATE TABLE IF NOT EXISTS airports (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Việt Nam'
);

-- 3. Bảng Chuyến Bay (Flights)
CREATE TABLE IF NOT EXISTS flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number TEXT NOT NULL,
    airline_id INTEGER NOT NULL,
    departure_airport TEXT NOT NULL,
    arrival_airport TEXT NOT NULL,
    departure_time TEXT NOT NULL,       -- Định dạng HH:mm (vd: 06:15)
    arrival_time TEXT NOT NULL,         -- Định dạng HH:mm (vd: 08:25)
    duration TEXT NOT NULL,             -- vd: 2h 10m
    aircraft_type TEXT NOT NULL,        -- vd: Airbus A321neo, Boeing 787-9 Dreamliner
    price_economy INTEGER NOT NULL,     -- Giá vé Hạng Phổ Thông (VND)
    price_business INTEGER NOT NULL,    -- Giá vé Hạng Thương Gia (VND)
    seats_available INTEGER NOT NULL DEFAULT 150,
    is_direct INTEGER NOT NULL DEFAULT 1, -- 1: Bay thẳng, 0: Quá cảnh
    baggage_info TEXT DEFAULT '7kg xách tay',
    meal_info TEXT DEFAULT 'Suất ăn nhẹ / Nước suối',
    FOREIGN KEY (airline_id) REFERENCES airlines(id),
    FOREIGN KEY (departure_airport) REFERENCES airports(code),
    FOREIGN KEY (arrival_airport) REFERENCES airports(code)
);

-- 4. Bảng Tour Du Lịch (Tours)
CREATE TABLE IF NOT EXISTS tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,         -- Ảnh chuẩn 600x400 px
    airline_id INTEGER NOT NULL,
    duration_days INTEGER NOT NULL,      -- Số ngày
    duration_nights INTEGER NOT NULL,    -- Số đêm
    price INTEGER NOT NULL,              -- Giá tour (VND)
    departure_date TEXT NOT NULL,        -- YYYY-MM-DD
    aircraft_type TEXT NOT NULL,         -- Loại tàu bay
    departure_airport TEXT NOT NULL DEFAULT 'SGN',
    is_featured INTEGER NOT NULL DEFAULT 0, -- 1: Tour nổi bật trang chủ (8 tour)
    overview TEXT,
    FOREIGN KEY (airline_id) REFERENCES airlines(id)
);

-- 5. Bảng Lịch Trình Tour Từng Ngày (Tour Itineraries)
CREATE TABLE IF NOT EXISTS tour_itineraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tour_id INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    meals TEXT,
    accommodation TEXT,
    FOREIGN KEY (tour_id) REFERENCES tours(id)
);

-- 6. Bảng Giỏ Hàng (Cart Items)
CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL CHECK(item_type IN ('flight', 'tour')),
    item_id INTEGER NOT NULL,
    ticket_class TEXT DEFAULT 'economy', -- 'economy' | 'business' | 'standard'
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Bảng Đơn Hàng / Đặt Chỗ (Orders)
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT UNIQUE NOT NULL,   -- Mã đặt chỗ VJ-XXXXXX
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_id_card TEXT NOT NULL,
    special_requests TEXT,
    total_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Bảng Chi Tiết Đơn Hàng (Order Items)
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    item_type TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    ticket_class TEXT,
    quantity INTEGER NOT NULL,
    unit_price INTEGER NOT NULL,
    subtotal INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
