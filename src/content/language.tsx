import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { content as en, type SiteContent } from "@/content";
import { es } from "@/content/es";
import { nl } from "@/content/nl";
import { sv } from "@/content/sv";
import { de } from "@/content/de";
import { LOCALES, isLocale, localeName, type Locale } from "@/lib/locales";

export type { Locale };
export { LOCALES, isLocale, localeName };

const dictionaries: Record<Locale, SiteContent> = {
  en: en as unknown as SiteContent,
  es,
  nl,
  sv,
  de,
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  content: SiteContent;
} | null>(null);

function localeFromUrl(): Locale | null {
  const lang = new URLSearchParams(window.location.search).get("lang");
  return isLocale(lang) ? lang : null;
}

function storedLocale(): Locale {
  return localeFromUrl() ?? (isLocale(localStorage.getItem("mm-locale")) ? localStorage.getItem("mm-locale") as Locale : "en");
}

export function writeLocaleUrl(next: Locale) {
  const url = new URL(window.location.href);
  if (next === "en") url.searchParams.delete("lang");
  else url.searchParams.set("lang", next);
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(storedLocale);

  const setLocale = (next: Locale) => {
    localStorage.setItem("mm-locale", next);
    writeLocaleUrl(next);
    setLocaleState(next);
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem("mm-locale", locale);
  }, [locale]);

  useEffect(() => {
    const sync = () => setLocaleState(storedLocale());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, content: dictionaries[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useContent() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useContent must be used within LanguageProvider");
  return value.content;
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used within LanguageProvider");
  return { locale: value.locale, setLocale: value.setLocale };
}
