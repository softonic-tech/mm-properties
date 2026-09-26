import { useRef, useState } from "react";
import { Image } from "@/components/ui/Image";
import { Reveal } from "@/components/motion/Reveal";
import { useContent } from "@/content/language";

function CheckIcon() {
  return (
    <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-foreground text-background">
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" aria-hidden>
        <path
          d="M2.2 6.2 4.7 8.6 9.8 3.4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/**
 * Four ways to search — new build, villas, resale, rent.
 */
export function Paths() {
  const { title, description, items } = useContent().paths;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const syncActive = () => {
    const root = scrollerRef.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>("[data-path-card]")];
    const edge = root.getBoundingClientRect().left;
    let index = 0;
    cards.forEach((card, i) => {
      if (card.getBoundingClientRect().left - edge < root.clientWidth * 0.5) index = i;
    });
    setActive((current) => (current === index ? current : index));
  };

  const showCard = (index: number) => {
    const root = scrollerRef.current;
    const card = root?.querySelectorAll<HTMLElement>("[data-path-card]")[index];
    setActive(index);
    if (!root || !card) return;
    root.scrollTo({ left: card.offsetLeft - root.offsetLeft, behavior: "smooth" });
  };

  return (
    <section
      id="paths"
      data-section="paths"
      className="relative border-t border-white/[0.06] bg-background py-20 md:py-24 lg:py-28"
      aria-labelledby="paths-title"
    >
      <div className="page-container">
        <Reveal>
          <div data-motion className="mx-auto max-w-3xl text-center">
            <h2
              id="paths-title"
              className="text-[clamp(1.85rem,3.2vw,2.85rem)] leading-[1.15] font-medium tracking-[-0.02em] text-foreground"
            >
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-[1.75] text-foreground-muted">
              {description}
            </p>
          </div>

          <div
            ref={scrollerRef}
            onScroll={syncActive}
            className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible lg:mt-16 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item) => (
              <a
                key={item.title}
                data-motion
                data-path-card
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group block w-full shrink-0 snap-start sm:w-auto"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="mt-5 font-serif text-[1.35rem] leading-snug tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                  {item.text}
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-sm leading-snug text-foreground"
                    >
                      <CheckIcon />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </a>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 sm:hidden" role="tablist" aria-label={title}>
            {items.map((item, index) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-label={item.title}
                onClick={() => showCard(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  active === index ? "w-6 bg-foreground" : "w-1.5 bg-foreground/30"
                }`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
