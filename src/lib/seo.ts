export const SITE_URL = "https://mmproperty.io";
export const OG_IMAGE = `${SITE_URL}/media/costa-marbella.jpg`;
export const LOGO_URL = `${SITE_URL}/mm-property-logo.png`;

export const seo = {
  en: {
    title: "M&M Property | Homes for Sale & Rent on the Costa del Sol",
    description:
      "Apartments, houses and villas for sale and rent from Benalmádena to Marbella. M&M Property — 15+ years on the Costa del Sol. Office in Benalmádena.",
    locale: "en_GB",
  },
  es: {
    title: "M&M Property | Viviendas en venta y alquiler en la Costa del Sol",
    description:
      "Pisos, casas y villas en venta y alquiler de Benalmádena a Marbella. M&M Property, más de 15 años en la Costa del Sol. Oficina en Benalmádena.",
    locale: "es_ES",
  },
} as const;

export function pageUrl(locale: "en" | "es") {
  return locale === "es" ? `${SITE_URL}/?lang=es` : `${SITE_URL}/`;
}

export function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export function upsertLink(rel: string, href: string, extra?: Record<string, string>) {
  const selector = extra?.hreflang
    ? `link[rel="${rel}"][hreflang="${extra.hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    if (extra) {
      for (const [k, v] of Object.entries(extra)) tag.setAttribute(k, v);
    }
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}
