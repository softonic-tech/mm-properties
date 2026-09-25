import { useEffect, useRef, useState } from "react";
import { useContent } from "@/content/language";
import { prefersReducedMotion } from "@/lib/utils";

const HOLD_MS = 5600;

/**
 * Hero background — ocean, then the towns the agency sells in.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { src, poster, places } = useContent().media;
  const [index, setIndex] = useState(0);
  const reduced = prefersReducedMotion();
  const count = 1 + places.length;
  const place = index > 0 ? places[index - 1] : null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    if (reduced || index !== 0) {
      video.pause();
      return;
    }

    void video.play().catch(() => {});
  }, [index, reduced]);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [count, reduced]);

  return (
    <div
      data-component="hero-video"
      className="absolute inset-0 z-0 overflow-hidden bg-background"
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          index === 0 ? "opacity-100" : "opacity-0"
        }`}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />

      {places.map((item, i) => {
        const active = index === i + 1;
        return (
          <img
            key={item.src}
            src={item.src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              active ? "opacity-100" : "opacity-0"
            } ${active && !reduced ? "hero-ken" : ""}`}
          />
        );
      })}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(7,9,11,0.45) 0%, rgba(7,9,11,0.15) 35%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(7,9,11,0.85) 0%, rgba(7,9,11,0.35) 22%, transparent 45%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,9,11,0.55) 0%, transparent 22%)",
        }}
      />

      {place ? (
        <p
          key={place.label}
          className="hero-place absolute top-24 left-1/2 text-[11px] tracking-[0.32em] text-white/90 uppercase md:top-28"
        >
          {place.label}
        </p>
      ) : null}
    </div>
  );
}
