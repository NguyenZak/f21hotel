"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Bảng danh sách dùng chung (TanStack Table v8): bấm tiêu đề cột để sắp xếp, ô lọc nhanh, bấm dòng để mở.
// Tải riêng (next/dynamic, ssr: false) từ các trang danh sách, vì bảng chỉ hiện sau khi dữ liệu về.
export type { ColumnDef };

// Bỏ dấu để lọc "nguyen" vẫn ra "Nguyễn"
const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();

export type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  /** Đường dẫn mở khi bấm một dòng */
  rowHref?: (row: T) => string;
  /** Thay cho rowHref: bấm dòng thì gọi hàm này (ví dụ hiện khung xem nhanh) */
  onRowClick?: (row: T) => void;
  /** Dòng đang chọn (tô đậm) */
  activeId?: string | number | null;
  getRowId?: (row: T) => string;
  /** Chữ lọc nhanh, so khớp không dấu trên giá trị các cột */
  filter?: string;
  initialSort?: SortingState;
  empty?: string;
};

export default function DataTable<T>({ data, columns, rowHref, onRowClick, activeId, getRowId, filter = "", initialSort = [], empty = "Chưa có mục nào." }: DataTableProps<T>) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>(initialSort);
  // React Compiler tự bỏ qua ghi nhớ component này vì useReactTable trả về hàm đổi theo trạng thái
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: filter },
    onSortingChange: setSorting,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _col, value: string) => {
      const q = plain(value.trim());
      if (!q) return true;
      return plain(row.getAllCells().map((c) => String(c.getValue() ?? "")).join(" ")).includes(q);
    },
  });
  const rows = table.getRowModel().rows;
  const open = (row: T) => (onRowClick ? onRowClick(row) : rowHref ? router.push(rowHref(row)) : undefined);

  return (
    <table className="c-table c-datatable">
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => {
              const sort = h.column.getIsSorted();
              const label = flexRender(h.column.columnDef.header, h.getContext());
              return (
                <th key={h.id} aria-sort={sort === "asc" ? "ascending" : sort === "desc" ? "descending" : undefined}>
                  {h.column.getCanSort() ? (
                    <button type="button" className="c-sort" onClick={h.column.getToggleSortingHandler()}>
                      {label}
                      <span className="c-sort__mark" aria-hidden="true">
                        {sort === "asc" ? "▲" : sort === "desc" ? "▼" : "↕"}
                      </span>
                    </button>
                  ) : (
                    label
                  )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows.length ? (
          rows.map((row) => (
            <tr
              key={row.id}
              className={`c-row-link${activeId != null && String(activeId) === row.id ? " is-active" : ""}`}
              onClick={(e) => {
                // Liên kết và nút trong ô (gọi điện, tên khách) tự xử lý
                if ((e.target as HTMLElement).closest("a, button")) return;
                open(row.original);
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="c-empty">
              {filter ? `Không có mục nào khớp “${filter}”.` : empty}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
