"use client";

import { type DragEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { api, ApiError } from "./api";
import { Finder } from "./Finder";

// Thư viện ảnh: tải ảnh thẳng từ trình duyệt lên Cloudinary (chữ ký do API cấp), chọn ảnh cho hạng phòng / trang
export type MediaItem = {
  id: number;
  alt: string;
  filename: string;
  url: string;
  width: number | null;
  height: number | null;
  filesize?: number | null;
  mimeType?: string | null;
  folderId?: number | null;
  createdAt: string;
};
export type MediaFolder = { id: number; name: string; parentId: number | null; createdAt: string };
// Nơi đang dùng ảnh (trang Thư viện ảnh hỏi kèm ?usage=1)
export type MediaUse = { title: string; label: string; href: string };
export type MediaLibrary = { media: MediaItem[]; folders: MediaFolder[]; usage?: Record<number, MediaUse[]> };

// Kéo ảnh / thư mục bên trong thư viện (khác kéo file từ máy tính vào)
export const DRAG_TYPE = "application/x-f21-media";

export const thumb = (url: string, w = 320, h = 220) => url.replace("/upload/", `/upload/w_${w},h_${h},c_fill/`);

// Mô tả ảnh mặc định từ tên file: "phong-doi-cua-so.jpg" -> "Phong doi cua so"
const altFromName = (name: string) => {
  const s = name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export async function uploadImage(file: File, alt?: string, folderId?: number | null): Promise<MediaItem> {
  const size = await createImageBitmap(file)
    .then((b) => ({ width: b.width, height: b.height }))
    .catch(() => ({ width: 0, height: 0 }));
  const signed = await api<{ filename: string; upload: { url: string; fields: Record<string, string> } }>("media/sign", { body: { filename: file.name } });
  const form = new FormData();
  Object.entries(signed.upload.fields).forEach(([k, v]) => form.append(k, v));
  form.append("file", file);
  const res = await fetch(signed.upload.url, { method: "POST", body: form });
  if (!res.ok) throw new ApiError("Cloudinary không nhận ảnh này. Thử ảnh khác hoặc ảnh nhỏ hơn.", res.status);
  const r = await api<{ media: MediaItem }>("media", {
    body: { filename: signed.filename, alt: alt || altFromName(file.name), ...size, mimeType: file.type, filesize: file.size, folderId: folderId ?? null },
  });
  return r.media;
}

const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
// Số ảnh tải lên Cloudinary cùng lúc: nhanh hơn tải lần lượt mà không nghẽn mạng điện thoại
const PARALLEL = 3;

export type Uploads = { busy: string; errors: string[]; start: (files: File[]) => void };

// Hàng đợi tải ảnh dùng chung cho nút chọn file và vùng kéo thả. Ảnh trả về theo đúng thứ tự đã chọn,
// và vào thư mục đang mở (folderId) lúc bắt đầu tải
export function useUploads(onDone: (items: MediaItem[]) => void, folderId: number | null = null): Uploads {
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const running = useRef(false);
  const folder = useRef(folderId);
  useEffect(() => {
    folder.current = folderId;
  }, [folderId]);
  const start = async (all: File[]) => {
    const files = all.filter((f) => ACCEPT.includes(f.type));
    const skipped = all.filter((f) => !ACCEPT.includes(f.type)).map((f) => `${f.name}: không phải ảnh JPG, PNG, WebP, AVIF hoặc GIF.`);
    setErrors(skipped);
    if (!files.length || running.current) return;
    running.current = true;
    const results: (MediaItem | null)[] = new Array(files.length).fill(null);
    const failed: string[] = [];
    let next = 0;
    let finished = 0;
    const into = folder.current;
    setProgress({ done: 0, total: files.length });
    const worker = async () => {
      while (next < files.length) {
        const i = next++;
        try {
          results[i] = await uploadImage(files[i], undefined, into);
        } catch (err) {
          failed.push(`${files[i].name}: ${err instanceof ApiError ? err.message : "không tải được."}`);
        }
        setProgress({ done: ++finished, total: files.length });
      }
    };
    await Promise.all(Array.from({ length: Math.min(PARALLEL, files.length) }, worker));
    running.current = false;
    setProgress(null);
    setErrors([...skipped, ...failed]);
    const done = results.filter((m): m is MediaItem => m !== null);
    if (done.length) onDone(done);
  };
  return { busy: progress ? `Đang tải ${progress.done}/${progress.total} ảnh…` : "", errors, start };
}

// Nút tải ảnh (chọn nhiều file một lúc)
export function UploadButton({ uploads, label = "Tải ảnh lên" }: { uploads: Uploads; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={ACCEPT.join(",")}
        multiple
        hidden
        onChange={(e) => {
          const files = [...(e.target.files ?? [])];
          e.target.value = "";
          uploads.start(files);
        }}
      />
      <button type="button" className="c-btn c-btn--primary" disabled={Boolean(uploads.busy)} onClick={() => ref.current?.click()}>
        {uploads.busy || label}
      </button>
    </>
  );
}

// Lỗi của lần tải gần nhất, mỗi file một dòng
export function UploadErrors({ uploads }: { uploads: Uploads }) {
  if (!uploads.errors.length) return null;
  return (
    <div className="c-alert c-alert--error" role="alert">
      {uploads.errors.length > 1 ? `${uploads.errors.length} file không tải được:` : null}
      {uploads.errors.map((e) => (
        <div key={e}>{e}</div>
      ))}
    </div>
  );
}

// Vùng nhận ảnh kéo thả từ máy tính: kéo file vào là hiện lớp phủ, thả ra là tải lên
export function DropZone({ uploads, children, className = "" }: { uploads: Uploads; children: ReactNode; className?: string }) {
  const [over, setOver] = useState(false);
  // dragenter/dragleave bắn cả khi đi qua phần tử con: đếm để biết khi nào thật sự rời vùng
  const depth = useRef(0);
  // Kéo ảnh trong thư viện sang thư mục khác không phải tải lên (trình duyệt có thể gắn kèm "Files" khi kéo ảnh)
  const hasFiles = (e: DragEvent) => e.dataTransfer.types.includes("Files") && !e.dataTransfer.types.includes(DRAG_TYPE);
  return (
    <div
      className={`c-drop${over ? " is-over" : ""} ${className}`}
      onDragEnter={(e) => {
        if (!hasFiles(e)) return;
        e.preventDefault();
        depth.current++;
        setOver(true);
      }}
      onDragOver={(e) => {
        if (!hasFiles(e)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = uploads.busy ? "none" : "copy";
      }}
      onDragLeave={(e) => {
        if (!hasFiles(e)) return;
        if (--depth.current <= 0) {
          depth.current = 0;
          setOver(false);
        }
      }}
      onDrop={(e) => {
        if (!hasFiles(e)) return;
        e.preventDefault();
        depth.current = 0;
        setOver(false);
        if (!uploads.busy) uploads.start([...e.dataTransfer.files]);
      }}
    >
      {children}
      {over ? (
        <div className="c-drop__overlay" aria-hidden="true">
          <div className="c-drop__msg">
            <strong>{uploads.busy ? "Đang tải ảnh, đợi xong rồi thả tiếp" : "Thả ảnh vào đây để tải lên"}</strong>
            <span>JPG, PNG, WebP, AVIF, GIF · chọn được nhiều ảnh một lúc</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Hộp chọn ảnh từ thư viện: cùng giao diện Finder với trang Thư viện ảnh (có thư mục, tìm, tải ảnh mới ngay trong hộp)
export function MediaPicker({
  multiple,
  selected = [],
  onPick,
  onClose,
}: {
  multiple?: boolean;
  selected?: number[];
  onPick: (items: MediaItem[]) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  return (
    <dialog ref={dialog} className="c-dialog c-dialog--finder" aria-label="Chọn ảnh" onClose={onClose}>
      <Finder pick={{ multiple, disabled: selected, onPick, onCancel: onClose }} />
    </dialog>
  );
}
