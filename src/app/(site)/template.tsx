import { ViewTransition } from "react";

// Template được tạo lại mỗi lần chuyển trang, nên trang cũ chạy hiệu ứng "page-out" và trang mới chạy "page-in".
// Các thay đổi khác trong trang (gửi form, đổi ảnh) không kích hoạt hiệu ứng này nhờ default="none".
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
