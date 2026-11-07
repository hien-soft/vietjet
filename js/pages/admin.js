/**
 * admin.js - Logic điều khiển trang Quản Trị Viên (Admin Portal)
 */
import { adminService } from '../services/adminService.js';
import { flightService } from '../services/flightService.js';
import { dbInstance } from '../db/database.js';
import { showToast } from '../components/notification.js';

let currentTab = 'dashboard';
let cachedAirlines = [];
let cachedAirports = [];

document.addEventListener('DOMContentLoaded', async () => {
    await dbInstance.init();
    cachedAirlines = await flightService.getAirlines();
    cachedAirports = await flightService.getAirports();

    initNavigation();
    initModals();
    initBackupTab();
    await switchTab('dashboard');
});

// ==========================================
// 1. CHUYỂN ĐỔI TAB QUẢN TRỊ
// ==========================================
function initNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', async () => {
            const tabName = item.dataset.tab;
            if (tabName) {
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                await switchTab(tabName);
            }
        });
    });

    // Quick export DB button trên topbar
    const quickExportBtn = document.getElementById('btn-quick-export');
    if (quickExportBtn) {
        quickExportBtn.addEventListener('click', () => {
            dbInstance.exportDatabaseFile('vietjet.db');
            showToast('Đã xuất file vietjet.db thành công!', 'success');
        });
    }
}

async function switchTab(tabName) {
    currentTab = tabName;
    const views = document.querySelectorAll('.admin-view');
    views.forEach(v => v.classList.add('d-none'));

    const activeView = document.getElementById(`view-${tabName}`);
    if (activeView) activeView.classList.remove('d-none');

    const titleEl = document.getElementById('admin-page-title');

    switch (tabName) {
        case 'dashboard':
            if (titleEl) titleEl.textContent = 'Bảng Điều Khiển Tổng Quan';
            await loadDashboard();
            break;
        case 'flights':
            if (titleEl) titleEl.textContent = 'Quản Lý Chuyến Bay';
            await loadFlights();
            break;
        case 'tours':
            if (titleEl) titleEl.textContent = 'Quản Lý Tour Du Lịch';
            await loadTours();
            break;
        case 'orders':
            if (titleEl) titleEl.textContent = 'Quản Lý Đơn Đặt Chỗ';
            await loadOrders();
            break;
        case 'backup':
            if (titleEl) titleEl.textContent = 'Sao Lưu & Khôi Phục CSDL';
            break;
    }
}

// ==========================================
// 2. DASHBOARD
// ==========================================
async function loadDashboard() {
    try {
        const stats = await adminService.getDashboardStats();
        document.getElementById('stat-flights').textContent = stats.flightCount;
        document.getElementById('stat-tours').textContent = stats.tourCount;
        document.getElementById('stat-orders').textContent = stats.orderCount;
        document.getElementById('stat-revenue').textContent = `${stats.revenue.toLocaleString('vi-VN')} đ`;

        // Nạp các đơn hàng mới nhất
        const orders = await adminService.getAllOrders();
        const recentTbody = document.getElementById('recent-orders-tbody');
        if (recentTbody) {
            if (orders.length === 0) {
                recentTbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding: 24px;">Chưa có đơn hàng nào được tạo.</td></tr>`;
                return;
            }
            recentTbody.innerHTML = orders.slice(0, 5).map(o => `
                <tr>
                    <td><strong>${o.booking_code}</strong></td>
                    <td>${o.customer_name}</td>
                    <td>${o.customer_phone}</td>
                    <td><strong class="text-primary">${o.total_amount.toLocaleString('vi-VN')} đ</strong></td>
                    <td><span class="badge-status ${o.status.toLowerCase()}">${o.status}</span></td>
                    <td>${o.created_at || 'Mới đặt'}</td>
                </tr>
            `).join('');
        }
    } catch (e) {
        console.error('Lỗi load dashboard:', e);
    }
}

// ==========================================
// 3. QUẢN LÝ CHUYẾN BAY (FLIGHTS)
// ==========================================
async function loadFlights() {
    const tbody = document.getElementById('flights-table-tbody');
    if (!tbody) return;

    try {
        const flights = await adminService.getAllFlights();
        document.getElementById('flights-count-badge').textContent = `${flights.length} chuyến bay`;

        tbody.innerHTML = flights.map(f => `
            <tr>
                <td><strong>${f.flight_number}</strong></td>
                <td>
                    <div class="flex items-center gap-2">
                        <span>${f.airline_name}</span>
                    </div>
                </td>
                <td><strong>${f.departure_airport}</strong> (${f.dep_city}) → <strong>${f.arrival_airport}</strong> (${f.arr_city})</td>
                <td>${f.departure_time} - ${f.arrival_time} (${f.duration})</td>
                <td>${f.aircraft_type}</td>
                <td>
                    <div style="font-size: 13px;">Eco: <strong>${f.price_economy.toLocaleString('vi-VN')} đ</strong></div>
                    <div style="font-size: 13px; color: #b45309;">SkyBoss: <strong>${f.price_business.toLocaleString('vi-VN')} đ</strong></div>
                </td>
                <td>${f.is_direct ? '<span class="text-success font-semibold">Bay thẳng</span>' : 'Quá cảnh'}</td>
                <td>
                    <div class="flex gap-1">
                        <button class="btn-icon btn-edit-flight" data-id="${f.id}" title="Chỉnh sửa">✏️</button>
                        <button class="btn-icon delete btn-delete-flight" data-id="${f.id}" title="Xóa">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Gắn sự kiện sửa
        document.querySelectorAll('.btn-edit-flight').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.dataset.id, 10);
                const flight = await flightService.getFlightById(id);
                openFlightModal(flight);
            });
        });

        // Gắn sự kiện xóa
        document.querySelectorAll('.btn-delete-flight').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.dataset.id, 10);
                if (confirm('Bạn có chắc chắn muốn xóa chuyến bay này?')) {
                    await adminService.deleteFlight(id);
                    showToast('Đã xóa chuyến bay thành công!', 'success');
                    await loadFlights();
                }
            });
        });

    } catch (e) {
        console.error('Lỗi load flights:', e);
    }
}

function openFlightModal(flight = null) {
    const modal = document.getElementById('flight-modal');
    const form = document.getElementById('flight-form');
    const titleEl = document.getElementById('flight-modal-title');

    // Nạp dropdown hãng bay & sân bay
    const airlineSelect = document.getElementById('fl-airline');
    const fromSelect = document.getElementById('fl-from');
    const toSelect = document.getElementById('fl-to');

    airlineSelect.innerHTML = cachedAirlines.map(a => `<option value="${a.id}">${a.name} (${a.code})</option>`).join('');
    fromSelect.innerHTML = cachedAirports.map(a => `<option value="${a.code}">${a.city} (${a.code})</option>`).join('');
    toSelect.innerHTML = cachedAirports.map(a => `<option value="${a.code}">${a.city} (${a.code})</option>`).join('');

    if (flight) {
        titleEl.textContent = `Chỉnh Sửa Chuyến Bay: ${flight.flight_number}`;
        document.getElementById('fl-id').value = flight.id;
        document.getElementById('fl-number').value = flight.flight_number;
        airlineSelect.value = flight.airline_id;
        fromSelect.value = flight.departure_airport;
        toSelect.value = flight.arrival_airport;
        document.getElementById('fl-dep-time').value = flight.departure_time;
        document.getElementById('fl-arr-time').value = flight.arrival_time;
        document.getElementById('fl-duration').value = flight.duration;
        document.getElementById('fl-aircraft').value = flight.aircraft_type;
        document.getElementById('fl-price-eco').value = flight.price_economy;
        document.getElementById('fl-price-bus').value = flight.price_business;
        document.getElementById('fl-seats').value = flight.seats_available;
        document.getElementById('fl-direct').checked = flight.is_direct === 1;
        document.getElementById('fl-baggage').value = flight.baggage_info || '';
        document.getElementById('fl-meal').value = flight.meal_info || '';
    } else {
        titleEl.textContent = 'Thêm Chuyến Bay Mới';
        form.reset();
        document.getElementById('fl-id').value = '';
        fromSelect.value = 'SGN';
        toSelect.value = 'HAN';
        document.getElementById('fl-direct').checked = true;
    }

    modal.classList.add('show');
}

// ==========================================
// 4. QUẢN LÝ TOUR DU LỊCH (TOURS)
// ==========================================
async function loadTours() {
    const tbody = document.getElementById('tours-table-tbody');
    if (!tbody) return;

    try {
        const tours = await adminService.getAllTours();
        document.getElementById('tours-count-badge').textContent = `${tours.length} tour`;

        tbody.innerHTML = tours.map(t => `
            <tr>
                <td>
                    <img src="${t.thumbnail_url}" style="width: 80px; height: 53px; object-fit: cover; border-radius: 6px;" />
                </td>
                <td>
                    <strong>${t.title}</strong>
                    <div style="font-size: 12px; color: #64748b;">${t.destination}</div>
                </td>
                <td>${t.airline_name}</td>
                <td>${t.duration_days}N${t.duration_nights}Đ</td>
                <td><strong class="text-primary">${t.price.toLocaleString('vi-VN')} đ</strong></td>
                <td>${t.departure_date}</td>
                <td>
                    ${t.is_featured 
                        ? '<span class="badge badge-primary">⭐ Nổi bật (Trang chủ)</span>' 
                        : '<span class="text-muted" style="font-size: 12px;">Thường</span>'
                    }
                </td>
                <td>
                    <div class="flex gap-1">
                        <button class="btn-icon btn-edit-tour" data-id="${t.id}" title="Chỉnh sửa">✏️</button>
                        <button class="btn-icon delete btn-delete-tour" data-id="${t.id}" title="Xóa">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Sửa tour
        document.querySelectorAll('.btn-edit-tour').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.dataset.id, 10);
                const tour = await adminService.getAllTours().then(tList => tList.find(t => t.id === id));
                openTourModal(tour);
            });
        });

        // Xóa tour
        document.querySelectorAll('.btn-delete-tour').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.dataset.id, 10);
                if (confirm('Bạn có chắc chắn muốn xóa tour du lịch này? Toàn bộ lịch trình tour cũng sẽ bị xóa.')) {
                    await adminService.deleteTour(id);
                    showToast('Đã xóa tour thành công!', 'success');
                    await loadTours();
                }
            });
        });

    } catch (e) {
        console.error('Lỗi load tours:', e);
    }
}

function openTourModal(tour = null) {
    const modal = document.getElementById('tour-modal');
    const form = document.getElementById('tour-form');
    const titleEl = document.getElementById('tour-modal-title');

    const airlineSelect = document.getElementById('tour-airline');
    airlineSelect.innerHTML = cachedAirlines.map(a => `<option value="${a.id}">${a.name}</option>`).join('');

    if (tour) {
        titleEl.textContent = `Chỉnh Sửa Tour: ${tour.title}`;
        document.getElementById('tour-id').value = tour.id;
        document.getElementById('tour-title').value = tour.title;
        document.getElementById('tour-destination').value = tour.destination;
        document.getElementById('tour-thumb').value = tour.thumbnail_url;
        airlineSelect.value = tour.airline_id;
        document.getElementById('tour-days').value = tour.duration_days;
        document.getElementById('tour-nights').value = tour.duration_nights;
        document.getElementById('tour-price').value = tour.price;
        document.getElementById('tour-date').value = tour.departure_date;
        document.getElementById('tour-aircraft').value = tour.aircraft_type;
        document.getElementById('tour-featured').checked = tour.is_featured === 1;
        document.getElementById('tour-overview').value = tour.overview || '';
    } else {
        titleEl.textContent = 'Thêm Tour Du Lịch Mới';
        form.reset();
        document.getElementById('tour-id').value = '';
        document.getElementById('tour-days').value = 4;
        document.getElementById('tour-nights').value = 3;
        document.getElementById('tour-featured').checked = true;
    }

    modal.classList.add('show');
}

// ==========================================
// 5. QUẢN LÝ ĐƠN HÀNG (ORDERS)
// ==========================================
async function loadOrders() {
    const tbody = document.getElementById('orders-table-tbody');
    if (!tbody) return;

    try {
        const orders = await adminService.getAllOrders();
        document.getElementById('orders-count-badge').textContent = `${orders.length} đơn hàng`;

        tbody.innerHTML = orders.map(o => `
            <tr>
                <td><strong>${o.booking_code}</strong></td>
                <td>
                    <strong>${o.customer_name}</strong>
                    <div style="font-size: 12px; color: #64748b;">${o.customer_email} | ${o.customer_phone}</div>
                </td>
                <td>${o.customer_id_card}</td>
                <td><strong class="text-primary">${o.total_amount.toLocaleString('vi-VN')} đ</strong></td>
                <td>
                    <select class="form-select order-status-select" data-id="${o.id}" style="height: 32px; padding: 2px 8px; font-size: 13px; width: 140px;">
                        <option value="CONFIRMED" ${o.status === 'CONFIRMED' ? 'selected' : ''}>CONFIRMED</option>
                        <option value="COMPLETED" ${o.status === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
                        <option value="CANCELLED" ${o.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
                    </select>
                </td>
                <td>${o.created_at || 'Mới đặt'}</td>
                <td>
                    <div class="flex gap-1">
                        <button class="btn-icon btn-view-order" data-id="${o.id}" title="Xem chi tiết đơn">👁️</button>
                        <button class="btn-icon delete btn-delete-order" data-id="${o.id}" title="Xóa đơn">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Đổi trạng thái đơn hàng
        document.querySelectorAll('.order-status-select').forEach(sel => {
            sel.addEventListener('change', async (e) => {
                const id = parseInt(sel.dataset.id, 10);
                await adminService.updateOrderStatus(id, e.target.value);
                showToast(`Đã cập nhật trạng thái đơn sang ${e.target.value}`, 'success');
            });
        });

        // Xem chi tiết đơn hàng
        document.querySelectorAll('.btn-view-order').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.dataset.id, 10);
                const order = await adminService.getOrderDetails(id);
                openOrderModal(order);
            });
        });

        // Xóa đơn hàng
        document.querySelectorAll('.btn-delete-order').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.dataset.id, 10);
                if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này khỏi cơ sở dữ liệu?')) {
                    await adminService.deleteOrder(id);
                    showToast('Đã xóa đơn hàng thành công!', 'success');
                    await loadOrders();
                }
            });
        });

    } catch (e) {
        console.error('Lỗi load orders:', e);
    }
}

function openOrderModal(order) {
    const modal = document.getElementById('order-detail-modal');
    if (!order || !modal) return;

    document.getElementById('modal-order-code').textContent = order.booking_code;
    document.getElementById('modal-order-customer').textContent = `${order.customer_name} (${order.customer_phone} - ${order.customer_email})`;
    document.getElementById('modal-order-idcard').textContent = order.customer_id_card;
    document.getElementById('modal-order-notes').textContent = order.special_requests || 'Không có';
    document.getElementById('modal-order-total').textContent = `${order.total_amount.toLocaleString('vi-VN')} đ`;

    const itemsContainer = document.getElementById('modal-order-items-list');
    itemsContainer.innerHTML = order.items.map((item, idx) => `
        <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 8px; border: 1px solid #e2e8f0;">
            <div style="font-weight: 700; font-size: 14px;">${idx + 1}. ${item.title}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
                Loại vé/Hạng: <strong>${item.ticket_class || 'Tiêu chuẩn'}</strong> | Số lượng: <strong>${item.quantity}</strong> | Đơn giá: <strong>${item.unit_price.toLocaleString('vi-VN')} đ</strong>
            </div>
            <div style="text-align: right; font-weight: 700; color: #ee1d23; margin-top: 4px;">
                Thành tiền: ${item.subtotal.toLocaleString('vi-VN')} đ
            </div>
        </div>
    `).join('');

    modal.classList.add('show');
}

// ==========================================
// 6. KHỞI TẠO CÁC MODAL THÊM / SỬA
// ==========================================
function initModals() {
    // Nút mở modal thêm chuyến bay
    const btnAddFlight = document.getElementById('btn-add-flight');
    if (btnAddFlight) {
        btnAddFlight.addEventListener('click', () => openFlightModal(null));
    }

    // Nút mở modal thêm tour
    const btnAddTour = document.getElementById('btn-add-tour');
    if (btnAddTour) {
        btnAddTour.addEventListener('click', () => openTourModal(null));
    }

    // Đóng tất cả modal
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.admin-modal-backdrop').forEach(m => m.classList.remove('show'));
        });
    });

    // Form chuyến bay submit
    const flightForm = document.getElementById('flight-form');
    if (flightForm) {
        flightForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idVal = document.getElementById('fl-id').value;
            const flightData = {
                id: idVal ? parseInt(idVal, 10) : null,
                flight_number: document.getElementById('fl-number').value.trim(),
                airline_id: parseInt(document.getElementById('fl-airline').value, 10),
                departure_airport: document.getElementById('fl-from').value,
                arrival_airport: document.getElementById('fl-to').value,
                departure_time: document.getElementById('fl-dep-time').value,
                arrival_time: document.getElementById('fl-arr-time').value,
                duration: document.getElementById('fl-duration').value.trim(),
                aircraft_type: document.getElementById('fl-aircraft').value.trim(),
                price_economy: parseInt(document.getElementById('fl-price-eco').value, 10),
                price_business: parseInt(document.getElementById('fl-price-bus').value, 10),
                seats_available: parseInt(document.getElementById('fl-seats').value, 10),
                is_direct: document.getElementById('fl-direct').checked ? 1 : 0,
                baggage_info: document.getElementById('fl-baggage').value.trim(),
                meal_info: document.getElementById('fl-meal').value.trim()
            };

            await adminService.saveFlight(flightData);
            showToast('Lưu chuyến bay thành công!', 'success');
            document.getElementById('flight-modal').classList.remove('show');
            await loadFlights();
        });
    }

    // Form tour submit
    const tourForm = document.getElementById('tour-form');
    if (tourForm) {
        tourForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idVal = document.getElementById('tour-id').value;
            const tourData = {
                id: idVal ? parseInt(idVal, 10) : null,
                title: document.getElementById('tour-title').value.trim(),
                destination: document.getElementById('tour-destination').value.trim(),
                thumbnail_url: document.getElementById('tour-thumb').value.trim(),
                airline_id: parseInt(document.getElementById('tour-airline').value, 10),
                duration_days: parseInt(document.getElementById('tour-days').value, 10),
                duration_nights: parseInt(document.getElementById('tour-nights').value, 10),
                price: parseInt(document.getElementById('tour-price').value, 10),
                departure_date: document.getElementById('tour-date').value,
                aircraft_type: document.getElementById('tour-aircraft').value.trim(),
                is_featured: document.getElementById('tour-featured').checked ? 1 : 0,
                overview: document.getElementById('tour-overview').value.trim()
            };

            await adminService.saveTour(tourData);
            showToast('Lưu tour du lịch thành công!', 'success');
            document.getElementById('tour-modal').classList.remove('show');
            await loadTours();
        });
    }
}

// ==========================================
// 7. SAO LƯU & KHÔI PHỤC CSDL SQLITE
// ==========================================
function initBackupTab() {
    // Xuất file .db
    const exportBtn = document.getElementById('btn-export-db');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            dbInstance.exportDatabaseFile('vietjet.db');
            showToast('Đã xuất và tải file vietjet.db về máy!', 'success');
        });
    }

    // Nhập file .db
    const fileInput = document.getElementById('db-file-input');
    const importBtn = document.getElementById('btn-import-db');
    if (importBtn && fileInput) {
        importBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (confirm(`Bạn có chắc chắn muốn nạp file CSDL "${file.name}"? Dữ liệu hiện tại trong trình duyệt sẽ được thay thế hoàn toàn.`)) {
                try {
                    await dbInstance.importDatabaseFile(file);
                    showToast('Nạp cơ sở dữ liệu SQLite thành công!', 'success');
                    await switchTab('dashboard');
                } catch (err) {
                    alert('Lỗi nạp database: ' + err.message);
                }
            }
        });
    }

    // Khôi phục mặc định
    const resetBtn = document.getElementById('btn-reset-db');
    if (resetBtn) {
        resetBtn.addEventListener('click', async () => {
            if (confirm('CẢNH BÁO: Thao tác này sẽ xóa toàn bộ các đơn hàng và thay đổi bạn vừa tạo, trở về dữ liệu gốc ban đầu. Bạn có muốn tiếp tục?')) {
                await dbInstance.resetDatabase();
                showToast('Đã khôi phục CSDL về trạng thái ban đầu!', 'success');
                await switchTab('dashboard');
            }
        });
    }
}
