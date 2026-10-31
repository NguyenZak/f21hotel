"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Liên kết nhanh đầu menu trái: bảng điều khiển và lịch phòng (trang tự viết, không thuộc collection nào)
const LINKS = [
  { href: "/admin", label: "Hôm nay" },
  { href: "/admin/lich-phong", label: "Lịch phòng" },
];

export function NavLinks() {
  const path = usePathname();
  return (
    <div className="f21-navlinks">
      {LINKS.map((l) => {
        const active = path === l.href;
        return (
          <Link key={l.href} href={l.href} className={`nav__link${active ? " active" : ""}`} aria-current={active ? "page" : undefined}>
            {active ? <span className="nav__link-indicator" /> : null}
            <span className="nav__link-label">{l.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
