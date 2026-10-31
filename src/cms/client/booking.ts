"use client";

// Tiện ích giao diện đặt phòng của CMS mới: nhãn, định dạng, dữ liệu hạng phòng/phòng (tải một lần)
import { BOOKING_SOURCES, BOOKING_STATUSES, normalizePhone } from "@/lib/booking";
import type { BookingDTO, Meta } from "../types";
import { api } from "./api";

export const statusLabel = (s: string) => BOOKING_STATUSES.find((x) => x.value === s)?.label ?? s;
export const sourceLabel = (s: string) => BOOKING_SOURCES.find((x) => x.value === s)?.label ?? s;
export const STAY_LABELS: Record<string, string> = { fullDay: "Ngày đêm", overnight: "Qua đêm", hourly: "Nghỉ giờ" };
export const money = (n: number | null | undefined) => (typeof n === "number" ? `${n.toLocaleString("vi-VN")}đ` : "—");

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
// "2026-11-07" -> "T7 07/11"
export const dayLabel = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return `${WEEKDAYS[d.getUTCDay()]} ${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
};

// "2026-11" -> "T11/26"; 0.734 -> "73%"
export const monthLabel = (ym: string) => `T${Number(ym.slice(5, 7))}/${ym.slice(2, 4)}`;
export const pct = (x: number) => `${Math.round(x * 100)}%`;

export const roomsText = (b: BookingDTO) => b.items.map((i) => `${i.quantity} × ${i.roomTypeName || "phòng"}`).join(", ");
export const telHref = (phone: string) => `tel:${normalizePhone(phone)}`;
export const zaloHref = (phone: string) => `https://zalo.me/${normalizePhone(phone)}`;

// Hạng phòng, phòng, % cọc: ít đổi, tải một lần cho cả phiên làm việc
let metaPromise: Promise<Meta> | null = null;
export const loadMeta = () => (metaPromise ??= api<Meta>("meta").catch((e) => ((metaPromise = null), Promise.reject(e))));

// Trình tự thao tác theo trạng thái (giống thanh thao tác của CMS cũ)
export type Step = { to: string; label: string; primary?: boolean; confirm?: string };
export const NEXT_STEPS: Record<string, Step[]> = {
  pending: [
    { to: "confirmed", label: "Xác nhận", primary: true },
    { to: "cancelled", label: "Huỷ đơn", confirm: "Huỷ đặt phòng này? Phòng sẽ được trả lại để bán." },
  ],
  confirmed: [
    { to: "checked_in", label: "Nhận phòng", primary: true },
    { to: "no_show", label: "Khách không đến", confirm: "Đánh dấu khách không đến? Phòng sẽ được trả lại để bán." },
    { to: "cancelled", label: "Huỷ đơn", confirm: "Huỷ đặt phòng này? Phòng sẽ được trả lại để bán." },
  ],
  checked_in: [{ to: "checked_out", label: "Trả phòng", primary: true }],
};
