"use client";

import { AnimatePresence, domAnimation, LazyMotion, m, MotionConfig } from "motion/react";

// Thông báo ngắn ở cuối màn hình, trượt lên khi hiện và mờ đi khi ẩn (motion).
// Tải riêng (next/dynamic, ssr: false) từ ui.tsx để motion không nằm trong gói chạy trên server.
export default function Toast({ msg }: { msg: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <AnimatePresence>
          {msg ? (
            <m.div
              key={msg}
              className="c-toast"
              role="status"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            >
              {msg}
            </m.div>
          ) : null}
        </AnimatePresence>
      </LazyMotion>
    </MotionConfig>
  );
}
