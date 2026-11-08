import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Ảnh đã được nén sẵn đúng kích thước trong /public/img
  images: { unoptimized: true },
  // Trang 404 chung cho đường dẫn không khớp trang nào (src/app/global-not-found.tsx): app có nhiều root layout
  experimental: {
    globalNotFound: true,
    // Build dựng trang từ D1 thật qua mạng, D1 thỉnh thoảng trả "internal error" khi nhiều trang hỏi cùng lúc:
    // thử lại trang lỗi và bớt số trang dựng song song thay vì hỏng cả bản build
    staticGenerationRetryCount: 3,
    staticGenerationMaxConcurrency: 4,
  },
  // Cho phép mở `next dev` từ điện thoại cùng mạng Wi-Fi (http://192.168.x.x:3000).
  // Thiếu dòng này Next chặn file JS của bản dev, trang không chạy JS nên menu và các nút không bấm được.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  // CMS cũ (/admin) đã thay bằng CMS mới (/quan-tri)
  async redirects() {
    return [
      { source: "/admin", destination: "/quan-tri", permanent: true },
      { source: "/admin/:path*", destination: "/quan-tri", permanent: true },
      // Trang Tiện ích xung quanh: /xung-quanh → /kham-pha (05/11/2026) → /tien-ich (08/11/2026, khớp mục "Tiện ích" trên menu).
      // Link cũ chuyển thẳng tới đường dẫn mới, không qua bước trung gian
      { source: "/xung-quanh", destination: "/tien-ich", permanent: true },
      { source: "/xung-quanh/:slug", destination: "/tien-ich/:slug", permanent: true },
      { source: "/kham-pha", destination: "/tien-ich", permanent: true },
      { source: "/kham-pha/:slug", destination: "/tien-ich/:slug", permanent: true },
    ];
  },
};

export default nextConfig;

// Cho phép đọc binding Cloudflare khi chạy `next dev`
initOpenNextCloudflareForDev();
