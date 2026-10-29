import type { CollectionConfig } from "payload";
import { anyone, isManager } from "../access";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Ảnh", plural: "Thư viện ảnh" },
  admin: { group: "Nội dung" },
  access: { read: anyone, create: isManager, update: isManager, delete: isManager },
  fields: [
    {
      name: "alt",
      label: "Mô tả ảnh",
      type: "text",
      required: true,
      admin: { description: "Mô tả ngắn nội dung ảnh, dùng cho Google và người khiếm thị." },
    },
  ],
  upload: {
    mimeTypes: ["image/*"],
    // Chỉ dùng khi chưa cấu hình Cloudinary (máy dev)
    staticDir: "media-uploads",
    // Cloudflare Workers chưa hỗ trợ sharp nên tắt cắt ảnh và điểm lấy nét
    crop: false,
    focalPoint: false,
  },
};
