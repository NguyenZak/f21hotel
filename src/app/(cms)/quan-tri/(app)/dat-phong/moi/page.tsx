import { Suspense } from "react";
import { BookingNewPage } from "@/cms/client/pages/BookingEdit";

// Trang tĩnh, dữ liệu tải trong trình duyệt (xem src/cms/client/pages)
export const instant = false;

export default function Page() {
  return (
    <Suspense>
      <BookingNewPage />
    </Suspense>
  );
}
