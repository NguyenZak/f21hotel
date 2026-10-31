import type { Metadata, Viewport } from "next";
import { fontVariables } from "../(site)/fonts";
import { CmsTheme } from "@/cms/client/theme";
import "./cms.css";

export const metadata: Metadata = {
  title: { default: "Quản lý F21 Hotel", template: "%s · Quản lý F21 Hotel" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#8d191d" };

// CMS mới chạy trong trình duyệt: trang tĩnh, dữ liệu lấy qua /api/cms/* (src/cms/server/api.ts)
export default function CmsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // next-themes gắn data-theme lên <html> trước khi React chạy, nên thuộc tính này khác với HTML dựng sẵn
    <html lang="vi" className={fontVariables} suppressHydrationWarning>
      <body className="cms">
        <CmsTheme>{children}</CmsTheme>
      </body>
    </html>
  );
}
