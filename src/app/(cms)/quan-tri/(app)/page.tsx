import { HomePage } from "@/cms/client/pages/Home";

// Trang tĩnh, dữ liệu tải trong trình duyệt (xem src/cms/client/pages). Không kiểm tra instant navigation
// của Cache Components vì nội dung chỉ có sau khi biết người đăng nhập.
export const instant = false;

export default function Page() {
  return <HomePage />;
}
