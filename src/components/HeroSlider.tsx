"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";
import type { HeroSlide } from "@/lib/site";

const INTERVAL = 7000;

const pad = (n: number) => String(n).padStart(2, "0");

// Hero dạng slider: mỗi slide có ảnh nền và nội dung riêng (tiêu đề, mô tả, giá, nút).
// Ảnh chuyển mờ dần; nội dung dựng lại theo slide nên hiệu ứng chữ chạy lại mỗi lần đổi.
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  // prev: ảnh vừa rời đi, nằm dưới ảnh mới cho tới khi ảnh mới hiện hẳn.
  // changed: đã đổi slide ít nhất một lần (lần hiện đầu tiên chạy hiệu ứng đầy đủ, các lần sau nhanh hơn)
  const [{ active, prev, changed }, setSlide] = useState({ active: 0, prev: -1, changed: false });
  // Tạm dừng do người dùng bấm nút, hoặc do đang dùng bàn phím trong hero
  // (nếu không, slide tự đổi sẽ dựng lại nội dung và làm mất vị trí focus)
  const [userPaused, setUserPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const paused = userPaused || focusPaused;
  // Tăng mỗi lần chạy tiếp để thanh thời gian bắt đầu lại từ đầu
  const [run, setRun] = useState(0);
  const touchX = useRef<number | null>(null);

  // Lùi/tiến d slide, luôn tính từ slide hiện tại (bấm nhanh nhiều lần vẫn đúng)
  const step = useCallback(
    (d: number) =>
      setSlide((s) => {
        const next = (s.active + d + slides.length) % slides.length;
        return next === s.active ? s : { active: next, prev: s.active, changed: true };
      }),
    [slides.length],
  );

  // Tự chuyển khi không tạm dừng; hẹn giờ lại mỗi khi đổi slide hoặc chạy tiếp.
  // Chế độ giảm chuyển động chỉ tắt hiệu ứng qua CSS, không dừng slider.
  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const id = window.setTimeout(() => step(1), INTERVAL);
    return () => window.clearTimeout(id);
  }, [active, paused, run, step, slides.length]);

  const togglePause = () => {
    if (userPaused) setRun((r) => r + 1);
    setUserPaused(!userPaused);
  };

  // Chỉ tạm dừng khi focus bằng bàn phím (không dừng khi bấm chuột vào nút)
  const focusHandlers = {
    onFocus: (e: FocusEvent<HTMLElement>) => setFocusPaused(e.target.matches(":focus-visible")),
    onBlur: (e: FocusEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
        setFocusPaused(false);
        setRun((r) => r + 1);
      }
    },
  };

  const slide = slides[active];
  const title = (
    <>
      <span className="t-bold">{slide.bold}</span>
      <span className="t-light">{slide.light}</span>
    </>
  );

  return (
    <>
      <div
        className="hero-visual"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <div className="hero-media" data-paused={paused || undefined}>
          {slides.map((s, i) => (
            <picture key={s.src} className={`hero-slide${i === active ? " active" : i === prev ? " prev" : ""}`}>
              <source media="(max-width: 900px)" srcSet={s.srcMobile} />
              {/* Dùng <picture> để điện thoại tải ảnh nhỏ hơn */}
              <img
                src={s.src}
                // Chỉ ảnh đang hiện mới có mô tả cho trình đọc màn hình
                alt={i === active ? s.alt : ""}
                fetchPriority={i === 0 ? "high" : "low"}
                decoding="async"
              />
            </picture>
          ))}
        </div>
      </div>

      {/* key theo slide để dựng lại nội dung; data-change đánh dấu các lần đổi slide sau lần đầu */}
      <div className="hero-body" key={active} data-change={changed || undefined} {...focusHandlers}>
        <div className="hero-main">
          <p className="hero-kicker">{slide.kicker}</p>
          {/* h1 của trang nằm cố định ở page.tsx; tiêu đề slide là h2 */}
          <h2 className="hero-title">{title}</h2>
          <p className="hero-sub">{slide.sub}</p>
        </div>

        <Link className="hero-book" href={slide.book.href}>
          {slide.book.label}
          <svg viewBox="0 0 56 16" aria-hidden="true">
            <path d="M0 8h54M47 1l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </Link>

        <Link className="hero-cost" href={slide.cost.href}>
          <span className="hero-cost-icon" aria-hidden="true">
            i
          </span>
          <strong>{slide.cost.value}</strong>
          <small>{slide.cost.label}</small>
        </Link>
      </div>

      {slides.length > 1 ? (
        <div className="hero-nav" role="group" aria-label="Chuyển slide" data-paused={paused || undefined} {...focusHandlers}>
          <span className="hero-count">
            <b>{pad(active + 1)}</b> / {pad(slides.length)}
          </span>
          {/* Thanh chạy theo thời gian tự chuyển; key để chạy lại từ đầu mỗi slide */}
          <span className="hero-progress" aria-hidden="true">
            <span key={`${active}-${run}`} style={{ animationDuration: `${INTERVAL}ms` }} />
          </span>
          <button
            type="button"
            className="hero-pause"
            onClick={togglePause}
            aria-pressed={userPaused}
            aria-label={userPaused ? "Chạy tiếp slider" : "Tạm dừng slider"}
          >
            {userPaused ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" />
              </svg>
            )}
          </button>
          <button type="button" className="hero-arrow prev" onClick={() => step(-1)} aria-label="Slide trước">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button type="button" className="hero-arrow next" onClick={() => step(1)} aria-label="Slide sau">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      ) : null}
    </>
  );
}
