import type { CollectionConfig } from "payload";
import { isManager, isOwner, isStaff } from "../access";
import { hiddenUnless } from "../admin/fields";

// Trang dựng bằng trình kéo thả (/editor/<id>). Bố cục lưu dạng JSON của Puck:
// `draft` là bản đang sửa, `data` là bản đang hiện trên website (chỉ đổi khi bấm Xuất bản).
export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "Trang", plural: "Trang" },
  admin: {
    group: "Website",
    hidden: hiddenUnless("owner", "manager"),
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "publishedAt", "updatedAt"],
    description: "Bấm vào một trang rồi chọn “Mở trình dựng trang” để kéo thả, sửa nội dung.",
  },
  access: { read: isStaff, create: isManager, update: isManager, delete: isOwner },
  fields: [
    {
      name: "editor",
      type: "ui",
      admin: { components: { Field: "/payload/components/OpenEditor#OpenEditor" } },
    },
    { name: "title", label: "Tên trang", type: "text", required: true },
    {
      name: "slug",
      label: "Mã trang",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "home = trang chủ. Chữ thường, không dấu, nối bằng gạch ngang." },
    },
    {
      name: "publishedAt",
      label: "Xuất bản lần cuối",
      type: "date",
      admin: { position: "sidebar", readOnly: true, date: { pickerAppearance: "dayAndTime" } },
    },
    // Hai trường JSON chỉ sửa qua trình dựng, ẩn khỏi form quản trị
    { name: "data", type: "json", admin: { hidden: true } },
    { name: "draft", type: "json", admin: { hidden: true } },
  ],
};
