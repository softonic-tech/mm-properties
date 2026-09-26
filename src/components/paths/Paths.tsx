import { Image } from "@/components/ui/Image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useContent } from "@/content/language";

/**
 * Four ways to search — new build, villas, resale, rent.
 */
export function Paths() {
  const { index, eyebrow, title, description, items } = useContent().paths;

  return (
    <section
      id="paths"
      data-section="paths"
      className="relative border-t border-white/[0.06] bg-background py-20 md:py-24 lg:py-28"
      aria-labelledby="paths-title"
    >
      <div className="page-container">
        <Reveal>
          <div data-motion className="max-w-2xl">
            <SectionEyebrow index={index} label={eyebrow} />
            <h2
              id="paths-title"
              className="mt-4 max-w-xl text-[clamp(1.85rem,3.2vw,2.85rem)] leading-[1.15] font-medium tracking-[-0.02em] text-foreground"
            >
              {title}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-[1.75] text-foreground-muted">
              {description}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {items.map((item) => (
              <a
                key={item.title}
                data-motion
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 90vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent px-5 pt-20 pb-5">
                    <h3 className="font-serif text-2xl text-white">{item.title}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
                  {item.text}
                </p>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
