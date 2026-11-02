"use client";

// Lỗi khi dựng một trang của CMS: báo ngắn gọn, cho tải lại hoặc về trang Hôm nay. Không dùng giao diện website.
import Link from "next/link";
import { useEffect } from "react";

export default function CmsError({ error, retry }: { error: unknown; retry: () => void }) {
  const digest = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="c-error">
      <h1>Trang quản lý gặp lỗi</h1>
      <p>Dữ liệu đã lưu không bị ảnh hưởng. Bạn tải lại trang; nếu vẫn lỗi, gửi mã bên dưới cho người quản trị website.</p>
      {digest ? <p className="c-error__digest">Mã lỗi: {digest}</p> : null}
      <div className="c-error__actions">
        <button type="button" className="c-btn c-btn--primary" onClick={() => retry()}>
          Tải lại
        </button>
        <Link className="c-btn c-btn--ghost" href="/quan-tri">
          Về trang Hôm nay
        </Link>
      </div>
    </main>
  );
}
