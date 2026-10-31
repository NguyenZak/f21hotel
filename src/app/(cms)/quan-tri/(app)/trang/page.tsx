import { PagesPage } from "@/cms/client/pages/Pages";

// Trang tĩnh, dữ liệu tải trong trình duyệt (xem src/cms/client/pages)
export const instant = false;

export default function Page() {
  return <PagesPage />;
}
