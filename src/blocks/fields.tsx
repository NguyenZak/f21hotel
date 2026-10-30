"use client";

import type { CustomField, Field } from "@puckeditor/core";
import { useEffect, useState } from "react";
import type { Photo } from "@/lib/site";
import { ICON_LABELS, type IconName } from "./icons";

// Trường dùng chung cho các khối trong trình dựng trang

type MediaDoc = { id: number; url: string; alt: string; width?: number; height?: number };

// Ô chọn ảnh từ Thư viện ảnh của CMS (đọc qua API /api/media)
function ImagePicker({ value, onChange }: { value?: Photo; onChange: (v: Photo) => void }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaDoc[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open || items) return;
    fetch("/api/media?limit=200&depth=0&sort=-createdAt", { credentials: "include" })
      .then((r) => r.json() as Promise<{ docs: MediaDoc[] }>)
      .then((j) => setItems(j.docs))
      .catch(() => setItems([]));
  }, [open, items]);

  const shown = (items ?? []).filter((m) => !q || m.alt.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {value?.src ? (
        // eslint-disable-next-line @next/next/no-img-element -- ảnh xem trước nhỏ trong bảng chỉnh sửa
        <img src={value.src} alt={value.alt} style={{ width: "100%", borderRadius: 6, aspectRatio: "3 / 2", objectFit: "cover" }} />
      ) : null}
      <button type="button" onClick={() => setOpen((o) => !o)} style={btn}>
        {open ? "Đóng thư viện" : value?.src ? "Đổi ảnh" : "Chọn ảnh"}
      </button>
      {open ? (
        <div style={{ display: "grid", gap: 8 }}>
          <input placeholder="Tìm theo mô tả ảnh" value={q} onChange={(e) => setQ(e.target.value)} style={input} />
          {!items ? <small>Đang tải…</small> : null}
          {items && !items.length ? <small>Thư viện chưa có ảnh. Tải ảnh lên ở CMS › Thư viện ảnh.</small> : null}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, maxHeight: 280, overflowY: "auto" }}>
            {shown.map((m) => (
              <button
                key={m.id}
                type="button"
                title={m.alt}
                onClick={() => {
                  onChange({ src: m.url, alt: m.alt, w: m.width ?? 1600, h: m.height ?? 1067 });
                  setOpen(false);
                }}
                style={{ padding: 0, border: value?.src === m.url ? "2px solid #c9a23f" : "1px solid #ddd", borderRadius: 4, cursor: "pointer", background: "none" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- ảnh thu nhỏ trong thư viện */}
                <img src={m.url} alt={m.alt} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {value?.src ? (
        <input
          placeholder="Mô tả ảnh"
          value={value.alt}
          onChange={(e) => onChange({ ...value, alt: e.target.value })}
          style={input}
        />
      ) : null}
    </div>
  );
}

const btn = { padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, background: "#fff", cursor: "pointer" };
const input = { padding: "8px 10px", border: "1px solid #ccc", borderRadius: 6, width: "100%" };

export const imageField = (label = "Ảnh"): CustomField<Photo> => ({
  type: "custom",
  label,
  render: ({ value, onChange }) => <ImagePicker value={value} onChange={onChange} />,
});

export const text = (label: string): Field => ({ type: "text", label });
export const textarea = (label: string): Field => ({ type: "textarea", label });

export const iconField: Field = {
  type: "select",
  label: "Biểu tượng",
  options: (Object.keys(ICON_LABELS) as IconName[]).map((value) => ({ label: ICON_LABELS[value], value })),
};

// Phần đầu mục dùng chung: nhãn nhỏ, tiêu đề, đoạn giới thiệu
export const headFields = {
  eyebrow: text("Nhãn nhỏ"),
  title: text("Tiêu đề"),
  intro: textarea("Giới thiệu"),
};

export const backgroundField: Field = {
  type: "select",
  label: "Nền",
  options: [
    { label: "Trắng", value: "" },
    { label: "Kem", value: "cream" },
    { label: "Đỏ mận", value: "dark on-dark" },
  ],
};
