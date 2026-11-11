// Toàn bộ thông tin khách sạn hiển thị trên website.
// Nguồn: Bảng giá phòng Khách sạn F21 (bản in của khách sạn).
// Các mục đánh dấu TODO chưa có trong bảng giá, cần khách sạn xác nhận trước khi lên mạng.

export const site = {
  name: "F21 Hotel",
  tagline: "Ở khu biệt thự, giá khách sạn",
  description:
    "F21 Hotel – khách sạn trong khu biệt thự Hoa Phượng, An Khánh, phía Tây Hà Nội. Yên tĩnh, cách Mỹ Đình khoảng 15–20 phút. Phòng qua đêm từ 500.000đ.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://f21hotel.com.vn",

  phone: "0968740333",
  phoneDisplay: "0968 740 333",
  zalo: "0968740333", // TODO: xác nhận Zalo dùng chung số hotline
  // Đường dây nhận phản ánh dịch vụ
  feedbackPhone: "0383553034",
  feedbackPhoneDisplay: "0383 553 034",
  // Để trống thì website tự ẩn mục tương ứng. TODO: điền khi khách sạn cung cấp
  email: "" as string,
  // Video 30 giây quay đường vào (đường dẫn file trong /public hoặc YouTube embed)
  entranceVideo: "" as string,

  address: {
    street: "BT13.1, Lô số 1, Khu biệt thự Hoa Phượng",
    locality: "An Khánh",
    region: "Hà Nội",
    country: "VN",
    full: "BT13.1, Lô số 1, Khu biệt thự Hoa Phượng, An Khánh, Hà Nội",
  },
  // Câu chỉ đường thống nhất trên mọi kênh
  directions: "Trong khu biệt thự Hoa Phượng, An Khánh: khoảng 5 phút tới Thiên đường Bảo Sơn, 15–20 phút tới SVĐ Mỹ Đình.",
  mapQuery: "F21 HOTEL, Khu biệt thự Hoa Phượng, An Khánh, Hà Nội",

  replyHours: "7:00 – 23:00", // TODO: giờ lễ tân trực Zalo
  // Giờ nhận / trả phòng của hình thức nghỉ ngày đêm
  checkIn: "14:00",
  checkOut: "12:00",
  priceFrom: 500000, // giá qua đêm thấp nhất

  social: {
    facebook: "" as string, // TODO
    tiktok: "" as string, // TODO
    googleMaps: "https://share.google/rhYW7A42TrmiG8YvI",
  },
} as const;

// Đánh giá thật của khách (chép từ Google Maps, Agoda… và ghi rõ nguồn).
// Khối "Khách nói gì" trên trang chủ chỉ hiện khi danh sách này có nội dung.
export type Review = { name: string; text: string; rating: number; source: string; date: string };
export const reviews: Review[] = [
  // Ví dụ định dạng (không phải đánh giá thật):
  // { name: "Nguyễn A.", text: "Phòng sạch, yên tĩnh…", rating: 5, source: "Google Maps", date: "10/2026" },
];

// Thông tin liên hệ truyền từ layout (đọc từ CMS) xuống các component chạy ở trình duyệt
export type Contact = { name: string; phoneDisplay: string; telLink: string; zaloLink: string };

export const zaloLink = `https://zalo.me/${site.zalo}`;
export const telLink = `tel:${site.phone}`;

export const nav = [
  { href: "/phong", label: "Phòng & giá" },
  { href: "/uu-dai", label: "Ưu đãi" },
  { href: "/doan-doanh-nghiep", label: "Khách đoàn" },
  { href: "/vi-tri", label: "Vị trí" },
  { href: "/dat-phong", label: "Liên hệ" },
] as const;

// Menu trên thanh header (5 mục, logo bên trái); các trang còn lại nằm ở footer qua `nav`.
export const headerNav = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/phong", label: "Phòng nghỉ" },
  { href: "/tien-ich", label: "Tiện ích" },
  { href: "/bai-viet", label: "Cẩm nang" },
] as const;

// Link Google Maps theo tên + địa chỉ (CMS: "Từ khoá bản đồ", cũng là ghim của bản đồ nhúng).
// Không dùng link share.google trong CMS cho việc chỉ đường: link đó mở trang tìm kiếm Google, không mở Maps.
// directionsUrl mở thẳng chỉ đường từ vị trí của khách (trên điện thoại mở ứng dụng Google Maps).
export const mapsUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
export const directionsUrl = (query: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

export function formatVnd(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

// Ba hình thức nghỉ theo bảng giá
export const stayModes = [
  { key: "fullDay", label: "Nghỉ ngày đêm", time: "Nhận phòng 14:00, trả phòng trước 12:00 hôm sau" },
  { key: "overnight", label: "Nghỉ qua đêm", time: "Nhận phòng sau 19:00, trả phòng trước 10:00 hôm sau" },
  { key: "hourly", label: "Nghỉ giờ", time: "Giá 2 giờ đầu. Nhận phòng sau 6:00, trả chậm nhất trước 24:00" },
] as const;

export type StayModeKey = (typeof stayModes)[number]["key"];

// w, h: kích thước thật của file ảnh, để hiển thị đúng tỉ lệ
export type Photo = { src: string; alt: string; w: number; h: number };

// Chủ đề của Bài viết (CMS › Bài viết, trang /bai-viet)
export const POST_TOPICS = [
  { value: "su-kien", label: "Sự kiện Mỹ Đình" },
  { value: "diem-den", label: "Điểm đến quanh F21" },
  { value: "huong-dan", label: "Hướng dẫn lưu trú" },
  { value: "doan", label: "Khách đoàn, công tác" },
];
export const postTopicLabel = (v: string) => POST_TOPICS.find((t) => t.value === v)?.label ?? "";

// Nhóm của Tiện ích xung quanh (CMS › Tiện ích xung quanh, trang Vị trí, khối "Tiện ích F21")
export const PLACE_CATEGORIES = [
  { value: "vui-choi", label: "Vui chơi, giải trí", title: "Vui chơi, giải trí quanh F21" },
  { value: "an-uong", label: "Ăn uống", title: "Ăn uống quanh F21" },
  { value: "the-thao", label: "Thể thao", title: "Thể thao quanh F21" },
  { value: "dich-vu", label: "Mua sắm, dịch vụ", title: "Mua sắm, dịch vụ tiện ích" },
];

// href: Google Maps (chỉ đường); embed: từ khoá hoặc "vĩ độ,kinh độ" cho bản đồ nhúng ở trang chi tiết
export type Place = {
  slug: string;
  name: string;
  category: string;
  time: string;
  note: string;
  address: string;
  body: string;
  href: string;
  embed: string;
  // Ảnh đầu tiên (ô trong lưới ảnh, ảnh chia sẻ) và cả album cho trang chi tiết
  photo: Photo | null;
  photos: Photo[];
  // Ảnh giấy phép mở: "tác giả, giấy phép" và link trang gốc; ảnh tự chụp thì trống
  credit: string;
  creditUrl: string;
};

export const placeCategory = (v: string) => PLACE_CATEGORIES.find((c) => c.value === v);
// Trang chi tiết chỉ cho Google lập chỉ mục khi có giới thiệu đủ dài; vài dòng mô tả thì là trang mỏng
export const placeIndexable = (p: Place) => p.body.trim().length >= 300;

export type Room = {
  slug: string;
  name: string;
  short: string;
  description: string;
  roomNumbers: string[];
  guests: number;
  prices: Record<StayModeKey, number> & { extraHour: number };
  amenities: string[];
  photos: Photo[];
  // Thông số để khách so sánh với OTA; để trống trong CMS thì website ẩn
  area?: number;
  bed?: string;
  view?: string;
};

// TODO: xác nhận tiện nghi trong phòng (điều hoà, wifi, TV, ban công…)
const baseAmenities = ["Điều hoà", "Wifi miễn phí", "Nước nóng", "2 chai nước suối miễn phí"];

export const rooms: Room[] = [
  {
    slug: "don",
    name: "Phòng Đơn",
    short: "Phòng cho một hoặc hai người, đủ cho chuyến công tác hay một đêm đi xem sự kiện ở Mỹ Đình.",
    description:
      "Mỗi tầng có một phòng Đơn ở trục 4. Lựa chọn hợp lý khi bạn cần một chỗ nghỉ sạch sẽ, yên tĩnh ở phía Tây Hà Nội.",
    roomNumbers: ["103", "204", "304", "404"],
    guests: 2,
    prices: { hourly: 250000, overnight: 500000, fullDay: 700000, extraHour: 50000 },
    amenities: baseAmenities,
    photos: [
      { src: "/img/anh/don-1.webp", alt: "Phòng Đơn với giường đôi và vách kính phòng tắm", w: 1600, h: 1067 },
      { src: "/img/anh/don-2.webp", alt: "Phòng Đơn nhìn từ cửa, có TV và bàn làm việc", w: 1600, h: 1067 },
      { src: "/img/anh/phong-tam-sen.webp", alt: "Phòng tắm vòi sen vách kính", w: 1600, h: 1067 },
    ],
  },
  {
    slug: "don-vip",
    name: "Phòng Đơn VIP",
    short: "Phòng đơn hạng cao hơn cho hai người muốn thêm chút thoải mái.",
    description:
      "Hạng phòng nhiều nhất của F21, nằm ở trục 1 và trục 5 của các tầng. Phù hợp cho cặp đôi nghỉ cuối tuần hoặc khách công tác muốn không gian rộng rãi hơn.",
    roomNumbers: ["101", "104", "201", "205", "301", "305", "401", "405"],
    guests: 2,
    prices: { hourly: 300000, overnight: 600000, fullDay: 800000, extraHour: 50000 },
    amenities: baseAmenities,
    photos: [
      { src: "/img/anh/don-vip-1.webp", alt: "Phòng Đơn VIP với bồn tắm sau vách kính", w: 1536, h: 1024 },
      { src: "/img/anh/don-vip-2.webp", alt: "Giường Phòng Đơn VIP cạnh bồn tắm", w: 1536, h: 1024 },
      { src: "/img/anh/phong-tam-bon.webp", alt: "Phòng tắm có bồn tắm", w: 1600, h: 1067 },
    ],
  },
  {
    slug: "doi",
    name: "Phòng Đôi",
    short: "Phòng cho ba người: bạn bè đi chung, đồng nghiệp công tác, bố mẹ đi cùng một con.",
    description:
      "Đủ chỗ cho ba khách. Hạng phòng hợp với nhóm nhỏ đi xem concert, đi công tác hoặc gia đình ba người.",
    roomNumbers: ["202", "302", "402"],
    guests: 3,
    prices: { hourly: 350000, overnight: 700000, fullDay: 900000, extraHour: 70000 },
    amenities: baseAmenities,
    photos: [
      { src: "/img/anh/doi-1.webp", alt: "Phòng Đôi hai giường", w: 1600, h: 1067 },
      { src: "/img/anh/doi-2.webp", alt: "Phòng Đôi nhìn từ góc khác", w: 1600, h: 1067 },
      { src: "/img/anh/doi-3.webp", alt: "Phòng Đôi có ghế bành và TV", w: 1600, h: 1067 },
    ],
  },
  {
    slug: "doi-4",
    name: "Phòng Đôi 4 người",
    short: "Phòng lớn nhất cho gia đình hoặc nhóm bốn người.",
    description:
      "Đủ chỗ cho ông bà, bố mẹ và các cháu từ quê lên dự cưới, hay nhóm bạn đi xem sự kiện ở Mỹ Đình.",
    roomNumbers: ["102", "203", "303", "403"],
    guests: 4,
    prices: { hourly: 400000, overnight: 800000, fullDay: 1000000, extraHour: 70000 },
    amenities: baseAmenities,
    photos: [
      { src: "/img/anh/doi-4-1.webp", alt: "Phòng Đôi 4 người với hai giường lớn", w: 1600, h: 1067 },
      { src: "/img/anh/doi-4-2.webp", alt: "Phòng Đôi 4 người cạnh cửa sổ vòm", w: 1600, h: 1067 },
      { src: "/img/anh/doi-4-3.webp", alt: "Phòng Đôi 4 người có phòng tắm vách kính", w: 1600, h: 1067 },
    ],
  },
];

// Các slide của hero trang chủ: mỗi slide có ảnh (2200px cho máy tính, 1200px cho điện thoại) và nội dung riêng
export type HeroSlide = {
  src: string;
  srcMobile: string;
  alt: string;
  kicker: string;
  bold: string;
  light: string;
  sub: string;
  cost: { value: string; label: string; href: string };
  book: { label: string; href: string };
};

export const heroSlides: HeroSlide[] = [
  {
    src: "/img/anh/mat-tien-ngay.webp",
    srcMobile: "/img/anh/mat-tien-ngay-1200.webp",
    alt: "Mặt tiền F21 Hotel ở góc đường khu biệt thự Hoa Phượng",
    kicker: "Khu biệt thự Hoa Phượng · An Khánh",
    bold: "F21 Hotel",
    light: "ở khu biệt thự",
    sub: "Giá bình dân, cách Sân vận động Mỹ Đình 15–20 phút",
    cost: { value: formatVnd(250000), label: `Theo giờ từ · qua đêm từ ${formatVnd(500000)}`, href: "/phong" },
    book: { label: "Đặt phòng", href: "/dat-phong" },
  },
  {
    src: "/img/anh/hero-cua-vom.webp",
    srcMobile: "/img/anh/hero-cua-vom-1200.webp",
    alt: "Góc ghế bên cửa sổ vòm trong phòng",
    kicker: "19 phòng · 4 hạng phòng",
    bold: "Phòng nghỉ",
    light: "sáng & yên tĩnh",
    sub: "Cửa sổ vòm, rèm voan, sàn gỗ. Phòng cho 2, 3 hoặc 4 người",
    cost: { value: formatVnd(700000), label: "Ngày đêm từ · 14:00 – 12:00", href: "/phong" },
    book: { label: "Xem phòng", href: "/phong" },
  },
  {
    src: "/img/anh/hero-ban-cong.webp",
    srcMobile: "/img/anh/hero-ban-cong-1200.webp",
    alt: "Phòng có cửa ra ban công",
    kicker: "Ưu đãi ở dài ngày",
    bold: "Giảm 15%",
    light: "khi ở dài ngày",
    sub: "Trên 7 ngày giảm 5%, trên 15 ngày giảm 10%, trên 30 ngày giảm 15%",
    cost: { value: "−15%", label: "Ở trên 30 ngày", href: "/uu-dai#o-dai-ngay" },
    book: { label: "Hỏi giá đoàn", href: "/doan-doanh-nghiep" },
  },
  {
    src: "/img/anh/hero-phong-doi.webp",
    srcMobile: "/img/anh/hero-phong-doi-1200.webp",
    alt: "Phòng hai giường cạnh cửa sổ vòm",
    kicker: "Sự kiện Mỹ Đình · 7–8/11/2026",
    bold: "Đi xem 10Fest",
    light: "nghỉ ở F21",
    sub: "Cách sân 15–20 phút, giá vẫn như ngày thường. Phòng 2–4 người",
    cost: { value: "10FEST", label: "Mã ưu đãi khi đặt phòng", href: "/uu-dai#su-kien-my-dinh" },
    book: { label: "Dùng ưu đãi", href: "/dat-phong?code=10FEST" },
  },
];

// Ảnh không gian chung cho thư viện ảnh trang chủ
export const gallery: Photo[] = [
  { src: "/img/anh/sanh-le-tan.webp", alt: "Sảnh lễ tân F21 Hotel lát đá cẩm thạch", w: 1050, h: 1400 },
  { src: "/img/anh/goc-cua-vom.webp", alt: "Góc ghế cạnh cửa sổ vòm trong phòng", w: 1600, h: 1067 },
  { src: "/img/anh/chi-tiet-ban.webp", alt: "Hoa hồng trên bàn làm việc trong phòng", w: 800, h: 1200 },
  { src: "/img/anh/phong-ban-cong.webp", alt: "Phòng có cửa ra ban công", w: 1600, h: 1067 },
  { src: "/img/anh/sanh-sofa.webp", alt: "Sofa chờ ở sảnh với biển F21 Hotel", w: 1448, h: 1086 },
  { src: "/img/anh/goc-ghe-ban-cong.webp", alt: "Hai ghế bành bên cửa ban công", w: 1600, h: 1067 },
  { src: "/img/anh/hanh-lang.webp", alt: "Hành lang tầng phòng", w: 1400, h: 934 },
  { src: "/img/anh/phong-ghe-co-dien.webp", alt: "Phòng có bộ ghế cổ điển", w: 1600, h: 1067 },
  { src: "/img/anh/phong-cua-so.webp", alt: "Phòng có cửa sổ lớn nhìn ra hàng cây", w: 1600, h: 1067 },
  { src: "/img/anh/phong-kinh-tam.webp", alt: "Phòng có vách kính phòng tắm", w: 1600, h: 1067 },
];

// Album mặt tiền, mở khi bấm ảnh khung vòm ở phần giới thiệu trang chủ
export const facadePhotos: Photo[] = [
  { src: "/img/anh/mat-tien-dem.webp", alt: "Toà nhà F21 Hotel kiến trúc tân cổ điển lên đèn buổi tối", w: 896, h: 1195 },
  { src: "/img/anh/mat-tien-ngay.webp", alt: "Mặt tiền F21 Hotel ở góc đường khu biệt thự Hoa Phượng", w: 2200, h: 1650 },
  { src: "/img/anh/mat-tien-xa.webp", alt: "F21 Hotel nhìn từ đầu đường nội khu", w: 1050, h: 1400 },
  { src: "/img/anh/duong-vao.webp", alt: "Góc đường trước F21 Hotel trong khu biệt thự Hoa Phượng", w: 967, h: 1400 },
];

// Ảnh đường vào và mặt tiền cho trang Vị trí
export const locationPhotos: Photo[] = [
  { src: "/img/anh/duong-vao.webp", alt: "Góc đường trước F21 Hotel trong khu biệt thự Hoa Phượng", w: 967, h: 1400 },
  { src: "/img/anh/mat-tien-xa.webp", alt: "F21 Hotel nhìn từ đầu đường nội khu", w: 1050, h: 1400 },
  { src: "/img/anh/mat-tien-dem.webp", alt: "Mặt tiền F21 Hotel lên đèn buổi tối", w: 896, h: 1195 },
];

// Ghi chú trên bảng giá
export const priceNotes = {
  extraPerson: 100000,
  deposit: "Đặt cọc tối thiểu 50% giá trị tiền phòng.",
  refund: "Khách đặt trước không được hoàn tiền khi thay đổi.",
  water: "Giá phòng đã gồm 2 chai nước suối miễn phí.",
  // Giá đã gồm hay chưa gồm VAT (CMS › Thông tin khách sạn). Trống thì website không ghi
  vat: "" as string,
  longStay: [
    { label: "Ở trên 7 ngày liên tiếp, lấy trên 7 phòng", discount: "Giảm 5% tổng thanh toán" },
    { label: "Ở trên 15 ngày liên tiếp, lấy trên 15 phòng", discount: "Giảm 10% tổng thanh toán" },
    { label: "Ở trên 30 ngày", discount: "Giảm 15% tổng thanh toán" },
  ],
};

export type Offer = {
  slug: string;
  tag: string;
  title: string;
  summary: string;
  when: string;
  code?: string;
  details: string[];
  featured?: boolean;
  // Có giá trị thì đặt online bằng mã này được trừ % vào tổng tiền
  discountPercent?: number;
};

export const offers: Offer[] = [
  {
    slug: "su-kien-my-dinh",
    tag: "Sự kiện Mỹ Đình",
    title: "Đi xem 10Fest, nghỉ ở F21",
    summary: "Khách sạn sát sân thường tăng giá ngày diễn. F21 cách sân khoảng 15–20 phút, giá vẫn như bảng giá ngày thường.",
    when: "7–8/11/2026",
    code: "10FEST",
    details: [
      "Trả phòng muộn tới 14:00 khi nhắn mã 10FEST qua Zalo hoặc form đặt phòng", // TODO: khách sạn duyệt ưu đãi
      "Phòng cho 2, 3 hoặc 4 người, qua đêm từ 500.000đ",
      "Áp dụng cho các đêm 6, 7 và 8/11/2026, tuỳ phòng trống",
    ],
    featured: true,
  },
  {
    slug: "o-dai-ngay",
    tag: "Ở dài ngày",
    title: "Ở càng lâu, giảm càng nhiều",
    summary: "Cho đội công tác, thi công, người ở lại Hà Nội làm việc dài ngày ở phía Tây.",
    when: "Áp dụng quanh năm",
    details: priceNotes.longStay.map((d) => `${d.label}: ${d.discount.toLowerCase()}`),
  },
  {
    slug: "mua-cuoi",
    tag: "Mùa cưới",
    title: "Khách đi ăn cưới, để F21 lo chỗ ngủ",
    summary: "Ngay trong khu biệt thự Hoa Phượng, sáng sang nhà người thân ở Vinhomes Thăng Long, Nam An Khánh chỉ vài phút.",
    when: "Đến hết 31/1/2027",
    details: [
      "Giữ nhiều phòng theo ngày cưới cho cả họ hàng",
      "Phòng Đôi 4 người cho gia đình có người cao tuổi, trẻ nhỏ",
      `Thêm người so với quy định: phụ thu ${formatVnd(priceNotes.extraPerson)}/người`,
    ],
  },
  {
    slug: "noel",
    tag: "Giáng sinh",
    title: "Đêm Noel cho cặp đôi",
    summary: "Phòng Đơn VIP cho hai người, nghỉ yên tĩnh trong khu biệt thự sau một tối đi chơi phố.",
    when: "24–25/12/2026",
    code: "NOEL",
    details: ["Phòng Đơn VIP qua đêm từ 600.000đ", "Trang trí Noel nhỏ trong phòng"], // TODO: khách sạn duyệt ưu đãi
  },
  {
    slug: "tat-nien",
    tag: "Cuối năm",
    title: "Khối phòng tất niên",
    summary: "Giữ khối phòng cho nhân viên ở tỉnh về dự tiệc tất niên công ty ở phía Tây Hà Nội.",
    when: "Tháng 12/2026 – tháng 1/2027",
    details: ["Giữ từ 5 phòng trở lên", "Một đầu mối liên hệ cho cả đoàn", "Nhận phòng sớm khi còn phòng trống"],
  },
];

// Đề xuất trong phương án truyền thông. TODO: khách sạn duyệt trước khi lên mạng
export const directPerks = [
  {
    title: "Trả phòng muộn tới 14:00",
    text: "Ngủ thêm sau đêm concert hay tiệc cưới, không phụ thu, khi còn phòng trống.",
  },
  {
    title: "Nước chào mừng",
    text: "Tặng kèm cho mọi đặt phòng qua điện thoại, Zalo hoặc website.",
  },
  {
    title: "Giảm 10% từ lần thứ hai",
    text: "Dành cho khách cũ trong danh sách Zalo của F21.",
  },
];

export const distances = [
  { place: "Vinschool, cổng 1 Vinhomes Thăng Long", time: "1–2 phút" },
  { place: "Đại lộ Thăng Long", time: "~5 phút" },
  { place: "Thiên đường Bảo Sơn", time: "~5 phút" },
  { place: "Trung tâm Hội nghị Quốc gia", time: "~15 phút" },
  { place: "Sân vận động Mỹ Đình", time: "15–20 phút" },
  { place: "Phố cổ Hoàn Kiếm", time: "~35 phút" },
]; // Thiên đường Bảo Sơn ~5 phút: khách sạn đã xác nhận (02/11/2026). TODO: đo lại các mốc còn lại trên Google Maps

// Tiện ích quanh khách sạn, hiện ở trang Vị trí
// TODO: điền tên quán, phòng gym cụ thể sau khi khảo sát thực tế.
// Sân pickleball lấy theo danh bạ sân (pickleballplus.vn, thegioithethao.vn), khách sạn xác nhận lại giờ mở cửa
export const nearby = [
  {
    title: "Ăn uống",
    items: ["Quán ăn sáng, phở, bún trong khu Nam An Khánh", "Nhà hàng gia đình dọc Lê Trọng Tấn kéo dài", "Lễ tân gửi danh sách quán qua Zalo"],
  },
  {
    title: "Cà phê & tiện lợi",
    items: ["Cà phê trong khu đô thị Vinhomes Thăng Long", "Cửa hàng tiện lợi mở muộn", "Hiệu thuốc, ATM gần cổng khu"],
  },
  {
    title: "Thể thao & vui chơi",
    items: [
      "Thiên đường Bảo Sơn: khu vui chơi, giải trí cho gia đình và trẻ nhỏ",
      "Sân pickleball The ClubHouse ngay trong khu biệt thự Hoa Phượng, có sân mái che",
      "Sân pickleball trong Thiên đường Bảo Sơn",
      "Phòng gym cho khách ở dài ngày",
    ],
  },
  {
    title: "Đi tiếp",
    items: ["Sân vận động Mỹ Đình, Trung tâm Hội nghị Quốc gia", "Hoà Lạc, Ba Vì, Hoà Bình qua Đại lộ Thăng Long", "Taxi, xe công nghệ đón tận cửa"],
  },
];

export const faqs = [
  {
    q: "Giá phòng tính theo những hình thức nào?",
    a: "Có ba hình thức: nghỉ ngày đêm (nhận phòng 14:00, trả trước 12:00 hôm sau), nghỉ qua đêm (nhận sau 19:00, trả trước 10:00 hôm sau) và nghỉ giờ (tính 2 giờ đầu, mỗi giờ thêm tính phụ trội). Xem bảng giá đầy đủ ở trang Phòng & giá.",
  },
  {
    q: "Đặt phòng trước có cần đặt cọc không?",
    a: `Có. ${priceNotes.deposit} ${priceNotes.refund}`,
  },
  {
    q: "Đi thêm người thì tính thế nào?",
    a: `Mỗi hạng phòng có số người ở quy định (2, 3 hoặc 4 người). Thêm người so với quy định phụ thu ${formatVnd(priceNotes.extraPerson)}/người.`,
  },
  {
    q: "Ở dài ngày có được giảm giá không?",
    a: "Có. Ở trên 7 ngày liên tiếp hoặc lấy trên 7 phòng giảm 5%, trên 15 ngày hoặc trên 15 phòng giảm 10%, ở trên 30 ngày giảm 15% tổng thanh toán.",
  },
  {
    q: "Từ F21 đi Sân vận động Mỹ Đình mất bao lâu?",
    a: "Khoảng 15–20 phút đi ô tô hoặc xe máy theo đường Lê Trọng Tấn kéo dài. Ngày có sự kiện lớn, bạn nên đi sớm hơn 30 phút.",
  },
  {
    q: "Tìm đường vào khách sạn thế nào?",
    a: "Đi vào khu biệt thự Hoa Phượng, đi theo hướng cổng 1 Vinhomes Thăng Long, khách sạn ở cạnh Vinschool. Lễ tân sẽ gửi ghim vị trí qua Zalo khi bạn đặt phòng.",
  },
  {
    q: "Khách sạn có chỗ đỗ ô tô không?",
    a: "Đường trong khu biệt thự Hoa Phượng rộng, khách đỗ ô tô và xe máy ngay trước khách sạn. Đoàn đi nhiều xe vui lòng báo trước để lễ tân sắp chỗ.", // TODO
  },
];
