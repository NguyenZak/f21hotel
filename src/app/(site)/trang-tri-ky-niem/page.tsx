import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { Gallery } from "@/components/Gallery";
import { IconZalo } from "@/components/Icons";
import { Faq, PageHero, SectionHead } from "@/components/ui";
import { getOffers, getRooms, getSite } from "@/lib/cms";
import { breadcrumbJsonLd, faqJsonLd, JsonLd, OG_IMAGES, pageMeta } from "@/lib/seo";
import { ANNIVERSARY_SLUG, anniversaryDefaults, anniversaryPhotos, formatVnd } from "@/lib/site";

// Gói trang trí phòng kỷ niệm cho cặp đôi. Tóm tắt, danh sách đồ trang trí và dòng "Giá: …" lấy từ
// CMS › Ưu đãi › "Trang trí phòng kỷ niệm" (db/migrations/0015_trang_tri_ky_niem.sql); ảnh trong anniversaryPhotos.

const PATH = "/trang-tri-ky-niem";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMeta(
    site,
    PATH,
    "Trang trí phòng kỷ niệm cho cặp đôi",
    `Phòng trang trí bóng bay, chữ LOVE phát sáng, hoa hồng cho ngày kỷ niệm, sinh nhật người yêu tại ${site.name}, khu biệt thự Hoa Phượng, An Khánh. Ảnh thật, nhắn Zalo nhận báo giá.`,
    OG_IMAGES.anniversary,
  );
}

// TODO: khách sạn xác nhận thời gian cần báo trước và việc đổi chữ, màu bóng
const faqs = [
  {
    q: "Trang trí phòng kỷ niệm ở F21 gồm những gì?",
    a: "Bóng bay đỏ, bạc phủ trần, chùm bóng tim ở đầu giường, chữ LOVE đèn LED, hoa hồng, cánh hoa rải giường và lịch để bàn ghi ngày kỷ niệm. Ảnh trên trang này chụp thật tại F21.",
  },
  {
    q: "Giá trang trí tính thế nào?",
    a: "Tiền trang trí tính riêng, cộng với tiền phòng theo bảng giá. Nhắn Zalo cho F21 ngày nhận phòng và hạng phòng để nhận báo giá.",
  },
  {
    q: "Cần đặt trước bao lâu?",
    a: "Nên nhắn càng sớm càng tốt để F21 chuẩn bị bóng và hoa. Lễ tân sẽ báo thời gian cần có khi bạn nhắn.",
  },
  {
    q: "Có đổi chữ hoặc màu bóng được không?",
    a: "Bạn nhắn yêu cầu qua Zalo (ví dụ chữ khác cho sinh nhật, màu bóng khác), lễ tân sẽ báo lại có làm được không.",
  },
  {
    q: "Nên chọn phòng nào để trang trí?",
    a: "Ảnh mẫu chụp ở Phòng Đơn VIP: giường đôi, bồn tắm sau vách kính, rộng hơn Phòng Đơn. Muốn trang trí ở hạng phòng khác, nhắn F21 để hỏi.",
  },
];

export default async function AnniversaryPage() {
  const [offers, rooms, site] = await Promise.all([getOffers(), getRooms(), getSite()]);
  const offer = offers.find((o) => o.slug === ANNIVERSARY_SLUG);
  const summary = offer?.summary || anniversaryDefaults.summary;
  const lines = offer?.details.length ? offer.details : anniversaryDefaults.details;
  // Dòng bắt đầu bằng "Giá" hiện riêng ở khung giá, các dòng còn lại là đồ trang trí trong gói
  const isPrice = (l: string) => /^giá(\s|:|$)/i.test(l.trim());
  const items = lines.filter((l) => !isPrice(l));
  const price = lines.find(isPrice)?.replace(/^giá\s*:?\s*/i, "") || "Nhắn Zalo để nhận báo giá";
  const vip = rooms.find((r) => r.slug === "don-vip");

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(site, PATH, "Trang trí kỷ niệm")} />
      <JsonLd data={faqJsonLd(faqs)} />
      <PageHero crumb="Trang trí kỷ niệm" eyebrow="Dành cho cặp đôi" title="Phòng trang trí cho ngày kỷ niệm">
        {summary}
      </PageHero>

      <section className="section">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <Gallery
            photos={anniversaryPhotos}
            visible={3}
            className="room-gallery reveal"
            leadSizes="(max-width: 900px) 100vw, 46vw"
            sizes="(max-width: 900px) 50vw, 23vw"
          />
          <div className="room-info reveal">
            <span className="eyebrow">Ảnh thật tại F21</span>
            <h2>Trong gói có gì</h2>
            <div className="tier">
              <ul>
                {items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <p>
              <strong>Giá trang trí:</strong> {price}.
              {vip?.prices.overnight ? (
                <>
                  {" "}
                  Tiền phòng tính riêng theo bảng giá, ví dụ{" "}
                  <Link href="/phong#don-vip">{vip.name}</Link> qua đêm từ {formatVnd(vip.prices.overnight)}.
                </>
              ) : null}
            </p>
            <div className="actions" style={{ justifyContent: "flex-start" }}>
              <a className="btn" href={site.zaloLink} target="_blank" rel="noopener">
                <IconZalo /> Nhắn Zalo đặt trang trí
              </a>
              <Link className="btn btn-ghost" href="/dat-phong?room=don-vip">
                Xem phòng trống
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section cream">
        <div className="wrap">
          <SectionHead eyebrow="Cách đặt" title="Ba bước, F21 lo phần trang trí" />
          <div className="policy reveal-stagger">
            <div>
              <h3>1. Chọn ngày và phòng</h3>
              <p>Đặt phòng trên website, gọi hotline hoặc nhắn Zalo. Ghi chú “trang trí kỷ niệm” khi đặt.</p>
            </div>
            <div>
              <h3>2. Nhắn F21 dịp của hai bạn</h3>
              <p>Kỷ niệm ngày yêu, sinh nhật hay cầu hôn, ngày cần hiện trên lịch và giờ dự kiến nhận phòng.</p>
            </div>
            <div>
              <h3>3. Nhận phòng đã trang trí</h3>
              <p>F21 trang trí xong trước giờ hai bạn tới. Bạn chỉ cần mở cửa.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Hỏi đáp" title="Trước khi đặt trang trí" />
          <Faq items={faqs} />
        </div>
      </section>

      <CtaBand title="Giữ phòng cho ngày kỷ niệm">
        Nhắn F21 ngày của hai bạn, lễ tân báo giá trang trí và giữ phòng.
      </CtaBand>
    </>
  );
}
