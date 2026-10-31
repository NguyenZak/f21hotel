"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { BookingDTO } from "../../types";
import { api, ApiError } from "../api";
import { dayLabel, money, roomsText, sourceLabel, statusLabel, telHref } from "../booking";
import type { ColumnDef, DataTableProps } from "../DataTable";

const DataTable = dynamic(() => import("../DataTable"), { ssr: false, loading: () => <p className="c-empty">Đang tải…</p> }) as <T>(
  p: DataTableProps<T>,
) => ReactNode;

const editHref = (b: BookingDTO) => `/quan-tri/dat-phong/sua?id=${b.id}`;

// Cột bảng: giá trị (accessor) dùng để sắp xếp, ô (cell) để hiển thị
const COLUMNS: ColumnDef<BookingDTO, unknown>[] = [
  {
    id: "guest",
    header: "Khách",
    accessorFn: (b) => `${b.guestName} ${b.code} ${b.phone}`,
    cell: ({ row: { original: b } }) => (
      <>
        <Link href={editHref(b)}>
          <b>{b.guestName}</b>
        </Link>
        <div className="c-muted" style={{ fontSize: 13 }}>
          {b.code} · <a href={telHref(b.phone)}>{b.phone}</a>
        </div>
      </>
    ),
  },
  {
    id: "stay",
    header: "Ngày ở",
    accessorFn: (b) => b.checkIn,
    cell: ({ row: { original: b } }) => (
      <>
        {dayLabel(b.checkIn)} → {dayLabel(b.checkOut)}
        <div className="c-muted" style={{ fontSize: 13 }}>
          {b.nights ? `${b.nights} đêm` : "Trong ngày"}
        </div>
      </>
    ),
  },
  { id: "rooms", header: "Phòng", accessorFn: roomsText, enableSorting: false },
  {
    id: "status",
    header: "Trạng thái",
    accessorFn: (b) => statusLabel(b.status),
    cell: ({ row: { original: b } }) => <span className={`c-status c-status--${b.status}`}>{statusLabel(b.status)}</span>,
  },
  { id: "total", header: "Tổng tiền", accessorFn: (b) => b.total ?? 0, cell: ({ row: { original: b } }) => money(b.total), sortDescFirst: true },
  { id: "source", header: "Kênh", accessorFn: (b) => sourceLabel(b.source), cell: ({ getValue }) => <span className="c-muted">{String(getValue())}</span> },
];

// Danh sách đặt phòng: lọc nhanh, tìm theo mã / tên / số điện thoại
const FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "arrivals", label: "Đến hôm nay" },
  { key: "departures", label: "Trả phòng hôm nay" },
  { key: "inhouse", label: "Đang ở" },
  { key: "upcoming", label: "Sắp đến" },
];

export function BookingsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const filter = params.get("filter") ?? "all";
  const q = params.get("q") ?? "";
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<BookingDTO[] | null>(null);
  const [more, setMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    api<{ bookings: BookingDTO[]; more: boolean }>(`bookings?filter=${filter}&q=${encodeURIComponent(q)}&page=${page}`)
      .then((r) => {
        if (!alive) return;
        setRows((old) => (page > 1 && old ? [...old, ...r.bookings] : r.bookings));
        setMore(r.more);
      })
      .catch((e) => alive && setError(e instanceof ApiError ? e.message : "Không tải được danh sách."));
    return () => {
      alive = false;
    };
  }, [filter, q, page]);

  const go = (next: { filter?: string; q?: string }) => {
    const p = new URLSearchParams({ filter: next.filter ?? filter, ...(next.q ?? q ? { q: next.q ?? q } : {}) });
    setRows(null);
    setPage(1);
    router.replace(`/quan-tri/dat-phong?${p}`);
  };

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    go({ q: String(new FormData(e.currentTarget).get("q") ?? "").trim() });
  };

  return (
    <>
      <div className="c-page__head">
        <div>
          <h1>Đặt phòng</h1>
          <p>Đơn từ website, điện thoại, Zalo và các kênh OTA. Chờ xác nhận và Đã xác nhận đều giữ phòng.</p>
        </div>
        <Link className="c-btn c-btn--primary" href="/quan-tri/dat-phong/moi">
          + Đặt phòng mới
        </Link>
      </div>

      <div className="c-toolbar">
        <nav className="c-chips" aria-label="Lọc nhanh">
          {FILTERS.map((f) => (
            <button key={f.key} type="button" className={`c-chip${f.key === filter ? " is-active" : ""}`} onClick={() => go({ filter: f.key })}>
              {f.label}
            </button>
          ))}
        </nav>
        <form className="c-search" onSubmit={onSearch} role="search">
          <input name="q" className="c-input" defaultValue={q} placeholder="Mã, tên khách, số điện thoại" aria-label="Tìm đặt phòng" />
          <button className="c-btn" type="submit">
            Tìm
          </button>
        </form>
      </div>

      {error ? <p className="c-alert c-alert--error">{error}</p> : null}
      <div className="c-card c-table-wrap">
        {!rows ? (
          <p className="c-empty">Đang tải…</p>
        ) : !rows.length ? (
          <p className="c-empty">Không có đặt phòng nào{q ? ` khớp “${q}”` : ""}.</p>
        ) : (
          <DataTable data={rows} columns={COLUMNS} rowHref={editHref} getRowId={(b) => String(b.id)} />
        )}
      </div>
      {more ? (
        <div className="c-row" style={{ justifyContent: "center", marginTop: 16 }}>
          <button className="c-btn" type="button" onClick={() => setPage((p) => p + 1)}>
            Xem thêm
          </button>
        </div>
      ) : null}
    </>
  );
}
