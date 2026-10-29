"use client";

import { useEffect } from "react";

const SELECTOR = ".reveal:not([data-in]), .reveal-stagger > :not([data-in])";

// Nút DOM đã được React hydrate thì có khoá __reactFiber$…
const isHydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith("__reactFiber$"));

// Gắn data-in cho khối .reveal và con của .reveal-stagger khi lọt vào màn hình.
// Các khối hiện cùng lúc được đánh số data-i theo thứ tự trong trang để CSS lệch nhịp cho nhau.
// Phần trang stream tới sau có thể chưa hydrate: gắn thuộc tính lúc đó React sẽ báo lệch HTML,
// nên khối nào chưa hydrate thì chờ thêm (tối đa 8 giây) rồi mới gắn.
export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-motion")) return;
    root.setAttribute("data-motion-ready", "");

    // Nếu React đổi cách đánh dấu nút thì bỏ qua bước chờ, không để nội dung bị ẩn
    const canDetect = isHydrated(document.body);
    const waiting = new Map<HTMLElement, number>();
    let retry = 0;

    const reveal = (els: HTMLElement[]) => {
      const now = performance.now();
      const ready = els.filter((el) => {
        const since = waiting.get(el) ?? now;
        const ok = !canDetect || isHydrated(el) || now - since > 8000;
        if (ok) waiting.delete(el);
        else waiting.set(el, since);
        return ok;
      });
      ready
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
        .forEach((el, i) => {
          el.dataset.i = String(Math.min(i, 12));
          el.dataset.in = "";
        });
      if (waiting.size && !retry) retry = requestAnimationFrame(() => ((retry = 0), reveal([...waiting.keys()])));
    };

    const io = new IntersectionObserver(
      (entries) => {
        const shown = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
        shown.forEach((el) => io.unobserve(el));
        reveal(shown);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    const scan = () => document.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    scan();

    // Trang mới khi chuyển route, hoặc nội dung tải sau, cũng được theo dõi
    let frame = 0;
    const mo = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), scan()));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(retry);
    };
  }, []);

  return null;
}
