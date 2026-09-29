import { LOCALES, isLocale, type Locale } from "@/lib/locales";

export const SITE_URL = "https://mmproperty.io";
export const LOGO_URL = `${SITE_URL}/mm-property-logo.png`;
export const OG_IMAGE = LOGO_URL;

export const seo: Record<Locale, { title: string; description: string; locale: string }> = {
  en: {
    title: "M&M Property | Homes for Sale & Rent on the Costa del Sol",
    description:
      "Apartments, houses and villas for sale and rent from Benalmádena to Marbella. M&M Property — 20+ years on the Costa del Sol. Office in Benalmádena.",
    locale: "en_GB",
  },
  es: {
    title: "M&M Property | Viviendas en venta y alquiler en la Costa del Sol",
    description:
      "Pisos, casas y villas en venta y alquiler de Benalmádena a Marbella. M&M Property, más de 20 años en la Costa del Sol. Oficina en Benalmádena.",
    locale: "es_ES",
  },
  nl: {
    title: "M&M Property | Woningen te koop en te huur aan de Costa del Sol",
    description:
      "Appartementen, huizen en villa’s te koop en te huur van Benalmádena tot Marbella. M&M Property, 20+ jaar aan de Costa del Sol. Kantoor in Benalmádena.",
    locale: "nl_NL",
  },
  sv: {
    title: "M&M Property | Bostäder till salu och uthyrning på Costa del Sol",
    description:
      "Lägenheter, hus och villor till salu och uthyrning från Benalmádena till Marbella. M&M Property, 20+ år på Costa del Sol. Kontor i Benalmádena.",
    locale: "sv_SE",
  },
  de: {
    title: "M&M Property | Wohnungen zum Kauf und zur Miete an der Costa del Sol",
    description:
      "Apartments, Häuser und Villen zum Kauf und zur Miete von Benalmádena bis Marbella. M&M Property, 20+ Jahre an der Costa del Sol. Büro in Benalmádena.",
    locale: "de_DE",
  },
};

export function pageUrl(locale: Locale, path = "/") {
  const base = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  return locale === "en" ? base : `${base}?lang=${locale}`;
}

export { LOCALES, isLocale };

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
