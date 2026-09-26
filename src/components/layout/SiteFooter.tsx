import { useContent } from "@/content/language";

export function SiteFooter() {
  const content = useContent();
  const { footerNav, footerNote, photoCredit } = content.contact;

  return (
    <footer className="border-t border-white/10 bg-background">
      <div className="page-container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <a href="/" className="flex items-center">
          <img src="/mm-property-logo.png?v=3" alt={content.brand.name} className="h-16 w-auto md:h-20" />
        </a>

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
          <a
            href={content.brand.phoneHref}
            className="text-sm text-foreground transition-colors hover:text-warm"
          >
            {content.brand.phone}
          </a>
          <p className="mt-1 text-[11px] tracking-wide text-foreground-subtle">{footerNote}</p>
          <p className="mt-1 max-w-sm text-[10px] leading-snug text-foreground-subtle/80 md:ml-auto">
            {photoCredit}
          </p>
        </div>
      </div>
    </footer>
  );
}
