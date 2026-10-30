import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getSite } from "@/lib/cms";

// Địa chỉ tạm (*.workers.dev của Cloudflare, máy dev) chặn hết, tránh Google lập chỉ mục trùng với tên miền chính.
// Chỉ chặn theo danh sách này, không so với "Địa chỉ website" trong CMS: nhập sai ở CMS cũng không chặn nhầm tên miền thật.
const TEMP_HOST = /(\.workers\.dev|^localhost|^127\.0\.0\.1)(:\d+)?$/;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const [site, h] = await Promise.all([getSite(), headers()]);
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  if (TEMP_HOST.test(host)) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Trang quản trị, API của CMS và trang xác nhận đặt phòng (có thông tin cá nhân)
      disallow: ["/admin", "/api/", "/dat-phong/xac-nhan/"],
    },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: site.url,
  };
}
