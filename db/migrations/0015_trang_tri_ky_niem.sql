-- Trang trí phòng kỷ niệm cho cặp đôi (26/11/2026), ảnh chụp tại phòng Đơn VIP ngày 18/11/2026.
-- 1. Ưu đãi "Trang trí phòng kỷ niệm" (hiện ở /uu-dai, nút dẫn tới /trang-tri-ky-niem). Trang /trang-tri-ky-niem
--    lấy tóm tắt và danh sách từ ưu đãi này; dòng bắt đầu bằng "Giá" hiện ở khung giá → khi có giá, sửa dòng đó trong CMS.
-- 2. Bài viết NHÁP (published = 0) về phòng kỷ niệm. Chọn ảnh bìa trong CMS rồi bấm Đăng.
-- Chạy lại không sao: mọi câu INSERT đều bỏ qua bản ghi đã có (theo slug / id).

INSERT OR IGNORE INTO offers (title, slug, tag, summary, "when", code, featured, active, "order")
VALUES (
  'Trang trí phòng kỷ niệm',
  'trang-tri-ky-niem',
  'Cặp đôi',
  'Bóng bay, chữ LOVE phát sáng, hoa hồng và cánh hoa trên giường. F21 trang trí xong trước giờ hai bạn nhận phòng.',
  'Quanh năm',
  NULL, 0, 1, 90
);

INSERT OR IGNORE INTO offers_details (_order, _parent_id, id, text)
SELECT v.n, o.id, 'trang-tri-ky-niem-' || v.n, v.t
FROM offers o, (
  SELECT 1 AS n, 'Bóng bay đỏ và bạc phủ trần, dây ruy băng thả xuống' AS t
  UNION ALL SELECT 2, 'Chùm bóng tim đỏ, bạc ở đầu giường và cạnh giường'
  UNION ALL SELECT 3, 'Chữ LOVE đèn LED trên giường và trên bàn trang điểm'
  UNION ALL SELECT 4, 'Hoa hồng và cánh hoa rải trên giường'
  UNION ALL SELECT 5, 'Lịch để bàn lật đúng ngày kỷ niệm của hai bạn'
  UNION ALL SELECT 6, 'Bóng bay đỏ, trắng, bạc trên giường và sàn phòng'
  UNION ALL SELECT 7, 'Giá: báo theo ngày và hạng phòng, nhắn Zalo để nhận báo giá'
) v
WHERE o.slug = 'trang-tri-ky-niem';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES (
  'Phòng trang trí kỷ niệm cho cặp đôi ở An Khánh: bóng bay, chữ LOVE, hoa hồng',
  'phong-trang-tri-ky-niem-cap-doi',
  'F21 Hotel nhận trang trí phòng cho ngày kỷ niệm, sinh nhật người yêu: bóng bay phủ trần, chữ LOVE phát sáng, hoa hồng và lịch ghi đúng ngày của hai bạn. Phòng Đơn VIP qua đêm từ {{gia:don-vip:qua-dem}}, tiền trang trí báo riêng qua Zalo.',
  'Ngày kỷ niệm không nhất thiết phải vào phố hay đặt resort xa. Ở **F21 Hotel** (khu biệt thự Hoa Phượng, An Khánh), bạn đặt phòng, nhắn ngày của hai người, F21 trang trí sẵn trước giờ nhận phòng. Ảnh trong bài chụp thật tại phòng Đơn VIP của F21.

![Phòng trang trí kỷ niệm với bóng bay đỏ bạc phủ trần và chữ LOVE trên giường](/img/anh/ky-niem-tran-bong.webp)

## Phòng trang trí kỷ niệm ở F21 có gì?

Một phòng trang trí theo tông đỏ, trắng, bạc gồm:

- **Bóng bay phủ trần** màu đỏ và bạc, dây ruy băng thả xuống.
- **Chùm bóng tim** đỏ, bạc ở đầu giường và cạnh giường.
- **Chữ LOVE đèn LED** trên giường và trên bàn trang điểm.
- **Hoa hồng** cắm bình và **cánh hoa** rải trên giường.
- **Lịch để bàn** lật đúng ngày kỷ niệm của hai bạn.
- Bóng bay đỏ, trắng, bạc trên giường và dưới sàn.

![Chữ LOVE đèn LED, hoa hồng và lịch ngày kỷ niệm trên bàn trang điểm](/img/anh/ky-niem-ban-love.webp)

Muốn đổi chữ (ví dụ cho sinh nhật) hoặc đổi màu bóng, bạn nhắn yêu cầu qua Zalo, lễ tân sẽ báo lại có làm được không.

## Nên chọn phòng nào cho ngày kỷ niệm?

Ảnh mẫu chụp ở **Phòng Đơn VIP**: giường đôi, phòng tắm có **bồn tắm sau vách kính**, rộng hơn Phòng Đơn.

![Bóng bay trên trần phòng Đơn VIP, nhìn sang phòng tắm có bồn sau vách kính](/img/anh/ky-niem-bon-tam.webp)

Giá phòng Đơn VIP theo bảng giá hiện tại:

- Qua đêm: **{{gia:don-vip:qua-dem}}**.
- Ngày đêm: **{{gia:don-vip:ngay-dem}}**.

Tiền trang trí tính riêng, cộng với tiền phòng. Giờ nhận, trả phòng của từng hình thức xem ở bài [nghỉ giờ, qua đêm và ngày đêm](/bai-viet/nghi-gio-qua-dem-an-khanh-gia-va-gio).

## Đặt phòng trang trí kỷ niệm thế nào?

1. **Chọn ngày và phòng**: đặt trên website, gọi hotline hoặc nhắn Zalo. Ghi chú “trang trí kỷ niệm” khi đặt.
2. **Nhắn F21 dịp của hai bạn**: kỷ niệm ngày yêu, sinh nhật hay cầu hôn, ngày cần hiện trên lịch và giờ dự kiến nhận phòng.
3. **Nhận phòng đã trang trí**: F21 trang trí xong trước giờ hai bạn tới.

Nên nhắn càng sớm càng tốt để F21 kịp chuẩn bị bóng và hoa. Cách đặt cọc xem ở bài [đặt phòng trực tiếp F21](/bai-viet/dat-phong-truc-tiep-f21-dat-coc). Xem đủ ảnh và nội dung gói ở trang [trang trí phòng kỷ niệm](/trang-tri-ky-niem).

## Vài gợi ý cho buổi tối kỷ niệm

- **Giữ bí mật**: nếu muốn tạo bất ngờ, bạn đặt và nhắn F21 một mình, rồi đưa người ấy tới khi phòng đã trang trí xong.
- **Chụp ảnh lúc mới vào phòng**: bóng bay căng và đẹp nhất trong vài giờ đầu; tắt bớt đèn trần, bật chữ LOVE để ảnh có ánh sáng ấm.
- **Mang theo quà, bánh**: bàn trang điểm và đầu giường đủ chỗ để bánh kem nhỏ, hoa hoặc hộp quà.
- **Ăn tối gần khách sạn**: xem gợi ý ở bài [cặp đôi nghỉ cuối tuần phía Tây Hà Nội](/bai-viet/cap-doi-cuoi-tuan-phia-tay-ha-noi).

![Bóng bay đỏ, trắng, bạc và cánh hoa hồng rải trên giường](/img/anh/ky-niem-giuong-bong.webp)',
  'huong-dan',
  0
);

INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer)
SELECT v.n, p.id, 'phong-trang-tri-ky-niem-cap-doi-faq-' || v.n, v.q, v.a
FROM posts p, (
  SELECT 1 AS n,
    'F21 Hotel có nhận trang trí phòng kỷ niệm không?' AS q,
    'Có. F21 trang trí phòng với bóng bay phủ trần, chùm bóng tim, chữ LOVE đèn LED, hoa hồng, cánh hoa rải giường và lịch ghi ngày kỷ niệm. Bạn nhắn Zalo ngày nhận phòng để được báo giá.' AS a
  UNION ALL SELECT 2,
    'Trang trí phòng kỷ niệm ở F21 giá bao nhiêu?',
    'Tiền trang trí tính riêng, báo theo ngày và hạng phòng qua Zalo. Tiền phòng tính theo bảng giá, ví dụ Phòng Đơn VIP qua đêm từ {{gia:don-vip:qua-dem}}.'
  UNION ALL SELECT 3,
    'Có đổi chữ LOVE thành chữ khác cho sinh nhật được không?',
    'Bạn nhắn yêu cầu qua Zalo khi đặt, lễ tân sẽ báo lại có làm được không.'
) v
WHERE p.slug = 'phong-trang-tri-ky-niem-cap-doi';
