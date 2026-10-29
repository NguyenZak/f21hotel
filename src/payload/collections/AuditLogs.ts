import type { CollectionConfig } from "payload";
import { isManager } from "../access";

// Nhật ký thao tác: chỉ ghi qua hook trong ../audit.ts, không ai sửa hay xoá được
export const AuditLogs: CollectionConfig = {
  slug: "audit-logs",
  labels: { singular: "Nhật ký", plural: "Nhật ký thao tác" },
  admin: {
    group: "Hệ thống",
    useAsTitle: "title",
    defaultColumns: ["createdAt", "user", "action", "target", "title"],
  },
  access: { read: isManager, create: () => false, update: () => false, delete: () => false },
  timestamps: true,
  fields: [
    { name: "user", label: "Người thực hiện", type: "relationship", relationTo: "users" },
    {
      name: "action",
      label: "Thao tác",
      type: "select",
      options: [
        { label: "Thêm mới", value: "create" },
        { label: "Sửa", value: "update" },
        { label: "Xoá", value: "delete" },
      ],
    },
    { name: "target", label: "Mục", type: "text" },
    { name: "docId", label: "Mã bản ghi", type: "text" },
    { name: "title", label: "Tên bản ghi", type: "text" },
  ],
};
