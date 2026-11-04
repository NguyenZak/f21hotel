// Thẻ meta và dữ liệu có cấu trúc (schema.org JSON-LD) cho Google, mạng xã hội và trợ lý AI.
// Mọi đường dẫn tuyệt đối lấy theo "Địa chỉ website" trong CMS (Cài đặt › Thông tin chung).
import type { Metadata } from "next";
import type { Post, SiteData } from "./cms";
import { mapsUrl, type Room } from "./site";

export const absUrl = (site: SiteData, path: string) => new URL(path, site.url).toString();

const hotelId = (site: SiteData) => absUrl(site, "/#hotel");
const websiteId = (site: SiteData) => absUrl(site, "/#website");

// Ảnh xem trước khi chia sẻ link (Facebook, Zalo, Messenger) và ảnh nhỏ cạnh kết quả Google.
// File ở public/og, khổ 1200×630, cắt từ ảnh thật của khách sạn. Đường dẫn tương đối, Next.js ghép với
// metadataBase (layout: "Địa chỉ website" trong CMS) thành URL tuyệt đối.
export const OG_IMAGES = {
  home: { file: "trang-chu", alt: "Mặt tiền F21 Hotel ở góc đường khu biệt thự Hoa Phượng, An Khánh" },
  rooms: { file: "phong", alt: "Phòng đôi hai giường tại F21 Hotel" },
  location: { file: "vi-tri", alt: "F21 Hotel nhìn từ đường nội khu biệt thự Hoa Phượng" },
  offers: { file: "uu-dai", alt: "Biển đèn F21 Hotel trên sân thượng buổi tối" },
  booking: { file: "dat-phong", alt: "Quầy lễ tân và sảnh F21 Hotel" },
  groups: { file: "doan-doanh-nghiep", alt: "Phòng hai giường cho khách đoàn tại F21 Hotel" },
} as const;

// Ảnh bìa bài viết (Cloudinary) cắt 1200×630 JPG làm ảnh xem trước; bài chưa có ảnh bìa dùng ảnh trang Vị trí
export function postOgImages(post: Post) {
  if (!post.cover) return ogImageMeta(OG_IMAGES.location);
  const url = post.cover.src.replace("/image/upload/f_auto,q_auto/", "/image/upload/c_fill,g_auto,w_1200,h_630,q_auto,f_jpg/");
  return {
    images: [{ url, width: 1200, height: 630, alt: post.cover.alt, type: "image/jpeg" }],
    twitter: { card: "summary_large_image" as const, images: [{ url, alt: post.cover.alt }] },
  };
}

export type OgImage = (typeof OG_IMAGES)[keyof typeof OG_IMAGES];

export const ogImageMeta = ({ file, alt }: OgImage) => {
  const url = `/og/${file}.jpg`;
  return {
    images: [{ url, width: 1200, height: 630, alt, type: "image/jpeg" }],
    twitter: { card: "summary_large_image", images: [{ url, alt }] },
  } satisfies { images: unknown; twitter: Metadata["twitter"] };
};

// Meta cho từng trang: canonical, og:url, ảnh xem trước. openGraph của trang thay hẳn openGraph của layout
// nên phải ghi lại đủ siteName, locale, type.
export function pageMeta(site: SiteData, path: string, title: string, description: string, image: OgImage): Metadata {
  const og = ogImageMeta(image);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "vi_VN", siteName: site.name, url: path, title: `${title} | ${site.name}`, description, images: og.images },
    twitter: og.twitter,
  };
}

// Mọi tiện nghi có trong ít nhất một hạng phòng, cộng chỗ đỗ xe trước khách sạn
const amenities = (rooms: Room[]) => [...new Set([...rooms.flatMap((r) => r.amenities), "Chỗ đỗ ô tô"])];

const priceRange = (rooms: Room[]) => {
  const all = rooms.flatMap((r) => [r.prices.hourly, r.prices.fullDay]).filter((n) => n > 0);
  if (!all.length) return undefined;
  const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";
  return `${vnd(Math.min(...all))} – ${vnd(Math.max(...all))}`;
};

export function hotelJsonLd(site: SiteData, rooms: Room[]) {
  const sameAs = [site.social.googleMaps, site.social.facebook, site.social.tiktok].filter(Boolean);
  const numberOfRooms = rooms.reduce((n, r) => n + r.roomNumbers.length, 0);
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": hotelId(site),
    name: site.name,
    ...(site.legal.name ? { legalName: site.legal.name } : {}),
    ...(site.legal.taxCode ? { taxID: site.legal.taxCode } : {}),
    description: site.description,
    url: absUrl(site, "/"),
    image: ["/img/anh/mat-tien-ngay.webp", "/img/anh/mat-tien-dem.webp", "/img/anh/sanh-le-tan.webp"].map((p) =>
      absUrl(site, p),
    ),
    logo: absUrl(site, "/img/logo-ngang.png"),
    telephone: site.phone,
    ...(site.email ? { email: site.email } : {}),
    ...(priceRange(rooms) ? { priceRange: priceRange(rooms) } : {}),
    currenciesAccepted: "VND",
    availableLanguage: "vi",
    checkinTime: site.checkIn,
    checkoutTime: site.checkOut,
    ...(numberOfRooms ? { numberOfRooms } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    hasMap: mapsUrl(site.mapQuery),
    ...(sameAs.length ? { sameAs } : {}),
    amenityFeature: amenities(rooms).map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
  };
}

// Tên website hiển thị trên kết quả tìm kiếm Google
export function websiteJsonLd(site: SiteData) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId(site),
    name: site.name,
    alternateName: "Khách sạn F21",
    url: absUrl(site, "/"),
    inLanguage: "vi",
    publisher: { "@id": hotelId(site) },
  };
}

export function breadcrumbJsonLd(site: SiteData, path: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: absUrl(site, "/") },
      { "@type": "ListItem", position: 2, name, item: absUrl(site, path) },
    ],
  };
}

// Breadcrumb nhiều cấp: [tên, đường dẫn] sau "Trang chủ"
export function breadcrumbTrailJsonLd(site: SiteData, trail: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["Trang chủ", "/"], ...trail].map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: absUrl(site, path) })),
  };
}

// Bài viết: tác giả và đơn vị xuất bản là khách sạn (@id trong hotelJsonLd), để Google và AI biết nguồn thông tin
export function articleJsonLd(site: SiteData, post: Post, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": absUrl(site, `${path}#article`),
    headline: post.title,
    description: post.excerpt,
    url: absUrl(site, path),
    mainEntityOfPage: absUrl(site, path),
    inLanguage: "vi",
    datePublished: post.publishedAt,
    dateModified: post.updatedAt.slice(0, 10) > post.publishedAt ? post.updatedAt.slice(0, 10) : post.publishedAt,
    ...(post.cover ? { image: absUrl(site, post.cover.src) } : {}),
    author: { "@type": "Organization", "@id": hotelId(site), name: site.name, url: absUrl(site, "/") },
    publisher: { "@id": hotelId(site) },
    isPartOf: { "@id": websiteId(site) },
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

// Hạng phòng và giá từng hình thức nghỉ, gắn vào khách sạn qua @id
export function roomsJsonLd(site: SiteData, rooms: Room[]) {
  const price = (room: Room, price: number, name: string, unitText: string) => ({
    "@type": "Offer",
    name: `${room.name}: ${name}`,
    url: absUrl(site, "/phong"),
    priceSpecification: { "@type": "UnitPriceSpecification", price, priceCurrency: "VND", unitText },
    itemOffered: { "@id": absUrl(site, `/phong#${room.slug}`) },
  });
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": hotelId(site),
    name: site.name,
    containsPlace: rooms.map((room) => ({
      "@type": "HotelRoom",
      "@id": absUrl(site, `/phong#${room.slug}`),
      name: room.name,
      description: room.description,
      occupancy: { "@type": "QuantitativeValue", maxValue: room.guests, unitText: "người" },
      ...(room.photos[0] ? { image: room.photos.map((p) => absUrl(site, p.src)) } : {}),
      amenityFeature: room.amenities.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    })),
    makesOffer: rooms.flatMap((room) =>
      [
        price(room, room.prices.overnight, "nghỉ qua đêm", "đêm"),
        price(room, room.prices.fullDay, "nghỉ ngày đêm", "ngày đêm"),
        price(room, room.prices.hourly, "nghỉ giờ, 2 giờ đầu", "2 giờ"),
      ].filter((o) => o.priceSpecification.price > 0),
    ),
  };
}

// Thẻ <script type="application/ld+json">; thay "<" để nội dung CMS không đóng được thẻ script
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
  );
}
