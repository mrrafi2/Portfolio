// FeatureChips.jsx
import React, { useEffect, useRef, useState } from "react";
import styles from "./FeatureChips.module.css";

export default function FeatureChips({
  features = [],
  visibleCount = 4,
  autoplay = false,
  autoplayInterval = 3500,
}) {
  if (!features || features.length === 0) return null;

  const total = features.length;
  const maxIndex = Math.max(0, total - visibleCount);
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const pointerRef = useRef({ active: false, startX: 0 });

  // autoplay
  useEffect(() => {
    if (!autoplay || maxIndex === 0) return;
    const id = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, autoplayInterval);
    return () => clearInterval(id);
  }, [autoplay, autoplayInterval, maxIndex]);

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, maxIndex]);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

  // swipe (pointer events)
  const onPointerDown = (e) => {
    pointerRef.current.active = true;
    pointerRef.current.startX = e.clientX ?? (e.touches && e.touches[0].clientX);
    // stop autoplay while touching
    if (trackRef.current) trackRef.current.style.transition = "none";
  };

  const onPointerMove = (e) => {
    if (!pointerRef.current.active || !trackRef.current) return;
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const delta = clientX - pointerRef.current.startX;
    // translate temporarily for feel
    const percentDelta = (delta / trackRef.current.offsetWidth) * 100;
    const base = -(index * (100 / visibleCount));
    trackRef.current.style.transform = `translateX(calc(${base}% + ${percentDelta}%))`;
  };

  const onPointerUp = (e) => {
    if (!pointerRef.current.active || !trackRef.current) return;
    pointerRef.current.active = false;
    trackRef.current.style.transition = ""; // restore CSS transition

    const clientX = e.clientX ?? (e.changedTouches && e.changedTouches[0].clientX);
    const delta = clientX - pointerRef.current.startX;
    const threshold = 40; // px

    if (delta > threshold) prev();
    else if (delta < -threshold) next();
    else {
      // small movement -> snap back
      trackRef.current.style.transform = `translateX(-${index * (100 / visibleCount)}%)`;
    }
  };

  // page dots count
  const pages = maxIndex + 1;

  return (
    <div className={styles.carousel} role="group" aria-label="Project features carousel">
      {/* Prev button */}
      {maxIndex > 0 && (
        <button
          className={`${styles.nav} ${styles.prev}`}
          onClick={prev}
          aria-label="Previous features"
          disabled={index === 0}
        >
          ‹
        </button>
      )}

      {/* viewport */}
      <div
        className={styles.viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
      >
        <ul
          ref={trackRef}
          className={styles.track}
          style={{
            transform: `translateX(-${index * (100 / visibleCount)}%)`,
            // expose visibleCount to CSS
            ["--visibleCount"]: visibleCount,
          }}
        >
          {features.map((f, i) => (
            <li key={i} className={styles.chip} title={f} aria-label={f}>
              <span className={styles.icon} aria-hidden>★</span>
              <span className={styles.text}>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Next button */}
      {maxIndex > 0 && (
        <button
          className={`${styles.nav} ${styles.next}`}
          onClick={next}
          aria-label="Next features"
          disabled={index === maxIndex}
        >
          ›
        </button>
      )}

      {/* dots */}
      {pages > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Feature pages">
          {Array.from({ length: pages }).map((_, p) => (
            <button
              key={p}
              className={`${styles.dot} ${p === index ? styles.activeDot : ""}`}
              aria-label={`Go to features page ${p + 1}`}
              aria-pressed={p === index}
              onClick={() => setIndex(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
