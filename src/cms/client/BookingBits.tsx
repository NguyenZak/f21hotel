"use client";

// Mảnh giao diện nhỏ dùng chung cho Đặt phòng, Lịch phòng và trang sửa: nhãn trạng thái có chấm màu,
// ngày ở so với hôm nay, số phòng đã gán, thanh tiền đã thu, các bước của một đơn.
import { nightsBetween } from "@/lib/dates";
import type { BookingDTO, Meta } from "../types";
import { money, statusLabel } from "./booking";

export function StatusBadge({ status }: { status: string }) {
  return <span className={`c-status c-status--${status}`}>{statusLabel(status)}</span>;
}

// "Hôm nay", "Ngày mai", "Còn 3 ngày", "Đang ở", "Trả hôm nay"; đơn đã xong hoặc đã huỷ thì không nhắc
export function stayHint(b: BookingDTO, today: string): { text: string; tone: "now" | "soon" | "later" } | null {
  if (["checked_out", "cancelled", "no_show"].includes(b.status)) return null;
  if (b.checkOut === today && b.checkIn < today) return { text: "Trả hôm nay", tone: "now" };
  if (b.checkIn === today) return { text: "Đến hôm nay", tone: "now" };
  if (b.checkIn < today && b.checkOut > today) return { text: b.status === "checked_in" ? "Đang ở" : "Quá ngày đến", tone: "now" };
  if (b.checkIn < today) return null;
  const n = nightsBetween(today, b.checkIn) ?? 0;
  return n === 1 ? { text: "Ngày mai", tone: "soon" } : { text: `Còn ${n} ngày`, tone: n <= 3 ? "soon" : "later" };
}

export function StayHint({ b, today }: { b: BookingDTO; today: string }) {
  const h = stayHint(b, today);
  return h ? <span className={`c-when c-when--${h.tone}`}>{h.text}</span> : null;
}

// Số phòng đã gán dạng ô nhỏ; phòng chưa gán hiện cảnh báo (đơn còn giữ phòng)
export function RoomBadges({ b, meta }: { b: BookingDTO; meta: Meta | null }) {
  const numberOf = (id: number) => meta?.rooms.find((r) => r.id === id)?.number ?? `#${id}`;
  const assigned = b.items.flatMap((i) => i.rooms);
  const missing = b.items.reduce((n, i) => n + Math.max(0, i.quantity - i.rooms.length), 0);
  const live = ["pending", "confirmed", "checked_in"].includes(b.status);
  return (
    <span className="c-roomtags">
      {assigned.map((id) => (
        <span key={id} className="c-roomtag">
          {numberOf(id)}
        </span>
      ))}
      {missing && live ? <span className="c-roomtag c-roomtag--missing">Chưa gán {missing}</span> : null}
      {missing && !live && !assigned.length ? <span className="c-muted">—</span> : null}
    </span>
  );
}

// Tiền đã thu so với tổng: thanh tiến độ và nhãn ngắn
export function payState(b: { total: number | null; paid: number; deposit: number }) {
  const total = b.total ?? 0;
  const paid = b.paid ?? 0;
  if (!total) return { ratio: 0, label: "Chưa có giá", tone: "none" as const };
  if (paid >= total) return { ratio: 1, label: "Đã thu đủ", tone: "full" as const };
  if (paid > 0) return { ratio: paid / total, label: `Đã thu ${money(paid)}`, tone: paid >= (b.deposit ?? 0) ? ("deposit" as const) : ("part" as const) };
  return { ratio: 0, label: "Chưa thu", tone: "none" as const };
}

export function PayBar({ b, showTotal = true }: { b: { total: number | null; paid: number; deposit: number }; showTotal?: boolean }) {
  const p = payState(b);
  return (
    <span className={`c-pay c-pay--${p.tone}`}>
      {showTotal ? <b>{money(b.total)}</b> : null}
      <span className="c-pay__track" aria-hidden="true">
        <span style={{ width: `${Math.round(p.ratio * 100)}%` }} />
      </span>
      <small>{p.label}</small>
    </span>
  );
}

// Bốn bước của một đơn; huỷ hoặc không đến thì hiện riêng
const FLOW = ["pending", "confirmed", "checked_in", "checked_out"];
export function StatusSteps({ status }: { status: string }) {
  const at = FLOW.indexOf(status);
  if (at < 0) return <StatusBadge status={status} />;
  return (
    <ol className="c-steps" aria-label={`Trạng thái: ${statusLabel(status)}`}>
      {FLOW.map((s, i) => (
        <li key={s} className={i < at ? "is-done" : i === at ? `is-current c-steps--${s}` : ""} aria-current={i === at ? "step" : undefined}>
          <span className="c-steps__dot">{i < at ? "✓" : i + 1}</span>
          {statusLabel(s)}
        </li>
      ))}
    </ol>
  );
}
