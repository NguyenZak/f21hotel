// Bố cục trang chủ mặc định: dùng khi CMS chưa có trang "home", để seed vào CMS,
// và làm giá trị mặc định khi kéo khối mới vào trình dựng.
import type { Data } from "@puckeditor/core";
import { directPerks, distances, facadePhotos, gallery, heroSlides, site } from "@/lib/site";
import type * as B from "./render";

const photo = (p: { src: string; alt: string; w: number; h: number }) => ({ photo: p });

export const heroDefaults: B.HeroProps = {
  heading: `${site.name}: khách sạn trong khu biệt thự Hoa Phượng, An Khánh, Hà Nội, gần Mỹ Đình`,
  slides: heroSlides.map((s) => ({
    photo: { src: s.src, alt: s.alt, w: 2200, h: 1467 },
    photoMobile: { src: s.srcMobile, alt: s.alt, w: 1200, h: 800 },
    kicker: s.kicker,
    bold: s.bold,
    light: s.light,
    sub: s.sub,
    costValue: s.cost.value,
    costLabel: s.cost.label,
    costHref: s.cost.href,
    bookLabel: s.book.label,
    bookHref: s.book.href,
  })),
  search: true,
  tabs: [
    { label: "Vị trí", href: "#vi-tri" },
    { label: "Phòng & giá", href: "#phong" },
    { label: "Tổng quan", href: "#tong-quan" },
    { label: "Ưu đãi", href: "#uu-dai" },
  ],
};

export const introDefaults: B.IntroProps = {
  anchor: "tong-quan",
  // Ảnh mặt tiền: bản đồ 3D đã có ở khối Vị trí ngay sau Phòng
  media: "photo",
  background: "",
  photos: facadePhotos.map(photo),
  badgeValue: "15–20′",
  badgeLabel: "tới SVĐ Mỹ Đình",
  eyebrow: "Về F21 Hotel",
  title: "Một chỗ nghỉ yên tĩnh ở phía Tây Hà Nội",
  lead: "F21 nằm trong khu biệt thự Hoa Phượng, cạnh Vinschool, trên đường vào cổng 1 Vinhomes Thăng Long.",
  text: "Toà nhà kiến trúc tân cổ điển với cửa vòm và ban công sắt, giữa những con đường rộng nhiều cây xanh. Bạn có sự yên tĩnh mà khách sạn sát Mỹ Đình hiếm có, với mức giá của một khách sạn bình dân.",
  points: [
    { icon: "tree", title: "Yên tĩnh, nhiều cây", text: "Đường nội khu rộng, ít xe qua lại, ngủ ngon cả sau đêm concert." },
    { icon: "car", title: "Dễ đỗ ô tô", text: "Đỗ xe ngay trước khách sạn, tiện cho gia đình và đoàn đi xe riêng." },
    { icon: "clock", title: "Gần Đại lộ Thăng Long", text: "Đi Mỹ Đình, Hoà Lạc, Ba Vì, Hoà Bình hay vào nội thành đều thuận đường." },
  ],
  linkLabel: "Xem đánh giá thật trên Google Maps",
  linkHref: "",
};

export const roomsDefaults: B.RoomsProps = {
  anchor: "phong",
  background: "cream",
  eyebrow: "Phòng & giá",
  title: "Chọn phòng theo chuyến đi của bạn",
  intro:
    "Từ phòng đơn cho chuyến công tác tới phòng 4 người cho cả nhà lên dự cưới. Nghỉ ngày đêm, qua đêm hoặc nghỉ giờ.",
  buttonLabel: "Xem bảng giá đầy đủ",
};

export const perksDefaults: B.PerksProps = {
  anchor: "",
  background: "dark on-dark",
  eyebrow: "Đặt trực tiếp với F21",
  title: "Cùng một giá, thêm ba quyền lợi",
  intro: "Giá trên website bằng giá niêm yết. Đặt qua điện thoại, Zalo hoặc website, bạn nhận thêm:",
  items: directPerks.map((p) => ({ ...p })),
  foot: "Lễ tân trả lời Zalo trong vòng 15 phút, từ {gio}.",
  buttonLabel: "Xem phòng trống & đặt ngay",
  buttonHref: "/dat-phong",
};

export const galleryDefaults: B.GalleryProps = {
  anchor: "",
  background: "cream",
  eyebrow: "Không gian",
  title: "Bên trong F21 Hotel",
  intro: "Sảnh lát đá cẩm thạch, phòng sàn gỗ, cửa sổ vòm nhìn ra hàng cây khu biệt thự.",
  photos: gallery.map(photo),
};

export const guestsDefaults: B.GuestsProps = {
  anchor: "",
  background: "",
  eyebrow: "F21 dành cho ai",
  title: "Khi bạn cần ở phía Tây Hà Nội",
  intro: "",
  center: true,
  items: [
    {
      icon: "rings",
      title: "Người thân dự cưới",
      text: "Họ hàng từ quê lên dự cưới, giỗ, tân gia của gia đình ở Vinhomes Thăng Long, Nam An Khánh.",
      quote: "Nhà chật, khách quê lên ăn cưới cứ để F21 lo chỗ ngủ.",
    },
    {
      icon: "ticket",
      title: "Đi sự kiện Mỹ Đình",
      text: "Xem concert, bóng đá, esports, hội chợ ở Sân vận động Mỹ Đình và Trung tâm Hội nghị Quốc gia.",
      quote: "Khách sạn sát sân tăng giá ngày diễn. F21 vẫn giá như ngày thường.",
    },
    {
      icon: "briefcase",
      title: "Công tác dài ngày",
      text: "Nhân viên, kỹ sư, đội thi công làm việc dọc Đại lộ Thăng Long, Mỹ Đình, Lê Trọng Tấn.",
      quote: "Ở trên 30 ngày giảm 15% tổng thanh toán.",
    },
    {
      icon: "heart",
      title: "Nghỉ cuối tuần",
      text: "Cặp đôi, gia đình nội thành muốn đổi gió, hoặc dừng chân trước khi đi Ba Vì, Hoà Bình.",
      quote: "Staycation trong khu biệt thự, không cần đi xa.",
    },
  ],
};

export const locationDefaults: B.LocationProps = {
  anchor: "vi-tri",
  background: "",
  eyebrow: "Vị trí",
  title: "Gần Thiên đường Bảo Sơn và SVĐ Mỹ Đình",
  distances: distances.map((d) => ({ ...d })),
  linkLabel: "Xem chỉ đường chi tiết",
  linkHref: "/vi-tri",
  map: "3d",
};

export const offersDefaults: B.OffersProps = {
  anchor: "uu-dai",
  background: "cream",
  eyebrow: "Ưu đãi",
  title: "Ưu đãi theo dịp",
  intro: "Nói mã ưu đãi khi nhắn Zalo, hoặc nhập vào form đặt phòng.",
  limit: 3,
};

export const reviewsDefaults: B.ReviewsProps = {
  anchor: "danh-gia",
  background: "cream",
  eyebrow: "Khách nói gì",
  title: "Đánh giá từ khách đã ở",
  intro: "",
  center: true,
  buttonLabel: "Xem tất cả đánh giá trên Google Maps",
};

export const faqDefaults: B.FaqProps = {
  anchor: "hoi-dap",
  background: "",
  eyebrow: "Hỏi đáp",
  title: "Câu hỏi thường gặp",
  intro: "",
  center: true,
};

export const ctaDefaults: B.CtaProps = {
  eyebrow: "Đặt trực tiếp, thêm quyền lợi",
  title: "Giữ phòng cho chuyến đi sắp tới",
  text: "Gửi ngày đến, ngày đi và số khách. Lễ tân F21 sẽ gọi lại hoặc nhắn Zalo xác nhận phòng.",
};

const block = <T extends object>(type: string, n: number, props: T) => ({ type, props: { id: `${type}-${n}`, ...props } });

export const defaultHome: Data = {
  root: { props: { title: "Trang chủ" } },
  content: [
    block("Hero", 1, heroDefaults),
    // Vị trí (gần Mỹ Đình, Bảo Sơn) là lý do chọn F21, nên đứng ngay dưới Hero, rồi tới giá phòng.
    // "Đặt trực tiếp" để sát Ưu đãi, lúc khách đã xem phòng và không gian. Màu nền xen kẽ trắng/kem.
    block("Location", 1, locationDefaults),
    block("Rooms", 1, roomsDefaults),
    block("Intro", 1, introDefaults),
    block("Gallery", 1, galleryDefaults),
    block("Guests", 1, guestsDefaults),
    block("Reviews", 1, reviewsDefaults),
    block("Perks", 1, perksDefaults),
    block("Offers", 1, offersDefaults),
    block("Faq", 1, faqDefaults),
    block("Cta", 1, ctaDefaults),
  ],
  zones: {},
};
