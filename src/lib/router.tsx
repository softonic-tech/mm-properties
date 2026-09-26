import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { normalizePath } from "@/lib/pages";

const RouteContext = createContext<string | null>(null);

function isInternalLink(anchor: HTMLAnchorElement, href: string) {
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  const url = new URL(href, window.location.origin);
  return url.origin === window.location.origin;
}

/** Keep the Spanish query on in-site links so each page stays in the chosen language. */
function destination(url: URL) {
  const spanish =
    new URLSearchParams(window.location.search).get("lang") === "es" ||
    localStorage.getItem("mm-locale") === "es";
  if (spanish) url.searchParams.set("lang", "es");
  else url.searchParams.delete("lang");
  return `${url.pathname}${url.search}${url.hash}`;
}

export function RouteProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const sync = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", sync);

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || !isInternalLink(anchor, anchor.getAttribute("href") ?? "")) return;
      const url = new URL(anchor.href);
      const next = destination(url);
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      event.preventDefault();
      if (next !== current) window.history.pushState({}, "", next);
      setPath(normalizePath(url.pathname));
      if (!url.hash) window.scrollTo(0, 0);
    };

    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", sync);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return <RouteContext.Provider value={path}>{children}</RouteContext.Provider>;
}

export function usePathname() {
  const path = useContext(RouteContext);
  if (path === null) throw new Error("usePathname must be used within RouteProvider");
  return path;
}
