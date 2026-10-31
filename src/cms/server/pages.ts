// Trình dựng trang (Puck) của CMS mới: /api/cms/pages, /api/cms/block-meta.
// Bố cục lưu trong bảng pages như CMS cũ: "draft" là bản đang sửa, "data" là bản đang hiện trên website.
import { CMS_TAGS } from "@/lib/cms-tags";
import { readFaqs, readOffers, readReviews, readRooms, readSite, readThemeFonts } from "@/lib/site-data";
import { num, str } from "@/lib/sql";
import { audit, body, fail, json, type CmsContext, type CmsUser } from "./http";

type Row = Record<string, unknown>;
type Ctx = { ctx: CmsContext; user: CmsUser; request: Request; path: string[] };
const MANAGE = ["owner", "manager"] as const;
const parse = (v: unknown) => (v ? (typeof v === "string" ? JSON.parse(v) : v) : null);

const list = async ({ ctx }: Ctx) => {
  const { results } = await ctx.d.prepare("select id, title, slug, published_at, draft is not null as has_draft, updated_at from pages order by slug = 'home' desc, title").all<Row>();
  return json({
    ok: true,
    pages: results.map((r) => ({ id: num(r.id), title: str(r.title), slug: str(r.slug), publishedAt: str(r.published_at), hasDraft: Boolean(num(r.has_draft)), updatedAt: str(r.updated_at) })),
  });
};

const get = async ({ ctx, path }: Ctx) => {
  const r = await ctx.d.prepare("select * from pages where id = ?").bind(Number(path[1])).first<Row>();
  if (!r) return fail(404, "Không tìm thấy trang.");
  return json({ ok: true, page: { id: num(r.id), title: str(r.title), slug: str(r.slug), publishedAt: str(r.published_at), data: parse(r.data), draft: parse(r.draft) } });
};

// { data, publish }: publish = true thì đưa lên website (xoá bản nháp), ngược lại chỉ lưu nháp
const save = async ({ ctx, user, request, path }: Ctx) => {
  const id = Number(path[1]);
  const b = await body<{ data?: { content?: unknown }; publish?: boolean }>(request);
  if (!b?.data || !Array.isArray(b.data.content)) return fail(400, "Bố cục không hợp lệ.");
  const page = await ctx.d.prepare("select title from pages where id = ?").bind(id).first<Row>();
  if (!page) return fail(404, "Không tìm thấy trang.");
  const now = new Date().toISOString();
  const data = JSON.stringify(b.data);
  if (b.publish) await ctx.d.prepare("update pages set data = ?, draft = null, published_at = ?, updated_at = ? where id = ?").bind(data, now, now, id).run();
  else await ctx.d.prepare("update pages set draft = ?, updated_at = ? where id = ?").bind(data, now, id).run();
  await audit(ctx, user, "update", "pages", id, str(page.title));
  if (b.publish) await ctx.revalidate([CMS_TAGS.pages]);
  return json({ ok: true, publishedAt: b.publish ? now : undefined });
};

// Dữ liệu website để xem trước các khối (phòng, ưu đãi, hỏi đáp…) và font đang dùng
const blockMeta = async ({ ctx }: Ctx) => {
  const d = ctx.d;
  const [site, rooms, offers, faqs, reviews, fonts] = await Promise.all([readSite(d), readRooms(d), readOffers(d), readFaqs(d), readReviews(d), readThemeFonts(d)]);
  return json({ ok: true, meta: { site, rooms, offers, faqs, reviews }, fonts });
};

export const pageRoutes = [
  { method: "GET", match: (p: string[]) => p[0] === "pages" && p.length === 1, roles: MANAGE, handler: list },
  { method: "GET", match: (p: string[]) => p[0] === "pages" && p.length === 2, roles: MANAGE, handler: get },
  { method: "PATCH", match: (p: string[]) => p[0] === "pages" && p.length === 2, roles: MANAGE, handler: save },
  { method: "GET", match: (p: string[]) => p[0] === "block-meta", roles: MANAGE, handler: blockMeta },
];
