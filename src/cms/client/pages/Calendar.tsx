"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { BLOCKING_STATUSES } from "@/lib/booking";
import { addDays, nightsOf, todayInVietnam, toIsoDate } from "@/lib/dates";
import type { BookingDTO, Meta } from "../../types";
import { api, ApiError } from "../api";
import { dayLabel, loadMeta, statusLabel } from "../booking";

// Lịch phòng: mỗi dòng một phòng, mỗi cột một đêm. Đặt phòng đã gán số phòng hiện thành thanh; phòng chưa gán
// được đếm ở dòng "Chưa gán" của từng hạng phòng. Bấm ô trống để tạo đặt phòng cho phòng và ngày đó.

const DAYS = 14;
const plusDays = (iso: string, n: number) => toIsoDate(addDays(new Date(`${iso}T00:00:00`), n));
type Bar = { b: BookingDTO; start: number; span: number; hourly: boolean };

export function CalendarPage() {
  const params = useSearchParams();
  const router = useRouter();
  const today = todayInVietnam();
  const start = /^\d{4}-\d{2}-\d{2}$/.test(params.get("from") ?? "") ? params.get("from")! : today;
  const [data, setData] = useState<{ meta: Meta; bookings: BookingDTO[]; from: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    Promise.all([loadMeta(), api<{ bookings: BookingDTO[] }>(`calendar?from=${start}&days=${DAYS}`)])
      .then(([meta, r]) => alive && setData({ meta, bookings: r.bookings, from: start }))
      .catch((e) => alive && setError(e instanceof ApiError ? e.message : "Không tải được lịch."));
    return () => {
      alive = false;
    };
  }, [start]);

  const days = nightsOf(start, plusDays(start, DAYS));
  const col = (iso: string) => days.indexOf(iso);

  // Thanh theo phòng, số phòng chưa gán theo hạng phòng và đêm
  const bars = new Map<number, Bar[]>();
  const unassigned = new Map<number, number[]>();
  const pendingAssign: BookingDTO[] = [];
  for (const b of data?.from === start ? data.bookings : []) {
    for (const item of b.items) {
      const hourly = item.stayType === "hourly" || b.checkIn === b.checkOut;
      const first = col(b.checkIn) === -1 ? (b.checkIn < start ? 0 : DAYS) : col(b.checkIn);
      const last = hourly ? first + 1 : col(b.checkOut) === -1 ? (b.checkOut > start ? DAYS : 0) : col(b.checkOut);
      if (last <= first || first >= DAYS) continue;
      for (const room of item.rooms) bars.set(room, [...(bars.get(room) ?? []), { b, start: first, span: last - first, hourly }]);
      const missing = Math.max(0, item.quantity - item.rooms.length);
      if (missing && BLOCKING_STATUSES.includes(b.status)) {
        if (!pendingAssign.includes(b)) pendingAssign.push(b);
        if (hourly) continue;
        const counts = unassigned.get(item.roomType) ?? Array<number>(DAYS).fill(0);
        for (let d = first; d < last; d++) counts[d] += missing;
        unassigned.set(item.roomType, counts);
      }
    }
  }

  const nav = (iso: string, label: string) => (
    <Link className="c-btn c-btn--small" href={`/quan-tri/lich-phong?from=${iso}`}>
      {label}
    </Link>
  );
  const grid = { "--days": DAYS } as CSSProperties;

  return (
    <>
      <div className="c-page__head">
        <div>
          <h1>Lịch phòng</h1>
          <p>Bấm vào thanh để mở đặt phòng, bấm ô trống để đặt phòng mới cho phòng và ngày đó.</p>
        </div>
        <div className="c-row">
          {nav(plusDays(start, -7), "← 7 ngày")}
          {start !== today ? nav(today, "Hôm nay") : null}
          {nav(plusDays(start, 7), "7 ngày →")}
        </div>
      </div>
      <p className="c-row" style={{ marginBottom: 12 }}>
        {["pending", "confirmed", "checked_in", "checked_out"].map((s) => (
          <span key={s} className={`c-status c-status--${s}`}>
            {statusLabel(s)}
          </span>
        ))}
        <span className="c-muted" style={{ fontSize: 13 }}>
          Đơn nghỉ giờ có chữ “giờ”.
        </span>
      </p>
      {error ? <p className="c-alert c-alert--error">{error}</p> : null}
      {!data || data.from !== start ? (
        <p className="c-empty">Đang tải…</p>
      ) : (
        <div className="c-cal" style={grid}>
          <div className="c-cal__row c-cal__row--head">
            <div className="c-cal__label">Phòng</div>
            {days.map((d) => {
              const wd = new Date(`${d}T00:00:00Z`).getUTCDay();
              return (
                <div key={d} className={`c-cal__day${d === today ? " is-today" : ""}${wd === 0 || wd === 6 ? " is-weekend" : ""}`}>
                  <span>{dayLabel(d).split(" ")[0]}</span>
                  <b>{dayLabel(d).split(" ")[1]}</b>
                </div>
              );
            })}
          </div>
          {data.meta.roomTypes.map((t) => {
            const rooms = data.meta.rooms.filter((r) => r.roomType === t.id && r.active);
            const counts = unassigned.get(t.id);
            return (
              <section key={t.id}>
                <div className="c-cal__type">
                  {t.name} <small>{rooms.length} phòng</small>
                </div>
                {rooms.map((r) => (
                  <div key={r.id} className="c-cal__row">
                    <div className="c-cal__label">
                      <b>{r.number}</b>
                      <small>Tầng {r.floor}</small>
                    </div>
                    {days.map((d, i) => (
                      <button
                        key={d}
                        type="button"
                        className={`c-cal__cell${d === today ? " is-today" : ""}`}
                        style={{ gridColumn: i + 2 }}
                        aria-label={`Đặt phòng ${r.number} từ ${dayLabel(d)}`}
                        onClick={() => router.push(`/quan-tri/dat-phong/moi?checkIn=${d}&checkOut=${plusDays(d, 1)}&roomType=${t.id}&room=${r.id}`)}
                      />
                    ))}
                    {(bars.get(r.id) ?? []).map(({ b, start: s, span, hourly }) => (
                      <Link
                        key={`${b.id}-${s}`}
                        href={`/quan-tri/dat-phong/sua?id=${b.id}`}
                        className={`c-cal__bar c-status--${b.status}`}
                        style={{ gridColumn: `${s + 2} / span ${span}` }}
                        title={`${b.guestName} · ${statusLabel(b.status)} · ${b.code}`}
                      >
                        {hourly ? <em>giờ</em> : null}
                        {b.guestName}
                      </Link>
                    ))}
                  </div>
                ))}
                {counts?.some(Boolean) ? (
                  <div className="c-cal__row c-cal__row--unassigned">
                    <div className="c-cal__label">Chưa gán</div>
                    {counts.map((n, i) => (
                      <div key={i} className="c-cal__cell" style={{ gridColumn: i + 2 }}>
                        {n ? <span className="c-cal__count">{n}</span> : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      )}
      {data && data.from === start ? (
        <section className="c-card" style={{ marginTop: 20, maxWidth: 760 }}>
          <h2 style={{ marginBottom: 8 }}>Đơn chưa gán đủ số phòng ({pendingAssign.length})</h2>
          {pendingAssign.length ? (
            <ul className="c-lines">
              {pendingAssign.map((b) => (
                <li key={b.id} className="c-line">
                  <Link className="c-line__main" href={`/quan-tri/dat-phong/sua?id=${b.id}`}>
                    <b>{b.guestName}</b>
                    <span>
                      {dayLabel(b.checkIn)} → {dayLabel(b.checkOut)} · {b.code}
                    </span>
                  </Link>
                  <span className={`c-status c-status--${b.status}`}>{statusLabel(b.status)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="c-muted">Mọi đặt phòng trong khoảng này đã có số phòng.</p>
          )}
        </section>
      ) : null}
    </>
  );
}
