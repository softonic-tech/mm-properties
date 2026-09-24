import { useEffect, useState } from "react";
import { Image } from "@/components/ui/Image";
import { useContent } from "@/content/language";
import type { SiteContent } from "@/content";

/** Previous larger frame sizes */
const CENTER = { w: 300, h: 430 };
const SIDE = { w: 210, h: 250 };
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
        <h3 className="text-sm leading-snug tracking-tight text-foreground md:truncate md:text-xs">
          {current.title}
        </h3>
        <span className="text-[12px] tracking-wide text-foreground-subtle md:shrink-0 md:text-[10px]">
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
          <h3 className="text-sm leading-snug tracking-tight text-foreground md:truncate md:text-xs">
            {incoming.title}
          </h3>
          <span className="text-[12px] tracking-wide text-foreground-subtle md:shrink-0 md:text-[10px]">
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
      className="relative z-20 overflow-hidden bg-background py-14 md:py-16 lg:py-20"
      aria-labelledby="listings-title"
    >
      {/* Label + headline on the same line */}
      <div className="page-container relative z-10">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-baseline md:gap-6">
          <h2
            id="listings-title"
            className="max-w-xl pr-16 text-left text-[clamp(1.35rem,5vw,1.85rem)] font-medium leading-[1.3] tracking-[-0.02em] text-balance text-foreground md:pr-0"
          >
            {listings.title}
          </h2>
        </div>
      </div>

      <div className="page-container relative z-10 mt-6 md:mt-7">
        <div
          className="flex items-end justify-start overflow-hidden"
          style={{ gap: GAP }}
        >
          {SLOTS.map((slot) => {
            const item = at(slot.offset);
            const isCenter = slot.size === "center";
            const frame = isCenter ? CENTER : SIDE;

            return (
              <article
                key={slot.offset}
                className={isCenter ? "w-full shrink-0 md:w-[300px]" : "hidden shrink-0 md:block"}
                style={isCenter ? undefined : { width: frame.w }}
                aria-current={isCenter ? "true" : undefined}
              >
                <div
                  className={
                    isCenter
                      ? "relative aspect-[3/4] w-full overflow-hidden rounded-2xl md:aspect-auto md:h-[430px]"
                      : "relative overflow-hidden rounded-2xl"
                  }
                  style={isCenter ? undefined : { width: frame.w, height: frame.h }}
                >
                  <a href={item.href} target="_blank" rel="noreferrer" className="absolute inset-0" aria-label={item.title}>
                    <SlotMedia item={item} />
                  </a>
                </div>
                <SlotCaption item={item} />
              </article>
            );
          })}
        </div>
      </div>

      <div className="page-container relative z-10 mt-8 flex items-end justify-between gap-6">
        <p className="max-w-xs text-sm leading-relaxed text-foreground-muted">
          {listings.description}
        </p>

        <div className="flex shrink-0 items-center gap-3">
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
      </div>
    </section>
  );
}
