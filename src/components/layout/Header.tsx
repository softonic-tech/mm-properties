import { useState } from "react";
import { FusedCtaButton } from "@/components/ui/FusedCtaButton";
import { useContent, useLocale } from "@/content/language";

export function Header() {
  const content = useContent();
  const { locale, setLocale } = useLocale();
  const { brand, nav, experience } = content;
  const [open, setOpen] = useState(false);

  return (
    <header
      data-hero="header"
      className="absolute inset-x-0 top-0 z-50 px-5 py-5 md:px-10 md:py-6"
      aria-label="Primary navigation"
    >
      <div className="flex items-center justify-between">
        <div data-hero="logo" className="flex items-center">
          <img
            src="/mm-property-logo.png?v=3"
            alt={brand.name}
            className="h-14 w-auto md:h-20"
          />
        </div>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 md:flex"
          aria-label="Main"
        >
          {nav.map((item, i) => (
            <a
              key={item.href}
              data-hero="nav-item"
              href={item.href}
              className={
                i === 0
                  ? "rounded-full bg-white px-4 py-[7px] text-[12px] tracking-[0.08em] text-black shadow-[0_2px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:bg-white/90"
                  : "rounded-full border border-white/18 bg-white/[0.07] px-4 py-[7px] text-[12px] tracking-[0.08em] text-white/85 backdrop-blur-[6px] transition-all duration-200 hover:border-white/30 hover:bg-white/[0.12] hover:text-white"
              }
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-white/20 bg-black/35 p-0.5 text-[11px] tracking-[0.12em] text-white/80">
            {(["en", "es"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`rounded-full px-2.5 py-1 uppercase ${
                  locale === code ? "bg-white text-black" : "text-white/75"
                }`}
                aria-pressed={locale === code}
              >
                {code}
              </button>
            ))}
          </div>
          <FusedCtaButton
            href="#experience"
            label={experience.cta}
            dataAttr="header-cta"
            className="hidden md:block"
          />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition-colors duration-300 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-px w-full bg-white transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute top-1.5 left-0 h-px w-full bg-white transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 h-px w-full bg-white transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <nav
        className={`absolute inset-x-0 top-[calc(100%-4px)] grid px-5 transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
        aria-label="Mobile"
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div
            className={`overflow-hidden rounded-2xl border border-white/15 bg-[#07080a]/88 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-transform duration-300 ease-out ${
              open ? "translate-y-0" : "-translate-y-2"
            }`}
          >
            {nav.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className="flex h-12 items-center justify-between border-b border-white/10 px-5 text-[12px] tracking-[0.16em] text-white/90 uppercase"
                onClick={() => setOpen(false)}
              >
                <span className="flex items-center gap-3">
                  <span className={i === 0 ? "h-1 w-1 rounded-full bg-white" : "h-1 w-1 rounded-full bg-white/25"} />
                  {item.label}
                </span>
                <span className="text-white/35">→</span>
              </a>
            ))}
            <a
              href={experience.ctaHref}
              className="flex h-12 items-center justify-center bg-white text-[12px] font-semibold tracking-[0.16em] text-black uppercase"
              onClick={() => setOpen(false)}
            >
              {experience.cta}
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
