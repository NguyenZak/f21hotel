-- Banner trang chủ (26/11/2026): thêm slide "Phòng kỷ niệm trang trí sẵn" làm slide thứ 2.
-- Ô giá tạm ghi "1–2 ngày" (thời gian báo trước); khi có giá trang trí, sửa trong CMS › Dựng trang › Trang chủ › Hero.
-- Chỉ chạy khi trang chủ chưa có slide nào dẫn tới /trang-tri-ky-niem (chạy lại không thêm lần nữa).

UPDATE pages
SET data = json_set(data, '$.content[0].props.slides', (
  SELECT json_group_array(json(v)) FROM (
    SELECT 0 AS k, json_extract(pages.data, '$.content[0].props.slides[0]') AS v
    UNION ALL
    SELECT 1, json_object(
      'photo', json_object('src', '/img/anh/hero-ky-niem.webp',
        'alt', 'Phòng trang trí kỷ niệm với bóng bay đỏ bạc phủ trần và chữ LOVE trên giường', 'w', 1448, 'h', 965),
      'photoMobile', json_object('src', '/img/anh/hero-ky-niem-1200.webp',
        'alt', 'Phòng trang trí kỷ niệm với bóng bay đỏ bạc phủ trần và chữ LOVE trên giường', 'w', 960, 'h', 1200),
      'kicker', 'Dành cho cặp đôi',
      'bold', 'Phòng kỷ niệm',
      'light', 'trang trí sẵn',
      'sub', 'Bóng bay phủ trần, chữ LOVE phát sáng, hoa hồng. Đổi được chữ, màu bóng',
      'costValue', '1–2 ngày',
      'costLabel', 'Báo trước, F21 trang trí sẵn',
      'costHref', '/trang-tri-ky-niem',
      'bookLabel', 'Xem gói trang trí',
      'bookHref', '/trang-tri-ky-niem')
    UNION ALL
    SELECT 2 + key, value FROM json_each(pages.data, '$.content[0].props.slides') WHERE key >= 1
    ORDER BY k
  )
))
WHERE slug = 'home'
  AND json_extract(data, '$.content[0].type') = 'Hero'
  AND json_array_length(data, '$.content[0].props.slides') >= 1
  AND instr(json_extract(data, '$.content[0].props.slides'), '/trang-tri-ky-niem') = 0;

INSERT INTO audit_logs (user_id, action, target, doc_id, title)
SELECT null, 'update', 'pages', 'home', 'Banner trang chủ: thêm slide phòng trang trí kỷ niệm'
WHERE changes() > 0;
