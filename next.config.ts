import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Ảnh đã được nén sẵn đúng kích thước trong /public/img
  images: { unoptimized: true },
  // Trang 404 chung cho đường dẫn không khớp trang nào (src/app/global-not-found.tsx): app có nhiều root layout
  experimental: { globalNotFound: true },
  // Cho phép mở `next dev` từ điện thoại cùng mạng Wi-Fi (http://192.168.x.x:3000).
  // Thiếu dòng này Next chặn file JS của bản dev, trang không chạy JS nên menu và các nút không bấm được.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  // CMS cũ (/admin) đã thay bằng CMS mới (/quan-tri)
  async redirects() {
    return [
      { source: "/admin", destination: "/quan-tri", permanent: true },
      { source: "/admin/:path*", destination: "/quan-tri", permanent: true },
    ];
  },
};

export default nextConfig;

// Cho phép đọc binding Cloudflare khi chạy `next dev`
initOpenNextCloudflareForDev();
