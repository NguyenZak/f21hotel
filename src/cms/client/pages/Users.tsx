"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError, ROLE_LABELS, type CmsUser, type Role } from "@/cms/client/api";
import { hasRole, useSession } from "@/cms/client/session";
import { Dialog, randomPassword, useToast } from "@/cms/client/ui";

// Tài khoản CMS (chỉ Chủ): thêm nhân viên, đổi vai trò, khoá/mở khoá, đặt lại mật khẩu
type Row = CmsUser & { locked: boolean };
type Draft = { id?: number; name: string; email: string; role: Role; active: boolean; password: string; unlock?: boolean };

const ROLE_HELP: Record<Role, string> = {
  owner: "Toàn quyền, kể cả tài khoản",
  manager: "Nội dung website, giá, ưu đãi, xem nhật ký",
  staff: "Đặt phòng và lịch phòng",
};

export function UsersPage() {
  const { user } = useSession();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, say] = useToast();

  const load = useCallback(() => {
    api<{ users: Row[] }>("users")
      .then((r) => setRows(r.users))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Không tải được danh sách."));
  }, []);
  useEffect(load, [load]);

  if (user && !hasRole(user, "owner")) return <p className="c-alert c-alert--info">Chỉ Chủ khách sạn quản lý tài khoản.</p>;

  const save = async () => {
    if (!draft) return;
    setBusy(true);
    setError("");
    try {
      if (draft.id) {
        await api(`users/${draft.id}`, {
          method: "PATCH",
          body: { name: draft.name, role: draft.role, active: draft.active, unlock: draft.unlock, ...(draft.password ? { password: draft.password } : {}) },
        });
        say(draft.password ? "Đã lưu và đặt mật khẩu mới." : "Đã lưu.");
      } else {
        await api("users", { body: { name: draft.name, email: draft.email, role: draft.role, password: draft.password } });
        say("Đã tạo tài khoản. Gửi email và mật khẩu cho người dùng.");
      }
      setDraft(null);
      load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Có lỗi, vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  };

  const set = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d));
  const isSelf = draft?.id === user?.id;

  return (
    <>
      <div className="c-page__head">
        <div>
          <h1>Tài khoản</h1>
          <p>Mỗi người một tài khoản riêng để nhật ký ghi đúng ai đã làm gì. Nhân viên nghỉ việc thì khoá, không cần xoá.</p>
        </div>
        <button
          className="c-btn c-btn--primary"
          type="button"
          onClick={() => (setError(""), setDraft({ name: "", email: "", role: "staff", active: true, password: randomPassword() }))}
        >
          + Thêm tài khoản
        </button>
      </div>
      {error && !draft ? <p className="c-alert c-alert--error">{error}</p> : null}
      <div className="c-card c-table-wrap">
        {!rows ? (
          <p className="c-empty">Đang tải…</p>
        ) : (
          <table className="c-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <b>{r.name}</b>
                    {r.id === user?.id ? <span className="c-muted"> (bạn)</span> : null}
                  </td>
                  <td>{r.email}</td>
                  <td>
                    <span className={`c-badge c-badge--${r.role}`}>{ROLE_LABELS[r.role]}</span>
                  </td>
                  <td>
                    {!r.active ? (
                      <span className="c-badge c-badge--off">Đã khoá</span>
                    ) : r.locked ? (
                      <span className="c-badge c-badge--warn">Tạm khoá (sai mật khẩu)</span>
                    ) : (
                      <span className="c-badge c-badge--ok">Đang hoạt động</span>
                    )}
                  </td>
                  <td className="c-actions">
                    <button
                      className="c-btn c-btn--small"
                      type="button"
                      onClick={() => (setError(""), setDraft({ id: r.id, name: r.name, email: r.email, role: r.role, active: r.active, password: "", unlock: r.locked }))}
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog
        open={Boolean(draft)}
        title={draft?.id ? "Sửa tài khoản" : "Thêm tài khoản"}
        onClose={() => setDraft(null)}
        onSubmit={save}
        submitLabel={draft?.id ? "Lưu" : "Tạo tài khoản"}
        busy={busy}
        error={error}
      >
        {draft ? (
          <>
            <div className="c-field">
              <label htmlFor="u-name">Họ tên</label>
              <input id="u-name" className="c-input" value={draft.name} onChange={(e) => set({ name: e.target.value })} required />
            </div>
            <div className="c-field">
              <label htmlFor="u-email">Email đăng nhập</label>
              <input
                id="u-email"
                type="email"
                className="c-input"
                value={draft.email}
                onChange={(e) => set({ email: e.target.value })}
                required
                disabled={Boolean(draft.id)}
              />
            </div>
            <div className="c-field">
              <label htmlFor="u-role">Vai trò</label>
              <select id="u-role" className="c-select" value={draft.role} onChange={(e) => set({ role: e.target.value as Role })} disabled={isSelf}>
                {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]} – {ROLE_HELP[r]}
                  </option>
                ))}
              </select>
            </div>
            <div className="c-field">
              <label htmlFor="u-pass">{draft.id ? "Đặt mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}</label>
              <div className="c-row" style={{ flexWrap: "nowrap" }}>
                <input
                  id="u-pass"
                  className="c-input"
                  value={draft.password}
                  onChange={(e) => set({ password: e.target.value })}
                  minLength={draft.id && !draft.password ? 0 : 12}
                  required={!draft.id}
                  autoComplete="new-password"
                />
                <button className="c-btn" type="button" onClick={() => set({ password: randomPassword() })}>
                  Tạo ngẫu nhiên
                </button>
              </div>
              <small>Ít nhất 12 ký tự. Gửi riêng cho người dùng; họ có thể tự đổi ở mục Hồ sơ.</small>
            </div>
            {draft.id && !isSelf ? (
              <label className="c-check">
                <input type="checkbox" checked={draft.active} onChange={(e) => set({ active: e.target.checked })} /> Đang hoạt động (bỏ chọn để khoá)
              </label>
            ) : null}
            {draft.id && draft.unlock ? <p className="c-alert c-alert--info">Tài khoản đang tạm khoá do nhập sai mật khẩu. Lưu để mở khoá.</p> : null}
          </>
        ) : null}
      </Dialog>
      {toast}
    </>
  );
}
