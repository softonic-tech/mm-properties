import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Image } from "@/components/ui/Image";
import { useContent, useLocale } from "@/content/language";
import {
  findProperty,
  formatEuro,
  loadProperties,
  propertyDescription,
  propertyImageLabel,
  propertyTitle,
  type Property,
  type PropertyImage,
} from "@/lib/properties";
import { leadMeta } from "@/lib/track";

const GOLD = "#c9a227";
const cardClass = "rounded-md border border-[#e8e8e8] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] md:p-7";
const inputClass =
  "h-11 w-full rounded-sm border border-[#d1d5db] bg-[#f7f7f7] px-3 text-[14px] text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#c9a227] focus:bg-white";

function CheckItem({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-2 text-[14px] leading-snug text-[#4b5563]">
      <span className="mt-0.5 text-[#6b7280]" aria-hidden>
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-[15px] font-semibold tracking-[0.08em] text-[#374151] uppercase">{children}</h2>;
}

function ContactSidebar({
  property,
  title,
}: {
  property: Property;
  title: string;
}) {
  const { pages, brand } = useContent();
  const copy = pages.property;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [intent, setIntent] = useState<"offer" | "visit" | null>(null);
  const [privacy, setPrivacy] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "error">("idle");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!privacy) return;
    setStatus("saving");
    const intentNote = intent === "offer" ? "[OFFER]" : intent === "visit" ? "[VISIT]" : "";
    const note = [
      intentNote,
      `Property ${property.ref} (${property.id}) — ${title}`,
      message.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          note,
          ...leadMeta(),
        }),
      });
      if (!response.ok) throw new Error("save failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <aside className="lg:sticky lg:top-24">
      <div className={cardClass}>
        <h2 className="text-[22px] font-semibold text-[#111827]">{copy.contact}</h2>
        <div className="mt-5 flex justify-center">
          <img src="/mm-property-logo.png" alt={brand.name} className="h-16 w-auto object-contain" />
        </div>

        {status === "sent" ? (
          <p className="mt-8 text-center text-[15px] leading-relaxed text-[#4b5563]">{copy.sent}</p>
        ) : (
          <form className="mt-6 flex flex-col gap-3" onSubmit={submit}>
            <input
              required
              name="name"
              autoComplete="name"
              placeholder={copy.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              placeholder={copy.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <input
              required
              name="tel"
              type="tel"
              autoComplete="tel"
              placeholder={copy.phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIntent("offer")}
                className={`h-10 text-[12px] font-semibold tracking-[0.08em] text-white uppercase transition ${
                  intent === "offer" ? "bg-[#b8911f]" : "bg-[#c9a227] hover:bg-[#b8911f]"
                }`}
              >
                {copy.offer}
              </button>
              <button
                type="button"
                onClick={() => setIntent("visit")}
                className={`h-10 text-[12px] font-semibold tracking-[0.08em] text-white uppercase transition ${
                  intent === "visit" ? "bg-[#b8911f]" : "bg-[#c9a227] hover:bg-[#b8911f]"
                }`}
              >
                {copy.visit}
              </button>
            </div>

            <textarea
              name="message"
              rows={4}
              placeholder={copy.message}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-y rounded-sm border border-[#d1d5db] bg-[#f7f7f7] px-3 py-2.5 text-[14px] text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#c9a227] focus:bg-white"
            />

            <label className="flex items-start gap-2 text-[13px] text-[#4b5563]">
              <input
                type="checkbox"
                required
                checked={privacy}
                onChange={(e) => setPrivacy(e.target.checked)}
                className="mt-0.5 accent-[#c9a227]"
              />
              <span>
                {copy.privacy}{" "}
                <a href="/privacy" className="font-medium" style={{ color: GOLD }}>
                  {copy.privacyLink}
                </a>
                .
              </span>
            </label>

            {status === "error" ? <p className="text-[13px] text-red-600">{copy.error}</p> : null}

            <button
              type="submit"
              disabled={status === "saving"}
              className="h-11 w-full bg-[#c9a227] text-[13px] font-semibold tracking-[0.1em] text-white uppercase transition hover:bg-[#b8911f] disabled:opacity-60"
            >
              {status === "saving" ? "…" : copy.contactSubmit}
            </button>
          </form>
        )}

        <a
          href={brand.phoneHref}
          className="mt-4 flex h-11 items-center justify-center gap-2 bg-[#c9a227] text-[14px] font-medium text-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path
              d="M6.5 4.5h3l1.5 4-2 1.2a12 12 0 0 0 5.3 5.3l1.2-2 4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 6.7 2 2 0 0 1 6.5 4.5Z"
              strokeLinejoin="round"
            />
          </svg>
          {brand.phone}
        </a>
      </div>
    </aside>
  );
}

function Gallery({
  images,
  title,
  prevLabel,
  nextLabel,
  locale,
}: {
  images: PropertyImage[];
  title: string;
  prevLabel: string;
  nextLabel: string;
  locale: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[Math.min(active, images.length - 1)] || images[0];
  const label = current ? propertyImageLabel(current, locale) : "";

  function prev() {
    setActive((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    setActive((i) => (i + 1) % images.length);
  }

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-[#e5e7eb] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <Image
          src={current.url}
          alt={label || title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover"
        />

        {label ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-black/35 px-4 py-2.5">
            <span className="text-[14px] font-medium tracking-wide text-white">{label}</span>
          </div>
        ) : null}

        {images.length > 1 ? (
          <div className="absolute right-4 bottom-4 z-10 flex gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label={prevLabel}
              className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#c9a227] text-lg text-white shadow-md transition hover:bg-[#b8911f]"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={nextLabel}
              className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#c9a227] text-lg text-white shadow-md transition hover:bg-[#b8911f]"
            >
              ›
            </button>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((item, index) => (
            <button
              key={item.url + index}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={index === active}
              title={propertyImageLabel(item, locale) || undefined}
              className={`relative h-[72px] w-[104px] shrink-0 overflow-hidden rounded-sm ring-2 transition ${
                index === active ? "ring-[#c9a227]" : "ring-transparent hover:ring-[#d1d5db]"
              }`}
            >
              <Image src={item.url} alt={propertyImageLabel(item, locale) || ""} fill sizes="104px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PropertyDetailPage({ slug }: { slug: string }) {
  const { pages } = useContent();
  const { locale } = useLocale();
  const copy = pages.property;
  const [property, setProperty] = useState<Property | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    loadProperties().then((data) => {
      if (!alive) return;
      setProperty(findProperty(data, slug));
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  const title = property ? propertyTitle(property, locale) : "";
  const description = property ? propertyDescription(property, locale) : "";
  const images = property
    ? property.images.length
      ? property.images
      : [{ url: property.image, label: "" }]
    : [];

  const generals = useMemo(() => {
    if (!property) return [] as string[];
    const items: string[] = [];
    if (property.type) items.push(property.type);
    if (property.beds) items.push(`${property.beds} ${copy.bedrooms}`);
    if (property.baths) items.push(`${property.baths} ${copy.bathrooms}`);
    if (property.terraceArea) items.push(`1 ${copy.terrace} (${property.terraceArea} m²)`);
    if (property.parkingSpaces) items.push(`${property.parkingSpaces} ${copy.parking}`);
    if (property.pool) items.push(copy.pool);
    return items;
  }, [property, copy]);

  const surfaces = useMemo(() => {
    if (!property) return [] as string[];
    const items: string[] = [];
    if (property.built) items.push(`${copy.construction}: ${property.built} m²`);
    if (property.usableArea) items.push(`${copy.useful}: ${property.usableArea} m²`);
    if (property.plot) items.push(`${copy.plot}: ${property.plot} m²`);
    if (property.terraceArea) items.push(`${copy.terrace}: ${property.terraceArea} m²`);
    return items;
  }, [property, copy]);

  const stateItems = useMemo(() => {
    if (!property) return [] as string[];
    const items: string[] = [];
    if (property.year) items.push(`${copy.yearOfConstruction}: ${property.year}`);
    if (property.newBuild) items.push(property.year && property.year > new Date().getFullYear() ? copy.underConstruction : copy.newBuild);
    return items;
  }, [property, copy]);

  const qualities = useMemo(() => {
    if (!property) return [] as string[];
    return property.features.filter(Boolean);
  }, [property]);

  const pricePerM2 =
    property && property.price > 0 && property.built > 0 ? Math.round(property.price / property.built) : 0;

  const mapSrc =
    property?.latitude && property?.longitude
      ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`
      : "";

  if (property === undefined) {
    return (
      <div className="min-h-svh bg-[#f3f4f6]">
        <Header solid />
        <main className="page-container py-10 md:py-14">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="aspect-[16/10] animate-pulse rounded-md bg-[#e5e7eb]" />
            <div className="h-[28rem] animate-pulse rounded-md bg-white" />
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-svh bg-[#f3f4f6]">
        <Header solid />
        <main className="page-container py-10 md:py-14">
          <a href="/homes" className="text-[14px] font-medium text-[#6b7280] hover:text-[#c9a227]">
            ← {copy.backToHomes}
          </a>
          <h1 className="mt-8 text-3xl font-semibold text-[#111827]">{copy.notFoundTitle}</h1>
          <p className="mt-3 max-w-xl text-[15px] text-[#6b7280]">{copy.notFoundDescription}</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-[#f3f4f6]">
      <Header solid />
      <main className="page-container py-8 md:py-12">
        <div className="mb-5 flex flex-wrap items-center gap-3 text-[13px] text-[#6b7280]">
          <a href="/homes" className="hover:text-[#c9a227]">
            ← {copy.backToHomes}
          </a>
          <span aria-hidden>·</span>
          <span>
            {copy.ref} {property.ref}
          </span>
          {property.city ? (
            <>
              <span aria-hidden>·</span>
              <span>
                {property.city}
                {property.province ? ` (${property.province})` : ""}
              </span>
            </>
          ) : null}
        </div>

        <h1 className="mb-6 max-w-4xl text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold leading-snug text-[#111827]">
          {title}
        </h1>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-5">
            <Gallery
              images={images}
              title={title}
              prevLabel={copy.prevPhoto}
              nextLabel={copy.nextPhoto}
              locale={locale}
            />

            {description ? (
              <section className={cardClass}>
                <SectionTitle>{copy.description}</SectionTitle>
                <div className="mt-4 space-y-4 text-[15px] leading-[1.75] whitespace-pre-line text-[#4b5563]">
                  {description}
                </div>
              </section>
            ) : null}

            {(generals.length > 0 || surfaces.length > 0 || stateItems.length > 0) && (
              <section className={cardClass}>
                <SectionTitle>{copy.characteristics}</SectionTitle>

                {generals.length > 0 ? (
                  <div className="mt-5">
                    <h3 className="text-[14px] font-semibold text-[#111827]">{copy.generals}</h3>
                    <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {generals.map((item) => (
                        <CheckItem key={item}>{item}</CheckItem>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {surfaces.length > 0 ? (
                  <div className="mt-6">
                    <h3 className="text-[14px] font-semibold text-[#111827]">{copy.surfaces}</h3>
                    <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {surfaces.map((item) => (
                        <CheckItem key={item}>{item}</CheckItem>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {stateItems.length > 0 ? (
                  <div className="mt-6">
                    <h3 className="text-[14px] font-semibold text-[#111827]">{copy.state}</h3>
                    <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {stateItems.map((item) => (
                        <CheckItem key={item}>{item}</CheckItem>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>
            )}

            {qualities.length > 0 ? (
              <section className={cardClass}>
                <SectionTitle>{copy.qualities}</SectionTitle>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {qualities.map((item) => (
                    <CheckItem key={item}>{item}</CheckItem>
                  ))}
                </ul>
              </section>
            ) : null}

            {property.priceLabel ? (
              <section className={cardClass}>
                <SectionTitle>{copy.price}</SectionTitle>
                <p className="mt-4 text-[2rem] font-bold tracking-tight text-[#111827] md:text-[2.4rem]">
                  {property.priceLabel}
                </p>
                {pricePerM2 ? (
                  <p className="mt-1 text-[15px] text-[#9ca3af]">
                    {formatEuro(pricePerM2)} {copy.pricePerM2}
                  </p>
                ) : null}
              </section>
            ) : null}

            <section className={cardClass}>
              <SectionTitle>{copy.situation}</SectionTitle>
              <p className="mt-3 text-[15px] text-[#4b5563]">
                {property.city}
                {property.province ? ` (${property.province})` : ""}
              </p>

              {mapSrc ? (
                <div className="relative mt-4 h-[280px] w-full overflow-hidden rounded-sm border border-[#e5e7eb] md:h-[340px]">
                  <iframe
                    title={title}
                    src={mapSrc}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              ) : null}

              <div className="mt-5">
                <h3 className="text-[14px] font-semibold text-[#111827]">{copy.situationLabel}</h3>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {property.city ? <CheckItem>{property.city}</CheckItem> : null}
                  {property.type ? <CheckItem>{property.type}</CheckItem> : null}
                  {property.pool ? <CheckItem>{copy.pool}</CheckItem> : null}
                </ul>
              </div>
            </section>
          </div>

          <ContactSidebar property={property} title={title} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
