/**
 * cartService.js - Tầng nghiệp vụ giỏ hàng lưu vào SQLite (đồng bộ LocalStorage)
 */
import { dbInstance } from '../db/database.js';

export const cartService = {
    async getCartItems() {
        await dbInstance.init();
        const rawItems = dbInstance.query('SELECT * FROM cart_items ORDER BY id DESC');
        const enrichedItems = [];

        for (const item of rawItems) {
            if (item.item_type === 'flight') {
                const flight = dbInstance.queryOne(`
                    SELECT f.*, a.name AS airline_name, a.logo_url AS airline_logo,
                           dep.city AS dep_city, arr.city AS arr_city
                    FROM flights f
                    JOIN airlines a ON f.airline_id = a.id
                    JOIN airports dep ON f.departure_airport = dep.code
                    JOIN airports arr ON f.arrival_airport = arr.code
                    WHERE f.id = ?
                `, [item.item_id]);

                if (flight) {
                    const isBusiness = item.ticket_class === 'business';
                    const unitPrice = isBusiness ? flight.price_business : flight.price_economy;
                    enrichedItems.push({
                        ...item,
                        title: `Chuyến bay ${flight.flight_number}: ${flight.dep_city} (${flight.departure_airport}) → ${flight.arr_city} (${flight.arrival_airport})`,
                        subtitle: `${flight.departure_time} - ${flight.arrival_time} | ${flight.aircraft_type}`,
                        airline_name: flight.airline_name,
                        airline_logo: flight.airline_logo,
                        image_url: flight.airline_logo,
                        ticket_class_label: isBusiness ? 'Hạng Thương Gia (SkyBoss)' : 'Hạng Phổ Thông (Eco)',
                        unit_price: unitPrice,
                        subtotal: unitPrice * item.quantity
                    });
                }
            } else if (item.item_type === 'tour') {
                const tour = dbInstance.queryOne(`
                    SELECT t.*, a.name AS airline_name, a.logo_url AS airline_logo
                    FROM tours t
                    JOIN airlines a ON t.airline_id = a.id
                    WHERE t.id = ?
                `, [item.item_id]);

                if (tour) {
                    enrichedItems.push({
                        ...item,
                        title: tour.title,
                        subtitle: `${tour.duration_days}N${tour.duration_nights}Đ | Khởi hành: ${tour.departure_date} | ${tour.destination}`,
                        airline_name: tour.airline_name,
                        airline_logo: tour.airline_logo,
                        image_url: tour.thumbnail_url,
                        ticket_class_label: 'Tour Trọn Gói',
                        unit_price: tour.price,
                        subtotal: tour.price * item.quantity
                    });
                }
            }
        }

        return enrichedItems;
    },

    async addToCart({ itemType, itemId, ticketClass = 'economy', quantity = 1, unitPrice = 0 }) {
        await dbInstance.init();
        // Kiểm tra xem đã có mục tương tự trong giỏ chưa
        const existing = dbInstance.queryOne(`
            SELECT * FROM cart_items 
            WHERE item_type = ? AND item_id = ? AND ticket_class = ?
        `, [itemType, itemId, ticketClass]);

        if (existing) {
            const newQty = existing.quantity + quantity;
            dbInstance.execute(`UPDATE cart_items SET quantity = ? WHERE id = ?`, [newQty, existing.id]);
        } else {
            dbInstance.execute(`
                INSERT INTO cart_items (item_type, item_id, ticket_class, quantity, unit_price)
                VALUES (?, ?, ?, ?, ?)
            `, [itemType, itemId, ticketClass, quantity, unitPrice]);
        }

        // Kích hoạt sự kiện tùy biến để các trang cập nhật badge ngay lập tức
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return true;
    },

    async updateQuantity(cartItemId, newQty) {
        await dbInstance.init();
        if (newQty <= 0) {
            return this.removeFromCart(cartItemId);
        }
        dbInstance.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, cartItemId]);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return true;
    },

    async removeFromCart(cartItemId) {
        await dbInstance.init();
        dbInstance.execute('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return true;
    },

    async clearCart() {
        await dbInstance.init();
        dbInstance.execute('DELETE FROM cart_items');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return true;
    },

    async getCartCount() {
        await dbInstance.init();
        const res = dbInstance.queryOne('SELECT SUM(quantity) as total FROM cart_items');
        return (res && res.total) ? parseInt(res.total, 10) : 0;
    },

    async getCartTotal() {
        const items = await this.getCartItems();
        return items.reduce((sum, item) => sum + item.subtotal, 0);
    }
};
