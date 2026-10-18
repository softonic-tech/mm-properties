import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Image } from "@/components/ui/Image";
import { useContent, useLocale } from "@/content/language";
import {
  filterProperties,
  formatEuro,
  homesPageHref,
  loadProperties,
  paginateProperties,
  propertyHref,
  propertyTitle,
  sortProperties,
  uniqueSorted,
  type Property,
  type PropertyFilters,
  type PropertySortKey,
} from "@/lib/properties";
import { navigateTo } from "@/lib/router";

const EMPTY_FILTERS: PropertyFilters = {
  query: "",
  city: "",
  type: "",
  beds: "",
  maxPrice: "",
};

function IconHome({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 9.5V21h13V9.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 21v-6h4v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBed({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 18v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5" strokeLinecap="round" />
      <path d="M3 18h18M5 11V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" strokeLinecap="round" />
    </svg>
  );
}

function IconBath({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z" strokeLinejoin="round" />
      <path d="M6 12V6.5A2.5 2.5 0 0 1 8.5 4H10" strokeLinecap="round" />
      <path d="M4 19l1 2M20 19l-1 2" strokeLinecap="round" />
    </svg>
  );
}

function IconPlot({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
      <path d="M3.5 14.5h17M10 3.5v17" strokeLinecap="round" />
    </svg>
  );
}

function IconSort({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M8 5v14M8 5l-3 3M8 5l3 3M16 19V5M16 19l-3-3M16 19l3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconGrid({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconList({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" strokeLinecap="round" />
    </svg>
  );
}

function Spec({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-[#6b7280]">
      <span className="text-[#9ca3af]">{icon}</span>
      {label}
    </span>
  );
}

function PropertyCard({ item, view, locale }: { item: Property; view: "grid" | "list"; locale: string }) {
  const price = item.priceLabel || formatEuro(item.price);
  const title = propertyTitle(item, locale);
  const specs = (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      {item.built ? <Spec icon={<IconHome />} label={`${item.built.toLocaleString()} m²`} /> : null}
      {item.plot ? <Spec icon={<IconPlot />} label={`${item.plot.toLocaleString()} m²`} /> : null}
      {item.beds ? <Spec icon={<IconBed />} label={String(item.beds)} /> : null}
      {item.baths ? <Spec icon={<IconBath />} label={String(item.baths)} /> : null}
    </div>
  );

  if (view === "list") {
    return (
      <a
        href={propertyHref(item)}
        className="group grid overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] md:grid-cols-[280px_1fr]"
      >
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[200px]">
          <Image src={item.image} alt={title} fill sizes="280px" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center px-6 py-5 text-center md:text-left">
          <h2 className="text-[15px] leading-snug font-normal text-[#4b5563]">{title}</h2>
          {price ? <p className="mt-3 text-[28px] leading-none font-bold text-[#c9a227]">{price}</p> : null}
          <p className="mt-2 text-[13px] text-[#9ca3af]">Ref: {item.ref}</p>
          <div className="mt-4 border-t border-[#e5e7eb] pt-4 md:justify-start">{specs}</div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={propertyHref(item)}
      className="group flex h-full flex-col overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e5e7eb]">
        <Image
          src={item.image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col px-4 pt-5 pb-5 text-center">
        <h2 className="line-clamp-2 min-h-[2.6em] text-[15px] leading-snug font-normal text-[#4b5563]">{title}</h2>
        {price ? <p className="mt-3 text-[26px] leading-none font-bold tracking-tight text-[#c9a227] md:text-[28px]">{price}</p> : null}
        <p className="mt-2 text-[13px] text-[#9ca3af]">Ref: {item.ref}</p>
        <div className="mt-4 border-t border-[#e5e7eb] pt-4">{specs}</div>
      </div>
    </a>
  );
}

function Pagination({
  page,
  totalPages,
  prevLabel,
  nextLabel,
}: {
  page: number;
  totalPages: number;
  prevLabel: string;
  nextLabel: string;
}) {
  if (totalPages <= 1) return null;

  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const linkClass =
    "inline-flex h-10 min-w-10 items-center justify-center border border-[#d1d5db] bg-white px-3 text-[13px] font-medium text-[#374151] transition-colors hover:border-[#c9a227] hover:text-[#c9a227]";

  return (
    <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      {page > 1 ? (
        <a href={homesPageHref(page - 1)} className={linkClass}>
          ← {prevLabel}
        </a>
      ) : null}
      {pages.map((n) => (
        <a
          key={n}
          href={homesPageHref(n)}
          aria-current={n === page ? "page" : undefined}
          className={
            n === page
              ? "inline-flex h-10 min-w-10 items-center justify-center border border-[#c9a227] bg-[#c9a227] px-3 text-[13px] font-medium text-white"
              : linkClass
          }
        >
          {n}
        </a>
      ))}
      {page < totalPages ? (
        <a href={homesPageHref(page + 1)} className={linkClass}>
          {nextLabel} →
        </a>
      ) : null}
    </nav>
  );
}

export function HomesPage({ page = 1 }: { page?: number }) {
  const { pages } = useContent();
  const { locale } = useLocale();
  const copy = pages.homes;
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [draft, setDraft] = useState<PropertyFilters>(EMPTY_FILTERS);
  const [filters, setFilters] = useState<PropertyFilters>(EMPTY_FILTERS);
  const [sortKey, setSortKey] = useState<PropertySortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    let alive = true;
    loadProperties().then((data) => {
      if (alive) setProperties(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  const cities = useMemo(
    () => (properties ? uniqueSorted(properties.map((p) => p.city)) : []),
    [properties],
  );
  const types = useMemo(
    () => (properties ? uniqueSorted(properties.map((p) => p.type)) : []),
    [properties],
  );

  const filtered = useMemo(() => {
    if (!properties) return [];
    return sortProperties(filterProperties(properties, filters), sortKey, sortDir);
  }, [properties, filters, sortKey, sortDir]);

  const pagination = paginateProperties(filtered, page);

  function applySearch(event: FormEvent) {
    event.preventDefault();
    setFilters(draft);
    if (page > 1) navigateTo(homesPageHref(1));
  }

  function clearSearch() {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    if (page > 1) navigateTo(homesPageHref(1));
  }

  const fieldClass =
    "h-11 w-full border border-[#d1d5db] bg-white px-3 text-[13px] text-[#374151] outline-none transition-colors focus:border-[#c9a227]";
  const labelClass = "mb-1.5 block text-[11px] tracking-[0.08em] text-[#6b7280] uppercase";

  const cityOptions = [{ value: "", label: copy.anyCity }, ...cities.map((city) => ({ value: city, label: city }))];
  const typeOptions = [{ value: "", label: copy.anyType }, ...types.map((type) => ({ value: type, label: type }))];
  const bedsOptions = [
    { value: "", label: copy.anyBeds },
    ...[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}+` })),
  ];
  const priceOptions = [
    { value: "", label: copy.anyPrice },
    ...[300000, 500000, 750000, 1000000, 1500000, 2000000, 3000000].map((n) => ({
      value: String(n),
      label: copy.upToPrice.replace("{price}", formatEuro(n)),
    })),
  ];
  const sortOptions = [
    { value: "date", label: copy.sortDate },
    { value: "price", label: copy.sortPrice },
    { value: "size", label: copy.sortSize },
    { value: "beds", label: copy.sortBeds },
  ];

  return (
    <div className="min-h-svh bg-[#f3f4f6]">
      <Header solid />
      <main className="page-container py-10 md:py-14">
        <h1 className="text-center text-[clamp(1.35rem,2.8vw,2rem)] font-semibold tracking-[0.04em] text-[#374151] uppercase">
          {copy.listingTitle}
        </h1>

        <form
          onSubmit={applySearch}
          className="mt-8 grid grid-cols-1 gap-3 border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:grid-cols-2 lg:grid-cols-6 lg:items-end"
        >
          <label className="block lg:col-span-2">
            <span className={labelClass}>{copy.searchLabel}</span>
            <input
              value={draft.query}
              onChange={(e) => setDraft((prev) => ({ ...prev, query: e.target.value }))}
              placeholder={copy.searchPlaceholder}
              className={fieldClass}
            />
          </label>
          <CustomSelect
            label={copy.cityLabel}
            value={draft.city}
            options={cityOptions}
            onChange={(city) => setDraft((prev) => ({ ...prev, city }))}
          />
          <CustomSelect
            label={copy.typeLabel}
            value={draft.type}
            options={typeOptions}
            onChange={(type) => setDraft((prev) => ({ ...prev, type }))}
          />
          <CustomSelect
            label={copy.bedsLabel}
            value={draft.beds}
            options={bedsOptions}
            onChange={(beds) => setDraft((prev) => ({ ...prev, beds }))}
          />
          <CustomSelect
            label={copy.priceLabel}
            value={draft.maxPrice}
            options={priceOptions}
            onChange={(maxPrice) => setDraft((prev) => ({ ...prev, maxPrice }))}
          />
          <div className="flex gap-2 sm:col-span-2 lg:col-span-6">
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center bg-[#c9a227] px-5 text-[13px] font-semibold tracking-[0.06em] text-white uppercase transition-colors hover:bg-[#b8911f] lg:flex-none lg:min-w-[160px]"
            >
              {copy.searchButton}
            </button>
            <button
              type="button"
              onClick={clearSearch}
              className="inline-flex h-11 items-center justify-center border border-[#d1d5db] bg-white px-4 text-[13px] font-medium text-[#6b7280] transition-colors hover:border-[#c9a227]/50 hover:text-[#374151]"
            >
              {copy.clearButton}
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-col gap-4 border-b border-[#e5e7eb] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-[#6b7280]">
            {properties
              ? copy.showing
                  .replace("{from}", String(pagination.from))
                  .replace("{to}", String(pagination.to))
                  .replace("{total}", String(pagination.total))
              : copy.loading}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-[14px] text-[#6b7280]">
              <span className="shrink-0">{copy.sortBy}</span>
              <CustomSelect
                value={sortKey}
                options={sortOptions}
                onChange={(next) => setSortKey(next as PropertySortKey)}
                ariaLabel={copy.sortBy}
                size="sm"
                className="min-w-[8.5rem]"
              />
            </div>
            <button
              type="button"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              aria-label={copy.sortDirection}
              title={copy.sortDirection}
              className="inline-flex h-9 w-9 items-center justify-center border border-[#d1d5db] bg-white text-[#6b7280] hover:text-[#c9a227]"
            >
              <IconSort />
            </button>
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-pressed={view === "grid"}
              aria-label={copy.gridView}
              className={`inline-flex h-9 w-9 items-center justify-center border ${
                view === "grid"
                  ? "border-[#c9a227] bg-[#c9a227] text-white"
                  : "border-[#d1d5db] bg-white text-[#6b7280] hover:text-[#c9a227]"
              }`}
            >
              <IconGrid />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              aria-label={copy.listView}
              className={`inline-flex h-9 w-9 items-center justify-center border ${
                view === "list"
                  ? "border-[#c9a227] bg-[#c9a227] text-white"
                  : "border-[#d1d5db] bg-white text-[#6b7280] hover:text-[#c9a227]"
              }`}
            >
              <IconList />
            </button>
          </div>
        </div>

        {!properties ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white shadow-sm">
                <div className="aspect-[4/3] bg-[#e5e7eb]" />
                <div className="space-y-3 p-5">
                  <div className="mx-auto h-4 w-4/5 bg-[#e5e7eb]" />
                  <div className="mx-auto h-7 w-1/2 bg-[#e5e7eb]" />
                  <div className="mx-auto h-3 w-1/3 bg-[#e5e7eb]" />
                </div>
              </div>
            ))}
          </div>
        ) : pagination.items.length === 0 ? (
          <p className="mt-10 rounded-sm border border-[#e5e7eb] bg-white p-8 text-center text-[15px] text-[#6b7280]">
            {copy.noResults}
          </p>
        ) : (
          <div
            className={
              view === "grid"
                ? "mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
                : "mt-6 flex flex-col gap-5"
            }
          >
            {pagination.items.map((item) => (
              <PropertyCard key={item.id} item={item} view={view} locale={locale} />
            ))}
          </div>
        )}

        <Pagination page={pagination.page} totalPages={pagination.totalPages} prevLabel={copy.prev} nextLabel={copy.next} />
      </main>
      <SiteFooter />
    </div>
  );
}
