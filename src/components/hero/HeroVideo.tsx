import { useEffect, useRef, useState } from "react";
import { useContent } from "@/content/language";
import { prefersReducedMotion } from "@/lib/utils";

const LOGO_START = 5;
const LOGO_END = 8;

/**
 * Hero background — original loop, with the logo in place of the video from 5s to 8s.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const showingLogo = useRef(false);
  const [showLogo, setShowLogo] = useState(false);
  const [logoCycle, setLogoCycle] = useState(0);
  const { src, poster, logo } = useContent().media;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (prefersReducedMotion()) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    video.muted = true;

    const onTime = () => {
      const inWindow = video.currentTime >= LOGO_START && video.currentTime < LOGO_END;
      if (inWindow && !showingLogo.current) {
        showingLogo.current = true;
        setLogoCycle((cycle) => cycle + 1);
        setShowLogo(true);
      } else if (!inWindow && showingLogo.current) {
        showingLogo.current = false;
        setShowLogo(false);
      }
    };

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("seeked", onTime);
    void video.play().catch(() => {});

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("seeked", onTime);
    };
  }, []);

  return (
    <div
      data-component="hero-video"
      className="absolute inset-0 z-0 overflow-hidden bg-background"
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          showLogo ? "opacity-0" : "opacity-100"
        }`}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />

      <div
        className={`absolute inset-0 flex items-center justify-center bg-[#07080a] transition-opacity duration-500 ${
          showLogo ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {showLogo ? (
          <div key={logoCycle} className="hero-logo-anim">
            <img src={logo} alt="" className="h-36 w-auto md:h-48" />
            <svg viewBox="0 0 220 8" className="mx-auto mt-3 h-2 w-40" aria-hidden="true">
              <line
                x1="0"
                y1="4"
                x2="220"
                y2="4"
                stroke="#f0c74f"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="hero-logo-line"
              />
            </svg>
          </div>
        ) : null}
      </div>

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
    </div>
  );
}
