// Gửi email qua Resend (https://resend.com, gói miễn phí 3.000 email/tháng, 100 email/ngày). Không dùng Email Sending của
// Cloudflare vì gửi tới địa chỉ bất kỳ cần gói Workers Paid. Chỉ gọi từ server. Không import gì từ Next.js / OpenNext.
// Cấu hình: secret RESEND_API_KEY; EMAIL_FROM (tuỳ chọn) phải dùng tên miền đã xác minh trong Resend.

export type MailConfig = { apiKey: string; from: string };
export type Mail = { to: string; subject: string; html: string; text: string; replyTo?: string; idempotencyKey?: string };
export type MailResult = { ok: true; id: string } | { ok: false; error: string };

const DEFAULT_FROM = "F21 Hotel <datphong@f21hotel.com.vn>";

// env của worker (secret, biến) hoặc process.env khi chạy next dev. Không có khoá thì không gửi email.
export function mailConfigFrom(env: Record<string, unknown>): MailConfig | undefined {
  const apiKey = String(env.RESEND_API_KEY ?? "").trim();
  if (!apiKey) return undefined;
  return { apiKey, from: String(env.EMAIL_FROM ?? "").trim() || DEFAULT_FROM };
}

export async function sendMail(config: MailConfig, mail: Mail): Promise<MailResult> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${config.apiKey}`,
        "content-type": "application/json",
        // Resend bỏ qua lần gửi trùng khoá trong 24 giờ (hai yêu cầu chạy cùng lúc, cron chạy lại)
        ...(mail.idempotencyKey ? { "idempotency-key": mail.idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from: config.from,
        to: [mail.to],
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (res.ok && data.id) return { ok: true, id: data.id };
    return { ok: false, error: `Resend ${res.status}: ${data.message ?? "không rõ lỗi"}`.slice(0, 300) };
  } catch (e) {
    return { ok: false, error: `Không kết nối được Resend: ${String(e)}`.slice(0, 300) };
  }
}
