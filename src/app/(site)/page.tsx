import type { Metadata } from "next";
import { Render } from "@puckeditor/core/rsc";
import { renderConfig } from "@/blocks/config";
import { defaultHome } from "@/blocks/home";
import { getBlockMeta, getPageData, getSite } from "@/lib/cms";

// Trang chủ dựng bằng trình kéo thả: CMS › Nội dung › Trang › "home".
// Chưa xuất bản lần nào thì dùng bố cục mặc định trong src/blocks/home.ts.

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getPageData("home"), getSite()]);
  const description = (page?.data.root.props as { description?: string } | undefined)?.description;
  return {
    ...(description ? { description } : {}),
    alternates: { canonical: "/" },
    openGraph: { type: "website", locale: "vi_VN", siteName: site.name, url: "/" },
  };
}

export default async function HomePage() {
  const [page, metadata] = await Promise.all([getPageData("home"), getBlockMeta()]);
  return <Render config={renderConfig} data={page?.data ?? defaultHome} metadata={metadata} />;
}
