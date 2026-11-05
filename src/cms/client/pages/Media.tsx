"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "../api";
import { DropZone, thumb, UploadButton, UploadErrors, useUploads, type MediaItem } from "../media";
import { useToast } from "../ui";

// Thư viện ảnh: tải ảnh lên Cloudinary, sửa mô tả, xoá ảnh không còn dùng
export function MediaPage() {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [toast, say] = useToast();
  const uploads = useUploads((added) => {
    setItems((l) => [...added, ...(l ?? [])]);
    say(`Đã tải lên ${added.length} ảnh.`);
  });
  useEffect(() => {
    api<{ media: MediaItem[] }>("media")
      .then((r) => setItems(r.media))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Không tải được thư viện."));
  }, []);

  const saveAlt = async (m: MediaItem, alt: string) => {
    if (alt.trim() === m.alt) return;
    try {
      await api(`media/${m.id}`, { method: "PATCH", body: { alt } });
      setItems((l) => l?.map((x) => (x.id === m.id ? { ...x, alt } : x)) ?? null);
      say("Đã lưu mô tả ảnh.");
    } catch (e) {
      say(e instanceof ApiError ? e.message : "Không lưu được.");
    }
  };
  const remove = async (m: MediaItem) => {
    if (!window.confirm(`Xoá ảnh “${m.alt}”? Ảnh bị xoá khỏi Cloudinary, không khôi phục được.`)) return;
    try {
      await api(`media/${m.id}`, { method: "DELETE", body: {} });
      setItems((l) => l?.filter((x) => x.id !== m.id) ?? null);
      say("Đã xoá ảnh.");
    } catch (e) {
      say(e instanceof ApiError ? e.message : "Không xoá được.");
    }
  };

  const shown = (items ?? []).filter((m) => !q || m.alt.toLowerCase().includes(q.toLowerCase()) || m.filename.includes(q.toLowerCase()));
  return (
    <DropZone uploads={uploads}>
      <div className="c-page__head">
        <div>
          <h1>Thư viện ảnh</h1>
          <p>Ảnh lưu trên Cloudinary, tự nén và đổi định dạng cho nhẹ. Mô tả ảnh giúp Google và người khiếm thị hiểu nội dung ảnh.</p>
          <p className="c-muted">Chọn nhiều ảnh một lúc, hoặc kéo thả ảnh từ máy tính vào trang này.</p>
        </div>
        <UploadButton uploads={uploads} />
      </div>
      <UploadErrors uploads={uploads} />
      {error ? <p className="c-alert c-alert--error">{error}</p> : null}
      <input className="c-input" style={{ maxWidth: 360, marginBottom: 16 }} placeholder="Tìm theo mô tả hoặc tên file" value={q} onChange={(e) => setQ(e.target.value)} />
      {!items ? <p className="c-empty">Đang tải…</p> : null}
      <div className="c-library">
        {shown.map((m) => (
          <figure key={m.id} className="c-card c-library__item">
            <a href={m.url} target="_blank" rel="noopener">
              {/* eslint-disable-next-line @next/next/no-img-element -- ảnh thu nhỏ từ Cloudinary */}
              <img src={thumb(m.url, 480, 320)} alt={m.alt} loading="lazy" />
            </a>
            <figcaption>
              <input className="c-input" defaultValue={m.alt} aria-label="Mô tả ảnh" onBlur={(e) => saveAlt(m, e.target.value)} />
              <span className="c-row" style={{ justifyContent: "space-between" }}>
                <small className="c-muted">
                  {m.filename}
                  {m.width ? ` · ${m.width}×${m.height}` : ""}
                </small>
                <button type="button" className="c-btn c-btn--small c-btn--ghost c-btn--danger" onClick={() => remove(m)}>
                  Xoá
                </button>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      {toast}
    </DropZone>
  );
}
