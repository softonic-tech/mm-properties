export type PropertyImage = {
  url: string;
  label: string;
  labels?: Record<string, string>;
};

export type Property = {
  id: string;
  slug: string;
  ref: string;
  offer: "sale" | "rent";
  type: string;
  title: string;
  titles: Record<string, string>;
  description: string;
  descriptions: Record<string, string>;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  country: string;
  price: number;
  priceLabel: string;
  built: number;
  plot: number;
  beds: number;
  baths: number;
  features: string[];
  area: string;
  image: string;
  images: PropertyImage[];
  updated: string;
  created: string;
  url: string;
  latitude: number | null;
  longitude: number | null;
  pool: boolean;
  newBuild: boolean;
  year: number | null;
  usableArea: number | null;
  terraceArea: number | null;
  parkingSpaces: number | null;
  meta: string;
};

type FeedImage =
  | string
  | { url?: string; label?: string; src?: string; caption?: string; labels?: Record<string, string> };

type FeedProperty = {
  id?: string | number;
  ref?: string;
  title?: string;
  titles?: Record<string, string>;
  type?: string;
  operation?: string;
  price?: number | null;
  beds?: number | null;
  baths?: number | null;
  builtArea?: number | null;
  plotArea?: number | null;
  town?: string;
  province?: string;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
  description?: string;
  descriptions?: Record<string, string>;
  url?: string;
  images?: FeedImage[];
  image?: string;
  pool?: boolean;
  newBuild?: boolean;
  year?: number | null;
  date?: string;
  usableArea?: number | null;
  terraceArea?: number | null;
  parkingSpaces?: number | null;
  postalCode?: string;
};

type FeedFile = {
  properties?: FeedProperty[];
};

export const PROPERTIES_PER_PAGE = 12;
export const PROPERTIES_DATA_URL = "/Data/properties.json";

const PLACEHOLDER = "/media/costa-marbella.jpg?v=2";

let cache: Property[] | null = null;
let loading: Promise<Property[]> | null = null;

function slugify(value: string) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function citySlug(city: string) {
  const key = String(city || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  if (key.includes("marbella")) return "marbella";
  if (key.includes("fuengirola")) return "fuengirola";
  if (key.includes("benalmadena")) return "benalmadena";
  if (key.includes("mijas")) return "mijas";
  if (key.includes("torremolinos") || key.includes("malaga")) return "torremolinos";
  if (key.includes("estepona")) return "estepona";
  return "costa-del-sol";
}

export function formatEuro(price: number) {
  if (!price) return "";
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function normalizeImages(raw: FeedProperty): PropertyImage[] {
  const list = raw.images || [];
  const images = list
    .map((item) => {
      if (typeof item === "string") {
        const url = item.trim();
        return url ? { url, label: "" } : null;
      }
      const url = String(item?.url || item?.src || "").trim();
      if (!url) return null;
      const labels = item?.labels && typeof item.labels === "object" ? item.labels : undefined;
      return {
        url,
        label: String(item?.label || item?.caption || labels?.en || labels?.es || "").trim(),
        ...(labels ? { labels } : {}),
      };
    })
    .filter((item): item is PropertyImage => Boolean(item));

  if (images.length) return images;
  const fallback = String(raw.image || "").trim();
  return fallback ? [{ url: fallback, label: "" }] : [{ url: PLACEHOLDER, label: "" }];
}

function normalizeProperty(raw: FeedProperty): Property | null {
  const id = String(raw.id ?? raw.ref ?? "").trim();
  if (!id) return null;

  const ref = String(raw.ref || id).trim();
  const title = String(raw.title || raw.titles?.en || raw.titles?.es || `Property ${ref}`).trim();
  const images = normalizeImages(raw);
  const image = images[0]?.url || PLACEHOLDER;
  const price = Number(raw.price) || 0;
  const built = Number(raw.builtArea) || 0;
  const plot = Number(raw.plotArea) || 0;
  const beds = Number(raw.beds) || 0;
  const baths = Number(raw.baths) || 0;
  const city = String(raw.town || "").trim();
  const offer = String(raw.operation || "sale").toLowerCase().includes("rent") ? "rent" : "sale";
  const priceLabel = formatEuro(price);
  const features = [
    raw.pool ? "Pool" : "",
    raw.newBuild ? "New build" : "",
    raw.parkingSpaces ? `Parking ${raw.parkingSpaces}` : "",
    raw.terraceArea ? `Terrace ${raw.terraceArea} m²` : "",
  ].filter(Boolean);

  const meta = [built ? `${built} m²` : "", beds ? `${beds} bed` : "", baths ? `${baths} bath` : "", priceLabel]
    .filter(Boolean)
    .join(" · ");

  return {
    id,
    slug: `${slugify(ref)}-${slugify(title)}`.replace(/-+/g, "-"),
    ref,
    offer,
    type: String(raw.type || "").trim(),
    title,
    titles: raw.titles || {},
    description: String(raw.description || raw.descriptions?.en || raw.descriptions?.es || "").trim(),
    descriptions: raw.descriptions || {},
    address: "",
    postalCode: String(raw.postalCode || "").trim(),
    city,
    province: String(raw.province || "").trim(),
    country: String(raw.country || "Spain").trim(),
    price,
    priceLabel,
    built,
    plot,
    beds,
    baths,
    features,
    area: citySlug(city),
    image,
    images,
    updated: String(raw.date || ""),
    created: String(raw.date || ""),
    url: String(raw.url || "").trim(),
    latitude: raw.latitude ?? null,
    longitude: raw.longitude ?? null,
    pool: Boolean(raw.pool),
    newBuild: Boolean(raw.newBuild),
    year: raw.year ?? null,
    usableArea: raw.usableArea ?? null,
    terraceArea: raw.terraceArea ?? null,
    parkingSpaces: raw.parkingSpaces ?? null,
    meta,
  };
}

export async function loadProperties(): Promise<Property[]> {
  if (cache) return cache;
  if (!loading) {
    loading = fetch(PROPERTIES_DATA_URL)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load properties");
        return res.json() as Promise<FeedFile | FeedProperty[]>;
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.properties || [];
        cache = list
          .map(normalizeProperty)
          .filter((item): item is Property => Boolean(item));
        return cache;
      })
      .catch(() => {
        cache = [];
        return cache;
      })
      .finally(() => {
        loading = null;
      });
  }
  return loading;
}

export function propertyHref(property: Pick<Property, "slug">) {
  return `/homes/${property.slug}`;
}

export function propertyTitle(property: Property, locale = "en") {
  return property.titles[locale] || property.titles.en || property.titles.es || property.title;
}

export function propertyDescription(property: Property, locale = "en") {
  return (
    property.descriptions[locale] ||
    property.descriptions.en ||
    property.descriptions.es ||
    property.description
  );
}

export function propertyImageLabel(image: PropertyImage, locale = "en") {
  return image.labels?.[locale] || image.labels?.en || image.labels?.es || image.label || "";
}

export function findProperty(properties: Property[], slugOrRef: string) {
  const key = decodeURIComponent(slugOrRef).toLowerCase();
  return (
    properties.find((item) => item.slug.toLowerCase() === key) ||
    properties.find((item) => item.ref.toLowerCase() === key) ||
    properties.find((item) => item.id.toLowerCase() === key) ||
    properties.find((item) => item.slug.toLowerCase().startsWith(`${key}-`)) ||
    null
  );
}

export function paginateProperties(properties: Property[], page: number) {
  const total = properties.length;
  const totalPages = Math.max(1, Math.ceil(total / PROPERTIES_PER_PAGE));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * PROPERTIES_PER_PAGE;
  return {
    items: properties.slice(start, start + PROPERTIES_PER_PAGE),
    page: current,
    totalPages,
    total,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + PROPERTIES_PER_PAGE, total),
  };
}

export function homesPageHref(page: number) {
  return page <= 1 ? "/homes" : `/homes/page/${page}`;
}

export function truncateText(value: string, max = 160) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export type PropertySortKey = "date" | "price" | "size" | "beds";

export type PropertyFilters = {
  query: string;
  city: string;
  type: string;
  beds: string;
  maxPrice: string;
};

function parseListingDate(value: string) {
  if (!value) return 0;
  const iso = Date.parse(value);
  if (!Number.isNaN(iso)) return iso;
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(value);
  if (!match) return 0;
  return Date.UTC(Number(match[3]), Number(match[1]) - 1, Number(match[2]));
}

export function uniqueSorted(values: string[]) {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

export function filterProperties(properties: Property[], filters: PropertyFilters) {
  const q = filters.query.trim().toLowerCase();
  const beds = Number(filters.beds) || 0;
  const maxPrice = Number(filters.maxPrice) || 0;

  return properties.filter((item) => {
    if (filters.city && item.city !== filters.city) return false;
    if (filters.type && item.type !== filters.type) return false;
    if (beds && item.beds < beds) return false;
    if (maxPrice && (item.price <= 0 || item.price > maxPrice)) return false;
    if (!q) return true;
    const haystack = [
      item.title,
      ...Object.values(item.titles),
      item.ref,
      item.id,
      item.city,
      item.type,
      item.description,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function sortProperties(
  properties: Property[],
  sortKey: PropertySortKey,
  direction: "asc" | "desc",
) {
  const dir = direction === "asc" ? 1 : -1;
  return [...properties].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "price") cmp = a.price - b.price;
    else if (sortKey === "size") cmp = a.built - b.built;
    else if (sortKey === "beds") cmp = a.beds - b.beds;
    else cmp = parseListingDate(a.updated || a.created) - parseListingDate(b.updated || b.created);
    if (cmp === 0) cmp = a.ref.localeCompare(b.ref);
    return cmp * dir;
  });
}
