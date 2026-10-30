import { ValidationError, type CollectionBeforeChangeHook, type CollectionConfig, type Where } from "payload";
import { BOOKING_SOURCES, BOOKING_STATUSES, BLOCKING_STATUSES, newBookingCode } from "@/lib/booking";
import { fromDbDate, nightsBetween, toDbDate } from "@/lib/dates";
import { isManager, isStaff } from "../access";

// Đặt phòng: khách đặt trên website (qua server action, src/app/(site)/dat-phong/actions.ts)
// hoặc lễ tân nhập tay khi khách gọi điện, nhắn Zalo, đến trực tiếp, đặt qua OTA.

const dayOnly = { date: { pickerAppearance: "dayOnly" as const, displayFormat: "dd/MM/yyyy" } };

const STAY_OPTIONS = [
  { label: "Ngày đêm (14:00 – 12:00)", value: "fullDay" },
  { label: "Qua đêm (19:00 – 10:00)", value: "overnight" },
  { label: "Nghỉ giờ", value: "hourly" },
];

type Item = { roomType?: number | { id: number } | null; stayType?: string | null; quantity?: number | null; amount?: number | null; rooms?: (number | { id: number })[] | null };

const idOf = (v: number | { id: number } | null | undefined) => (v && typeof v === "object" ? v.id : v ?? undefined);

// Mã đặt phòng, số đêm, tổng tiền; kiểm tra ngày và phòng đã gán
const prepare: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  if (!data.code && !originalDoc?.code) data.code = newBookingCode();

  const checkIn = fromDbDate(data.checkIn ?? originalDoc?.checkIn);
  const checkOut = fromDbDate(data.checkOut ?? originalDoc?.checkOut);
  const items: Item[] = data.items ?? originalDoc?.items ?? [];
  const hourlyOnly = items.length > 0 && items.every((i) => i.stayType === "hourly");
  const nights = nightsBetween(checkIn, checkOut);
  if (!nights && !(hourlyOnly && checkIn === checkOut)) {
    throw new ValidationError({ errors: [{ path: "checkOut", message: "Ngày trả phòng phải sau ngày nhận phòng." }] });
  }
  data.nights = nights ?? 0;
  if (data.total === undefined || data.total === null) data.total = items.reduce((s, i) => s + (i.amount ?? 0), 0);

  // Phòng đã gán: đúng hạng phòng, không quá số lượng, không trùng với đặt phòng khác cùng thời gian
  const assigned = items.flatMap((i) => (i.rooms ?? []).map((r) => idOf(r)!));
  if (!assigned.length) return data;
  const status = data.status ?? originalDoc?.status;
  if (!BLOCKING_STATUSES.includes(status)) return data;

  const rooms = await req.payload.find({
    collection: "rooms",
    where: { id: { in: assigned } },
    depth: 0,
    limit: assigned.length,
    overrideAccess: true,
    req,
  });
  const roomById = new Map(rooms.docs.map((r) => [r.id, r]));
  items.forEach((item, idx) => {
    const ids = (item.rooms ?? []).map((r) => idOf(r)!);
    if (ids.length > (item.quantity ?? 0)) {
      throw new ValidationError({ errors: [{ path: `items.${idx}.rooms`, message: "Số phòng gán nhiều hơn số lượng đặt." }] });
    }
    for (const id of ids) {
      const room = roomById.get(id);
      if (room && idOf(room.roomType) !== idOf(item.roomType)) {
        throw new ValidationError({
          errors: [{ path: `items.${idx}.rooms`, message: `Phòng ${room.number} không thuộc hạng phòng đã chọn.` }],
        });
      }
    }
  });

  const clashes = await req.payload.find({
    collection: "bookings",
    where: {
      and: [
        { "items.rooms": { in: assigned } },
        { status: { in: BLOCKING_STATUSES } },
        { checkIn: { less_than: toDbDate(checkOut) } },
        { checkOut: { greater_than: toDbDate(checkIn) } },
        ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
      ],
    },
    depth: 0,
    limit: 10,
    overrideAccess: true,
    req,
  });
  for (const other of clashes.docs) {
    const taken = new Set((other.items ?? []).flatMap((i) => (i.rooms ?? []).map((r) => idOf(r))));
    const room = assigned.map((id) => roomById.get(id)).find((r) => r && taken.has(r.id));
    if (room) {
      throw new ValidationError({
        errors: [{ path: "items", message: `Phòng ${room.number} đã gán cho đặt phòng ${other.code} trong cùng thời gian.` }],
      });
    }
  }
  return data;
};

export const Bookings: CollectionConfig = {
  slug: "bookings",
  labels: { singular: "Đặt phòng", plural: "Đặt phòng" },
  admin: {
    group: "Đặt phòng",
    useAsTitle: "code",
    defaultColumns: ["code", "guestName", "phone", "checkIn", "checkOut", "status", "total", "source"],
    listSearchableFields: ["code", "guestName", "phone", "email"],
    description: "Đặt phòng từ website và do lễ tân nhập. Đặt phòng Chờ xác nhận và Đã xác nhận đều giữ phòng.",
  },
  defaultSort: "-createdAt",
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isManager },
  hooks: { beforeChange: [prepare] },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "code",
          label: "Mã đặt phòng",
          type: "text",
          unique: true,
          index: true,
          admin: { readOnly: true, description: "Tự tạo khi lưu." },
        },
        { name: "status", label: "Trạng thái", type: "select", required: true, defaultValue: "pending", options: [...BOOKING_STATUSES], index: true },
        { name: "source", label: "Kênh", type: "select", required: true, defaultValue: "phone", options: [...BOOKING_SOURCES] },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "checkIn", label: "Nhận phòng", type: "date", required: true, index: true, admin: dayOnly },
        { name: "checkOut", label: "Trả phòng", type: "date", required: true, index: true, admin: dayOnly },
        { name: "nights", label: "Số đêm", type: "number", admin: { readOnly: true } },
      ],
    },
    {
      name: "items",
      label: "Phòng đặt",
      type: "array",
      required: true,
      minRows: 1,
      labels: { singular: "Phòng", plural: "Phòng" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "roomType", label: "Hạng phòng", type: "relationship", relationTo: "room-types", required: true },
            { name: "stayType", label: "Hình thức", type: "select", required: true, defaultValue: "fullDay", options: STAY_OPTIONS },
            { name: "quantity", label: "Số phòng", type: "number", required: true, min: 1, defaultValue: 1 },
            { name: "amount", label: "Thành tiền (đồng)", type: "number", min: 0 },
          ],
        },
        {
          name: "rooms",
          label: "Phòng đã gán",
          type: "relationship",
          relationTo: "rooms",
          hasMany: true,
          admin: { description: "Lễ tân gán số phòng khi xác nhận hoặc khi khách đến." },
          // Chỉ hiện các phòng thuộc hạng phòng đã chọn
          filterOptions: ({ siblingData }): Where => {
            const type = idOf((siblingData as Item).roomType);
            return type ? { roomType: { equals: type }, active: { equals: true } } : { active: { equals: true } };
          },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Khách",
      fields: [
        {
          type: "row",
          fields: [
            { name: "guestName", label: "Họ tên", type: "text", required: true },
            { name: "phone", label: "Điện thoại / Zalo", type: "text", required: true, index: true },
            { name: "email", label: "Email", type: "email" },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "guests", label: "Số khách", type: "number", min: 1, defaultValue: 2 },
            { name: "arrivalTime", label: "Giờ đến dự kiến", type: "text" },
            { name: "promoCode", label: "Mã ưu đãi", type: "text" },
          ],
        },
        { name: "note", label: "Yêu cầu của khách", type: "textarea" },
      ],
    },
    {
      type: "collapsible",
      label: "Thanh toán",
      fields: [
        {
          type: "row",
          fields: [
            { name: "total", label: "Tổng tiền (đồng)", type: "number", min: 0, admin: { description: "Để trống thì cộng thành tiền các phòng." } },
            { name: "deposit", label: "Tiền cọc cần thu", type: "number", min: 0 },
            { name: "paid", label: "Đã thu", type: "number", min: 0, defaultValue: 0 },
          ],
        },
      ],
    },
    { name: "staffNote", label: "Ghi chú nội bộ", type: "textarea", admin: { description: "Khách không thấy ghi chú này." } },
    {
      name: "externalRef",
      label: "Mã đặt phòng bên OTA",
      type: "text",
      admin: { position: "sidebar", condition: (data) => Boolean(data?.source && !["website", "phone", "walk_in"].includes(data.source)) },
    },
  ],
};

// Giá theo ngày: tăng/giảm giá, ngừng bán, số đêm tối thiểu cho một khoảng ngày (lễ, Tết, cuối tuần, sự kiện Mỹ Đình)
export const RateRules: CollectionConfig = {
  slug: "rate-rules",
  labels: { singular: "Giá theo ngày", plural: "Giá theo ngày" },
  admin: {
    group: "Phòng & giá",
    useAsTitle: "name",
    defaultColumns: ["name", "from", "to", "adjust", "closed", "active"],
    description:
      "Áp dụng cho các đêm từ ngày bắt đầu đến ngày kết thúc. Nhiều quy tắc trùng một đêm thì cộng dồn phần trăm. Chỉ ảnh hưởng giá đặt online, không đổi bảng giá niêm yết.",
  },
  defaultSort: "from",
  access: { read: isStaff, create: isManager, update: isManager, delete: isManager },
  fields: [
    { name: "name", label: "Tên", type: "text", required: true, admin: { description: "Ví dụ: Tết 2027, Cuối tuần, Concert Mỹ Đình 14/12" } },
    {
      type: "row",
      fields: [
        { name: "from", label: "Từ đêm", type: "date", required: true, admin: dayOnly },
        { name: "to", label: "Đến hết đêm", type: "date", required: true, admin: dayOnly },
      ],
    },
    {
      name: "days",
      label: "Chỉ các đêm",
      type: "select",
      hasMany: true,
      admin: { description: "Để trống là mọi đêm. Ví dụ cuối tuần: chọn T6 và T7." },
      options: [
        { label: "T2", value: "1" },
        { label: "T3", value: "2" },
        { label: "T4", value: "3" },
        { label: "T5", value: "4" },
        { label: "T6", value: "5" },
        { label: "T7", value: "6" },
        { label: "CN", value: "0" },
      ],
    },
    {
      name: "roomTypes",
      label: "Hạng phòng",
      type: "relationship",
      relationTo: "room-types",
      hasMany: true,
      admin: { description: "Để trống là mọi hạng phòng." },
    },
    {
      type: "row",
      fields: [
        {
          name: "adjust",
          label: "Tăng/giảm giá (%)",
          type: "number",
          defaultValue: 0,
          min: -90,
          max: 300,
          admin: { description: "20 là tăng 20%, -10 là giảm 10%." },
        },
        { name: "minNights", label: "Ở tối thiểu (đêm)", type: "number", min: 1 },
      ],
    },
    {
      name: "closed",
      label: "Ngừng bán online",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Website báo hết phòng cho các đêm này; lễ tân vẫn nhận đặt qua điện thoại." },
    },
    { name: "active", label: "Đang áp dụng", type: "checkbox", defaultValue: true, admin: { position: "sidebar" } },
  ],
};
