import { Suspense } from "react";
import { PageBuilder } from "@/cms/client/pages/PageBuilder";

// Trình dựng trang của CMS mới (?id=<mã trang>). Đặt trong nhóm (editor) để có CSS của Puck và của website.
export const instant = false;

export default function Page() {
  return (
    <Suspense>
      <PageBuilder />
    </Suspense>
  );
}
