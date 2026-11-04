import { getOffers, getPosts, getPriceNotes, getRooms, getSite } from "@/lib/cms";
import { distances, formatVnd, nav, nearby } from "@/lib/site";

// /llms.txt: tóm tắt khách sạn bằng văn bản thuần cho ChatGPT, Perplexity và các trợ lý AI.
// Lấy cùng dữ liệu với website nên tự cập nhật khi sửa trong CMS.
export async function GET() {
  const [site, rooms, offers, notes, posts] = await Promise.all([getSite(), getRooms(), getOffers(), getPriceNotes(), getPosts()]);
  const abs = (path: string) => new URL(path, site.url).toString();
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `- Địa chỉ: ${site.address.full}`,
    `- Chỉ đường: ${site.directions}`,
    `- Hotline: ${site.phoneDisplay}. Zalo: ${site.zalo}${site.email ? `. Email: ${site.email}` : ""}`,
    `- Nhận phòng ${site.checkIn}, trả phòng ${site.checkOut} (nghỉ ngày đêm)`,
    `- Đặt cọc: ${notes.deposit}`,
    "",
    "## Hạng phòng và giá",
    "",
    ...rooms.map(
      (r) =>
        `- ${r.name} (tối đa ${r.guests} người): qua đêm ${formatVnd(r.prices.overnight)}, ngày đêm ${formatVnd(r.prices.fullDay)}, nghỉ giờ ${formatVnd(r.prices.hourly)} cho 2 giờ đầu, thêm ${formatVnd(r.prices.extraHour)}/giờ. ${r.short}`,
    ),
    "",
    "## Khoảng cách",
    "",
    ...distances.map((d) => `- ${d.place}: ${d.time}`),
    "",
    "## Xung quanh khách sạn",
    "",
    ...nearby.map((n) => `- ${n.title}: ${n.items.join("; ")}`),
    "",
    "## Ưu đãi",
    "",
    ...offers.map((o) => `- ${o.title} (${o.when})${o.code ? `, mã ${o.code}` : ""}: ${o.summary}`),
    "",
    "## Các trang",
    "",
    `- [Trang chủ](${abs("/")})`,
    ...nav.map((n) => `- [${n.label}](${abs(n.href)})`),
    `- [Cẩm nang](${abs("/bai-viet")})`,
    "",
    // Bài cẩm nang (CMS › Bài viết): AI đọc tóm tắt rồi mở bài khi cần chi tiết
    ...(posts.length ? ["## Cẩm nang", "", ...posts.map((p) => `- [${p.title}](${abs(`/bai-viet/${p.slug}`)}): ${p.excerpt}`), ""] : []),
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
