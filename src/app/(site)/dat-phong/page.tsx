import type { Metadata } from "next";
import { breadcrumbJsonLd, JsonLd, OG_IMAGES, pageMeta } from "@/lib/seo";
import { BookingEngine, type EngineRoom } from "@/components/BookingEngine";
import { BookingForm } from "@/components/BookingForm";
import { IconClock, IconMail, IconPhone, IconPin, IconZalo } from "@/components/Icons";
import { PageHero, SectionHead } from "@/components/ui";
import { cancelPolicy } from "@/lib/booking";
import { getBookingSettings, getPriceNotes, getRooms, getSite, toFormContact, toRoomOptions } from "@/lib/cms";
import { directPerks, directionsUrl, formatVnd, stayModes } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMeta(
    site,
    "/dat-phong",
    "Đặt phòng trực tiếp & liên hệ",
    `Đặt phòng trực tiếp với ${site.name} ở An Khánh, gần Mỹ Đình: xem phòng trống và giá theo ngày, giữ phòng ngay, không cần thẻ. Hoặc gọi hotline ${site.phoneDisplay}, nhắn Zalo.`,
    OG_IMAGES.booking,
  );
}

export default async function BookingPage() {
  const [site, priceNotes, rooms, booking] = await Promise.all([getSite(), getPriceNotes(), getRooms(), getBookingSettings()]);
  const { telLink, zaloLink } = site;
  const engineRooms: EngineRoom[] = rooms.map((r) => ({
    slug: r.slug,
    name: r.name,
    short: r.short,
    guests: r.guests,
    amenities: r.amenities,
    photo: r.photos[0] ?? null,
    area: r.area,
    bed: r.bed,
  }));
  const refund = cancelPolicy(booking.freeCancelDays, priceNotes.refund);
  const contactAside = (
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
            <IconZalo />
            <span>
              <strong>Zalo {site.phoneDisplay}</strong>
              <br />
              Trả lời trong 15 phút, {site.replyHours}
            </span>
          </a>
          {site.email ? (
            <a href={`mailto:${site.email}`}>
              <IconMail />
              <span>{site.email}</span>
            </a>
          ) : null}
          <a href={directionsUrl(site.mapQuery)} target="_blank" rel="noopener">
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
  );
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(site, "/dat-phong", "Đặt phòng")} />
      {booking.enabled ? (
        <>
          {/* Tiêu đề gọn (be-hero) để trên điện thoại khách thấy ô chọn ngày ngay màn hình đầu */}
          <div className="be-hero">
            <PageHero crumb="Đặt phòng" eyebrow="Đặt phòng trực tiếp" title="Đặt phòng F21 Hotel">
              Xem phòng trống và giá theo ngày, giữ phòng ngay trên website. Không cần thẻ tín dụng.
            </PageHero>
          </div>

          <section className="section be-section">
            <div className="wrap">
              <BookingEngine
                rooms={engineRooms}
                contact={{ telLink, phoneDisplay: site.phoneDisplay, zaloLink }}
                policy={{ deposit: priceNotes.deposit, refund: priceNotes.refund }}
                maxRooms={booking.maxRooms}
                rating={site.rating}
              />
            </div>
          </section>

          <section className="section cream tight">
            <div className="wrap be-contact">{contactAside}</div>
          </section>
        </>
      ) : (
        <>
          <PageHero crumb="Đặt phòng" eyebrow="Đặt phòng trực tiếp" title="Giữ phòng tại F21 Hotel">
            Gửi yêu cầu, gọi hotline hoặc nhắn Zalo. Lễ tân xác nhận phòng trống và hướng dẫn đặt cọc.
          </PageHero>

          <section className="section">
            <div className="wrap form-layout">
              <BookingForm rooms={toRoomOptions(rooms)} contact={toFormContact(site)} />
              {contactAside}
            </div>
          </section>
        </>
      )}

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
                <li>{refund}</li>
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
