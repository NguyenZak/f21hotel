import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/ui";
import { getPosts, getSite } from "@/lib/cms";
import { formatViDate } from "@/lib/dates";
import { breadcrumbJsonLd, JsonLd, OG_IMAGES, pageMeta } from "@/lib/seo";
import { postTopicLabel } from "@/lib/site";

// Cẩm nang: các bài viết đã đăng trong CMS › Bài viết. Dựng sẵn lúc build (bài mới lên sau khi bấm Xuất bản website).

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMeta(
    site,
    "/bai-viet",
    "Cẩm nang lưu trú quanh Mỹ Đình, An Khánh",
    `Kinh nghiệm đi concert, xem bóng đá ở SVĐ Mỹ Đình, chơi Thiên đường Bảo Sơn, nghỉ giờ và ở dài ngày quanh An Khánh, do ${site.name} tổng hợp.`,
    OG_IMAGES.location,
  );
}

export default async function PostsPage() {
  const [posts, site] = await Promise.all([getPosts(), getSite()]);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(site, "/bai-viet", "Cẩm nang")} />
      <PageHero crumb="Cẩm nang" eyebrow="Cẩm nang" title="Cẩm nang lưu trú">
        Đi lại, giờ giấc, chi phí khi đến Mỹ Đình, Bảo Sơn và An Khánh. Thông tin do lễ tân {site.name} tổng hợp và cập nhật.
      </PageHero>

      <section className="section">
        <div className="wrap">
          {posts.length ? (
            <div className="post-grid">
              {posts.map((post) => (
                <article className="post-card" key={post.slug}>
                  <Link href={`/bai-viet/${post.slug}`} className="post-card__link">
                    {post.cover ? (
                      <Image src={post.cover.src} alt={post.cover.alt} width={post.cover.w} height={post.cover.h} sizes="(max-width: 700px) 100vw, 33vw" />
                    ) : (
                      <span className="post-card__blank" aria-hidden="true" />
                    )}
                    <span className="post-card__meta">
                      {[postTopicLabel(post.topic), formatViDate(post.publishedAt)].filter(Boolean).join(" · ")}
                    </span>
                    <h2>{post.title}</h2>
                    <p>{post.excerpt}</p>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="post-empty">Bài viết đang được chuẩn bị. Cần hỏi gì, bạn gọi hoặc nhắn Zalo cho lễ tân {site.phoneDisplay}.</p>
          )}
        </div>
      </section>

      <CtaBand title="Cần phòng gần Mỹ Đình?">
        Gọi hoặc nhắn Zalo để giữ phòng trước các ngày có sự kiện. Đặt trực tiếp được giá tốt nhất.
      </CtaBand>
    </>
  );
}
