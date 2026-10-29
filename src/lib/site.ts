// Toàn bộ thông tin khách sạn hiển thị trên website.
// Nguồn: Bảng giá phòng Khách sạn F21 (bản in của khách sạn).
// Các mục đánh dấu TODO chưa có trong bảng giá, cần khách sạn xác nhận trước khi lên mạng.

export const site = {
  name: "F21 Hotel",
  tagline: "Ở khu biệt thự, giá khách sạn",
  description:
    "F21 Hotel – khách sạn trong khu biệt thự Hoa Phượng, An Khánh, phía Tây Hà Nội. Yên tĩnh, cách Mỹ Đình khoảng 15–20 phút. Phòng qua đêm từ 600.000đ.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://f21hotel.com",

  phone: "0968740333",
  phoneDisplay: "0968 740 333",
  zalo: "0968740333", // TODO: xác nhận Zalo dùng chung số hotline
  // Đường dây nhận phản ánh dịch vụ
  feedbackPhone: "0383553034",
  feedbackPhoneDisplay: "0383 553 034",
  email: "datphong@f21hotel.com", // TODO

  address: {
    street: "BT13.1, Lô số 1, Khu biệt thự Hoa Phượng",
    locality: "An Khánh",
    region: "Hà Nội",
    country: "VN",
    full: "BT13.1, Lô số 1, Khu biệt thự Hoa Phượng, An Khánh, Hà Nội",
  },
  // Câu chỉ đường thống nhất trên mọi kênh
  directions: "Trong khu biệt thự Hoa Phượng, cạnh Vinschool, đi về phía cổng 1 Vinhomes Thăng Long.",
  mapQuery: "F21 HOTEL, Khu biệt thự Hoa Phượng, An Khánh, Hà Nội",

  replyHours: "7:00 – 23:00", // TODO: giờ lễ tân trực Zalo
  // Giờ nhận / trả phòng của hình thức nghỉ ngày đêm
  checkIn: "14:00",
  checkOut: "12:00",
  priceFrom: 600000, // giá qua đêm thấp nhất

  social: {
    facebook: "https://www.facebook.com/", // TODO
    tiktok: "https://www.tiktok.com/", // TODO
    googleMaps: "https://share.google/rhYW7A42TrmiG8YvI",
  },
} as const;

export const zaloLink = `https://zalo.me/${site.zalo}`;
export const telLink = `tel:${site.phone}`;

export const nav = [
  { href: "/phong", label: "Phòng & giá" },
  { href: "/uu-dai", label: "Ưu đãi" },
  { href: "/doan-doanh-nghiep", label: "Khách đoàn" },
  { href: "/vi-tri", label: "Vị trí" },
  { href: "/dat-phong", label: "Liên hệ" },
] as const;

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

export type Room = {
  slug: string;
  name: string;
  short: string;
  description: string;
  roomNumbers: string[];
  guests: number;
  prices: Record<StayModeKey, number> & { extraHour: number };
  amenities: string[];
};

// TODO: xác nhận tiện nghi trong phòng (điều hoà, wifi, TV, ban công…)
const baseAmenities = ["Điều hoà", "Wifi miễn phí", "Nước nóng", "2 chai nước suối miễn phí"];

export const rooms: Room[] = [
  {
    slug: "don",
    name: "Phòng Đơn",
    short: "Phòng cho một hoặc hai người, đủ cho chuyến công tác hay một đêm đi xem sự kiện ở Mỹ Đình.",
    description:
      "Hạng phòng nhiều nhất của F21, có ở tất cả các tầng. Lựa chọn hợp lý khi bạn cần một chỗ nghỉ sạch sẽ, yên tĩnh ở phía Tây Hà Nội.",
    roomNumbers: ["103", "104", "204", "205", "304", "305", "404", "405"],
    guests: 2,
    prices: { hourly: 300000, overnight: 600000, fullDay: 900000, extraHour: 50000 },
    amenities: baseAmenities,
  },
  {
    slug: "don-vip",
    name: "Phòng Đơn VIP",
    short: "Phòng đơn hạng cao hơn cho hai người muốn thêm chút thoải mái.",
    description:
      "Mỗi tầng có một phòng Đơn VIP. Phù hợp cho cặp đôi nghỉ cuối tuần hoặc khách công tác muốn không gian rộng rãi hơn.",
    roomNumbers: ["101", "201", "301", "401"],
    guests: 2,
    prices: { hourly: 350000, overnight: 700000, fullDay: 1000000, extraHour: 50000 },
    amenities: baseAmenities,
  },
  {
    slug: "doi",
    name: "Phòng Đôi",
    short: "Phòng cho ba người: bạn bè đi chung, đồng nghiệp công tác, bố mẹ đi cùng một con.",
    description:
      "Đủ chỗ cho ba khách. Hạng phòng hợp với nhóm nhỏ đi xem concert, đi công tác hoặc gia đình ba người.",
    roomNumbers: ["202", "302", "402"],
    guests: 3,
    prices: { hourly: 400000, overnight: 750000, fullDay: 1100000, extraHour: 70000 },
    amenities: baseAmenities,
  },
  {
    slug: "doi-4",
    name: "Phòng Đôi 4 người",
    short: "Phòng lớn nhất cho gia đình hoặc nhóm bốn người.",
    description:
      "Đủ chỗ cho ông bà, bố mẹ và các cháu từ quê lên dự cưới, hay nhóm bạn đi xem sự kiện ở Mỹ Đình.",
    roomNumbers: ["102", "203", "303", "403"],
    guests: 4,
    prices: { hourly: 450000, overnight: 800000, fullDay: 1200000, extraHour: 100000 },
    amenities: baseAmenities,
  },
];

// Ghi chú trên bảng giá
export const priceNotes = {
  extraPerson: 100000,
  deposit: "Đặt cọc tối thiểu 50% giá trị tiền phòng.",
  refund: "Khách đặt trước không được hoàn tiền khi thay đổi.",
  water: "Giá phòng đã gồm 2 chai nước suối miễn phí.",
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
      "Phòng cho 2, 3 hoặc 4 người, qua đêm từ 600.000đ",
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
    title: "Khách quê lên ăn cưới, để F21 lo chỗ ngủ",
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
    details: ["Phòng Đơn VIP qua đêm từ 700.000đ", "Trang trí Noel nhỏ trong phòng"], // TODO: khách sạn duyệt ưu đãi
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
  { place: "Trung tâm Hội nghị Quốc gia", time: "~15 phút" },
  { place: "Sân vận động Mỹ Đình", time: "15–20 phút" },
  { place: "Phố cổ Hoàn Kiếm", time: "~35 phút" },
]; // TODO: đo lại thời gian thực tế trên Google Maps

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
