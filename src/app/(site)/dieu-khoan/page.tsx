import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL_UPDATED, LegalOwner } from "@/components/Legal";
import { PageHero } from "@/components/ui";
import { getBookingSettings, getPriceNotes, getSite } from "@/lib/cms";
import { breadcrumbJsonLd, JsonLd, OG_IMAGES, pageMeta } from "@/lib/seo";
import { formatVnd } from "@/lib/site";

// Điều khoản đặt phòng và sử dụng website: thông tin chủ sở hữu, quy trình đặt, cọc/huỷ, khiếu nại (Luật TMĐT 122/2025
// Điều 11; Luật Bảo vệ quyền lợi người tiêu dùng 19/2023). Bản nháp cần luật sư duyệt. Tiền cọc, huỷ miễn phí, giờ nhận
// trả phòng, VAT lấy từ CMS để khớp với form đặt phòng (BookingEngine). Sửa nội dung thì đổi LEGAL_UPDATED.

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMeta(
    site,
    "/dieu-khoan",
    "Điều khoản đặt phòng và sử dụng website",
    `Quy trình đặt phòng, đặt cọc, đổi huỷ, nhận trả phòng và cách gửi khiếu nại khi đặt phòng trực tiếp với ${site.name}.`,
    OG_IMAGES.booking,
  );
}

export default async function TermsPage() {
  const [site, notes, booking] = await Promise.all([getSite(), getPriceNotes(), getBookingSettings()]);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(site, "/dieu-khoan", "Điều khoản đặt phòng")} />
      <PageHero crumb="Điều khoản đặt phòng" eyebrow="Điều khoản" title="Điều khoản đặt phòng và sử dụng website">
        Cập nhật ngày {LEGAL_UPDATED}. Áp dụng cho đặt phòng trên website, qua hotline và Zalo của {site.name}.
      </PageHero>

      <section className="section">
        <div className="wrap legal-doc">
          <h2>1. Chủ website</h2>
          <LegalOwner site={site} />
          <p>
            Website giới thiệu và nhận đặt phòng trực tiếp của {site.name}, không bán sản phẩm, dịch vụ của bên khác.
          </p>

          <h2>2. Giá phòng</h2>
          <ul>
            <li>Giá niêm yết bằng đồng Việt Nam, xem tại <Link href="/phong">Phòng &amp; giá</Link>.</li>
            {notes.vat ? <li>{notes.vat}</li> : <li>Cần hoá đơn VAT, vui lòng báo lễ tân khi đặt phòng.</li>}
            {notes.water ? <li>{notes.water}</li> : null}
            {notes.extraPerson ? <li>Phụ thu thêm người: {formatVnd(notes.extraPerson)} mỗi người.</li> : null}
            <li>Tổng tiền hiện trên nút &ldquo;Xác nhận đặt phòng&rdquo; là số tiền phòng bạn trả, không phát sinh phí đặt phòng.</li>
          </ul>

          <h2>3. Đặt phòng trên website</h2>
          <ol>
            <li>Chọn ngày, phòng và hình thức nghỉ, sau đó nhập thông tin liên hệ.</li>
            <li>Bấm &ldquo;Xác nhận đặt phòng&rdquo;: hệ thống giữ phòng và cấp mã đặt phòng trên trang xác nhận.</li>
            <li>
              Lễ tân gọi hoặc nhắn Zalo xác nhận trong khoảng 15 phút ({site.replyHours}), rồi hướng dẫn đặt cọc
              {booking.depositPercent ? ` ${booking.depositPercent}% tổng tiền` : ""} bằng chuyển khoản theo mã QR trên trang xác nhận.
            </li>
            <li>Đặt phòng được xác nhận khi lễ tân đã xác nhận với bạn và khách sạn nhận được tiền cọc.</li>
          </ol>
          <p>Website không thu tiền trực tuyến và không lưu thông tin thẻ, tài khoản ngân hàng của bạn.</p>

          <h2>4. Đặt cọc, đổi và huỷ phòng</h2>
          <ul>
            <li>{notes.deposit}</li>
            <li>
              {booking.freeCancelDays
                ? `Đổi hoặc huỷ miễn phí trước ngày nhận phòng từ ${booking.freeCancelDays} ngày trở lên, được hoàn lại toàn bộ tiền cọc.`
                : notes.refund}
            </li>
            <li>
              Khách sạn hoàn lại toàn bộ tiền cọc nếu khách sạn không bố trí được phòng như đã xác nhận, hoặc phòng không đúng mô
              tả trên website mà bạn không nhận phòng thay thế.
            </li>
          </ul>

          <h2>5. Nhận và trả phòng</h2>
          <ul>
            <li>
              Nghỉ ngày đêm: nhận phòng {site.checkIn}, trả phòng {site.checkOut}. Qua đêm: nhận phòng 19:00, trả phòng 10:00.
            </li>
            <li>Mang căn cước công dân hoặc hộ chiếu khi nhận phòng để khai báo lưu trú theo quy định.</li>
          </ul>

          <h2>6. Ưu đãi</h2>
          <ul>
            <li>
              Điều kiện và thời hạn của từng ưu đãi ghi tại <Link href="/uu-dai">Ưu đãi</Link>. Ưu đãi áp dụng khi còn phòng và
              trong thời hạn đã ghi.
            </li>
            <li>Ưu đãi không cộng dồn: mỗi đặt phòng được mức giảm lớn nhất, trừ thẳng vào tổng tiền.</li>
          </ul>

          <h2>7. Khiếu nại và giải quyết tranh chấp</h2>
          <ul>
            <li>
              Gửi phản ánh, khiếu nại qua số phản ánh dịch vụ{" "}
              {site.feedbackPhone ? <a href={`tel:${site.feedbackPhone}`}>{site.feedbackPhoneDisplay}</a> : null}, hotline{" "}
              <a href={site.telLink}>{site.phoneDisplay}</a>, Zalo
              {site.email ? (
                <>
                  , email <a href={`mailto:${site.email}`}>{site.email}</a>
                </>
              ) : null}{" "}
              hoặc trực tiếp tại quầy lễ tân.
            </li>
            <li>Khách sạn xác nhận đã nhận khiếu nại trong 24 giờ và trả lời kết quả giải quyết trong 3 ngày làm việc.</li>
            <li>
              Hai bên ưu tiên thương lượng, hoà giải. Không thống nhất được thì một trong hai bên có quyền đưa tranh chấp ra Toà án
              có thẩm quyền theo pháp luật Việt Nam.
            </li>
          </ul>

          <h2>8. Dữ liệu cá nhân</h2>
          <p>
            Cách chúng tôi thu thập và bảo vệ thông tin của bạn: xem{" "}
            <Link href="/chinh-sach-bao-mat">Chính sách bảo vệ dữ liệu cá nhân</Link>.
          </p>

          <h2>9. Sử dụng website</h2>
          <p>
            Hình ảnh và nội dung trên website thuộc {site.legal.name || site.name}. Vui lòng không dùng website để gửi thông tin
            sai sự thật hoặc đặt phòng giả.
          </p>
          <p className="legal-basis">
            Căn cứ: Luật Thương mại điện tử số 122/2025/QH15; Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15; Luật Giao
            dịch điện tử số 20/2023/QH15.
          </p>
        </div>
      </section>
    </>
  );
}
