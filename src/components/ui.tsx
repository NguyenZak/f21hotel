import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { formatVnd, type Photo as PhotoData, type Room } from "@/lib/site";
// Chỉ lấy kiểu: ui.tsx được trình dựng trang nạp phía trình duyệt, không được kéo mã đọc D1 theo
import type { SiteData } from "@/lib/site-data";
import { Gallery } from "./Gallery";
import { IconArea, IconBed, IconClock, IconPhone, IconUsers, IconZalo } from "./Icons";

// Ảnh hiển thị đúng tỉ lệ gốc của file
export function Photo({ photo, sizes, priority }: { photo: PhotoData; sizes: string; priority?: boolean }) {
  return (
    <div className="photo">
      <Image src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} sizes={sizes} priority={priority} />
    </div>
  );
}

// Ảnh tạm khi chưa có ảnh chụp thật
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
      {room.area ? (
        <span>
          <IconArea /> {room.area} m²
        </span>
      ) : null}
      <span>
        <IconBed /> {room.bed ?? `${room.roomNumbers.length} phòng`}
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
        {/* Slider cả album của phòng, bấm ảnh mở xem lớn. leadTransitionName cùng tên với ảnh lớn ở trang Phòng:
            khi chuyển trang ảnh bay sang vị trí mới */}
        <Gallery
          photos={room.photos}
          slider
          leadTransitionName={`room-${room.slug}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1140px) 50vw, 25vw"
        />
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

// Điểm đánh giá chép từ Google Maps (CMS › Thông tin khách sạn › Điểm đánh giá). Chưa điền thì không hiện gì.
export function RatingBadge({ rating, className = "" }: { rating: SiteData["rating"]; className?: string }) {
  if (!rating) return null;
  return (
    <a className={`rating-badge ${className}`.trim()} href={rating.url || undefined} target="_blank" rel="noopener">
      <span className="rating-stars" aria-hidden="true">★</span>
      <b>{rating.score.toLocaleString("vi-VN")}</b>
      <span>
        {rating.count.toLocaleString("vi-VN")} đánh giá trên {rating.source}
      </span>
    </a>
  );
}

// Dải kêu gọi đặt phòng (giao diện thuần, dùng được cả trong trình dựng trang).
// Bản tự đọc liên hệ từ CMS: CtaBand trong ./CtaBand.tsx
export function CtaBandView({
  title,
  children,
  eyebrow = "Đặt trực tiếp, thêm quyền lợi",
  contact,
}: {
  title: ReactNode;
  children?: ReactNode;
  eyebrow?: string;
  contact: { phoneDisplay: string; telLink: string; zaloLink: string };
}) {
  return (
    <section className="section tight cta-band on-dark">
      <div className="wrap reveal">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {children ? <p>{children}</p> : null}
        <div className="actions">
          <Link className="btn btn-gold" href="/dat-phong">
            Xem phòng trống
          </Link>
          <a className="btn btn-ghost" href={contact.zaloLink} target="_blank" rel="noopener">
            <IconZalo /> Nhắn Zalo
          </a>
          <a className="btn btn-ghost" href={contact.telLink}>
            <IconPhone /> {contact.phoneDisplay}
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
