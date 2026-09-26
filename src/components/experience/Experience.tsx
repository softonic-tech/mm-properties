import { useContent } from "@/content/language";
import { FusedCtaButton } from "@/components/ui/FusedCtaButton";
import { Image } from "@/components/ui/Image";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Agency — editorial split on desktop.
 * Copy on the left. A villa portrait with the Marbella coast set into it on the right.
 */
export function Experience() {
  const { index, eyebrow, headline, body, cta, ctaHref, images } =
    useContent().experience;
  const [villa, coast] = images;

  return (
    <section
      id="experience"
      data-section="experience"
      className="relative border-t border-white/[0.06] bg-background md:z-20"
      aria-labelledby="experience-title"
    >
      <div className="page-container py-20 md:py-24 lg:py-28">
        <Reveal className="grid grid-cols-1 items-center gap-y-10 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-0">
          <div className="contents lg:col-span-7 lg:flex lg:flex-col lg:justify-center">
            <div data-motion className="order-1">
              <SectionEyebrow index={index} label={eyebrow} />
              <h2
                id="experience-title"
                className="mt-5 max-w-xl text-[clamp(1.85rem,2.8vw,2.85rem)] leading-[1.18] tracking-[-0.02em] font-medium"
              >
                {headline.map((line, i) => (
                  <span key={i} className="block">
                    {line.map((part, j) => (
                      <span
                        key={j}
                        className={
                          part.tone === "strong"
                            ? "text-foreground"
                            : "text-foreground-muted"
                        }
                      >
                        {part.text}
                      </span>
                    ))}
                  </span>
                ))}
              </h2>
            </div>

            <div data-motion className="order-3 mt-8 lg:mt-10">
              <p className="max-w-md text-[15px] leading-[1.75] text-foreground-muted">
                {body}
              </p>
              <div className="mt-8">
                <FusedCtaButton href={ctaHref} label={cta} />
              </div>
            </div>
          </div>

          <div data-motion="scale" className="relative order-2 lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 lg:ml-[16%] lg:aspect-[3/4]">
              <Image
                src={villa.src}
                alt={villa.alt}
                fill
                sizes="(max-width: 1024px) 90vw, 28vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-5 pt-16 pb-5">
                <p className="text-[10px] tracking-[0.22em] text-white/70 uppercase">
                  {villa.caption}
                </p>
                <p className="mt-1 font-serif text-xl text-white">{villa.label}</p>
              </div>
            </div>

            <div className="absolute bottom-8 left-0 hidden w-[54%] overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.45)] ring-[6px] ring-background lg:block">
              <div className="relative aspect-[5/4]">
                <Image
                  src={coast.src}
                  alt={coast.alt}
                  fill
                  sizes="18vw"
                  className="object-cover object-[68%_42%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <p className="absolute bottom-3 left-3 text-[10px] tracking-[0.2em] text-white uppercase">
                  {coast.label}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
