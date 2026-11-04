-- Ba bài cẩm nang NHÁP (published = 0) cho CMS › Bài viết. Chỗ có [CẦN XÁC NHẬN] phải được khách sạn kiểm tra:
-- sửa số liệu cho đúng rồi xoá dấu, CMS mới cho bật “Đăng”. Bài chưa có ảnh bìa: chọn trong Thư viện ảnh.
-- Chạy MỘT lần (bài đã có mã thì bỏ qua; chạy lại có thể nhân đôi hỏi đáp nếu đã sửa trong CMS):
--   npx wrangler d1 execute D1 --local --file db/seeds/bai-viet-nhap.sql
--   npx wrangler d1 execute D1 --remote --file db/seeds/bai-viet-nhap.sql

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Xem concert, bóng đá ở SVĐ Mỹ Đình: nghỉ ở đâu, đi lại thế nào', 'xem-concert-bong-da-svd-my-dinh-o-dau', 'Ở phía Tây SVĐ Mỹ Đình như khu An Khánh giúp tránh tắc giờ tan sự kiện; F21 Hotel cách sân khoảng 15–20 phút ô tô [CẦN XÁC NHẬN], có nghỉ giờ và qua đêm.', 'Nếu đi xem concert hay bóng đá ở **Sân vận động Quốc gia Mỹ Đình**, chọn chỗ nghỉ phía Tây sân (An Khánh, Hoài Đức) giúp bạn tránh dòng xe đổ về nội thành lúc tan sự kiện. F21 Hotel nằm trong khu biệt thự Hoa Phượng, An Khánh, cách sân khoảng 15–20 phút ô tô khi đường thông thoáng [CẦN XÁC NHẬN: đo lại trên Google Maps].

## Nên đến sân lúc mấy giờ?

Nên có mặt ở sân **sớm hơn giờ mở cổng ít nhất 1–2 tiếng** vào ngày có sự kiện lớn. Đường Lê Đức Thọ, Trần Hữu Dực và các ngả quanh sân thường đông từ chiều. Giờ mở cổng, cổng vào theo hạng vé do ban tổ chức công bố trên vé và fanpage sự kiện.

## Đi từ F21 Hotel tới SVĐ Mỹ Đình

| Cách đi | Thời gian tham khảo | Ghi chú |
|---|---|---|
| Taxi, xe công nghệ | 15–20 phút [CẦN XÁC NHẬN] | Đặt xe sớm, giá tăng giờ cao điểm |
| Xe máy | 15–20 phút [CẦN XÁC NHẬN] | Gửi xe tại các bãi quanh sân |
| Ô tô riêng | 15–20 phút [CẦN XÁC NHẬN] | Bãi gần sân dễ hết chỗ, nên đi taxi |

Lễ tân có thể gọi taxi đón tận cửa khách sạn. Bạn nhắn Zalo trước giờ đi khoảng 30 phút vào ngày có sự kiện.

## Về sau khi tan

- Tan concert thường rất đông, đặt xe công nghệ có thể phải chờ lâu. Đi bộ ra các trục đường lớn xa cổng sân rồi mới gọi xe sẽ dễ hơn.
- Đi về phía An Khánh là đi ngược dòng xe về nội thành nên thường thoáng hơn.
- F21 Hotel có lễ tân trực đêm [CẦN XÁC NHẬN: giờ lễ tân trực], bạn về muộn vẫn nhận phòng được nếu đã đặt trước.

## Chọn hình thức nghỉ nào?

- **Qua đêm** (nhận sau 19:00, trả trước 10:00 hôm sau): hợp nhất nếu xem xong mới về nghỉ.
- **Ngày đêm** (nhận 14:00, trả trước 12:00): hợp khi muốn nghỉ, tắm rửa trước giờ đi.
- **Nghỉ giờ**: nghỉ ngắn trước sự kiện, tính 2 giờ đầu.

Xem giá từng hạng phòng ở trang [Phòng & giá](/phong). Ngày có sự kiện lớn phòng hết nhanh, nên [đặt trước](/dat-phong) hoặc nhắn Zalo giữ phòng.

## Đi theo nhóm, đội cổ vũ

Nhóm từ 5 phòng trở lên có thể [xin báo giá đoàn](/doan-doanh-nghiep). Phòng Đôi 4 người hợp cho nhóm bạn đi cùng nhau.', 'su-kien', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'xem-concert-bong-da-svd-my-dinh-o-dau-faq-1', 'F21 Hotel cách SVĐ Mỹ Đình bao xa?', 'Khoảng 15–20 phút ô tô khi đường thông thoáng [CẦN XÁC NHẬN].' FROM posts WHERE slug = 'xem-concert-bong-da-svd-my-dinh-o-dau';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'xem-concert-bong-da-svd-my-dinh-o-dau-faq-2', 'Xem concert xong về muộn có nhận phòng được không?', 'Được, nếu bạn đã đặt phòng trước. Báo giờ về dự kiến cho lễ tân qua Zalo.' FROM posts WHERE slug = 'xem-concert-bong-da-svd-my-dinh-o-dau';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'xem-concert-bong-da-svd-my-dinh-o-dau-faq-3', 'Khách sạn có gọi taxi giúp không?', 'Có. Lễ tân gọi taxi đón tận cửa khách sạn.' FROM posts WHERE slug = 'xem-concert-bong-da-svd-my-dinh-o-dau';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Thiên đường Bảo Sơn: giờ mở cửa, giá vé và chỗ nghỉ gần nhất', 'thien-duong-bao-son-gio-mo-cua-gia-ve', 'Công viên Thiên đường Bảo Sơn ở đường Lê Trọng Tấn, An Khánh, Hoài Đức. F21 Hotel cách công viên khoảng 5 phút, tiện cho gia đình có trẻ nhỏ nghỉ lại.', '**Công viên Thiên đường Bảo Sơn** ở đường Lê Trọng Tấn, xã An Khánh, Hoài Đức, Hà Nội. Đây là khu vui chơi cho gia đình và trẻ nhỏ ở phía Tây Hà Nội. F21 Hotel cách công viên **khoảng 5 phút** đi xe, nên gia đình đi chơi cả ngày có thể nghỉ lại gần.

## Giờ mở cửa

Theo các trang du lịch, công viên mở khoảng **8:00 – 17:00** [CẦN XÁC NHẬN: một số nguồn ghi nghỉ thứ Hai]. Ngày lễ, hè có thể đổi giờ. Nên xem fanpage chính thức của công viên trước khi đi.

## Giá vé tham khảo

| Đối tượng | Thứ Ba – thứ Bảy | Chủ nhật |
|---|---|---|
| Trẻ cao 1m – 1m3 | 150.000đ [CẦN XÁC NHẬN] | 250.000đ [CẦN XÁC NHẬN] |
| Người cao trên 1m3 | 200.000đ [CẦN XÁC NHẬN] | 350.000đ [CẦN XÁC NHẬN] |
| Trẻ dưới 1m | Miễn phí [CẦN XÁC NHẬN] | Miễn phí [CẦN XÁC NHẬN] |

Giá vé có thể thay đổi theo mùa và theo trò chơi. Kiểm tra lại với công viên trước khi đi.

## Kinh nghiệm đi cùng trẻ nhỏ

- Đi buổi sáng khi trời mát, trưa về khách sạn cho bé ngủ, chiều quay lại chơi tiếp. Nghỉ gần nên đi lại không mất nhiều thời gian.
- Mang mũ, nước, quần áo thay cho khu trò chơi nước.
- Cuối tuần và ngày lễ đông, nên đến sớm.

## Nghỉ ở đâu gần Thiên đường Bảo Sơn?

F21 Hotel nằm trong khu biệt thự Hoa Phượng, An Khánh, yên tĩnh, có chỗ đỗ ô tô. **Phòng Đôi 4 người** hợp gia đình hai bố mẹ và hai con. Gia đình chỉ nghỉ trưa có thể chọn **nghỉ giờ**.

Xem [phòng và giá](/phong), hoặc [đặt phòng online](/dat-phong) để được giá trực tiếp.', 'diem-den', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'thien-duong-bao-son-gio-mo-cua-gia-ve-faq-1', 'F21 Hotel cách Thiên đường Bảo Sơn bao xa?', 'Khoảng 5 phút đi xe.' FROM posts WHERE slug = 'thien-duong-bao-son-gio-mo-cua-gia-ve';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'thien-duong-bao-son-gio-mo-cua-gia-ve-faq-2', 'Có phòng cho gia đình 4 người không?', 'Có. Phòng Đôi 4 người ở tối đa 4 khách.' FROM posts WHERE slug = 'thien-duong-bao-son-gio-mo-cua-gia-ve';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'thien-duong-bao-son-gio-mo-cua-gia-ve-faq-3', 'Có thể nghỉ trưa vài tiếng rồi đi chơi tiếp không?', 'Có. F21 nhận nghỉ giờ, tính theo 2 giờ đầu và phụ trội mỗi giờ thêm.' FROM posts WHERE slug = 'thien-duong-bao-son-gio-mo-cua-gia-ve';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Nghỉ giờ, qua đêm ở An Khánh: giá và giờ nhận, trả phòng tại F21', 'nghi-gio-qua-dem-an-khanh-gia-va-gio', 'F21 Hotel ở An Khánh có ba hình thức: nghỉ giờ từ 300.000đ cho 2 giờ đầu, qua đêm 19:00–10:00 từ 600.000đ, ngày đêm 14:00–12:00 từ 900.000đ.', 'F21 Hotel ở khu biệt thự Hoa Phượng, An Khánh, Hoài Đức, bán phòng theo **ba hình thức**: nghỉ giờ, qua đêm và ngày đêm. Bài này giải thích từng hình thức, giờ nhận và trả phòng, và cách tính tiền để bạn chọn đúng.

## Ba hình thức nghỉ

| Hình thức | Giờ | Giá từ |
|---|---|---|
| Nghỉ giờ | Tính 2 giờ đầu, sau đó tính theo giờ | 300.000đ |
| Qua đêm | Nhận sau 19:00, trả trước 10:00 hôm sau | 600.000đ |
| Ngày đêm | Nhận 14:00, trả trước 12:00 hôm sau | 900.000đ |

Giá trên là của Phòng Đơn [CẦN XÁC NHẬN: đối chiếu giá đang bán trong CMS trước khi đăng]. Giá từng hạng phòng xem ở [Phòng & giá](/phong).

## Giá theo hạng phòng

| Hạng phòng | Số khách | Nghỉ giờ (2 giờ đầu) | Giờ thêm | Qua đêm | Ngày đêm |
|---|---|---|---|---|---|
| Phòng Đơn | 2 | 300.000đ | 50.000đ | 600.000đ | 900.000đ |
| Phòng Đơn VIP | 2 | 350.000đ | 50.000đ | 700.000đ | 1.000.000đ |
| Phòng Đôi | 3 | 400.000đ | 70.000đ | 750.000đ | 1.100.000đ |
| Phòng Đôi 4 người | 4 | 450.000đ | 100.000đ | 800.000đ | 1.200.000đ |

Thêm người so với quy định phụ thu 100.000đ/người. Giá đã gồm 2 chai nước suối.

## Chọn hình thức nào?

- **Nghỉ giờ**: nghỉ trưa, chờ chuyến bay, nghỉ giữa hai cuộc hẹn.
- **Qua đêm**: đến muộn, đi sớm. Rẻ hơn ngày đêm.
- **Ngày đêm**: cần phòng từ chiều, muốn trả phòng muộn tới trưa.

Ví dụ: nhận phòng lúc 21:00, trả lúc 8:00 sáng hôm sau thì chọn qua đêm.

## Ở dài ngày

- Ở trên 7 ngày liên tiếp: giảm 5%.
- Ở trên 15 ngày liên tiếp: giảm 10%.
- Ở trên 30 ngày: giảm 15%.

Điều kiện chi tiết xem ở trang [Ưu đãi](/uu-dai).

## Đặt cọc và huỷ

Đặt trước cần cọc tối thiểu 50% tiền phòng. Chính sách đổi, huỷ xem ở [Điều khoản đặt phòng](/dieu-khoan). Bạn có thể [đặt online](/dat-phong), gọi hoặc nhắn Zalo cho lễ tân.', 'huong-dan', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'nghi-gio-qua-dem-an-khanh-gia-va-gio-faq-1', 'Nghỉ giờ ở F21 Hotel giá bao nhiêu?', 'Từ 300.000đ cho 2 giờ đầu (Phòng Đơn), mỗi giờ thêm tính phụ trội theo hạng phòng.' FROM posts WHERE slug = 'nghi-gio-qua-dem-an-khanh-gia-va-gio';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'nghi-gio-qua-dem-an-khanh-gia-va-gio-faq-2', 'Qua đêm nhận và trả phòng lúc mấy giờ?', 'Nhận phòng sau 19:00, trả trước 10:00 sáng hôm sau.' FROM posts WHERE slug = 'nghi-gio-qua-dem-an-khanh-gia-va-gio';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'nghi-gio-qua-dem-an-khanh-gia-va-gio-faq-3', 'Ngày đêm nhận và trả phòng lúc mấy giờ?', 'Nhận phòng 14:00, trả trước 12:00 hôm sau.' FROM posts WHERE slug = 'nghi-gio-qua-dem-an-khanh-gia-va-gio';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 4, id, 'nghi-gio-qua-dem-an-khanh-gia-va-gio-faq-4', 'Ở dài ngày có được giảm giá không?', 'Có: trên 7 ngày giảm 5%, trên 15 ngày giảm 10%, trên 30 ngày giảm 15%.' FROM posts WHERE slug = 'nghi-gio-qua-dem-an-khanh-gia-va-gio';
