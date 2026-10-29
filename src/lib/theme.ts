// Cài đặt giao diện có thể đổi mà không cần sửa code.
// Sau này CMS sẽ ghi lựa chọn vào đây (hoặc vào nơi lưu trữ mà file này đọc ra).

// Các font đã nạp sẵn trong src/app/fonts.ts, đều có đủ tiếng Việt
export const fontChoices = {
  // Không chân
  inter: { label: "Inter", kind: "sans" },
  "be-vietnam-pro": { label: "Be Vietnam Pro", kind: "sans" },
  montserrat: { label: "Montserrat", kind: "sans" },
  "plus-jakarta-sans": { label: "Plus Jakarta Sans", kind: "sans" },
  manrope: { label: "Manrope", kind: "sans" },
  lexend: { label: "Lexend", kind: "sans" },
  // Có chân
  "stix-two-text": { label: "STIX Two Text", kind: "serif" },
  "playfair-display": { label: "Playfair Display", kind: "serif" },
  lora: { label: "Lora", kind: "serif" },
  "cormorant-garamond": { label: "Cormorant Garamond", kind: "serif" },
  "noto-serif-display": { label: "Noto Serif Display", kind: "serif" },
  // Font riêng (file trong src/app/fonts/)
  "trajan-pro-3": { label: "Trajan Pro 3", kind: "serif" },
} as const;

export type FontKey = keyof typeof fontChoices;

// Font cho từng vai trò trên site
export const theme: {
  fonts: {
    // Tiêu đề các mục (h1–h4), in hoa
    heading: FontKey;
    // Chữ trong hero trang chủ
    hero: FontKey;
    // Đoạn văn nội dung
    body: FontKey;
    // Chữ giao diện: nhãn, nút, menu, form, giá và số
    ui: FontKey;
  };
} = {
  fonts: {
    heading: "trajan-pro-3",
    hero: "inter",
    body: "stix-two-text",
    ui: "inter",
  },
};
