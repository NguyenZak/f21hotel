// Báo cho lễ tân qua Google Apps Script (lưu Google Sheet và gửi email).
// Xem docs/google-apps-script.md để tạo URL này. Chỉ gọi từ server.
// url: truyền vào khi chạy trong custom worker (env.BOOKING_WEBHOOK_URL); trong Next lấy từ process.env
export async function notifyFrontDesk(data: Record<string, unknown>, summary: string, url = process.env.BOOKING_WEBHOOK_URL) {
  if (!url) {
    console.warn("[booking] BOOKING_WEBHOOK_URL chưa được cấu hình, lễ tân chưa nhận được thông báo:\n" + summary);
    return false;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, summary, submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[booking] Webhook trả về", res.status);
    return res.ok;
  } catch (err) {
    console.error("[booking] Không gửi được webhook", err);
    return false;
  }
}
