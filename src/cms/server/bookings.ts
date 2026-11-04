// API vận hành của CMS mới: hôm nay, danh sách/chi tiết/tạo/sửa/xoá đặt phòng, lịch phòng.
// Đọc/ghi thẳng D1 theo cấu trúc bảng của Payload (bookings, bookings_items, bookings_rels path "items.N.rooms")
// (cấu trúc do CMS Payload tạo trước đây). Giữ đúng quy tắc đặt phòng của CMS cũ:
// mã đặt phòng, số đêm, tổng tiền mặc định, phòng gán đúng hạng / không quá số lượng / không trùng thời gian.
import { BLOCKING_STATUSES, BOOKING_SOURCES, BOOKING_STATUSES, EMAIL_KINDS, newBookingCode, type EmailKind } from "@/lib/booking";
import { autoConfirmEmail, bookingEmailLog, sendBookingEmail } from "@/lib/booking-emails";
import { addDays, fromDbDate, nightsBetween, nightsOf, todayInVietnam, toDbDate, toIsoDate } from "@/lib/dates";
import { checkAvailability } from "@/lib/reservations";
import { num, rowId, str } from "@/lib/sql";
import { audit, body, can, fail, json, type CmsContext, type CmsUser } from "./http";

type Row = Record<string, unknown>;
type Ctx = { ctx: CmsContext; user: CmsUser; url: URL; request: Request; path: string[] };

const STAYS = ["fullDay", "overnight", "hourly"] as const;
const STATUS_VALUES: string[] = BOOKING_STATUSES.map((s) => s.value);
const SOURCE_VALUES: string[] = BOOKING_SOURCES.map((s) => s.value);
const isoDate = /^\d{4}-\d{2}-\d{2}$/;
const plusDays = (iso: string, n: number) => toIsoDate(addDays(new Date(`${iso}T00:00:00`), n));
const marks = (n: number) => Array(n).fill("?").join(", ");

import type { BookingDTO, BookingItem } from "../types";
export type { BookingDTO, BookingItem };

// Đọc các đặt phòng theo điều kiện, kèm dòng phòng và phòng đã gán (3 câu SQL cho cả danh sách)
async function loadBookings(d: D1Database, where: string, binds: unknown[], tail = "order by b.created_at desc limit 50"): Promise<BookingDTO[]> {
  const { results: rows } = await d.prepare(`select b.* from bookings b ${where ? `where ${where}` : ""} ${tail}`).bind(...binds).all<Row>();
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);
  const [items, rels] = await d.batch([
    d
      .prepare(
        `select i._parent_id, i._order, i.room_type_id, i.stay_type, i.quantity, i.amount, t.name as type_name
         from bookings_items i left join room_types t on t.id = i.room_type_id
         where i._parent_id in (${marks(ids.length)}) order by i._parent_id, i._order`,
      )
      .bind(...ids),
    d.prepare(`select parent_id, path, rooms_id from bookings_rels where parent_id in (${marks(ids.length)}) order by "order"`).bind(...ids),
  ]);
  return rows.map((b) => {
    const mine = (items.results as Row[]).filter((i) => i._parent_id === b.id);
    return {
      id: num(b.id),
      code: str(b.code),
      status: str(b.status),
      source: str(b.source),
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
      total: num(b.total),
      deposit: num(b.deposit),
      paid: num(b.paid),
      staffNote: str(b.staff_note),
      externalRef: str(b.external_ref),
      dataConsentAt: str(b.data_consent_at),
      marketingConsent: num(b.marketing_consent) === 1,
      createdAt: str(b.created_at),
      items: mine.map((i, idx) => ({
        roomType: num(i.room_type_id),
        roomTypeName: str(i.type_name),
        stayType: str(i.stay_type),
        quantity: num(i.quantity, 1),
        amount: i.amount === null ? null : num(i.amount),
        rooms: (rels.results as Row[]).filter((r) => r.parent_id === b.id && r.path === `items.${idx}.rooms`).map((r) => num(r.rooms_id)),
      })),
    };
  });
}

// ---------- Hôm nay ----------

const today: (r: Ctx) => Promise<Response> = async ({ ctx, user }) => {
  const d = ctx.d;
  const day = todayInVietnam();
  const dbDay = toDbDate(day);
  const [arrivals, departures, pending, counts, avail, roomCounts] = await Promise.all([
    loadBookings(d, "b.check_in = ? and b.status in ('pending', 'confirmed', 'checked_in')", [dbDay], "order by b.arrival_time, b.id"),
    loadBookings(d, "b.check_out = ? and b.status in ('confirmed', 'checked_in', 'checked_out')", [dbDay], "order by b.id"),
    loadBookings(d, "b.status = 'pending'", [], "order by b.created_at desc limit 8"),
    d
      .prepare("select sum(status = 'pending') pending, sum(status = 'checked_in') in_house from bookings")
      .first<Row>(),
    checkAvailability(d, day, plusDays(day, 1)),
    d.prepare("select room_type_id, count(*) n from rooms where active = 1 group by room_type_id").all<Row>(),
  ]);
  const availability = Object.values(avail).map((t) => ({
    id: t.id,
    name: t.name,
    available: Math.max(0, t.available),
    total: num(roomCounts.results.find((r) => r.room_type_id === t.id)?.n),
  }));
  return json({
    ok: true,
    today: day,
    arrivals,
    departures,
    pending,
    pendingCount: num(counts?.pending),
    inHouse: num(counts?.in_house),
    availability,
    outlook: can(user, "owner", "manager") ? await outlook(d, day) : null,
  });
};

// Công suất 7 đêm tới, doanh thu dự kiến và kênh đặt phòng trong tháng (Chủ, Quản lý)
async function outlook(d: D1Database, day: string) {
  const end = plusDays(day, 7);
  const monthStart = `${day.slice(0, 7)}-01`;
  const [y, m] = day.split("-").map(Number);
  const nextMonth = toIsoDate(new Date(y, m, 1));
  const [rooms, sold, month] = await d.batch([
    d.prepare("select count(*) n from rooms where active = 1"),
    d
      .prepare(
        `select b.check_in, b.check_out, i.quantity from bookings b join bookings_items i on i._parent_id = b.id
         where b.status in (${marks(BLOCKING_STATUSES.length)}) and b.check_in < ? and b.check_out > ? and i.stay_type <> 'hourly'`,
      )
      .bind(...BLOCKING_STATUSES, toDbDate(end), toDbDate(day)),
    d
      .prepare("select source, count(*) n, sum(coalesce(total, 0)) revenue from bookings where check_in >= ? and check_in < ? and status not in ('cancelled', 'no_show') group by source")
      .bind(toDbDate(monthStart), toDbDate(nextMonth)),
  ]);
  const total = num((rooms.results[0] as Row)?.n);
  const nights = nightsOf(day, end).map((night) => {
    const n = (sold.results as Row[])
      .filter((s) => fromDbDate(str(s.check_in)) <= night && night < fromDbDate(str(s.check_out)))
      .reduce((a, s) => a + num(s.quantity), 0);
    return { night, sold: n, rate: total ? Math.min(1, n / total) : 0 };
  });
  const bySource = (month.results as Row[]).map((r) => ({ source: str(r.source), count: num(r.n), revenue: num(r.revenue) }));
  return {
    totalRooms: total,
    nights,
    revenue: bySource.reduce((a, s) => a + s.revenue, 0),
    monthCount: bySource.reduce((a, s) => a + s.count, 0),
    sources: bySource.sort((a, b) => b.count - a.count),
  };
}

// ---------- Danh sách, chi tiết ----------

const FILTERS: Record<string, (day: string) => [string, unknown[]]> = {
  all: () => ["", []],
  pending: () => ["b.status = 'pending'", []],
  arrivals: (day) => ["b.check_in = ? and b.status not in ('cancelled', 'no_show')", [toDbDate(day)]],
  departures: (day) => ["b.check_out = ? and b.status not in ('cancelled', 'no_show')", [toDbDate(day)]],
  inhouse: () => ["b.status = 'checked_in'", []],
  upcoming: (day) => ["b.check_in > ? and b.status in ('pending', 'confirmed')", [toDbDate(day)]],
};

const listBookings: (r: Ctx) => Promise<Response> = async ({ ctx, url }) => {
  const filter = FILTERS[url.searchParams.get("filter") ?? "all"] ?? FILTERS.all;
  const [where, binds] = filter(todayInVietnam());
  const q = str(url.searchParams.get("q")).trim();
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const conds = [where, q ? "(b.code like ? or b.guest_name like ? or b.phone like ?)" : ""].filter(Boolean).join(" and ");
  const qb = q ? [`%${q.toUpperCase()}%`, `%${q}%`, `%${q.replace(/\D/g, "") || q}%`] : [];
  const order = url.searchParams.get("filter") === "upcoming" || url.searchParams.get("filter") === "arrivals" ? "b.check_in, b.id" : "b.created_at desc";
  const bookings = await loadBookings(ctx.d, conds, [...binds, ...qb], `order by ${order} limit 31 offset ${(page - 1) * 30}`);
  return json({ ok: true, bookings: bookings.slice(0, 30), more: bookings.length > 30 });
};

const getBooking: (r: Ctx) => Promise<Response> = async ({ ctx, path }) => {
  const id = Number(path[1]);
  const [[b], emails] = await Promise.all([loadBookings(ctx.d, "b.id = ?", [id], "limit 1"), bookingEmailLog(ctx.d, id)]);
  return b ? json({ ok: true, booking: b, emails, canEmail: Boolean(ctx.mail) }) : fail(404, "Không tìm thấy đặt phòng.");
};

// Hạng phòng và phòng (cho form đặt phòng, lịch phòng)
const meta: (r: Ctx) => Promise<Response> = async ({ ctx }) => {
  const [types, rooms, settings] = await ctx.d.batch([
    ctx.d.prepare('select id, name, slug, guests, prices_full_day, prices_overnight, prices_hourly from room_types order by "order", id'),
    ctx.d.prepare("select id, number, floor, room_type_id, active from rooms order by number"),
    ctx.d.prepare("select booking_deposit_percent from site_settings limit 1"),
  ]);
  return json({
    ok: true,
    roomTypes: (types.results as Row[]).map((t) => ({
      id: num(t.id),
      name: str(t.name),
      guests: num(t.guests),
      prices: { fullDay: num(t.prices_full_day), overnight: num(t.prices_overnight), hourly: num(t.prices_hourly) },
    })),
    rooms: (rooms.results as Row[]).map((r) => ({ id: num(r.id), number: str(r.number), floor: num(r.floor), roomType: num(r.room_type_id), active: Boolean(num(r.active, 1)) })),
    depositPercent: num((settings.results[0] as Row)?.booking_deposit_percent, 50),
  });
};

// Phòng đang bận trong khoảng ngày (để form gán phòng đánh dấu phòng không chọn được)
const busyRooms: (r: Ctx) => Promise<Response> = async ({ ctx, url }) => {
  const checkIn = str(url.searchParams.get("checkIn"));
  const checkOut = str(url.searchParams.get("checkOut"));
  const exclude = Number(url.searchParams.get("exclude")) || 0;
  if (!isoDate.test(checkIn) || !isoDate.test(checkOut)) return fail(400, "Ngày không hợp lệ.");
  const { results } = await ctx.d
    .prepare(
      `select r.rooms_id, b.code from bookings_rels r join bookings b on b.id = r.parent_id
       where r.rooms_id is not null and b.id <> ? and b.status in (${marks(BLOCKING_STATUSES.length)})
       and b.check_in < ? and b.check_out > ?`,
    )
    .bind(exclude, ...BLOCKING_STATUSES, toDbDate(checkOut), toDbDate(checkIn))
    .all<Row>();
  return json({ ok: true, busy: results.map((r) => ({ room: num(r.rooms_id), code: str(r.code) })) });
};

// ---------- Tạo, sửa, xoá ----------

// Đơn vừa chuyển sang "Đã xác nhận" (hoặc tạo mới ở trạng thái đó): tự gửi email xác nhận cho khách có email,
// trừ đơn OTA (OTA đã gửi) và đơn đã trả phòng. Gửi sau khi trả kết quả cho CMS. Trả về email sẽ nhận, "" nếu không gửi.
function emailOnConfirm(ctx: CmsContext, user: CmsUser, id: number | undefined, before: string | null, v: BookingDTO) {
  const to = str(v.email).trim();
  if (!id || !ctx.mail || !to || before === "confirmed" || v.status !== "confirmed") return "";
  if (!autoConfirmEmail(v.source) || v.checkOut <= todayInVietnam()) return "";
  ctx.waitUntil(sendBookingEmail(ctx.d, ctx.mail, id, "confirmed", { once: true, userId: user.id }));
  return to;
}

type Input = Partial<Omit<BookingDTO, "items" | "id" | "code" | "createdAt" | "nights">> & { items?: BookingItem[] };

// Kiểm tra dữ liệu và quy tắc phòng; trả về lỗi (chuỗi) hoặc bản ghi đã chuẩn hoá
async function validate(d: D1Database, input: Input, current: BookingDTO | null): Promise<string | (BookingDTO & { nights: number })> {
  const m = { ...(current ?? ({} as BookingDTO)), ...input } as BookingDTO;
  if (!STATUS_VALUES.includes(m.status)) return "Trạng thái không hợp lệ.";
  if (!SOURCE_VALUES.includes(m.source)) return "Chọn kênh đặt phòng.";
  if (!str(m.guestName).trim()) return "Nhập họ tên khách.";
  if (!str(m.phone).trim()) return "Nhập số điện thoại khách.";
  if (!isoDate.test(m.checkIn) || !isoDate.test(m.checkOut)) return "Chọn ngày nhận và trả phòng.";
  const items = (m.items ?? []).map((i) => ({
    roomType: Number(i.roomType),
    stayType: str(i.stayType),
    quantity: Math.floor(Number(i.quantity)),
    amount: i.amount === null || i.amount === undefined || (i.amount as unknown) === "" ? null : Math.max(0, Math.round(Number(i.amount))),
    rooms: [...new Set((i.rooms ?? []).map(Number).filter(Boolean))],
  }));
  if (!items.length) return "Thêm ít nhất một dòng phòng.";
  if (items.some((i) => !i.roomType || !(STAYS as readonly string[]).includes(i.stayType) || !(i.quantity >= 1))) return "Kiểm tra lại hạng phòng, hình thức và số phòng.";
  const hourlyOnly = items.every((i) => i.stayType === "hourly");
  const nights = nightsBetween(m.checkIn, m.checkOut);
  if (!nights && !(hourlyOnly && m.checkIn === m.checkOut)) return "Ngày trả phòng phải sau ngày nhận phòng.";

  const assigned = items.flatMap((i) => i.rooms);
  if (m.status === "checked_in" && items.some((i) => i.rooms.length < i.quantity)) return "Gán đủ số phòng trước khi nhận phòng.";
  if (assigned.length && BLOCKING_STATUSES.includes(m.status)) {
    const { results: rooms } = await d.prepare(`select id, number, room_type_id from rooms where id in (${marks(assigned.length)})`).bind(...assigned).all<Row>();
    for (const i of items) {
      if (i.rooms.length > i.quantity) return "Số phòng gán nhiều hơn số lượng đặt.";
      for (const id of i.rooms) {
        const room = rooms.find((r) => r.id === id);
        if (!room) return "Phòng đã gán không còn tồn tại.";
        if (num(room.room_type_id) !== i.roomType) return `Phòng ${str(room.number)} không thuộc hạng phòng đã chọn.`;
      }
    }
    const { results: clash } = await d
      .prepare(
        `select r.rooms_id, b.code from bookings_rels r join bookings b on b.id = r.parent_id
         where r.rooms_id in (${marks(assigned.length)}) and b.id <> ? and b.status in (${marks(BLOCKING_STATUSES.length)})
         and b.check_in < ? and b.check_out > ? limit 1`,
      )
      .bind(...assigned, current?.id ?? 0, ...BLOCKING_STATUSES, toDbDate(m.checkOut), toDbDate(m.checkIn))
      .all<Row>();
    if (clash.length) {
      const room = rooms.find((r) => r.id === clash[0].rooms_id);
      return `Phòng ${str(room?.number)} đã gán cho đặt phòng ${str(clash[0].code)} trong cùng thời gian.`;
    }
  }
  const total = input.total === undefined || input.total === null || (input.total as unknown) === "" ? items.reduce((s, i) => s + (i.amount ?? 0), 0) : Math.max(0, Math.round(Number(input.total)));
  return {
    ...m,
    guestName: str(m.guestName).trim(),
    phone: str(m.phone).replace(/[\s.\-()]/g, ""),
    nights: nights ?? 0,
    items,
    total: input.total === undefined && current ? (current.total ?? total) : total,
    deposit: Math.max(0, Math.round(num(m.deposit))),
    paid: Math.max(0, Math.round(num(m.paid))),
    guests: Math.max(1, Math.round(num(m.guests, 2))),
  };
}

const COLS = ["status", "source", "check_in", "check_out", "nights", "guest_name", "phone", "email", "guests", "arrival_time", "promo_code", "note", "total", "deposit", "paid", "staff_note", "external_ref"];
const values = (b: BookingDTO) => [
  b.status, b.source, toDbDate(b.checkIn), toDbDate(b.checkOut), b.nights, b.guestName, b.phone, b.email || null, b.guests,
  b.arrivalTime || null, b.promoCode || null, b.note || null, b.total, b.deposit, b.paid, b.staffNote || null, b.externalRef || null,
];

// Ghi lại các dòng phòng và phòng đã gán (xoá cũ, chèn mới) theo cấu trúc Payload
const itemStatements = (d: D1Database, parent: string, parentBind: unknown, items: BookingItem[]) => [
  d.prepare(`delete from bookings_rels where parent_id = ${parent}`).bind(parentBind),
  d.prepare(`delete from bookings_items where _parent_id = ${parent}`).bind(parentBind),
  ...items.map((i, idx) =>
    d
      .prepare(`insert into bookings_items (_order, _parent_id, id, room_type_id, stay_type, quantity, amount) values (?, ${parent}, ?, ?, ?, ?, ?)`)
      .bind(idx + 1, parentBind, rowId(), i.roomType, i.stayType, i.quantity, i.amount),
  ),
  ...items.flatMap((i, idx) =>
    i.rooms.map((room, k) =>
      d.prepare(`insert into bookings_rels ("order", parent_id, path, rooms_id) values (?, ${parent}, ?, ?)`).bind(k + 1, parentBind, `items.${idx}.rooms`, room),
    ),
  ),
];

const createBooking: (r: Ctx) => Promise<Response> = async ({ ctx, user, request }) => {
  const input = await body<Input>(request);
  if (!input) return fail(400, "Dữ liệu không hợp lệ.");
  const v = await validate(ctx.d, { status: "confirmed", source: "phone", ...input }, null);
  if (typeof v === "string") return fail(400, v);
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = newBookingCode();
    const now = new Date().toISOString();
    try {
      await ctx.d.batch([
        ctx.d
          .prepare(`insert into bookings (code, ${COLS.join(", ")}, updated_at, created_at) values (?, ${marks(COLS.length)}, ?, ?)`)
          .bind(code, ...values(v), now, now),
        ...itemStatements(ctx.d, "(select id from bookings where code = ?)", code, v.items).slice(2),
      ]);
      const created = await ctx.d.prepare("select id from bookings where code = ?").bind(code).first<{ id: number }>();
      await audit(ctx, user, "create", "bookings", created?.id, code);
      return json({ ok: true, id: created?.id, code, emailed: emailOnConfirm(ctx, user, created?.id, null, v) });
    } catch (e) {
      if (!String(e).includes("UNIQUE")) throw e;
    }
  }
  return fail(500, "Không tạo được mã đặt phòng, thử lại.");
};

const updateBooking: (r: Ctx) => Promise<Response> = async ({ ctx, user, request, path }) => {
  const id = Number(path[1]);
  const [current] = await loadBookings(ctx.d, "b.id = ?", [id], "limit 1");
  if (!current) return fail(404, "Không tìm thấy đặt phòng.");
  const input = await body<Input>(request);
  if (!input) return fail(400, "Dữ liệu không hợp lệ.");
  const v = await validate(ctx.d, input, current);
  if (typeof v === "string") return fail(400, v);
  await ctx.d.batch([
    ctx.d
      .prepare(`update bookings set ${COLS.map((c) => `${c} = ?`).join(", ")}, updated_at = ? where id = ?`)
      .bind(...values(v), new Date().toISOString(), id),
    ...(input.items ? itemStatements(ctx.d, "?", id, v.items) : []),
  ]);
  await audit(ctx, user, "update", "bookings", id, current.code);
  return json({ ok: true, emailed: emailOnConfirm(ctx, user, id, current.status, v) });
};

// Gửi (lại) một email cho khách từ CMS, chờ kết quả để báo nhân viên
const emailBooking: (r: Ctx) => Promise<Response> = async ({ ctx, user, request, path }) => {
  const id = Number(path[1]);
  const kind = str((await body<{ kind?: string }>(request))?.kind) as EmailKind;
  if (!Object.hasOwn(EMAIL_KINDS, kind)) return fail(400, "Chọn loại email.");
  const result = await sendBookingEmail(ctx.d, ctx.mail, id, kind, { userId: user.id });
  if (!result.ok) return fail(400, result.error);
  return json({ ok: true, emails: await bookingEmailLog(ctx.d, id) });
};

const deleteBooking: (r: Ctx) => Promise<Response> = async ({ ctx, user, path }) => {
  const id = Number(path[1]);
  const row = await ctx.d.prepare("select code from bookings where id = ?").bind(id).first<{ code: string }>();
  if (!row) return fail(404, "Không tìm thấy đặt phòng.");
  await ctx.d.batch([
    ...itemStatements(ctx.d, "?", id, []),
    ctx.d.prepare("delete from payload_locked_documents_rels where bookings_id = ?").bind(id),
    ctx.d.prepare("delete from booking_emails where booking_id = ?").bind(id),
    ctx.d.prepare("delete from bookings where id = ?").bind(id),
  ]);
  await audit(ctx, user, "delete", "bookings", id, row.code);
  return json({ ok: true });
};

// ---------- Lịch phòng ----------

const calendar: (r: Ctx) => Promise<Response> = async ({ ctx, url }) => {
  const from = isoDate.test(str(url.searchParams.get("from"))) ? str(url.searchParams.get("from")) : todayInVietnam();
  const days = Math.min(31, Math.max(7, Number(url.searchParams.get("days")) || 14));
  const to = plusDays(from, days);
  // check_out >= from (không phải >) để lấy cả đơn nghỉ giờ trong ngày đầu
  const bookings = await loadBookings(
    ctx.d,
    "b.status not in ('cancelled', 'no_show') and b.check_in < ? and b.check_out >= ?",
    [toDbDate(to), toDbDate(from)],
    "order by b.check_in limit 500",
  );
  return json({ ok: true, from, days, bookings });
};

export const bookingRoutes = [
  { method: "GET", match: (p: string[]) => p[0] === "today", handler: today },
  { method: "GET", match: (p: string[]) => p[0] === "meta", handler: meta },
  { method: "GET", match: (p: string[]) => p[0] === "busy-rooms", handler: busyRooms },
  { method: "GET", match: (p: string[]) => p[0] === "calendar", handler: calendar },
  { method: "GET", match: (p: string[]) => p[0] === "bookings" && p.length === 1, handler: listBookings },
  { method: "POST", match: (p: string[]) => p[0] === "bookings" && p.length === 1, handler: createBooking },
  { method: "GET", match: (p: string[]) => p[0] === "bookings" && p.length === 2, handler: getBooking },
  { method: "PATCH", match: (p: string[]) => p[0] === "bookings" && p.length === 2, handler: updateBooking },
  { method: "POST", match: (p: string[]) => p[0] === "bookings" && p.length === 3 && p[2] === "email", handler: emailBooking },
  { method: "DELETE", match: (p: string[]) => p[0] === "bookings" && p.length === 2, roles: ["owner", "manager"] as const, handler: deleteBooking },
];
