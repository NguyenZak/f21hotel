import Link from "next/link";
import type { ReactNode } from "react";
import { nav, site, telLink, zaloLink } from "@/lib/site";
import { IconPhone, IconZalo } from "./Icons";

type Props = {
  /** Mã lỗi hiện cỡ lớn, ví dụ "404" */
  code: string;
  title: string;
  children: ReactNode;
  /** Nút chính (Về trang chủ, Thử lại…) */
  actions: ReactNode;
  /** Trang đứng riêng, không có header/footer của website (global-not-found, global-error): hiện thêm logo */
  standalone?: boolean;
};

// Giao diện chung của các trang lỗi (404, 500). Không đọc CMS: trang lỗi phải nhẹ và vẫn hiện được
// khi D1 hay Next.js đang lỗi, nên số điện thoại lấy từ src/lib/site.ts.
// Liên kết tới các trang chính giúp khách (và Google) đi tiếp thay vì rời trang.
export function ErrorView({ code, title, children, actions, standalone }: Props) {
  return (
    <section className={standalone ? "errpage errpage-standalone on-dark" : "errpage on-dark"}>
      <div className="errpage-inner">
        {standalone ? (
          <Link className="errpage-logo" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element -- trang lỗi đứng riêng, ảnh nhỏ */}
            <img src="/img/logo-ngang-trang.png" alt={site.name} width={674} height={221} />
          </Link>
        ) : null}
        <p className="errpage-code" aria-hidden="true">
          {code}
        </p>
        <h1>{title}</h1>
        <div className="errpage-text">{children}</div>
        <div className="errpage-actions">{actions}</div>

        <nav className="errpage-links" aria-label="Trang chính">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>

        <p className="errpage-contact">
          Cần đặt phòng ngay?{" "}
          <a href={telLink}>
            <IconPhone /> {site.phoneDisplay}
          </a>
          <a href={zaloLink} target="_blank" rel="noopener">
            <IconZalo /> Nhắn Zalo
          </a>
        </p>
      </div>
    </section>
  );
}
