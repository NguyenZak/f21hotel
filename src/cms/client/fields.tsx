"use client";

import { useEffect, useState } from "react";
import type { Field } from "../schema";
import { api } from "./api";
import { MediaPicker, type MediaItem } from "./media";

// Ô nhập theo khai báo trường (src/cms/schema.ts), dùng cho mọi mục nội dung
type Value = unknown;

export function MoneyInput({ id, value, onChange }: { id?: string; value: number | null; onChange: (v: number | null) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <div className="c-money">
      <input
        id={id}
        className="c-input"
        inputMode="numeric"
        value={draft ?? (value === null || value === undefined ? "" : value.toLocaleString("vi-VN"))}
        onFocus={() => setDraft(value === null || value === undefined ? "" : value.toLocaleString("vi-VN"))}
        onBlur={() => setDraft(null)}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          setDraft(digits ? Number(digits).toLocaleString("vi-VN") : "");
          onChange(digits ? Number(digits) : null);
        }}
      />
      <span aria-hidden="true">đ</span>
    </div>
  );
}

// Lựa chọn cho trường quan hệ, tải một lần mỗi mục
const optionCache = new Map<string, Promise<{ id: number; title: string }[]>>();
function useOptions(slug: string) {
  const [opts, setOpts] = useState<{ id: number; title: string }[]>([]);
  useEffect(() => {
    if (!optionCache.has(slug)) optionCache.set(slug, api<{ options: { id: number; title: string }[] }>(`options/${slug}`).then((r) => r.options));
    optionCache.get(slug)!.then(setOpts).catch(() => {});
  }, [slug]);
  return opts;
}

function Rows({ f, value, onChange }: { f: Extract<Field, { type: "rows" }>; value: Record<string, string>[]; onChange: (v: Value) => void }) {
  const rows = value ?? [];
  const set = (i: number, col: string, v: string) => onChange(rows.map((r, k) => (k === i ? { ...r, [col]: v } : r)));
  const move = (i: number, d: number) => {
    const next = [...rows];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <div className="c-rows">
      {rows.map((r, i) => (
        <div key={i} className="c-rows__row">
          {f.columns.map((c) => (
            <input key={c.column} className="c-input" placeholder={c.label} aria-label={`${c.label} ${i + 1}`} value={r[c.column] ?? ""} onChange={(e) => set(i, c.column, e.target.value)} />
          ))}
          <span className="c-rows__tools">
            <button type="button" className="c-btn c-btn--small c-btn--ghost" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Lên">
              ↑
            </button>
            <button type="button" className="c-btn c-btn--small c-btn--ghost" disabled={i === rows.length - 1} onClick={() => move(i, 1)} aria-label="Xuống">
              ↓
            </button>
            <button type="button" className="c-btn c-btn--small c-btn--ghost c-btn--danger" onClick={() => onChange(rows.filter((_, k) => k !== i))} aria-label="Xoá dòng">
              ✕
            </button>
          </span>
        </div>
      ))}
      <div>
        <button type="button" className="c-btn c-btn--small" onClick={() => onChange([...rows, Object.fromEntries(f.columns.map((c) => [c.column, ""]))])}>
          + Thêm dòng
        </button>
      </div>
    </div>
  );
}

function Refs({ f, value, onChange }: { f: Extract<Field, { type: "refs" }>; value: number[]; onChange: (v: Value) => void }) {
  const opts = useOptions(f.to);
  const sel = value ?? [];
  return (
    <div className="c-checks">
      {opts.map((o) => (
        <label key={o.id} className="c-check">
          <input type="checkbox" checked={sel.includes(o.id)} onChange={(e) => onChange(e.target.checked ? [...sel, o.id] : sel.filter((x) => x !== o.id))} />
          {o.title}
        </label>
      ))}
    </div>
  );
}

function Ref({ f, value, onChange }: { f: Extract<Field, { type: "ref" }>; value: number | null; onChange: (v: Value) => void }) {
  const opts = useOptions(f.to);
  return (
    <select id={f.name} className="c-select" value={value ?? ""} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)} required={f.required}>
      <option value="">— Chọn —</option>
      {opts.map((o) => (
        <option key={o.id} value={o.id}>
          {o.title}
        </option>
      ))}
    </select>
  );
}

function MediaField({ value, onChange }: { value: number[]; onChange: (v: Value) => void }) {
  const ids = value ?? [];
  const [open, setOpen] = useState(false);
  const [byId, setById] = useState<Map<number, MediaItem>>(new Map());
  useEffect(() => {
    api<{ media: MediaItem[] }>("media")
      .then((r) => setById(new Map(r.media.map((m) => [m.id, m]))))
      .catch(() => {});
  }, [open]);
  const move = (i: number, d: number) => {
    const next = [...ids];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <div className="c-mediafield">
      <div className="c-thumbs">
        {ids.map((id, i) => {
          const m = byId.get(id);
          return (
            <figure key={id} className="c-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element -- ảnh thu nhỏ từ Cloudinary */}
              {m ? <img src={m.url.replace("/upload/", "/upload/w_240,h_160,c_fill/")} alt={m.alt} /> : <span className="c-muted">Ảnh #{id}</span>}
              {i === 0 ? <figcaption>Ảnh đại diện</figcaption> : null}
              <span className="c-thumb__tools">
                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Lên trước">
                  ←
                </button>
                <button type="button" disabled={i === ids.length - 1} onClick={() => move(i, 1)} aria-label="Ra sau">
                  →
                </button>
                <button type="button" onClick={() => onChange(ids.filter((x) => x !== id))} aria-label="Bỏ ảnh">
                  ✕
                </button>
              </span>
            </figure>
          );
        })}
      </div>
      <button type="button" className="c-btn c-btn--small" onClick={() => setOpen(true)}>
        + Thêm ảnh
      </button>
      {open ? (
        <MediaPicker
          multiple
          selected={ids}
          onClose={() => setOpen(false)}
          onPick={(picked) => {
            onChange([...ids, ...picked.map((m) => m.id).filter((x) => !ids.includes(x))]);
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

export function FieldInput({ f, value, onChange }: { f: Exclude<Field, { type: "section" }>; value: Value; onChange: (v: Value) => void }) {
  const id = `f-${f.name}`;
  let input: React.ReactNode;
  switch (f.type) {
    case "textarea":
      input = <textarea id={id} className="c-textarea" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} required={f.required} />;
      break;
    case "number":
      input = (
        <input
          id={id}
          className="c-input"
          type="number"
          min={f.min}
          max={f.max}
          value={value === null || value === undefined ? "" : String(value)}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          required={f.required}
        />
      );
      break;
    case "money":
      input = <MoneyInput id={id} value={(value as number | null) ?? null} onChange={onChange} />;
      break;
    case "date":
      input = <input id={id} className="c-input" type="date" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} required={f.required} />;
      break;
    case "bool":
      return (
        <label className="c-check c-field--full">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} /> {f.label}
          {f.help ? <small className="c-muted"> · {f.help}</small> : null}
        </label>
      );
    case "select":
      input = (
        <select id={id} className="c-select" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} required={f.required}>
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "ref":
      input = <Ref f={f} value={value as number | null} onChange={onChange} />;
      break;
    case "rows":
      input = <Rows f={f} value={value as Record<string, string>[]} onChange={onChange} />;
      break;
    case "refs":
      input = <Refs f={f} value={value as number[]} onChange={onChange} />;
      break;
    case "media":
      input = <MediaField value={value as number[]} onChange={onChange} />;
      break;
    case "multi": {
      const sel = (value as string[]) ?? [];
      input = (
        <div className="c-checks">
          {f.options.map((o) => (
            <label key={o.value} className="c-check">
              <input type="checkbox" checked={sel.includes(o.value)} onChange={(e) => onChange(e.target.checked ? [...sel, o.value] : sel.filter((x) => x !== o.value))} />
              {o.label}
            </label>
          ))}
        </div>
      );
      break;
    }
    default:
      input = (
        <input id={id} className="c-input" type={f.type === "email" ? "email" : "text"} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} required={f.required} />
      );
  }
  const wide = f.type === "rows" || f.type === "refs" || f.type === "media" || f.type === "multi" || f.type === "textarea" || !f.half;
  return (
    <div className={`c-field${wide ? " c-field--full" : ""}`}>
      <label htmlFor={id}>
        {f.label}
        {f.required ? <span className="c-req"> *</span> : null}
      </label>
      {input}
      {f.help ? <small>{f.help}</small> : null}
    </div>
  );
}
