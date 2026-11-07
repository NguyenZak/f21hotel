import type { Metadata } from "next";
import { Render } from "@puckeditor/core/rsc";
import { renderConfig } from "@/blocks/config";
import { defaultAbout } from "@/blocks/home";
import { PageHero } from "@/components/ui";
import { getBlockMeta, getPageData, getSite } from "@/lib/cms";
import { breadcrumbJsonLd, JsonLd, OG_IMAGES, pageMeta } from "@/lib/seo";

// Trang Giới thiệu dựng bằng trình kéo thả: CMS › Nội dung › Trang › "gioi-thieu".
// Chưa xuất bản lần nào thì dùng defaultAbout trong src/blocks/home.ts. Phần đầu trang (breadcrumb) cố định ở đây.

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getPageData("gioi-thieu"), getSite()]);
  const description = (page?.data.root.props as { description?: string } | undefined)?.description;
  return pageMeta(
    site,
    "/gioi-thieu",
    "Giới thiệu khách sạn trong khu biệt thự Hoa Phượng",
    description ||
      `${site.name}: khách sạn kiến trúc tân cổ điển trong khu biệt thự Hoa Phượng, An Khánh, cạnh Vinschool. Yên tĩnh, dễ đỗ ô tô, gần Thiên đường Bảo Sơn và SVĐ Mỹ Đình.`,
    OG_IMAGES.home,
  );
}

export default async function AboutPage() {
  const [page, metadata, site] = await Promise.all([getPageData("gioi-thieu"), getBlockMeta(), getSite()]);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(site, "/gioi-thieu", "Giới thiệu")} />
      <PageHero crumb="Giới thiệu" eyebrow="Giới thiệu" title="Khách sạn trong khu biệt thự Hoa Phượng">
        {site.address.full}
      </PageHero>
      <Render config={renderConfig} data={page?.data ?? defaultAbout} metadata={metadata} />
    </>
  );
}
