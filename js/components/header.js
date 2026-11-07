/**
 * header.js - Render thanh điều hướng chung và cập nhật Badge số lượng giỏ hàng
 */
import { cartService } from '../services/cartService.js';

export async function renderHeader(activePage = 'home') {
    const headerEl = document.getElementById('site-header');
    if (!headerEl) return;

    headerEl.className = 'site-header';
    headerEl.innerHTML = `
        <div class="container header-inner">
            <a href="index.html" class="site-logo">
                <img src="images/Logo.jpg" alt="Vietjet Logo" />
            </a>

            <nav class="main-nav">
                <a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Trang Chủ</a>
                <a href="flights.html" class="${activePage === 'flights' ? 'active' : ''}">Chuyến Bay</a>
                <a href="tours.html" class="${activePage === 'tours' ? 'active' : ''}">Tour Du Lịch</a>
                <a href="admin.html" class="${activePage === 'admin' ? 'active' : ''}">Quản Trị</a>
            </nav>

            <div class="header-actions">
                <div class="hotline-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>1900 1886</span>
                </div>

                <a href="cart.html" class="cart-icon-btn ${activePage === 'cart' ? 'active' : ''}" title="Xem giỏ hàng">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span id="header-cart-badge" class="cart-badge d-none">0</span>
                </a>
            </div>
        </div>
    `;

    // Cập nhật số lượng trên Badge
    await updateCartBadge();

    // Lắng nghe sự kiện cập nhật giỏ hàng từ bất kỳ đâu
    window.addEventListener('cartUpdated', () => {
        updateCartBadge();
    });
}

export async function updateCartBadge() {
    const badgeEl = document.getElementById('header-cart-badge');
    if (!badgeEl) return;
    try {
        const count = await cartService.getCartCount();
        if (count > 0) {
            badgeEl.textContent = count > 99 ? '99+' : count;
            badgeEl.classList.remove('d-none');
        } else {
            badgeEl.classList.add('d-none');
        }
    } catch (e) {
        console.warn('Lỗi khi cập nhật cart badge:', e);
    }
}
