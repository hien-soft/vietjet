/**
 * orderService.js - Tầng nghiệp vụ xử lý đặt đơn hàng và lưu vào SQLite
 */
import { dbInstance } from '../db/database.js';
import { cartService } from './cartService.js';

export const orderService = {
    generateBookingCode() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = 'VJ-';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    },

    async createOrder({ customerName, customerEmail, customerPhone, customerIdCard, specialRequests = '' }) {
        await dbInstance.init();
        const cartItems = await cartService.getCartItems();
        if (cartItems.length === 0) {
            throw new Error('Giỏ hàng của bạn đang trống!');
        }

        const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
        const bookingCode = this.generateBookingCode();

        // 1. Thêm vào bảng orders
        dbInstance.execute(`
            INSERT INTO orders (booking_code, customer_name, customer_email, customer_phone, customer_id_card, special_requests, total_amount, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')
        `, [bookingCode, customerName, customerEmail, customerPhone, customerIdCard, specialRequests, totalAmount]);

        const order = dbInstance.queryOne('SELECT * FROM orders WHERE booking_code = ?', [bookingCode]);

        // 2. Thêm vào bảng order_items
        for (const item of cartItems) {
            dbInstance.execute(`
                INSERT INTO order_items (order_id, item_type, item_id, title, ticket_class, quantity, unit_price, subtotal)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [order.id, item.item_type, item.item_id, item.title, item.ticket_class_label || item.ticket_class, item.quantity, item.unit_price, item.subtotal]);
        }

        // 3. Xóa sạch giỏ hàng
        await cartService.clearCart();

        return {
            ...order,
            items: cartItems
        };
    },

    async getOrderByCode(bookingCode) {
        await dbInstance.init();
        const order = dbInstance.queryOne('SELECT * FROM orders WHERE booking_code = ?', [bookingCode]);
        if (!order) return null;
        const items = dbInstance.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
        return {
            ...order,
            items
        };
    }
};
