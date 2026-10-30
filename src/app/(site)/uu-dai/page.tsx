import type { Metadata } from "next";
import { breadcrumbJsonLd, JsonLd, pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageHero, SectionHead } from "@/components/ui";
import { CtaBand } from "@/components/CtaBand";
import { getOffers, getSite } from "@/lib/cms";
import { directPerks } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMeta(
    site,
    "/uu-dai",
    "Ưu đãi đặt phòng trực tiếp, sự kiện Mỹ Đình",
    `Ưu đãi đặt phòng trực tiếp tại ${site.name}: sự kiện Mỹ Đình, mùa cưới, giá doanh nghiệp, Noel và tất niên.`,
  );
}

export default async function OffersPage() {
  const [offers, site] = await Promise.all([getOffers(), getSite()]);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(site, "/uu-dai", "Ưu đãi")} />
      <PageHero crumb="Ưu đãi" eyebrow="Ưu đãi" title="Ưu đãi theo dịp">
        Nhắn mã ưu đãi qua Zalo hoặc nhập vào form đặt phòng. Mỗi đặt phòng áp dụng một mã, tuỳ phòng trống.
      </PageHero>

      <section className="section">
        <div className="wrap">
          {offers.map((offer) => (
            <article className="offer-row reveal" id={offer.slug} key={offer.slug} style={{ scrollMarginTop: 90 }}>
              <div className="date">
                {offer.when}
                <small>{offer.tag}</small>
              </div>
              <div className="content">
                <h2 style={{ fontSize: "clamp(26px, 3vw, 34px)" }}>{offer.title}</h2>
                <p style={{ color: "var(--muted)" }}>{offer.summary}</p>
                <ul>
                  {offer.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                {offer.code ? (
                  <span className="code">Mã: {offer.code}</span>
                ) : null}
              </div>
              <Link
                className="btn"
                href={offer.code ? `/dat-phong?code=${offer.code}` : "/doan-doanh-nghiep"}
              >
                {offer.code ? "Dùng ưu đãi" : "Xin báo giá"}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section cream">
        <div className="wrap">
          <SectionHead eyebrow="Luôn áp dụng" title="Quyền lợi khi đặt trực tiếp">
            Không cần mã. Áp dụng cho mọi đặt phòng qua điện thoại, Zalo hoặc website.
          </SectionHead>
          <div className="policy reveal-stagger">
            {directPerks.map((perk) => (
              <div key={perk.title}>
                <h3>{perk.title}</h3>
                <p>{perk.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Có dịp riêng cần giữ phòng?">
        Sinh nhật, kỷ niệm, họp lớp hay đội bóng đi đá giải. Nhắn F21 để được báo giá theo nhóm.
      </CtaBand>
    </>
  );
}
