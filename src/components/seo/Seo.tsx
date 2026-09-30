import { useEffect } from "react";
import { useContent, useLocale } from "@/content/language";
import { matchPage, pageSeo } from "@/lib/pages";
import { usePathname } from "@/lib/router";
import { LOCALES, LOGO_URL, OG_IMAGE, SITE_URL, pageUrl, seo, upsertLink, upsertMeta } from "@/lib/seo";

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
  const path = usePathname();
  const content = useContent();
  const { faq, brand, contact } = content;
  const match = matchPage(path, content);
  const copy = pageSeo(match, content, seo[locale]);
  const url = pageUrl(locale, match.id === "notFound" ? "/" : match.path);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = copy.title;

    upsertMeta("name", "description", copy.description);
    upsertMeta(
      "name",
      "robots",
      match.id === "notFound" ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    );
    upsertMeta("property", "og:title", copy.title);
    upsertMeta("property", "og:description", copy.description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:locale", seo[locale].locale);
    upsertMeta("property", "og:image", OG_IMAGE);
    upsertMeta("property", "og:image:alt", brand.name);
    upsertMeta("name", "twitter:title", copy.title);
    upsertMeta("name", "twitter:description", copy.description);
    upsertMeta("name", "twitter:image", OG_IMAGE);

    const canonicalPath = match.id === "notFound" ? "/" : match.path;
    upsertLink("canonical", url);
    for (const code of LOCALES) {
      upsertLink("alternate", pageUrl(code, canonicalPath), { hreflang: code });
    }
    upsertLink("alternate", pageUrl("en", canonicalPath), { hreflang: "x-default" });

    setJsonLd("schema-website", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: brand.name,
      url: SITE_URL,
      inLanguage: LOCALES.map((code) => seo[code].locale),
      publisher: { "@id": `${SITE_URL}/#agency` },
    });

    if (match.id === "home" || match.id === "faq") {
      setJsonLd("schema-faq", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      });
    } else {
      document.getElementById("schema-faq")?.remove();
    }

    if (match.id !== "home" && match.id !== "notFound") {
      setJsonLd("schema-breadcrumb", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: content.pages.homeLabel, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: copy.title, item: pageUrl(locale, match.path) },
        ],
      });
    } else {
      document.getElementById("schema-breadcrumb")?.remove();
    }

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
      sameAs: [...contact.socials.map((social) => social.href), "https://www.mmproperty.es/en"],
      priceRange: "€€€",
    });
  }, [brand.name, contact.email, contact.socials, content.pages.homeLabel, copy.description, copy.title, faq.items, locale, match.id, match.path, url]);

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
