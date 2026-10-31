// Đọc dữ liệu website từ D1 (bảng do CMS quản lý), bằng SQL trực tiếp để nhẹ CPU trên Workers Free.
// Mỗi hàm được lưu đệm ('use cache') và gắn nhãn; khi lưu trong CMS thì revalidateTag theo nhãn để làm mới trang.
// Mục nào CMS còn trống thì dùng giá trị mặc định trong site.ts / theme.ts.
import type { Data } from "@puckeditor/core";
import { cacheLife, cacheTag } from "next/cache";
import type { BlockMeta } from "@/blocks/types";
import { CMS_TAGS } from "./cms-tags";
import { bool, db, num, readAll, str } from "./db";
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

export { CMS_TAGS };

type Row = Record<string, unknown>;

// Cài đặt chung chỉ có một dòng (global của CMS)
async function siteSettings() {
  const [rows, longStay] = await readAll<[Row, Row]>(
    (await db()).prepare("select * from site_settings limit 1"),
    (await db()).prepare("select label, discount from site_settings_price_notes_long_stay order by _order"),
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
  telLink: string;
  zaloLink: string;
};

export async function getSite(): Promise<SiteData> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.settings);
  const { s } = await siteSettings();
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
  return { ...merged, telLink: `tel:${merged.phone}`, zaloLink: `https://zalo.me/${merged.zalo}` } as SiteData;
}

export type PriceNotes = typeof defaultPriceNotes;

export async function getPriceNotes(): Promise<PriceNotes> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.settings);
  const { s, longStay } = await siteSettings();
  if (!s) return defaultPriceNotes;
  return {
    extraPerson: s.price_notes_extra_person === null ? defaultPriceNotes.extraPerson : num(s.price_notes_extra_person),
    deposit: str(s.price_notes_deposit) || defaultPriceNotes.deposit,
    refund: str(s.price_notes_refund) || defaultPriceNotes.refund,
    water: str(s.price_notes_water) || defaultPriceNotes.water,
    longStay: longStay.length ? longStay.map((x) => ({ label: str(x.label), discount: str(x.discount) })) : defaultPriceNotes.longStay,
  };
}

export type BookingSettings = {
  enabled: boolean;
  depositPercent: number;
  maxRooms: number;
  maxNights: number;
  bank: { bankId: string; accountNo: string; accountName: string } | null;
};

export async function getBookingSettings(): Promise<BookingSettings> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.settings);
  const { s } = await siteSettings();
  const bankId = str(s?.booking_bank_bank_id).trim();
  const accountNo = str(s?.booking_bank_account_no).trim();
  return {
    enabled: bool(s?.booking_enabled, true),
    depositPercent: num(s?.booking_deposit_percent, 50),
    maxRooms: num(s?.booking_max_rooms, 5),
    maxNights: num(s?.booking_max_nights, 30),
    bank: bankId && accountNo ? { bankId, accountNo, accountName: str(s?.booking_bank_account_name).trim() } : null,
  };
}

export async function getThemeFonts(): Promise<Record<"heading" | "hero" | "body" | "ui", FontKey>> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.theme);
  const t = (await (await db()).prepare("select * from theme_settings limit 1").first<Row>()) ?? {};
  const fonts = filled({ heading: str(t.fonts_heading), hero: str(t.fonts_hero), body: str(t.fonts_body), ui: str(t.fonts_ui) });
  return { ...defaultTheme.fonts, ...fonts } as Record<"heading" | "hero" | "body" | "ui", FontKey>;
}

export async function getRooms(): Promise<Room[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.rooms);
  const d = await db();
  const [types, amenities, photos, rooms] = await readAll<[Row, Row, Row, Row]>(
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
  }));
}

// Dữ liệu rút gọn cho form đặt phòng (component chạy ở trình duyệt)
export const toRoomOptions = (rooms: Room[]) =>
  rooms.map((r) => ({ slug: r.slug, name: r.name, guests: r.guests, overnight: r.prices.overnight }));

export const toFormContact = (s: SiteData) => ({
  name: s.name,
  phoneDisplay: s.phoneDisplay,
  telLink: s.telLink,
  zaloLink: s.zaloLink,
  replyHours: s.replyHours,
});

export async function getOffers(): Promise<Offer[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.offers);
  const d = await db();
  const [offers, details] = await readAll<[Row, Row]>(
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
  }));
}

export async function getFaqs(): Promise<{ q: string; a: string }[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.faqs);
  const { results } = await (await db()).prepare('select question, answer from faqs order by "order", id limit 100').all<Row>();
  if (!results.length) return defaultFaqs;
  return results.map((f) => ({ q: str(f.question), a: str(f.answer) }));
}

export async function getReviews(): Promise<Review[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.reviews);
  const { results } = await (await db())
    .prepare("select name, text, rating, source, date from reviews where published = 1 order by created_at desc limit 12")
    .all<Row>();
  return results.map((r) => ({ name: str(r.name), text: str(r.text), rating: num(r.rating, 5), source: str(r.source), date: str(r.date) }));
}

// Bố cục đã xuất bản của một trang dựng bằng trình kéo thả (null nếu chưa có hoặc chưa xuất bản)
export async function getPageData(slug: string): Promise<{ title: string; data: Data } | null> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.pages);
  const page = await (await db()).prepare("select title, data from pages where slug = ? limit 1").bind(slug).first<Row>();
  if (!page?.data) return null;
  const data = (typeof page.data === "string" ? JSON.parse(page.data) : page.data) as Data | null;
  return data?.content ? { title: str(page.title), data } : null;
}

// Dữ liệu CMS mà các khối của trình dựng trang cần (src/blocks/types.ts)
export async function getBlockMeta(): Promise<BlockMeta> {
  const [site, rooms, offers, faqs, reviews] = await Promise.all([getSite(), getRooms(), getOffers(), getFaqs(), getReviews()]);
  return { site, rooms, offers, faqs, reviews };
}
