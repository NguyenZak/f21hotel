import type { Metadata } from "next";
import { fontVariables } from "../(site)/fonts";
import "@puckeditor/core/puck.css";
// CSS của website: Puck chép sang khung xem trước để khối hiện giống trang thật
import "../(site)/globals.css";
import "./editor.css";

export const metadata: Metadata = {
  title: "Trình dựng trang · F21 Hotel CMS",
  robots: { index: false, follow: false },
};

// Trình dựng trang chạy riêng, không có header/footer của website
export default function EditorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={fontVariables}>
      <body className="puck-host">{children}</body>
    </html>
  );
}
