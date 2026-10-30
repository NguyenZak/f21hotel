import { getOffers, getPriceNotes, getRooms, getSite } from "@/lib/cms";
import { formatVnd, nav } from "@/lib/site";

// /llms.txt: tóm tắt khách sạn bằng văn bản thuần cho ChatGPT, Perplexity và các trợ lý AI.
// Lấy cùng dữ liệu với website nên tự cập nhật khi sửa trong CMS.
export async function GET() {
  const [site, rooms, offers, notes] = await Promise.all([getSite(), getRooms(), getOffers(), getPriceNotes()]);
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
    "## Ưu đãi",
    "",
    ...offers.map((o) => `- ${o.title} (${o.when})${o.code ? `, mã ${o.code}` : ""}: ${o.summary}`),
    "",
    "## Các trang",
    "",
    `- [Trang chủ](${abs("/")})`,
    ...nav.map((n) => `- [${n.label}](${abs(n.href)})`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
