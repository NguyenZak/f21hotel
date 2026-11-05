// Markdown rút gọn cho nội dung Bài viết (CMS › Bài viết): đủ cho bài cẩm nang, không cần thư viện.
// Hỗ trợ: ## / ### tiêu đề, đoạn văn, - danh sách, 1. danh sách số, > trích dẫn, bảng | a | b |, ---,
// ![mô tả](ảnh) trên một dòng riêng, **đậm**, *nghiêng*, ~~gạch~~, [chữ](đường dẫn). CMS soạn bằng trình soạn thảo trực quan
// (src/cms/client/RichText.tsx) rồi lưu lại thành đúng cú pháp này. Mọi chữ đều được escape, chỉ sinh ra các thẻ cố định ở đây nên
// HTML lưu trong CMS không chèn được script. Không dùng DOM: chạy được trên server, lúc build và trong ô xem trước của CMS.

const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;
const SAFE_SRC = /^(https:\/\/|\/(?!\/))/i;
const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)\s]+)\)$/;

// Đánh dấu chỗ người viết chưa chắc thông tin; CMS không cho đăng bài còn đánh dấu này
export const UNVERIFIED_MARK = /\[CẦN XÁC NHẬN[^\]]*\]/i;

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// "Đi Mỹ Đình bằng xe buýt?" -> "di-my-dinh-bang-xe-buyt" (id cho mục lục)
export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function inline(raw: string) {
  let s = escape(raw);
  // Liên kết trước (chữ trong [] đã escape), rồi đậm, nghiêng
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (all, text: string, href: string) => {
    const url = href.replace(/&amp;/g, "&");
    if (!SAFE_HREF.test(url)) return text;
    const external = /^https?:\/\//i.test(url);
    return `<a href="${escape(url)}"${external ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  s = s.replace(/~~([^~]+)~~/g, "<s>$1</s>");
  return s;
}

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

export type Heading = { id: string; text: string; level: 2 | 3 };

export function renderMarkdown(md: string): { html: string; headings: Heading[] } {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  const headings: Heading[] = [];
  const used = new Set<string>();
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();
    if (!t) {
      i++;
      continue;
    }
    const h = /^(#{2,3})\s+(.+)$/.exec(t);
    if (h) {
      const level = h[1].length as 2 | 3;
      const text = h[2].replace(/\s+#+$/, "");
      let id = slugify(text) || `muc-${headings.length + 1}`;
      while (used.has(id)) id += "-2";
      used.add(id);
      headings.push({ id, text, level });
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      i++;
      continue;
    }
    const img = IMAGE_LINE.exec(t);
    if (img) {
      const src = img[2].replace(/&amp;/g, "&");
      if (SAFE_SRC.test(src)) out.push(`<figure class="post-figure"><img src="${escape(src)}" alt="${escape(img[1])}" loading="lazy" decoding="async"></figure>`);
      i++;
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(t)) {
      out.push("<hr>");
      i++;
      continue;
    }
    // Bảng: dòng tiêu đề, dòng |---|---|, các dòng dữ liệu
    if (t.startsWith("|") && i + 1 < lines.length && /^\|?\s*:?-{3,}/.test(lines[i + 1].trim())) {
      const head = cells(t);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
      out.push(
        `<div class="post-table"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${rows
          .map((r) => `<tr>${head.map((_, k) => `<td>${inline(r[k] ?? "")}</td>`).join("")}</tr>`)
          .join("")}</tbody></table></div>`,
      );
      continue;
    }
    const list = /^([-*]|\d+[.)])\s+/.exec(t);
    if (list) {
      const ordered = /\d/.test(list[1]);
      const items: string[] = [];
      while (i < lines.length) {
        const m = /^([-*]|\d+[.)])\s+(.*)$/.exec(lines[i].trim());
        if (!m || /\d/.test(m[1]) !== ordered) break;
        items.push(m[2]);
        i++;
      }
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${items.map((x) => `<li>${inline(x)}</li>`).join("")}</${tag}>`);
      continue;
    }
    if (t.startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) quote.push(lines[i++].trim().replace(/^>\s?/, ""));
      out.push(`<blockquote><p>${quote.map(inline).join("<br>")}</p></blockquote>`);
      continue;
    }
    // Đoạn văn: gộp các dòng liền nhau tới dòng trống hoặc khối khác
    const para: string[] = [];
    while (i < lines.length) {
      const x = lines[i].trim();
      if (!x || /^(#{2,3}\s|>|\||([-*]|\d+[.)])\s|-{3,}$)/.test(x) || IMAGE_LINE.test(x)) break;
      para.push(x);
      i++;
    }
    out.push(`<p>${para.map(inline).join("<br>")}</p>`);
  }
  return { html: out.join("\n"), headings };
}

// Chữ thuần (bỏ ký hiệu Markdown) để đếm chữ, làm mô tả, llms.txt
export const markdownText = (md: string) =>
  md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*|`~]/g, " ")
    .replace(/^-{3,}$/gm, " ")
    .replace(/\s+/g, " ")
    .trim();

// Phút đọc (khoảng 200 chữ/phút)
export const readingMinutes = (md: string) => Math.max(1, Math.round(markdownText(md).split(" ").length / 200));
