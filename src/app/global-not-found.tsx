// Trang 404 cho mọi đường dẫn không khớp trang nào (next.config.ts: experimental.globalNotFound).
// Cần file này vì app có nhiều root layout ((site), (cms), (editor)), không có layout chung để dựng 404.
// Next.js trả thẳng trang này, không qua layout của website: tự nạp CSS, font, và không đọc D1
// (bot dò đường dẫn lạ rất nhiều, trang 404 phải gần như không tốn CPU).
// Next.js tự gắn <meta name="robots" content="noindex"> và trả mã 404.
import type { Metadata } from "next";
import Link from "next/link";
import { ErrorView } from "@/components/ErrorView";
import { site } from "@/lib/site";
import { fontRoleStyle, fontVariables } from "./(site)/fonts";
import "./(site)/globals.css";

export const metadata: Metadata = {
  title: `Không tìm thấy trang | ${site.name}`,
  description: "Trang bạn tìm không có hoặc đã đổi địa chỉ.",
};

export default function GlobalNotFound() {
  return (
    <html lang="vi" className={fontVariables} style={fontRoleStyle()}>
      <body>
        <main id="noi-dung">
          <ErrorView
            standalone
            code="404"
            title="Không tìm thấy trang"
            actions={
              <>
                <Link className="btn btn-gold" href="/">
                  Về trang chủ
                </Link>
                <Link className="btn btn-ghost" href="/dat-phong">
                  Đặt phòng
                </Link>
              </>
            }
          >
            <p>Đường dẫn có thể đã đổi hoặc gõ nhầm. Phòng ở F21 thì vẫn còn, mời bạn xem tiếp bên dưới.</p>
          </ErrorView>
        </main>
      </body>
    </html>
  );
}
