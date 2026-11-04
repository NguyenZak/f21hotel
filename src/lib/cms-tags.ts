// Nhãn bộ nhớ đệm cho dữ liệu CMS, dùng chung giữa lớp đọc dữ liệu (cms.ts) và hook làm mới
// (src/cms/server/api.ts). Để file riêng để API CMS không phải import cms.ts (cms.ts phụ thuộc Next.js).
export const CMS_TAGS = {
  settings: "cms:settings",
  theme: "cms:theme",
  rooms: "cms:rooms",
  offers: "cms:offers",
  faqs: "cms:faqs",
  reviews: "cms:reviews",
  pages: "cms:pages",
  posts: "cms:posts",
} as const;
