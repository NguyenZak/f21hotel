import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { IconChat, IconClock, IconMail, IconPhone, IconPin } from "@/components/Icons";
import { PageHero, SectionHead } from "@/components/ui";
import { directPerks, formatVnd, priceNotes, site, stayModes, telLink, zaloLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Đặt phòng & liên hệ",
  description: `Gửi yêu cầu đặt phòng ${site.name}, gọi hotline ${site.phoneDisplay} hoặc nhắn Zalo.`,
  alternates: { canonical: "/dat-phong" },
};

export default function BookingPage() {
  return (
    <>
      <PageHero crumb="Đặt phòng" eyebrow="Đặt phòng trực tiếp" title="Giữ phòng tại F21 Hotel">
        Gửi yêu cầu, gọi hotline hoặc nhắn Zalo. Lễ tân xác nhận phòng trống và hướng dẫn đặt cọc.
      </PageHero>

      <section className="section">
        <div className="wrap form-layout">
          <BookingForm />

          <aside className="side-stack">
            <div className="side-card">
              <h3>Liên hệ nhanh</h3>
              <div className="contact-lines">
                <a href={telLink}>
                  <IconPhone />
                  <span>
                    <strong>{site.phoneDisplay}</strong>
                    <br />
                    Hotline lễ tân
                  </span>
                </a>
                <a href={zaloLink} target="_blank" rel="noopener">
                  <IconChat />
                  <span>
                    <strong>Zalo {site.phoneDisplay}</strong>
                    <br />
                    Trả lời trong 15 phút, {site.replyHours}
                  </span>
                </a>
                <a href={`mailto:${site.email}`}>
                  <IconMail />
                  <span>{site.email}</span>
                </a>
                <a href={site.social.googleMaps} target="_blank" rel="noopener">
                  <IconPin />
                  <span>
                    {site.address.full}
                    <br />
                    <em>{site.directions}</em>
                  </span>
                </a>
                <div>
                  <IconClock />
                  <span>
                    Ngày đêm: nhận {site.checkIn}, trả trước {site.checkOut}
                    <br />
                    Qua đêm: nhận sau 19:00, trả trước 10:00
                  </span>
                </div>
                <a href={`tel:${site.feedbackPhone}`}>
                  <IconPhone />
                  <span>Phản ánh dịch vụ: {site.feedbackPhoneDisplay}</span>
                </a>
              </div>
            </div>

            <div className="side-card dark on-dark">
              <h3>Đặt trực tiếp được thêm</h3>
              <ul>
                {directPerks.map((p) => (
                  <li key={p.title}>{p.title}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="section cream" id="chinh-sach" style={{ scrollMarginTop: 80 }}>
        <div className="wrap">
          <SectionHead eyebrow="Chính sách" title="Trước khi bạn đến" />
          <div className="policy reveal-stagger">
            <div>
              <h3>Nhận và trả phòng</h3>
              <ul>
                {stayModes.map((m) => (
                  <li key={m.key}>
                    <b>{m.label}:</b> {m.time.toLowerCase()}
                  </li>
                ))}
                <li>Mang CCCD hoặc hộ chiếu khi nhận phòng</li>
              </ul>
            </div>
            <div>
              <h3>Đặt cọc và thay đổi</h3>
              <ul>
                <li>{priceNotes.deposit}</li>
                <li>{priceNotes.refund}</li>
                <li>Thêm người so với quy định: phụ thu {formatVnd(priceNotes.extraPerson)}/người</li>
              </ul>
            </div>
            <div>
              <h3>Ở dài ngày</h3>
              <ul>
                {priceNotes.longStay.map((d) => (
                  <li key={d.label}>
                    {d.label}: <b>{d.discount.toLowerCase()}</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
