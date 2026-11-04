import type { MetadataRoute } from "next";
import { getPosts, getRooms, getSite } from "@/lib/cms";
import { locationPhotos, nav } from "@/lib/site";

// Kèm ảnh của từng trang để ảnh phòng, mặt tiền xuất hiện trên Google Hình ảnh
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, rooms, posts] = await Promise.all([getSite(), getRooms(), getPosts()]);
  const abs = (path: string) => new URL(path, site.url).toString();
  const images: Record<string, string[]> = {
    "/": ["/img/anh/mat-tien-ngay.webp", "/img/anh/mat-tien-dem.webp", "/img/anh/sanh-le-tan.webp"],
    "/phong": rooms.flatMap((r) => r.photos.map((p) => p.src)),
    "/vi-tri": locationPhotos.map((p) => p.src),
  };
  const pages = [{ href: "/" }, ...nav, { href: "/bai-viet" }, { href: "/dieu-khoan" }, { href: "/chinh-sach-bao-mat" }].map(({ href }) => ({
    url: abs(href),
    ...(images[href]?.length ? { images: [...new Set(images[href])].map(abs) } : {}),
  }));
  // Bài viết: ngày sửa gần nhất để Google và AI biết bài đã cập nhật
  const articles = posts.map((p) => ({
    url: abs(`/bai-viet/${p.slug}`),
    lastModified: p.updatedAt || p.publishedAt,
    ...(p.cover ? { images: [abs(p.cover.src)] } : {}),
  }));
  return [...pages, ...articles];
}
