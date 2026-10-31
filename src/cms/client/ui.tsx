"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

// Hộp thoại dùng thẻ <dialog> của trình duyệt (tự giữ focus, Esc để đóng)
export function Dialog({
  open,
  title,
  onClose,
  onSubmit,
  submitLabel = "Lưu",
  busy,
  error,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  busy?: boolean;
  error?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="c-dialog" onClose={onClose}>
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="c-dialog__head">
          <h2>{title}</h2>
          <button type="button" className="c-btn c-btn--ghost c-btn--small" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>
        <div className="c-dialog__body">
          {error ? (
            <p className="c-alert c-alert--error" role="alert">
              {error}
            </p>
          ) : null}
          {children}
        </div>
        <div className="c-dialog__foot">
          <button type="button" className="c-btn" onClick={onClose}>
            Huỷ
          </button>
          <button type="submit" className="c-btn c-btn--primary" disabled={busy}>
            {busy ? "Đang lưu…" : submitLabel}
          </button>
        </div>
      </form>
    </dialog>
  );
}

// Thông báo ngắn ở cuối màn hình, tự ẩn sau 3 giây
export function useToast() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3000);
    return () => clearTimeout(t);
  }, [msg]);
  const node = (
    <AnimatePresence>
      {msg ? (
        <m.div
          key={msg}
          className="c-toast"
          role="status"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        >
          {msg}
        </m.div>
      ) : null}
    </AnimatePresence>
  );
  return [node, setMsg] as const;
}

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" });

// Mật khẩu ngẫu nhiên dễ đọc (bỏ ký tự dễ nhầm) để Chủ gửi cho nhân viên mới
export function randomPassword(length = 14) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)), (b) => chars[b % chars.length]).join("");
}
