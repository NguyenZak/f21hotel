// Đặt phòng phía server: phòng trống, giá theo ngày, đọc một đặt phòng theo mã.
// Đọc thẳng từ CMS mỗi lần gọi (không lưu đệm) vì số phòng trống đổi theo từng đặt phòng.
import config from "@payload-config";
import { getPayload } from "payload";
import { BLOCKING_STATUSES, type BookingView, type RoomAvailability } from "./booking";
import { fromDbDate, nightsOf, toDbDate } from "./dates";

// available có thể âm khi đã bán quá số phòng (dùng để phát hiện hai khách đặt cùng lúc phòng cuối cùng)
export type TypeAvailability = RoomAvailability & { id: number; name: string; guests: number };

const roundPrice = (n: number) => Math.round(n / 1000) * 1000;
const idOf = (v: number | { id: number } | null | undefined) => (v && typeof v === "object" ? v.id : v ?? undefined);

export async function checkAvailability(checkIn: string, checkOut: string): Promise<Record<string, TypeAvailability>> {
  const payload = await getPayload({ config });
  const nights = nightsOf(checkIn, checkOut);
  if (!nights.length) return {};
  const first = nights[0];
  const last = nights[nights.length - 1];

  const [types, rooms, bookings, rules] = await Promise.all([
    payload.find({ collection: "room-types", depth: 0, limit: 50, pagination: false }),
    payload.find({
      collection: "rooms",
      where: { active: { equals: true } },
      depth: 0,
      pagination: false,
      overrideAccess: true,
    }),
    payload.find({
      collection: "bookings",
      where: {
        and: [
          { status: { in: BLOCKING_STATUSES } },
          { checkIn: { less_than: toDbDate(checkOut) } },
          { checkOut: { greater_than: toDbDate(checkIn) } },
        ],
      },
      depth: 0,
      pagination: false,
      overrideAccess: true,
    }),
    payload.find({
      collection: "rate-rules",
      where: {
        and: [
          { active: { equals: true } },
          { from: { less_than_equal: toDbDate(last) } },
          { to: { greater_than_equal: toDbDate(first) } },
        ],
      },
      depth: 0,
      pagination: false,
      overrideAccess: true,
    }),
  ]);

  // Số phòng đã bán của từng hạng phòng theo từng đêm
  const sold = new Map<number, Map<string, number>>();
  for (const b of bookings.docs) {
    const bookedNights = new Set(nightsOf(fromDbDate(b.checkIn), fromDbDate(b.checkOut)));
    for (const item of b.items ?? []) {
      if (item.stayType === "hourly") continue;
      const typeId = idOf(item.roomType)!;
      const perNight = sold.get(typeId) ?? new Map<string, number>();
      for (const night of nights) {
        if (bookedNights.has(night)) perNight.set(night, (perNight.get(night) ?? 0) + (item.quantity ?? 0));
      }
      sold.set(typeId, perNight);
    }
  }

  const result: Record<string, TypeAvailability> = {};
  for (const t of types.docs) {
    const total = rooms.docs.filter((r) => idOf(r.roomType) === t.id).length;
    const maxSold = Math.max(0, ...(sold.get(t.id)?.values() ?? []));

    let closed = false;
    let minNights = 0;
    const adjust = nights.map((night) => {
      const weekday = String(new Date(`${night}T00:00:00Z`).getUTCDay());
      const applied = rules.docs.filter(
        (r) =>
          fromDbDate(r.from) <= night &&
          fromDbDate(r.to) >= night &&
          (!r.days?.length || r.days.includes(weekday as (typeof r.days)[number])) &&
          (!r.roomTypes?.length || r.roomTypes.some((x) => idOf(x) === t.id)),
      );
      if (applied.some((r) => r.closed)) closed = true;
      minNights = Math.max(minNights, ...applied.map((r) => r.minNights ?? 0));
      return applied.reduce((sum, r) => sum + (r.adjust ?? 0), 0);
    });

    const entry: TypeAvailability = {
      id: t.id,
      name: t.name,
      guests: t.guests,
      available: closed ? 0 : total - maxSold,
      plans: {},
    };
    if (closed) entry.reason = "Ngừng nhận đặt online những ngày này, vui lòng gọi lễ tân.";
    else if (nights.length < minNights) entry.reason = `Những ngày này nhận đặt tối thiểu ${minNights} đêm.`;
    else {
      const fullDay = adjust.map((a) => roundPrice(t.prices.fullDay * (1 + a / 100)));
      entry.plans.fullDay = { nightly: fullDay, total: fullDay.reduce((s, n) => s + n, 0) };
      // Qua đêm (19:00 – 10:00) chỉ bán cho kỳ ở một đêm
      if (nights.length === 1) {
        const price = roundPrice(t.prices.overnight * (1 + adjust[0] / 100));
        entry.plans.overnight = { nightly: [price], total: price };
      }
    }
    result[t.slug] = entry;
  }
  return result;
}

// Đặt phòng theo mã, cho trang xác nhận của khách
export async function findBooking(code: string): Promise<BookingView | null> {
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: "bookings",
    where: { code: { equals: code.toUpperCase() } },
    depth: 1,
    limit: 1,
    overrideAccess: true,
  });
  const b = res.docs[0];
  if (!b) return null;
  return {
    code: b.code ?? code,
    status: b.status,
    checkIn: fromDbDate(b.checkIn),
    checkOut: fromDbDate(b.checkOut),
    nights: b.nights ?? 0,
    guestName: b.guestName,
    phone: b.phone,
    email: b.email ?? "",
    guests: b.guests ?? 0,
    arrivalTime: b.arrivalTime ?? "",
    promoCode: b.promoCode ?? "",
    note: b.note ?? "",
    items: (b.items ?? []).map((i) => ({
      name: typeof i.roomType === "object" ? i.roomType.name : "",
      slug: typeof i.roomType === "object" ? i.roomType.slug : "",
      stayType: i.stayType,
      quantity: i.quantity,
      amount: i.amount ?? 0,
    })),
    total: b.total ?? 0,
    deposit: b.deposit ?? 0,
    paid: b.paid ?? 0,
    createdAt: b.createdAt,
  };
}
