-- Khách sạn xác nhận (26/11/2026): báo trước 1–2 ngày; đổi được chữ, màu bóng; trang trí được ở các hạng phòng khác;
-- lịch để bàn lật đúng ngày kỷ niệm. Mỗi câu chỉ đổi khi chữ cũ còn nguyên, không đè lên chỉnh sửa trong CMS.

-- Ưu đãi: thêm dòng điều kiện trước dòng "Giá"
UPDATE offers_details SET _order = 8
WHERE id = 'trang-tri-ky-niem-7' AND text LIKE 'Giá%' AND _order = 7;

INSERT OR IGNORE INTO offers_details (_order, _parent_id, id, text)
SELECT 7, id, 'trang-tri-ky-niem-8', 'Đổi được chữ, màu bóng; trang trí được ở các hạng phòng khác. Báo trước 1–2 ngày'
FROM offers WHERE slug = 'trang-tri-ky-niem';

-- Bài viết
UPDATE posts SET body = replace(body,
  'Muốn đổi chữ (ví dụ cho sinh nhật) hoặc đổi màu bóng, bạn nhắn yêu cầu qua Zalo, lễ tân sẽ báo lại có làm được không.',
  'Muốn đổi chữ (ví dụ cho sinh nhật) hoặc đổi màu bóng, bạn nhắn yêu cầu khi đặt, F21 trang trí theo ý hai bạn.')
WHERE slug = 'phong-trang-tri-ky-niem-cap-doi';

UPDATE posts SET body = replace(body,
  'rộng hơn Phòng Đơn.',
  'rộng hơn Phòng Đơn. F21 trang trí được cả ở các hạng phòng khác, nên bạn có thể chọn phòng theo số người và ngân sách; muốn có bồn tắm thì chọn Đơn VIP.')
WHERE slug = 'phong-trang-tri-ky-niem-cap-doi' AND instr(body, 'trang trí được cả ở các hạng phòng khác') = 0;

UPDATE posts SET body = replace(body,
  'Nên nhắn càng sớm càng tốt để F21 kịp chuẩn bị bóng và hoa.',
  'Nên đặt và nhắn trước **1–2 ngày** để F21 kịp chuẩn bị bóng, hoa và chữ theo yêu cầu.')
WHERE slug = 'phong-trang-tri-ky-niem-cap-doi';

UPDATE posts SET body = replace(body,
  '1. **Chọn ngày và phòng**: đặt trên website,',
  '1. **Chọn ngày và phòng**: đặt trước 1–2 ngày trên website,')
WHERE slug = 'phong-trang-tri-ky-niem-cap-doi';

UPDATE posts_faqs SET answer = 'Được. Khi đặt, bạn nhắn chữ muốn hiện và màu bóng muốn đổi qua Zalo, F21 chuẩn bị theo yêu cầu.'
WHERE id = 'phong-trang-tri-ky-niem-cap-doi-faq-3'
  AND answer = 'Bạn nhắn yêu cầu qua Zalo khi đặt, lễ tân sẽ báo lại có làm được không.';

INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer)
SELECT 4, id, 'phong-trang-tri-ky-niem-cap-doi-faq-4',
  'Cần đặt trang trí phòng kỷ niệm trước mấy ngày?',
  'Báo trước 1–2 ngày để F21 chuẩn bị bóng, hoa và chữ theo yêu cầu. F21 trang trí được ở các hạng phòng, không chỉ Phòng Đơn VIP trong ảnh.'
FROM posts WHERE slug = 'phong-trang-tri-ky-niem-cap-doi';
