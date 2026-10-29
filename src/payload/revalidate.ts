import { revalidateTag } from "next/cache";
import type { CollectionConfig, GlobalConfig } from "payload";

// Lưu trong CMS thì đánh dấu các trang dùng dữ liệu đó là hết hạn (nhãn trong src/lib/cms-tags.ts).
// { expire: 0 }: lần truy cập kế tiếp dựng lại trang ngay trong yêu cầu đó (vài trăm ms) rồi lưu đệm lại,
// không phục vụ bản cũ và không cần hàng đợi dựng lại ở nền. Hợp với website ít trang, ít lượt sửa.

function revalidate(tags: string[]) {
  for (const tag of tags) {
    try {
      revalidateTag(tag, { expire: 0 });
    } catch {
      // Ngoài Next.js (ví dụ script npm run seed) không có bộ nhớ đệm để làm mới
    }
  }
}

export function withRevalidate(collection: CollectionConfig, tags: string[]): CollectionConfig {
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      afterChange: [...(collection.hooks?.afterChange ?? []), ({ doc }) => (revalidate(tags), doc)],
      afterDelete: [...(collection.hooks?.afterDelete ?? []), () => revalidate(tags)],
    },
  };
}

export function withRevalidateGlobal(global: GlobalConfig, tags: string[]): GlobalConfig {
  return {
    ...global,
    hooks: { ...global.hooks, afterChange: [...(global.hooks?.afterChange ?? []), ({ doc }) => (revalidate(tags), doc)] },
  };
}
