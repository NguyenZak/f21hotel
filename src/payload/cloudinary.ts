import type { Adapter } from "@payloadcms/plugin-cloud-storage/types";

// Bộ kết nối lưu ảnh của CMS lên Cloudinary.
// Gọi thẳng REST API của Cloudinary bằng fetch + Web Crypto (không dùng SDK Node) để chạy được trên Cloudflare Workers.
// Cấu hình qua biến môi trường: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_FOLDER.

export type CloudinaryConfig = { cloudName: string; apiKey: string; apiSecret: string; folder: string };

export function cloudinaryConfigFromEnv(): CloudinaryConfig | null {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_FOLDER } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) return null;
  return {
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    apiSecret: CLOUDINARY_API_SECRET,
    folder: CLOUDINARY_FOLDER || "f21-hotel",
  };
}

const stripExt = (name: string) => name.replace(/\.[^./]+$/, "");
const extOf = (name: string) => name.match(/\.([^./]+)$/)?.[1] ?? "";

// Chữ ký API của Cloudinary: SHA-1 của các tham số sắp theo tên, nối bằng &, cộng api_secret
async function sign(params: Record<string, string>, apiSecret: string) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(toSign + apiSecret));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function callApi(cfg: CloudinaryConfig, action: "upload" | "destroy", params: Record<string, string>, file?: Blob) {
  const signed = { ...params, timestamp: String(Math.floor(Date.now() / 1000)) };
  const body = new FormData();
  for (const [k, v] of Object.entries(signed)) body.append(k, v);
  body.append("api_key", cfg.apiKey);
  body.append("signature", await sign(signed, cfg.apiSecret));
  if (file) body.append("file", file);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/${action}`, { method: "POST", body });
  if (!res.ok) throw new Error(`Cloudinary ${action} lỗi ${res.status}: ${await res.text()}`);
  return res.json() as Promise<Record<string, unknown>>;
}

// Tải một file lên đúng public_id mà adapter dùng (dùng cho script đồng bộ ảnh cũ)
export const uploadFile = (cfg: CloudinaryConfig, storageFilePath: string, file: Blob) =>
  callApi(cfg, "upload", { public_id: `${cfg.folder}/${stripExt(storageFilePath)}`, overwrite: "true" }, file);

export function cloudinaryAdapter(cfg: CloudinaryConfig): Adapter {
  // public_id trên Cloudinary = thư mục + đường dẫn file trong CMS (bỏ đuôi), nên tính lại được từ tên file
  const publicId = (filePath: string) => `${cfg.folder}/${stripExt(filePath)}`;
  const urlFor = (filePath: string) =>
    `https://res.cloudinary.com/${cfg.cloudName}/image/upload/f_auto,q_auto/${publicId(filePath)}.${extOf(filePath) || "jpg"}`;
  const pathOf = (filename: string, prefix?: string) => (prefix ? `${prefix}/${filename}` : filename);

  return () => ({
    name: "cloudinary",
    handleUpload: async ({ file, storageFilePath }) => {
      await callApi(
        cfg,
        "upload",
        { public_id: publicId(storageFilePath), overwrite: "true" },
        new Blob([new Uint8Array(file.buffer)], { type: file.mimeType }),
      );
    },
    handleDelete: async ({ storageFilePath }) => {
      await callApi(cfg, "destroy", { public_id: publicId(storageFilePath), invalidate: "true" });
    },
    generateURL: ({ filename, prefix }) => urlFor(pathOf(filename, prefix)),
    // Đường dẫn /api/media/file/... chuyển thẳng sang CDN của Cloudinary
    staticHandler: (_req, { params }) => Response.redirect(urlFor(pathOf(params.filename, params.prefix)), 302),
  });
}
