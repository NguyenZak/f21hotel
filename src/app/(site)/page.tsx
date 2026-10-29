import Link from "next/link";
import { IconBriefcase, IconCar, IconHeart, IconRings, IconTicket, IconTree, IconClock } from "@/components/Icons";
import { HeroSearch } from "@/components/HeroSearch";
import { Gallery } from "@/components/Gallery";
import { HeroSlider } from "@/components/HeroSlider";
import { CtaBand, Faq, RoomCard, SectionHead } from "@/components/ui";
import { MapEmbed } from "@/components/MapEmbed";
import { getFaqs, getOffers, getReviews, getRooms, getSite } from "@/lib/cms";
import { directPerks, distances, facadePhotos, gallery, heroSlides } from "@/lib/site";

const guestTypes = [
  {
    icon: IconRings,
    title: "Người thân dự cưới",
    text: "Họ hàng từ quê lên dự cưới, giỗ, tân gia của gia đình ở Vinhomes Thăng Long, Nam An Khánh.",
    quote: "Nhà chật, khách quê lên ăn cưới cứ để F21 lo chỗ ngủ.",
  },
  {
    icon: IconTicket,
    title: "Đi sự kiện Mỹ Đình",
    text: "Xem concert, bóng đá, esports, hội chợ ở Sân vận động Mỹ Đình và Trung tâm Hội nghị Quốc gia.",
    quote: "Khách sạn sát sân tăng giá ngày diễn. F21 vẫn giá như ngày thường.",
  },
  {
    icon: IconBriefcase,
    title: "Công tác dài ngày",
    text: "Nhân viên, kỹ sư, đội thi công làm việc dọc Đại lộ Thăng Long, Mỹ Đình, Lê Trọng Tấn.",
    quote: "Ở trên 30 ngày giảm 15% tổng thanh toán.",
  },
  {
    icon: IconHeart,
    title: "Nghỉ cuối tuần",
    text: "Cặp đôi, gia đình nội thành muốn đổi gió, hoặc dừng chân trước khi đi Ba Vì, Hoà Bình.",
    quote: "Staycation trong khu biệt thự, không cần đi xa.",
  },
];

export default async function HomePage() {
  const [site, rooms, offers, faqs, reviews] = await Promise.all([getSite(), getRooms(), getOffers(), getFaqs(), getReviews()]);
  return (
    <>
      <section className="hero">
        {/* h1 cố định của trang: luôn có đúng một h1 dù slider đang ở slide nào */}
        <h1 className="sr-only">
          {site.name}: khách sạn trong khu biệt thự Hoa Phượng, An Khánh, Hà Nội, gần Mỹ Đình
        </h1>
        {/* Ảnh, nội dung từng slide và nút chuyển slide */}
        <HeroSlider slides={heroSlides} />

        {/* Biểu tượng chuột: bấm để cuộn xuống phần giới thiệu */}
        <a className="hero-scroll" href="#tong-quan" aria-label="Cuộn xuống phần giới thiệu">
          <span />
        </a>

        <div className="hero-bar">
          <HeroSearch />
          <nav className="hero-tabs" aria-label="Đi tới mục">
            <a href="#tong-quan" className="active">
              Tổng quan
            </a>
            <a href="#phong">Phòng & giá</a>
            <a href="#uu-dai">Ưu đãi</a>
            <a href="#vi-tri">Vị trí</a>
          </nav>
        </div>
      </section>

      {/* Giới thiệu */}
      <section className="section" id="tong-quan">
        <div className="wrap intro">
          <div className="intro-media reveal">
            {/* Bấm ảnh mở album mặt tiền */}
            <Gallery
              photos={facadePhotos}
              visible={1}
              badge={`${facadePhotos.length} ảnh`}
              className="arch"
              sizes="(max-width: 900px) 100vw, 45vw"
            />
            <div className="badge">
              <strong>15–20′</strong>
              <span>tới SVĐ Mỹ Đình</span>
            </div>
          </div>
          <div className="intro-copy reveal">
            <span className="eyebrow">Về F21 Hotel</span>
            <h2>Một chỗ nghỉ yên tĩnh ở phía Tây Hà Nội</h2>
            <p className="lead">
              F21 nằm trong khu biệt thự Hoa Phượng, cạnh Vinschool, trên đường vào cổng 1 Vinhomes Thăng Long.
            </p>
            <p>
              Toà nhà kiến trúc tân cổ điển với cửa vòm và ban công sắt, giữa những con đường rộng nhiều cây xanh. Bạn có
              sự yên tĩnh mà khách sạn sát Mỹ Đình hiếm có, với mức giá của một khách sạn bình dân.
            </p>
            <ul className="points">
              <li>
                <span className="ic">
                  <IconTree />
                </span>
                <div>
                  <b>Yên tĩnh, nhiều cây</b>
                  <p>Đường nội khu rộng, ít xe qua lại, ngủ ngon cả sau đêm concert.</p>
                </div>
              </li>
              <li>
                <span className="ic">
                  <IconCar />
                </span>
                <div>
                  <b>Dễ đỗ ô tô</b>
                  <p>Đỗ xe ngay trước khách sạn, tiện cho gia đình và đoàn đi xe riêng.</p>
                </div>
              </li>
              <li>
                <span className="ic">
                  <IconClock />
                </span>
                <div>
                  <b>Gần Đại lộ Thăng Long</b>
                  <p>Đi Mỹ Đình, Hoà Lạc, Ba Vì, Hoà Bình hay vào nội thành đều thuận đường.</p>
                </div>
              </li>
            </ul>
            <a className="link-arrow" href={site.social.googleMaps} target="_blank" rel="noopener">
              Xem đánh giá thật trên Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Phòng */}
      <section className="section cream" id="phong">
        <div className="wrap">
          <SectionHead eyebrow="Phòng & giá" title="Chọn phòng theo chuyến đi của bạn">
            Từ phòng đơn cho chuyến công tác tới phòng 4 người cho cả nhà lên dự cưới. Nghỉ ngày đêm, qua đêm hoặc nghỉ
            giờ.
          </SectionHead>
          <div className="rooms-grid reveal-stagger">
            {rooms.map((room) => (
              <RoomCard key={room.slug} room={room} />
            ))}
          </div>
          <div style={{ marginTop: 40, textAlign: "center" }}>
            <Link className="btn btn-ghost" href="/phong">
              Xem bảng giá đầy đủ
            </Link>
          </div>
        </div>
      </section>

      {/* Quyền lợi đặt trực tiếp */}
      <section className="section dark on-dark">
        <div className="wrap">
          <SectionHead eyebrow="Đặt trực tiếp với F21" title="Cùng một giá, thêm ba quyền lợi">
            Giá trên website bằng giá niêm yết. Đặt qua điện thoại, Zalo hoặc website, bạn nhận thêm:
          </SectionHead>
          <div className="perks reveal-stagger">
            {directPerks.map((perk, i) => (
              <div className="perk" key={perk.title}>
                <span className="num gold-text">0{i + 1}</span>
                <h3>{perk.title}</h3>
                <p>{perk.text}</p>
              </div>
            ))}
          </div>
          <div className="perks-foot">
            <p>Lễ tân trả lời Zalo trong vòng 15 phút, từ {site.replyHours}.</p>
            <Link className="btn btn-gold" href="/dat-phong">
              Gửi yêu cầu đặt phòng
            </Link>
          </div>
        </div>
      </section>

      {/* Thư viện ảnh */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Không gian" title="Bên trong F21 Hotel">
            Sảnh lát đá cẩm thạch, phòng sàn gỗ, cửa sổ vòm nhìn ra hàng cây khu biệt thự.
          </SectionHead>
          <Gallery photos={gallery} className="gallery reveal-stagger" sizes="(max-width: 700px) 50vw, 25vw" />
        </div>
      </section>

      {/* Nhóm khách */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="F21 dành cho ai" title="Khi bạn cần ở phía Tây Hà Nội" center />
          <div className="guests reveal-stagger">
            {guestTypes.map(({ icon: Icon, title, text, quote }) => (
              <article className="guest" key={title}>
                <span className="ic">
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
                <blockquote>“{quote}”</blockquote>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Vị trí */}
      <section className="section cream" id="vi-tri">
        <div className="wrap location">
          <div className="location-copy reveal">
            <span className="eyebrow">Vị trí</span>
            <h2>Dễ tìm, nếu bạn nhớ một câu</h2>
            <p className="directions">“{site.directions}”</p>
            <ul className="distances">
              {distances.map((d) => (
                <li key={d.place}>
                  <span>{d.place}</span>
                  <span>{d.time}</span>
                </li>
              ))}
            </ul>
            <div>
              <Link className="link-arrow" href="/vi-tri">
                Xem chỉ đường chi tiết
              </Link>
            </div>
          </div>
          <div className="reveal">
            <MapEmbed />
          </div>
        </div>
      </section>

      {/* Ưu đãi */}
      <section className="section" id="uu-dai">
        <div className="wrap">
          <SectionHead eyebrow="Ưu đãi" title="Ưu đãi theo dịp">
            Nói mã ưu đãi khi nhắn Zalo, hoặc nhập vào form đặt phòng.
          </SectionHead>
          <div className="offers reveal-stagger">
            {offers.slice(0, 3).map((offer) => (
              <article className={`offer${offer.featured ? " featured" : ""}`} key={offer.slug}>
                <span className="tag">{offer.tag}</span>
                <h3>{offer.title}</h3>
                <p>{offer.summary}</p>
                <p className="when">{offer.when}</p>
                {offer.code ? <span className="code">Mã: {offer.code}</span> : null}
                <Link className="link-arrow" href={`/uu-dai#${offer.slug}`}>
                  Xem chi tiết
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Đánh giá: chỉ hiện khi CMS có đánh giá đã duyệt */}
      {reviews.length ? (
        <section className="section" id="danh-gia">
          <div className="wrap">
            <SectionHead eyebrow="Khách nói gì" title="Đánh giá từ khách đã ở" center />
            <div className="reviews reveal-stagger">
              {reviews.map((r) => (
                <figure className="review" key={`${r.name}-${r.date}`}>
                  <span className="review-stars" role="img" aria-label={`${r.rating} trên 5 sao`}>
                    {"★".repeat(r.rating)}
                    <span aria-hidden="true">{"★".repeat(5 - r.rating)}</span>
                  </span>
                  <blockquote>“{r.text}”</blockquote>
                  <figcaption>
                    <b>{r.name}</b> · {r.source}, {r.date}
                  </figcaption>
                </figure>
              ))}
            </div>
            <div style={{ marginTop: 32, textAlign: "center" }}>
              <a className="btn btn-ghost" href={site.social.googleMaps} target="_blank" rel="noopener">
                Xem tất cả đánh giá trên Google Maps
              </a>
            </div>
          </div>
        </section>
      ) : null}

      {/* Câu hỏi thường gặp */}
      <section className="section cream">
        <div className="wrap">
          <SectionHead eyebrow="Hỏi đáp" title="Câu hỏi thường gặp" center />
          <Faq items={faqs} />
        </div>
      </section>

      <CtaBand title="Giữ phòng cho chuyến đi sắp tới">
        Gửi ngày đến, ngày đi và số khách. Lễ tân F21 sẽ gọi lại hoặc nhắn Zalo xác nhận phòng.
      </CtaBand>
    </>
  );
}
