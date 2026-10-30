import type { GlobalConfig } from "payload";
import { fontChoices } from "@/lib/theme";
import { anyone, isManager } from "../access";

const access = { read: anyone, update: isManager };

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Thông tin khách sạn",
  admin: { group: "Cài đặt" },
  access,
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Chung",
          fields: [
            { name: "name", label: "Tên khách sạn", type: "text", required: true },
            { name: "tagline", label: "Câu định vị", type: "text", required: true },
            { name: "description", label: "Mô tả ngắn (Google, chia sẻ mạng xã hội)", type: "textarea", required: true },
            { name: "url", label: "Địa chỉ website", type: "text", required: true },
            { name: "priceFrom", label: "Giá thấp nhất (qua đêm, đồng)", type: "number", required: true },
          ],
        },
        {
          label: "Liên hệ",
          fields: [
            {
              type: "row",
              fields: [
                { name: "phone", label: "Hotline (chỉ số)", type: "text", required: true },
                { name: "phoneDisplay", label: "Hotline (hiển thị)", type: "text", required: true },
              ],
            },
            { name: "zalo", label: "Số Zalo", type: "text", required: true },
            {
              type: "row",
              fields: [
                { name: "feedbackPhone", label: "Số phản ánh dịch vụ", type: "text" },
                { name: "feedbackPhoneDisplay", label: "Số phản ánh (hiển thị)", type: "text" },
              ],
            },
            { name: "email", label: "Email đặt phòng", type: "email", admin: { description: "Để trống thì website ẩn email." } },
            { name: "replyHours", label: "Giờ lễ tân trực Zalo", type: "text" },
            {
              name: "social",
              label: "Mạng xã hội và bản đồ",
              type: "group",
              admin: { description: "Để trống mục nào thì website ẩn mục đó." },
              fields: [
                { name: "facebook", label: "Facebook", type: "text" },
                { name: "tiktok", label: "TikTok", type: "text" },
                { name: "googleMaps", label: "Link Google Maps", type: "text" },
              ],
            },
          ],
        },
        {
          label: "Địa chỉ",
          fields: [
            {
              name: "address",
              label: "Địa chỉ",
              type: "group",
              fields: [
                { name: "street", label: "Số nhà, đường, khu", type: "text", required: true },
                { name: "locality", label: "Phường/xã", type: "text", required: true },
                { name: "region", label: "Tỉnh/thành", type: "text", required: true },
                { name: "full", label: "Địa chỉ đầy đủ", type: "text", required: true },
              ],
            },
            { name: "directions", label: "Câu chỉ đường", type: "textarea", required: true },
            { name: "mapQuery", label: "Từ khoá bản đồ nhúng", type: "text" },
            { name: "entranceVideo", label: "Video đường vào (đường dẫn)", type: "text" },
          ],
        },
        {
          label: "Chính sách & giờ",
          fields: [
            {
              type: "row",
              fields: [
                { name: "checkIn", label: "Nhận phòng (ngày đêm)", type: "text", required: true },
                { name: "checkOut", label: "Trả phòng (ngày đêm)", type: "text", required: true },
              ],
            },
            {
              name: "priceNotes",
              label: "Ghi chú bảng giá",
              type: "group",
              fields: [
                { name: "extraPerson", label: "Phụ thu thêm người (đồng)", type: "number" },
                { name: "deposit", label: "Đặt cọc", type: "text" },
                { name: "refund", label: "Hoàn tiền", type: "text" },
                { name: "water", label: "Đã gồm trong giá", type: "text" },
                {
                  name: "longStay",
                  label: "Giảm giá ở dài ngày",
                  type: "array",
                  fields: [
                    {
                      type: "row",
                      fields: [
                        { name: "label", label: "Điều kiện", type: "text", required: true },
                        { name: "discount", label: "Mức giảm", type: "text", required: true },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Đặt phòng online",
          fields: [
            {
              name: "booking",
              label: false,
              type: "group",
              fields: [
                {
                  name: "enabled",
                  label: "Nhận đặt phòng trên website",
                  type: "checkbox",
                  defaultValue: true,
                  admin: { description: "Tắt thì trang Đặt phòng chỉ hiện form gửi yêu cầu và số hotline." },
                },
                {
                  type: "row",
                  fields: [
                    { name: "depositPercent", label: "Tiền cọc (% tổng tiền)", type: "number", min: 0, max: 100, defaultValue: 50 },
                    { name: "maxRooms", label: "Số phòng tối đa mỗi lần đặt", type: "number", min: 1, defaultValue: 5 },
                    { name: "maxNights", label: "Số đêm tối đa", type: "number", min: 1, defaultValue: 30 },
                  ],
                },
                {
                  name: "bank",
                  label: "Tài khoản nhận cọc",
                  type: "group",
                  admin: {
                    description:
                      "Điền đủ thì trang xác nhận hiện mã QR chuyển khoản (VietQR) kèm số tiền cọc và mã đặt phòng. Để trống thì lễ tân hướng dẫn cọc qua điện thoại.",
                  },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        { name: "bankId", label: "Ngân hàng (mã viết tắt)", type: "text", admin: { description: "Ví dụ: VCB, MB, TCB, BIDV, ACB" } },
                        { name: "accountNo", label: "Số tài khoản", type: "text" },
                        { name: "accountName", label: "Chủ tài khoản", type: "text", admin: { description: "Viết hoa không dấu" } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const fontOptions = Object.entries(fontChoices).map(([value, f]) => ({
  label: `${f.label} (${f.kind === "sans" ? "không chân" : "có chân"})`,
  value,
}));

export const ThemeSettings: GlobalConfig = {
  slug: "theme-settings",
  label: "Giao diện",
  admin: { group: "Cài đặt" },
  access,
  fields: [
    {
      name: "fonts",
      label: "Font chữ",
      type: "group",
      fields: [
        { name: "heading", label: "Tiêu đề các mục", type: "select", required: true, options: fontOptions },
        { name: "hero", label: "Chữ trong hero trang chủ", type: "select", required: true, options: fontOptions },
        { name: "body", label: "Đoạn văn nội dung", type: "select", required: true, options: fontOptions },
        { name: "ui", label: "Nhãn, nút, form, giá", type: "select", required: true, options: fontOptions },
      ],
    },
  ],
};
