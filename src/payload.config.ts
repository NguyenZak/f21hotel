import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { vi } from "@payloadcms/translations/languages/vi";
import { cloudStoragePlugin } from "@payloadcms/plugin-cloud-storage";
import { type CloudflareContext, getCloudflareContext } from "@opennextjs/cloudflare";
import fs from "fs";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import type { GetPlatformProxyOptions } from "wrangler";
import { withAudit, withAuditGlobal } from "./payload/audit";
import { cloudinaryAdapter, cloudinaryConfigFromEnv } from "./payload/cloudinary";
import { withRevalidate, withRevalidateGlobal } from "./payload/revalidate";
import { CMS_TAGS } from "./lib/cms-tags";
import { dashboard } from "./payload/admin/dashboard/layout";
import { AuditLogs } from "./payload/collections/AuditLogs";
import { Bookings, RateRules } from "./payload/collections/Bookings";
import { Faqs, Offers, Reviews, RoomTypes, Rooms } from "./payload/collections/Content";
import { Media } from "./payload/collections/Media";
import { Pages } from "./payload/collections/Pages";
import { Users } from "./payload/collections/Users";
import { SiteSettings, ThemeSettings } from "./payload/globals/Settings";

// Cấu hình CMS. Dựa theo mẫu chính thức payloadcms/payload/templates/with-cloudflare-d1:
// dữ liệu ở Cloudflare D1 (khi chạy ở máy dùng bản giả lập của wrangler), ảnh ở Cloudinary.

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const realpath = (value: string) => (fs.existsSync(value) ? fs.realpathSync(value) : undefined);

const isCLI = process.argv.some((value) => realpath(value)?.endsWith(path.join("payload", "bin.js")));
const isProduction = process.env.NODE_ENV === "production";

const cloudflare =
  isCLI || !isProduction ? await getCloudflareContextFromWrangler() : await getCloudflareContext({ async: true });

// Chưa khai báo Cloudinary thì bản dev lưu ảnh vào thư mục media-uploads/ trên máy.
// Bản chạy trên Cloudflare bắt buộc có Cloudinary (Workers không có ổ đĩa để lưu file).
const cloudinary = cloudinaryConfigFromEnv();

// Ẩn tab "API" (dữ liệu thô) ở trang sửa: người dùng CMS không cần tới
function hideApiTab<T extends { admin?: object }>(entity: T): T {
  return { ...entity, admin: { ...entity.admin, hideAPIURL: true } };
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: " · F21 Hotel CMS",
      icons: [{ rel: "icon", type: "image/png", url: "/icon.png" }],
    },
    // Giao diện theo màu F21 (src/app/(payload)/custom.css), chỉ dùng nền sáng
    theme: "light",
    dateFormat: "dd/MM/yyyy HH:mm",
    components: {
      graphics: { Logo: "/payload/admin/Graphics#Logo", Icon: "/payload/admin/Graphics#Icon" },
      beforeLogin: ["/payload/admin/LoginIntro#LoginIntro"],
      beforeNavLinks: ["/payload/admin/NavLinks#NavLinks"],
      views: {
        roomCalendar: { Component: "/payload/admin/bookings/RoomCalendar#RoomCalendar", path: "/lich-phong", meta: { title: "Lịch phòng" } },
      },
    },
    // Bảng điều khiển: widget theo vai trò (lễ tân thấy việc hôm nay, quản lý thấy thêm công suất, doanh thu)
    dashboard,
  },
  // Thứ tự khai báo = thứ tự nhóm trên menu: Đặt phòng, Phòng & giá, Website, Cài đặt.
  // Mọi bảng (trừ nhật ký) đều ghi nhật ký thao tác; bảng hiển thị trên website thì làm mới trang khi lưu
  collections: [
    // Đặt phòng và giá theo ngày được tính trực tiếp mỗi lần khách tìm phòng, không lưu đệm
    withAudit(Bookings),
    withRevalidate(withAudit(RoomTypes), [CMS_TAGS.rooms]),
    withRevalidate(withAudit(Rooms), [CMS_TAGS.rooms]),
    withAudit(RateRules),
    withRevalidate(withAudit(Pages), [CMS_TAGS.pages]),
    withRevalidate(withAudit(Offers), [CMS_TAGS.offers]),
    withRevalidate(withAudit(Media), [CMS_TAGS.rooms]),
    withRevalidate(withAudit(Reviews), [CMS_TAGS.reviews]),
    withRevalidate(withAudit(Faqs), [CMS_TAGS.faqs]),
    withAudit(Users),
    AuditLogs,
  ].map(hideApiTab),
  globals: [
    withRevalidateGlobal(withAuditGlobal(SiteSettings), [CMS_TAGS.settings]),
    withRevalidateGlobal(withAuditGlobal(ThemeSettings), [CMS_TAGS.theme]),
  ].map(hideApiTab),
  // Trang quản trị bằng tiếng Việt
  i18n: { supportedLanguages: { vi }, fallbackLanguage: "vi" },
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  // Bản dev cũng chỉ đổi cấu trúc dữ liệu qua migration (npm run migrate), giống D1 thật.
  // Để Payload tự "push" thì drizzle dựng lại bảng do migration tạo và lỗi "index already exists".
  db: sqliteD1Adapter({ binding: cloudflare.env.D1, push: false }),
  plugins: [
    cloudStoragePlugin({
      enabled: Boolean(cloudinary),
      // Giữ cùng cấu trúc dữ liệu dù có bật Cloudinary hay không
      alwaysInsertFields: true,
      collections: {
        media: {
          adapter: cloudinary ? cloudinaryAdapter(cloudinary) : null,
          disableLocalStorage: true,
          // Website lấy ảnh thẳng từ CDN của Cloudinary, không đi qua máy chủ
          disablePayloadAccessControl: true,
        },
      },
    }),
  ],
});

// Theo mẫu chính thức: lấy binding D1 từ wrangler khi chạy ở máy hoặc chạy lệnh payload
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${"__wrangler".replaceAll("_", "")}`).then(({ getPlatformProxy }) =>
    getPlatformProxy({
      environment: process.env.CLOUDFLARE_ENV,
      remoteBindings: isProduction,
    } satisfies GetPlatformProxyOptions),
  );
}
