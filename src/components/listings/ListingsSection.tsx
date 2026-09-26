import { useEffect, useState } from "react";
import { Image } from "@/components/ui/Image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useContent } from "@/content/language";
import type { SiteContent } from "@/content";

const GAP = 18;

/**
 * Slot layout (left → right):
 *   [side] [TALL] [side] [side] [side]
 */
const SLOTS = [
  { offset: -1, size: "side" as const },
  { offset: 0, size: "center" as const },
  { offset: 1, size: "side" as const },
  { offset: 2, size: "side" as const },
  { offset: 3, size: "side" as const },
];

type ListingItem = SiteContent["listings"]["items"][number];

function SlotMedia({ item }: { item: ListingItem }) {
  const [current, setCurrent] = useState(item);
  const [incoming, setIncoming] = useState<ListingItem | null>(null);

  useEffect(() => {
    if (item.id === current.id && item.title === current.title && item.image === current.image) return;
    if (item.id === current.id) {
      setCurrent(item);
      setIncoming(null);
      return;
    }
    setIncoming(item);
  }, [item, current.id, current.title, current.image]);

  return (
    <div className="absolute inset-0">
      <Image
        src={current.image}
        alt={current.title}
        fill
        sizes="300px"
        className="object-cover"
      />
      {incoming ? (
        <Image
          key={incoming.id}
          src={incoming.image}
          alt={incoming.title}
          fill
          sizes="300px"
          className="object-cover listing-crossfade"
          onAnimationEnd={() => {
            setCurrent(incoming);
            setIncoming(null);
          }}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07080a]/55 via-transparent to-transparent" />
    </div>
  );
}

function SlotCaption({ item }: { item: ListingItem }) {
  const [current, setCurrent] = useState(item);
  const [incoming, setIncoming] = useState<ListingItem | null>(null);

  useEffect(() => {
    if (item.id === current.id && item.title === current.title && item.image === current.image) return;
    if (item.id === current.id) {
      setCurrent(item);
      setIncoming(null);
      return;
    }
    setIncoming(item);
  }, [item, current.id, current.title, current.image]);

  return (
    <div className="relative mt-3 min-h-[2.6rem] md:mt-2.5 md:min-h-[2rem]">
      {/* Current caption stays visible — never drops to blank */}
      <div className="flex flex-col gap-0.5 md:flex-row md:items-baseline md:justify-between md:gap-2">
        <h3 className="font-serif text-[15px] leading-snug tracking-tight text-foreground md:truncate md:text-sm">
          {current.title}
        </h3>
        <span className="text-[12px] tracking-wide text-foreground-subtle tabular-nums md:shrink-0 md:text-[11px]">
          {current.meta}
        </span>
      </div>

      {/* New caption fades in on top, then becomes current */}
      {incoming ? (
        <div
          className="absolute inset-0 flex flex-col gap-0.5 listing-crossfade md:flex-row md:items-baseline md:justify-between md:gap-2"
          style={{ background: "#07080a" }}
          onAnimationEnd={() => {
            setCurrent(incoming);
            setIncoming(null);
          }}
        >
          <h3 className="font-serif text-[15px] leading-snug tracking-tight text-foreground md:truncate md:text-sm">
            {incoming.title}
          </h3>
          <span className="text-[12px] tracking-wide text-foreground-subtle tabular-nums md:shrink-0 md:text-[11px]">
            {incoming.meta}
          </span>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Listings — large fixed frames; tall = 2nd slot; header on one row.
 */
export function ListingsSection() {
  const { listings } = useContent();
  const items = listings.items;
  const n = items.length;
  const [active, setActive] = useState(1);

  const at = (offset: number) => items[(active + offset + n * 10) % n];

  const prev = () => setActive((i) => (i - 1 + n) % n);
  const next = () => setActive((i) => (i + 1) % n);

  return (
    <section
      id="listings"
      data-section="listings"
      className="relative z-20 overflow-hidden border-t border-white/[0.06] bg-background py-20 md:py-24 lg:py-28"
      aria-labelledby="listings-title"
    >
      {/* Label + headline on the same line */}
      <Reveal className="page-container relative z-10">
        <div className="flex flex-col items-start gap-4">
          <SectionEyebrow index={listings.index} label={listings.eyebrow} />
          <h2
            id="listings-title"
            className="max-w-2xl text-left text-[clamp(1.85rem,3.2vw,2.85rem)] font-medium leading-[1.15] tracking-[-0.02em] text-balance text-foreground"
          >
            {listings.title}
          </h2>
        </div>
      </Reveal>

      <div className="page-container relative z-10 mt-10 md:mt-12">
        <Reveal
          className="flex items-end justify-center"
          style={{ gap: GAP }}
          stagger={0.08}
        >
          {SLOTS.map((slot) => {
            const item = at(slot.offset);
            const isCenter = slot.size === "center";

            return (
              <article
                key={slot.offset}
                data-motion
                className={
                  isCenter
                    ? "w-full shrink-0 md:w-[280px] xl:w-[300px]"
                    : Math.abs(slot.offset) === 1
                      ? "hidden w-[160px] shrink-0 md:block lg:w-[190px] min-[1320px]:w-[210px]"
                      : "hidden w-[210px] shrink-0 min-[1320px]:block"
                }
                aria-current={isCenter ? "true" : undefined}
              >
                <div
                  className={
                    isCenter
                      ? "relative aspect-[3/4] w-full overflow-hidden rounded-2xl ring-1 ring-white/10 md:aspect-auto md:h-[430px]"
                      : "relative h-[220px] overflow-hidden rounded-2xl ring-1 ring-white/10 lg:h-[250px]"
                  }
                >
                  <a href={item.href} target="_blank" rel="noreferrer" className="absolute inset-0" aria-label={item.title}>
                    <SlotMedia item={item} />
                  </a>
                </div>
                <SlotCaption item={item} />
              </article>
            );
          })}
        </Reveal>
      </div>

      <Reveal className="page-container relative z-10 mt-8 flex items-end justify-between gap-6">
        <p data-motion className="max-w-xs text-[15px] leading-relaxed text-foreground-muted">
          {listings.description}
        </p>

        <div data-motion className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous property"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-foreground transition-colors duration-200 hover:border-electric/40 hover:text-electric"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next property"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-foreground transition-colors duration-200 hover:border-electric/40 hover:text-electric"
          >
            ›
          </button>
        </div>
      </Reveal>
    </section>
  );
}
