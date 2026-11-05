"use client";

import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { renderMarkdown } from "@/lib/markdown";
import { MediaPicker } from "./media";
import { toMarkdown } from "./rich-markdown";

// Trình soạn thảo trực quan (TipTap) cho trường Markdown: mở bằng HTML do src/lib/markdown.ts dựng, lưu lại thành Markdown
// đúng các cú pháp bộ chuyển đó hiểu. Chỉ bật những định dạng website hiển thị được (không gạch chân, không màu chữ),
// nên dán từ Word hay trang web khác cũng chỉ giữ lại tiêu đề, đậm, nghiêng, danh sách, bảng, liên kết, ảnh.
// Tải riêng trong trình duyệt (fields.tsx dùng dynamic ssr: false) để không đưa TipTap vào gói worker.

export type RichTextProps = { id: string; value: string; onChange: (md: string) => void };

// ---------- Thanh công cụ ----------

const SAFE_LINK = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;
// Ảnh trong bài: bản rộng tối đa 1400px từ Cloudinary cho nhẹ
const bodyImage = (url: string) => url.replace("/upload/", "/upload/w_1400,c_limit/");

function Btn({ on, title, onClick, disabled, children }: { on?: boolean; title: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={`c-rte__btn${on ? " is-on" : ""}`}
      title={title}
      aria-label={title}
      aria-pressed={on}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, onImage }: { editor: Editor; onImage: () => void }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      block: e.isActive("heading", { level: 2 }) ? "h2" : e.isActive("heading", { level: 3 }) ? "h3" : "p",
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      strike: e.isActive("strike"),
      link: e.isActive("link"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      table: e.isActive("table"),
      undo: e.can().undo(),
      redo: e.can().redo(),
    }),
  });
  const c = () => editor.chain().focus();
  const setLink = () => {
    const prev = String(editor.getAttributes("link").href ?? "");
    const href = window.prompt("Đường dẫn (https://…, hoặc /dat-phong cho trang trong website). Để trống để bỏ liên kết.", prev);
    if (href === null) return;
    const url = href.trim();
    if (!url) return void c().extendMarkRange("link").unsetLink().run();
    if (!SAFE_LINK.test(url)) return void window.alert("Đường dẫn phải bắt đầu bằng https://, / , mailto: hoặc tel:");
    if (editor.state.selection.empty && !s.link) return void c().insertContent({ type: "text", text: url, marks: [{ type: "link", attrs: { href: url } }] }).run();
    c().extendMarkRange("link").setLink({ href: url }).run();
  };
  return (
    <div className="c-rte__bar" role="toolbar" aria-label="Định dạng">
      <Btn title="Hoàn tác (Ctrl+Z)" disabled={!s.undo} onClick={() => c().undo().run()}>
        ↶
      </Btn>
      <Btn title="Làm lại (Ctrl+Shift+Z)" disabled={!s.redo} onClick={() => c().redo().run()}>
        ↷
      </Btn>
      <span className="c-rte__sep" />
      <select
        className="c-rte__select"
        aria-label="Kiểu đoạn"
        value={s.block}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "p") c().setParagraph().run();
          else c().setHeading({ level: v === "h2" ? 2 : 3 }).run();
        }}
      >
        <option value="p">Đoạn văn</option>
        <option value="h2">Tiêu đề lớn</option>
        <option value="h3">Tiêu đề nhỏ</option>
      </select>
      <span className="c-rte__sep" />
      <Btn title="Đậm (Ctrl+B)" on={s.bold} onClick={() => c().toggleBold().run()}>
        <b>B</b>
      </Btn>
      <Btn title="Nghiêng (Ctrl+I)" on={s.italic} onClick={() => c().toggleItalic().run()}>
        <i>I</i>
      </Btn>
      <Btn title="Gạch ngang" on={s.strike} onClick={() => c().toggleStrike().run()}>
        <s>S</s>
      </Btn>
      <Btn title="Liên kết (Ctrl+K)" on={s.link} onClick={setLink}>
        🔗
      </Btn>
      <span className="c-rte__sep" />
      <Btn title="Danh sách chấm" on={s.bullet} onClick={() => c().toggleBulletList().run()}>
        ••
      </Btn>
      <Btn title="Danh sách số" on={s.ordered} onClick={() => c().toggleOrderedList().run()}>
        1.
      </Btn>
      <Btn title="Trích dẫn" on={s.quote} onClick={() => c().toggleBlockquote().run()}>
        ❝
      </Btn>
      <Btn title="Đường kẻ ngang" onClick={() => c().setHorizontalRule().run()}>
        ―
      </Btn>
      <span className="c-rte__sep" />
      <Btn title="Chèn ảnh từ thư viện" onClick={onImage}>
        🖼
      </Btn>
      <Btn title="Chèn bảng" disabled={s.table} onClick={() => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
        ▦
      </Btn>
      {s.table ? (
        <span className="c-rte__group">
          <Btn title="Thêm hàng bên dưới" onClick={() => c().addRowAfter().run()}>
            +hàng
          </Btn>
          <Btn title="Thêm cột bên phải" onClick={() => c().addColumnAfter().run()}>
            +cột
          </Btn>
          <Btn title="Xoá hàng" onClick={() => c().deleteRow().run()}>
            −hàng
          </Btn>
          <Btn title="Xoá cột" onClick={() => c().deleteColumn().run()}>
            −cột
          </Btn>
          <Btn title="Xoá bảng" onClick={() => c().deleteTable().run()}>
            ✕bảng
          </Btn>
        </span>
      ) : null}
    </div>
  );
}

export default function RichText({ id, value, onChange }: RichTextProps) {
  const [picking, setPicking] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        underline: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https", isAllowedUri: (url) => SAFE_LINK.test(url) },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      TableKit.configure({ table: { resizable: false } }),
    ],
    // Mở bằng HTML của website nên thấy đúng như khi đăng; chỉ ghi lại khi người dùng sửa, nội dung cũ không bị đổi ngầm
    content: renderMarkdown(value).html,
    editorProps: { attributes: { id, class: "c-rte__doc c-md__preview", spellcheck: "true" } },
    onUpdate: ({ editor: e }) => onChange(toMarkdown(e.getJSON())),
  });
  if (!editor) return <div className="c-rte c-rte--loading">Đang mở trình soạn thảo…</div>;
  return (
    <div className="c-rte">
      <Toolbar editor={editor} onImage={() => setPicking(true)} />
      <EditorContent editor={editor} />
      {picking ? (
        <MediaPicker
          multiple
          onClose={() => setPicking(false)}
          onPick={(items) => {
            editor
              .chain()
              .focus()
              .insertContent(items.map((m) => ({ type: "image", attrs: { src: bodyImage(m.url), alt: m.alt } })))
              .run();
            setPicking(false);
          }}
        />
      ) : null}
    </div>
  );
}
