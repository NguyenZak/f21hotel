import type { Metadata } from "next";
import { breadcrumbJsonLd, JsonLd, OG_IMAGES, pageMeta, roomsJsonLd } from "@/lib/seo";
import Link from "next/link";
import { Gallery } from "@/components/Gallery";
import { PageHero, RatingBadge, SectionHead } from "@/components/ui";
import { CtaBand } from "@/components/CtaBand";
import { cancelPolicy } from "@/lib/booking";
import { getBookingSettings, getPriceNotes, getRooms, getSite } from "@/lib/cms";
import { formatVnd, stayModes } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [site, rooms] = await Promise.all([getSite(), getRooms()]);
  const from = (key: "overnight" | "fullDay" | "hourly") => formatVnd(Math.min(...rooms.map((r) => r.prices[key])));
  return pageMeta(
    site,
    "/phong",
    `Phòng & bảng giá, qua đêm từ ${from("overnight")}`,
    `Bảng giá ${site.name}: ${rooms.map((r) => r.name).join(", ")}. Qua đêm từ ${from("overnight")}, ngày đêm từ ${from("fullDay")}, nghỉ giờ từ ${from("hourly")}.`,
    OG_IMAGES.rooms,
  );
}

export default async function RoomsPage() {
  const [rooms, priceNotes, site, booking] = await Promise.all([getRooms(), getPriceNotes(), getSite(), getBookingSettings()]);
  return (
    <>
      <JsonLd data={roomsJsonLd(site, rooms)} />
      <JsonLd data={breadcrumbJsonLd(site, "/phong", "Phòng & giá")} />
      <PageHero crumb="Phòng & giá" eyebrow="Phòng & bảng giá" title="Bốn hạng phòng, ba cách nghỉ">
        Nghỉ ngày đêm, qua đêm hoặc nghỉ giờ. Giá đã gồm 2 chai nước suối miễn phí trong phòng.
        {booking.directDiscount ? ` Đặt online trên website được giảm thêm ${booking.directDiscount}%.` : ""}
        <RatingBadge rating={site.rating} className="on-hero" />
      </PageHero>

      {/* Bảng giá */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Bảng giá" title="Giá phòng F21 Hotel">
            Đơn vị: đồng. Giờ phụ trội tính cho mỗi giờ ở thêm ngoài khung giờ của hình thức nghỉ.
          </SectionHead>

          <div className="price-table reveal">
            <table>
              <thead>
                <tr>
                  <th scope="col">Hạng phòng</th>
                  <th scope="col">
                    Nghỉ giờ<small>2 giờ đầu</small>
                  </th>
                  <th scope="col">
                    Qua đêm<small>19:00 – 10:00 hôm sau</small>
                  </th>
                  <th scope="col">
                    Ngày đêm<small>14:00 – 12:00 hôm sau</small>
                  </th>
                  <th scope="col">Giờ phụ trội</th>
                  <th scope="col">Số người</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.slug}>
                    <th scope="row">
                      <a href={`#${room.slug}`}>{room.name}</a>
                      <small>
                        {room.roomNumbers.length} phòng ({room.roomNumbers.join(", ")})
                      </small>
                    </th>
                    <td data-label="Nghỉ giờ (2 giờ đầu)">{formatVnd(room.prices.hourly)}</td>
                    <td data-label="Qua đêm (19:00 – 10:00)" className="hl">
                      {formatVnd(room.prices.overnight)}
                    </td>
                    <td data-label="Ngày đêm (14:00 – 12:00)">{formatVnd(room.prices.fullDay)}</td>
                    <td data-label="Giờ phụ trội">{formatVnd(room.prices.extraHour)}/giờ</td>
                    <td data-label="Số người">{room.guests} người</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="policy reveal-stagger" style={{ marginTop: 28 }}>
            <div>
              <h3>Giờ nhận & trả phòng</h3>
              <ul>
                {stayModes.map((m) => (
                  <li key={m.key}>
                    <b>{m.label}:</b> {m.time.toLowerCase()}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Đặt cọc & thay đổi</h3>
              <ul>
                <li>{priceNotes.deposit}</li>
                <li>{cancelPolicy(booking.freeCancelDays, priceNotes.refund)}</li>
                <li>Thêm người so với quy định: phụ thu {formatVnd(priceNotes.extraPerson)}/người.</li>
                {priceNotes.vat ? <li>{priceNotes.vat}</li> : null}
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

      {/* Chi tiết từng hạng phòng */}
      <section className="section cream" style={{ paddingTop: 24 }}>
        <div className="wrap">
          {rooms.map((room) => (
            <article className="room-detail" id={room.slug} key={room.slug} style={{ scrollMarginTop: 90 }}>
              <Gallery
                photos={room.photos}
                className="room-gallery reveal"
                leadSizes="(max-width: 900px) 100vw, 46vw"
                leadTransitionName={`room-${room.slug}`}
                sizes="(max-width: 900px) 50vw, 23vw"
              />
              <div className="room-info reveal">
                <span className="eyebrow">Tối đa {room.guests} người</span>
                <h2>{room.name}</h2>
                <p>{room.description}</p>
                {room.area || room.bed || room.view ? (
                  <ul className="room-facts">
                    {room.area ? <li>Diện tích {room.area} m²</li> : null}
                    {room.bed ? <li>{room.bed}</li> : null}
                    {room.view ? <li>{room.view}</li> : null}
                  </ul>
                ) : null}
                <dl className="spec-table">
                  {stayModes.map((m) => (
                    <div key={m.key}>
                      <dt>{m.label}</dt>
                      <dd>{formatVnd(room.prices[m.key])}</dd>
                    </div>
                  ))}
                  <div>
                    <dt>Giờ phụ trội</dt>
                    <dd>{formatVnd(room.prices.extraHour)}/giờ</dd>
                  </div>
                </dl>
                <ul className="amenities">
                  {room.amenities.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                  <li>
                    {room.roomNumbers.length} phòng: {room.roomNumbers.join(", ")}
                  </li>
                </ul>
                <div className="actions">
                  <div className="price">
                    <small>Qua đêm từ</small>
                    <strong>{formatVnd(room.prices.overnight)}</strong>
                  </div>
                  <Link className="btn" href={`/dat-phong?room=${room.slug}`}>
                    Đặt phòng này
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand title="Đi đông người? Hỏi giá đoàn">
        Lấy nhiều phòng hoặc ở dài ngày được giảm tới 15% tổng thanh toán. Lễ tân sẽ giữ các phòng gần nhau cho cả nhóm.
      </CtaBand>
    </>
  );
}
