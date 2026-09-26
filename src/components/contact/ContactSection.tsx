import { FusedCtaButton } from "@/components/ui/FusedCtaButton";
import { Reveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useContent } from "@/content/language";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.2l.8-3H13V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 11v5M8 8v.01M12 16v-5c1.5 0 3 1 3 3v2" />
    </svg>
  );
}

const socialIcons: Record<
  string,
  (props: { className?: string }) => React.JSX.Element
> = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  LinkedIn: LinkedInIcon,
};

/**
 * Contact — large dual-tone headline + fused CTA inline in the line + socials/footer.
 */
export function ContactSection() {
  const content = useContent();
  const {
    index,
    eyebrow,
    tagline,
    line1Light,
    line1Muted,
    line2Before,
    line2After,
    cta,
    ctaHref,
    body,
    email,
    socials,
    chips,
    footerNav,
    footerNote,
  } = content.contact;

  return (
    <section
      id="contact"
      data-section="contact"
      className="relative z-20 overflow-hidden border-t border-white/[0.06] bg-background pt-20 pb-24 md:pt-28 md:pb-14"
      aria-labelledby="contact-title"
    >
      <div className="page-container relative z-10">
        <Reveal>
          {/* Meta row */}
          <div data-motion className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SectionEyebrow index={index} label={eyebrow} />
            <p className="text-[11px] tracking-[0.18em] text-foreground-subtle uppercase">
              {tagline}
            </p>
          </div>

          {/* Headline + body — two lines: title, then value [cta] with us */}
          <div data-motion className="mt-10 flex flex-col gap-10 md:mt-14 md:flex-row md:items-end md:justify-between md:gap-12 lg:gap-16">
            <h2
              id="contact-title"
              className="min-w-0 flex-1 text-[clamp(1.85rem,5.5vw,4.75rem)] font-medium leading-[1.08] tracking-[-0.035em]"
            >
              <span className="block md:whitespace-nowrap">
                <span className="text-foreground">{line1Light} </span>
                <span className="font-serif text-electric">{line1Muted}</span>
              </span>

              <span className="mt-1 flex flex-wrap items-center gap-x-[0.28em] gap-y-2 md:mt-2 md:flex-nowrap md:whitespace-nowrap">
                <span className="text-foreground-muted">{line2Before}</span>
                <FusedCtaButton href={ctaHref} label={cta} inline />
                <span className="text-foreground">{line2After}</span>
              </span>
            </h2>

            <p className="max-w-70 shrink-0 text-[15px] leading-relaxed text-foreground-muted md:pb-1.5 md:text-right md:text-[13px]">
              {body}
            </p>
          </div>

          {/* Chips + socials */}
          <div data-motion className="mt-14 flex flex-col gap-8 md:mt-20 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/18 px-3.5 py-1.5 text-[11px] tracking-wide text-foreground-muted"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-10">
                {socials.map((s) => {
                  const Icon = socialIcons[s.label];
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      className="group inline-flex items-center gap-2.5 text-sm text-foreground transition-colors hover:text-warm"
                    >
                      {Icon ? (
                        <Icon className="size-4 text-foreground-muted transition-colors group-hover:text-warm" />
                      ) : null}
                      <span className="tracking-wide">{s.handle}</span>
                    </a>
                  );
                })}
              </div>

              <a
                href={`mailto:${email}`}
                className="mt-5 inline-block text-sm text-electric transition-colors hover:text-warm"
              >
                {email}
              </a>
            </div>
          </div>
        </Reveal>

          {/* Footer bar */}
          <Reveal className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 md:mt-20 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <img
                src="/mm-property-logo.png?v=3"
                alt={content.brand.name}
                className="h-16 w-auto md:h-20"
              />
            </div>

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
              <p className="text-[11px] tracking-wide text-foreground-subtle">
                {footerNote}
              </p>
              <p className="mt-1 max-w-sm text-[10px] leading-snug text-foreground-subtle/80 md:ml-auto">
                {content.contact.photoCredit}
              </p>
            </div>
          </Reveal>
      </div>
    </section>
  );
}
