import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Image } from "@/components/ui/Image";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useContent } from "@/content/language";
import type { SiteContent } from "@/content";

type Listing = SiteContent["listings"]["items"][number];

function splitMeta(meta: string) {
  const parts = meta.split(" · ");
  const last = parts.at(-1) ?? "";
  if (!last.includes("€")) return { specs: meta, price: "" };
  return { specs: parts.slice(0, -1).join(" · "), price: last };
}

function ListingCard({
  item,
  action,
  featured = false,
}: {
  item: Listing;
  action: string;
  featured?: boolean;
}) {
  const { specs, price } = splitMeta(item.meta);

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className={`group relative block overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 ${
        featured ? "min-h-[26rem] lg:min-h-[34rem]" : "min-h-[22rem]"
      }`}
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        priority={featured}
        sizes={featured ? "(max-width: 1024px) 100vw, 70vw" : "(max-width: 768px) 100vw, 30vw"}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
      <div className={`relative flex h-full flex-col justify-end ${featured ? "min-h-[26rem] p-6 md:p-9 lg:min-h-[34rem]" : "min-h-[22rem] p-5 md:p-6"}`}>
        {specs ? (
          <p className="text-[11px] tracking-[0.18em] text-white/70 uppercase">{specs}</p>
        ) : null}
        <h2
          className={`mt-2 max-w-xl font-serif leading-[1.08] font-medium text-white ${
            featured ? "text-[clamp(2rem,3.4vw,3.4rem)]" : "text-[1.65rem]"
          }`}
        >
          {item.title}
        </h2>
        <div className="mt-5">
          {price ? <p className="font-serif text-2xl text-white md:text-3xl">{price}</p> : null}
          <span className="mt-3 inline-flex text-[11px] tracking-[0.16em] text-white/80 uppercase">{action} →</span>
        </div>
      </div>
    </a>
  );
}

export function HomesPage() {
  const { pages, listings } = useContent();
  const copy = pages.homes;
  const [lead, ...rest] = listings.items;

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

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionEyebrow index="" label={copy.eyebrow} />
            <h1 className="mt-4 font-serif text-[clamp(2.6rem,5.2vw,4.6rem)] leading-[1.02] font-medium tracking-[-0.03em] text-balance text-foreground">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-[1.75] text-foreground-muted">{copy.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {copy.links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={
                  index === 0
                    ? "inline-flex h-10 items-center rounded-full bg-white px-4 text-[13px] font-medium text-black"
                    : "inline-flex h-10 items-center rounded-full border border-white/20 bg-white/10 px-4 text-[13px] font-medium text-white backdrop-blur-md"
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {lead ? (
          <div className="mt-10 lg:mt-14">
            <ListingCard item={lead} action={copy.viewListing} featured />
          </div>
        ) : null}
        {rest.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {rest.map((item, index) => (
              <div key={item.id} className={index < 2 ? "lg:col-span-3" : "lg:col-span-2"}>
                <ListingCard item={item} action={copy.viewListing} />
              </div>
            ))}
          </div>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
