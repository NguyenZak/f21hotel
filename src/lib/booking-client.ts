// Gọi API đặt phòng từ trình duyệt (src/lib/booking-api.ts). Thay cho server action để mỗi lần tìm/đặt phòng
// không phải nạp cả máy chủ Next.js trên Cloudflare (giới hạn 10 ms CPU của Workers Free).
import type { CartLine, CreateBookingResult, GuestField, SearchResult } from "./booking";

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

export const createBooking = (input: { checkIn: string; checkOut: string; lines: CartLine[]; guest: Partial<Record<GuestField | "website", string>> }) =>
  post<CreateBookingResult>("/api/booking/create", input, { ok: false, error: offline });
