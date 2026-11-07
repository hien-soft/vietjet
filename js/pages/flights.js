/**
 * flights.js - Logic điều khiển trang Danh Sách Chuyến Bay & Bộ Lọc
 */
import { flightService } from '../services/flightService.js';
import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';

let currentFilters = {
    from: '',
    to: '',
    airlineIds: [],
    timeSlots: [],
    directOnly: false,
    sortBy: 'price_asc',
    ticketClass: 'all'
};

document.addEventListener('DOMContentLoaded', async () => {
    await renderHeader('flights');
    renderFooter();

    // 1. Phân tích Query Parameters từ URL
    parseUrlParams();

    // 2. Khởi tạo danh sách Hãng bay vào Bộ lọc Sidebar
    await initAirlineCheckboxes();

    // 3. Gắn sự kiện lắng nghe bộ lọc
    initFilterEvents();

    // 4. Tìm kiếm & hiển thị chuyến bay
    await fetchAndRenderFlights();
});

function parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    currentFilters.from = urlParams.get('from') || '';
    currentFilters.to = urlParams.get('to') || '';
    
    const airlineParam = urlParams.get('airline');
    if (airlineParam) {
        currentFilters.airlineIds = [parseInt(airlineParam, 10)];
    }

    const classParam = urlParams.get('class');
    if (classParam) {
        currentFilters.ticketClass = classParam;
    }
}

async function initAirlineCheckboxes() {
    const container = document.getElementById('filter-airlines-list');
    if (!container) return;

    try {
        const airlines = await flightService.getAirlines();
        container.innerHTML = airlines.map(a => {
            const isChecked = currentFilters.airlineIds.includes(a.id);
            return `
                <label class="form-check">
                    <input type="checkbox" name="filter_airline" value="${a.id}" ${isChecked ? 'checked' : ''}>
                    <span>${a.name} (${a.code})</span>
                </label>
            `;
        }).join('');
    } catch (err) {
        console.error('Lỗi khi nạp hãng bay vào filter:', err);
    }
}

function initFilterEvents() {
    // Sắp xếp
    const sortSelect = document.getElementById('filter-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentFilters.sortBy = e.target.value;
            fetchAndRenderFlights();
        });
    }

    // Checkbox Hãng hàng không
    const airlinesContainer = document.getElementById('filter-airlines-list');
    if (airlinesContainer) {
        airlinesContainer.addEventListener('change', () => {
            const checked = Array.from(airlinesContainer.querySelectorAll('input:checked')).map(cb => parseInt(cb.value, 10));
            currentFilters.airlineIds = checked;
            fetchAndRenderFlights();
        });
    }

    // Checkbox Bay thẳng
    const directCheck = document.getElementById('filter-direct-only');
    if (directCheck) {
        directCheck.addEventListener('change', (e) => {
            currentFilters.directOnly = e.target.checked;
            fetchAndRenderFlights();
        });
    }

    // Checkbox Khung giờ cất cánh
    const timeCheckboxes = document.querySelectorAll('input[name="filter_time"]');
    timeCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            currentFilters.timeSlots = Array.from(document.querySelectorAll('input[name="filter_time"]:checked')).map(c => c.value);
            fetchAndRenderFlights();
        });
    });

    // Checkbox Hạng dịch vụ
    const classRadios = document.querySelectorAll('input[name="filter_class"]');
    classRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentFilters.ticketClass = e.target.value;
            fetchAndRenderFlights();
        });
    });

    // Nút đặt lại bộ lọc
    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentFilters.airlineIds = [];
            currentFilters.timeSlots = [];
            currentFilters.directOnly = false;
            currentFilters.sortBy = 'price_asc';
            currentFilters.ticketClass = 'all';

            // Reset UI
            if (sortSelect) sortSelect.value = 'price_asc';
            if (directCheck) directCheck.checked = false;
            document.querySelectorAll('input[name="filter_airline"]').forEach(cb => cb.checked = false);
            document.querySelectorAll('input[name="filter_time"]').forEach(cb => cb.checked = false);
            document.querySelector('input[name="filter_class"][value="all"]').checked = true;

            fetchAndRenderFlights();
        });
    }
}

async function fetchAndRenderFlights() {
    const listEl = document.getElementById('flights-list');
    const summaryRouteEl = document.getElementById('summary-route-text');
    const summaryCountEl = document.getElementById('summary-count-text');

    if (!listEl) return;

    try {
        const flights = await flightService.searchFlights(currentFilters);

        // Hiển thị tóm tắt chặng bay
        if (summaryRouteEl) {
            if (currentFilters.from && currentFilters.to) {
                summaryRouteEl.textContent = `Chặng bay: ${currentFilters.from} → ${currentFilters.to}`;
            } else {
                summaryRouteEl.textContent = `Tất cả chuyến bay đang mở bán`;
            }
        }
        if (summaryCountEl) {
            summaryCountEl.textContent = `Tìm thấy ${flights.length} chuyến bay phù hợp`;
        }

        if (flights.length === 0) {
            listEl.innerHTML = `
                <div class="no-flights-box">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="1.5" style="margin: 0 auto 12px;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    <h3>Không tìm thấy chuyến bay phù hợp</h3>
                    <p style="color: #6c757d; margin-top: 6px;">Vui lòng thử bỏ bớt bộ lọc hoặc chọn chặng bay khác.</p>
                </div>
            `;
            return;
        }

        listEl.innerHTML = flights.map(flight => {
            const displayPrice = currentFilters.ticketClass === 'business' ? flight.price_business : flight.price_economy;
            return `
                <div class="flight-card-horizontal">
                    <!-- Cột 1: Hãng bay & Mã hiệu -->
                    <div class="airline-col">
                        <img src="${flight.airline_logo}" alt="${flight.airline_name}" class="airline-thumb" />
                        <div class="airline-details">
                            <h4>${flight.airline_name}</h4>
                            <span class="flight-no">${flight.flight_number}</span>
                            <span class="aircraft-tag">${flight.aircraft_type}</span>
                        </div>
                    </div>

                    <!-- Cột 2: Lịch trình & Thời gian -->
                    <div>
                        <div class="schedule-col">
                            <div class="time-box">
                                <div class="time-val">${flight.departure_time}</div>
                                <div class="airport-code">${flight.departure_airport} (${flight.dep_city})</div>
                            </div>

                            <div class="duration-line-box">
                                <span class="duration-text">${flight.duration}</span>
                                <div class="flight-line">
                                    <span class="flight-line-plane">✈</span>
                                </div>
                                <span class="direct-tag">${flight.is_direct ? '● Bay thẳng' : '1 Điểm dừng'}</span>
                            </div>

                            <div class="time-box">
                                <div class="time-val">${flight.arrival_time}</div>
                                <div class="airport-code">${flight.arrival_airport} (${flight.arr_city})</div>
                            </div>
                        </div>

                        <div class="services-tags">
                            <span class="service-item">🧳 ${flight.baggage_info}</span>
                            <span class="service-item">🍽️ ${flight.meal_info}</span>
                        </div>
                    </div>

                    <!-- Cột 3: Giá & Đặt vé -->
                    <div class="price-action-col">
                        <div>
                            <span class="price-label">Giá chỉ từ</span>
                            <div class="price-amount">${displayPrice.toLocaleString('vi-VN')} đ</div>
                        </div>
                        <a href="flight-detail.html?id=${flight.id}" class="btn btn-primary btn-sm" style="margin-top: 4px;">
                            Chọn Chuyến Bay
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Lỗi khi tải danh sách chuyến bay:', err);
    }
}
