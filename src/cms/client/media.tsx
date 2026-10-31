"use client";

import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "./api";

// Thư viện ảnh: tải ảnh thẳng từ trình duyệt lên Cloudinary (chữ ký do API cấp), chọn ảnh cho hạng phòng / trang
export type MediaItem = { id: number; alt: string; filename: string; url: string; width: number | null; height: number | null; createdAt: string };

export const thumb = (url: string, w = 320, h = 220) => url.replace("/upload/", `/upload/w_${w},h_${h},c_fill/`);

// Mô tả ảnh mặc định từ tên file: "phong-doi-cua-so.jpg" -> "Phong doi cua so"
const altFromName = (name: string) => {
  const s = name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export async function uploadImage(file: File, alt?: string): Promise<MediaItem> {
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
    body: { filename: signed.filename, alt: alt || altFromName(file.name), ...size, mimeType: file.type, filesize: file.size },
  });
  return r.media;
}

// Nút tải ảnh (chọn nhiều file)
export function UploadButton({ onDone, label = "Tải ảnh lên" }: { onDone: (items: MediaItem[]) => void; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  return (
    <span className="c-row">
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        multiple
        hidden
        onChange={async (e) => {
          const files = [...(e.target.files ?? [])];
          e.target.value = "";
          setError("");
          const done: MediaItem[] = [];
          for (const [i, f] of files.entries()) {
            setBusy(`Đang tải ${i + 1}/${files.length}…`);
            try {
              done.push(await uploadImage(f));
            } catch (err) {
              setError(`${f.name}: ${err instanceof ApiError ? err.message : "không tải được."}`);
            }
          }
          setBusy("");
          if (done.length) onDone(done);
        }}
      />
      <button type="button" className="c-btn c-btn--primary" disabled={Boolean(busy)} onClick={() => ref.current?.click()}>
        {busy || label}
      </button>
      {error ? <span className="c-hint">{error}</span> : null}
    </span>
  );
}

// Hộp chọn ảnh từ thư viện (có tải ảnh mới ngay trong hộp)
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
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  useEffect(() => {
    dialog.current?.showModal();
    api<{ media: MediaItem[] }>("media")
      .then((r) => setItems(r.media))
      .catch(() => setItems([]));
  }, []);
  const shown = (items ?? []).filter((m) => !q || m.alt.toLowerCase().includes(q.toLowerCase()) || m.filename.includes(q.toLowerCase()));
  const toggle = (m: MediaItem) => {
    if (!multiple) return onPick([m]);
    setPicked((p) => (p.includes(m.id) ? p.filter((x) => x !== m.id) : [...p, m.id]));
  };
  return (
    <dialog ref={dialog} className="c-dialog c-dialog--wide" onClose={onClose}>
      <div className="c-dialog__head">
        <h2>Chọn ảnh</h2>
        <button type="button" className="c-btn c-btn--ghost c-btn--small" onClick={onClose} aria-label="Đóng">
          ✕
        </button>
      </div>
      <div className="c-dialog__body">
        <div className="c-row">
          <input className="c-input" style={{ flex: 1 }} placeholder="Tìm theo mô tả ảnh" value={q} onChange={(e) => setQ(e.target.value)} />
          <UploadButton
            onDone={(added) => {
              setItems((l) => [...added, ...(l ?? [])]);
              if (multiple) setPicked((p) => [...p, ...added.map((m) => m.id)]);
            }}
          />
        </div>
        {!items ? <p className="c-empty">Đang tải…</p> : null}
        {items && !items.length ? <p className="c-empty">Thư viện chưa có ảnh. Bấm “Tải ảnh lên”.</p> : null}
        <div className="c-gallery">
          {shown.map((m) => {
            const on = picked.includes(m.id);
            const already = selected.includes(m.id);
            return (
              <button key={m.id} type="button" className={`c-gallery__item${on ? " is-on" : ""}`} disabled={already} onClick={() => toggle(m)} title={m.alt}>
                {/* eslint-disable-next-line @next/next/no-img-element -- ảnh thu nhỏ từ Cloudinary */}
                <img src={thumb(m.url)} alt={m.alt} loading="lazy" />
                <span>{already ? "Đã chọn" : m.alt}</span>
              </button>
            );
          })}
        </div>
      </div>
      {multiple ? (
        <div className="c-dialog__foot">
          <button type="button" className="c-btn" onClick={onClose}>
            Huỷ
          </button>
          <button type="button" className="c-btn c-btn--primary" disabled={!picked.length} onClick={() => onPick((items ?? []).filter((m) => picked.includes(m.id)))}>
            Thêm {picked.length || ""} ảnh
          </button>
        </div>
      ) : null}
    </dialog>
  );
}
