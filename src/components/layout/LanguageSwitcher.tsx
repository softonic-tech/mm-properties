import { useEffect, useId, useRef, useState } from "react";
import { LOCALES, localeLabel, useLocale, type Locale } from "@/content/language";

function Flag({ locale }: { locale: Locale }) {
  const clipId = useId();
  return (
    <span
      className="relative inline-block h-3.5 w-5 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.25)]"
      aria-hidden="true"
    >
      {locale === "es" ? (
        <svg viewBox="0 0 24 16" className="h-full w-full">
          <rect width="24" height="16" fill="#c60b1e" />
          <rect y="4" width="24" height="8" fill="#ffc400" />
        </svg>
      ) : locale === "nl" ? (
        <svg viewBox="0 0 24 16" className="h-full w-full">
          <rect width="24" height="16" fill="#21468b" />
          <rect width="24" height="10.67" fill="#fff" />
          <rect width="24" height="5.33" fill="#ae1c28" />
        </svg>
      ) : locale === "sv" ? (
        <svg viewBox="0 0 24 16" className="h-full w-full">
          <rect width="24" height="16" fill="#006aa7" />
          <rect x="7" width="4" height="16" fill="#fecc00" />
          <rect y="6" width="24" height="4" fill="#fecc00" />
        </svg>
      ) : locale === "de" ? (
        <svg viewBox="0 0 24 16" className="h-full w-full">
          <rect width="24" height="16" fill="#ffce00" />
          <rect width="24" height="10.67" fill="#dd0000" />
          <rect width="24" height="5.33" fill="#000" />
        </svg>
      ) : (
        <svg viewBox="0 0 60 30" className="h-full w-full">
          <defs>
            <clipPath id={clipId}>
              <rect width="60" height="30" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <rect width="60" height="30" fill="#012169" />
            <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6" />
            <path d="M0 0 L60 30 M60 0 L0 30" stroke="#c8102e" strokeWidth="2" />
            <path d="M30 0 V30 M0 15 H60" stroke="#fff" strokeWidth="10" />
            <path d="M30 0 V30 M0 15 H60" stroke="#c8102e" strokeWidth="6" />
          </g>
        </svg>
      )}
    </span>
  );
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 py-1.5 pl-2.5 pr-2 text-[12px] font-medium tracking-[0.04em] text-white backdrop-blur-md"
        aria-label={`Language: ${localeLabel(locale)}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Flag locale={locale} />
        <span className="uppercase">{locale}</span>
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 text-white/80 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path fill="currentColor" d="M2.3 4.2 6 7.8l3.7-3.6.8.8L6 9.4 1.5 5z" />
        </svg>
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 z-50 mt-2 min-w-[11.5rem] rounded-xl border border-white/15 bg-[#14161a]/95 p-1 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          {LOCALES.map((code) => {
            const selected = code === locale;
            return (
              <li key={code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] ${
                    selected ? "bg-white/15 text-white" : "text-white/85 hover:bg-white/10"
                  }`}
                  onClick={() => {
                    setLocale(code);
                    setOpen(false);
                  }}
                >
                  <Flag locale={code} />
                  <span className="flex-1">{localeLabel(code)}</span>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-white/45">{code}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
