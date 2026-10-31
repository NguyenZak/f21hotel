import { after } from "next/server";
import { handleBookingApi } from "@/lib/booking-api";
import { db } from "@/lib/db";

// API đặt phòng khi chạy qua Next.js (`next dev`). Trên Cloudflare, worker.ts xử lý đường dẫn này
// trước khi nạp Next.js nên route này chỉ là đường dự phòng.
export async function POST(request: Request) {
  const res = await handleBookingApi(request, await db(), {
    webhookUrl: process.env.BOOKING_WEBHOOK_URL,
    waitUntil: (p) => after(p),
  });
  return res ?? new Response("Not found", { status: 404 });
}
