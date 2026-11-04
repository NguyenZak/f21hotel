import { getCloudflareContext } from "@opennextjs/cloudflare";
import { revalidateTag } from "next/cache";
import { after } from "next/server";
import { handleCmsApi } from "@/cms/server/api";
import { cloudinaryFrom } from "@/cms/server/media";
import { mailConfigFrom } from "@/lib/mailer";

// API CMS khi chạy qua Next.js (`next dev`). Trên Cloudflare, worker.ts xử lý /api/cms/* trước khi nạp
// Next.js nên route này chỉ là đường dự phòng.
async function handle(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const res = await handleCmsApi(request, {
    d: env.D1,
    secret: process.env.PAYLOAD_SECRET ?? "",
    revalidate: async (tags) => tags.forEach((t) => revalidateTag(t, { expire: 0 })),
    waitUntil: (p) => after(p),
    cloudinary: cloudinaryFrom(process.env),
    mail: mailConfigFrom(process.env),
    deployHook: process.env.DEPLOY_HOOK_URL,
  });
  return res ?? new Response("Not found", { status: 404 });
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const DELETE = handle;
