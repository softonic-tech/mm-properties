import { Header } from "@/components/layout/Header";
import { HeroVideo } from "@/components/hero/HeroVideo";
import { HeroContent } from "@/components/hero/HeroContent";
import { HeroStats } from "@/components/hero/HeroStats";
import { ScrollIndicator } from "@/components/hero/ScrollIndicator";
import { HeroScene } from "@/components/hero/HeroScene";

/**
 * Full-viewport hero.
 *
 * Bottom-left: copy + CTA
 * Bottom-right: glassy stats + scroll cue
 *
 * Scroll reveal (HeroScene):
 *   pin video → fade/lift UI → darken → Experience covers
 */
export function Hero() {
  return (
    <HeroScene>
      <HeroVideo />

      {/* Darkens during pin scrub — sits above video, below UI */}
      <div
        data-hero="dim"
        className="pointer-events-none absolute inset-0 z-[1] bg-background opacity-0"
        aria-hidden="true"
      />

      {/* All UI fades / lifts together on scroll */}
      <div data-hero="foreground" className="absolute inset-0 z-10">
        <Header />

        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="page-container pointer-events-auto flex items-end justify-between gap-10 pb-20 sm:pb-10 md:pb-12">
            <HeroContent />
            <div className="mb-1 hidden shrink-0 items-end gap-6 sm:flex">
              <HeroStats />
              <ScrollIndicator />
            </div>
          </div>
        </div>
      </div>
    </HeroScene>
  );
}
