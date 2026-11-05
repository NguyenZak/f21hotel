"use client";

// Cấu hình đầy đủ cho trình dựng trang: giao diện khối (render.tsx) + trường chỉnh sửa + giá trị mặc định.
import { RichTextMenu, type ComponentConfig, type Config, type Field } from "@puckeditor/core";
import { PLACE_CATEGORIES, type Photo } from "@/lib/site";
import { blockRenders, type BlockName } from "./config";
import { backgroundField, headFields, iconField, imageField, text, textarea } from "./fields";
import * as D from "./home";
import * as B from "./render";
import { isHtml, plainToHtml, sanitizeRichText } from "@/lib/richtext";

const sectionFields = {
  background: backgroundField,
  anchor: { type: "text", label: "Mã neo (#)" } as Field,
};

const centerField: Field = {
  type: "radio",
  label: "Căn tiêu đề",
  options: [
    { label: "Trái", value: false },
    { label: "Giữa", value: true },
  ],
};

const alignField: Field = {
  type: "radio",
  label: "Căn lề",
  options: [
    { label: "Trái", value: "left" },
    { label: "Giữa", value: "center" },
  ],
};

const photoList = (label: string): Field => ({
  type: "array",
  label,
  arrayFields: { photo: imageField() },
  defaultItemProps: { photo: undefined },
  getItemSummary: (item: { photo?: Photo }, i?: number) => item.photo?.alt || `Ảnh ${(i ?? 0) + 1}`,
});

const linkFields = (label = "Nút") => ({
  buttonLabel: text(`${label}: chữ (để trống là ẩn)`),
  buttonHref: text(`${label}: đường dẫn`),
});

// Từng khối: tên hiện trong trình dựng, trường chỉnh sửa, giá trị khi kéo vào
const components = {
  Hero: {
    label: "Hero (slider ảnh)",
    fields: {
      heading: text("Tiêu đề trang (ẩn, cho Google và trình đọc màn hình)"),
      slides: {
        type: "array",
        label: "Slide",
        arrayFields: {
          photo: imageField("Ảnh nền"),
          photoMobile: imageField("Ảnh cho điện thoại (không bắt buộc)"),
          kicker: text("Dòng nhỏ phía trên"),
          bold: text("Tiêu đề đậm"),
          light: text("Tiêu đề nhạt"),
          sub: textarea("Mô tả"),
          costValue: text("Ô giá: số"),
          costLabel: text("Ô giá: chú thích"),
          costHref: text("Ô giá: đường dẫn"),
          bookLabel: text("Nút: chữ"),
          bookHref: text("Nút: đường dẫn"),
        },
        defaultItemProps: { ...D.heroDefaults.slides[0], photo: undefined, photoMobile: undefined },
        getItemSummary: (s: { bold?: string; light?: string }) => [s.bold, s.light].filter(Boolean).join(" ") || "Slide",
      },
      search: {
        type: "radio",
        label: "Ô chọn ngày",
        options: [
          { label: "Hiện", value: true },
          { label: "Ẩn", value: false },
        ],
      },
      tabs: {
        type: "array",
        label: "Thanh mục dưới hero",
        arrayFields: { label: text("Chữ"), href: text("Đường dẫn (#ma-neo)") },
        defaultItemProps: { label: "Mục mới", href: "#" },
        getItemSummary: (t: { label?: string }) => t.label || "Mục",
      },
    },
    defaultProps: D.heroDefaults,
  },
  Intro: {
    label: "Giới thiệu (bản đồ 3D hoặc ảnh vòm + điểm nổi bật)",
    fields: {
      media: {
        type: "radio",
        label: "Khung bên trái",
        options: [
          { label: "Bản đồ 3D", value: "map" },
          { label: "Ảnh vòm", value: "photo" },
        ],
      },
      photos: photoList("Album ảnh (khi chọn Ảnh vòm: chạy thành slider trong khung vòm)"),
      badgeValue: text("Huy hiệu: số"),
      badgeLabel: text("Huy hiệu: chú thích"),
      eyebrow: text("Nhãn nhỏ"),
      title: text("Tiêu đề"),
      lead: textarea("Đoạn mở đầu"),
      text: textarea("Đoạn nội dung"),
      points: {
        type: "array",
        label: "Điểm nổi bật",
        arrayFields: { icon: iconField, title: text("Tiêu đề"), text: textarea("Mô tả") },
        defaultItemProps: { icon: "tree", title: "Điểm nổi bật", text: "" },
        getItemSummary: (p: { title?: string }) => p.title || "Điểm",
      },
      linkLabel: text("Liên kết: chữ"),
      linkHref: text("Liên kết: đường dẫn (trống = Google Maps)"),
      ...sectionFields,
    },
    defaultProps: D.introDefaults,
  },
  Rooms: {
    label: "Phòng & giá (lấy từ Quản lý phòng)",
    fields: { ...headFields, center: centerField, buttonLabel: text("Nút: chữ (để trống là ẩn)"), ...sectionFields },
    defaultProps: D.roomsDefaults,
  },
  Perks: {
    label: "Quyền lợi đặt trực tiếp",
    fields: {
      ...headFields,
      center: centerField,
      items: {
        type: "array",
        label: "Quyền lợi",
        arrayFields: { title: text("Tiêu đề"), text: textarea("Mô tả") },
        defaultItemProps: { title: "Quyền lợi mới", text: "" },
        getItemSummary: (p: { title?: string }) => p.title || "Quyền lợi",
      },
      foot: textarea("Ghi chú cuối ({gio} = giờ trả lời trong Cài đặt)"),
      ...linkFields(),
      ...sectionFields,
    },
    defaultProps: D.perksDefaults,
  },
  Gallery: {
    label: "Thư viện ảnh",
    fields: { ...headFields, center: centerField, photos: photoList("Ảnh"), ...sectionFields },
    defaultProps: D.galleryDefaults,
  },
  Guests: {
    label: "Nhóm khách (thẻ có biểu tượng)",
    fields: {
      ...headFields,
      center: centerField,
      items: {
        type: "array",
        label: "Thẻ",
        arrayFields: { icon: iconField, title: text("Tiêu đề"), text: textarea("Mô tả"), quote: textarea("Câu trích") },
        defaultItemProps: { icon: "heart", title: "Nhóm khách", text: "", quote: "" },
        getItemSummary: (p: { title?: string }) => p.title || "Thẻ",
      },
      ...sectionFields,
    },
    defaultProps: D.guestsDefaults,
  },
  Location: {
    label: "Vị trí & bản đồ",
    fields: {
      eyebrow: text("Nhãn nhỏ"),
      title: text("Tiêu đề"),
      distances: {
        type: "array",
        label: "Khoảng cách",
        arrayFields: { place: text("Địa điểm"), time: text("Thời gian") },
        defaultItemProps: { place: "Địa điểm", time: "~10 phút" },
        getItemSummary: (d: { place?: string }) => d.place || "Địa điểm",
      },
      linkLabel: text("Liên kết: chữ"),
      linkHref: text("Liên kết: đường dẫn"),
      map: {
        type: "radio",
        label: "Bản đồ",
        options: [
          { label: "3D động", value: "3d" },
          { label: "Google Maps", value: "google" },
        ],
      },
      ...sectionFields,
    },
    defaultProps: D.locationDefaults,
  },
  Nearby: {
    label: "Xung quanh F21 (lưới ảnh từ mục Tiện ích xung quanh)",
    fields: {
      category: { type: "select", label: "Nhóm địa điểm", options: PLACE_CATEGORIES.map((c) => ({ label: c.label, value: c.value })) },
      ...headFields,
      center: centerField,
      limit: { type: "number", label: "Số địa điểm hiện (5 là vừa lưới)", min: 1, max: 12 },
      linkLabel: text("Liên kết: chữ (trống là ẩn)"),
      linkHref: text("Liên kết: đường dẫn"),
      ...sectionFields,
    },
    defaultProps: D.nearbyDefaults,
  },
  Offers: {
    label: "Ưu đãi (lấy từ mục Ưu đãi)",
    fields: { ...headFields, center: centerField, limit: { type: "number", label: "Số ưu đãi hiện", min: 1, max: 12 }, ...sectionFields },
    defaultProps: D.offersDefaults,
  },
  Reviews: {
    label: "Đánh giá (lấy từ mục Đánh giá)",
    fields: { ...headFields, center: centerField, buttonLabel: text("Nút Google Maps: chữ (trống là ẩn)"), ...sectionFields },
    defaultProps: D.reviewsDefaults,
  },
  Faq: {
    label: "Hỏi đáp (lấy từ mục Hỏi đáp)",
    fields: { ...headFields, center: centerField, ...sectionFields },
    defaultProps: D.faqDefaults,
  },
  Cta: {
    label: "Dải kêu gọi đặt phòng",
    fields: { eyebrow: text("Nhãn nhỏ"), title: text("Tiêu đề"), text: textarea("Mô tả") },
    defaultProps: D.ctaDefaults,
  },
  Section: {
    label: "Mục trống (thả khối vào)",
    fields: {
      ...headFields,
      center: centerField,
      content: { type: "slot", label: "Nội dung" },
      narrow: {
        type: "radio",
        label: "Độ rộng",
        options: [
          { label: "Rộng", value: false },
          { label: "Hẹp (đọc bài)", value: true },
        ],
      },
      ...sectionFields,
    },
    defaultProps: { eyebrow: "", title: "Tiêu đề mục", intro: "", center: false, narrow: false, background: "", anchor: "", content: [] },
  },
  Columns: {
    label: "Hai cột",
    fields: {
      ratio: {
        type: "select",
        label: "Tỉ lệ cột",
        options: [
          { label: "1 : 1", value: "1-1" },
          { label: "2 : 1", value: "2-1" },
          { label: "1 : 2", value: "1-2" },
        ],
      },
      left: { type: "slot", label: "Cột trái" },
      right: { type: "slot", label: "Cột phải" },
    },
    defaultProps: { ratio: "1-1", left: [], right: [] },
  },
  Heading: {
    label: "Tiêu đề",
    fields: {
      text: text("Chữ"),
      level: {
        type: "select",
        label: "Cấp",
        options: [
          { label: "Tiêu đề lớn (H2)", value: "h2" },
          { label: "Tiêu đề nhỏ (H3)", value: "h3" },
        ],
      },
      align: alignField,
    },
    defaultProps: { text: "Tiêu đề", level: "h2", align: "left" },
  },
  Text: {
    label: "Đoạn văn",
    fields: {
      // Trình soạn thảo rich text: in đậm, nghiêng, gạch chân, gạch đầu dòng, đánh số, trích dẫn, liên kết.
      // Website chỉ giữ các định dạng này (src/lib/richtext.ts); căn lề dùng ô "Căn lề" bên dưới.
      text: {
        type: "richtext",
        label: "Nội dung",
        contentEditable: true,
        initialHeight: 220,
        options: { heading: false, code: false, codeBlock: false, horizontalRule: false, textAlign: false },
        renderMenu: ({ editor, editorState }) => (
          <RichTextMenu>
            <RichTextMenu.Group>
              <RichTextMenu.Bold />
              <RichTextMenu.Italic />
              <RichTextMenu.Underline />
              <RichTextMenu.Strikethrough />
            </RichTextMenu.Group>
            <RichTextMenu.Group>
              <RichTextMenu.BulletList />
              <RichTextMenu.OrderedList />
              <RichTextMenu.Blockquote />
            </RichTextMenu.Group>
            <RichTextMenu.Group>
              <LinkControl editor={editor} active={Boolean(editor?.isActive("link"))} disabled={!editorState} />
            </RichTextMenu.Group>
          </RichTextMenu>
        ),
      },
      size: {
        type: "radio",
        label: "Cỡ chữ",
        options: [
          { label: "Thường", value: "" },
          { label: "Lớn", value: "lead" },
        ],
      },
      align: alignField,
    },
    defaultProps: { text: "<p>Nội dung đoạn văn.</p>", size: "", align: "left" },
    // Trang lưu trước khi có rich text: đổi chữ thường sang các đoạn <p> để mở ra không mất xuống dòng.
    // HTML cũng được lọc lại như trên website, để bản lưu chỉ chứa các thẻ định dạng cho phép.
    resolveData: ({ props }) => {
      if (typeof props.text !== "string" || !props.text) return { props };
      const clean = sanitizeRichText(isHtml(props.text) ? props.text : plainToHtml(props.text));
      return clean === props.text ? { props } : { props: { ...props, text: clean } };
    },
  },
  Image: {
    label: "Ảnh",
    fields: { photo: imageField(), caption: text("Chú thích"), album: photoList("Ảnh thêm trong album (bấm ảnh để xem)") },
    defaultProps: { caption: "", album: [] },
  },
  Button: {
    label: "Nút",
    fields: {
      label: text("Chữ"),
      href: text("Đường dẫn"),
      style: {
        type: "select",
        label: "Kiểu",
        options: [
          { label: "Đỏ mận", value: "btn" },
          { label: "Vàng", value: "btn btn-gold" },
          { label: "Viền", value: "btn btn-ghost" },
          { label: "Liên kết có mũi tên", value: "link-arrow" },
        ],
      },
      align: alignField,
    },
    defaultProps: { label: "Đặt phòng", href: "/dat-phong", style: "btn", align: "left" },
  },
  Spacer: {
    label: "Khoảng trống",
    fields: { size: { type: "number", label: "Chiều cao (px)", min: 8, max: 240 } },
    defaultProps: { size: 40 },
  },
} satisfies Record<BlockName, Omit<ComponentConfig, "render"> & { label: string }>;

export const editorConfig = {
  categories: {
    sections: {
      title: "Mục của trang",
      components: ["Hero", "Intro", "Rooms", "Perks", "Gallery", "Guests", "Location", "Nearby", "Offers", "Reviews", "Faq", "Cta"],
    },
    layout: { title: "Bố cục", components: ["Section", "Columns", "Spacer"] },
    basic: { title: "Cơ bản", components: ["Heading", "Text", "Image", "Button"] },
  },
  root: {
    fields: {
      title: text("Tên trang"),
      description: textarea("Mô tả cho Google (để trống dùng mô tả chung)"),
    },
    render: B.RootBlock,
  },
  components: Object.fromEntries(
    Object.entries(components).map(([name, def]) => [
      name,
      { ...def, render: blockRenders[name as BlockName] },
    ]),
  ),
} as unknown as Config;

type LinkEditor = {
  getAttributes: (name: string) => { href?: string };
  chain: () => {
    focus: () => {
      extendMarkRange: (name: string) => {
        setLink: (a: { href: string }) => { run: () => boolean };
        unsetLink: () => { run: () => boolean };
      };
    };
  };
};

// Nút chèn liên kết cho trình rich text: nhập đường dẫn, để trống thì bỏ liên kết
function LinkControl({ editor, active, disabled }: { editor: unknown; active: boolean; disabled: boolean }) {
  const ed = editor as LinkEditor | null;
  return (
    <RichTextMenu.Control
      title="Liên kết"
      active={active}
      disabled={disabled || !ed}
      icon={
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      }
      onClick={(e) => {
        e.preventDefault();
        if (!ed) return;
        const current = ed.getAttributes("link").href ?? "";
        const href = window.prompt("Đường dẫn (https://…, /dat-phong, tel:0968…). Để trống để bỏ liên kết.", current);
        if (href === null) return;
        const chain = ed.chain().focus().extendMarkRange("link");
        if (href.trim()) chain.setLink({ href: href.trim() }).run();
        else chain.unsetLink().run();
      }}
    />
  );
}
