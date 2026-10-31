"use client";

import Link from "next/link";
import { hasRole, useSession } from "@/cms/client/session";

// Trang đầu CMS. Giai đoạn 3 thay bằng bảng điều khiển "Hôm nay" (khách đến/đi, chờ xác nhận, phòng trống).
export function HomePage() {
  const { user } = useSession();
  const manage = hasRole(user, "owner", "manager");
  const tiles = [
    { href: "/admin/collections/bookings", title: "Đặt phòng", text: "Xác nhận, nhận phòng, trả phòng (CMS cũ)" },
    { href: "/admin/lich-phong", title: "Lịch phòng", text: "19 phòng theo ngày (CMS cũ)" },
    ...(manage ? [{ href: "/quan-tri/nhat-ky", title: "Nhật ký thao tác", text: "Ai đã thêm, sửa, xoá gì" }] : []),
    ...(hasRole(user, "owner") ? [{ href: "/quan-tri/tai-khoan", title: "Tài khoản", text: "Thêm nhân viên, đổi vai trò, khoá tài khoản" }] : []),
  ];
  return (
    <>
      <div className="c-page__head">
        <div>
          <h1>Xin chào, {user?.name}</h1>
          <p>CMS mới đang được làm lại từng phần. Mục có nhãn “CMS cũ” sẽ mở trang quản trị cũ.</p>
        </div>
      </div>
      <div className="c-grid">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="c-card c-tile" prefetch={t.href.startsWith("/quan-tri")}>
            <b>{t.title}</b>
            <span>{t.text}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
