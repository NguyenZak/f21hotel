// API trang Báo cáo (Chủ, Quản lý): doanh thu 12 tháng, kênh đặt phòng, đêm phòng theo hạng phòng,
// công suất phòng 60 ngày qua và 30 ngày tới. Bốn câu SQL gộp một lần gọi D1; phần tính theo ngày làm trong JS (dưới 1 ms).
import { addDays, fromDbDate, nightsOf, todayInVietnam, toDbDate, toIsoDate } from "@/lib/dates";
import { num, str } from "@/lib/sql";
import { json, type CmsContext, type CmsUser } from "./http";

type Row = Record<string, unknown>;
type Ctx = { ctx: CmsContext; user: CmsUser; url: URL; request: Request; path: string[] };

// Đơn huỷ và khách không đến không tính doanh thu, không chiếm phòng
const LOST = "('cancelled', 'no_show')";
const plusDays = (iso: string, n: number) => toIsoDate(addDays(new Date(`${iso}T00:00:00`), n));

export type ReportData = {
  today: string;
  totalRooms: number;
  months: { month: string; revenue: number; bookings: number; lost: number; roomNights: number }[];
  sources: { source: string; bookings: number; revenue: number }[];
  roomTypes: { name: string; roomNights: number; revenue: number }[];
  occupancy: { day: string; sold: number; rate: number }[];
};

const reports = async ({ ctx }: Ctx) => {
  const d = ctx.d;
  const day = todayInVietnam();
  const [y, m] = day.split("-").map(Number);
  // 12 tháng tính theo ngày nhận phòng, gồm tháng này
  const start = toIsoDate(new Date(y, m - 12, 1));
  const end = toIsoDate(new Date(y, m, 1));
  const occFrom = plusDays(day, -59);
  const occTo = plusDays(day, 31);

  const [rooms, months, sources, types, stays] = await d.batch([
    d.prepare("select count(*) n from rooms where active = 1"),
    d
      .prepare(
        `select substr(b.check_in, 1, 7) m,
           sum(case when b.status in ${LOST} then 0 else 1 end) n,
           sum(case when b.status in ${LOST} then 1 else 0 end) lost,
           sum(case when b.status in ${LOST} then 0 else coalesce(b.total, 0) end) revenue,
           sum(case when b.status in ${LOST} then 0 else coalesce(b.nights, 0) * coalesce(q.qty, 1) end) rn
         from bookings b left join (select _parent_id, sum(quantity) qty from bookings_items group by _parent_id) q on q._parent_id = b.id
         where b.check_in >= ? and b.check_in < ? group by m`,
      )
      .bind(toDbDate(start), toDbDate(end)),
    d
      .prepare(`select source, count(*) n, sum(coalesce(total, 0)) revenue from bookings where check_in >= ? and check_in < ? and status not in ${LOST} group by source`)
      .bind(toDbDate(start), toDbDate(end)),
    d
      .prepare(
        `select rt.name, sum(i.quantity * coalesce(b.nights, 0)) rn, sum(coalesce(i.amount, 0)) revenue
         from bookings_items i join bookings b on b.id = i._parent_id join room_types rt on rt.id = i.room_type_id
         where b.check_in >= ? and b.check_in < ? and b.status not in ${LOST} group by rt.id, rt.name`,
      )
      .bind(toDbDate(start), toDbDate(end)),
    d
      .prepare(
        `select b.check_in, b.check_out, i.quantity from bookings b join bookings_items i on i._parent_id = b.id
         where b.status not in ${LOST} and b.check_in < ? and b.check_out > ? and i.stay_type <> 'hourly'`,
      )
      .bind(toDbDate(occTo), toDbDate(occFrom)),
  ]);

  const totalRooms = num((rooms.results[0] as Row)?.n);
  const byMonth = new Map((months.results as Row[]).map((r) => [str(r.m), r]));
  const monthList = Array.from({ length: 12 }, (_, k) => toIsoDate(new Date(y, m - 12 + k, 1)).slice(0, 7));
  const staysList = (stays.results as Row[]).map((s) => ({ from: fromDbDate(str(s.check_in)), to: fromDbDate(str(s.check_out)), q: num(s.quantity) }));

  const data: ReportData = {
    today: day,
    totalRooms,
    months: monthList.map((month) => {
      const r = byMonth.get(month);
      return { month, revenue: num(r?.revenue), bookings: num(r?.n), lost: num(r?.lost), roomNights: num(r?.rn) };
    }),
    sources: (sources.results as Row[])
      .map((r) => ({ source: str(r.source), bookings: num(r.n), revenue: num(r.revenue) }))
      .sort((a, b) => b.bookings - a.bookings),
    roomTypes: (types.results as Row[])
      .map((r) => ({ name: str(r.name), roomNights: num(r.rn), revenue: num(r.revenue) }))
      .sort((a, b) => b.roomNights - a.roomNights),
    occupancy: nightsOf(occFrom, occTo).map((night) => {
      const sold = staysList.filter((s) => s.from <= night && night < s.to).reduce((a, s) => a + s.q, 0);
      return { day: night, sold, rate: totalRooms ? Math.min(1, sold / totalRooms) : 0 };
    }),
  };
  return json({ ok: true, ...data });
};

export const reportRoutes = [{ method: "GET", match: (p: string[]) => p[0] === "reports" && p.length === 1, roles: ["owner", "manager"] as const, handler: reports }];
