import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Ảnh đã được nén sẵn đúng kích thước trong /public/img
  images: { unoptimized: true },
};

export default nextConfig;

// Cho phép đọc binding Cloudflare khi chạy `next dev`
initOpenNextCloudflareForDev();
