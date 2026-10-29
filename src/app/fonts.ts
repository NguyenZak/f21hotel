import {
  Be_Vietnam_Pro,
  Cormorant_Garamond,
  Inter,
  Lexend,
  Lora,
  Manrope,
  Montserrat,
  Noto_Serif_Display,
  Playfair_Display,
  Plus_Jakarta_Sans,
  STIX_Two_Text,
} from "next/font/google";
import localFont from "next/font/local";
import type { FontKey } from "@/lib/theme";

// Nạp sẵn mọi font có thể chọn (tự host qua next/font, không gọi Google Fonts lúc chạy).
// Mỗi font gắn một biến CSS riêng; layout chỉ trỏ vai trò (heading/hero/body) vào font được chọn.
// preload: true cho font đang dùng mặc định, false cho font dự phòng: trình duyệt chỉ tải
// file font khi có chữ thực sự dùng font đó, nên font không được chọn không làm chậm trang.
// Lưu ý: next/font yêu cầu tham số là giá trị viết thẳng, không dùng biến dùng chung được.

const trajan = localFont({
  src: [
    { path: "./fonts/trajan-pro-3-regular.woff2", weight: "400" },
    { path: "./fonts/trajan-pro-3-semibold.woff2", weight: "600" },
    { path: "./fonts/trajan-pro-3-bold.woff2", weight: "700" },
  ],
  variable: "--font-trajan-pro-3",
  display: "swap",
});

const stix = STIX_Two_Text({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-stix-two-text",
  display: "swap",
});

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter", display: "swap" });

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
  preload: false,
});

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display: "swap",
  preload: false,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  preload: false,
});

const manrope = Manrope({ subsets: ["latin", "vietnamese"], variable: "--font-manrope", display: "swap", preload: false });

const lexend = Lexend({ subsets: ["latin", "vietnamese"], variable: "--font-lexend", display: "swap", preload: false });

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-playfair-display",
  display: "swap",
  preload: false,
});

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
  preload: false,
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-garamond",
  display: "swap",
  preload: false,
});

const notoSerifDisplay = Noto_Serif_Display({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-noto-serif-display",
  display: "swap",
  preload: false,
});

const fonts = {
  inter,
  "be-vietnam-pro": beVietnamPro,
  montserrat,
  "plus-jakarta-sans": plusJakartaSans,
  manrope,
  lexend,
  "stix-two-text": stix,
  "playfair-display": playfairDisplay,
  lora,
  "cormorant-garamond": cormorantGaramond,
  "noto-serif-display": notoSerifDisplay,
  "trajan-pro-3": trajan,
} satisfies Record<FontKey, { variable: string }>;

// Class gắn lên <html> để mọi biến font đều có sẵn
export const fontVariables = Object.values(fonts)
  .map((f) => f.variable)
  .join(" ");

// Biến CSS của font theo khoá, ví dụ "inter" -> "var(--font-inter)"
export const fontVar = (key: FontKey) => `var(--font-${key})`;
