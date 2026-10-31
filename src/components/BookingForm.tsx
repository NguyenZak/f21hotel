"use client";

import { useActionState, useEffect, useState } from "react";
import { submitRequest } from "@/lib/booking-client";
import { groupTypes, initialBookingState, type BookingField, type BookingKind } from "@/lib/booking";
import { formatViDate, nightsBetween, toIsoDate } from "@/lib/dates";
import { formatVnd, stayModes, type Contact } from "@/lib/site";
import { track } from "@/lib/track";
import { DateRangePicker } from "./DateRangePicker";
import { IconCheck, IconPhone, IconZalo } from "./Icons";

// Hạng phòng rút gọn cho ô chọn phòng; contact lấy từ CMS ở trang cha
export type RoomOption = { slug: string; name: string; guests: number; overnight: number };
type Props = { kind?: BookingKind; rooms: RoomOption[]; contact: Contact & { replyHours: string } };

export function BookingForm({ kind = "booking", rooms, contact }: Props) {
  const { telLink, zaloLink, phoneDisplay, replyHours } = contact;
  const [state, formAction, pending] = useActionState(submitRequest, initialBookingState);
  const [today, setToday] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [room, setRoom] = useState("");
  const [guests, setGuests] = useState("2");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Điền sẵn từ đường dẫn: /dat-phong?in=...&out=...&room=...&guests=...&code=...
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    /* eslint-disable react-hooks/set-state-in-effect -- đọc URL và ngày hiện tại một lần sau khi hydrate */
    setToday(toIsoDate(new Date()));
    if (q.get("in")) setCheckIn(q.get("in")!);
    if (q.get("out")) setCheckOut(q.get("out")!);
    if (q.get("room") && rooms.some((r) => r.slug === q.get("room"))) setRoom(q.get("room")!);
    if (q.get("guests")) setGuests(q.get("guests")!);
    if (q.get("code")) setCode(q.get("code")!.toUpperCase());
    /* eslint-enable react-hooks/set-state-in-effect */
    // rooms đến từ máy chủ và không đổi sau khi tải trang, nên effect chỉ chạy một lần
  }, [rooms]);

  useEffect(() => {
    if (state.status === "ok") {
      track("submit_booking", { kind, delivered: state.delivered });
      document.getElementById("form-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state, kind]);

  async function sendViaZalo() {
    track("click_zalo", { from: "booking_success" });
    try {
      await navigator.clipboard.writeText(state.summary ?? "");
      setCopied(true);
    } catch {
      // Trình duyệt chặn clipboard: khách vẫn có thể bôi đen nội dung để chép
    }
    window.open(zaloLink, "_blank", "noopener");
  }

  const nights = nightsBetween(checkIn, checkOut);
  const err = (f: BookingField) => state.errors?.[f];
  const val = (f: BookingField) => state.values?.[f] ?? "";
  const fieldClass = (f: BookingField, extra = "") => `field${extra}${err(f) ? " invalid" : ""}`;
  const isGroup = kind === "group";

  return (
    <div className={`form-card${state.status === "ok" ? " sent" : ""}`} id="form-top" style={{ scrollMarginTop: 90 }}>
      <div className="form-body">
        <h2>{isGroup ? "Xin báo giá đoàn" : "Gửi yêu cầu đặt phòng"}</h2>
        <p>
          {isGroup
            ? "Cho F21 biết số phòng và ngày ở, lễ tân sẽ gửi báo giá trong ngày."
            : "Lễ tân sẽ gọi lại hoặc nhắn Zalo để xác nhận phòng và hướng dẫn đặt cọc. Nghỉ giờ vui lòng gọi hotline."}
        </p>

        <form action={formAction} noValidate>
          <input type="hidden" name="kind" value={kind} />
          {/* Ô chống spam, ẩn với người dùng */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

          <div className="fields">
            <div className={fieldClass("name")}>
              <label htmlFor="name">Họ tên</label>
              <input id="name" name="name" autoComplete="name" required defaultValue={val("name")} />
              <span className="err">{err("name")}</span>
            </div>
            <div className={fieldClass("phone")}>
              <label htmlFor="phone">Số điện thoại / Zalo</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                placeholder="0912 345 678"
                defaultValue={val("phone")}
              />
              <span className="err">{err("phone")}</span>
            </div>

            {isGroup ? (
              <>
                <div className="field">
                  <label htmlFor="company">
                    Công ty / gia đình <span className="opt">(không bắt buộc)</span>
                  </label>
                  <input id="company" name="company" autoComplete="organization" defaultValue={val("company")} />
                </div>
                <div className="field">
                  <label htmlFor="groupType">Loại đoàn</label>
                  <select id="groupType" name="groupType" defaultValue={val("groupType") || groupTypes[0]}>
                    {groupTypes.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : null}

            <DateRangePicker
              className="full"
              checkIn={checkIn}
              checkOut={checkOut}
              min={today || undefined}
              names={["checkIn", "checkOut"]}
              errors={{ checkIn: err("checkIn"), checkOut: err("checkOut") }}
              clearable
              onChange={(a, b) => {
                setCheckIn(a);
                setCheckOut(b);
              }}
            />

            {isGroup ? (
              <>
                <div className="field">
                  <label htmlFor="roomCount">Số phòng cần</label>
                  <input
                    id="roomCount"
                    name="roomCount"
                    type="number"
                    min={2}
                    max={50}
                    inputMode="numeric"
                    defaultValue={val("roomCount") || "3"}
                  />
                </div>
                <div className="field">
                  <label htmlFor="invoice">Hoá đơn VAT</label>
                  <select id="invoice" name="invoice" defaultValue={val("invoice") || "no"}>
                    <option value="no">Không cần</option>
                    <option value="yes">Cần xuất hoá đơn</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="field">
                  <label htmlFor="room">Loại phòng</label>
                  <select id="room" name="room" value={room} onChange={(e) => setRoom(e.target.value)}>
                    <option value="">Chưa chọn, nhờ lễ tân tư vấn</option>
                    {rooms.map((r) => (
                      <option key={r.slug} value={r.slug}>
                        {r.name} – {r.guests} người – qua đêm {formatVnd(r.overnight)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="stayType">Hình thức nghỉ</label>
                  <select id="stayType" name="stayType" defaultValue={val("stayType") || "fullDay"}>
                    {stayModes
                      .filter((m) => m.key !== "hourly")
                      .map((m) => (
                        <option key={m.key} value={m.key}>
                          {m.label} ({m.key === "fullDay" ? "14:00 – 12:00" : "19:00 – 10:00"})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="guests">Số khách</label>
                  <select id="guests" name="guests" value={guests} onChange={(e) => setGuests(e.target.value)}>
                    {["1", "2", "3", "4", "5–8", "Trên 8"].map((g) => (
                      <option key={g} value={g}>
                        {g} khách
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {!isGroup ? (
              <div className="field">
                <label htmlFor="code">
                  Mã ưu đãi <span className="opt">(nếu có)</span>
                </label>
                <input
                  id="code"
                  name="code"
                  autoCapitalize="characters"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
              </div>
            ) : null}

            <div className="field full">
              <label htmlFor="note">
                Ghi chú <span className="opt">(không bắt buộc)</span>
              </label>
              <textarea
                id="note"
                name="note"
                defaultValue={val("note")}
                placeholder={
                  isGroup
                    ? "Ví dụ: 6 phòng cho họ hàng dự cưới ngày 14/12, có 2 người cao tuổi, cần tầng thấp."
                    : "Ví dụ: đến muộn sau 22:00, cần chỗ đỗ ô tô, đi cùng trẻ nhỏ."
                }
              />
            </div>
          </div>

          <div className="form-foot">
            <p className="nights" aria-live="polite">
              {nights ? `${nights} đêm · ${formatViDate(checkIn)} – ${formatViDate(checkOut)}` : ""}
            </p>
            {state.status === "error" && state.message ? (
              <p role="alert" style={{ color: "#b3261e", textAlign: "center" }}>
                {state.message}
              </p>
            ) : null}
            <button className={`btn btn-block${pending ? " is-pending" : ""}`} type="submit" disabled={pending} aria-busy={pending}>
              {pending ? "Đang gửi…" : isGroup ? "Gửi yêu cầu báo giá" : "Gửi yêu cầu đặt phòng"}
            </button>
            <p className="fine">
              Hoặc gọi ngay <a href={telLink}>{phoneDisplay}</a> · Thông tin chỉ dùng để liên hệ đặt phòng.
            </p>
          </div>
        </form>
      </div>

      <div className="form-success" role="status">
        <span className="ok">
          <IconCheck />
        </span>
        <h2>Cảm ơn bạn!</h2>
        {state.delivered ? (
          <p>F21 đã nhận yêu cầu. Lễ tân sẽ liên hệ lại trong khoảng 15 phút ({replyHours}).</p>
        ) : (
          <p>Bấm “Gửi qua Zalo” để chuyển yêu cầu này cho lễ tân. Nội dung đã được soạn sẵn bên dưới.</p>
        )}
        {state.summary ? <pre>{state.summary}</pre> : null}
        <div className="actions">
          <button type="button" className="btn btn-gold" onClick={sendViaZalo}>
            <IconZalo /> {copied ? "Đã chép, dán vào Zalo" : "Gửi qua Zalo"}
          </button>
          <a className="btn btn-ghost" href={telLink}>
            <IconPhone /> Gọi lễ tân
          </a>
        </div>
      </div>
    </div>
  );
}
