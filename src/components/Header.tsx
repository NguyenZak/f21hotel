"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, type Contact } from "@/lib/site";
import { track } from "@/lib/track";
import { IconPhone, IconZalo } from "./Icons";

export function Header({ contact }: { contact: Contact }) {
  const { name, phoneDisplay, telLink, zaloLink } = contact;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Đóng menu khi chuyển trang
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.toggleAttribute("data-menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    // Tên view-transition giữ header đứng yên khi chuyển trang
    <header className={`site-header${open ? " menu-open" : ""}`} style={{ viewTransitionName: "site-header" }}>
      <div className="wrap">
        <Link href="/" className="brand" aria-label={`${name} – Trang chủ`}>
          <Image src="/img/logo-ngang.png" alt="" width={673} height={221} priority />
        </Link>

        <nav className="nav" id="site-nav" aria-label="Điều hướng chính">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={pathname.startsWith(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="nav-extra">
            <Link className="btn btn-gold btn-block" href="/dat-phong">
              Đặt phòng
            </Link>
            <a className="btn btn-ghost btn-block" href={telLink} onClick={() => track("click_call", { from: "menu" })}>
              <IconPhone /> {phoneDisplay}
            </a>
            <a
              className="btn btn-ghost btn-block"
              href={zaloLink}
              target="_blank"
              rel="noopener"
              onClick={() => track("click_zalo", { from: "menu" })}
            >
              <IconZalo /> Nhắn Zalo
            </a>
          </div>
        </nav>

        <div className="header-cta">
          <a className="header-phone" href={telLink} onClick={() => track("click_call", { from: "header" })}>
            <small>Hotline đặt phòng</small>
            <strong>{phoneDisplay}</strong>
          </a>
          <Link className="btn btn-gold" href="/dat-phong">
            Đặt phòng
          </Link>
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>
      </div>
    </header>
  );
}
