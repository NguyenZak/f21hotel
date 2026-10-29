import Link from "next/link";
import type { ReactNode } from "react";
import { formatVnd, site, telLink, zaloLink, type Room } from "@/lib/site";
import { IconBed, IconChat, IconClock, IconPhone, IconUsers } from "./Icons";

// Ảnh tạm, thay bằng <Image> khi có ảnh chụp thật
export function Placeholder({ label }: { label: string }) {
  return <div className="ph" data-label={label} role="img" aria-label={label} />;
}

export function SectionHead({
  eyebrow,
  title,
  children,
  center,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`section-head reveal${center ? " center" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

export function PageHero({
  crumb,
  eyebrow,
  title,
  children,
}: {
  crumb: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero on-dark">
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link> / <span>{crumb}</span>
        </nav>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {children ? <p>{children}</p> : null}
      </div>
    </section>
  );
}

export function RoomSpecs({ room }: { room: Room }) {
  return (
    <div className="specs">
      <span>
        <IconUsers /> {room.guests} người
      </span>
      <span>
        <IconBed /> {room.roomNumbers.length} phòng
      </span>
      <span>
        <IconClock /> Thêm giờ {formatVnd(room.prices.extraHour)}
      </span>
    </div>
  );
}

export function RoomCard({ room }: { room: Room }) {
  return (
    <article className="room-card">
      <div className="media">
        <Placeholder label={`Ảnh ${room.name}`} />
      </div>
      <div className="body">
        <h3>{room.name}</h3>
        <RoomSpecs room={room} />
        <p style={{ fontSize: 16, color: "var(--muted)" }}>{room.short}</p>
        <dl className="mini-prices">
          <div>
            <dt>Qua đêm</dt>
            <dd>{formatVnd(room.prices.overnight)}</dd>
          </div>
          <div>
            <dt>Ngày đêm</dt>
            <dd>{formatVnd(room.prices.fullDay)}</dd>
          </div>
          <div>
            <dt>Nghỉ giờ</dt>
            <dd>{formatVnd(room.prices.hourly)}</dd>
          </div>
        </dl>
        <div className="foot">
          <Link className="link-arrow" href={`/phong#${room.slug}`}>
            Chi tiết
          </Link>
          <Link className="btn" href={`/dat-phong?room=${room.slug}`}>
            Đặt phòng
          </Link>
        </div>
      </div>
    </article>
  );
}

export function CtaBand({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <section className="section tight cta-band on-dark">
      <div className="wrap reveal">
        <span className="eyebrow">Đặt trực tiếp, thêm quyền lợi</span>
        <h2>{title}</h2>
        {children ? <p>{children}</p> : null}
        <div className="actions">
          <Link className="btn btn-gold" href="/dat-phong">
            Gửi yêu cầu đặt phòng
          </Link>
          <a className="btn btn-ghost" href={zaloLink} target="_blank" rel="noopener">
            <IconChat /> Nhắn Zalo
          </a>
          <a className="btn btn-ghost" href={telLink}>
            <IconPhone /> {site.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}

export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="faq reveal">
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
