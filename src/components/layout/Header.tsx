import { useEffect, useState } from "react";
import { FusedCtaButton } from "@/components/ui/FusedCtaButton";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useContent } from "@/content/language";
import { usePathname } from "@/lib/router";

export function Header({ solid = false }: { solid?: boolean }) {
  const content = useContent();
  const path = usePathname();
  const { brand, nav } = content;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!solid) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  const current = (href: string) => path === href || (href !== "/" && path.startsWith(`${href}/`));

  return (
    <header
      data-hero="header"
      className={
        solid
          ? [
              "relative z-50 border-b border-white/10 bg-background transition-shadow duration-300 lg:sticky lg:top-0",
              scrolled ? "shadow-[0_10px_40px_rgba(0,0,0,0.35)]" : "",
            ].join(" ")
          : "absolute inset-x-0 top-0 z-50"
      }
      aria-label="Primary navigation"
    >
      {solid ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c9a227]/55 to-transparent"
          aria-hidden
        />
      ) : null}

      <div className="page-container grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-4 md:py-5">
        <a
          href="/"
          data-hero="logo"
          className="group flex items-center transition-opacity hover:opacity-90"
          onClick={() => setOpen(false)}
        >
          <img
            src="/mm-property-logo.png?v=3"
            alt={brand.name}
            className="h-12 w-auto md:h-[4.5rem]"
          />
        </a>

        <nav className="hidden items-center justify-center gap-1.5 lg:flex" aria-label="Main">
          {nav.map((item) => {
            const active = current(item.href);
            return (
              <a
                key={item.href}
                data-hero="nav-item"
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "relative rounded-full px-4 py-2 text-[12px] font-medium tracking-[0.08em] uppercase transition-all duration-200",
                  active
                    ? "border border-[#c9a227]/45 bg-[#c9a227]/15 text-white shadow-[inset_0_0_0_1px_rgba(201,162,39,0.12)]"
                    : "border border-transparent text-white/75 hover:border-white/15 hover:bg-white/8 hover:text-white",
                ].join(" ")}
              >
                {item.label}
                {active ? (
                  <span
                    className="absolute inset-x-4 -bottom-[1px] h-px bg-gradient-to-r from-transparent via-[#c9a227] to-transparent lg:bottom-0"
                    aria-hidden
                  />
                ) : null}
              </a>
            );
          })}
        </nav>

        <div className="col-start-3 flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <FusedCtaButton
            href={brand.phoneHref}
            label={brand.phone}
            dataAttr="header-cta"
            className="hidden md:block"
          />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-0.5 w-full rounded-full bg-white transition-transform duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute top-1.5 left-0 h-0.5 w-full rounded-full bg-white transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-full rounded-full bg-white transition-transform duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
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
            className={`flex flex-col gap-1 rounded-2xl border border-white/15 bg-background p-2 shadow-[0_16px_40px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-out ${
              open ? "translate-y-0" : "-translate-y-2"
            }`}
          >
            {nav.map((item) => {
              const active = current(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-11 items-center rounded-lg px-3 text-[15px] font-medium ${
                    active
                      ? "bg-[#c9a227]/18 text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="flex justify-center pt-1">
              <FusedCtaButton href={brand.phoneHref} label={brand.phone} />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
