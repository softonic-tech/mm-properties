import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Image } from "@/components/ui/Image";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useContent } from "@/content/language";
import type { SiteContent } from "@/content";

type Town = SiteContent["pages"]["areas"]["towns"][number];

function TownCard({ town, className, large = false }: { town: Town; className: string; large?: boolean }) {
  return (
    <a href={`/areas/${town.slug}`} className={`group relative flex flex-col justify-end overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 ${className}`}>
      <Image
        src={town.image}
        alt={town.imageAlt}
        fill
        priority={large}
        sizes={large ? "100vw" : "(max-width: 1024px) 100vw, 40vw"}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/15" />
      <div className="relative p-6 md:p-8">
        <p className="text-[11px] tracking-[0.18em] text-white/70 uppercase">{town.role}</p>
        <h2 className={`mt-2 font-serif leading-none font-medium text-white ${large ? "text-[clamp(2.8rem,5vw,4.8rem)]" : "text-[2.1rem]"}`}>
          {town.name}
        </h2>
        <p className={`mt-3 leading-relaxed text-white/75 ${large ? "max-w-md text-[15px]" : "max-w-xs text-sm"}`}>{town.text}</p>
      </div>
    </a>
  );
}

function pick(towns: readonly Town[], slug: string) {
  return towns.find((town) => town.slug === slug);
}

export function AreasPage() {
  const { pages } = useContent();
  const copy = pages.areas;
  const lead = pick(copy.towns, "benalmadena");
  const featured = [pick(copy.towns, "marbella"), pick(copy.towns, "fuengirola")].filter((town): town is Town => Boolean(town));
  const row = [pick(copy.towns, "mijas"), pick(copy.towns, "torremolinos"), pick(copy.towns, "estepona")].filter(
    (town): town is Town => Boolean(town),
  );
  const placed = new Set([lead?.slug, ...featured.map((town) => town.slug), ...row.map((town) => town.slug)]);
  const extra = copy.towns.filter((town) => !placed.has(town.slug));

  return (
    <div className="min-h-svh bg-background">
      <Header solid />
      <main className="page-container py-10 md:py-14">
        <a
          href="/"
          className="inline-flex h-11 items-center rounded-full border border-white/25 px-5 text-sm font-medium text-white"
        >
          ← {pages.backHome}
        </a>

        <div className="mt-8 max-w-3xl">
          <SectionEyebrow index="" label={copy.eyebrow} />
          <h1 className="mt-4 font-serif text-[clamp(2.6rem,5.2vw,4.6rem)] leading-[1.02] font-medium tracking-[-0.03em] text-balance text-foreground">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-[1.75] text-foreground-muted">{copy.description}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:mt-14 lg:grid-cols-12 lg:gap-5">
          {lead ? <TownCard town={lead} large className="min-h-[28rem] lg:col-span-12 lg:min-h-[34rem]" /> : null}
          {featured.map((town, index) => (
            <TownCard
              key={town.slug}
              town={town}
              className={index === 0 ? "min-h-[24rem] lg:col-span-7" : "min-h-[24rem] lg:col-span-5"}
            />
          ))}
          {row.map((town) => (
            <TownCard key={town.slug} town={town} className="min-h-[22rem] lg:col-span-4" />
          ))}
          {extra.map((town) => (
            <TownCard key={town.slug} town={town} className="min-h-[22rem] lg:col-span-4" />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function splitMeta(meta: string) {
  const parts = meta.split(" · ");
  const last = parts.at(-1) ?? "";
  if (!last.includes("€")) return { specs: meta, price: "" };
  return { specs: parts.slice(0, -1).join(" · "), price: last };
}

export function AreaPage({ slug }: { slug: string }) {
  const { pages, listings, brand, report } = useContent();
  const town = pages.areas.towns.find((item) => item.slug === slug)!;
  const homes = listings.items.filter((item) => item.area === town.slug);

  return (
    <div className="min-h-svh bg-background">
      <Header solid />
      <main className="page-container py-10 md:py-14">
        <article className="relative min-h-[30rem] overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 md:min-h-[36rem]">
          <Image src={town.image} alt={town.imageAlt} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/25" />
          <div className="relative flex min-h-[30rem] flex-col justify-between p-5 md:min-h-[36rem] md:p-9">
            <div className="flex flex-wrap gap-3">
              <a
                href="/"
                className="inline-flex h-11 items-center rounded-full border border-white/25 bg-black/20 px-5 text-sm font-medium text-white backdrop-blur-md"
              >
                ← {pages.backHome}
              </a>
              <a
                href="/areas"
                className="inline-flex h-11 items-center rounded-full border border-white/25 bg-black/20 px-5 text-sm font-medium text-white backdrop-blur-md"
              >
                ← {pages.backToAreas}
              </a>
            </div>
            <div className="max-w-2xl">
              <p className="text-[11px] tracking-[0.18em] text-white/70 uppercase">{town.role}</p>
              <h1 className="mt-3 font-serif text-[clamp(3.2rem,7vw,6rem)] leading-[0.95] font-medium tracking-[-0.03em] text-white">
                {town.name}
              </h1>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.7] text-white/78">{town.text}</p>
            </div>
          </div>
        </article>

        {homes.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {homes.map((item) => {
              const { specs, price } = splitMeta(item.meta);
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block min-h-[22rem] overflow-hidden rounded-[1.75rem] ring-1 ring-white/10"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
                  <div className="relative flex min-h-[22rem] flex-col justify-end p-6">
                    {specs ? <p className="text-[11px] tracking-[0.18em] text-white/70 uppercase">{specs}</p> : null}
                    <h2 className="mt-2 font-serif text-[1.7rem] leading-tight text-white">{item.title}</h2>
                    <div className="mt-4">
                      {price ? <p className="font-serif text-2xl text-white">{price}</p> : null}
                      <span className="mt-3 inline-flex text-[11px] tracking-[0.16em] text-white/80 uppercase">
                        {pages.homes.viewListing} →
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="mt-8 max-w-lg rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-8 text-[15px] leading-[1.75] text-foreground-muted">
            {pages.emptyHomes}
          </p>
        )}

        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <a href={brand.phoneHref} className="font-serif text-4xl leading-none text-foreground md:text-5xl">
            {brand.phone}
          </a>
          <a href={report.ctaHref} target="_blank" rel="noreferrer" className="text-[12px] tracking-[0.16em] text-electric-soft uppercase">
            {pages.portfolio} →
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
