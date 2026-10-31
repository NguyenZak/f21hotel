import type { Metadata } from "next";
import { breadcrumbJsonLd, JsonLd, pageMeta } from "@/lib/seo";
import { MapEmbed } from "@/components/MapEmbed";
import { Gallery } from "@/components/Gallery";
import { PageHero, SectionHead } from "@/components/ui";
import { CtaBand } from "@/components/CtaBand";
import { getSite } from "@/lib/cms";
import { distances, locationPhotos, nearby } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMeta(
    site,
    "/vi-tri",
    "Vị trí: An Khánh, gần Thiên đường Bảo Sơn, Mỹ Đình",
    `${site.name} ở khu biệt thự Hoa Phượng, An Khánh, cạnh Vinschool. Khoảng 5 phút tới Thiên đường Bảo Sơn, 15–20 phút tới SVĐ Mỹ Đình. Gần sân pickleball, phòng gym.`,
  );
}

export default async function LocationPage() {
  const site = await getSite();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(site, "/vi-tri", "Vị trí")} />
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
          {/* Có video đường vào (site.entranceVideo) thì hiện video; chưa có thì hiện album ảnh đường vào */}
          {site.entranceVideo ? (
            <div className="video-frame reveal">
              {site.entranceVideo.endsWith(".mp4") ? (
                <video src={site.entranceVideo} controls playsInline preload="metadata" />
              ) : (
                <iframe src={site.entranceVideo} title="Video đường vào F21 Hotel" loading="lazy" allowFullScreen />
              )}
            </div>
          ) : (
            <div className="reveal">
              <Gallery
                photos={locationPhotos}
                visible={1}
                badge={`${locationPhotos.length} ảnh`}
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>
          )}
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
        </div>
      </section>

      <CtaBand title="Đã biết đường, giờ giữ phòng thôi" />
    </>
  );
}
