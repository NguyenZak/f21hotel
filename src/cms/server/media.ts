// Thư viện ảnh của CMS mới: /api/cms/media. Ảnh nằm trên Cloudinary; trình duyệt tải thẳng lên Cloudinary bằng
// chữ ký do worker tạo (worker không nhận file, không tốn CPU), sau đó báo lại để lưu vào bảng media.
// public_id = <thư mục>/<tên file bỏ đuôi> (giữ cách đặt tên của CMS Payload trước đây, ảnh cũ vẫn dùng được).
// Thư mục ảnh (bảng media_folders) chỉ để xếp ảnh trong CMS, không đổi đường dẫn ảnh trên Cloudinary.
import { num, str } from "@/lib/sql";
import { collectionBySlug } from "../schema";
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
  filesize: num(r.filesize) || null,
  mimeType: str(r.mime_type) || null,
  folderId: num(r.folder_id) || null,
  createdAt: str(r.created_at),
});

const toFolder = (r: Row) => ({ id: num(r.id), name: str(r.name), parentId: num(r.parent_id) || null, createdAt: str(r.created_at) });

type Use = { title: string; label: string; href: string };

// Ảnh đang dùng ở đâu: ảnh gắn vào hạng phòng / bài viết / địa điểm, và ảnh chèn trong nội dung bài hoặc bố cục trang
// (tìm theo tên file trong đường dẫn Cloudinary). Chỉ trang Thư viện ảnh hỏi (?usage=1), hộp chọn ảnh không cần.
async function usageOf(d: D1Database, media: { id: number; filename: string }[]) {
  const res = await d.batch([
    d.prepare("select r.media_id m, t.id doc, t.name title from room_types_rels r join room_types t on t.id = r.parent_id"),
    d.prepare("select r.media_id m, p.id doc, p.title title from posts_rels r join posts p on p.id = r.parent_id"),
    d.prepare("select r.media_id m, p.id doc, p.name title from places_rels r join places p on p.id = r.parent_id"),
    d.prepare("select id doc, title, body text from posts where body like '%](http%'"),
    d.prepare("select id doc, name title, body text from places where body like '%](http%'"),
    d.prepare("select id doc, title, coalesce(data, '') || coalesce(draft, '') text from pages"),
  ]);
  const rows = (i: number) => res[i].results as Row[];
  const edit = (slug: string, doc: unknown) => `/quan-tri/${collectionBySlug(slug)?.path}/sua?id=${num(doc)}`;
  const out = new Map<number, Use[]>();
  const add = (id: number, u: Use) => {
    const l = out.get(id) ?? [];
    if (!l.some((x) => x.href === u.href)) l.push(u);
    out.set(id, l);
  };
  const linked: [number, string, string][] = [
    [0, "Hạng phòng", "room-types"],
    [1, "Bài viết", "posts"],
    [2, "Địa điểm", "places"],
  ];
  for (const [i, label, slug] of linked) for (const r of rows(i)) add(num(r.m), { title: str(r.title), label, href: edit(slug, r.doc) });
  const texts: [number, string, (doc: unknown) => string][] = [
    [3, "Bài viết", (doc) => edit("posts", doc)],
    [4, "Địa điểm", (doc) => edit("places", doc)],
    [5, "Trang", (doc) => `/quan-tri/dung-trang?id=${num(doc)}`],
  ];
  for (const m of media) {
    // ".../f21-hotel/<tên file bỏ đuôi>.<đuôi>": có dấu / phía trước và dấu . phía sau để "anh" không khớp "anh-2"
    const needle = `/${stripExt(m.filename)}.`;
    if (!m.filename) continue;
    for (const [i, label, href] of texts) for (const r of rows(i)) if (str(r.text).includes(needle)) add(m.id, { title: str(r.title), label, href: href(r.doc) });
  }
  return Object.fromEntries(out);
}

const list = async ({ ctx, request }: Ctx) => {
  const [m, f] = await ctx.d.batch([
    ctx.d.prepare("select id, alt, filename, url, width, height, filesize, mime_type, folder_id, created_at from media order by created_at desc limit 1000"),
    ctx.d.prepare("select id, name, parent_id, created_at from media_folders order by name"),
  ]);
  const media = (m.results as Row[]).map((r) => toMedia(ctx.cloudinary, r));
  const usage = new URL(request.url).searchParams.has("usage") ? await usageOf(ctx.d, media) : undefined;
  return json({ ok: true, media, folders: (f.results as Row[]).map(toFolder), usage });
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
  const b = await body<{ filename?: string; alt?: string; width?: number; height?: number; mimeType?: string; filesize?: number; folderId?: number | null }>(request);
  const filename = str(b?.filename);
  const alt = str(b?.alt).trim();
  if (!/^[a-z0-9-]+\.[a-z0-9]+$/.test(filename)) return fail(400, "Tên file không hợp lệ.");
  if (!alt) return fail(400, "Nhập mô tả ảnh (giúp Google và người khiếm thị hiểu ảnh).");
  const folderId = await folderOrNull(ctx.d, b?.folderId);
  const now = new Date().toISOString();
  const row = await ctx.d
    .prepare(
      "insert into media (alt, prefix, url, filename, mime_type, filesize, width, height, folder_id, updated_at, created_at) values (?, '', ?, ?, ?, ?, ?, ?, ?, ?, ?) returning *",
    )
    .bind(
      alt,
      mediaUrlOf(ctx.cloudinary, filename, `/api/media/file/${filename}`),
      filename,
      str(b?.mimeType) || null,
      num(b?.filesize) || null,
      num(b?.width) || null,
      num(b?.height) || null,
      folderId,
      now,
      now,
    )
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

// ---------- Thư mục ----------

// Thư mục có thật thì trả id, không có (hoặc gửi null = gốc thư viện) thì null
async function folderOrNull(d: D1Database, id: unknown) {
  const n = num(id);
  if (!n) return null;
  return (await d.prepare("select id from media_folders where id = ?").bind(n).first()) ? n : null;
}

const folderName = (v: unknown) => str(v).replace(/\s+/g, " ").trim().slice(0, 80);

const createFolder = async ({ ctx, user, request }: Ctx) => {
  const b = await body<{ name?: string; parentId?: number | null }>(request);
  const name = folderName(b?.name);
  if (!name) return fail(400, "Nhập tên thư mục.");
  const now = new Date().toISOString();
  const row = await ctx.d
    .prepare("insert into media_folders (name, parent_id, updated_at, created_at) values (?, ?, ?, ?) returning *")
    .bind(name, await folderOrNull(ctx.d, b?.parentId), now, now)
    .first<Row>();
  await audit(ctx, user, "create", "media-folders", row?.id, name);
  return json({ ok: true, folder: row ? toFolder(row) : null });
};

// Đổi tên hoặc chuyển thư mục vào thư mục khác (không cho chuyển vào chính nó hay thư mục con của nó)
const updateFolder = async ({ ctx, user, request, path }: Ctx) => {
  const id = Number(path[2]);
  const row = await ctx.d.prepare("select * from media_folders where id = ?").bind(id).first<Row>();
  if (!row) return fail(404, "Không tìm thấy thư mục.");
  const b = await body<{ name?: string; parentId?: number | null }>(request);
  const name = b?.name === undefined ? str(row.name) : folderName(b.name);
  if (!name) return fail(400, "Nhập tên thư mục.");
  let parentId = b && "parentId" in b ? await folderOrNull(ctx.d, b.parentId) : num(row.parent_id) || null;
  if (parentId) {
    const { results } = await ctx.d.prepare("select id, parent_id from media_folders").all<Row>();
    const parent = new Map(results.map((r) => [num(r.id), num(r.parent_id)]));
    for (let p: number | undefined = parentId; p; p = parent.get(p)) if (p === id) return fail(400, "Không chuyển được thư mục vào chính nó hoặc thư mục con của nó.");
  } else parentId = null;
  await ctx.d.prepare("update media_folders set name = ?, parent_id = ?, updated_at = ? where id = ?").bind(name, parentId, new Date().toISOString(), id).run();
  await audit(ctx, user, "update", "media-folders", id, name);
  return json({ ok: true });
};

// Xoá thư mục: ảnh và thư mục con bên trong chuyển ra thư mục cha, không ảnh nào bị xoá
const removeFolder = async ({ ctx, user, path }: Ctx) => {
  const id = Number(path[2]);
  const row = await ctx.d.prepare("select * from media_folders where id = ?").bind(id).first<Row>();
  if (!row) return fail(404, "Không tìm thấy thư mục.");
  const parentId = num(row.parent_id) || null;
  await ctx.d.batch([
    ctx.d.prepare("update media set folder_id = ? where folder_id = ?").bind(parentId, id),
    ctx.d.prepare("update media_folders set parent_id = ? where parent_id = ?").bind(parentId, id),
    ctx.d.prepare("delete from media_folders where id = ?").bind(id),
  ]);
  await audit(ctx, user, "delete", "media-folders", id, str(row.name));
  return json({ ok: true });
};

// Chuyển nhiều ảnh vào một thư mục (folderId null = ra gốc thư viện)
const move = async ({ ctx, user, request }: Ctx) => {
  const b = await body<{ ids?: number[]; folderId?: number | null }>(request);
  const ids = (Array.isArray(b?.ids) ? b.ids : []).map(num).filter(Boolean).slice(0, 1000);
  if (!ids.length) return fail(400, "Chưa chọn ảnh.");
  const folderId = await folderOrNull(ctx.d, b?.folderId);
  const now = new Date().toISOString();
  // D1 giới hạn 100 tham số mỗi câu lệnh
  const stmts = [];
  for (let i = 0; i < ids.length; i += 90) {
    const part = ids.slice(i, i + 90);
    stmts.push(ctx.d.prepare(`update media set folder_id = ?, updated_at = ? where id in (${part.map(() => "?").join(", ")})`).bind(folderId, now, ...part));
  }
  await ctx.d.batch(stmts);
  const to = folderId ? str((await ctx.d.prepare("select name from media_folders where id = ?").bind(folderId).first<Row>())?.name) : "Thư viện ảnh";
  await audit(ctx, user, "update", "media-folders", folderId ?? "", `Chuyển ${ids.length} ảnh vào “${to}”`);
  return json({ ok: true });
};

const guard = (h: (r: Ctx) => Promise<Response>) => async (r: Ctx) => (can(r.user, ...MANAGE) ? h(r) : fail(403, "Tài khoản của bạn không có quyền làm việc này."));

export const mediaRoutes = [
  { method: "GET", match: (p: string[]) => p[0] === "media" && p.length === 1, handler: guard(list) },
  { method: "POST", match: (p: string[]) => p[0] === "media" && p[1] === "sign", handler: guard(signUpload) },
  { method: "POST", match: (p: string[]) => p[0] === "media" && p[1] === "move" && p.length === 2, handler: guard(move) },
  { method: "POST", match: (p: string[]) => p[0] === "media" && p[1] === "folders" && p.length === 2, handler: guard(createFolder) },
  { method: "PATCH", match: (p: string[]) => p[0] === "media" && p[1] === "folders" && p.length === 3, handler: guard(updateFolder) },
  { method: "DELETE", match: (p: string[]) => p[0] === "media" && p[1] === "folders" && p.length === 3, handler: guard(removeFolder) },
  { method: "POST", match: (p: string[]) => p[0] === "media" && p.length === 1, handler: guard(create) },
  { method: "PATCH", match: (p: string[]) => p[0] === "media" && p.length === 2, handler: guard(update) },
  { method: "DELETE", match: (p: string[]) => p[0] === "media" && p.length === 2, handler: guard(remove) },
];
