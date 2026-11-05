import type { SiteData } from "@/lib/cms";
import type { Offer, Photo, Place, Review, Room } from "@/lib/site";

// Dữ liệu CMS đưa vào mọi khối qua `puck.metadata` (khi xem trang và khi đang chỉnh sửa)
export type BlockMeta = {
  site: SiteData;
  rooms: Room[];
  offers: Offer[];
  faqs: { q: string; a: string }[];
  reviews: Review[];
  places: Place[];
};

// Mục chọn ảnh trong mảng: Puck lưu mỗi phần tử là một object
export type PhotoItem = { photo?: Photo };

export const photosOf = (items: PhotoItem[] | undefined): Photo[] =>
  (items ?? []).map((i) => i.photo).filter((p): p is Photo => Boolean(p?.src));
