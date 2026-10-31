// Dữ liệu cho các widget bảng điều khiển CMS. Đọc theo quyền của người đang đăng nhập (req).
import type { PayloadRequest, Where } from "payload";
import { BLOCKING_STATUSES, BOOKING_SOURCES, BOOKING_STATUSES } from "@/lib/booking";
import { addDays, fromDbDate, nightsOf, todayInVietnam, toDbDate, toIsoDate } from "@/lib/dates";
import type { Booking, RoomType } from "@/payload-types";

export const today = () => todayInVietnam();
export const plusDays = (iso: string, n: number) => toIsoDate(addDays(new Date(`${iso}T00:00:00`), n));

export const statusLabel = (s: string) => BOOKING_STATUSES.find((x) => x.value === s)?.label ?? s;
export const sourceLabel = (s: string) => BOOKING_SOURCES.find((x) => x.value === s)?.label ?? s;

const findBookings = (req: PayloadRequest, where: Where, limit = 50, sort = "checkIn") =>
  req.payload.find({ collection: "bookings", where, depth: 1, limit, sort, req, overrideAccess: false });

export async function todayBookings(req: PayloadRequest) {
  const day = toDbDate(today());
  const [arrivals, departures, inHouse, pending] = await Promise.all([
    findBookings(req, { and: [{ checkIn: { equals: day } }, { status: { in: ["pending", "confirmed", "checked_in"] } }] }),
    findBookings(req, { and: [{ checkOut: { equals: day } }, { status: { in: ["confirmed", "checked_in", "checked_out"] } }] }),
    findBookings(req, { status: { equals: "checked_in" } }, 1),
    findBookings(req, { status: { equals: "pending" } }, 8, "-createdAt"),
  ]);
  return { arrivals, departures, inHouse, pending };
}

// Số phòng của đơn và hạng phòng, ví dụ "2 × Phòng Đôi"
export const roomsOf = (b: Booking) =>
  b.items
    .map((i) => `${i.quantity} × ${typeof i.roomType === "object" ? (i.roomType as RoomType).name : "phòng"}`)
    .join(", ");

// Công suất các đêm sắp tới và doanh thu, kênh đặt phòng trong tháng
export async function outlook(req: PayloadRequest, days = 7) {
  const start = today();
  const end = plusDays(start, days);
  const monthStart = `${start.slice(0, 7)}-01`;
  const [rooms, upcoming, month] = await Promise.all([
    req.payload.count({ collection: "rooms", where: { active: { equals: true } }, req, overrideAccess: false }),
    req.payload.find({
      collection: "bookings",
      where: { and: [{ status: { in: BLOCKING_STATUSES } }, { checkIn: { less_than: toDbDate(end) } }, { checkOut: { greater_than: toDbDate(start) } }] },
      depth: 0,
      pagination: false,
      req,
      overrideAccess: false,
    }),
    req.payload.find({
      collection: "bookings",
      where: { and: [{ checkIn: { greater_than_equal: toDbDate(monthStart) } }, { status: { not_in: ["cancelled", "no_show"] } }] },
      depth: 0,
      pagination: false,
      req,
      overrideAccess: false,
    }),
  ]);

  const nights = nightsOf(start, end).map((night) => {
    const sold = upcoming.docs
      .filter((b) => fromDbDate(b.checkIn) <= night && night < fromDbDate(b.checkOut))
      .reduce((n, b) => n + b.items.reduce((m, i) => m + (i.quantity ?? 0), 0), 0);
    return { night, sold, rate: rooms.totalDocs ? Math.min(1, sold / rooms.totalDocs) : 0 };
  });
  const revenue = month.docs.reduce((n, b) => n + (b.total ?? 0), 0);
  const sources = Object.entries(
    month.docs.reduce<Record<string, number>>((acc, b) => ((acc[b.source] = (acc[b.source] ?? 0) + 1), acc), {}),
  ).sort((a, b) => b[1] - a[1]);
  return { totalRooms: rooms.totalDocs, nights, revenue, monthCount: month.totalDocs, sources };
}

export const money = (n: number) => `${n.toLocaleString("vi-VN")}đ`;
export const bookingsUrl = (where: string) => `/admin/collections/bookings?${where}`;
