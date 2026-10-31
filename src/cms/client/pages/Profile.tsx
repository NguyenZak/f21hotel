"use client";

import { useState, type FormEvent } from "react";
import { api, ApiError, ROLE_LABELS } from "@/cms/client/api";
import { useSession } from "@/cms/client/session";

// Hồ sơ của người đang đăng nhập: đổi tên hiển thị, đổi mật khẩu
export function ProfilePage() {
  const { user, reload } = useSession();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  if (!user) return null;

  const save = async (e: FormEvent<HTMLFormElement>, kind: "name" | "password") => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    if (kind === "password" && f.get("password") !== f.get("confirm")) return setMsg({ ok: false, text: "Hai lần nhập mật khẩu mới không khớp." });
    setBusy(true);
    try {
      await api("me", {
        method: "PATCH",
        body: kind === "name" ? { name: f.get("name") } : { currentPassword: f.get("current"), password: f.get("password") },
      });
      setMsg({ ok: true, text: kind === "name" ? "Đã lưu tên hiển thị." : "Đã đổi mật khẩu." });
      if (kind === "password") form.reset();
      reload();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof ApiError ? err.message : "Có lỗi, vui lòng thử lại." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="c-page__head">
        <div>
          <h1>Hồ sơ của bạn</h1>
          <p>
            {user.email} · {ROLE_LABELS[user.role]}
          </p>
        </div>
      </div>
      {msg ? <p className={`c-alert ${msg.ok ? "c-alert--ok" : "c-alert--error"}`} role="status">{msg.text}</p> : null}
      <div className="c-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", marginTop: 16 }}>
        <form className="c-card c-form" onSubmit={(e) => save(e, "name")}>
          <h2>Tên hiển thị</h2>
          <div className="c-field">
            <label htmlFor="name">Họ tên</label>
            <input id="name" name="name" className="c-input" defaultValue={user.name} required />
          </div>
          <div className="c-row c-row--end">
            <button className="c-btn c-btn--primary" disabled={busy}>
              Lưu
            </button>
          </div>
        </form>
        <form className="c-card c-form" onSubmit={(e) => save(e, "password")}>
          <h2>Đổi mật khẩu</h2>
          <div className="c-field">
            <label htmlFor="current">Mật khẩu hiện tại</label>
            <input id="current" name="current" type="password" className="c-input" autoComplete="current-password" required />
          </div>
          <div className="c-field">
            <label htmlFor="password">Mật khẩu mới</label>
            <input id="password" name="password" type="password" className="c-input" autoComplete="new-password" minLength={12} required />
            <small>Ít nhất 12 ký tự. Nên dùng vài từ ghép lại, dễ nhớ mà khó đoán.</small>
          </div>
          <div className="c-field">
            <label htmlFor="confirm">Nhập lại mật khẩu mới</label>
            <input id="confirm" name="confirm" type="password" className="c-input" autoComplete="new-password" required />
          </div>
          <div className="c-row c-row--end">
            <button className="c-btn c-btn--primary" disabled={busy}>
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
