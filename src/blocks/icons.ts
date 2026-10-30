import {
  IconBed,
  IconBriefcase,
  IconCar,
  IconClock,
  IconHeart,
  IconPin,
  IconRings,
  IconTicket,
  IconTree,
  IconUsers,
} from "@/components/Icons";

// Biểu tượng chọn được cho các khối có danh sách (nhãn hiện trong trình dựng)
export const ICONS = {
  tree: IconTree,
  car: IconCar,
  clock: IconClock,
  rings: IconRings,
  ticket: IconTicket,
  briefcase: IconBriefcase,
  heart: IconHeart,
  pin: IconPin,
  bed: IconBed,
  users: IconUsers,
} as const;
export type IconName = keyof typeof ICONS;

export const ICON_LABELS: Record<IconName, string> = {
  tree: "Cây xanh",
  car: "Ô tô",
  clock: "Đồng hồ",
  rings: "Nhẫn cưới",
  ticket: "Vé sự kiện",
  briefcase: "Cặp công tác",
  heart: "Trái tim",
  pin: "Ghim bản đồ",
  bed: "Giường",
  users: "Người",
};
