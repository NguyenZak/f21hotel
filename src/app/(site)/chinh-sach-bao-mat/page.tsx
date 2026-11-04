import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { getSite } from "@/lib/cms";
import { breadcrumbJsonLd, JsonLd, OG_IMAGES, pageMeta } from "@/lib/seo";
import { LEGAL_UPDATED, LegalOwner } from "@/components/Legal";

// Chính sách bảo vệ dữ liệu cá nhân theo Luật 91/2025/QH15 và NĐ 356/2025/NĐ-CP (rà soát pháp lý 02/11/2026).
// Bản nháp cần luật sư duyệt. Nội dung phải khớp thực tế: form đặt phòng (BookingEngine, BookingForm), nơi lưu dữ liệu
// (Cloudflare D1), bên thứ ba (VietQR, Google Maps, Zalo, Resend gửi email). Đổi luồng dữ liệu thì sửa trang này và LEGAL_UPDATED.

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMeta(
    site,
    "/chinh-sach-bao-mat",
    "Chính sách bảo vệ dữ liệu cá nhân",
    `${site.name} thu thập dữ liệu gì khi bạn đặt phòng, dùng để làm gì, lưu bao lâu và cách bạn xem, sửa, xoá dữ liệu của mình.`,
    OG_IMAGES.home,
  );
}

export default async function PrivacyPage() {
  const site = await getSite();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(site, "/chinh-sach-bao-mat", "Chính sách bảo vệ dữ liệu cá nhân")} />
      <PageHero crumb="Chính sách bảo vệ dữ liệu cá nhân" eyebrow="Dữ liệu cá nhân" title="Chính sách bảo vệ dữ liệu cá nhân">
        Cập nhật ngày {LEGAL_UPDATED}. Chúng tôi chỉ hỏi những thông tin cần để giữ phòng cho bạn.
      </PageHero>

      <section className="section">
        <div className="wrap legal-doc">
          <h2>1. Ai chịu trách nhiệm về dữ liệu của bạn</h2>
          <LegalOwner site={site} />

          <h2>2. Chúng tôi thu thập những gì</h2>
          <ul>
            <li>
              <b>Khi bạn đặt phòng trên website:</b> họ tên, số điện thoại/Zalo, email (không bắt buộc), số khách, giờ đến dự
              kiến, ngày nhận và trả phòng, phòng đã chọn, mã ưu đãi và ghi chú bạn tự nhập.
            </li>
            <li>
              <b>Khi bạn gửi yêu cầu đặt phòng hoặc xin báo giá đoàn:</b> họ tên, số điện thoại, tên công ty hoặc gia đình (nếu
              có), ngày ở, số phòng, nhu cầu xuất hoá đơn và ghi chú.
            </li>
            <li>
              <b>Khi bạn gọi điện hoặc nhắn Zalo:</b> những thông tin bạn chủ động cung cấp trong cuộc trao đổi.
            </li>
          </ul>
          <p>
            Website <b>không</b> thu số thẻ hay tài khoản ngân hàng của bạn: tiền cọc chuyển khoản từ ứng dụng ngân hàng của
            bạn. Website <b>không</b> gắn công cụ theo dõi hay quảng cáo (như Google Analytics, Facebook Pixel) và không dùng cookie
            để theo dõi bạn. Giấy tờ tuỳ thân chỉ xuất trình tại quầy khi nhận phòng để khai báo lưu trú theo quy định, không
            thu qua website.
          </p>

          <h2>3. Chúng tôi dùng dữ liệu để làm gì</h2>
          <ul>
            <li>Giữ phòng, gọi hoặc nhắn Zalo xác nhận và hướng dẫn đặt cọc.</li>
            <li>
              Nếu bạn điền email: gửi email báo đã nhận đặt phòng, email xác nhận và email nhắc một ngày trước ngày nhận phòng. Đây
              là email về đặt phòng của bạn, không phải quảng cáo.
            </li>
            <li>Phục vụ bạn trong thời gian lưu trú và giải quyết yêu cầu, khiếu nại của bạn.</li>
            <li>Thực hiện nghĩa vụ kế toán, thuế và các nghĩa vụ khác theo pháp luật.</li>
            <li>
              Gửi ưu đãi qua Zalo hoặc SMS: <b>chỉ khi bạn đánh dấu ô đồng ý riêng</b> lúc đặt phòng hoặc đồng ý trực tiếp với lễ
              tân. Bạn nhắn &ldquo;Ngừng nhận ưu đãi&rdquo; bất cứ lúc nào để huỷ.
            </li>
          </ul>
          <p>Chúng tôi không dùng dữ liệu của bạn vào mục đích khác những mục đích trên nếu chưa hỏi lại ý kiến của bạn.</p>

          <h2>4. Ai có thể nhận dữ liệu</h2>
          <p>Chúng tôi <b>không bán</b> dữ liệu cá nhân. Dữ liệu chỉ đi qua các bên sau, ở mức cần thiết:</p>
          <ul>
            <li>
              <b>Cloudflare, Inc.</b>: lưu trữ website và dữ liệu đặt phòng. Máy chủ có thể đặt ngoài Việt Nam (khu vực châu Á –
              Thái Bình Dương).
            </li>
            <li>
              <b>VietQR</b>: tạo mã QR chuyển khoản cọc trên trang xác nhận. VietQR chỉ nhận số tiền, mã đặt phòng và tài khoản
              nhận của khách sạn, không nhận họ tên hay số điện thoại của bạn.
            </li>
            <li>
              <b>Google</b>: bản đồ Google Maps nhúng ở trang Vị trí. Khi tải bản đồ, Google có thể ghi nhận địa chỉ IP và đặt
              cookie theo chính sách của Google.
            </li>
            <li>
              <b>Zalo</b>: khi bạn nhắn tin cho khách sạn qua Zalo.
            </li>
            <li>
              <b>Resend</b> (Hoa Kỳ): gửi email về đặt phòng nếu bạn điền email. Resend nhận email, họ tên và
              thông tin đặt phòng trong nội dung email. Máy chủ đặt ngoài Việt Nam.
            </li>
            <li>Cơ quan nhà nước có thẩm quyền, khi pháp luật yêu cầu.</li>
          </ul>

          <h2>5. Lưu trữ bao lâu</h2>
          <ul>
            <li>
              Thông tin đặt phòng: lưu 24 tháng kể từ ngày trả phòng, sau đó xoá hoặc làm cho không còn nhận ra bạn. Riêng thông tin
              phải lưu lâu hơn theo pháp luật kế toán, thuế thì lưu theo thời hạn đó.
            </li>
            <li>Yêu cầu đặt phòng và báo giá gửi từ form: chuyển thẳng cho lễ tân, không lưu trên hệ thống của website.</li>
            <li>Danh sách nhận ưu đãi: lưu đến khi bạn rút lại đồng ý.</li>
          </ul>

          <h2>6. Quyền của bạn</h2>
          <p>
            Bạn có quyền được biết về việc xử lý dữ liệu của mình; đồng ý hoặc rút lại đồng ý; xem, chỉnh sửa và yêu cầu cung cấp
            dữ liệu; yêu cầu xoá dữ liệu; yêu cầu hạn chế hoặc phản đối việc xử lý; khiếu nại, tố cáo, khởi kiện theo quy định.
            Rút lại đồng ý không ảnh hưởng tới việc xử lý đã thực hiện hợp pháp trước đó, nhưng chúng tôi có thể không giữ được
            phòng nếu không còn thông tin để liên hệ.
          </p>

          <h2>7. Cách gửi yêu cầu và thời hạn trả lời</h2>
          <p>
            Gọi <a href={site.telLink}>{site.phoneDisplay}</a>, nhắn{" "}
            <a href={site.zaloLink} target="_blank" rel="noopener">
              Zalo
            </a>
            {site.email ? (
              <>
                , gửi email tới <a href={`mailto:${site.email}`}>{site.email}</a>
              </>
            ) : null}{" "}
            hoặc đến quầy lễ tân. Để bảo vệ bạn, chúng tôi có thể đối chiếu số điện thoại hoặc mã đặt phòng trước khi xử lý.
          </p>
          <ul>
            <li>Xác nhận đã nhận yêu cầu: trong 2 ngày làm việc.</li>
            <li>Xem, chỉnh sửa, cung cấp dữ liệu: trong 10 ngày.</li>
            <li>Rút lại đồng ý, hạn chế hoặc phản đối xử lý: trong 15 ngày.</li>
            <li>Xoá dữ liệu: trong 20 ngày.</li>
          </ul>

          <h2>8. Bảo vệ dữ liệu</h2>
          <ul>
            <li>Website dùng kết nối mã hoá (HTTPS).</li>
            <li>Chỉ nhân viên có tài khoản và được phân quyền mới xem được thông tin đặt phòng.</li>
            <li>
              Trang xác nhận đặt phòng dùng mã ngẫu nhiên, che bớt số điện thoại và không cho công cụ tìm kiếm lập chỉ mục.
            </li>
            <li>
              Nếu xảy ra sự cố làm lộ, mất dữ liệu, chúng tôi báo cơ quan chuyên trách chậm nhất 72 giờ và báo cho bạn khi sự cố có
              thể ảnh hưởng tới bạn.
            </li>
          </ul>

          <h2>9. Thay đổi chính sách</h2>
          <p>
            Khi thay đổi cách xử lý dữ liệu, chúng tôi cập nhật trang này và ghi lại ngày cập nhật ở đầu trang. Xem thêm{" "}
            <Link href="/dieu-khoan">Điều khoản đặt phòng</Link>.
          </p>
          <p className="legal-basis">
            Căn cứ: Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15; Nghị định 356/2025/NĐ-CP quy định chi tiết Luật Bảo vệ dữ liệu cá
            nhân.
          </p>
        </div>
      </section>
    </>
  );
}
