// Dữ liệu website cho các trang Next.js: các hàm đọc ở src/lib/site-data.ts, bọc bộ nhớ đệm ('use cache') và gắn nhãn.
// Khi lưu trong CMS, API ghi nhãn đã đổi (src/cms/server/api.ts revalidate) để các trang dùng nhãn đó được dựng lại.
import type { Data } from "@puckeditor/core";
import { cacheLife, cacheTag } from "next/cache";
import type { BlockMeta } from "@/blocks/types";
import { CMS_TAGS } from "./cms-tags";
import { db } from "./db";
import * as read from "./site-data";
import type { Offer, Review, Room } from "./site";
import type { FontKey } from "./theme";

export { CMS_TAGS };
export type { BookingSettings, Post, PriceNotes, SiteData } from "./site-data";

export async function getSite(): Promise<read.SiteData> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.settings);
  return read.readSite(await db());
}

export async function getPriceNotes(): Promise<read.PriceNotes> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.settings);
  return read.readPriceNotes(await db());
}

export async function getBookingSettings(): Promise<read.BookingSettings> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.settings);
  return read.readBookingSettings(await db());
}

export async function getThemeFonts(): Promise<Record<"heading" | "hero" | "body" | "ui", FontKey>> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.theme);
  return read.readThemeFonts(await db());
}

export async function getRooms(): Promise<Room[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.rooms);
  return read.readRooms(await db());
}

export async function getOffers(): Promise<Offer[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.offers);
  return read.readOffers(await db());
}

export async function getFaqs(): Promise<{ q: string; a: string }[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.faqs);
  return read.readFaqs(await db());
}

export async function getReviews(): Promise<Review[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.reviews);
  return read.readReviews(await db());
}

export async function getPosts(): Promise<read.Post[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.posts);
  return read.readPosts(await db());
}

// Bố cục đã xuất bản của một trang dựng bằng trình kéo thả (null nếu chưa có hoặc chưa xuất bản)
export async function getPageData(slug: string): Promise<{ title: string; data: Data } | null> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_TAGS.pages);
  return read.readPageData(await db(), slug);
}

// Dữ liệu rút gọn cho form đặt phòng (component chạy ở trình duyệt)
export const toRoomOptions = (rooms: Room[]) =>
  rooms.map((r) => ({ slug: r.slug, name: r.name, guests: r.guests, overnight: r.prices.overnight }));

export const toFormContact = (s: read.SiteData) => ({
  name: s.name,
  phoneDisplay: s.phoneDisplay,
  telLink: s.telLink,
  zaloLink: s.zaloLink,
  replyHours: s.replyHours,
});

// Dữ liệu CMS mà các khối của trình dựng trang cần (src/blocks/types.ts)
export async function getBlockMeta(): Promise<BlockMeta> {
  const [site, rooms, offers, faqs, reviews] = await Promise.all([getSite(), getRooms(), getOffers(), getFaqs(), getReviews()]);
  return { site, rooms, offers, faqs, reviews };
}
