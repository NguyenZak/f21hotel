import type { JSONContent } from "@tiptap/core";

// Nội dung trình soạn thảo (ProseMirror JSON) -> Markdown đúng các cú pháp src/lib/markdown.ts hiểu. Tách khỏi RichText.tsx
// để thử chuyển qua lại không cần trình duyệt.

const MARKS = ["link", "bold", "italic", "strike"] as const;
const OPEN: Record<string, string> = { bold: "**", italic: "*", strike: "~~", link: "[" };

// Chữ trong một khối: mở, đóng dấu đậm/nghiêng/gạch/liên kết theo thứ tự cố định để không lồng chéo nhau
function inline(nodes: JSONContent[] = [], breakAs = "\n"): string {
  const out: string[] = [];
  let open: { type: string; key: string; href?: string }[] = [];
  const close = (n: number) => {
    // Khoảng trắng cuối nằm ngoài dấu: "**đậm** chữ" thay vì "**đậm **chữ"
    const tail = out.length ? /\s*$/.exec(out[out.length - 1])![0] : "";
    if (tail) out[out.length - 1] = out[out.length - 1].slice(0, -tail.length);
    while (open.length > n) {
      const m = open.pop()!;
      out.push(m.type === "link" ? `](${m.href})` : OPEN[m.type]);
    }
    if (tail) out.push(tail);
  };
  for (const node of nodes) {
    if (node.type === "hardBreak") {
      close(0);
      out.push(breakAs);
      continue;
    }
    if (node.type !== "text" || !node.text) continue;
    const want = MARKS.flatMap((type) => {
      const m = node.marks?.find((x) => x.type === type);
      if (!m) return [];
      const href = type === "link" ? String(m.attrs?.href ?? "") : undefined;
      return [{ type, key: href ? `link:${href}` : type, href }];
    });
    let same = 0;
    while (same < open.length && same < want.length && open[same].key === want[same].key) same++;
    close(same);
    let text = node.text;
    if (want.length > same) {
      const lead = /^\s*/.exec(text)![0];
      out.push(lead);
      text = text.slice(lead.length);
      for (const m of want.slice(same)) out.push(OPEN[m.type]);
      open = [...open, ...want.slice(same)];
    }
    out.push(text);
  }
  close(0);
  return out.join("");
}

const cellText = (cell: JSONContent) =>
  (cell.content ?? [])
    .map((b) => inline(b.content, " "))
    .join(" ")
    .replace(/\|/g, "/")
    .trim();

function listItems(list: JSONContent, out: string[]) {
  let n = (list.attrs?.start as number) || 1;
  for (const item of list.content ?? []) {
    const text = (item.content ?? [])
      .filter((b) => b.type === "paragraph" || b.type === "heading")
      .map((b) => inline(b.content, " "))
      .join(" ")
      .trim();
    if (text) out.push(list.type === "orderedList" ? `${n++}. ${text}` : `- ${text}`);
    // Website chưa có danh sách lồng nhau: mục con hiện ngay sau mục cha
    for (const sub of item.content ?? []) if (sub.type === "bulletList" || sub.type === "orderedList") listItems(sub, out);
  }
}

function block(node: JSONContent): string {
  switch (node.type) {
    case "paragraph":
      return inline(node.content).trim();
    case "heading":
      return `${"#".repeat(node.attrs?.level === 3 ? 3 : 2)} ${inline(node.content, " ").trim()}`;
    case "bulletList":
    case "orderedList": {
      const out: string[] = [];
      listItems(node, out);
      return out.join("\n");
    }
    case "blockquote":
      return (node.content ?? [])
        .map(block)
        .filter(Boolean)
        .join("\n")
        .split("\n")
        .map((l) => `> ${l}`)
        .join("\n");
    case "horizontalRule":
      return "---";
    case "image": {
      const src = String(node.attrs?.src ?? "");
      return src ? `![${String(node.attrs?.alt ?? "").replace(/[[\]]/g, "")}](${src})` : "";
    }
    case "table": {
      const rows = (node.content ?? []).map((r) => (r.content ?? []).map(cellText));
      if (!rows.length) return "";
      const cols = Math.max(...rows.map((r) => r.length));
      const line = (r: string[]) => `| ${Array.from({ length: cols }, (_, k) => r[k] ?? "").join(" | ")} |`;
      return [line(rows[0]), `|${"---|".repeat(cols)}`, ...rows.slice(1).map(line)].join("\n");
    }
    default:
      return (node.content ?? []).map(block).filter(Boolean).join("\n\n");
  }
}

export const toMarkdown = (doc: JSONContent) =>
  (doc.content ?? [])
    .map(block)
    .filter(Boolean)
    .join("\n\n");
