"use client";

import { useState } from "react";
import { track } from "@/lib/track";
import { IconZalo } from "./Icons";

// Chép mã đặt phòng; gửi nội dung đặt phòng cho lễ tân qua Zalo (chép sẵn để khách dán vào khung chat)
export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="bk-code"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
        } catch {
          // Trình duyệt chặn clipboard: khách vẫn bôi đen để chép được
        }
      }}
      aria-label={`Chép mã đặt phòng ${code}`}
    >
      <strong>{code}</strong>
      <small>{copied ? "Đã chép" : "Bấm để chép"}</small>
    </button>
  );
}

export function SendViaZalo({ summary, zaloLink }: { summary: string; zaloLink: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-gold"
      onClick={async () => {
        track("click_zalo", { from: "booking_confirmation" });
        try {
          await navigator.clipboard.writeText(summary);
          setCopied(true);
        } catch {
          // Như trên
        }
        window.open(zaloLink, "_blank", "noopener");
      }}
    >
      <IconZalo /> {copied ? "Đã chép, dán vào Zalo" : "Gửi qua Zalo"}
    </button>
  );
}
