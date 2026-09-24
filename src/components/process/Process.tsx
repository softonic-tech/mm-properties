import { Image } from "@/components/ui/Image";
import { useContent } from "@/content/language";

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
    "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(215,168,102,0.06) 40%, rgba(255,255,255,0.03) 100%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.28), inset 1px 0 0 rgba(215,168,102,0.15), 0 12px 40px rgba(0,0,0,0.35)",
} as const;

/**
 * How it works — sticky photo + staggered glass steps.
 * Warm orbs sit behind the glass so frost picks up amber light.
 */
export function Process() {
  const { processSection, process } = useContent();

  return (
    <section
      id="process"
      data-section="process"
      className="relative z-20 min-h-[130svh]"
      aria-labelledby="process-title"
    >
      <div
        className="sticky top-0 h-svh w-full overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src={processSection.background}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_28%]"
          priority={false}
        />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="page-container relative z-10 -mt-[100svh] flex min-h-[130svh] flex-col justify-center py-14 md:py-16 lg:py-20">
        <header className="mb-5 md:mb-6">
          <h2
            id="process-title"
            className="mt-2 text-[clamp(2rem,4vw,3.25rem)] font-medium tracking-[-0.02em] text-white"
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
                    "radial-gradient(circle, rgba(215,168,102,0.45) 0%, rgba(215,168,102,0.12) 45%, transparent 70%)",
                }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-2 right-8 h-16 w-24 rounded-full blur-xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(215,168,102,0.28) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />

              <div className="relative z-[1]">
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className="rounded-full border border-electric/30 px-3 py-[5px] text-[10px] tracking-[0.18em] text-electric/90 uppercase backdrop-blur-md"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(114,215,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
                    }}
                  >
                    {step.tag}
                  </span>
                  <span
                    className="h-px max-w-[3.5rem] flex-1 bg-gradient-to-r from-electric-soft/50 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="text-[10px] tracking-[0.2em] text-[#d7a866]/80">
                    {step.number}
                  </span>
                </div>

                <div
                  className="rounded-2xl border border-white/20 px-5 py-6 backdrop-blur-[14px] transition-colors duration-300 hover:border-[#d7a866]/30 md:min-h-[11rem]"
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
      </div>
    </section>
  );
}
