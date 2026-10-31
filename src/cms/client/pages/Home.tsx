"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatViDate } from "@/lib/dates";
import type { BookingDTO, TodayData } from "../../types";
import { api, ApiError } from "../api";
import { dayLabel, money, roomsText, sourceLabel, statusLabel, telHref, zaloHref } from "../booking";
import { useToast } from "../ui";

// Trang đầu CMS: việc của lễ tân hôm nay. Quản lý/Chủ thấy thêm công suất 7 đêm tới và doanh thu tháng.

function Contact({ phone }: { phone: string }) {
  return (
    <span className="c-row" style={{ gap: 6, flexWrap: "nowrap" }}>
      <a className="c-btn c-btn--small" href={telHref(phone)}>
        Gọi
      </a>
      <a className="c-btn c-btn--small" href={zaloHref(phone)} target="_blank" rel="noopener">
        Zalo
      </a>
    </span>
  );
}

function BookingLine({ b, meta, action }: { b: BookingDTO; meta: string; action?: React.ReactNode }) {
  return (
    <li className="c-line">
      <Link className="c-line__main" href={`/quan-tri/dat-phong/sua?id=${b.id}`}>
        <b>{b.guestName}</b>
        <span>{meta}</span>
      </Link>
      <span className={`c-status c-status--${b.status}`}>{statusLabel(b.status)}</span>
      <span className="c-row" style={{ gap: 6, flexWrap: "nowrap" }}>
        {action}
        <Contact phone={b.phone} />
      </span>
    </li>
  );
}

export function HomePage() {
  const [data, setData] = useState<TodayData | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(0);
  const [toast, say] = useToast();

  const load = useCallback(
    () =>
      api<TodayData>("today")
        .then(setData)
        .catch((e) => setError(e instanceof ApiError ? e.message : "Không tải được dữ liệu.")),
    [],
  );
  useEffect(() => {
    load();
    // Tự cập nhật mỗi phút: đơn mới từ website hiện ra mà không cần tải lại trang
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, [load]);

  const confirm = async (b: BookingDTO) => {
    setBusy(b.id);
    try {
      await api(`bookings/${b.id}`, { method: "PATCH", body: { status: "confirmed" } });
      say(`Đã xác nhận ${b.code}`);
      await load();
    } catch (e) {
      say(e instanceof ApiError ? e.message : "Không lưu được.");
    } finally {
      setBusy(0);
    }
  };

  if (error) return <p className="c-alert c-alert--error">{error}</p>;
  if (!data) return <p className="c-empty">Đang tải…</p>;

  const stats = [
    { label: "Khách đến hôm nay", value: data.arrivals.length, href: "/quan-tri/dat-phong?filter=arrivals" },
    { label: "Khách trả phòng", value: data.departures.length, href: "/quan-tri/dat-phong?filter=departures" },
    { label: "Đang ở", value: data.inHouse, href: "/quan-tri/dat-phong?filter=inhouse" },
    { label: "Chờ xác nhận", value: data.pendingCount, href: "/quan-tri/dat-phong?filter=pending", alert: data.pendingCount > 0 },
  ];

  return (
    <>
      <div className="c-page__head">
        <div>
          <h1>Hôm nay · {formatViDate(data.today)}</h1>
          <p>Tự cập nhật mỗi phút.</p>
        </div>
        <Link className="c-btn c-btn--primary" href="/quan-tri/dat-phong/moi">
          + Đặt phòng mới
        </Link>
      </div>

      <div className="c-stats">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`c-stat${s.alert ? " c-stat--alert" : ""}`}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </Link>
        ))}
      </div>

      <div className="c-dash">
        <section className="c-card c-dash__wide">
          <div className="c-card__head">
            <h2>Chờ xác nhận ({data.pendingCount})</h2>
            {data.pendingCount > data.pending.length ? <Link href="/quan-tri/dat-phong?filter=pending">Xem tất cả</Link> : null}
          </div>
          {data.pending.length ? (
            <ul className="c-lines">
              {data.pending.map((b) => (
                <BookingLine
                  key={b.id}
                  b={b}
                  meta={`${dayLabel(b.checkIn)} → ${dayLabel(b.checkOut)} · ${roomsText(b)} · ${sourceLabel(b.source)} · ${money(b.total)}`}
                  action={
                    <button className="c-btn c-btn--small c-btn--primary" type="button" disabled={busy === b.id} onClick={() => confirm(b)}>
                      Xác nhận
                    </button>
                  }
                />
              ))}
            </ul>
          ) : (
            <p className="c-muted">Không có đơn nào đang chờ. Đơn mới từ website sẽ hiện ở đây.</p>
          )}
        </section>

        <section className="c-card">
          <div className="c-card__head">
            <h2>Khách đến ({data.arrivals.length})</h2>
          </div>
          {data.arrivals.length ? (
            <ul className="c-lines">
              {data.arrivals.map((b) => (
                <BookingLine key={b.id} b={b} meta={[roomsText(b), b.arrivalTime && `đến ${b.arrivalTime}`].filter(Boolean).join(" · ")} />
              ))}
            </ul>
          ) : (
            <p className="c-muted">Không có khách đến hôm nay.</p>
          )}
          <div className="c-card__head" style={{ marginTop: 16 }}>
            <h2>Trả phòng ({data.departures.length})</h2>
          </div>
          {data.departures.length ? (
            <ul className="c-lines">
              {data.departures.map((b) => (
                <BookingLine key={b.id} b={b} meta={roomsText(b)} />
              ))}
            </ul>
          ) : (
            <p className="c-muted">Không có khách trả phòng hôm nay.</p>
          )}
        </section>

        <section className="c-card">
          <div className="c-card__head">
            <h2>Phòng trống tối nay</h2>
            <Link href="/quan-tri/lich-phong">Lịch phòng</Link>
          </div>
          <ul className="c-avail">
            {data.availability.map((t) => (
              <li key={t.id} className={t.available <= 0 ? "is-full" : t.available <= 1 ? "is-low" : undefined}>
                <span>{t.name}</span>
                <strong>
                  {t.available}
                  <small>/{t.total}</small>
                </strong>
              </li>
            ))}
          </ul>
        </section>

        {data.outlook ? (
          <section className="c-card">
            <div className="c-card__head">
              <h2>7 đêm tới & tháng này</h2>
            </div>
            <div className="c-bars" role="img" aria-label="Công suất phòng 7 đêm tới">
              {data.outlook.nights.map((n) => (
                <div key={n.night} className="c-bar" title={`${dayLabel(n.night)}: ${n.sold}/${data.outlook!.totalRooms} phòng`}>
                  <span>{Math.round(n.rate * 100)}%</span>
                  <i>
                    <b style={{ height: `${Math.max(2, n.rate * 100)}%` }} />
                  </i>
                  <small>{dayLabel(n.night).split(" ")[0]}</small>
                </div>
              ))}
            </div>
            <dl className="c-kv">
              <div>
                <dt>Doanh thu dự kiến tháng</dt>
                <dd>{money(data.outlook.revenue)}</dd>
              </div>
              <div>
                <dt>Đơn trong tháng</dt>
                <dd>{data.outlook.monthCount}</dd>
              </div>
              <div>
                <dt>Theo kênh</dt>
                <dd>{data.outlook.sources.length ? data.outlook.sources.map((s) => `${sourceLabel(s.source)} ${s.count}`).join(" · ") : "—"}</dd>
              </div>
            </dl>
          </section>
        ) : null}
      </div>
      {toast}
    </>
  );
}
