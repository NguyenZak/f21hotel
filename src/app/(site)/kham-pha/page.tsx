import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PlaceMosaic } from "@/components/PlaceMosaic";
import { PageHero } from "@/components/ui";
import { getPlaces, getSite } from "@/lib/cms";
import { breadcrumbJsonLd, JsonLd, OG_IMAGES, pageMeta } from "@/lib/seo";
import { PLACE_CATEGORIES } from "@/lib/site";

// Tất cả Tiện ích xung quanh (CMS › Tiện ích xung quanh) theo nhóm; bấm một ô mở trang chi tiết

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMeta(
    site,
    "/kham-pha",
    "Ăn uống, vui chơi, thể thao quanh F21 An Khánh",
    `Quán ăn, cà phê, Thiên đường Bảo Sơn, sân pickleball, siêu thị, bệnh viện gần ${site.name} ở khu biệt thự Hoa Phượng, An Khánh. Có thời gian đi từ khách sạn.`,
    OG_IMAGES.location,
  );
}

export default async function NearbyPage() {
  const [site, places] = await Promise.all([getSite(), getPlaces()]);
  const groups = PLACE_CATEGORIES.map((c) => ({ ...c, places: places.filter((p) => p.category === c.value) })).filter((g) => g.places.length);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(site, "/kham-pha", "Xung quanh F21")} />
      <PageHero crumb="Xung quanh F21" eyebrow="Xung quanh F21" title="Ăn uống, vui chơi, thể thao quanh F21">
        Những chỗ gần khu biệt thự Hoa Phượng, An Khánh. Bấm vào từng địa điểm để xem địa chỉ, bản đồ và đường đi.
      </PageHero>

      <section className="section">
        <div className="wrap">
          {groups.map((g) => (
            <div className="places-group" key={g.value} id={g.value}>
              <h2 className="places-group__title">{g.label}</h2>
              <PlaceMosaic places={g.places} />
            </div>
          ))}
          <p className="fine places-more">
            Thời gian đi tính bằng ô tô hoặc xe máy lúc đường thông thoáng. Cần gợi ý thêm, nhắn lễ tân qua{" "}
            <a href={site.zaloLink} target="_blank" rel="noopener">
              Zalo
            </a>
            . Đường tới khách sạn xem ở trang <Link href="/vi-tri">Vị trí</Link>.
          </p>
        </div>
      </section>

      <CtaBand title="Ở gần, đi chơi nhẹ nhàng">Phòng yên tĩnh trong khu biệt thự Hoa Phượng. Nghỉ giờ, qua đêm hoặc ngày đêm.</CtaBand>
    </>
  );
}
