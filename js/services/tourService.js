/**
 * tourService.js - Tầng nghiệp vụ xử lý tour du lịch từ SQLite
 */
import { dbInstance } from '../db/database.js';

export const tourService = {
    async getFeaturedTours(limit = 8) {
        await dbInstance.init();
        const sql = `
            SELECT t.*, a.name AS airline_name, a.logo_url AS airline_logo
            FROM tours t
            JOIN airlines a ON t.airline_id = a.id
            WHERE t.is_featured = 1
            ORDER BY t.id ASC
            LIMIT ?
        `;
        return dbInstance.query(sql, [limit]);
    },

    async getAllTours(filters = {}) {
        await dbInstance.init();
        let sql = `
            SELECT t.*, a.name AS airline_name, a.logo_url AS airline_logo
            FROM tours t
            JOIN airlines a ON t.airline_id = a.id
            WHERE 1=1
        `;
        const params = [];

        if (filters.airlineIds && filters.airlineIds.length > 0) {
            const placeholders = filters.airlineIds.map(() => '?').join(',');
            sql += ` AND t.airline_id IN (${placeholders})`;
            params.push(...filters.airlineIds);
        } else if (filters.airlineId) {
            sql += ` AND t.airline_id = ?`;
            params.push(filters.airlineId);
        }

        if (filters.maxPrice) {
            sql += ` AND t.price <= ?`;
            params.push(filters.maxPrice);
        }

        if (filters.durationDays) {
            sql += ` AND t.duration_days = ?`;
            params.push(filters.durationDays);
        }

        // Sắp xếp
        if (filters.sortBy === 'price_desc') {
            sql += ` ORDER BY t.price DESC`;
        } else if (filters.sortBy === 'duration_desc') {
            sql += ` ORDER BY t.duration_days DESC`;
        } else {
            sql += ` ORDER BY t.price ASC`;
        }

        return dbInstance.query(sql, params);
    },

    async getTourById(id) {
        await dbInstance.init();
        const sql = `
            SELECT t.*, a.name AS airline_name, a.logo_url AS airline_logo
            FROM tours t
            JOIN airlines a ON t.airline_id = a.id
            WHERE t.id = ?
        `;
        return dbInstance.queryOne(sql, [id]);
    },

    async getTourItinerary(tourId) {
        await dbInstance.init();
        const sql = `
            SELECT * FROM tour_itineraries
            WHERE tour_id = ?
            ORDER BY day_number ASC
        `;
        return dbInstance.query(sql, [tourId]);
    }
};
