// Phần dùng chung của API CMS: kiểu dữ liệu, trả JSON, phân quyền, nhật ký thao tác.
import { str } from "@/lib/sql";

export const ROLES = ["owner", "manager", "staff"] as const;
export type Role = (typeof ROLES)[number];
export type CmsUser = { id: number; name: string; email: string; role: Role; active: boolean };

export type CmsContext = {
  d: D1Database;
  // Khoá ký phiên đăng nhập (PAYLOAD_SECRET)
  secret: string;
  // Làm mới trang website dùng các nhãn này (src/lib/cms-tags.ts). Trong worker: ghi KV tag cache của OpenNext
  // (kvTagRevalidator bên dưới); khi chạy next dev: revalidateTag của Next.js.
  revalidate: (tags: string[]) => Promise<void>;
  waitUntil: (p: Promise<unknown>) => void;
  // Thư viện ảnh (Cloudinary); không có thì không tải ảnh lên được
  cloudinary?: { cloudName: string; apiKey: string; apiSecret: string; folder: string };
};

// ---------- Tiện ích ----------

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });

export const fail = (status: number, error: string) => json({ ok: false, error }, status);

export async function body<T = Record<string, unknown>>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export const toUser = (r: Record<string, unknown>): CmsUser => ({
  id: Number(r.id),
  name: str(r.name),
  email: str(r.email),
  role: (ROLES as readonly string[]).includes(str(r.role)) ? (str(r.role) as Role) : "staff",
  active: r.active === null || r.active === undefined ? true : Boolean(Number(r.active)),
});

export const can = (user: CmsUser, ...roles: Role[]) => roles.includes(user.role);

// Ghi nhật ký thao tác (cùng bảng với CMS cũ)
export async function audit(ctx: CmsContext, user: CmsUser, action: "create" | "update" | "delete", target: string, docId: unknown, title?: string) {
  await ctx.d
    .prepare("insert into audit_logs (user_id, action, target, doc_id, title) values (?, ?, ?, ?, ?)")
    .bind(user.id, action, target, docId === undefined ? null : String(docId), title ?? null)
    .run();
}

