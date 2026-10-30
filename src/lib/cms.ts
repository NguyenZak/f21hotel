// Đọc dữ liệu website từ CMS (Payload). Mỗi hàm được lưu đệm ('use cache') và gắn nhãn;
// khi lưu trong CMS, hook ở src/payload/revalidate.ts gọi revalidateTag theo nhãn để làm mới trang.
// Mục nào CMS còn trống thì dùng giá trị mặc định trong site.ts / theme.ts.
import config from "@payload-config";
import type { Data } from "@puckeditor/core";
import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";
import type { BlockMeta } from "@/blocks/types";
import type { Media } from "@/payload-types";
import { CMS_TAGS } from "./cms-tags";
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

const payload = () => getPayload({ config });

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
  const s = await (await payload()).findGlobal({ slug: "site-settings", depth: 0 });
  const merged = {
    ...defaultSite,
    ...filled(s),
    // Email và mạng xã hội để trống trong CMS nghĩa là ẩn, không lấy mặc định
    email: s.email ?? "",
    address: { ...defaultSite.address, ...filled(s.address) },
    social: { facebook: "", tiktok: "", googleMaps: defaultSite.social.googleMaps, ...filled(s.social) },
  };
  return { ...merged, telLink: `tel:${merged.phone}`, zaloLink: `https://zalo.me/${merged.zalo}` } as SiteData;
}

export type PriceNotes = typeof defaultPriceNotes;

export async function getPriceNotes(): Promise<PriceNotes> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.settings);
  const s = await (await payload()).findGlobal({ slug: "site-settings", depth: 0 });
  const n = s.priceNotes;
  if (!n) return defaultPriceNotes;
  return {
    extraPerson: n.extraPerson ?? defaultPriceNotes.extraPerson,
    deposit: n.deposit || defaultPriceNotes.deposit,
    refund: n.refund || defaultPriceNotes.refund,
    water: n.water || defaultPriceNotes.water,
    longStay: n.longStay?.length
      ? n.longStay.map((x) => ({ label: x.label, discount: x.discount }))
      : defaultPriceNotes.longStay,
  };
}

export async function getThemeFonts(): Promise<Record<"heading" | "hero" | "body" | "ui", FontKey>> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.theme);
  const t = await (await payload()).findGlobal({ slug: "theme-settings", depth: 0 });
  return { ...defaultTheme.fonts, ...filled(t.fonts) } as Record<"heading" | "hero" | "body" | "ui", FontKey>;
}

const toPhoto = (m: number | Media | null | undefined): Photo | null =>
  m && typeof m === "object" && m.url ? { src: m.url, alt: m.alt, w: m.width ?? 1600, h: m.height ?? 1067 } : null;

export async function getRooms(): Promise<Room[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.rooms);
  const p = await payload();
  const [types, rooms] = await Promise.all([
    p.find({ collection: "room-types", sort: "order", depth: 1, limit: 50 }),
    p.find({ collection: "rooms", where: { active: { equals: true } }, sort: "number", depth: 0, limit: 500 }),
  ]);
  if (!types.docs.length) return defaultRooms;
  return types.docs.map((t) => ({
    slug: t.slug,
    name: t.name,
    short: t.short,
    description: t.description,
    guests: t.guests,
    prices: t.prices,
    amenities: (t.amenities ?? []).map((a) => a.text),
    photos: (t.photos ?? []).map(toPhoto).filter((x): x is Photo => x !== null),
    roomNumbers: rooms.docs
      .filter((r) => (typeof r.roomType === "object" ? r.roomType.id : r.roomType) === t.id)
      .map((r) => r.number),
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
  const res = await (await payload()).find({
    collection: "offers",
    where: { active: { equals: true } },
    sort: "order",
    depth: 0,
    limit: 50,
  });
  if (!res.totalDocs) return defaultOffers;
  return res.docs.map((o) => ({
    slug: o.slug,
    tag: o.tag,
    title: o.title,
    summary: o.summary,
    when: o.when,
    code: o.code || undefined,
    details: (o.details ?? []).map((d) => d.text),
    featured: Boolean(o.featured),
  }));
}

export async function getFaqs(): Promise<{ q: string; a: string }[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.faqs);
  const res = await (await payload()).find({ collection: "faqs", sort: "order", depth: 0, limit: 100 });
  if (!res.totalDocs) return defaultFaqs;
  return res.docs.map((f) => ({ q: f.question, a: f.answer }));
}

export async function getReviews(): Promise<Review[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.reviews);
  const res = await (await payload()).find({
    collection: "reviews",
    where: { published: { equals: true } },
    sort: "-createdAt",
    depth: 0,
    limit: 12,
  });
  return res.docs.map((r) => ({ name: r.name, text: r.text, rating: r.rating, source: r.source, date: r.date }));
}

// Bố cục đã xuất bản của một trang dựng bằng trình kéo thả (null nếu chưa có hoặc chưa xuất bản)
export async function getPageData(slug: string): Promise<{ title: string; data: Data } | null> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.pages);
  const res = await (await payload()).find({
    collection: "pages",
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
    select: { title: true, data: true },
  });
  const page = res.docs[0];
  const data = page?.data as Data | null | undefined;
  return page && data?.content ? { title: page.title, data } : null;
}

// Dữ liệu CMS mà các khối của trình dựng trang cần (src/blocks/types.ts)
export async function getBlockMeta(): Promise<BlockMeta> {
  const [site, rooms, offers, faqs, reviews] = await Promise.all([getSite(), getRooms(), getOffers(), getFaqs(), getReviews()]);
  return { site, rooms, offers, faqs, reviews };
}
