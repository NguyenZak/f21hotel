// Xuất bản website: trang website chỉ dựng lúc build (sửa CMS không dựng lại trang trên Workers Free, xem worker.ts),
// nên nút "Xuất bản website" gọi Deploy Hook của Workers Builds để Cloudflare build lại từ D1 thật và deploy.
// Cài đặt: docs/xuat-ban.md. Mỗi lần bấm ghi audit_logs (target "publish"); thay đổi nội dung kể từ lần đó
// đọc từ audit_logs. Bản đang chạy lấy từ binding version_metadata (wrangler.jsonc).
import { str } from "@/lib/sql";
import { collectionBySlug } from "../schema";
import { audit, fail, json, type CmsContext, type CmsUser } from "./http";

type Ctx = { ctx: CmsContext; user: CmsUser };
type Row = Record<string, unknown>;

// Mục có hiện trên website (đặt phòng, giá theo ngày, tài khoản chạy trực tiếp qua API, không cần xuất bản)
const PAGE_TARGETS = ["site-settings", "theme-settings", "room-types", "rooms", "offers", "reviews", "faqs", "posts", "places", "pages", "media"];
const targetLabel = (t: string) => collectionBySlug(t)?.label ?? ({ pages: "Trang", media: "Thư viện ảnh" } as Record<string, string>)[t] ?? t;
const marks = (n: number) => Array(n).fill("?").join(", ");

const status = async ({ ctx }: Ctx) => {
  const last = await ctx.d
    .prepare("select a.created_at, a.doc_id, u.name from audit_logs a left join users u on u.id = a.user_id where a.target = 'publish' order by a.id desc limit 1")
    .first<Row>();
  const since = str(last?.created_at) || "1970-01-01";
  const { results } = await ctx.d
    .prepare(`select target, count(*) n, max(created_at) at from audit_logs where target in (${marks(PAGE_TARGETS.length)}) and created_at > ? group by target order by at desc`)
    .bind(...PAGE_TARGETS, since)
    .all<Row>();
  return json({
    ok: true,
    configured: Boolean(ctx.deployHook),
    live: ctx.version ?? null,
    last: last ? { at: str(last.created_at), by: str(last.name), build: str(last.doc_id) } : null,
    pending: results.map((r) => ({ label: targetLabel(str(r.target)), count: Number(r.n), at: str(r.at) })),
  });
};

const publish = async ({ ctx, user }: Ctx) => {
  if (!ctx.deployHook) return fail(400, "Chưa cài nút xuất bản (thiếu DEPLOY_HOOK_URL). Xem docs/xuat-ban.md.");
  const recent = await ctx.d
    .prepare("select 1 from audit_logs where target = 'publish' and created_at > ? limit 1")
    .bind(new Date(Date.now() - 60_000).toISOString())
    .first();
  if (recent) return fail(429, "Vừa bấm xuất bản dưới một phút trước. Website đang được dựng lại, chờ vài phút.");
  let data: { success?: boolean; result?: { build_uuid?: string; already_exists?: boolean }; errors?: { message?: string }[] };
  try {
    const res = await fetch(ctx.deployHook, { method: "POST", signal: AbortSignal.timeout(15_000) });
    data = (await res.json().catch(() => ({}))) as typeof data;
    if (!res.ok || !data.success) return fail(502, `Cloudflare không nhận yêu cầu (${res.status}${data.errors?.[0]?.message ? `: ${data.errors[0].message}` : ""}).`);
  } catch {
    return fail(502, "Không kết nối được Cloudflare, thử lại sau.");
  }
  await audit(ctx, user, "create", "publish", data.result?.build_uuid ?? "", "Xuất bản website");
  return json({ ok: true, alreadyRunning: Boolean(data.result?.already_exists) });
};

export const publishRoutes = [
  { method: "GET", match: (p: string[]) => p[0] === "publish" && p.length === 1, roles: ["owner", "manager"] as const, handler: status },
  { method: "POST", match: (p: string[]) => p[0] === "publish" && p.length === 1, roles: ["owner", "manager"] as const, handler: publish },
];
