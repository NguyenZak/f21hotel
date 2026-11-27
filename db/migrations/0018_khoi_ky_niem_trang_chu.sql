-- Trang chủ (27/11/2026): thêm khối "Phòng trang trí cho ngày kỷ niệm" ngay sau khối Phòng & giá.
-- Dùng khối Giới thiệu (ảnh vòm bên phải, nút "Xem gói trang trí"); sửa trong CMS › Dựng trang › Trang chủ.
-- Chỉ chạy khi trang chủ chưa có khối Intro-2 (chạy lại không thêm lần nữa).
-- Cùng lúc bỏ ô "1–2 ngày / Báo trước" trên slide kỷ niệm của banner (ô giá để trống thì ẩn).

UPDATE pages
SET data = json_set(data, '$.content', (
  SELECT json_group_array(json(v)) FROM (
    SELECT CAST(key AS REAL) AS k, value AS v FROM json_each(pages.data, '$.content')
    UNION ALL
    SELECT (
      SELECT CAST(key AS REAL) + 0.5 FROM json_each(pages.data, '$.content')
      WHERE json_extract(value, '$.type') = 'Rooms' ORDER BY key LIMIT 1
    ), json_object(
      'type', 'Intro',
      'props', json_object(
        'id', 'Intro-2',
        'anchor', 'ky-niem',
        'background', '',
        'media', 'photo',
        'mediaSide', 'right',
        'photos', json_array(
          json_object('photo', json_object('src', '/img/anh/ky-niem-vom-1.webp', 'alt', 'Giường trang trí chữ LOVE, bóng bay đỏ bạc phủ trần', 'w', 900, 'h', 1200)),
          json_object('photo', json_object('src', '/img/anh/ky-niem-vom-2.webp', 'alt', 'Chữ LOVE và bóng bay đỏ trên giường rải cánh hoa hồng', 'w', 900, 'h', 1200)),
          json_object('photo', json_object('src', '/img/anh/ky-niem-vom-3.webp', 'alt', 'Chữ LOVE đèn LED, chùm bóng tim và lịch ngày kỷ niệm trên bàn trang điểm', 'w', 900, 'h', 1200)),
          json_object('photo', json_object('src', '/img/anh/ky-niem-vom-4.webp', 'alt', 'Bóng bay phủ trần phòng Đơn VIP, bồn tắm sau vách kính', 'w', 900, 'h', 1200))
        ),
        'badgeValue', '',
        'badgeLabel', '',
        'eyebrow', 'Dành cho cặp đôi',
        'title', 'Phòng trang trí cho ngày kỷ niệm',
        'lead', 'Hai bạn chọn ngày, F21 trang trí xong trước giờ nhận phòng.',
        'text', 'Bóng bay đỏ, bạc phủ kín trần, chùm bóng tim đầu giường, chữ LOVE đèn LED, hoa hồng rải giường và lịch để bàn lật đúng ngày của hai bạn. Ảnh chụp thật tại F21.',
        'points', json_array(
          json_object('icon', 'rings', 'title', 'Theo dịp của hai bạn', 'text', 'Kỷ niệm ngày yêu, sinh nhật hay cầu hôn: đổi được chữ và màu bóng.'),
          json_object('icon', 'bed', 'title', 'Hạng phòng nào cũng được', 'text', 'Ảnh mẫu ở Phòng Đơn VIP có bồn tắm, các hạng phòng khác cũng trang trí được.'),
          json_object('icon', 'heart', 'title', 'Nhắn Zalo nhận báo giá', 'text', 'Gửi ngày, giờ nhận phòng và hạng phòng, lễ tân báo giá trang trí.')
        ),
        'linkLabel', '',
        'linkHref', '',
        'buttonLabel', 'Xem gói trang trí',
        'buttonHref', '/trang-tri-ky-niem'
      )
    )
    ORDER BY k
  )
))
WHERE slug = 'home'
  AND EXISTS (SELECT 1 FROM json_each(pages.data, '$.content') WHERE json_extract(value, '$.type') = 'Rooms')
  AND instr(json_extract(data, '$.content'), '"Intro-2"') = 0;

INSERT INTO audit_logs (user_id, action, target, doc_id, title)
SELECT null, 'update', 'pages', 'home', 'Trang chủ: thêm khối phòng trang trí kỷ niệm sau Phòng & giá'
WHERE changes() > 0;

UPDATE pages
SET data = json_set(data,
  '$.content[0].props.slides[' || s.key || '].costValue', '',
  '$.content[0].props.slides[' || s.key || '].costLabel', '',
  '$.content[0].props.slides[' || s.key || '].costHref', '')
FROM (
  SELECT j.key FROM pages p2, json_each(p2.data, '$.content[0].props.slides') j
  WHERE p2.slug = 'home' AND json_extract(j.value, '$.costValue') = '1–2 ngày'
    AND json_extract(j.value, '$.bookHref') = '/trang-tri-ky-niem'
  LIMIT 1
) s
WHERE slug = 'home';

INSERT INTO audit_logs (user_id, action, target, doc_id, title)
SELECT null, 'update', 'pages', 'home', 'Banner trang chủ: bỏ ô "1–2 ngày" ở slide kỷ niệm'
WHERE changes() > 0;
