/**
 * notification.js - Tiện ích hiển thị Toast và Modal hoàn tất đặt vé
 */

export function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
    toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${type === 'success' ? '#28a745' : '#ee1d23'}" stroke-width="2">
            ${type === 'success' 
                ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
                : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
            }
        </svg>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

export function showSuccessModal({ bookingCode, customerName, customerEmail, totalAmount }) {
    let modalEl = document.getElementById('success-booking-modal');
    if (!modalEl) {
        modalEl = document.createElement('div');
        modalEl.id = 'success-booking-modal';
        modalEl.className = 'modal-backdrop';
        document.body.appendChild(modalEl);
    }

    modalEl.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon-success">✔</div>
            <h2 style="color: #212529; margin-bottom: 8px;">ĐẶT CHỖ THÀNH CÔNG!</h2>
            <p style="color: #495057; font-size: 15px;">
                Cảm ơn quý khách <strong>${customerName}</strong> đã tin tưởng lựa chọn dịch vụ của Vietjet.
            </p>

            <div style="margin: 16px 0;">
                <span style="font-size: 13px; color: #6c757d;">Mã Đặt Chỗ (Booking Code):</span>
                <div class="booking-code-box">${bookingCode}</div>
            </div>

            <div style="background: #f8f9fa; border-radius: 8px; padding: 14px; text-align: left; margin-bottom: 20px; font-size: 14px;">
                <div style="margin-bottom: 6px;"><strong>Tổng thanh toán:</strong> <span style="color: #ee1d23; font-weight: 700; font-size: 16px;">${totalAmount.toLocaleString('vi-VN')} đ</span></div>
                <div style="margin-bottom: 6px;"><strong>Email nhận vé:</strong> ${customerEmail}</div>
                <div style="color: #28a745; font-size: 13px; display: flex; align-items: center; gap: 6px; margin-top: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>Một email xác nhận đã được gửi từ <strong>nvhai061993@gmail.com</strong> tới hộp thư của bạn!</span>
                </div>
            </div>

            <div class="flex gap-3 justify-center">
                <a href="index.html" class="btn btn-primary" style="flex: 1;">Về Trang Chủ</a>
                <button type="button" id="close-modal-btn" class="btn btn-secondary" style="flex: 1;">Đóng</button>
            </div>
        </div>
    `;

    modalEl.classList.add('show');

    document.getElementById('close-modal-btn').onclick = () => {
        modalEl.classList.remove('show');
    };
}
