// Menu CMS theo công việc và vai trò: dùng cho thanh bên (Shell.tsx) và bảng lệnh Ctrl+K (CommandPalette.tsx).
// Mục có "legacy" chưa làm lại, tạm mở trang của CMS cũ (/admin).
import type { Role } from "./api";
import type { IconName } from "./icons";

export type NavItem = { href: string; label: string; icon: IconName; roles?: Role[]; legacy?: boolean; keywords?: string[] };
export type NavGroup = { title?: string; roles?: Role[]; items: NavItem[] };

export const ALL: Role[] = ["owner", "manager", "staff"];
export const MANAGE: Role[] = ["owner", "manager"];

export const NAV: NavGroup[] = [
  {
    items: [
      { href: "/quan-tri", label: "Hôm nay", icon: "today", keywords: ["tổng quan", "dashboard"] },
      { href: "/quan-tri/dat-phong", label: "Đặt phòng", icon: "bookings", keywords: ["booking", "đơn"] },
      { href: "/quan-tri/lich-phong", label: "Lịch phòng", icon: "calendar", keywords: ["calendar", "phòng trống"] },
      { href: "/quan-tri/bao-cao", label: "Báo cáo", icon: "trend", roles: MANAGE, keywords: ["doanh thu", "công suất", "thống kê"] },
    ],
  },
  {
    title: "Phòng & giá",
    items: [
      { href: "/quan-tri/hang-phong", label: "Hạng phòng", icon: "roomTypes" },
      { href: "/quan-tri/phong", label: "Danh sách phòng", icon: "rooms" },
      { href: "/quan-tri/gia-theo-ngay", label: "Giá theo ngày", icon: "rates", keywords: ["giá", "lễ tết"] },
    ],
  },
  {
    title: "Website",
    roles: MANAGE,
    items: [
      { href: "/quan-tri/xuat-ban", label: "Xuất bản website", icon: "publish", keywords: ["deploy", "đăng", "cập nhật website", "build"] },
      { href: "/quan-tri/trang", label: "Trang", icon: "pages", keywords: ["trình dựng", "trang chủ"] },
      { href: "/quan-tri/bai-viet", label: "Bài viết", icon: "posts", keywords: ["blog", "cẩm nang", "seo", "tin tức"] },
      { href: "/quan-tri/uu-dai", label: "Ưu đãi", icon: "offers", keywords: ["khuyến mãi", "mã"] },
      { href: "/quan-tri/thu-vien-anh", label: "Thư viện ảnh", icon: "media", keywords: ["ảnh", "hình"] },
      { href: "/quan-tri/danh-gia", label: "Đánh giá của khách", icon: "reviews", keywords: ["review"] },
      { href: "/quan-tri/hoi-dap", label: "Hỏi đáp", icon: "faqs", keywords: ["faq", "câu hỏi"] },
    ],
  },
  {
    title: "Cài đặt",
    roles: MANAGE,
    items: [
      { href: "/quan-tri/thong-tin", label: "Thông tin khách sạn", icon: "hotel", keywords: ["địa chỉ", "hotline"] },
      { href: "/quan-tri/giao-dien", label: "Giao diện", icon: "theme", keywords: ["font", "màu"] },
      { href: "/quan-tri/tai-khoan", label: "Tài khoản", icon: "users", roles: ["owner"], keywords: ["nhân viên", "mật khẩu"] },
      { href: "/quan-tri/nhat-ky", label: "Nhật ký thao tác", icon: "audit", keywords: ["lịch sử", "log"] },
    ],
  },
];

/** Các nhóm và mục mà vai trò này được thấy */
export const navFor = (role: Role) =>
  NAV.filter((g) => (g.roles ?? ALL).includes(role))
    .map((g) => ({ ...g, items: g.items.filter((it) => (it.roles ?? ALL).includes(role)) }))
    .filter((g) => g.items.length);
