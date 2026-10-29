"use client";

import Link from "next/link";
import { telLink, zaloLink } from "@/lib/site";
import { track } from "@/lib/track";
import { IconCalendar, IconChat, IconPhone } from "./Icons";

// Thanh Gọi / Zalo / Đặt phòng luôn hiện ở cuối màn hình điện thoại
export function ContactBar() {
  return (
    <nav className="mobile-bar" aria-label="Liên hệ nhanh">
      <a href={telLink} onClick={() => track("click_call", { from: "mobile_bar" })}>
        <IconPhone />
        Gọi
      </a>
      <a href={zaloLink} target="_blank" rel="noopener" onClick={() => track("click_zalo", { from: "mobile_bar" })}>
        <IconChat />
        Zalo
      </a>
      <Link className="book" href="/dat-phong">
        <IconCalendar />
        Đặt phòng
      </Link>
    </nav>
  );
}
