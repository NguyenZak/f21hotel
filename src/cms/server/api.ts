// API của CMS mới: /api/cms/* (JSON). Chạy trong custom worker (worker.ts) trước khi nạp Next.js,
// nên mỗi yêu cầu chỉ là vài câu SQL trên D1 (vừa 10 ms CPU của Workers Free).
// Dùng các bảng có sẵn (users, audit_logs…), cấu trúc trong db/schema.sql.
// Không import gì từ Next.js / OpenNext ở đây.
import { str } from "@/lib/sql";
import { bookingRoutes } from "./bookings";
import { reportRoutes } from "./reports";
import { contentRoutes } from "./content";
import { mediaRoutes } from "./media";
import { pageRoutes } from "./pages";
import { hashPassword, needsRehash, readSession, signSession, verifyPassword } from "./crypto";
import { audit, body, can, fail, json, ROLES, toUser, type CmsContext, type CmsUser, type Role } from "./http";

export { type CmsContext } from "./http";

type Req = { request: Request; url: URL; ctx: CmsContext; path: string[] };
type Handler = (r: Req & { user: CmsUser }) => Promise<Response>;

const COOKIE = "f21_cms";
const SESSION_DAYS = 7;
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 10;

const cookieOf = (request: Request) =>
  request.headers
    .get("cookie")
    ?.split(/;\s*/)
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);

const setCookie = (url: URL, value: string, maxAge: number) =>
  `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${url.protocol === "https:" ? "; Secure" : ""}`;

// Đánh dấu dữ liệu website đã đổi trong KV tag cache của OpenNext (khoá "<buildId>/<tag>"), giống
// revalidateTag(tag, { expire: 0 }): trang dùng nhãn này được dựng lại ở lần truy cập sau.
export const kvTagRevalidator = (kv: KVNamespace | undefined, buildId: string) => async (tags: string[]) => {
  if (!kv || !buildId) return;
  const now = Date.now();
  const value = JSON.stringify({ revalidatedAt: now, stale: now, expire: now });
  await Promise.all(tags.map((t) => kv.put(`${buildId}/${t}`, value)));
};

async function currentUser(request: Request, ctx: CmsContext): Promise<CmsUser | null> {
  const s = await readSession(ctx.secret, cookieOf(request));
  if (!s) return null;
  const row = await ctx.d.prepare("select id, name, email, role, active from users where id = ?").bind(s.uid).first<Record<string, unknown>>();
  const user = row ? toUser(row) : null;
  // Tài khoản bị khoá thì phiên cũ hết hiệu lực ngay
  return user?.active ? user : null;
}

// ---------- Đăng nhập ----------

async function login({ request, url, ctx }: Req) {
  const b = await body<{ email?: string; password?: string }>(request);
  const email = str(b?.email).trim().toLowerCase();
  const password = str(b?.password);
  if (!email || !password) return fail(400, "Nhập email và mật khẩu.");
  const row = await ctx.d.prepare("select * from users where lower(email) = ? limit 1").bind(email).first<Record<string, unknown>>();
  const wrong = fail(401, "Email hoặc mật khẩu không đúng.");
  if (!row) return wrong;
  if (row.lock_until && Date.parse(str(row.lock_until)) > Date.now())
    return fail(423, `Tài khoản tạm khoá do nhập sai nhiều lần. Thử lại sau ${LOCK_MINUTES} phút hoặc nhờ Chủ khách sạn mở khoá.`);
  const user = toUser(row);
  if (!user.active) return fail(403, "Tài khoản đã bị khoá. Liên hệ Chủ khách sạn.");

  if (!(await verifyPassword(password, str(row.salt) || null, str(row.hash) || null))) {
    const attempts = Number(row.login_attempts ?? 0) + 1;
    const lock = attempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString() : null;
    await ctx.d
      .prepare("update users set login_attempts = ?, lock_until = ? where id = ?")
      .bind(lock ? 0 : attempts, lock, user.id)
      .run();
    return wrong;
  }
  if (Number(row.login_attempts ?? 0) || row.lock_until)
    ctx.waitUntil(ctx.d.prepare("update users set login_attempts = 0, lock_until = null where id = ?").bind(user.id).run());
  // Băm lại theo định dạng nhẹ hiện tại (các lần đăng nhập sau tốn ít CPU hơn)
  if (needsRehash(str(row.hash) || null))
    ctx.waitUntil(
      hashPassword(password).then((h) => ctx.d.prepare("update users set salt = ?, hash = ? where id = ?").bind(h.salt, h.hash, user.id).run()),
    );

  const token = await signSession(ctx.secret, { uid: user.id, exp: Date.now() + SESSION_DAYS * 86_400_000 });
  return json({ ok: true, user }, 200, { "set-cookie": setCookie(url, token, SESSION_DAYS * 86_400) });
}

const logout = async ({ url }: Req) => json({ ok: true }, 200, { "set-cookie": setCookie(url, "", 0) });

// ---------- Hồ sơ của người đang đăng nhập ----------

const me: Handler = async ({ user }) => json({ ok: true, user });

const updateMe: Handler = async ({ request, ctx, user }) => {
  const b = await body<{ name?: string; currentPassword?: string; password?: string }>(request);
  if (!b) return fail(400, "Dữ liệu không hợp lệ.");
  const name = str(b.name).trim();
  if (b.password !== undefined) {
    if (str(b.password).length < 12) return fail(400, "Mật khẩu mới cần ít nhất 12 ký tự.");
    const row = await ctx.d.prepare("select salt, hash from users where id = ?").bind(user.id).first<{ salt: string; hash: string }>();
    if (!(await verifyPassword(str(b.currentPassword), row?.salt ?? null, row?.hash ?? null))) return fail(400, "Mật khẩu hiện tại không đúng.");
    const h = await hashPassword(str(b.password));
    await ctx.d.prepare("update users set salt = ?, hash = ?, updated_at = ? where id = ?").bind(h.salt, h.hash, new Date().toISOString(), user.id).run();
  }
  if (name) await ctx.d.prepare("update users set name = ?, updated_at = ? where id = ?").bind(name, new Date().toISOString(), user.id).run();
  await audit(ctx, user, "update", "users", user.id, name || user.name);
  return json({ ok: true });
};

// ---------- Tài khoản (chỉ Chủ) ----------

const listUsers: Handler = async ({ ctx }) => {
  const { results } = await ctx.d
    .prepare("select id, name, email, role, active, lock_until, created_at from users order by role = 'owner' desc, role = 'manager' desc, name")
    .all<Record<string, unknown>>();
  return json({ ok: true, users: results.map((r) => ({ ...toUser(r), locked: Boolean(r.lock_until && Date.parse(str(r.lock_until)) > Date.now()) })) });
};

const createUser: Handler = async ({ request, ctx, user }) => {
  const b = await body<{ name?: string; email?: string; role?: string; password?: string }>(request);
  const name = str(b?.name).trim();
  const email = str(b?.email).trim().toLowerCase();
  const role = str(b?.role) as Role;
  const password = str(b?.password);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(400, "Nhập họ tên và email hợp lệ.");
  if (!ROLES.includes(role)) return fail(400, "Chọn vai trò.");
  if (password.length < 12) return fail(400, "Mật khẩu cần ít nhất 12 ký tự.");
  const exists = await ctx.d.prepare("select 1 from users where lower(email) = ?").bind(email).first();
  if (exists) return fail(409, "Email này đã có tài khoản.");
  const h = await hashPassword(password);
  const now = new Date().toISOString();
  const row = await ctx.d
    .prepare("insert into users (name, email, role, active, salt, hash, login_attempts, updated_at, created_at) values (?, ?, ?, 1, ?, ?, 0, ?, ?) returning id")
    .bind(name, email, role, h.salt, h.hash, now, now)
    .first<{ id: number }>();
  await audit(ctx, user, "create", "users", row?.id, name);
  return json({ ok: true, id: row?.id });
};

const updateUser: Handler = async ({ request, ctx, user, path }) => {
  const id = Number(path[1]);
  const b = await body<{ name?: string; role?: string; active?: boolean; password?: string; unlock?: boolean }>(request);
  if (!id || !b) return fail(400, "Dữ liệu không hợp lệ.");
  const target = await ctx.d.prepare("select id, name, email, role, active from users where id = ?").bind(id).first<Record<string, unknown>>();
  if (!target) return fail(404, "Không tìm thấy tài khoản.");
  // Không tự hạ quyền hay tự khoá mình, để luôn còn ít nhất một Chủ đăng nhập được
  if (id === user.id && ((b.role && b.role !== "owner") || b.active === false)) return fail(400, "Không thể tự đổi vai trò hoặc tự khoá tài khoản của mình.");
  const sets: string[] = [];
  const vals: unknown[] = [];
  const set = (sql: string, ...v: unknown[]) => {
    sets.push(sql);
    vals.push(...v);
  };
  if (b.name !== undefined && str(b.name).trim()) set("name = ?", str(b.name).trim());
  if (b.role !== undefined) {
    if (!ROLES.includes(b.role as Role)) return fail(400, "Vai trò không hợp lệ.");
    set("role = ?", b.role);
  }
  if (b.active !== undefined) set("active = ?", b.active ? 1 : 0);
  if (b.unlock) set("login_attempts = 0, lock_until = null");
  if (b.password !== undefined) {
    if (str(b.password).length < 12) return fail(400, "Mật khẩu cần ít nhất 12 ký tự.");
    const h = await hashPassword(str(b.password));
    set("salt = ?, hash = ?, login_attempts = 0, lock_until = null", h.salt, h.hash);
  }
  if (!sets.length) return json({ ok: true });
  set("updated_at = ?", new Date().toISOString());
  await ctx.d.prepare(`update users set ${sets.join(", ")} where id = ?`).bind(...vals, id).run();
  await audit(ctx, user, "update", "users", id, str(b.name).trim() || str(target.name));
  return json({ ok: true });
};

// ---------- Nhật ký thao tác (Chủ, Quản lý) ----------

const listAudit: Handler = async ({ ctx, url }) => {
  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get("limit")) || 50));
  const before = Number(url.searchParams.get("before")) || 0;
  const { results } = await ctx.d
    .prepare(
      `select a.id, a.action, a.target, a.doc_id, a.title, a.created_at, u.name as user_name
       from audit_logs a left join users u on u.id = a.user_id
       ${before ? "where a.id < ?" : ""} order by a.id desc limit ?`,
    )
    .bind(...(before ? [before, limit] : [limit]))
    .all();
  return json({ ok: true, logs: results });
};

// ---------- Định tuyến ----------

type Route = { method: string; match: (p: string[]) => boolean; roles?: readonly Role[]; handler: Handler };

// Các nhóm tính năng (đặt phòng, nội dung…) thêm route vào đây ở các giai đoạn sau
export const routes: Route[] = [
  { method: "GET", match: (p) => p[0] === "me" && p.length === 1, handler: me },
  { method: "PATCH", match: (p) => p[0] === "me" && p.length === 1, handler: updateMe },
  { method: "GET", match: (p) => p[0] === "users" && p.length === 1, roles: ["owner"], handler: listUsers },
  { method: "POST", match: (p) => p[0] === "users" && p.length === 1, roles: ["owner"], handler: createUser },
  { method: "PATCH", match: (p) => p[0] === "users" && p.length === 2, roles: ["owner"], handler: updateUser },
  { method: "GET", match: (p) => p[0] === "audit-logs" && p.length === 1, roles: ["owner", "manager"], handler: listAudit },
  // Vận hành: hôm nay, đặt phòng, lịch phòng (mọi vai trò; xoá đặt phòng: Chủ, Quản lý)
  ...bookingRoutes,
  // Báo cáo doanh thu, công suất (Chủ, Quản lý)
  ...reportRoutes,
  // Nội dung (src/cms/schema.ts) và thư viện ảnh: quyền kiểm tra theo từng mục
  ...contentRoutes,
  ...mediaRoutes,
  ...pageRoutes,
];

// Xử lý /api/cms/*. Trả null nếu không phải đường dẫn của API này.
export async function handleCmsApi(request: Request, ctx: CmsContext): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/cms/")) return null;
  const path = url.pathname.slice("/api/cms/".length).split("/").filter(Boolean);
  // Chặn gửi form từ trang khác: mọi yêu cầu ghi phải là JSON (trình duyệt không gửi JSON khác nguồn mà không hỏi trước)
  if (request.method !== "GET" && !request.headers.get("content-type")?.includes("application/json"))
    return fail(415, "Yêu cầu phải gửi dạng JSON.");
  const r: Req = { request, url, ctx, path };
  try {
    if (path[0] === "login" && request.method === "POST") return await login(r);
    if (path[0] === "logout" && request.method === "POST") return await logout(r);
    const route = routes.find((x) => x.method === request.method && x.match(path));
    if (!route) return fail(404, "Không có API này.");
    const user = await currentUser(request, ctx);
    if (!user) return fail(401, "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.");
    if (route.roles && !can(user, ...route.roles)) return fail(403, "Tài khoản của bạn không có quyền làm việc này.");
    return await route.handler({ ...r, user });
  } catch (e) {
    console.error("[cms-api]", e);
    return fail(500, "Có lỗi, vui lòng thử lại.");
  }
}
