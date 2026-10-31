import { ReportsPage } from "@/cms/client/pages/Reports";

// Trang tĩnh, dữ liệu tải trong trình duyệt (xem src/cms/client/pages)
export const instant = false;
export const metadata = { title: "Báo cáo" };

export default function Page() {
  return <ReportsPage />;
}
