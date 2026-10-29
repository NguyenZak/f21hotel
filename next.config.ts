import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Ảnh đã được nén sẵn đúng kích thước trong /public/img
  images: { unoptimized: true },
  // Cho phép mở `next dev` từ điện thoại cùng mạng Wi-Fi (http://192.168.x.x:3000).
  // Thiếu dòng này Next chặn file JS của bản dev, trang không chạy JS nên menu và các nút không bấm được.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
};

export default nextConfig;

// Cho phép đọc binding Cloudflare khi chạy `next dev`
initOpenNextCloudflareForDev();
