import { Image } from "@/components/ui/Image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useContent } from "@/content/language";
import type { SiteContent } from "@/content";

type Testimonial = SiteContent["testimonials"]["items"][number];

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article
      className="w-full rounded-2xl border border-white/12 p-5"
      style={{
        background:
          "linear-gradient(160deg, rgba(16,20,24,0.96) 0%, rgba(10,12,14,0.94) 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.07), 0 12px 32px rgba(0,0,0,0.35)",
      }}
    >
      <p className="text-[10px] tracking-[0.18em] text-electric-soft uppercase">
        {item.role}
      </p>
      <h3 className="mt-2 font-serif text-xl leading-tight text-foreground">
        {item.name}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{item.quote}</p>
    </article>
  );
}

function MarqueeColumn({
  items,
  duration,
}: {
  items: readonly Testimonial[];
  duration: number;
}) {
  const loop = [...items, ...items];

  return (
    <div className="relative h-[22rem] overflow-hidden md:h-[36rem]">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-[#07080a] to-transparent md:h-16" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-[#07080a] to-transparent md:h-16" />

      <div
        className="testimonials-marquee flex flex-col gap-4"
        style={
          {
            ["--marquee-duration" as string]: `${duration}s`,
          } as React.CSSProperties
        }
      >
        {loop.map((item, i) => (
          <TestimonialCard key={`${item.id}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

/**
 * Testimonials — center copy + photo; left/right columns scroll upward.
 */
export function TestimonialsSection() {
  const { testimonials } = useContent();

  const leftItems = testimonials.items.filter((_, i) => i % 2 === 0);
  const rightItems = testimonials.items.filter((_, i) => i % 2 === 1);

  return (
    <section
      id="testimonials"
      data-section="testimonials"
      className="relative z-20 overflow-hidden border-t border-white/[0.06] bg-background py-20 md:py-24 lg:py-28"
      aria-labelledby="testimonials-title"
    >
      <div className="page-container relative z-10">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
            <div data-motion className="hidden lg:col-span-3 lg:block">
              <MarqueeColumn items={leftItems} duration={42} />
            </div>

            <div data-motion className="flex flex-col items-center text-center lg:col-span-6">
              <SectionEyebrow index={testimonials.index} label={testimonials.eyebrow} />
              <h2
                id="testimonials-title"
                className="mt-4 max-w-md text-[clamp(1.85rem,3.2vw,2.85rem)] font-medium leading-[1.15] tracking-[-0.02em] text-foreground"
              >
                {testimonials.titleBefore}{" "}
                <span className="font-serif text-electric">
                  {testimonials.titleItalic}
                </span>
              </h2>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-foreground-muted">
                {testimonials.description}
              </p>

              <div className="relative mt-8 aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl ring-1 ring-white/10">
                <Image
                  src={testimonials.image}
                  alt={testimonials.imageAlt}
                  fill
                  sizes="(max-width: 768px) 90vw, 420px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080a]/40 via-transparent to-transparent" />
              </div>

              <div className="mt-6 w-full lg:hidden">
                <MarqueeColumn items={testimonials.items} duration={48} />
              </div>
            </div>

            <div data-motion className="hidden lg:col-span-3 lg:block">
              <MarqueeColumn items={rightItems} duration={48} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
