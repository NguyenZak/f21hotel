import type { DefaultCellComponentProps } from "payload";
import { statusLabel } from "@/lib/booking";

// Trạng thái đặt phòng trong bảng danh sách: nhãn có màu (cùng màu với bảng điều khiển)
export function StatusCell({ cellData }: DefaultCellComponentProps) {
  const s = String(cellData ?? "");
  return <span className={`f21-status f21-status--${s}`}>{statusLabel(s)}</span>;
}
