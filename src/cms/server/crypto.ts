// Mật khẩu và phiên đăng nhập của CMS mới, chỉ dùng Web Crypto (chạy trong custom worker, không cần Node).
// Đọc được các định dạng băm mật khẩu mà Payload đã lưu trong bảng users, nên tài khoản cũ đăng nhập được ngay:
//   - cũ:                 hex(PBKDF2-SHA256, 25000 vòng, 512 byte)
//   - pbkdf2-sha256-v1:   600000 vòng, 32 byte (Payload 3.92; vượt giới hạn 100000 vòng của Workers)
//   - pbkdf2-sha256-cf100k: 100000 vòng, 32 byte (bản vá patches/payload+3.92.1.patch)
//   - pbkdf2-sha256-cf30k:  30000 vòng, 32 byte (định dạng hiện tại)
// Đo trên Workers: 100000 vòng tốn 20–26 ms CPU, 30000 vòng khoảng 6 ms, vừa giới hạn 10 ms của gói Free.
// Mật khẩu dạng cũ được băm lại theo cf30k ở lần đăng nhập đúng đầu tiên. Bản vá Payload cũng đọc được cf30k
// để CMS cũ vẫn đăng nhập được trong thời gian chuyển đổi. Có khoá tài khoản sau 5 lần sai.

const enc = new TextEncoder();
const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

const FORMATS = [
  { prefix: "pbkdf2-sha256-cf30k:", iterations: 30_000, bytes: 32 },
  { prefix: "pbkdf2-sha256-cf100k:", iterations: 100_000, bytes: 32 },
  { prefix: "pbkdf2-sha256-v1:", iterations: 600_000, bytes: 32 },
] as const;
const LEGACY = { iterations: 25_000, bytes: 512 };
const CURRENT = FORMATS[0];

// Payload dùng chuỗi salt (hex) làm salt dạng chữ, không giải mã hex
async function pbkdf2(password: string, salt: string, iterations: number, bytes: number) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc.encode(salt), iterations }, key, bytes * 8));
}

// So sánh không phụ thuộc thời gian
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Mật khẩu không ở định dạng hiện tại thì nên băm lại sau khi đăng nhập đúng
export const needsRehash = (stored: string | null) => !stored?.startsWith(CURRENT.prefix);

export async function verifyPassword(password: string, salt: string | null, stored: string | null) {
  if (!salt || !stored) return false;
  const f = FORMATS.find((x) => stored.startsWith(x.prefix));
  const expected = f ? stored.slice(f.prefix.length) : stored;
  try {
    const actual = await pbkdf2(password, salt, f?.iterations ?? LEGACY.iterations, f?.bytes ?? LEGACY.bytes);
    return safeEqual(actual, expected);
  } catch {
    // Workers không chạy được quá 100000 vòng (dạng v1): cần đặt lại mật khẩu (npm run create-admin:remote)
    return false;
  }
}

export async function hashPassword(password: string) {
  const salt = hex(crypto.getRandomValues(new Uint8Array(32)).buffer);
  return { salt, hash: CURRENT.prefix + (await pbkdf2(password, salt, CURRENT.iterations, CURRENT.bytes)) };
}

// ---------- Phiên đăng nhập: cookie "<payload base64url>.<HMAC-SHA256>" ----------

export type Session = { uid: number; exp: number };
const b64url = (s: string) => btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64url = (s: string) => atob(s.replace(/-/g, "+").replace(/_/g, "/"));

async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)))));
}

export async function signSession(secret: string, s: Session) {
  const body = b64url(JSON.stringify(s));
  return `${body}.${await hmac(secret, body)}`;
}

export async function readSession(secret: string, token: string | undefined): Promise<Session | null> {
  if (!token || !secret) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig || !safeEqual(sig, await hmac(secret, body))) return null;
  try {
    const s = JSON.parse(unb64url(body)) as Session;
    return typeof s.uid === "number" && s.exp > Date.now() ? s : null;
  } catch {
    return null;
  }
}
