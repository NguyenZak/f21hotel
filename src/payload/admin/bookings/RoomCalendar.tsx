// Trang "Lịch phòng" trong CMS (/admin/lich-phong): mỗi dòng một phòng, mỗi cột một đêm.
// Đặt phòng đã gán số phòng hiện thành thanh trên dòng của phòng đó; phòng chưa gán số được đếm
// ở dòng "Chưa gán" của từng hạng phòng (đặt phòng online lúc đầu chỉ có hạng phòng và số lượng).
import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { AdminViewServerProps } from "payload";
import type { CSSProperties } from "react";
import { BLOCKING_STATUSES, statusLabel } from "@/lib/booking";
import { fromDbDate, nightsOf, todayInVietnam, toDbDate } from "@/lib/dates";
import type { Booking, Room, RoomType } from "@/payload-types";
import { plusDays } from "../dashboard/data";
import { CalendarStepNav } from "./CalendarStepNav";

const DAYS = 14;
const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const idOf = (v: number | { id: number } | null | undefined) => (v && typeof v === "object" ? v.id : v ?? undefined);
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

type Bar = { booking: Booking; start: number; span: number; hourly: boolean };

export async function RoomCalendar({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, locale, permissions, visibleEntities } = initPageResult;
  if (!req.user) redirect("/admin/login?redirect=%2Fadmin%2Flich-phong");

  const today = todayInVietnam();
  const fromParam = typeof searchParams?.from === "string" ? searchParams.from : "";
  const start = isoDate.test(fromParam) ? fromParam : today;
  const end = plusDays(start, DAYS);
  const days = nightsOf(start, end);
  const col = (iso: string) => days.indexOf(iso);

  const [types, rooms, bookings] = await Promise.all([
    req.payload.find({ collection: "room-types", sort: "order", depth: 0, pagination: false, req, overrideAccess: false }),
    req.payload.find({ collection: "rooms", where: { active: { equals: true } }, sort: "number", depth: 0, pagination: false, req, overrideAccess: false }),
    req.payload.find({
      collection: "bookings",
      // checkOut >= start (không phải >) để lấy cả đơn nghỉ giờ trong ngày đầu, khi checkIn = checkOut
      where: {
        and: [
          { status: { not_in: ["cancelled", "no_show"] } },
          { checkIn: { less_than: toDbDate(end) } },
          { checkOut: { greater_than_equal: toDbDate(start) } },
        ],
      },
      depth: 0,
      pagination: false,
      req,
      overrideAccess: false,
    }),
  ]);

  // Thanh đặt phòng theo từng phòng đã gán
  const barsByRoom = new Map<number, Bar[]>();
  // Số phòng chưa gán theo hạng phòng và đêm (chỉ các trạng thái còn giữ phòng, không tính nghỉ giờ)
  const unassigned = new Map<number, number[]>();
  const unassignedBookings: Booking[] = [];

  for (const b of bookings.docs) {
    const ci = fromDbDate(b.checkIn);
    const co = fromDbDate(b.checkOut);
    for (const item of b.items) {
      const hourly = item.stayType === "hourly" || ci === co;
      const first = Math.max(0, col(ci) === -1 ? (ci < start ? 0 : DAYS) : col(ci));
      const last = hourly ? first + 1 : col(co) === -1 ? (co > start ? DAYS : 0) : col(co);
      if (last <= first || first >= DAYS) continue;
      const assigned = (item.rooms ?? []).map((r) => idOf(r)).filter((x): x is number => typeof x === "number");
      for (const roomId of assigned) {
        const list = barsByRoom.get(roomId) ?? [];
        list.push({ booking: b, start: first, span: last - first, hourly });
        barsByRoom.set(roomId, list);
      }
      const missing = Math.max(0, item.quantity - assigned.length);
      if (missing && BLOCKING_STATUSES.includes(b.status)) {
        if (!unassignedBookings.includes(b)) unassignedBookings.push(b);
        if (hourly) continue;
        const typeId = idOf(item.roomType as number | RoomType)!;
        const counts = unassigned.get(typeId) ?? Array<number>(DAYS).fill(0);
        for (let d = first; d < last; d++) counts[d] += missing;
        unassigned.set(typeId, counts);
      }
    }
  }

  const grid = { "--days": DAYS } as CSSProperties;
  const nav = (iso: string, label: string) => (
    <Link className="f21-cal__nav" href={`/admin/lich-phong?from=${iso}`}>
      {label}
    </Link>
  );

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={req.user ?? undefined}
      visibleEntities={visibleEntities}
    >
      <CalendarStepNav />
      <Gutter className="f21-cal-page">
        <header className="f21-cal__head">
          <h1>Lịch phòng</h1>
          <div className="f21-cal__tools">
            {nav(plusDays(start, -7), "← 7 ngày")}
            {start !== today ? nav(today, "Hôm nay") : null}
            {nav(plusDays(start, 7), "7 ngày →")}
            <Link className="btn btn--style-primary btn--size-small f21-cal__new" href="/admin/collections/bookings/create">
              + Đặt phòng mới
            </Link>
          </div>
        </header>
        <p className="f21-cal__legend">
          {["pending", "confirmed", "checked_in", "checked_out"].map((s) => (
            <span key={s} className={`f21-status f21-status--${s}`}>
              {statusLabel(s)}
            </span>
          ))}
          <span className="f21-cal__legend-note">Bấm vào thanh để mở đặt phòng. Đơn nghỉ giờ có chữ “giờ”.</span>
        </p>

        <div className="f21-cal" style={grid}>
          <div className="f21-cal__row f21-cal__row--head">
            <div className="f21-cal__label">Phòng</div>
            {days.map((d) => {
              const wd = new Date(`${d}T00:00:00Z`).getUTCDay();
              return (
                <div key={d} className={`f21-cal__day${d === today ? " is-today" : ""}${wd === 0 || wd === 6 ? " is-weekend" : ""}`}>
                  <span>{WEEKDAYS[wd]}</span>
                  <b>
                    {d.slice(8, 10)}/{d.slice(5, 7)}
                  </b>
                </div>
              );
            })}
          </div>

          {types.docs.map((t) => {
            const typeRooms = rooms.docs.filter((r: Room) => idOf(r.roomType) === t.id);
            const counts = unassigned.get(t.id);
            return (
              <section key={t.id} className="f21-cal__group">
                <div className="f21-cal__type">
                  {t.name} <small>{typeRooms.length} phòng</small>
                </div>
                {typeRooms.map((r) => (
                  <div key={r.id} className="f21-cal__row">
                    <div className="f21-cal__label">
                      <b>{r.number}</b>
                      <small>Tầng {r.floor}</small>
                    </div>
                    {days.map((d, i) => (
                      <div key={d} className={`f21-cal__cell${d === today ? " is-today" : ""}`} style={{ gridColumn: i + 2 }} />
                    ))}
                    {(barsByRoom.get(r.id) ?? []).map(({ booking: b, start: s, span, hourly }) => (
                      <Link
                        key={`${b.id}-${s}`}
                        href={`/admin/collections/bookings/${b.id}`}
                        className={`f21-cal__bar f21-status--${b.status}`}
                        style={{ gridColumn: `${s + 2} / span ${span}` }}
                        title={`${b.guestName} · ${statusLabel(b.status)} · ${b.code ?? ""}`}
                      >
                        {hourly ? <em>giờ</em> : null}
                        {b.guestName}
                      </Link>
                    ))}
                  </div>
                ))}
                {counts?.some(Boolean) ? (
                  <div className="f21-cal__row f21-cal__row--unassigned">
                    <div className="f21-cal__label">Chưa gán</div>
                    {counts.map((n, i) => (
                      <div key={i} className="f21-cal__cell" style={{ gridColumn: i + 2 }}>
                        {n ? <span className="f21-cal__count">{n}</span> : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>

        <section className="f21-cal__pending">
          <h2>Đơn chưa gán đủ số phòng ({unassignedBookings.length})</h2>
          {unassignedBookings.length ? (
            <ul className="f21-list">
              {unassignedBookings.map((b) => (
                <li key={b.id} className="f21-row">
                  <Link className="f21-row__main" href={`/admin/collections/bookings/${b.id}`}>
                    <b>{b.guestName}</b>
                    <span>
                      {fromDbDate(b.checkIn).split("-").reverse().slice(0, 2).join("/")} → {fromDbDate(b.checkOut).split("-").reverse().slice(0, 2).join("/")} · {b.code}
                    </span>
                  </Link>
                  <span className={`f21-status f21-status--${b.status}`}>{statusLabel(b.status)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="f21-w__empty">Mọi đặt phòng trong khoảng này đã có số phòng.</p>
          )}
        </section>
      </Gutter>
    </DefaultTemplate>
  );
}
