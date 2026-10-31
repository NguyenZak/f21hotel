"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { api, ROLE_LABELS, type Role } from "./api";
import { Icon } from "./icons";
import { navFor } from "./nav";
import { SessionProvider, useSession } from "./session";
import { ThemeToggle, useMounted } from "./theme";

function Nav({ role, onNavigate }: { role: Role; onNavigate: () => void }) {
  const path = usePathname();
  return (
    // Bấm một mục thì đóng menu (trên điện thoại menu là ngăn kéo)
    <nav
      className="c-nav"
      aria-label="Menu quản trị"
      onClick={(e) => (e.target as HTMLElement).closest("a") && onNavigate()}
    >
      <Link className="c-brand" href="/quan-tri">
        {/* eslint-disable-next-line @next/next/no-img-element -- biểu tượng nhỏ */}
        <img src="/img/bieu-tuong.png" alt="" width={30} height={29} />
        <span>
          <b>F21 HOTEL</b>
          <small>Quản lý khách sạn</small>
        </span>
      </Link>
      {navFor(role).map((g, i) => {
        const items = g.items;
        return (
          <div className="c-nav__group" key={g.title ?? i}>
            {g.title ? <h3>{g.title}</h3> : null}
            <ul>
              {items.map((it) => (
                <li key={it.href}>
                  <Link
                    className="c-nav__link"
                    href={it.href}
                    aria-current={path === it.href || (it.href !== "/quan-tri" && path.startsWith(`${it.href}/`)) ? "page" : undefined}
                    prefetch={!it.legacy}
                  >
                    <Icon name={it.icon} />
                    <span className="c-nav__label">{it.label}</span>
                    {it.legacy ? (
                      <span
                        className="c-nav__legacy"
                        title="Chưa làm lại, mở trang CMS cũ"
                      >
                        CMS cũ
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

// Bảng lệnh Ctrl+K: chỉ tải khi mở lần đầu
const CommandPalette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), { ssr: false });

function Frame({ children }: { children: ReactNode }) {
  const { user } = useSession();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(false);
  const [paletteUsed, setPaletteUsed] = useState(false);
  const mac = useMounted() && /Mac|iPhone|iPad/.test(navigator.userAgent);
  const openPalette = () => {
    setPaletteUsed(true);
    setPalette(true);
  };

  // Ctrl+K (Windows) / ⌘K (Mac) mở bảng lệnh ở mọi trang
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey) && !e.altKey) {
        e.preventDefault();
        setPaletteUsed(true);
        setPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const logout = async () => {
    await api("logout", { body: {} }).catch(() => {});
    // Tải lại hẳn trang để xoá dữ liệu của phiên cũ trong bộ nhớ
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    location.href = "/quan-tri/dang-nhap";
  };

  // Khung và nội dung trang luôn được dựng (kể cả lúc dựng sẵn trang tĩnh); menu và tên người dùng
  // hiện khi đã biết ai đang đăng nhập. Chưa đăng nhập thì API trả 401 và chuyển về trang đăng nhập.
  return (
    <div
      className="c-app"
      data-nav-open={open || undefined}
      onClick={(e) => open && e.target === e.currentTarget && setOpen(false)}
    >
      {user ? (
        <Nav role={user.role} onNavigate={() => setOpen(false)} />
      ) : (
        <nav className="c-nav" aria-busy="true" />
      )}
      <div className="c-main">
        <header className="c-top">
          <button
            className="c-btn c-btn--ghost c-top__menu"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Mở menu"
          >
            ☰ Menu
          </button>
          <button className="c-cmdk-trigger" type="button" onClick={openPalette} aria-keyshortcuts="Control+K Meta+K">
            <Icon name="search" />
            <span>Tìm nhanh…</span>
            <kbd>{mac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          <ThemeToggle />
          {user ? (
            <div className="c-user">
              <Link
                className="c-user__name"
                href="/quan-tri/ho-so"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <b>{user.name}</b>
                <small>{ROLE_LABELS[user.role]}</small>
              </Link>
              <button
                className="c-btn c-btn--small"
                type="button"
                onClick={logout}
              >
                Đăng xuất
              </button>
            </div>
          ) : null}
        </header>
        {/* Chuyển trang: key đổi theo đường dẫn để hiệu ứng CSS c-page-in chạy lại (cms.css) */}
        <main key={path} className="c-page">
          {children}
        </main>
      </div>
      {user && paletteUsed ? <CommandPalette open={palette} onOpenChange={setPalette} role={user.role} onLogout={logout} /> : null}
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Frame>{children}</Frame>
    </SessionProvider>
  );
}
