/**
 * schema.js - Cấu trúc DDL tạo bảng SQLite
 */
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS airlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS airports (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Việt Nam'
);

CREATE TABLE IF NOT EXISTS flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number TEXT NOT NULL,
    airline_id INTEGER NOT NULL,
    departure_airport TEXT NOT NULL,
    arrival_airport TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    duration TEXT NOT NULL,
    aircraft_type TEXT NOT NULL,
    price_economy INTEGER NOT NULL,
    price_business INTEGER NOT NULL,
    seats_available INTEGER NOT NULL DEFAULT 150,
    is_direct INTEGER NOT NULL DEFAULT 1,
    baggage_info TEXT DEFAULT '7kg xách tay',
    meal_info TEXT DEFAULT 'Suất ăn nhẹ / Nước suối',
    FOREIGN KEY (airline_id) REFERENCES airlines(id),
    FOREIGN KEY (departure_airport) REFERENCES airports(code),
    FOREIGN KEY (arrival_airport) REFERENCES airports(code)
);

CREATE TABLE IF NOT EXISTS tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    airline_id INTEGER NOT NULL,
    duration_days INTEGER NOT NULL,
    duration_nights INTEGER NOT NULL,
    price INTEGER NOT NULL,
    departure_date TEXT NOT NULL,
    aircraft_type TEXT NOT NULL,
    departure_airport TEXT NOT NULL DEFAULT 'SGN',
    is_featured INTEGER NOT NULL DEFAULT 0,
    overview TEXT,
    FOREIGN KEY (airline_id) REFERENCES airlines(id)
);

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

CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL CHECK(item_type IN ('flight', 'tour')),
    item_id INTEGER NOT NULL,
    ticket_class TEXT DEFAULT 'economy',
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_id_card TEXT NOT NULL,
    special_requests TEXT,
    total_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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
`;
