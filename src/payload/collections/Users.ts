import type { CollectionConfig } from "payload";
import { isOwner, ownerOnlyField, ownerOrSelf, ROLES } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Tài khoản", plural: "Tài khoản" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "email", "role", "active"], group: "Hệ thống" },
  auth: true,
  access: {
    // Vào được trang quản trị: mọi tài khoản có vai trò và đang hoạt động
    admin: ({ req }) => Boolean(req.user && (req.user as { active?: boolean }).active !== false),
    read: ownerOrSelf,
    create: isOwner,
    update: ownerOrSelf,
    delete: isOwner,
  },
  hooks: {
    beforeChange: [
      // Tài khoản đầu tiên (tạo ở màn hình khởi tạo) luôn là Chủ
      async ({ data, operation, req }) => {
        if (operation === "create") {
          const { totalDocs } = await req.payload.count({ collection: "users", overrideAccess: true });
          if (totalDocs === 0) return { ...data, role: "owner", active: true };
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "name", label: "Họ tên", type: "text", required: true },
    {
      name: "role",
      label: "Vai trò",
      type: "select",
      required: true,
      defaultValue: "staff",
      options: ROLES.map((r) => ({ label: r.label, value: r.value })),
      access: { create: ownerOnlyField, update: ownerOnlyField },
      saveToJWT: true,
    },
    {
      name: "active",
      label: "Đang hoạt động",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Bỏ chọn để khoá tài khoản khi nhân viên nghỉ việc, không cần xoá." },
      access: { create: ownerOnlyField, update: ownerOnlyField },
      saveToJWT: true,
    },
  ],
};
