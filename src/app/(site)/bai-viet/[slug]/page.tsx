import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/ui";
import { getPosts, getSite } from "@/lib/cms";
import { formatViDate } from "@/lib/dates";
import { readingMinutes, renderMarkdown } from "@/lib/markdown";
import { articleJsonLd, breadcrumbTrailJsonLd, faqJsonLd, JsonLd, postOgImages } from "@/lib/seo";
import { postTopicLabel } from "@/lib/site";

// Một bài cẩm nang. Mọi bài dựng sẵn lúc build; đường dẫn bài không có thì worker.ts trả 404 trước khi tới đây,
// vì dựng trang trên Workers Free vượt giới hạn CPU (Cache Components không cho dùng dynamicParams = false).

// Chưa có bài nào thì vẫn phải trả một mã (Cache Components báo lỗi build khi mảng rỗng); trang đó là 404
const NO_POSTS = "chua-co-bai-viet";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: NO_POSTS }];
}

const findPost = async (params: Promise<{ slug: string }>) => {
  const { slug } = await params;
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [post, site] = await Promise.all([findPost(params), getSite()]);
  if (!post) return { title: "Không tìm thấy bài viết", robots: { index: false } };
  const path = `/bai-viet/${post.slug}`;
  const og = postOgImages(post);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "vi_VN",
      siteName: site.name,
      url: path,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: og.images,
    },
    twitter: og.twitter,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [post, site, posts] = await Promise.all([findPost(params), getSite(), getPosts()]);
  if (!post) notFound();
  const path = `/bai-viet/${post.slug}`;
  const { html, headings } = renderMarkdown(post.body);
  const toc = headings.filter((h) => h.level === 2);
  // Bài liên quan: cùng chủ đề trước, rồi các bài mới nhất
  const related = posts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.topic === post.topic) - Number(a.topic === post.topic))
    .slice(0, 3);
  const topic = postTopicLabel(post.topic);

  return (
    <>
      <JsonLd data={articleJsonLd(site, post, path)} />
      <JsonLd data={breadcrumbTrailJsonLd(site, [["Cẩm nang", "/bai-viet"], [post.title, path]])} />
      {post.faqs.length ? <JsonLd data={faqJsonLd(post.faqs)} /> : null}
      <PageHero crumb={post.title} parent={{ href: "/bai-viet", label: "Cẩm nang" }} eyebrow={topic || "Cẩm nang"} title={post.title}>
        {post.excerpt}
      </PageHero>

      <section className="section tight">
        <div className="wrap post-layout">
          {toc.length >= 3 ? (
            <nav className="post-toc" aria-label="Mục lục">
              <b>Trong bài này</b>
              <ol>
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <article className="post">
            <p className="post-meta">
              {site.name} · Đăng {formatViDate(post.publishedAt)}
              {post.updatedAt.slice(0, 10) > post.publishedAt ? ` · Cập nhật ${formatViDate(post.updatedAt.slice(0, 10))}` : ""} ·{" "}
              {readingMinutes(post.body)} phút đọc
            </p>
            {post.cover ? (
              <figure className="post-cover">
                <Image src={post.cover.src} alt={post.cover.alt} width={post.cover.w} height={post.cover.h} sizes="(max-width: 900px) 100vw, 760px" priority />
              </figure>
            ) : null}
            <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />

            {post.faqs.length ? (
              <section className="post-faq" aria-labelledby="hoi-dap">
                <h2 id="hoi-dap">Câu hỏi thường gặp</h2>
                {post.faqs.map((f) => (
                  <details key={f.q}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </section>
            ) : null}

            <aside className="post-contact">
              <b>Cần giữ phòng?</b> Gọi <a href={site.telLink}>{site.phoneDisplay}</a> hoặc nhắn{" "}
              <a href={site.zaloLink} target="_blank" rel="noopener">
                Zalo
              </a>
              , hoặc <Link href="/dat-phong">đặt online</Link> để được giá trực tiếp. Địa chỉ: {site.address.full}.
            </aside>
          </article>

        </div>
      </section>

      {related.length ? (
        <section className="section tight cream">
          <div className="wrap">
            <h2 className="post-related__title">Đọc thêm</h2>
            <div className="post-grid">
              {related.map((p) => (
                <article className="post-card" key={p.slug}>
                  <Link href={`/bai-viet/${p.slug}`} className="post-card__link">
                    <span className="post-card__meta">{postTopicLabel(p.topic) || "Cẩm nang"}</span>
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand title="Ở gần, đi lại nhẹ nhàng">Phòng sạch, yên tĩnh trong khu biệt thự Hoa Phượng. Nghỉ giờ, qua đêm hoặc ngày đêm.</CtaBand>
    </>
  );
}
