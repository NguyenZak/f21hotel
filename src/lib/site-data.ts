// Đọc dữ liệu website từ D1 (bảng do CMS quản lý) bằng SQL trực tiếp. Hàm thuần nhận D1, không phụ thuộc Next.js:
// trang website dùng qua src/lib/cms.ts (thêm bộ nhớ đệm), API CMS dùng trực tiếp trong custom worker.
// Mục nào CMS còn trống thì dùng giá trị mặc định trong site.ts / theme.ts.
import type { Data } from "@puckeditor/core";
import { bool, num, str } from "./sql";
import { mediaUrl } from "./media";
import {
  faqs as defaultFaqs,
  offers as defaultOffers,
  priceNotes as defaultPriceNotes,
  rooms as defaultRooms,
  site as defaultSite,
  type Offer,
  type Photo,
  type Review,
  type Room,
} from "./site";
import { theme as defaultTheme, type FontKey } from "./theme";

async function batch<T extends unknown[]>(d: D1Database, ...stmts: D1PreparedStatement[]): Promise<{ [K in keyof T]: T[K][] }> {
  return (await d.batch(stmts)).map((r) => r.results) as { [K in keyof T]: T[K][] };
}


type Row = Record<string, unknown>;

// Cài đặt chung chỉ có một dòng (global của CMS)
async function siteSettings(d: D1Database) {
  const [rows, longStay] = await batch<[Row, Row]>(d,
    d.prepare("select * from site_settings limit 1"),
    d.prepare("select label, discount, min_nights, percent from site_settings_price_notes_long_stay order by _order"),
  );
  return { s: rows[0] as Row | undefined, longStay };
}

// Bỏ các giá trị rỗng để giá trị mặc định không bị ghi đè bằng null
const filled = <T extends object>(o: T | null | undefined) =>
  Object.fromEntries(Object.entries(o ?? {}).filter(([, v]) => v !== null && v !== undefined && v !== "")) as Partial<T>;

export type SiteData = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  phone: string;
  phoneDisplay: string;
  zalo: string;
  feedbackPhone: string;
  feedbackPhoneDisplay: string;
  email: string;
  entranceVideo: string;
  address: { street: string; locality: string; region: string; country: string; full: string };
  directions: string;
  mapQuery: string;
  replyHours: string;
  checkIn: string;
  checkOut: string;
  priceFrom: number;
  social: { facebook: string; tiktok: string; googleMaps: string };
  // Thông tin bắt buộc công bố của chủ website (CMS › Doanh nghiệp & pháp lý); chuỗi rỗng khi chưa điền
  legal: { name: string; taxCode: string; businessReg: string; moitUrl: string };
  // Điểm đánh giá chép từ Google Maps / OTA; null khi CMS chưa điền (website ẩn)
  rating: { score: number; count: number; source: string; url: string } | null;
  telLink: string;
  zaloLink: string;
};

export async function readSite(d: D1Database): Promise<SiteData> {
  const { s } = await siteSettings(d);
  const get = (k: string) => str(s?.[k]);
  const fields = filled({
    name: get("name"),
    tagline: get("tagline"),
    description: get("description"),
    url: get("url"),
    phone: get("phone"),
    phoneDisplay: get("phone_display"),
    zalo: get("zalo"),
    feedbackPhone: get("feedback_phone"),
    feedbackPhoneDisplay: get("feedback_phone_display"),
    entranceVideo: get("entrance_video"),
    directions: get("directions"),
    mapQuery: get("map_query"),
    replyHours: get("reply_hours"),
    checkIn: get("check_in"),
    checkOut: get("check_out"),
    priceFrom: s?.price_from ? num(s.price_from) : undefined,
  });
  const merged = {
    ...defaultSite,
    ...fields,
    // Email và mạng xã hội để trống trong CMS nghĩa là ẩn, không lấy mặc định
    email: s ? get("email") : defaultSite.email,
    address: {
      ...defaultSite.address,
      ...filled({ street: get("address_street"), locality: get("address_locality"), region: get("address_region"), full: get("address_full") }),
    },
    social: s
      ? { facebook: get("social_facebook"), tiktok: get("social_tiktok"), googleMaps: get("social_google_maps") || defaultSite.social.googleMaps }
      : { ...defaultSite.social },
  };
  const score = num(s?.rating_score);
  const count = num(s?.rating_count);
  const rating =
    score >= 1 && score <= 5 && count > 0
      ? { score: Math.round(score * 10) / 10, count: Math.round(count), source: get("rating_source") || "Google", url: get("rating_url") || merged.social.googleMaps }
      : null;
  const legal = { name: get("legal_name"), taxCode: get("tax_code"), businessReg: get("business_reg"), moitUrl: get("moit_url") };
  return { ...merged, legal, rating, telLink: `tel:${merged.phone}`, zaloLink: `https://zalo.me/${merged.zalo}` } as SiteData;
}

export type PriceNotes = typeof defaultPriceNotes;

export async function readPriceNotes(d: D1Database): Promise<PriceNotes> {
  const { s, longStay } = await siteSettings(d);
  if (!s) return defaultPriceNotes;
  return {
    extraPerson: s.price_notes_extra_person === null ? defaultPriceNotes.extraPerson : num(s.price_notes_extra_person),
    deposit: str(s.price_notes_deposit) || defaultPriceNotes.deposit,
    refund: str(s.price_notes_refund) || defaultPriceNotes.refund,
    water: str(s.price_notes_water) || defaultPriceNotes.water,
    vat: str(s.price_notes_vat),
    longStay: longStay.length ? longStay.map((x) => ({ label: str(x.label), discount: str(x.discount) })) : defaultPriceNotes.longStay,
  };
}

export type LongStayTier = { minNights: number; percent: number; label: string };

export type BookingSettings = {
  enabled: boolean;
  depositPercent: number;
  maxRooms: number;
  maxNights: number;
  bank: { bankId: string; accountNo: string; accountName: string } | null;
  // Giảm giá đặt online (%), đổi/huỷ miễn phí trước bao nhiêu ngày (0 = không)
  directDiscount: number;
  freeCancelDays: number;
  longStay: LongStayTier[];
};

// Các mức giảm ở dài ngày có điền số đêm và % (bỏ dòng chỉ có chữ), mức cao trước
export function longStayTiers(rows: Record<string, unknown>[]): LongStayTier[] {
  return rows
    .map((r) => ({ minNights: num(r.min_nights), percent: num(r.percent), label: str(r.label) }))
    .filter((t) => t.minNights > 0 && t.percent > 0 && t.percent <= 50)
    .sort((a, b) => b.minNights - a.minNights);
}

export async function readBookingSettings(d: D1Database): Promise<BookingSettings> {
  const { s, longStay } = await siteSettings(d);
  const bankId = str(s?.booking_bank_bank_id).trim();
  const accountNo = str(s?.booking_bank_account_no).trim();
  return {
    enabled: bool(s?.booking_enabled, true),
    depositPercent: num(s?.booking_deposit_percent, 50),
    maxRooms: num(s?.booking_max_rooms, 5),
    maxNights: num(s?.booking_max_nights, 30),
    bank: bankId && accountNo ? { bankId, accountNo, accountName: str(s?.booking_bank_account_name).trim() } : null,
    directDiscount: Math.min(30, Math.max(0, num(s?.booking_direct_discount, 0))),
    freeCancelDays: Math.max(0, Math.round(num(s?.booking_free_cancel_days, 0))),
    longStay: longStayTiers(longStay),
  };
}

export async function readThemeFonts(d: D1Database): Promise<Record<"heading" | "hero" | "body" | "ui", FontKey>> {
  const t = (await d.prepare("select * from theme_settings limit 1").first<Row>()) ?? {};
  const fonts = filled({ heading: str(t.fonts_heading), hero: str(t.fonts_hero), body: str(t.fonts_body), ui: str(t.fonts_ui) });
  return { ...defaultTheme.fonts, ...fonts } as Record<"heading" | "hero" | "body" | "ui", FontKey>;
}

export async function readRooms(d: D1Database): Promise<Room[]> {
  const [types, amenities, photos, rooms] = await batch<[Row, Row, Row, Row]>(d,
    d.prepare('select * from room_types order by "order", id'),
    d.prepare("select _parent_id, text from room_types_amenities order by _order"),
    d.prepare(
      "select r.parent_id, m.url, m.filename, m.prefix, m.alt, m.width, m.height from room_types_rels r join media m on m.id = r.media_id where r.path = 'photos' order by r.\"order\"",
    ),
    d.prepare("select number, room_type_id from rooms where active = 1 order by number"),
  );
  if (!types.length) return defaultRooms;
  return types.map((t) => ({
    slug: str(t.slug),
    name: str(t.name),
    short: str(t.short),
    description: str(t.description),
    guests: num(t.guests),
    prices: {
      hourly: num(t.prices_hourly),
      overnight: num(t.prices_overnight),
      fullDay: num(t.prices_full_day),
      extraHour: num(t.prices_extra_hour),
    },
    amenities: amenities.filter((a) => a._parent_id === t.id).map((a) => str(a.text)),
    photos: photos
      .filter((p) => p.parent_id === t.id)
      .map((p): Photo => ({ src: mediaUrl(p), alt: str(p.alt), w: num(p.width, 1600), h: num(p.height, 1067) }))
      .filter((p) => p.src),
    roomNumbers: rooms.filter((r) => r.room_type_id === t.id).map((r) => str(r.number)),
    area: num(t.area) || undefined,
    bed: str(t.bed).trim() || undefined,
    view: str(t.view).trim() || undefined,
  }));
}

export async function readOffers(d: D1Database): Promise<Offer[]> {
  const [offers, details] = await batch<[Row, Row]>(d,
    d.prepare('select * from offers where active = 1 order by "order", id limit 50'),
    d.prepare("select _parent_id, text from offers_details order by _order"),
  );
  if (!offers.length) return defaultOffers;
  return offers.map((o) => ({
    slug: str(o.slug),
    tag: str(o.tag),
    title: str(o.title),
    summary: str(o.summary),
    when: str(o.when),
    code: str(o.code) || undefined,
    details: details.filter((x) => x._parent_id === o.id).map((x) => str(x.text)),
    featured: bool(o.featured),
    discountPercent: num(o.discount_percent) || undefined,
  }));
}

export async function readFaqs(d: D1Database): Promise<{ q: string; a: string }[]> {
  const { results } = await d.prepare('select question, answer from faqs order by "order", id limit 100').all<Row>();
  if (!results.length) return defaultFaqs;
  return results.map((f) => ({ q: str(f.question), a: str(f.answer) }));
}

export async function readReviews(d: D1Database): Promise<Review[]> {
  const { results } = await d
    .prepare("select name, text, rating, source, date from reviews where published = 1 order by created_at desc limit 12")
    .all<Row>();
  return results.map((r) => ({ name: str(r.name), text: str(r.text), rating: num(r.rating, 5), source: str(r.source), date: str(r.date) }));
}

// Bố cục đã xuất bản của một trang dựng bằng trình kéo thả (null nếu chưa có hoặc chưa xuất bản)
export async function readPageData(d: D1Database, slug: string): Promise<{ title: string; data: Data } | null> {
  const page = await d.prepare("select title, data from pages where slug = ? limit 1").bind(slug).first<Row>();
  if (!page?.data) return null;
  const data = (typeof page.data === "string" ? JSON.parse(page.data) : page.data) as Data | null;
  return data?.content ? { title: str(page.title), data } : null;
}

