import { cloudinaryFrom, mediaUrlOf } from "@/cms/server/media";

// Đường dẫn ảnh của CMS Payload cũ: chuyển sang ảnh trên Cloudinary thay vì trả 404
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const url = /^[a-z0-9-]+\.[a-z0-9]+$/i.test(name) ? mediaUrlOf(cloudinaryFrom(process.env), name) : "";
  if (!url) return new Response("Not found", { status: 404 });
  return new Response(null, { status: 301, headers: { location: url, "cache-control": "public, max-age=86400" } });
}
