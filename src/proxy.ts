// Bài viết và trang chi tiết Tiện ích xung quanh chỉ có các mã có trong cơ sở dữ liệu. Mã không có (gõ sai, bot dò)
// phải trả 404 thật: trang dùng notFound() nhưng với cacheComponents phần khung trang đã gửi đi với mã 200,
// nên kiểm tra ở đây trước khi Next.js dựng trang.
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

const page = (title: string, text: string, back: string) =>
  `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} | F21 Hotel</title></head>
<body style="font-family:Georgia,serif;background:#fffdf8;color:#2b1d1b;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px;text-align:center">
<main><h1 style="color:#8d191d">${title}</h1><p>${text}</p>
<p>${back} · <a href="/" style="color:#8d191d">Trang chủ</a></p></main></body></html>`;

const notFound = (html: string) =>
  new NextResponse(html, { status: 404, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } });

const KINDS = {
  "bai-viet": {
    table: "posts",
    html: page("Không tìm thấy bài viết", "Bài viết này không có hoặc đã được gỡ.", `<a href="/bai-viet" style="color:#8d191d">Xem các bài cẩm nang</a>`),
  },
  "tien-ich": {
    table: "places",
    html: page("Không tìm thấy địa điểm", "Địa điểm này không có hoặc đã được gỡ.", `<a href="/tien-ich" style="color:#8d191d">Xem tiện ích xung quanh</a>`),
  },
} as const;

export async function proxy(request: NextRequest) {
  const m = /^\/(bai-viet|tien-ich)\/([^/]+)\/?$/.exec(request.nextUrl.pathname);
  if (!m) return NextResponse.next();
  const kind = KINDS[m[1] as keyof typeof KINDS];
  let slug = "";
  try {
    slug = decodeURIComponent(m[2]);
  } catch {
    return notFound(kind.html);
  }
  // Lỗi cơ sở dữ liệu thì để Next.js xử lý như thường
  const found = await (await db())
    .prepare(`select 1 from ${kind.table} where slug = ? and published = 1 limit 1`)
    .bind(slug)
    .first()
    .catch(() => true);
  return found ? NextResponse.next() : notFound(kind.html);
}

export const config = { matcher: ["/bai-viet/:slug", "/tien-ich/:slug"] };
