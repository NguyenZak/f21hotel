import { after } from "next/server";
import { handleBookingApi } from "@/lib/booking-api";
import { db } from "@/lib/db";
import { mailConfigFrom } from "@/lib/mailer";

// API đặt phòng (tìm phòng trống, tạo đơn).
export async function POST(request: Request) {
  const res = await handleBookingApi(request, await db(), {
    webhookUrl: process.env.BOOKING_WEBHOOK_URL,
    waitUntil: (p) => after(p),
    mail: mailConfigFrom(process.env),
  });
  return res ?? new Response("Not found", { status: 404 });
}
