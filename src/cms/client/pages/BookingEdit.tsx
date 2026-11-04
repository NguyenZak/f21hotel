"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BOOKING_SOURCES, BOOKING_STATUSES, EMAIL_KINDS, type BookingEmailLog, type EmailKind } from "@/lib/booking";
import { addDays, nightsBetween, todayInVietnam, toIsoDate } from "@/lib/dates";
import type { BookingDTO, BookingItem, Meta } from "../../types";
import { api, ApiError } from "../api";
import { loadMeta, money, NEXT_STEPS, STAY_LABELS, statusLabel, telHref, zaloHref, type Step } from "../booking";
import { PayBar, StatusSteps } from "../BookingBits";
import { hasRole, useSession } from "../session";
import { useToast } from "../ui";

// Form đặt phòng của CMS mới: tạo đơn (khách gọi điện, Zalo, đến trực tiếp, OTA) và sửa đơn.
// Thành tiền tự gợi ý theo giá phòng × số đêm, tổng tiền tự cộng, tiền cọc theo % trong cài đặt; sửa tay được.

type Draft = Omit<BookingDTO, "id" | "code" | "createdAt" | "nights"> & { id?: number; code?: string };
type ItemDraft = BookingItem & { manual?: boolean };

const plusDays = (iso: string, n: number) => toIsoDate(addDays(new Date(`${iso}T00:00:00`), n));
const roundK = (n: number) => Math.round(n / 1000) * 1000;

// Ô nhập tiền: hiện dấu chấm khi không gõ, lưu số nguyên
function Money({ value, onChange, id }: { value: number | null; onChange: (v: number | null) => void; id?: string }) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? (value === null ? "" : value.toLocaleString("vi-VN"));
  return (
    <div className="c-money">
      <input
        id={id}
        className="c-input"
        inputMode="numeric"
        value={shown}
        onFocus={() => setDraft(value === null ? "" : value.toLocaleString("vi-VN"))}
        onBlur={() => setDraft(null)}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          setDraft(digits ? Number(digits).toLocaleString("vi-VN") : "");
          onChange(digits ? Number(digits) : null);
        }}
      />
      <span aria-hidden="true">đ</span>
    </div>
  );
}

function suggest(meta: Meta, item: BookingItem, nights: number) {
  const t = meta.roomTypes.find((x) => x.id === item.roomType);
  if (!t) return null;
  const unit = item.stayType === "fullDay" ? t.prices.fullDay * Math.max(1, nights) : item.stayType === "overnight" ? t.prices.overnight : t.prices.hourly;
  return roundK(unit * item.quantity);
}

// Email đã gửi cho khách và nút gửi (lại) email xác nhận / nhắc lịch. Email nhắc tự gửi theo cron (worker.ts).
function GuestEmails({ id, email, dirty, canEmail, log, onLog }: {
  id: number;
  email: string;
  dirty: boolean;
  canEmail: boolean;
  log: BookingEmailLog[];
  onLog: (log: BookingEmailLog[]) => void;
}) {
  const [sending, setSending] = useState<EmailKind | null>(null);
  const [error, setError] = useState("");
  const [toast, say] = useToast();
  const send = async (kind: EmailKind) => {
    setSending(kind);
    setError("");
    try {
      const r = await api<{ emails: BookingEmailLog[] }>(`bookings/${id}/email`, { body: { kind } });
      onLog(r.emails);
      say(`Đã gửi “${EMAIL_KINDS[kind]}” tới ${email}.`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Không gửi được email.");
    } finally {
      setSending(null);
    }
  };
  const when = (iso: string) =>
    new Date(iso).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" });
  return (
    <section className="c-card c-form">
      <h2>Email cho khách</h2>
      {!canEmail ? (
        <p className="c-alert c-alert--info">Website chưa bật gửi email (thiếu khoá RESEND_API_KEY). Liên hệ người quản trị website.</p>
      ) : !email ? (
        <p className="c-kvline c-muted">Nhập email của khách rồi lưu để gửi xác nhận và nhắc lịch.</p>
      ) : (
        <p className="c-kvline c-muted">Khách nhận email nhắc lúc 8:00 sáng, một ngày trước ngày nhận phòng. Chuyển đơn sang “Đã xác nhận” thì khách tự nhận email xác nhận (trừ đơn OTA).</p>
      )}
      {error ? <p className="c-alert c-alert--error" role="alert">{error}</p> : null}
      {log.length ? (
        <ul className="c-emails">
          {log.map((e, i) => (
            <li key={i}>
              <span className={`c-badge ${e.status === "sent" ? "c-badge--ok" : "c-badge--warn"}`} title={e.error || undefined}>
                {e.status === "sent" ? "Đã gửi" : "Lỗi"}
              </span>
              <span>
                <b>{EMAIL_KINDS[e.kind] ?? e.kind}</b> · {when(e.createdAt)} · {e.recipient}
                {e.userName ? ` · ${e.userName}` : ""}
                {e.error ? <small className="c-emails__err">{e.error}</small> : null}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="c-kvline c-muted">Chưa gửi email nào.</p>
      )}
      {canEmail && email ? (
        <div className="c-row">
          {(["confirmed", "reminder"] as const).map((kind) => (
            <button key={kind} type="button" className="c-btn c-btn--small" disabled={dirty || sending !== null} onClick={() => send(kind)}>
              {sending === kind ? "Đang gửi…" : `Gửi “${EMAIL_KINDS[kind]}”`}
            </button>
          ))}
          {dirty ? <span className="c-hint">Lưu thay đổi trước khi gửi</span> : null}
        </div>
      ) : null}
      {toast}
    </section>
  );
}

type EmailState = { log: BookingEmailLog[]; canEmail: boolean };

function Editor({ initial, meta, emails }: { initial: Draft; meta: Meta; emails?: EmailState }) {
  const router = useRouter();
  const { user } = useSession();
  const [b, setB] = useState<Draft>(initial);
  const [items, setItems] = useState<ItemDraft[]>(initial.items.map((i) => ({ ...i, manual: i.amount !== null })));
  const [manualTotal, setManualTotal] = useState(Boolean(initial.id));
  const [manualDeposit, setManualDeposit] = useState(Boolean(initial.id));
  const [busyRooms, setBusyRooms] = useState<{ room: number; code: string }[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, say] = useToast();
  const [emailLog, setEmailLog] = useState(emails?.log ?? []);

  const nights = nightsBetween(b.checkIn, b.checkOut) ?? 0;
  // Dòng chưa sửa tay: thành tiền luôn theo giá phòng × số đêm hiện tại
  const effective = items.map((i) => (i.manual ? i : { ...i, amount: suggest(meta, i, nights) }));
  const autoTotal = effective.reduce((s, i) => s + (i.amount ?? 0), 0);
  const total = manualTotal ? b.total : autoTotal;
  const deposit = manualDeposit ? b.deposit : roundK((total * meta.depositPercent) / 100);
  const missing = items.reduce((n, i) => n + Math.max(0, i.quantity - i.rooms.length), 0);

  const set = (patch: Partial<Draft>) => {
    setB((x) => ({ ...x, ...patch }));
    setDirty(true);
  };

  const setItem = (idx: number, patch: Partial<ItemDraft>) => {
    setItems((list) =>
      list.map((it, i) => {
        if (i !== idx) return it;
        const next = { ...it, ...patch };
        // Đổi hạng phòng thì bỏ các phòng đã gán (thuộc hạng cũ)
        if (patch.roomType !== undefined && patch.roomType !== it.roomType) next.rooms = [];
        return next;
      }),
    );
    setDirty(true);
  };

  // Phòng đang có khách khác giữ trong khoảng ngày này
  useEffect(() => {
    if (!b.checkIn || !b.checkOut) return;
    let alive = true;
    api<{ busy: { room: number; code: string }[] }>(`busy-rooms?checkIn=${b.checkIn}&checkOut=${b.checkOut}&exclude=${b.id ?? 0}`)
      .then((r) => alive && setBusyRooms(r.busy))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [b.checkIn, b.checkOut, b.id]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const payload = (status = b.status) => ({
    ...b,
    status,
    total,
    deposit,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- bỏ trường chỉ dùng trên giao diện
    items: effective.map(({ manual, roomTypeName, ...i }) => i),
  });

  const save = async (status?: string) => {
    setSaving(true);
    setError("");
    try {
      if (b.id) {
        const r = await api<{ emailed: string }>(`bookings/${b.id}`, { method: "PATCH", body: payload(status) });
        if (status) set({ status });
        setDirty(false);
        say(`${status ? `Đã chuyển sang “${statusLabel(status)}”.` : "Đã lưu."}${r.emailed ? ` Đang gửi email xác nhận tới ${r.emailed}.` : ""}`);
        // Email gửi sau khi lưu xong: tải lại lịch sử sau vài giây
        if (r.emailed) {
          const id = b.id;
          setTimeout(() => {
            api<{ emails: BookingEmailLog[] }>(`bookings/${id}`).then((x) => setEmailLog(x.emails)).catch(() => {});
          }, 4000);
        }
      } else {
        const r = await api<{ id: number; code: string }>("bookings", { body: payload(status) });
        setDirty(false);
        router.replace(`/quan-tri/dat-phong/sua?id=${r.id}&created=1`);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Không lưu được, vui lòng thử lại.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  const runStep = (s: Step) => {
    if (s.confirm && !window.confirm(s.confirm)) return;
    save(s.to);
  };

  const remove = async () => {
    if (!b.id || !window.confirm(`Xoá hẳn đặt phòng ${b.code}? Không khôi phục được. Nếu khách huỷ, nên chọn “Huỷ đơn” thay vì xoá.`)) return;
    try {
      await api(`bookings/${b.id}`, { method: "DELETE", body: {} });
      router.replace("/quan-tri/dat-phong");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Không xoá được.");
    }
  };

  const steps = b.id ? (NEXT_STEPS[b.status] ?? []) : [];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <div className="c-page__head">
        <div>
          <Link href="/quan-tri/dat-phong" className="c-muted" style={{ fontSize: 14 }}>
            ← Đặt phòng
          </Link>
          <h1>{b.id ? b.code : "Đặt phòng mới"}</h1>
        </div>
      </div>

      {b.id ? (
        <div className="c-actionbar">
          <span className="c-actionbar__steps">
            <StatusSteps status={b.status} />
          </span>
          {steps.map((s) => {
            const lock = s.to === "checked_in" && missing > 0;
            return (
              <button
                key={s.to}
                type="button"
                className={`c-btn${s.primary ? " c-btn--primary" : ""}`}
                disabled={saving || lock}
                title={lock ? `Gán thêm ${missing} phòng trước khi nhận phòng` : undefined}
                onClick={() => runStep(s)}
              >
                {s.label}
              </button>
            );
          })}
          {steps.some((s) => s.to === "checked_in") && missing > 0 ? <span className="c-hint">Còn {missing} phòng chưa gán số</span> : null}
          {b.phone ? (
            <>
              <a className="c-btn" href={telHref(b.phone)}>
                Gọi
              </a>
              <a className="c-btn" href={zaloHref(b.phone)} target="_blank" rel="noopener">
                Zalo
              </a>
            </>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p className="c-alert c-alert--error" role="alert" style={{ marginBottom: 16 }}>
          {error}
        </p>
      ) : null}

      <div className="c-form-grid">
        <section className="c-card c-form">
          <h2>Khách</h2>
          <div className="c-cols">
            <div className="c-field">
              <label htmlFor="name">Họ tên</label>
              <input id="name" className="c-input" value={b.guestName} onChange={(e) => set({ guestName: e.target.value })} required />
            </div>
            <div className="c-field">
              <label htmlFor="phone">Điện thoại / Zalo</label>
              <input id="phone" className="c-input" type="tel" inputMode="tel" value={b.phone} onChange={(e) => set({ phone: e.target.value })} required />
            </div>
            <div className="c-field">
              <label htmlFor="guests">Số khách</label>
              <input id="guests" className="c-input" type="number" min={1} value={b.guests} onChange={(e) => set({ guests: Number(e.target.value) })} />
            </div>
            <div className="c-field">
              <label htmlFor="arrival">Giờ đến dự kiến</label>
              <input id="arrival" className="c-input" value={b.arrivalTime} onChange={(e) => set({ arrivalTime: e.target.value })} placeholder="VD: 15:00" />
            </div>
            <div className="c-field">
              <label htmlFor="email">Email</label>
              <input id="email" className="c-input" type="email" value={b.email} onChange={(e) => set({ email: e.target.value })} />
            </div>
          </div>
          <div className="c-field">
            <label htmlFor="note">Yêu cầu của khách</label>
            <textarea id="note" className="c-textarea" value={b.note} onChange={(e) => set({ note: e.target.value })} />
          </div>
        </section>

        <section className="c-card c-form">
          <h2>Thời gian & kênh</h2>
          <div className="c-cols">
            <div className="c-field">
              <label htmlFor="in">Nhận phòng</label>
              <input
                id="in"
                className="c-input"
                type="date"
                value={b.checkIn}
                onChange={(e) => set({ checkIn: e.target.value, ...(e.target.value >= b.checkOut ? { checkOut: plusDays(e.target.value, 1) } : {}) })}
                required
              />
            </div>
            <div className="c-field">
              <label htmlFor="out">Trả phòng</label>
              <input id="out" className="c-input" type="date" value={b.checkOut} min={b.checkIn} onChange={(e) => set({ checkOut: e.target.value })} required />
              <small>{nights ? `${nights} đêm` : "Trong ngày (nghỉ giờ)"}</small>
            </div>
            <div className="c-field">
              <label htmlFor="source">Kênh</label>
              <select id="source" className="c-select" value={b.source} onChange={(e) => set({ source: e.target.value })}>
                {BOOKING_SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="c-field">
              <label htmlFor="ref">Mã đặt phòng bên OTA</label>
              <input id="ref" className="c-input" value={b.externalRef} onChange={(e) => set({ externalRef: e.target.value })} />
            </div>
            {!b.id ? (
              <div className="c-field">
                <label htmlFor="status">Trạng thái</label>
                <select id="status" className="c-select" value={b.status} onChange={(e) => set({ status: e.target.value })}>
                  {BOOKING_STATUSES.filter((s) => ["pending", "confirmed", "checked_in"].includes(s.value)).map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="c-field">
              <label htmlFor="promo">Mã ưu đãi</label>
              <input id="promo" className="c-input" value={b.promoCode} onChange={(e) => set({ promoCode: e.target.value.toUpperCase() })} />
            </div>
          </div>
        </section>

        <section className="c-card c-form c-form-grid__wide">
          <h2>Phòng</h2>
          {effective.map((it, idx) => {
            const typeRooms = meta.rooms.filter((r) => r.roomType === it.roomType && r.active);
            return (
              <div key={idx} className="c-item">
                <div className="c-cols c-cols--item">
                  <div className="c-field">
                    <label htmlFor={`t${idx}`}>Hạng phòng</label>
                    <select id={`t${idx}`} className="c-select" value={it.roomType} onChange={(e) => setItem(idx, { roomType: Number(e.target.value) })}>
                      {meta.roomTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} (tối đa {t.guests} người)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="c-field">
                    <label htmlFor={`s${idx}`}>Hình thức</label>
                    <select id={`s${idx}`} className="c-select" value={it.stayType} onChange={(e) => setItem(idx, { stayType: e.target.value })}>
                      {Object.entries(STAY_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="c-field">
                    <label htmlFor={`q${idx}`}>Số phòng</label>
                    <input
                      id={`q${idx}`}
                      className="c-input"
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) => setItem(idx, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                    />
                  </div>
                  <div className="c-field">
                    <label htmlFor={`a${idx}`}>Thành tiền</label>
                    <Money id={`a${idx}`} value={it.amount} onChange={(v) => setItem(idx, { amount: v, manual: v !== null })} />
                    {it.manual ? (
                      <button type="button" className="c-link" onClick={() => setItem(idx, { manual: false })}>
                        Tính theo giá phòng
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="c-field">
                  <label>
                    Gán số phòng ({it.rooms.length}/{it.quantity})
                  </label>
                  <div className="c-roompick">
                    {typeRooms.map((r) => {
                      const on = it.rooms.includes(r.id);
                      const taken = busyRooms.find((x) => x.room === r.id);
                      const full = !on && it.rooms.length >= it.quantity;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          className={`c-room${on ? " is-on" : ""}${taken ? " is-busy" : ""}`}
                          disabled={Boolean(taken) || full}
                          title={taken ? `Đã gán cho ${taken.code}` : full ? "Đã đủ số phòng" : `Tầng ${r.floor}`}
                          aria-pressed={on}
                          onClick={() => setItem(idx, { rooms: on ? it.rooms.filter((x) => x !== r.id) : [...it.rooms, r.id] })}
                        >
                          {r.number}
                          {taken ? <small>{taken.code.slice(-4)}</small> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {items.length > 1 ? (
                  <button
                    type="button"
                    className="c-link c-link--danger"
                    onClick={() => {
                      setItems((l) => l.filter((_, i) => i !== idx));
                      setDirty(true);
                    }}
                  >
                    Bỏ dòng này
                  </button>
                ) : null}
              </div>
            );
          })}
          <div>
            <button
              type="button"
              className="c-btn"
              onClick={() => {
                const first = meta.roomTypes[0];
                setItems((l) => [...l, { roomType: first?.id ?? 0, stayType: "fullDay", quantity: 1, amount: null, rooms: [] }]);
                setDirty(true);
              }}
            >
              + Thêm hạng phòng khác
            </button>
          </div>
        </section>

        <section className="c-card c-form">
          <h2>Tiền</h2>
          <div className="c-cols">
            <div className="c-field">
              <label htmlFor="total">Tổng tiền</label>
              <Money
                id="total"
                value={total}
                onChange={(v) => {
                  setManualTotal(true);
                  set({ total: v ?? 0 });
                }}
              />
              {manualTotal && total !== autoTotal ? (
                <button type="button" className="c-link" onClick={() => setManualTotal(false)}>
                  Cộng theo các dòng phòng ({money(autoTotal)})
                </button>
              ) : null}
            </div>
            <div className="c-field">
              <label htmlFor="deposit">Tiền cọc cần thu</label>
              <Money
                id="deposit"
                value={deposit}
                onChange={(v) => {
                  setManualDeposit(true);
                  set({ deposit: v ?? 0 });
                }}
              />
              {!manualDeposit ? <small>{meta.depositPercent}% tổng tiền</small> : null}
            </div>
            <div className="c-field">
              <label htmlFor="paid">Đã thu</label>
              <Money id="paid" value={b.paid} onChange={(v) => set({ paid: v ?? 0 })} />
            </div>
          </div>
          <p className="c-kvline">
            Còn phải thu: <b>{money(Math.max(0, total - b.paid))}</b>
          </p>
          <PayBar b={{ total, paid: b.paid, deposit }} showTotal={false} />
        </section>

        <section className="c-card c-form">
          <h2>Ghi chú nội bộ</h2>
          {b.dataConsentAt ? (
            // Chỉ thêm khách vào danh sách Zalo nhận ưu đãi khi khách đã đồng ý (Luật 91/2025 Điều 28)
            <p className="c-kvline">
              Nhận ưu đãi qua Zalo/SMS: <b>{b.marketingConsent ? "Khách đồng ý" : "Khách không đồng ý, không gửi khuyến mại"}</b>
            </p>
          ) : null}
          <div className="c-field">
            <label htmlFor="staffNote" className="sr-only">
              Ghi chú nội bộ
            </label>
            <textarea id="staffNote" className="c-textarea" value={b.staffNote} onChange={(e) => set({ staffNote: e.target.value })} placeholder="Khách không thấy ghi chú này." />
          </div>
        </section>

        {b.id && emails ? (
          <GuestEmails id={b.id} email={b.email.trim()} dirty={dirty} canEmail={emails.canEmail} log={emailLog} onLog={setEmailLog} />
        ) : null}
      </div>

      <div className="c-savebar">
        {b.id && hasRole(user, "owner", "manager") ? (
          <button type="button" className="c-btn c-btn--ghost c-btn--danger" onClick={remove}>
            Xoá đặt phòng
          </button>
        ) : (
          <span />
        )}
        <span className="c-row">
          {dirty ? <span className="c-hint">Chưa lưu</span> : null}
          <button className="c-btn c-btn--primary" type="submit" disabled={saving}>
            {saving ? "Đang lưu…" : b.id ? "Lưu thay đổi" : "Tạo đặt phòng"}
          </button>
        </span>
      </div>
      {toast}
    </form>
  );
}

const empty = (meta: Meta, params: URLSearchParams): Draft => {
  const checkIn = params.get("checkIn") ?? todayInVietnam();
  const checkOut = params.get("checkOut") ?? plusDays(checkIn, 1);
  const roomType = Number(params.get("roomType")) || meta.roomTypes[0]?.id || 0;
  const room = Number(params.get("room")) || 0;
  return {
    status: "confirmed",
    source: "phone",
    checkIn,
    checkOut,
    guestName: "",
    phone: "",
    email: "",
    guests: 2,
    arrivalTime: "",
    promoCode: "",
    note: "",
    total: 0,
    deposit: 0,
    paid: 0,
    staffNote: "",
    externalRef: "",
    dataConsentAt: "",
    marketingConsent: false,
    items: [{ roomType, stayType: "fullDay", quantity: 1, amount: null, rooms: room ? [room] : [] }],
  };
};

export function BookingNewPage() {
  const params = useSearchParams();
  const [meta, setMeta] = useState<Meta | null>(null);
  useEffect(() => {
    loadMeta().then(setMeta).catch(() => {});
  }, []);
  const initial = useMemo(() => (meta ? empty(meta, new URLSearchParams(params.toString())) : null), [meta, params]);
  return initial && meta ? <Editor initial={initial} meta={meta} /> : <p className="c-empty">Đang tải…</p>;
}

export function BookingEditPage() {
  const params = useSearchParams();
  const id = Number(params.get("id"));
  const [state, setState] = useState<{ booking: BookingDTO; meta: Meta; emails: EmailState } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!id) return;
    Promise.all([api<{ booking: BookingDTO; emails: BookingEmailLog[]; canEmail: boolean }>(`bookings/${id}`), loadMeta()])
      .then(([r, meta]) => setState({ booking: r.booking, meta, emails: { log: r.emails, canEmail: r.canEmail } }))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Không tải được đặt phòng."));
  }, [id]);
  if (!id || error) return <p className="c-alert c-alert--error">{error || "Thiếu mã đặt phòng."}</p>;
  if (!state) return <p className="c-empty">Đang tải…</p>;
  return (
    <>
      {params.get("created") ? <p className="c-alert c-alert--ok" style={{ marginBottom: 12 }}>Đã tạo đặt phòng {state.booking.code}.</p> : null}
      <Editor key={state.booking.id} initial={state.booking} meta={state.meta} emails={state.emails} />
    </>
  );
}
