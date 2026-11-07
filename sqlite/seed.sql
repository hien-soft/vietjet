-- ====================================================================
-- DỮ LIỆU KHỞI TẠO MẪU CHO DỰ ÁN VIETJET TRAVEL
-- File: sqlite/seed.sql
-- ====================================================================

-- 1. HÃNG HÀNG KHÔNG (Airlines)
INSERT INTO airlines (id, code, name, logo_url) VALUES 
(1, 'VJ', 'VietJet Air', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/VietJet_Air_logo.svg/320px-VietJet_Air_logo.svg.png'),
(2, 'VN', 'Vietnam Airlines', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Vietnam_Airlines_logo.svg/320px-Vietnam_Airlines_logo.svg.png'),
(3, 'SQ', 'Singapore Airlines', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/320px-Singapore_Airlines_Logo_2.svg.png'),
(4, 'QH', 'Bamboo Airways', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Bamboo_Airways_logo.svg/320px-Bamboo_Airways_logo.svg.png'),
(5, 'QR', 'Qatar Airways', 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/320px-Qatar_Airways_Logo.svg.png');

-- 2. SÂN BAY (Airports)
INSERT INTO airports (code, name, city, country) VALUES
('SGN', 'Sân bay Quốc tế Tân Sơn Nhất', 'TP. Hồ Chí Minh', 'Việt Nam'),
('HAN', 'Sân bay Quốc tế Nội Bài', 'Hà Nội', 'Việt Nam'),
('DAD', 'Sân bay Quốc tế Đà Nẵng', 'Đà Nẵng', 'Việt Nam'),
('CXR', 'Sân bay Quốc tế Cam Ranh', 'Nha Trang', 'Việt Nam'),
('PQC', 'Sân bay Quốc tế Phú Quốc', 'Phú Quốc', 'Việt Nam'),
('SIN', 'Sân bay Quốc tế Changi', 'Singapore', 'Singapore'),
('BKK', 'Sân bay Quốc tế Suvarnabhumi', 'Bangkok', 'Thái Lan');

-- 3. CHUYẾN BAY MẪU (Flights)
INSERT INTO flights (flight_number, airline_id, departure_airport, arrival_airport, departure_time, arrival_time, duration, aircraft_type, price_economy, price_business, seats_available, is_direct, baggage_info, meal_info) VALUES
-- Tuyến SGN -> HAN (Khung giờ sáng sớm 00:00 - 06:00)
('VJ-120', 1, 'SGN', 'HAN', '05:30', '07:40', '2h 10m', 'Airbus A321neo', 1190000, 3690000, 45, 1, '7kg xách tay', 'Suất ăn mua thêm'),
('VN-202', 2, 'SGN', 'HAN', '05:45', '08:00', '2h 15m', 'Airbus A321', 1650000, 4390000, 30, 1, '12kg xách tay + 23kg ký gửi', 'Bữa ăn sáng nhẹ'),

-- Tuyến SGN -> HAN (Khung giờ sáng 06:00 - 12:00)
('VJ-128', 1, 'SGN', 'HAN', '08:15', '10:25', '2h 10m', 'Airbus A321neo', 1450000, 3890000, 32, 1, '7kg xách tay', 'Suất ăn mua thêm'),
('VN-210', 2, 'SGN', 'HAN', '09:00', '11:15', '2h 15m', 'Boeing 787-9 Dreamliner', 1890000, 4850000, 20, 1, '12kg xách tay + 23kg ký gửi', 'Bữa ăn nóng miễn phí'),
('QH-204', 4, 'SGN', 'HAN', '10:30', '12:40', '2h 10m', 'Airbus A320', 1520000, 4100000, 25, 1, '7kg xách tay + 20kg ký gửi', 'Snack & Nước khoáng'),

-- Tuyến SGN -> HAN (Khung giờ chiều 12:00 - 18:00)
('VJ-152', 1, 'SGN', 'HAN', '14:30', '16:40', '2h 10m', 'Airbus A330-300', 1350000, 3750000, 50, 1, '7kg xách tay', 'Suất ăn mua thêm'),
('VN-224', 2, 'SGN', 'HAN', '16:00', '18:15', '2h 15m', 'Airbus A350-900', 1750000, 4590000, 28, 1, '12kg xách tay + 23kg ký gửi', 'Bữa ăn nhẹ miễn phí'),
('QH-218', 4, 'SGN', 'HAN', '17:15', '19:25', '2h 10m', 'Airbus A321neo', 1480000, 3950000, 35, 1, '7kg xách tay + 20kg ký gửi', 'Snack & Nước khoáng'),

-- Tuyến SGN -> HAN (Khung giờ tối 18:00 - 24:00)
('VJ-168', 1, 'SGN', 'HAN', '20:15', '22:25', '2h 10m', 'Airbus A321neo', 1090000, 3490000, 60, 1, '7kg xách tay', 'Suất ăn mua thêm'),
('VN-246', 2, 'SGN', 'HAN', '21:30', '23:45', '2h 15m', 'Boeing 787-9', 1790000, 4690000, 18, 1, '12kg xách tay + 23kg ký gửi', 'Bữa ăn nhẹ miễn phí'),
('VJ-190', 1, 'SGN', 'HAN', '22:45', '00:55', '2h 10m', 'Airbus A321', 990000, 3190000, 70, 1, '7kg xách tay', 'Suất ăn mua thêm'),

-- Tuyến HAN -> SGN (Chiều ngược lại)
('VJ-121', 1, 'HAN', 'SGN', '06:30', '08:40', '2h 10m', 'Airbus A321neo', 1220000, 3690000, 40, 1, '7kg xách tay', 'Suất ăn mua thêm'),
('VN-211', 2, 'HAN', 'SGN', '09:30', '11:45', '2h 15m', 'Boeing 787-9', 1850000, 4800000, 22, 1, '12kg xách tay + 23kg ký gửi', 'Bữa ăn nóng miễn phí'),
('VJ-155', 1, 'HAN', 'SGN', '15:15', '17:25', '2h 10m', 'Airbus A330-300', 1390000, 3790000, 48, 1, '7kg xách tay', 'Suất ăn mua thêm'),
('QH-209', 4, 'HAN', 'SGN', '18:45', '20:55', '2h 10m', 'Airbus A320', 1550000, 4150000, 30, 1, '7kg xách tay + 20kg ký gửi', 'Snack & Nước khoáng'),

-- Tuyến SGN -> DAD (Đà Nẵng)
('VJ-622', 1, 'SGN', 'DAD', '06:45', '08:05', '1h 20m', 'Airbus A320', 890000, 2890000, 40, 1, '7kg xách tay', 'Nước khoáng'),
('VN-112', 2, 'SGN', 'DAD', '10:15', '11:40', '1h 25m', 'Airbus A321', 1350000, 3450000, 25, 1, '12kg xách tay + 23kg ký gửi', 'Snack & Nước ngọt'),
('VJ-628', 1, 'SGN', 'DAD', '15:20', '16:40', '1h 20m', 'Airbus A321neo', 990000, 2990000, 35, 1, '7kg xách tay', 'Nước khoáng'),
('QH-152', 4, 'SGN', 'DAD', '19:10', '20:30', '1h 20m', 'Airbus A320', 1050000, 3100000, 28, 1, '7kg xách tay + 20kg ký gửi', 'Nước khoáng'),

-- Tuyến SGN -> PQC (Phú Quốc)
('VJ-321', 1, 'SGN', 'PQC', '07:30', '08:35', '1h 05m', 'Airbus A321', 790000, 2490000, 55, 1, '7kg xách tay', 'Nước khoáng'),
('VN-1823', 2, 'SGN', 'PQC', '11:00', '12:05', '1h 05m', 'Airbus A321', 1250000, 3100000, 30, 1, '12kg xách tay + 23kg ký gửi', 'Snack & Nước khoáng'),
('VJ-327', 1, 'SGN', 'PQC', '16:20', '17:25', '1h 05m', 'Airbus A320', 850000, 2590000, 45, 1, '7kg xách tay', 'Nước khoáng'),

-- Tuyến SGN -> CXR (Nha Trang)
('VJ-602', 1, 'SGN', 'CXR', '08:00', '09:05', '1h 05m', 'Airbus A320', 750000, 2390000, 42, 1, '7kg xách tay', 'Nước khoáng'),
('VN-1358', 2, 'SGN', 'CXR', '13:15', '14:25', '1h 10m', 'Airbus A321', 1190000, 2990000, 26, 1, '12kg xách tay + 23kg ký gửi', 'Snack & Nước khoáng'),

-- Tuyến Quốc Tế SGN -> SIN (Singapore)
('SQ-178', 3, 'SGN', 'SIN', '09:25', '12:35', '2h 10m', 'Boeing 787-10', 3200000, 8900000, 15, 1, '7kg xách tay + 25kg ký gửi', 'Bữa ăn nóng tiêu chuẩn 5 sao'),
('VJ-813', 1, 'SGN', 'SIN', '13:50', '16:55', '2h 05m', 'Airbus A321neo', 1690000, 4990000, 42, 1, '7kg xách tay', 'Suất ăn mua thêm'),
('SQ-186', 3, 'SGN', 'SIN', '19:40', '22:50', '2h 10m', 'Airbus A350-900', 3450000, 9200000, 12, 1, '7kg xách tay + 25kg ký gửi', 'Bữa ăn nóng tiêu chuẩn 5 sao'),

-- Tuyến Quốc Tế SGN -> BKK (Bangkok)
('VJ-801', 1, 'SGN', 'BKK', '08:45', '10:15', '1h 30m', 'Airbus A321', 1450000, 4200000, 38, 1, '7kg xách tay', 'Nước khoáng'),
('VN-601', 2, 'SGN', 'BKK', '12:20', '13:55', '1h 35m', 'Airbus A321', 2250000, 5800000, 20, 1, '12kg xách tay + 23kg ký gửi', 'Bữa trưa nóng miễn phí'),
('QR-971', 5, 'SGN', 'BKK', '18:10', '19:45', '1h 35m', 'Boeing 777-300ER', 2890000, 7500000, 16, 1, '7kg xách tay + 30kg ký gửi', 'Dịch vụ 5 sao quốc tế');

-- 4. ĐÚNG 8 TOUR DU LỊCH NỔI BẬT TRANG CHỦ (Ảnh chuẩn 600x400)
INSERT INTO tours (id, title, destination, thumbnail_url, airline_id, duration_days, duration_nights, price, departure_date, aircraft_type, is_featured, overview) VALUES
(1, 'Đà Nẵng - Bà Nà Hills - Cầu Vàng - Phố Cổ Hội An', 'Đà Nẵng & Quảng Nam', 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop', 1, 4, 3, 4590000, '2026-11-20', 'Airbus A321neo', 1, 'Khám phá thành phố đáng sống nhất Việt Nam, check-in Cầu Vàng Bà Nà Hills và vẻ đẹp lung linh của Phố cổ Hội An về đêm.'),
(2, 'Phú Quốc - Thiên Đường Đảo Ngọc - Grand World - Cáp Treo Hòn Thơm', 'Kiên Giang', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop', 1, 3, 2, 3890000, '2026-11-22', 'Airbus A321', 1, 'Tận hưởng bãi biển xanh ngắt, chiêm ngưỡng thành phố không ngủ Grand World và trải nghiệm tuyến cáp treo vượt biển dài nhất thế giới.'),
(3, 'Nha Trang - Vịnh San Hô - VinWonders - Tháp Bà Ponagar', 'Khánh Hòa', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop', 1, 4, 3, 4190000, '2026-11-25', 'Airbus A320', 1, 'Hòa mình vào vịnh biển đẹp nhất thế giới, vui chơi thả ga tại VinWonders và khám phá văn hóa Chăm Pa cổ kính.'),
(4, 'Bangkok - Pattaya - Chợ Nổi Bốn Miền - Đảo San Hô Coral', 'Thái Lan', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop', 1, 5, 4, 6990000, '2026-11-28', 'Airbus A321neo', 1, 'Hành trình xứ sở Chùa Vàng khám phá chùa Wat Arun, thành phố không ngủ Pattaya và thưởng thức ẩm thực đường phố đặc sắc.'),
(5, 'Singapore - Công Viên Sư Tử Biển - Gardens by the Bay - Đảo Sentosa', 'Singapore', 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop', 3, 4, 3, 10890000, '2026-12-02', 'Boeing 787-10', 1, 'Khám phá đảo quốc sư tử hiện đại bậc nhất châu Á, chiêm ngưỡng siêu cây ánh sáng tại Gardens by the Bay và Universal Studios.'),
(6, 'Hà Nội - Vịnh Hạ Long - Sapa Fansipan Nóc Nhà Đông Dương', 'Miền Bắc', 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop', 2, 5, 4, 7590000, '2026-12-05', 'Boeing 787-9 Dreamliner', 1, 'Du thuyền trên Vịnh Hạ Long kỳ quan thế giới, săn mây trên đỉnh Fansipan hùng vĩ và trải nghiệm nét đẹp nghìn năm văn hiến Thủ đô.'),
(7, 'Bali - Đảo Thiên Đường - Cổng Trời Lempuyang - Thác Tegenungan', 'Indonesia', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop', 1, 4, 3, 9490000, '2026-12-10', 'Airbus A321', 1, 'Check-in cổng trời Lempuyang huyền thoại, đu xích đu Bali Swing giữa rừng nhiệt đới và ngắm hoàng hôn vịnh Jimbaran.'),
(8, 'Tokyo - Núi Phú Sĩ - Làng Cổ Oshino Hakkai - Tháp Tokyo Skytree', 'Nhật Bản', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&h=400&fit=crop', 2, 6, 5, 26900000, '2026-12-15', 'Airbus A350-900', 1, 'Chiêm ngưỡng núi Phú Sĩ biểu tượng nước Nhật, dạo bước giữa khu phố cổ Asakusa và mua sắm sầm uất tại Shinjuku, Ginza.');

-- 5. LỊCH TRÌNH CHI TIẾT TỪNG NGÀY CHO TOÀN BỘ 8 TOUR

-- Tour 1: Đà Nẵng - Hội An (4N3Đ)
INSERT INTO tour_itineraries (tour_id, day_number, title, description, meals, accommodation) VALUES
(1, 1, 'TP.HCM - Đà Nẵng - Bán Đảo Sơn Trà - Biển Mỹ Khê', 'Xe và HDV đón quý khách tại Sân bay Tân Sơn Nhất đáp chuyến bay Vietjet đi Đà Nẵng. Đến nơi xe đưa quý khách viếng Chùa Linh Ứng Bãi Bụt, ngắm tượng Phật Bà Quan Âm 67m, tự do tắm biển Mỹ Khê.', 'Trưa, Tối', 'Khách sạn 4 sao gần biển'),
(1, 2, 'Khu Du Lịch Bà Nà Hills - Cầu Vàng - Check-in Làng Pháp', 'Khởi hành đi Bà Nà Hills, đi cáp treo đạt 4 kỷ lục thế giới. Dạo bước trên Cầu Vàng độc đáo, tham quan vườn hoa Le Jardin D''Amour, khu hầm rượu cổ Debay và công viên Fantasy Park.', 'Sáng, Trưa buffet, Tối', 'Khách sạn 4 sao trung tâm'),
(1, 3, 'Ngũ Hành Sơn - Làng Đá Mỹ Nghệ Non Nước - Phố Cổ Hội An', 'Tham quan danh thắng Ngũ Hành Sơn, Động Huyền Không. Chiều khởi hành đi Phố Cổ Hội An, dạo bộ ngắm đèn lồng, Chùa Cầu Nhật Bản, nhà cổ Phùng Hưng, thưởng thức Cao Lầu.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao trung tâm'),
(1, 4, 'Chợ Hàn Đà Nẵng - Mua Sắm Đặc Sản - Tiễn Sân Bay Về TP.HCM', 'Quý khách tự do đi dạo, mua sắm hải sản khô, bánh tráng cuốn thịt heo tại Chợ Hàn. Xe đưa đoàn ra Sân bay Đà Nẵng làm thủ tục về lại TP.HCM. Kết thúc chuyến đi tốt đẹp.', 'Sáng, Trưa', 'Về lại TP.HCM');

-- Tour 2: Phú Quốc Đảo Ngọc (3N2Đ)
INSERT INTO tour_itineraries (tour_id, day_number, title, description, meals, accommodation) VALUES
(2, 1, 'TP.HCM - Phú Quốc - Grand World Thành Phố Không Ngủ', 'Đoàn đón chuyến bay sáng đi Phú Quốc. Tham quan Dinh Cậu, Suối Tranh. Buổi chiều khám phá Grand World, xem show diễn Sắc Màu Venice và Tinh Hoa Việt Nam.', 'Trưa, Tối', 'Resort 4 sao sát biển'),
(2, 2, 'Tour Canô 4 Đảo - Cáp Treo Hòn Thơm - Sunset Sanato', 'Trải nghiệm canô tham quan Hòn Mây Rút, Hòn Gầm Ghì lặn ngắm san hô. Đi tuyến cáp treo vượt biển 3 dây Hòn Thơm, ngắm hoàng hôn tuyệt đẹp tại Sunset Sanato.', 'Sáng, Trưa hải sản, Tối', 'Resort 4 sao sát biển'),
(2, 3, 'Nhà Tù Phú Quốc - Vườn Tiêu - Mua Sắm - Tiễn Bay', 'Tham quan di tích lịch sử Nhà tù Phú Quốc, cơ sở nuôi cấy ngọc trai cao cấp và xưởng sản xuất nước mắm truyền thống. Xe đưa đoàn ra sân bay về lại TP.HCM.', 'Sáng, Trưa', 'Về lại TP.HCM');

-- Tour 3: Nha Trang (4N3Đ)
INSERT INTO tour_itineraries (tour_id, day_number, title, description, meals, accommodation) VALUES
(3, 1, 'TP.HCM - Nha Trang - Tháp Bà Ponagar - Tắm Bùn Khoáng', 'Đáp chuyến bay Vietjet đến Sân bay Cam Ranh. Xe đưa đoàn tham quan Tháp Bà Ponagar kiến trúc Chăm cổ kính, trải nghiệm dịch vụ ngâm bùn khoáng nóng thư giãn.', 'Trưa, Tối', 'Khách sạn 4 sao đường Trần Phú'),
(3, 2, 'Du Ngoạn Vịnh Nha Trang - Lặn Ngắm San Hô Hòn Mun', 'Lên canô cao tốc khám phá Vịnh Nha Trang, ngắm san hô tại Hòn Mun, dùng bữa trưa trên bè nổi hải sản tươi sống tại Làng Chài.', 'Sáng, Trưa hải sản, Tối', 'Khách sạn 4 sao đường Trần Phú'),
(3, 3, 'Thiên Đường Giải Trí VinWonders Nha Trang', 'Cả ngày vui chơi thả ga tại VinWonders: công viên nước, vịnh phao nổi, khu trò chơi mạo hiểm và thủy cung hiện đại nhất Đông Nam Á.', 'Sáng, Tối', 'Khách sạn 4 sao đường Trần Phú'),
(3, 4, 'Chợ Đầm Nha Trang - Tiễn Sân Bay Về Lại TP.HCM', 'Mua sắm đặc sản yến sào, mực rim me tại Chợ Đầm. Xe đưa đoàn ra Sân bay Cam Ranh đáp chuyến bay về TP.HCM.', 'Sáng, Trưa', 'Về lại TP.HCM');

-- Tour 4: Bangkok - Pattaya (5N4Đ)
INSERT INTO tour_itineraries (tour_id, day_number, title, description, meals, accommodation) VALUES
(4, 1, 'TP.HCM - Bangkok - Thành Phố Biển Pattaya', 'Bay Vietjet thẳng tới Sân bay Suvarnabhumi Bangkok. Xe đón đoàn di chuyển xuống thành phố biển Pattaya náo nhiệt, thưởng thức bữa tối lẩu Suki.', 'Tối', 'Khách sạn 4 sao Pattaya'),
(4, 2, 'Đảo San Hô Coral Island - Trân Bảo Phật Sơn Khao Chi Chan', 'Đi canô cao tốc ra đảo Coral tắm biển và tham gia dù lượn, lặn biển. Chiều viếng Trân Bảo Phật Sơn khắc vàng trên vách núi đá.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao Pattaya'),
(4, 3, 'Pattaya - Chợ Nổi Bốn Miền - Về Lại Bangkok', 'Khám phá chợ nổi 4 miền đặc sắc của Thái Lan. Khởi hành về Bangkok, tham quan Trung tâm nghiên cứu Rắn độc hoàng gia.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao Bangkok'),
(4, 4, 'Chùa Thuyền Wat Yannawa - Dạo Thuyền Sông Chao Phraya - Mua Sắm', 'Dạo thuyền ngắm sông Chao Phraya huyền thoại, chiêm bái Chùa Bình Minh Wat Arun, tự do mua sắm tại Siam Paragon và IconSiam.', 'Sáng, Trưa buffet Baiyoke Sky, Tối tự túc', 'Khách sạn 4 sao Bangkok'),
(4, 5, 'Chùa Phật Vàng Wat Traimit - Tiễn Sân Bay Về TP.HCM', 'Chiêm bái tượng Phật Vàng nguyên khối nặng 5.5 tấn tại Wat Traimit. Xe đưa đoàn ra sân bay về lại Việt Nam.', 'Sáng', 'Về lại TP.HCM');

-- Tour 5: Singapore - Đảo Sentosa (4N3Đ)
INSERT INTO tour_itineraries (tour_id, day_number, title, description, meals, accommodation) VALUES
(5, 1, 'TP.HCM - Singapore - Công Viên Sư Tử Biển Merlion Park', 'Đáp chuyến bay tới Sân bay Changi - sân bay tốt nhất thế giới. Tham quan thác nước Jewel Changi, Công viên Sư tử biển Merlion biểu tượng Singapore.', 'Tối', 'Khách sạn 4 sao Singapore'),
(5, 2, 'Gardens by the Bay - Đỉnh Đồi Faber - Khu Du Lịch Sentosa', 'Chiêm ngưỡng khu vườn năng lượng Gardens by the Bay với Flower Dome và Cloud Forest. Sang đảo Sentosa check-in Universal Studios.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao Singapore'),
(5, 3, 'Chùa Răng Phật - Phố Cổ Chinatown - Phố Haji Lane', 'Viếng Chùa Răng Phật tại Chinatown, dạo bước giữa con phố tranh tường nghệ thuật Haji Lane và mua sắm sầm uất trên đường Orchard.', 'Sáng, Trưa buffet BBQ Hàn Quốc, Tối', 'Khách sạn 4 sao Singapore'),
(5, 4, 'Tự Do Mua Sắm Sân Bay Changi - Bay Về TP.HCM', 'Tự do dạo chơi, mua sắm đồ miễn thuế tại Changi Airport. Đáp chuyến bay về lại TP.HCM.', 'Sáng', 'Về lại TP.HCM');

-- Tour 6: Hà Nội - Vịnh Hạ Long - Sapa (5N4Đ)
INSERT INTO tour_itineraries (tour_id, day_number, title, description, meals, accommodation) VALUES
(6, 1, 'TP.HCM - Hà Nội - Hồ Hoàn Kiếm - 36 Phố Phường', 'Bay từ Tân Sơn Nhất ra Sân bay Nội Bài. Dạo quanh Hồ Gươm, viếng Đền Ngọc Sơn, thưởng thức kem Tràng Tiền và cà phê trứng phố cổ.', 'Trưa, Tối', 'Khách sạn 4 sao phố cổ Hà Nội'),
(6, 2, 'Hà Nội - Du Thuyền Vịnh Hạ Long - Hang Sửng Sốt', 'Khởi hành đi Hạ Long, lên du thuyền thưởng ngoạn kỳ quan thế giới, khám phá Hang Sửng Sốt và chèo thuyền Kayak tại Đảo Ti Tốp.', 'Sáng, Trưa hải sản trên tàu, Tối', 'Khách sạn 4 sao Bãi Cháy'),
(6, 3, 'Hạ Long - Cao Tốc Nội Bài - Thị Trấn Sương Mờ Sapa', 'Xe đưa đoàn theo đường cao tốc lên thẳng thị trấn Sapa. Chiều dạo bộ tham quan Nhà thờ Đá Sapa và bản Cát Cát của người H''Mông.', 'Sáng, Trưa, Tối lẩu cá hồi Sapa', 'Khách sạn 4 sao Sapa'),
(6, 4, 'Chinh Phục Đỉnh Fansipan 3.143m Nóc Nhà Đông Dương', 'Đi cáp treo lên đỉnh Fansipan, chiêm bái Đại tượng Phật A Di Đà bằng đồng và ngắm toàn cảnh thung lũng Mường Hoa bồng bềnh mây trắng.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao Sapa'),
(6, 5, 'Sapa - Lào Cai - Sân Bay Nội Bài - Về Lại TP.HCM', 'Mua sắm đặc sản măng khô, nấm hương tại chợ Sapa. Xe đưa đoàn về Sân bay Nội Bài đáp chuyến bay tối về lại TP.HCM.', 'Sáng, Trưa', 'Về lại TP.HCM');

-- Tour 7: Bali - Indonesia (4N3Đ)
INSERT INTO tour_itineraries (tour_id, day_number, title, description, meals, accommodation) VALUES
(7, 1, 'TP.HCM - Bali - Ngắm Hoàng Hôn Bãi Biển Jimbaran', 'Đáp chuyến bay đi Bali, xe đón đoàn về nhận phòng khách sạn. Buổi tối thưởng thức tiệc BBQ hải sản nướng bên bãi biển Jimbaran lãng mạn.', 'Tối BBQ hải sản', 'Resort 4 sao Bali'),
(7, 2, 'Cổng Trời Đền Lempuyang - Thủy Cung Tirta Gangga', 'Check-in Cổng trời Lempuyang hùng vĩ hướng thẳng ra núi lửa Agung, tham quan cung điện nước Tirta Gangga với đàn cá Koi rực rỡ.', 'Sáng, Trưa, Tối', 'Resort 4 sao Bali'),
(7, 3, 'Trải Nghiệm Bali Swing - Rừng Khỉ Ubud - Đền Tanah Lot', 'Trải nghiệm xích đu Bali Swing giữa rừng dừa xanh ngát, ngắm ruộng bậc thang Tegalalang. Chiều ngắm hoàng hôn huyền ảo tại đền Tanah Lot trên biển.', 'Sáng, Trưa, Tối', 'Resort 4 sao Bali'),
(7, 4, 'Tự Do Mua Sắm Chợ Nghệ Thuật Ubud - Bay Về TP.HCM', 'Tự do mua sắm đồ thủ công mỹ nghệ, tinh dầu thảo mộc tại Ubud. Xe tiễn sân bay quốc tế Ngurah Rai về lại TP.HCM.', 'Sáng', 'Về lại TP.HCM');

-- Tour 8: Tokyo - Núi Phú Sĩ - Nhật Bản (6N5Đ)
INSERT INTO tour_itineraries (tour_id, day_number, title, description, meals, accommodation) VALUES
(8, 1, 'TP.HCM - Sân Bay Narita Tokyo', 'Quý khách tập trung tại Tân Sơn Nhất, làm thủ tục đáp chuyến bay thẳng đi Tokyo. Nghỉ đêm trên máy bay.', 'Ăn nhẹ trên máy bay', 'Nghỉ đêm máy bay'),
(8, 2, 'Tokyo - Chùa Cổ Asakusa Kannon - Tháp Tokyo Skytree', 'Đến sân bay Narita, tham quan ngôi chùa cổ nhất Tokyo Asakusa Kannon, dạo phố Nakamise, chụp ảnh tháp Tokyo Skytree.', 'Trưa, Tối bò Wagyu', 'Khách sạn 4 sao Tokyo'),
(8, 3, 'Tokyo - Núi Phú Sĩ - Làng Cổ Oshino Hakkai', 'Khởi hành đi Núi Phú Sĩ, biểu tượng bất diệt của đất nước mặt trời mọc (lên trạm số 5 nếu thời tiết thuận lợi). Tham quan làng cổ Oshino Hakkai yên bình.', 'Sáng, Trưa, Tối cua tuyết & tắm Onsen', 'Resort Onsen Phú Sĩ'),
(8, 4, 'Hồ Kawaguchiko - Mua Sắm Gotemba Premium Outlets', 'Ngắm cảnh hồ Kawaguchiko thơ mộng, thỏa sức mua sắm hàng hiệu giảm giá tại Gotemba Outlets lớn nhất Nhật Bản.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao Tokyo'),
(8, 5, 'Khu Phố Điện Tử Akihabara - Quảng Trường Shibuya', 'Khám phá thiên đường anime điện tử Akihabara, check-in giao lộ Shibuya đông đúc nhất thế giới và tượng chú chó trung thành Hachiko.', 'Sáng, Trưa sushi băng chuyền, Tối', 'Khách sạn 4 sao Tokyo'),
(8, 6, 'Hoàng Cung Tokyo - Sân Bay Narita - Về Lại TP.HCM', 'Dạo bước ngắm cầu Nijubashi tại Hoàng cung Tokyo. Xe đưa đoàn ra sân bay Narita đón chuyến bay về lại TP.HCM.', 'Sáng, Trưa', 'Về lại TP.HCM');
