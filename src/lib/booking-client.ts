// Gọi API đặt phòng từ trình duyệt (src/lib/booking-api.ts). Thay cho server action để mỗi lần tìm/đặt phòng
// không phải nạp cả máy chủ Next.js trên Cloudflare (giới hạn 10 ms CPU của Workers Free).
import type { BookingState, CartLine, CreateBookingResult, GuestField, PromoCheck, SearchResult } from "./booking";

async function post<T>(path: string, body: unknown, fallback: T): Promise<T> {
  try {
    const res = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

const offline = "Không kết nối được, vui lòng kiểm tra mạng rồi thử lại, hoặc gọi lễ tân.";

export const searchRooms = (checkIn: string, checkOut: string) =>
  post<SearchResult>("/api/booking/search", { checkIn, checkOut }, { ok: false, error: offline });

// Kiểm tra mã ưu đãi khi khách nhập, để tổng tiền hiện ngay mức giảm
export const checkPromo = (code: string) => post<PromoCheck>("/api/booking/promo", { code }, { ok: false, error: offline });

export const createBooking = (input: { checkIn: string; checkOut: string; lines: CartLine[]; guest: Partial<Record<GuestField | "website", string>> }) =>
  post<CreateBookingResult>("/api/booking/create", input, { ok: false, error: offline });

// Form yêu cầu đặt phòng / báo giá đoàn, dùng với useActionState (giữ chữ khách đã nhập khi có lỗi)
export async function submitRequest(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const body = Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string"));
  return post<BookingState>("/api/booking/request", body, {
    status: "error",
    message: offline,
    values: body as BookingState["values"],
  });
}
