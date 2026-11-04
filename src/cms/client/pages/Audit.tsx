"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/cms/client/api";
import { formatTime } from "@/cms/client/ui";

// Nhật ký thao tác (Chủ, Quản lý): ai thêm, sửa, xoá gì, lúc nào
type Log = { id: number; action: string; target: string; doc_id: string | null; title: string | null; created_at: string; user_name: string | null };

const ACTIONS: Record<string, string> = { create: "Thêm", update: "Sửa", delete: "Xoá" };
const TARGETS: Record<string, string> = {
  users: "Tài khoản",
  bookings: "Đặt phòng",
  "room-types": "Hạng phòng",
  rooms: "Phòng",
  "rate-rules": "Giá theo ngày",
  offers: "Ưu đãi",
  reviews: "Đánh giá",
  faqs: "Hỏi đáp",
  pages: "Trang",
  media: "Ảnh",
  "site-settings": "Thông tin khách sạn",
  "theme-settings": "Giao diện",
  posts: "Bài viết",
  publish: "Bản xuất bản website",
};

export function AuditPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tải 50 dòng, before = id nhỏ nhất đã có để xem tiếp các dòng cũ hơn
  const fetchLogs = (before?: number) =>
    api<{ logs: Log[] }>(`audit-logs?limit=50${before ? `&before=${before}` : ""}`)
      .then((r) => {
        setLogs((l) => (before ? [...l, ...r.logs] : r.logs));
        setDone(r.logs.length < 50);
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : "Không tải được nhật ký."))
      .finally(() => setLoading(false));
  const load = (before: number) => {
    setLoading(true);
    fetchLogs(before);
  };
   
  useEffect(() => void fetchLogs(), []);

  return (
    <>
      <div className="c-page__head">
        <div>
          <h1>Nhật ký thao tác</h1>
          <p>Mọi lần thêm, sửa, xoá trong CMS (cả CMS cũ và mới).</p>
        </div>
      </div>
      {error ? <p className="c-alert c-alert--error">{error}</p> : null}
      <div className="c-card c-table-wrap">
        <table className="c-table">
          <thead>
            <tr>
              <th>Lúc</th>
              <th>Người làm</th>
              <th>Việc</th>
              <th>Nội dung</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td className="c-muted">{formatTime(l.created_at)}</td>
                <td>
                  <b>{l.user_name ?? "Không rõ"}</b>
                </td>
                <td>
                  {ACTIONS[l.action] ?? l.action} {(TARGETS[l.target] ?? l.target).toLowerCase()}
                </td>
                <td>{l.title ?? (l.doc_id ? `#${l.doc_id}` : "")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && !logs.length ? <p className="c-empty">Chưa có thao tác nào.</p> : null}
        {loading ? <p className="c-empty">Đang tải…</p> : null}
      </div>
      {!done && logs.length ? (
        <div className="c-row" style={{ justifyContent: "center", marginTop: 16 }}>
          <button className="c-btn" type="button" disabled={loading} onClick={() => load(logs[logs.length - 1].id)}>
            Xem cũ hơn
          </button>
        </div>
      ) : null}
    </>
  );
}
