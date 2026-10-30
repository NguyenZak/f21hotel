import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { CopyCode, SendViaZalo } from "@/components/BookingShare";
import { IconCheck, IconPhone } from "@/components/Icons";
import { PageHero } from "@/components/ui";
import { STAY_LABELS, statusLabel, summarizeBooking } from "@/lib/booking";
import { getBookingSettings, getSite } from "@/lib/cms";
import { shortDate } from "@/lib/dates";
import { findBooking } from "@/lib/reservations";
import { formatVnd } from "@/lib/site";

// Trang xác nhận sau khi đặt phòng online. Có thông tin cá nhân của khách nên không cho Google lập chỉ mục.
export const metadata: Metadata = {
  title: "Xác nhận đặt phòng",
  robots: { index: false, follow: false },
};

// Mỗi mã đặt phòng là một trang riêng, luôn dựng khi khách mở (không dựng sẵn, không prefetch)
export const instant = false;

export default function ConfirmationPage({ params }: { params: Promise<{ code: string }> }) {
  return (
    <>
      <PageHero crumb="Xác nhận đặt phòng" eyebrow="Đặt phòng trực tiếp" title="Đặt phòng của bạn" />
      <section className="section">
        <div className="wrap">
          <Suspense fallback={<p className="bk-loading">Đang tải đặt phòng…</p>}>
            <Confirmation params={params} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

// 0912345678 -> 0912 *** 678
const maskPhone = (p: string) => (p.length >= 10 ? `${p.slice(0, 4)} *** ${p.slice(-3)}` : p);

async function Confirmation({ params }: { params: Promise<{ code: string }> }) {
  await connection();
  const code = decodeURIComponent((await params).code).toUpperCase();
  if (!/^F21-[A-Z0-9]{7}$/.test(code)) notFound();
  const [booking, site, settings] = await Promise.all([findBooking(code), getSite(), getBookingSettings()]);
  if (!booking) notFound();

  const cancelled = booking.status === "cancelled" || booking.status === "no_show";
  const due = Math.max(0, booking.deposit - booking.paid);
  const bank = settings.bank;
  const showQr = bank && due > 0 && (booking.status === "pending" || booking.status === "confirmed");
  const qrSrc = bank
    ? `https://img.vietqr.io/image/${encodeURIComponent(bank.bankId)}-${encodeURIComponent(bank.accountNo)}-compact2.png?amount=${due}&addInfo=${encodeURIComponent(booking.code)}&accountName=${encodeURIComponent(bank.accountName)}`
    : "";
  const stay = booking.items[0]?.stayType;
  const arrive = stay === "overnight" ? "sau 19:00" : `từ ${site.checkIn}`;
  const leave = stay === "overnight" ? "trước 10:00" : `trước ${site.checkOut}`;

  return (
    <div className="bk">
      <div className="bk-main">
        <div className={`bk-head${cancelled ? " cancelled" : ""}`}>
          {cancelled ? null : (
            <span className="bk-ok">
              <IconCheck />
            </span>
          )}
          <div>
            <h2>{cancelled ? "Đặt phòng đã huỷ" : `Cảm ơn ${booking.guestName}!`}</h2>
            <p>
              {cancelled
                ? "Đặt phòng này không còn hiệu lực. Cần đặt lại, vui lòng gọi lễ tân hoặc đặt mới trên website."
                : booking.status === "pending"
                  ? `F21 đã giữ phòng cho bạn. Lễ tân sẽ gọi hoặc nhắn Zalo số ${maskPhone(booking.phone)} trong khoảng 15 phút (${site.replyHours}) để xác nhận.`
                  : "Đặt phòng đã được lễ tân xác nhận. Hẹn gặp bạn tại F21 Hotel."}
            </p>
          </div>
        </div>

        <div className="bk-code-row">
          <div>
            <small>Mã đặt phòng</small>
            <CopyCode code={booking.code} />
          </div>
          <div>
            <small>Trạng thái</small>
            <span className={`bk-status s-${booking.status}`}>{statusLabel(booking.status)}</span>
          </div>
        </div>
        <p className="bk-keep">Lưu lại trang này hoặc chụp màn hình mã đặt phòng để xem lại và đọc cho lễ tân khi nhận phòng.</p>

        <dl className="bk-details">
          <div>
            <dt>Nhận phòng</dt>
            <dd>
              {shortDate(booking.checkIn)}/{booking.checkIn.slice(0, 4)} <small>{arrive}</small>
            </dd>
          </div>
          <div>
            <dt>Trả phòng</dt>
            <dd>
              {shortDate(booking.checkOut)}/{booking.checkOut.slice(0, 4)} <small>{leave}</small>
            </dd>
          </div>
          <div>
            <dt>Thời gian</dt>
            <dd>
              {booking.nights} đêm · {booking.guests} khách
            </dd>
          </div>
          {booking.items.map((i, idx) => (
            <div key={idx}>
              <dt>{idx === 0 ? "Phòng" : ""}</dt>
              <dd>
                {i.quantity} × {i.name} <small>{STAY_LABELS[i.stayType] ?? i.stayType}</small>
                <b>{formatVnd(i.amount)}</b>
              </dd>
            </div>
          ))}
          {booking.promoCode ? (
            <div>
              <dt>Mã ưu đãi</dt>
              <dd>
                {booking.promoCode} <small>lễ tân áp dụng khi xác nhận</small>
              </dd>
            </div>
          ) : null}
          {booking.note ? (
            <div>
              <dt>Yêu cầu thêm</dt>
              <dd>{booking.note}</dd>
            </div>
          ) : null}
          <div className="bk-total">
            <dt>Tổng tiền</dt>
            <dd>
              <b>{formatVnd(booking.total)}</b>
            </dd>
          </div>
          {booking.deposit ? (
            <div>
              <dt>Đặt cọc</dt>
              <dd>
                <b>{formatVnd(booking.deposit)}</b>
                {booking.paid ? <small>đã thu {formatVnd(booking.paid)}</small> : null}
              </dd>
            </div>
          ) : null}
        </dl>

        <div className="actions bk-actions">
          <SendViaZalo summary={summarizeBooking(booking)} zaloLink={site.zaloLink} />
          <a className="btn btn-ghost" href={site.telLink}>
            <IconPhone /> Gọi lễ tân {site.phoneDisplay}
          </a>
        </div>
        <p className="bk-more">
          Cần đổi ngày hoặc huỷ? Gọi lễ tân và đọc mã đặt phòng. <Link href="/dat-phong">Đặt thêm phòng</Link>
        </p>
      </div>

      {showQr ? (
        <aside className="bk-pay" aria-label="Chuyển khoản đặt cọc">
          <h3>Chuyển khoản đặt cọc</h3>
          <p>Quét mã bằng ứng dụng ngân hàng. Số tiền và nội dung đã điền sẵn; lễ tân xác nhận khi nhận được tiền.</p>
          {/* Ảnh QR do VietQR tạo theo số tài khoản, số tiền và nội dung chuyển khoản */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt={`Mã QR chuyển ${formatVnd(due)} cho đặt phòng ${booking.code}`} width={540} height={640} loading="lazy" />
          <dl>
            <div>
              <dt>Ngân hàng</dt>
              <dd>{bank.bankId}</dd>
            </div>
            <div>
              <dt>Số tài khoản</dt>
              <dd>{bank.accountNo}</dd>
            </div>
            {bank.accountName ? (
              <div>
                <dt>Chủ tài khoản</dt>
                <dd>{bank.accountName}</dd>
              </div>
            ) : null}
            <div>
              <dt>Số tiền</dt>
              <dd>{formatVnd(due)}</dd>
            </div>
            <div>
              <dt>Nội dung</dt>
              <dd>{booking.code}</dd>
            </div>
          </dl>
        </aside>
      ) : !cancelled && due > 0 ? (
        <aside className="bk-pay">
          <h3>Đặt cọc</h3>
          <p>
            Lễ tân sẽ gửi số tài khoản khi gọi xác nhận. Số tiền cọc: <b>{formatVnd(due)}</b>, nội dung chuyển khoản ghi mã{" "}
            <b>{booking.code}</b>.
          </p>
        </aside>
      ) : null}
    </div>
  );
}
