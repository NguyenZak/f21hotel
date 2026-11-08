"use client";

import { Puck, useGetPuck, type Data, type Overrides } from "@puckeditor/core";
import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { editorConfig } from "@/blocks/editor-config";
import type { BlockMeta } from "@/blocks/types";

export type SaveResult = { ok: true; publishedAt?: string } | { ok: false; error: string };

type Status = { tone: "" | "ok" | "error"; text: string };

type Ctx = {
  saveDraft: (data: Data) => void;
  pending: boolean;
  status: Status;
  path: string;
  backHref: string;
};
const EditorCtx = createContext<Ctx | null>(null);

const timeVi = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" });

// Chữ tiếng Việt cho giao diện Puck
const dictionary = {
  "header-publish": "Xuất bản",
  "header-undo": "Hoàn tác",
  "header-redo": "Làm lại",
  "header-toggle-leftsidebar": "Ẩn/hiện cột trái",
  "header-toggle-rightsidebar": "Ẩn/hiện cột phải",
  "header-toggle-menubar": "Ẩn/hiện menu",
  "action-selectparent": "Chọn khối cha",
  "action-drag": "Kéo để đổi vị trí",
  "action-duplicate": "Nhân bản",
  "action-delete": "Xoá",
  "label-page": "Trang",
  "label-component": "Khối",
  "outline-empty": "Chưa có khối nào",
  "outline-item-collapse": "Thu gọn",
  "outline-item-expand": "Mở rộng",
  "outline-header-title": "Cấu trúc trang",
  "outline-header-collapseall": "Thu gọn tất cả",
  "outline-item-duplicate": "Nhân bản",
  "outline-item-delete": "Xoá",
  "drawer-category-collapse": "Thu gọn {title}",
  "drawer-category-expand": "Mở {title}",
  "drawer-category-other": "Khác",
  "canvas-noconfig": "Chưa có cấu hình cho khối {type}",
  "field-readonly": "Chỉ xem",
  "field-arrayitem-summary": "Mục {index}",
  "field-arrayitem-duplicate": "Nhân bản",
  "field-arrayitem-delete": "Xoá",
  "viewport-zoom-in": "Phóng to",
  "viewport-zoom-out": "Thu nhỏ",
  "viewport-zoom-auto": "{zoom}% (Tự động)",
  "viewport-toggle-menu": "Chọn khung xem",
  "viewport-switch": "Xem trên {label}",
  "viewport-switch-default": "Đổi khung xem",
  "plugin-blocks": "Khối",
  "plugin-outline": "Cấu trúc",
  "plugin-fields": "Thuộc tính",
  "plugin-components": "Khối",
  "layout-maximize": "phóng to",
  "layout-minimize": "thu nhỏ",
};

const viewports = [
  { width: 390, height: "auto" as const, label: "Điện thoại", icon: "Smartphone" as const },
  { width: 834, height: "auto" as const, label: "Máy tính bảng", icon: "Tablet" as const },
  { width: 1440, height: "auto" as const, label: "Máy tính", icon: "Monitor" as const },
];

// Gắn biến font của website lên <html> trong khung xem trước (iframe)
function IframeFonts({ doc, fontRoles }: { doc?: Document; fontRoles: Record<string, string> }) {
  useEffect(() => {
    if (!doc) return;
    const html = doc.documentElement;
    html.setAttribute("lang", "vi");
    html.setAttribute("class", document.documentElement.className);
    for (const [k, v] of Object.entries(fontRoles)) html.style.setProperty(k, v);
  }, [doc, fontRoles]);
  return null;
}

function HeaderActions({ children }: { children: ReactNode }) {
  const ctx = useContext(EditorCtx)!;
  const getPuck = useGetPuck();
  return (
    <>
      {ctx.status.text ? (
        <span className="editor-status" data-tone={ctx.status.tone} role="status">
          {ctx.status.text}
        </span>
      ) : null}
      <Link className="editor-btn" href={ctx.backHref}>
        Về CMS
      </Link>
      <a className="editor-btn" href={ctx.path} target="_blank" rel="noopener">
        Xem trang
      </a>
      <button
        type="button"
        className="editor-btn"
        disabled={ctx.pending}
        onClick={() => ctx.saveDraft(getPuck().appState.data)}
      >
        Lưu nháp
      </button>
      {children}
    </>
  );
}

type Props = {
  // Lưu bố cục: publish = true thì đưa lên website
  save: (id: number, data: Data, publish: boolean) => Promise<SaveResult>;
  // Nút "Về CMS"
  backHref?: string;
  id: number;
  title: string;
  path: string;
  data: Data;
  metadata: BlockMeta;
  fontRoles: Record<string, string>;
  hasDraft: boolean;
  publishedAt: string | null;
};

export function Editor({ save: savePage, backHref = "/quan-tri/trang", id, title, path, data, metadata, fontRoles, hasDraft, publishedAt }: Props) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>(() => ({
    tone: "",
    text: hasDraft
      ? "Đang có bản nháp chưa xuất bản"
      : publishedAt
        ? `Xuất bản lúc ${timeVi(publishedAt)}`
        : "Chưa xuất bản",
  }));
  // Có thay đổi chưa lưu: hỏi lại trước khi rời trang
  const dirty = useRef(false);
  const loaded = useRef(false);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  const save = (next: Data, publish: boolean) =>
    startTransition(async () => {
      setStatus({ tone: "", text: publish ? "Đang xuất bản…" : "Đang lưu…" });
      const res = await savePage(id, next, publish);
      if (!res.ok) return setStatus({ tone: "error", text: res.error });
      dirty.current = false;
      setStatus({
        tone: "ok",
        text: publish ? `Đã xuất bản lúc ${timeVi(res.publishedAt!)}, website tự cập nhật sau khoảng 10 phút` : "Đã lưu nháp, website chưa đổi",
      });
    });

  const [overrides] = useState<Partial<Overrides>>(() => ({
    headerActions: HeaderActions,
    iframe: ({ children, document: doc }) => (
      <>
        <IframeFonts doc={doc} fontRoles={fontRoles} />
        {children}
      </>
    ),
  }));

  return (
    <EditorCtx.Provider value={{ saveDraft: (d) => save(d, false), pending, status, path, backHref }}>
      <Puck
        config={editorConfig}
        data={data}
        metadata={metadata}
        dictionary={dictionary}
        viewports={viewports}
        headerTitle={title}
        headerPath={path}
        overrides={overrides}
        onChange={() => {
          // Lần gọi đầu là lúc Puck nạp dữ liệu, chưa phải người dùng sửa
          if (loaded.current) dirty.current = true;
          loaded.current = true;
        }}
        onPublish={(next) => save(next, true)}
      />
    </EditorCtx.Provider>
  );
}
