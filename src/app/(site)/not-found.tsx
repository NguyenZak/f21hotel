// 404 bên trong website (trang gọi notFound(), ví dụ phòng hoặc ưu đãi đã bị xoá): vẫn có header, footer.
// Đường dẫn không khớp trang nào thì dùng src/app/global-not-found.tsx.
import type { Metadata } from "next";
import Link from "next/link";
import { ErrorView } from "@/components/ErrorView";

export const metadata: Metadata = { title: "Không tìm thấy trang" };

export default function NotFound() {
  return (
    <ErrorView
      code="404"
      title="Không tìm thấy trang"
      actions={
        <>
          <Link className="btn btn-gold" href="/">
            Về trang chủ
          </Link>
          <Link className="btn btn-ghost" href="/phong">
            Xem phòng & giá
          </Link>
        </>
      }
    >
      <p>Trang này không còn hoặc đã đổi địa chỉ. Bạn xem các trang dưới đây, hoặc gọi lễ tân để được tư vấn phòng.</p>
    </ErrorView>
  );
}
