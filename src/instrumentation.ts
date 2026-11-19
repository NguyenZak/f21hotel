// Việc chạy định kỳ trên VPS (thay cho cron của Cloudflare): 01:00 và 07:00 UTC gửi email nhắc khách trước
// ngày nhận phòng (lần buổi chiều gửi lại đơn bị lỗi buổi sáng). Chỉ bật khi F21_CRON=1 (file .env trên VPS),
// để `next build` và `next dev` không gửi email.
const HOURS_UTC = [1, 7];

function msToNextRun(now = new Date()): number {
  const next = HOURS_UTC.map((h) => {
    const t = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h));
    if (t.getTime() <= now.getTime()) t.setUTCDate(t.getUTCDate() + 1);
    return t.getTime();
  });
  return Math.min(...next) - now.getTime();
}

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.F21_CRON !== "1") return;
  const [{ db }, { sendReminders }, { mailConfigFrom }] = await Promise.all([
    import("@/lib/db"),
    import("@/lib/booking-emails"),
    import("@/lib/mailer"),
  ]);
  const run = async () => {
    try {
      const r = await sendReminders(await db(), mailConfigFrom(process.env));
      if (r.sent || r.failed) console.log(`[email] nhắc lịch: gửi ${r.sent}, lỗi ${r.failed}`);
    } catch (e) {
      console.log(`[email] nhắc lịch lỗi: ${e}`);
    }
    schedule();
  };
  const schedule = () => setTimeout(run, msToNextRun() + 1000).unref();
  schedule();
  console.log("[cron] đã hẹn giờ gửi email nhắc lịch (01:00, 07:00 UTC)");
}
