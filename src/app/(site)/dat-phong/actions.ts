"use server";

import { after } from "next/server";
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
} from "@/lib/booking";
import { getBookingSettings, getOffers, type BookingSettings } from "@/lib/cms";
import { addDays, nightsBetween, todayInVietnam, toIsoDate } from "@/lib/dates";
import { notifyFrontDesk } from "@/lib/notify";
import { checkAvailability, deleteBooking, findBooking, insertBooking } from "@/lib/reservations";

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

function dateError(checkIn: string, checkOut: string, settings: BookingSettings) {
  if (!isoDate.test(checkIn) || !isoDate.test(checkOut)) return "Vui lòng chọn ngày nhận và trả phòng.";
  const today = todayInVietnam();
  if (checkIn < today) return "Ngày nhận phòng đã qua, vui lòng chọn lại.";
  if (checkIn > toIsoDate(addDays(new Date(`${today}T00:00`), 365))) return "Website nhận đặt trước tối đa một năm.";
  const nights = nightsBetween(checkIn, checkOut);
  if (!nights) return "Ngày trả phòng phải sau ngày nhận phòng.";
  if (nights > settings.maxNights) return `Đặt online tối đa ${settings.maxNights} đêm. Ở dài hơn vui lòng gọi lễ tân để được giảm giá.`;
  return null;
}

export async function searchRooms(checkIn: string, checkOut: string): Promise<SearchResult> {
  const settings = await getBookingSettings();
  if (!settings.enabled) return { ok: false, error: "Website tạm ngừng nhận đặt phòng, vui lòng gọi lễ tân." };
  const error = dateError(checkIn, checkOut, settings);
  if (error) return { ok: false, error };

  const avail = await checkAvailability(checkIn, checkOut);
  const rooms = Object.fromEntries(
    Object.entries(avail).map(([slug, a]) => [slug, { available: Math.max(0, a.available), plans: a.plans, reason: a.reason }]),
  );
  return { ok: true, checkIn, checkOut, nights: nightsBetween(checkIn, checkOut)!, rooms, depositPercent: settings.depositPercent };
}

type GuestInput = Partial<Record<GuestField | "website", string>>;

export async function createBooking(input: {
  checkIn: string;
  checkOut: string;
  lines: CartLine[];
  guest: GuestInput;
}): Promise<CreateBookingResult> {
  const settings = await getBookingSettings();
  if (!settings.enabled) return { ok: false, error: "Website tạm ngừng nhận đặt phòng, vui lòng gọi lễ tân." };
  const { checkIn, checkOut } = input;
  const dateErr = dateError(checkIn, checkOut, settings);
  if (dateErr) return { ok: false, error: dateErr, refresh: true };

  const g = Object.fromEntries(
    Object.entries(input.guest ?? {}).map(([k, v]) => [k, String(v ?? "").trim().slice(0, k === "note" ? 1000 : 120)]),
  ) as GuestInput;
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
    const offers = await getOffers();
    if (!offers.some((o) => o.code?.toUpperCase() === promoCode)) errors.code = "Mã ưu đãi không đúng hoặc đã hết hạn.";
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

  const avail = await checkAvailability(checkIn, checkOut);
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

  const booking = await insertBooking({
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
  const recheck = await checkAvailability(checkIn, checkOut);
  if ([...perType.keys()].some((slug) => recheck[slug].available < 0)) {
    await deleteBooking(booking.id);
    return { ok: false, error: "Phòng bạn chọn vừa có khách khác đặt. Vui lòng chọn lại.", refresh: true };
  }

  const code = booking.code;
  // Báo lễ tân sau khi đã trả kết quả cho khách
  after(async () => {
    const view = await findBooking(code);
    if (view)
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
      );
  });

  return { ok: true, code };
}
