"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MAP_PLACES, MAP_ROAD, withTimes } from "@/lib/map-places";
import type { MapScene } from "./map3d-scene";
import "./LocationMap3D.css";

type Props = {
  /** Danh sách "Khoảng cách" của khối Vị trí: lấy thời gian hiện trên nhãn */
  distances?: { place: string; time: string }[];
  /** Bản đồ Google: hiện khi khách chọn, hoặc khi máy không chạy được WebGL */
  children: ReactNode;
};

// Màu nền thật của khối chứa bản đồ (bỏ qua lớp trong suốt), để sương mù ở mép hoà vào nền
function backgroundOf(el: HTMLElement | null) {
  for (let node = el; node; node = node.parentElement) {
    const bg = getComputedStyle(node).backgroundColor;
    if (bg && bg !== "transparent" && !/rgba\(.*,\s*0\)$/.test(bg)) return bg;
  }
  return "#f8f2e7";
}

// Bản đồ 3D: F21 ở giữa, đường bay tới Bảo Sơn, Mỹ Đình, Trung tâm Hội nghị Quốc gia, Hoàn Kiếm.
// three.js (~150 KB) chỉ tải khi khách cuộn gần tới, và chỉ vẽ khi bản đồ đang trong màn hình.
export function LocationMap3D({ distances = [], children }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<MapScene | null>(null);
  const [view, setView] = useState<"3d" | "google">("3d");
  const [status, setStatus] = useState<"idle" | "ready" | "failed">("idle");

  const places = withTimes(MAP_PLACES, distances);
  const [road] = withTimes([MAP_ROAD], distances);
  const summary = [road, ...places].map((p) => `${p.short} ${p.time}`).join(", ");

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let disposed = false;
    let loading = false;
    let visible = false;

    const load = async () => {
      if (loading) return;
      loading = true;
      try {
        const { createMapScene } = await import("./map3d-scene");
        if (disposed) return;
        const labels = new Map<string, HTMLElement>();
        el.querySelectorAll<HTMLElement>("[data-key]").forEach((n) => labels.set(n.dataset.key!, n));
        sceneRef.current = createMapScene({
          host: el,
          labels,
          places: MAP_PLACES,
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          fog: backgroundOf(el.parentElement),
        });
        setStatus("ready");
        if (visible) sceneRef.current.start();
      } catch {
        // Không có WebGL (máy cũ, trình duyệt tắt tăng tốc phần cứng): dùng bản đồ Google
        if (!disposed) setStatus("failed");
      }
    };

    // Tải sớm khi còn cách một đoạn, chạy hình ảnh khi đã thấy rõ bản đồ
    const near = new IntersectionObserver(([e]) => e.isIntersecting && load(), { rootMargin: "600px 0px" });
    const seen = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !document.hidden) sceneRef.current?.start();
        else sceneRef.current?.stop();
      },
      { threshold: 0.3 },
    );
    near.observe(el);
    seen.observe(el);
    const onVisibility = () => (document.hidden || !visible ? sceneRef.current?.stop() : sceneRef.current?.start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      near.disconnect();
      seen.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  const hover = (key: string | null) => () => sceneRef.current?.setActive(key);
  const showGoogle = view === "google" || status === "failed";

  return (
    <div className="map3d" data-status={status}>
      <div className="map3d-stage" ref={stage} role="img" aria-label={`Bản đồ minh hoạ vị trí F21 Hotel: ${summary}`}>
        <div className="map3d-labels" aria-hidden="true">
          <span className="map3d-label is-hotel" data-key="f21">
            <b>F21 Hotel</b>
            <small className="map3d-wide">Khu biệt thự Hoa Phượng</small>
          </span>
          {places.map((p) => (
            <span
              className={p.key === "vinschool" ? "map3d-label is-below" : "map3d-label"}
              data-key={p.key}
              key={p.key}
              onPointerEnter={hover(p.key)}
              onPointerLeave={hover(null)}
              onClick={hover(p.key)}
            >
              <b className="map3d-wide">{p.short}</b>
              <b className="map3d-narrow">{p.tiny}</b>
              <small>{p.time}</small>
            </span>
          ))}
          <span className="map3d-label is-road" data-key="road">
            {road.short} · {road.time}
          </span>
          <span className="map3d-label is-road" data-key="west">
            ← Hoà Lạc · Ba Vì
          </span>
          <span className="map3d-label is-faint" data-key="ring1">1 km</span>
          <span className="map3d-label is-faint" data-key="ring5">5 km</span>
          <span className="map3d-label is-faint" data-key="ring10">10 km</span>
        </div>
      </div>

      {showGoogle ? <div className="map3d-google">{children}</div> : null}

      {status !== "failed" ? (
        <div className="map3d-switch" role="group" aria-label="Kiểu bản đồ">
          <button type="button" aria-pressed={view === "3d"} onClick={() => setView("3d")}>
            Bản đồ 3D
          </button>
          <button type="button" aria-pressed={view === "google"} onClick={() => setView("google")}>
            Google Maps
          </button>
        </div>
      ) : null}
      {view === "3d" && status === "ready" ? <p className="map3d-note">Sơ đồ minh hoạ, khoảng cách đã thu gọn</p> : null}
    </div>
  );
}
