"use client";

import { Command, defaultFilter } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { BookingDTO } from "../types";
import { api, type Role } from "./api";
import { dayLabel, statusLabel } from "./booking";
import { Icon } from "./icons";
import { navFor } from "./nav";
import { useDarkToggle } from "./theme";

// Bỏ dấu tiếng Việt để gõ "gia" vẫn ra "Giá theo ngày"
const plain = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
const filter = (value: string, search: string, keywords?: string[]) => defaultFilter(plain(value), plain(search), keywords?.map(plain));

// Bảng lệnh Ctrl+K (cmdk): đi tới trang, tìm đặt phòng theo mã / tên / số điện thoại, thao tác nhanh.
// Tải riêng khi mở lần đầu (Shell.tsx), không nằm trong gói JS ban đầu của CMS.
export function CommandPalette({
  open,
  onOpenChange,
  role,
  onLogout,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
  onLogout: () => void;
}) {
  const router = useRouter();
  const { dark, setTheme } = useDarkToggle();
  const [search, setSearch] = useState("");
  const [found, setFound] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(false);

  // Tìm đặt phòng trên máy chủ khi gõ từ 2 ký tự, chờ ngừng gõ 250 ms
  const q = search.trim();
  useEffect(() => {
    if (q.length < 2) return;
    let alive = true;
    const t = setTimeout(() => {
      setLoading(true);
      api<{ bookings: BookingDTO[] }>(`bookings?filter=all&q=${encodeURIComponent(q)}&page=1`)
        .then((r) => alive && setFound(r.bookings.slice(0, 8)))
        .catch(() => alive && setFound([]))
        .finally(() => alive && setLoading(false));
    }, 250);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [q]);

  const run = (fn: () => void) => {
    onOpenChange(false);
    setSearch("");
    fn();
  };
  const go = (href: string) => run(() => router.push(href));
  const bookings = q.length >= 2 ? found : [];

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Tìm nhanh"
      className="c-cmdk"
      overlayClassName="c-cmdk-overlay"
      contentClassName="c-cmdk-content"
      filter={filter}
      loop
    >
      <div className="c-cmdk__input">
        <Icon name="search" />
        <Command.Input value={search} onValueChange={setSearch} placeholder="Tìm trang, mã đặt phòng, tên khách, số điện thoại…" />
        <kbd>Esc</kbd>
      </div>
      <Command.List className="c-cmdk__list">
        {loading ? <Command.Loading>Đang tìm đặt phòng…</Command.Loading> : null}
        <Command.Empty>Không thấy kết quả{q ? ` cho “${q}”` : ""}.</Command.Empty>

        {bookings.length ? (
          <Command.Group heading="Đặt phòng">
            {bookings.map((b) => (
              // keywords chứa đúng chữ đang gõ để kết quả từ máy chủ không bị cmdk lọc mất (số điện thoại có thể khác định dạng)
              <Command.Item
                key={b.id}
                value={`booking-${b.id} ${b.code} ${b.guestName}`}
                keywords={[q]}
                onSelect={() => go(`/quan-tri/dat-phong/sua?id=${b.id}`)}
              >
                <Icon name="bookings" />
                <span className="c-cmdk__main">
                  <b>{b.guestName}</b>
                  <small>
                    {b.code} · {dayLabel(b.checkIn)} → {dayLabel(b.checkOut)} · {b.phone}
                  </small>
                </span>
                <span className={`c-status c-status--${b.status}`}>{statusLabel(b.status)}</span>
              </Command.Item>
            ))}
          </Command.Group>
        ) : null}

        <Command.Group heading="Thao tác">
          <Command.Item value="Đặt phòng mới" keywords={["thêm", "tạo", "booking"]} onSelect={() => go("/quan-tri/dat-phong/moi")}>
            <Icon name="plus" />
            <span className="c-cmdk__main">Đặt phòng mới</span>
          </Command.Item>
          <Command.Item value={dark ? "Giao diện sáng" : "Giao diện tối"} keywords={["sáng", "tối", "dark", "theme"]} onSelect={() => run(() => setTheme(dark ? "light" : "dark"))}>
            <Icon name={dark ? "sun" : "moon"} />
            <span className="c-cmdk__main">{dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}</span>
          </Command.Item>
          <Command.Item value="Theo giao diện của máy" keywords={["system", "tự động"]} onSelect={() => run(() => setTheme("system"))}>
            <Icon name="theme" />
            <span className="c-cmdk__main">Giao diện theo máy</span>
          </Command.Item>
          <Command.Item value="Hồ sơ của tôi" keywords={["mật khẩu", "tên"]} onSelect={() => go("/quan-tri/ho-so")}>
            <Icon name="users" />
            <span className="c-cmdk__main">Hồ sơ của tôi, đổi mật khẩu</span>
          </Command.Item>
          <Command.Item value="Đăng xuất" keywords={["logout", "thoát"]} onSelect={() => run(onLogout)}>
            <Icon name="logout" />
            <span className="c-cmdk__main">Đăng xuất</span>
          </Command.Item>
        </Command.Group>

        {navFor(role).map((g, i) => (
          <Command.Group key={g.title ?? i} heading={g.title ?? "Vận hành"}>
            {g.items.map((it) => (
              <Command.Item key={it.href} value={it.label} keywords={[g.title ?? "", ...(it.keywords ?? [])]} onSelect={() => go(it.href)}>
                <Icon name={it.icon} />
                <span className="c-cmdk__main">{it.label}</span>
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
      <div className="c-cmdk__foot" aria-hidden="true">
        <span>
          <kbd>↑</kbd> <kbd>↓</kbd> chọn
        </span>
        <span>
          <kbd>Enter</kbd> mở
        </span>
      </div>
    </Command.Dialog>
  );
}
