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
  | "note";

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
