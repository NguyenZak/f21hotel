import { Suspense } from "react";
import { BookingsPage } from "@/cms/client/pages/Bookings";

// Trang tĩnh, dữ liệu tải trong trình duyệt (xem src/cms/client/pages)
export const instant = false;

export default function Page() {
  return (
    <Suspense>
      <BookingsPage />
    </Suspense>
  );
}
