import type { MetadataRoute } from "next";
import { getRooms, getSite } from "@/lib/cms";
import { locationPhotos, nav } from "@/lib/site";

// Kèm ảnh của từng trang để ảnh phòng, mặt tiền xuất hiện trên Google Hình ảnh
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, rooms] = await Promise.all([getSite(), getRooms()]);
  const abs = (path: string) => new URL(path, site.url).toString();
  const images: Record<string, string[]> = {
    "/": ["/img/anh/mat-tien-ngay.webp", "/img/anh/mat-tien-dem.webp", "/img/anh/sanh-le-tan.webp"],
    "/phong": rooms.flatMap((r) => r.photos.map((p) => p.src)),
    "/vi-tri": locationPhotos.map((p) => p.src),
  };
  return [{ href: "/" }, ...nav].map(({ href }) => ({
    url: abs(href),
    ...(images[href]?.length ? { images: [...new Set(images[href])].map(abs) } : {}),
  }));
}
