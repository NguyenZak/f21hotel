"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { checkPromo, createBooking, searchRooms } from "@/lib/booking-client";
import { bestDiscount, discounted, type CartLine, type GuestField, type OnlineStay, type SearchResult } from "@/lib/booking";
import { addDays, nightsBetween, shortDate, toIsoDate } from "@/lib/dates";
import { formatVnd, type Photo } from "@/lib/site";
import { track } from "@/lib/track";
import { DateRangePicker } from "./DateRangePicker";
import { IconCheck, IconPhone, IconUsers } from "./Icons";

// Đặt phòng trực tuyến kiểu các trang đặt phòng: chọn ngày → chọn phòng → thông tin người đặt.
// Phòng trống và giá lấy từ API /api/booking/search (src/lib/booking-api.ts) mỗi khi đổi ngày; đặt xong chuyển sang trang xác nhận.

export type EngineRoom = {
  slug: string;
  name: string;
  short: string;
  guests: number;
  amenities: string[];
  photo: Photo | null;
  area?: number;
  bed?: string;
};

type Props = {
  rooms: EngineRoom[];
  contact: { telLink: string; phoneDisplay: string; zaloLink: string };
  policy: { deposit: string; refund: string };
  maxRooms: number;
  // Điểm đánh giá chép từ Google Maps (CMS › Thông tin khách sạn); null thì ẩn
  rating?: { score: number; count: number; source: string; url: string } | null;
};

type PromoState = { code: string; percent: number; title: string } | null;

const STAYS: { key: OnlineStay; label: string; time: string }[] = [
  { key: "fullDay", label: "Ngày đêm", time: "Nhận phòng 14:00, trả trước 12:00 hôm sau" },
  { key: "overnight", label: "Qua đêm", time: "Nhận phòng sau 19:00, trả trước 10:00 hôm sau" },
];

const ARRIVALS = ["Chưa rõ", "Trước 14:00", "14:00 – 17:00", "17:00 – 20:00", "20:00 – 23:00", "Sau 23:00"];

type Cart = Record<string, number>; // "slug:stay" -> số phòng
const lineKey = (slug: string, stay: OnlineStay) => `${slug}:${stay}`;

export function BookingEngine({ rooms, contact, policy, maxRooms, rating }: Props) {
  const router = useRouter();
  const top = useRef<HTMLDivElement>(null);
  const [today, setToday] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [focusRoom, setFocusRoom] = useState("");
  const [promo, setPromo] = useState("");
  const [promoOk, setPromoOk] = useState<PromoState>(null);
  const [promoMsg, setPromoMsg] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [cart, setCart] = useState<Cart>({});
  const [step, setStep] = useState<"rooms" | "guest">("rooms");
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<Partial<Record<GuestField, string>>>({});
  const [searching, startSearch] = useTransition();
  const [submitting, startSubmit] = useTransition();

  function search(inDate: string, outDate: string) {
    if (!inDate || !outDate || outDate <= inDate) return;
    const q = new URLSearchParams(window.location.search);
    q.set("in", inDate);
    q.set("out", outDate);
    window.history.replaceState(null, "", `?${q}`);
    startSearch(async () => {
      const r = await searchRooms(inDate, outDate);
      setResult(r);
      // Bỏ khỏi giỏ những phòng không còn bán với ngày mới
      if (r.ok)
        setCart((c) =>
          Object.fromEntries(
            Object.entries(c).filter(([k, qty]) => {
              const [slug, stay] = k.split(":") as [string, OnlineStay];
              const a = r.rooms[slug];
              return qty > 0 && a?.plans[stay] && a.available > 0;
            }).map(([k, qty]) => [k, Math.min(qty, r.rooms[k.split(":")[0]].available)]),
          ),
        );
    });
  }

  // Điền sẵn từ đường dẫn: /dat-phong?in=...&out=...&guests=...&room=...&code=...
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const now = toIsoDate(new Date());
    let inDate = q.get("in") ?? "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inDate) || inDate < now) inDate = now;
    let outDate = q.get("out") ?? "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(outDate) || outDate <= inDate) outDate = toIsoDate(addDays(new Date(`${inDate}T00:00`), 1));
    /* eslint-disable react-hooks/set-state-in-effect -- đọc URL và ngày hiện tại một lần sau khi hydrate */
    setToday(now);
    setCheckIn(inDate);
    setCheckOut(outDate);
    const g = Number(q.get("guests"));
    if (g >= 1 && g <= 20) setGuests(g);
    if (q.get("room")) setFocusRoom(q.get("room")!);
    if (q.get("code")) setPromo(q.get("code")!.toUpperCase());
    /* eslint-enable react-hooks/set-state-in-effect */
    search(inDate, outDate);
  }, []);

  // Phòng được chọn từ trang Phòng: cuộn tới thẻ phòng đó sau khi có kết quả
  useEffect(() => {
    if (focusRoom && result?.ok) document.getElementById(`be-${focusRoom}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusRoom, result]);

  function onDates(inDate: string, outDate: string) {
    setCheckIn(inDate);
    setCheckOut(outDate);
    search(inDate, outDate);
  }

  const avail = result?.ok ? result : null;
  const nights = avail?.nights ?? nightsBetween(checkIn, checkOut) ?? 0;

  const lines = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([k, qty]) => {
      const [slug, stay] = k.split(":") as [string, OnlineStay];
      const room = rooms.find((r) => r.slug === slug);
      const plan = avail?.rooms[slug]?.plans[stay];
      return { slug, stay, qty, room, amount: (plan?.total ?? 0) * qty };
    })
    .filter((l) => l.room);
  const roomCount = lines.reduce((s, l) => s + l.qty, 0);
  const capacity = lines.reduce((s, l) => s + l.qty * l.room!.guests, 0);
  // Giá niêm yết; giảm giá lấy mức lớn nhất (đặt trực tiếp, ở dài ngày, mã ưu đãi), máy chủ tính lại y hệt khi đặt
  const listTotal = lines.reduce((s, l) => s + l.amount, 0);
  const discount = avail && listTotal ? bestDiscount(avail.discounts, nights, promoOk) : null;
  const total = discount ? discounted(listTotal, discount.percent) : listTotal;
  const deposit = avail ? Math.round((total * avail.depositPercent) / 100 / 1000) * 1000 : 0;
  const direct = avail?.discounts.direct ?? 0;
  const freeCancelDays = avail?.freeCancelDays ?? 0;
  const cancelBy = freeCancelDays && checkIn ? shortDate(toIsoDate(addDays(new Date(`${checkIn}T00:00`), -freeCancelDays))) : "";
  const tooFew = roomCount > 0 && capacity < guests;

  function setQty(slug: string, stay: OnlineStay, qty: number) {
    setNotice("");
    setCart((c) => ({ ...c, [lineKey(slug, stay)]: qty }));
  }

  // Kiểm tra mã ưu đãi để tổng tiền hiện ngay phần giảm (máy chủ vẫn kiểm tra lại khi đặt)
  async function verifyPromo(code: string) {
    setPromoOk(null);
    setPromoMsg("");
    if (!code.trim()) return;
    const r = await checkPromo(code);
    if (r.ok) {
      setPromoOk({ code: r.code, percent: r.percent, title: r.title });
      setPromoMsg(r.percent ? `Mã ${r.code}: giảm ${r.percent}% (${r.title}).` : `Mã ${r.code} hợp lệ (${r.title}). Lễ tân áp dụng ưu đãi khi xác nhận.`);
    } else setPromoMsg(r.error);
  }

  function goTo(next: "rooms" | "guest") {
    if (next === "guest" && promo && !promoOk) verifyPromo(promo);
    setStep(next);
    setNotice("");
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const guest = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
    const cartLines: CartLine[] = lines.map((l) => ({ room: l.slug, stay: l.stay, qty: l.qty }));
    startSubmit(async () => {
      const res = await createBooking({ checkIn, checkOut, lines: cartLines, guest });
      if (res.ok) {
        track("submit_booking", { kind: "online", value: total, currency: "VND" });
        router.push(`/dat-phong/xac-nhan/${res.code}`);
        return;
      }
      setErrors(res.errors ?? {});
      setNotice(res.error);
      if (res.refresh) {
        search(checkIn, checkOut);
        goTo("rooms");
        setNotice(res.error);
      }
    });
  }

  const err = (f: GuestField) => errors[f];
  const fieldClass = (f: GuestField, extra = "") => `field${extra}${err(f) ? " invalid" : ""}`;

  return (
    <div className="be" ref={top} style={{ scrollMarginTop: 96 }}>
      <ol className="be-steps" aria-label="Các bước đặt phòng">
        <li className={step === "rooms" ? "on" : "done"}>
          <span>1</span> Chọn phòng
        </li>
        <li className={step === "guest" ? "on" : ""}>
          <span>2</span> Thông tin người đặt
        </li>
        <li>
          <span>3</span> Xác nhận
        </li>
      </ol>

      {step === "rooms" ? (
        <form
          className="be-search"
          onSubmit={(e) => {
            e.preventDefault();
            search(checkIn, checkOut);
          }}
          aria-label="Chọn ngày ở"
        >
          <DateRangePicker className="be-when" checkIn={checkIn} checkOut={checkOut} min={today || undefined} onChange={onDates} />
          <div className="field">
            <label htmlFor="be-guests">Số khách</label>
            <select id="be-guests" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} người
                </option>
              ))}
            </select>
          </div>
          <button className={`btn${searching ? " is-pending" : ""}`} type="submit" disabled={searching}>
            {searching ? "Đang tìm…" : "Tìm phòng"}
          </button>
        </form>
      ) : null}

      <div className="be-layout">
        <div className="be-main">
          {notice ? (
            <p className="be-notice" role="alert">
              {notice}
            </p>
          ) : null}

          {step === "rooms" ? (
            <>
              {result && !result.ok ? (
                <p className="be-notice" role="alert">
                  {result.error}
                </p>
              ) : null}
              <p className="be-found" aria-live="polite">
                {avail
                  ? `${shortDate(avail.checkIn)} – ${shortDate(avail.checkOut)} · ${avail.nights} đêm · ${guests} khách`
                  : searching
                    ? "Đang kiểm tra phòng trống…"
                    : ""}
              </p>
              <div className={`be-rooms${searching ? " loading" : ""}`} aria-busy={searching}>
                {rooms.map((room) => (
                  <RoomRow
                    key={room.slug}
                    room={room}
                    avail={avail?.rooms[room.slug]}
                    nights={nights}
                    startDate={avail?.checkIn ?? checkIn}
                    cart={cart}
                    roomsLeftInCart={maxRooms - roomCount}
                    direct={direct}
                    focused={focusRoom === room.slug}
                    onQty={setQty}
                    telLink={contact.telLink}
                  />
                ))}
              </div>
              <div className="be-more">
                <p>
                  <b>Nghỉ giờ</b> không cần đặt trước: gọi <a href={contact.telLink}>{contact.phoneDisplay}</a> để lễ tân giữ phòng.
                </p>
                <p>
                  <b>Cần trên {maxRooms} phòng</b> hoặc ở dài ngày? <Link href="/doan-doanh-nghiep">Xin báo giá đoàn</Link>, giảm tới
                  15% tổng thanh toán.
                </p>
              </div>
            </>
          ) : (
            <form className="form-card be-guest" onSubmit={onSubmit} noValidate>
              <h2>Thông tin người đặt</h2>
              <p className="be-sub">Lễ tân sẽ gọi hoặc nhắn Zalo vào số này để xác nhận phòng và hướng dẫn đặt cọc.</p>
              {/* Ô chống spam, ẩn với người dùng */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
              <div className="fields">
                <div className={fieldClass("name")}>
                  <label htmlFor="g-name">Họ tên</label>
                  <input id="g-name" name="name" autoComplete="name" required />
                  <span className="err">{err("name")}</span>
                </div>
                <div className={fieldClass("phone")}>
                  <label htmlFor="g-phone">Số điện thoại / Zalo</label>
                  <input id="g-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0912 345 678" required />
                  <span className="err">{err("phone")}</span>
                </div>
                <div className={fieldClass("email")}>
                  <label htmlFor="g-email">
                    Email <span className="opt">(không bắt buộc)</span>
                  </label>
                  <input id="g-email" name="email" type="email" autoComplete="email" />
                  <span className="err">{err("email")}</span>
                </div>
                <div className={fieldClass("guests")}>
                  <label htmlFor="g-guests">Số khách</label>
                  <select id="g-guests" name="guests" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} người
                      </option>
                    ))}
                  </select>
                  <span className="err">{err("guests")}</span>
                </div>
                <div className="field">
                  <label htmlFor="g-arrival">Giờ đến dự kiến</label>
                  <select id="g-arrival" name="arrivalTime" defaultValue={ARRIVALS[0]}>
                    {ARRIVALS.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div className={fieldClass("code")}>
                  <label htmlFor="g-code">
                    Mã ưu đãi <span className="opt">(nếu có)</span>
                  </label>
                  <input
                    id="g-code"
                    name="code"
                    autoCapitalize="characters"
                    value={promo}
                    onChange={(e) => {
                      setPromo(e.target.value.toUpperCase());
                      setPromoOk(null);
                      setPromoMsg("");
                    }}
                    onBlur={(e) => verifyPromo(e.target.value)}
                  />
                  <span className="err">{err("code")}</span>
                  {promoMsg && !err("code") ? (
                    <span className={promoOk ? "be-promo ok" : "be-promo"} aria-live="polite">
                      {promoMsg}
                    </span>
                  ) : null}
                </div>
                <div className="field full">
                  <label htmlFor="g-note">
                    Yêu cầu thêm <span className="opt">(không bắt buộc)</span>
                  </label>
                  <textarea id="g-note" name="note" placeholder="Ví dụ: cần tầng thấp, chỗ đỗ ô tô, đi cùng trẻ nhỏ." />
                </div>
              </div>

              <div className="be-policy">
                <h3>Chính sách đặt phòng</h3>
                <ul>
                  <li>Không cần thanh toán trên website. Đặt phòng giữ chỗ ngay, lễ tân xác nhận trong khoảng 15 phút.</li>
                  <li>{policy.deposit}</li>
                  <li>
                    {freeCancelDays
                      ? `Đổi hoặc huỷ miễn phí trước ngày nhận phòng ${freeCancelDays} ngày${cancelBy ? ` (đến hết ${cancelBy})` : ""}, hoàn lại toàn bộ tiền cọc.`
                      : policy.refund}
                  </li>
                  <li>Hoàn lại toàn bộ tiền cọc nếu khách sạn không bố trí được phòng như đã xác nhận.</li>
                  {discount ? <li>Ưu đãi không cộng dồn: bạn được mức giảm lớn nhất, đã trừ vào tổng tiền.</li> : null}
                  <li>Mang CCCD hoặc hộ chiếu khi nhận phòng.</li>
                </ul>
                {/* Ba ô tách riêng theo từng mục đích, không đánh sẵn (Luật 91/2025 Điều 9, NĐ 356/2025).
                    Link mở tab mới để khách không mất các phòng đã chọn */}
                <label className={`be-agree${err("agree") ? " invalid" : ""}`}>
                  <input type="checkbox" name="agree" value="yes" required />
                  <span>
                    Tôi đồng ý với chính sách đặt phòng ở trên và{" "}
                    <a href="/dieu-khoan" target="_blank" rel="noopener">
                      Điều khoản đặt phòng
                    </a>{" "}
                    của F21 Hotel.
                  </span>
                </label>
                {err("agree") ? <span className="be-err">{err("agree")}</span> : null}
                <label className={`be-agree${err("agreeData") ? " invalid" : ""}`}>
                  <input type="checkbox" name="agreeData" value="yes" required />
                  <span>
                    Tôi đồng ý để F21 Hotel dùng họ tên, số điện thoại, email ở trên để giữ phòng, gọi hoặc nhắn Zalo xác nhận
                    và hướng dẫn đặt cọc, theo{" "}
                    <a href="/chinh-sach-bao-mat" target="_blank" rel="noopener">
                      Chính sách bảo vệ dữ liệu cá nhân
                    </a>
                    .
                  </span>
                </label>
                {err("agreeData") ? <span className="be-err">{err("agreeData")}</span> : null}
                <label className="be-agree">
                  <input type="checkbox" name="marketing" value="yes" />
                  <span>
                    Gửi cho tôi ưu đãi của F21 qua Zalo hoặc SMS <span className="opt">(không bắt buộc, huỷ bất cứ lúc nào)</span>
                  </span>
                </label>
              </div>

              <div className="form-foot">
                <button className={`btn btn-block${submitting ? " is-pending" : ""}`} type="submit" disabled={submitting} aria-busy={submitting}>
                  {submitting ? "Đang đặt phòng…" : `Xác nhận đặt phòng · ${formatVnd(total)}`}
                </button>
                <button type="button" className="btn btn-ghost btn-block" onClick={() => goTo("rooms")}>
                  ‹ Đổi phòng hoặc ngày
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className={`be-summary${roomCount ? " has-items" : ""}`} aria-label="Đặt phòng của bạn">
          <h3>Đặt phòng của bạn</h3>
          {checkIn && checkOut && nights ? (
            <div className="be-dates">
              <div>
                <small>Nhận phòng</small>
                <strong>{shortDate(checkIn)}</strong>
              </div>
              <span aria-hidden="true">›</span>
              <div>
                <small>Trả phòng</small>
                <strong>{shortDate(checkOut)}</strong>
              </div>
              <em>{nights} đêm</em>
            </div>
          ) : null}
          {lines.length ? (
            <ul className="be-lines">
              {lines.map((l) => (
                <li key={lineKey(l.slug, l.stay)}>
                  <span>
                    {l.qty} × {l.room!.name}
                    <small>{STAYS.find((s) => s.key === l.stay)!.label}</small>
                  </span>
                  <b>{formatVnd(l.amount)}</b>
                </li>
              ))}
            </ul>
          ) : (
            <p className="be-empty">Chưa chọn phòng.</p>
          )}
          {discount ? (
            <div className="be-discount">
              <span>
                Giá niêm yết <s>{formatVnd(listTotal)}</s>
              </span>
              <span>
                {discount.label} <b>−{formatVnd(listTotal - total)}</b>
              </span>
            </div>
          ) : null}
          <div className="be-total">
            <span>Tổng tiền</span>
            <strong>{formatVnd(total)}</strong>
          </div>
          {deposit ? (
            <p className="be-deposit">
              Đặt cọc {avail?.depositPercent}% sau khi lễ tân xác nhận: <b>{formatVnd(deposit)}</b>
            </p>
          ) : null}
          {tooFew ? (
            <p className="be-warn">
              Các phòng đã chọn ở tối đa {capacity} người, bạn đang đặt cho {guests} người. Chọn thêm phòng hoặc đổi số khách.
            </p>
          ) : null}
          {step === "rooms" ? (
            <button className="btn btn-block" type="button" disabled={!roomCount || tooFew || searching} onClick={() => goTo("guest")}>
              Tiếp tục
            </button>
          ) : (
            <button type="button" className="be-edit" onClick={() => goTo("rooms")}>
              Sửa phòng đã chọn
            </button>
          )}
          {rating ? (
            <a className="be-rating" href={rating.url || undefined} target="_blank" rel="noopener">
              <b>★ {rating.score.toLocaleString("vi-VN")}</b> · {rating.count.toLocaleString("vi-VN")} đánh giá trên {rating.source}
            </a>
          ) : null}
          <ul className="be-perks">
            <li>Không cần thẻ tín dụng</li>
            <li>{direct ? `Rẻ hơn ${direct}% so với giá niêm yết khi đặt trực tiếp` : "Giá đặt trực tiếp, không qua trung gian"}</li>
            {freeCancelDays ? <li>Đổi, huỷ miễn phí trước {freeCancelDays} ngày</li> : null}
            <li>Lễ tân xác nhận trong 15 phút</li>
          </ul>
        </aside>
      </div>

      {/* Thanh tổng tiền cố định ở cuối màn hình điện thoại */}
      {step === "rooms" && roomCount ? (
        <div className="be-mobile-bar">
          <div>
            <small>
              {roomCount} phòng · {nights} đêm
            </small>
            <strong>{formatVnd(total)}</strong>
          </div>
          <button className="btn" type="button" disabled={tooFew || searching} onClick={() => goTo("guest")}>
            Tiếp tục
          </button>
        </div>
      ) : null}
    </div>
  );
}

function RoomRow({
  room,
  avail,
  nights,
  startDate,
  cart,
  roomsLeftInCart,
  focused,
  onQty,
  telLink,
  direct,
}: {
  direct: number;
  room: EngineRoom;
  avail: Extract<SearchResult, { ok: true }>["rooms"][string] | undefined;
  nights: number;
  startDate: string;
  cart: Cart;
  roomsLeftInCart: number;
  focused: boolean;
  onQty: (slug: string, stay: OnlineStay, qty: number) => void;
  telLink: string;
}) {
  const inCart = STAYS.reduce((s, x) => s + (cart[lineKey(room.slug, x.key)] ?? 0), 0);
  const soldOut = avail !== undefined && (avail.available <= 0 || !Object.keys(avail.plans).length);

  return (
    <article className={`be-room${soldOut ? " sold-out" : ""}${focused ? " focused" : ""}`} id={`be-${room.slug}`}>
      <div className="be-room-media">
        {room.photo ? (
          <Image src={room.photo.src} alt={room.photo.alt} width={room.photo.w} height={room.photo.h} sizes="(max-width: 700px) 100vw, 280px" />
        ) : null}
      </div>
      <div className="be-room-body">
        <header>
          <h3>{room.name}</h3>
          {avail && !soldOut && avail.available <= 2 ? <span className="be-left">Chỉ còn {avail.available} phòng</span> : null}
        </header>
        <p className="be-specs">
          <IconUsers /> Tối đa {room.guests} người
          {room.area ? ` · ${room.area} m²` : ""}
          {room.bed ? ` · ${room.bed}` : ""} · {room.amenities.slice(0, room.area || room.bed ? 2 : 3).join(" · ")}
        </p>

        {soldOut ? (
          <div className="be-soldout">
            <strong>{avail?.reason ?? "Hết phòng những ngày bạn chọn"}</strong>
            <a href={telLink}>
              <IconPhone /> Gọi lễ tân hỏi phòng khác
            </a>
          </div>
        ) : (
          <div className="be-rates">
            {STAYS.map((s) => {
              const plan = avail?.plans[s.key];
              if (avail && !plan) return null;
              const qty = cart[lineKey(room.slug, s.key)] ?? 0;
              const max = Math.min((avail?.available ?? 0) - inCart + qty, roomsLeftInCart + qty);
              const varies = plan && new Set(plan.nightly).size > 1;
              return (
                <div className={`be-rate${qty ? " picked" : ""}`} key={s.key}>
                  <div className="be-rate-name">
                    <strong>{s.label}</strong>
                    <small>{s.time}</small>
                  </div>
                  <div className="be-rate-price">
                    {plan ? (
                      <>
                        {direct ? (
                          <>
                            <s className="be-list-price">{formatVnd(plan.total)}</s>
                            <strong>{formatVnd(discounted(plan.total, direct))}</strong>
                          </>
                        ) : (
                          <strong>{formatVnd(plan.total)}</strong>
                        )}
                        <small>
                          {nights > 1 ? `${nights} đêm, ` : ""}
                          {varies ? "giá từng đêm khác nhau" : `${formatVnd(plan.nightly[0])}/đêm`}
                        </small>
                        {varies ? (
                          <details>
                            <summary>Xem giá từng đêm</summary>
                            <ul>
                              {plan.nightly.map((n, i) => (
                                <li key={i}>
                                  {shortDate(toIsoDate(addDays(new Date(`${startDate}T00:00`), i)))}: {formatVnd(n)}
                                </li>
                              ))}
                            </ul>
                          </details>
                        ) : null}
                      </>
                    ) : (
                      <small>Chọn ngày để xem giá</small>
                    )}
                  </div>
                  <div className="be-qty" role="group" aria-label={`Số phòng ${room.name} ${s.label}`}>
                    <button type="button" aria-label="Bớt một phòng" disabled={!qty} onClick={() => onQty(room.slug, s.key, qty - 1)}>
                      −
                    </button>
                    <output aria-live="polite">{qty}</output>
                    <button
                      type="button"
                      aria-label="Thêm một phòng"
                      disabled={!plan || qty >= max}
                      onClick={() => onQty(room.slug, s.key, qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {inCart ? (
          <p className="be-picked">
            <IconCheck /> Đã chọn {inCart} phòng
          </p>
        ) : null}
      </div>
    </article>
  );
}
