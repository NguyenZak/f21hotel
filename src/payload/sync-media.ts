// Đẩy lên Cloudinary những ảnh đã tải vào CMS trước khi khai báo Cloudinary (đang nằm ở media-uploads/ trên máy).
// Chạy: npm run sync-media. Ảnh đã có trên Cloudinary thì bỏ qua, chạy lại nhiều lần không sao.
import { readFile } from "fs/promises";
import path from "path";
import { getPayload } from "payload";
import config from "@payload-config";
import { cloudinaryConfigFromEnv, uploadFile } from "./cloudinary";

const cfg = cloudinaryConfigFromEnv();
if (!cfg) {
  console.error("Chưa khai báo CLOUDINARY_* trong .env.local");
  process.exit(1);
}

const payload = await getPayload({ config });
const { docs } = await payload.find({ collection: "media", limit: 1000, depth: 0, pagination: false });
let uploaded = 0;
let missing = 0;
for (const doc of docs) {
  if (!doc.filename || !doc.url) continue;
  if ((await fetch(doc.url, { method: "HEAD" })).ok) continue;
  const local = path.resolve(process.cwd(), "media-uploads", doc.filename);
  const buf = await readFile(local).catch(() => null);
  if (!buf) {
    payload.logger.warn(`Không tìm thấy file trên máy cho ảnh #${doc.id} (${doc.filename})`);
    missing++;
    continue;
  }
  await uploadFile(cfg, doc.filename, new Blob([new Uint8Array(buf)], { type: doc.mimeType ?? "image/webp" }));
  uploaded++;
}
payload.logger.info(`Đã đẩy ${uploaded} ảnh lên Cloudinary, ${docs.length - uploaded - missing} ảnh đã có sẵn, ${missing} ảnh thiếu file`);
process.exit(0);
