import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bản chạy trên VPS: gói gọn server + phần thư viện cần dùng vào .next/standalone (scripts/vps/deploy.sh)
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  // Next.js thu nhỏ ảnh theo màn hình (sharp trên VPS, lưu đệm ở .next/cache/images, deploy.sh giữ lại giữa các bản).
  // Ảnh Cloudinary là ảnh gốc từ máy ảnh (tới 5472px), điện thoại chỉ cần bản 400–800px.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
    minimumCacheTTL: 2592000,
  },
  // Trang 404 chung cho đường dẫn không khớp trang nào (src/app/global-not-found.tsx): app có nhiều root layout
  experimental: {
    globalNotFound: true,
    // Bớt số trang dựng song song khi build: VPS ít RAM
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
