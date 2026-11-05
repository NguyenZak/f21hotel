import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/CtaBand";
import { IconClock, IconPin } from "@/components/Icons";
import { PhotoCredit, PlaceMosaic } from "@/components/PlaceMosaic";
import { PageHero } from "@/components/ui";
import { getPlaces, getSite } from "@/lib/cms";
import { renderMarkdown } from "@/lib/markdown";
import { breadcrumbTrailJsonLd, JsonLd, OG_IMAGES, ogImageMeta } from "@/lib/seo";
import { placeCategory, placeIndexable } from "@/lib/site";

// Trang chi tiết một địa điểm xung quanh. Dựng sẵn lúc build như bài viết; mã không có thì worker.ts trả 404 trước khi tới đây.
// Trang chưa có giới thiệu chi tiết chỉ có vài dòng nên không cho Google lập chỉ mục (tránh trang mỏng); trang /xung-quanh vẫn lập chỉ mục.
const NO_PLACES = "chua-co-dia-diem";

export async function generateStaticParams() {
  const places = await getPlaces();
  return places.length ? places.map((p) => ({ slug: p.slug })) : [{ slug: NO_PLACES }];
}

const findPlace = async (params: Promise<{ slug: string }>) => {
  const { slug } = await params;
  return (await getPlaces()).find((p) => p.slug === slug) ?? null;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [place, site] = await Promise.all([findPlace(params), getSite()]);
  if (!place) return { title: "Không tìm thấy địa điểm", robots: { index: false } };
  const path = `/xung-quanh/${place.slug}`;
  const title = `${place.name}${place.time ? `: cách F21 ${place.time}` : ""}`;
  const description = [place.note, place.address, `Gần ${site.name}, khu biệt thự Hoa Phượng, An Khánh.`].filter(Boolean).join(". ").replace(/\.\./g, ".");
  const og = place.photo ? { images: [{ url: place.photo.src, width: place.photo.w, height: place.photo.h, alt: place.photo.alt }] } : ogImageMeta(OG_IMAGES.location);
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: placeIndexable(place) ? undefined : { index: false, follow: true },
    openGraph: { type: "website", locale: "vi_VN", siteName: site.name, url: path, title, description, images: og.images },
  };
}

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const [place, site, places] = await Promise.all([findPlace(params), getSite(), getPlaces()]);
  if (!place) notFound();
  const path = `/xung-quanh/${place.slug}`;
  const cat = placeCategory(place.category);
  const body = place.body.trim() ? renderMarkdown(place.body).html : "";
  const others = places.filter((p) => p.category === place.category && p.slug !== place.slug).slice(0, 5);
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(place.embed)}&z=16&hl=vi&output=embed`;

  return (
    <>
      <JsonLd data={breadcrumbTrailJsonLd(site, [["Xung quanh F21", "/xung-quanh"], [place.name, path]])} />
      <PageHero crumb={place.name} parent={{ href: "/xung-quanh", label: "Xung quanh F21" }} eyebrow={cat?.label ?? "Xung quanh F21"} title={place.name}>
        {place.note || undefined}
      </PageHero>

      <section className="section tight">
        <div className="wrap place-detail">
          <div className="place-detail__main">
            {place.photo ? (
              <figure className="place-detail__photo">
                <Image src={place.photo.src} alt={place.photo.alt} width={place.photo.w} height={place.photo.h} sizes="(max-width: 900px) 100vw, 55vw" priority />
                {place.credit ? (
                  <figcaption>
                    Ảnh: <PhotoCredit place={place} />
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
            <dl className="place-facts">
              {place.time ? (
                <div>
                  <dt>
                    <IconClock /> Đi từ F21
                  </dt>
                  <dd>{place.time}</dd>
                </div>
              ) : null}
              {place.address ? (
                <div>
                  <dt>
                    <IconPin /> Địa chỉ
                  </dt>
                  <dd>{place.address}</dd>
                </div>
              ) : null}
            </dl>
            {body ? <div className="post-body" dangerouslySetInnerHTML={{ __html: body }} /> : null}
            <div className="place-detail__actions">
              <a className="btn" href={place.href} target="_blank" rel="noopener">
                Chỉ đường trên Google Maps
              </a>
              <Link className="btn btn-ghost" href="/dat-phong">
                Đặt phòng F21
              </Link>
            </div>
            <p className="fine">
              Thời gian đi là ước lượng bằng ô tô hoặc xe máy lúc đường thông thoáng. Giờ mở cửa, giá có thể thay đổi: gọi trước cho chắc, hoặc nhắn lễ tân F21 qua{" "}
              <a href={site.zaloLink} target="_blank" rel="noopener">
                Zalo
              </a>{" "}
              để được hỏi giúp.
            </p>
          </div>
          <div className="map-frame place-detail__map">
            <iframe src={embed} title={`Bản đồ ${place.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        </div>
      </section>

      {others.length ? (
        <section className="section tight cream">
          <div className="wrap">
            <h2 className="places-group__title">{cat ? `${cat.label} khác quanh F21` : "Địa điểm khác quanh F21"}</h2>
            <PlaceMosaic places={others} />
            <div className="places-more">
              <Link className="link-arrow" href="/xung-quanh">
                Xem tất cả tiện ích xung quanh
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand title="Ở gần, đi chơi nhẹ nhàng">Phòng yên tĩnh trong khu biệt thự Hoa Phượng. Nghỉ giờ, qua đêm hoặc ngày đêm.</CtaBand>
    </>
  );
}
