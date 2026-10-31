"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { BookingDTO, Meta, TodayData } from "../../types";
import { api, ApiError } from "../api";
import { dayLabel, loadMeta, money, sourceLabel, statusLabel, telHref, zaloHref } from "../booking";
import { Icon, type IconName } from "../icons";
import { useSession } from "../session";
import { useToast } from "../ui";

// Trang đầu CMS: việc của lễ tân hôm nay (chỉ số, đơn chờ, khách đến / trả phòng, phòng trống tối nay).
// Quản lý/Chủ thấy thêm công suất 7 đêm tới và doanh thu, kênh đặt phòng trong tháng.

const WEEKDAYS = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const longDate = (iso: string) => `${WEEKDAYS[new Date(`${iso}T00:00:00Z`).getUTCDay()]}, ${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
const vnHour = () =>
  Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "numeric",
      hour12: false,
    }).format(new Date()),
  );
const greeting = (h: number) => (h < 11 ? "Chào buổi sáng" : h < 13 ? "Chào buổi trưa" : h < 18 ? "Chào buổi chiều" : "Chào buổi tối");
const clock = (d: Date) =>
  d.toLocaleTimeString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
  });
const percent = (r: number) => `${Math.round(r * 100)}%`;
// Số tiền gọn cho chỉ số lớn: 12.500.000 -> "12,5 tr"
const compactMoney = (n: number) =>
  n >= 1e9
    ? `${(n / 1e9).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tỷ`
    : n >= 1e6
      ? `${(n / 1e6).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tr`
      : money(n);

function ago(iso: string) {
  const min = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (min < 1) return "vừa xong";
  if (min < 60) return `${min} phút trước`;
  if (min < 24 * 60) return `${Math.floor(min / 60)} giờ trước`;
  return `${Math.floor(min / 1440)} ngày trước`;
}

const initials = (name: string) => {
  const w = name.trim().split(/\s+/);
  return ((w.length > 1 ? w[w.length - 2][0] : "") + (w[w.length - 1]?.[0] ?? "")).toUpperCase() || "?";
};

const due = (b: BookingDTO) => Math.max(0, b.total - b.paid);
const fullyAssigned = (b: BookingDTO) => b.items.every((i) => i.rooms.length >= i.quantity);

// "Deluxe ×2 · P.201, 202" (hoặc chỉ hạng phòng nếu chưa xếp)
function roomsLine(b: BookingDTO, meta: Meta | null) {
  const types = b.items.map((i) => `${i.roomTypeName || "Phòng"}${i.quantity > 1 ? ` ×${i.quantity}` : ""}`).join(", ");
  const nums = meta
    ? b.items
        .flatMap((i) => i.rooms)
        .map((id) => meta.rooms.find((r) => r.id === id)?.number)
        .filter(Boolean)
    : [];
  return nums.length ? `${types} · P.${nums.join(", ")}` : types;
}

function Kpi({ icon, label, value, note, href, tone }: { icon: IconName; label: string; value: number; note: string; href: string; tone?: "alert" }) {
  return (
    <Link href={href} className={`c-kpi${tone ? ` c-kpi--${tone}` : ""}`}>
      <span className="c-kpi__icon">
        <Icon name={icon} size={20} />
      </span>
      <span className="c-kpi__label">{label}</span>
      <strong className="c-kpi__value">{value}</strong>
      <span className="c-kpi__note">{note}</span>
    </Link>
  );
}

function Contact({ b }: { b: BookingDTO }) {
  return (
    <>
      <a className="c-iconbtn" href={telHref(b.phone)} aria-label={`Gọi ${b.guestName}`} title={b.phone}>
        <Icon name="phone" size={16} />
      </a>
      <a className="c-iconbtn" href={zaloHref(b.phone)} target="_blank" rel="noopener" aria-label={`Nhắn Zalo cho ${b.guestName}`} title="Zalo">
        <Icon name="chat" size={16} />
      </a>
    </>
  );
}

function Guest({ b, sub, extra, action, status = true }: { b: BookingDTO; sub: ReactNode; extra?: ReactNode; action?: ReactNode; status?: boolean }) {
  return (
    <li className="c-guest">
      <span className="c-avatar" aria-hidden="true">
        {initials(b.guestName)}
      </span>
      <Link className="c-guest__main" href={`/quan-tri/dat-phong/sua?id=${b.id}`}>
        <span className="c-guest__name">
          <b>{b.guestName}</b>
          <code>{b.code}</code>
        </span>
        <span className="c-guest__sub">{sub}</span>
      </Link>
      <span className="c-guest__side">
        {extra}
        {status ? <span className={`c-status c-status--${b.status}`}>{statusLabel(b.status)}</span> : null}
      </span>
      <span className="c-guest__actions">
        {action}
        <Contact b={b} />
      </span>
    </li>
  );
}

function Empty({ icon = "inbox", children }: { icon?: IconName; children: ReactNode }) {
  return (
    <div className="c-blank">
      <Icon name={icon} size={22} />
      <p>{children}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div aria-busy="true" aria-label="Đang tải">
      <div className="c-skel" style={{ height: 52, width: 320, marginBottom: 22 }} />
      <div className="c-kpis">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="c-skel" style={{ height: 128 }} />
        ))}
      </div>
      <div className="c-home">
        <div className="c-skel" style={{ height: 320 }} />
        <div className="c-skel" style={{ height: 320 }} />
      </div>
    </div>
  );
}

// Công suất 7 đêm tới: một chuỗi số liệu, cột mảnh, chỉ ghi số ở đêm nay và đêm cao nhất; di chuột / Tab để xem từng đêm
function Outlook({ o }: { o: NonNullable<TodayData["outlook"]> }) {
  const peak = o.nights.reduce((m, n, i) => (n.rate > o.nights[m].rate ? i : m), 0);
  return (
    <figure className="c-chart">
      <div className="c-chart__plot">
        {[1, 0.5, 0].map((t) => (
          <span key={t} className="c-chart__grid" style={{ bottom: `${t * 100}%` }}>
            <small>{percent(t)}</small>
          </span>
        ))}
        <div className="c-chart__cols">
          {o.nights.map((n, i) => (
            <div key={n.night} className="c-chart__col" tabIndex={0} aria-label={`${dayLabel(n.night)}: ${n.sold}/${o.totalRooms} phòng, ${percent(n.rate)}`}>
              <span className="c-chart__bar" style={{ height: `${Math.max(n.sold ? 3 : 0, n.rate * 100)}%` }}>
                {i === 0 || (i === peak && n.rate > 0) ? <em>{percent(n.rate)}</em> : null}
              </span>
              <span className="c-chart__tip" role="tooltip">
                <b>{dayLabel(n.night)}</b>
                {n.sold}/{o.totalRooms} phòng · {percent(n.rate)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="c-chart__x" aria-hidden="true">
        {o.nights.map((n, i) => (
          <span key={n.night} className={i === 0 ? "is-today" : undefined}>
            {i === 0 ? "Đêm nay" : dayLabel(n.night)}
          </span>
        ))}
      </div>
    </figure>
  );
}

function Revenue({ o }: { o: NonNullable<TodayData["outlook"]> }) {
  const max = Math.max(1, ...o.sources.map((s) => s.count));
  return (
    <>
      <div className="c-figure">
        <span>Doanh thu dự kiến</span>
        <strong title={money(o.revenue)}>{compactMoney(o.revenue)}</strong>
        <small>
          {o.monthCount} đơn
          {o.monthCount ? ` · trung bình ${compactMoney(Math.round(o.revenue / o.monthCount))}/đơn` : ""}
        </small>
      </div>
      <h3 className="c-subhead">Kênh đặt phòng</h3>
      {o.sources.length ? (
        <ul className="c-rank">
          {o.sources.map((s) => (
            <li key={s.source}>
              <span className="c-rank__label">{sourceLabel(s.source)}</span>
              <span className="c-rank__track">
                <i style={{ width: `${(s.count / max) * 100}%` }} />
              </span>
              <span className="c-rank__value">
                <b>{s.count}</b> · {compactMoney(s.revenue)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="c-muted">Chưa có đơn nào trong tháng.</p>
      )}
    </>
  );
}

export function HomePage() {
  const { user } = useSession();
  const [data, setData] = useState<TodayData | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState<Date | null>(null);
  const [busy, setBusy] = useState(0);
  const [tab, setTab] = useState<"arrivals" | "departures" | null>(null);
  const [toast, say] = useToast();

  const load = useCallback(
    () =>
      api<TodayData>("today")
        .then((d) => {
          setData(d);
          setError("");
          setUpdated(new Date());
        })
        .catch((e) => setError(e instanceof ApiError ? e.message : "Không tải được dữ liệu."))
        .finally(() => setLoading(false)),
    [],
  );
  // Bấm nút cập nhật: hiện biểu tượng quay trong lúc tải
  const refresh = () => {
    setLoading(true);
    load();
  };
  useEffect(() => {
    load();
    loadMeta().then(setMeta, () => {});
    // Tự cập nhật mỗi phút: đơn mới từ website hiện ra mà không cần tải lại trang
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, [load]);

  const move = async (b: BookingDTO, status: string, done: string) => {
    setBusy(b.id);
    try {
      await api(`bookings/${b.id}`, { method: "PATCH", body: { status } });
      say(`${done} ${b.code}`);
      await load();
    } catch (e) {
      say(e instanceof ApiError ? e.message : "Không lưu được.");
    } finally {
      setBusy(0);
    }
  };

  if (error && !data)
    return (
      <div className="c-alert c-alert--error c-row" style={{ justifyContent: "space-between" }}>
        {error}
        <button type="button" className="c-btn c-btn--small" onClick={refresh}>
          Thử lại
        </button>
      </div>
    );
  if (!data) return <Skeleton />;

  const rooms = data.availability.reduce((a, t) => a + t.total, 0);
  const free = data.availability.reduce((a, t) => a + Math.min(t.available, t.total), 0);
  const tonight = rooms ? (rooms - free) / rooms : 0;
  const arrivedCount = data.arrivals.filter((b) => b.status === "checked_in").length;
  const leftCount = data.departures.filter((b) => b.status === "checked_out").length;
  const shown = tab ?? (data.arrivals.length || !data.departures.length ? "arrivals" : "departures");
  const month = String(Number(data.today.slice(5, 7)));

  const arrivalAction = (b: BookingDTO) => {
    if (b.status === "pending")
      return (
        <button className="c-btn c-btn--small c-btn--primary" type="button" disabled={busy === b.id} onClick={() => move(b, "confirmed", "Đã xác nhận")}>
          Xác nhận
        </button>
      );
    if (b.status !== "confirmed") return null;
    return fullyAssigned(b) ? (
      <button className="c-btn c-btn--small c-btn--primary" type="button" disabled={busy === b.id} onClick={() => move(b, "checked_in", "Đã nhận phòng")}>
        Nhận phòng
      </button>
    ) : (
      <Link className="c-btn c-btn--small" href={`/quan-tri/dat-phong/sua?id=${b.id}`}>
        Xếp phòng
      </Link>
    );
  };
  const departureAction = (b: BookingDTO) =>
    b.status === "checked_in" ? (
      <button
        className="c-btn c-btn--small c-btn--primary"
        type="button"
        disabled={busy === b.id}
        onClick={() => (!due(b) || window.confirm(`Khách còn thiếu ${money(due(b))}. Vẫn trả phòng?`)) && move(b, "checked_out", "Đã trả phòng")}
      >
        Trả phòng
      </button>
    ) : null;

  const list = shown === "arrivals" ? data.arrivals : data.departures;

  return (
    <>
      <div className="c-page__head c-hello">
        <div>
          <p className="c-hello__date">{longDate(data.today)}</p>
          <h1>
            {greeting(vnHour())}
            {user ? `, ${user.name.trim().split(/\s+/).pop()}` : ""}
          </h1>
          <p className="c-hello__live">
            <span className={`c-live${error ? " is-off" : ""}`} aria-hidden="true" />
            {error ? "Mất kết nối, đang thử lại" : `Tự cập nhật mỗi phút · lần cuối ${updated ? clock(updated) : "—"}`}
            <button type="button" className="c-iconbtn c-iconbtn--plain" onClick={refresh} disabled={loading} aria-label="Cập nhật ngay" title="Cập nhật ngay">
              <span className={loading ? "c-spin" : undefined} style={{ display: "inline-flex" }}>
                <Icon name="refresh" size={15} />
              </span>
            </button>
          </p>
        </div>
        <Link className="c-btn c-btn--primary" href="/quan-tri/dat-phong/moi">
          <Icon name="plus" size={16} /> Đặt phòng mới
        </Link>
      </div>

      <div className="c-kpis">
        <Kpi
          icon="arrive"
          label="Khách đến hôm nay"
          value={data.arrivals.length}
          note={data.arrivals.length ? `${arrivedCount} đã nhận phòng` : "Không có khách đến"}
          href="/quan-tri/dat-phong?filter=arrivals"
        />
        <Kpi
          icon="depart"
          label="Trả phòng hôm nay"
          value={data.departures.length}
          note={data.departures.length ? `${leftCount} đã trả phòng` : "Không có khách trả"}
          href="/quan-tri/dat-phong?filter=departures"
        />
        <Kpi icon="inHouse" label="Đang lưu trú" value={data.inHouse} note={`Công suất tối nay ${percent(tonight)}`} href="/quan-tri/dat-phong?filter=inhouse" />
        <Kpi
          icon="clock"
          label="Chờ xác nhận"
          value={data.pendingCount}
          note={data.pendingCount ? "Gọi khách để xác nhận" : "Đã xử lý hết"}
          href="/quan-tri/dat-phong?filter=pending"
          tone={data.pendingCount ? "alert" : undefined}
        />
      </div>

      <div className="c-home">
        <div className="c-home__main">
          {data.pending.length ? (
            <section className="c-panel c-panel--alert">
              <header className="c-panel__head">
                <h2>
                  Cần xác nhận <span className="c-count">{data.pendingCount}</span>
                </h2>
                <Link href="/quan-tri/dat-phong?filter=pending">
                  Xem tất cả <Icon name="chevron" size={14} />
                </Link>
              </header>
              <ul className="c-guests">
                {data.pending.map((b) => (
                  <Guest
                    key={b.id}
                    b={b}
                    status={false}
                    sub={`${dayLabel(b.checkIn)} → ${dayLabel(b.checkOut)} · ${roomsLine(b, meta)} · ${sourceLabel(b.source)} · ${ago(b.createdAt)}`}
                    extra={<span className="c-amount">{money(b.total)}</span>}
                    action={
                      <button className="c-btn c-btn--small c-btn--primary" type="button" disabled={busy === b.id} onClick={() => move(b, "confirmed", "Đã xác nhận")}>
                        <Icon name="check" size={15} /> Xác nhận
                      </button>
                    }
                  />
                ))}
              </ul>
            </section>
          ) : null}

          <section className="c-panel">
            <header className="c-panel__head">
              <div className="c-tabs" role="tablist" aria-label="Khách hôm nay">
                {(
                  [
                    ["arrivals", "Khách đến", data.arrivals.length],
                    ["departures", "Trả phòng", data.departures.length],
                  ] as const
                ).map(([key, label, n]) => (
                  <button key={key} type="button" role="tab" aria-selected={shown === key} className="c-tab" onClick={() => setTab(key)}>
                    {label} <span className="c-count">{n}</span>
                  </button>
                ))}
              </div>
              <Link href={`/quan-tri/dat-phong?filter=${shown}`}>
                Danh sách <Icon name="chevron" size={14} />
              </Link>
            </header>
            {list.length ? (
              <ul className="c-guests" role="tabpanel">
                {list.map((b) =>
                  shown === "arrivals" ? (
                    <Guest
                      key={b.id}
                      b={b}
                      sub={[`${b.nights || 0} đêm`, roomsLine(b, meta), b.arrivalTime && `đến lúc ${b.arrivalTime}`].filter(Boolean).join(" · ")}
                      extra={
                        b.status === "confirmed" && !fullyAssigned(b) ? (
                          <span className="c-badge c-badge--warn">Chưa xếp phòng</span>
                        ) : due(b) && b.status !== "checked_in" ? (
                          <span className="c-amount">Còn thu {money(due(b))}</span>
                        ) : null
                      }
                      action={arrivalAction(b)}
                    />
                  ) : (
                    <Guest
                      key={b.id}
                      b={b}
                      sub={`${dayLabel(b.checkIn)} → hôm nay · ${roomsLine(b, meta)}`}
                      extra={due(b) && b.status === "checked_in" ? <span className="c-badge c-badge--warn">Còn thu {money(due(b))}</span> : null}
                      action={departureAction(b)}
                    />
                  ),
                )}
              </ul>
            ) : (
              <Empty icon={shown === "arrivals" ? "arrive" : "depart"}>{shown === "arrivals" ? "Hôm nay không có khách đến." : "Hôm nay không có khách trả phòng."}</Empty>
            )}
          </section>

          {data.outlook ? (
            <section className="c-panel">
              <header className="c-panel__head">
                <h2>Công suất 7 đêm tới</h2>
                <Link href="/quan-tri/lich-phong">
                  Lịch phòng <Icon name="chevron" size={14} />
                </Link>
              </header>
              <Outlook o={data.outlook} />
            </section>
          ) : null}
        </div>

        <aside className="c-home__side">
          <section className="c-panel">
            <header className="c-panel__head">
              <h2>Phòng tối nay</h2>
              <Link href="/quan-tri/lich-phong">
                Lịch phòng <Icon name="chevron" size={14} />
              </Link>
            </header>
            <div className="c-figure">
              <span>Còn trống</span>
              <strong>
                {free}
                <small> / {rooms} phòng</small>
              </strong>
              <span className="c-meter" role="img" aria-label={`Đã đặt ${rooms - free}/${rooms} phòng, ${percent(tonight)}`}>
                <i style={{ width: percent(tonight) }} />
              </span>
              <small>Đã đặt {percent(tonight)}</small>
            </div>
            <ul className="c-types">
              {data.availability.map((t) => {
                const sold = Math.max(0, t.total - t.available);
                return (
                  <li key={t.id}>
                    <span className="c-types__name">{t.name}</span>
                    <span className="c-types__value">
                      {t.available <= 0 ? <span className="c-badge c-badge--off">Hết phòng</span> : <b>{t.available} trống</b>}
                      <small>/{t.total}</small>
                    </span>
                    <span className="c-meter c-meter--thin" aria-hidden="true">
                      <i
                        style={{
                          width: t.total ? `${(sold / t.total) * 100}%` : 0,
                        }}
                      />
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          {data.outlook ? (
            <section className="c-panel">
              <header className="c-panel__head">
                <h2>
                  <Icon name="trend" size={18} /> Tháng {month}
                </h2>
              </header>
              <Revenue o={data.outlook} />
            </section>
          ) : null}
        </aside>
      </div>
      {toast}
    </>
  );
}
