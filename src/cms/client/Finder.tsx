"use client";

import {
  type CSSProperties,
  type DragEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { api, ApiError } from "./api";
import { Icon } from "./icons";
import { DRAG_TYPE, DropZone, UploadErrors, useUploads, type MediaFolder, type MediaItem, type MediaLibrary } from "./media";
import { useToast } from "./ui";

// Thư viện ảnh kiểu Finder của macOS: thanh bên có thư mục, 3 kiểu xem (biểu tượng, danh sách, thư viện), chọn nhiều bằng
// ⌘/Ctrl và Shift hoặc kéo khung chọn, menu chuột phải, Xem nhanh bằng phím cách, kéo ảnh thả vào thư mục, khung thông tin.
// Dùng cho trang Thư viện ảnh và hộp chọn ảnh (pick). Thư mục chỉ để xếp ảnh trong CMS: đường dẫn ảnh không đổi.

type Pick = {
  multiple?: boolean;
  disabled?: number[];
  onPick: (items: MediaItem[]) => void;
  onCancel: () => void;
};
type Loc = { kind: "folder"; id: number | null } | { kind: "all" } | { kind: "unused" };
type View = "icons" | "list" | "gallery";
type SortKey = "name" | "date" | "size" | "kind";
type Prefs = {
  view: View;
  size: number;
  sort: SortKey;
  dir: "asc" | "desc";
  info: boolean;
};
type Entry = { key: string; kind: "folder"; folder: MediaFolder } | { key: string; kind: "image"; media: MediaItem };
type MenuItem =
  | {
      label: string;
      hint?: string;
      onSelect: () => void;
      danger?: boolean;
      checked?: boolean;
    }
  | "sep";

const ROOT: Loc = { kind: "folder", id: null };
const PREFS_KEY = "f21-cms-finder";
const DEFAULT_PREFS: Prefs = {
  view: "icons",
  size: 128,
  sort: "date",
  dir: "desc",
  info: true,
};
const SORTS: Record<SortKey, string> = {
  name: "Tên",
  date: "Ngày thêm",
  size: "Dung lượng",
  kind: "Loại",
};
const VIEWS: {
  view: View;
  label: string;
  icon: "viewIcons" | "viewList" | "viewGallery";
}[] = [
  { view: "icons", label: "Biểu tượng", icon: "viewIcons" },
  { view: "list", label: "Danh sách", icon: "viewList" },
  { view: "gallery", label: "Thư viện", icon: "viewGallery" },
];

const fk = (id: number) => `f${id}`;
const mk = (id: number) => `m${id}`;
const sameLoc = (a: Loc, b: Loc) => a.kind === b.kind && (a.kind !== "folder" || a.id === (b as { id: number | null }).id);
// Ảnh thu nhỏ giữ nguyên tỉ lệ (Finder không cắt ảnh), ảnh lớn cho Xem nhanh và khung xem trước
const fit = (url: string, px: number) => url.replace("/upload/", `/upload/w_${px},h_${px},c_limit/`);
const nameOf = (e: Entry) => (e.kind === "folder" ? e.folder.name : e.media.alt || e.media.filename);
const kindOf = (m: MediaItem) => {
  const ext = (m.mimeType?.split("/")[1] ?? m.filename.split(".").pop() ?? "").toLowerCase();
  return `Ảnh ${ext === "jpg" || ext === "jpeg" ? "JPEG" : ext === "webp" ? "WebP" : ext === "avif" ? "AVIF" : ext.toUpperCase()}`;
};
const fmtSize = (b?: number | null) =>
  !b ? "—" : b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1048576).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} MB`;
const TZ = { timeZone: "Asia/Ho_Chi_Minh" } as const;
const fmtDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const day = (x: Date) => x.toLocaleDateString("vi-VN", TZ);
  const time = d.toLocaleTimeString("vi-VN", {
    ...TZ,
    hour: "2-digit",
    minute: "2-digit",
  });
  if (day(d) === day(new Date())) return `Hôm nay, ${time}`;
  if (day(d) === day(new Date(Date.now() - 864e5))) return `Hôm qua, ${time}`;
  return `${d.toLocaleDateString("vi-VN", { ...TZ, day: "numeric", month: "numeric", year: "numeric" })}, ${time}`;
};
const typing = (t: EventTarget) => t instanceof HTMLElement && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName));
const errText = (e: unknown, fallback: string) => (e instanceof ApiError ? e.message : fallback);

// Biểu tượng thư mục lớn (vẽ theo dáng thư mục của Finder, màu vàng thương hiệu)
function FolderArt({ size }: { size: number }) {
  return (
    <svg className="c-fd-folder" width={size} height={size * 0.8} viewBox="0 0 100 80" aria-hidden="true" focusable="false">
      <path d="M6 10a6 6 0 0 1 6-6h24l8 8h44a6 6 0 0 1 6 6v6H6z" className="c-fd-folder__back" />
      <rect x="4" y="18" width="92" height="58" rx="6" className="c-fd-folder__front" />
      <path d="M4 26h92" className="c-fd-folder__line" />
    </svg>
  );
}

// Ô đổi tên tại chỗ (Enter lưu, Esc huỷ, bấm ra ngoài cũng lưu)
function RenameBox({ value, onDone, multiline }: { value: string; onDone: (v: string | null) => void; multiline?: boolean }) {
  const [v, setV] = useState(value);
  const done = useRef(false);
  const finish = (x: string | null) => {
    if (done.current) return;
    done.current = true;
    onDone(x);
  };
  const props = {
    className: "c-fd-rename",
    value: v,
    autoFocus: true,
    "aria-label": multiline ? "Mô tả ảnh" : "Tên thư mục",
    onFocus: (e: { currentTarget: HTMLInputElement | HTMLTextAreaElement }) => e.currentTarget.select(),
    onChange: (e: { currentTarget: HTMLInputElement | HTMLTextAreaElement }) => setV(e.currentTarget.value),
    onBlur: () => finish(v),
    onKeyDown: (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        finish(v);
      } else if (e.key === "Escape") {
        e.preventDefault();
        finish(null);
      }
    },
    onClick: (e: MouseEvent) => e.stopPropagation(),
    onDoubleClick: (e: MouseEvent) => e.stopPropagation(),
  };
  return multiline ? <textarea rows={3} {...props} /> : <input {...props} />;
}

// Menu chuột phải: phím mũi tên để di chuyển, Esc hoặc bấm ra ngoài để đóng
function ContextMenu({ x, y, items, onClose }: { x: number; y: number; items: MenuItem[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: x, top: y });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      left: Math.max(4, Math.min(x, innerWidth - r.width - 4)),
      top: Math.max(4, Math.min(y, innerHeight - r.height - 4)),
    });
    el.querySelector<HTMLButtonElement>("button")?.focus();
  }, [x, y]);
  useEffect(() => {
    const away = (e: Event) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("pointerdown", away, true);
    addEventListener("resize", onClose);
    addEventListener("blur", onClose);
    return () => {
      document.removeEventListener("pointerdown", away, true);
      removeEventListener("resize", onClose);
      removeEventListener("blur", onClose);
    };
  }, [onClose]);
  const onKey = (e: KeyboardEvent) => {
    e.stopPropagation();
    const btns = [...(ref.current?.querySelectorAll<HTMLButtonElement>("button") ?? [])];
    const i = btns.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      btns[(i + (e.key === "ArrowDown" ? 1 : btns.length - 1)) % btns.length]?.focus();
    }
  };
  return (
    <div ref={ref} className="c-fd-menu" role="menu" style={pos} onKeyDown={onKey} onContextMenu={(e) => e.preventDefault()}>
      {items.map((it, i) =>
        it === "sep" ? (
          <hr key={i} />
        ) : (
          <button
            key={i}
            type="button"
            role={it.checked === undefined ? "menuitem" : "menuitemradio"}
            aria-checked={it.checked}
            className={it.danger ? "is-danger" : ""}
            onClick={() => {
              onClose();
              it.onSelect();
            }}
          >
            <span className="c-fd-menu__check">{it.checked ? "✓" : ""}</span>
            <span>{it.label}</span>
            {it.hint ? <kbd>{it.hint}</kbd> : null}
          </button>
        ),
      )}
    </div>
  );
}

// Xem nhanh (phím cách): ảnh lớn, mũi tên trái/phải để xem ảnh kế bên
function QuickLook({ list, id, onMove, onClose }: { list: MediaItem[]; id: number; onMove: (id: number) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const i = list.findIndex((m) => m.id === id);
  const m = list[i];
  useEffect(() => {
    ref.current?.focus();
  }, []);
  if (!m) return null;
  const step = (d: number) => list.length > 1 && onMove(list[(i + d + list.length) % list.length].id);
  return (
    <div
      ref={ref}
      className="c-fd-look"
      role="dialog"
      aria-modal="true"
      aria-label={`Xem nhanh: ${m.alt}`}
      tabIndex={-1}
      onClick={onClose}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Escape" || e.key === " ") {
          e.preventDefault();
          onClose();
        } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          step(1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          step(-1);
        }
      }}
    >
      <div className="c-fd-look__win" onClick={(e) => e.stopPropagation()}>
        <div className="c-fd-look__bar">
          <button type="button" className="c-fd-tool" onClick={onClose} aria-label="Đóng (phím cách)">
            <Icon name="close" size={16} />
          </button>
          <strong>{m.alt}</strong>
          <span>
            {i + 1}/{list.length}
          </span>
          <a className="c-fd-tool c-fd-tool--text" href={m.url} target="_blank" rel="noopener">
            Mở ảnh gốc
          </a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- ảnh lớn từ Cloudinary */}
        <img key={m.id} src={fit(m.url, 1600)} alt={m.alt} />
        <div className="c-fd-look__meta">
          {m.filename}
          {m.width ? ` · ${m.width}×${m.height}` : ""} · {fmtSize(m.filesize)}
        </div>
        {list.length > 1 ? (
          <>
            <button type="button" className="c-fd-look__nav c-fd-look__nav--prev" onClick={() => step(-1)} aria-label="Ảnh trước">
              ‹
            </button>
            <button type="button" className="c-fd-look__nav c-fd-look__nav--next" onClick={() => step(1)} aria-label="Ảnh sau">
              ›
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function Finder({ pick }: { pick?: Pick }) {
  const [lib, setLib] = useState<MediaLibrary | null>(null);
  const [error, setError] = useState("");
  const [loc, setLoc] = useState<Loc>(ROOT);
  const [hist, setHist] = useState<{ back: Loc[]; fwd: Loc[] }>({
    back: [],
    fwd: [],
  });
  const [q, setQ] = useState("");
  const [prefs, setPrefs] = useState<Prefs>(pick ? { ...DEFAULT_PREFS, info: false } : DEFAULT_PREFS);
  const [sel, setSel] = useState<string[]>([]);
  const [anchor, setAnchor] = useState<string | null>(null);
  // Hộp chọn ảnh: ảnh đã đánh dấu để chọn (giữ qua các thư mục, đúng thứ tự bấm)
  const [picked, setPicked] = useState<number[]>([]);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    items: MenuItem[];
  } | null>(null);
  const [look, setLook] = useState<number | null>(null);
  const [moving, setMoving] = useState<string[] | null>(null);
  const [dropOn, setDropOn] = useState<string | null>(null);
  const [closed, setClosed] = useState<number[]>([]);
  const [band, setBand] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [toast, say] = useToast();
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Kiểu xem đã chọn lần trước (lưu trong trình duyệt), áp dụng cùng lúc dữ liệu về để không nháy giao diện
  useEffect(() => {
    let saved: Partial<Prefs> | null = null;
    try {
      saved = JSON.parse(localStorage.getItem(PREFS_KEY) ?? "null") as Partial<Prefs> | null;
    } catch {}
    api<MediaLibrary>(pick ? "media" : "media?usage=1")
      .then((r) => {
        setLib({ media: r.media, folders: r.folders ?? [], usage: r.usage });
        if (saved)
          setPrefs((p) => ({
            ...p,
            ...saved,
            info: pick ? false : (saved.info ?? p.info),
          }));
      })
      .catch((e) => setError(errText(e, "Không tải được thư viện ảnh.")));
  }, [pick]);
  const setPref = (patch: Partial<Prefs>) =>
    setPrefs((p) => {
      const next = { ...p, ...patch };
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

  // ---------- Dữ liệu suy ra ----------
  const media = useMemo(() => lib?.media ?? [], [lib]);
  const folders = useMemo(() => lib?.folders ?? [], [lib]);
  const usage = lib?.usage;
  const folderById = useMemo(() => new Map(folders.map((f) => [f.id, f])), [folders]);
  const countIn = useMemo(() => {
    const c = new Map<number | null, number>();
    for (const m of media) c.set(m.folderId ?? null, (c.get(m.folderId ?? null) ?? 0) + 1);
    return c;
  }, [media]);
  const childrenOf = (id: number | null) => folders.filter((f) => f.parentId === id).sort((a, b) => a.name.localeCompare(b.name, "vi", { numeric: true }));
  const pathOf = (id: number | null) => {
    const out: MediaFolder[] = [];
    for (let f = id ? folderById.get(id) : undefined; f && out.length < 50; f = f.parentId ? folderById.get(f.parentId) : undefined) out.unshift(f);
    return out;
  };
  const folderLabel = (id: number | null | undefined) => (id ? (folderById.get(id)?.name ?? "Thư viện ảnh") : "Thư viện ảnh");
  const disabled = new Set(pick?.disabled ?? []);
  const searching = q.trim().length > 0;
  const here = loc.kind === "folder" ? loc.id : null;

  const entries = useMemo<Entry[]>(() => {
    const needle = q.trim().toLowerCase();
    let fs: MediaFolder[] = [];
    let ms: MediaItem[];
    if (needle) {
      fs = folders.filter((f) => f.name.toLowerCase().includes(needle));
      ms = media.filter((m) => m.alt.toLowerCase().includes(needle) || m.filename.includes(needle));
    } else if (loc.kind === "all") ms = media;
    else if (loc.kind === "unused") ms = media.filter((m) => !usage?.[m.id]?.length);
    else {
      fs = folders.filter((f) => f.parentId === loc.id);
      ms = media.filter((m) => (m.folderId ?? null) === loc.id);
    }
    const list: Entry[] = [
      ...fs.map((f) => ({ key: fk(f.id), kind: "folder" as const, folder: f })),
      ...ms.map((m) => ({ key: mk(m.id), kind: "image" as const, media: m })),
    ];
    const size = (e: Entry) => (e.kind === "folder" ? 0 : (e.media.filesize ?? 0));
    const date = (e: Entry) => (e.kind === "folder" ? e.folder.createdAt : e.media.createdAt);
    const kind = (e: Entry) => (e.kind === "folder" ? "" : kindOf(e.media));
    const byName = (a: Entry, b: Entry) =>
      nameOf(a).localeCompare(nameOf(b), "vi", {
        numeric: true,
        sensitivity: "base",
      });
    return list.sort((a, b) => {
      // Thư mục luôn nằm trên, như Finder bật "Giữ thư mục ở trên cùng"
      if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
      const r =
        prefs.sort === "name"
          ? byName(a, b)
          : prefs.sort === "size"
            ? size(a) - size(b)
            : prefs.sort === "kind"
              ? kind(a).localeCompare(kind(b)) || byName(a, b)
              : date(a).localeCompare(date(b));
      return prefs.dir === "asc" ? r : -r;
    });
  }, [q, folders, media, usage, loc, prefs.sort, prefs.dir]);
  const byKey = useMemo(() => new Map(entries.map((e) => [e.key, e])), [entries]);
  const indexOf = (k: string | null) => (k ? entries.findIndex((e) => e.key === k) : -1);
  const images = entries.flatMap((e) => (e.kind === "image" ? [e.media] : []));
  const selected = sel.map((k) => byKey.get(k)).filter((e): e is Entry => Boolean(e));
  const selImages = selected.flatMap((e) => (e.kind === "image" ? [e.media] : []));
  const focus = selected.at(-1) ?? null;
  const isOn = (e: Entry) => (pick && e.kind === "image" ? picked.includes(e.media.id) : sel.includes(e.key));
  const off = (e: Entry) => e.kind === "image" && disabled.has(e.media.id);

  // ---------- Đi lại giữa các thư mục ----------
  const go = (next: Loc) => {
    setQ("");
    if (sameLoc(next, loc) && !searching) return;
    setHist((h) => ({ back: [...h.back, loc].slice(-50), fwd: [] }));
    setLoc(next);
    setSel([]);
    setAnchor(null);
  };
  const back = () => {
    const prev = hist.back.at(-1);
    if (!prev) return;
    setHist((h) => ({ back: h.back.slice(0, -1), fwd: [loc, ...h.fwd] }));
    setLoc(prev);
    setSel([]);
  };
  const forward = () => {
    const next = hist.fwd[0];
    if (!next) return;
    setHist((h) => ({ back: [...h.back, loc], fwd: h.fwd.slice(1) }));
    setLoc(next);
    setSel([]);
  };
  const up = () => {
    if (loc.kind === "folder" && loc.id !== null) {
      const from = loc.id;
      go({ kind: "folder", id: folderById.get(from)?.parentId ?? null });
      setSel([fk(from)]);
    }
  };
  const title = searching ? `Tìm “${q.trim()}”` : loc.kind === "all" ? "Tất cả ảnh" : loc.kind === "unused" ? "Chưa dùng ở đâu" : folderLabel(loc.id);

  // ---------- Thay đổi dữ liệu ----------
  const patchMedia = (ids: number[], patch: Partial<MediaItem>) =>
    setLib(
      (l) =>
        l && {
          ...l,
          media: l.media.map((m) => (ids.includes(m.id) ? { ...m, ...patch } : m)),
        },
    );
  const patchFolder = (id: number, patch: Partial<MediaFolder>) =>
    setLib(
      (l) =>
        l && {
          ...l,
          folders: l.folders.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        },
    );

  const uploads = useUploads((added) => {
    setLib((l) => l && { ...l, media: [...added, ...l.media] });
    if (pick) {
      setPicked((p) => (pick.multiple ? [...p, ...added.map((m) => m.id)] : [added[0].id]));
      setSel([mk(added[0].id)]);
    } else setSel(added.map((m) => mk(m.id)));
    say(`Đã tải lên ${added.length} ảnh${here ? ` vào “${folderLabel(here)}”` : ""}.`);
  }, here);

  const rename = async (e: Entry, value: string | null) => {
    setRenaming(null);
    rootRef.current?.focus();
    const v = value?.trim() ?? "";
    if (!v || v === nameOf(e)) return;
    try {
      if (e.kind === "folder") {
        await api(`media/folders/${e.folder.id}`, {
          method: "PATCH",
          body: { name: v },
        });
        patchFolder(e.folder.id, { name: v });
      } else {
        await api(`media/${e.media.id}`, { method: "PATCH", body: { alt: v } });
        patchMedia([e.media.id], { alt: v });
        say("Đã lưu mô tả ảnh.");
      }
    } catch (err) {
      say(errText(err, "Không lưu được."));
    }
  };

  const newFolder = async (withKeys: string[] = []) => {
    const parent = searching || loc.kind !== "folder" ? null : loc.id;
    const names = new Set(folders.filter((f) => f.parentId === parent).map((f) => f.name));
    let name = "Thư mục mới";
    for (let i = 2; names.has(name); i++) name = `Thư mục mới ${i}`;
    try {
      const r = await api<{ folder: MediaFolder }>("media/folders", {
        body: { name, parentId: parent },
      });
      const f = r.folder;
      setLib((l) => l && { ...l, folders: [...l.folders, f] });
      const ids = withKeys.flatMap((k) => (k.startsWith("m") ? [Number(k.slice(1))] : []));
      if (ids.length) {
        await api("media/move", { body: { ids, folderId: f.id } });
        patchMedia(ids, { folderId: f.id });
      }
      if (searching || loc.kind !== "folder") {
        setQ("");
        setHist((h) => ({ back: [...h.back, loc], fwd: [] }));
        setLoc(ROOT);
      }
      setSel([fk(f.id)]);
      setAnchor(fk(f.id));
      setRenaming(fk(f.id));
    } catch (err) {
      say(errText(err, "Không tạo được thư mục."));
    }
  };

  const moveTo = async (keys: string[], target: number | null) => {
    const ids = keys.flatMap((k) => {
      const m = k.startsWith("m") ? media.find((x) => x.id === Number(k.slice(1))) : undefined;
      return m && (m.folderId ?? null) !== target ? [m.id] : [];
    });
    // Không chuyển thư mục vào chính nó hay thư mục con của nó
    const into = new Set([target, ...pathOf(target).map((f) => f.id)]);
    const fids = keys.flatMap((k) => {
      const f = k.startsWith("f") ? folderById.get(Number(k.slice(1))) : undefined;
      return f && !into.has(f.id) && f.parentId !== target ? [f.id] : [];
    });
    if (!ids.length && !fids.length) return;
    try {
      if (ids.length) await api("media/move", { body: { ids, folderId: target } });
      for (const id of fids)
        await api(`media/folders/${id}`, {
          method: "PATCH",
          body: { parentId: target },
        });
      setLib(
        (l) =>
          l && {
            ...l,
            media: l.media.map((m) => (ids.includes(m.id) ? { ...m, folderId: target } : m)),
            folders: l.folders.map((f) => (fids.includes(f.id) ? { ...f, parentId: target } : f)),
          },
      );
      setSel((s) => (loc.kind === "folder" && !searching ? s.filter((k) => !keys.includes(k)) : s));
      say(`Đã chuyển ${ids.length + fids.length} mục vào “${folderLabel(target)}”.`);
    } catch (err) {
      say(errText(err, "Không chuyển được."));
    }
  };

  const remove = async (keys: string[]) => {
    if (pick) return;
    const ens = keys.map((k) => byKey.get(k)).filter((e): e is Entry => Boolean(e));
    const ms = ens.flatMap((e) => (e.kind === "image" ? [e.media] : []));
    const fs = ens.flatMap((e) => (e.kind === "folder" ? [e.folder] : []));
    if (!ms.length && !fs.length) return;
    const lines: string[] = [];
    if (ms.length) lines.push(`${ms.length === 1 ? `Xoá ảnh “${ms[0].alt}”` : `Xoá ${ms.length} ảnh`}? Ảnh bị xoá khỏi Cloudinary, không khôi phục được.`);
    const used = ms.filter((m) => usage?.[m.id]?.length);
    if (used.length) {
      const where = [...new Set(used.flatMap((m) => usage![m.id].map((u) => `${u.label} “${u.title}”`)))];
      lines.push(
        `${used.length} ảnh đang dùng ở ${where.slice(0, 4).join(", ")}${where.length > 4 ? ` và ${where.length - 4} chỗ khác` : ""}. Xoá thì các chỗ đó mất ảnh.`,
      );
    }
    for (const f of fs) lines.push(`Xoá thư mục “${f.name}”? Ảnh và thư mục bên trong chuyển ra “${folderLabel(f.parentId)}”, không bị xoá.`);
    if (!window.confirm(lines.join("\n\n"))) return;
    const failed: string[] = [];
    for (const f of fs) {
      try {
        await api(`media/folders/${f.id}`, { method: "DELETE", body: {} });
        setLib(
          (l) =>
            l && {
              ...l,
              folders: l.folders.filter((x) => x.id !== f.id).map((x) => (x.parentId === f.id ? { ...x, parentId: f.parentId } : x)),
              media: l.media.map((m) => (m.folderId === f.id ? { ...m, folderId: f.parentId } : m)),
            },
        );
        if (loc.kind === "folder" && loc.id === f.id) setLoc({ kind: "folder", id: f.parentId });
      } catch (err) {
        failed.push(`${f.name}: ${errText(err, "không xoá được.")}`);
      }
    }
    const gone: number[] = [];
    for (const m of ms) {
      try {
        await api(`media/${m.id}`, { method: "DELETE", body: {} });
        gone.push(m.id);
      } catch (err) {
        failed.push(errText(err, `${m.alt}: không xoá được.`));
      }
    }
    setLib((l) => l && { ...l, media: l.media.filter((m) => !gone.includes(m.id)) });
    setSel([]);
    if (failed.length) window.alert(failed.join("\n"));
    else say(`Đã xoá ${gone.length + fs.length} mục.`);
  };

  const copyUrl = (m: MediaItem) =>
    navigator.clipboard.writeText(m.url).then(
      () => say("Đã sao chép đường dẫn ảnh."),
      () => say("Trình duyệt không cho sao chép."),
    );

  const confirmPick = (extra?: MediaItem) => {
    if (!pick) return;
    const ids = extra && !picked.includes(extra.id) ? (pick.multiple ? [...picked, extra.id] : [extra.id]) : picked;
    const items = ids.map((id) => media.find((m) => m.id === id)).filter((m): m is MediaItem => Boolean(m));
    if (items.length) pick.onPick(items);
  };

  // ---------- Chọn ----------
  const choose = (k: string, e: { shiftKey: boolean; metaKey: boolean; ctrlKey: boolean }) => {
    const en = byKey.get(k);
    if (!en || off(en)) return;
    const range = () => {
      const a = indexOf(anchor);
      const b = indexOf(k);
      return a < 0 ? [en] : entries.slice(Math.min(a, b), Math.max(a, b) + 1).filter((x) => !off(x));
    };
    if (pick) {
      setSel([k]);
      if (en.kind !== "image") return setAnchor(k);
      if (!pick.multiple) {
        setAnchor(k);
        return setPicked([en.media.id]);
      }
      if (e.shiftKey && anchor) {
        const ids = range().flatMap((x) => (x.kind === "image" ? [x.media.id] : []));
        return setPicked((p) => [...p, ...ids.filter((id) => !p.includes(id))]);
      }
      setAnchor(k);
      return setPicked((p) => (p.includes(en.media.id) ? p.filter((x) => x !== en.media.id) : [...p, en.media.id]));
    }
    if (e.shiftKey && anchor) {
      const keys = range().map((x) => x.key);
      return setSel(e.metaKey || e.ctrlKey ? [...sel.filter((x) => !keys.includes(x)), ...keys] : keys);
    }
    setAnchor(k);
    if (e.metaKey || e.ctrlKey) return setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
    setSel([k]);
  };
  const open = (en: Entry) => {
    if (en.kind === "folder") return go({ kind: "folder", id: en.folder.id });
    if (off(en)) return;
    if (pick) return confirmPick(en.media);
    setLook(en.media.id);
  };

  // Khung chọn: bấm giữ chuột ở chỗ trống rồi kéo để chọn nhiều mục (giữ ⌘/Ctrl/Shift để chọn thêm)
  const bandStart = useRef<{
    x: number;
    y: number;
    base: string[];
    moved: boolean;
  } | null>(null);
  const local = (e: { clientX: number; clientY: number }) => {
    const el = bodyRef.current!;
    const r = el.getBoundingClientRect();
    return {
      x: e.clientX - r.left + el.scrollLeft,
      y: e.clientY - r.top + el.scrollTop,
    };
  };
  const onBodyDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest("[data-key], button, input, textarea, a, select, th")) return;
    rootRef.current?.focus({ preventScroll: true });
    if (pick || prefs.view === "gallery") return void (pick ? null : setSel([]));
    e.currentTarget.setPointerCapture(e.pointerId);
    bandStart.current = {
      ...local(e),
      base: e.metaKey || e.ctrlKey || e.shiftKey ? sel : [],
      moved: false,
    };
  };
  const onBodyMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = bandStart.current;
    if (!s) return;
    const p = local(e);
    if (!s.moved && Math.abs(p.x - s.x) + Math.abs(p.y - s.y) < 4) return;
    s.moved = true;
    const box = {
      x: Math.min(s.x, p.x),
      y: Math.min(s.y, p.y),
      w: Math.abs(p.x - s.x),
      h: Math.abs(p.y - s.y),
    };
    setBand(box);
    const el = bodyRef.current!;
    const r = el.getBoundingClientRect();
    const hit: string[] = [];
    el.querySelectorAll<HTMLElement>("[data-key]").forEach((n) => {
      const b = n.getBoundingClientRect();
      const x = b.left - r.left + el.scrollLeft;
      const y = b.top - r.top + el.scrollTop;
      if (x < box.x + box.w && x + b.width > box.x && y < box.y + box.h && y + b.height > box.y) hit.push(n.dataset.key!);
    });
    setSel([...s.base.filter((k) => !hit.includes(k)), ...hit.filter((k) => !off(byKey.get(k)!))]);
  };
  const onBodyUp = () => {
    const s = bandStart.current;
    bandStart.current = null;
    setBand(null);
    if (s && !s.moved && !s.base.length) setSel([]);
  };

  // Kéo mục trong thư viện để thả vào thư mục (trên lưới, thanh bên hoặc thanh đường dẫn)
  const onDragStart = (e: DragEvent, en: Entry) => {
    const keys = sel.includes(en.key) ? sel : [en.key];
    if (!sel.includes(en.key)) setSel([en.key]);
    e.dataTransfer.setData(DRAG_TYPE, JSON.stringify(keys));
    e.dataTransfer.effectAllowed = "move";
    const ghost = document.createElement("div");
    ghost.className = "c-fd-ghost";
    ghost.textContent = keys.length > 1 ? `${keys.length} mục` : nameOf(en);
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, -8, -8);
    setTimeout(() => ghost.remove(), 0);
  };
  const dropProps = (target: number | null, id: string) => ({
    onDragOver: (e: DragEvent) => {
      if (!e.dataTransfer.types.includes(DRAG_TYPE)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dropOn !== id) setDropOn(id);
    },
    onDragLeave: () => setDropOn((d) => (d === id ? null : d)),
    onDrop: (e: DragEvent) => {
      if (!e.dataTransfer.types.includes(DRAG_TYPE)) return;
      e.preventDefault();
      e.stopPropagation();
      setDropOn(null);
      try {
        moveTo(JSON.parse(e.dataTransfer.getData(DRAG_TYPE) || "[]") as string[], target);
      } catch {}
    },
  });

  // ---------- Menu chuột phải ----------
  const itemMenu = (keys: string[]): MenuItem[] => {
    const ens = keys.map((k) => byKey.get(k)).filter((e): e is Entry => Boolean(e));
    const ms = ens.flatMap((e) => (e.kind === "image" ? [e.media] : []));
    const one = ens.length === 1 ? ens[0] : null;
    const items: MenuItem[] = [];
    if (one?.kind === "folder") items.push({ label: "Mở", hint: "⌘↓", onSelect: () => open(one) });
    if (ms.length)
      items.push({
        label: "Xem nhanh",
        hint: "Phím cách",
        onSelect: () => setLook(ms[0].id),
      });
    if (pick && ms.length && !off(ens[0]))
      items.push({
        label: pick.multiple ? `Chọn ${ms.length > 1 ? `${ms.length} ảnh` : "ảnh này"}` : "Chọn ảnh này",
        onSelect: () => confirmPick(ms[0]),
      });
    if (one?.kind === "image") {
      items.push({
        label: "Mở ảnh gốc ở thẻ mới",
        onSelect: () => window.open(one.media.url, "_blank", "noopener"),
      });
      items.push({
        label: "Sao chép đường dẫn ảnh",
        onSelect: () => copyUrl(one.media),
      });
      if ((searching || loc.kind !== "folder") && one.media.folderId !== undefined)
        items.push({
          label: "Hiện trong thư mục",
          onSelect: () => {
            go({ kind: "folder", id: one.media.folderId ?? null });
            setSel([one.key]);
          },
        });
    }
    if (one)
      items.push("sep", {
        label: one.kind === "folder" ? "Đổi tên" : "Sửa mô tả ảnh",
        hint: "↩",
        onSelect: () => setRenaming(one.key),
      });
    items.push("sep");
    if (ms.length)
      items.push({
        label: `Thư mục mới chứa ${ms.length} ảnh này`,
        onSelect: () => newFolder(keys),
      });
    items.push({
      label: "Chuyển vào thư mục…",
      onSelect: () => setMoving(keys),
    });
    if (!pick)
      items.push("sep", {
        label: ens.length > 1 ? `Xoá ${ens.length} mục` : one?.kind === "folder" ? "Xoá thư mục" : "Xoá ảnh",
        hint: "⌘⌫",
        danger: true,
        onSelect: () => remove(keys),
      });
    return items;
  };
  const emptyMenu = (): MenuItem[] => [
    { label: "Thư mục mới", onSelect: () => newFolder() },
    { label: "Tải ảnh lên…", onSelect: () => fileRef.current?.click() },
    "sep",
    ...(Object.keys(SORTS) as SortKey[]).map((k) => ({
      label: `Sắp xếp theo ${SORTS[k].toLowerCase()}`,
      checked: prefs.sort === k,
      onSelect: () =>
        setPref({
          sort: k,
          dir: k === "name" || k === "kind" ? "asc" : "desc",
        }),
    })),
    "sep",
    {
      label: "Chọn tất cả",
      hint: "⌘A",
      onSelect: () => !pick && setSel(entries.filter((e) => !off(e)).map((e) => e.key)),
    },
  ];
  const onItemMenu = (e: MouseEvent, en: Entry) => {
    e.preventDefault();
    e.stopPropagation();
    const keys = sel.includes(en.key) && !pick ? sel : [en.key];
    if (!sel.includes(en.key) || pick) setSel([en.key]);
    setMenu({ x: e.clientX, y: e.clientY, items: itemMenu(keys) });
  };
  const onFolderMenu = (e: MouseEvent, f: MediaFolder) => {
    e.preventDefault();
    const items: MenuItem[] = [
      { label: "Mở", onSelect: () => go({ kind: "folder", id: f.id }) },
      {
        label: "Đổi tên…",
        onSelect: () => {
          const v = window.prompt("Tên thư mục", f.name);
          if (v !== null) rename({ key: fk(f.id), kind: "folder", folder: f }, v);
        },
      },
      {
        label: "Thư mục con mới",
        onSelect: () =>
          api<{ folder: MediaFolder }>("media/folders", {
            body: { name: "Thư mục mới", parentId: f.id },
          }).then(
            (r) => {
              setLib((l) => l && { ...l, folders: [...l.folders, r.folder] });
              setClosed((c) => c.filter((x) => x !== f.id));
            },
            (err) => say(errText(err, "Không tạo được thư mục.")),
          ),
      },
    ];
    if (!pick)
      items.push("sep", {
        label: "Xoá thư mục",
        danger: true,
        onSelect: async () => {
          if (!window.confirm(`Xoá thư mục “${f.name}”? Ảnh và thư mục bên trong chuyển ra “${folderLabel(f.parentId)}”, không bị xoá.`)) return;
          try {
            await api(`media/folders/${f.id}`, { method: "DELETE", body: {} });
            setLib(
              (l) =>
                l && {
                  ...l,
                  folders: l.folders.filter((x) => x.id !== f.id).map((x) => (x.parentId === f.id ? { ...x, parentId: f.parentId } : x)),
                  media: l.media.map((m) => (m.folderId === f.id ? { ...m, folderId: f.parentId } : m)),
                },
            );
            if (loc.kind === "folder" && loc.id === f.id) setLoc({ kind: "folder", id: f.parentId });
            say("Đã xoá thư mục.");
          } catch (err) {
            say(errText(err, "Không xoá được thư mục."));
          }
        },
      });
    setMenu({ x: e.clientX, y: e.clientY, items });
  };

  // ---------- Bàn phím (như Finder) ----------
  const columns = () => {
    if (prefs.view !== "icons") return 1;
    const grid = bodyRef.current?.querySelector(".c-fd-grid");
    return grid ? Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(" ").length) : 1;
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (typing(e.target) || renaming || menu || look !== null) return;
    const mod = e.metaKey || e.ctrlKey;
    const cur = indexOf(sel.at(-1) ?? anchor);
    const k = e.key;
    const moveFocus = (to: number) => {
      const n = Math.max(0, Math.min(entries.length - 1, to));
      const en = entries[n];
      if (!en) return;
      e.preventDefault();
      if (e.shiftKey && !pick) {
        const a = Math.max(0, indexOf(anchor));
        setSel(
          entries
            .slice(Math.min(a, n), Math.max(a, n) + 1)
            .filter((x) => !off(x))
            .map((x) => x.key),
        );
      } else {
        setSel([en.key]);
        setAnchor(en.key);
      }
      bodyRef.current?.querySelector(`[data-key="${en.key}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
    };
    if (mod && k === "ArrowUp") return void (e.preventDefault(), up());
    if (mod && k === "ArrowDown" && focus) return void (e.preventDefault(), open(focus));
    if (mod && k === "[") return void (e.preventDefault(), back());
    if (mod && k === "]") return void (e.preventDefault(), forward());
    if (mod && k.toLowerCase() === "a" && !pick) return void (e.preventDefault(), setSel(entries.filter((x) => !off(x)).map((x) => x.key)));
    if (mod && k.toLowerCase() === "i") return void (e.preventDefault(), setPref({ info: !prefs.info }));
    if (mod && (k === "Backspace" || k === "Delete") && sel.length) return void (e.preventDefault(), remove(sel));
    if (k === "Escape" && sel.length && !pick) return void (e.preventDefault(), setSel([]));
    if (k === " " && focus) {
      e.preventDefault();
      const m = focus.kind === "image" ? focus.media : selImages[0];
      if (m) setLook(m.id);
      return;
    }
    if (k === "Enter") {
      e.preventDefault();
      if (pick && picked.length) return confirmPick();
      if (pick && focus) return open(focus);
      if (sel.length === 1 && focus) setRenaming(focus.key);
      return;
    }
    const cols = columns();
    const step =
      prefs.view === "gallery"
        ? { ArrowLeft: -1, ArrowRight: 1 }
        : prefs.view === "list"
          ? { ArrowUp: -1, ArrowDown: 1 }
          : { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -cols, ArrowDown: cols };
    const d = (step as Record<string, number>)[k];
    if (d !== undefined) moveFocus(cur < 0 ? 0 : cur + d);
    else if (k === "Home") moveFocus(0);
    else if (k === "End") moveFocus(entries.length - 1);
    else if (pick && k === " ") return;
  };

  // ---------- Hiển thị ----------
  const itemProps = (en: Entry) => ({
    "data-key": en.key,
    draggable: !off(en) && renaming !== en.key,
    "aria-disabled": off(en) || undefined,
    onClick: (e: MouseEvent) => choose(en.key, e),
    onDoubleClick: () => open(en),
    onContextMenu: (e: MouseEvent) => onItemMenu(e, en),
    onDragStart: (e: DragEvent) => onDragStart(e, en),
    ...(en.kind === "folder" ? dropProps(en.folder.id, en.key) : {}),
  });
  const cls = (base: string, en: Entry) =>
    `${base}${isOn(en) ? " is-sel" : ""}${pick && sel.includes(en.key) ? " is-focus" : ""}${off(en) ? " is-off" : ""}${dropOn === en.key ? " is-drop" : ""}`;
  const label = (en: Entry) =>
    renaming === en.key ? (
      <RenameBox value={nameOf(en)} multiline={en.kind === "image"} onDone={(v) => rename(en, v)} />
    ) : (
      <span className="c-fd-name">{nameOf(en)}</span>
    );
  const thumbOf = (en: Entry, px: number) =>
    en.kind === "folder" ? (
      <FolderArt size={px} />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element -- ảnh thu nhỏ từ Cloudinary
      <img src={fit(en.media.url, px > 160 ? 480 : 320)} alt="" loading="lazy" draggable={false} />
    );
  const badge = (en: Entry) => {
    if (off(en)) return <span className="c-fd-badge">Đã có</span>;
    if (pick?.multiple && en.kind === "image" && picked.includes(en.media.id)) return <span className="c-fd-check">{picked.indexOf(en.media.id) + 1}</span>;
    return null;
  };
  const usedLabel = (m: MediaItem) => {
    const u = usage?.[m.id];
    return u?.length ? (u.length === 1 ? `${u[0].label}: ${u[0].title}` : `${u.length} chỗ`) : "—";
  };
  const inFolder = searching || loc.kind !== "folder";

  const iconsView = (
    <div
      className="c-fd-grid"
      role="listbox"
      aria-multiselectable={!pick || pick.multiple}
      aria-label={title}
      style={{ "--fd-size": `${prefs.size}px` } as CSSProperties}
    >
      {entries.map((en) => (
        <div
          key={en.key}
          role="option"
          aria-selected={isOn(en)}
          className={cls("c-fd-icon", en)}
          {...itemProps(en)}
          title={en.kind === "image" ? `${en.media.alt}\n${en.media.filename}` : en.folder.name}
        >
          <div className="c-fd-icon__art">
            {thumbOf(en, prefs.size)}
            {badge(en)}
          </div>
          {label(en)}
          {en.kind === "folder" ? <small>{countIn.get(en.folder.id) ?? 0} ảnh</small> : inFolder ? <small>{folderLabel(en.media.folderId)}</small> : null}
        </div>
      ))}
    </div>
  );

  const sortHead = (key: SortKey, text: string, className = "") => (
    <th className={className} aria-sort={prefs.sort === key ? (prefs.dir === "asc" ? "ascending" : "descending") : undefined}>
      <button
        type="button"
        onClick={() =>
          setPref(
            prefs.sort === key
              ? { dir: prefs.dir === "asc" ? "desc" : "asc" }
              : {
                  sort: key,
                  dir: key === "name" || key === "kind" ? "asc" : "desc",
                },
          )
        }
      >
        {text}
        {prefs.sort === key ? <span aria-hidden="true">{prefs.dir === "asc" ? " ▲" : " ▼"}</span> : null}
      </button>
    </th>
  );
  const listView = (
    <table className="c-fd-list" role="grid" aria-label={title}>
      <thead>
        <tr>
          {sortHead("name", "Tên")}
          {inFolder ? <th className="c-fd-col-mid">Thư mục</th> : null}
          {sortHead("date", "Ngày thêm", "c-fd-col-mid")}
          {sortHead("size", "Dung lượng")}
          {sortHead("kind", "Loại", "c-fd-col-wide")}
          <th className="c-fd-col-wide">Kích thước</th>
          {pick ? null : <th className="c-fd-col-wide">Đang dùng ở</th>}
        </tr>
      </thead>
      <tbody>
        {entries.map((en) => (
          <tr key={en.key} aria-selected={isOn(en)} className={cls("c-fd-row", en)} {...itemProps(en)}>
            <td>
              <span className="c-fd-row__name">
                <span className="c-fd-row__thumb">{thumbOf(en, 28)}</span>
                {label(en)}
                {badge(en)}
              </span>
            </td>
            {inFolder ? <td className="c-fd-col-mid">{en.kind === "image" ? folderLabel(en.media.folderId) : folderLabel(en.folder.parentId)}</td> : null}
            <td className="c-fd-col-mid">{fmtDate(en.kind === "folder" ? en.folder.createdAt : en.media.createdAt)}</td>
            <td>{en.kind === "folder" ? `${countIn.get(en.folder.id) ?? 0} ảnh` : fmtSize(en.media.filesize)}</td>
            <td className="c-fd-col-wide">{en.kind === "folder" ? "Thư mục" : kindOf(en.media)}</td>
            <td className="c-fd-col-wide">{en.kind === "image" && en.media.width ? `${en.media.width}×${en.media.height}` : "—"}</td>
            {pick ? null : <td className="c-fd-col-wide">{en.kind === "image" ? usedLabel(en.media) : ""}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const shown = focus ?? entries[0] ?? null;
  const galleryView = (
    <div className="c-fd-gallery">
      <div className="c-fd-gallery__stage" onDoubleClick={() => shown && open(shown)}>
        {shown?.kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element -- ảnh lớn từ Cloudinary
          <img key={shown.key} src={fit(shown.media.url, 1400)} alt={shown.media.alt} />
        ) : shown ? (
          <FolderArt size={180} />
        ) : null}
      </div>
      <div className="c-fd-strip" role="listbox" aria-label={title}>
        {entries.map((en) => (
          <div key={en.key} role="option" aria-selected={isOn(en)} className={cls("c-fd-strip__item", en)} {...itemProps(en)} title={nameOf(en)}>
            {thumbOf(en, 72)}
            {badge(en)}
          </div>
        ))}
      </div>
    </div>
  );

  // Khung thông tin bên phải (⌘I), như "Hiện bản xem trước" của Finder
  const info = () => {
    if (selected.length > 1) {
      const total = selImages.reduce((s, m) => s + (m.filesize ?? 0), 0);
      return (
        <>
          <div className="c-fd-info__stack">
            {selImages.slice(0, 3).map((m, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- ảnh thu nhỏ từ Cloudinary
              <img key={m.id} src={fit(m.url, 320)} alt="" style={{ "--i": i } as CSSProperties} />
            ))}
          </div>
          <h3>{selected.length} mục</h3>
          <dl>
            <dt>Ảnh</dt>
            <dd>{selImages.length}</dd>
            <dt>Dung lượng</dt>
            <dd>{fmtSize(total)}</dd>
          </dl>
          <div className="c-fd-info__actions">
            <button type="button" className="c-btn c-btn--small" onClick={() => setMoving(sel)}>
              Chuyển vào thư mục…
            </button>
            {selImages.length ? (
              <button type="button" className="c-btn c-btn--small" onClick={() => newFolder(sel)}>
                Thư mục mới chứa các ảnh này
              </button>
            ) : null}
            {pick ? null : (
              <button type="button" className="c-btn c-btn--small c-btn--ghost c-btn--danger" onClick={() => remove(sel)}>
                Xoá {selected.length} mục
              </button>
            )}
          </div>
        </>
      );
    }
    const en = focus;
    if (!en) {
      const n = entries.length;
      return (
        <div className="c-fd-info__empty">
          <Icon name="media" size={36} />
          <h3>{title}</h3>
          <p>
            {n} mục · {fmtSize(images.reduce((s, m) => s + (m.filesize ?? 0), 0))}
          </p>
          <p>
            Bấm một ảnh để xem thông tin. Kéo ảnh từ máy tính vào đây để tải lên
            {here ? ` thư mục “${folderLabel(here)}”` : ""}.
          </p>
        </div>
      );
    }
    if (en.kind === "folder") {
      return (
        <>
          <div className="c-fd-info__art">
            <FolderArt size={120} />
          </div>
          <h3>{en.folder.name}</h3>
          <dl>
            <dt>Ảnh bên trong</dt>
            <dd>{countIn.get(en.folder.id) ?? 0}</dd>
            <dt>Thư mục con</dt>
            <dd>{folders.filter((f) => f.parentId === en.folder.id).length}</dd>
            <dt>Nằm trong</dt>
            <dd>{folderLabel(en.folder.parentId)}</dd>
            <dt>Tạo lúc</dt>
            <dd>{fmtDate(en.folder.createdAt)}</dd>
          </dl>
          <div className="c-fd-info__actions">
            <button type="button" className="c-btn c-btn--small c-btn--primary" onClick={() => open(en)}>
              Mở thư mục
            </button>
            <button type="button" className="c-btn c-btn--small" onClick={() => setRenaming(en.key)}>
              Đổi tên
            </button>
          </div>
        </>
      );
    }
    const m = en.media;
    const uses = usage?.[m.id] ?? [];
    return (
      <>
        <button type="button" className="c-fd-info__preview" onClick={() => setLook(m.id)} aria-label="Xem nhanh ảnh này (phím cách)">
          {/* eslint-disable-next-line @next/next/no-img-element -- ảnh xem trước từ Cloudinary */}
          <img src={fit(m.url, 640)} alt="" />
        </button>
        <label className="c-fd-info__alt">
          <span>Mô tả ảnh</span>
          <textarea
            key={m.id}
            className="c-textarea"
            rows={3}
            defaultValue={m.alt}
            disabled={off(en)}
            onBlur={(e) => rename(en, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
          />
          <small>Google và người khiếm thị đọc dòng này. Tả đúng nội dung ảnh, ví dụ “Phòng Deluxe giường đôi nhìn ra vườn”.</small>
        </label>
        <dl>
          <dt>Tên file</dt>
          <dd className="c-fd-break">{m.filename}</dd>
          <dt>Loại</dt>
          <dd>{kindOf(m)}</dd>
          <dt>Kích thước</dt>
          <dd>{m.width ? `${m.width} × ${m.height} px` : "—"}</dd>
          <dt>Dung lượng</dt>
          <dd>{fmtSize(m.filesize)}</dd>
          <dt>Thư mục</dt>
          <dd>{folderLabel(m.folderId)}</dd>
          <dt>Thêm lúc</dt>
          <dd>{fmtDate(m.createdAt)}</dd>
          {usage ? (
            <>
              <dt>Đang dùng ở</dt>
              <dd>
                {uses.length ? (
                  <ul className="c-fd-uses">
                    {uses.map((u) => (
                      <li key={u.href}>
                        {u.label}: <a href={u.href}>{u.title}</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  "Chưa dùng ở đâu"
                )}
              </dd>
            </>
          ) : null}
        </dl>
        <div className="c-fd-info__actions">
          {pick && !off(en) ? (
            <button type="button" className="c-btn c-btn--small c-btn--primary" onClick={() => confirmPick(m)}>
              Chọn ảnh này
            </button>
          ) : null}
          <a className="c-btn c-btn--small" href={m.url} target="_blank" rel="noopener">
            Mở ảnh gốc
          </a>
          <button type="button" className="c-btn c-btn--small" onClick={() => copyUrl(m)}>
            Sao chép đường dẫn
          </button>
          {pick ? null : (
            <button type="button" className="c-btn c-btn--small c-btn--ghost c-btn--danger" onClick={() => remove([en.key])}>
              Xoá ảnh
            </button>
          )}
        </div>
      </>
    );
  };

  const sideItem = (target: Loc, icon: ReactNode, text: string, count: number, dropId?: string) => {
    const on = !searching && sameLoc(target, loc);
    return (
      <li>
        <button
          type="button"
          className={`c-fd-side__item${on ? " is-on" : ""}${dropOn === dropId ? " is-drop" : ""}`}
          aria-current={on ? "page" : undefined}
          onClick={() => go(target)}
          {...(dropId ? dropProps(null, dropId) : {})}
        >
          <span className="c-fd-side__twisty" />
          {icon}
          <span className="c-fd-side__label">{text}</span>
          <small>{count}</small>
        </button>
      </li>
    );
  };
  const tree = (parent: number | null, depth: number): ReactNode =>
    childrenOf(parent).map((f) => {
      const kids = folders.some((x) => x.parentId === f.id);
      const shut = closed.includes(f.id);
      const on = !searching && loc.kind === "folder" && loc.id === f.id;
      const id = `s${f.id}`;
      return (
        <li key={f.id}>
          <div
            className={`c-fd-side__item${on ? " is-on" : ""}${dropOn === id ? " is-drop" : ""}`}
            style={{ "--depth": depth } as CSSProperties}
            onContextMenu={(e) => onFolderMenu(e, f)}
            {...dropProps(f.id, id)}
          >
            {kids ? (
              <button
                type="button"
                className="c-fd-side__twisty"
                aria-expanded={!shut}
                aria-label={shut ? `Mở rộng ${f.name}` : `Thu gọn ${f.name}`}
                onClick={() => setClosed((c) => (shut ? c.filter((x) => x !== f.id) : [...c, f.id]))}
              >
                <span aria-hidden="true">{shut ? "▸" : "▾"}</span>
              </button>
            ) : (
              <span className="c-fd-side__twisty" />
            )}
            <button type="button" className="c-fd-side__link" aria-current={on ? "page" : undefined} onClick={() => go({ kind: "folder", id: f.id })}>
              <Icon name="folder" size={16} />
              <span className="c-fd-side__label">{f.name}</span>
              <small>{countIn.get(f.id) ?? 0}</small>
            </button>
          </div>
          {kids && !shut ? <ul>{tree(f.id, depth + 1)}</ul> : null}
        </li>
      );
    });

  const crumbs = searching ? [] : loc.kind === "folder" ? pathOf(loc.id) : [];
  const selSize = selImages.reduce((s, m) => s + (m.filesize ?? 0), 0);
  const status = `${entries.length} mục${pick ? (picked.length ? `, đã chọn ${picked.length} ảnh` : "") : selected.length ? `, đã chọn ${selected.length}${selSize ? ` (${fmtSize(selSize)})` : ""}` : ""}`;

  return (
    <div
      ref={rootRef}
      className={`c-fd${prefs.info ? " has-info" : ""}${pick ? " c-fd--pick" : ""}`}
      tabIndex={-1}
      onKeyDown={onKey}
      onContextMenu={(e) => {
        if (typing(e.target) || (e.target as HTMLElement).closest(".c-fd-side, .c-fd-info, .c-fd-bar")) return;
        e.preventDefault();
        setSel([]);
        setMenu({ x: e.clientX, y: e.clientY, items: emptyMenu() });
      }}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        multiple
        hidden
        onChange={(e) => {
          const files = [...(e.target.files ?? [])];
          e.target.value = "";
          uploads.start(files);
        }}
      />
      <div className="c-fd-bar">
        <div className="c-fd-seg" role="group" aria-label="Đi lại">
          <button type="button" className="c-fd-tool" onClick={back} disabled={!hist.back.length} aria-label="Lùi (⌘[)" title="Lùi (⌘[)">
            <Icon name="back" size={16} />
          </button>
          <button type="button" className="c-fd-tool c-fd-tool--flip" onClick={forward} disabled={!hist.fwd.length} aria-label="Tiến (⌘])" title="Tiến (⌘])">
            <Icon name="back" size={16} />
          </button>
        </div>
        <h2 className="c-fd-title">{title}</h2>
        <div className="c-fd-seg" role="radiogroup" aria-label="Kiểu xem">
          {VIEWS.map((v) => (
            <button
              key={v.view}
              type="button"
              role="radio"
              aria-checked={prefs.view === v.view}
              className={`c-fd-tool${prefs.view === v.view ? " is-on" : ""}`}
              onClick={() => setPref({ view: v.view })}
              aria-label={v.label}
              title={v.label}
            >
              <Icon name={v.icon} size={16} />
            </button>
          ))}
        </div>
        <select
          className="c-fd-sort"
          aria-label="Sắp xếp"
          value={`${prefs.sort}:${prefs.dir}`}
          onChange={(e) => {
            const [sort, dir] = e.target.value.split(":") as [SortKey, "asc" | "desc"];
            setPref({ sort, dir });
          }}
        >
          <option value="date:desc">Mới thêm trước</option>
          <option value="date:asc">Cũ trước</option>
          <option value="name:asc">Tên A → Z</option>
          <option value="name:desc">Tên Z → A</option>
          <option value="size:desc">Dung lượng lớn trước</option>
          <option value="size:asc">Dung lượng nhỏ trước</option>
          <option value="kind:asc">Loại ảnh</option>
        </select>
        <button
          type="button"
          className="c-fd-tool"
          onClick={() => newFolder(sel.filter((k) => k.startsWith("m")).length > 1 ? sel : [])}
          aria-label="Thư mục mới"
          title="Thư mục mới"
        >
          <Icon name="folderPlus" size={17} />
        </button>
        <button
          type="button"
          className={`c-fd-tool${prefs.info ? " is-on" : ""}`}
          onClick={() => setPref({ info: !prefs.info })}
          aria-pressed={prefs.info}
          aria-label="Khung thông tin (⌘I)"
          title="Khung thông tin (⌘I)"
        >
          <Icon name="info" size={17} />
        </button>
        <label className="c-fd-search">
          <Icon name="search" size={15} />
          <input type="search" placeholder="Tìm ảnh, thư mục" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Tìm ảnh hoặc thư mục" />
        </label>
        <button type="button" className="c-btn c-btn--primary c-btn--small" disabled={Boolean(uploads.busy)} onClick={() => fileRef.current?.click()}>
          {uploads.busy || "Tải ảnh lên"}
        </button>
      </div>

      <nav className="c-fd-side" aria-label="Thư mục ảnh">
        <h3>Thư viện</h3>
        <ul>
          {sideItem(ROOT, <Icon name="media" size={16} />, "Thư viện ảnh", countIn.get(null) ?? 0, "sroot")}
          {sideItem({ kind: "all" }, <Icon name="viewIcons" size={16} />, "Tất cả ảnh", media.length)}
          {usage ? sideItem({ kind: "unused" }, <Icon name="eye" size={16} />, "Chưa dùng ở đâu", media.filter((m) => !usage[m.id]?.length).length) : null}
        </ul>
        <h3>
          Thư mục
          <button type="button" className="c-fd-side__add" onClick={() => newFolder()} aria-label="Thư mục mới" title="Thư mục mới">
            +
          </button>
        </h3>
        {folders.length ? <ul>{tree(null, 0)}</ul> : <p className="c-fd-side__hint">Bấm + để tạo thư mục, rồi kéo ảnh thả vào.</p>}
      </nav>

      <DropZone uploads={uploads} className="c-fd-main">
        <UploadErrors uploads={uploads} />
        {error ? <p className="c-alert c-alert--error">{error}</p> : null}
        <div
          ref={bodyRef}
          className={`c-fd-body c-fd-body--${prefs.view}`}
          onPointerDown={onBodyDown}
          onPointerMove={onBodyMove}
          onPointerUp={onBodyUp}
          onPointerCancel={onBodyUp}
          {...(loc.kind === "folder" && !searching ? dropProps(loc.id, "body") : {})}
        >
          {!lib && !error ? <p className="c-fd-empty">Đang mở thư viện…</p> : null}
          {lib && !entries.length ? (
            <div className="c-fd-empty">
              <Icon name={searching ? "search" : "folder"} size={40} />
              <p>
                {searching
                  ? `Không có ảnh hay thư mục nào khớp “${q.trim()}”.`
                  : loc.kind === "unused"
                    ? "Ảnh nào cũng đang được dùng."
                    : "Thư mục trống. Kéo ảnh từ máy tính thả vào đây, hoặc bấm Tải ảnh lên."}
              </p>
            </div>
          ) : null}
          {entries.length ? (prefs.view === "list" ? listView : prefs.view === "gallery" ? galleryView : iconsView) : null}
          {band ? (
            <div
              className="c-fd-band"
              style={{
                left: band.x,
                top: band.y,
                width: band.w,
                height: band.h,
              }}
            />
          ) : null}
        </div>
      </DropZone>

      {prefs.info ? (
        <aside className="c-fd-info" aria-label="Thông tin">
          {info()}
        </aside>
      ) : null}

      <div className="c-fd-foot">
        <nav className="c-fd-path" aria-label="Đường dẫn">
          <button type="button" className={dropOn === "proot" ? "is-drop" : ""} onClick={() => go(ROOT)} {...dropProps(null, "proot")}>
            <Icon name="media" size={14} /> Thư viện ảnh
          </button>
          {crumbs.map((f) => (
            <button
              key={f.id}
              type="button"
              className={dropOn === `p${f.id}` ? "is-drop" : ""}
              onClick={() => go({ kind: "folder", id: f.id })}
              {...dropProps(f.id, `p${f.id}`)}
            >
              <span aria-hidden="true">›</span> <Icon name="folder" size={14} /> {f.name}
            </button>
          ))}
          {!crumbs.length && (searching || loc.kind !== "folder") ? (
            <span>
              <span aria-hidden="true">›</span> {title}
            </span>
          ) : null}
        </nav>
        <span className="c-fd-status" aria-live="polite">
          {status}
        </span>
        {prefs.view === "icons" ? (
          <input
            className="c-fd-zoom"
            type="range"
            min={72}
            max={220}
            step={4}
            value={prefs.size}
            onChange={(e) => setPref({ size: Number(e.target.value) })}
            aria-label="Cỡ biểu tượng"
            title="Cỡ biểu tượng"
          />
        ) : null}
      </div>

      {pick ? (
        <div className="c-fd-pickbar">
          <span className="c-fd-pickbar__hint">
            {pick.multiple ? "Bấm ảnh để đánh dấu, bấm lần nữa để bỏ. Nhấp đúp hoặc Enter để chọn xong." : "Bấm ảnh rồi bấm Chọn, hoặc nhấp đúp vào ảnh."}
          </span>
          <button type="button" className="c-btn" onClick={pick.onCancel}>
            Huỷ
          </button>
          <button type="button" className="c-btn c-btn--primary" disabled={!picked.length} onClick={() => confirmPick()}>
            {pick.multiple ? `Thêm ${picked.length || ""} ảnh` : "Chọn"}
          </button>
        </div>
      ) : null}

      {menu ? <ContextMenu {...menu} onClose={() => setMenu(null)} /> : null}
      {look !== null ? (
        <QuickLook
          list={images.length ? images : media}
          id={look}
          onMove={(id) => {
            setLook(id);
            setSel([mk(id)]);
            setAnchor(mk(id));
          }}
          onClose={() => {
            setLook(null);
            rootRef.current?.focus();
          }}
        />
      ) : null}
      {moving ? (
        <MoveDialog
          folders={folders}
          childrenOf={childrenOf}
          onClose={() => setMoving(null)}
          onMove={(target) => {
            const keys = moving;
            setMoving(null);
            moveTo(keys, target);
          }}
        />
      ) : null}
      {toast}
    </div>
  );
}

// Hộp "Chuyển vào thư mục…": cây thư mục để chọn nơi đến
function MoveDialog({
  folders,
  childrenOf,
  onMove,
  onClose,
}: {
  folders: MediaFolder[];
  childrenOf: (id: number | null) => MediaFolder[];
  onMove: (target: number | null) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [target, setTarget] = useState<number | null>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  const row = (id: number | null, name: string, depth: number) => (
    <label key={id ?? "root"} className="c-fd-move__row" style={{ "--depth": depth } as CSSProperties}>
      <input type="radio" name="fd-move" checked={target === id} onChange={() => setTarget(id)} />
      <Icon name={id ? "folder" : "media"} size={16} /> {name}
    </label>
  );
  const tree = (parent: number | null, depth: number): ReactNode[] => childrenOf(parent).flatMap((f) => [row(f.id, f.name, depth), ...tree(f.id, depth + 1)]);
  return (
    <dialog ref={ref} className="c-dialog" onClose={onClose} onKeyDown={(e) => e.stopPropagation()}>
      <div className="c-dialog__head">
        <h2>Chuyển vào thư mục</h2>
        <button type="button" className="c-btn c-btn--ghost c-btn--small" onClick={onClose} aria-label="Đóng">
          ✕
        </button>
      </div>
      <div className="c-dialog__body c-fd-move">
        {row(null, "Thư viện ảnh (ngoài cùng)", 0)}
        {tree(null, 1)}
        {!folders.length ? <p className="c-muted">Chưa có thư mục nào. Đóng hộp này và bấm nút Thư mục mới.</p> : null}
      </div>
      <div className="c-dialog__foot">
        <button type="button" className="c-btn" onClick={onClose}>
          Huỷ
        </button>
        <button type="button" className="c-btn c-btn--primary" onClick={() => onMove(target)}>
          Chuyển
        </button>
      </div>
    </dialog>
  );
}
