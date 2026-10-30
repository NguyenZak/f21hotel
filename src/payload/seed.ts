// Nạp dữ liệu hiện có của website (src/lib/site.ts, src/lib/theme.ts) vào CMS.
// Chạy: npm run seed. Chạy lại nhiều lần không tạo trùng (tìm theo slug, số phòng, tên file).
import path from "path";
import type { Payload } from "payload";
import { getPayload } from "payload";
import config from "@payload-config";
import { faqs, offers, priceNotes, rooms, site } from "@/lib/site";
import { theme } from "@/lib/theme";
import { defaultHome } from "@/blocks/home";

const publicDir = path.resolve(process.cwd(), "public");

async function upsertMedia(payload: Payload, src: string, alt: string) {
  const filename = path.basename(src);
  const found = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1 });
  if (found.docs[0]) return found.docs[0].id;
  const doc = await payload.create({ collection: "media", data: { alt }, filePath: path.join(publicDir, src) });
  return doc.id;
}

async function upsertBy<T extends "room-types" | "rooms" | "offers" | "faqs">(
  payload: Payload,
  collection: T,
  field: string,
  value: string,
  data: Record<string, unknown>,
) {
  const found = await payload.find({ collection, where: { [field]: { equals: value } }, limit: 1 });
  if (found.docs[0]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dữ liệu chung cho nhiều bảng
    return (await payload.update({ collection, id: found.docs[0].id, data: data as any })).id;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dữ liệu chung cho nhiều bảng
  return (await payload.create({ collection, data: data as any })).id;
}

// Tài khoản thử nghiệm cho 3 vai trò, chỉ tạo ở máy dev khi có SEED_PASSWORD trong .env.local
async function seedDevUsers(payload: Payload) {
  const password = process.env.SEED_PASSWORD;
  if (process.env.NODE_ENV === "production" || !password) return;
  const users = [
    { email: "owner@f21.test", name: "Chủ (thử nghiệm)", role: "owner" },
    { email: "manager@f21.test", name: "Quản lý (thử nghiệm)", role: "manager" },
    { email: "staff@f21.test", name: "Nhân viên (thử nghiệm)", role: "staff" },
  ] as const;
  for (const u of users) {
    const found = await payload.find({ collection: "users", where: { email: { equals: u.email } }, limit: 1 });
    if (!found.docs[0]) await payload.create({ collection: "users", data: { ...u, password, active: true } });
  }
  payload.logger.info(`Tài khoản thử nghiệm: ${users.map((u) => u.email).join(", ")}`);
}

export async function seed(payload: Payload) {
  await seedDevUsers(payload);

  // Hạng phòng và ảnh
  const typeIds: Record<string, number | string> = {};
  for (const [i, r] of rooms.entries()) {
    const photos = [];
    for (const p of r.photos) photos.push(await upsertMedia(payload, p.src, p.alt));
    typeIds[r.slug] = await upsertBy(payload, "room-types", "slug", r.slug, {
      name: r.name,
      slug: r.slug,
      short: r.short,
      description: r.description,
      guests: r.guests,
      prices: r.prices,
      amenities: r.amenities.map((text) => ({ text })),
      photos,
      order: i,
    });
  }

  // 19 phòng: số phòng lấy từ bảng giá, tầng là chữ số đầu
  for (const r of rooms) {
    for (const number of r.roomNumbers) {
      await upsertBy(payload, "rooms", "number", number, {
        number,
        floor: Number(number[0]),
        roomType: typeIds[r.slug],
        active: true,
      });
    }
  }

  for (const [i, o] of offers.entries()) {
    await upsertBy(payload, "offers", "slug", o.slug, {
      ...o,
      details: o.details.map((text) => ({ text })),
      featured: Boolean(o.featured),
      active: true,
      order: i,
    });
  }

  for (const [i, f] of faqs.entries()) {
    await upsertBy(payload, "faqs", "question", f.q, { question: f.q, answer: f.a, order: i });
  }

  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      name: site.name,
      tagline: site.tagline,
      description: site.description,
      url: site.url,
      priceFrom: site.priceFrom,
      phone: site.phone,
      phoneDisplay: site.phoneDisplay,
      zalo: site.zalo,
      feedbackPhone: site.feedbackPhone,
      feedbackPhoneDisplay: site.feedbackPhoneDisplay,
      email: site.email || undefined,
      replyHours: site.replyHours,
      social: { ...site.social },
      address: { ...site.address },
      directions: site.directions,
      mapQuery: site.mapQuery,
      entranceVideo: site.entranceVideo,
      checkIn: site.checkIn,
      checkOut: site.checkOut,
      priceNotes: { ...priceNotes, longStay: priceNotes.longStay.map((x) => ({ ...x })) },
    },
  });

  await payload.updateGlobal({ slug: "theme-settings", data: { fonts: { ...theme.fonts } } });

  // Trang chủ cho trình dựng trang: chỉ tạo khi chưa có, không ghi đè bố cục đã chỉnh trong CMS
  const home = await payload.find({ collection: "pages", where: { slug: { equals: "home" } }, limit: 1 });
  if (!home.docs[0]) {
    await payload.create({
      collection: "pages",
      data: { title: "Trang chủ", slug: "home", data: defaultHome, publishedAt: new Date().toISOString() },
    });
  }

  payload.logger.info(
    `Đã nạp: ${rooms.length} hạng phòng, ${rooms.reduce((n, r) => n + r.roomNumbers.length, 0)} phòng, ${offers.length} ưu đãi, ${faqs.length} câu hỏi`,
  );
}

// `payload run src/payload/seed.ts` chạy trực tiếp file này
const payload = await getPayload({ config });
await seed(payload);
process.exit(0);
