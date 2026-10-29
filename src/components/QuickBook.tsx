"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { addDays, toIsoDate } from "@/lib/dates";

// Ô chọn ngày nhanh dưới hero, chuyển sang trang đặt phòng kèm thông tin đã chọn
export function QuickBook() {
  const router = useRouter();
  const [today, setToday] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [code, setCode] = useState("");

  // Ngày tính ở trình duyệt để khớp múi giờ của khách
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- chỉ đọc ngày hiện tại một lần sau khi hydrate
    setToday(toIsoDate(new Date()));
  }, []);

  function onCheckIn(value: string) {
    setCheckIn(value);
    if (value && (!checkOut || checkOut <= value)) setCheckOut(toIsoDate(addDays(new Date(`${value}T00:00`), 1)));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("in", checkIn);
    if (checkOut) params.set("out", checkOut);
    params.set("guests", guests);
    if (code.trim()) params.set("code", code.trim().toUpperCase());
    router.push(`/dat-phong?${params}`);
  }

  return (
    <section className="quick-book" aria-label="Kiểm tra phòng trống">
      <div className="wrap">
        <form onSubmit={onSubmit}>
          <label>
            <span>Nhận phòng</span>
            <input type="date" value={checkIn} min={today} onChange={(e) => onCheckIn(e.target.value)} />
          </label>
          <label>
            <span>Trả phòng</span>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </label>
          <label>
            <span>Số khách</span>
            <select value={guests} onChange={(e) => setGuests(e.target.value)}>
              {["1", "2", "3", "4", "5–8", "Trên 8"].map((g) => (
                <option key={g} value={g}>
                  {g} khách
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Mã ưu đãi</span>
            <input
              type="text"
              value={code}
              placeholder="Nếu có"
              autoCapitalize="characters"
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          <button className="btn btn-gold" type="submit">
            Kiểm tra phòng
          </button>
        </form>
      </div>
    </section>
  );
}
