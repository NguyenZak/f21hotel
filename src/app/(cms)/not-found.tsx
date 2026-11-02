// Đường dẫn /quan-tri/... không có trang nào
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Không tìm thấy trang" };

export default function CmsNotFound() {
  return (
    <main className="c-error">
      <h1>Không tìm thấy trang</h1>
      <p>Trang quản lý này không có hoặc đã đổi địa chỉ.</p>
      <div className="c-error__actions">
        <Link className="c-btn c-btn--primary" href="/quan-tri">
          Về trang Hôm nay
        </Link>
      </div>
    </main>
  );
}
