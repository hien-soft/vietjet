/**
 * footer.js - Render chân trang dùng chung cho toàn bộ website
 */
export function renderFooter() {
    const footerEl = document.getElementById('site-footer');
    if (!footerEl) return;

    footerEl.className = 'site-footer';
    footerEl.innerHTML = `
        <div class="container">
            <div class="grid grid-cols-4 gap-6">
                <div>
                    <h4>Vietjet Travel Portal</h4>
                    <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 16px;">
                        Hệ thống đặt vé máy bay và tour du lịch trực tuyến hàng đầu, mang đến những hành trình bay an toàn, tiết kiệm và trọn vẹn niềm vui.
                    </p>
                    <p style="font-size: 13px; color: #9ca3af;">
                        <strong>Hỗ trợ:</strong> nvhai061993@gmail.com
                    </p>
                </div>

                <div>
                    <h4>Dịch Vụ Nổi Bật</h4>
                    <ul>
                        <li><a href="flights.html">Vé máy bay nội địa</a></li>
                        <li><a href="flights.html">Vé máy bay quốc tế</a></li>
                        <li><a href="tours.html">Tour du lịch trọn gói</a></li>
                        <li><a href="flights.html?class=business">Hạng vé SkyBoss thương gia</a></li>
                    </ul>
                </div>

                <div>
                    <h4>Đối Tác Hàng Không</h4>
                    <ul>
                        <li><a href="flights.html?airline=1">VietJet Air</a></li>
                        <li><a href="flights.html?airline=2">Vietnam Airlines</a></li>
                        <li><a href="flights.html?airline=3">Singapore Airlines</a></li>
                        <li><a href="flights.html?airline=4">Bamboo Airways</a></li>
                        <li><a href="flights.html?airline=5">Qatar Airways</a></li>
                    </ul>
                </div>

                <div>
                    <h4>Chăm Sóc Khách Hàng</h4>
                    <ul>
                        <li>Tổng đài: <strong>1900 1886</strong> (24/7)</li>
                        <li>Email: <a href="mailto:nvhai061993@gmail.com">nvhai061993@gmail.com</a></li>
                        <li><a href="admin.html" style="color: #ffc107; font-weight: 600;">⚙️ Trang Quản Trị (Admin)</a></li>
                        <li>Chính sách hoàn / đổi vé</li>
                        <li>Điều khoản dịch vụ & bảo mật</li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>© 2026 Vietjet Travel Portal. Pure Frontend Edition with SQLite in Browser. All rights reserved.</p>
            </div>
        </div>
    `;
}
