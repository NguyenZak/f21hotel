// Ngày dạng YYYY-MM-DD theo giờ địa phương (không dùng toISOString vì lệch sang UTC)
export function toIsoDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(d: Date, days: number) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

// Số đêm giữa hai ngày YYYY-MM-DD, null nếu không hợp lệ
export function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return null;
  const a = Date.parse(`${checkIn}T00:00:00Z`);
  const b = Date.parse(`${checkOut}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  const n = Math.round((b - a) / 86_400_000);
  return n > 0 ? n : null;
}

export function formatViDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

// Ngày hôm nay theo giờ Việt Nam (máy chủ Cloudflare chạy giờ UTC)
export function todayInVietnam() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
}

// Các đêm của kỳ ở: từ ngày nhận phòng đến trước ngày trả phòng
export function nightsOf(checkIn: string, checkOut: string) {
  const n = nightsBetween(checkIn, checkOut) ?? 0;
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  return Array.from({ length: n }, (_, i) => new Date(start + i * 86_400_000).toISOString().slice(0, 10));
}

// Ngày trong CMS lưu dạng 2026-11-07T12:00:00.000Z (ô chọn ngày của Payload đặt 12:00 UTC cho kiểu chỉ có ngày)
export const toDbDate = (iso: string) => `${iso}T12:00:00.000Z`;
export const fromDbDate = (v: string | Date | null | undefined) =>
  v ? (v instanceof Date ? v.toISOString() : String(v)).slice(0, 10) : "";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

// "2026-11-07" -> "T7, 07/11"
export function shortDate(iso: string) {
  const d = new Date(`${iso}T00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${WEEKDAYS[d.getDay()]}, ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}
