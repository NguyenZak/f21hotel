"use client";

import { track } from "@/lib/track";

// Nút Zalo / Facebook nổi ở góc phải dưới, mọi trang. Facebook để trống trong CMS thì ẩn.
export function FloatContact({ zaloLink, facebook }: { zaloLink: string; facebook: string }) {
  return (
    <div className="float-contact" aria-label="Nhắn tin cho khách sạn">
      {facebook ? (
        <a href={facebook} target="_blank" rel="noopener" title="Facebook" onClick={() => track("click_facebook", { from: "float" })}>
          <img src="/img/logo-facebook.svg" alt="Facebook" width={50} height={50} />
        </a>
      ) : null}
      <a href={zaloLink} target="_blank" rel="noopener" title="Nhắn Zalo" onClick={() => track("click_zalo", { from: "float" })}>
        <img src="/img/logo-zalo.svg" alt="Zalo" width={50} height={50} />
      </a>
    </div>
  );
}
