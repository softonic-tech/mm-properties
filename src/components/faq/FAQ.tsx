import { useState } from "react";
import { Image } from "@/components/ui/Image";
import { FusedCtaButton } from "@/components/ui/FusedCtaButton";
import { Reveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useContent } from "@/content/language";

/**
 * FAQ — accordion list + large atmospheric image (reference layout).
 */
export function FAQ() {
  const {
    index,
    eyebrow,
    title,
    subtitle,
    cta,
    ctaHref,
    footerNote,
    image,
    imageAlt,
    items,
  } = useContent().faq;

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      data-section="faq"
      className="relative z-20 overflow-hidden border-t border-white/[0.06] bg-background py-20 md:py-24 lg:py-28"
      aria-labelledby="faq-title"
    >
      <div className="page-container">
        <Reveal>
          {/* Top: title + CTA */}
          <div data-motion className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <SectionEyebrow index={index} label={eyebrow} />
              <h2
                id="faq-title"
                className="mt-4 text-[clamp(1.85rem,3.2vw,2.85rem)] font-medium leading-[1.15] tracking-[-0.02em] text-foreground"
              >
                {title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
                {subtitle}
              </p>
            </div>

            <FusedCtaButton
              href={ctaHref}
              label={cta}
              className="shrink-0 self-start md:self-auto"
            />
          </div>
        </Reveal>

          {/* Body: accordion | image */}
          <div className="mt-12 grid grid-cols-1 items-stretch gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-6" stagger={0.08}>
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {items.map((item, i) => {
                  const open = openIndex === i;
                  const num = String(i + 1).padStart(2, "0");

                  return (
                    <li key={item.question} data-motion>
                      <button
                        type="button"
                        onClick={() => setOpenIndex(open ? -1 : i)}
                        className="flex w-full items-start gap-4 py-5 text-left md:gap-6 md:py-6"
                        aria-expanded={open}
                      >
                        <span className="mt-1 w-6 shrink-0 text-[13px] tabular-nums tracking-wide text-electric-soft">
                          {num}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-4">
                            <span className="text-[17px] leading-snug text-foreground">
                              {item.question}
                            </span>
                            <span
                              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-sm leading-none text-foreground-muted"
                              aria-hidden="true"
                            >
                              {open ? "−" : "+"}
                            </span>
                          </span>
                          <span
                            className={[
                              "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                            ].join(" ")}
                          >
                            <span className="overflow-hidden">
                              <span className="mt-3 block text-sm leading-relaxed text-foreground-muted">
                                {item.answer}
                              </span>
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <Reveal className="h-full lg:col-span-6">
              <div data-motion="scale" className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 md:aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[28rem]">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent" />
              </div>
            </Reveal>
          </div>

          {/* Footer meta */}
          <Reveal className="mt-12 border-t border-white/5 pt-6 md:mt-16">
            <p className="text-right text-[10px] tracking-[0.22em] text-foreground-subtle uppercase">
              {footerNote}
            </p>
          </Reveal>
      </div>
    </section>
  );
}
