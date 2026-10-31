// Tiện ích đọc/ghi dữ liệu D1 theo cách Payload lưu. Không phụ thuộc Next.js hay OpenNext
// (dùng được trong custom worker worker.ts).

// Payload lưu boolean dạng 0/1, số dạng numeric
export const bool = (v: unknown, fallback = false) => (v === null || v === undefined ? fallback : Boolean(Number(v)));
export const num = (v: unknown, fallback = 0) => (v === null || v === undefined || v === "" ? fallback : Number(v));
export const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));

// id cho dòng của mảng (Payload dùng chuỗi hex 24 ký tự kiểu ObjectId)
export const rowId = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, "0")).join("");
