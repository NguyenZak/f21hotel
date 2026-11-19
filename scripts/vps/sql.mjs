// Chạy file SQL (schema, migration, dữ liệu xuất từ D1) trên file SQLite của VPS.
//   node scripts/vps/sql.mjs db/migrations/0015_x.sql [thêm file…]
// File: SQLITE_PATH, mặc định data/f21.db. Mỗi file chạy trong một giao dịch: lỗi thì huỷ cả file.
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

const files = process.argv.slice(2);
if (!files.length) {
  console.error("Cách dùng: node scripts/vps/sql.mjs <file.sql> [file.sql…]");
  process.exit(1);
}
const path = process.env.SQLITE_PATH || "data/f21.db";
const d = new DatabaseSync(path);
d.exec("pragma journal_mode = wal; pragma busy_timeout = 5000;");
for (const f of files) {
  const sql = readFileSync(f, "utf8");
  try {
    d.exec("begin");
    d.exec(sql);
    d.exec("commit");
    console.log(`✓ ${f}`);
  } catch (e) {
    try { d.exec("rollback"); } catch {}
    console.error(`✗ ${f}: ${e.message}`);
    process.exit(1);
  }
}
d.close();
