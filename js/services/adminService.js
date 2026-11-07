/**
 * adminService.js - Tầng nghiệp vụ phục vụ trang Quản Trị Viên (Admin Portal)
 */
import { dbInstance } from '../db/database.js';

export const adminService = {
    async getDashboardStats() {
        await dbInstance.init();
        const flightCount = dbInstance.queryOne('SELECT COUNT(*) as count FROM flights')?.count || 0;
        const tourCount = dbInstance.queryOne('SELECT COUNT(*) as count FROM tours')?.count || 0;
        const orderCount = dbInstance.queryOne('SELECT COUNT(*) as count FROM orders')?.count || 0;
        const revenue = dbInstance.queryOne('SELECT SUM(total_amount) as total FROM orders')?.total || 0;

        return {
            flightCount,
            tourCount,
            orderCount,
            revenue
        };
    },

    // ==========================================
    // QUẢN LÝ CHUYẾN BAY (FLIGHTS)
    // ==========================================
    async getAllFlights() {
        await dbInstance.init();
        const sql = `
            SELECT f.*, a.name AS airline_name, a.code AS airline_code,
                   dep.city AS dep_city, arr.city AS arr_city
            FROM flights f
            JOIN airlines a ON f.airline_id = a.id
            JOIN airports dep ON f.departure_airport = dep.code
            JOIN airports arr ON f.arrival_airport = arr.code
            ORDER BY f.id DESC
        `;
        return dbInstance.query(sql);
    },

    async saveFlight(flight) {
        await dbInstance.init();
        if (flight.id) {
            // Cập nhật
            const sql = `
                UPDATE flights SET 
                    flight_number = ?, airline_id = ?, departure_airport = ?, arrival_airport = ?,
                    departure_time = ?, arrival_time = ?, duration = ?, aircraft_type = ?,
                    price_economy = ?, price_business = ?, seats_available = ?, is_direct = ?,
                    baggage_info = ?, meal_info = ?
                WHERE id = ?
            `;
            dbInstance.execute(sql, [
                flight.flight_number, flight.airline_id, flight.departure_airport, flight.arrival_airport,
                flight.departure_time, flight.arrival_time, flight.duration, flight.aircraft_type,
                flight.price_economy, flight.price_business, flight.seats_available, flight.is_direct,
                flight.baggage_info, flight.meal_info, flight.id
            ]);
        } else {
            // Thêm mới
            const sql = `
                INSERT INTO flights (
                    flight_number, airline_id, departure_airport, arrival_airport,
                    departure_time, arrival_time, duration, aircraft_type,
                    price_economy, price_business, seats_available, is_direct,
                    baggage_info, meal_info
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            dbInstance.execute(sql, [
                flight.flight_number, flight.airline_id, flight.departure_airport, flight.arrival_airport,
                flight.departure_time, flight.arrival_time, flight.duration, flight.aircraft_type,
                flight.price_economy, flight.price_business, flight.seats_available, flight.is_direct,
                flight.baggage_info, flight.meal_info
            ]);
        }
        return true;
    },

    async deleteFlight(id) {
        await dbInstance.init();
        return dbInstance.execute('DELETE FROM flights WHERE id = ?', [id]);
    },

    // ==========================================
    // QUẢN LÝ TOUR DU LỊCH (TOURS)
    // ==========================================
    async getAllTours() {
        await dbInstance.init();
        const sql = `
            SELECT t.*, a.name AS airline_name,
                   (SELECT COUNT(*) FROM tour_itineraries WHERE tour_id = t.id) AS days_count
            FROM tours t
            JOIN airlines a ON t.airline_id = a.id
            ORDER BY t.id DESC
        `;
        return dbInstance.query(sql);
    },

    async saveTour(tour) {
        await dbInstance.init();
        if (tour.id) {
            // Cập nhật
            const sql = `
                UPDATE tours SET 
                    title = ?, destination = ?, thumbnail_url = ?, airline_id = ?,
                    duration_days = ?, duration_nights = ?, price = ?, departure_date = ?,
                    aircraft_type = ?, departure_airport = ?, is_featured = ?, overview = ?
                WHERE id = ?
            `;
            dbInstance.execute(sql, [
                tour.title, tour.destination, tour.thumbnail_url, tour.airline_id,
                tour.duration_days, tour.duration_nights, tour.price, tour.departure_date,
                tour.aircraft_type, tour.departure_airport || 'SGN', tour.is_featured ? 1 : 0, tour.overview,
                tour.id
            ]);
        } else {
            // Thêm mới
            const sql = `
                INSERT INTO tours (
                    title, destination, thumbnail_url, airline_id,
                    duration_days, duration_nights, price, departure_date,
                    aircraft_type, departure_airport, is_featured, overview
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            dbInstance.execute(sql, [
                tour.title, tour.destination, tour.thumbnail_url, tour.airline_id,
                tour.duration_days, tour.duration_nights, tour.price, tour.departure_date,
                tour.aircraft_type, tour.departure_airport || 'SGN', tour.is_featured ? 1 : 0, tour.overview
            ]);
        }
        return true;
    },

    async deleteTour(id) {
        await dbInstance.init();
        dbInstance.execute('DELETE FROM tour_itineraries WHERE tour_id = ?', [id]);
        return dbInstance.execute('DELETE FROM tours WHERE id = ?', [id]);
    },

    // ==========================================
    // QUẢN LÝ ĐƠN HÀNG (ORDERS)
    // ==========================================
    async getAllOrders() {
        await dbInstance.init();
        const sql = `
            SELECT o.*, 
                   (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS total_items
            FROM orders o
            ORDER BY o.id DESC
        `;
        return dbInstance.query(sql);
    },

    async getOrderDetails(orderId) {
        await dbInstance.init();
        const order = dbInstance.queryOne('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (!order) return null;
        const items = dbInstance.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
        return {
            ...order,
            items
        };
    },

    async updateOrderStatus(orderId, status) {
        await dbInstance.init();
        return dbInstance.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    },

    async deleteOrder(orderId) {
        await dbInstance.init();
        dbInstance.execute('DELETE FROM order_items WHERE order_id = ?', [orderId]);
        return dbInstance.execute('DELETE FROM orders WHERE id = ?', [orderId]);
    }
};
