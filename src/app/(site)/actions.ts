"use server";

import {
  isValidPhone,
  normalizePhone,
  type BookingField,
  type BookingKind,
  type BookingState,
  type BookingValues,
} from "@/lib/booking";
import { formatViDate, nightsBetween } from "@/lib/dates";
import { rooms, stayModes } from "@/lib/site";

const FIELDS: BookingField[] = [
  "name",
  "phone",
  "checkIn",
  "checkOut",
  "guests",
  "room",
  "stayType",
  "roomCount",
  "code",
  "company",
  "groupType",
  "invoice",
  "note",
];

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

export async function submitBooking(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const kind: BookingKind = formData.get("kind") === "group" ? "group" : "booking";

  const values: BookingValues = {};
  for (const f of FIELDS) {
    const v = formData.get(f);
    if (typeof v === "string") values[f] = v.trim().slice(0, f === "note" ? 1000 : 120);
  }

  // Ô ẩn chống spam: người thật không điền ô này
  if (formData.get("website")) return { status: "ok", values: {}, summary: "", delivered: true };

  const errors: BookingState["errors"] = {};
  if (!values.name) errors.name = "Vui lòng nhập họ tên.";
  if (!values.phone) errors.phone = "Vui lòng nhập số điện thoại.";
  else if (!isValidPhone(values.phone)) errors.phone = "Số điện thoại chưa đúng, ví dụ 0912 345 678.";
  if (!values.checkIn || !isoDate.test(values.checkIn)) errors.checkIn = "Vui lòng chọn ngày nhận phòng.";
  if (!values.checkOut || !isoDate.test(values.checkOut)) errors.checkOut = "Vui lòng chọn ngày trả phòng.";
  else if (values.checkIn && !nightsBetween(values.checkIn, values.checkOut))
    errors.checkOut = "Ngày trả phòng phải sau ngày nhận phòng.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Vui lòng kiểm tra lại các ô được đánh dấu.", errors, values };
  }

  const summary = buildSummary(kind, values);
  const delivered = await deliver(kind, values, summary);

  return { status: "ok", summary, delivered, values: {} };
}

function buildSummary(kind: BookingKind, v: BookingValues) {
  const nights = nightsBetween(v.checkIn!, v.checkOut!);
  const roomName = rooms.find((r) => r.slug === v.room)?.name;
  const stay = stayModes.find((m) => m.key === v.stayType)?.label;
  const lines = [
    kind === "group" ? "YÊU CẦU BÁO GIÁ ĐOÀN – F21 HOTEL" : "YÊU CẦU ĐẶT PHÒNG – F21 HOTEL",
    `Họ tên: ${v.name}`,
    `Điện thoại: ${normalizePhone(v.phone!)}`,
    v.company && `Công ty / gia đình: ${v.company}`,
    v.groupType && `Loại đoàn: ${v.groupType}`,
    `Nhận phòng: ${formatViDate(v.checkIn!)}`,
    `Trả phòng: ${formatViDate(v.checkOut!)}${nights ? ` (${nights} đêm)` : ""}`,
    v.guests && `Số khách: ${v.guests}`,
    roomName && `Loại phòng: ${roomName}`,
    stay && `Hình thức: ${stay}`,
    v.roomCount && `Số phòng: ${v.roomCount}`,
    v.invoice === "yes" && "Cần xuất hoá đơn VAT",
    v.code && `Mã ưu đãi: ${v.code.toUpperCase()}`,
    v.note && `Ghi chú: ${v.note}`,
  ];
  return lines.filter(Boolean).join("\n");
}

// Gửi yêu cầu tới Google Apps Script (lưu Google Sheet và email cho lễ tân).
// Xem docs/google-apps-script.md để tạo URL này.
async function deliver(kind: BookingKind, v: BookingValues, summary: string) {
  const url = process.env.BOOKING_WEBHOOK_URL;
  if (!url) {
    console.warn("[booking] BOOKING_WEBHOOK_URL chưa được cấu hình, yêu cầu chưa được lưu:\n" + summary);
    return false;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        ...v,
        phone: v.phone ? normalizePhone(v.phone) : "",
        nights: nightsBetween(v.checkIn ?? "", v.checkOut ?? ""),
        summary,
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[booking] Webhook trả về", res.status);
    return res.ok;
  } catch (err) {
    console.error("[booking] Không gửi được webhook", err);
    return false;
  }
}
