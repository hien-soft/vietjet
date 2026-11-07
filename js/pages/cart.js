/**
 * cart.js - Logic điều khiển Giỏ Hàng, Form Thông Tin Khách Hàng, Đặt Chỗ & Gửi Email
 */
import { cartService } from '../services/cartService.js';
import { orderService } from '../services/orderService.js';
import { emailService } from '../services/emailService.js';
import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { showToast, showSuccessModal } from '../components/notification.js';

let currentCartItems = [];

document.addEventListener('DOMContentLoaded', async () => {
    await renderHeader('cart');
    renderFooter();

    await loadAndRenderCart();
    initCheckoutForm();
});

async function loadAndRenderCart() {
    const tableContainer = document.getElementById('cart-table-container');
    const emptyState = document.getElementById('cart-empty-state');
    const checkoutSection = document.getElementById('checkout-form-section');
    const summaryCard = document.getElementById('cart-summary-card');

    try {
        currentCartItems = await cartService.getCartItems();

        if (currentCartItems.length === 0) {
            if (tableContainer) tableContainer.classList.add('d-none');
            if (checkoutSection) checkoutSection.classList.add('d-none');
            if (summaryCard) summaryCard.classList.add('d-none');
            if (emptyState) emptyState.classList.remove('d-none');
            return;
        }

        if (emptyState) emptyState.classList.add('d-none');
        if (tableContainer) tableContainer.classList.remove('d-none');
        if (checkoutSection) checkoutSection.classList.remove('d-none');
        if (summaryCard) summaryCard.classList.remove('d-none');

        // Render danh sách trong bảng
        const tbody = document.getElementById('cart-items-tbody');
        if (tbody) {
            tbody.innerHTML = currentCartItems.map(item => `
                <tr>
                    <td>
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-sub">${item.subtitle}</div>
                        <span class="badge ${item.ticket_class === 'business' ? 'badge-business' : 'badge-eco'}" style="margin-top: 4px;">
                            ${item.ticket_class_label}
                        </span>
                    </td>
                    <td>
                        <div class="cart-quantity-box">
                            <button type="button" class="cart-qty-btn btn-qty-minus" data-id="${item.id}" data-qty="${item.quantity}">-</button>
                            <span class="cart-qty-val">${item.quantity}</span>
                            <button type="button" class="cart-qty-btn btn-qty-plus" data-id="${item.id}" data-qty="${item.quantity}">+</button>
                        </div>
                    </td>
                    <td>
                        <div style="font-size: 14px; font-weight: 600;">
                            ${item.unit_price.toLocaleString('vi-VN')} đ
                        </div>
                    </td>
                    <td>
                        <div class="cart-item-price">
                            ${item.subtotal.toLocaleString('vi-VN')} đ
                        </div>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn-remove-item" data-id="${item.id}" title="Xóa mục này">
                            🗑️
                        </button>
                    </td>
                </tr>
            `).join('');

            attachCartActionEvents();
        }

        // Cập nhật tổng tiền
        updateSummaryCosts();

    } catch (err) {
        console.error('Lỗi khi nạp giỏ hàng:', err);
    }
}

function attachCartActionEvents() {
    // Tăng số lượng
    document.querySelectorAll('.btn-qty-plus').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.dataset.id, 10);
            const currentQty = parseInt(e.target.dataset.qty, 10);
            await cartService.updateQuantity(id, currentQty + 1);
            await loadAndRenderCart();
        });
    });

    // Giảm số lượng
    document.querySelectorAll('.btn-qty-minus').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.dataset.id, 10);
            const currentQty = parseInt(e.target.dataset.qty, 10);
            await cartService.updateQuantity(id, currentQty - 1);
            await loadAndRenderCart();
        });
    });

    // Xóa từng mục
    document.querySelectorAll('.btn-remove-item').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.closest('button').dataset.id, 10);
            if (confirm('Bạn có chắc chắn muốn xóa mục này khỏi giỏ hàng?')) {
                await cartService.removeFromCart(id);
                showToast('Đã xóa dịch vụ khỏi giỏ hàng', 'success');
                await loadAndRenderCart();
            }
        });
    });

    // Nút Xóa toàn bộ giỏ hàng
    const clearBtn = document.getElementById('btn-clear-cart');
    if (clearBtn) {
        clearBtn.onclick = async () => {
            if (confirm('Bạn có chắc chắn muốn xóa tất cả vé và tour trong giỏ hàng?')) {
                await cartService.clearCart();
                showToast('Đã làm trống giỏ hàng', 'success');
                await loadAndRenderCart();
            }
        };
    }
}

function updateSummaryCosts() {
    const subtotal = currentCartItems.reduce((sum, item) => sum + item.subtotal, 0);
    // Thuế & Phí sân bay tượng trưng (ước tính 10% hoặc 0)
    const taxes = Math.round(subtotal * 0.08);
    const total = subtotal + taxes;

    const subtotalEl = document.getElementById('summary-subtotal');
    const taxEl = document.getElementById('summary-tax');
    const totalEl = document.getElementById('summary-grand-total');

    if (subtotalEl) subtotalEl.textContent = `${subtotal.toLocaleString('vi-VN')} đ`;
    if (taxEl) taxEl.textContent = `${taxes.toLocaleString('vi-VN')} đ`;
    if (totalEl) totalEl.textContent = `${total.toLocaleString('vi-VN')} đ`;
}

function initCheckoutForm() {
    const form = document.getElementById('customer-booking-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (currentCartItems.length === 0) {
            showToast('Giỏ hàng đang trống!', 'error');
            return;
        }

        const customerName = document.getElementById('cust-name').value.trim();
        const customerPhone = document.getElementById('cust-phone').value.trim();
        const customerEmail = document.getElementById('cust-email').value.trim();
        const customerIdCard = document.getElementById('cust-id-card').value.trim();
        const specialRequests = document.getElementById('cust-notes').value.trim();

        // 1. Validate số điện thoại (10 chữ số)
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(customerPhone)) {
            alert('Vui lòng nhập đúng định dạng số điện thoại Việt Nam (10 chữ số)!');
            return;
        }

        // 2. Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerEmail)) {
            alert('Vui lòng nhập đúng định dạng email hợp lệ!');
            return;
        }

        const submitBtn = document.getElementById('btn-submit-order');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang xử lý đặt chỗ & gửi email...';
        }

        try {
            // 3. Tạo đơn hàng và lưu vào SQLite
            const order = await orderService.createOrder({
                customerName,
                customerEmail,
                customerPhone,
                customerIdCard,
                specialRequests
            });

            console.log('✅ Đã lưu đơn hàng thành công vào SQLite:', order);

            // 4. Kích hoạt gửi email qua EmailJS từ nvhai061993@gmail.com
            await emailService.sendBookingConfirmation(order);

            // 5. Hiển thị Modal hoàn thành đơn hàng
            showSuccessModal({
                bookingCode: order.booking_code,
                customerName: order.customer_name,
                customerEmail: order.customer_email,
                totalAmount: order.total_amount
            });

            // 6. Làm mới lại giao diện giỏ hàng
            await loadAndRenderCart();

        } catch (err) {
            console.error('Lỗi khi hoàn tất đơn hàng:', err);
            alert(`Lỗi: ${err.message || 'Không thể tạo đơn hàng, vui lòng thử lại!'}`);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'XÁC NHẬN ĐĂNG KÝ & ĐẶT CHỖ';
            }
        }
    });
}
