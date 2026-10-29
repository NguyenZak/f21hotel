"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { addDays, toIsoDate } from "@/lib/dates";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

// "2026-11-07" -> "T7, 07/11"
function shortDate(iso: string) {
  const d = new Date(`${iso}T00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${WEEKDAYS[d.getDay()]}, ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Ô chọn ngày gọn ở thanh đáy hero; chuyển sang trang đặt phòng kèm ngày đã chọn
export function HeroSearch() {
  const router = useRouter();
  const [today, setToday] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- chỉ đọc ngày hiện tại một lần sau khi hydrate
    setToday(toIsoDate(new Date()));
  }, []);

  function onCheckIn(value: string) {
    setCheckIn(value);
    if (value && (!checkOut || checkOut <= value)) setCheckOut(toIsoDate(addDays(new Date(`${value}T00:00`), 1)));
  }

  // Bấm vào bất kỳ đâu trên ô ngày cũng mở lịch (đã ẩn biểu tượng lịch mặc định)
  function openPicker(e: MouseEvent<HTMLInputElement>) {
    try {
      e.currentTarget.showPicker();
    } catch {
      // Trình duyệt cũ không có showPicker: vẫn gõ ngày được
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("in", checkIn);
    if (checkOut) params.set("out", checkOut);
    router.push(`/dat-phong${params.size ? `?${params}` : ""}`);
  }

  return (
    <form className="hero-search" onSubmit={onSubmit} aria-label="Chọn ngày ở">
      <span className="hero-search-label">Bạn muốn ở</span>
      <div className="hero-search-row">
        {/* Ô ngày trong suốt phủ lên chữ hiển thị "T7, 07/11"; bấm vào là mở lịch */}
        <label className={`hero-date${checkIn ? " filled" : ""}`}>
          <span className="hero-date-text" aria-hidden="true">
            {checkIn ? shortDate(checkIn) : "Nhận phòng"}
          </span>
          <span className="sr-only">Ngày nhận phòng</span>
          <input
            type="date"
            value={checkIn}
            min={today}
            onClick={openPicker}
            onChange={(e) => onCheckIn(e.target.value)}
          />
        </label>
        <span className="hero-search-arrow" aria-hidden="true">
          ›
        </span>
        <label className={`hero-date${checkOut ? " filled" : ""}`}>
          <span className="hero-date-text" aria-hidden="true">
            {checkOut ? shortDate(checkOut) : "Trả phòng"}
          </span>
          <span className="sr-only">Ngày trả phòng</span>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onClick={openPicker}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </label>
        <button type="submit" aria-label="Kiểm tra phòng trống">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      </div>
    </form>
  );
}
