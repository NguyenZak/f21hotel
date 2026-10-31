// Điểm vào của worker trên Cloudflare (wrangler.jsonc "main"). Bọc worker do OpenNext tạo:
// các API nhẹ (đặt phòng) được xử lý ngay ở đây, trước khi nạp máy chủ Next.js, để mỗi yêu cầu chỉ tốn
// vài ms CPU (gói Workers Free giới hạn 10 ms). Mọi đường dẫn khác chuyển cho Next.js như bình thường.
// File này không nằm trong tsconfig (wrangler đóng gói riêng).
import { handleBookingApi } from "./src/lib/booking-api";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- file do `opennextjs-cloudflare build` tạo ra, có thể chưa tồn tại
// @ts-ignore
import nextWorker from "./.open-next/worker.js";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- như trên
// @ts-ignore
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    if (new URL(request.url).pathname.startsWith("/api/booking/")) {
      const res = await handleBookingApi(request, env.D1, {
        webhookUrl: (env as unknown as { BOOKING_WEBHOOK_URL?: string }).BOOKING_WEBHOOK_URL,
        waitUntil: (p) => ctx.waitUntil(p),
      });
      if (res) return res;
    }
    return nextWorker.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<CloudflareEnv>;
