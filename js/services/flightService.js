/**
 * flightService.js - Tầng nghiệp vụ xử lý dữ liệu chuyến bay từ SQLite
 */
import { dbInstance } from '../db/database.js';

export const flightService = {
    async getAirports() {
        await dbInstance.init();
        return dbInstance.query('SELECT * FROM airports ORDER BY city ASC');
    },

    async getAirlines() {
        await dbInstance.init();
        return dbInstance.query('SELECT * FROM airlines ORDER BY name ASC');
    },

    async getFlightById(id) {
        await dbInstance.init();
        const sql = `
            SELECT f.*, 
                   a.name AS airline_name, a.logo_url AS airline_logo,
                   dep.city AS dep_city, dep.name AS dep_airport_name,
                   arr.city AS arr_city, arr.name AS arr_airport_name
            FROM flights f
            JOIN airlines a ON f.airline_id = a.id
            JOIN airports dep ON f.departure_airport = dep.code
            JOIN airports arr ON f.arrival_airport = arr.code
            WHERE f.id = ?
        `;
        return dbInstance.queryOne(sql, [id]);
    },

    async searchFlights(filters = {}) {
        await dbInstance.init();
        let sql = `
            SELECT f.*, 
                   a.name AS airline_name, a.logo_url AS airline_logo,
                   dep.city AS dep_city, dep.name AS dep_airport_name,
                   arr.city AS arr_city, arr.name AS arr_airport_name
            FROM flights f
            JOIN airlines a ON f.airline_id = a.id
            JOIN airports dep ON f.departure_airport = dep.code
            JOIN airports arr ON f.arrival_airport = arr.code
            WHERE 1=1
        `;
        const params = [];

        if (filters.from && filters.from !== 'ALL') {
            sql += ` AND f.departure_airport = ?`;
            params.push(filters.from);
        }

        if (filters.to && filters.to !== 'ALL') {
            sql += ` AND f.arrival_airport = ?`;
            params.push(filters.to);
        }

        // Lọc theo danh sách hãng bay (mảng ID)
        if (filters.airlineIds && filters.airlineIds.length > 0) {
            const placeholders = filters.airlineIds.map(() => '?').join(',');
            sql += ` AND f.airline_id IN (${placeholders})`;
            params.push(...filters.airlineIds);
        } else if (filters.airlineId) {
            sql += ` AND f.airline_id = ?`;
            params.push(filters.airlineId);
        }

        // Lọc bay thẳng
        if (filters.directOnly) {
            sql += ` AND f.is_direct = 1`;
        }

        // Lọc theo khung giờ cất cánh
        if (filters.timeSlots && filters.timeSlots.length > 0) {
            const timeConditions = [];
            filters.timeSlots.forEach(slot => {
                if (slot === 'early') timeConditions.push(`(f.departure_time >= '00:00' AND f.departure_time < '06:00')`);
                if (slot === 'morning') timeConditions.push(`(f.departure_time >= '06:00' AND f.departure_time < '12:00')`);
                if (slot === 'afternoon') timeConditions.push(`(f.departure_time >= '12:00' AND f.departure_time < '18:00')`);
                if (slot === 'evening') timeConditions.push(`(f.departure_time >= '18:00' AND f.departure_time <= '23:59')`);
            });
            if (timeConditions.length > 0) {
                sql += ` AND (${timeConditions.join(' OR ')})`;
            }
        }

        // Sắp xếp
        if (filters.sortBy === 'price_desc') {
            sql += ` ORDER BY f.price_economy DESC`;
        } else if (filters.sortBy === 'time_asc') {
            sql += ` ORDER BY f.departure_time ASC`;
        } else {
            // Mặc định: Giá tăng dần
            sql += ` ORDER BY f.price_economy ASC`;
        }

        return dbInstance.query(sql, params);
    }
};
