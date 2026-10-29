"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/site";

type Props = {
  photos: Photo[];
  className?: string;
  // sizes cho ảnh đầu tiên (thường hiển thị lớn hơn) và các ảnh còn lại
  leadSizes?: string;
  sizes: string;
};

// Lưới ảnh giữ đúng tỉ lệ gốc; bấm vào ảnh mở xem toàn màn hình
export function Gallery({ photos, className, leadSizes, sizes }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
    document.documentElement.toggleAttribute("data-lightbox-open", true);
  };
  const close = () => dialogRef.current?.close();
  const step = useCallback((d: number) => setIndex((i) => (i + d + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => document.documentElement.toggleAttribute("data-lightbox-open", false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    dialog.addEventListener("close", onClose);
    dialog.addEventListener("keydown", onKey);
    return () => {
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("keydown", onKey);
    };
  }, [step]);

  const current = photos[index];

  return (
    <>
      <div className={className}>
        {photos.map((photo, i) => (
          <button
            type="button"
            className="photo-btn"
            key={photo.src}
            onClick={() => open(i)}
            aria-label={`Xem ảnh lớn: ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.w}
              height={photo.h}
              sizes={i === 0 && leadSizes ? leadSizes : sizes}
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Xem ảnh"
        // Bấm ra vùng tối bên ngoài ảnh để đóng
        onClick={(e) => e.target === e.currentTarget && close()}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <figure onClick={(e) => e.target === e.currentTarget && close()}>
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={current.w}
            height={current.h}
            sizes="92vw"
          />
          <figcaption>
            <span>{current.alt}</span>
            <span className="count">
              {index + 1} / {photos.length}
            </span>
          </figcaption>
        </figure>
        <button type="button" className="lb-close" onClick={close} aria-label="Đóng">
          ×
        </button>
        {photos.length > 1 ? (
          <>
            <button type="button" className="lb-nav prev" onClick={() => step(-1)} aria-label="Ảnh trước">
              ‹
            </button>
            <button type="button" className="lb-nav next" onClick={() => step(1)} aria-label="Ảnh sau">
              ›
            </button>
          </>
        ) : null}
      </dialog>
    </>
  );
}
