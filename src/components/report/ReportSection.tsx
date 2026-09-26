import { useContent } from "@/content/language";
import { FusedCtaButton } from "@/components/ui/FusedCtaButton";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { Reveal } from "@/components/motion/Reveal";

const floaterPosition: Record<string, string> = {
  "left-top": "left-0 top-[6%] md:-left-8 lg:-left-14 xl:-left-16",
  "right-top": "right-0 top-[10%] md:-right-8 lg:-right-12 xl:-right-16",
  "left-bottom": "left-0 bottom-[16%] md:-left-6 lg:-left-12 xl:-left-14",
  "right-bottom": "right-0 bottom-[10%] md:-right-8 lg:-right-14 xl:-right-16",
};

const glassChip = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(186,206,220,0.06) 50%, rgba(255,255,255,0.03) 100%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.25), 0 8px 28px rgba(0,0,0,0.35)",
} as const;

const glassReport = {
  background:
    "linear-gradient(160deg, rgba(13,17,21,0.92) 0%, rgba(20,26,32,0.88) 45%, rgba(7,9,11,0.94) 100%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 0 1px rgba(186,206,220,0.08), 0 24px 80px rgba(0,0,0,0.55)",
} as const;

/**
 * Valuation report — Experience-style 2-column alignment:
 *
 *   Left:  index / title / description / CTA (same vertical axis)
 *   Right: sample report + floating HUD chips
 */
export function ReportSection() {
  const {
    index,
    eyebrow,
    title,
    description,
    sample,
    floaters,
    cta,
    ctaHref,
  } = useContent().report;

  return (
    <section
      id="report"
      data-section="report"
      className="relative z-20 overflow-hidden border-t border-white/[0.06] bg-background md:min-h-svh"
      aria-labelledby="report-title"
    >
      <div className="page-container relative z-10 flex flex-col py-20 md:min-h-svh md:py-24 lg:py-28">
        {/*
          2×2-style split (like Experience):
          Left column = editorial stack + CTA
          Right column = report object
        */}
        <Reveal className="grid min-w-0 flex-1 grid-cols-1 items-stretch gap-8 md:gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ── Left — section copy + CTA ─────────────────── */}
          <div className="contents lg:col-span-5 lg:flex lg:flex-col">
            <div data-motion className="order-1">
              <SectionEyebrow index={index} label={eyebrow} />
              <h2
                id="report-title"
                className="mt-4 max-w-md text-[clamp(1.85rem,3.2vw,2.85rem)] font-medium leading-[1.15] tracking-[-0.02em] text-foreground"
              >
                {title}
              </h2>

              <p className="mt-5 max-w-sm text-[15px] leading-[1.75] text-foreground-muted">
                {description}
              </p>
            </div>

            {/* Same vertical axis as the left copy on desktop; after the card on mobile */}
            <div data-motion className="order-3 pt-2 md:mt-auto md:pt-12 lg:pt-16">
              <FusedCtaButton href={ctaHref} label={cta} />
            </div>
          </div>

          {/* ── Right — report centered in its column (balanced) */}
          <div className="relative order-2 flex min-w-0 items-center justify-center lg:order-none lg:col-span-7">
            <div className="relative w-full min-w-0 max-w-full md:max-w-[22rem]">
              {/* Floating chips — sit outside the lean report */}
              {floaters.map((chip, i) => (
                <div
                  key={chip.label}
                  className={[
                    "pointer-events-none absolute z-20 hidden md:block",
                    floaterPosition[chip.position] ?? "",
                    i % 2 === 0 ? "float-chip-a" : "float-chip-b",
                  ].join(" ")}
                  style={
                    i === 1
                      ? { animationDelay: "0.6s" }
                      : i === 2
                        ? { animationDelay: "1.1s" }
                        : i === 3
                          ? { animationDelay: "0.3s" }
                          : undefined
                  }
                >
                  <div
                    className="rounded-2xl border border-white/20 px-3 py-2 backdrop-blur-xl"
                    style={glassChip}
                  >
                    <p className="text-[8px] tracking-[0.2em] text-electric/80 uppercase">
                      {chip.label}
                    </p>
                    <p className="mt-0.5 text-base font-medium tracking-tight text-foreground">
                      {chip.value}
                    </p>
                  </div>
                </div>
              ))}

              <article
                data-motion="scale"
                className="relative z-10 w-full max-w-full rounded-2xl border border-white/15 px-4 py-6 backdrop-blur-xl md:px-6 md:py-8"
                style={glassReport}
                aria-label="Sample valuation report preview"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] text-electric/85 uppercase">
                      {sample.brand}
                    </p>
                    <p className="mt-1 text-xs text-foreground-muted">
                      {sample.docLabel}
                    </p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-warm/35 bg-warm/10">
                    <span className="text-[10px] tracking-wider text-warm">
                      MM
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-foreground-muted">
                    {sample.propertyType}
                  </p>
                  <p className="mt-1 text-lg text-foreground">
                    {sample.property}
                  </p>
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
                  <p className="text-[10px] tracking-[0.18em] text-foreground-subtle uppercase">
                    {sample.rangeLabel}
                  </p>
                  <p
                    className="mt-2 font-medium tracking-tight text-foreground tabular-nums"
                    style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.1rem)" }}
                  >
                    <span className="text-warm">{sample.rangeLow}</span>
                    {sample.rangeHigh ? (
                      <>
                        <span className="mx-2 text-foreground-subtle">–</span>
                        <span>{sample.rangeHigh}</span>
                      </>
                    ) : null}
                  </p>
                  <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full w-[62%] rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(186,206,220,0.85) 0%, rgba(186,206,220,0.7) 100%)",
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-[10px] tracking-[0.18em] text-electric-soft uppercase">
                    {sample.strengthsLabel}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {sample.strengths.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-foreground-muted"
                      >
                        <span
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-electric"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-relaxed text-foreground-subtle">
                  {sample.limitation}
                </p>
              </article>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
