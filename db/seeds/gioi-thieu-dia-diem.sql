-- Giới thiệu chi tiết cho trang /kham-pha/<mã> (CMS › Tiện ích xung quanh › Giới thiệu chi tiết).
-- Trang có giới thiệu ≥ 300 ký tự mới được Google lập chỉ mục (placeIndexable trong src/lib/site.ts).
-- Chỉ ghi vào địa điểm chưa có giới thiệu, nên không đè nội dung khách sạn đã sửa trong CMS. Chạy lại an toàn.
-- Giờ mở cửa, giá tra cứu tháng 11/2026; khách sạn nên đọc lại trong CMS trước khi xuất bản.
--   npx wrangler d1 execute D1 --remote --file db/seeds/gioi-thieu-dia-diem.sql
-- Sau đó bấm "Xuất bản website" để dựng lại trang.

UPDATE places SET body = 'AEON Mall Hà Đông là trung tâm thương mại lớn ở phía Tây Nam Hà Nội, khoảng 220 gian hàng trên diện tích sàn khoảng 153.000 m², ở phường Dương Nội, cách F21 Hotel khoảng 4–5 km. Ngoài siêu thị và bách hóa AEON, trung tâm có rạp CGV, nhiều khu vui chơi trẻ em và hàng chục nhà hàng. Hợp với gia đình có trẻ nhỏ muốn chơi cả buổi, và khách muốn mua đồ Nhật, đồ gia dụng hay quần áo ở một chỗ.

## Giờ mở cửa và liên hệ?

Theo website chính thức của AEON Mall Hà Đông:

| Khu vực | Giờ mở cửa |
|---|---|
| Siêu thị AEON (tầng 1) | 8:00–22:00 |
| Trung tâm thương mại, bách hóa | Ngày thường 10:00–22:00; cuối tuần, ngày lễ 9:00–22:00 |

Hotline: **024 3757 6999**. Dịp Tết và ngày lễ lớn, giờ có thể điều chỉnh.

## Mỗi tầng có gì?

Theo sơ đồ trên website của trung tâm:

- **Tầng 1:** siêu thị AEON, thời trang và thể thao (Uniqlo, H&M, Adidas, Decathlon, MUJI), mỹ phẩm, Starbucks và đồ ăn nhanh.
- **Tầng 2:** thời trang, sách Fahasa, đồ gia dụng Nhật Kohnan, nhiều nhà hàng châu Á như Manwah, Gogi House, Pepper Lunch, Thai Express, iSushi.
- **Tầng 3:** khu trẻ em với Kidzooona, Wolfoo World, Timezone, Jump Arena; cửa hàng đồ trẻ em, đồ chơi; khu "Vườn ẩm thực".
- **Tầng 4:** rạp [CGV Aeon Hà Đông](/kham-pha/cgv-aeon-ha-dong).

Chi tiết từng khu xem ở [khu vui chơi trẻ em Aeon Mall Hà Đông](/kham-pha/khu-vui-choi-tre-em-aeon-mall-ha-dong) và [nhà hàng tại Aeon Mall Hà Đông](/kham-pha/nha-hang-tai-aeon-mall-ha-dong).

## Đi từ F21 thế nào?

Khoảng 4–5 km, 10–15 phút xe máy hoặc ô tô khi đường thoáng. Từ khu Hoa Phượng đi về phía Đông Nam, qua khu Dương Nội, theo các trục đường mới trong khu đô thị. Ứng dụng bản đồ sẽ chỉ lối ngắn nhất. Không cần đi Đại lộ Thăng Long, nên xe máy đi lại thuận. Đi xe công nghệ thì đặt điểm đến "AEON Mall Hà Đông".

Trung tâm có bãi đỗ lớn, khoảng 1.900 chỗ ô tô (ngoài trời và dưới hầm) và khoảng 8.000 chỗ xe máy, xe đạp. Chiều cuối tuần và ngày lễ, lối vào bãi ô tô có thể xếp hàng.

## Nên đi lúc nào?

Sáng ngày thường vắng nhất. Đi siêu thị thì đến sớm, từ 8:00 đã mở. Chiều thứ Bảy, Chủ nhật và ngày lễ là lúc đông nhất, nhất là tầng 3 khu trẻ em và các nhà hàng lúc 18:00–20:00. Đi gia đình cuối tuần thì đến ngay giờ mở cửa 9:00, ăn trưa sớm trước 11:30 cho đỡ chờ.

## Mất bao lâu?

Đi siêu thị mua đồ: khoảng 1 giờ. Ăn một bữa và xem phim: 3–4 giờ. Cho trẻ chơi khu tầng 3 rồi ăn uống: thường hết nửa ngày.

## Nghỉ ở đâu khi đi chơi cả ngày?

Đi AEON cả ngày với trẻ nhỏ thì nên có chỗ cho bé ngủ trưa. F21 cách trung tâm khoảng 10–15 phút, có gói nghỉ giờ để nghỉ giữa buổi, hoặc nghỉ ngày đêm nếu ở lại tối. Xem [các hạng phòng](/phong). Trung tâm gần An Khánh hơn và đi nhanh hơn là [Vincom Mega Mall Smart City](/kham-pha/vincom-mega-mall-smart-city).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'aeon-mall-ha-dong' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Bảo tàng Lịch sử Quân sự Việt Nam là bảo tàng quân sự quốc gia ở Km 6+500 Đại lộ Thăng Long, mở cửa đón khách từ ngày 1/11/2024, lưu giữ hơn 150.000 hiện vật, trong đó có 4 bảo vật quốc gia như xe tăng T-54B số hiệu 843 và máy bay MiG-21. Khu trưng bày ngoài trời có máy bay, xe tăng, pháo đặt ngay trên sân, nên trẻ em và người lớn tuổi đều dễ xem. Từ F21 đi xe chỉ khoảng 10–15 phút.

## Giờ mở cửa và giá vé bao nhiêu?

Bảo tàng mở hai ca, nghỉ trưa:

- **Sáng:** 8:00–11:30
- **Chiều:** 13:00–16:30
- **Ngày nghỉ:** theo các hướng dẫn tham quan cập nhật năm 2026, bảo tàng đóng cửa thứ Hai và thứ Sáu hằng tuần. Dịp lễ có thể mở thêm: lễ 30/4 năm 2026, bảo tàng mở 4 ngày liền (30/4–3/5) và miễn vé hai ngày 30/4, 1/5.

Bảo tàng bắt đầu thu vé từ ngày 12/4/2025, theo thông báo được báo chí đưa tin khi đó:

| Đối tượng | Giá vé |
|---|---|
| Người lớn | 40.000đ/người/lượt |
| Người từ 60 tuổi, học sinh và sinh viên từ 16 tuổi (có thẻ), người khuyết tật nặng | Giảm 50% |
| Trẻ dưới 16 tuổi, người từ 80 tuổi, thương binh, người có công với cách mạng | Miễn phí |

Mang theo căn cước hoặc thẻ học sinh, sinh viên nếu muốn được miễn, giảm.

## Bảo tàng có gì để xem?

Tòa nhà chính có 4 tầng nổi, 1 tầng hầm, diện tích sàn gần 64.640m². Giữa công trình là Tháp Chiến thắng cao 45m.

### Bốn bảo vật quốc gia

- Máy bay MiG-21 số hiệu 4324, treo ở sảnh chính.
- Máy bay MiG-21 số hiệu 5121, chiếc phi công Phạm Tuân lái khi bắn rơi B-52 năm 1972.
- Xe tăng T-54B số hiệu 843, chiếc húc cổng phụ Dinh Độc Lập trưa 30/4/1975.
- Bản đồ Quyết tâm chiến đấu trong Chiến dịch Hồ Chí Minh.

### Trưng bày trong nhà

Phần trưng bày đi theo thứ tự thời gian, qua sáu giai đoạn: buổi đầu dựng nước và giữ nước, bảo vệ độc lập (939–1858), chống thực dân Pháp (1858–1945), kháng chiến chống Pháp (1945–1954), kháng chiến chống Mỹ (1954–1975), và xây dựng, bảo vệ đất nước từ 1976 đến nay.

### Trưng bày ngoài trời

- Một bên là vũ khí quân ta từng dùng: pháo 85mm, pháo cao xạ 57mm, xe tăng, máy bay Su-22.
- Bên còn lại là vũ khí thu được của đối phương, như pháo tự hành M-107, máy bay A-37, F-5E, C-130.

Khu ngoài trời thường đông nhất vì trẻ em thích chụp ảnh với máy bay, xe tăng. Được chụp ảnh, quay phim, nhưng không dùng đèn flash ở khu hiện vật nhạy sáng.

## Nên đi lúc nào?

- **Đến từ 8:00 hoặc 13:00.** Bảo tàng nghỉ trưa 11:30–13:00. Đến lúc 10:30 thì chỉ kịp xem khoảng một tiếng.
- **Dành ít nhất 2–3 tiếng** nếu muốn xem cả trong nhà và ngoài trời.
- **Tránh cuối tuần và ngày lễ lớn** nếu muốn xem thong thả. Dịp lễ 30/4, sân ngoài trời đông kín khách.
- **Ngày nắng:** xem khu ngoài trời buổi sáng sớm hoặc chiều muộn, giữa ngày ở trong nhà. Mang mũ và nước.
- Hỏi lại lịch mở cửa tuần đó trước khi đi, vì lịch có thể đổi theo dịp kỷ niệm.

## Đi từ F21 thế nào?

Bảo tàng nằm sát Đại lộ Thăng Long, gần như đối diện khu Vinhomes Smart City (Tây Mỗ) qua đại lộ.

- **Ô tô, taxi, xe công nghệ:** từ An Khánh ra Đại lộ Thăng Long, đi về hướng trung tâm Hà Nội (Mỹ Đình) khoảng 10–15 phút. Đặt điểm đến "Bảo tàng Lịch sử Quân sự Việt Nam" để ứng dụng chọn lối vào đúng.
- **Xe máy:** không được chạy trên làn chính Đại lộ Thăng Long. Đi đường gom hai bên đại lộ và bật chế độ xe máy trên ứng dụng bản đồ.
- **Gửi xe:** bảo tàng có bãi đỗ rộng cho xe máy, ô tô và xe khách.
- **Xe buýt:** các tuyến chạy qua đoạn này gồm 71B, 74, 87, 88, 107, 157 và một số tuyến xe điện VinBus.

## Kết hợp với chỗ nào gần đó?

- Bên kia đại lộ là [Vincom Mega Mall Smart City](/kham-pha/vincom-mega-mall-smart-city), tiện ăn trưa trong giờ bảo tàng nghỉ, hoặc xem phim ở [rạp AEON BETA](/kham-pha/rap-aeon-beta-vincom-smart-city).
- Gần đó có [Vườn Nhật Vinhomes Smart City](/kham-pha/vuon-nhat-vinhomes-smart-city) để đi dạo buổi chiều.
- Gia đình có trẻ nhỏ có thể dành buổi còn lại cho [Thiên đường Bảo Sơn](/kham-pha/thien-duong-bao-son), cách F21 khoảng 5 phút.

## Đi theo đoàn thì nghỉ ở đâu?

Đoàn từ tỉnh xa lên có thể nghỉ ở An Khánh tối hôm trước để kịp ca sáng, không phải chen giờ cao điểm từ nội thành. Xem phòng trống và [đặt phòng](/dat-phong) ở F21.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'bao-tang-lich-su-quan-su-viet-nam' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Bệnh viện Đa khoa Quốc tế Vinmec Smart City ở số 2A Tây Mỗ là bệnh viện lớn gần F21 Hotel nhất, khoảng 3 km, có cấp cứu 24 giờ tất cả các ngày trong năm. Đây là bệnh viện thứ 8 của hệ thống Vinmec, đi vào hoạt động tháng 10/2024, quy mô 169 giường. Khách đang lưu trú ở An Khánh cần khám bệnh hay cấp cứu thì đây thường là lựa chọn nhanh nhất.

## Cấp cứu: gọi ai, đi thế nào?

- **Tình huống nguy hiểm** (khó thở, đau ngực, bất tỉnh, chảy máu nhiều, tai nạn): gọi ngay **115**, rồi báo lễ tân F21 để được hỗ trợ.
- **Tự đến được:** taxi hoặc ô tô từ F21 tới Vinmec Smart City mất khoảng 5–10 phút khi đường thoáng. Báo tài xế đi thẳng tới khu cấp cứu.
- **Gọi bệnh viện:** tổng đài Vinmec Smart City **024 3208 5678**.

Theo trang giờ làm việc của hệ thống Vinmec, cấp cứu, vận chuyển cấp cứu và khám nội đa khoa được phục vụ 24 giờ. Phòng mổ, chẩn đoán hình ảnh và xét nghiệm cho cấp cứu cũng chạy 24 giờ, và có cấp cứu nhi 24 giờ.

## Giờ khám thường là mấy giờ?

Theo lịch Vinmec cập nhật tháng 10/2026, khám tại Vinmec Smart City:

| Ngày | Giờ khám |
|---|---|
| Thứ Hai – thứ Sáu | 7:30–12:00 và 13:00–17:00 |
| Thứ Bảy | 7:30–12:00 |
| Chiều thứ Bảy, Chủ nhật | Nghỉ khám thường |

Ngoài giờ trên, nếu bệnh không gấp nhưng cần khám ngay, gọi tổng đài để hỏi có khám nội ngoài giờ ở Smart City hôm đó không. Ngày lễ, Tết, bệnh viện thường có lịch riêng.

## Đặt lịch khám thế nào?

1. Gọi tổng đài 024 3208 5678 để đặt giờ và hỏi phí khám.
2. Hoặc đặt qua ứng dụng MyVinmec hay trên website vinmec.com.

Đặt trước giúp đỡ phải chờ lâu. Mang theo giấy tờ tùy thân, thẻ bảo hiểm y tế hoặc thẻ bảo hiểm sức khỏe nếu có. Theo trang giới thiệu của bệnh viện, Vinmec Smart City nhận bảo hiểm y tế theo quy định và liên kết với nhiều hãng bảo hiểm tư nhân. Hỏi trước khi khám để biết thẻ của bạn được áp dụng thế nào.

Phí khám ở bệnh viện quốc tế cao hơn bệnh viện công. Bảng giá áp dụng từ 14/10/2025 nhưng không ghi chi tiết trên trang, nên hãy hỏi qua tổng đài.

## Bệnh viện có những khoa nào?

Bệnh viện có 5 trung tâm và 18 khoa chuyên môn. Các trung tâm trọng điểm gồm Cột sống, Hồi sức cấp cứu, Tim mạch – Lồng ngực, Huyết học, Chẩn đoán hình ảnh và Điện quang can thiệp. Các khoa khách hay cần gồm Nhi, Sản phụ khoa, Tiêu hóa – Nội soi, Tai Mũi Họng, Mắt, Răng Hàm Mặt, Chấn thương chỉnh hình và Y học thể thao.

## Đi từ F21 thế nào?

Khoảng 3 km. Từ khu Hoa Phượng ra Đại lộ Thăng Long, đi đường gom hướng vào nội thành khoảng 1–2 km là tới bệnh viện ở phía khu Vinhomes Smart City. Cũng có thể đi qua phố Thiên Phúc từ Khu A Geleximco sang Tây Mỗ. Xe máy không chạy làn chính Đại lộ Thăng Long. Đi taxi hay xe công nghệ thì đặt điểm đến "Vinmec Smart City, 2A Tây Mỗ".

Ban đêm, khi cần gọi xe gấp, cứ báo lễ tân F21 để được gọi taxi.

## Đi thăm người nhà, ở gần bệnh viện

Nếu bạn ở xa lên Hà Nội để khám hoặc chăm người nhà đang điều trị tại Vinmec Smart City, F21 có các gói nghỉ giờ, qua đêm và ngày đêm, đi xe tới bệnh viện khoảng 5–10 phút. Gần bệnh viện còn có [Vincom Mega Mall Smart City](/kham-pha/vincom-mega-mall-smart-city) để mua đồ dùng cá nhân, đồ ăn.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'benh-vien-dkqt-vinmec-smart-city' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Bò An Khang là chuỗi nhà hàng lẩu bò và bò tươi ở phía Tây Hà Nội, cơ sở Nam An Khánh nằm ở lô TT32-01 KĐT Nam An Khánh, cách F21 khoảng 5 phút. Món được nhắc nhiều nhất là lẩu bò nhúng khế. Cơ sở này có khu vui chơi cho trẻ em, nên hợp với gia đình có con nhỏ và nhóm bạn đi ăn tối.

## Bò An Khang có gì?

Theo báo Đầu tư (bài tháng 12/2024), chuỗi ra đời năm 2023, nhà hàng đầu tiên ở KĐT Dương Nội, Hà Đông. Mô hình của chuỗi là buổi sáng bán phở bò, trưa và tối bán lẩu bò cùng các món bò tươi.

Trên kênh TikTok của chuỗi và các trang giới thiệu, những món hay được nhắc là:

- **Lẩu bò nhúng khế:** nước lẩu chua thanh, ăn với nhiều phần bò và rau nhúng.
- **Khay bò tươi:** khay bò dài bày nhiều phần thịt như gân, nạm, bò tươi cắt tại bàn.

Theo kênh của chuỗi, cơ sở Nam An Khánh có khu vui chơi (nhà bóng, nhà hơi) lớn nhất hệ thống. Giá và chương trình khuyến mãi thay đổi theo đợt, nên xem fanpage "Bò An Khang – Bò tươi mỗi ngày" hoặc hỏi quán khi đặt bàn.

## Đi từ F21 thế nào?

Nhà hàng ở dãy TT32 trong KĐT Nam An Khánh (Sudico), gần cổng phân khu Vista Lago. Từ F21 đi theo đường nội khu của Nam An Khánh, khoảng 5 phút xe máy hoặc ô tô. Đặt xe công nghệ thì gõ "Bò An Khang Nam An Khánh" hoặc "TT32-01 Nam An Khánh". Đi ô tô thì hỏi nhân viên chỗ đỗ khi gọi đặt bàn.

## Nên đi lúc nào?

Tối thứ Sáu, thứ Bảy và Chủ nhật là lúc đông nhất của các nhà hàng lẩu trong khu. Đi nhóm đông hoặc cần bàn gần khu vui chơi cho trẻ thì nên gọi đặt trước. Giờ mở cửa của riêng cơ sở này chúng tôi chưa thấy công bố trên kênh chính thức; nhắn lễ tân F21 nếu cần hỏi giúp.

## Gần đó có gì?

Cùng dãy TT32 còn có [nhà hàng Dê Linh Đan](/kham-pha/de-linh-dan) nếu nhóm muốn đổi sang món dê. Ăn xong muốn ngồi cà phê thì có [Lago Cafe](/kham-pha/lago-cafe) trong KĐT Nam An Khánh.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'bo-an-khang' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Bún chả Cô Lan là quán bún chả trong thôn An Thọ, xã An Khánh, chỉ khoảng 3 phút đi từ F21. Đây là kiểu quán ăn trong làng, phục vụ người dân và người đi làm quanh khu, hợp khi bạn muốn một bữa trưa nhanh, đúng món Hà Nội mà không phải đi xa.

## Ăn gì ở đây?

Món chính là bún chả: thịt nướng than ăn với bún rối, rau sống và bát nước chấm chua ngọt có đu đủ, cà rốt ngâm. Nhiều quán bún chả Hà Nội bán kèm nem rán; quán có món này hay không, giá một suất bao nhiêu thì xem bảng tại quán. Đây là quán nhỏ, chưa có trang chính thức hay đánh giá trực tuyến đủ tin cậy để chúng tôi ghi giờ mở cửa và giá ở đây.

## Đi từ F21 thế nào?

An Thọ là thôn cũ nằm cạnh các khu đô thị mới quanh F21. Đi xe máy mất khoảng 3 phút, đây là cách tiện nhất vì đường trong làng thường hẹp và ít chỗ đỗ ô tô. Đi ô tô hoặc xe công nghệ thì nên dừng ở đường lớn gần nhất rồi đi bộ một đoạn. Bấm nút chỉ đường trên trang này để mở Google Maps, hoặc nhắn lễ tân F21 để được chỉ lối vào quán.

## Nên đi lúc nào?

Ở Hà Nội, bún chả chủ yếu là món buổi trưa: than nướng thường đỏ từ cuối buổi sáng, và nhiều quán nhỏ bán hết là nghỉ sớm. Đi trong khoảng giờ trưa là chắc nhất. Nếu định đi buổi tối, hãy nhắn lễ tân F21 hỏi trước xem quán còn mở không.

## Gần đó có gì?

Muốn nhiều lựa chọn hơn trong một chỗ thì sang [dãy quán ăn Khu A Geleximco](/kham-pha/day-quan-an-khu-a-geleximco-le-trong-tan), nơi có thêm vài quán bún chả, phở và cơm. Ăn xong ngồi cà phê thì có [Lago Cafe](/kham-pha/lago-cafe) ở KĐT Nam An Khánh, cũng gần khách sạn.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'bun-cha-co-lan' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'CGV Aeon Hà Đông là cụm rạp 9 phòng chiếu, 1.444 ghế ở tầng 3 và tầng 4 Aeon Mall Hà Đông, có đủ ba loại phòng đặc biệt: IMAX, Gold Class và L''amour. Đây là rạp có phòng IMAX gần An Khánh, hợp với người muốn xem phim bom tấn trên màn hình lớn. Rạp mở 10:00–24:00 hằng ngày, theo trang thông tin cửa hàng của Aeon Mall Hà Đông.

## Giá vé bao nhiêu?

Theo bảng giá trên trang rạp của website CGV (xem tháng 11/2026):

| Loại vé | Giá tham khảo |
|---|---|
| 2D thường, người lớn | Khoảng 68.000–125.000đ tùy ngày, giờ |
| IMAX | Khoảng 123.000–183.000đ |
| Gold Class | 200.000đ vào thứ Tư, 150.000đ vào Culture Day |
| L''amour | 400.000đ vào thứ Tư, 300.000đ vào Culture Day |

Phụ thu thêm:

- Ghế VIP: +5.500đ (miễn cho khách U22 và trẻ em).
- Ghế đôi Sweetbox: +26.000đ.
- Phim 3D: +32.000đ từ thứ Hai đến thứ Năm, +53.000đ từ thứ Sáu đến Chủ nhật và ngày lễ.
- Ngày lễ, Tết: +11.000đ.

Vé học sinh, sinh viên, trẻ em, người cao tuổi và U22 mua tại quầy. Giá trên website chỉ là vé người lớn. Hotline CGV: 1900 6017.

## Chọn phòng nào?

- **IMAX:** màn hình và âm thanh lớn nhất rạp, hợp phim hành động, khoa học viễn tưởng. Suất tối cuối tuần nên đặt trước.
- **Gold Class:** ghế ngả rộng, ít ghế, yên tĩnh hơn. Hợp cặp đôi hoặc người muốn thoải mái.
- **L''amour:** phòng ghế giường dành cho hai người, giá cao nhất.
- **Ngày rẻ:** thứ Tư có giá ưu đãi cho Gold Class, L''amour. Culture Day thường rơi vào thứ Hai cuối tháng.

## Đi từ F21 thế nào?

Aeon Mall Hà Đông nằm ở phường Dương Nội, phía Đông Nam An Khánh, đi khoảng 10–15 phút.

- **Ô tô, taxi, xe công nghệ:** từ An Khánh theo đường Lê Trọng Tấn về hướng Hà Đông. Đặt điểm đến "Aeon Mall Hà Đông" để ứng dụng chỉ đúng cổng.
- **Xe máy:** đi theo Lê Trọng Tấn, gửi ở bãi xe máy ngoài trời của trung tâm.
- **Gửi xe:** Aeon Mall Hà Đông có bãi đỗ miễn phí, khoảng 1.900 chỗ ô tô (ngoài trời và hầm) và 8.000 chỗ xe máy, xe đạp.
- **Suất khuya:** trung tâm thương mại đóng cửa lúc 22:00 nhưng rạp chiếu tới gần nửa đêm. Hỏi nhân viên lối ra sau giờ đóng cửa, gọi xe công nghệ về F21.

## Kết hợp với chỗ nào gần đó?

- Ăn trước giờ chiếu ở các [nhà hàng tại Aeon Mall Hà Đông](/kham-pha/nha-hang-tai-aeon-mall-ha-dong).
- Đi cùng trẻ nhỏ thì cho bé chơi ở [khu vui chơi trẻ em tầng 3](/kham-pha/khu-vui-choi-tre-em-aeon-mall-ha-dong) trong lúc chờ suất.
- Muốn xem gần hơn và không cần IMAX, có [rạp AEON BETA Vincom Smart City](/kham-pha/rap-aeon-beta-vincom-smart-city).

## Xem suất cuối thì nghỉ ở đâu?

Suất muộn kết thúc gần nửa đêm, chạy về nội thành khá xa. Nghỉ qua đêm ở F21 chỉ cách khoảng 10–15 phút đi xe. Xem [các hạng phòng](/phong).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'cgv-aeon-ha-dong' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Chùa Thầy (còn gọi là chùa Cả, tên chữ Thiên Phúc tự) là ngôi chùa cổ dưới chân núi Sài Sơn, xã Quốc Oai, gắn với Thiền sư Từ Đạo Hạnh và thuộc khu di tích quốc gia đặc biệt. Chùa nổi tiếng với thủy đình giữa hồ Long Trì, hai cây cầu có mái Nhật Tiên, Nguyệt Tiên và đường núi lên hang Cắc Cớ. Từ An Khánh đi theo Đại lộ Thăng Long khoảng 20–30 phút, hợp chuyến đi nửa ngày cho người thích chùa cổ, kiến trúc và leo núi nhẹ.

## Giá vé và giờ mở cửa thế nào?

- **Vé tham quan:** 10.000đ/người, theo các bài hướng dẫn tham quan 2024–2025.
- **Gửi xe:** khoảng 10.000đ/xe máy, 30.000đ/ô tô.
- **Giờ mở:** chùa đón khách ban ngày. Chưa có giờ đóng cửa chính thức được công bố, nên đi trước 16:00 cho chắc.

Nhiều di tích ở Hà Nội miễn vé vào Ngày Di sản văn hóa Việt Nam 23/11. Nếu định đi đúng ngày này, hỏi lại ban quản lý hoặc lễ tân F21.

Từ ngày 25/3/2026, chùa có mã QR đặt tại các điểm để tra cứu thông tin di tích bằng điện thoại.

## Chùa Thầy có gì để xem?

Phần dưới đi bộ trên mặt bằng, hợp người lớn tuổi. Phần trên núi phải leo dốc đá.

- **Hồ Long Trì và thủy đình:** thủy đình giữa hồ là sân khấu múa rối nước vào mùa lễ hội.
- **Cầu Nhật Tiên và cầu Nguyệt Tiên:** hai cây cầu có mái bắc qua hồ Long Trì, góc chụp ảnh quen thuộc nhất của chùa.
- **Ba tòa chùa Hạ, Trung, Thượng:** chùa Thượng thờ Thiền sư Từ Đạo Hạnh.
- **Đường núi:** sau chùa có lối lên chùa Cao và hang Cắc Cớ. Hang có nhiều tầng, đa số khách chỉ vào tầng đầu.

Đường núi lát đá, dễ trơn khi trời mưa hoặc nồm. Đi giày đế bám, không đi dép cao gót. Người cao tuổi có thể chỉ xem khu hồ và ba tòa chùa chính, mất khoảng 1–1,5 tiếng. Muốn lên núi thì dành 2–3 tiếng.

## Lễ hội chùa Thầy diễn ra khi nào?

Lễ hội chính vào đầu tháng 3 âm lịch, từ mùng 3 đến mùng 7, ngày chính là mùng 7. Năm 2026, hội diễn ra khoảng 19–23/4 dương lịch, lần đầu có chương trình trình diễn ánh sáng 3D mapping "Ánh sáng chạm ký ức".

- Mùa hội có múa rối nước ở thủy đình, nhưng rất đông, đường vào hay tắc.
- Muốn vãn cảnh yên tĩnh, đi ngày thường ngoài tháng Giêng và tháng 3 âm lịch.
- Mùng 1 và ngày rằm cũng đông người đi lễ hơn ngày thường.

## Đi từ F21 thế nào?

Chùa nằm phía Tây An Khánh, cùng trục Đại lộ Thăng Long.

1. Từ An Khánh ra Đại lộ Thăng Long, đi về hướng Hòa Lạc.
2. Ra ở nút giao chùa Thầy (Sài Sơn), rẽ phải theo biển chỉ dẫn vào xã Sài Sơn cũ.
3. Đi thêm vài km là tới khu chùa và núi Sài Sơn.

- **Ô tô, taxi, xe công nghệ:** khoảng 20–30 phút tùy giờ. Đi cả nửa ngày thì đặt xe theo giờ tiện hơn gọi lẻ hai chiều, vì chiều về ở khu chùa khó gọi xe hơn trong phố.
- **Xe máy:** không được chạy trên làn chính Đại lộ Thăng Long. Đi đường gom hai bên đại lộ, bật chế độ xe máy trên ứng dụng bản đồ.
- **Xe buýt:** theo hướng dẫn trên website Thiên đường Bảo Sơn, tuyến 71 (Bến xe Mỹ Đình – Bến xe Sơn Tây) chạy qua Đại lộ Thăng Long đoạn An Khánh và qua ngã tư Chùa Thầy. Hỏi lễ tân F21 điểm đón gần nhất trước khi đi.

## Lưu ý khi đi chùa

- Mặc quần áo kín vai, quá gối. Giữ trật tự trong chính điện.
- Hỏi giá trước khi mua đồ lễ.
- Mang nước, đèn pin điện thoại nếu vào hang.

## Kết hợp với chỗ nào gần đó?

- **Công viên Biển Hà Nội – Baara Land:** cũng ở khu Sài Sơn, rất gần chùa. Mùa hè có thể đi chùa buổi sáng, chiều sang tắm biển nhân tạo. Xem [Công viên Biển Hà Nội – Baara Land](/kham-pha/cong-vien-bien-ha-noi-baara-land) để biết lịch mở theo mùa.
- **Chùa Tây Phương:** cách chùa Thầy một quãng ngắn đi xe, nổi tiếng với bộ tượng gỗ thời Tây Sơn. Muốn đi cả hai chùa trong một ngày, nên lên Tây Phương buổi sáng khi trời mát vì phải leo khoảng 240 bậc đá.

## Đi sớm thì nghỉ ở đâu?

Muốn tới chùa từ sáng sớm, ngủ lại An Khánh tối hôm trước sẽ đỡ một đoạn đường dài và tránh giờ cao điểm trong nội thành. Xem [các hạng phòng](/phong).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'chua-thay' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Cơm gà Hội An ở lô A33, Khu A Geleximco là quán cơm gà bình dân trên trục shophouse Lê Trọng Tấn, cách F21 khoảng 5 phút. Quán hợp bữa trưa hoặc bữa tối nhanh khi bạn không muốn đi xa, nhất là sau một buổi chơi ở Thiên đường Bảo Sơn gần đó.

## Cơm gà Hội An là món gì?

Cơm gà kiểu Hội An thường dùng cơm nấu bằng nước luộc gà nên hạt cơm vàng và thơm. Gà luộc được xé nhỏ, trộn hành tây, rau răm, ăn kèm đu đủ hoặc dưa góp và nước dùng gà. Thực đơn cụ thể, khẩu phần và giá ở quán có thể khác, nên gọi trước hoặc xem bảng giá tại chỗ.

## Giờ mở cửa và giá?

Chúng tôi chưa tìm được nguồn chính thức gần đây về giờ mở cửa và giá của quán. Một danh sách quán quanh An Khánh ghi quán bán cả trưa lẫn tối, mức chi tiêu trung bình mỗi người ở mức cơm bình dân. Nếu bạn định ghé vào giờ muộn, hãy nhắn lễ tân F21 hỏi giúp trước.

## Đi từ F21 thế nào?

Từ khu biệt thự Hoa Phượng, ra đường Lê Trọng Tấn rồi đi về phía Khu A Geleximco, quãng đường khoảng 1,5–2 km.

- **Xe máy:** khoảng 5 phút, dựng xe trước cửa shophouse.
- **Ô tô, taxi, xe công nghệ:** khoảng 5–7 phút. Nếu tự lái, đỗ ở đoạn đường nội khu được phép đỗ, tránh chắn cửa các shophouse bên cạnh.
- Khi tìm đường, gõ "A33 Khu A Geleximco" để bản đồ dẫn đúng dãy nhà.

## Gần đó còn gì?

Lô A33 nằm giữa dãy quán ăn Khu A. Nếu muốn đổi món, bạn có [Phở Thìn](/kham-pha/pho-thin-khu-a-geleximco), [Trọng Hải Sản](/kham-pha/trong-hai-san-hai-san-quang-ninh) hoặc xem cả [dãy quán ăn Khu A Geleximco](/kham-pha/day-quan-an-khu-a-geleximco-le-trong-tan). Ăn xong muốn ngồi cà phê thì có [Highlands Coffee](/kham-pha/highlands-coffee-geleximco) cùng khu.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'com-ga-hoi-an-geleximco-a' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Cộng Cà Phê Splendora là chi nhánh của chuỗi Cộng Cà Phê tại phố đi bộ khu đô thị Splendora (Bắc An Khánh), phía bắc Đại lộ Thăng Long, cách F21 khoảng 5 phút đi xe. Quán có kiểu trang trí gợi nhớ thời bao cấp quen thuộc của Cộng, hợp để ngồi cà phê với bạn bè, gia đình hoặc khách nước ngoài muốn thử cà phê cốt dừa.

## Quán có gì?

Chi nhánh này có tên "Splendora An Khánh" trong danh sách cửa hàng trên website chính thức của Cộng. Thực đơn theo chuẩn chuỗi:

- **Cà phê cốt dừa:** món nhiều người gọi nhất ở Cộng, cà phê đậm trộn cốt dừa đá xay.
- **Bạc xỉu, cà phê sữa, cà phê đen** pha kiểu Việt.
- **Đồ uống không cà phê:** sinh tố cốt dừa, sữa chua nếp cẩm, cacao, trà.

Không gian các quán Cộng thường dùng tông xanh lá quân đội, bàn ghế gỗ, đồ vật cũ kiểu những năm 1970–1980. Theo trang Foody của chi nhánh, quán có máy lạnh và có chỗ ngồi ngoài trời.

## Giờ mở cửa và giá?

Cộng thường mở từ sáng đến khá muộn buổi tối, giá đồ uống ở mức trung bình của các chuỗi cà phê tại Hà Nội. Chúng tôi chưa có bảng giá và giờ mở cửa chính thức gần đây của riêng chi nhánh Splendora. Xem trên fanpage Cộng Cà Phê hoặc nhắn lễ tân F21 hỏi giúp trước khi đi.

## Đi từ F21 thế nào?

Splendora nằm ở phía bên kia Đại lộ Thăng Long so với F21. Từ khu biệt thự Hoa Phượng, đi lên phía Đại lộ Thăng Long, qua cầu vượt An Khánh sang đường gom phía bắc rồi rẽ vào khu đô thị Splendora. Quãng đường khoảng 3 km.

- **Xe máy:** khoảng 5–7 phút.
- **Ô tô, taxi, xe công nghệ:** khoảng 7–10 phút. Đặt điểm đến "Cộng Cà Phê Splendora" để tài xế vào đúng phố đi bộ.
- Nút giao Đại lộ Thăng Long với Vành đai 3,5 ở đoạn An Khánh được khởi công từ tháng 4/2025. Trong thời gian thi công, một số hầm chui và lối rẽ có lúc bị đóng hoặc phân luồng, nên đi theo chỉ dẫn của Google Maps tại thời điểm đi.

## Có chi nhánh Cộng nào khác gần F21?

Nếu bạn ở phía Tây Mỗ, Cộng còn có chi nhánh trong Vinhomes Smart City, tiện kết hợp với [khu ẩm thực Vincom Mega Mall Smart City](/kham-pha/khu-am-thuc-vincom-mega-mall-smart-city).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'cong-ca-phe-splendora' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Công viên Biển Hà Nội (còn gọi là Baara Land hoặc Tuần Châu Hà Nội) là khu biển nhân tạo có cát trắng, nước mặn và sóng nhân tạo ở thôn Đa Phúc, khu Sài Sơn, xã Quốc Oai. Biển chỉ mở theo mùa hè, khoảng từ cuối tháng 4 đến hết tháng 9. Đây là chỗ tắm biển gần An Khánh nhất, hợp gia đình có trẻ nhỏ và nhóm bạn muốn tránh nóng mà không phải đi xa.

## Biển mở cửa khi nào?

Mùa 2026, công viên biển mở đón hè từ ngày 24/4/2026 và **đóng cửa từ ngày 1/10/2026**, theo thông báo đăng trên website show Tinh Hoa Bắc Bộ (biểu diễn trong cùng khu). Lịch mở mùa 2027 chưa công bố. Nếu bạn đi vào khoảng tháng 10 đến tháng 4, nhắn lễ tân F21 hỏi lại trước khi đi.

Trong mùa hè, giờ mở thường từ 8:00 đến khoảng 18:00 ngày thường và 18:30 cuối tuần. Ngày nghỉ trong tuần thay đổi theo từng tháng: các nguồn ghi nghỉ thứ Hai, có tháng ghi nghỉ thứ Ba, và tháng 9/2026 chỉ mở thứ Bảy, Chủ nhật, ngày lễ. Hỏi lịch tuần đó trước khi đi.

## Giá vé bao nhiêu?

Bảng giá tháng 9/2026 trên cùng website:

| Loại vé | Ngày thường | Thứ Bảy, Chủ nhật, ngày lễ | Sau 16:00 (mua tại cổng) |
|---|---|---|---|
| Người lớn (từ 1,3m) | 150.000đ | 180.000đ | 100.000đ |
| Trẻ em (1m – dưới 1,3m) | 75.000đ | 90.000đ | 50.000đ |
| Trẻ dưới 1m | Miễn phí | Miễn phí | Miễn phí |

Giá có thể đổi khi sang mùa mới. Một số trang du lịch còn ghi mức 200.000–250.000đ của các năm trước, nên đừng dựa vào bảng giá cũ.

## Có gì để chơi?

- **Bãi biển nhân tạo:** cát trắng, nước mặn pha nhân tạo, có sóng. Đây là phần chính, đông nhất vào trưa và chiều cuối tuần.
- **Trò chơi dưới nước:** cầu trượt nước cao, máng trượt xoắn, bể vầy cho trẻ nhỏ.
- **Khu trẻ em:** nhà bóng, nhà hơi, xe điện, tàu hỏa.
- **Show Tinh Hoa Bắc Bộ:** chương trình biểu diễn văn hóa Bắc Bộ trong cùng khu, có lịch diễn và vé riêng, không tính trong vé biển. Show có lịch theo tháng kể cả sau khi biển đóng mùa.

## Lưu ý khi đi

- Không mang đồ ăn, đồ uống vào khu bãi biển. Ăn uống trong khu thường đắt hơn bên ngoài.
- Mang sẵn đồ bơi, khăn, kem chống nắng, dép đi cát. Đừng trông chờ thuê được đồ bơi tại chỗ.
- Trẻ nhỏ nên mặc áo phao hoặc đeo phao tay khi xuống khu có sóng, người lớn đi kèm sát.
- Vé sau 16:00 rẻ hơn, hợp đi tắm chiều mát khi trời đã bớt nắng gắt.

## Đi từ F21 thế nào?

Khu biển nằm cùng trục Đại lộ Thăng Long với chùa Thầy, cách F21 khoảng 20–30 phút.

1. Từ An Khánh ra Đại lộ Thăng Long, đi về hướng Hòa Lạc.
2. Ra ở nút giao chùa Thầy (Sài Sơn), rẽ phải vào hướng Sài Sơn.
3. Đi thêm khoảng 1–2 km tới thôn Đa Phúc, theo biển chỉ dẫn vào công viên.

- **Ô tô, taxi, xe công nghệ:** cách nhanh nhất. Ở khu Sài Sơn gọi xe chiều về khó hơn trong phố, nên thuê xe theo giờ hoặc hẹn trước tài xế đón.
- **Xe máy:** không chạy trên làn chính Đại lộ Thăng Long. Đi đường gom, bật chế độ xe máy trên ứng dụng bản đồ.
- **Xe buýt:** có thể đi các tuyến chạy dọc Đại lộ Thăng Long tới nút giao chùa Thầy, rồi đi xe ôm hoặc taxi chặng 1–2 km còn lại.

## Kết hợp với chỗ nào gần đó?

[Chùa Thầy](/kham-pha/chua-thay) ở ngay khu Sài Sơn. Ngày hè, đi chùa buổi sáng khi trời mát, trưa ăn ở Quốc Oai, chiều sang tắm biển rồi về. Nếu biển đóng mùa, chùa Thầy vẫn mở quanh năm.

## Chơi cả ngày thì nghỉ ở đâu?

Tắm biển cả buổi chiều thường mệt và về muộn. Gia đình ở xa có thể nghỉ ngày đêm hoặc qua đêm ở F21, cách khu biển khoảng 20–30 phút, trên đường về nội thành. Xem [các hạng phòng](/phong).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'cong-vien-bien-ha-noi-baara-land' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Khu đô thị Vinhomes Smart City ở Tây Mỗ có công viên trung tâm rộng khoảng 10,2 ha thiên về thể thao, với gym ngoài trời, sân tennis, bóng rổ, cầu lông, bóng đá và nhiều khoảng xanh để đi bộ. Đây là chỗ gần F21 Hotel nhất để chạy bộ buổi sáng hay đi dạo buổi chiều trong một khu rộng, sạch, nhiều cây. Hợp với khách ở vài ngày muốn giữ thói quen tập luyện, và gia đình có trẻ nhỏ cần chỗ chạy nhảy.

## Có gì để chơi?

Công viên khai trương cuối năm 2019. Theo báo chí lúc đó, khu này có:

- Khu gym ngoài trời với hơn 1.000 máy tập.
- Hàng chục sân đa năng: tennis, bóng rổ, cầu lông, bóng đá, trong tổng cộng 15 môn.
- Khu trượt patin, đạp xe, chèo kayak.
- Vườn dưỡng sinh, vườn cờ, quảng trường khiêu vũ và khu vui chơi trẻ em.

Số liệu trên là từ lúc khai trương. Một số hạng mục có thể đã thay đổi.

## Khách không ở trong khu có vào được không?

Đi bộ, chạy bộ và dùng máy tập ngoài trời ở các công viên trong khu đô thị thường mở tự do. Riêng sân tennis, sân bóng có thể chỉ cho cư dân đặt, hoặc phải thuê qua ban quản lý. Chúng tôi chưa tìm được quy định đặt sân cho khách bên ngoài, nên nếu bạn muốn chơi tennis hay bóng rổ có tổ chức, hãy hỏi trước hoặc nhờ lễ tân F21 hỏi giúp.

## Đi từ F21 thế nào?

Khoảng 3 km. Từ khu Hoa Phượng ra phía Khu A Geleximco, theo phố Thiên Phúc sang Vinhomes Smart City, khoảng 5–10 phút xe máy hoặc ô tô. Đi xe công nghệ thì đặt điểm đến theo tên trên bản đồ. Khu đô thị có nhiều tòa nhà và công viên nhỏ, nên kiểm tra đúng điểm trước khi xuống xe.

## Nên đi lúc nào?

Sáng sớm trước 8 giờ và chiều sau 17 giờ là lúc mát, cũng là lúc cư dân ra tập đông nhất. Mùa hè nên tránh 10:00–16:00 vì phần lớn khu tập ngoài trời không có bóng râm.

## Kết hợp với chỗ nào gần đó?

Cùng khu đô thị có [Vườn Nhật Vinhomes Smart City](/kham-pha/vuon-nhat-vinhomes-smart-city) để đi dạo, chụp ảnh, và [Vincom Mega Mall Smart City](/kham-pha/vincom-mega-mall-smart-city) để ăn uống, mua đồ sau khi tập.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'cong-vien-the-thao-vinhomes-smart-city' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Cung Thể thao dưới nước Mỹ Đình là khu bể bơi thi đấu trong Khu Liên hợp Thể thao Quốc gia, gần Sân vận động Mỹ Đình, có bể trong nhà và bể ngoài trời cỡ 50 m. Ngoài các giải đấu, nơi này bán vé bơi cho người dân và mở lớp học bơi. Hợp với người muốn bơi ở bể chuẩn thi đấu, và phụ huynh tìm chỗ cho con học bơi ở phía Tây Hà Nội.

## Có những bể nào?

Công trình được xây cho SEA Games 22 năm 2003. Theo các bài giới thiệu gần đây:

- **Bể trong nhà:** 50 m x 25 m, 10 làn, sâu khoảng 2–2,5 m.
- **Bể ngoài trời:** cũng cỡ 50 m x 25 m, sâu khoảng 2,5 m.

Bể sâu, không có khu nước nông cho người chưa biết bơi. Trẻ nhỏ và người mới tập nên đăng ký lớp có hướng dẫn, không xuống bể tự do.

## Giờ bơi và giá vé?

Chúng tôi chưa tìm thấy bảng giờ và giá vé do Cung công bố chính thức trong năm 2025–2026, các trang giới thiệu lại ghi giờ không khớp nhau. Báo Dân Việt tháng 5/2026 cho biết nơi này vẫn bán vé bơi trong nhà. Trước khi đi, gọi hỏi Cung, hoặc nhờ lễ tân F21 hỏi giúp:

- Khung giờ bơi tự do trong ngày, có nghỉ trưa không.
- Giá vé người lớn, trẻ em, có vé tháng không.
- Bể ngoài trời có mở vào mùa đông không.
- Quy định mũ bơi, đồ bơi.

Năm 2026, Chính phủ đang chuẩn bị chuyển Khu Liên hợp Thể thao Quốc gia Mỹ Đình sang Bộ Quốc phòng quản lý, với yêu cầu các hoạt động vẫn duy trì bình thường trong thời gian chuyển giao. Lịch mở cửa có thể thay đổi trong giai đoạn này, nên càng cần hỏi trước.

## Đi từ F21 thế nào?

Khoảng 8 km. Ô tô hoặc xe công nghệ đi Đại lộ Thăng Long hướng vào nội thành, qua cầu vượt Phú Đô rẽ vào Châu Văn Liêm, theo Lê Quang Đạo lên phía Lê Đức Thọ. Đường thoáng khoảng 15–20 phút. Xe máy không chạy làn chính Đại lộ Thăng Long, đi đường gom hoặc theo chế độ xe máy trên bản đồ.

Ngày có trận bóng hay concert ở [Sân vận động Mỹ Đình](/kham-pha/san-van-dong-quoc-gia-my-dinh), sân của Cung thường thành bãi gửi xe cho sự kiện và đường quanh đây rất đông. Nên tránh đi bơi vào chiều tối những ngày đó.

## Kết hợp với chỗ nào?

Gần đó có [sân tập golf Phương Đông](/kham-pha/san-tap-golf-phuong-dong) trên phố Tân Mỹ, nhưng sân tập này đang tạm dừng dịch vụ từ tháng 2/2026. Bơi buổi sáng xong muốn đi tiếp thì [Bảo tàng Lịch sử Quân sự Việt Nam](/kham-pha/bao-tang-lich-su-quan-su-viet-nam) nằm trên đường về An Khánh.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'cung-the-thao-duoi-nuoc-my-dinh' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Khu A Geleximco Lê Trọng Tấn là cụm nhà liền kề, shophouse ngay cạnh Thiên đường Bảo Sơn, tầng trệt gần như dãy nào cũng là quán ăn, quán nhậu hoặc quán cà phê. Từ F21 sang chỉ vài phút, nhiều lựa chọn trong một khu: sáng ăn phở, trưa cơm bún, tối lẩu nướng hay hải sản. Hợp với khách nghỉ giờ hoặc qua đêm muốn ăn nhanh, và nhóm bạn, gia đình đi chơi Bảo Sơn về.

## Có những quán gì?

Các quán đánh số theo dãy (A12, A18, A31, A32, A33…). Một vài quán đang có trên Foody và các trang đặt đồ ăn:

- **Phở và bún buổi sáng:** [Phở Thìn](/kham-pha/pho-thin-khu-a-geleximco) (dãy A33), Phở Lý Quốc Sư (lô A18-02), Phở Cồ Long (7 A33), Bún chả Hàng Than (34 A12), Bún bò Huế và cơm chiên gà xối mỡ (20 A22).
- **Nhà hàng, quán nhậu buổi tối:** [Quán nhậu Tự Do](/kham-pha/quan-nhau-tu-do) (lô A31), [Trọng Hải Sản](/kham-pha/trong-hai-san-hai-san-quang-ninh) (lô A32), Phố Bia Bếp Chef Hải với lẩu bò khô (12 A18), Gà 86 các món gà (14 A38).
- **Cơm:** [Cơm gà Hội An](/kham-pha/com-ga-hoi-an-geleximco-a) ở dãy A33.
- **Cà phê, trà sữa:** [Highlands Coffee Geleximco](/kham-pha/highlands-coffee-geleximco), Trung Nguyên E-Coffee (A33), Mr Good Tea (10 A32).

Quán ở khu này mở và đóng khá nhanh. Danh sách trên để bạn biết khu có những kiểu quán nào, đến nơi nên đi một vòng xem quán nào đang mở.

## Đi từ F21 thế nào?

Từ F21 ra đường Lê Trọng Tấn, đi về phía Thiên đường Bảo Sơn rồi vào Khu A Geleximco, khoảng 5 phút xe máy hoặc ô tô. Đi taxi hay xe công nghệ thì đặt điểm đến theo số lô của quán (ví dụ "A33 Geleximco Lê Trọng Tấn") để tài xế vào đúng dãy. Quán ở đây phần lớn là tầng trệt nhà liền kề, xe máy thường để trước cửa. Đi ô tô thì hỏi quán chỗ đỗ, tối cuối tuần khu này đông xe.

Khu A có phố Thiên Phúc, con đường khoảng 200 m thông xe đầu năm 2024 nối thẳng sang Vinhomes Smart City. Hai bên đường giờ cũng nhiều quán. Muốn đổi sang nhà hàng chuỗi thì theo đường này sang [khu ẩm thực Vincom Mega Mall Smart City](/kham-pha/khu-am-thuc-vincom-mega-mall-smart-city) cũng gần.

## Nên đi lúc nào?

Sáng sớm là giờ của các quán phở, bún. Tối thứ Sáu đến Chủ nhật thì quán nhậu, lẩu nướng đông nhất. Đi nhóm đông thì nên gọi đặt bàn trước. Muốn biết quán nào đang mở hoặc nên ăn gì thì nhắn lễ tân F21.

## Kết hợp với chỗ nào gần đó?

Khu A sát [Thiên đường Bảo Sơn](/kham-pha/thien-duong-bao-son): chơi xong ra ăn tối rồi về khách sạn chỉ mất vài phút. Đi chơi cả ngày ở Bảo Sơn thì có thể xem [các hạng phòng](/phong) để nghỉ ngày đêm tại F21.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'day-quan-an-khu-a-geleximco-le-trong-tan' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Nhà hàng Dê Linh Đan cơ sở 4 ở lô TT32-06 KĐT Nam An Khánh là nhà hàng chuyên món dê, cách F21 khoảng 5 phút. Đây là một cơ sở trong chuỗi Dê Linh Đan ở phía Tây Hà Nội, các cơ sở khác ở KĐT An Hưng và Văn Phú (Hà Đông). Hợp với nhóm bạn, đồng nghiệp hoặc gia đình muốn một bữa tối ngồi lâu, gọi nhiều món.

## Ăn gì ở Dê Linh Đan?

Chuỗi giới thiệu thịt dê là dê núi Ninh Bình, chọn và bán trong ngày. Các trang giới thiệu những cơ sở khác của chuỗi nhắc tới lẩu dê, dê xào xoài và dê hấp làm tại bàn. Thực đơn và giá ở cơ sở Nam An Khánh có thể khác, nên xem tại quán.

Trang liên hệ của chuỗi ghi giờ mở cửa từ 8:00 đến 22:30. Số điện thoại của cơ sở 4 giữa trang chuỗi và fanpage chưa thống nhất, nên khi cần đặt bàn hãy nhắn lễ tân F21 gọi giúp.

## Đi từ F21 thế nào?

Nhà hàng nằm trong dãy TT32 của KĐT Nam An Khánh, cùng dãy với [Bò An Khang](/kham-pha/bo-an-khang). Từ F21 đi theo đường nội khu Nam An Khánh, khoảng 5 phút xe máy hoặc ô tô. Đặt xe công nghệ thì gõ "Dê Linh Đan Nam An Khánh" hoặc "TT32-06 Nam An Khánh". Có uống rượu bia thì nên gọi taxi hoặc xe công nghệ về khách sạn, quãng đường rất ngắn.

## Nên đi lúc nào?

Món dê hợp với bữa tối và những hôm trời lạnh. Tối cuối tuần nhà hàng trong khu thường đông, đi nhóm từ 6 người trở lên nên đặt bàn trước.

## Gần đó có gì?

Trong nhóm có người không ăn dê thì [Bò An Khang](/kham-pha/bo-an-khang) cùng dãy là lựa chọn thay thế. Muốn sang khu có nhiều quán hơn thì [dãy quán ăn Khu A Geleximco](/kham-pha/day-quan-an-khu-a-geleximco-le-trong-tan) cũng chỉ cách vài phút.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'de-linh-dan' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Highlands Coffee ở Khu A Geleximco là cửa hàng của chuỗi cà phê Highlands trên trục Lê Trọng Tấn, An Khánh, cách F21 khoảng 5 phút. Quán hợp khi bạn cần một chỗ quen thuộc để ngồi làm việc, hẹn khách hoặc mua đồ uống mang đi trước khi vào Thiên đường Bảo Sơn.

## Quán bán gì?

Thực đơn giống các cửa hàng Highlands khác: cà phê phin (phin sữa đá, phin đen), PhinDi, các dòng Freeze đá xay, trà như trà sen vàng, trà thạch đào, và bánh mì que, bánh ngọt để ăn nhẹ. Giá niêm yết theo bảng giá chung của chuỗi, có thể thay đổi theo từng đợt; xem trên ứng dụng Highlands hoặc tại quầy.

Bạn có thể ngồi tại chỗ hoặc mua mang đi. Gọi giao hàng về F21 qua các ứng dụng giao đồ ăn cũng được, vì quãng đường ngắn.

## Đây có phải cửa hàng "Highlands Coffee Geleximco" trên bản đồ?

Cần để ý chỗ này. Trên các trang tra cứu, cửa hàng gần F21 thường mang tên **Highlands Coffee Nam An Khánh**, ghi địa chỉ ở khu đô thị mới hai bên đường Lê Trọng Tấn, xã An Khánh (Khu A Geleximco). Còn cửa hàng tên **Highlands Coffee Geleximco** trong hệ thống chính thức của Highlands lại nằm ở Khu C Geleximco, phường Dương Nội (Hà Đông), gần AEON Mall Hà Đông, xa F21 hơn nhiều.

Khi gõ tìm trên Google Maps hoặc gọi xe, hãy chọn cửa hàng ở An Khánh, Khu A Geleximco để khỏi bị dẫn sang Hà Đông.

## Giờ mở cửa?

Các cửa hàng Highlands ở Hà Nội thường mở từ sáng sớm đến tối, nhưng giờ từng cửa hàng có thể khác. Chúng tôi chưa có giờ mở cửa chính thức gần đây của riêng cửa hàng này. Kiểm tra trong ứng dụng Highlands hoặc nhắn lễ tân F21 hỏi giúp.

## Đi từ F21 thế nào?

Từ khu biệt thự Hoa Phượng, ra đường Lê Trọng Tấn và đi về phía Khu A Geleximco, gần Thiên đường Bảo Sơn. Quãng đường khoảng 2 km.

- **Xe máy:** khoảng 5 phút, để xe trước dãy shophouse.
- **Ô tô, taxi, xe công nghệ:** khoảng 5–7 phút. Giờ tan tầm 17:00–19:00 đường Lê Trọng Tấn đông, nên đi sớm hơn một chút.

## Gần đó có gì?

Highlands nằm giữa khu shophouse nhiều quán ăn. Ăn trưa có thể chọn [Phở Thìn](/kham-pha/pho-thin-khu-a-geleximco), [Cơm gà Hội An](/kham-pha/com-ga-hoi-an-geleximco-a) hoặc xem cả [dãy quán ăn Khu A Geleximco](/kham-pha/day-quan-an-khu-a-geleximco-le-trong-tan). Đi cùng trẻ nhỏ thì ghé uống nước trước rồi sang [Thiên đường Bảo Sơn](/kham-pha/thien-duong-bao-son) chơi cả buổi.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'highlands-coffee-geleximco' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Karaoke London là quán karaoke phòng riêng trên đường Lê Trọng Tấn, đoạn qua khu đô thị Nam An Khánh, gần Thiên đường Bảo Sơn. Đây là chỗ hát gần F21 nhất trong danh sách của khách sạn, hợp nhóm bạn, đồng nghiệp hoặc gia đình muốn đi hát buổi tối mà không phải chạy xa.

## Quán phù hợp với ai?

- Nhóm bạn, đồng nghiệp đi liên hoan, họp lớp, sinh nhật.
- Đoàn khách ở F21 muốn có một buổi tối vui sau ngày đi chơi hoặc làm việc.
- Gia đình có người lớn tuổi thích hát, vì quãng đường về khách sạn ngắn.

Giờ mở cửa, giá phòng, loại phòng và số điện thoại quán được đăng khác nhau giữa các trang danh bạ, nên chưa ghi ở đây. Lễ tân F21 có thể gọi hỏi giúp phòng trống và giá trước khi bạn đi, nhất là tối thứ Sáu, thứ Bảy.

## Đi từ F21 thế nào?

Quán ở số 18–20 Lê Trọng Tấn, cách F21 khoảng 5 phút.

- **Xe máy, ô tô:** từ khu biệt thự Hoa Phượng ra đường Lê Trọng Tấn, mở bản đồ tìm "Karaoke London An Khánh" vì đoạn này nhiều khu đô thị, số nhà dễ nhầm.
- **Taxi, xe công nghệ:** nếu nhóm có uống bia rượu, đừng tự lái xe về. Gọi xe công nghệ hoặc nhờ lễ tân gọi taxi, quãng đường ngắn nên cước thấp.
- **Đi đông người:** gọi xe 7 chỗ, đỡ phải chia nhiều xe.

## Kết hợp với chỗ nào gần đó?

- Ăn tối trước ở [dãy quán ăn Khu A Geleximco Lê Trọng Tấn](/kham-pha/day-quan-an-khu-a-geleximco-le-trong-tan) hoặc [quán nhậu Tự Do](/kham-pha/quan-nhau-tu-do).
- Ban ngày đưa cả nhóm đi [Thiên đường Bảo Sơn](/kham-pha/thien-duong-bao-son), tối đi hát.

## Hát khuya thì nghỉ ở đâu?

Hát xong muộn, nghỉ qua đêm ở F21 tiện hơn chạy về nội thành. Xem [các hạng phòng](/phong).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'karaoke-london' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Khu ẩm thực Vincom Mega Mall Smart City là cụm khoảng 30 nhà hàng, quán đồ uống và đồ ăn nhanh trong trung tâm thương mại ở khu đô thị Vinhomes Smart City (Tây Mỗ), cách F21 khoảng 10–15 phút đi xe. Nhà hàng ngồi lâu như lẩu, buffet, món Thái, món Huế tập trung ở tầng 3; tầng 1 là cà phê, trà sữa và đồ ăn nhanh. Đây là chỗ tiện cho nhóm đông hoặc gia đình có trẻ nhỏ, vì mỗi người chọn được một món và ăn xong có thể xem phim, cho trẻ chơi ngay trong tòa nhà.

## Có những nhà hàng nào, ở tầng mấy?

Danh sách dưới đây theo trang gian hàng chính thức của Vincom (năm 2026). Gian hàng trong trung tâm thương mại thay đổi khá thường xuyên, nên xem lại trước khi đi nếu bạn nhắm một quán cụ thể.

| Tầng | Kiểu quán | Tên |
|---|---|---|
| Tầng 3 | Lẩu, nướng, buffet | King BBQ, Kichi Kichi, Dookki, Gui Gui, Mala lẩu Đài Loan, Lẩu Bò 888, D''Maris (buffet) |
| Tầng 3 | Món Á, món Việt | Thai Express, Nét Huế, Mikado, Jeonbok, Cơm niêu Kombo, Phở cuốn Hương Mai, Phở gà Bảo Ngọc |
| Tầng 3 | Đồ ăn nhanh | KFC |
| Tầng 1 | Nhà hàng | Long Wang, Tian Long, Cảo Vương (dimsum, mì tươi Hồng Kông), Lẩu tươi tự chọn Ngũ Phúc, Thai Market |
| Tầng 1 | Đồ ăn nhanh | McDonald''s, Lotteria |
| Tầng 1 | Cà phê, trà, kem | Highlands Coffee, Phúc Long, Phê La, The Coffee House, Aha Coffee, TocoToco, Since Tea, Mixue, Bingxue |

Gợi ý chọn nhanh:

- **Nhóm đông, muốn ăn no:** buffet nướng King BBQ, lẩu băng chuyền Kichi Kichi, buffet tokbokki Dookki, hoặc buffet D''Maris nếu muốn nhiều hải sản.
- **Đi cùng trẻ nhỏ:** KFC, McDonald''s, Lotteria ăn nhanh; hoặc Cơm niêu Kombo, Phở gà Bảo Ngọc cho bữa cơm, phở quen vị.
- **Muốn món Việt:** Nét Huế (bún bò, bánh bèo kiểu Huế), phở cuốn Hương Mai.
- **Chỉ ngồi cà phê:** dãy đồ uống ở tầng 1, từ Highlands, Phúc Long đến Phê La.

## Giờ mở cửa?

Theo trang giới thiệu chính thức của Vincom Mega Mall Smart City (cập nhật năm 2026), trung tâm mở cửa hằng ngày 10:00–21:30. Giờ của từng nhà hàng có thể lệch đôi chút so với giờ chung, dịp lễ, Tết cũng có thể khác.

## Đi từ F21 thế nào?

Trung tâm thương mại nằm sát Đại lộ Thăng Long, gần Bảo tàng Lịch sử Quân sự Việt Nam, cách F21 khoảng 4–5 km về phía đông.

- **Ô tô, taxi, xe công nghệ:** từ khu biệt thự Hoa Phượng ra Lê Trọng Tấn, lên Đại lộ Thăng Long đi về hướng Mỹ Đình, rẽ vào khu đô thị Vinhomes Smart City. Mất khoảng 10–15 phút. Trung tâm có bãi gửi ô tô.
- **Xe máy:** đi đường gom Đại lộ Thăng Long, khoảng 10–15 phút, gửi xe ở bãi xe máy của trung tâm.
- Đoạn Đại lộ Thăng Long qua An Khánh đang có công trường nút giao Vành đai 3,5 (khởi công tháng 4/2025), nên đôi khi phải đi vòng theo phân luồng. Giờ tan tầm 17:00–19:00 nên dự phòng thêm thời gian.

## Nên đi lúc nào?

Trưa ngày thường thoải mái hơn. Tối cuối tuần trung tâm thương mại đông, nếu đi nhóm lớn tới quán buffet hoặc lẩu, nên gọi đặt bàn trước qua hotline của chuỗi đó.

## Kết hợp với chỗ nào gần đó?

- Xem phim ở [rạp AEON BETA](/kham-pha/rap-aeon-beta-vincom-smart-city) cùng tầng 3, hoặc mua sắm trong [Vincom Mega Mall Smart City](/kham-pha/vincom-mega-mall-smart-city).
- Ban ngày, đi dạo [Vườn Nhật Vinhomes Smart City](/kham-pha/vuon-nhat-vinhomes-smart-city) ngay cạnh trung tâm, hoặc ghé [Bảo tàng Lịch sử Quân sự Việt Nam](/kham-pha/bao-tang-lich-su-quan-su-viet-nam) trên Đại lộ Thăng Long.

Nếu cả nhà đi chơi cả ngày, xem phim suất tối rồi mới về, đặt phòng ngày đêm ở F21 để có chỗ nghỉ trưa và không phải vội. Xem các lựa chọn và [đặt phòng](/dat-phong).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'khu-am-thuc-vincom-mega-mall-smart-city' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Khu vui chơi trẻ em Aeon Mall Hà Đông là cụm khu chơi trong nhà ở tầng 3 trung tâm thương mại, gồm Kidzooona, Wolfoo World, Dream Kids, Jump Arena cùng các khu game Timezone, GiGO và Cinesphere. Tất cả nằm trong nhà có điều hoà, nên đây là lựa chọn chắc chắn cho ngày mưa, ngày nắng gắt hoặc buổi tối. Từ F21 đi xe khoảng 10–15 phút.

## Giờ mở cửa thế nào?

Theo trang thông tin cửa hàng trên website Aeon Mall Hà Đông, các khu vui chơi tầng 3 mở cùng giờ trung tâm thương mại:

- **Thứ Hai – thứ Sáu:** 10:00–22:00
- **Thứ Bảy, Chủ nhật, ngày lễ:** 9:00–22:00

Không cho mang vật nuôi vào các khu này. Giá vé mỗi khu tính riêng, thường theo lượt hoặc theo thời gian chơi, và thay đổi theo ngày thường, cuối tuần. Xem bảng giá tại quầy hoặc gọi trước:

- Kidzooona: 0906 660 344
- Dream Kids: 024 2243 1357
- Timezone: 024 7309 7900

## Có những khu nào, hợp với bé mấy tuổi?

| Khu | Kiểu chơi | Hợp với |
|---|---|---|
| Kidzooona (T365) | Khu chơi kết hợp giáo dục kiểu Nhật, chơi cùng các bé khác | Trẻ nhỏ đến tiểu học |
| Dream Kids (T364) | Thương hiệu Nhật, cầu trượt rất dài, nhà Lego khổng lồ, rạp phim mini, tô tượng | Trẻ nhỏ |
| Wolfoo World (T340-2) | Khoảng 2.000m² theo phim hoạt hình Wolfoo: phố điện ảnh, phố hướng nghiệp, vận động, sáng tạo nội dung | Trẻ mẫu giáo, tiểu học |
| Jump Arena (T314–T316) | Gần 900m² chủ đề vũ trụ, trò vận động kết hợp game tương tác | Trẻ lớn, thiếu niên, nhóm bạn |
| Timezone (T327) | Trò chơi điện tử, nạp thẻ chơi theo số dư | Trẻ lớn và người lớn |
| GiGO | Arcade Nhật: máy gắp thú, đua xe, game âm nhạc, đổi điểm lấy quà | Trẻ lớn và người lớn |
| Cinesphere (T322) | 530m² công nghệ: VR, xe đạp thực tế ảo 360 độ, chó robot, bạt nhún trình chiếu | Trẻ lớn, thiếu niên |

Mã trong ngoặc là số gian hàng trên sơ đồ tầng của Aeon Mall, dùng để hỏi đường hoặc tìm trên bảng chỉ dẫn.

Gợi ý theo độ tuổi:

- **Dưới 6 tuổi:** Kidzooona hoặc Dream Kids.
- **6–10 tuổi:** Wolfoo World hoặc Jump Arena.
- **Trên 10 tuổi và người lớn:** Timezone, GiGO, Cinesphere.

Khu chơi mềm thường yêu cầu đi tất. Mang sẵn tất cho cả bé và người lớn đi kèm để khỏi phải mua.

## Nên đi lúc nào?

- **Sáng ngày thường** vắng nhất, bé chơi thoải mái hơn.
- **Chiều thứ Bảy, Chủ nhật** đông, có thể phải xếp hàng mua vé.
- **Ngày nghỉ lễ** nên đến lúc 9:00 khi trung tâm vừa mở.
- Một buổi chơi kèm ăn trưa hoặc ăn tối thường mất 3–4 tiếng.

## Đi từ F21 thế nào?

Aeon Mall Hà Đông nằm ở phường Dương Nội, phía Đông Nam An Khánh.

- **Ô tô, taxi, xe công nghệ:** từ An Khánh theo đường Lê Trọng Tấn về hướng Hà Đông, khoảng 10–15 phút. Đặt điểm đến "Aeon Mall Hà Đông".
- **Xe máy:** đi Lê Trọng Tấn, gửi ở bãi xe máy ngoài trời.
- **Gửi xe:** trung tâm có bãi đỗ miễn phí, khoảng 1.900 chỗ ô tô (ngoài trời và hầm) và 8.000 chỗ xe máy, xe đạp. Gần cổng 5 có điểm sạc xe máy điện miễn phí.
- **Đi cùng ông bà:** trung tâm có xe lăn cho người cao tuổi, người khuyết tật. Hỏi quầy thông tin nếu cần.

## Kết hợp với chỗ nào gần đó?

- Ăn uống ngay trong trung tâm, xem [nhà hàng tại Aeon Mall Hà Đông](/kham-pha/nha-hang-tai-aeon-mall-ha-dong).
- Bố mẹ muốn xem phim sau khi bé chơi xong, có [CGV Aeon Hà Đông](/kham-pha/cgv-aeon-ha-dong) ở tầng 3 và 4.
- Ngày trời đẹp, buổi sáng cho bé ra [Thiên đường Bảo Sơn](/kham-pha/thien-duong-bao-son) xem thủy cung, Safari, chiều vào Aeon chơi trong nhà.
- Thông tin chung về trung tâm có ở trang [Aeon Mall Hà Đông](/kham-pha/aeon-mall-ha-dong).

## Đi chơi cả ngày với con thì nghỉ ở đâu?

Gia đình ở tỉnh lên chơi hai ngày có thể ở F21, ngày đầu đi Bảo Sơn, ngày sau vào Aeon. Cả hai chỗ đều cách khách sạn dưới 15 phút đi xe. Xem [các hạng phòng](/phong).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'khu-vui-choi-tre-em-aeon-mall-ha-dong' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Lago Cafe là quán cà phê trong khu đô thị Nam An Khánh, cách F21 chỉ vài trăm mét về phía nam. Đây là chỗ gần nhất để ngồi uống cà phê buổi sáng, đọc sách một lúc hoặc hẹn bạn mà không phải lấy xe đi xa.

## Quán có gì?

Lago Cafe là quán cà phê khu dân cư, bán cà phê và các loại đồ uống thông dụng. Chúng tôi chưa có thực đơn và bảng giá chính thức của quán, nên không ghi giá ở đây. Nếu bạn định ngồi làm việc lâu, hỏi nhân viên về Wi-Fi và chỗ ngồi gần ổ cắm khi vào.

## Giờ mở cửa?

Chưa có nguồn chính thức gần đây về giờ mở cửa. Quán bán từ sáng đến tối theo các danh sách quán quanh An Khánh, nhưng giờ cụ thể có thể đổi. Muốn chắc, nhắn lễ tân F21 hỏi giúp trước khi đi, nhất là dịp lễ, Tết.

## Đi từ F21 thế nào?

Quán nằm trong cùng khu đô thị Nam An Khánh với F21.

- **Đi bộ:** khoảng 3–5 phút theo đường nội khu, quãng vài trăm mét. Đường nội khu rộng, có đèn chiếu sáng buổi tối.
- **Xe máy, xe đạp:** chưa tới 2 phút.
- Không cần đi ô tô hay gọi xe cho quãng đường này.

Gõ "Lago Cafe Nam An Khánh" trên Google Maps để chỉ đường, hoặc hỏi lễ tân lối đi bộ gần nhất.

## Kết hợp với chỗ nào gần đó?

Buổi sáng có thể ăn sáng ở [Bún chả Cô Lan](/kham-pha/bun-cha-co-lan) bên thôn An Thọ rồi ghé Lago ngồi cà phê. Muốn chỗ đông hơn, có chuỗi đồ uống quen thuộc, thì đi thêm vài phút xe máy tới [Highlands Coffee Geleximco](/kham-pha/highlands-coffee-geleximco) ở Khu A Geleximco.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'lago-cafe' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'AEON Mall Hà Đông có hơn 60 nhà hàng, quán cà phê và quầy đồ ăn, trải từ tầng 1 đến vườn ẩm thực tầng 3, cùng khu đồ ăn chế biến sẵn kiểu Nhật của AEON. Đây là cụm ăn uống lớn nhất gần F21, cách khoảng 10–15 phút đi xe về phía Hà Đông. Hợp cho gia đình, nhóm bạn đông người hoặc khách muốn ăn món Nhật, Hàn, Thái ngay trong một tòa nhà có máy lạnh, bãi xe rộng.

## Ăn gì ở AEON Mall Hà Đông, tầng nào?

Danh sách dưới đây lấy từ danh mục cửa hàng trên website chính thức của AEON Mall Hà Đông (năm 2026). Gian hàng ăn uống thay đổi khá thường xuyên, nên xem lại trước khi đi nếu bạn nhắm một quán cụ thể.

| Tầng | Kiểu món | Nhà hàng |
|---|---|---|
| Tầng 1 | Nhật | Marukame Udon, Ippudo (ramen), Coco Ichibanya (cà ri Nhật) |
| Tầng 1 | Việt | Nhà hàng Phương Nam, Nét Huế, Hàng Cuốn |
| Tầng 1 | Hàn, lẩu và món Á khác | Mr. Dakgalbi, Ashima (lẩu nấm), Tian Long, Yutang |
| Tầng 1 | Âu, đồ ăn nhanh | Pizza 4P''s, Pizza Hut, McDonald''s, KFC, Texas Chicken, Lotteria |
| Tầng 2 | Nhật | iSushi, Yakimono, Pepper Lunch, Chibo Okonomiyaki |
| Tầng 2 | Lẩu, nướng | King BBQ, GoGi House, Manwah, Kichi-Kichi, Dookki |
| Tầng 2 | Thái, Lào, Trung Hoa | Thai Express, Khrua Baan Thai, Khao Lao, Meiwei |
| Tầng 2 | Việt | Vua Chả Cá, Bò Tơ Quán Mộc, Sườn Mười |
| Tầng 2 | Âu | Al Fresco''s, The Pizza Company |
| Tầng 3 | Vườn ẩm thực | Tokyo Tan Tan Ramen, Botejyu, Chixmax |
| Tầng 3 | Đồ ăn nhanh | Jollibee |

Cà phê, trà và tráng miệng có ở cả ba tầng: Starbucks, Highlands Coffee, Katinat, KOI Thé, BreadTalk, Swensen''s ở tầng 1; Bing Xue, Ding Tea, Mocha Cat Cafe ở tầng 2; Mixue ở tầng 3.

Gợi ý chọn nhanh:

- **Đi cùng trẻ nhỏ:** vườn ẩm thực và Jollibee ở tầng 3, cùng tầng với khu vui chơi trẻ em; hoặc đồ ăn nhanh ở tầng 1.
- **Nhóm đông, muốn ăn no:** lẩu, nướng ở tầng 2 như King BBQ, GoGi House, Manwah.
- **Muốn món Nhật:** Marukame Udon, Ippudo ở tầng 1; iSushi, Yakimono ở tầng 2.
- **Mua đồ ăn về phòng:** khu đồ ăn chế biến sẵn của AEON có sushi, onigiri, cơm hộp bento, udon và một số món Việt, giá mềm hơn nhà hàng.

## Giờ mở cửa?

Theo website chính thức của AEON Mall Hà Đông:

- **Khu mua sắm, nhà hàng:** 10:00–22:00 ngày thường; 9:00–22:00 cuối tuần và ngày lễ.
- **Siêu thị AEON (tầng 1):** 8:00–22:00 hằng ngày.

Trung tâm mở cửa 365 ngày trong năm. Giờ riêng của từng nhà hàng có thể khác, và dịp Tết thường có lịch riêng.

## Đi từ F21 thế nào?

AEON Mall Hà Đông ở phường Dương Nội, cạnh Khu C Geleximco, cách F21 khoảng 5 km về phía đông nam.

- **Ô tô, taxi, xe công nghệ:** từ khu biệt thự Hoa Phượng ra đường Lê Trọng Tấn, đi theo hướng Hà Đông qua các khu Geleximco, rồi rẽ vào trục đường dẫn tới cổng AEON. Mất khoảng 10–15 phút. Bãi xe của trung tâm có sức chứa khoảng 1.900 ô tô.
- **Xe máy:** cùng tuyến Lê Trọng Tấn, khoảng 12–15 phút. Bãi xe máy chứa khoảng 8.000 xe.
- Giờ tan tầm 17:00–19:00 đường Lê Trọng Tấn đoạn qua Dương Nội đông, nên đi sớm hoặc sau 19:00.

## Kết hợp với chỗ nào gần đó?

Ăn xong có thể ở lại cả buổi trong cùng tòa nhà:

- Xem phim ở [CGV Aeon Hà Đông](/kham-pha/cgv-aeon-ha-dong).
- Cho trẻ chơi ở [khu vui chơi trẻ em tầng 3](/kham-pha/khu-vui-choi-tre-em-aeon-mall-ha-dong).
- Mua sắm, đi siêu thị ở [AEON Mall Hà Đông](/kham-pha/aeon-mall-ha-dong).

Nếu định ăn tối, xem phim suất muộn rồi mới về, có thể nghỉ qua đêm ở F21 cho thoải mái; xem [các hạng phòng](/phong).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'nha-hang-tai-aeon-mall-ha-dong' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Phở Thìn ở dãy A33 Khu A Geleximco Lê Trọng Tấn là quán phở bò cách F21 khoảng 5 phút, tiện cho bữa sáng trước khi trả phòng hoặc trước khi đi chơi Thiên đường Bảo Sơn. Quán nằm trong dãy shophouse, gần lối đi thông sang Vinhomes Smart City, xung quanh có nhiều quán ăn sáng và cà phê khác.

## Quán bán gì?

Món chính là phở bò, ăn tại quán. Thực đơn cụ thể và giá bát có thể thay đổi, nên xem bảng giá tại quán. Ở Hà Nội có nhiều quán mang tên Phở Thìn của các chủ khác nhau, nên đừng mặc định quán này giống hệt quán bạn từng ăn ở nội thành.

## Đi từ F21 thế nào?

Từ F21 ra đường Lê Trọng Tấn, đi về phía Thiên đường Bảo Sơn rồi vào Khu A Geleximco, tìm dãy A33. Đi xe máy hoặc ô tô mất khoảng 5 phút. Đặt taxi hay xe công nghệ thì gõ "A33 Geleximco Lê Trọng Tấn" để tài xế vào đúng dãy. Xe máy thường để trước cửa; ô tô thì hỏi quán chỗ đỗ.

## Nên đi lúc nào?

Phở hợp nhất cho bữa sáng, và đó cũng là lúc các quán phở trong khu đông khách, nhất là sáng cuối tuần. Quán chưa công bố giờ mở cửa trên kênh chính thức nào chúng tôi tìm được, nên nếu định ăn tối hoặc đi thật sớm thì nhắn lễ tân F21 hỏi giúp trước.

## Kết hợp với chỗ nào gần đó?

Cùng dãy A33 còn có Phở Cồ Long và [Cơm gà Hội An](/kham-pha/com-ga-hoi-an-geleximco-a). Ăn xong muốn ngồi cà phê thì cả khu có nhiều lựa chọn, xem thêm ở trang [dãy quán ăn Khu A Geleximco](/kham-pha/day-quan-an-khu-a-geleximco-le-trong-tan). Từ đây sang cổng [Thiên đường Bảo Sơn](/kham-pha/thien-duong-bao-son) chỉ vài phút.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'pho-thin-khu-a-geleximco' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'PickleBall Bảo Sơn là sân pickleball ở khu Bảo Sơn, An Khánh, giáp khu biệt thự Hoa Phượng nơi có F21 Hotel. Từ khách sạn sang chỉ vài phút, đi bộ được. Hợp với khách muốn chơi pickleball một buổi khi đang ở khu này, hoặc nhóm bạn đi chơi Thiên đường Bảo Sơn muốn đổi sang vận động nhẹ.

## Đi từ F21 thế nào?

Sân nằm phía khu Bảo Sơn, cạnh các dãy biệt thự Hoa Phượng. Đi bộ khoảng vài phút, hoặc xe máy theo đường nội khu. Trên Google Maps, tìm "PickleBall Bảo Sơn" để có đúng điểm. Gần đó cũng có lối ra đường Lê Trọng Tấn, nếu bạn muốn chơi xong đi tiếp sang chỗ khác.

## Đặt sân và giá thế nào?

Chúng tôi chưa tìm được giá thuê hay giờ hoạt động được sân công bố gần đây, nên không ghi số ở đây. Cách chắc nhất là gọi số điện thoại trên trang Google Maps của sân, hoặc nhờ lễ tân F21 hỏi giúp và giữ sân.

Nên hỏi trước:

- Khung giờ còn trống và giá mỗi giờ.
- Có cho thuê vợt, bóng không.
- Có ghép người chơi lẻ không.

## Nên chơi lúc nào?

Sáng sớm và chiều tối sau giờ làm thường kín sân. Muốn chọn giờ đẹp thì đặt trước một hai ngày. Mùa hè nên tránh giữa trưa. Mang giày thể thao đế bằng, nước và khăn.

## Gần đó còn gì?

[Thiên đường Bảo Sơn](/kham-pha/thien-duong-bao-son) ở ngay gần, tiện ghép nếu đi cùng gia đình có trẻ nhỏ. Các sân pickleball khác quanh đây: [The Clubhouse](/kham-pha/san-pickleball-the-clubhouse), [Pickleball Hoa Phượng](/kham-pha/pickleball-hoa-phuong) và [sân Trung đoàn 218](/kham-pha/san-pickleball-trung-doan-218).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'pickleball-bao-son' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Pickleball Hoa Phượng là sân pickleball trong khu biệt thự Hoa Phượng, An Khánh, cách F21 Hotel vài phút đi bộ. Sân phục vụ chủ yếu người chơi trong khu và các khu đô thị lân cận. Hợp với khách lưu trú muốn đánh một hai giờ buổi sáng hoặc buổi tối mà không phải đi xa.

## Đi từ F21 thế nào?

Sân ở cùng khu Hoa Phượng với F21, đi bộ hoặc xe máy trong nội khu vài phút. Trên Google Maps, tìm đúng tên "Pickleball Hoa Phượng" để chỉ đường. Đi bộ thì khỏi lo gửi xe. Đi taxi hay xe công nghệ thì không cần, quãng đường quá ngắn.

## Đặt sân thế nào?

Sân nhỏ, thông tin trên mạng còn ít. Chúng tôi chưa thấy giá thuê hay giờ hoạt động được công bố chính thức, nên bạn nên gọi hoặc nhắn trước theo số điện thoại trên trang Google Maps của sân. Lễ tân F21 cũng có thể hỏi giúp.

Các câu nên hỏi trước:

- Còn trống khung giờ nào, giá bao nhiêu một giờ.
- Có cho thuê vợt và bóng không.
- Sân có đèn để chơi buổi tối không.

## Nên chơi lúc nào?

Sáng sớm và tối sau 18 giờ thường đông người chơi nhất ở các sân trong khu dân cư. Giữa trưa mùa hè nóng, chỉ hợp nếu sân có mái che. Mang giày thể thao đế bằng, nước uống và khăn.

## Gần đó còn sân nào?

Nếu sân này kín lịch, thử [The Clubhouse Pickleball](/kham-pha/san-pickleball-the-clubhouse) cũng trong khu Hoa Phượng, hoặc [PickleBall Bảo Sơn](/kham-pha/pickleball-bao-son) ngay cạnh. Chơi xong muốn ăn sáng hay ăn tối thì sang [dãy quán ăn Khu A Geleximco](/kham-pha/day-quan-an-khu-a-geleximco-le-trong-tan), vài phút xe máy.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'pickleball-hoa-phuong' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Quán nhậu Tự Do Geleximco An Khánh là một cơ sở của chuỗi quán nhậu Tự Do, mở từ tháng 8/2024 ở Khu A Geleximco Lê Trọng Tấn, cách F21 khoảng 5 phút. Quán rộng, ba tầng, có sân vườn và ban công, hợp với nhóm bạn, đồng nghiệp đi liên hoan hoặc tụ tập xem bóng đá.

## Quán có gì?

Theo trang chính thức của chuỗi, cơ sở này rộng khoảng 600 m², ba tầng, sức chứa khoảng 300 khách. Có chỗ ngồi vỉa hè, trong nhà tầng 1 và tầng 2, ban công tầng 2 và phòng VIP riêng cho nhóm từ 6 đến 25 người. Quán có TV, màn LED và loa, mic cho tiệc và các trận bóng.

Thực đơn hơn 200 món nhậu, kèm bia tươi. Theo các bài giới thiệu chuỗi năm 2025, những món hay được nhắc là nấm chiên phô mai, mực khô nướng, trâu gác bếp, bò tái chanh, chân giò chiên giòn và cá chép nướng kiểu Tứ Xuyên. Giá tuỳ món, xem thực đơn tại quán.

## Giờ mở cửa và đặt bàn?

Trang chính thức và bài giới thiệu chuỗi năm 2025 ghi giờ mở cửa 9:00–24:00 hằng ngày. Đặt bàn qua tổng đài *1986 của chuỗi hoặc trên website quannhautudo.com. Trang chính thức ghi ban công tầng 2 là khu ít bàn, hay được đặt trước, nên tối cuối tuần hoặc hôm có trận bóng lớn hãy gọi giữ chỗ sớm.

## Đi từ F21 thế nào?

Từ F21 ra đường Lê Trọng Tấn, đi về phía Thiên đường Bảo Sơn rồi vào Khu A Geleximco, khoảng 5 phút. Trang chính thức gọi cơ sở này là "Geleximco A An Khánh – Vinhomes Smart City"; các trang khác ghi lô A31 Khu A. Đặt xe công nghệ thì gõ "Quán nhậu Tự Do Geleximco An Khánh". Có uống bia rượu thì nên gọi taxi hoặc xe công nghệ, quãng đường về khách sạn rất ngắn.

## Kết hợp với chỗ nào gần đó?

Cùng khu, ở dãy A32, có [Trọng Hải Sản](/kham-pha/trong-hai-san-hai-san-quang-ninh) nếu nhóm muốn ăn hải sản. Cả khu còn nhiều quán khác, xem ở trang [dãy quán ăn Khu A Geleximco](/kham-pha/day-quan-an-khu-a-geleximco-le-trong-tan). Liên hoan xong về muộn thì có thể [đặt phòng](/dat-phong) qua đêm tại F21 thay vì chạy xe về xa.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'quan-nhau-tu-do' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Rạp AEON BETA Vincom Smart City là cụm rạp AEON BETA đầu tiên ở Việt Nam, khai trương ngày 7/12/2025 trong Vincom Mega Mall Smart City (Tây Mỗ), với 7 phòng chiếu và 783 ghế. Rạp do AEON Entertainment (Nhật Bản) và Beta Media liên doanh vận hành. Cùng với CGV Aeon Hà Đông, đây là rạp gần F21 nhất, hợp xem một suất buổi tối rồi về nghỉ.

## Rạp có gì khác các rạp Beta cũ?

AEON BETA là thương hiệu mới, không phải một rạp Beta Cinemas đổi tên.

- **Liên doanh:** AEON Entertainment điều hành khoảng 96 cụm rạp ở Nhật. Beta Media đã mở khoảng 20 cụm Beta Cinemas ở Việt Nam.
- **Quy mô:** 7 phòng chiếu, tổng cộng 783 ghế.
- **Nội dung:** ngoài phim chiếu rạp thông thường, liên doanh cho biết sẽ đưa thêm nội dung bản quyền Nhật Bản như anime vào lịch chiếu.

Lịch chiếu, giá vé từng suất và ưu đãi trong tuần xem trên website, ứng dụng của AEON BETA hoặc các ví điện tử bán vé. Giá vé thay đổi theo ngày, giờ và định dạng phim nên không ghi cố định ở đây.

## Đi từ F21 thế nào?

Vincom Mega Mall Smart City nằm trong khu đô thị Vinhomes Smart City, phía Nam Đại lộ Thăng Long, cách F21 khoảng 10–15 phút.

- **Ô tô, taxi, xe công nghệ:** từ An Khánh ra Đại lộ Thăng Long, đi về hướng Tây Mỗ, trung tâm Hà Nội. Đặt điểm đến "Vincom Mega Mall Smart City" để xe vào đúng cổng trung tâm thương mại.
- **Xe máy:** không chạy trên làn chính Đại lộ Thăng Long, đi đường gom hai bên đại lộ. Gửi xe ở bãi của trung tâm thương mại.
- **Về khuya:** xem suất muộn thì gọi xe công nghệ về F21, quãng đường ngắn nên cước không cao.

## Kết hợp với chỗ nào gần đó?

- Ăn tối trước giờ chiếu ở [khu ẩm thực Vincom Mega Mall Smart City](/kham-pha/khu-am-thuc-vincom-mega-mall-smart-city).
- Ban ngày đi dạo [Vườn Nhật Vinhomes Smart City](/kham-pha/vuon-nhat-vinhomes-smart-city) ngay trong khu đô thị.
- Bên kia đại lộ là [Bảo tàng Lịch sử Quân sự Việt Nam](/kham-pha/bao-tang-lich-su-quan-su-viet-nam), mở hai ca sáng, chiều.
- Muốn xem IMAX thì đi xa hơn một chút tới [CGV Aeon Hà Đông](/kham-pha/cgv-aeon-ha-dong).

## Xem suất muộn thì nghỉ ở đâu?

Nếu bạn ở xa và xem suất cuối, nghỉ qua đêm ở F21 tiện hơn chạy về nội thành lúc nửa đêm. F21 cách rạp khoảng 10–15 phút đi xe. Xem [các hạng phòng](/phong).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'rap-aeon-beta-vincom-smart-city' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Sân bóng E218 là sân bóng đá ở khu Trung đoàn 218 (E218), An Khánh, ngay phía Tây khu biệt thự Hoa Phượng. Từ F21 Hotel sang chỉ vài phút xe máy. Hợp với nhóm bạn, đồng nghiệp muốn thuê sân đá một trận buổi tối rồi về nghỉ gần đó.

## Đi từ F21 thế nào?

Sân nằm cạnh khu Hoa Phượng về phía Tây, sát [sân pickleball Trung đoàn 218](/kham-pha/san-pickleball-trung-doan-218). Đi xe máy vài phút, đi bộ được nếu không mang nhiều đồ. Trên Google Maps, sân có tên "Sân bóng e218". Đi cả đội bằng ô tô thì hỏi trước chủ sân chỗ đỗ xe, vì đường vào khu này nhỏ.

Khu vực gắn với đơn vị quân đội: đi đúng lối vào sân và làm theo hướng dẫn của người quản lý.

## Thuê sân thế nào?

Chúng tôi chưa tìm được bảng giá hay giờ hoạt động công bố chính thức, nên không ghi số ở đây. Gọi số điện thoại trên trang Google Maps của sân, hoặc nhờ lễ tân F21 hỏi giúp. Nên hỏi:

- Sân cho mấy người mỗi đội (sân 5 hay sân 7), mặt cỏ nhân tạo hay cỏ tự nhiên.
- Giá theo khung giờ. Sân bóng thường đắt hơn vào buổi tối và cuối tuần.
- Có đèn, chỗ thay đồ, có bán nước không.

## Nên đá lúc nào?

Khung 17:00–21:00 ngày thường và cả ngày cuối tuần là giờ đông nhất ở các sân bóng thuê. Muốn có giờ đẹp thì đặt trước vài ngày. Mang giày đá bóng đúng loại mặt sân.

## Đá xong đi đâu?

Ăn tối, liên hoan sau trận thì sang [dãy quán ăn Khu A Geleximco](/kham-pha/day-quan-an-khu-a-geleximco-le-trong-tan), khoảng 5 phút xe máy. Đội ở xa đến đá muộn có thể nghỉ lại qua đêm ở F21, xem [các hạng phòng](/phong).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'san-bong-e218' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'The Clubhouse Pickleball An Khánh là cụm sân pickleball nằm ngay trong khu biệt thự Hoa Phượng, cùng khu với F21 Hotel. Đây là sân gần khách sạn nhất trong nhóm sân quanh đây, đi bộ vài phút là tới. Hợp với khách ở lại vài ngày muốn vận động buổi sáng sớm hoặc chiều tối, và nhóm bạn đến chơi rồi nghỉ luôn tại khu này.

## Đi từ F21 thế nào?

Sân nằm trong các dãy biệt thự Hoa Phượng, gần như sát F21. Đi bộ là tiện nhất, không phải tìm chỗ gửi xe. Nếu đi xe máy thì chạy chậm trong ngõ nội khu, để xe gọn theo hướng dẫn của sân. Trên Google Maps, tìm "The Clubhouse Pickleball An Khánh" để có đúng vị trí. Lần đầu đến, có thể nhờ lễ tân F21 chỉ đường.

## Đặt sân và giờ chơi thế nào?

Chúng tôi chưa tìm được bảng giá hay giờ mở cửa chính thức công bố gần đây, nên không ghi ở đây. Sân pickleball ở Hà Nội thường cho thuê theo giờ, khung sáng sớm và tối sau giờ làm là kín nhất. Muốn chơi vào giờ đó thì nên đặt trước một hai ngày.

Trước khi đến, nên hỏi rõ:

- Giá thuê theo giờ, có khác giữa ngày thường và cuối tuần không.
- Có cho thuê vợt, có bán hoặc cho mượn bóng không.
- Có ghép người chơi lẻ không, nếu bạn đi một hoặc hai người.

Lễ tân F21 có thể gọi hỏi giúp và giữ sân cho bạn.

## Cần mang gì?

Giày thể thao đế bằng, bám sân (giày tennis hoặc cầu lông là hợp). Mang nước và khăn. Mùa hè Hà Nội nóng, nên chơi trước 8 giờ sáng hoặc sau 17 giờ.

## Gần đó còn sân nào?

Quanh Hoa Phượng có vài sân khác, tiện đổi chỗ khi sân này kín lịch: [Pickleball Hoa Phượng](/kham-pha/pickleball-hoa-phuong), [PickleBall Bảo Sơn](/kham-pha/pickleball-bao-son) và [sân pickleball Trung đoàn 218](/kham-pha/san-pickleball-trung-doan-218).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'san-pickleball-the-clubhouse' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Sân pickleball Trung đoàn 218 là sân pickleball ở khu Trung đoàn Pháo phòng không 218, An Khánh, ngay phía Tây khu biệt thự Hoa Phượng. Từ F21 Hotel sang chỉ vài phút. Hợp với khách muốn có thêm một lựa chọn khi các sân trong khu Hoa Phượng đã kín giờ.

## Đi từ F21 thế nào?

Sân nằm sát khu Hoa Phượng về phía Tây, cạnh [sân bóng E218](/kham-pha/san-bong-e218). Đi xe máy vài phút, đi bộ cũng được nếu bạn không ngại đi thêm một đoạn. Trên Google Maps, sân có tên "Sân Pickleball Trung Đoàn Pháo phòng không 218". Nên bật chỉ đường theo đúng tên này, vì quanh đây có nhiều lối nhỏ.

Đây là khu vực gắn với đơn vị quân đội. Đi theo lối vào dành cho người chơi, không tự ý vào khu doanh trại, và làm theo hướng dẫn của người quản lý sân.

## Đặt sân thế nào?

Chúng tôi chưa tìm được giá thuê hay giờ hoạt động công bố chính thức. Hãy gọi hoặc nhắn số điện thoại trên trang Google Maps của sân để hỏi khung giờ trống, giá và việc thuê vợt, bóng. Lễ tân F21 có thể hỏi giúp.

## Nên chơi lúc nào?

Như phần lớn sân trong khu dân cư, sáng sớm và tối sau giờ làm là đông nhất. Mùa hè nên tránh giữa trưa. Mang giày thể thao đế bằng, nước uống và khăn.

## Gần đó còn sân nào?

Trong khu Hoa Phượng có [The Clubhouse Pickleball](/kham-pha/san-pickleball-the-clubhouse) và [Pickleball Hoa Phượng](/kham-pha/pickleball-hoa-phuong). Phía khu Bảo Sơn có [PickleBall Bảo Sơn](/kham-pha/pickleball-bao-son).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'san-pickleball-trung-doan-218' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Sân tập golf Phương Đông là sân tập (driving range) 3 tầng với 108 làn đánh trên phố Tân Mỹ, gần Mỹ Đình, Hà Nội. Lưu ý quan trọng: từ ngày 05/02/2026, sân đã tạm dừng dịch vụ tập golf để bảo dưỡng và nâng cấp, và đến đầu tháng 11/2026 chưa có thông báo mở lại trên website chính thức. Nếu bạn định tới tập, hãy gọi hỏi trước.

## Sân đang hoạt động thế nào?

Theo thông báo ngày 04/02/2026 trên website phuongdonggolf.vn:

- Dịch vụ tập golf tạm dừng kể từ 05/02/2026, để bảo dưỡng, sửa chữa và nâng cấp cơ sở vật chất.
- Thời gian mở lại sẽ được công bố sau trên website và các kênh của sân.
- Dịch vụ gửi và trả túi gậy vẫn hoạt động, liên hệ 0987 860 188.
- Lễ tân hỗ trợ khách qua số 024 3785 7889.

## Sân có gì khi mở cửa?

Theo giới thiệu của sân, khu tập dài khoảng 300 yard, có 108 làn đánh trên 3 tầng. Các trang giới thiệu khác nhắc thêm khu putting green, bunker và chỗ cho người thuận tay trái, cùng các lớp học golf. Giá và giờ mở cửa sẽ cần xem lại khi sân hoạt động trở lại.

## Đi từ F21 thế nào?

Khoảng 9 km. Ô tô hoặc xe công nghệ đi Đại lộ Thăng Long hướng vào nội thành, qua cầu vượt Phú Đô rẽ vào Châu Văn Liêm, theo Lê Quang Đạo, Lê Đức Thọ rồi vào phố Tân Mỹ. Đường thoáng khoảng 15–20 phút. Xe máy không chạy làn chính Đại lộ Thăng Long.

## Trong lúc sân tạm dừng, đi đâu?

Muốn vận động gần khách sạn hơn, quanh khu biệt thự Hoa Phượng có vài sân pickleball như [The Clubhouse](/kham-pha/san-pickleball-the-clubhouse) và [Pickleball Hoa Phượng](/kham-pha/pickleball-hoa-phuong), đi bộ vài phút từ F21. Ở khu Mỹ Đình có [Cung Thể thao dưới nước](/kham-pha/cung-the-thao-duoi-nuoc-my-dinh) để đi bơi. Lễ tân F21 có thể gọi hỏi giúp tình trạng sân tập trước khi bạn đi.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'san-tap-golf-phuong-dong' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Sân vận động Quốc gia Mỹ Đình là sân bóng đá lớn nhất Hà Nội, khoảng 40.000 chỗ ngồi, nơi đội tuyển Việt Nam thường đá sân nhà và nơi tổ chức các concert lớn. Sân khánh thành năm 2003 để phục vụ SEA Games 22, có bốn khán đài A, B, C, D. Phần lớn khách tìm đến đây để xem bóng đá hoặc đi concert, và câu hỏi khó nhất thường là đi về thế nào khi cả chục nghìn người cùng tan một lúc.

## Ở đâu, đi từ F21 thế nào?

Sân nằm trong Khu Liên hợp Thể thao Quốc gia, mặt chính hướng ra đường Lê Đức Thọ, quận Nam Từ Liêm cũ. Từ F21 tới sân khoảng 9–10 km.

- **Ô tô, taxi, xe công nghệ:** ra Đại lộ Thăng Long, đi hướng vào nội thành, qua cầu vượt Phú Đô rẽ vào Châu Văn Liêm, rồi Lê Quang Đạo đi thẳng lên phía sân. Đường thoáng mất khoảng 15–20 phút.
- **Xe máy:** không được chạy làn chính Đại lộ Thăng Long. Đi đường gom hai bên, hoặc bật chế độ xe máy trên ứng dụng bản đồ để chọn đường.
- **Ngày có sự kiện:** Lê Quang Đạo, Lê Đức Thọ và các đường quanh sân thường ùn ứ từ chiều. Cảnh sát có thể cấm xe tải, xe khách lớn và phân luồng một số tuyến. Xem thông báo phân luồng của Công an Hà Nội trước khi đi.

## Gửi xe ở đâu?

Với các sự kiện lớn, ban tổ chức thường mở bãi trong khu liên hợp. Ví dụ ở concert quốc gia "Tự hào là người Việt Nam" tháng 8/2025, các bãi được khuyến nghị là:

1. Hầm B1, B2 dưới sân vận động.
2. Sân của [Cung Thể thao dưới nước Mỹ Đình](/kham-pha/cung-the-thao-duoi-nuoc-my-dinh), cách quảng trường khoảng 300 m đi bộ.
3. Khu quanh Trung tâm Đào tạo vận động viên cấp cao Hà Nội.

Mức phí công bố khi đó là 10.000–20.000đ một xe máy và 50.000–100.000đ một ô tô. Bãi tự phát quanh sân hay thu cao hơn nhiều. Nhận vé xe có ghi biển số, chụp lại vị trí để xe và ảnh vé.

## Đi xem concert, bóng đá cần lưu ý gì?

- **Đến sớm ít nhất 2 tiếng.** Ban tổ chức các sự kiện gần đây đều khuyên như vậy, vì tìm chỗ gửi xe và xếp hàng soát vé mất nhiều thời gian.
- **Xem cổng và khán đài in trên vé.** Mỗi sự kiện bố trí cổng riêng. Ban tổ chức thường đăng sơ đồ cổng trên fanpage vài ngày trước.
- **Chỉ mua vé ở kênh chính thức.** Vé sang tay quanh sân có thể bị đẩy giá rất cao, và có rủi ro vé giả.
- **Đi nhóm thì hẹn trước một điểm gặp** cách xa cổng một chút, phòng khi lạc nhau giữa đám đông.

## Về lúc tan thế nào?

Đây là phần mệt nhất. Sau đêm diễn thứ hai của BIGBANG ngày 25/10/2026, với khoảng 40.000 khán giả, giao thông quanh sân tắc hơn một giờ. Nhiều người không gọi được xe qua ứng dụng, tài xế đứng ngoài đòi 200.000–300.000đ cho chuyến gần.

Vài cách cho đỡ mệt:

- Không vội ra ngay. Ngồi lại 30–45 phút cho dòng người vãn bớt.
- Đi bộ ra xa sân vài trăm mét, khỏi Lê Đức Thọ, rồi mới đặt xe.
- Nếu tự đi xe máy, gửi ở bãi gần hướng bạn sẽ về để ra cho nhanh.
- Hỏi giá trên ứng dụng trước khi đồng ý đi xe đón ngoài đường.

## Kết hợp với chỗ nào gần đó?

[Bảo tàng Lịch sử Quân sự Việt Nam](/kham-pha/bao-tang-lich-su-quan-su-viet-nam) nằm trên Đại lộ Thăng Long, cùng đường từ An Khánh lên Mỹ Đình. Có thể đi bảo tàng buổi sáng, chiều nghỉ ngơi rồi tối mới vào sân. Ăn trước giờ vào sân thì quanh khu Mỹ Đình có nhiều quán, nhưng ngày có sự kiện đều rất đông.

## Nghỉ ở đâu khi đi xem sự kiện?

Khách sạn sát Mỹ Đình thường kín phòng và tăng giá khi có trận lớn hay concert. F21 ở An Khánh, cách sân khoảng 15–20 phút khi đường thoáng, khu biệt thự yên tĩnh. Tan show muộn thì chọn nghỉ qua đêm, đến từ chiều thì nghỉ ngày đêm để có chỗ cất đồ, tắm rửa trước khi đi. Ngày có sự kiện lớn nên [đặt phòng](/dat-phong) sớm.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'san-van-dong-quoc-gia-my-dinh' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Thiên đường Bảo Sơn là công viên giải trí lớn trên đường Lê Trọng Tấn, An Khánh, gồm thủy cung 4 tầng, khu Safari, nông trại Happy Farm, làng nghề, phố cổ và hơn 20 trò chơi. Một vé vào cổng xem được gần hết các khu tham quan, nên công viên hợp với gia đình có trẻ nhỏ muốn chơi nửa ngày đến cả ngày.

## Giờ mở cửa và giá vé thế nào?

Theo bảng giá trên website chính thức của công viên, áp dụng từ 3/9 đến 31/12/2026:

- Mở cửa 8:00–17:00, từ thứ Ba đến Chủ nhật.
- **Đóng cửa thứ Hai hằng tuần.**

| Loại khách | Thứ Ba – thứ Bảy (vé vào cổng) | Chủ nhật và 24/11 (vé trọn gói) |
|---|---|---|
| Cao dưới 1m | Miễn phí | Miễn phí |
| Cao 1m – 1,3m | 200.000đ | 300.000đ |
| Cao trên 1,3m | 250.000đ | 400.000đ |

Vé ngày thường và vé Chủ nhật khác nhau ở phần trò chơi:

- **Thứ Ba – thứ Bảy:** vé vào cổng đã gồm thủy cung, Safari, Happy Farm, làng nghề, phố cổ, phim trường, Kids Town và xiếc. Trò chơi mua vé lẻ 20.000–100.000đ/trò, và ngày thường chỉ mở một số trò. Múa rối nước thu thêm 20.000đ (khách 1–1,3m) hoặc 30.000đ (trên 1,3m).
- **Chủ nhật:** vé trọn gói chơi không giới hạn hơn 20 trò, xem rạp phim bay Fly Over Vietnam, đi tàu hỏa vòng quanh công viên và múa rối nước.
- **Không gồm trong vé:** VR Game (50.000đ/trò/lượt), ăn uống, lưu trú.

Bảng giá thay đổi theo tháng và dịp lễ, đôi khi có ưu đãi ngắn ngày. Hotline công viên: 1900 066 808.

**Công viên nước Castaway Lagoon tạm dừng hoạt động đến hè 2027**, theo thông báo trên bảng giá. Nếu bạn định đi tắm, hãy kiểm tra lại trước.

## Trong công viên có gì?

- **Thủy cung:** rộng hơn 10.000m², gồm khu cá nước ngọt, nước lợ và khu nước mặn có đường hầm mái vòm. Tầng 3 có khu Thế giới động vật trưng bày động vật hoang mạc, hoang dã, thủy sinh và đới lạnh.
- **Safari:** đi thuyền qua sông xem động vật. Trẻ được cho hươu cao cổ, voi ăn ở khoảng cách gần.
- **Happy Farm:** cho chuột lang, thỏ ăn. Trong khu này có Đảo Hoa Trong Mây để chụp ảnh.
- **Làng nghề, phố cổ:** xem nặn tò he, viết thư pháp, làm nón lá; phố cổ dựng lại không gian Hà Nội xưa.
- **Kids Town:** khu chơi trong nhà rộng hơn 1.000m², 13 khu trò chơi, dành cho trẻ cao dưới 1,3m, chơi được cả bé 0–3 tuổi. Bắt buộc đi tất chống trơn.
- **Trò chơi:** Đường đua gia tốc (từ 1,2m), Cốc xoay kỳ diệu, Nhà ma (từ 1m), rạp 3D Vũ trụ huyền bí, VR Game. Các trò như Khủng long trỗi dậy, Cú rơi vô cực yêu cầu cao trên 1,3m. Trò đang bảo dưỡng được cập nhật trên website công viên.

Lịch biểu diễn trong bảng giá cuối năm 2026:

- Xiếc chó, xiếc hải cẩu: 10:00–10:30 và 14:30–15:00.
- Múa rối nước ở Thủy Đình: 11:00–11:30 và 15:30–16:00.

## Nên đi lúc nào?

- **Muốn chơi nhiều trò:** đi Chủ nhật. Vé đắt hơn nhưng chơi không giới hạn và có thêm phim bay, tàu hỏa.
- **Chủ yếu xem thủy cung, Safari, cho trẻ dưới 6 tuổi chơi:** đi thứ Ba đến thứ Sáu, vé rẻ hơn và thường vắng hơn cuối tuần.
- **Ngày nắng gắt:** xem thủy cung và Kids Town vào buổi trưa, để các khu ngoài trời cho buổi sáng hoặc chiều muộn.

## Đi từ F21 thế nào?

F21 và công viên cùng nằm ở An Khánh, đi xe khoảng 5 phút.

- **Xe máy, ô tô:** từ khu biệt thự Hoa Phượng ra đường Lê Trọng Tấn, cổng công viên nằm trên tuyến đường này.
- **Taxi, xe công nghệ:** đặt điểm đến "Công viên Thiên đường Bảo Sơn". Quãng ngắn nên cước thấp. Nhóm đông hoặc có xe đẩy thì gọi xe 7 chỗ.

## Lưu ý khi đi

- Công viên không cho mang đồ ăn, đồ uống từ ngoài vào. Đồ ăn cho trẻ nhỏ và người ăn theo chế độ đặc biệt thì được mang.
- Bên trong có quầy ăn vặt và nhà hàng với cơm sườn, xôi gà, lẩu.
- Vé đã mua không đổi, không trả. Nhớ mang tất cho trẻ chơi Kids Town.

## Chơi cả ngày thì nghỉ ở đâu?

Chơi từ lúc mở cửa đến 17:00, trẻ nhỏ thường mệt. F21 chỉ cách vài phút, nên gia đình ở xa có thể nghỉ ngày đêm hoặc qua đêm để cả nhà tắm rửa, ngủ một giấc rồi mới về. Xem [các hạng phòng](/phong).

Ngày mưa thì chuyển sang [khu vui chơi trẻ em Aeon Mall Hà Đông](/kham-pha/khu-vui-choi-tre-em-aeon-mall-ha-dong). Trẻ lớn thích máy bay, xe tăng thì ghé [Bảo tàng Lịch sử Quân sự Việt Nam](/kham-pha/bao-tang-lich-su-quan-su-viet-nam).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'thien-duong-bao-son' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Trọng Hải Sản (Hải sản Quảng Ninh) chi nhánh Bảo Sơn là cửa hàng kiêm quán hải sản ở lô A32 Khu A Geleximco Lê Trọng Tấn, cách F21 khoảng 5 phút. Quán thuộc chuỗi "Hải sản Quảng Ninh .VN" của Nguyễn Văn Trọng, người bán hải sản có tiếng trên TikTok với tên Trọng Hải Sản. Hợp với nhóm bạn, gia đình muốn tự chọn hải sản tươi rồi nhờ chế biến tại chỗ.

## Ăn gì ở đây?

Theo các video của chuỗi, khách chọn hải sản tươi, quán cân theo kg rồi chế biến để ngồi ăn luôn tại chỗ. Món hay được giới thiệu là cua hoàng đế và tôm hùm. Theo bài trên báo Phụ nữ số (tháng 4/2025), chủ chuỗi lấy hải sản tươi trong nước và nhập thêm một số loại từ Hàn Quốc, Nhật Bản, Úc.

Giá hải sản lên xuống theo mùa và theo ngày. Trước khi chế biến, hãy hỏi rõ giá theo kg, cân trước mặt và hỏi phí chế biến, đây là cách nên làm ở bất kỳ quán hải sản nào.

## Đi từ F21 thế nào?

Từ F21 ra đường Lê Trọng Tấn, đi về phía Thiên đường Bảo Sơn rồi vào Khu A Geleximco, tìm dãy A32. Đi xe máy hoặc ô tô mất khoảng 5 phút. Đặt xe công nghệ thì gõ "A32 Geleximco Lê Trọng Tấn". Đi ô tô thì gọi hỏi quán chỗ đỗ trước.

## Nên đi lúc nào?

Hải sản hợp với bữa tối và đi đông người. Chưa có giờ mở cửa công bố rõ ràng cho chi nhánh này, và theo kênh của chuỗi chi nhánh từng có thời gian tạm nghỉ rồi mở bán lại. Vì vậy trước khi đi, nhắn lễ tân F21 để chúng tôi gọi hỏi giúp quán có mở hay không.

## Kết hợp với chỗ nào gần đó?

Cùng khu, ở dãy A31, có [Quán nhậu Tự Do](/kham-pha/quan-nhau-tu-do) nếu nhóm muốn thêm món nhậu và bia tươi. Ban ngày chơi [Thiên đường Bảo Sơn](/kham-pha/thien-duong-bao-son), tối ra đây ăn hải sản là một lịch trình gọn.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'trong-hai-san-hai-san-quang-ninh' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Vincom Mega Mall Smart City là một trong hai trung tâm thương mại lớn gần An Khánh, rộng khoảng 68.000 m², nằm trong khu đô thị Vinhomes Smart City ở Tây Mỗ, cách F21 Hotel khoảng 4 km. Trong đó có siêu thị WinMart, Kohnan, Mr.DIY, rạp Aeon Beta, khu vui chơi trẻ em và hơn 20 nhà hàng. Hợp với khách cần mua đồ nhanh, gia đình có trẻ nhỏ cần chỗ chơi ngày mưa, và nhóm bạn muốn ăn tối rồi xem phim.

## Giờ mở cửa?

Theo website chính thức của Vincom, trung tâm mở **10:00–21:30 hằng ngày**. Hotline: **0862 238 766**. Dịp lễ, Tết, giờ có thể khác, nên xem lại trước khi đi.

## Trong trung tâm có gì?

Trung tâm khai trương ngày 28/4/2022. Theo website của Vincom:

- **Tầng 1–2:** thời trang (Adidas, Levi''s, Aristino…), mỹ phẩm, trang sức (PNJ, Doji), cà phê và sân pickleball Dici Pickle Ball.
- **Tầng 3:** khu ẩm thực với các chuỗi như Kichi Kichi, D''Maris, Long Wang, McDonald''s, KFC. Xem thêm [khu ẩm thực Vincom Mega Mall Smart City](/kham-pha/khu-am-thuc-vincom-mega-mall-smart-city).
- **Rạp chiếu phim:** [Aeon Beta Cinema](/kham-pha/rap-aeon-beta-vincom-smart-city), 7 phòng chiếu, 759 ghế, ở tầng 3.
- **Khu trẻ em (tầng 3):** Wolfoo World, Kubo, Teddy Zone.
- **Siêu thị:** WinMart cho đồ ăn, đồ dùng hằng ngày. Kohnan cho đồ gia dụng Nhật, Mr.DIY cho đồ gia dụng giá rẻ.

Trong trung tâm có thác nước "Cầu Vồng" cao 14 m đổ qua khoảng thông tầng và một dòng nước chảy trong nhà ở tầng 1. Trẻ nhỏ thường thích chỗ này.

## Mua gì cho tiện khi đang ở F21?

- **Quên đồ cá nhân:** bàn chải, sạc điện thoại, áo khoác mỏng, đồ bơi. WinMart và các cửa hàng ở tầng 1 có gần đủ.
- **Đồ ăn mang về phòng:** hoa quả, đồ ăn sẵn ở WinMart.
- **Ngày mưa với trẻ nhỏ:** khu vui chơi tầng 3 và rạp phim đủ cho một buổi chiều.

## Đi từ F21 thế nào?

Khoảng 4 km, 10–15 phút xe máy hoặc ô tô. Từ khu Hoa Phượng ra phía Khu A Geleximco, theo phố Thiên Phúc sang Vinhomes Smart City rồi đi tiếp vào trung tâm. Hoặc ra Đại lộ Thăng Long, đi đường gom hướng vào nội thành rồi rẽ vào khu đô thị. Đi xe công nghệ thì đặt điểm đến "Vincom Mega Mall Smart City".

Trung tâm có chỗ gửi ô tô và xe máy. Chiều tối cuối tuần đông, nên đến sớm hoặc đi xe công nghệ để khỏi xếp hàng vào bãi.

## Nên đi lúc nào?

Ngày thường buổi sáng và đầu giờ chiều vắng nhất. Tối thứ Sáu, thứ Bảy, Chủ nhật đông khách ăn uống và xem phim. Nhà hàng chuỗi đông vào khoảng 18:00–20:00 cuối tuần, đi nhóm nên đặt bàn trước.

## Kết hợp với chỗ nào gần đó?

Ngay cạnh trung tâm có [Vườn Nhật Vinhomes Smart City](/kham-pha/vuon-nhat-vinhomes-smart-city), hợp đi dạo trước hoặc sau khi mua sắm. Cùng khu đô thị còn có [công viên thể thao Vinhomes Smart City](/kham-pha/cong-vien-the-thao-vinhomes-smart-city) và [Bệnh viện Vinmec Smart City](/kham-pha/benh-vien-dkqt-vinmec-smart-city). Muốn đổi sang trung tâm lớn hơn, nhiều chỗ chơi cho trẻ hơn thì đi [AEON Mall Hà Đông](/kham-pha/aeon-mall-ha-dong).', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'vincom-mega-mall-smart-city' AND (body IS NULL OR trim(body) = '');
UPDATE places SET body = 'Vườn Nhật Vinhomes Smart City là công viên phong cách Nhật Bản rộng hơn 6 ha trong khu đô thị Vinhomes Smart City (Tây Mỗ), mở từ tháng 9/2019, gần Vincom Mega Mall Smart City. Vườn có thác đá và núi giả xếp từ đá nhập nguyên khối từ Nhật, hồ cá chép đỏ, cầu gỗ đỏ và hơn 130 cây tùng La Hán. Đây là chỗ đi dạo, chụp ảnh nhẹ nhàng trong một hai tiếng, hợp cặp đôi, gia đình có trẻ nhỏ và người thích chụp ảnh.

## Trong vườn có gì?

Theo các bài giới thiệu khi vườn khai trương năm 2019:

- **Thác đá và núi giả:** cụm núi nhiều ngọn với thác nước nhân tạo. Đá được nhập nguyên khối từ Nhật, do nghệ nhân Nhật sắp đặt.
- **Hồ cá chép đỏ và cầu gỗ:** cây cầu gỗ đỏ bắc qua hồ là góc chụp ảnh quen thuộc. Nhiều cặp đôi chọn cổng gỗ đỏ và cầu gỗ giữa hàng tùng La Hán để chụp ảnh cưới.
- **Vườn cây:** hơn 130 cây tùng La Hán, hoa anh đào dọc lối đi và quảng trường.
- **Rừng tre, vườn thiền, suối cảnh quan:** đoạn yên tĩnh nhất của vườn.
- **Khu trò chơi Ninja:** ném phi tiêu, leo núi giả, vườn mê cung. Một số hạng mục có thể đã thay đổi sau nhiều năm, nên đừng hứa trước với trẻ.

Khu đèn lồng với khoảng 5.000 chiếc đèn được giới thiệu nhiều trong giai đoạn 2019–2020. Hiện còn giữ bao nhiêu đèn thì chưa có thông tin mới, đừng coi đó là điểm chính của chuyến đi.

Khu đô thị còn một vườn Nhật nhỏ khoảng 1,1 ha trong phân khu The Sakura, dành cho cư dân phân khu đó. Đừng nhầm hai chỗ khi đặt điểm đến.

## Có mất vé không?

Đây là công viên nội khu của khu đô thị. Các bài viết về vườn không nhắc tới vé vào cửa. Vườn được xây làm tiện ích cho cư dân, nên khi vào hãy giữ trật tự, không giẫm lên thảm cỏ, không cho cá ăn đồ lạ. Chụp ảnh cưới, chụp ảnh thương mại có thể phải xin phép ban quản lý. Nhắn lễ tân F21 nếu cần hỏi trước.

## Nên đi lúc nào?

- **Sáng sớm hoặc chiều muộn:** ánh sáng dịu, chụp ảnh đẹp, đỡ nắng.
- **Ngày thường:** vắng hơn cuối tuần.
- **Mùa thu, mùa xuân:** thời tiết Hà Nội dễ chịu nhất để đi bộ ngoài trời.

## Đi từ F21 thế nào?

Vinhomes Smart City nằm phía Nam Đại lộ Thăng Long, cách F21 khoảng 10–15 phút.

- **Ô tô, taxi, xe công nghệ:** từ An Khánh ra Đại lộ Thăng Long, đi về hướng Tây Mỗ. Đặt điểm đến "Công viên Nhật Bản Vinhomes Smart City".
- **Xe máy:** đi đường gom Đại lộ Thăng Long, không chạy làn chính.
- **Gửi xe:** gửi ở Vincom Mega Mall Smart City rồi đi bộ sang là cách đơn giản nhất. Trong khu đô thị có quy định riêng về chỗ đỗ, đừng đỗ dưới lòng đường.

## Kết hợp với chỗ nào gần đó?

- Ăn uống, mua sắm ở [Vincom Mega Mall Smart City](/kham-pha/vincom-mega-mall-smart-city), tối xem phim ở [rạp AEON BETA](/kham-pha/rap-aeon-beta-vincom-smart-city).
- Buổi sáng xem [Bảo tàng Lịch sử Quân sự Việt Nam](/kham-pha/bao-tang-lich-su-quan-su-viet-nam) bên kia đại lộ, chiều sang vườn Nhật đi dạo.
- Muốn vận động thêm, có [Công viên thể thao Vinhomes Smart City](/kham-pha/cong-vien-the-thao-vinhomes-smart-city) trong cùng khu đô thị.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE slug = 'vuon-nhat-vinhomes-smart-city' AND (body IS NULL OR trim(body) = '');
INSERT INTO audit_logs (user_id, action, target, doc_id, title, updated_at, created_at) SELECT id, 'update', 'places', '', 'Giới thiệu chi tiết cho các địa điểm', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now') FROM users ORDER BY id LIMIT 1;
