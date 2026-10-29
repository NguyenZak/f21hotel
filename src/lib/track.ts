// Gửi sự kiện chuyển đổi sang GA4 / Google Ads nếu gtag đã được gắn.
// Các sự kiện: click_call, click_zalo, click_directions, submit_booking.

type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;

export function track(name: string, params?: Record<string, unknown>) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, params);
}
