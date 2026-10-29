"use client";

import { useEffect, useState } from "react";

export type HeroSlide = { src: string; srcMobile: string; alt: string };

const INTERVAL = 6000;

// Ảnh nền hero chuyển dần (crossfade); chữ và nút của hero nằm cố định phía trên
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % slides.length),
      INTERVAL,
    );
    return () => window.clearTimeout(id);
  }, [active, paused, slides.length]);

  return (
    <>
      <div
        className="hero-media"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((slide, i) => (
          <picture
            key={slide.src}
            className={`hero-slide${i === active ? " active" : ""}`}
          >
            <source media="(max-width: 900px)" srcSet={slide.srcMobile} />
            {/* Dùng <picture> để điện thoại tải ảnh nhỏ hơn */}
            <img
              src={slide.src}
              // Chỉ ảnh đang hiện mới có mô tả cho trình đọc màn hình
              alt={i === active ? slide.alt : ""}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding="async"
            />
          </picture>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="hero-dots" role="tablist" aria-label="Chọn ảnh">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Ảnh ${i + 1}: ${slide.alt}`}
              className={i === active ? "active" : undefined}
              onClick={() => setActive(i)}
            >
              <span
                style={
                  i === active && !paused
                    ? { animationDuration: `${INTERVAL}ms` }
                    : undefined
                }
              />
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
