import { useEffect, useState } from "react";
import { FusedCtaButton } from "@/components/ui/FusedCtaButton";
import { LOCALES, localeName, useContent, useLocale } from "@/content/language";
import { usePathname } from "@/lib/router";

export function Header({ solid = false }: { solid?: boolean }) {
  const content = useContent();
  const { locale, setLocale } = useLocale();
  const path = usePathname();
  const { brand, nav } = content;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const current = (href: string) => path === href || (href !== "/" && path.startsWith(`${href}/`));

  return (
    <header
      data-hero="header"
      className={
        solid
          ? "relative z-50 lg:sticky lg:top-0 lg:bg-background/40 lg:backdrop-blur-md"
          : "absolute inset-x-0 top-0 z-50"
      }
      aria-label="Primary navigation"
    >
      <div className="page-container grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-5 md:py-6">
        <a href="/" data-hero="logo" className="flex items-center" onClick={() => setOpen(false)}>
          <img
            src="/mm-property-logo.png?v=3"
            alt={brand.name}
            className="h-14 w-auto md:h-20"
          />
        </a>

        <nav
          className="hidden items-center justify-center gap-3 lg:flex"
          aria-label="Main"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              data-hero="nav-item"
              href={item.href}
              aria-current={current(item.href) ? "page" : undefined}
              className={
                current(item.href)
                  ? "rounded-full border border-white/40 bg-white/20 px-5 py-2 text-[13px] font-medium tracking-[0.04em] text-white backdrop-blur-md"
                  : "rounded-full border border-white/20 bg-white/10 px-5 py-2 text-[13px] font-medium tracking-[0.04em] text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/20"
              }
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="col-start-3 flex items-center gap-2 sm:gap-3">
          <div className="flex max-w-[14rem] flex-wrap items-center justify-end rounded-full border border-white/25 bg-white/10 p-0.5 text-[10px] tracking-[0.12em] text-white/80 backdrop-blur-md sm:max-w-none sm:text-[11px]">
            {LOCALES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`rounded-full px-1.5 py-1 uppercase sm:px-2.5 ${
                  locale === code ? "bg-white/25 text-white" : "text-white/75"
                }`}
                aria-pressed={locale === code}
                aria-label={localeName(code)}
              >
                {code}
              </button>
            ))}
          </div>
          <FusedCtaButton
            href={brand.phoneHref}
            label={brand.phone}
            dataAttr="header-cta"
            className="hidden md:block"
          />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-0.5 w-full rounded-full bg-white transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute top-1.5 left-0 h-0.5 w-full rounded-full bg-white transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 h-0.5 w-full rounded-full bg-white transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <nav
        className={`absolute inset-x-0 top-full grid max-h-[calc(100svh-5.5rem)] overflow-y-auto px-5 pt-3 transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
        aria-label="Mobile"
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div
            className={`flex flex-col gap-1 rounded-2xl border border-white/15 bg-white/10 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-transform duration-300 ease-out ${
              open ? "translate-y-0" : "-translate-y-2"
            }`}
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={current(item.href) ? "page" : undefined}
                className={`flex h-11 items-center rounded-lg px-3 text-[15px] font-medium text-white ${
                  current(item.href) ? "bg-white/15" : "hover:bg-white/10"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-wrap gap-1 px-2 pt-2">
              {LOCALES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setLocale(code);
                    setOpen(false);
                  }}
                  className={`rounded-full px-3 py-1.5 text-[12px] tracking-[0.08em] ${
                    locale === code ? "bg-white/20 text-white" : "text-white/75 hover:bg-white/10"
                  }`}
                  aria-pressed={locale === code}
                >
                  {localeName(code)}
                </button>
              ))}
            </div>
            <div className="flex justify-center pt-1">
              <FusedCtaButton href={brand.phoneHref} label={brand.phone} />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
