// Giao diện các khối của trình dựng trang. Dùng chung cho trang thật (render trên server qua
// <Render> của Puck) và khung xem trước trong trình dựng (chạy ở trình duyệt), nên không có
// component async hay đọc dữ liệu ở đây: dữ liệu CMS đi vào qua `puck.metadata` (xem types.ts).
// Trường chỉnh sửa của từng khối nằm ở editor-config.tsx.
import Link from "next/link";
import type { PuckContext, SlotComponent } from "@puckeditor/core";
import type { ReactNode } from "react";
import { Gallery } from "@/components/Gallery";
import { HeroSearch } from "@/components/HeroSearch";
import { HeroSlider } from "@/components/HeroSlider";
import { LocationMap3D } from "@/components/LocationMap3D";
import { PlaceMosaic } from "@/components/PlaceMosaic";
import { CtaBandView, Faq, RatingBadge, RoomCard, SectionHead } from "@/components/ui";
import { isHtml, plainToHtml, sanitizeRichText } from "@/lib/richtext";
import { mapsUrl, type Photo } from "@/lib/site";
import { ICONS, type IconName } from "./icons";
import { photosOf, type BlockMeta, type PhotoItem } from "./types";

type P<T> = T & { puck: PuckContext };
const meta = (puck: PuckContext) => puck.metadata as BlockMeta;

type Head = { eyebrow?: string; title?: string; intro?: string; center?: boolean };
type Section = { anchor?: string; background?: string };

const sectionProps = ({ anchor, background }: Section, extra = "") => ({
  id: anchor || undefined,
  className: ["section", background, extra].filter(Boolean).join(" "),
});

function Head({ eyebrow = "", title = "", intro, center }: Head) {
  if (!eyebrow && !title && !intro) return null;
  return (
    <SectionHead eyebrow={eyebrow} title={title} center={center}>
      {intro || undefined}
    </SectionHead>
  );
}

// Ghi chú chỉ hiện trong trình dựng, ví dụ khi khối chưa có dữ liệu
function EditorNote({ puck, children }: { puck: PuckContext; children: ReactNode }) {
  if (!puck.isEditing) return null;
  return <p style={{ padding: 24, border: "1px dashed #c9a23f", borderRadius: 8, textAlign: "center" }}>{children}</p>;
}

// ---------- Khối theo mục của trang ----------

export type HeroProps = {
  heading: string;
  slides: (PhotoItem & {
    // Ảnh nhỏ hơn cho điện thoại, không bắt buộc
    photoMobile?: Photo;
    kicker: string;
    bold: string;
    light: string;
    sub: string;
    costValue: string;
    costLabel: string;
    costHref: string;
    bookLabel: string;
    bookHref: string;
  })[];
  search: boolean;
  tabs: { label: string; href: string }[];
};

export function HeroBlock({ heading, slides, search, tabs, puck }: P<HeroProps>) {
  const shown = (slides ?? [])
    .filter((s) => s.photo?.src)
    .map((s) => ({
      src: s.photo!.src,
      srcMobile: s.photoMobile?.src || s.photo!.src,
      alt: s.photo!.alt,
      kicker: s.kicker,
      bold: s.bold,
      light: s.light,
      sub: s.sub,
      cost: { value: s.costValue, label: s.costLabel, href: s.costHref },
      book: { label: s.bookLabel, href: s.bookHref },
    }));
  if (!shown.length) return <EditorNote puck={puck}>Hero: thêm ít nhất một slide có ảnh.</EditorNote>;
  return (
    <section className="hero">
      {/* h1 cố định của trang: luôn có đúng một h1 dù slider đang ở slide nào */}
      {heading ? <h1 className="sr-only">{heading}</h1> : null}
      <HeroSlider slides={shown} />
      <a className="hero-scroll" href={tabs?.[0]?.href || "#"} aria-label="Cuộn xuống">
        <span />
      </a>
      {search || tabs?.length ? (
        <div className="hero-bar">
          {search ? (
            <div className="hero-bar-start">
              {/* Điểm đánh giá Google (CMS › Thông tin khách sạn); chưa điền thì không hiện */}
              <RatingBadge rating={meta(puck).site.rating} className="on-hero" />
              <HeroSearch />
            </div>
          ) : null}
          {tabs?.length ? (
            <nav className="hero-tabs" aria-label="Đi tới mục">
              {tabs.map((t, i) => (
                <a key={t.href + i} href={t.href} className={i === 0 ? "active" : undefined}>
                  {t.label}
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export type IntroProps = Section & {
  // Khung bên trái: bản đồ 3D (mặc định) hoặc ảnh vòm
  media?: "map" | "photo";
  photos: PhotoItem[];
  badgeValue: string;
  badgeLabel: string;
  eyebrow: string;
  title: string;
  lead: string;
  text: string;
  points: { icon: IconName; title: string; text: string }[];
  linkLabel: string;
  linkHref: string;
};

export function IntroBlock(p: P<IntroProps>) {
  const photos = photosOf(p.photos);
  const href = p.linkHref || mapsUrl(meta(p.puck).site.mapQuery);
  return (
    <section {...sectionProps(p)}>
      <div className="wrap intro">
        <div className="intro-media reveal">
          {p.media === "photo" ? (
            photos.length ? (
              <Gallery
                photos={photos}
                slider
                className="arch"
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            ) : null
          ) : (
            <LocationMap3D>
              <MapFrame site={meta(p.puck).site} />
            </LocationMap3D>
          )}
          {p.badgeValue ? (
            <div className="badge">
              <strong>{p.badgeValue}</strong>
              <span>{p.badgeLabel}</span>
            </div>
          ) : null}
        </div>
        <div className="intro-copy reveal">
          {p.eyebrow ? <span className="eyebrow">{p.eyebrow}</span> : null}
          <h2>{p.title}</h2>
          {p.lead ? <p className="lead">{p.lead}</p> : null}
          {p.text ? <p>{p.text}</p> : null}
          {p.points?.length ? (
            <ul className="points">
              {p.points.map((pt, i) => {
                const Icon = ICONS[pt.icon] ?? ICONS.tree;
                return (
                  <li key={i}>
                    <span className="ic">
                      <Icon />
                    </span>
                    <div>
                      <b>{pt.title}</b>
                      <p>{pt.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}
          {p.linkLabel && href ? (
            <a className="link-arrow" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener">
              {p.linkLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export type RoomsProps = Section & Head & { buttonLabel: string };

export function RoomsBlock(p: P<RoomsProps>) {
  const { rooms } = meta(p.puck);
  return (
    <section {...sectionProps(p)}>
      <div className="wrap">
        <Head {...p} />
        <div className="rooms-grid reveal-stagger">
          {rooms.map((room) => (
            <RoomCard key={room.slug} room={room} />
          ))}
        </div>
        {p.buttonLabel ? (
          <div style={{ marginTop: 40, textAlign: "center" }}>
            <Link className="btn btn-ghost" href="/phong">
              {p.buttonLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export type PerksProps = Section &
  Head & { items: { title: string; text: string }[]; foot: string; buttonLabel: string; buttonHref: string };

export function PerksBlock(p: P<PerksProps>) {
  const { site } = meta(p.puck);
  return (
    <section {...sectionProps(p)}>
      <div className="wrap">
        <Head {...p} />
        <div className="perks reveal-stagger">
          {(p.items ?? []).map((perk, i) => (
            <div className="perk" key={i}>
              <span className="num gold-text">{String(i + 1).padStart(2, "0")}</span>
              <h3>{perk.title}</h3>
              <p>{perk.text}</p>
            </div>
          ))}
        </div>
        <div className="perks-foot">
          {/* {gio} trong ghi chú được thay bằng giờ trả lời trong Cài đặt website */}
          {p.foot ? <p>{p.foot.replace("{gio}", site.replyHours)}</p> : null}
          {p.buttonLabel ? (
            <Link className="btn btn-gold" href={p.buttonHref || "/dat-phong"}>
              {p.buttonLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export type GalleryProps = Section & Head & { photos: PhotoItem[] };

export function GalleryBlock(p: P<GalleryProps>) {
  const photos = photosOf(p.photos);
  return (
    <section {...sectionProps(p)}>
      <div className="wrap">
        <Head {...p} />
        {photos.length ? (
          <Gallery photos={photos} className="gallery reveal-stagger" sizes="(max-width: 700px) 50vw, 25vw" />
        ) : (
          <EditorNote puck={p.puck}>Thư viện ảnh: thêm ảnh ở bảng bên phải.</EditorNote>
        )}
      </div>
    </section>
  );
}

export type GuestsProps = Section &
  Head & { items: { icon: IconName; title: string; text: string; quote: string }[] };

export function GuestsBlock(p: P<GuestsProps>) {
  return (
    <section {...sectionProps(p)}>
      <div className="wrap">
        <Head {...p} />
        <div className="guests reveal-stagger">
          {(p.items ?? []).map((g, i) => {
            const Icon = ICONS[g.icon] ?? ICONS.heart;
            return (
              <article className="guest" key={i}>
                <span className="ic">
                  <Icon />
                </span>
                <h3>{g.title}</h3>
                <p>{g.text}</p>
                {g.quote ? <blockquote>“{g.quote}”</blockquote> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function MapFrame({ site }: { site: BlockMeta["site"] }) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=16&hl=vi&output=embed`;
  return (
    <div className="map-frame">
      <iframe
        src={src}
        title={`Bản đồ đường tới ${site.name}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

export type LocationProps = Section & {
  eyebrow: string;
  title: string;
  distances: { place: string; time: string }[];
  linkLabel: string;
  linkHref: string;
  /** "3d": bản đồ 3D động (mặc định, cả với trang đã lưu trước khi có lựa chọn này); "google": chỉ bản đồ Google */
  map?: "3d" | "google";
};

export function LocationBlock(p: P<LocationProps>) {
  const { site } = meta(p.puck);
  return (
    <section {...sectionProps(p)}>
      <div className="wrap location">
        <div className="location-copy reveal">
          {p.eyebrow ? <span className="eyebrow">{p.eyebrow}</span> : null}
          <h2>{p.title}</h2>
          <p className="directions">“{site.directions}”</p>
          {p.distances?.length ? (
            <ul className="distances">
              {p.distances.map((d, i) => (
                <li key={i}>
                  <span>{d.place}</span>
                  <span>{d.time}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {p.linkLabel ? (
            <div>
              <Link className="link-arrow" href={p.linkHref || "/vi-tri"}>
                {p.linkLabel}
              </Link>
            </div>
          ) : null}
        </div>
        <div className="reveal">
          {p.map === "google" ? (
            <MapFrame site={site} />
          ) : (
            <LocationMap3D distances={p.distances}>
              <MapFrame site={site} />
            </LocationMap3D>
          )}
        </div>
      </div>
    </section>
  );
}

export type NearbyProps = Section & Head & { category: string; limit: number; linkLabel: string; linkHref: string };

// Lưới ảnh một nhóm Tiện ích xung quanh (CMS › Tiện ích xung quanh). Nhóm chưa có địa điểm thì khối tự ẩn
export function NearbyBlock(p: P<NearbyProps>) {
  const places = (meta(p.puck).places ?? []).filter((x) => x.category === p.category).slice(0, p.limit || 5);
  if (!places.length)
    return <EditorNote puck={p.puck}>Tiện ích F21: nhóm này chưa có địa điểm nào được hiện trong CMS › Tiện ích xung quanh.</EditorNote>;
  return (
    <section {...sectionProps(p)}>
      <div className="wrap">
        <Head {...p} />
        <PlaceMosaic places={places} />
        {p.linkLabel ? (
          <div className="places-more">
            <Link className="link-arrow" href={p.linkHref || "/tien-ich"}>
              {p.linkLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export type OffersProps = Section & Head & { limit: number };

export function OffersBlock(p: P<OffersProps>) {
  const offers = meta(p.puck).offers.slice(0, p.limit || 3);
  return (
    <section {...sectionProps(p)}>
      <div className="wrap">
        <Head {...p} />
        <div className="offers reveal-stagger">
          {offers.map((offer) => (
            <article className={`offer${offer.featured ? " featured" : ""}`} key={offer.slug}>
              <span className="tag">{offer.tag}</span>
              <h3>{offer.title}</h3>
              <p>{offer.summary}</p>
              <p className="when">{offer.when}</p>
              {offer.code ? <span className="code">Mã: {offer.code}</span> : null}
              <Link className="link-arrow" href={`/uu-dai#${offer.slug}`}>
                Xem chi tiết
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export type ReviewsProps = Section & Head & { buttonLabel: string };

// Chỉ hiện khi CMS có đánh giá đã duyệt
export function ReviewsBlock(p: P<ReviewsProps>) {
  const { reviews, site } = meta(p.puck);
  if (!reviews.length)
    return <EditorNote puck={p.puck}>Đánh giá: khối này tự ẩn cho tới khi có đánh giá được duyệt trong CMS.</EditorNote>;
  return (
    <section {...sectionProps(p)}>
      <div className="wrap">
        <Head {...p} />
        <div className="reviews reveal-stagger">
          {reviews.map((r) => (
            <figure className="review" key={`${r.name}-${r.date}`}>
              <span className="review-stars" role="img" aria-label={`${r.rating} trên 5 sao`}>
                {"★".repeat(r.rating)}
                <span aria-hidden="true">{"★".repeat(5 - r.rating)}</span>
              </span>
              <blockquote>“{r.text}”</blockquote>
              <figcaption>
                <b>{r.name}</b> · {r.source}, {r.date}
              </figcaption>
            </figure>
          ))}
        </div>
        {p.buttonLabel && site.social.googleMaps ? (
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <a className="btn btn-ghost" href={site.social.googleMaps} target="_blank" rel="noopener">
              {p.buttonLabel}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export type FaqProps = Section & Head;

export function FaqBlock(p: P<FaqProps>) {
  return (
    <section {...sectionProps(p)}>
      <div className="wrap">
        <Head {...p} />
        <Faq items={meta(p.puck).faqs} />
      </div>
    </section>
  );
}

export type CtaProps = { eyebrow: string; title: string; text: string };

export function CtaBlock(p: P<CtaProps>) {
  return (
    <CtaBandView title={p.title} eyebrow={p.eyebrow || undefined} contact={meta(p.puck).site}>
      {p.text || undefined}
    </CtaBandView>
  );
}

// ---------- Khối cơ bản ----------

export type SectionBlockProps = Section & Head & { content: SlotComponent | unknown; narrow: boolean };

export function SectionBlock(p: P<SectionBlockProps>) {
  const Content = p.content as SlotComponent;
  return (
    <section {...sectionProps(p)}>
      <div className="wrap" style={p.narrow ? { maxWidth: 820 } : undefined}>
        <Head {...p} />
        <Content className="blocks-stack" />
      </div>
    </section>
  );
}

export type ColumnsProps = { left: SlotComponent | unknown; right: SlotComponent | unknown; ratio: string };

export function ColumnsBlock(p: P<ColumnsProps>) {
  const Left = p.left as SlotComponent;
  const Right = p.right as SlotComponent;
  return (
    <div className="blocks-columns" data-ratio={p.ratio || "1-1"}>
      <Left className="blocks-stack" />
      <Right className="blocks-stack" />
    </div>
  );
}

export type HeadingProps = { text: string; level: "h2" | "h3"; align: "left" | "center" };

export function HeadingBlock({ text, level, align }: P<HeadingProps>) {
  const Tag = level || "h2";
  return <Tag style={{ textAlign: align, margin: 0 }}>{text}</Tag>;
}

export type TextProps = { text: string | ReactNode; size: "" | "lead"; align: "left" | "center" };

// Nội dung soạn bằng trình rich text (HTML đã lọc thẻ, src/lib/richtext.ts).
// Trang cũ lưu chữ thường: mỗi đoạn cách nhau một dòng trống.
// Trong trình dựng, Puck truyền sẵn ô soạn thảo (ReactNode) để sửa trực tiếp trên trang.
export function TextBlock({ text, size, align }: P<TextProps>) {
  const className = `rt-body${size ? ` ${size}` : ""}`;
  if (typeof text !== "string") return <div className={className} style={{ textAlign: align }}>{text}</div>;
  const html = sanitizeRichText(isHtml(text) ? text : plainToHtml(text));
  return <div className={className} style={{ textAlign: align }} dangerouslySetInnerHTML={{ __html: html }} />;
}

export type ImageProps = PhotoItem & { caption: string; album: PhotoItem[] };

export function ImageBlock({ photo, caption, album, puck }: P<ImageProps>) {
  if (!photo?.src) return <EditorNote puck={puck}>Ảnh: chọn ảnh ở bảng bên phải.</EditorNote>;
  const photos: Photo[] = [photo, ...photosOf(album)];
  return (
    <figure style={{ margin: 0 }}>
      <Gallery photos={photos} visible={1} sizes="(max-width: 900px) 100vw, 60vw" />
      {caption ? <figcaption style={{ marginTop: 8, fontSize: 15, color: "var(--muted)" }}>{caption}</figcaption> : null}
    </figure>
  );
}

export type ButtonProps = { label: string; href: string; style: "btn" | "btn btn-gold" | "btn btn-ghost" | "link-arrow"; align: "left" | "center" };

export function ButtonBlock({ label, href, style, align }: P<ButtonProps>) {
  return (
    <div style={{ textAlign: align }}>
      <Link className={style || "btn"} href={href || "/dat-phong"}>
        {label}
      </Link>
    </div>
  );
}

export type SpacerProps = { size: number };

export function SpacerBlock({ size }: P<SpacerProps>) {
  return <div aria-hidden="true" style={{ height: size ?? 40 }} />;
}

export type RootProps = { title?: string; description?: string };

// Trang thật đã có <html>, header, footer từ layout; gốc chỉ trả về nội dung
export function RootBlock({ children }: P<RootProps & { children: ReactNode }>) {
  return <>{children}</>;
}
