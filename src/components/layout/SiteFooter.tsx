import { FacebookMark, InstagramMark } from "@/components/layout/SocialMarks";
import { useContent } from "@/content/language";

export function SiteFooter() {
  const content = useContent();
  const { footerNav, footerNote, photoCredit, socials } = content.contact;
  const networks = socials.filter((item) => item.label === "Instagram" || item.label === "Facebook");

  return (
    <footer className="border-t border-white/10 bg-background">
      <div className="page-container flex flex-col gap-8 py-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <a href="/" className="flex items-center">
            <img src="/mm-property-logo.png?v=3" alt={content.brand.name} className="h-16 w-auto md:h-20" />
          </a>

          <div className="flex flex-wrap items-center gap-3">
            {networks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pr-5 pl-1.5 text-white transition-transform hover:scale-[1.03]"
              >
                {item.label === "Instagram" ? (
                  <InstagramMark className="size-14" />
                ) : (
                  <FacebookMark className="size-14" />
                )}
                <span className="text-[15px] font-medium tracking-wide">{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            {footerNav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[12px] text-foreground-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="md:text-right">
            <a href={content.brand.phoneHref} className="text-sm text-foreground transition-colors hover:text-warm">
              {content.brand.phone}
            </a>
            <p className="mt-1 text-[11px] tracking-wide text-foreground-subtle">{footerNote}</p>
            <p className="mt-1 max-w-sm text-[10px] leading-snug text-foreground-subtle/80 md:ml-auto">{photoCredit}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
