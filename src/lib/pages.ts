import type { SiteContent } from "@/content";

export function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname || "/";
}

export type PageMatch =
  | { id: "home" | "homes" | "areas" | "sell" | "contact" | "faq" | "about"; path: string }
  | { id: "area"; path: string; slug: string }
  | { id: "notFound"; path: string };

export function matchPage(pathname: string, content: SiteContent): PageMatch {
  const path = normalizePath(pathname);
  if (path === "/") return { id: "home", path };
  if (path === "/homes") return { id: "homes", path };
  if (path === "/areas") return { id: "areas", path };
  if (path === "/sell") return { id: "sell", path };
  if (path === "/contact") return { id: "contact", path };
  if (path === "/faq") return { id: "faq", path };
  if (path === "/about") return { id: "about", path };
  const area = /^\/areas\/([a-z0-9-]+)$/.exec(path);
  if (area && content.pages.areas.towns.some((town) => town.slug === area[1])) {
    return { id: "area", path, slug: area[1] };
  }
  return { id: "notFound", path };
}

export function pageSeo(match: PageMatch, content: SiteContent, fallback: { title: string; description: string }) {
  if (match.id === "home") return fallback;
  if (match.id === "homes") {
    return { title: content.pages.homes.seoTitle, description: content.pages.homes.seoDescription };
  }
  if (match.id === "areas") {
    return { title: content.pages.areas.seoTitle, description: content.pages.areas.seoDescription };
  }
  if (match.id === "area") {
    const town = content.pages.areas.towns.find((item) => item.slug === match.slug);
    return {
      title: town?.seoTitle ?? fallback.title,
      description: town?.seoDescription ?? fallback.description,
    };
  }
  if (match.id === "sell") {
    return { title: content.pages.sell.seoTitle, description: content.pages.sell.seoDescription };
  }
  if (match.id === "contact") {
    return { title: content.pages.contact.seoTitle, description: content.pages.contact.seoDescription };
  }
  if (match.id === "faq") {
    return { title: content.pages.faq.seoTitle, description: content.pages.faq.seoDescription };
  }
  if (match.id === "about") {
    return { title: content.pages.about.seoTitle, description: content.pages.about.seoDescription };
  }
  return { title: content.pages.notFound.title, description: content.pages.notFound.description };
}
