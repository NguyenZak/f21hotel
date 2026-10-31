"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { collectionByPath, type CollectionDef, type Field } from "../../schema";
import { api, ApiError } from "../api";
import { money } from "../booking";
import { FieldInput } from "../fields";
import { hasRole, useSession } from "../session";
import { useToast } from "../ui";

// Trang danh sách và trang sửa dùng chung cho các mục nội dung khai báo trong src/cms/schema.ts

type Row = Record<string, unknown>;
const scalarByColumn = (def: CollectionDef, col: string) => def.fields.find((f) => "column" in f && f.column === col) as (Field & { column: string; label: string }) | undefined;

function Cell({ def, col, row, refs }: { def: CollectionDef; col: string; row: Row; refs: Record<number, string> }) {
  const f = scalarByColumn(def, col);
  const v = row[col];
  if (!f) return <>{String(v ?? "")}</>;
  if (f.type === "bool") return Number(v) ? <span className="c-badge c-badge--ok">Có</span> : <span className="c-badge c-badge--off">Không</span>;
  if (f.type === "money") return <>{money(v === null ? null : Number(v))}</>;
  if (f.type === "ref") return <>{refs[Number(v)] ?? "—"}</>;
  if (f.type === "number" && f.name === "adjust") return <>{v === null ? "—" : `${Number(v) > 0 ? "+" : ""}${v}%`}</>;
  if (f.type === "date") return <>{v ? String(v).split("-").reverse().join("/") : "—"}</>;
  return <>{String(v ?? "")}</>;
}

function Denied() {
  return <p className="c-alert c-alert--info">Tài khoản của bạn không có quyền xem mục này.</p>;
}

export function CollectionListPage({ path }: { path: string }) {
  const def = collectionByPath(path)!;
  const { user } = useSession();
  const router = useRouter();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [refs, setRefs] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  useEffect(() => {
    api<{ rows: Row[] }>(`c/${def.slug}`)
      .then((r) => setRows(r.rows))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Không tải được."));
    const ref = def.fields.find((f) => f.type === "ref") as Extract<Field, { type: "ref" }> | undefined;
    if (ref)
      api<{ options: { id: number; title: string }[] }>(`options/${ref.to}`)
        .then((r) => setRefs(Object.fromEntries(r.options.map((o) => [o.id, o.title]))))
        .catch(() => {});
  }, [def]);
  if (user && !hasRole(user, ...def.read)) return <Denied />;
  const cols = def.listColumns ?? [def.titleField];
  const canWrite = hasRole(user, ...def.write);
  return (
    <>
      <div className="c-page__head">
        <div>
          <h1>{def.label}</h1>
          {def.intro ? <p>{def.intro}</p> : null}
        </div>
        {canWrite ? (
          <Link className="c-btn c-btn--primary" href={`/quan-tri/${def.path}/sua`}>
            + Thêm
          </Link>
        ) : null}
      </div>
      {error ? <p className="c-alert c-alert--error">{error}</p> : null}
      <div className="c-card c-table-wrap">
        {!rows ? (
          <p className="c-empty">Đang tải…</p>
        ) : !rows.length ? (
          <p className="c-empty">Chưa có mục nào.</p>
        ) : (
          <table className="c-table">
            <thead>
              <tr>
                {cols.map((c) => (
                  <th key={c}>{scalarByColumn(def, c)?.label ?? c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={String(r.id)} className="c-row-link" onClick={() => router.push(`/quan-tri/${def.path}/sua?id=${r.id}`)}>
                  {cols.map((c, i) => (
                    <td key={c}>
                      {i === 0 ? (
                        <Link href={`/quan-tri/${def.path}/sua?id=${r.id}`} onClick={(e) => e.stopPropagation()}>
                          <b>
                            <Cell def={def} col={c} row={r} refs={refs} />
                          </b>
                        </Link>
                      ) : (
                        <Cell def={def} col={c} row={r} refs={refs} />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// Giá trị ban đầu khi thêm mới
const blank = (def: CollectionDef) =>
  Object.fromEntries(
    def.fields
      .filter((f) => f.type !== "section")
      .map((f) => [f.name, f.type === "bool" ? (f.default ?? false) : f.type === "rows" || f.type === "refs" || f.type === "media" || f.type === "multi" ? [] : null]),
  );

export function CollectionEditPage({ path }: { path: string }) {
  const def = collectionByPath(path)!;
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useSession();
  const id = def.global ? null : Number(params.get("id")) || null;
  const [doc, setDoc] = useState<Row | null>(def.global || id ? null : blank(def));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, say] = useToast();

  useEffect(() => {
    if (!def.global && !id) return;
    api<{ doc: Row }>(def.global ? `c/${def.slug}` : `c/${def.slug}/${id}`)
      .then((r) => setDoc(r.doc))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Không tải được."));
  }, [def, id]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (user && !hasRole(user, ...def.read)) return <Denied />;
  const canWrite = hasRole(user, ...def.write);
  const canRemove = !def.global && id && hasRole(user, ...(def.remove ?? []));

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!doc) return;
    setSaving(true);
    setError("");
    try {
      const r = await api<{ id: number }>(def.global || !id ? `c/${def.slug}` : `c/${def.slug}/${id}`, { method: def.global || id ? "PATCH" : "POST", body: doc });
      setDirty(false);
      if (!def.global && !id) router.replace(`/quan-tri/${def.path}/sua?id=${r.id}`);
      say("Đã lưu. Website cập nhật trong giây lát.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không lưu được.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Xoá “${String(doc?.[def.fields.find((f) => "column" in f && f.column === def.titleField)?.name ?? ""] ?? "")}”? Không khôi phục được.`)) return;
    try {
      await api(`c/${def.slug}/${id}`, { method: "DELETE", body: {} });
      router.replace(`/quan-tri/${def.path}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không xoá được.");
    }
  };

  const title = def.global ? def.label : id ? String(doc?.[def.fields.find((f) => "column" in f && f.column === def.titleField)?.name ?? ""] ?? "") || def.label : `Thêm ${def.label.toLowerCase()}`;
  // Chia form thành các khối theo "section"
  const sections: { label?: string; help?: string; fields: Exclude<Field, { type: "section" }>[] }[] = [{ fields: [] }];
  for (const f of def.fields) {
    if (f.type === "section") sections.push({ label: f.label, help: f.help, fields: [] });
    else sections[sections.length - 1].fields.push(f);
  }

  return (
    <form onSubmit={save}>
      <div className="c-page__head">
        <div>
          {!def.global ? (
            <Link href={`/quan-tri/${def.path}`} className="c-muted" style={{ fontSize: 14 }}>
              ← {def.label}
            </Link>
          ) : null}
          <h1>{title}</h1>
          {def.global && def.intro ? <p>{def.intro}</p> : null}
        </div>
      </div>
      {error ? (
        <p className="c-alert c-alert--error" role="alert" style={{ marginBottom: 16 }}>
          {error}
        </p>
      ) : null}
      {!doc ? (
        <p className="c-empty">Đang tải…</p>
      ) : (
        <fieldset disabled={!canWrite} className="c-fieldset">
          {sections
            .filter((s) => s.fields.length)
            .map((s, i) => (
              <section key={i} className="c-card c-form" style={{ marginBottom: 16 }}>
                {s.label ? <h2>{s.label}</h2> : null}
                <div className="c-fields">
                  {s.fields.map((f) => (
                    <FieldInput
                      key={f.name}
                      f={f}
                      value={doc[f.name]}
                      onChange={(v) => {
                        setDoc((d) => ({ ...d, [f.name]: v }));
                        setDirty(true);
                      }}
                    />
                  ))}
                </div>
              </section>
            ))}
        </fieldset>
      )}
      {canWrite ? (
        <div className="c-savebar">
          {canRemove ? (
            <button type="button" className="c-btn c-btn--ghost c-btn--danger" onClick={remove}>
              Xoá
            </button>
          ) : (
            <span />
          )}
          <span className="c-row">
            {dirty ? <span className="c-hint">Chưa lưu</span> : null}
            <button className="c-btn c-btn--primary" type="submit" disabled={saving || !doc}>
              {saving ? "Đang lưu…" : "Lưu"}
            </button>
          </span>
        </div>
      ) : null}
      {toast}
    </form>
  );
}
