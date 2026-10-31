// Widget bảng điều khiển CMS (server component, Payload truyền req và user).
// Bố cục mặc định theo vai trò: defaultLayout trong src/payload/admin/dashboard/layout.ts
import Link from "next/link";
import type { PayloadRequest } from "payload";
import { checkAvailability } from "@/lib/reservations";
import { formatViDate, shortDate } from "@/lib/dates";
import { normalizePhone } from "@/lib/booking";
import type { Booking } from "@/payload-types";
import { bookingsUrl, money, outlook, plusDays, roomsOf, sourceLabel, statusLabel, today, todayBookings } from "./data";

type Props = { req: PayloadRequest };

const Card = ({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) => (
  <section className="f21-w">
    <header className="f21-w__head">
      <h2>{title}</h2>
      {action}
    </header>
    {children}
  </section>
);

const Empty = ({ children }: { children: React.ReactNode }) => <p className="f21-w__empty">{children}</p>;

// Gọi và nhắn Zalo cho khách
function Contact({ phone }: { phone: string }) {
  const p = normalizePhone(phone);
  return (
    <span className="f21-contact">
      <a href={`tel:${p}`}>Gọi</a>
      <a href={`https://zalo.me/${p}`} target="_blank" rel="noopener">
        Zalo
      </a>
    </span>
  );
}

function BookingRow({ b, meta }: { b: Booking; meta: React.ReactNode }) {
  return (
    <li className="f21-row">
      <Link className="f21-row__main" href={`/admin/collections/bookings/${b.id}`}>
        <b>{b.guestName}</b>
        <span>{meta}</span>
      </Link>
      <span className={`f21-status f21-status--${b.status}`}>{statusLabel(b.status)}</span>
      <Contact phone={b.phone} />
    </li>
  );
}

export async function TodayWidget({ req }: Props) {
  const { arrivals, departures, inHouse, pending } = await todayBookings(req);
  const day = today();
  const stats = [
    { label: "Khách đến hôm nay", value: arrivals.totalDocs, href: bookingsUrl(`where[checkIn][equals]=${day}`) },
    { label: "Khách trả phòng", value: departures.totalDocs, href: bookingsUrl(`where[checkOut][equals]=${day}`) },
    { label: "Đang ở", value: inHouse.totalDocs, href: bookingsUrl("where[status][equals]=checked_in") },
    { label: "Chờ xác nhận", value: pending.totalDocs, href: bookingsUrl("where[status][equals]=pending"), alert: pending.totalDocs > 0 },
  ];
  return (
    <Card title={`Hôm nay · ${formatViDate(day)}`} action={<Link className="f21-w__link" href="/admin/collections/bookings/create">+ Đặt phòng mới</Link>}>
      <div className="f21-stats">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`f21-stat${s.alert ? " f21-stat--alert" : ""}`}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export async function ArrivalsWidget({ req }: Props) {
  const { arrivals, departures } = await todayBookings(req);
  return (
    <Card title="Khách đến và đi hôm nay">
      <h3 className="f21-w__sub">Đến ({arrivals.totalDocs})</h3>
      {arrivals.docs.length ? (
        <ul className="f21-list">
          {arrivals.docs.map((b) => (
            <BookingRow key={b.id} b={b} meta={[roomsOf(b), b.arrivalTime && `đến ${b.arrivalTime}`].filter(Boolean).join(" · ")} />
          ))}
        </ul>
      ) : (
        <Empty>Không có khách đến hôm nay.</Empty>
      )}
      <h3 className="f21-w__sub">Trả phòng ({departures.totalDocs})</h3>
      {departures.docs.length ? (
        <ul className="f21-list">
          {departures.docs.map((b) => (
            <BookingRow key={b.id} b={b} meta={roomsOf(b)} />
          ))}
        </ul>
      ) : (
        <Empty>Không có khách trả phòng hôm nay.</Empty>
      )}
    </Card>
  );
}

export async function PendingWidget({ req }: Props) {
  const { pending } = await todayBookings(req);
  return (
    <Card
      title={`Chờ xác nhận (${pending.totalDocs})`}
      action={pending.totalDocs > pending.docs.length ? <Link className="f21-w__link" href={bookingsUrl("where[status][equals]=pending")}>Xem tất cả</Link> : null}
    >
      {pending.docs.length ? (
        <ul className="f21-list">
          {pending.docs.map((b) => (
            <BookingRow
              key={b.id}
              b={b}
              meta={`${shortDate(b.checkIn.slice(0, 10))} → ${shortDate(b.checkOut.slice(0, 10))} · ${roomsOf(b)} · ${sourceLabel(b.source)}`}
            />
          ))}
        </ul>
      ) : (
        <Empty>Không có đơn nào đang chờ. Đơn mới từ website sẽ hiện ở đây.</Empty>
      )}
    </Card>
  );
}

export async function AvailabilityWidget() {
  const day = today();
  const types = Object.values(await checkAvailability(day, plusDays(day, 1)));
  return (
    <Card title="Phòng trống tối nay">
      {types.length ? (
        <ul className="f21-avail">
          {types.map((t) => (
            <li key={t.id} className={t.available <= 0 ? "is-full" : t.available <= 1 ? "is-low" : undefined}>
              <span>{t.name}</span>
              <strong>{Math.max(0, t.available)}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>Chưa có hạng phòng.</Empty>
      )}
    </Card>
  );
}

export async function OutlookWidget({ req }: Props) {
  const o = await outlook(req);
  return (
    <Card title="7 ngày tới & tháng này">
      <div className="f21-bars" role="img" aria-label="Công suất phòng 7 đêm tới">
        {o.nights.map((n) => (
          <div key={n.night} className="f21-bar" title={`${shortDate(n.night)}: ${n.sold}/${o.totalRooms} phòng`}>
            <span className="f21-bar__value">{Math.round(n.rate * 100)}%</span>
            <span className="f21-bar__track">
              <span style={{ height: `${Math.max(2, n.rate * 100)}%` }} />
            </span>
            <span className="f21-bar__label">{shortDate(n.night).split(",")[0]}</span>
          </div>
        ))}
      </div>
      <dl className="f21-kv">
        <div>
          <dt>Doanh thu dự kiến tháng này</dt>
          <dd>{money(o.revenue)}</dd>
        </div>
        <div>
          <dt>Đơn trong tháng</dt>
          <dd>{o.monthCount}</dd>
        </div>
        <div>
          <dt>Kênh đặt phòng</dt>
          <dd>{o.sources.length ? o.sources.map(([s, n]) => `${sourceLabel(s)} ${n}`).join(" · ") : "—"}</dd>
        </div>
      </dl>
    </Card>
  );
}

const ACTIONS: Record<string, string> = { create: "thêm", update: "sửa", delete: "xoá" };

export async function ActivityWidget({ req }: Props) {
  const logs = await req.payload.find({ collection: "audit-logs", sort: "-createdAt", limit: 8, depth: 0, req, overrideAccess: false });
  // Quản lý không đọc được tài khoản người khác; nhật ký chỉ cần tên người thao tác
  const ids = [...new Set(logs.docs.map((l) => (typeof l.user === "object" && l.user ? l.user.id : l.user)).filter(Boolean))] as number[];
  const users = ids.length
    ? await req.payload.find({ collection: "users", where: { id: { in: ids } }, select: { name: true }, depth: 0, limit: ids.length, overrideAccess: true })
    : { docs: [] };
  const nameOf = (id: unknown) => users.docs.find((u) => u.id === id)?.name ?? "Hệ thống";
  return (
    <Card title="Thao tác gần đây" action={<Link className="f21-w__link" href="/admin/collections/audit-logs">Xem nhật ký</Link>}>
      {logs.docs.length ? (
        <ul className="f21-feed">
          {logs.docs.map((l) => (
            <li key={l.id}>
              <span>
                <b>{nameOf(typeof l.user === "object" && l.user ? l.user.id : l.user)}</b> {ACTIONS[l.action ?? ""] ?? l.action} {l.title ?? l.target}
              </span>
              <time>{new Date(l.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}</time>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>Chưa có thao tác nào.</Empty>
      )}
    </Card>
  );
}
