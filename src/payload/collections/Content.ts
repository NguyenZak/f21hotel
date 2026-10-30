import type { CollectionConfig } from "payload";
import { anyone, isManager, isStaff } from "../access";
import { hiddenUnless, moneyAdmin } from "../admin/fields";

// Nội dung hiển thị trên website. Chủ và Quản lý sửa được, Nhân viên chỉ xem.
const managedContent = { read: anyone, create: isManager, update: isManager, delete: isManager };

const slugField = {
  name: "slug",
  label: "Mã (dùng trong đường dẫn)",
  type: "text" as const,
  required: true,
  unique: true,
  index: true,
  admin: { description: "Chữ thường, không dấu, nối bằng gạch ngang. Ví dụ: don-vip" },
};

const orderField = {
  name: "order",
  label: "Thứ tự hiển thị",
  type: "number" as const,
  defaultValue: 0,
  admin: { position: "sidebar" as const },
};

export const RoomTypes: CollectionConfig = {
  slug: "room-types",
  labels: { singular: "Hạng phòng", plural: "Hạng phòng" },
  admin: { group: "Phòng & giá", useAsTitle: "name", defaultColumns: ["name", "guests", "prices.overnight", "order"] },
  defaultSort: "order",
  access: managedContent,
  fields: [
    { name: "name", label: "Tên hạng phòng", type: "text", required: true },
    slugField,
    { name: "short", label: "Mô tả ngắn (thẻ phòng)", type: "textarea", required: true },
    { name: "description", label: "Mô tả chi tiết", type: "textarea", required: true },
    { name: "guests", label: "Số người tối đa", type: "number", required: true, min: 1 },
    {
      name: "prices",
      label: "Giá (đồng)",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "hourly", label: "Nghỉ giờ (2 giờ đầu)", type: "number", required: true, min: 0, admin: moneyAdmin },
            { name: "overnight", label: "Qua đêm (19:00 – 10:00)", type: "number", required: true, min: 0, admin: moneyAdmin },
            { name: "fullDay", label: "Ngày đêm (14:00 – 12:00)", type: "number", required: true, min: 0, admin: moneyAdmin },
            { name: "extraHour", label: "Giờ phụ trội", type: "number", required: true, min: 0, admin: moneyAdmin },
          ],
        },
      ],
    },
    {
      name: "amenities",
      label: "Tiện nghi",
      type: "array",
      labels: { singular: "Tiện nghi", plural: "Tiện nghi" },
      fields: [{ name: "text", label: "Tiện nghi", type: "text", required: true }],
    },
    {
      name: "photos",
      label: "Ảnh (ảnh đầu tiên là ảnh chính)",
      type: "upload",
      relationTo: "media",
      hasMany: true,
    },
    orderField,
  ],
};

export const Rooms: CollectionConfig = {
  slug: "rooms",
  labels: { singular: "Phòng", plural: "Danh sách phòng" },
  admin: { group: "Phòng & giá", useAsTitle: "number", defaultColumns: ["number", "floor", "roomType", "active"] },
  defaultSort: "number",
  // Danh sách phòng chỉ dùng nội bộ (gán phòng cho booking), không công khai
  access: { read: isStaff, create: isManager, update: isManager, delete: isManager },
  fields: [
    { name: "number", label: "Số phòng", type: "text", required: true, unique: true },
    { name: "floor", label: "Tầng", type: "number", required: true },
    { name: "roomType", label: "Hạng phòng", type: "relationship", relationTo: "room-types", required: true },
    {
      name: "active",
      label: "Đang bán",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Bỏ chọn khi phòng sửa chữa hoặc tạm ngừng bán." },
    },
    { name: "note", label: "Ghi chú", type: "textarea" },
  ],
};

export const Offers: CollectionConfig = {
  slug: "offers",
  labels: { singular: "Ưu đãi", plural: "Ưu đãi" },
  admin: { group: "Website", hidden: hiddenUnless("owner", "manager"), useAsTitle: "title", defaultColumns: ["title", "tag", "when", "code", "active"] },
  defaultSort: "order",
  access: managedContent,
  fields: [
    { name: "title", label: "Tiêu đề", type: "text", required: true },
    slugField,
    { name: "tag", label: "Nhãn", type: "text", required: true },
    { name: "summary", label: "Tóm tắt", type: "textarea", required: true },
    { name: "when", label: "Thời gian áp dụng", type: "text", required: true },
    { name: "code", label: "Mã ưu đãi", type: "text" },
    {
      name: "details",
      label: "Chi tiết",
      type: "array",
      fields: [{ name: "text", label: "Dòng chi tiết", type: "text", required: true }],
    },
    { name: "featured", label: "Nổi bật", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "active", label: "Đang hiển thị", type: "checkbox", defaultValue: true, admin: { position: "sidebar" } },
    orderField,
  ],
};

export const Reviews: CollectionConfig = {
  slug: "reviews",
  labels: { singular: "Đánh giá", plural: "Đánh giá của khách" },
  admin: {
    group: "Website",
    hidden: hiddenUnless("owner", "manager"),
    useAsTitle: "name",
    defaultColumns: ["name", "rating", "source", "date", "published"],
    description: "Chỉ nhập đánh giá thật, chép từ Google Maps, Agoda, Booking… và ghi rõ nguồn.",
  },
  access: {
    // Khách xem website chỉ thấy đánh giá đã duyệt
    read: ({ req }) => (req.user ? true : { published: { equals: true } }),
    create: isManager,
    update: isManager,
    delete: isManager,
  },
  fields: [
    { name: "name", label: "Tên khách", type: "text", required: true },
    { name: "text", label: "Nội dung", type: "textarea", required: true },
    { name: "rating", label: "Số sao", type: "number", required: true, min: 1, max: 5, defaultValue: 5 },
    { name: "source", label: "Nguồn", type: "text", required: true, admin: { description: "Ví dụ: Google Maps, Agoda" } },
    { name: "date", label: "Thời gian", type: "text", required: true, admin: { description: "Ví dụ: 10/2026" } },
    { name: "published", label: "Hiển thị trên website", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
  ],
};

export const Faqs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: "Câu hỏi", plural: "Hỏi đáp" },
  admin: { group: "Website", hidden: hiddenUnless("owner", "manager"), useAsTitle: "question", defaultColumns: ["question", "order"] },
  defaultSort: "order",
  access: managedContent,
  fields: [
    { name: "question", label: "Câu hỏi", type: "text", required: true },
    { name: "answer", label: "Trả lời", type: "textarea", required: true },
    orderField,
  ],
};
