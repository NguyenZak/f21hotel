import { revalidateTag } from "next/cache";
import { after } from "next/server";
import { handleCmsApi } from "@/cms/server/api";
import { cloudinaryFrom } from "@/cms/server/media";
import { db } from "@/lib/db";
import { mailConfigFrom } from "@/lib/mailer";

// API CMS. Lưu nội dung trong CMS thì đánh dấu nhãn trang liên quan (revalidateTag): website cập nhật ngay
// ở lần truy cập sau, không cần build lại.
async function handle(request: Request) {
  const res = await handleCmsApi(request, {
    d: await db(),
    secret: process.env.PAYLOAD_SECRET ?? "",
    revalidate: async (tags) => tags.forEach((t) => revalidateTag(t, { expire: 0 })),
    waitUntil: (p) => after(p),
    cloudinary: cloudinaryFrom(process.env),
    mail: mailConfigFrom(process.env),
  });
  return res ?? new Response("Not found", { status: 404 });
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const DELETE = handle;
