// API chung cho các mục nội dung khai báo trong src/cms/schema.ts: /api/cms/c/<slug>[/<id>], /api/cms/options/<slug>.
// Đọc/ghi D1 theo cấu trúc bảng do CMS Payload tạo trước đây (bảng chính, bảng mảng con, bảng _rels).
import { fromDbDate, todayInVietnam, toDbDate } from "@/lib/dates";
import { UNVERIFIED_MARK } from "@/lib/markdown";
import { num, rowId, str } from "@/lib/sql";
import { collectionBySlug, type CollectionDef, type Field } from "../schema";
import { audit, body, can, fail, json, type CmsContext, type CmsUser } from "./http";

type Row = Record<string, unknown>;
type Ctx = { ctx: CmsContext; user: CmsUser; request: Request; path: string[] };
type Doc = Record<string, unknown>;

const q = (name: string) => `"${name}"`;
const scalar = (f: Field): f is Extract<Field, { column: string }> => "column" in f;
// Trường phải là duy nhất trong bảng
const UNIQUE = new Set(["slug", "number"]);

function toValue(f: Extract<Field, { column: string }>, v: unknown) {
  if (f.type === "bool") return v === null || v === undefined ? null : Boolean(Number(v));
  if (f.type === "number" || f.type === "money" || f.type === "ref") return v === null || v === undefined ? null : num(v);
  if (f.type === "date") return v ? fromDbDate(str(v)) : "";
  return str(v);
}

function toColumn(f: Extract<Field, { column: string }>, v: unknown): unknown {
  if (f.type === "bool") return v ? 1 : 0;
  if (f.type === "number" || f.type === "money" || f.type === "ref") return v === null || v === undefined || v === "" ? null : Number(v);
  if (f.type === "date") return v ? toDbDate(str(v)) : null;
  const s = str(v).trim();
  return s === "" ? null : s;
}

async function readDoc(d: D1Database, def: CollectionDef, id: number): Promise<Doc | null> {
  const row = await d.prepare(`select * from ${q(def.table)} where id = ?`).bind(id).first<Row>();
  if (!row) return null;
  const doc: Doc = { id: num(row.id), updatedAt: str(row.updated_at) };
  const stmts: { field: Field; stmt: D1PreparedStatement }[] = [];
  for (const f of def.fields) {
    if (f.type === "section") continue;
    if (scalar(f)) doc[f.name] = toValue(f, row[f.column]);
    else if (f.type === "rows")
      stmts.push({ field: f, stmt: d.prepare(`select ${f.columns.map((c) => q(c.column)).join(", ")} from ${q(f.table)} where _parent_id = ? order by _order`).bind(id) });
    else if (f.type === "refs" || f.type === "media")
      stmts.push({ field: f, stmt: d.prepare(`select ${q(f.relColumn)} v from ${q(f.relTable)} where parent_id = ? and path = ? order by "order"`).bind(id, f.path) });
    else if (f.type === "multi") stmts.push({ field: f, stmt: d.prepare(`select value v from ${q(f.table)} where parent_id = ? order by "order"`).bind(id) });
  }
  if (stmts.length) {
    const res = await d.batch(stmts.map((s) => s.stmt));
    stmts.forEach(({ field }, i) => {
      const rows = res[i].results as Row[];
      if (field.type === "rows") doc[field.name] = rows.map((r) => Object.fromEntries(field.columns.map((c) => [c.column, str(r[c.column])])));
      else if (field.type === "multi") doc[field.name] = rows.map((r) => str(r.v));
      else doc[field.name] = rows.map((r) => num(r.v)).filter(Boolean);
    });
  }
  return doc;
}

// Kiểm tra dữ liệu; trả lỗi (chuỗi) hoặc null
async function check(d: D1Database, def: CollectionDef, input: Doc, id: number | null) {
  for (const f of def.fields) {
    if (f.type === "section" || !f.required) continue;
    const v = input[f.name];
    if (v === undefined || v === null || (typeof v === "string" && !v.trim())) return `Nhập “${f.label}”.`;
  }
  for (const f of def.fields) {
    if (!scalar(f)) continue;
    const v = input[f.name];
    if ((f.type === "number" || f.type === "money") && v !== null && v !== undefined && v !== "") {
      const n = Number(v);
      if (!Number.isFinite(n)) return `“${f.label}” phải là số.`;
      if ("min" in f && f.min !== undefined && n < f.min) return `“${f.label}” tối thiểu là ${f.min}.`;
      if ("max" in f && f.max !== undefined && n > f.max) return `“${f.label}” tối đa là ${f.max}.`;
    }
    if (f.name === "slug" && v && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(str(v))) return `“${f.label}”: chỉ dùng chữ thường không dấu, số và gạch ngang.`;
    if (UNIQUE.has(f.name) && v && !def.global) {
      const dup = await d.prepare(`select 1 from ${q(def.table)} where ${q(f.column)} = ? and id <> ? limit 1`).bind(str(v).trim(), id ?? 0).first();
      if (dup) return `“${f.label}” “${str(v)}” đã có, chọn giá trị khác.`;
    }
    if (f.type === "date" && v && !/^\d{4}-\d{2}-\d{2}$/.test(str(v))) return `“${f.label}” không hợp lệ.`;
  }
  if (def.slug === "rate-rules" && str(input.from) > str(input.to)) return "“Đến hết đêm” phải sau hoặc bằng “Từ đêm”.";
  if (def.slug === "posts" && input.published) {
    const mark = [str(input.title), str(input.excerpt), str(input.body), JSON.stringify(input.faqs ?? [])].join("\n").match(UNVERIFIED_MARK);
    if (mark) return `Bài còn chỗ “${mark[0]}”. Kiểm tra lại thông tin rồi xoá dấu này trước khi đăng.`;
  }
  return null;
}

// Câu lệnh ghi các bảng con của một bản ghi (xoá cũ, chèn mới). parent: biểu thức SQL cho id cha.
function childStatements(d: D1Database, def: CollectionDef, input: Doc, parent: string, parentBind: unknown[]) {
  const out: D1PreparedStatement[] = [];
  for (const f of def.fields) {
    if (f.type === "rows" && Array.isArray(input[f.name])) {
      out.push(d.prepare(`delete from ${q(f.table)} where _parent_id = ${parent}`).bind(...parentBind));
      (input[f.name] as Row[])
        .filter((r) => f.columns.some((c) => str(r[c.column]).trim()))
        .forEach((r, i) =>
          out.push(
            d
              .prepare(`insert into ${q(f.table)} (_order, _parent_id, id, ${f.columns.map((c) => q(c.column)).join(", ")}) values (?, ${parent}, ?, ${f.columns.map(() => "?").join(", ")})`)
              .bind(i + 1, ...parentBind, rowId(), ...f.columns.map((c) => str(r[c.column]).trim())),
          ),
        );
    } else if ((f.type === "refs" || f.type === "media") && Array.isArray(input[f.name])) {
      out.push(d.prepare(`delete from ${q(f.relTable)} where parent_id = ${parent} and path = ?`).bind(...parentBind, f.path));
      (input[f.name] as unknown[]).map(Number).filter(Boolean).forEach((v, i) =>
        out.push(d.prepare(`insert into ${q(f.relTable)} ("order", parent_id, path, ${q(f.relColumn)}) values (?, ${parent}, ?, ?)`).bind(i + 1, ...parentBind, f.path, v)),
      );
    } else if (f.type === "multi" && Array.isArray(input[f.name])) {
      out.push(d.prepare(`delete from ${q(f.table)} where parent_id = ${parent}`).bind(...parentBind));
      (input[f.name] as unknown[]).map(str).filter((v) => f.options.some((o) => o.value === v)).forEach((v, i) =>
        out.push(d.prepare(`insert into ${q(f.table)} ("order", parent_id, value) values (?, ${parent}, ?)`).bind(i + 1, ...parentBind, v)),
      );
    }
  }
  return out;
}

const scalarFields = (def: CollectionDef, input: Doc) =>
  def.fields.filter(scalar).filter((f) => input[f.name] !== undefined) as Extract<Field, { column: string }>[];

function getDef(path: string[], user: CmsUser, need: "read" | "write" | "remove") {
  const def = collectionBySlug(path[1] ?? "");
  if (!def) return fail(404, "Không có mục này.");
  const roles = need === "read" ? def.read : need === "write" ? def.write : (def.remove ?? []);
  if (!can(user, ...roles)) return fail(403, "Tài khoản của bạn không có quyền làm việc này.");
  return def;
}

const titleOf = (def: CollectionDef, doc: Doc) => str(doc[def.fields.find((f) => scalar(f) && f.column === def.titleField)?.name ?? def.titleField]);

// ---------- Handlers ----------

const list = async ({ ctx, user, path }: Ctx) => {
  const def = getDef(path, user, "read");
  if (def instanceof Response) return def;
  if (def.global) {
    const row = await ctx.d.prepare(`select id from ${q(def.table)} order by id limit 1`).first<Row>();
    return json({ ok: true, doc: row ? await readDoc(ctx.d, def, num(row.id)) : {} });
  }
  const cols = [...new Set(["id", def.titleField, ...(def.listColumns ?? [])])];
  const dates = new Set(def.fields.filter((f) => f.type === "date").map((f) => (f as { column: string }).column));
  const { results } = await ctx.d.prepare(`select ${cols.map(q).join(", ")} from ${q(def.table)} order by ${def.order ?? "id desc"} limit 500`).all<Row>();
  return json({
    ok: true,
    rows: results.map((r) => Object.fromEntries(cols.map((c) => [c, dates.has(c) ? fromDbDate(str(r[c])) : r[c]]))),
  });
};

const get = async ({ ctx, user, path }: Ctx) => {
  const def = getDef(path, user, "read");
  if (def instanceof Response) return def;
  const doc = await readDoc(ctx.d, def, Number(path[2]));
  return doc ? json({ ok: true, doc }) : fail(404, "Không tìm thấy.");
};

const save = async ({ ctx, user, request, path }: Ctx) => {
  const def = getDef(path, user, "write");
  if (def instanceof Response) return def;
  const input = await body<Doc>(request);
  if (!input) return fail(400, "Dữ liệu không hợp lệ.");
  const d = ctx.d;
  const now = new Date().toISOString();
  let id = Number(path[2]) || null;
  if (def.global) id = num((await d.prepare(`select id from ${q(def.table)} order by id limit 1`).first<Row>())?.id) || null;
  const existing = id ? await readDoc(d, def, id) : null;
  if (id && !existing) return fail(404, "Không tìm thấy.");
  // Bài viết bật "Đăng" mà chưa có ngày đăng: lấy hôm nay
  if (def.slug === "posts" && input.published && !str(input.publishedAt ?? existing?.publishedAt)) input.publishedAt = todayInVietnam();
  const merged = { ...(existing ?? {}), ...input };
  const err = await check(d, def, merged, id);
  if (err) return fail(400, err);

  const fields = scalarFields(def, input);
  if (id) {
    await d.batch([
      d
        .prepare(`update ${q(def.table)} set ${[...fields.map((f) => `${q(f.column)} = ?`), "updated_at = ?"].join(", ")} where id = ?`)
        .bind(...fields.map((f) => toColumn(f, input[f.name])), now, id),
      ...childStatements(d, def, input, "?", [id]),
    ]);
  } else {
    // Mặc định cho ô đánh dấu chưa gửi (ví dụ "Đang hoạt động")
    const all = def.fields.filter(scalar) as Extract<Field, { column: string }>[];
    const withDefaults = all.filter((f) => input[f.name] !== undefined || (f.type === "bool" && f.default !== undefined));
    const vals = withDefaults.map((f) => (input[f.name] !== undefined ? toColumn(f, input[f.name]) : f.type === "bool" && f.default ? 1 : 0));
    const row = await d
      .prepare(`insert into ${q(def.table)} (${[...withDefaults.map((f) => q(f.column)), "updated_at", "created_at"].join(", ")}) values (${[...vals, now, now].map(() => "?").join(", ")}) returning id`)
      .bind(...vals, now, now)
      .first<Row>();
    id = num(row?.id);
    const children = childStatements(d, def, input, "?", [id]);
    if (children.length) await d.batch(children);
  }
  await audit(ctx, user, existing ? "update" : "create", def.slug, id, titleOf(def, merged));
  if (def.tags.length) await ctx.revalidate(def.tags);
  return json({ ok: true, id });
};

const remove = async ({ ctx, user, path }: Ctx) => {
  const def = getDef(path, user, "remove");
  if (def instanceof Response) return def;
  const id = Number(path[2]);
  const doc = await readDoc(ctx.d, def, id);
  if (!doc) return fail(404, "Không tìm thấy.");
  const d = ctx.d;
  if (def.slug === "room-types") {
    const used = await d.prepare("select count(*) n from rooms where room_type_id = ?").bind(id).first<Row>();
    if (num(used?.n)) return fail(400, "Hạng phòng còn phòng trong Danh sách phòng. Chuyển các phòng sang hạng khác trước khi xoá.");
  }
  const stmts: D1PreparedStatement[] = [];
  for (const f of def.fields) {
    if (f.type === "rows") stmts.push(d.prepare(`delete from ${q(f.table)} where _parent_id = ?`).bind(id));
    if (f.type === "multi") stmts.push(d.prepare(`delete from ${q(f.table)} where parent_id = ?`).bind(id));
    if (f.type === "refs" || f.type === "media") stmts.push(d.prepare(`delete from ${q(f.relTable)} where parent_id = ?`).bind(id));
  }
  if (def.payloadLocks !== false)
    stmts.push(d.prepare(`delete from payload_locked_documents_rels where ${q(`${def.slug.replace(/-/g, "_")}_id`)} = ?`).bind(id));
  stmts.push(d.prepare(`delete from ${q(def.table)} where id = ?`).bind(id));
  await d.batch(stmts);
  await audit(ctx, user, "delete", def.slug, id, titleOf(def, doc));
  if (def.tags.length) await ctx.revalidate(def.tags);
  return json({ ok: true });
};

// Lựa chọn cho trường quan hệ (ví dụ danh sách hạng phòng)
const options = async ({ ctx, path }: Ctx) => {
  const def = collectionBySlug(path[1] ?? "");
  if (!def) return fail(404, "Không có mục này.");
  const { results } = await ctx.d.prepare(`select id, ${q(def.titleField)} t from ${q(def.table)} order by ${def.order ?? "id"}`).all<Row>();
  return json({ ok: true, options: results.map((r) => ({ id: num(r.id), title: str(r.t) })) });
};

export const contentRoutes = [
  { method: "GET", match: (p: string[]) => p[0] === "c" && p.length === 2, handler: list },
  { method: "GET", match: (p: string[]) => p[0] === "c" && p.length === 3, handler: get },
  { method: "POST", match: (p: string[]) => p[0] === "c" && p.length === 2, handler: save },
  { method: "PATCH", match: (p: string[]) => p[0] === "c" && p.length >= 2, handler: save },
  { method: "DELETE", match: (p: string[]) => p[0] === "c" && p.length === 3, handler: remove },
  { method: "GET", match: (p: string[]) => p[0] === "options" && p.length === 2, handler: options },
];
