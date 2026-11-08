"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "../api";
import { formatTime } from "../ui";

// Danh sách trang dựng bằng trình kéo thả: "home" (trang chủ) và "gioi-thieu" (/gioi-thieu).
type PageRow = { id: number; title: string; slug: string; publishedAt: string; hasDraft: boolean; updatedAt: string };

export function PagesPage() {
  const [rows, setRows] = useState<PageRow[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api<{ pages: PageRow[] }>("pages")
      .then((r) => setRows(r.pages))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Không tải được."));
  }, []);
  return (
    <>
      <div className="c-page__head">
        <div>
          <h1>Trang</h1>
          <p>Kéo thả các khối (hero, phòng, ưu đãi, hỏi đáp…) để sắp xếp nội dung trang. Lưu nháp không đổi website; bấm Xuất bản thì website tự cập nhật sau khoảng 10 phút.</p>
        </div>
      </div>
      {error ? <p className="c-alert c-alert--error">{error}</p> : null}
      <div className="c-card c-table-wrap">
        {!rows ? (
          <p className="c-empty">Đang tải…</p>
        ) : (
          <table className="c-table">
            <thead>
              <tr>
                <th>Trang</th>
                <th>Trạng thái</th>
                <th>Xuất bản lần cuối</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <b>{p.title}</b>
                    <div className="c-muted" style={{ fontSize: 13 }}>
                      {p.slug === "home" ? "/" : `/${p.slug}`}
                    </div>
                  </td>
                  <td>{p.hasDraft ? <span className="c-badge c-badge--warn">Có bản nháp chưa xuất bản</span> : <span className="c-badge c-badge--ok">Đã xuất bản</span>}</td>
                  <td className="c-muted">{p.publishedAt ? formatTime(p.publishedAt) : "Chưa"}</td>
                  <td className="c-actions">
                    <a className="c-btn c-btn--small" href={p.slug === "home" ? "/" : `/${p.slug}`} target="_blank" rel="noopener">
                      Xem trang
                    </a>{" "}
                    {/* Trình dựng ở nhóm route khác (CSS của Puck), mở bằng tải trang đầy đủ */}
                    <a className="c-btn c-btn--small c-btn--primary" href={`/quan-tri/dung-trang?id=${p.id}`}>
                      Mở trình dựng
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
