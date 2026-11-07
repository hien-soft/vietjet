/**
 * tours.js - Logic điều khiển trang Danh Sách Tour & Bộ Lọc Tour
 */
import { tourService } from '../services/tourService.js';
import { flightService } from '../services/flightService.js';
import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';

let currentFilters = {
    airlineIds: [],
    sortBy: 'price_asc',
    durationDays: null
};

document.addEventListener('DOMContentLoaded', async () => {
    await renderHeader('tours');
    renderFooter();

    await initAirlineFilters();
    initFilterEvents();
    await fetchAndRenderTours();
});

async function initAirlineFilters() {
    const container = document.getElementById('filter-tour-airlines');
    if (!container) return;

    try {
        const airlines = await flightService.getAirlines();
        container.innerHTML = airlines.map(a => `
            <label class="form-check">
                <input type="checkbox" name="filter_tour_airline" value="${a.id}">
                <span>${a.name}</span>
            </label>
        `).join('');
    } catch (err) {
        console.error('Lỗi nạp hãng bay tour:', err);
    }
}

function initFilterEvents() {
    // Sắp xếp
    const sortSelect = document.getElementById('filter-tour-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentFilters.sortBy = e.target.value;
            fetchAndRenderTours();
        });
    }

    // Checkbox Hãng hàng không
    const airlinesContainer = document.getElementById('filter-tour-airlines');
    if (airlinesContainer) {
        airlinesContainer.addEventListener('change', () => {
            const checked = Array.from(airlinesContainer.querySelectorAll('input:checked')).map(cb => parseInt(cb.value, 10));
            currentFilters.airlineIds = checked;
            fetchAndRenderTours();
        });
    }

    // Lọc thời lượng tour
    const durationRadios = document.querySelectorAll('input[name="filter_duration"]');
    durationRadios.forEach(r => {
        r.addEventListener('change', (e) => {
            const val = e.target.value;
            currentFilters.durationDays = val === 'all' ? null : parseInt(val, 10);
            fetchAndRenderTours();
        });
    });

    // Nút đặt lại bộ lọc
    const resetBtn = document.getElementById('btn-reset-tour-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentFilters.airlineIds = [];
            currentFilters.sortBy = 'price_asc';
            currentFilters.durationDays = null;

            if (sortSelect) sortSelect.value = 'price_asc';
            document.querySelectorAll('input[name="filter_tour_airline"]').forEach(cb => cb.checked = false);
            document.querySelector('input[name="filter_duration"][value="all"]').checked = true;

            fetchAndRenderTours();
        });
    }
}

async function fetchAndRenderTours() {
    const listEl = document.getElementById('tours-list');
    const countEl = document.getElementById('tours-count-text');
    if (!listEl) return;

    try {
        const tours = await tourService.getAllTours(currentFilters);

        if (countEl) {
            countEl.textContent = `Hiển thị ${tours.length} tour du lịch trọn gói`;
        }

        if (tours.length === 0) {
            listEl.innerHTML = `
                <div class="text-center" style="background:#fff; padding:48px; border-radius:12px; border:1px dashed #dee2e6;">
                    <h3>Không tìm thấy tour phù hợp</h3>
                    <p style="color:#6c757d; margin-top:8px;">Vui lòng điều chỉnh lại tiêu chí lọc.</p>
                </div>
            `;
            return;
        }

        listEl.innerHTML = tours.map(tour => `
            <div class="tour-card-horizontal">
                <!-- Thumbnail 600x400 -->
                <div class="tour-h-thumb-box">
                    <img src="${tour.thumbnail_url}" alt="${tour.title}" loading="lazy" />
                    <span class="badge badge-dark" style="position:absolute; top:12px; left:12px;">
                        ${tour.duration_days}N${tour.duration_nights}Đ
                    </span>
                    <span class="badge badge-primary" style="position:absolute; top:12px; right:12px;">
                        ${tour.airline_name}
                    </span>
                </div>

                <!-- Thông tin tour -->
                <div class="tour-h-info">
                    <span class="destination">${tour.destination}</span>
                    <h3><a href="tour-detail.html?id=${tour.id}">${tour.title}</a></h3>
                    <p>${tour.overview || 'Trải nghiệm du lịch tuyệt hảo, trọn gói vé máy bay, khách sạn 4 sao cao cấp và hướng dẫn viên tận tâm.'}</p>
                    
                    <div class="tour-h-meta-tags">
                        <span class="service-item">✈️ Bay: ${tour.airline_name} (${tour.aircraft_type})</span>
                        <span class="service-item">📅 Khởi hành: ${tour.departure_date}</span>
                        <span class="service-item">🏨 Khách sạn 4-5 sao</span>
                    </div>
                </div>

                <!-- Giá & Nút hành động -->
                <div class="tour-h-price-col">
                    <div>
                        <span class="price-label">Giá trọn gói từ</span>
                        <div class="price-val">${tour.price.toLocaleString('vi-VN')} đ</div>
                        <span style="font-size: 11px; color: #6c757d;">/ khách</span>
                    </div>
                    <a href="tour-detail.html?id=${tour.id}" class="btn btn-primary btn-block">
                        Xem Chi Tiết
                    </a>
                </div>
            </div>
        `).join('');

    } catch (err) {
        console.error('Lỗi tải danh sách tour:', err);
    }
}
