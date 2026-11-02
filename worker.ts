// Điểm vào của worker trên Cloudflare (wrangler.jsonc "main"). Bọc worker do OpenNext tạo:
// các API nhẹ (đặt phòng) được xử lý ngay ở đây, trước khi nạp máy chủ Next.js, để mỗi yêu cầu chỉ tốn
// vài ms CPU (gói Workers Free giới hạn 10 ms). Mọi đường dẫn khác chuyển cho Next.js như bình thường.
// File này không nằm trong tsconfig (wrangler đóng gói riêng).
import { handleCmsApi } from "./src/cms/server/api";
import { cloudinaryFrom, mediaUrlOf } from "./src/cms/server/media";
import { handleBookingApi } from "./src/lib/booking-api";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- file do `opennextjs-cloudflare build` tạo ra, có thể chưa tồn tại
// @ts-ignore
import nextWorker from "./.open-next/worker.js";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- như trên
// @ts-ignore
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith("/api/cms/")) {
      const res = await handleCmsApi(request, {
        d: env.D1,
        secret: (env as unknown as { PAYLOAD_SECRET?: string }).PAYLOAD_SECRET ?? "",
        // Không đánh dấu trang cũ khi lưu: dựng lại trang ngay trên Workers tốn ~650 ms CPU, gói Free (10 ms)
        // làm worker treo và cả website trả 500 (sự cố 2026-11-02). Trang chỉ dựng lúc build (đọc D1 thật,
        // wrangler.jsonc env "build"), nên nội dung sửa trong CMS lên website ở lần deploy tiếp theo.
        revalidate: async () => {},
        waitUntil: (p) => ctx.waitUntil(p),
        cloudinary: cloudinaryFrom(env as unknown as Record<string, unknown>),
      });
      if (res) return res;
    }
    if (pathname.startsWith("/api/booking/")) {
      const res = await handleBookingApi(request, env.D1, {
        webhookUrl: (env as unknown as { BOOKING_WEBHOOK_URL?: string }).BOOKING_WEBHOOK_URL,
        waitUntil: (p) => ctx.waitUntil(p),
      });
      if (res) return res;
    }
    // Đường dẫn ảnh của CMS Payload cũ. Trang dựng sẵn lúc build mà thiếu CLOUDINARY_CLOUD_NAME (hoặc dòng media cũ)
    // vẫn trỏ về đây: chuyển sang ảnh trên Cloudinary thay vì trả 404
    if (pathname.startsWith("/api/media/file/")) {
      const filename = pathname.slice("/api/media/file/".length);
      const url = /^[a-z0-9-]+\.[a-z0-9]+$/i.test(filename)
        ? mediaUrlOf(cloudinaryFrom(env as unknown as Record<string, unknown>), filename)
        : "";
      if (url) return new Response(null, { status: 301, headers: { location: url, "cache-control": "public, max-age=86400" } });
    }
    // Mọi API đều xử lý ở trên; đường dẫn /api khác (vd. bot dò API của CMS cũ) trả 404 ngay,
    // không nạp Next.js chỉ để dựng trang lỗi (tốn hơn 200 ms CPU)
    if (pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ ok: false, error: "Không có API này." }), {
        status: 404,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }
    return nextWorker.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<CloudflareEnv>;
