"use client";

import Link from "next/link";
import type { Contact } from "@/lib/site";
import { track } from "@/lib/track";
import { IconCalendar, IconPhone, IconZalo } from "./Icons";

// Thanh Gọi / Zalo / Đặt phòng luôn hiện ở cuối màn hình điện thoại
export function ContactBar({ contact }: { contact: Contact }) {
  const { telLink, zaloLink } = contact;
  return (
    <nav className="mobile-bar" aria-label="Liên hệ nhanh" style={{ viewTransitionName: "mobile-bar" }}>
      <a href={telLink} onClick={() => track("click_call", { from: "mobile_bar" })}>
        <IconPhone />
        Gọi
      </a>
      <a href={zaloLink} target="_blank" rel="noopener" onClick={() => track("click_zalo", { from: "mobile_bar" })}>
        <IconZalo />
        Zalo
      </a>
      <Link className="book" href="/dat-phong">
        <IconCalendar />
        Đặt phòng
      </Link>
    </nav>
  );
}
