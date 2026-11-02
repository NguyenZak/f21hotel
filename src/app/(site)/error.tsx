"use client";

// Lỗi khi dựng một trang của website (500): vẫn giữ header, footer để khách đi trang khác hoặc gọi lễ tân.
// error.tsx không xuất được metadata, nên tiêu đề và noindex đặt bằng thẻ <title>/<meta> của React.
import Link from "next/link";
import { useEffect } from "react";
import { ErrorView } from "@/components/ErrorView";
import { site } from "@/lib/site";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  const digest = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <title>{`Trang đang gặp lỗi | ${site.name}`}</title>
      <meta name="robots" content="noindex" />
      <ErrorView
        code="500"
        title="Trang đang gặp sự cố"
        actions={
          <>
            <button type="button" className="btn btn-gold" onClick={() => retry()}>
              Tải lại trang
            </button>
            <Link className="btn btn-ghost" href="/">
              Về trang chủ
            </Link>
          </>
        }
      >
        <p>Xin lỗi, trang chưa tải được. Bạn thử tải lại sau ít giây. Nếu cần đặt phòng gấp, gọi hoặc nhắn Zalo cho lễ tân.</p>
        {/* Mã để đối chiếu với log của worker (npx wrangler tail) khi khách báo lỗi */}
        {digest ? <p className="errpage-digest">Mã lỗi: {digest}</p> : null}
      </ErrorView>
    </>
  );
}
