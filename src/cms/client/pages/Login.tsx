"use client";

import { useEffect, useState, type FormEvent } from "react";
import { api, ApiError } from "@/cms/client/api";

// Đăng nhập CMS. Không có đăng ký: tài khoản do Chủ khách sạn tạo trong mục Tài khoản.
export function LoginPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const next = () => {
    const n = new URLSearchParams(location.search).get("next") ?? "";
    return n.startsWith("/quan-tri") ? n : "/quan-tri";
  };

  // Đã đăng nhập thì vào thẳng
  useEffect(() => {
    fetch("/api/cms/me").then((r) => r.ok && location.replace(next()));
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await api("login", { body: { email: f.get("email"), password: f.get("password") } });
      location.replace(next());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Có lỗi, vui lòng thử lại.");
      setBusy(false);
    }
  };

  return (
    <main className="c-login">
      <form className="c-login__card" onSubmit={onSubmit}>
        {/* eslint-disable-next-line @next/next/no-img-element -- logo */}
        <img src="/img/logo-ngang.png" alt="F21 Hotel" width={180} height={59} />
        <div>
          <h1>Quản lý F21 Hotel</h1>
          <p className="c-muted" style={{ margin: "6px 0 0", fontSize: 14 }}>
            Đăng nhập bằng tài khoản được cấp. Quên mật khẩu, liên hệ Chủ khách sạn để đặt lại.
          </p>
        </div>
        {error ? (
          <p className="c-alert c-alert--error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="c-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="c-input" autoComplete="username" required autoFocus />
        </div>
        <div className="c-field">
          <label htmlFor="password">Mật khẩu</label>
          <input id="password" name="password" type="password" className="c-input" autoComplete="current-password" required />
        </div>
        <button className="c-btn c-btn--primary" type="submit" disabled={busy} style={{ minHeight: 44 }}>
          {busy ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>
    </main>
  );
}
