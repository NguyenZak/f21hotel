// Thẻ meta và dữ liệu có cấu trúc (schema.org JSON-LD) cho Google, mạng xã hội và trợ lý AI.
// Mọi đường dẫn tuyệt đối lấy theo "Địa chỉ website" trong CMS (Cài đặt › Thông tin chung).
import type { Metadata } from "next";
import type { SiteData } from "./cms";
import type { Room } from "./site";

export const absUrl = (site: SiteData, path: string) => new URL(path, site.url).toString();

const hotelId = (site: SiteData) => absUrl(site, "/#hotel");
const websiteId = (site: SiteData) => absUrl(site, "/#website");

// Meta cho từng trang: canonical, og:url. openGraph của trang thay hẳn openGraph của layout
// nên phải ghi lại đủ siteName, locale, type.
export function pageMeta(site: SiteData, path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "vi_VN", siteName: site.name, url: path, title: `${title} | ${site.name}`, description },
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
    ...(site.social.googleMaps ? { hasMap: site.social.googleMaps } : {}),
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
