import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PageHero, Placeholder, SectionHead } from "@/components/ui";
import { formatVnd, priceNotes, rooms, site, stayModes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Phòng & bảng giá",
  description: `Bảng giá ${site.name}: Phòng Đơn, Đơn VIP, Phòng Đôi 3 và 4 người. Qua đêm từ ${formatVnd(site.priceFrom)}, ngày đêm từ 900.000đ, nghỉ giờ từ 300.000đ.`,
  alternates: { canonical: "/phong" },
};

export default function RoomsPage() {
  return (
    <>
      <PageHero crumb="Phòng & giá" eyebrow="Phòng & bảng giá" title="Bốn hạng phòng, ba cách nghỉ">
        Nghỉ ngày đêm, qua đêm hoặc nghỉ giờ. Giá đã gồm 2 chai nước suối miễn phí trong phòng.
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
                      <small>Phòng {room.roomNumbers.join(", ")}</small>
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
                <li>{priceNotes.refund}</li>
                <li>Thêm người so với quy định: phụ thu {formatVnd(priceNotes.extraPerson)}/người.</li>
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
              <div className="room-gallery reveal">
                <Placeholder label={`${room.name} · ảnh chính`} />
                <Placeholder label="Phòng tắm" />
                <Placeholder label="Góc phòng" />
              </div>
              <div className="room-info reveal">
                <span className="eyebrow">Tối đa {room.guests} người</span>
                <h2>{room.name}</h2>
                <p>{room.description}</p>
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
