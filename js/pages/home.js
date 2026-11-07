/**
 * home.js - Logic điều khiển Trang Chủ Vietjet
 */
import { flightService } from '../services/flightService.js';
import { tourService } from '../services/tourService.js';
import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Render Header & Footer
    await renderHeader('home');
    renderFooter();

    // 2. Nạp dữ liệu các sân bay vào Dropdown tìm kiếm
    await initSearchForm();

    // 3. Nạp 8 Tour du lịch nổi bật từ SQLite
    await loadFeaturedTours();

    // 4. Nạp danh sách Hãng hàng không đối tác từ SQLite
    await loadAirlinePartners();
});

async function initSearchForm() {
    try {
        const airports = await flightService.getAirports();
        const fromSelect = document.getElementById('search-from');
        const toSelect = document.getElementById('search-to');

        if (fromSelect && toSelect) {
            fromSelect.innerHTML = airports.map(a => `<option value="${a.code}">${a.city} (${a.code}) - ${a.name}</option>`).join('');
            toSelect.innerHTML = airports.map(a => `<option value="${a.code}">${a.city} (${a.code}) - ${a.name}</option>`).join('');

            // Mặc định: Điểm đi SGN, Điểm đến HAN
            fromSelect.value = 'SGN';
            toSelect.value = 'HAN';
        }

        // Xử lý nút Swap đảo chiều
        const swapBtn = document.getElementById('swap-airports-btn');
        if (swapBtn) {
            swapBtn.addEventListener('click', () => {
                const temp = fromSelect.value;
                fromSelect.value = toSelect.value;
                toSelect.value = temp;
            });
        }

        // Thiết lập ngày đi & ngày về mặc định
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const depDateInput = document.getElementById('search-dep-date');
        const retDateInput = document.getElementById('search-ret-date');

        if (depDateInput) depDateInput.value = today.toISOString().split('T')[0];
        if (retDateInput) retDateInput.value = nextWeek.toISOString().split('T')[0];

        // Lắng nghe chọn Khứ hồi / Một chiều
        const tripTypeRadios = document.querySelectorAll('input[name="trip_type"]');
        tripTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'oneway') {
                    retDateInput.disabled = true;
                    retDateInput.style.opacity = '0.5';
                } else {
                    retDateInput.disabled = false;
                    retDateInput.style.opacity = '1';
                }
            });
        });

        // Bắt sự kiện submit form tìm kiếm
        const searchForm = document.getElementById('flight-search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const from = fromSelect.value;
                const to = toSelect.value;
                const depDate = depDateInput.value;
                const retDate = retDateInput.value;
                const tripType = document.querySelector('input[name="trip_type"]:checked').value;
                const pax = document.getElementById('search-pax').value;

                if (from === to) {
                    alert('Điểm xuất phát và điểm đến không được trùng nhau!');
                    return;
                }

                // Chuyển hướng sang flights.html
                const params = new URLSearchParams({
                    from,
                    to,
                    dep: depDate,
                    ret: tripType === 'round' ? retDate : '',
                    trip: tripType,
                    pax
                });

                window.location.href = `flights.html?${params.toString()}`;
            });
        }
    } catch (err) {
        console.error('Lỗi khi nạp form tìm kiếm:', err);
    }
}

async function loadFeaturedTours() {
    const container = document.getElementById('featured-tours-list');
    if (!container) return;

    try {
        const tours = await tourService.getFeaturedTours(8);
        if (tours.length === 0) {
            container.innerHTML = `<p class="text-muted text-center" style="grid-column: span 4;">Đang tải danh sách tour...</p>`;
            return;
        }

        container.innerHTML = tours.map(tour => `
            <div class="card tour-card">
                <div class="tour-thumbnail-wrapper">
                    <img src="${tour.thumbnail_url}" alt="${tour.title}" loading="lazy" />
                    <div class="tour-badge-top-left">
                        <span class="badge badge-dark">${tour.duration_days}N${tour.duration_nights}Đ</span>
                    </div>
                    <div class="tour-badge-top-right">
                        <span class="badge badge-primary">${tour.airline_name}</span>
                    </div>
                </div>

                <div class="tour-card-body">
                    <div class="tour-destination">${tour.destination}</div>
                    <h3 class="tour-title" title="${tour.title}">
                        <a href="tour-detail.html?id=${tour.id}">${tour.title}</a>
                    </h3>
                    <div class="tour-meta">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Khởi hành: ${tour.departure_date}</span>
                    </div>

                    <div class="tour-card-footer">
                        <div class="tour-price-box">
                            <span class="price-label">Giá chỉ từ</span>
                            <span class="price-val">${tour.price.toLocaleString('vi-VN')} đ</span>
                        </div>
                        <a href="tour-detail.html?id=${tour.id}" class="btn btn-outline btn-sm">Xem Tour</a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Lỗi khi nạp 8 tour nổi bật:', err);
    }
}

async function loadAirlinePartners() {
    const container = document.getElementById('airline-partners-list');
    if (!container) return;

    try {
        const airlines = await flightService.getAirlines();
        container.innerHTML = airlines.map(airline => `
            <div class="partner-card" onclick="window.location.href='flights.html?airline=${airline.id}'" title="Tìm chuyến bay ${airline.name}">
                <img src="${airline.logo_url}" alt="${airline.name}" class="partner-logo" />
                <div class="partner-info">
                    <h5>${airline.name}</h5>
                    <span>Mã: ${airline.code}</span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Lỗi khi nạp đối tác hãng bay:', err);
    }
}
