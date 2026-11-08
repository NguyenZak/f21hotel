// Tự cập nhật website sau khi lưu trong CMS (thay cho nút "Xuất bản website", bỏ 08/11/2026).
// Trang website chỉ dựng lúc build (Workers Free không đủ CPU để dựng lại trang khi lưu, xem worker.ts), nên cron
// mỗi 2 phút (wrangler.jsonc "triggers") gọi Deploy Hook của Workers Builds khi có nội dung mới đã lưu và đã
// ngừng sửa AUTO_QUIET_MS: sửa nhiều thứ liên tiếp chỉ build một lần. Mỗi lần gọi ghi audit_logs (target "publish",
// không có người dùng); thay đổi sau mốc đó sẽ được build ở lần sau. Cài Deploy Hook: docs/xuat-ban.md.
import { str } from "@/lib/sql";

export const AUTO_PUBLISH_CRON = "*/2 * * * *";
const AUTO_QUIET_MS = 2 * 60_000;

// Mục có hiện trên website (đặt phòng, giá theo ngày, tài khoản chạy trực tiếp qua API, không cần build).
// Lưu nháp trang kéo thả ghi action "draft", không tính.
const PAGE_TARGETS = ["site-settings", "theme-settings", "room-types", "rooms", "offers", "reviews", "faqs", "posts", "places", "pages", "media"];
const marks = (n: number) => Array(n).fill("?").join(", ");

export async function autoPublish(d: D1Database, deployHook: string | undefined): Promise<string> {
  if (!deployHook) return "";
  const last = await d.prepare("select max(created_at) at from audit_logs where target = 'publish'").first<{ at: string | null }>();
  const since = str(last?.at) || "1970-01-01";
  const change = await d
    .prepare(`select max(created_at) at from audit_logs where target in (${marks(PAGE_TARGETS.length)}) and action != 'draft' and created_at > ?`)
    .bind(...PAGE_TARGETS, since)
    .first<{ at: string | null }>();
  const at = str(change?.at);
  if (!at || Date.now() - Date.parse(at) < AUTO_QUIET_MS) return "";

  const res = await fetch(deployHook, { method: "POST", signal: AbortSignal.timeout(15_000) });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean; result?: { build_uuid?: string }; errors?: { message?: string }[] };
  // Lỗi thì không ghi mốc: lần cron sau thử lại
  if (!res.ok || !data.success) return `lỗi ${res.status}${data.errors?.[0]?.message ? `: ${data.errors[0].message}` : ""}`;
  await d
    .prepare("insert into audit_logs (user_id, action, target, doc_id, title) values (null, 'create', 'publish', ?, ?)")
    .bind(data.result?.build_uuid ?? "", "Tự cập nhật website")
    .run();
  return `build ${data.result?.build_uuid ?? ""} (nội dung lưu lúc ${at})`;
}
