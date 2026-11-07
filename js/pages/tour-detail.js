/**
 * tour-detail.js - Logic điều khiển trang Chi Tiết Tour & Lịch Trình Từng Ngày
 */
import { tourService } from '../services/tourService.js';
import { cartService } from '../services/cartService.js';
import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { showToast } from '../components/notification.js';

let currentTour = null;
let currentQuantity = 1;

document.addEventListener('DOMContentLoaded', async () => {
    await renderHeader('tours');
    renderFooter();

    const urlParams = new URLSearchParams(window.location.search);
    const tourId = parseInt(urlParams.get('id') || '1', 10);

    await loadTourDetails(tourId);
});

async function loadTourDetails(id) {
    const container = document.getElementById('tour-detail-container');
    if (!container) return;

    try {
        currentTour = await tourService.getTourById(id);
        const itineraries = await tourService.getTourItinerary(id);

        if (!currentTour) {
            container.innerHTML = `
                <div class="text-center" style="padding: 60px 0;">
                    <h2>Không tìm thấy tour du lịch yêu cầu</h2>
                    <p style="margin: 16px 0;"><a href="tours.html" class="btn btn-primary">Xem các tour khác</a></p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="tour-detail-grid">
                
                <!-- CỘT TRÁI: THÔNG TIN TỔNG QUAN & LỊCH TRÌNH -->
                <div class="tour-main-content">
                    <div class="tour-hero-img-box">
                        <img src="${currentTour.thumbnail_url}" alt="${currentTour.title}" />
                    </div>

                    <div class="tour-body-padding">
                        <div class="tour-header-titles">
                            <span class="badge badge-primary" style="margin-bottom: 8px;">
                                ${currentTour.destination}
                            </span>
                            <h1>${currentTour.title}</h1>
                            <p style="color: #6c757d; font-size: 15px; line-height: 1.6;">
                                ${currentTour.overview || 'Hành trình được thiết kế chuyên biệt, mang lại trải nghiệm nghỉ dưỡng và khám phá tối ưu nhất.'}
                            </p>
                        </div>

                        <!-- 4 Thông số chính -->
                        <div class="tour-highlights-grid">
                            <div class="highlight-box">
                                <span class="h-label">Thời lượng</span>
                                <span class="h-val">⏱️ ${currentTour.duration_days}N${currentTour.duration_nights}Đ</span>
                            </div>
                            <div class="highlight-box">
                                <span class="h-label">Hãng hàng không</span>
                                <span class="h-val">✈️ ${currentTour.airline_name}</span>
                            </div>
                            <div class="highlight-box">
                                <span class="h-label">Loại máy bay</span>
                                <span class="h-val">🛫 ${currentTour.aircraft_type}</span>
                            </div>
                            <div class="highlight-box">
                                <span class="h-label">Khởi hành</span>
                                <span class="h-val">📅 ${currentTour.departure_date}</span>
                            </div>
                        </div>

                        <!-- Lịch trình chuyến đi chi tiết -->
                        <div class="itinerary-section">
                            <h2 style="font-size: 1.5rem; margin-bottom: 8px;">Lịch Trình Chuyến Đi Chi Tiết</h2>
                            <p style="color: #6c757d; font-size: 14px;">Hành trình từng ngày được chuẩn bị chu đáo để quý khách có một kỳ nghỉ trọn vẹn nhất</p>

                            <div class="timeline">
                                ${itineraries.length > 0 ? itineraries.map(item => `
                                    <div class="timeline-item">
                                        <div class="timeline-dot"></div>
                                        <div class="timeline-card">
                                            <span class="timeline-day-tag">Ngày ${item.day_number}</span>
                                            <h4>${item.title}</h4>
                                            <p>${item.description}</p>
                                            <div class="timeline-perks">
                                                <span>🍽️ Bữa ăn: <strong>${item.meals || 'Theo lịch trình'}</strong></span>
                                                <span>🏨 Lưu trú: <strong>${item.accommodation || 'Khách sạn 4 sao'}</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                `).join('') : '<p class="text-muted">Đang cập nhật chi tiết các ngày...</p>'}
                            </div>
                        </div>

                        <!-- Dịch vụ bao gồm & không bao gồm -->
                        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #dee2e6;">
                            <h3 style="margin-bottom: 16px;">Chính Sách & Tiện Ích Kèm Theo</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px;">
                                    <h4 style="color: #166534; font-size: 14px; margin-bottom: 8px;">✔ Dịch vụ bao gồm:</h4>
                                    <ul style="font-size: 13px; color: #166534; padding-left: 18px; line-height: 1.6;">
                                        <li>Vé máy bay khứ hồi (Bao gồm 7kg xách tay + 20kg ký gửi)</li>
                                        <li>Khách sạn tiêu chuẩn 4-5 sao (2 khách/phòng)</li>
                                        <li>Xe du lịch máy lạnh đưa đón suốt tuyến</li>
                                        <li>Các bữa ăn theo chương trình</li>
                                        <li>Bảo hiểm du lịch quốc tế/nội địa mức bồi thường cao</li>
                                    </ul>
                                </div>
                                <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 8px;">
                                    <h4 style="color: #991b1b; font-size: 14px; margin-bottom: 8px;">✖ Dịch vụ không bao gồm:</h4>
                                    <ul style="font-size: 13px; color: #991b1b; padding-left: 18px; line-height: 1.6;">
                                        <li>Chi phí cá nhân: giặt ủi, điện thoại, minibar</li>
                                        <li>Tiền bồi dưỡng (Tip) cho HDV và tài xế</li>
                                        <li>Hóa đơn VAT (nếu có yêu cầu xuất hóa đơn đỏ)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- CỘT PHẢI: WIDGET ĐẶT TOUR -->
                <aside class="booking-widget-card">
                    <div class="booking-price-header">
                        <span class="price-label">Giá tour trọn gói 1 khách</span>
                        <div class="price-val">${currentTour.price.toLocaleString('vi-VN')} đ</div>
                    </div>

                    <div class="booking-form-item">
                        <label class="form-label">Ngày khởi hành dự kiến:</label>
                        <div style="font-weight: 700; font-size: 15px; color: #212529;">
                            📅 ${currentTour.departure_date}
                        </div>
                    </div>

                    <div class="booking-form-item">
                        <label class="form-label">Số lượng khách đăng ký:</label>
                        <select id="tour-pax-select" class="form-select">
                            <option value="1">1 Khách</option>
                            <option value="2">2 Khách</option>
                            <option value="3">3 Khách</option>
                            <option value="4">4 Khách</option>
                            <option value="5">5 Khách</option>
                        </select>
                    </div>

                    <div class="booking-total-box">
                        <span>Tổng tiền tạm tính:</span>
                        <span id="booking-total-display" class="total-val">
                            ${currentTour.price.toLocaleString('vi-VN')} đ
                        </span>
                    </div>

                    <button type="button" id="btn-book-tour-now" class="btn btn-primary btn-block btn-lg" style="margin-bottom: 12px;">
                        ĐẶT TOUR NGAY
                    </button>

                    <p style="text-align: center; font-size: 12px; color: #6c757d;">
                        🔒 Đặt chỗ an toàn - Hoàn hủy linh hoạt - Hỗ trợ 24/7
                    </p>
                </aside>

            </div>
        `;

        // Lắng nghe thay đổi số lượng khách
        const paxSelect = document.getElementById('tour-pax-select');
        const totalDisplay = document.getElementById('booking-total-display');

        paxSelect.addEventListener('change', (e) => {
            currentQuantity = parseInt(e.target.value, 10);
            const total = currentTour.price * currentQuantity;
            totalDisplay.textContent = `${total.toLocaleString('vi-VN')} đ`;
        });

        // Bắt sự kiện Đặt tour
        document.getElementById('btn-book-tour-now').addEventListener('click', async () => {
            try {
                await cartService.addToCart({
                    itemType: 'tour',
                    itemId: currentTour.id,
                    ticketClass: 'standard',
                    quantity: currentQuantity,
                    unitPrice: currentTour.price
                });

                showToast(`Đã thêm tour "${currentTour.title}" vào giỏ hàng!`, 'success');

                setTimeout(() => {
                    window.location.href = 'cart.html';
                }, 800);
            } catch (err) {
                console.error('Lỗi khi đặt tour:', err);
                showToast('Lỗi khi thêm tour vào giỏ hàng!', 'error');
            }
        });

    } catch (err) {
        console.error('Lỗi nạp chi tiết tour:', err);
    }
}
