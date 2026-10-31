"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import type { BookingDTO } from "../../types";
import { api, ApiError } from "../api";
import { dayLabel, money, roomsText, sourceLabel, statusLabel, telHref } from "../booking";

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
          <table className="c-table">
            <thead>
              <tr>
                <th>Khách</th>
                <th>Ngày ở</th>
                <th>Phòng</th>
                <th>Trạng thái</th>
                <th>Tổng tiền</th>
                <th>Kênh</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="c-row-link" onClick={() => router.push(`/quan-tri/dat-phong/sua?id=${b.id}`)}>
                  <td>
                    <Link href={`/quan-tri/dat-phong/sua?id=${b.id}`} onClick={(e) => e.stopPropagation()}>
                      <b>{b.guestName}</b>
                    </Link>
                    <div className="c-muted" style={{ fontSize: 13 }}>
                      {b.code} ·{" "}
                      <a href={telHref(b.phone)} onClick={(e) => e.stopPropagation()}>
                        {b.phone}
                      </a>
                    </div>
                  </td>
                  <td>
                    {dayLabel(b.checkIn)} → {dayLabel(b.checkOut)}
                    <div className="c-muted" style={{ fontSize: 13 }}>
                      {b.nights ? `${b.nights} đêm` : "Trong ngày"}
                    </div>
                  </td>
                  <td>{roomsText(b)}</td>
                  <td>
                    <span className={`c-status c-status--${b.status}`}>{statusLabel(b.status)}</span>
                  </td>
                  <td>{money(b.total)}</td>
                  <td className="c-muted">{sourceLabel(b.source)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
