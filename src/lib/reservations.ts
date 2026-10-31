// Đặt phòng phía server: phòng trống, giá theo ngày, đọc một đặt phòng theo mã, tạo đặt phòng.
// Các hàm nhận D1 làm tham số, không phụ thuộc Next.js: dùng được cả trong custom worker (worker.ts,
// chạy trước khi nạp Next.js nên rất nhẹ CPU) lẫn trong trang Next (truyền await db()).
// Đọc/ghi D1 trực tiếp mỗi lần gọi (không lưu đệm vì số phòng trống đổi theo từng đặt phòng), không qua Payload
// để vừa giới hạn CPU của Workers Free. Bảng theo cấu trúc Payload: bookings, bookings_items (_parent_id, _order),
// bookings_rels (path "items.N.rooms"), rate_rules, rate_rules_days, rate_rules_rels (path "roomTypes").
import { BLOCKING_STATUSES, newBookingCode, type BookingView, type RoomAvailability } from "./booking";
import { fromDbDate, nightsBetween, nightsOf, toDbDate } from "./dates";
import { num, rowId, str } from "./sql";

// available có thể âm khi đã bán quá số phòng (dùng để phát hiện hai khách đặt cùng lúc phòng cuối cùng)
export type TypeAvailability = RoomAvailability & { id: number; name: string; guests: number };

type Row = Record<string, unknown>;

async function batch<T extends unknown[]>(d: D1Database, ...stmts: D1PreparedStatement[]): Promise<{ [K in keyof T]: T[K][] }> {
  return (await d.batch(stmts)).map((r) => r.results) as { [K in keyof T]: T[K][] };
}
const roundPrice = (n: number) => Math.round(n / 1000) * 1000;
const blocking = BLOCKING_STATUSES.map(() => "?").join(", ");

export async function checkAvailability(d: D1Database, checkIn: string, checkOut: string): Promise<Record<string, TypeAvailability>> {
  const nights = nightsOf(checkIn, checkOut);
  if (!nights.length) return {};
  const first = nights[0];
  const last = nights[nights.length - 1];

  const [types, roomCounts, sold, rules, ruleDays, ruleTypes] = await batch<[Row, Row, Row, Row, Row, Row]>(d,
    d.prepare('select id, slug, name, guests, prices_full_day, prices_overnight from room_types order by "order", id'),
    d.prepare("select room_type_id, count(*) n from rooms where active = 1 group by room_type_id"),
    // Mục nghỉ giờ không giữ phòng qua đêm
    d
      .prepare(
        `select b.check_in, b.check_out, i.room_type_id, i.quantity from bookings b
         join bookings_items i on i._parent_id = b.id
         where b.status in (${blocking}) and b.check_in < ? and b.check_out > ? and i.stay_type <> 'hourly'`,
      )
      .bind(...BLOCKING_STATUSES, toDbDate(checkOut), toDbDate(checkIn)),
    d
      .prepare('select id, "from", "to", adjust, min_nights, closed from rate_rules where active = 1 and "from" <= ? and "to" >= ?')
      .bind(toDbDate(last), toDbDate(first)),
    d.prepare("select parent_id, value from rate_rules_days"),
    d.prepare("select parent_id, room_types_id from rate_rules_rels where path = 'roomTypes'"),
  );

  // Số phòng đã bán của từng hạng phòng theo từng đêm
  const soldBy = new Map<number, Map<string, number>>();
  for (const s of sold) {
    const booked = new Set(nightsOf(fromDbDate(str(s.check_in)), fromDbDate(str(s.check_out))));
    const typeId = num(s.room_type_id);
    const perNight = soldBy.get(typeId) ?? new Map<string, number>();
    for (const night of nights) if (booked.has(night)) perNight.set(night, (perNight.get(night) ?? 0) + num(s.quantity));
    soldBy.set(typeId, perNight);
  }

  const daysOf = (ruleId: unknown) => ruleDays.filter((x) => x.parent_id === ruleId).map((x) => str(x.value));
  const typesOf = (ruleId: unknown) => ruleTypes.filter((x) => x.parent_id === ruleId).map((x) => num(x.room_types_id));

  const result: Record<string, TypeAvailability> = {};
  for (const t of types) {
    const id = num(t.id);
    const total = num(roomCounts.find((r) => r.room_type_id === t.id)?.n);
    const maxSold = Math.max(0, ...(soldBy.get(id)?.values() ?? []));

    let closed = false;
    let minNights = 0;
    const adjust = nights.map((night) => {
      const weekday = String(new Date(`${night}T00:00:00Z`).getUTCDay());
      const applied = rules.filter((r) => {
        const days = daysOf(r.id);
        const forTypes = typesOf(r.id);
        return (
          fromDbDate(str(r.from)) <= night &&
          fromDbDate(str(r.to)) >= night &&
          (!days.length || days.includes(weekday)) &&
          (!forTypes.length || forTypes.includes(id))
        );
      });
      if (applied.some((r) => Number(r.closed))) closed = true;
      minNights = Math.max(minNights, ...applied.map((r) => num(r.min_nights)));
      return applied.reduce((sum, r) => sum + num(r.adjust), 0);
    });

    const entry: TypeAvailability = { id, name: str(t.name), guests: num(t.guests), available: closed ? 0 : total - maxSold, plans: {} };
    if (closed) entry.reason = "Ngừng nhận đặt online những ngày này, vui lòng gọi lễ tân.";
    else if (nights.length < minNights) entry.reason = `Những ngày này nhận đặt tối thiểu ${minNights} đêm.`;
    else {
      const fullDay = adjust.map((a) => roundPrice(num(t.prices_full_day) * (1 + a / 100)));
      entry.plans.fullDay = { nightly: fullDay, total: fullDay.reduce((s, n) => s + n, 0) };
      // Qua đêm (19:00 – 10:00) chỉ bán cho kỳ ở một đêm
      if (nights.length === 1) {
        const price = roundPrice(num(t.prices_overnight) * (1 + adjust[0] / 100));
        entry.plans.overnight = { nightly: [price], total: price };
      }
    }
    result[str(t.slug)] = entry;
  }
  return result;
}

// Đặt phòng theo mã, cho trang xác nhận của khách
export async function findBooking(d: D1Database, code: string): Promise<BookingView | null> {
  const b = await d.prepare("select * from bookings where code = ? limit 1").bind(code.toUpperCase()).first<Row>();
  if (!b) return null;
  const { results: items } = await d
    .prepare(
      `select i.stay_type, i.quantity, i.amount, t.name, t.slug from bookings_items i
       left join room_types t on t.id = i.room_type_id where i._parent_id = ? order by i._order`,
    )
    .bind(b.id)
    .all<Row>();
  return {
    code: str(b.code) || code,
    status: str(b.status),
    checkIn: fromDbDate(str(b.check_in)),
    checkOut: fromDbDate(str(b.check_out)),
    nights: num(b.nights),
    guestName: str(b.guest_name),
    phone: str(b.phone),
    email: str(b.email),
    guests: num(b.guests),
    arrivalTime: str(b.arrival_time),
    promoCode: str(b.promo_code),
    note: str(b.note),
    items: items.map((i) => ({ name: str(i.name), slug: str(i.slug), stayType: str(i.stay_type), quantity: num(i.quantity), amount: num(i.amount) })),
    total: num(b.total),
    deposit: num(b.deposit),
    paid: num(b.paid),
    createdAt: str(b.created_at),
  };
}

export type NewBooking = {
  status: string;
  source: string;
  checkIn: string;
  checkOut: string;
  items: { roomType: number; stayType: string; quantity: number; amount: number }[];
  guestName: string;
  phone: string;
  email?: string;
  guests: number;
  arrivalTime?: string;
  promoCode?: string;
  note?: string;
  total: number;
  deposit: number;
  // Ghi chú nội bộ cho lễ tân (khách không thấy), ví dụ giá niêm yết và khoản giảm
  staffNote?: string;
};

// Tạo đặt phòng (bản ghi + các dòng phòng) trong một lần ghi D1. Tự làm phần việc mà hook "prepare"
// của CMS: tạo mã đặt phòng, tính số đêm. Trả về id và mã.
export async function insertBooking(d: D1Database, b: NewBooking): Promise<{ id: number; code: string }> {
  const nights = nightsBetween(b.checkIn, b.checkOut) ?? 0;
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = newBookingCode();
    const now = new Date().toISOString();
    try {
      const [inserted] = await d.batch([
        d
          .prepare(
            `insert into bookings (code, status, source, check_in, check_out, nights, guest_name, phone, email, guests,
              arrival_time, promo_code, note, total, deposit, paid, staff_note, updated_at, created_at)
             values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?) returning id`,
          )
          .bind(
            code,
            b.status,
            b.source,
            toDbDate(b.checkIn),
            toDbDate(b.checkOut),
            nights,
            b.guestName,
            b.phone,
            b.email ?? null,
            b.guests,
            b.arrivalTime ?? null,
            b.promoCode ?? null,
            b.note ?? null,
            b.total,
            b.deposit,
            b.staffNote ?? null,
            now,
            now,
          ),
        ...b.items.map((item, i) =>
          d
            .prepare(
              `insert into bookings_items (_order, _parent_id, id, room_type_id, stay_type, quantity, amount)
               values (?, (select id from bookings where code = ?), ?, ?, ?, ?, ?)`,
            )
            .bind(i + 1, code, rowId(), item.roomType, item.stayType, item.quantity, item.amount),
        ),
      ]);
      return { id: num((inserted.results[0] as Row).id), code };
    } catch (e) {
      // Trùng mã (rất hiếm): tạo mã khác
      if (!String(e).includes("UNIQUE")) throw e;
    }
  }
  throw new Error("Không tạo được mã đặt phòng");
}

export async function deleteBooking(d: D1Database, id: number) {
  await d.batch([
    d.prepare("delete from bookings_rels where parent_id = ?").bind(id),
    d.prepare("delete from bookings_items where _parent_id = ?").bind(id),
    d.prepare("delete from bookings where id = ?").bind(id),
  ]);
}
