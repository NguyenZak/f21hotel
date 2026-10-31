// Đường dẫn ảnh trong Thư viện ảnh của CMS. Ảnh nằm trên Cloudinary (thư mục CLOUDINARY_FOLDER),
// public_id = thư mục + tên file bỏ đuôi, giống API thư viện ảnh (src/cms/server/media.ts).
// Chưa khai báo Cloudinary (máy dev cũ) thì dùng đường dẫn đã lưu trong bảng media.
export function mediaUrl(m: { filename?: unknown; prefix?: unknown; url?: unknown }) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const filename = m.filename ? String(m.filename) : "";
  if (!cloud || !filename) return m.url ? String(m.url) : "";
  const folder = process.env.CLOUDINARY_FOLDER || "f21-hotel";
  const path = m.prefix ? `${m.prefix}/${filename}` : filename;
  const ext = path.match(/\.([^./]+)$/)?.[1] ?? "jpg";
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto/${folder}/${path.replace(/\.[^./]+$/, "")}.${ext}`;
}
