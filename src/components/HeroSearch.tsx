"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { DateRangePicker } from "./DateRangePicker";

// Ô chọn ngày gọn ở thanh đáy hero; chuyển sang trang đặt phòng kèm ngày đã chọn
export function HeroSearch() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

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
        {/* Bấm vào ngày nhận hoặc ngày trả là mở lịch chọn cả khoảng ngày */}
        <DateRangePicker
          variant="hero"
          checkIn={checkIn}
          checkOut={checkOut}
          clearable
          onChange={(a, b) => {
            setCheckIn(a);
            setCheckOut(b);
          }}
        />
        <button type="submit" aria-label="Kiểm tra phòng trống">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      </div>
    </form>
  );
}
