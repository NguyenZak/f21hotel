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
