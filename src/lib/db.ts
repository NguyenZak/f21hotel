// Truy cập D1 trực tiếp (không qua Payload) cho phần website chạy trên Cloudflare Workers.
// Gói Workers Free chỉ cho 10 ms CPU mỗi yêu cầu; khởi tạo Payload tốn hàng trăm ms nên website
// đọc/ghi bằng câu lệnh SQL nhẹ. Bảng và cột theo cấu trúc Payload đã tạo (src/migrations).
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function db(): Promise<D1Database> {
  return (await getCloudflareContext({ async: true })).env.D1;
}

// Chạy nhiều câu đọc trong một lượt gọi D1, trả về mảng dòng của từng câu
export async function readAll<T extends unknown[]>(...stmts: { [K in keyof T]: D1PreparedStatement }): Promise<{ [K in keyof T]: T[K][] }> {
  const d = await db();
  const res = await d.batch(stmts as D1PreparedStatement[]);
  return res.map((r) => r.results) as { [K in keyof T]: T[K][] };
}

// Payload lưu boolean dạng 0/1, số dạng numeric
export const bool = (v: unknown, fallback = false) => (v === null || v === undefined ? fallback : Boolean(Number(v)));
export const num = (v: unknown, fallback = 0) => (v === null || v === undefined || v === "" ? fallback : Number(v));
export const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));

// id cho dòng của mảng (Payload dùng chuỗi hex 24 ký tự kiểu ObjectId)
export const rowId = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, "0")).join("");
