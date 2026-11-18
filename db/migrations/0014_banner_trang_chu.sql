-- Banner trang chủ (18/11/2026)
-- - Slide 1: 250.000đ là giá 2 giờ đầu, không phải mỗi giờ → ghi rõ "Nghỉ giờ từ (2 giờ đầu)"
-- - Slide 2: "Ngày đêm từ" đang ghi 500.000đ (đó là giá qua đêm); ngày đêm thấp nhất là 700.000đ
-- - Slide 4: sự kiện 10Fest (7–8/11/2026) đã qua → thay bằng slide phòng nhóm 3–4 người (Phòng Đôi qua đêm từ 700.000đ)
-- - Ưu đãi 10Fest hết hạn → tắt (ẩn khỏi /uu-dai, mã 10FEST không còn giảm giá)
-- Mỗi câu UPDATE chỉ chạy khi nội dung vẫn đúng như trước, để không đè lên chỉnh sửa mới trong CMS.

UPDATE pages
SET data = json_set(data, '$.content[0].props.slides[0].costLabel', 'Nghỉ giờ từ (2 giờ đầu) · qua đêm từ 500.000đ')
WHERE slug = 'home'
  AND json_extract(data, '$.content[0].type') = 'Hero'
  AND json_extract(data, '$.content[0].props.slides[0].costLabel') = 'Theo giờ từ · qua đêm từ 500.000đ';

UPDATE pages
SET data = json_set(data, '$.content[0].props.slides[1].costValue', '700.000đ')
WHERE slug = 'home'
  AND json_extract(data, '$.content[0].type') = 'Hero'
  AND json_extract(data, '$.content[0].props.slides[1].costLabel') LIKE 'Ngày đêm từ%'
  AND json_extract(data, '$.content[0].props.slides[1].costValue') = '500.000đ';

UPDATE pages
SET data = json_set(data,
    '$.content[0].props.slides[3].kicker', 'Đi nhóm, đi gia đình',
    '$.content[0].props.slides[3].bold', 'Phòng nhóm',
    '$.content[0].props.slides[3].light', 'cho 3–4 người',
    '$.content[0].props.slides[3].sub', 'Phòng Đôi cho 3 người, Phòng Đôi 4 người cho cả nhóm ở chung một phòng',
    '$.content[0].props.slides[3].costValue', '700.000đ',
    '$.content[0].props.slides[3].costLabel', 'Qua đêm từ · phòng 3–4 người',
    '$.content[0].props.slides[3].costHref', '/phong',
    '$.content[0].props.slides[3].bookLabel', 'Xem phòng',
    '$.content[0].props.slides[3].bookHref', '/phong')
WHERE slug = 'home'
  AND json_extract(data, '$.content[0].type') = 'Hero'
  AND json_extract(data, '$.content[0].props.slides[3].costValue') = '10FEST';

UPDATE offers SET active = 0 WHERE slug = 'su-kien-my-dinh' AND code = '10FEST';

INSERT INTO audit_logs (user_id, action, target, doc_id, title)
VALUES (null, 'update', 'pages', 'home', 'Banner trang chủ: sửa giá, thay slide 10Fest đã hết hạn');
