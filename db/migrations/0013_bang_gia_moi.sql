-- Cập nhật bảng giá phòng và phân bổ phòng theo trục:
-- - Phòng Đơn (trục 4: 103, 204, 304, 404 — 4 phòng): nghỉ giờ 250.000đ, qua đêm 500.000đ, ngày đêm 700.000đ, phụ trội 50.000đ/giờ, 2 người
-- - Phòng Đơn VIP (trục 1, 5: 101, 104, 201, 205, 301, 305, 401, 405 — 8 phòng): nghỉ giờ 300.000đ, qua đêm 600.000đ, ngày đêm 800.000đ, phụ trội 50.000đ/giờ, 2 người
-- - Phòng Đôi (202, 302, 402 — 3 phòng): nghỉ giờ 350.000đ, qua đêm 700.000đ, ngày đêm 900.000đ, phụ trội 70.000đ/giờ, 3 người
-- - Phòng Đôi 4 người (102, 203, 303, 403 — 4 phòng): nghỉ giờ 400.000đ, qua đêm 800.000đ, ngày đêm 1.000.000đ, phụ trội 70.000đ/giờ, 4 người

UPDATE room_types
SET prices_hourly = 250000,
    prices_overnight = 500000,
    prices_full_day = 700000,
    prices_extra_hour = 50000,
    description = 'Mỗi tầng có một phòng Đơn ở trục 4. Lựa chọn hợp lý khi bạn cần một chỗ nghỉ sạch sẽ, yên tĩnh ở phía Tây Hà Nội.'
WHERE slug = 'don';

UPDATE room_types
SET prices_hourly = 300000,
    prices_overnight = 600000,
    prices_full_day = 800000,
    prices_extra_hour = 50000,
    description = 'Hạng phòng nhiều nhất của F21, nằm ở trục 1 và trục 5 của các tầng. Phù hợp cho cặp đôi nghỉ cuối tuần hoặc khách công tác muốn không gian rộng rãi hơn.'
WHERE slug = 'don-vip';

UPDATE room_types
SET prices_hourly = 350000,
    prices_overnight = 700000,
    prices_full_day = 900000,
    prices_extra_hour = 70000
WHERE slug = 'doi';

UPDATE room_types
SET prices_hourly = 400000,
    prices_overnight = 800000,
    prices_full_day = 1000000,
    prices_extra_hour = 70000
WHERE slug = 'doi-4';

-- Chuyển trục 5 (104, 205, 305, 405) sang Phòng Đơn VIP
UPDATE rooms
SET room_type_id = (SELECT id FROM room_types WHERE slug = 'don-vip')
WHERE number IN ('101', '104', '201', '205', '301', '305', '401', '405');

UPDATE rooms
SET room_type_id = (SELECT id FROM room_types WHERE slug = 'don')
WHERE number IN ('103', '204', '304', '404');

-- Cập nhật giá thấp nhất trong cài đặt chung, trang chủ và ưu đãi
UPDATE site_settings
SET price_from = 500000,
    description = replace(description, '600.000đ', '500.000đ');

UPDATE pages
SET data = replace(
      replace(
        replace(data, '"costValue": "300.000đ"', '"costValue": "250.000đ"'),
        'qua đêm từ 600.000đ',
        'qua đêm từ 500.000đ'
      ),
      '"costValue": "900.000đ"',
      '"costValue": "700.000đ"'
    )
WHERE slug = 'home' AND data IS NOT NULL;

UPDATE pages
SET draft = replace(
      replace(
        replace(draft, '"costValue": "300.000đ"', '"costValue": "250.000đ"'),
        'qua đêm từ 600.000đ',
        'qua đêm từ 500.000đ'
      ),
      '"costValue": "900.000đ"',
      '"costValue": "700.000đ"'
    )
WHERE slug = 'home' AND draft IS NOT NULL;

UPDATE offers_details
SET text = replace(text, 'qua đêm từ 600.000đ', 'qua đêm từ 500.000đ')
WHERE instr(text, 'qua đêm từ 600.000đ') > 0;

UPDATE offers_details
SET text = replace(text, 'Phòng Đơn VIP qua đêm từ 700.000đ', 'Phòng Đơn VIP qua đêm từ 600.000đ')
WHERE instr(text, 'Phòng Đơn VIP qua đêm từ 700.000đ') > 0;

