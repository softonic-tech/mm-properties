import { useEffect } from "react";
import { useContent, useLocale } from "@/content/language";
import { LOGO_URL, OG_IMAGE, SITE_URL, pageUrl, seo, upsertLink, upsertMeta } from "@/lib/seo";

function setJsonLd(id: string, data: Record<string, unknown>) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function Seo() {
  const { locale } = useLocale();
  const { faq, brand, contact } = useContent();
  const copy = seo[locale];
  const url = pageUrl(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = copy.title;

    upsertMeta("name", "description", copy.description);
    upsertMeta("name", "robots", "index, follow, max-image-preview:large");
    upsertMeta("property", "og:title", copy.title);
    upsertMeta("property", "og:description", copy.description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:locale", copy.locale);
    upsertMeta("property", "og:image", OG_IMAGE);
    upsertMeta("name", "twitter:title", copy.title);
    upsertMeta("name", "twitter:description", copy.description);
    upsertMeta("name", "twitter:image", OG_IMAGE);

    upsertLink("canonical", url);
    upsertLink("alternate", pageUrl("en"), { hreflang: "en" });
    upsertLink("alternate", pageUrl("es"), { hreflang: "es" });
    upsertLink("alternate", pageUrl("en"), { hreflang: "x-default" });

    setJsonLd("schema-website", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: brand.name,
      url: SITE_URL,
      inLanguage: [seo.en.locale, seo.es.locale],
      publisher: { "@id": `${SITE_URL}/#agency` },
    });

    setJsonLd("schema-faq", {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });

    setJsonLd("schema-agency", {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "@id": `${SITE_URL}/#agency`,
      name: brand.name,
      url: SITE_URL,
      logo: LOGO_URL,
      image: OG_IMAGE,
      email: contact.email,
      telephone: ["+34 653 223 015", "+34 951 542 193", "+34 648 766 318"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Avd. de Tívoli, Centro Comercial Las Ventas, Local 48A",
        addressLocality: "Benalmádena",
        addressRegion: "Málaga",
        postalCode: "29630",
        addressCountry: "ES",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 36.5988,
        longitude: -4.5169,
      },
      areaServed: [
        "Costa del Sol",
        "Marbella",
        "Fuengirola",
        "Benalmádena",
        "Mijas",
        "Torremolinos",
        "Estepona",
      ],
      sameAs: [
        contact.socials[0].href,
        contact.socials[1].href,
        "https://www.mmproperty.es/en",
      ],
      priceRange: "€€€",
    });
  }, [brand.name, contact.email, contact.socials, copy.description, copy.locale, copy.title, faq.items, locale, url]);

  return null;
}

export function AdminSeo() {
  useEffect(() => {
    document.title = "Admin | M&M Property";
    upsertMeta("name", "robots", "noindex, nofollow");
    upsertLink("canonical", `${SITE_URL}/admin`);
  }, []);
  return null;
}
