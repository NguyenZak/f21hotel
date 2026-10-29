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
import { AuditLogs } from "./payload/collections/AuditLogs";
import { Faqs, Offers, Reviews, RoomTypes, Rooms } from "./payload/collections/Content";
import { Media } from "./payload/collections/Media";
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

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " · F21 Hotel CMS" },
  },
  // Mọi bảng (trừ nhật ký) đều ghi nhật ký thao tác
  collections: [
    withAudit(Users),
    withAudit(Media),
    withAudit(RoomTypes),
    withAudit(Rooms),
    withAudit(Offers),
    withAudit(Reviews),
    withAudit(Faqs),
    AuditLogs,
  ],
  globals: [withAuditGlobal(SiteSettings), withAuditGlobal(ThemeSettings)],
  // Trang quản trị bằng tiếng Việt
  i18n: { supportedLanguages: { vi }, fallbackLanguage: "vi" },
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
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
