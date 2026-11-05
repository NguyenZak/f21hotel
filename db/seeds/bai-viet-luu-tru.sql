-- 20 bài cẩm nang NHÁP (published = 0) về lưu trú ở F21 và tiện ích quanh khách sạn, cho CMS › Bài viết.
-- Chỗ có [CẦN XÁC NHẬN] phải được khách sạn kiểm tra: sửa số liệu cho đúng rồi xoá dấu, CMS mới cho bật “Đăng”.
-- Tên quán, địa điểm lấy từ CMS › Tiện ích xung quanh (trang /kham-pha). Bài chưa có ảnh bìa: chọn trong Thư viện ảnh.
-- Chạy MỘT lần (bài đã có mã thì bỏ qua; chạy lại có thể nhân đôi hỏi đáp nếu đã sửa trong CMS):
--   npx wrangler d1 execute D1 --local --file db/seeds/bai-viet-luu-tru.sql
--   npx wrangler d1 execute D1 --remote --file db/seeds/bai-viet-luu-tru.sql

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Chọn hạng phòng ở F21 An Khánh: Đơn, Đơn VIP, Đôi hay Đôi 4 người?', 'chon-hang-phong-f21', 'F21 có 4 hạng phòng: Đơn và Đơn VIP cho 2 khách (ngày đêm 900.000–1.000.000đ), Phòng Đôi cho 3 khách (1.100.000đ), Phòng Đôi 4 người cho 4 khách (1.200.000đ).', 'F21 Hotel có **4 hạng phòng** cho 2 đến 4 khách: Phòng Đơn và Phòng Đơn VIP cho 2 khách, Phòng Đôi cho 3 khách, Phòng Đôi 4 người cho 4 khách. Giá ngày đêm từ **900.000đ** đến **1.200.000đ**. Bài này giúp bạn chọn theo số người và mục đích chuyến đi.

## Bốn hạng phòng ở F21 khác nhau thế nào?

| Hạng phòng | Số khách | Số phòng | Điểm riêng | Qua đêm | Ngày đêm |
|---|---|---|---|---|---|
| Phòng Đơn | 2 | 8 | Giường đôi, vòi sen vách kính, bàn làm việc | 600.000đ | 900.000đ |
| Phòng Đơn VIP | 2 | 4 | Bồn tắm sau vách kính | 700.000đ | 1.000.000đ |
| Phòng Đôi | 3 | 3 | Hai giường, ghế bành | 750.000đ | 1.100.000đ |
| Phòng Đôi 4 người | 4 | 4 | Hai giường lớn, cửa sổ vòm | 800.000đ | 1.200.000đ |

Nghỉ giờ tính 2 giờ đầu: **300.000đ** (Đơn), 350.000đ (Đơn VIP), 400.000đ (Đôi), 450.000đ (Đôi 4 người). Giờ nhận, trả phòng của từng hình thức xem ở bài [nghỉ giờ, qua đêm và ngày đêm](/bai-viet/nghi-gio-qua-dem-an-khanh-gia-va-gio).

Phòng Đôi chỉ có 3 phòng (202, 302, 402), ít nhất trong bốn hạng. Nếu đi đúng 3 người, bạn nên đặt sớm.

## Đi công tác một mình nên chọn phòng nào?

**Phòng Đơn** là lựa chọn hợp lý nhất. Phòng có bàn làm việc, TV, wifi miễn phí và phòng tắm vòi sen vách kính. F21 có 8 Phòng Đơn ở cả 4 tầng nên dễ còn phòng hơn các hạng khác.

Nếu ở dài ngày, F21 giảm giá theo số ngày liên tiếp:

- Trên 7 ngày: giảm **5%**.
- Trên 15 ngày: giảm **10%**.
- Trên 30 ngày: giảm **15%** tổng thanh toán.

Chi tiết ở mục [ở dài ngày](/uu-dai#o-dai-ngay). Công ty gửi nhiều nhân sự cùng lúc, lấy trên 7 phòng cũng được giảm 5%, xem trang [Khách đoàn](/doan-doanh-nghiep).

## Cặp đôi nên lấy Phòng Đơn hay Phòng Đơn VIP?

Hai hạng đều cho 2 khách. Khác biệt chính là **bồn tắm sau vách kính** ở Phòng Đơn VIP. Phòng Đơn dùng vòi sen.

- Chênh giá: 50.000đ khi nghỉ giờ, **100.000đ** khi qua đêm hoặc ngày đêm.
- Phòng Đơn VIP có 4 phòng, mỗi tầng một phòng (101, 201, 301, 401).
- Dịp Noel 24–25/12/2026, Phòng Đơn VIP qua đêm từ 700.000đ, xem trang [Ưu đãi](/uu-dai).

Nếu chỉ cần chỗ ngủ sau khi đi chơi, Phòng Đơn là đủ. Nếu muốn ngâm bồn sau một ngày dài, chọn Đơn VIP.

## Đi 3 người nên lấy Phòng Đôi hay Phòng Đơn cộng phụ thu?

F21 phụ thu **100.000đ/người** khi ở thêm người so với quy định. So sánh cho 3 khách:

| Cách ở | Qua đêm | Ngày đêm | Giường |
|---|---|---|---|
| Phòng Đơn + 1 người | 700.000đ | 1.000.000đ | Một giường đôi |
| Phòng Đơn VIP + 1 người | 800.000đ | 1.100.000đ | [CẦN XÁC NHẬN: loại giường] |
| Phòng Đôi | 750.000đ | 1.100.000đ | Hai giường |

Phòng Đơn cộng phụ thu rẻ hơn Phòng Đôi 50.000–100.000đ, nhưng cả 3 người nằm chung một giường đôi. Cách này hợp với bố mẹ đi cùng một con nhỏ.

Ba người lớn, nhóm bạn hoặc đồng nghiệp nên lấy **Phòng Đôi**: có hai giường và ghế bành, rộng rãi hơn khi ở cùng nhau. Phụ thu khi nghỉ giờ có áp dụng như qua đêm không: [CẦN XÁC NHẬN].

## Nhóm bạn, gia đình 4 người chọn gì?

**Phòng Đôi 4 người** có hai giường lớn và cửa sổ vòm, giá ngày đêm 1.200.000đ, tức khoảng **300.000đ/người**. F21 có 4 phòng hạng này (102, 203, 303, 403).

- Gia đình có người cao tuổi: tầng 1 có phòng 102 (Đôi 4 người), 101 (Đơn VIP), 103 và 104 (Đơn). Bạn ghi "cần tầng thấp" khi đặt [CẦN XÁC NHẬN: toà nhà có thang máy không].
- Nhóm 5 người: lấy Phòng Đôi 4 người cộng phụ thu cho người thứ năm, hoặc tách hai phòng. Lễ tân tư vấn cách nào hợp hơn.
- Họ hàng về ăn cưới cần nhiều phòng: F21 có ưu đãi mùa cưới đến 31/1/2027, giữ nhiều phòng theo ngày cưới.

Chưa chắc chọn hạng nào, bạn ghi số người lớn, trẻ em vào ô yêu cầu khi [đặt online](/dat-phong), hoặc gọi **0968 740 333** để lễ tân tư vấn và báo phòng trống. Ảnh từng phòng có ở trang [Phòng & giá](/phong).', 'huong-dan', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'chon-hang-phong-f21-faq-1', 'Phòng rẻ nhất ở F21 Hotel giá bao nhiêu?', 'Phòng Đơn cho 2 khách: nghỉ giờ 300.000đ cho 2 giờ đầu, qua đêm 600.000đ, ngày đêm 900.000đ.' FROM posts WHERE slug = 'chon-hang-phong-f21';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'chon-hang-phong-f21-faq-2', 'Phòng Đơn VIP khác Phòng Đơn ở điểm nào?', 'Phòng Đơn VIP có bồn tắm đặt sau vách kính, giá cao hơn 50.000–100.000đ tuỳ hình thức nghỉ. Cả hai hạng đều dành cho 2 khách.' FROM posts WHERE slug = 'chon-hang-phong-f21';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'chon-hang-phong-f21-faq-3', 'Ở 5 người tại F21 thì đặt phòng thế nào?', 'Bạn có thể lấy Phòng Đôi 4 người và phụ thu 100.000đ cho người thứ năm, hoặc đặt hai phòng. Số người ở thêm tối đa mỗi phòng: [CẦN XÁC NHẬN].' FROM posts WHERE slug = 'chon-hang-phong-f21';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Đặt phòng trực tiếp F21 Hotel: online, hotline, Zalo và đặt cọc 50%', 'dat-phong-truc-tiep-f21-dat-coc', 'Đặt phòng F21 qua website, hotline hoặc Zalo 0968 740 333. Cọc tối thiểu 50% tiền phòng; đã đặt thì không hoàn tiền khi thay đổi, nên chốt lịch rồi mới chuyển cọc.', 'Bạn đặt phòng F21 Hotel theo **3 cách**: đặt online ở trang [Đặt phòng](/dat-phong), gọi hotline **0968 740 333**, hoặc nhắn Zalo cùng số [CẦN XÁC NHẬN: Zalo dùng chung số hotline]. Cách nào cũng cần **đặt cọc tối thiểu 50%** tiền phòng để giữ chỗ.

## Đặt phòng online trên website thế nào?

1. Vào trang Đặt phòng, chọn ngày nhận, ngày trả và số khách.
2. Chọn hạng phòng và hình thức nghỉ: ngày đêm hoặc qua đêm. Website hiện giá theo ngày bạn chọn.
3. Điền họ tên, số điện thoại hoặc Zalo, giờ đến dự kiến. Email không bắt buộc.
4. Gửi đặt phòng và lưu lại **mã đặt phòng**. Lễ tân gọi hoặc nhắn Zalo vào số bạn để lại để xác nhận và hướng dẫn chuyển khoản đặt cọc.

Đặt online không cần thẻ tín dụng. Nếu chỉ **nghỉ giờ**, bạn không cần đặt trước trên website: gọi hotline để lễ tân giữ phòng.

## Khi nào nên gọi hotline, khi nào nhắn Zalo?

- **Gọi hotline** khi cần phòng gấp trong ngày, nghỉ giờ, hoặc muốn hỏi nhanh còn phòng hay không.
- **Nhắn Zalo** khi cần gửi thông tin đặt phòng, ảnh chuyển khoản, hoặc nhận ghim vị trí khách sạn. Lễ tân trả lời Zalo từ 7:00 đến 23:00 [CẦN XÁC NHẬN].
- Góp ý, phản ánh dịch vụ: gọi **0383 553 034**.

## Đặt cọc bao nhiêu và có được hoàn không?

F21 nhận cọc **tối thiểu 50%** tổng tiền phòng. Ví dụ: hai đêm Phòng Đôi 4 người theo hình thức ngày đêm, tính theo giá niêm yết, là 2 x 1.200.000đ = 2.400.000đ, cọc ít nhất **1.200.000đ**.

- Phần còn lại thanh toán lúc nhận hay trả phòng, bằng tiền mặt hay chuyển khoản: [CẦN XÁC NHẬN].
- **Khách đặt trước không được hoàn tiền khi thay đổi.** Vì vậy bạn nên chốt ngày, số phòng, số khách rồi mới chuyển cọc.
- Có cho dời ngày và giữ nguyên tiền cọc không: [CẦN XÁC NHẬN].

Điều khoản đầy đủ ở trang [Điều khoản](/dieu-khoan). Đọc trước khi chuyển cọc giúp tránh hiểu nhầm về sau.

## Khi đặt phòng cần cung cấp những gì?

Chuẩn bị sẵn các thông tin sau, lễ tân xác nhận sẽ nhanh hơn:

- Họ tên và số điện thoại hoặc Zalo của người đặt.
- Ngày đến, ngày đi và hình thức nghỉ: nghỉ giờ, qua đêm hay ngày đêm.
- Hạng phòng và số phòng cần.
- **Số người lớn và trẻ em.** Ở thêm người so với quy định phụ thu 100.000đ/người, báo đúng từ đầu để tính tiền cho chuẩn.
- Giờ đến dự kiến, nhất là khi bạn đến muộn.
- Yêu cầu thêm nếu có: tầng thấp, đi cùng trẻ nhỏ, đi ô tô, mã ưu đãi.

Người đặt và người nhận phòng khác nhau thì báo trước tên người sẽ đến. Khi nhận phòng, mỗi khách mang CCCD hoặc hộ chiếu, xem bài [nhận và trả phòng ở F21](/bai-viet/nhan-tra-phong-f21-giay-to).

## Những ngày nào nên đặt phòng sớm?

F21 chỉ có **19 phòng**, nên các dịp sau thường kín sớm:

- Ngày có concert, trận bóng ở SVĐ Mỹ Đình. Kinh nghiệm đi lại xem ở bài [xem concert, bóng đá ở Mỹ Đình](/bai-viet/xem-concert-bong-da-svd-my-dinh-o-dau).
- Mùa cưới: F21 có ưu đãi giữ nhiều phòng theo ngày cưới cho họ hàng, áp dụng đến 31/1/2027.
- Noel 24–25/12/2026 và mùa tất niên tháng 12/2026 đến tháng 1/2027.
- Cuối tuần, đặc biệt với Phòng Đôi (3 phòng), Phòng Đơn VIP và Phòng Đôi 4 người (mỗi hạng 4 phòng).

Đoàn cần từ 5 phòng trở lên nên liên hệ một đầu mối qua trang [Khách đoàn](/doan-doanh-nghiep). Các chương trình đang áp dụng xem ở [Ưu đãi](/uu-dai).

Cách nhanh nhất là chọn ngày ở trang Đặt phòng để xem phòng trống, hoặc gọi 0968 740 333 nếu bạn cần lễ tân tư vấn trước.', 'huong-dan', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'dat-phong-truc-tiep-f21-dat-coc-faq-1', 'Đặt phòng F21 Hotel có cần đặt cọc không?', 'Có. Bạn chuyển cọc tối thiểu 50% tiền phòng để lễ tân giữ phòng cho bạn.' FROM posts WHERE slug = 'dat-phong-truc-tiep-f21-dat-coc';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'dat-phong-truc-tiep-f21-dat-coc-faq-2', 'Huỷ hoặc đổi lịch ở F21 có được hoàn cọc không?', 'Khách đặt trước không được hoàn tiền khi thay đổi. Bạn nên chốt lịch rồi mới chuyển cọc và đọc trang Điều khoản trước khi đặt.' FROM posts WHERE slug = 'dat-phong-truc-tiep-f21-dat-coc';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'dat-phong-truc-tiep-f21-dat-coc-faq-3', 'Nghỉ giờ ở F21 có phải đặt trước không?', 'Không bắt buộc đặt online. Bạn gọi 0968 740 333 trước khi đến để lễ tân kiểm tra và giữ phòng.' FROM posts WHERE slug = 'dat-phong-truc-tiep-f21-dat-coc';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Đường vào F21 Hotel trong khu biệt thự Hoa Phượng, An Khánh', 'duong-vao-f21-khu-biet-thu-hoa-phuong', 'F21 nằm trong khu biệt thự Hoa Phượng, An Khánh, cạnh Vinschool, gần cổng 1 Vinhomes Thăng Long. Từ Đại lộ Thăng Long khoảng 5 phút, từ Mỹ Đình 15–20 phút ô tô.', 'F21 Hotel ở **BT13.1, Lô số 1, Khu biệt thự Hoa Phượng, An Khánh, Hà Nội**, ngay cạnh Vinschool và cách cổng 1 Vinhomes Thăng Long khoảng 1–2 phút đi xe. Mốc dễ nhớ nhất là Vinschool: tìm thấy trường là gần tới khách sạn. Sau khi bạn đặt phòng, lễ tân gửi **ghim vị trí qua Zalo** để bạn mở thẳng trên bản đồ.

## Từ các trục đường chính tới F21 mất bao lâu?

| Đi từ | Thời gian ô tô | Ghi chú |
|---|---|---|
| Vinschool, cổng 1 Vinhomes Thăng Long | khoảng 1–2 phút | Mốc nhận biết gần nhất |
| Đại lộ Thăng Long | khoảng 5 phút | Vào qua đường Lê Trọng Tấn |
| Thiên đường Bảo Sơn | khoảng 5 phút | Cùng trục Lê Trọng Tấn |
| SVĐ Mỹ Đình | khoảng 15–20 phút | Theo Lê Trọng Tấn kéo dài |
| Trung tâm Hội nghị Quốc gia | khoảng 15 phút | |
| Phố cổ Hoàn Kiếm | khoảng 35 phút | |

Thời gian tính khi đường thông thoáng [CẦN XÁC NHẬN: đo lại trên Google Maps]. Giờ cao điểm sáng, chiều và ngày có sự kiện ở Mỹ Đình sẽ lâu hơn.

## Đi từ Đại lộ Thăng Long vào thế nào?

Rời Đại lộ Thăng Long ở nút giao với đường **Lê Trọng Tấn**. Gần nút giao có [cửa hàng xăng dầu Trung Thượng](/kham-pha/cua-hang-xang-dau-trung-thuong), tiện đổ xăng trước khi vào khu. Từ đây:

1. Đi theo Lê Trọng Tấn, hướng về cổng số 1 Vinhomes Thăng Long.
2. Khi thấy Vinschool, rẽ vào khu biệt thự Hoa Phượng.
3. F21 là toà nhà kiến trúc tân cổ điển ở góc đường, cạnh Vinschool.

Nút giao cụ thể nên rẽ theo từng chiều đi trên đại lộ: [CẦN XÁC NHẬN]. Nếu đi lần đầu, bạn mở ghim lễ tân gửi và để bản đồ dẫn đường đoạn cuối.

## Đi từ Mỹ Đình, Lê Trọng Tấn hoặc Bảo Sơn thì sao?

- **Từ Mỹ Đình**: đi theo Lê Trọng Tấn kéo dài về phía Tây, hướng An Khánh, khoảng 15–20 phút. Đây cũng là đường khách đi xem concert, bóng đá về khách sạn.
- **Từ Thiên đường Bảo Sơn, Khu A Geleximco**: các điểm này nằm trên trục Lê Trọng Tấn, đi khoảng 5 phút.
- Đến gần cổng số 1 Vinhomes Thăng Long, tìm Vinschool rồi rẽ vào khu biệt thự Hoa Phượng như trên.

Bài này không ghi tên từng ngõ trong khu để tránh nhầm; nếu lạc, bạn gọi lễ tân **0968 740 333** để được chỉ đường.

## Đi taxi, xe công nghệ nên nhập địa chỉ gì?

- **Cách chắc nhất**: mở ghim vị trí lễ tân gửi qua Zalo, chọn làm điểm đến trong ứng dụng gọi xe.
- Hoặc gõ "F21 Hotel, Khu biệt thự Hoa Phượng, An Khánh". Tên khách sạn đã hiện trên các ứng dụng gọi xe chưa: [CẦN XÁC NHẬN].
- Ứng dụng không tìm ra thì chọn điểm đến là **Vinschool** cạnh khu biệt thự Hoa Phượng, rồi gọi lễ tân để tài xế đi tiếp đoạn ngắn.

Từ sân bay, xem bài [Nội Bài về An Khánh](/bai-viet/san-bay-noi-bai-ve-an-khanh). Đi xe buýt, metro xem bài [đi lại Hà Nội bằng metro, xe buýt](/bai-viet/di-lai-ha-noi-metro-xe-buyt). Khi rời khách sạn, lễ tân gọi taxi đón tận cửa.

## Đỗ ô tô, xe máy ở đâu?

Đường trong khu biệt thự Hoa Phượng rộng, khách **đỗ ô tô và xe máy ngay trước khách sạn** [CẦN XÁC NHẬN: số chỗ đỗ, có mất phí không].

- Đoàn đi nhiều xe, như họ hàng về ăn cưới, nên báo trước để lễ tân sắp chỗ.
- Xe khách cỡ lớn có vào được trong khu không: [CẦN XÁC NHẬN]. Bạn hỏi lễ tân trước khi thuê xe.

Bản đồ và các điểm quanh khách sạn có ở trang [Vị trí](/vi-tri). Đặt phòng xong, lễ tân gửi ghim qua Zalo để bạn đến thẳng cửa.', 'huong-dan', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'duong-vao-f21-khu-biet-thu-hoa-phuong-faq-1', 'F21 Hotel nằm ở đâu trong khu biệt thự Hoa Phượng?', 'Khách sạn ở lô BT13.1, cạnh Vinschool, gần cổng 1 Vinhomes Thăng Long. Lễ tân gửi ghim vị trí qua Zalo khi bạn đặt phòng.' FROM posts WHERE slug = 'duong-vao-f21-khu-biet-thu-hoa-phuong';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'duong-vao-f21-khu-biet-thu-hoa-phuong-faq-2', 'Đi ô tô tới F21 có chỗ đỗ không?', 'Có, khách đỗ ngay trước khách sạn trên đường nội khu [CẦN XÁC NHẬN: có mất phí không]. Đoàn nhiều xe nên báo lễ tân trước.' FROM posts WHERE slug = 'duong-vao-f21-khu-biet-thu-hoa-phuong';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'duong-vao-f21-khu-biet-thu-hoa-phuong-faq-3', 'Từ F21 đi SVĐ Mỹ Đình mất bao lâu?', 'Khoảng 15–20 phút ô tô theo Lê Trọng Tấn kéo dài khi đường thông thoáng [CẦN XÁC NHẬN].' FROM posts WHERE slug = 'duong-vao-f21-khu-biet-thu-hoa-phuong';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Nhận và trả phòng ở F21 Hotel An Khánh: giờ giấc, giấy tờ cần mang', 'nhan-tra-phong-f21-giay-to', 'Ở F21, ngày đêm nhận phòng 14:00, trả trước 12:00 hôm sau; qua đêm nhận sau 19:00, trả trước 10:00. Khi đến, mỗi khách mang CCCD hoặc hộ chiếu để làm thủ tục.', 'Ở F21 Hotel, giờ nhận và trả phòng theo hình thức nghỉ: **ngày đêm** nhận 14:00, trả trước 12:00 hôm sau; **qua đêm** nhận sau 19:00, trả trước 10:00 hôm sau; **nghỉ giờ** tính 2 giờ đầu, quá giờ tính phụ trội. Khi đến, bạn mang **CCCD hoặc hộ chiếu** để lễ tân làm thủ tục.

## Mấy giờ nhận phòng và trả phòng?

| Hình thức | Nhận phòng | Trả phòng | Giá từ (Phòng Đơn) |
|---|---|---|---|
| Ngày đêm | 14:00 | Trước 12:00 hôm sau | 900.000đ |
| Qua đêm | Sau 19:00 | Trước 10:00 hôm sau | 600.000đ |
| Nghỉ giờ | Khi còn phòng trống | Theo số giờ sử dụng | 300.000đ cho 2 giờ đầu |

Giá từng hạng phòng và cách tính giờ thêm có trong bài [nghỉ giờ, qua đêm ở An Khánh](/bai-viet/nghi-gio-qua-dem-an-khanh-gia-va-gio). Nếu bạn đến buổi tối và đi sớm, qua đêm thường tiết kiệm hơn ngày đêm.

## Cần mang giấy tờ gì khi nhận phòng?

- **CCCD** (thẻ căn cước) hoặc **hộ chiếu** còn hạn. Khách nước ngoài dùng hộ chiếu.
- Lễ tân dùng thông tin này để **khai báo lưu trú** với cơ quan chức năng theo quy định. Đây là thủ tục chung của mọi khách sạn, nhà nghỉ, nên lễ tân cần thông tin của từng người ở lại, không chỉ người đặt.
- Có nhận giấy tờ điện tử trên ứng dụng VNeID thay thẻ cứng không: [CẦN XÁC NHẬN].
- Đặt online thì đọc **mã đặt phòng** cho lễ tân để tra nhanh.

Người đặt và người đến khác nhau, ví dụ con đặt cho bố mẹ, bạn báo trước họ tên người nhận phòng qua Zalo.

## Đến muộn hoặc muốn nhận sớm, trả muộn thì sao?

**Đến muộn**: khi đặt, bạn chọn giờ đến dự kiến. Nếu trễ hơn, gọi **0968 740 333** hoặc nhắn Zalo báo lễ tân. Phòng đã đặt được giữ đến mấy giờ và lễ tân trực đêm thế nào: [CẦN XÁC NHẬN].

**Nhận phòng sớm**: tuỳ phòng trống hôm đó. Bạn hỏi lễ tân từ hôm trước. Phụ thu nhận sớm: [CẦN XÁC NHẬN].

**Trả phòng muộn**: cũng tuỳ phòng trống, không mặc định miễn phí. Phụ thu trả muộn: [CẦN XÁC NHẬN]. Nếu cần ở thêm nửa ngày, bạn hỏi lễ tân cách tính rẻ nhất cho lịch của mình.

Khối phòng tất niên tháng 12/2026 đến tháng 1/2027 được nhận phòng sớm khi còn phòng trống, xem trang [Ưu đãi](/uu-dai).

## Đi cùng trẻ em cần lưu ý gì?

- **Báo số trẻ em khi đặt phòng.** Ở thêm người so với quy định của hạng phòng phụ thu 100.000đ/người. Trẻ ở độ tuổi nào không tính vào số khách: [CẦN XÁC NHẬN].
- Giấy tờ cần cho trẻ khi khai báo lưu trú, như giấy khai sinh hoặc mã định danh: [CẦN XÁC NHẬN].
- Gia đình hai bố mẹ, hai con nên chọn **Phòng Đôi 4 người** có hai giường lớn.
- Ghi "đi cùng trẻ nhỏ" hoặc "cần tầng thấp" ở ô yêu cầu thêm để lễ tân sắp phòng phù hợp.

Gợi ý chỗ chơi cho bé quanh khu có trong bài [Hà Nội cho trẻ em](/bai-viet/ha-noi-cho-tre-em).

## Khi trả phòng cần làm gì?

- Trả phòng trước giờ của hình thức bạn đã đặt.
- Kiểm tra lại giấy tờ, sạc điện thoại, đồ của trẻ trước khi rời phòng.
- Thanh toán phần còn lại sau khi trừ tiền cọc. Thời điểm và hình thức thanh toán: [CẦN XÁC NHẬN].
- Cần xe đi tiếp, bạn nhờ lễ tân gọi taxi đón tận cửa.

Có điều gì chưa hài lòng trong thời gian ở, bạn gọi số phản ánh dịch vụ **0383 553 034**.

Quy định đầy đủ về đặt cọc và thay đổi lịch có ở trang [Điều khoản](/dieu-khoan). Bạn có thể [đặt phòng online](/dat-phong) hoặc gọi 0968 740 333 để hỏi phòng trống.', 'huong-dan', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'nhan-tra-phong-f21-giay-to-faq-1', 'F21 Hotel nhận phòng lúc mấy giờ?', 'Ngày đêm nhận từ 14:00, qua đêm nhận sau 19:00. Nghỉ giờ nhận khi còn phòng trống, bạn nên gọi trước.' FROM posts WHERE slug = 'nhan-tra-phong-f21-giay-to';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'nhan-tra-phong-f21-giay-to-faq-2', 'Không mang CCCD có nhận phòng ở F21 được không?', 'Lễ tân cần giấy tờ tuỳ thân để khai báo lưu trú theo quy định, nên bạn cần mang CCCD hoặc hộ chiếu. Loại giấy tờ thay thế được chấp nhận: [CẦN XÁC NHẬN].' FROM posts WHERE slug = 'nhan-tra-phong-f21-giay-to';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'nhan-tra-phong-f21-giay-to-faq-3', 'Có được trả phòng muộn ở F21 không?', 'Tuỳ phòng trống hôm đó, bạn hỏi lễ tân trước giờ trả phòng. Phụ thu trả muộn: [CẦN XÁC NHẬN].' FROM posts WHERE slug = 'nhan-tra-phong-f21-giay-to';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Trong phòng F21 Hotel có gì? Tiện nghi từng hạng phòng, đồ nên mang', 'trong-phong-f21-co-gi', 'Mọi phòng F21 có điều hoà, wifi miễn phí, nước nóng và 2 chai nước suối. Đơn VIP có bồn tắm, Phòng Đôi có hai giường; thiếu đồ thì WinMart+ cách khoảng 3 phút.', 'Mọi phòng ở F21 Hotel đều có **điều hoà, wifi miễn phí, nước nóng** và **2 chai nước suối** miễn phí. Bốn hạng phòng khác nhau ở giường, phòng tắm và chỗ ngồi: Phòng Đơn VIP có bồn tắm, Phòng Đôi có hai giường, Phòng Đôi 4 người có hai giường lớn.

## Phòng ở F21 trông thế nào?

F21 là toà nhà 4 tầng kiến trúc tân cổ điển trong khu biệt thự Hoa Phượng, sảnh lễ tân lát đá cẩm thạch. Trong phòng:

- Cửa sổ vòm, rèm voan, sàn gỗ.
- Phòng tắm ngăn bằng vách kính.
- Một số phòng có ban công và bộ ghế cổ điển [CẦN XÁC NHẬN: những phòng nào có ban công].

Muốn phòng có ban công, bạn ghi vào ô yêu cầu thêm khi đặt, lễ tân sắp xếp nếu còn phòng. Diện tích từng hạng phòng: [CẦN XÁC NHẬN].

## Mỗi hạng phòng có gì riêng?

| Hạng phòng | Khách | Giường | Phòng tắm | Đồ trong phòng |
|---|---|---|---|---|
| Phòng Đơn | 2 | Giường đôi | Vòi sen, vách kính | TV, bàn làm việc |
| Phòng Đơn VIP | 2 | [CẦN XÁC NHẬN] | Bồn tắm sau vách kính | [CẦN XÁC NHẬN] |
| Phòng Đôi | 3 | Hai giường | [CẦN XÁC NHẬN] | Ghế bành, TV |
| Phòng Đôi 4 người | 4 | Hai giường lớn | Vách kính | Cửa sổ vòm |

- Đi công tác cần chỗ làm việc: **Phòng Đơn** có bàn làm việc.
- Muốn ngâm bồn: chỉ **Phòng Đơn VIP** có bồn tắm (phòng 101, 201, 301, 401).
- Đi 3–4 người không muốn nằm chung giường: **Phòng Đôi** hoặc **Phòng Đôi 4 người**.

So sánh giá và cách chọn theo số khách có trong bài [chọn hạng phòng ở F21](/bai-viet/chon-hang-phong-f21).

## Phòng có khăn tắm, dầu gội, máy sấy tóc không?

F21 chưa công bố đầy đủ danh sách đồ dùng trong phòng. Các mục dưới đây đang chờ khách sạn xác nhận:

- Khăn tắm: [CẦN XÁC NHẬN]
- Bàn chải, kem đánh răng: [CẦN XÁC NHẬN]
- Dầu gội, sữa tắm: [CẦN XÁC NHẬN]
- Máy sấy tóc: [CẦN XÁC NHẬN]
- Tủ lạnh: [CẦN XÁC NHẬN]
- Ấm đun nước: [CẦN XÁC NHẬN]

Nếu món nào quan trọng với bạn, nhắn Zalo **0968 740 333** hỏi lễ tân trước khi đến.

## Nên mang theo những gì khi ở F21?

- **CCCD hoặc hộ chiếu** để làm thủ tục nhận phòng.
- Bàn chải, mỹ phẩm, đồ dùng cá nhân bạn quen dùng.
- Sạc điện thoại, sạc laptop.
- Thuốc cá nhân đang dùng.
- Đồ cho trẻ nhỏ: bỉm, sữa, quần áo thay.
- Đi ăn cưới: quần áo dự tiệc gấp gọn hoặc mang theo móc treo.

## Thiếu đồ thì mua ở đâu gần F21?

| Nơi | Đi từ F21 | Mua gì |
|---|---|---|
| [WinMart+ Đường An Khánh](/kham-pha/winmart-duong-an-khanh) | khoảng 3 phút | Đồ ăn, nước uống, đồ dùng cá nhân |
| [Nhà thuốc khu Nam An Khánh](/kham-pha/nha-thuoc-khu-nam-an-khanh) | khoảng 5 phút | Thuốc thông thường; có Pharmacity, Long Châu, Sun 24h |
| [K-Market Splendora](/kham-pha/k-market-splendora) | khoảng 5 phút | Siêu thị nhỏ hàng Hàn Quốc |
| ATM khu Lê Trọng Tấn | khoảng 5 phút | Techcombank, MB, VPBank, VietinBank |
| Vincom Mega Mall Smart City | 10–15 phút | Siêu thị WinMart, Kohnan, đồ gia dụng |

Thời gian đi xe tham khảo khi đường thông thoáng [CẦN XÁC NHẬN]. **WinMart+ Đường An Khánh** là cửa hàng tiện lợi gần nhất, hợp mua bàn chải, khăn giấy, nước uống, đồ ăn vặt buổi tối. Bạn nên kiểm tra giờ mở cửa trước khi đi.

Ảnh và giá từng phòng có ở trang [Phòng & giá](/phong). Bạn có thể [đặt phòng online](/dat-phong) và ghi yêu cầu như ban công, tầng thấp vào ô yêu cầu thêm.', 'huong-dan', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'trong-phong-f21-co-gi-faq-1', 'Phòng F21 Hotel có wifi miễn phí không?', 'Có. Mọi phòng có wifi miễn phí, cùng điều hoà, nước nóng và 2 chai nước suối.' FROM posts WHERE slug = 'trong-phong-f21-co-gi';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'trong-phong-f21-co-gi-faq-2', 'Phòng nào ở F21 có bồn tắm?', 'Phòng Đơn VIP (101, 201, 301, 401) có bồn tắm sau vách kính. Phòng Đơn dùng vòi sen.' FROM posts WHERE slug = 'trong-phong-f21-co-gi';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'trong-phong-f21-co-gi-faq-3', 'F21 có để sẵn bàn chải, dầu gội trong phòng không?', 'Danh sách đồ dùng phòng tắm đang chờ khách sạn xác nhận [CẦN XÁC NHẬN]. Nếu cần gấp, WinMart+ Đường An Khánh cách khoảng 3 phút.' FROM posts WHERE slug = 'trong-phong-f21-co-gi';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Ở dài ngày phía Tây Hà Nội: giảm đến 15% tại F21 Hotel An Khánh', 'o-dai-ngay-phia-tay-ha-noi', 'Ở F21 Hotel, An Khánh trên 7 ngày liên tiếp giảm 5%, trên 15 ngày giảm 10%, trên 30 ngày giảm 15%. WinMart+, nhà thuốc, ATM, quán cơm cách khoảng 3–5 phút.', 'Ở F21 Hotel (An Khánh, Hà Nội), khách ở **trên 7 ngày liên tiếp được giảm 5%, trên 15 ngày giảm 10%, trên 30 ngày giảm 15%** tổng thanh toán. Với Phòng Đơn giá ngày đêm 900.000đ, ở 31 đêm bạn bớt được khoảng 4,2 triệu đồng so với giá lẻ.

## Ở bao lâu thì được giảm giá?

| Điều kiện | Mức giảm |
|---|---|
| Trên 7 ngày liên tiếp, hoặc lấy trên 7 phòng | 5% |
| Trên 15 ngày liên tiếp, hoặc lấy trên 15 phòng | 10% |
| Trên 30 ngày | 15% tổng thanh toán |

Điều kiện chi tiết ở trang [Ưu đãi ở dài ngày](/uu-dai#o-dai-ngay). Mức giảm theo số ngày và theo số phòng có được cộng dồn hay không, lễ tân sẽ báo khi gửi báo giá [CẦN XÁC NHẬN].

## Ví dụ: ở dài ngày Phòng Đơn hết bao nhiêu tiền?

Ví dụ dưới đây lấy giá ngày đêm Phòng Đơn **900.000đ/đêm**, 1 phòng, 2 khách, chưa tính phụ thu. Đây chỉ là ví dụ để bạn hình dung. Cách tính thực tế (tính theo đêm hay theo ngày, giảm trên tiền phòng hay trên tổng hoá đơn) cần hỏi lại lễ tân [CẦN XÁC NHẬN].

| Số đêm | Giá lẻ | Mức giảm | Còn phải trả |
|---|---|---|---|
| 10 đêm | 9.000.000đ | 5% (450.000đ) | 8.550.000đ |
| 20 đêm | 18.000.000đ | 10% (1.800.000đ) | 16.200.000đ |
| 31 đêm | 27.900.000đ | 15% (4.185.000đ) | 23.715.000đ |

Ở 31 đêm, mỗi đêm còn khoảng **765.000đ**. Ở dài ngày vẫn cần đặt cọc tối thiểu 50% tiền phòng. Lịch thanh toán phần còn lại (theo tuần hay khi trả phòng) bạn thống nhất với lễ tân [CẦN XÁC NHẬN].

## Ai hay ở dài ngày tại F21?

- **Đội thi công, lắp đặt** làm công trình quanh An Khánh, Tây Mỗ, Lê Trọng Tấn. Phòng Đôi (3 khách) và Phòng Đôi 4 người giúp chia chi phí theo đầu người.
- **Kỹ sư, cán bộ dự án** công tác vài tuần. Phòng Đơn có bàn làm việc, wifi miễn phí.
- **Người mới chuyển công tác** về phía Tây Hà Nội, cần chỗ ở tạm trong lúc tìm nhà.

Đội đông người vừa ở dài ngày vừa lấy nhiều phòng nên xem thêm trang [Khách đoàn](/doan-doanh-nghiep).

## Mua đồ, ăn uống hằng ngày ở đâu gần F21?

| Nhu cầu | Địa điểm | Đi từ F21 |
|---|---|---|
| Đồ ăn, nước uống, đồ dùng cá nhân | [WinMart+ Đường An Khánh](/kham-pha/winmart-duong-an-khanh) | ~3 phút |
| Mua thuốc | Nhà thuốc khu Nam An Khánh (Pharmacity, Long Châu, Sun 24h…) | ~5 phút |
| Rút tiền | [ATM & ngân hàng khu Lê Trọng Tấn](/kham-pha/atm-ngan-hang-khu-le-trong-tan) (Techcombank, MB, VPBank, VietinBank) | ~5 phút |
| Cơm, phở, bún | Dãy quán ăn Khu A Geleximco, Cơm gà Hội An, Phở Thìn | ~5 phút |
| Bún chả | Bún chả Cô Lan, thôn An Thọ | ~3 phút |
| Đổ xăng | Cửa hàng xăng dầu Trung Thượng | ~5 phút |
| Khám bệnh | Trạm Y tế xã An Khánh (cạnh Vinschool) / Vinmec Smart City, cấp cứu 24 giờ | ~3 phút / 5–10 phút |

Siêu thị lớn hơn có ở Vincom Mega Mall Smart City và AEON Mall Hà Đông (10–15 phút).

## Từ F21 đi làm có thuận không?

F21 nằm trong khu biệt thự Hoa Phượng, cạnh Vinschool, gần cổng 1 Vinhomes Thăng Long. Bằng ô tô khi đường thông thoáng, ra Đại lộ Thăng Long mất khoảng 5 phút, tới Trung tâm Hội nghị Quốc gia khoảng 15 phút, tới SVĐ Mỹ Đình khoảng 15–20 phút theo Lê Trọng Tấn kéo dài [CẦN XÁC NHẬN]. Đường trong khu rộng, xe máy và ô tô đỗ ngay trước khách sạn. Xe tải, xe chở vật tư của đội thi công nên báo trước để lễ tân sắp chỗ [CẦN XÁC NHẬN: chỗ đỗ, có mất phí không].

## Phòng có gì cho người ở lâu?

Phòng có điều hoà, nước nóng, wifi miễn phí và 2 chai nước suối. Tủ lạnh, ấm đun, giặt là, lịch dọn phòng khi ở dài ngày hiện chưa được công bố [CẦN XÁC NHẬN], bạn nên hỏi lễ tân trước khi chốt. Xem từng hạng phòng ở [Phòng & giá](/phong).

Để nhận báo giá ở dài ngày, bạn gửi ngày nhận phòng, số đêm dự kiến, số người và hạng phòng qua Zalo hoặc hotline **0968 740 333**, hoặc [đặt online](/dat-phong). Khách đặt trước không được hoàn tiền khi thay đổi, nên chốt lịch rồi hãy đặt cọc.', 'doan', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'o-dai-ngay-phia-tay-ha-noi-faq-1', 'Ở F21 Hotel một tháng được giảm bao nhiêu?', 'Ở trên 30 ngày được giảm 15% tổng thanh toán. Cách tính cụ thể lễ tân báo khi gửi báo giá [CẦN XÁC NHẬN].' FROM posts WHERE slug = 'o-dai-ngay-phia-tay-ha-noi';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'o-dai-ngay-phia-tay-ha-noi-faq-2', 'Gần F21 có cửa hàng tiện lợi, nhà thuốc không?', 'Có. WinMart+ Đường An Khánh cách khoảng 3 phút, các nhà thuốc ở khu Nam An Khánh khoảng 5 phút đi xe.' FROM posts WHERE slug = 'o-dai-ngay-phia-tay-ha-noi';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'o-dai-ngay-phia-tay-ha-noi-faq-3', 'Đội thợ 4 người ở chung một phòng được không?', 'Được. Phòng Đôi 4 người có hai giường lớn, dành cho 4 khách; thêm người so với quy định phụ thu 100.000đ/người.' FROM posts WHERE slug = 'o-dai-ngay-phia-tay-ha-noi';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Đi công tác phía Tây Hà Nội nghỉ ở đâu: An Khánh gần Đại lộ Thăng Long', 'cong-tac-phia-tay-ha-noi-o-dau', 'F21 Hotel ở An Khánh cách Đại lộ Thăng Long khoảng 5 phút, TT Hội nghị Quốc gia khoảng 15 phút. Phòng Đơn có bàn làm việc, wifi miễn phí, ngày đêm 900.000đ.', 'Nếu công việc của bạn ở Mỹ Đình, Tây Mỗ hay dọc Đại lộ Thăng Long, nghỉ ở **An Khánh** giúp đi lại gọn. F21 Hotel ở khu biệt thự Hoa Phượng, An Khánh, cách Đại lộ Thăng Long **khoảng 5 phút** và Trung tâm Hội nghị Quốc gia **khoảng 15 phút** ô tô. Phòng Đơn có bàn làm việc, wifi miễn phí, giá ngày đêm **900.000đ**.

## Vì sao người đi công tác chọn An Khánh?

- Gần trục chính: ra Đại lộ Thăng Long nhanh, đi Mỹ Đình theo Lê Trọng Tấn kéo dài.
- Buổi tối yên tĩnh: F21 nằm trong khu biệt thự, cạnh Vinschool, không ở mặt phố lớn.
- Có ô tô thì đỗ ngay trước khách sạn, đường trong khu rộng [CẦN XÁC NHẬN: chỗ đỗ, có mất phí không].

| Điểm đến | Thời gian ô tô (khoảng) |
|---|---|
| Đại lộ Thăng Long | ~5 phút |
| Bệnh viện Vinmec Smart City | 5–10 phút |
| Bảo tàng Lịch sử Quân sự Việt Nam (Km 6+500 Đại lộ Thăng Long) | 10–15 phút |
| Trung tâm Hội nghị Quốc gia | ~15 phút |
| SVĐ Mỹ Đình | 15–20 phút |
| Phố cổ Hoàn Kiếm | ~35 phút |

Thời gian tính khi đường thông thoáng, giờ cao điểm sẽ lâu hơn [CẦN XÁC NHẬN]. Nếu bạn đi dự hội nghị, triển lãm, xem bài riêng [Hội nghị, triển lãm ở TT Hội nghị Quốc gia](/bai-viet/hoi-nghi-trien-lam-tt-hoi-nghi-quoc-gia).

## Phòng nào hợp người đi công tác?

| Hạng phòng | Khách | Qua đêm | Ngày đêm | Hợp khi |
|---|---|---|---|---|
| Phòng Đơn | 2 | 600.000đ | 900.000đ | Đi một mình, cần bàn làm việc |
| Phòng Đơn VIP | 2 | 700.000đ | 1.000.000đ | Muốn có bồn tắm sau ngày dài |
| Phòng Đôi | 3 | 750.000đ | 1.100.000đ | Hai, ba đồng nghiệp ở chung, mỗi người một giường |

Phòng Đơn có giường đôi, bàn làm việc, TV, phòng tắm vòi sen vách kính. F21 có 8 Phòng Đơn ở cả 4 tầng, nhiều nhất trong các hạng phòng.

## Nên đặt qua đêm hay ngày đêm?

- **Ngày đêm** (nhận 14:00, trả trước 12:00 hôm sau): đến từ chiều, cần chỗ nghỉ trước buổi làm việc sáng hôm sau.
- **Qua đêm** (nhận sau 19:00, trả trước 10:00): đến muộn sau bữa tối công việc, sáng đi sớm. Giá thấp hơn ngày đêm.
- Công tác cả tuần: ở trên 7 ngày liên tiếp được giảm 5%, xem [Ưu đãi](/uu-dai).

## Ăn sáng và cà phê làm việc ở đâu gần F21?

F21 chưa công bố dịch vụ bữa sáng [CẦN XÁC NHẬN], bạn có thể ăn ở các quán quanh khách sạn:

| Món | Quán | Đi từ F21 |
|---|---|---|
| Phở bò | [Phở Thìn (Khu A Geleximco)](/kham-pha/pho-thin-khu-a-geleximco) | ~5 phút |
| Bún chả | Bún chả Cô Lan, thôn An Thọ | ~3 phút |
| Cơm trưa | Cơm gà Hội An, dãy quán Khu A Geleximco | ~5 phút |
| Cà phê gần nhất | [Lago Cafe](/kham-pha/lago-cafe), KĐT Nam An Khánh | ~3 phút |
| Cà phê chuỗi | Highlands Coffee Geleximco | ~5 phút |
| Cà phê phong cách bao cấp | Cộng Cà Phê Splendora | ~5 phút |

Giờ mở cửa và chỗ ngồi làm việc của từng quán bạn nên xem trên Google Maps trước khi đi.

## F21 có xuất hoá đơn cho công ty không?

Việc xuất hoá đơn VAT cho tiền phòng hiện chưa được khách sạn công bố [CẦN XÁC NHẬN], giá phòng đã gồm VAT hay chưa cũng cần hỏi lại [CẦN XÁC NHẬN]. Nếu công ty cần hoá đơn để quyết toán công tác phí, bạn hỏi lễ tân trước khi đặt cọc và gửi kèm tên công ty, mã số thuế, địa chỉ. Công ty cử nhiều người đi cùng đợt có thể gửi yêu cầu ở trang [Khách đoàn](/doan-doanh-nghiep).

## Đi lại hằng ngày thế nào?

Lễ tân gọi taxi đón tận cửa khách sạn. Khi đặt phòng, lễ tân gửi ghim vị trí qua Zalo để bạn gửi cho tài xế. Đường vào: đi vào khu biệt thự Hoa Phượng theo hướng cổng 1 Vinhomes Thăng Long, khách sạn ở cạnh Vinschool.

Bạn có thể [đặt phòng online](/dat-phong), hoặc gọi, nhắn Zalo **0968 740 333** và báo giờ đến dự kiến để lễ tân giữ phòng.', 'doan', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'cong-tac-phia-tay-ha-noi-o-dau-faq-1', 'Từ F21 tới Trung tâm Hội nghị Quốc gia mất bao lâu?', 'Khoảng 15 phút ô tô khi đường thông thoáng [CẦN XÁC NHẬN]. Lễ tân có thể gọi taxi đón tận cửa.' FROM posts WHERE slug = 'cong-tac-phia-tay-ha-noi-o-dau';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'cong-tac-phia-tay-ha-noi-o-dau-faq-2', 'Phòng ở F21 có bàn làm việc và wifi không?', 'Phòng Đơn có bàn làm việc. Wifi miễn phí.' FROM posts WHERE slug = 'cong-tac-phia-tay-ha-noi-o-dau';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'cong-tac-phia-tay-ha-noi-o-dau-faq-3', 'F21 Hotel có xuất hoá đơn VAT không?', 'Hiện chưa có thông tin chính thức [CẦN XÁC NHẬN]. Bạn nên hỏi lễ tân trước khi đặt cọc.' FROM posts WHERE slug = 'cong-tac-phia-tay-ha-noi-o-dau';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Đặt phòng đoàn, tất niên ở An Khánh: 19 phòng, ưu đãi khối phòng ở F21', 'dat-phong-doan-tat-nien-an-khanh', 'F21 Hotel ở An Khánh có 19 phòng, nhận khối phòng tất niên từ 5 phòng trong 12/2026 – 1/2027, một đầu mối liên hệ. Lấy trên 7 phòng giảm 5%, trên 15 phòng giảm 10%.', 'F21 Hotel nhận giữ **khối phòng tất niên từ 5 phòng** trong tháng 12/2026 – 1/2027, làm việc qua **một đầu mối liên hệ**. Lấy trên 7 phòng giảm 5%, trên 15 phòng giảm 10%. Khách sạn có 19 phòng thuộc 4 hạng, ở được **49 khách** theo số người quy định của từng phòng.

## Ưu đãi khối phòng tất niên gồm những gì?

- Giữ từ 5 phòng trở lên cho cùng ngày, áp dụng tháng 12/2026 – 1/2027.
- Một người đầu mối làm việc với lễ tân cho cả đoàn: chốt số phòng, danh sách, thanh toán.
- Nhận phòng sớm khi khách sạn còn phòng trống (không cam kết trước).
- Giảm theo số phòng: trên 7 phòng giảm 5%, trên 15 phòng giảm 10%.

Mức giảm theo số phòng có áp dụng cùng ưu đãi tất niên hay không, lễ tân báo khi gửi báo giá [CẦN XÁC NHẬN]. Chi tiết ở trang [Ưu đãi](/uu-dai) và [Khách đoàn](/doan-doanh-nghiep).

## F21 nhận đoàn tối đa bao nhiêu người?

| Hạng phòng | Số phòng | Khách/phòng | Tổng khách | Ngày đêm | Qua đêm |
|---|---|---|---|---|---|
| Phòng Đơn | 8 | 2 | 16 | 900.000đ | 600.000đ |
| Phòng Đơn VIP | 4 | 2 | 8 | 1.000.000đ | 700.000đ |
| Phòng Đôi | 3 | 3 | 9 | 1.100.000đ | 750.000đ |
| Phòng Đôi 4 người | 4 | 4 | 16 | 1.200.000đ | 800.000đ |
| **Cộng** | **19** | | **49** | | |

Thêm người so với quy định phụ thu 100.000đ/người; mỗi phòng thêm được tối đa mấy người cần hỏi lễ tân [CẦN XÁC NHẬN].

Ví dụ: đoàn lấy trọn 19 phòng một đêm theo giá ngày đêm là 19.300.000đ. Trên 15 phòng giảm 10% còn **17.370.000đ**, chia cho 49 khách khoảng 355.000đ/người. Đây là ví dụ tham khảo, báo giá thực tế do lễ tân gửi [CẦN XÁC NHẬN].

## Chia phòng theo hạng thế nào cho hợp?

- **Ban lãnh đạo, khách mời**: Phòng Đơn VIP có bồn tắm, mỗi tầng một phòng.
- **Nhân viên đi một mình hoặc đi cặp**: Phòng Đơn, giường đôi.
- **Nhóm 3 người cùng phòng ban**: Phòng Đôi, hai giường.
- **Nhân viên đi cùng gia đình, hoặc nhóm 4 người**: Phòng Đôi 4 người, hai giường lớn.

Tầng 2, 3 và 4 mỗi tầng có 5 phòng đủ cả 4 hạng; tầng 1 có 4 phòng (không có Phòng Đôi). Đoàn có thể xếp mỗi bộ phận một tầng cho tiện tập trung.

## Gửi danh sách đoàn thế nào?

1. Người đầu mối nhắn Zalo hoặc gọi **0968 740 333**: ngày nhận, ngày trả, hình thức (ngày đêm hay qua đêm), số phòng mỗi hạng.
2. Lễ tân gửi báo giá và giữ phòng. Đoàn đặt cọc tối thiểu 50% tiền phòng.
3. Gửi danh sách xếp phòng (tên từng người theo hạng hoặc số phòng) trước ngày đến [CẦN XÁC NHẬN: hạn gửi danh sách, giấy tờ cần mang khi nhận phòng].
4. Báo giờ đến dự kiến và số xe để lễ tân chuẩn bị.

Khách đặt trước không được hoàn tiền khi thay đổi (xem [Điều khoản](/dieu-khoan)), vì vậy nên chốt số người trước khi cọc. Công ty cần hoá đơn VAT thì hỏi trước khi đặt [CẦN XÁC NHẬN].

## Xe đoàn đỗ ở đâu?

Đường trong khu biệt thự Hoa Phượng rộng, ô tô và xe máy đỗ ngay trước khách sạn. Đoàn nhiều xe hoặc đi xe khách cần báo trước để lễ tân sắp chỗ [CẦN XÁC NHẬN: chỗ đỗ cho xe lớn, có mất phí không]. Từ khách sạn ra Đại lộ Thăng Long khoảng 5 phút ô tô [CẦN XÁC NHẬN].

## Ăn uống, vui chơi cả nhóm ở đâu gần F21?

- [Dãy quán ăn Khu A Geleximco Lê Trọng Tấn](/kham-pha/day-quan-an-khu-a-geleximco-le-trong-tan) (~5 phút): nhiều quán phở, bún, cơm, lẩu nướng, cà phê.
- [Bò An Khang](/kham-pha/bo-an-khang) (~5 phút): nhà hàng món bò ở KĐT Sudico Nam An Khánh.
- Dê Linh Đan, Trọng Hải Sản, Quán nhậu Tự Do: đều khoảng 5 phút.
- Karaoke London trên đường Lê Trọng Tấn (~5 phút).
- Sân pickleball trong khu Hoa Phượng (3–5 phút) cho buổi giao lưu sáng hôm sau; Thiên đường Bảo Sơn (~5 phút) nếu đoàn có gia đình, trẻ nhỏ.

Đặt bàn, phòng riêng cho tiệc tất niên bạn liên hệ trực tiếp với nhà hàng.

Gửi yêu cầu báo giá khối phòng ở trang [Khách đoàn](/doan-doanh-nghiep), hoặc gọi, nhắn Zalo **0968 740 333**. Tháng 12 và tháng 1 nhiều đoàn đặt, nên giữ phòng sớm.', 'doan', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'dat-phong-doan-tat-nien-an-khanh-faq-1', 'F21 Hotel nhận đoàn tối đa bao nhiêu người?', '19 phòng ở được 49 khách theo quy định. Thêm người phụ thu 100.000đ/người; số người thêm tối đa mỗi phòng [CẦN XÁC NHẬN].' FROM posts WHERE slug = 'dat-phong-doan-tat-nien-an-khanh';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'dat-phong-doan-tat-nien-an-khanh-faq-2', 'Đặt khối phòng tất niên cần tối thiểu mấy phòng?', 'Từ 5 phòng, áp dụng tháng 12/2026 – 1/2027, cả đoàn làm việc qua một đầu mối.' FROM posts WHERE slug = 'dat-phong-doan-tat-nien-an-khanh';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'dat-phong-doan-tat-nien-an-khanh-faq-3', 'Đoàn đổi số phòng sau khi đặt cọc được không?', 'Khách đặt trước không được hoàn tiền khi thay đổi, nên chốt số phòng trước khi cọc. Chi tiết ở trang Điều khoản.' FROM posts WHERE slug = 'dat-phong-doan-tat-nien-an-khanh';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Về An Khánh ăn cưới: chỗ nghỉ cho họ hàng gần Vinhomes Thăng Long', 'an-cuoi-an-khanh-cho-nghi-ho-hang', 'F21 Hotel cách cổng 1 Vinhomes Thăng Long khoảng 1–2 phút, giữ nhiều phòng theo ngày cưới đến 31/1/2027. Phòng Đôi 4 người cho gia đình có ông bà, trẻ nhỏ từ 800.000đ.', 'Họ hàng về ăn cưới ở Vinhomes Thăng Long, Nam An Khánh có thể nghỉ ở F21 Hotel, cách **cổng 1 Vinhomes Thăng Long khoảng 1–2 phút** ô tô. Đến **31/1/2027**, F21 có ưu đãi mùa cưới: giữ nhiều phòng theo ngày cưới cho họ hàng, có Phòng Đôi 4 người cho gia đình đi cùng ông bà, trẻ nhỏ.

## F21 cách nơi tổ chức cưới bao xa?

F21 ở khu biệt thự Hoa Phượng, An Khánh, cạnh Vinschool, gần cổng 1 Vinhomes Thăng Long.

| Điểm đến | Thời gian ô tô (khoảng) |
|---|---|
| Cổng 1 Vinhomes Thăng Long, Vinschool | 1–2 phút |
| KĐT Nam An Khánh, Sudico | 3–5 phút |
| Đại lộ Thăng Long | ~5 phút |
| Phố cổ Hoàn Kiếm | ~35 phút |

Thời gian tính khi đường thông thoáng [CẦN XÁC NHẬN]. Khi đặt phòng, lễ tân gửi ghim vị trí qua Zalo; bạn chuyển ghim này cho họ hàng và tài xế để khỏi lạc trong khu đô thị. Xem thêm trang [Vị trí](/vi-tri).

## Giữ phòng cho họ hàng theo ngày cưới thế nào?

1. Chọn một người làm đầu mối, liệt kê số gia đình, số người lớn, người cao tuổi, trẻ em, ngày đến và ngày về.
2. Nhắn Zalo hoặc gọi **0968 740 333** để lễ tân giữ phòng theo ngày cưới. Ưu đãi mùa cưới áp dụng đến 31/1/2027, xem trang [Ưu đãi](/uu-dai).
3. Đặt cọc tối thiểu 50% tiền phòng. Khách đặt trước không được hoàn tiền khi thay đổi, nên chốt danh sách rồi hãy cọc.
4. Lấy trên 7 phòng giảm 5%, trên 15 phòng giảm 10% [CẦN XÁC NHẬN: có áp dụng cùng ưu đãi mùa cưới không].

Ngày đẹp thường nhiều nhà cùng tổ chức cưới, nên giữ phòng sớm ngay khi chốt ngày.

## Phòng nào cho gia đình có ông bà, trẻ nhỏ?

| Hạng phòng | Khách | Qua đêm | Ngày đêm | Hợp với |
|---|---|---|---|---|
| Phòng Đôi 4 người | 4 | 800.000đ | 1.200.000đ | Ông bà đi cùng con cháu, gia đình 4 người |
| Phòng Đôi | 3 | 750.000đ | 1.100.000đ | Bố mẹ và một con |
| Phòng Đơn | 2 | 600.000đ | 900.000đ | Hai vợ chồng, hai anh em |
| Phòng Đơn VIP | 2 | 700.000đ | 1.000.000đ | Vợ chồng muốn có bồn tắm |

Phòng Đôi 4 người có hai giường lớn, cửa sổ vòm, phòng tắm vách kính. Phòng 102 ở tầng 1, hợp ông bà ngại lên xuống cầu thang [CẦN XÁC NHẬN: toà nhà có thang máy không]. Đông hơn số khách quy định phụ thu **100.000đ/người**; trẻ em có tính vào số người hay không, lễ tân sẽ báo [CẦN XÁC NHẬN].

## Chọn qua đêm hay ngày đêm cho hợp lịch cưới?

- **Ngày đêm** (nhận 14:00, trả trước 12:00 hôm sau): họ hàng ở tỉnh về từ chiều hôm trước, nghỉ một đêm, sáng dự lễ rồi trả phòng trước trưa.
- **Qua đêm** (nhận sau 19:00, trả trước 10:00): dự tiệc tối xong mới về nghỉ, sáng hôm sau lên đường sớm.
- **Nghỉ giờ** (tính 2 giờ đầu): chỉ cần chỗ thay đồ, nghỉ trưa trước giờ tiệc.

Giá từng hình thức xem bài [Nghỉ giờ, qua đêm: giá và giờ](/bai-viet/nghi-gio-qua-dem-an-khanh-gia-va-gio).

## Quanh F21 có gì tiện cho người lớn tuổi, trẻ nhỏ?

- [WinMart+ Đường An Khánh](/kham-pha/winmart-duong-an-khanh) (~3 phút): đồ ăn, nước uống, đồ dùng cá nhân.
- Nhà thuốc khu Nam An Khánh (~5 phút); Trạm Y tế xã An Khánh cạnh Vinschool (~3 phút); Bệnh viện Vinmec Smart City (5–10 phút) có cấp cứu 24 giờ.
- Ăn sáng trước giờ đón dâu: Phở Thìn (~5 phút), Bún chả Cô Lan (~3 phút).
- Ở thêm một ngày cho trẻ đi chơi: Thiên đường Bảo Sơn cách khoảng 5 phút.

Ô tô của gia đình đỗ ngay trước khách sạn; nhiều xe thì báo trước để lễ tân sắp chỗ [CẦN XÁC NHẬN: chỗ đỗ, có mất phí không]. Lễ tân gọi taxi đón tận cửa khi cả nhà đi dự tiệc.

Bạn có thể [đặt phòng online](/dat-phong) cho từng gia đình, hoặc gửi danh sách cả họ qua Zalo **0968 740 333** để lễ tân giữ phòng theo ngày cưới.', 'huong-dan', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'an-cuoi-an-khanh-cho-nghi-ho-hang-faq-1', 'Từ F21 Hotel tới Vinhomes Thăng Long mất bao lâu?', 'Khoảng 1–2 phút ô tô tới cổng 1 [CẦN XÁC NHẬN]. Lễ tân gửi ghim vị trí qua Zalo khi bạn đặt phòng.' FROM posts WHERE slug = 'an-cuoi-an-khanh-cho-nghi-ho-hang';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'an-cuoi-an-khanh-cho-nghi-ho-hang-faq-2', 'Ưu đãi mùa cưới ở F21 áp dụng đến khi nào?', 'Đến 31/1/2027. Khách sạn giữ nhiều phòng theo ngày cưới cho họ hàng.' FROM posts WHERE slug = 'an-cuoi-an-khanh-cho-nghi-ho-hang';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'an-cuoi-an-khanh-cho-nghi-ho-hang-faq-3', 'Phòng 4 người có ở thêm người được không?', 'Mỗi người vượt số khách quy định phụ thu 100.000đ. Mỗi phòng thêm được tối đa mấy người cần hỏi lễ tân [CẦN XÁC NHẬN].' FROM posts WHERE slug = 'an-cuoi-an-khanh-cho-nghi-ho-hang';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Cặp đôi nghỉ cuối tuần phía Tây Hà Nội: phòng bồn tắm, gợi ý buổi tối', 'cap-doi-cuoi-tuan-phia-tay-ha-noi', 'Phòng Đơn VIP ở F21 Hotel, An Khánh có bồn tắm, qua đêm 700.000đ, ngày đêm 1.000.000đ. Cà phê Splendora, Vườn Nhật, rạp phim Vincom cách khoảng 5–15 phút.', 'Cặp đôi muốn nghỉ cuối tuần mà không đi xa Hà Nội có thể chọn **Phòng Đơn VIP** ở F21 Hotel, An Khánh: phòng có **bồn tắm sau vách kính**, giá qua đêm **700.000đ**, ngày đêm **1.000.000đ**. Quán cà phê, công viên, rạp phim quanh khách sạn đều trong khoảng 5–15 phút đi xe.

## Phòng Đơn VIP khác Phòng Đơn thế nào?

| | Phòng Đơn | Phòng Đơn VIP |
|---|---|---|
| Số khách | 2 | 2 |
| Phòng tắm | Vòi sen, vách kính | Có bồn tắm sau vách kính |
| Qua đêm | 600.000đ | 700.000đ |
| Ngày đêm | 900.000đ | 1.000.000đ |
| Số phòng | 8 | 4 (101, 201, 301, 401) |

Toà nhà kiến trúc tân cổ điển, sảnh lát đá cẩm thạch; phòng có cửa sổ vòm, rèm voan, sàn gỗ. F21 nằm trong khu biệt thự Hoa Phượng nên buổi tối yên tĩnh. Phòng Đơn VIP chỉ có 4 phòng, mỗi tầng một phòng, cuối tuần nên đặt trước. Nếu cần máy sấy tóc hay đồ dùng phòng tắm riêng, bạn hỏi lễ tân trước [CẦN XÁC NHẬN].

Xem ảnh và giá tất cả hạng phòng ở [Phòng & giá](/phong).

## Nên đặt qua đêm hay ngày đêm?

- **Ngày đêm** (nhận 14:00, trả trước 12:00 hôm sau): nhận phòng chiều thứ Bảy, có cả buổi chiều nghỉ ngơi trước khi đi chơi tối.
- **Qua đêm** (nhận sau 19:00, trả trước 10:00): đi ăn tối, xem phim xong mới về nhận phòng. Giá thấp hơn 300.000đ so với ngày đêm.

## Buổi tối đi đâu gần F21?

| Gợi ý | Địa điểm | Đi từ F21 |
|---|---|---|
| Cà phê phong cách bao cấp | [Cộng Cà Phê Splendora](/kham-pha/cong-ca-phe-splendora), phố đi bộ KĐT Splendora | ~5 phút |
| Đi dạo, chụp ảnh | [Vườn Nhật Vinhomes Smart City](/kham-pha/vuon-nhat-vinhomes-smart-city) | 10–15 phút |
| Ăn tối | Khu ẩm thực Vincom Mega Mall Smart City: Pizza 4P''s, King BBQ, Thai Express, dãy cà phê ven hồ | 10–15 phút |
| Xem phim | Rạp AEON BETA Vincom Smart City, 7 phòng chiếu | 10–15 phút |

Vườn Nhật nằm cạnh Vincom Mega Mall Smart City, nên có thể đi một chuyến: dạo vườn lúc chiều muộn, ăn tối trong Vincom, xem suất phim tối ở rạp cùng toà nhà rồi về khách sạn. Giờ chiếu phim và giờ mở cửa bạn xem trên website, fanpage chính thức của rạp và trung tâm thương mại trước khi đi.

Muốn ăn tối gần hơn, có Bò An Khang và Trọng Hải Sản cách khoảng 5 phút.

## Sáng Chủ nhật làm gì trước khi trả phòng?

- Cà phê sáng ở Lago Cafe (~3 phút) trong KĐT Nam An Khánh, hoặc Highlands Coffee Geleximco (~5 phút).
- Ăn sáng ở Phở Thìn, Khu A Geleximco (~5 phút).
- Chơi pickleball ở các sân trong khu biệt thự Hoa Phượng (3–5 phút) nếu cả hai thích vận động.

Muốn đi thêm một ngày, xem gợi ý trong bài [Lịch trình Hà Nội 3 ngày 2 đêm ở phía Tây](/bai-viet/lich-trinh-ha-noi-3-ngay-2-dem-o-phia-tay).

## Noel 24–25/12/2026 có ưu đãi gì?

Dịp Noel 24–25/12/2026 (thứ Năm và thứ Sáu), F21 có Phòng Đơn VIP qua đêm từ **700.000đ**. Chi tiết trang trí phòng dịp Noel [CẦN XÁC NHẬN]. Điều kiện xem ở trang [Ưu đãi](/uu-dai). Vì chỉ có 4 phòng VIP, bạn nên đặt sớm.

Đặt trước cần cọc tối thiểu 50% tiền phòng, khách đặt trước không được hoàn tiền khi thay đổi. Bạn có thể [đặt online](/dat-phong) hoặc nhắn Zalo **0968 740 333** để giữ Phòng Đơn VIP cho ngày mình muốn.', 'huong-dan', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'cap-doi-cuoi-tuan-phia-tay-ha-noi-faq-1', 'Phòng có bồn tắm ở F21 Hotel giá bao nhiêu?', 'Phòng Đơn VIP có bồn tắm, cho 2 khách: qua đêm 700.000đ, ngày đêm 1.000.000đ.' FROM posts WHERE slug = 'cap-doi-cuoi-tuan-phia-tay-ha-noi';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'cap-doi-cuoi-tuan-phia-tay-ha-noi-faq-2', 'Từ F21 đi Vincom Mega Mall Smart City mất bao lâu?', 'Khoảng 10–15 phút đi xe. Ở đó có rạp AEON BETA và khu ẩm thực, Vườn Nhật ở ngay cạnh.' FROM posts WHERE slug = 'cap-doi-cuoi-tuan-phia-tay-ha-noi';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'cap-doi-cuoi-tuan-phia-tay-ha-noi-faq-3', 'Noel 2026 ở F21 có ưu đãi gì?', 'Ngày 24–25/12/2026, Phòng Đơn VIP qua đêm từ 700.000đ. Chi tiết trang trí phòng [CẦN XÁC NHẬN].' FROM posts WHERE slug = 'cap-doi-cuoi-tuan-phia-tay-ha-noi';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Ăn sáng, ăn trưa gần F21 Hotel: phở, bún chả, cơm gà ở An Khánh', 'an-sang-an-trua-quanh-f21', 'Quanh F21 ở An Khánh có bún chả cách khoảng 3 phút, phở bò và cơm gà ở Khu A Geleximco khoảng 5 phút; đi xa hơn 10–15 phút có quầy đồ ăn sẵn ở AEON.', 'Từ F21, quán ăn sáng, ăn trưa gần nhất cách **khoảng 3–5 phút** đi xe: bún chả ở thôn An Thọ, phở bò và cơm gà ở dãy shophouse Khu A Geleximco trên đường Lê Trọng Tấn. Nếu muốn nhiều lựa chọn trong một chỗ, siêu thị trong Aeon Mall Hà Đông có quầy đồ ăn sẵn, đi khoảng 10–15 phút.

## Gần F21 có quán nào ăn sáng, ăn trưa?

| Quán | Món chính | Đi từ F21 |
|---|---|---|
| [Bún chả Cô Lan](/kham-pha/bun-cha-co-lan) | Bún chả | khoảng 3 phút |
| [Phở Thìn (Khu A Geleximco)](/kham-pha/pho-thin-khu-a-geleximco) | Phở bò | khoảng 5 phút |
| [Cơm gà Hội An (Geleximco A)](/kham-pha/com-ga-hoi-an-geleximco-a) | Cơm gà kiểu Hội An | khoảng 5 phút |
| [Dãy quán ăn Khu A Geleximco](/kham-pha/day-quan-an-khu-a-geleximco-le-trong-tan) | Phở, bún, cơm, lẩu nướng, cà phê | khoảng 5 phút |

Thời gian trên tính bằng ô tô hoặc xe máy khi đường thông thoáng [CẦN XÁC NHẬN]. F21 chưa kiểm tra giờ mở cửa và giá món của từng quán [CẦN XÁC NHẬN]. Quán nhỏ có thể nghỉ đột xuất, nên gọi trước hoặc hỏi lễ tân trước khi đi.

## Sáng muốn ăn phở thì đi đâu?

**Phở Thìn** ở số 19A33 Khu A Geleximco, đường Lê Trọng Tấn, là quán phở bò trong khu shophouse, đi từ F21 khoảng 5 phút. Quán nằm giữa dãy nhiều hàng ăn khác, nên nếu quán đông, bạn có thể đổi sang hàng phở, bún bên cạnh mà không phải đi thêm.

Khu A Geleximco cũng gần Thiên đường Bảo Sơn. Gia đình định đi công viên buổi sáng có thể ăn sáng ở đây rồi đi tiếp.

## Ăn trưa gần khách sạn có gì?

### Bún chả Cô Lan

Quán bún chả ở thôn An Thọ, An Khánh, là chỗ gần F21 nhất trong danh sách, **khoảng 3 phút** đi xe. Hợp khi bạn chỉ có ít thời gian nghỉ trưa giữa hai buổi họp hoặc hai buổi đi chơi. Giờ bán trong ngày nên hỏi lễ tân trước khi đi.

### Cơm gà Hội An

Quán cơm gà kiểu Hội An ở A33 lô 2 Khu A Geleximco, khoảng 5 phút. Đây là lựa chọn cho bữa trưa nhanh, một người một suất, hợp khách đi công tác.

### Dãy quán Khu A Geleximco

Cụm shophouse này có nhiều quán phở, bún, cơm, lẩu nướng và cà phê đứng gần nhau. Đi nhóm mỗi người muốn một món, đây là nơi dễ chọn nhất quanh F21. Ăn xong có thể ngồi cà phê ngay trong dãy.

## Muốn nhiều lựa chọn hơn thì đi đâu?

Nếu đi xa được **khoảng 10–15 phút**, [Aeon Mall Hà Đông](/kham-pha/nha-hang-tai-aeon-mall-ha-dong) có nhà hàng Nhật, Thái, Âu ở tầng 1–2 và quầy đồ ăn sẵn trong siêu thị AEON. Cách này hợp khi đi cùng trẻ nhỏ hoặc người cao tuổi, muốn ăn trong trung tâm thương mại rồi đi dạo, mua sắm luôn.

## Đi ăn từ F21 thế nào cho tiện?

- **Đi xe máy, ô tô riêng**: hỏi lễ tân đường ra Lê Trọng Tấn và Khu A Geleximco trước khi đi.
- **Không có xe**: lễ tân gọi taxi đón tận cửa, hoặc bạn đặt xe công nghệ.
- **Trưa nắng, cần nghỉ**: ăn xong về phòng nghỉ trưa. F21 có hình thức nghỉ giờ, xem cách tính ở bài [nghỉ giờ, qua đêm ở An Khánh](/bai-viet/nghi-gio-qua-dem-an-khanh-gia-va-gio).

F21 nằm trong khu biệt thự Hoa Phượng, An Khánh, cạnh Vinschool. Bạn có thể [đặt phòng online](/dat-phong), gọi hotline **0968 740 333** hoặc nhắn Zalo cho lễ tân để giữ phòng và hỏi thêm quán ăn quanh khách sạn.', 'diem-den', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'an-sang-an-trua-quanh-f21-faq-1', 'Quán ăn gần F21 nhất là quán nào?', 'Trong danh sách của F21, gần nhất là Bún chả Cô Lan ở thôn An Thọ, khoảng 3 phút đi xe. Nếu chỉ cần đồ ăn nhanh, WinMart+ Đường An Khánh cũng khoảng 3 phút.' FROM posts WHERE slug = 'an-sang-an-trua-quanh-f21';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'an-sang-an-trua-quanh-f21-faq-2', 'F21 có phục vụ bữa sáng không?', 'Giá phòng hiện gồm 2 chai nước suối miễn phí; bữa sáng chưa có trong thông tin giá phòng [CẦN XÁC NHẬN]. Bạn hỏi lễ tân khi đặt phòng.' FROM posts WHERE slug = 'an-sang-an-trua-quanh-f21';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'an-sang-an-trua-quanh-f21-faq-3', 'Quán ở Khu A Geleximco mở cửa từ mấy giờ?', 'Mỗi quán một giờ khác nhau và F21 chưa kiểm tra [CẦN XÁC NHẬN]. Nên gọi quán trước hoặc hỏi lễ tân trước khi đi.' FROM posts WHERE slug = 'an-sang-an-trua-quanh-f21';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Ăn tối, nhậu, hải sản ở An Khánh: gợi ý quán gần F21 Hotel', 'an-toi-nhau-hai-san-an-khanh', 'Quanh F21 có quán bò, dê, hải sản và quán nhậu cách khoảng 5 phút ở Nam An Khánh, Geleximco; muốn nhiều nhà hàng chuỗi thì Vincom Smart City, Aeon Hà Đông 10–15 phút.', 'Từ F21, các quán ăn tối gần nhất cách **khoảng 5 phút** đi xe: món bò, món dê ở KĐT Nam An Khánh; hải sản và quán nhậu ở Khu A Geleximco, đường Lê Trọng Tấn. Muốn nhiều nhà hàng chuỗi trong một chỗ, Vincom Mega Mall Smart City và Aeon Mall Hà Đông cách **khoảng 10–15 phút**.

## Quanh F21 ăn tối ở đâu?

| Quán | Món | Khu vực | Đi từ F21 |
|---|---|---|---|
| [Bò An Khang](/kham-pha/bo-an-khang) | Món bò | TT32-01 KĐT Sudico Nam An Khánh | khoảng 5 phút |
| [Dê Linh Đan](/kham-pha/de-linh-dan) | Món dê | TT32 nhà số 6, KĐT Nam An Khánh | khoảng 5 phút |
| [Trọng Hải Sản](/kham-pha/trong-hai-san-hai-san-quang-ninh) | Hải sản Quảng Ninh | Lô A32 Geleximco, Lê Trọng Tấn | khoảng 5 phút |
| [Quán nhậu Tự Do](/kham-pha/quan-nhau-tu-do) | Quán nhậu | Lô A31 Khu A Geleximco | khoảng 5 phút |
| [Khu ẩm thực Vincom Mega Mall Smart City](/kham-pha/khu-am-thuc-vincom-mega-mall-smart-city) | Nhà hàng chuỗi | Tây Mỗ | khoảng 10–15 phút |
| [Nhà hàng tại Aeon Mall Hà Đông](/kham-pha/nha-hang-tai-aeon-mall-ha-dong) | Nhật, Thái, Âu | Dương Nội | khoảng 10–15 phút |

Thời gian tính khi đường thông thoáng; giờ tan tầm buổi tối có thể lâu hơn [CẦN XÁC NHẬN]. F21 chưa kiểm tra giờ mở cửa, giá món và sức chứa của các quán. Đi đông người, bạn nên liên hệ quán đặt bàn trước (số điện thoại xem trên Google Maps hoặc fanpage của quán).

## Đi cùng gia đình nên chọn chỗ nào?

Gia đình có trẻ nhỏ hoặc người cao tuổi thường dễ chọn ở trung tâm thương mại. **Khu ẩm thực Vincom Mega Mall Smart City** có nhiều nhà hàng chuỗi như Pizza 4P''s, King BBQ, Thai Express. **Aeon Mall Hà Đông** có nhà hàng Nhật, Thái, Âu ở tầng 1–2. Ăn xong cả nhà có thể đi dạo trong trung tâm.

Nếu muốn ăn gần, **Bò An Khang** là nhà hàng món bò trong KĐT Sudico Nam An Khánh, chỉ khoảng 5 phút.

## Liên hoan đồng nghiệp, nhóm bạn thì đi đâu?

- **Trọng Hải Sản** (lô A32) và **Quán nhậu Tự Do** (lô A31) nằm sát nhau ở Khu A Geleximco. Quán này hết bàn thì đổi sang quán kia không mất công.
- **Dê Linh Đan** ở KĐT Nam An Khánh, hợp nhóm muốn ăn món dê.
- Cả hai khu đều chỉ cách F21 khoảng 5 phút, đi về nhanh.

## Đi đoàn đông người cần chuẩn bị gì?

Đoàn họ hàng về ăn cưới hay đoàn công ty đi liên hoan nên:

1. Gọi quán trước, báo số người và giờ đến.
2. Chia người theo xe từ trước, báo lễ tân số xe taxi cần gọi.
3. Chọn một người làm đầu mối liên hệ với quán và với khách sạn.

Đoàn cần giữ nhiều phòng nghỉ lại có thể xem trang [Khách đoàn](/doan-doanh-nghiep) để được báo giá.

## Uống rượu bia xong về khách sạn thế nào?

- **Không lái ô tô, xe máy khi đã uống rượu bia.** Pháp luật Việt Nam cấm điều khiển phương tiện khi trong máu hoặc hơi thở có nồng độ cồn.
- Để xe lại ở khách sạn, đi taxi hoặc xe công nghệ. Lễ tân gọi taxi đón tận cửa.
- Lưu sẵn địa chỉ để đọc cho tài xế lúc về: **BT13.1, Lô số 1, Khu biệt thự Hoa Phượng, An Khánh**, cạnh Vinschool, gần cổng 1 Vinhomes Thăng Long.
- Về muộn, nhắn lễ tân giờ về dự kiến. Lễ tân trả lời Zalo từ 7:00 đến 23:00 [CẦN XÁC NHẬN]; ngoài giờ này nên gọi hotline.

F21 ở khu biệt thự Hoa Phượng, yên tĩnh, đi ăn tối về chỉ vài phút. Bạn có thể [đặt phòng online](/dat-phong), gọi hotline **0968 740 333** hoặc nhắn Zalo để giữ phòng.', 'diem-den', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'an-toi-nhau-hai-san-an-khanh-faq-1', 'Gần F21 có quán hải sản không?', 'Có. Trọng Hải Sản (Hải sản Quảng Ninh) ở lô A32 KĐT Geleximco, Lê Trọng Tấn, cách F21 khoảng 5 phút đi xe.' FROM posts WHERE slug = 'an-toi-nhau-hai-san-an-khanh';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'an-toi-nhau-hai-san-an-khanh-faq-2', 'Uống rượu bia rồi có nên đi xe máy về khách sạn không?', 'Không. Bạn để xe lại, nhờ lễ tân gọi taxi hoặc đặt xe công nghệ, hôm sau quay lại lấy xe.' FROM posts WHERE slug = 'an-toi-nhau-hai-san-an-khanh';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'an-toi-nhau-hai-san-an-khanh-faq-3', 'Đoàn 20 người ăn tối gần F21 ở đâu?', 'Quán quanh An Khánh cần gọi trước để hỏi chỗ, vì F21 chưa kiểm tra sức chứa từng quán. Khu ẩm thực Vincom Mega Mall Smart City, khoảng 10–15 phút, có nhiều nhà hàng để chia nhóm.' FROM posts WHERE slug = 'an-toi-nhau-hai-san-an-khanh';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Quán cà phê gần F21 Hotel An Khánh: chỗ ngồi làm việc, hẹn gặp', 'ca-phe-quanh-f21-an-khanh', 'Quán cà phê gần F21 nhất là Lago Cafe, cách vài trăm mét (khoảng 3 phút). Highlands Geleximco, Cộng Cà Phê Splendora khoảng 5 phút; ven hồ Vincom Smart City 10–15 phút.', 'Quán cà phê gần F21 nhất là **Lago Cafe** trong KĐT Nam An Khánh, cách khách sạn vài trăm mét, đi xe **khoảng 3 phút**. Trong khoảng 5 phút còn Highlands Coffee ở Khu A Geleximco và Cộng Cà Phê ở phố đi bộ Splendora. Xa hơn một chút là dãy cà phê ven hồ ở Vincom Mega Mall Smart City.

## Quanh F21 có những quán cà phê nào?

| Quán | Khu vực | Đi từ F21 | Hợp khi |
|---|---|---|---|
| [Lago Cafe](/kham-pha/lago-cafe) | KĐT Nam An Khánh | khoảng 3 phút | Cần chỗ gần, đi về nhanh |
| [Highlands Coffee Geleximco](/kham-pha/highlands-coffee-geleximco) | Khu A Geleximco, Lê Trọng Tấn | khoảng 5 phút | Hẹn gặp ở quán chuỗi dễ tìm |
| [Cộng Cà Phê Splendora](/kham-pha/cong-ca-phe-splendora) | Phố đi bộ KĐT Splendora (Bắc An Khánh) | khoảng 5 phút | Đi nhóm bạn, thích không gian bao cấp |
| [Cà phê ven hồ Vincom Mega Mall Smart City](/kham-pha/khu-am-thuc-vincom-mega-mall-smart-city) | Tây Mỗ | khoảng 10–15 phút | Kết hợp ăn uống, mua sắm |

Thời gian tính bằng xe khi đường thông thoáng [CẦN XÁC NHẬN]. F21 chưa kiểm tra giờ mở cửa, giá đồ uống, wifi và ổ cắm của từng quán. Bạn nên gọi trước hoặc hỏi nhân viên quán khi đến.

## Cần chỗ ngồi làm việc vài tiếng thì đi đâu?

**Lago Cafe** là lựa chọn gần nhất. Quán chỉ cách vài trăm mét, nên bạn có thể quay về phòng lấy đồ hay nghỉ giữa giờ mà không mất nhiều thời gian.

Trước khi mang máy tính ra quán, nên hỏi nhân viên về wifi và chỗ cắm sạc, vì F21 chưa kiểm tra những thông tin này.

Nếu cần yên tĩnh để gọi video hay làm việc dài, bạn có thể làm ngay trong phòng. Phòng ở F21 có **wifi miễn phí**, và **Phòng Đơn** có bàn làm việc. Khách chỉ cần chỗ làm việc vài tiếng trong ngày có thể chọn hình thức nghỉ giờ, tính theo 2 giờ đầu. Giá từng hạng phòng xem ở [Phòng & giá](/phong).

## Hẹn gặp đối tác, khách hàng ở đâu?

- **Highlands Coffee Geleximco**: quán chuỗi, tên quen nên dễ hẹn, người lạ đường cũng dễ tìm. Quán ở Khu A Geleximco, cùng khu với dãy quán ăn, tiện ăn trưa xong ngồi bàn công việc.
- **Dãy cà phê ven hồ ở Vincom Mega Mall Smart City**: hợp buổi hẹn dài, muốn ăn tối hoặc đi mua sắm luôn sau đó. Đi từ F21 khoảng 10–15 phút.

Nếu đối tác cũng ở xa đến, gửi trước cho họ ghim vị trí quán qua Zalo để khỏi đi lạc trong các khu đô thị.

## Cuối tuần đi cà phê cùng nhóm bạn, gia đình?

**Cộng Cà Phê Splendora** nằm ở phố đi bộ KĐT Splendora, Bắc An Khánh, trang trí theo phong cách bao cấp. Nhóm bạn trẻ hay cặp đôi có thể ngồi cà phê rồi đi dạo phố đi bộ.

Gia đình có trẻ nhỏ có thể chọn khu cà phê ven hồ ở Vincom Mega Mall Smart City, vì trong trung tâm còn có khu ăn uống và mua sắm.

## Đi từ F21 tới quán thế nào?

- Đi xe máy, ô tô riêng: hỏi lễ tân đường đi trước khi ra khỏi khu biệt thự Hoa Phượng.
- Không có xe: lễ tân gọi taxi đón tận cửa, hoặc bạn đặt xe công nghệ.
- Đi Vincom Mega Mall Smart City vào tối cuối tuần nên đi sớm, vì đường quanh trung tâm có thể đông.

F21 ở khu biệt thự Hoa Phượng, An Khánh, cạnh Vinschool. Bạn có thể [đặt phòng online](/dat-phong), gọi hotline **0968 740 333** hoặc nhắn Zalo cho lễ tân.', 'diem-den', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'ca-phe-quanh-f21-an-khanh-faq-1', 'Quán cà phê gần F21 nhất ở đâu?', 'Lago Cafe trong KĐT Nam An Khánh, cách F21 vài trăm mét, đi xe khoảng 3 phút.' FROM posts WHERE slug = 'ca-phe-quanh-f21-an-khanh';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'ca-phe-quanh-f21-an-khanh-faq-2', 'Có làm việc trong phòng ở F21 được không?', 'Được. Phòng có wifi miễn phí, Phòng Đơn có bàn làm việc; cần vài tiếng trong ngày thì có thể chọn nghỉ giờ.' FROM posts WHERE slug = 'ca-phe-quanh-f21-an-khanh';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'ca-phe-quanh-f21-an-khanh-faq-3', 'Quán cà phê quanh An Khánh mở cửa từ mấy giờ?', 'Mỗi quán một giờ khác nhau và F21 chưa kiểm tra [CẦN XÁC NHẬN]. Nên gọi quán trước hoặc hỏi lễ tân.' FROM posts WHERE slug = 'ca-phe-quanh-f21-an-khanh';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Gần F21 Hotel có siêu thị, ATM, cây xăng không? Tiện ích ở An Khánh', 'tien-ich-thiet-yeu-gan-f21', 'Cửa hàng tiện lợi gần F21 nhất là WinMart+ Đường An Khánh, khoảng 3 phút; K-Market Splendora, ATM khu Lê Trọng Tấn và cây xăng Trung Thượng đều khoảng 5 phút.', 'Cửa hàng gần F21 nhất để mua nước, đồ ăn, đồ dùng cá nhân là **WinMart+ Đường An Khánh**, đi xe **khoảng 3 phút**. Trong khoảng 5 phút còn siêu thị nhỏ K-Market Splendora, cây ATM của nhiều ngân hàng quanh Khu A Geleximco và cây xăng Trung Thượng gần nút giao Lê Trọng Tấn – Đại lộ Thăng Long.

## Cần gì thì đi đâu?

| Cần | Địa điểm | Đi từ F21 |
|---|---|---|
| Nước uống, đồ ăn, đồ dùng cá nhân | [WinMart+ Đường An Khánh](/kham-pha/winmart-duong-an-khanh) | khoảng 3 phút |
| Hàng Hàn Quốc | [K-Market Splendora](/kham-pha/k-market-splendora) | khoảng 5 phút |
| Rút tiền, nộp tiền | [ATM & ngân hàng khu Lê Trọng Tấn](/kham-pha/atm-ngan-hang-khu-le-trong-tan) | khoảng 5 phút |
| Đổ xăng | [Cửa hàng xăng dầu Trung Thượng](/kham-pha/cua-hang-xang-dau-trung-thuong) | khoảng 5 phút |
| Siêu thị lớn | [Vincom Mega Mall Smart City](/kham-pha/vincom-mega-mall-smart-city), [AEON Mall Hà Đông](/kham-pha/aeon-mall-ha-dong) | khoảng 10–15 phút |

Thời gian tính bằng xe khi đường thông thoáng [CẦN XÁC NHẬN]. F21 chưa kiểm tra giờ mở cửa của các cửa hàng, ngân hàng và cây xăng. Nếu đi sớm hoặc khuya, bạn nên xem giờ trên Google Maps hoặc hỏi lễ tân trước.

## Quên đồ dùng cá nhân thì mua ở đâu?

**WinMart+ Đường An Khánh** là cửa hàng tiện lợi gần nhất, có đồ ăn, nước uống và đồ dùng cá nhân. Đây là chỗ nhanh nhất khi bạn cần đồ dùng cá nhân để quên ở nhà, đồ ăn nhẹ cho buổi tối hay nước uống cho trẻ nhỏ.

Trước khi đi mua, nên hỏi lễ tân phòng đã có sẵn những gì. Mỗi phòng có **2 chai nước suối miễn phí**; danh sách đồ dùng phòng tắm như khăn, bàn chải, dầu gội [CẦN XÁC NHẬN].

**K-Market Splendora** là siêu thị nhỏ bán hàng Hàn Quốc trong KĐT Splendora, hợp khi bạn muốn tìm đồ ăn, gia vị Hàn.

## Rút tiền mặt ở đâu gần F21?

Quanh Khu A Geleximco trên đường Lê Trọng Tấn có cây ATM, CDM của **Techcombank, MB, VPBank, VietinBank**, đi khoảng 5 phút. Khu này cũng có nhiều quán ăn, nên bạn có thể kết hợp rút tiền và đi ăn trong một chuyến.

Một vài khoản nhỏ như gửi xe, mua hàng ở quán nhỏ có thể cần tiền mặt, nên mang theo một ít. Giờ giao dịch tại quầy của từng ngân hàng xem trên website của ngân hàng đó.

## Đổ xăng ở đâu trước khi đi đường dài?

**Cửa hàng xăng dầu Trung Thượng** ở gần nút giao Lê Trọng Tấn – Đại lộ Thăng Long, cách F21 khoảng 5 phút. Từ F21 ra Đại lộ Thăng Long cũng mất khoảng 5 phút, nên bạn có thể đổ xăng trên đường ra đại lộ, trước khi đi Mỹ Đình, vào nội thành hoặc về các tỉnh.

Khách tự lái xe nên đổ xăng từ tối hôm trước nếu sáng hôm sau đi sớm.

## Cần siêu thị lớn hơn thì đi đâu?

Khi cần mua nhiều đồ hoặc tìm hàng nhập, có hai trung tâm cách khoảng 10–15 phút:

- **Vincom Mega Mall Smart City**: có siêu thị WinMart, Annam Gourmet và Kohnan.
- **AEON Mall Hà Đông**: có siêu thị AEON và khu đồ gia dụng.

Thông tin về thời trang, khu vui chơi và cách đi các trung tâm này có ở bài [mua sắm phía Tây Hà Nội](/bai-viet/mua-sam-phia-tay-ha-noi).

F21 ở khu biệt thự Hoa Phượng, An Khánh, cạnh Vinschool, gần cổng 1 Vinhomes Thăng Long. Bạn có thể [đặt phòng online](/dat-phong), gọi hotline **0968 740 333** hoặc nhắn Zalo cho lễ tân.', 'diem-den', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'tien-ich-thiet-yeu-gan-f21-faq-1', 'Gần F21 có cửa hàng tiện lợi không?', 'Có. WinMart+ Đường An Khánh cách F21 khoảng 3 phút đi xe, bán đồ ăn, nước uống và đồ dùng cá nhân.' FROM posts WHERE slug = 'tien-ich-thiet-yeu-gan-f21';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'tien-ich-thiet-yeu-gan-f21-faq-2', 'Rút tiền gần khu biệt thự Hoa Phượng ở đâu?', 'Quanh Khu A Geleximco, đường Lê Trọng Tấn có ATM, CDM của Techcombank, MB, VPBank, VietinBank, đi khoảng 5 phút.' FROM posts WHERE slug = 'tien-ich-thiet-yeu-gan-f21';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'tien-ich-thiet-yeu-gan-f21-faq-3', 'Phòng ở F21 có sẵn đồ dùng cá nhân không?', 'Mỗi phòng có 2 chai nước suối miễn phí; đồ dùng phòng tắm như khăn, bàn chải, dầu gội [CẦN XÁC NHẬN]. Hỏi lễ tân khi đặt phòng để biết cần mang gì.' FROM posts WHERE slug = 'tien-ich-thiet-yeu-gan-f21';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Ốm khi ở An Khánh: trạm y tế, nhà thuốc, Vinmec gần F21 Hotel', 'kham-benh-gan-an-khanh-vinmec', 'Gần F21 có Trạm Y tế xã An Khánh (khoảng 3 phút, cạnh Vinschool), nhà thuốc ở Nam An Khánh và Vinmec Smart City (5–10 phút, cấp cứu 24 giờ). Khẩn cấp gọi 115.', 'Nếu bị ốm khi đang ở F21, cơ sở y tế gần nhất là **Trạm Y tế xã An Khánh** cạnh Vinschool, đi xe **khoảng 3 phút**. Bệnh viện gần nhất là **Bệnh viện Đa khoa Quốc tế Vinmec Smart City** ở số 2A Tây Mỗ, khoảng 5–10 phút, có **cấp cứu 24 giờ**. Trường hợp khẩn cấp, gọi **115**.

> Bài này chỉ cung cấp thông tin địa điểm và cách đi lại, không thay cho tư vấn của bác sĩ hay nhân viên y tế.

## Khi nào nên gọi 115?

Gọi **115** ngay khi có dấu hiệu nghiêm trọng hoặc bạn không chắc tình trạng có nguy hiểm hay không, ví dụ khó thở, đau ngực, ngất, co giật, chảy máu nhiều, chấn thương sau tai nạn. Người bệnh không nên tự lái xe đi viện.

Khi gọi, đọc rõ địa chỉ: **F21 Hotel, BT13.1, Lô số 1, Khu biệt thự Hoa Phượng, An Khánh, Hà Nội**, cạnh Vinschool, gần cổng 1 Vinhomes Thăng Long. Sau đó báo lễ tân để có người ra đón xe cấp cứu.

## Gần F21 có cơ sở y tế nào?

| Nơi | Dùng khi | Đi từ F21 | Ghi chú |
|---|---|---|---|
| [Trạm Y tế xã An Khánh](/kham-pha/tram-y-te-xa-an-khanh) | Sơ cứu, khám cơ bản | khoảng 3 phút | Cạnh Vinschool |
| [Nhà thuốc khu Nam An Khánh](/kham-pha/nha-thuoc-khu-nam-an-khanh) | Mua thuốc, vật tư y tế | khoảng 5 phút | Một số nhà thuốc như Pharmacity, Long Châu, Sun 24h |
| [Bệnh viện ĐKQT Vinmec Smart City](/kham-pha/benh-vien-dkqt-vinmec-smart-city) | Khám bệnh, cấp cứu | khoảng 5–10 phút | Cấp cứu 24 giờ, số 2A Tây Mỗ |

Thời gian tính bằng xe khi đường thông thoáng [CẦN XÁC NHẬN].

## Trạm Y tế xã An Khánh làm gì, mở cửa giờ nào?

Trạm y tế xã nhận sơ cứu và khám cơ bản. Trạm ở cạnh Vinschool, rất gần khu biệt thự Hoa Phượng. Giờ làm việc của trạm F21 chưa kiểm tra [CẦN XÁC NHẬN]; bạn nên hỏi lễ tân hoặc gọi trạm trước khi đến.

Ngoài giờ làm việc của trạm, hoặc khi cần khám kỹ hơn, bạn có thể đến Vinmec Smart City. Mang theo căn cước công dân, thẻ bảo hiểm y tế nếu có, và tên các thuốc đang dùng.

## Mua thuốc ở đâu gần F21?

Quanh KĐT Nam An Khánh có một số nhà thuốc như **Pharmacity, Long Châu, Sun 24h**, đi khoảng 5 phút. Địa chỉ cụ thể từng nhà thuốc và giờ mở cửa F21 chưa có; bạn có thể hỏi lễ tân hoặc tìm trên Google Maps.

Khi mua thuốc, nói rõ với dược sĩ triệu chứng, các thuốc đang dùng và tiền sử dị ứng. Thuốc kê đơn cần có đơn của bác sĩ.

## Đi Vinmec Smart City thế nào?

- Báo lễ tân để được gọi taxi đón tận cửa khách sạn. Không tự lái xe khi đang mệt.
- Đi từ F21 khoảng 5–10 phút. Vinmec Smart City có **cấp cứu 24 giờ**.
- Chi phí khám và việc áp dụng bảo hiểm, bạn hỏi trực tiếp bệnh viện.
- Đi cùng trẻ nhỏ hoặc người cao tuổi, nên có một người lớn đi kèm để làm thủ tục.

## Báo lễ tân thế nào?

Gọi hotline **0968 740 333**, xuống quầy lễ tân hoặc nhắn Zalo. Lễ tân trả lời Zalo từ 7:00 đến 23:00 [CẦN XÁC NHẬN], nên ban đêm hãy gọi điện thay vì nhắn tin. Nếu khẩn cấp, gọi 115 trước rồi mới báo lễ tân.

Nếu cần ở thêm để nghỉ ngơi, hỏi lễ tân xem còn phòng trống. Lưu ý khách đặt trước không được hoàn tiền khi thay đổi; điều khoản chi tiết ở trang [Điều khoản](/dieu-khoan).

F21 ở khu biệt thự Hoa Phượng, An Khánh. Gia đình có người cao tuổi, trẻ nhỏ có thể xem [Phòng & giá](/phong), hoặc [đặt phòng online](/dat-phong).', 'diem-den', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'kham-benh-gan-an-khanh-vinmec-faq-1', 'Bệnh viện gần F21 Hotel nhất là bệnh viện nào?', 'Bệnh viện ĐKQT Vinmec Smart City ở số 2A Tây Mỗ, đi xe khoảng 5–10 phút, có cấp cứu 24 giờ.' FROM posts WHERE slug = 'kham-benh-gan-an-khanh-vinmec';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'kham-benh-gan-an-khanh-vinmec-faq-2', 'Ban đêm bị ốm ở khách sạn thì làm gì?', 'Nếu có dấu hiệu nghiêm trọng, gọi 115 ngay. Các trường hợp khác, gọi hotline cho lễ tân để được gọi taxi tới Vinmec Smart City.' FROM posts WHERE slug = 'kham-benh-gan-an-khanh-vinmec';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'kham-benh-gan-an-khanh-vinmec-faq-3', 'Trạm Y tế xã An Khánh làm việc giờ nào?', 'F21 chưa kiểm tra giờ làm việc của trạm [CẦN XÁC NHẬN]. Nên hỏi lễ tân hoặc gọi trạm trước khi đến.' FROM posts WHERE slug = 'kham-benh-gan-an-khanh-vinmec';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Chơi pickleball gần F21: 4 sân cách 3–5 phút ở khu biệt thự Hoa Phượng', 'choi-pickleball-gan-f21', 'Quanh F21 ở An Khánh có 4 sân pickleball cách khoảng 3–5 phút, trong đó The ClubHouse có sân mái che. Chơi xong có thể nghỉ giờ tắm, nghỉ trưa từ 300.000đ.', 'Quanh F21 có **4 sân pickleball** cách khách sạn khoảng **3–5 phút** đi xe: The ClubHouse, Pickleball Hoa Phượng, PickleBall Bảo Sơn và sân Trung đoàn 218. Hai sân đầu nằm ngay trong khu biệt thự Hoa Phượng, cùng khu với F21, nên bạn có thể ra sân từ sáng sớm rồi về phòng tắm, nghỉ trưa.

## Gần F21 có những sân pickleball nào?

| Sân | Vị trí | Đi từ F21 | Ghi chú |
|---|---|---|---|
| [The ClubHouse](/kham-pha/san-pickleball-the-clubhouse) | Trong khu biệt thự Hoa Phượng | 3–5 phút | Cụm nhiều sân, có sân mái che |
| [Pickleball Hoa Phượng](/kham-pha/pickleball-hoa-phuong) | Trong khu biệt thự Hoa Phượng | 3–5 phút | Cùng khu với F21 |
| [PickleBall Bảo Sơn](/kham-pha/pickleball-bao-son) | Khu Bảo Sơn, cạnh khu Hoa Phượng | 3–5 phút | – |
| [Trung đoàn 218](/kham-pha/san-pickleball-trung-doan-218) | Khu Trung đoàn Phòng không 218 | 3–5 phút | – |

Thời gian trên là ước tính khi đường thông thoáng [CẦN XÁC NHẬN]. Hôm mưa hoặc nắng gắt, sân mái che ở The ClubHouse giúp bạn không phải huỷ lịch chơi.

## Đặt sân thế nào, giá thuê bao nhiêu?

F21 chưa có bảng giá thuê của các sân trên [CẦN XÁC NHẬN: giá thuê theo giờ từng sân]. Giá có thể khác nhau theo khung giờ, ngày thường hay cuối tuần, sân trong nhà hay ngoài trời. Cách làm an toàn nhất:

1. Gọi hoặc nhắn trực tiếp cho sân **trước 1–2 ngày**, nhất là khi muốn chơi chiều tối hoặc sáng cuối tuần.
2. Hỏi rõ giá theo giờ, có cho thuê vợt và bóng không, có chỗ gửi xe không, huỷ sân có mất tiền không.
3. Chốt giờ chơi trước, rồi mới đặt phòng ở F21 cho khớp lịch.

Địa chỉ từng sân có ở trang chi tiết của sân, bấm vào tên sân trong bảng trên. Khi đặt phòng, lễ tân gửi ghim vị trí F21 qua Zalo để bạn tính đường đi.

## Nên mang gì khi đi chơi?

- Vợt và bóng, nếu sân không cho thuê.
- Giày thể thao đế bằng, bám sân. Giày chạy bộ đế dày dễ lật cổ chân khi đổi hướng.
- Nước uống, khăn lau mồ hôi, một bộ quần áo thay.
- Mũ, kem chống nắng nếu chơi sân ngoài trời.

Thiếu nước hay đồ ăn nhẹ, WinMart+ Đường An Khánh cách F21 khoảng 3 phút.

## Chơi xong muốn tắm, nghỉ trưa thì đặt gì?

Hình thức **nghỉ giờ** tính theo 2 giờ đầu, quá giờ tính phụ trội. Đủ để tắm, thay đồ và chợp mắt trước khi về hoặc chơi tiếp buổi chiều.

| Hạng phòng | Khách | Nghỉ giờ (2 giờ đầu) | Giờ thêm |
|---|---|---|---|
| Phòng Đơn | 2 | 300.000đ | 50.000đ |
| Phòng Đơn VIP (có bồn tắm) | 2 | 350.000đ | 50.000đ |
| Phòng Đôi | 3 | 400.000đ | 70.000đ |
| Phòng Đôi 4 người | 4 | 450.000đ | 100.000đ |

Ví dụ: chơi từ 6:00 đến 8:00, ăn sáng ở [Phở Thìn Khu A Geleximco](/kham-pha/pho-thin-khu-a-geleximco) (khoảng 5 phút), rồi về F21 nghỉ giờ đến khoảng 11:00. Cách tính tiền chi tiết xem bài [nghỉ giờ, qua đêm ở An Khánh](/bai-viet/nghi-gio-qua-dem-an-khanh-gia-va-gio).

## Nhóm bạn đi giải đấu nên ở thế nào?

Nếu cả nhóm từ tỉnh khác về đánh giải 1–2 ngày:

- **Ngày đêm** (nhận 14:00, trả trước 12:00 hôm sau) hợp khi đến từ chiều hôm trước để nghỉ lấy sức.
- **Qua đêm** (nhận sau 19:00, trả trước 10:00) hợp khi đến muộn và thi đấu từ sáng sớm.
- **Phòng Đôi 4 người** giá ngày đêm 1.200.000đ, chia ra khoảng **300.000đ/người/đêm**. Thêm người so với quy định phụ thu 100.000đ/người.
- Lấy **trên 7 phòng giảm 5%**, trên 15 phòng giảm 10%. Đội từ 5 phòng trở lên xem trang [Khách đoàn](/doan-doanh-nghiep).
- Xe đỗ ngay trước khách sạn. Đoàn nhiều xe nên báo trước để lễ tân sắp chỗ [CẦN XÁC NHẬN: số chỗ đỗ, có mất phí không].

Xem giá các hạng ở [Phòng & giá](/phong). Bạn có thể [đặt online](/dat-phong), gọi hoặc nhắn Zalo **0968 740 333** để giữ phòng theo lịch thi đấu. Đặt trước cần cọc tối thiểu 50% tiền phòng.', 'diem-den', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'choi-pickleball-gan-f21-faq-1', 'Gần F21 có sân pickleball mái che không?', 'Có. Cụm sân The ClubHouse trong khu biệt thự Hoa Phượng có sân mái che, cách F21 khoảng 3–5 phút.' FROM posts WHERE slug = 'choi-pickleball-gan-f21';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'choi-pickleball-gan-f21-faq-2', 'Giá thuê sân pickleball gần F21 bao nhiêu?', 'F21 chưa có giá chính thức của từng sân [CẦN XÁC NHẬN]. Bạn nên gọi thẳng cho sân để hỏi giá theo khung giờ trước khi đặt.' FROM posts WHERE slug = 'choi-pickleball-gan-f21';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'choi-pickleball-gan-f21-faq-3', 'Chơi xong chỉ cần tắm, nghỉ 2 tiếng thì đặt thế nào?', 'Chọn nghỉ giờ, từ 300.000đ cho 2 giờ đầu ở Phòng Đơn. Ở quá 2 giờ thì tính thêm theo giờ, tuỳ hạng phòng.' FROM posts WHERE slug = 'choi-pickleball-gan-f21';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Tập thể thao khi ở An Khánh: chạy bộ, tennis, bơi, golf gần F21', 'the-thao-quanh-an-khanh', 'Ở F21 vẫn giữ được lịch tập: chạy bộ, tennis ở Vinhomes Smart City 5–10 phút, sân bóng E218 3–5 phút, bơi và tập golf ở Mỹ Đình khoảng 15–20 phút.', 'Ở F21, bạn có chỗ tập cho hầu hết các môn phổ biến trong vòng **3–20 phút** đi xe. Chạy bộ, tennis, bóng rổ ở Công viên Thể thao Vinhomes Smart City (khoảng 5–10 phút). Đá bóng ở sân E218 (3–5 phút). Bơi ở Cung Thể thao dưới nước Mỹ Đình và tập golf ở sân Phương Đông (khoảng 15–20 phút).

## Tập môn gì, ở đâu, đi mất bao lâu?

| Môn | Địa điểm | Đi từ F21 |
|---|---|---|
| Chạy bộ, tennis, bóng rổ, tập ngoài trời | [Công viên Thể thao Vinhomes Smart City](/kham-pha/cong-vien-the-thao-vinhomes-smart-city) | 5–10 phút |
| Bóng đá | [Sân bóng E218](/kham-pha/san-bong-e218) | 3–5 phút |
| Pickleball | 4 sân quanh khu biệt thự Hoa Phượng | 3–5 phút |
| Bơi, học bơi | [Cung Thể thao dưới nước Mỹ Đình](/kham-pha/cung-the-thao-duoi-nuoc-my-dinh) | 15–20 phút |
| Golf (sân tập) | [Sân tập golf Phương Đông](/kham-pha/san-tap-golf-phuong-dong), phố Tân Mỹ | 15–20 phút |

Thời gian là ước tính đi ô tô khi đường thông thoáng [CẦN XÁC NHẬN]. Về pickleball, xem bài riêng [chơi pickleball gần F21](/bai-viet/choi-pickleball-gan-f21).

## Chạy bộ, tennis, bóng rổ ở đâu gần nhất?

Công viên Thể thao Vinhomes Smart City ở Tây Mỗ có sân tennis, sân bóng rổ, đường chạy và khu tập ngoài trời. Đây là chỗ gần F21 nhất để chạy bộ đường dài.

- Chạy sáng sớm, trước khoảng 7:00, để tránh nắng và xe đông.
- Giờ mở cửa công viên và cách thuê sân tennis F21 chưa có thông tin [CẦN XÁC NHẬN]. Bạn hỏi bảo vệ hoặc ban quản lý khu đô thị khi đến.
- Đi xe máy hoặc taxi khoảng 5–10 phút. Lễ tân gọi taxi đón tận cửa.

## Muốn đá bóng cùng nhóm bạn?

[Sân bóng E218](/kham-pha/san-bong-e218) ở khu E218, gần khu biệt thự Hoa Phượng, đi khoảng 3–5 phút. Loại sân, giá thuê và khung giờ còn trống bạn gọi hỏi sân trước [CẦN XÁC NHẬN].

Đá xong, cả nhóm có thể ăn tối ở [dãy quán ăn Khu A Geleximco Lê Trọng Tấn](/kham-pha/day-quan-an-khu-a-geleximco-le-trong-tan), khoảng 5 phút, nhiều quán phở, bún, cơm, lẩu nướng.

## Đi bơi ở đâu?

Cung Thể thao dưới nước Mỹ Đình nằm trong Khu Liên hợp Thể thao Quốc gia, có bể trong nhà và ngoài trời mở cho người dân bơi, học bơi. F21 chưa tìm được bảng giá vé và giờ bơi chính thức gần đây [CẦN XÁC NHẬN: giá vé, giờ mở cửa], nên bạn gọi hỏi trước khi đi.

Mang theo đồ bơi, mũ bơi, kính bơi, khăn và dép. Đường đi theo Lê Trọng Tấn kéo dài về phía Mỹ Đình, cùng hướng với Sân vận động Quốc gia.

## Tập golf gần An Khánh?

Sân tập golf Phương Đông ở phố Tân Mỹ, gần Mỹ Đình, khoảng 15–20 phút từ F21. Giá bóng tập và giờ mở cửa F21 chưa có [CẦN XÁC NHẬN]. Khách công tác có thể ghép một buổi tập sau giờ họp ở Trung tâm Hội nghị Quốc gia (khoảng 15 phút từ F21).

## Ở dài ngày, giữ lịch tập thế nào?

Một tuần mẫu cho khách ở từ 7 ngày trở lên:

- **Thứ Hai, Tư, Sáu**: chạy bộ sáng sớm ở Vinhomes Smart City.
- **Thứ Ba, Năm**: bơi buổi chiều ở Mỹ Đình.
- **Cuối tuần**: pickleball hoặc đá bóng với nhóm bạn gần khu Hoa Phượng.

Vài điều nên biết khi ở lâu:

- Ở **trên 7 ngày liên tiếp giảm 5%**, trên 15 ngày giảm 10%, trên 30 ngày giảm 15% tổng thanh toán. Chi tiết ở [Ưu đãi](/uu-dai#o-dai-ngay).
- Phòng Đơn có bàn làm việc, giá ngày đêm 900.000đ, hợp khách công tác ở một mình.
- Bị đau, chấn thương khi tập: [Bệnh viện ĐKQT Vinmec Smart City](/kham-pha/benh-vien-dkqt-vinmec-smart-city) có cấp cứu 24 giờ, cách khoảng 5–10 phút.
- Nước, đồ ăn nhẹ sau buổi tập mua ở WinMart+ Đường An Khánh, khoảng 3 phút.

Xem [Phòng & giá](/phong) để chọn hạng phòng. Muốn ở dài ngày, bạn gọi hoặc nhắn Zalo **0968 740 333** để lễ tân báo giá theo số ngày, hoặc [đặt online](/dat-phong).', 'diem-den', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'the-thao-quanh-an-khanh-faq-1', 'Gần F21 có chỗ chạy bộ không?', 'Có. Công viên Thể thao Vinhomes Smart City có đường chạy, cách F21 khoảng 5–10 phút đi xe.' FROM posts WHERE slug = 'the-thao-quanh-an-khanh';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'the-thao-quanh-an-khanh-faq-2', 'Bể bơi gần An Khánh nhất ở đâu?', 'Trong các địa điểm F21 tổng hợp, gần nhất là Cung Thể thao dưới nước Mỹ Đình, khoảng 15–20 phút. Giờ bơi và giá vé nên gọi hỏi trước [CẦN XÁC NHẬN].' FROM posts WHERE slug = 'the-thao-quanh-an-khanh';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'the-thao-quanh-an-khanh-faq-3', 'Ở F21 một tháng có được giảm giá không?', 'Có. Ở trên 30 ngày được giảm 15% tổng thanh toán.' FROM posts WHERE slug = 'the-thao-quanh-an-khanh';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Cuối tuần quanh F21 không cần vào phố: lịch trình 2 ngày 1 đêm', 'cuoi-tuan-quanh-f21-khong-vao-pho', 'Một cuối tuần 2 ngày 1 đêm quanh F21 gói gọn trong 3–30 phút đi xe: Thiên đường Bảo Sơn, Vườn Nhật, xem phim, karaoke, sáng hôm sau đi chùa Thầy.', 'Một cuối tuần 2 ngày 1 đêm quanh F21 có thể đi hết trong bán kính **3–30 phút** đi xe, không cần vào nội thành. Phố cổ Hoàn Kiếm cách F21 khoảng 35 phút, nên ở lại phía Tây bạn bớt được thời gian ngồi xe và tắc đường cuối tuần.

## Lịch trình 2 ngày 1 đêm gợi ý ra sao?

| Thời gian | Hoạt động | Đi từ F21 |
|---|---|---|
| **Ngày 1**, 7:30 | Ăn sáng: phở hoặc bún chả | 3–5 phút |
| 8:30 – 12:00 | Thiên đường Bảo Sơn | ~5 phút |
| 12:00 | Ăn trưa ở Khu A Geleximco | ~5 phút |
| 14:00 | Nhận phòng, nghỉ trưa | – |
| 16:00 – 18:00 | Vườn Nhật Vinhomes Smart City | 10–15 phút |
| 18:30 | Ăn tối ở Vincom Mega Mall Smart City | 10–15 phút |
| 20:00 | Xem phim hoặc karaoke | 5–15 phút |
| **Ngày 2**, 6:30 | Ăn sáng, cà phê | ~3 phút |
| 7:00 – 10:00 | Chùa Thầy | 20–30 phút |
| Trước 12:00 | Về F21, trả phòng | – |

Trừ Thiên đường Bảo Sơn, các mốc thời gian đi là ước tính khi đường thông thoáng [CẦN XÁC NHẬN].

## Sáng ngày đầu ăn gì, chơi gì?

Hai lựa chọn gần F21:

- [Phở Thìn Khu A Geleximco](/kham-pha/pho-thin-khu-a-geleximco): phở bò, khoảng 5 phút.
- [Bún chả Cô Lan](/kham-pha/bun-cha-co-lan) ở thôn An Thọ: khoảng 3 phút.

Sau đó đi [Thiên đường Bảo Sơn](/kham-pha/thien-duong-bao-son), cách F21 khoảng **5 phút**, có thủy cung, khu trò chơi và làng nghề truyền thống. Giờ mở cửa, giá vé và kinh nghiệm đi cùng trẻ nhỏ đã có trong bài [Thiên đường Bảo Sơn: giờ mở cửa, giá vé](/bai-viet/thien-duong-bao-son-gio-mo-cua-gia-ve). Trưa ra dãy quán Khu A Geleximco ngay gần đó, có cơm gà Hội An, phở, bún, lẩu nướng.

## Chiều đi đâu khi không muốn vào phố?

Nhận phòng lúc 14:00 để tắm và nghỉ trưa. Khoảng 16:00, khi nắng dịu, sang [Vườn Nhật Vinhomes Smart City](/kham-pha/vuon-nhat-vinhomes-smart-city) cạnh Vincom Mega Mall, đi xe khoảng 10–15 phút. Công viên rộng, hợp đi dạo và chụp ảnh lúc chiều muộn.

Ăn tối luôn ở khu ẩm thực Vincom Mega Mall Smart City, nhiều nhà hàng chuỗi và dãy cà phê ven hồ, không phải di chuyển thêm.

## Buổi tối xem phim hay hát karaoke?

- [Rạp AEON BETA Vincom Smart City](/kham-pha/rap-aeon-beta-vincom-smart-city): 7 phòng chiếu, ngay trong Vincom Mega Mall nên tiện sau bữa tối.
- [CGV Aeon Hà Đông](/kham-pha/cgv-aeon-ha-dong): tầng 4 Aeon Mall Hà Đông, có phòng IMAX và Gold Class, khoảng 10–15 phút từ F21.
- [Karaoke London](/kham-pha/karaoke-london): 18–20 Lê Trọng Tấn, khoảng 5 phút. Hợp nhóm bạn muốn về gần khách sạn.

Lịch chiếu và giá vé xem trên ứng dụng hoặc website của từng rạp. Giờ mở cửa và giá phòng hát của karaoke bạn gọi hỏi trước [CẦN XÁC NHẬN]. Lễ tân gọi taxi đón tận cửa khi bạn đi. Về muộn, bạn đặt taxi hoặc xe công nghệ.

## Sáng hôm sau đi chùa Thầy thế nào?

Chùa Thầy ở Sài Sơn, Quốc Oai, khoảng **20–30 phút** từ F21. Đi sớm từ 7:00 trời mát, chùa vắng hơn. Bạn có thể xem thủy đình, leo lên hang Cắc Cớ rồi về kịp trả phòng trước 12:00. Hướng dẫn đi lại và tham quan có ở bài [chùa Thầy, chùa Tây Phương](/bai-viet/chua-thay-chua-tay-phuong).

Muốn ở lâu hơn ở Sài Sơn, bạn trả phòng trước khi đi rồi đi thẳng từ chùa về nhà.

## Chọn phòng nào cho 2 ngày 1 đêm?

Chọn hình thức **ngày đêm** (nhận 14:00, trả trước 12:00 hôm sau) để có phòng nghỉ trưa ngày đầu.

| Đi cùng | Hạng phòng gợi ý | Ngày đêm |
|---|---|---|
| Cặp đôi | Phòng Đơn VIP, có bồn tắm | 1.000.000đ |
| Hai vợ chồng, một con | Phòng Đôi | 1.100.000đ |
| Gia đình 4 người, nhóm bạn | Phòng Đôi 4 người | 1.200.000đ |

Cuối tuần phòng dễ kín, nên [đặt online](/dat-phong) sớm hoặc gọi, nhắn Zalo **0968 740 333**.', 'diem-den', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'cuoi-tuan-quanh-f21-khong-vao-pho-faq-1', 'Cuối tuần ở F21 có cần vào nội thành mới có chỗ chơi không?', 'Không cần. Quanh F21 trong khoảng 3–30 phút có công viên giải trí, vườn Nhật, rạp phim, karaoke và chùa Thầy.' FROM posts WHERE slug = 'cuoi-tuan-quanh-f21-khong-vao-pho';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'cuoi-tuan-quanh-f21-khong-vao-pho-faq-2', 'Từ F21 đi chùa Thầy mất bao lâu?', 'Khoảng 20–30 phút ô tô khi đường thông thoáng [CẦN XÁC NHẬN].' FROM posts WHERE slug = 'cuoi-tuan-quanh-f21-khong-vao-pho';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'cuoi-tuan-quanh-f21-khong-vao-pho-faq-3', 'Gần F21 có rạp chiếu phim không?', 'Có hai rạp cách khoảng 10–15 phút: AEON BETA trong Vincom Mega Mall Smart City và CGV ở Aeon Mall Hà Đông.' FROM posts WHERE slug = 'cuoi-tuan-quanh-f21-khong-vao-pho';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Bảo tàng Lịch sử Quân sự Việt Nam: giờ mở cửa, giá vé, đi từ An Khánh', 'bao-tang-lich-su-quan-su-viet-nam-tu-an-khanh', 'Bảo tàng Lịch sử Quân sự Việt Nam ở Km 6+500 Đại lộ Thăng Long, vé 40.000đ/người, cách F21 ở An Khánh khoảng 10–15 phút ô tô. Giờ mở cửa, khu trưng bày, cách đi.', '**Bảo tàng Lịch sử Quân sự Việt Nam** ở Km 6+500 Đại lộ Thăng Long, Xuân Phương, Hà Nội. Vé vào cửa **40.000đ/người/lượt**, và F21 cách bảo tàng khoảng **10–15 phút** ô tô. Bảo tàng mở cửa tại địa điểm mới từ tháng 11/2024, thu phí từ tháng 4/2025.

## Bảo tàng mở cửa mấy giờ?

Theo các báo đưa tin trong năm 2024–2025, bảo tàng đón khách hai buổi:

- Sáng: **8:00 – 11:30**
- Chiều: **13:00 – 16:30**

Ngày nghỉ trong tuần mỗi nguồn ghi một khác, có nguồn ghi nghỉ thứ Hai và thứ Sáu [CẦN XÁC NHẬN: giờ mở cửa và ngày nghỉ hiện hành]. Bảo tàng cũng có lúc tạm đóng để phục vụ sự kiện, hoặc đổi lịch dịp lễ. Bạn nên xem website hoặc fanpage chính thức của bảo tàng trước khi đi.

## Giá vé bao nhiêu, ai được miễn, giảm?

Mức phí theo Thông tư 90/2025/TT-BTC của Bộ Tài chính (hiệu lực từ 18/9/2025, theo Thời báo Tài chính Việt Nam):

| Đối tượng | Mức phí |
|---|---|
| Người lớn | 40.000đ/lượt |
| Từ 16 đến dưới 18 tuổi | Giảm 50% |
| Sinh viên đại học, cao đẳng, trung cấp, trung tâm giáo dục nghề nghiệp | Giảm 50% |
| Từ 60 đến dưới 80 tuổi | Giảm 50% |
| Trẻ em, người từ 80 tuổi trở lên, người khuyết tật đặc biệt nặng | Miễn phí |
| Người có công, cựu chiến binh và một số đối tượng chính sách | Miễn theo quy định |

Các báo năm 2025 ghi trẻ dưới 16 tuổi được miễn vé [CẦN XÁC NHẬN: độ tuổi và giấy tờ cần mang]. Người được giảm nên mang thẻ sinh viên hoặc căn cước để xuất trình.

## Trong bảo tàng có gì?

Theo báo Văn hoá, bảo tàng nằm trên khu đất khoảng 38,6 ha ở Tây Mỗ, Đại Mỗ. Toà nhà chính có 4 tầng nổi, 1 tầng hầm, phía trước là **Tháp Chiến thắng cao 45 m**.

- **Khu ngoài trời**: xe tăng, máy bay, pháo, tàu và nhiều vũ khí, khí tài thật.
- **Sảnh và tầng 1**: sáu chủ đề, từ thời dựng nước đến các cuộc kháng chiến và bảo vệ Tổ quốc sau năm 1975. Có trình chiếu 3D mapping, thuyết minh tự động và mã QR.
- **4 bảo vật quốc gia**: máy bay MiG-21 số hiệu 4324 và 5121, bản đồ Chiến dịch Hồ Chí Minh, xe tăng T-54B số hiệu 843.

Báo Thanh Tra (4/2025) cho biết bảo tàng có hơn 150.000 hiện vật, hình ảnh, mô hình, có sa bàn 3D Chiến dịch Điện Biên Phủ. Bạn nên dành **ít nhất 2–3 tiếng** nếu muốn xem cả trong nhà lẫn ngoài trời.

## Đi từ F21 tới bảo tàng thế nào?

Từ khu biệt thự Hoa Phượng ra Đại lộ Thăng Long mất khoảng 5 phút, sau đó đi về hướng nội thành tới Km 6+500. Tổng thời gian khoảng 10–15 phút ô tô khi đường thông thoáng [CẦN XÁC NHẬN].

- Lễ tân gọi taxi đón tận cửa khách sạn.
- Theo báo Thanh Tra, cuối tuần và ngày lễ có thể đón 20.000–30.000 lượt khách mỗi ngày. Nếu đi những ngày này, nên có mặt ngay từ 8:00.
- Khu ngoài trời nắng, nên mang mũ, nước, giày đi bộ thoải mái.

Thông tin địa điểm cũng có ở trang [Bảo tàng Lịch sử Quân sự Việt Nam](/kham-pha/bao-tang-lich-su-quan-su-viet-nam).

## Kết hợp lịch trình nửa ngày ra sao?

**Buổi sáng:**

1. 7:30 ăn sáng ở [Phở Thìn Khu A Geleximco](/kham-pha/pho-thin-khu-a-geleximco).
2. 8:00 – 11:30 tham quan bảo tàng.
3. 12:00 ăn trưa ở khu ẩm thực Vincom Mega Mall Smart City, cùng khu Tây Mỗ.
4. Chiều về F21 nghỉ giờ, hoặc nhận phòng ngày đêm từ 14:00.

**Buổi chiều:**

1. 13:00 – 16:30 tham quan bảo tàng.
2. 17:00 đi dạo [Vườn Nhật Vinhomes Smart City](/kham-pha/vuon-nhat-vinhomes-smart-city).
3. Tối ăn ở Vincom Mega Mall rồi về F21 nghỉ qua đêm.

Đi cả gia đình, bạn có thể dành ngày hôm sau cho [Thiên đường Bảo Sơn](/bai-viet/thien-duong-bao-son-gio-mo-cua-gia-ve), cách F21 khoảng 5 phút.

Gia đình 4 người hợp Phòng Đôi 4 người, ngày đêm 1.200.000đ. Trường học, cơ quan đưa đoàn đi tham quan xem trang [Khách đoàn](/doan-doanh-nghiep). Giá các hạng ở [Phòng & giá](/phong), [đặt online](/dat-phong) hoặc gọi **0968 740 333**.', 'diem-den', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'bao-tang-lich-su-quan-su-viet-nam-tu-an-khanh-faq-1', 'Vé vào Bảo tàng Lịch sử Quân sự Việt Nam bao nhiêu tiền?', '40.000đ/người/lượt theo Thông tư 90/2025/TT-BTC. Trẻ em và người từ 80 tuổi được miễn, sinh viên và người từ 60 đến dưới 80 tuổi được giảm 50%.' FROM posts WHERE slug = 'bao-tang-lich-su-quan-su-viet-nam-tu-an-khanh';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'bao-tang-lich-su-quan-su-viet-nam-tu-an-khanh-faq-2', 'Bảo tàng có mở cửa buổi trưa không?', 'Theo các báo, bảo tàng nghỉ trưa từ 11:30 đến 13:00 [CẦN XÁC NHẬN]. Nên đến trước 10:00 nếu chỉ đi buổi sáng.' FROM posts WHERE slug = 'bao-tang-lich-su-quan-su-viet-nam-tu-an-khanh';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'bao-tang-lich-su-quan-su-viet-nam-tu-an-khanh-faq-3', 'Từ An Khánh đến bảo tàng mất bao lâu?', 'Từ F21 khoảng 10–15 phút ô tô theo Đại lộ Thăng Long, khi đường thông thoáng.' FROM posts WHERE slug = 'bao-tang-lich-su-quan-su-viet-nam-tu-an-khanh';

INSERT OR IGNORE INTO posts (title, slug, excerpt, body, topic, published) VALUES ('Công viên Biển Hà Nội – Baara Land: mùa mở cửa, giá vé, đi từ An Khánh', 'baara-land-cong-vien-bien-ha-noi', 'Baara Land ở Sài Sơn, Quốc Oai có bãi biển nhân tạo tạo sóng và cầu trượt nước, cách F21 ở An Khánh khoảng 20–30 phút ô tô, hợp đi mùa hè, ghép với chùa Thầy.', '**Công viên Biển Hà Nội** nằm trong khu Baara Land ở xã Sài Sơn, Quốc Oai, gần chùa Thầy, cách F21 khoảng **20–30 phút** ô tô. Đây là hồ nhân tạo có tạo sóng, hợp đi vào mùa hè. Giá vé và giờ mở cửa năm 2026 F21 chưa tìm được từ nguồn chính thức, nên bạn gọi hoặc xem fanpage của khu trước khi đi.

## Baara Land mở cửa mùa nào, mấy giờ?

Công viên Biển chủ yếu đón khách vào **mùa nóng**. Ngày mở mùa, ngày đóng mùa và giờ mở cửa thay đổi theo từng năm [CẦN XÁC NHẬN: lịch mở cửa 2026]. Các trang du lịch ghi giờ và ngày nghỉ không giống nhau, nên đừng dựa vào một bài review cũ.

Trước khi đi, bạn nên hỏi Baara Land ba điều:

1. Hôm đó Công viên Biển có mở không, mở mấy giờ.
2. Giá vé người lớn, trẻ em, ngày thường và cuối tuần.
3. Có bán vé online hay chỉ bán tại cổng.

## Giá vé bao nhiêu?

| Loại vé | Giá |
|---|---|
| Người lớn, ngày thường | [CẦN XÁC NHẬN] |
| Người lớn, cuối tuần, ngày lễ | [CẦN XÁC NHẬN] |
| Trẻ em | [CẦN XÁC NHẬN] |

Các bài review trên mạng đưa ra nhiều mức giá khác nhau, không ghi rõ năm. F21 sẽ cập nhật bảng này khi có giá chính thức.

## Trong Công viên Biển có gì?

Theo bài của Znews (7/2019), khu có:

- **Bãi biển cát trắng tạo sóng**, có hàng dừa.
- **Cầu trượt lốc xoáy** cao 15 m, dài khoảng 150 m, đi theo nhóm 4 người.
- **Dòng sông lười** thả phao và các trò chơi nước cho nhiều lứa tuổi.
- Biểu diễn cá heo, khách sạn La Paz và chương trình biểu diễn "Tinh hoa Bắc Bộ".

Bài viết đã khá lâu, trò chơi và chương trình biểu diễn có thể đã thay đổi [CẦN XÁC NHẬN]. Xem thêm ở trang [Công viên Biển Hà Nội – Baara Land](/kham-pha/cong-vien-bien-ha-noi-baara-land).

## Nên mang gì, đi mùa hè cần lưu ý gì?

- Đồ bơi, quần áo thay, dép đi nước. Một số bài review cho biết khu không cho thuê đồ bơi [CẦN XÁC NHẬN].
- Kem chống nắng, mũ, kính râm, túi chống nước cho điện thoại.
- Áo phao hoặc phao tay cho trẻ nhỏ, nếu bé chưa biết bơi.
- Quy định mang đồ ăn từ ngoài vào bạn hỏi trước [CẦN XÁC NHẬN].

Nước uống, đồ dùng cá nhân mua trước ở [WinMart+ Đường An Khánh](/kham-pha/winmart-duong-an-khanh), khoảng 3 phút từ F21.

Khi đi mùa hè:

- Đến ngay khi mở cửa, chơi các trò ngoài trời trước khi nắng gắt.
- Trưa nghỉ trong bóng râm, uống nước thường xuyên.
- Chiều hè Hà Nội hay có mưa giông. Có sấm sét thì lên bờ ngay.
- Trẻ nhỏ luôn có người lớn đi kèm khi xuống nước.

## Có nên ghép với chùa Thầy không?

Nên. Baara Land và [chùa Thầy](/kham-pha/chua-thay) cùng xã Sài Sơn, đi một lần được hai chỗ.

| Giờ | Hoạt động | Đi từ F21 |
|---|---|---|
| 6:30 | Ăn sáng gần F21 | 3–5 phút |
| 7:00 – 9:30 | Chùa Thầy, thủy đình, hang Cắc Cớ | 20–30 phút |
| 10:00 – 16:00 | Công viên Biển Baara Land | cùng khu Sài Sơn |
| 16:30 – 17:00 | Về F21 tắm, nghỉ | 20–30 phút |
| 18:30 | Ăn tối ở Khu A Geleximco | ~5 phút |

Thời gian đi là ước tính khi đường thông thoáng [CẦN XÁC NHẬN]. Leo hang Cắc Cớ nên đi buổi sáng khi trời mát. Chi tiết về chùa xem bài [chùa Thầy, chùa Tây Phương](/bai-viet/chua-thay-chua-tay-phuong).

## Về nghỉ ở F21 thế nào?

Đặt **ngày đêm** (nhận 14:00, trả trước 12:00 hôm sau) để chiều về có phòng sẵn, tắm rửa và ngủ lại.

- Gia đình 4 người: Phòng Đôi 4 người, ngày đêm 1.200.000đ.
- Cặp đôi: Phòng Đơn VIP có bồn tắm, ngày đêm 1.000.000đ.
- Chỉ cần tắm, nghỉ rồi về trong ngày: **nghỉ giờ** từ 300.000đ cho 2 giờ đầu.

Xem [Phòng & giá](/phong), [đặt online](/dat-phong) hoặc gọi, nhắn Zalo **0968 740 333**. Mùa hè cuối tuần đông khách, nên đặt sớm.', 'diem-den', 0);
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 1, id, 'baara-land-cong-vien-bien-ha-noi-faq-1', 'Baara Land có mở cửa quanh năm không?', 'Công viên Biển chủ yếu đón khách mùa hè. Ngày mở mùa và giờ mở cửa năm 2026 cần hỏi trực tiếp Baara Land [CẦN XÁC NHẬN].' FROM posts WHERE slug = 'baara-land-cong-vien-bien-ha-noi';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 2, id, 'baara-land-cong-vien-bien-ha-noi-faq-2', 'Từ F21 đi Baara Land mất bao lâu?', 'Khoảng 20–30 phút ô tô khi đường thông thoáng [CẦN XÁC NHẬN].' FROM posts WHERE slug = 'baara-land-cong-vien-bien-ha-noi';
INSERT OR IGNORE INTO posts_faqs (_order, _parent_id, id, question, answer) SELECT 3, id, 'baara-land-cong-vien-bien-ha-noi-faq-3', 'Đi Baara Land có cần mang đồ bơi không?', 'Nên mang đủ đồ bơi và quần áo thay, vì một số bài review cho biết khu không cho thuê đồ bơi [CẦN XÁC NHẬN].' FROM posts WHERE slug = 'baara-land-cong-vien-bien-ha-noi';
