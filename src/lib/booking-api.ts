// API đặt phòng của website: POST /api/booking/search và /api/booking/create (JSON).
// Trên Cloudflare, worker.ts gọi handleBookingApi trước khi nạp Next.js, nên mỗi yêu cầu chỉ tốn vài ms CPU
// (vừa gói Workers Free). Khi chạy `next dev`, route src/app/api/booking/[op]/route.ts gọi cùng hàm này.
// Không import gì từ Next.js / OpenNext ở đây.
import {
  isValidEmail,
  isValidPhone,
  normalizePhone,
  summarizeBooking,
  type CartLine,
  type CreateBookingResult,
  type GuestField,
  type OnlineStay,
  type SearchResult,
} from "./booking";
import { addDays, nightsBetween, todayInVietnam, toIsoDate } from "./dates";
import { notifyFrontDesk } from "./notify";
import { checkAvailability, deleteBooking, findBooking, insertBooking } from "./reservations";
import { bool, num, str } from "./sql";

export type BookingApiOptions = {
  // URL Google Apps Script nhận thông báo đặt phòng (BOOKING_WEBHOOK_URL)
  webhookUrl?: string;
  // Chạy việc sau khi đã trả kết quả cho khách (ctx.waitUntil trên Workers, after() trong Next)
  waitUntil: (p: Promise<unknown>) => void;
};

type Settings = { enabled: boolean; depositPercent: number; maxRooms: number; maxNights: number };

async function bookingSettings(d: D1Database): Promise<Settings> {
  const s = await d
    .prepare("select booking_enabled, booking_deposit_percent, booking_max_rooms, booking_max_nights from site_settings limit 1")
    .first<Record<string, unknown>>();
  return {
    enabled: bool(s?.booking_enabled, true),
    depositPercent: num(s?.booking_deposit_percent, 50),
    maxRooms: num(s?.booking_max_rooms, 5),
    maxNights: num(s?.booking_max_nights, 30),
  };
}

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

function dateError(checkIn: string, checkOut: string, settings: Settings) {
  if (!isoDate.test(checkIn) || !isoDate.test(checkOut)) return "Vui lòng chọn ngày nhận và trả phòng.";
  const today = todayInVietnam();
  if (checkIn < today) return "Ngày nhận phòng đã qua, vui lòng chọn lại.";
  if (checkIn > toIsoDate(addDays(new Date(`${today}T00:00`), 365))) return "Website nhận đặt trước tối đa một năm.";
  const nights = nightsBetween(checkIn, checkOut);
  if (!nights) return "Ngày trả phòng phải sau ngày nhận phòng.";
  if (nights > settings.maxNights) return `Đặt online tối đa ${settings.maxNights} đêm. Ở dài hơn vui lòng gọi lễ tân để được giảm giá.`;
  return null;
}

const closedError = "Website tạm ngừng nhận đặt phòng, vui lòng gọi lễ tân.";

export async function searchRooms(d: D1Database, checkIn: string, checkOut: string): Promise<SearchResult> {
  const settings = await bookingSettings(d);
  if (!settings.enabled) return { ok: false, error: closedError };
  const error = dateError(checkIn, checkOut, settings);
  if (error) return { ok: false, error };

  const avail = await checkAvailability(d, checkIn, checkOut);
  const rooms = Object.fromEntries(
    Object.entries(avail).map(([slug, a]) => [slug, { available: Math.max(0, a.available), plans: a.plans, reason: a.reason }]),
  );
  return { ok: true, checkIn, checkOut, nights: nightsBetween(checkIn, checkOut)!, rooms, depositPercent: settings.depositPercent };
}

export type CreateBookingInput = { checkIn: string; checkOut: string; lines: CartLine[]; guest: Partial<Record<GuestField | "website", string>> };

export async function createBooking(d: D1Database, input: CreateBookingInput, opts: BookingApiOptions): Promise<CreateBookingResult> {
  const settings = await bookingSettings(d);
  if (!settings.enabled) return { ok: false, error: closedError };
  const { checkIn, checkOut } = input;
  const dateErr = dateError(checkIn, checkOut, settings);
  if (dateErr) return { ok: false, error: dateErr, refresh: true };

  const g = Object.fromEntries(
    Object.entries(input.guest ?? {}).map(([k, v]) => [k, String(v ?? "").trim().slice(0, k === "note" ? 1000 : 120)]),
  ) as CreateBookingInput["guest"];
  // Ô ẩn chống spam: người thật không điền ô này
  if (g.website) return { ok: false, error: "Không gửi được, vui lòng gọi lễ tân." };

  const errors: Partial<Record<GuestField, string>> = {};
  if (!g.name) errors.name = "Vui lòng nhập họ tên.";
  if (!g.phone) errors.phone = "Vui lòng nhập số điện thoại.";
  else if (!isValidPhone(g.phone)) errors.phone = "Số điện thoại chưa đúng, ví dụ 0912 345 678.";
  if (g.email && !isValidEmail(g.email)) errors.email = "Email chưa đúng.";
  const guests = Number(g.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > 50) errors.guests = "Vui lòng chọn số khách.";
  if (g.agree !== "yes") errors.agree = "Vui lòng đồng ý với chính sách đặt phòng.";

  let promoCode = "";
  if (g.code) {
    promoCode = g.code.toUpperCase();
    const found = await d.prepare("select 1 from offers where active = 1 and upper(code) = ? limit 1").bind(promoCode).first();
    if (!found) errors.code = "Mã ưu đãi không đúng hoặc đã hết hạn.";
  }
  if (Object.keys(errors).length) return { ok: false, error: "Vui lòng kiểm tra lại các ô được đánh dấu.", errors };

  // Gộp các dòng trùng hạng phòng và hình thức
  const merged = new Map<string, CartLine>();
  for (const l of input.lines ?? []) {
    const qty = Math.floor(Number(l.qty));
    const stay: OnlineStay = l.stay === "overnight" ? "overnight" : "fullDay";
    if (!l.room || !(qty > 0)) continue;
    const key = `${l.room}:${stay}`;
    merged.set(key, { room: String(l.room), stay, qty: (merged.get(key)?.qty ?? 0) + qty });
  }
  const lines = [...merged.values()];
  const roomCount = lines.reduce((s, l) => s + l.qty, 0);
  if (!roomCount) return { ok: false, error: "Vui lòng chọn ít nhất một phòng.", refresh: true };
  if (roomCount > settings.maxRooms)
    return { ok: false, error: `Đặt online tối đa ${settings.maxRooms} phòng. Đi đông người vui lòng xin báo giá đoàn.` };

  const avail = await checkAvailability(d, checkIn, checkOut);
  const perType = new Map<string, number>();
  let capacity = 0;
  let total = 0;
  const items = [];
  for (const l of lines) {
    const type = avail[l.room];
    const plan = type?.plans[l.stay];
    if (!type || !plan) return { ok: false, error: "Giá phòng vừa thay đổi, vui lòng chọn lại.", refresh: true };
    perType.set(l.room, (perType.get(l.room) ?? 0) + l.qty);
    capacity += type.guests * l.qty;
    total += plan.total * l.qty;
    items.push({ roomType: type.id, stayType: l.stay, quantity: l.qty, amount: plan.total * l.qty });
  }
  for (const [slug, qty] of perType) {
    const left = Math.max(0, avail[slug].available);
    if (qty > left)
      return {
        ok: false,
        error: left ? `${avail[slug].name} chỉ còn ${left} phòng trống.` : `${avail[slug].name} vừa hết phòng.`,
        refresh: true,
      };
  }
  if (capacity < guests)
    return {
      ok: false,
      error: `Các phòng đã chọn ở tối đa ${capacity} người. Vui lòng chọn thêm phòng hoặc gọi lễ tân nếu muốn thêm người.`,
    };

  const booking = await insertBooking(d, {
    status: "pending",
    source: "website",
    checkIn,
    checkOut,
    items,
    guestName: g.name!,
    phone: normalizePhone(g.phone!),
    email: g.email || undefined,
    guests,
    arrivalTime: g.arrivalTime || undefined,
    promoCode: promoCode || undefined,
    note: g.note || undefined,
    total,
    deposit: Math.round((total * settings.depositPercent) / 100 / 1000) * 1000,
  });

  // Hai khách cùng đặt phòng cuối cùng: kiểm tra lại sau khi lưu, ai làm vượt số phòng thì huỷ đặt phòng đó
  const recheck = await checkAvailability(d, checkIn, checkOut);
  if ([...perType.keys()].some((slug) => recheck[slug].available < 0)) {
    await deleteBooking(d, booking.id);
    return { ok: false, error: "Phòng bạn chọn vừa có khách khác đặt. Vui lòng chọn lại.", refresh: true };
  }

  const code = booking.code;
  // Báo lễ tân sau khi đã trả kết quả cho khách
  opts.waitUntil(
    (async () => {
      const view = await findBooking(d, code);
      if (!view) return;
      await notifyFrontDesk(
        {
          kind: "online",
          bookingCode: code,
          name: view.guestName,
          phone: view.phone,
          checkIn,
          checkOut,
          nights: view.nights,
          guests: view.guests,
          room: view.items.map((i) => `${i.quantity} × ${i.name}`).join(", "),
          roomCount,
          code: promoCode,
          note: view.note,
          total: view.total,
        },
        summarizeBooking(view),
        opts.webhookUrl,
      );
    })(),
  );

  return { ok: true, code };
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

// Xử lý POST /api/booking/<op>. Trả null nếu không phải đường dẫn của API này.
export async function handleBookingApi(request: Request, d: D1Database, opts: BookingApiOptions): Promise<Response | null> {
  const op = new URL(request.url).pathname.match(/^\/api\/booking\/(search|create)\/?$/)?.[1];
  if (!op) return null;
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Dữ liệu không hợp lệ." }, 400);
  }
  try {
    if (op === "search") return json(await searchRooms(d, str(body.checkIn), str(body.checkOut)));
    return json(await createBooking(d, body as unknown as CreateBookingInput, opts));
  } catch (e) {
    console.error("[booking-api]", e);
    return json({ ok: false, error: "Hệ thống đang bận, vui lòng thử lại hoặc gọi lễ tân." }, 500);
  }
}
