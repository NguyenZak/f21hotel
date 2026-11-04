"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/cms/client/api";
import { formatTime, useToast } from "@/cms/client/ui";

// Xuất bản website (Chủ, Quản lý): website chỉ dựng lại khi bấm nút này (Workers Builds, src/cms/server/publish.ts).
// Bản build mới đã lên chưa: so thời điểm tải lên của bản đang chạy với lần bấm gần nhất.

type Status = {
  configured: boolean;
  live: { id: string; timestamp: string } | null;
  last: { at: string; by: string } | null;
  pending: { label: string; count: number; at: string }[];
};

export function PublishPage() {
  const [s, setS] = useState<Status | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, say] = useToast();

  const load = useCallback(
    () =>
      api<Status>("publish")
        .then((r) => {
          setS(r);
          setError("");
        })
        .catch((e) => setError(e instanceof ApiError ? e.message : "Không tải được trạng thái.")),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);

  // Đã bấm xuất bản mà bản đang chạy còn cũ hơn: đang dựng lại
  const building = Boolean(s?.last && s.live && Date.parse(s.live.timestamp) < Date.parse(s.last.at));
  // Hỏi lại mỗi 20 giây trong lúc dựng (tối đa 20 phút, giới hạn build của Cloudflare)
  useEffect(() => {
    if (!building || !s?.last || Date.now() - Date.parse(s.last.at) > 20 * 60_000) return;
    const t = setInterval(load, 20_000);
    return () => clearInterval(t);
  }, [building, s?.last, load]);

  const publish = async () => {
    setBusy(true);
    setError("");
    try {
      const r = await api<{ alreadyRunning: boolean }>("publish", { body: {} });
      say(r.alreadyRunning ? "Website đang được dựng lại từ lần bấm trước." : "Đã gửi yêu cầu. Website cập nhật sau khoảng 5–10 phút.");
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Không xuất bản được.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="c-page__head">
        <div>
          <h1>Xuất bản website</h1>
          <p>
            Sửa trong CMS (bài viết, ưu đãi, hạng phòng, trang, thông tin khách sạn…) chỉ lên website sau khi bấm Xuất bản. Đặt phòng,
            phòng trống và giá theo ngày luôn cập nhật ngay, không cần xuất bản.
          </p>
        </div>
      </div>
      {error ? (
        <p className="c-alert c-alert--error" role="alert" style={{ marginBottom: 16 }}>
          {error}
        </p>
      ) : null}
      {!s ? (
        <p className="c-empty">Đang tải…</p>
      ) : (
        <div className="c-form-grid">
          <section className="c-card c-form">
            <h2>Trạng thái</h2>
            {s.live ? <p className="c-kvline">Bản đang chạy dựng lúc <b>{formatTime(s.live.timestamp)}</b></p> : null}
            {s.last ? (
              <p className="c-kvline">
                Lần xuất bản gần nhất: <b>{formatTime(s.last.at)}</b>
                {s.last.by ? ` · ${s.last.by}` : ""}{" "}
                {building ? <span className="c-badge c-badge--warn">Đang dựng lại…</span> : s.live ? <span className="c-badge c-badge--ok">Đã lên website</span> : null}
              </p>
            ) : (
              <p className="c-kvline c-muted">Chưa xuất bản lần nào từ CMS.</p>
            )}
            {building ? (
              <p className="c-kvline c-muted">Thường mất 5–10 phút. Trang này tự cập nhật; website cũ vẫn chạy bình thường trong lúc chờ.</p>
            ) : null}
            {!s.configured ? (
              <p className="c-alert c-alert--info">Nút xuất bản chưa được cài (thiếu DEPLOY_HOOK_URL). Nhờ người quản trị website làm theo docs/xuat-ban.md.</p>
            ) : null}
            <div className="c-row">
              <button type="button" className="c-btn c-btn--primary" onClick={publish} disabled={!s.configured || busy || building}>
                {busy ? "Đang gửi…" : building ? "Đang dựng lại…" : "Xuất bản website"}
              </button>
            </div>
          </section>

          <section className="c-card c-form">
            <h2>Thay đổi chưa xuất bản</h2>
            {s.pending.length ? (
              <ul className="c-emails">
                {s.pending.map((p) => (
                  <li key={p.label}>
                    <span className="c-badge c-badge--warn">{p.count}</span>
                    <span>
                      <b>{p.label}</b> · sửa gần nhất {formatTime(p.at)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="c-kvline c-muted">Không có thay đổi mới kể từ lần xuất bản gần nhất.</p>
            )}
          </section>
        </div>
      )}
      {toast}
    </>
  );
}
