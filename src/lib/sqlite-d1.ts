// Lớp giả D1 chạy trên SQLite có sẵn của Node (node:sqlite, Node ≥ 22.13) cho bản chạy trên VPS.
// Toàn bộ code website/CMS viết theo API D1 (prepare → bind → first/all/run, batch), nên chỉ cần lớp này
// là chạy được trên một file SQLite thường, không phải sửa từng câu lệnh. D1 cũng chính là SQLite nên
// câu SQL giữ nguyên. Chỉ hiện thực phần API mà code đang dùng.
import { DatabaseSync, type SQLInputValue, type StatementSync } from "node:sqlite";

type Value = SQLInputValue;

// D1 nhận boolean (đổi thành 1/0) và coi undefined là lỗi; node:sqlite không nhận boolean
function toValue(v: unknown): Value {
  if (v === undefined || v === null) return null;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "number" || typeof v === "string" || typeof v === "bigint") return v;
  if (v instanceof Uint8Array) return v;
  if (v instanceof ArrayBuffer) return new Uint8Array(v);
  return String(v);
}

// Câu lệnh trả về dòng (select, with, pragma, hoặc có returning) → all(); còn lại → run()
const returnsRows = (sql: string) => /^\s*(select|with|pragma|values)\b/i.test(sql) || /\breturning\b/i.test(sql);

type Meta = { changes: number; last_row_id: number; duration: number; rows_read: number; rows_written: number; changed_db: boolean; size_after: number };
type Result<T> = { success: true; results: T[]; meta: Meta };

const meta = (changes = 0, lastId = 0, read = 0): Meta => ({
  changes,
  last_row_id: lastId,
  duration: 0,
  rows_read: read,
  rows_written: changes,
  changed_db: changes > 0,
  size_after: 0,
});

class Statement {
  constructor(
    private readonly owner: SqliteD1,
    readonly sql: string,
    private readonly params: Value[] = [],
  ) {}

  bind(...values: unknown[]): Statement {
    return new Statement(this.owner, this.sql, values.map(toValue));
  }

  private stmt(): StatementSync {
    return this.owner.statement(this.sql);
  }

  async first<T = Record<string, unknown>>(column?: string): Promise<T | null> {
    const row = this.stmt().get(...this.params) as Record<string, unknown> | undefined;
    if (!row) return null;
    return (column ? (row[column] ?? null) : { ...row }) as T;
  }

  async all<T = Record<string, unknown>>(): Promise<Result<T>> {
    return this.allSync<T>();
  }

  allSync<T>(): Result<T> {
    const rows = this.stmt().all(...this.params) as Record<string, unknown>[];
    return { success: true, results: rows.map((r) => ({ ...r }) as T), meta: meta(0, 0, rows.length) };
  }

  async run<T = Record<string, unknown>>(): Promise<Result<T>> {
    return this.runSync<T>();
  }

  runSync<T>(): Result<T> {
    if (returnsRows(this.sql)) {
      const r = this.allSync<T>();
      return { ...r, meta: meta(r.results.length) };
    }
    const r = this.stmt().run(...this.params);
    return { success: true, results: [], meta: meta(Number(r.changes), Number(r.lastInsertRowid)) };
  }

  async raw<T = unknown[]>(options?: { columnNames?: boolean }): Promise<T[]> {
    const s = this.stmt();
    const rows = s.all(...this.params) as Record<string, unknown>[];
    const out = rows.map((r) => Object.values(r)) as T[];
    if (options?.columnNames) return [Object.keys(rows[0] ?? {}) as T, ...out];
    return out;
  }
}

export class SqliteD1 {
  private readonly db: DatabaseSync;
  // Câu lệnh đã biên dịch, dùng lại giữa các yêu cầu (SQL của website là cố định)
  private readonly cache = new Map<string, StatementSync>();

  constructor(path: string) {
    this.db = new DatabaseSync(path);
    // WAL: đọc không chặn ghi; busy_timeout: hai tiến trình (website + lệnh quản trị) ghi cùng lúc thì chờ thay vì lỗi
    this.db.exec("pragma journal_mode = wal; pragma synchronous = normal; pragma busy_timeout = 5000; pragma foreign_keys = on;");
  }

  statement(sql: string): StatementSync {
    let s = this.cache.get(sql);
    if (!s) {
      s = this.db.prepare(sql);
      if (this.cache.size > 500) this.cache.clear();
      this.cache.set(sql, s);
    }
    return s;
  }

  prepare(sql: string): Statement {
    return new Statement(this, sql);
  }

  // Như D1: các câu trong một batch chạy trong một giao dịch, lỗi một câu thì huỷ cả batch
  async batch<T = Record<string, unknown>>(stmts: Statement[]): Promise<Result<T>[]> {
    this.db.exec("begin");
    try {
      const out = stmts.map((s) => (returnsRows(s.sql) ? s.allSync<T>() : s.runSync<T>()));
      this.db.exec("commit");
      return out;
    } catch (e) {
      this.db.exec("rollback");
      throw e;
    }
  }

  async exec(sql: string): Promise<{ count: number; duration: number }> {
    this.db.exec(sql);
    return { count: 1, duration: 0 };
  }
}

let shared: SqliteD1 | undefined;

// Một kết nối cho cả tiến trình. Đường dẫn file: biến SQLITE_PATH (mặc định data/f21.db)
export function sqliteD1(): D1Database {
  shared ??= new SqliteD1(process.env.SQLITE_PATH || "data/f21.db");
  return shared as unknown as D1Database;
}
