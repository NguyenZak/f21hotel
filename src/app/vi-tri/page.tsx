import type { Metadata } from "next";
import { IconPlay } from "@/components/Icons";
import { MapEmbed } from "@/components/MapEmbed";
import { CtaBand, PageHero, Placeholder, SectionHead } from "@/components/ui";
import { distances, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Vị trí & chỉ đường",
  description: `${site.name} ở khu biệt thự Hoa Phượng, An Khánh, cạnh Vinschool, gần cổng 1 Vinhomes Thăng Long. Cách SVĐ Mỹ Đình khoảng 15–20 phút.`,
  alternates: { canonical: "/vi-tri" },
};

// TODO: điền tên quán cụ thể sau khi khảo sát thực tế quanh khách sạn
const nearby = [
  {
    title: "Ăn uống",
    items: ["Quán ăn sáng, phở, bún trong khu Nam An Khánh", "Nhà hàng gia đình dọc Lê Trọng Tấn kéo dài", "Lễ tân gửi danh sách quán qua Zalo"],
  },
  {
    title: "Cà phê & tiện lợi",
    items: ["Cà phê trong khu đô thị Vinhomes Thăng Long", "Cửa hàng tiện lợi mở muộn", "Hiệu thuốc, ATM gần cổng khu"],
  },
  {
    title: "Đi tiếp",
    items: ["Sân vận động Mỹ Đình, Trung tâm Hội nghị Quốc gia", "Hoà Lạc, Ba Vì, Hoà Bình qua Đại lộ Thăng Long", "Taxi, xe công nghệ đón tận cửa"],
  },
];

export default function LocationPage() {
  return (
    <>
      <PageHero crumb="Vị trí" eyebrow="Vị trí & chỉ đường" title="Trong khu biệt thự Hoa Phượng, cạnh Vinschool">
        {site.address.full}
      </PageHero>

      <section className="section">
        <div className="wrap location">
          <div className="location-copy reveal">
            <span className="eyebrow">Chỉ đường</span>
            <h2>Nhớ một câu là tới</h2>
            <p className="directions">“{site.directions}”</p>
            <p style={{ color: "var(--muted)" }}>
              Từ đường Lê Trọng Tấn kéo dài, đi theo hướng cổng số 1 Vinhomes Thăng Long. Khi thấy Vinschool, rẽ vào khu
              biệt thự Hoa Phượng. Đường nội khu rộng, có đèn chiếu sáng buổi tối.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a className="btn" href={site.social.googleMaps} target="_blank" rel="noopener">
                Mở Google Maps
              </a>
            </div>
            <p className="fine">Đặt phòng xong, lễ tân sẽ gửi ghim vị trí chính xác qua Zalo.</p>
          </div>
          <div className="reveal">
            <MapEmbed />
          </div>
        </div>
      </section>

      <section className="section cream">
        <div className="wrap split">
          <div className="reveal">
            <SectionHead eyebrow="Khoảng cách" title="Từ F21 đi đâu, mất bao lâu" />
            <ul className="distances">
              {distances.map((d) => (
                <li key={d.place}>
                  <span>{d.place}</span>
                  <span>{d.time}</span>
                </li>
              ))}
            </ul>
            <p className="fine" style={{ marginTop: 14 }}>
              Thời gian đi ô tô hoặc xe máy lúc đường thông thoáng. Ngày có sự kiện ở Mỹ Đình nên đi sớm hơn 30 phút.
            </p>
          </div>
          {/* TODO: thay bằng video 30 giây quay đường từ Lê Trọng Tấn vào tới cửa, cả ban ngày và buổi tối */}
          <div className="video-ph reveal">
            <div className="ph" data-label="Video đường vào · cập nhật sau">
              <span className="play">
                <IconPlay />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Xung quanh" title="Gần khách sạn có gì" />
          <div className="nearby reveal-stagger">
            {nearby.map((n) => (
              <div key={n.title}>
                <h3>{n.title}</h3>
                <ul>
                  {n.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, aspectRatio: "21 / 6", borderRadius: 6, overflow: "hidden" }}>
            <Placeholder label="Ảnh lối vào buổi tối · cập nhật sau" />
          </div>
        </div>
      </section>

      <CtaBand title="Đã biết đường, giờ giữ phòng thôi" />
    </>
  );
}
