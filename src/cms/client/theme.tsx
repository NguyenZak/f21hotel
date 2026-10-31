"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { useSyncExternalStore, type ReactNode } from "react";
import { Icon } from "./icons";

// Giao diện sáng / tối của CMS (next-themes). Mặc định theo cài đặt của máy; chọn tay thì nhớ trong trình duyệt.
// Màu tối khai báo ở cms.css (:root[data-theme="dark"]).
export function CmsTheme({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem storageKey="f21-cms-theme" disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

// Lúc dựng trên server chưa biết giao diện đang dùng: chờ chạy ở trình duyệt mới hiện đúng icon
const noop = () => () => {};
export const useMounted = () => useSyncExternalStore(noop, () => true, () => false);

export function useDarkToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return { dark, toggle: () => setTheme(dark ? "light" : "dark"), setTheme };
}

export function ThemeToggle() {
  const mounted = useMounted();
  const { dark, toggle } = useDarkToggle();
  const label = mounted && dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối";
  return (
    <button type="button" className="c-iconbtn c-theme-toggle" onClick={toggle} aria-label={label} title={label}>
      <Icon name={mounted && dark ? "sun" : "moon"} />
    </button>
  );
}
