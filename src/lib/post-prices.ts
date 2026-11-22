// Giá phòng trong bài viết lấy thẳng từ CMS › Hạng phòng, để bài không ghi giá cũ khi khách sạn đổi giá.
// Trong bài (tiêu đề, tóm tắt, nội dung, câu hỏi thường gặp) gõ mã {{gia:<mã hạng phòng>:<hình thức>}}, ví dụ
// {{gia:don:qua-dem}} → 500.000đ. Hình thức: gio (2 giờ đầu), them-gio (mỗi giờ thêm), qua-dem, ngay-dem.
// Mã sai (hạng phòng không có) thì giữ nguyên để người soạn nhìn thấy mà sửa.
import { formatVnd, type Room } from "./site";

export const PRICE_TOKEN = /\{\{\s*gia:([a-z0-9-]+):(gio|them-gio|qua-dem|ngay-dem)\s*\}\}/g;

const PLAN = { gio: "hourly", "them-gio": "extraHour", "qua-dem": "overnight", "ngay-dem": "fullDay" } as const;

export function fillPrices(text: string, rooms: Pick<Room, "slug" | "prices">[]): string {
  if (!text.includes("{{")) return text;
  return text.replace(PRICE_TOKEN, (token, slug: string, plan: keyof typeof PLAN) => {
    const price = rooms.find((r) => r.slug === slug)?.prices[PLAN[plan]];
    return price ? formatVnd(price) : token;
  });
}
