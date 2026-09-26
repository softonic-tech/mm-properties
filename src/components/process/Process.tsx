import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Image } from "@/components/ui/Image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useContent } from "@/content/language";
import { gsap, registerGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

/** Vertical stagger: top / bottom / top */
const staggerClass = [
  "md:translate-y-0",
  "md:translate-y-10 lg:translate-y-14",
  "md:translate-y-0",
] as const;

/** Warm glow blobs behind each glass card */
const warmOrbClass = [
  "-left-6 top-8 h-36 w-36",
  "left-1/2 top-16 h-40 w-40 -translate-x-1/2",
  "-right-6 top-8 h-36 w-36",
] as const;

const glassStyle = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(215,222,230,0.06) 42%, rgba(255,255,255,0.03) 100%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.28), inset 1px 0 0 rgba(215,222,230,0.12), 0 16px 40px rgba(0,0,0,0.32)",
} as const;

/**
 * How it works — sticky photo + staggered glass steps.
 * Warm orbs sit behind the glass so frost picks up amber light.
 */
export function Process() {
  const { processSection, process } = useContent();
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  registerGsap();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const photo = photoRef.current;
      if (!section || !photo || prefersReducedMotion()) return;

      gsap.fromTo(
        photo,
        { scale: 1.08 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      data-section="process"
      className="relative z-20 min-h-[130svh]"
      aria-labelledby="process-title"
    >
      <div
        className="sticky top-0 h-svh w-full overflow-hidden"
        aria-hidden="true"
      >
        <div ref={photoRef} className="absolute inset-0">
        <Image
          src={processSection.background}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
        </div>
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <Reveal className="page-container relative z-10 -mt-[100svh] flex min-h-[130svh] flex-col justify-center py-14 md:py-16 lg:py-20" stagger={0.14}>
        <header data-motion className="mb-8 md:mb-10">
          <SectionEyebrow index={processSection.index} label={processSection.eyebrow} light />
          <h2
            id="process-title"
            className="mt-4 text-[clamp(2rem,4vw,3.15rem)] leading-[1.12] font-medium tracking-[-0.02em] text-white"
          >
            {processSection.title}
          </h2>
        </header>

        <ol className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {process.map((step, i) => (
            <li
              key={step.number}
              className={["relative", staggerClass[i] ?? ""].join(" ")}
            >
              <div
                className={[
                  "pointer-events-none absolute rounded-full blur-2xl",
                  warmOrbClass[i] ?? warmOrbClass[0],
                ].join(" ")}
                style={{
                  background:
                    "radial-gradient(circle, rgba(215,222,230,0.28) 0%, rgba(215,222,230,0.08) 45%, transparent 70%)",
                }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-2 right-8 h-16 w-24 rounded-full blur-xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(215,222,230,0.18) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />

              <div data-motion className="relative z-[1]">
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className="rounded-full border border-white/25 px-3 py-[5px] text-[10px] tracking-[0.18em] text-white/90 uppercase backdrop-blur-md"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(114,215,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
                    }}
                  >
                    {step.tag}
                  </span>
                  <span
                    className="h-px max-w-[3.5rem] flex-1 bg-gradient-to-r from-white/40 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="text-[10px] tracking-[0.2em] text-white/55 tabular-nums">
                    {step.number}
                  </span>
                </div>

                <div
                  className="rounded-2xl border border-white/20 px-5 py-6 backdrop-blur-[14px] transition-colors duration-300 hover:border-white/40 md:min-h-[12.5rem]"
                  style={glassStyle}
                >
                  <h3 className="text-lg font-medium tracking-tight text-white md:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
