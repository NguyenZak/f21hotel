// Nội dung rich text của khối "Đoạn văn" (trình soạn thảo của Puck lưu dạng HTML).
// Website chỉ giữ các thẻ định dạng cơ bản; mọi thẻ và thuộc tính khác bị bỏ, để HTML lưu trong CMS
// không chèn được script hay style lạ vào trang. Không dùng DOM nên chạy được trên Cloudflare Workers.

const BLOCK_TAGS = new Set(["p", "ul", "ol", "li", "blockquote"]);
const INLINE_TAGS = new Set(["strong", "b", "em", "i", "u", "s", "br", "a"]);
const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|zalo:|\/(?!\/)|#)/i;

const escapeText = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeAttr = (s: string) => s.replace(/&(?!(?:amp|lt|gt|quot|#\d+);)/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export const isHtml = (s: string) => /<\/?[a-z][\s\S]*>/i.test(s);

// Chữ thường kiểu cũ (đoạn cách nhau một dòng trống) -> HTML các đoạn <p>
export function plainToHtml(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeText(p.replace(/&/g, "&amp;")).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function sanitizeRichText(html: string) {
  let out = "";
  const open: string[] = [];
  // Chỉ coi là thẻ khi "<" đứng ngay trước tên thẻ; "1 < 2" vẫn là chữ
  for (const part of html.split(/(<\/?[a-z][^<>]*>)/i)) {
    if (!part) continue;
    if (!part.startsWith("<")) {
      out += escapeText(part);
      continue;
    }
    const m = /^<(\/?)([a-z0-9]+)([^>]*)>$/i.exec(part);
    const tag = m?.[2].toLowerCase() ?? "";
    if (!m || (!BLOCK_TAGS.has(tag) && !INLINE_TAGS.has(tag))) continue;
    if (tag === "br") {
      out += "<br>";
      continue;
    }
    if (m[1]) {
      // Chỉ đóng thẻ đang mở, tránh thẻ đóng thừa làm vỡ bố cục trang
      const at = open.lastIndexOf(tag);
      if (at === -1) continue;
      for (const t of open.splice(at).reverse()) out += `</${t}>`;
      continue;
    }
    if (tag === "a") {
      const href = /\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(m[3]);
      const url = (href?.[2] ?? href?.[3] ?? href?.[4] ?? "").trim().replace(/&amp;/g, "&");
      if (!SAFE_HREF.test(url)) continue;
      const external = /^https?:\/\//i.test(url);
      out += `<a href="${escapeAttr(url)}"${external ? ' target="_blank" rel="noopener"' : ""}>`;
    } else {
      out += `<${tag}>`;
    }
    open.push(tag);
  }
  for (const t of open.reverse()) out += `</${t}>`;
  return out;
}
