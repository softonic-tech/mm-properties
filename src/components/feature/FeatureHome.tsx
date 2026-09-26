import { Image } from "@/components/ui/Image";
import { FusedCtaButton } from "@/components/ui/FusedCtaButton";
import { Reveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useContent } from "@/content/language";

/**
 * One listing, shown large — photo, facts, link to the live page.
 */
export function FeatureHome() {
  const {
    index,
    eyebrow,
    place,
    title,
    text,
    image,
    imageAlt,
    facts,
    cta,
    ctaHref,
  } = useContent().feature;

  return (
    <section
      id="feature"
      data-section="feature"
      className="relative border-t border-white/[0.06] bg-background py-20 md:py-24 lg:py-28"
      aria-labelledby="feature-title"
    >
      <div className="page-container">
        <Reveal className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div data-motion="scale" className="lg:col-span-7">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[1.75rem] ring-1 ring-white/10">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 90vw, 55vw"
                className="object-cover"
              />
            </div>
          </div>

          <div data-motion className="lg:col-span-5">
            <SectionEyebrow index={index} label={eyebrow} />
            <p className="mt-6 text-[11px] tracking-[0.22em] text-electric-soft uppercase">
              {place}
            </p>
            <h2
              id="feature-title"
              className="mt-3 max-w-md text-[clamp(1.85rem,3vw,2.75rem)] leading-[1.15] font-medium tracking-[-0.02em] text-foreground"
            >
              {title}
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-[1.75] text-foreground-muted">
              {text}
            </p>

            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-[10px] tracking-[0.18em] text-foreground-subtle uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 font-serif text-lg text-foreground tabular-nums">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <FusedCtaButton href={ctaHref} label={cta} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
