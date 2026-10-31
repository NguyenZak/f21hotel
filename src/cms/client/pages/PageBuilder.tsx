"use client";

import type { Data } from "@puckeditor/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { SaveResult } from "@/app/(editor)/editor/actions";
import { Editor } from "@/app/(editor)/editor/[id]/Editor";
import { defaultHome } from "@/blocks/home";
import type { BlockMeta } from "@/blocks/types";
import { api, ApiError } from "../api";

// Trình dựng trang (Puck) của CMS mới: tải bố cục, dữ liệu xem trước và font qua /api/cms/*, lưu qua API
type PageDoc = { id: number; title: string; slug: string; publishedAt: string; data: Data | null; draft: Data | null };
type Fonts = Record<"heading" | "hero" | "body" | "ui", string>;

const save = async (id: number, data: Data, publish: boolean): Promise<SaveResult> => {
  try {
    const r = await api<{ publishedAt?: string }>(`pages/${id}`, { method: "PATCH", body: { data, publish } });
    return { ok: true, publishedAt: r.publishedAt };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.message : "Không lưu được, thử lại sau." };
  }
};

export function PageBuilder() {
  const id = Number(useSearchParams().get("id"));
  const [state, setState] = useState<{ page: PageDoc; meta: BlockMeta; fonts: Fonts } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!id) return;
    Promise.all([api<{ page: PageDoc }>(`pages/${id}`), api<{ meta: BlockMeta; fonts: Fonts }>("block-meta")])
      .then(([p, m]) => setState({ page: p.page, meta: m.meta, fonts: m.fonts }))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Không tải được trang."));
  }, [id]);
  if (!id || error) return <p className="editor-denied">{error || "Thiếu mã trang."}</p>;
  if (!state) return <p className="editor-denied">Đang tải trình dựng trang…</p>;
  const { page, meta, fonts } = state;
  const empty: Data = { root: { props: { title: page.title } }, content: [], zones: {} };
  return (
    <Editor
      save={save}
      backHref="/quan-tri/trang"
      id={page.id}
      title={page.title}
      path={page.slug === "home" ? "/" : `/${page.slug}`}
      data={page.draft ?? page.data ?? (page.slug === "home" ? defaultHome : empty)}
      metadata={meta}
      fontRoles={Object.fromEntries(Object.entries(fonts).map(([role, key]) => [`--font-role-${role}`, `var(--font-${key})`]))}
      hasDraft={Boolean(page.draft)}
      publishedAt={page.publishedAt || null}
    />
  );
}
