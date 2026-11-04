"use client";

import { AnimatePresence, domAnimation, LazyMotion, m, MotionConfig } from "motion/react";
import Link from "next/link";
import type { BookingDTO } from "../types";
import { dayLabel, money, sourceLabel, STAY_LABELS, telHref, zaloHref } from "./booking";
import { PayBar, StatusBadge } from "./BookingBits";
import { Icon } from "./icons";
import { formatTime } from "./ui";

// Xem nhanh một đặt phòng ở khung bên phải trang Đặt phòng (màn hình rộng); đổi đơn thì nội dung chuyển mượt.
// Tải riêng (next/dynamic, ssr: false) từ trang Đặt phòng để motion không nằm trong gói chạy trên server.
export default function BookingPreview({ booking }: { booking: BookingDTO | null }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={booking?.id ?? "empty"}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <PreviewBody b={booking} />
          </m.div>
        </AnimatePresence>
      </LazyMotion>
    </MotionConfig>
  );
}

function PreviewBody({ b }: { b: BookingDTO | null }) {
  if (!b)
    return (
      <div className="c-preview c-preview--empty">
        <Icon name="bookings" size={28} />
        <p>Bấm một dòng để xem nhanh đặt phòng ở đây.</p>
        <p className="c-muted">Bấm tên khách để mở trang sửa.</p>
      </div>
    );
  const due = Math.max(0, (b.total ?? 0) - (b.paid ?? 0));
  return (
    <article className="c-preview" aria-label={`Đặt phòng ${b.code}`}>
      <header className="c-preview__head">
        <div>
          <h2>{b.guestName}</h2>
          <p className="c-muted">
            {b.code} · {sourceLabel(b.source)}
          </p>
        </div>
        <StatusBadge status={b.status} />
      </header>

      <div className="c-row">
        <a className="c-btn c-btn--small" href={telHref(b.phone)}>
          <Icon name="phone" size={16} /> {b.phone}
        </a>
        <a className="c-btn c-btn--small" href={zaloHref(b.phone)} target="_blank" rel="noopener">
          <Icon name="chat" size={16} /> Zalo
        </a>
      </div>

      <dl className="c-preview__facts">
        <div>
          <dt>Ngày ở</dt>
          <dd>
            {dayLabel(b.checkIn)} → {dayLabel(b.checkOut)}
            <small>{b.nights ? `${b.nights} đêm` : "Trong ngày"}{b.arrivalTime ? ` · đến lúc ${b.arrivalTime}` : ""}</small>
          </dd>
        </div>
        <div>
          <dt>Phòng</dt>
          <dd>
            {b.items.map((i, k) => (
              <span key={k} className="c-preview__room">
                {i.quantity} × {i.roomTypeName || "phòng"} <small>{STAY_LABELS[i.stayType] ?? i.stayType}</small>
              </span>
            ))}
            <small>{b.guests} khách</small>
          </dd>
        </div>
        <div>
          <dt>Tiền</dt>
          <dd>
            <PayBar b={b} />
            <small>
              Đã trả {money(b.paid)} · Cọc {money(b.deposit)}
              {due ? ` · Còn ${money(due)}` : ""}
            </small>
          </dd>
        </div>
        {b.promoCode ? (
          <div>
            <dt>Mã ưu đãi</dt>
            <dd>{b.promoCode}</dd>
          </div>
        ) : null}
        {b.note ? (
          <div>
            <dt>Khách ghi chú</dt>
            <dd className="c-preview__note">{b.note}</dd>
          </div>
        ) : null}
        {b.staffNote ? (
          <div>
            <dt>Ghi chú nội bộ</dt>
            <dd className="c-preview__note">{b.staffNote}</dd>
          </div>
        ) : null}
        <div>
          <dt>Tạo lúc</dt>
          <dd className="c-muted">{formatTime(b.createdAt)}</dd>
        </div>
      </dl>

      <Link className="c-btn c-btn--primary" href={`/quan-tri/dat-phong/sua?id=${b.id}`}>
        Mở để sửa, đổi trạng thái
      </Link>
    </article>
  );
}
