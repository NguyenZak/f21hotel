"use client";

import { useDocumentInfo, useForm, useFormFields } from "@payloadcms/ui";
import { useState } from "react";
import { normalizePhone, statusLabel } from "@/lib/booking";

// Thanh thao tác ở trang sửa đặt phòng: đổi trạng thái theo đúng trình tự và lưu ngay.
// Lưu qua form của Payload nên hook kiểm tra trùng phòng và nhật ký thao tác vẫn chạy.

type Step = { to: string; label: string; primary?: boolean; confirm?: string };

const NEXT: Record<string, Step[]> = {
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

export function BookingActions() {
  const { id } = useDocumentInfo();
  const fields = useFormFields(([f]) => f);
  const { dispatchFields, submit } = useForm();
  const [busy, setBusy] = useState(false);

  const status = String(fields.status?.value ?? "");
  const phone = normalizePhone(String(fields.phone?.value ?? ""));
  // Số phòng còn thiếu: tổng quantity của các dòng trừ số phòng đã gán (nghỉ giờ cũng cần gán phòng)
  const rows = Object.keys(fields)
    .map((k) => k.match(/^items\.(\d+)\.quantity$/)?.[1])
    .filter((i): i is string => i !== undefined);
  const missing = rows.reduce((n, i) => {
    const qty = Number(fields[`items.${i}.quantity`]?.value ?? 0);
    const rooms = fields[`items.${i}.rooms`]?.value;
    return n + Math.max(0, qty - (Array.isArray(rooms) ? rooms.length : 0));
  }, 0);

  if (!id) return null;
  const steps = NEXT[status] ?? [];

  const go = async (step: Step) => {
    if (step.confirm && !window.confirm(step.confirm)) return;
    setBusy(true);
    dispatchFields({ type: "UPDATE", path: "status", value: step.to });
    try {
      await submit({ overrides: { status: step.to } });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="f21-actions">
      <span className="f21-actions__status">
        Trạng thái: <span className={`f21-status f21-status--${status}`}>{statusLabel(status)}</span>
      </span>
      {steps.map((s) => {
        const needRooms = s.to === "checked_in" && missing > 0;
        return (
          <button
            key={s.to}
            type="button"
            className={`f21-actions__btn${s.primary ? " is-primary" : ""}`}
            disabled={busy || needRooms}
            title={needRooms ? `Gán thêm ${missing} phòng ở mục "Phòng" trước khi nhận phòng` : undefined}
            onClick={() => go(s)}
          >
            {s.label}
          </button>
        );
      })}
      {steps.some((s) => s.to === "checked_in") && missing > 0 ? (
        <span className="f21-actions__hint">Còn {missing} phòng chưa gán số</span>
      ) : null}
      {phone ? (
        <span className="f21-contact">
          <a href={`tel:${phone}`}>Gọi</a>
          <a href={`https://zalo.me/${phone}`} target="_blank" rel="noopener">
            Zalo
          </a>
        </span>
      ) : null}
    </div>
  );
}
