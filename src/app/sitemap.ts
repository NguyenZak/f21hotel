import type { MetadataRoute } from "next";
import { getPlaces, getPosts, getRooms, getSite } from "@/lib/cms";
import { locationPhotos, nav, placeIndexable } from "@/lib/site";

// Kèm ảnh của từng trang để ảnh phòng, mặt tiền xuất hiện trên Google Hình ảnh
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, rooms, posts, places] = await Promise.all([getSite(), getRooms(), getPosts(), getPlaces()]);
  const abs = (path: string) => new URL(path, site.url).toString();
  const images: Record<string, string[]> = {
    "/": ["/img/anh/mat-tien-ngay.webp", "/img/anh/mat-tien-dem.webp", "/img/anh/sanh-le-tan.webp"],
    "/phong": rooms.flatMap((r) => r.photos.map((p) => p.src)),
    "/vi-tri": locationPhotos.map((p) => p.src),
  };
  const pages = [{ href: "/" }, ...nav, { href: "/bai-viet" }, { href: "/kham-pha" }, { href: "/dieu-khoan" }, { href: "/chinh-sach-bao-mat" }].map(({ href }) => ({
    url: abs(href),
    ...(images[href]?.length ? { images: [...new Set(images[href])].map(abs) } : {}),
  }));
  // Bài viết: ngày sửa gần nhất để Google và AI biết bài đã cập nhật
  const articles = posts.map((p) => ({
    url: abs(`/bai-viet/${p.slug}`),
    lastModified: p.updatedAt || p.publishedAt,
    ...(p.cover ? { images: [abs(p.cover.src)] } : {}),
  }));
  // Tiện ích xung quanh: chỉ trang có giới thiệu chi tiết (trang khác để noindex)
  const nearby = places.filter(placeIndexable).map((p) => ({ url: abs(`/kham-pha/${p.slug}`), ...(p.photo ? { images: [abs(p.photo.src)] } : {}) }));
  return [...pages, ...articles, ...nearby];
}
