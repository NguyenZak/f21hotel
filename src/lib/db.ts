// Cơ sở dữ liệu của website: một file SQLite trên VPS (SQLITE_PATH), đọc/ghi qua lớp giả D1 (sqlite-d1.ts)
// nên mọi câu lệnh viết theo API D1 vẫn chạy nguyên. Bảng và cột: db/schema.sql + db/migrations.
import { sqliteD1 } from "./sqlite-d1";

export async function db(): Promise<D1Database> {
  return sqliteD1();
}

// Chạy nhiều câu đọc trong một lượt gọi D1, trả về mảng dòng của từng câu
export async function readAll<T extends unknown[]>(...stmts: { [K in keyof T]: D1PreparedStatement }): Promise<{ [K in keyof T]: T[K][] }> {
  const d = await db();
  const res = await d.batch(stmts as D1PreparedStatement[]);
  return res.map((r) => r.results) as { [K in keyof T]: T[K][] };
}

export { bool, num, rowId, str } from "./sql";
