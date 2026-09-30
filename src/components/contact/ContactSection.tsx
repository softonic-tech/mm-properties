import { SiteFooter } from "@/components/layout/SiteFooter";
import { SocialMark } from "@/components/layout/SocialMarks";
import { FusedCtaButton } from "@/components/ui/FusedCtaButton";
import { Reveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useContent } from "@/content/language";

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

              <div className="mt-8 flex flex-nowrap items-center gap-2.5 overflow-x-auto pb-1">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    title={`${s.label} · ${s.handle}`}
                    className="social-float-item inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition-transform duration-200 hover:scale-110"
                  >
                    <SocialMark label={s.label} className="size-full" />
                  </a>
                ))}
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

      </div>
      <SiteFooter />
    </section>
  );
}
