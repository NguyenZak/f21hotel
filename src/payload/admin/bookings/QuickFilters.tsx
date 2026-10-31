"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { todayInVietnam } from "@/lib/dates";

// Bộ lọc nhanh phía trên danh sách đặt phòng (dùng tham số where của Payload trên URL)
export function QuickFilters() {
  const params = useSearchParams();
  const day = todayInVietnam();
  const filters = [
    { label: "Tất cả", query: "" },
    { label: "Chờ xác nhận", query: "where[status][equals]=pending" },
    { label: "Đến hôm nay", query: `where[checkIn][equals]=${day}` },
    { label: "Trả phòng hôm nay", query: `where[checkOut][equals]=${day}` },
    { label: "Đang ở", query: "where[status][equals]=checked_in" },
    { label: "Sắp đến", query: `where[and][0][checkIn][greater_than]=${day}&where[and][1][status][in]=pending,confirmed` },
  ];
  // So khớp theo các tham số where hiện có trên URL
  const current = [...params.entries()]
    .filter(([k]) => k.startsWith("where"))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  return (
    <nav className="f21-filters" aria-label="Lọc nhanh">
      {filters.map((f) => (
        <Link
          key={f.label}
          href={`/admin/collections/bookings${f.query ? `?${f.query}` : ""}`}
          className={current === decodeURIComponent(f.query) ? "is-active" : undefined}
        >
          {f.label}
        </Link>
      ))}
      <Link href="/admin/lich-phong" className="f21-filters__calendar">
        Lịch phòng →
      </Link>
    </nav>
  );
}
