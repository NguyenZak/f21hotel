import { Suspense } from "react";
import { CalendarPage } from "@/cms/client/pages/Calendar";

// Trang tĩnh, dữ liệu tải trong trình duyệt (xem src/cms/client/pages)
export const instant = false;

export default function Page() {
  return (
    <Suspense>
      <CalendarPage />
    </Suspense>
  );
}
