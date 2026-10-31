// Tạo tài khoản Chủ, hoặc đặt lại mật khẩu và mở khoá nếu email đã có (khi quên mật khẩu: CMS chưa gửi email).
// Đặt trong .env.local: ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD (ít nhất 12 ký tự), rồi chạy:
//   npm run create-admin          # D1 ở máy
//   npm run create-admin:remote   # D1 thật trên Cloudflare
// Mật khẩu băm giống src/cms/server/crypto.ts (pbkdf2-sha256-cf30k) và không bao giờ được in ra.
// Xong thì xoá ADMIN_PASSWORD khỏi .env.local.
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

// Biến môi trường truyền khi chạy lệnh được ưu tiên hơn .env.local
const env = {
  ...Object.fromEntries(
    readFileSync(".env.local", "utf8")
      .split("\n")
      .map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/))
      .filter(Boolean)
      .map(([, k, v]) => [k, v.replace(/^["']|["']$/g, "")]),
  ),
  ...Object.fromEntries(
    Object.entries(process.env).filter(([k]) => k.startsWith("ADMIN_")),
  ),
};
const email = (env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const name = (env.ADMIN_NAME ?? "Chủ khách sạn").trim();
const password = env.ADMIN_PASSWORD ?? "";
if (!email || !password) {
  console.error("Thiếu ADMIN_EMAIL hoặc ADMIN_PASSWORD trong .env.local");
  process.exit(1);
}
if (password.length < 12) {
  console.error("ADMIN_PASSWORD cần ít nhất 12 ký tự");
  process.exit(1);
}

// Salt là chuỗi hex, dùng nguyên dạng chữ làm salt (giống cách Payload và CMS mới làm)
const salt = randomBytes(32).toString("hex");
const hash =
  "pbkdf2-sha256-cf30k:" +
  pbkdf2Sync(password, salt, 30_000, 32, "sha256").toString("hex");
const now = new Date().toISOString();
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const sql = `insert into users (name, email, role, active, salt, hash, login_attempts, updated_at, created_at)
values (${q(name)}, ${q(email)}, 'owner', 1, ${q(salt)}, ${q(hash)}, 0, ${q(now)}, ${q(now)})
on conflict(email) do update set role = 'owner', active = 1, salt = excluded.salt, hash = excluded.hash,
  login_attempts = 0, lock_until = null, updated_at = excluded.updated_at;`;

const file = join(tmpdir(), `f21-create-admin-${process.pid}.sql`);
writeFileSync(file, sql, { mode: 0o600 });
const remote = process.argv.includes("--remote");
const r = spawnSync(
  "npx",
  [
    "wrangler",
    "d1",
    "execute",
    "D1",
    remote ? "--remote" : "--local",
    "--file",
    file,
  ],
  { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" },
);
rmSync(file, { force: true });
if (r.status !== 0) {
  console.error(
    "Không ghi được vào D1:\n" +
      (r.stderr || r.stdout)
        .split("\n")
        .filter((l) => !l.includes(salt))
        .slice(-8)
        .join("\n"),
  );
  process.exit(1);
}
console.log(
  `Đã tạo hoặc đặt lại tài khoản Chủ: ${email} (${remote ? "D1 trên Cloudflare" : "D1 ở máy"}). Nhớ xoá ADMIN_PASSWORD khỏi .env.local.`,
);
