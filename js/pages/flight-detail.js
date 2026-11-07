/**
 * flight-detail.js - Logic điều khiển trang Chi Tiết Chuyến Bay & Chọn Hạng Vé
 */
import { flightService } from '../services/flightService.js';
import { cartService } from '../services/cartService.js';
import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { showToast } from '../components/notification.js';

let currentFlight = null;

document.addEventListener('DOMContentLoaded', async () => {
    await renderHeader('flights');
    renderFooter();

    const urlParams = new URLSearchParams(window.location.search);
    const flightId = parseInt(urlParams.get('id') || '1', 10);

    await loadFlightDetails(flightId);
});

async function loadFlightDetails(id) {
    const container = document.getElementById('flight-detail-content');
    if (!container) return;

    try {
        currentFlight = await flightService.getFlightById(id);
        if (!currentFlight) {
            container.innerHTML = `
                <div class="text-center" style="padding: 60px 0;">
                    <h2>Không tìm thấy chuyến bay yêu cầu</h2>
                    <p style="margin: 16px 0;"><a href="flights.html" class="btn btn-primary">Quay lại danh sách chuyến bay</a></p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <!-- Khối 1: Thông tin tổng quan hành trình -->
            <div class="flight-overview-box">
                <div class="flight-header-info">
                    <div class="airline-badge-large">
                        <img src="${currentFlight.airline_logo}" alt="${currentFlight.airline_name}" />
                        <div>
                            <h2 style="font-size: 1.4rem; margin-bottom: 2px;">${currentFlight.airline_name}</h2>
                            <span style="color: #6c757d; font-weight: 600;">Mã chuyến bay: ${currentFlight.flight_number}</span>
                        </div>
                    </div>
                    <div>
                        <span class="badge ${currentFlight.is_direct ? 'badge-success' : 'badge-primary'}" style="font-size: 14px; padding: 6px 14px;">
                            ${currentFlight.is_direct ? '● Chuyến bay thẳng' : '1 Điểm dừng'}
                        </span>
                    </div>
                </div>

                <!-- Sơ đồ cất cánh - hạ cánh -->
                <div class="journey-display">
                    <div class="journey-point">
                        <div class="time">${currentFlight.departure_time}</div>
                        <div class="airport">${currentFlight.dep_city} (${currentFlight.departure_airport})</div>
                        <div class="terminal">${currentFlight.dep_airport_name}</div>
                    </div>

                    <div class="journey-mid">
                        <div class="duration">${currentFlight.duration}</div>
                        <div class="flight-plane-bar">
                            <span class="plane-icon-center">✈</span>
                        </div>
                        <span style="font-size: 12px; color: #28a745; font-weight: 600; margin-top: 6px; display: inline-block;">Khởi hành đúng giờ</span>
                    </div>

                    <div class="journey-point">
                        <div class="time">${currentFlight.arrival_time}</div>
                        <div class="airport">${currentFlight.arr_city} (${currentFlight.arrival_airport})</div>
                        <div class="terminal">${currentFlight.arr_airport_name}</div>
                    </div>
                </div>

                <!-- Thông số tàu bay & tiện ích -->
                <div class="specs-grid">
                    <div class="spec-item">
                        <span class="spec-icon">✈️</span>
                        <div>
                            <span class="spec-label">Loại máy bay</span>
                            <span class="spec-val">${currentFlight.aircraft_type}</span>
                        </div>
                    </div>
                    <div class="spec-item">
                        <span class="spec-icon">💺</span>
                        <div>
                            <span class="spec-label">Số ghế còn trống</span>
                            <span class="spec-val">${currentFlight.seats_available} chỗ</span>
                        </div>
                    </div>
                    <div class="spec-item">
                        <span class="spec-icon">🛡️</span>
                        <div>
                            <span class="spec-label">Bảo hiểm chuyến bay</span>
                            <span class="spec-val">Bao gồm tiêu chuẩn</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Khối 2: Lựa chọn Hạng Vé (Eco vs SkyBoss) -->
            <div class="ticket-classes-section">
                <div class="section-header" style="text-align: left; margin-bottom: 24px;">
                    <h2>Lựa Chọn Hạng Dịch Vụ</h2>
                    <p>So sánh quyền lợi và chọn giá vé phù hợp nhất với nhu cầu của bạn</p>
                </div>

                <div class="ticket-classes-grid">
                    <!-- HẠNG PHỔ THÔNG (ECO) -->
                    <div class="ticket-class-card economy">
                        <div class="ticket-class-header economy-header">
                            <h3>Hạng Phổ Thông (Eco)</h3>
                            <span class="class-tagline" style="color: #64748b;">Tiết kiệm tối đa - Dịch vụ tiêu chuẩn</span>
                        </div>

                        <div class="ticket-price-display">
                            <span style="font-size: 13px; color: #64748b; display: block;">Giá vé 1 khách</span>
                            <div class="price-num">${currentFlight.price_economy.toLocaleString('vi-VN')} đ</div>
                        </div>

                        <ul class="perks-list">
                            <li><span class="perk-check">✔</span> <strong>07 kg</strong> hành lý xách tay miễn phí</li>
                            <li><span class="perk-cross">✖</span> Hành lý ký gửi: Mua thêm gói cước ưu đãi</li>
                            <li><span class="perk-check">✔</span> Ghế ngồi tiêu chuẩn êm ái, thoải mái</li>
                            <li><span class="perk-cross">✖</span> Phòng chờ thương gia: Không bao gồm</li>
                            <li><span class="perk-cross">✖</span> Ưu tiên làm thủ tục tại sân bay: Không</li>
                            <li><span class="perk-check">✔</span> Suất ăn nhẹ và nước suối tiêu chuẩn</li>
                            <li><span class="perk-cross">✖</span> Thay đổi giờ/ngày bay: Thu phí chênh lệch</li>
                        </ul>

                        <div class="ticket-class-action">
                            <button type="button" id="btn-select-eco" class="btn btn-outline btn-block btn-lg">
                                Chọn Hạng Phổ Thông (Eco)
                            </button>
                        </div>
                    </div>

                    <!-- HẠNG THƯƠNG GIA (SKYBOSS / BUSINESS) -->
                    <div class="ticket-class-card business">
                        <div class="ticket-class-header business-header">
                            <h3>Hạng Thương Gia (SkyBoss)</h3>
                            <span class="class-tagline">Đẳng cấp người dẫn đầu - Trọn gói dịch vụ VIP</span>
                        </div>

                        <div class="ticket-price-display">
                            <span style="font-size: 13px; color: #b45309; display: block;">Giá vé 1 khách</span>
                            <div class="price-num">${currentFlight.price_business.toLocaleString('vi-VN')} đ</div>
                        </div>

                        <ul class="perks-list">
                            <li><span class="perk-check">✔</span> <strong>14 kg</strong> hành lý xách tay (2 kiện)</li>
                            <li><span class="perk-check">✔</span> <strong>30 kg</strong> hành lý ký gửi miễn phí</li>
                            <li><span class="perk-check">✔</span> Miễn phí sử dụng <strong>Phòng chờ Thương Gia (VIP Lounge)</strong></li>
                            <li><span class="perk-check">✔</span> Lối đi ưu tiên làm thủ tục & qua cửa kiểm soát an ninh</li>
                            <li><span class="perk-check">✔</span> Xe đưa đón riêng biệt ra tận cửa máy bay</li>
                            <li><span class="perk-check">✔</span> <strong>Suất ăn nóng cao cấp tự chọn</strong> kèm thức uống đặc biệt</li>
                            <li><span class="perk-check">✔</span> <strong>Miễn phí</strong> đổi ngày bay, giờ bay không giới hạn</li>
                        </ul>

                        <div class="ticket-class-action">
                            <button type="button" id="btn-select-business" class="btn btn-primary btn-block btn-lg" style="background: linear-gradient(135deg, #ee1d23, #ff9800); border: none;">
                                Chọn Hạng Thương Gia (SkyBoss)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Gắn sự kiện nút chọn hạng vé
        document.getElementById('btn-select-eco').addEventListener('click', () => {
            selectTicketClass('economy', currentFlight.price_economy);
        });

        document.getElementById('btn-select-business').addEventListener('click', () => {
            selectTicketClass('business', currentFlight.price_business);
        });

    } catch (err) {
        console.error('Lỗi khi nạp chi tiết chuyến bay:', err);
    }
}

async function selectTicketClass(ticketClass, unitPrice) {
    if (!currentFlight) return;

    try {
        await cartService.addToCart({
            itemType: 'flight',
            itemId: currentFlight.id,
            ticketClass: ticketClass,
            quantity: 1,
            unitPrice: unitPrice
        });

        const classNameLabel = ticketClass === 'business' ? 'Hạng Thương Gia (SkyBoss)' : 'Hạng Phổ Thông (Eco)';
        showToast(`Đã thêm chuyến bay ${currentFlight.flight_number} (${classNameLabel}) vào giỏ hàng!`, 'success');

        // Chuyển hướng tới trang giỏ hàng sau 1 giây
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 800);

    } catch (err) {
        console.error('Lỗi khi thêm vào giỏ hàng:', err);
        showToast('Có lỗi xảy ra khi thêm vào giỏ hàng!', 'error');
    }
}
