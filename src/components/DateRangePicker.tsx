"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { addDays, nightsBetween, shortDate, toIsoDate } from "@/lib/dates";

// Lịch chọn khoảng ngày kiểu các trang đặt phòng: bấm ngày nhận rồi ngày trả trên cùng một lịch hai tháng.
// Máy tính: lịch nổi ngay dưới (hoặc trên) ô ngày. Điện thoại: lịch trượt lên từ đáy màn hình.
// Lịch gắn vào <body> để không bị cắt bởi khung có overflow: hidden (như hero trang chủ).

type Props = {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  /** Ngày sớm nhất được chọn (YYYY-MM-DD), mặc định hôm nay */
  min?: string;
  /** "hero": chữ trắng trên ảnh trang chủ; "field": hai ô như ô nhập của form */
  variant?: "hero" | "field";
  /** Tên ô ẩn gửi kèm form, ví dụ ["checkIn", "checkOut"] */
  names?: [string, string];
  errors?: { checkIn?: string; checkOut?: string };
  /** Cho phép bỏ chọn ngày (ô ngày không bắt buộc) */
  clearable?: boolean;
  className?: string;
};

type End = "in" | "out";

const MONTHS_AHEAD = 12;
const WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const DAY_NAMES = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

const parse = (iso: string) => new Date(`${iso}T00:00`);
const nextDay = (iso: string) => toIsoDate(addDays(parse(iso), 1));
const monthStart = (iso: string) => `${iso.slice(0, 7)}-01`;
function addMonths(first: string, n: number) {
  const d = parse(first);
  d.setMonth(d.getMonth() + n, 1);
  return toIsoDate(d);
}
const monthTitle = (first: string) => `Tháng ${parse(first).getMonth() + 1}, ${first.slice(0, 4)}`;
function dayLabel(iso: string) {
  const d = parse(iso);
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`;
}

// Các ô của một tháng, tuần bắt đầu từ thứ Hai; "" là ô trống đầu tháng
function monthCells(first: string) {
  const d = parse(first);
  const lead = (d.getDay() + 6) % 7;
  const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return [
    ...Array.from({ length: lead }, () => ""),
    ...Array.from({ length: days }, (_, i) => `${first.slice(0, 8)}${String(i + 1).padStart(2, "0")}`),
  ];
}

export function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
  min,
  variant = "field",
  names,
  errors,
  clearable = false,
  className = "",
}: Props) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<End>("in");
  const [draftIn, setDraftIn] = useState("");
  const [draftOut, setDraftOut] = useState("");
  const [hover, setHover] = useState("");
  const [month, setMonth] = useState("");
  const [focusDay, setFocusDay] = useState("");
  const [today, setToday] = useState("");
  const [sheet, setSheet] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const keyNav = useRef(false);
  const scrolled = useRef(false);

  const first = min || today;
  const lastMonth = first ? addMonths(monthStart(first), MONTHS_AHEAD) : "";

  function show(end: End, button: HTMLButtonElement) {
    const now = toIsoDate(new Date());
    const start = min || now;
    const inDate = checkIn && checkIn >= start ? checkIn : "";
    const outDate = inDate && checkOut > inDate ? checkOut : "";
    opener.current = button;
    setToday(now);
    setDraftIn(inDate);
    setDraftOut(outDate);
    setActive(end === "out" && !inDate ? "in" : end);
    setHover("");
    const focus = (end === "out" ? outDate || (inDate && nextDay(inDate)) : inDate) || start;
    setFocusDay(focus);
    setMonth(monthStart(end === "out" && inDate ? inDate : focus));
    setSheet(window.matchMedia("(max-width: 720px)").matches);
    setPos(null);
    scrolled.current = false;
    setOpen(true);
  }

  // Lịch đang mở thì bấm ô ngày kia chỉ chuyển sang chọn ngày đó
  function onTrigger(e: MouseEvent<HTMLButtonElement>) {
    const end = e.currentTarget.dataset.end as End;
    if (!open) show(end, e.currentTarget);
    else setActive(end === "out" && !draftIn ? "in" : end);
  }

  // Đóng lịch; khách dùng bàn phím thì trả con trỏ về ô ngày để đi tiếp bằng phím Tab
  function hide(keyboard: boolean) {
    setOpen(false);
    if (keyboard) opener.current?.focus();
  }

  function close(commit = true, keyboard = false) {
    if (commit && draftIn) {
      const out = draftOut > draftIn ? draftOut : nextDay(draftIn);
      if (draftIn !== checkIn || out !== checkOut) onChange(draftIn, out);
    }
    hide(keyboard);
  }

  function pick(day: string, keyboard: boolean) {
    setFocusDay(day);
    if (active === "in" || !draftIn || day <= draftIn) {
      setDraftIn(day);
      if (draftOut && draftOut <= day) setDraftOut("");
      setActive("out");
      return;
    }
    setDraftOut(day);
    onChange(draftIn, day);
    hide(keyboard);
  }

  // Lịch nổi: đặt dưới ô ngày, thiếu chỗ thì đặt lên trên; giữ trong màn hình
  useLayoutEffect(() => {
    if (!open || sheet) return;
    function place() {
      const anchor = root.current?.getBoundingClientRect();
      const box = pop.current?.getBoundingClientRect();
      if (!anchor || !box) return;
      const below = anchor.bottom + 8;
      // Trên và dưới đều thiếu chỗ: cuộn trang một lần cho lịch hiện trọn bên dưới ô ngày
      const overflow = below + box.height - (window.innerHeight - 8);
      if (!scrolled.current && overflow > 0 && anchor.top - box.height - 8 <= 8) {
        scrolled.current = true;
        window.scrollBy({ top: Math.min(overflow, anchor.top - 96) });
        return;
      }
      const top = below + box.height > window.innerHeight - 8 && anchor.top - box.height - 8 > 8 ? anchor.top - box.height - 8 : below;
      const left = Math.max(16, Math.min(anchor.left, window.innerWidth - box.width - 16));
      setPos({ top, left });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, sheet, month]);

  // Bấm ra ngoài thì đóng (giữ ngày đã chọn); Esc thì đóng và bỏ thay đổi
  useEffect(() => {
    if (!open) return;
    function onDown(e: PointerEvent) {
      const t = e.target as Node;
      if (!pop.current?.contains(t) && !root.current?.contains(t)) close();
    }
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") close(false, true);
    }
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  });

  // Mở lịch hoặc di chuyển bằng phím mũi tên thì đưa con trỏ tới ngày đang chọn
  // (đợi lịch được đặt chỗ xong: ô còn ẩn thì trình duyệt không cho focus)
  const placed = sheet || pos !== null;
  useEffect(() => {
    if (!open || !placed) return;
    pop.current?.querySelector<HTMLButtonElement>(`[data-day="${focusDay}"]`)?.focus({ preventScroll: !keyNav.current });
    keyNav.current = false;
  }, [open, placed, focusDay, month]);

  function onGridKey(e: KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!step || !focusDay) return;
    e.preventDefault();
    const next = toIsoDate(addDays(parse(focusDay), step));
    if (next < first || monthStart(next) > lastMonth) return;
    keyNav.current = true;
    setFocusDay(next);
    // Lịch luôn hiện hai tháng: ra khỏi hai tháng đó thì lật tháng
    if (monthStart(next) < month) setMonth(monthStart(next));
    else if (monthStart(next) > addMonths(month, 1)) setMonth(addMonths(monthStart(next), -1));
  }

  // Đang chọn ngày trả thì rê chuột tới đâu tô thử khoảng ngày tới đó
  const previewing = active === "out" && draftIn && hover > draftIn && hover !== draftOut;
  const rangeEnd = previewing ? hover : draftOut;
  const nights = draftIn && rangeEnd ? nightsBetween(draftIn, rangeEnd) : null;
  const shownNights = nightsBetween(checkIn, checkOut);

  function dayClass(day: string) {
    const c = ["drp-day"];
    if (day === today) c.push("today");
    if (day === draftIn) c.push(rangeEnd ? "start span" : "start");
    if (day === rangeEnd) c.push(previewing ? "end preview" : "end");
    if (draftIn && rangeEnd && day > draftIn && day < rangeEnd) c.push("between");
    return c.join(" ");
  }

  function renderMonth(first_: string) {
    return (
      <div className="drp-month" key={first_}>
        <h3 id={`${id}-${first_}`}>{monthTitle(first_)}</h3>
        <div className="drp-week" aria-hidden="true">
          {WEEK.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className="drp-grid" role="group" aria-labelledby={`${id}-${first_}`}>
          {monthCells(first_).map((day, i) =>
            day ? (
              <button
                key={day}
                type="button"
                data-day={day}
                className={dayClass(day)}
                disabled={day < first}
                tabIndex={day === focusDay ? 0 : -1}
                aria-label={dayLabel(day)}
                aria-pressed={day === draftIn || day === draftOut}
                onClick={(e) => pick(day, e.detail === 0)}
                onPointerEnter={() => setHover(day)}
                onFocus={() => setHover(day)}
              >
                <span>{Number(day.slice(8))}</span>
              </button>
            ) : (
              <span key={`e${i}`} className="drp-blank" />
            ),
          )}
        </div>
      </div>
    );
  }

  const prompt = active === "in" ? "Chọn ngày nhận phòng" : "Chọn ngày trả phòng";
  const popup = open ? (
    <>
      {sheet ? <div className="drp-backdrop" aria-hidden="true" /> : null}
      <div
        ref={pop}
        className={`drp-pop${sheet ? " sheet" : ""}`}
        role="dialog"
        aria-modal={sheet}
        aria-label="Chọn ngày ở"
        style={sheet ? undefined : pos ? { top: pos.top, left: pos.left } : { visibility: "hidden", top: 0, left: 0 }}
      >
        <div className="drp-head">
          <div className="drp-ends">
            <button type="button" className={active === "in" ? "on" : ""} onClick={() => setActive("in")}>
              <small>Nhận phòng</small>
              {draftIn ? shortDate(draftIn) : "Chọn ngày"}
            </button>
            <span aria-hidden="true">›</span>
            <button type="button" className={active === "out" ? "on" : ""} onClick={() => draftIn && setActive("out")} disabled={!draftIn}>
              <small>Trả phòng</small>
              {rangeEnd ? shortDate(rangeEnd) : "Chọn ngày"}
            </button>
          </div>
          {sheet ? (
            <button type="button" className="drp-close" onClick={(e) => close(false, e.detail === 0)} aria-label="Đóng lịch">
              ×
            </button>
          ) : null}
        </div>
        <p className="drp-prompt" aria-live="polite">
          {prompt}
        </p>
        <div className="drp-cal" onKeyDown={onGridKey} onPointerLeave={() => setHover("")}>
          <button
            type="button"
            className="drp-nav prev"
            onClick={() => setMonth(addMonths(month, -1))}
            disabled={month <= monthStart(first)}
            aria-label="Tháng trước"
          >
            ‹
          </button>
          <button
            type="button"
            className="drp-nav next"
            onClick={() => setMonth(addMonths(month, 1))}
            disabled={addMonths(month, 1) >= lastMonth}
            aria-label="Tháng sau"
          >
            ›
          </button>
          {renderMonth(month)}
          {renderMonth(addMonths(month, 1))}
        </div>
        <div className="drp-foot">
          <span>{nights ? `${nights} đêm` : draftIn ? "Chọn ngày trả phòng" : ""}</span>
          {clearable && (draftIn || draftOut) ? (
            <button
              type="button"
              className="drp-clear"
              onClick={() => {
                setDraftIn("");
                setDraftOut("");
                setActive("in");
                onChange("", "");
              }}
            >
              Xoá ngày
            </button>
          ) : null}
          <button type="button" className="btn" onClick={(e) => close(true, e.detail === 0)} disabled={!draftIn && !clearable}>
            Xong
          </button>
        </div>
      </div>
    </>
  ) : null;

  const ends: { end: End; label: string; value: string; error?: string }[] = [
    { end: "in", label: "Nhận phòng", value: checkIn, error: errors?.checkIn },
    { end: "out", label: "Trả phòng", value: checkOut, error: errors?.checkOut },
  ];

  return (
    <div ref={root} className={`drp drp-${variant}${open ? " open" : ""} ${className}`.trim()}>
      {variant === "hero"
        ? ends.map(({ end, label, value }, i) => (
            <span className="drp-hero-end" key={end}>
              {i ? (
                <span className="hero-search-arrow" aria-hidden="true">
                  ›
                </span>
              ) : null}
              <button
                type="button"
                className={`hero-date${value ? " filled" : ""}${open && active === end ? " on" : ""}`}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-label={`${label}: ${value ? dayLabel(value) : "chưa chọn"}`}
                data-end={end}
                onClick={onTrigger}
              >
                <span className="hero-date-text">{value ? shortDate(value) : label}</span>
              </button>
            </span>
          ))
        : ends.map(({ end, label, value, error }) => (
            <div className={`field${error ? " invalid" : ""}`} key={end}>
              <label htmlFor={`${id}-${end}`}>{label}</label>
              <button
                id={`${id}-${end}`}
                type="button"
                className={`drp-input${value ? " filled" : ""}${open && active === end ? " on" : ""}`}
                aria-haspopup="dialog"
                aria-expanded={open}
                data-end={end}
                onClick={onTrigger}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3.5 10h17M8 3v4M16 3v4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span>{value ? `${shortDate(value)}/${value.slice(0, 4)}` : "Chọn ngày"}</span>
                {end === "out" && shownNights ? <small>{shownNights} đêm</small> : null}
              </button>
              {error ? <span className="err">{error}</span> : null}
            </div>
          ))}
      {names
        ? names.map((name, i) => <input key={name} type="hidden" name={name} value={i ? checkOut : checkIn} />)
        : null}
      {popup ? createPortal(popup, document.body) : null}
    </div>
  );
}
