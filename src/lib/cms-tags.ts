// Nhãn bộ nhớ đệm cho dữ liệu CMS, dùng chung giữa lớp đọc dữ liệu (cms.ts) và hook làm mới
// (payload/revalidate.ts). Để file riêng để cấu hình Payload không phải import cms.ts (tránh vòng import).
export const CMS_TAGS = {
  settings: "cms:settings",
  theme: "cms:theme",
  rooms: "cms:rooms",
  offers: "cms:offers",
  faqs: "cms:faqs",
  reviews: "cms:reviews",
  pages: "cms:pages",
} as const;
