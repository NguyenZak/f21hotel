// Khai báo các mục nội dung của CMS mới (dùng chung cho API và giao diện).
// Mỗi trường ứng với cách Payload đã lưu trong D1: cột của bảng chính, bảng mảng con ("<bảng>_<tên>",
// cột _order/_parent_id/id) hoặc bảng liên kết ("<bảng>_rels", cột path + "<đích>_id").
import { CMS_TAGS } from "@/lib/cms-tags";
import { fontChoices } from "@/lib/theme";
import type { Role } from "./server/http";

type Base = { name: string; label: string; help?: string; required?: boolean; half?: boolean };
export type Field =
  | (Base & { type: "text" | "textarea" | "number" | "money" | "date" | "email"; column: string; min?: number; max?: number })
  | (Base & { type: "bool"; column: string; default?: boolean })
  | (Base & { type: "select"; column: string; options: { value: string; label: string }[] })
  // Quan hệ một (cột <tên>_id), lựa chọn lấy từ một mục khác
  | (Base & { type: "ref"; column: string; to: string })
  // Mảng các dòng (bảng con); một cột thì hiện như danh sách chữ
  | (Base & { type: "rows"; table: string; columns: { column: string; label: string }[] })
  // Quan hệ nhiều (bảng _rels): tới một mục khác, hoặc tới ảnh trong Thư viện ảnh
  | (Base & { type: "refs"; relTable: string; path: string; relColumn: string; to: string })
  | (Base & { type: "media"; relTable: string; path: string; relColumn: string })
  // Chọn nhiều giá trị cố định (bảng <bảng>_<tên>: order, parent_id, value)
  | (Base & { type: "multi"; table: string; options: { value: string; label: string }[] })
  | { type: "section"; name: string; label: string; help?: string };

export type CollectionDef = {
  slug: string; // tên trong nhật ký và bảng liên kết của Payload
  path: string; // đường dẫn trong /quan-tri
  table: string;
  label: string;
  group: string;
  global?: boolean;
  titleField: string;
  listColumns?: string[];
  order?: string;
  // Ai được xem / sửa / xoá
  read: Role[];
  write: Role[];
  remove?: Role[];
  // Nhãn bộ nhớ đệm của website cần làm mới khi lưu
  tags: string[];
  intro?: string;
  fields: Field[];
};

const MANAGE: Role[] = ["owner", "manager"];
const ALL: Role[] = ["owner", "manager", "staff"];
const fonts = Object.entries(fontChoices).map(([value, f]) => ({ value, label: (f as { label: string }).label }));
const WEEKDAYS = [
  { value: "1", label: "T2" },
  { value: "2", label: "T3" },
  { value: "3", label: "T4" },
  { value: "4", label: "T5" },
  { value: "5", label: "T6" },
  { value: "6", label: "T7" },
  { value: "0", label: "CN" },
];
const slugHelp = "Chữ thường, không dấu, nối bằng gạch ngang. Ví dụ: don-vip";

export const COLLECTIONS: CollectionDef[] = [
  {
    slug: "room-types",
    path: "hang-phong",
    table: "room_types",
    label: "Hạng phòng",
    group: "Phòng & giá",
    titleField: "name",
    listColumns: ["name", "guests", "prices_overnight", "prices_full_day"],
    order: '"order", id',
    read: ALL,
    write: MANAGE,
    remove: ["owner"],
    tags: [CMS_TAGS.rooms],
    intro: "Giá, mô tả, tiện nghi và ảnh của từng hạng phòng. Đổi giá ở đây là website và đặt phòng online đổi theo.",
    fields: [
      { type: "text", name: "name", column: "name", label: "Tên hạng phòng", required: true, half: true },
      { type: "text", name: "slug", column: "slug", label: "Mã (dùng trong đường dẫn)", required: true, help: slugHelp, half: true },
      { type: "textarea", name: "short", column: "short", label: "Mô tả ngắn (thẻ phòng)", required: true },
      { type: "textarea", name: "description", column: "description", label: "Mô tả chi tiết", required: true },
      { type: "number", name: "guests", column: "guests", label: "Số người tối đa", required: true, min: 1, half: true },
      { type: "number", name: "order", column: "order", label: "Thứ tự hiển thị", half: true },
      { type: "number", name: "area", column: "area", label: "Diện tích (m²)", min: 1, half: true, help: "Hiện trên thẻ phòng. Để trống thì ẩn." },
      { type: "text", name: "bed", column: "bed", label: "Giường", half: true, help: "Ví dụ: 1 giường đôi 1m8, hoặc 2 giường 1m6" },
      { type: "text", name: "view", column: "view", label: "Cửa sổ / hướng nhìn", half: true, help: "Ví dụ: Cửa sổ lớn nhìn ra hàng cây khu biệt thự" },
      { type: "section", name: "s-prices", label: "Giá" },
      { type: "money", name: "hourly", column: "prices_hourly", label: "Nghỉ giờ (2 giờ đầu)", required: true, half: true },
      { type: "money", name: "extraHour", column: "prices_extra_hour", label: "Giờ phụ trội", required: true, half: true },
      { type: "money", name: "overnight", column: "prices_overnight", label: "Qua đêm (19:00 – 10:00)", required: true, half: true },
      { type: "money", name: "fullDay", column: "prices_full_day", label: "Ngày đêm (14:00 – 12:00)", required: true, half: true },
      { type: "rows", name: "amenities", table: "room_types_amenities", label: "Tiện nghi", columns: [{ column: "text", label: "Tiện nghi" }] },
      { type: "media", name: "photos", relTable: "room_types_rels", path: "photos", relColumn: "media_id", label: "Ảnh phòng", help: "Ảnh đầu tiên là ảnh đại diện. Kéo tay nắm ⠿ để đổi thứ tự." },
    ],
  },
  {
    slug: "rooms",
    path: "phong",
    table: "rooms",
    label: "Danh sách phòng",
    group: "Phòng & giá",
    titleField: "number",
    listColumns: ["number", "floor", "room_type_id", "active"],
    order: "number",
    read: ALL,
    write: MANAGE,
    remove: ["owner"],
    tags: [CMS_TAGS.rooms],
    intro: "19 phòng của khách sạn. Phòng tạm ngừng (đang sửa) thì bỏ chọn “Đang hoạt động” để không bán.",
    fields: [
      { type: "text", name: "number", column: "number", label: "Số phòng", required: true, half: true },
      { type: "number", name: "floor", column: "floor", label: "Tầng", required: true, half: true },
      { type: "ref", name: "roomType", column: "room_type_id", to: "room-types", label: "Hạng phòng", required: true },
      { type: "bool", name: "active", column: "active", label: "Đang hoạt động (bán được)", default: true },
      { type: "textarea", name: "note", column: "note", label: "Ghi chú" },
    ],
  },
  {
    slug: "rate-rules",
    path: "gia-theo-ngay",
    table: "rate_rules",
    label: "Giá theo ngày",
    group: "Phòng & giá",
    titleField: "name",
    listColumns: ["name", "from", "to", "adjust", "closed", "active"],
    order: '"from" desc',
    read: ALL,
    write: MANAGE,
    remove: MANAGE,
    tags: [],
    intro: "Tăng/giảm giá theo dịp (Tết, cuối tuần, sự kiện Mỹ Đình), yêu cầu ở tối thiểu, hoặc ngừng bán online.",
    fields: [
      { type: "text", name: "name", column: "name", label: "Tên", required: true, help: "Ví dụ: Tết 2027, Cuối tuần, Concert Mỹ Đình 14/12" },
      { type: "date", name: "from", column: "from", label: "Từ đêm", required: true, half: true },
      { type: "date", name: "to", column: "to", label: "Đến hết đêm", required: true, half: true },
      { type: "multi", name: "days", table: "rate_rules_days", options: WEEKDAYS, label: "Chỉ các đêm", help: "Để trống là mọi đêm trong khoảng." },
      { type: "refs", name: "roomTypes", relTable: "rate_rules_rels", path: "roomTypes", relColumn: "room_types_id", to: "room-types", label: "Hạng phòng", help: "Để trống là mọi hạng phòng." },
      { type: "number", name: "adjust", column: "adjust", label: "Tăng/giảm giá (%)", help: "Ví dụ 20 là tăng 20%, -10 là giảm 10%.", half: true },
      { type: "number", name: "minNights", column: "min_nights", label: "Ở tối thiểu (đêm)", min: 1, half: true },
      { type: "bool", name: "closed", column: "closed", label: "Ngừng bán online những đêm này" },
      { type: "bool", name: "active", column: "active", label: "Đang áp dụng", default: true },
    ],
  },
  {
    slug: "offers",
    path: "uu-dai",
    table: "offers",
    label: "Ưu đãi",
    group: "Website",
    titleField: "title",
    listColumns: ["title", "tag", "code", "featured", "active"],
    order: '"order", id',
    read: MANAGE,
    write: MANAGE,
    remove: MANAGE,
    tags: [CMS_TAGS.offers],
    fields: [
      { type: "text", name: "title", column: "title", label: "Tiêu đề", required: true },
      { type: "text", name: "slug", column: "slug", label: "Mã (dùng trong đường dẫn)", required: true, help: slugHelp, half: true },
      { type: "text", name: "tag", column: "tag", label: "Nhãn", required: true, half: true },
      { type: "textarea", name: "summary", column: "summary", label: "Tóm tắt", required: true },
      { type: "text", name: "when", column: "when", label: "Thời gian áp dụng", required: true, half: true },
      { type: "text", name: "code", column: "code", label: "Mã ưu đãi", half: true, help: "Khách nhập mã này khi đặt phòng. Để trống nếu không cần mã." },
      {
        type: "number",
        name: "discountPercent",
        column: "discount_percent",
        label: "Giảm khi nhập mã (%)",
        min: 0,
        max: 50,
        half: true,
        help: "Đặt online có mã này thì tự trừ vào tổng tiền. Để trống: không trừ, lễ tân áp dụng khi xác nhận.",
      },
      { type: "rows", name: "details", table: "offers_details", label: "Chi tiết", columns: [{ column: "text", label: "Dòng chi tiết" }] },
      { type: "number", name: "order", column: "order", label: "Thứ tự hiển thị", half: true },
      { type: "bool", name: "featured", column: "featured", label: "Nổi bật" },
      { type: "bool", name: "active", column: "active", label: "Đang hiển thị", default: true },
    ],
  },
  {
    slug: "reviews",
    path: "danh-gia",
    table: "reviews",
    label: "Đánh giá của khách",
    group: "Website",
    titleField: "name",
    listColumns: ["name", "rating", "source", "date", "published"],
    order: "created_at desc",
    read: MANAGE,
    write: MANAGE,
    remove: MANAGE,
    tags: [CMS_TAGS.reviews],
    intro: "Chỉ đăng đánh giá thật của khách (chép từ Google Maps, Agoda…). Bỏ chọn “Hiển thị” để ẩn.",
    fields: [
      { type: "text", name: "name", column: "name", label: "Tên khách", required: true, half: true },
      { type: "number", name: "rating", column: "rating", label: "Số sao (1–5)", required: true, min: 1, max: 5, half: true },
      { type: "textarea", name: "text", column: "text", label: "Nội dung", required: true },
      { type: "text", name: "source", column: "source", label: "Nguồn", required: true, help: "Ví dụ: Google Maps, Agoda", half: true },
      { type: "text", name: "date", column: "date", label: "Thời gian", required: true, help: "Ví dụ: 10/2026", half: true },
      { type: "bool", name: "published", column: "published", label: "Hiển thị trên website" },
    ],
  },
  {
    slug: "faqs",
    path: "hoi-dap",
    table: "faqs",
    label: "Hỏi đáp",
    group: "Website",
    titleField: "question",
    listColumns: ["question", "order"],
    order: '"order", id',
    read: MANAGE,
    write: MANAGE,
    remove: MANAGE,
    tags: [CMS_TAGS.faqs],
    fields: [
      { type: "text", name: "question", column: "question", label: "Câu hỏi", required: true },
      { type: "textarea", name: "answer", column: "answer", label: "Trả lời", required: true },
      { type: "number", name: "order", column: "order", label: "Thứ tự hiển thị" },
    ],
  },
  {
    slug: "site-settings",
    path: "thong-tin",
    table: "site_settings",
    label: "Thông tin khách sạn",
    group: "Cài đặt",
    global: true,
    titleField: "name",
    read: MANAGE,
    write: MANAGE,
    tags: [CMS_TAGS.settings],
    fields: [
      { type: "section", name: "s-general", label: "Chung" },
      { type: "text", name: "name", column: "name", label: "Tên khách sạn", required: true, half: true },
      { type: "text", name: "url", column: "url", label: "Địa chỉ website", required: true, half: true, help: "Ví dụ: https://f21hotel.com.vn" },
      { type: "text", name: "tagline", column: "tagline", label: "Câu định vị", required: true },
      { type: "textarea", name: "description", column: "description", label: "Mô tả ngắn (Google, chia sẻ mạng xã hội)", required: true },
      { type: "money", name: "priceFrom", column: "price_from", label: "Giá thấp nhất (qua đêm)", required: true, half: true },
      { type: "section", name: "s-rating", label: "Điểm đánh giá" },
      { type: "number", name: "ratingScore", column: "rating_score", label: "Điểm trung bình (thang 5)", min: 1, max: 5, half: true, help: "Chép đúng điểm trên Google Maps, ví dụ 4.8. Để trống thì website ẩn." },
      { type: "number", name: "ratingCount", column: "rating_count", label: "Số lượt đánh giá", min: 1, half: true },
      { type: "text", name: "ratingSource", column: "rating_source", label: "Nguồn", half: true, help: "Ví dụ: Google" },
      { type: "text", name: "ratingUrl", column: "rating_url", label: "Link trang đánh giá", half: true, help: "Khách bấm vào điểm để xem các đánh giá gốc" },
      { type: "section", name: "s-contact", label: "Liên hệ" },
      { type: "text", name: "phone", column: "phone", label: "Hotline (chỉ số)", required: true, half: true },
      { type: "text", name: "phoneDisplay", column: "phone_display", label: "Hotline (hiển thị)", required: true, half: true },
      { type: "text", name: "zalo", column: "zalo", label: "Số Zalo", required: true, half: true },
      { type: "text", name: "replyHours", column: "reply_hours", label: "Giờ lễ tân trực Zalo", half: true },
      { type: "text", name: "feedbackPhone", column: "feedback_phone", label: "Số phản ánh dịch vụ", half: true },
      { type: "text", name: "feedbackPhoneDisplay", column: "feedback_phone_display", label: "Số phản ánh (hiển thị)", half: true },
      { type: "email", name: "email", column: "email", label: "Email đặt phòng", help: "Để trống thì website ẩn email." },
      { type: "text", name: "facebook", column: "social_facebook", label: "Facebook", half: true, help: "Để trống thì ẩn." },
      { type: "text", name: "tiktok", column: "social_tiktok", label: "TikTok", half: true, help: "Để trống thì ẩn." },
      { type: "text", name: "googleMaps", column: "social_google_maps", label: "Link Google Maps" },
      { type: "section", name: "s-address", label: "Địa chỉ" },
      { type: "text", name: "street", column: "address_street", label: "Số nhà, đường, khu", required: true, half: true },
      { type: "text", name: "locality", column: "address_locality", label: "Phường/xã", required: true, half: true },
      { type: "text", name: "region", column: "address_region", label: "Tỉnh/thành", required: true, half: true },
      { type: "text", name: "full", column: "address_full", label: "Địa chỉ đầy đủ", required: true, half: true },
      { type: "textarea", name: "directions", column: "directions", label: "Câu chỉ đường", required: true },
      { type: "text", name: "mapQuery", column: "map_query", label: "Từ khoá bản đồ nhúng", half: true },
      { type: "text", name: "entranceVideo", column: "entrance_video", label: "Video đường vào (đường dẫn)", half: true },
      // Thông tin bắt buộc công bố trên website bán hàng (Luật TMĐT 122/2025 Điều 11). Hiện ở footer và trang Điều khoản
      { type: "section", name: "s-legal", label: "Doanh nghiệp & pháp lý" },
      { type: "text", name: "legalName", column: "legal_name", label: "Tên chủ sở hữu", half: true, help: "Tên công ty hoặc hộ kinh doanh đúng như trên giấy đăng ký. Để trống thì footer ẩn khối thông tin doanh nghiệp." },
      { type: "text", name: "taxCode", column: "tax_code", label: "Mã số thuế", half: true },
      { type: "text", name: "businessReg", column: "business_reg", label: "Giấy đăng ký kinh doanh", help: "Ví dụ: Số 0123456789 do Sở Tài chính Hà Nội cấp ngày 01/01/2025" },
      { type: "text", name: "moitUrl", column: "moit_url", label: "Link xác nhận Bộ Công Thương", help: "Link online.gov.vn nhận được sau khi thông báo website. Có link thì footer hiện dấu đã thông báo." },
      { type: "section", name: "s-policy", label: "Chính sách & giờ" },
      { type: "text", name: "checkIn", column: "check_in", label: "Nhận phòng (ngày đêm)", required: true, half: true },
      { type: "text", name: "checkOut", column: "check_out", label: "Trả phòng (ngày đêm)", required: true, half: true },
      { type: "money", name: "extraPerson", column: "price_notes_extra_person", label: "Phụ thu thêm người", half: true },
      { type: "text", name: "deposit", column: "price_notes_deposit", label: "Đặt cọc", half: true },
      { type: "text", name: "refund", column: "price_notes_refund", label: "Hoàn tiền", half: true },
      { type: "text", name: "water", column: "price_notes_water", label: "Đã gồm trong giá", half: true },
      { type: "text", name: "vat", column: "price_notes_vat", label: "Thuế VAT", half: true, help: "Ví dụ: Giá đã gồm VAT. Hiện dưới bảng giá; để trống thì ẩn." },
      {
        type: "rows",
        name: "longStay",
        table: "site_settings_price_notes_long_stay",
        label: "Giảm giá ở dài ngày",
        columns: [
          { column: "label", label: "Điều kiện" },
          { column: "discount", label: "Mức giảm" },
          { column: "min_nights", label: "Từ số đêm (tự trừ khi đặt online)" },
          { column: "percent", label: "Giảm (%)" },
        ],
      },
      { type: "section", name: "s-booking", label: "Đặt phòng online" },
      { type: "bool", name: "bookingEnabled", column: "booking_enabled", label: "Nhận đặt phòng trên website", default: true, help: "Tắt thì trang Đặt phòng chỉ hiện form gửi yêu cầu và hotline." },
      { type: "number", name: "depositPercent", column: "booking_deposit_percent", label: "Tiền cọc (% tổng tiền)", min: 0, max: 100, half: true },
      { type: "number", name: "maxRooms", column: "booking_max_rooms", label: "Số phòng tối đa mỗi lần đặt", min: 1, half: true },
      { type: "number", name: "maxNights", column: "booking_max_nights", label: "Số đêm tối đa", min: 1, half: true },
      {
        type: "number",
        name: "directDiscount",
        column: "booking_direct_discount",
        label: "Giảm giá đặt trực tiếp (%)",
        min: 0,
        max: 30,
        half: true,
        help: "Trừ vào mọi đặt phòng online, hiện giá gạch ngang trên website. Không cộng dồn: khách được mức giảm lớn nhất trong giảm trực tiếp, mã ưu đãi, ở dài ngày.",
      },
      {
        type: "number",
        name: "freeCancelDays",
        column: "booking_free_cancel_days",
        label: "Đổi/huỷ miễn phí trước (ngày)",
        min: 0,
        max: 30,
        half: true,
        help: "Ví dụ 3: huỷ trước ngày nhận phòng từ 3 ngày được hoàn cọc. Để 0 nếu không cho huỷ miễn phí.",
      },
      { type: "text", name: "bankId", column: "booking_bank_bank_id", label: "Ngân hàng nhận cọc (mã)", help: "Ví dụ: VCB, MB, TCB, BIDV, ACB", half: true },
      { type: "text", name: "accountNo", column: "booking_bank_account_no", label: "Số tài khoản", half: true },
      { type: "text", name: "accountName", column: "booking_bank_account_name", label: "Chủ tài khoản", help: "Viết hoa không dấu", half: true },
    ],
  },
  {
    slug: "theme-settings",
    path: "giao-dien",
    table: "theme_settings",
    label: "Giao diện",
    group: "Cài đặt",
    global: true,
    titleField: "fonts_heading",
    read: MANAGE,
    write: MANAGE,
    tags: [CMS_TAGS.theme],
    intro: "Font chữ của website theo từng vai trò.",
    fields: [
      { type: "select", name: "heading", column: "fonts_heading", label: "Tiêu đề", options: fonts, required: true, half: true },
      { type: "select", name: "hero", column: "fonts_hero", label: "Chữ trên ảnh lớn (hero)", options: fonts, required: true, half: true },
      { type: "select", name: "body", column: "fonts_body", label: "Nội dung", options: fonts, required: true, half: true },
      { type: "select", name: "ui", column: "fonts_ui", label: "Nút, menu, nhãn", options: fonts, required: true, half: true },
    ],
  },
];

export const collectionBySlug = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);
export const collectionByPath = (path: string) => COLLECTIONS.find((c) => c.path === path);
