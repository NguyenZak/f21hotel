"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { todayInVietnam } from "@/lib/dates";
import type { BookingDTO, Meta } from "../../types";
import { api, ApiError } from "../api";
import { dayLabel, loadMeta, roomsText, sourceLabel, statusLabel, telHref } from "../booking";
import { PayBar, RoomBadges, StatusBadge, StayHint } from "../BookingBits";
import type { ColumnDef, DataTableProps } from "../DataTable";

const DataTable = dynamic(() => import("../DataTable"), { ssr: false, loading: () => <p className="c-empty">Đang tải…</p> }) as <T>(
  p: DataTableProps<T>,
) => ReactNode;

const SplitView = dynamic(() => import("../SplitView"), { ssr: false });
const BookingPreview = dynamic(() => import("../BookingPreview"), { ssr: false });

// Màn hình rộng: danh sách và khung xem nhanh nằm cạnh nhau
const WIDE = "(min-width: 1180px)";
const onWideChange = (cb: () => void) => {
  const m = matchMedia(WIDE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const useWide = () => useSyncExternalStore(onWideChange, () => matchMedia(WIDE).matches, () => false);

const editHref = (b: BookingDTO) => `/quan-tri/dat-phong/sua?id=${b.id}`;

// Cột bảng: giá trị (accessor) dùng để sắp xếp, ô (cell) để hiển thị. Cần danh sách phòng để hiện số phòng
// compact: khung xem nhanh đang mở bên phải, cột Phòng chỉ còn số phòng
const columnsFor = (meta: Meta | null, today: string, compact = false): ColumnDef<BookingDTO, unknown>[] => [
  {
    id: "guest",
    header: "Khách",
    accessorFn: (b) => `${b.guestName} ${b.code} ${b.phone}`,
    cell: ({ row: { original: b } }) => (
      <>
        <Link href={editHref(b)}>
          <b>{b.guestName}</b>
        </Link>
        <div className="c-muted" style={{ fontSize: 13, whiteSpace: "nowrap" }}>
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
        <span className="c-stay">
          {dayLabel(b.checkIn)} → {dayLabel(b.checkOut)}
        </span>
        <div className="c-row c-row--tight">
          <span className="c-muted" style={{ fontSize: 13 }}>
            {b.nights ? `${b.nights} đêm` : "Trong ngày"}
          </span>
          <StayHint b={b} today={today} />
        </div>
      </>
    ),
  },
  {
    id: "rooms",
    header: "Phòng",
    accessorFn: roomsText,
    enableSorting: false,
    cell: ({ row: { original: b } }) => (
      <>
        <RoomBadges b={b} meta={meta} />
        {compact ? null : (
          <div className="c-muted" style={{ fontSize: 13 }}>
            {roomsText(b)}
          </div>
        )}
      </>
    ),
  },
  {
    id: "status",
    header: "Trạng thái",
    accessorFn: (b) => statusLabel(b.status),
    cell: ({ row: { original: b } }) => <StatusBadge status={b.status} />,
  },
  { id: "total", header: "Tiền", accessorFn: (b) => b.total ?? 0, cell: ({ row: { original: b } }) => <PayBar b={b} />, sortDescFirst: true },
  { id: "source", header: "Kênh", accessorFn: (b) => sourceLabel(b.source), cell: ({ getValue }) => <span className="c-muted">{String(getValue())}</span> },
];

// Danh sách đặt phòng: lọc nhanh, tìm theo mã / tên / số điện thoại. "tone" tô màu nút khi có đơn cần xử lý
const FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận", tone: "warn" },
  { key: "arrivals", label: "Đến hôm nay", tone: "info" },
  { key: "departures", label: "Trả phòng hôm nay", tone: "info" },
  { key: "inhouse", label: "Đang ở" },
  { key: "upcoming", label: "Sắp đến" },
];
type Counts = Record<string, number>;

export function BookingsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const filter = params.get("filter") ?? "all";
  const q = params.get("q") ?? "";
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<BookingDTO[] | null>(null);
  const [more, setMore] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [counts, setCounts] = useState<Counts | null>(null);
  const wide = useWide();
  const today = todayInVietnam();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = rows?.find((b) => b.id === selectedId) ?? null;

  useEffect(() => {
    loadMeta().then(setMeta, () => undefined);
  }, []);

  useEffect(() => {
    let alive = true;
    api<{ bookings: BookingDTO[]; more: boolean; counts: Counts | null }>(`bookings?filter=${filter}&q=${encodeURIComponent(q)}&page=${page}`)
      .then((r) => {
        if (!alive) return;
        setRows((old) => (page > 1 && old ? [...old, ...r.bookings] : r.bookings));
        setMore(r.more);
        if (r.counts) setCounts(r.counts);
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

  const columns = columnsFor(meta, today);
  // Khi chia đôi màn hình, bảng chỉ giữ các cột chính; hạng phòng và kênh xem ở khung bên phải
  const compact = columnsFor(meta, today, true).filter((c) => c.id !== "source");
  const stripe = (b: BookingDTO) => `c-stripe c-stripe--${b.status}`;

  const list = (
    <div className="c-card c-table-wrap">
      {!rows ? (
        <p className="c-empty">Đang tải…</p>
      ) : !rows.length ? (
        <p className="c-empty">Không có đặt phòng nào{q ? ` khớp “${q}”` : ""}.</p>
      ) : wide ? (
        <DataTable data={rows} columns={compact} onRowClick={(b) => setSelectedId(b.id)} activeId={selectedId} getRowId={(b) => String(b.id)} rowClassName={stripe} />
      ) : (
        <DataTable data={rows} columns={columns} rowHref={editHref} getRowId={(b) => String(b.id)} rowClassName={stripe} />
      )}
    </div>
  );

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
          {FILTERS.map((f) => {
            const n = counts?.[f.key];
            const tone = f.tone && n ? ` c-chip--${f.tone}` : "";
            return (
              <button key={f.key} type="button" className={`c-chip${tone}${f.key === filter ? " is-active" : ""}`} onClick={() => go({ filter: f.key })}>
                {f.label}
                {n != null ? <span className="c-chip__n">{n}</span> : null}
              </button>
            );
          })}
        </nav>
        <form className="c-search" onSubmit={onSearch} role="search">
          <input name="q" className="c-input" defaultValue={q} placeholder="Mã, tên khách, số điện thoại" aria-label="Tìm đặt phòng" />
          <button className="c-btn" type="submit">
            Tìm
          </button>
        </form>
      </div>

      {error ? <p className="c-alert c-alert--error">{error}</p> : null}
      {wide ? <SplitView id="cms-bookings" left={list} right={<BookingPreview booking={selected} />} rightLabel="xem nhanh" /> : list}
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
