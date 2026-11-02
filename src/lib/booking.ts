// Kiểu dữ liệu dùng chung giữa form (client) và server action

export type BookingKind = "booking" | "group";

export type BookingField =
  | "name"
  | "phone"
  | "checkIn"
  | "checkOut"
  | "guests"
  | "room"
  | "stayType"
  | "roomCount"
  | "code"
  | "company"
  | "groupType"
  | "invoice"
  | "note"
  | "agreeData";

export type BookingValues = Partial<Record<BookingField, string>>;

export type BookingState = {
  status: "idle" | "ok" | "error";
  message?: string;
  errors?: Partial<Record<BookingField, string>>;
  values?: BookingValues;
  // Nội dung đã soạn sẵn để khách gửi qua Zalo
  summary?: string;
  // false khi chưa cấu hình webhook, lễ tân chỉ nhận được qua Zalo
  delivered?: boolean;
};

export const initialBookingState: BookingState = { status: "idle" };

export const groupTypes = ["Khách dự cưới, giỗ, tân gia", "Công tác, đội thi công", "Đi sự kiện Mỹ Đình", "Tất niên, hội nghị", "Khác"];

export function normalizePhone(raw: string) {
  return raw.replace(/[\s.\-()]/g, "").replace(/^\+84/, "0").replace(/^84(?=\d{9}$)/, "0");
}

export function isValidPhone(raw: string) {
  return /^0\d{9}$/.test(normalizePhone(raw));
}

// ---------- Đặt phòng trực tuyến ----------

export const BOOKING_STATUSES = [
  { label: "Chờ xác nhận", value: "pending" },
  { label: "Đã xác nhận", value: "confirmed" },
  { label: "Đã nhận phòng", value: "checked_in" },
  { label: "Đã trả phòng", value: "checked_out" },
  { label: "Đã huỷ", value: "cancelled" },
  { label: "Không đến", value: "no_show" },
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number]["value"];

// Các trạng thái còn giữ phòng (tính vào số phòng đã bán)
export const BLOCKING_STATUSES: string[] = ["pending", "confirmed", "checked_in"];

export const BOOKING_SOURCES = [
  { label: "Website", value: "website" },
  { label: "Điện thoại / Zalo", value: "phone" },
  { label: "Khách đến trực tiếp", value: "walk_in" },
  { label: "Agoda", value: "agoda" },
  { label: "Booking.com", value: "booking_com" },
  { label: "Traveloka", value: "traveloka" },
  { label: "Trip.com", value: "trip_com" },
  { label: "Expedia", value: "expedia" },
  { label: "Khác", value: "other" },
] as const;

// Mã đặt phòng dạng F21-K7M2QXA: bỏ các ký tự dễ nhầm (0/O, 1/I/L) để đọc qua điện thoại
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export function newBookingCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(7));
  return "F21-" + Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
}

// Hình thức nghỉ đặt được online: nghỉ giờ vẫn gọi hotline
export type OnlineStay = "fullDay" | "overnight";

// Giá và số phòng trống của một hạng phòng cho khoảng ngày khách chọn
export type RatePlan = { total: number; nightly: number[] };
export type RoomAvailability = {
  available: number;
  plans: Partial<Record<OnlineStay, RatePlan>>;
  // Lý do không bán được (ngừng bán, yêu cầu ở tối thiểu…)
  reason?: string;
};

// Giảm giá khi đặt online. Không cộng dồn: khách được mức lớn nhất trong
// giảm đặt trực tiếp, mã ưu đãi (offers.discount_percent) và ở dài ngày.
export type DiscountRules = { direct: number; longStay: { minNights: number; percent: number }[] };
export type Discount = { kind: "direct" | "code" | "longStay"; percent: number; label: string };
export type PromoCheck = { ok: true; code: string; percent: number; title: string } | { ok: false; error: string };

export function bestDiscount(rules: DiscountRules, nights: number, promo?: { code: string; percent: number } | null): Discount | null {
  const options: Discount[] = [];
  if (rules.direct > 0) options.push({ kind: "direct", percent: rules.direct, label: `Giảm ${rules.direct}% đặt trực tiếp` });
  const tier = rules.longStay.filter((t) => nights >= t.minNights).sort((a, b) => b.percent - a.percent)[0];
  if (tier) options.push({ kind: "longStay", percent: tier.percent, label: `Giảm ${tier.percent}% ở từ ${tier.minNights} đêm` });
  if (promo && promo.percent > 0) options.push({ kind: "code", percent: promo.percent, label: `Giảm ${promo.percent}% mã ${promo.code}` });
  return options.sort((a, b) => b.percent - a.percent)[0] ?? null;
}

// Câu chính sách huỷ: có số ngày huỷ miễn phí thì dùng câu đó, không thì dùng câu "Hoàn tiền" trong CMS
export const cancelPolicy = (freeCancelDays: number, refundText: string) =>
  freeCancelDays > 0 ? `Đổi hoặc huỷ miễn phí trước ngày nhận phòng ${freeCancelDays} ngày, hoàn lại toàn bộ tiền cọc.` : refundText;

// Giá sau giảm, làm tròn tới nghìn đồng
export const discounted = (amount: number, percent: number) => (percent > 0 ? Math.round((amount * (100 - percent)) / 100 / 1000) * 1000 : amount);

export type SearchResult =
  | {
      ok: true;
      checkIn: string;
      checkOut: string;
      nights: number;
      rooms: Record<string, RoomAvailability>;
      depositPercent: number;
      discounts: DiscountRules;
      freeCancelDays: number;
    }
  | { ok: false; error: string };

// Phòng khách chọn trong giỏ, theo mã hạng phòng
export type CartLine = { room: string; stay: OnlineStay; qty: number };

export type GuestField = "name" | "phone" | "email" | "guests" | "arrivalTime" | "code" | "note" | "agree" | "agreeData" | "marketing";

export type CreateBookingResult =
  | { ok: true; code: string }
  | { ok: false; error: string; errors?: Partial<Record<GuestField, string>>; refresh?: boolean };

export function isValidEmail(raw: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
}

// Đặt phòng rút gọn để hiển thị cho khách và soạn tin nhắn
export type BookingView = {
  code: string;
  status: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestName: string;
  phone: string;
  email: string;
  guests: number;
  arrivalTime: string;
  promoCode: string;
  note: string;
  items: { name: string; slug: string; stayType: string; quantity: number; amount: number }[];
  total: number;
  deposit: number;
  paid: number;
  createdAt: string;
};

export const STAY_LABELS: Record<string, string> = {
  fullDay: "Ngày đêm",
  overnight: "Qua đêm",
  hourly: "Nghỉ giờ",
};

export const statusLabel = (s: string) => BOOKING_STATUSES.find((x) => x.value === s)?.label ?? s;

const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";
const viDate = (iso: string) => iso.split("-").reverse().join("/");

// Nội dung gửi lễ tân (email, Zalo)
export function summarizeBooking(b: BookingView) {
  return [
    `ĐẶT PHÒNG ONLINE ${b.code} – F21 HOTEL`,
    `Họ tên: ${b.guestName}`,
    `Điện thoại: ${b.phone}`,
    b.email && `Email: ${b.email}`,
    `Nhận phòng: ${viDate(b.checkIn)}`,
    `Trả phòng: ${viDate(b.checkOut)} (${b.nights} đêm)`,
    `Số khách: ${b.guests}`,
    ...b.items.map((i) => `- ${i.quantity} × ${i.name}, ${STAY_LABELS[i.stayType] ?? i.stayType}: ${vnd(i.amount)}`),
    b.items.reduce((s, i) => s + i.amount, 0) > b.total && `Ưu đãi: −${vnd(b.items.reduce((s, i) => s + i.amount, 0) - b.total)}`,
    `Tổng tiền: ${vnd(b.total)}`,
    b.deposit && `Đặt cọc: ${vnd(b.deposit)}`,
    b.arrivalTime && `Giờ đến dự kiến: ${b.arrivalTime}`,
    b.promoCode && `Mã ưu đãi: ${b.promoCode}`,
    b.note && `Ghi chú: ${b.note}`,
  ]
    .filter(Boolean)
    .join("\n");
}
