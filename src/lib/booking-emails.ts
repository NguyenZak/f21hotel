// Email gửi khách cho một đặt phòng: đã nhận (đặt online), đã xác nhận (lễ tân chuyển trạng thái trong CMS),
// nhắc trước ngày nhận phòng (cron trong worker.ts). Mỗi lần gửi ghi một dòng vào booking_emails
// (db/migrations/0003_booking_emails.sql) để CMS hiện lịch sử và cron không gửi trùng.
// Hàm thuần nhận D1, không phụ thuộc Next.js: dùng trong custom worker và trong route của next dev.
import { cancelPolicy, EMAIL_KINDS, STAY_LABELS, type BookingEmailLog, type BookingView, type EmailKind } from "./booking";
import { addDays, shortDate, todayInVietnam, toDbDate, toIsoDate } from "./dates";
import { sendMail, type MailConfig, type MailResult } from "./mailer";
import { findBooking } from "./reservations";
import { directionsUrl, formatVnd } from "./site";
import { readBookingSettings, readPriceNotes, readSite, type BookingSettings, type SiteData } from "./site-data";
import { num, str } from "./sql";

// Nhắc trước ngày nhận phòng bao nhiêu ngày (cron chạy mỗi sáng, wrangler.jsonc "triggers")
export const REMINDER_DAYS_BEFORE = 1;

// Khách đặt qua OTA đã nhận email xác nhận của OTA: CMS không tự gửi thêm (vẫn gửi tay và nhắc lịch được)
const OTA_SOURCES = ["agoda", "booking_com", "traveloka", "trip_com", "expedia"];
export const autoConfirmEmail = (source: string) => !OTA_SOURCES.includes(source);

type Hotel = { site: SiteData; settings: BookingSettings; refund: string };

const loadHotel = async (d: D1Database): Promise<Hotel> => {
  const [site, settings, notes] = await Promise.all([readSite(d), readBookingSettings(d), readPriceNotes(d)]);
  return { site, settings, refund: notes.refund };
};

// ---------- Nội dung email ----------

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const longDate = (iso: string) => `${shortDate(iso)}/${iso.slice(0, 4)}`;
const plusDays = (iso: string, n: number) => toIsoDate(addDays(new Date(`${iso}T00:00:00`), n));
const C = { maroon: "#8d191d", gold: "#c9a23f", goldText: "#86651a", cream: "#f8f2e7", paper: "#fffdf8", ink: "#2b1d1b", muted: "#6f625c", line: "#e6dbc8" };

export function renderBookingEmail(kind: EmailKind, b: BookingView, { site, settings, refund }: Hotel, today = todayInVietnam()) {
  const base = site.url.replace(/\/+$/, "");
  const link = `${base}/dat-phong/xac-nhan/${b.code}`;
  const stay = b.items[0]?.stayType;
  const hourly = b.items.length > 0 && b.items.every((i) => i.stayType === "hourly");
  const arrive = hourly ? "theo giờ đã hẹn" : stay === "overnight" ? "sau 19:00" : `từ ${site.checkIn}`;
  const leave = hourly ? "theo giờ đã hẹn" : stay === "overnight" ? "trước 10:00" : `trước ${site.checkOut}`;
  const due = Math.max(0, b.deposit - b.paid);
  const balance = Math.max(0, b.total - b.paid);
  const bank = due > 0 ? settings.bank : null;
  const qr = bank
    ? `https://img.vietqr.io/image/${encodeURIComponent(bank.bankId)}-${encodeURIComponent(bank.accountNo)}-compact2.png?amount=${due}&addInfo=${encodeURIComponent(b.code)}&accountName=${encodeURIComponent(bank.accountName)}`
    : "";
  const daysLeft = Math.round((Date.parse(`${b.checkIn}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
  const when = daysLeft <= 0 ? "hôm nay" : daysLeft === 1 ? "ngày mai" : `sau ${daysLeft} ngày`;
  const cancelBy = settings.freeCancelDays ? plusDays(b.checkIn, -settings.freeCancelDays) : "";
  const policy = settings.freeCancelDays && cancelBy >= today
    ? `Đổi hoặc huỷ miễn phí tới hết ngày ${longDate(cancelBy)}, hoàn lại toàn bộ tiền cọc.`
    : cancelPolicy(0, refund);
  const directions = directionsUrl(site.mapQuery || site.address.full);

  const subject = {
    received: `F21 Hotel đã nhận đặt phòng ${b.code}`,
    confirmed: `Đặt phòng ${b.code} đã được xác nhận`,
    reminder: `Hẹn gặp bạn ${when} tại F21 Hotel (${b.code})`,
  }[kind];
  const lead = {
    received: `${site.name} đã nhận đặt phòng và đang giữ phòng cho bạn. Lễ tân sẽ gọi hoặc nhắn Zalo trong khoảng 15 phút (${site.replyHours}) để xác nhận.`,
    confirmed: `Lễ tân đã xác nhận đặt phòng của bạn. Hẹn gặp bạn tại ${site.name}.`,
    reminder: `${daysLeft <= 0 ? "Hôm nay" : daysLeft === 1 ? "Ngày mai" : `Còn ${daysLeft} ngày nữa`} là ngày nhận phòng. ${site.name} gửi lại thông tin để bạn tiện chuẩn bị.`,
  }[kind];

  const rows: [string, string][] = [
    ["Nhận phòng", `${longDate(b.checkIn)} · ${arrive}`],
    ["Trả phòng", `${longDate(b.checkOut)} · ${leave}`],
    ["Thời gian", hourly ? `Nghỉ giờ · ${b.guests} khách` : `${b.nights} đêm · ${b.guests} khách`],
    ...b.items.map((i, idx): [string, string] => [idx === 0 ? "Phòng" : "", `${i.quantity} × ${i.name} (${STAY_LABELS[i.stayType] ?? i.stayType})`]),
    ...(b.arrivalTime ? [["Giờ đến dự kiến", b.arrivalTime] as [string, string]] : []),
    ...(b.note ? [["Yêu cầu thêm", b.note] as [string, string]] : []),
    ["Tổng tiền", formatVnd(b.total)],
    ...(b.paid ? [["Đã thanh toán", formatVnd(b.paid)] as [string, string]] : []),
    ...(b.paid && balance ? [["Còn lại khi nhận phòng", formatVnd(balance)] as [string, string]] : []),
  ];

  const arrivalTips = [
    `Địa chỉ: ${site.address.full}`,
    site.directions,
    "Mang theo CCCD hoặc hộ chiếu để lễ tân khai báo lưu trú theo quy định.",
    `Đến sớm hoặc muộn hơn giờ nhận phòng, gọi ${site.phoneDisplay} để lễ tân sắp xếp.`,
  ].filter(Boolean);

  // ----- Bản HTML (bảng và style viết thẳng để hiện đúng trên Gmail, Outlook) -----
  const td = `padding:8px 0;border-bottom:1px solid ${C.line};vertical-align:top;font-size:15px;`;
  const button = (href: string, label: string, primary = true) =>
    `<a href="${esc(href)}" style="display:inline-block;padding:12px 22px;margin:4px 8px 4px 0;border-radius:6px;font-weight:bold;font-size:15px;text-decoration:none;${
      primary ? `background:${C.maroon};color:#fff;` : `background:${C.paper};color:${C.maroon};border:1px solid ${C.maroon};`
    }">${esc(label)}</a>`;
  const html = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.cream};color:${C.ink};font-family:Helvetica,Arial,sans-serif;">
<span style="display:none;max-height:0;overflow:hidden;">${esc(lead)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.paper};border-radius:8px;overflow:hidden;">
<tr><td style="background:${C.maroon};padding:20px 28px;color:#fff;">
  <div style="font-family:Georgia,serif;font-size:24px;letter-spacing:1px;">${esc(site.name)}</div>
  <div style="color:${C.gold};font-size:13px;margin-top:2px;">${esc(EMAIL_KINDS[kind])}</div>
</td></tr>
<tr><td style="padding:28px;">
  <p style="margin:0 0 12px;font-size:16px;">Chào ${esc(b.guestName)},</p>
  <p style="margin:0 0 20px;font-size:15px;line-height:1.55;">${esc(lead)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};border-radius:6px;margin-bottom:20px;"><tr><td style="padding:14px 18px;">
    <div style="font-size:12px;color:${C.muted};text-transform:uppercase;letter-spacing:1px;">Mã đặt phòng</div>
    <div style="font-size:22px;font-weight:bold;letter-spacing:2px;color:${C.maroon};">${esc(b.code)}</div>
  </td></tr></table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${rows.map(([k, v]) => `<tr><td style="${td}color:${C.muted};width:42%;">${esc(k)}</td><td style="${td}">${esc(v)}</td></tr>`).join("\n    ")}
  </table>
  ${
    bank
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;border:1px solid ${C.gold};border-radius:6px;"><tr><td style="padding:16px 18px;">
    <div style="font-weight:bold;font-size:16px;margin-bottom:6px;">Đặt cọc ${esc(formatVnd(due))}</div>
    <div style="font-size:14px;line-height:1.55;margin-bottom:10px;">Quét mã bằng ứng dụng ngân hàng, hoặc chuyển khoản tới ${esc(bank.accountName || "khách sạn")}, số tài khoản <b>${esc(bank.accountNo)}</b> (${esc(bank.bankId)}), nội dung <b>${esc(b.code)}</b>.</div>
    <img src="${esc(qr)}" width="220" alt="Mã QR chuyển khoản ${esc(formatVnd(due))}" style="display:block;max-width:100%;height:auto;">
  </td></tr></table>`
      : ""
  }
  ${
    kind === "reminder"
      ? `<h2 style="font-family:Georgia,serif;font-size:18px;color:${C.maroon};margin:26px 0 8px;">Khi đến khách sạn</h2>
  <ul style="margin:0 0 8px;padding-left:20px;font-size:15px;line-height:1.6;">${arrivalTips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`
      : `<p style="margin:20px 0 0;font-size:14px;line-height:1.55;color:${C.muted};"><b style="color:${C.ink};">Đổi, huỷ phòng:</b> ${esc(policy)}</p>`
  }
  <div style="margin-top:24px;">
    ${button(link, "Xem đặt phòng")}${kind === "reminder" ? button(directions, "Chỉ đường", false) : ""}
  </div>
  <p style="margin:22px 0 0;font-size:14px;line-height:1.55;">Cần đổi ngày, thêm người hay hỏi gì thêm, bạn gọi <a href="${esc(site.telLink)}" style="color:${C.maroon};">${esc(site.phoneDisplay)}</a> hoặc nhắn <a href="${esc(site.zaloLink)}" style="color:${C.maroon};">Zalo</a> cho lễ tân.</p>
</td></tr>
<tr><td style="padding:18px 28px;border-top:1px solid ${C.line};font-size:12px;line-height:1.6;color:${C.muted};">
  ${esc(site.legal.name || site.name)} · ${esc(site.address.full)}<br>
  Email này gửi tới bạn vì bạn đã đặt phòng tại ${esc(site.name)}. Đây là email thông báo về đặt phòng, không phải quảng cáo.
</td></tr>
</table></td></tr></table></body></html>`;

  // ----- Bản chữ thường (máy đọc email không hiện HTML, và giúp tránh bị xếp vào thư rác) -----
  const text = [
    `Chào ${b.guestName},`,
    "",
    lead,
    "",
    `Mã đặt phòng: ${b.code}`,
    ...rows.map(([k, v]) => (k ? `${k}: ${v}` : `  ${v}`)),
    ...(bank
      ? ["", `Đặt cọc ${formatVnd(due)}: chuyển khoản tới ${bank.accountName || "khách sạn"}, STK ${bank.accountNo} (${bank.bankId}), nội dung ${b.code}.`]
      : []),
    "",
    ...(kind === "reminder" ? ["Khi đến khách sạn:", ...arrivalTips.map((t) => `- ${t}`), `Chỉ đường: ${directions}`] : [`Đổi, huỷ phòng: ${policy}`]),
    "",
    `Xem đặt phòng: ${link}`,
    `Lễ tân: ${site.phoneDisplay} (gọi hoặc Zalo)`,
    "",
    `${site.legal.name || site.name} · ${site.address.full}`,
  ].join("\n");

  return { subject, html, text };
}

// ---------- Gửi và ghi lịch sử ----------

export type SendOptions = {
  // Bỏ qua nếu đơn đã gửi thành công email loại này (gửi tự động); gửi tay từ CMS thì để false
  once?: boolean;
  // Nhân viên bấm gửi trong CMS
  userId?: number;
  hotel?: Hotel;
};

export type SendBookingEmailResult = MailResult | { ok: true; skipped: true };

export async function sendBookingEmail(
  d: D1Database,
  mail: MailConfig | undefined,
  bookingId: number,
  kind: EmailKind,
  opts: SendOptions = {},
): Promise<SendBookingEmailResult> {
  if (!mail) return { ok: false, error: "Chưa cấu hình gửi email (RESEND_API_KEY)." };
  const row = await d
    .prepare(
      `select b.code, b.email, (select count(*) from booking_emails e where e.booking_id = b.id and e.kind = ? and e.status = 'sent') sent
       from bookings b where b.id = ?`,
    )
    .bind(kind, bookingId)
    .first<Record<string, unknown>>();
  if (!row) return { ok: false, error: "Không tìm thấy đặt phòng." };
  const to = str(row.email).trim();
  if (!to) return { ok: false, error: "Đặt phòng chưa có email của khách." };
  if (opts.once && num(row.sent) > 0) return { ok: true, skipped: true };
  const [booking, hotel] = await Promise.all([findBooking(d, str(row.code)), opts.hotel ?? loadHotel(d)]);
  if (!booking) return { ok: false, error: "Không tìm thấy đặt phòng." };

  const { subject, html, text } = renderBookingEmail(kind, booking, hotel);
  const result = await sendMail(mail, {
    to,
    subject,
    html,
    text,
    replyTo: hotel.site.email || undefined,
    idempotencyKey: opts.once ? `${kind}-${booking.code}` : undefined,
  });
  await d
    .prepare("insert into booking_emails (booking_id, kind, recipient, status, message_id, error, user_id) values (?, ?, ?, ?, ?, ?, ?)")
    .bind(bookingId, kind, to, result.ok ? "sent" : "failed", result.ok ? result.id : null, result.ok ? null : result.error, opts.userId ?? null)
    .run();
  if (!result.ok) console.error(`[email] ${kind} ${booking.code}:`, result.error);
  return result;
}

// Lịch sử email của một đơn (CMS › Đặt phòng › sửa)

export async function bookingEmailLog(d: D1Database, bookingId: number): Promise<BookingEmailLog[]> {
  const { results } = await d
    .prepare(
      `select e.kind, e.recipient, e.status, e.error, e.created_at, u.name user_name from booking_emails e
       left join users u on u.id = e.user_id where e.booking_id = ? order by e.id desc limit 20`,
    )
    .bind(bookingId)
    .all<Record<string, unknown>>();
  return results.map((r) => ({
    kind: str(r.kind) as EmailKind,
    recipient: str(r.recipient),
    status: str(r.status) === "sent" ? "sent" : "failed",
    error: str(r.error),
    createdAt: str(r.created_at),
    userName: str(r.user_name),
  }));
}

// Cron mỗi sáng: nhắc các đơn nhận phòng sau REMINDER_DAYS_BEFORE ngày, còn hiệu lực, có email, chưa nhắc.
// Lần chạy sau trong ngày gửi lại các đơn vừa lỗi. Gửi lần lượt (Resend giới hạn vài email mỗi giây).
export async function sendReminders(d: D1Database, mail: MailConfig | undefined, today = todayInVietnam()) {
  if (!mail) return { sent: 0, failed: 0 };
  const { results } = await d
    .prepare(
      `select b.id from bookings b where b.check_in = ? and b.status in ('pending', 'confirmed') and coalesce(b.email, '') <> ''
       and not exists (select 1 from booking_emails e where e.booking_id = b.id and e.kind = 'reminder' and e.status = 'sent')
       order by b.id limit 40`,
    )
    .bind(toDbDate(plusDays(today, REMINDER_DAYS_BEFORE)))
    .all<{ id: number }>();
  if (!results.length) return { sent: 0, failed: 0 };
  const hotel = await loadHotel(d);
  let sent = 0;
  let failed = 0;
  for (const { id } of results) {
    const r = await sendBookingEmail(d, mail, num(id), "reminder", { once: true, hotel });
    if (r.ok) sent++;
    else failed++;
  }
  return { sent, failed };
}
