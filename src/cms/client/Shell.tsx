"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { api, ROLE_LABELS, type Role } from "./api";
import { Icon, type IconName } from "./icons";
import { SessionProvider, useSession } from "./session";

// Menu CMS theo công việc và vai trò. Mục có "legacy" chưa làm lại, tạm mở trang của CMS cũ (/admin).
type Item = { href: string; label: string; icon: IconName; roles?: Role[]; legacy?: boolean };
type Group = { title?: string; roles?: Role[]; items: Item[] };

const ALL: Role[] = ["owner", "manager", "staff"];
const MANAGE: Role[] = ["owner", "manager"];

const NAV: Group[] = [
  {
    items: [
      { href: "/quan-tri", label: "Hôm nay", icon: "today" },
      { href: "/quan-tri/dat-phong", label: "Đặt phòng", icon: "bookings" },
      { href: "/quan-tri/lich-phong", label: "Lịch phòng", icon: "calendar" },
    ],
  },
  {
    title: "Phòng & giá",
    items: [
      { href: "/quan-tri/hang-phong", label: "Hạng phòng", icon: "roomTypes" },
      { href: "/quan-tri/phong", label: "Danh sách phòng", icon: "rooms" },
      { href: "/quan-tri/gia-theo-ngay", label: "Giá theo ngày", icon: "rates" },
    ],
  },
  {
    title: "Website",
    roles: MANAGE,
    items: [
      { href: "/quan-tri/trang", label: "Trang", icon: "pages" },
      { href: "/quan-tri/uu-dai", label: "Ưu đãi", icon: "offers" },
      { href: "/quan-tri/thu-vien-anh", label: "Thư viện ảnh", icon: "media" },
      { href: "/quan-tri/danh-gia", label: "Đánh giá của khách", icon: "reviews" },
      { href: "/quan-tri/hoi-dap", label: "Hỏi đáp", icon: "faqs" },
    ],
  },
  {
    title: "Cài đặt",
    roles: MANAGE,
    items: [
      { href: "/quan-tri/thong-tin", label: "Thông tin khách sạn", icon: "hotel" },
      { href: "/quan-tri/giao-dien", label: "Giao diện", icon: "theme" },
      { href: "/quan-tri/tai-khoan", label: "Tài khoản", icon: "users", roles: ["owner"] },
      { href: "/quan-tri/nhat-ky", label: "Nhật ký thao tác", icon: "audit" },
    ],
  },
];

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
      {NAV.filter((g) => (g.roles ?? ALL).includes(role)).map((g, i) => {
        const items = g.items.filter((it) => (it.roles ?? ALL).includes(role));
        if (!items.length) return null;
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

function Frame({ children }: { children: ReactNode }) {
  const { user } = useSession();
  const [open, setOpen] = useState(false);

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
        <main className="c-page">{children}</main>
      </div>
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
