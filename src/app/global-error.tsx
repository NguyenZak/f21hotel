"use client";

// Lỗi ở chính root layout (ví dụ không đọc được D1 cho header/footer): thay cả trang, nên tự có <html>, CSS, font.
// Không xuất được metadata (client component): tiêu đề và noindex đặt bằng thẻ của React.
import Link from "next/link";
import { useEffect } from "react";
import { ErrorView } from "@/components/ErrorView";
import { site } from "@/lib/site";
import { fontRoleStyle, fontVariables } from "./(site)/fonts";
import "./(site)/globals.css";

export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  const digest = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="vi" className={fontVariables} style={fontRoleStyle()}>
      <body>
        <title>{`Trang đang gặp lỗi | ${site.name}`}</title>
        <meta name="robots" content="noindex" />
        <main id="noi-dung">
          <ErrorView
            standalone
            code="500"
            title="Website đang gặp sự cố"
            actions={
              <>
                <button type="button" className="btn btn-gold" onClick={() => retry()}>
                  Tải lại trang
                </button>
                <Link className="btn btn-ghost light" href="/">
                  Về trang chủ
                </Link>
              </>
            }
          >
            <p>Xin lỗi, website tạm thời chưa tải được. Bạn thử lại sau ít phút, hoặc gọi, nhắn Zalo để lễ tân giữ phòng cho bạn.</p>
            {digest ? <p className="errpage-digest">Mã lỗi: {digest}</p> : null}
          </ErrorView>
        </main>
      </body>
    </html>
  );
}
