// Điểm vào của worker trên Cloudflare (wrangler.jsonc "main"). Bọc worker do OpenNext tạo:
// các API nhẹ (đặt phòng) được xử lý ngay ở đây, trước khi nạp máy chủ Next.js, để mỗi yêu cầu chỉ tốn
// vài ms CPU (gói Workers Free giới hạn 10 ms). Mọi đường dẫn khác chuyển cho Next.js như bình thường.
// File này không nằm trong tsconfig (wrangler đóng gói riêng).
import { handleCmsApi, kvTagRevalidator } from "./src/cms/server/api";
import { cloudinaryFrom } from "./src/cms/server/media";
import { handleBookingApi } from "./src/lib/booking-api";
// Build id của Next.js: khoá trong KV tag cache có dạng "<buildId>/<tag>" (wrangler.jsonc rules: Text)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- file do `opennextjs-cloudflare build` tạo ra
// @ts-ignore
import nextBuildId from "./.open-next/server-functions/default/.next/BUILD_ID";
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
        revalidate: kvTagRevalidator(env.NEXT_TAG_CACHE_KV, String(nextBuildId).trim()),
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
    return nextWorker.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<CloudflareEnv>;
