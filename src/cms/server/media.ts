// Thư viện ảnh của CMS mới: /api/cms/media. Ảnh nằm trên Cloudinary; trình duyệt tải thẳng lên Cloudinary bằng
// chữ ký do worker tạo (worker không nhận file, không tốn CPU), sau đó báo lại để lưu vào bảng media.
// public_id = <thư mục>/<tên file bỏ đuôi>, giống bộ kết nối của CMS cũ (src/payload/cloudinary.ts).
import { num, str } from "@/lib/sql";
import { audit, body, can, fail, json, type CmsContext, type CmsUser } from "./http";

export type CloudinaryEnv = { cloudName: string; apiKey: string; apiSecret: string; folder: string };

export function cloudinaryFrom(env: Record<string, unknown>): CloudinaryEnv | undefined {
  const cloudName = str(env.CLOUDINARY_CLOUD_NAME);
  const apiKey = str(env.CLOUDINARY_API_KEY);
  const apiSecret = str(env.CLOUDINARY_API_SECRET);
  if (!cloudName || !apiKey || !apiSecret) return undefined;
  return { cloudName, apiKey, apiSecret, folder: str(env.CLOUDINARY_FOLDER) || "f21-hotel" };
}

type Row = Record<string, unknown>;
type Ctx = { ctx: CmsContext; user: CmsUser; request: Request; path: string[] };

const MANAGE = ["owner", "manager"] as const;
const stripExt = (name: string) => name.replace(/\.[^./]+$/, "");
const extOf = (name: string) => name.match(/\.([^./]+)$/)?.[1]?.toLowerCase() ?? "";

export const mediaUrlOf = (c: CloudinaryEnv | undefined, filename: string, fallback = "") =>
  c && filename ? `https://res.cloudinary.com/${c.cloudName}/image/upload/f_auto,q_auto/${c.folder}/${stripExt(filename)}.${extOf(filename) || "jpg"}` : fallback;

async function sha1(text: string) {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Chữ ký API Cloudinary: SHA-1 của các tham số sắp theo tên, nối bằng &, cộng api_secret
const sign = (params: Record<string, string>, secret: string) =>
  sha1(
    Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&") + secret,
  );

// Tên file an toàn: bỏ dấu tiếng Việt, chữ thường, gạch ngang
function safeName(name: string) {
  const ext = extOf(name) || "jpg";
  const base =
    stripExt(name)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "anh";
  return { base, ext };
}

const toMedia = (c: CloudinaryEnv | undefined, r: Row) => ({
  id: num(r.id),
  alt: str(r.alt),
  filename: str(r.filename),
  url: mediaUrlOf(c, str(r.filename), str(r.url)),
  width: num(r.width) || null,
  height: num(r.height) || null,
  createdAt: str(r.created_at),
});

const list = async ({ ctx }: Ctx) => {
  const { results } = await ctx.d.prepare("select id, alt, filename, url, width, height, created_at from media order by created_at desc limit 500").all<Row>();
  return json({ ok: true, media: results.map((r) => toMedia(ctx.cloudinary, r)) });
};

// Bước 1: xin chữ ký tải lên (tên file đã được đổi cho không trùng ảnh có sẵn)
const signUpload = async ({ ctx, request }: Ctx) => {
  const c = ctx.cloudinary;
  if (!c) return fail(500, "Chưa cấu hình Cloudinary.");
  const b = await body<{ filename?: string }>(request);
  const { base, ext } = safeName(str(b?.filename));
  if (!["jpg", "jpeg", "png", "webp", "avif", "gif"].includes(ext)) return fail(400, "Chỉ nhận ảnh JPG, PNG, WebP, AVIF hoặc GIF.");
  let filename = `${base}.${ext}`;
  for (let i = 1; await ctx.d.prepare("select 1 from media where filename = ?").bind(filename).first(); i++) filename = `${base}-${i}.${ext}`;
  const params = { overwrite: "true", public_id: `${c.folder}/${stripExt(filename)}`, timestamp: String(Math.floor(Date.now() / 1000)) };
  return json({
    ok: true,
    filename,
    upload: { url: `https://api.cloudinary.com/v1_1/${c.cloudName}/image/upload`, fields: { ...params, api_key: c.apiKey, signature: await sign(params, c.apiSecret) } },
  });
};

// Bước 2: ảnh đã lên Cloudinary, lưu vào thư viện
const create = async ({ ctx, user, request }: Ctx) => {
  const b = await body<{ filename?: string; alt?: string; width?: number; height?: number; mimeType?: string; filesize?: number }>(request);
  const filename = str(b?.filename);
  const alt = str(b?.alt).trim();
  if (!/^[a-z0-9-]+\.[a-z0-9]+$/.test(filename)) return fail(400, "Tên file không hợp lệ.");
  if (!alt) return fail(400, "Nhập mô tả ảnh (giúp Google và người khiếm thị hiểu ảnh).");
  const now = new Date().toISOString();
  const row = await ctx.d
    .prepare(
      "insert into media (alt, prefix, url, filename, mime_type, filesize, width, height, updated_at, created_at) values (?, '', ?, ?, ?, ?, ?, ?, ?, ?) returning *",
    )
    .bind(alt, `/api/media/file/${filename}`, filename, str(b?.mimeType) || null, num(b?.filesize) || null, num(b?.width) || null, num(b?.height) || null, now, now)
    .first<Row>();
  await audit(ctx, user, "create", "media", row?.id, alt);
  return json({ ok: true, media: row ? toMedia(ctx.cloudinary, row) : null });
};

const update = async ({ ctx, user, request, path }: Ctx) => {
  const id = Number(path[1]);
  const b = await body<{ alt?: string }>(request);
  const alt = str(b?.alt).trim();
  if (!alt) return fail(400, "Nhập mô tả ảnh.");
  await ctx.d.prepare("update media set alt = ?, updated_at = ? where id = ?").bind(alt, new Date().toISOString(), id).run();
  await audit(ctx, user, "update", "media", id, alt);
  // Mô tả ảnh hiện trên trang phòng
  await ctx.revalidate(["cms:rooms"]);
  return json({ ok: true });
};

const remove = async ({ ctx, user, path }: Ctx) => {
  const id = Number(path[1]);
  const row = await ctx.d.prepare("select id, alt, filename from media where id = ?").bind(id).first<Row>();
  if (!row) return fail(404, "Không tìm thấy ảnh.");
  const used = await ctx.d.prepare("select t.name from room_types_rels r join room_types t on t.id = r.parent_id where r.media_id = ? limit 1").bind(id).first<Row>();
  if (used) return fail(400, `Ảnh đang dùng cho hạng phòng “${str(used.name)}”. Bỏ ảnh khỏi hạng phòng trước khi xoá.`);
  const c = ctx.cloudinary;
  if (c && row.filename) {
    const params = { invalidate: "true", public_id: `${c.folder}/${stripExt(str(row.filename))}`, timestamp: String(Math.floor(Date.now() / 1000)) };
    const form = new FormData();
    Object.entries({ ...params, api_key: c.apiKey, signature: await sign(params, c.apiSecret) }).forEach(([k, v]) => form.append(k, v));
    ctx.waitUntil(fetch(`https://api.cloudinary.com/v1_1/${c.cloudName}/image/destroy`, { method: "POST", body: form }));
  }
  await ctx.d.batch([
    ctx.d.prepare("delete from payload_locked_documents_rels where media_id = ?").bind(id),
    ctx.d.prepare("delete from media where id = ?").bind(id),
  ]);
  await audit(ctx, user, "delete", "media", id, str(row.alt));
  return json({ ok: true });
};

const guard = (h: (r: Ctx) => Promise<Response>) => async (r: Ctx) => (can(r.user, ...MANAGE) ? h(r) : fail(403, "Tài khoản của bạn không có quyền làm việc này."));

export const mediaRoutes = [
  { method: "GET", match: (p: string[]) => p[0] === "media" && p.length === 1, handler: guard(list) },
  { method: "POST", match: (p: string[]) => p[0] === "media" && p[1] === "sign", handler: guard(signUpload) },
  { method: "POST", match: (p: string[]) => p[0] === "media" && p.length === 1, handler: guard(create) },
  { method: "PATCH", match: (p: string[]) => p[0] === "media" && p.length === 2, handler: guard(update) },
  { method: "DELETE", match: (p: string[]) => p[0] === "media" && p.length === 2, handler: guard(remove) },
];
