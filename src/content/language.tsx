import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { content as en, type SiteContent } from "@/content";
import { es } from "@/content/es";

export type Locale = "en" | "es";

const dictionaries: Record<Locale, SiteContent> = {
  es,
  en: en as unknown as SiteContent,
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  content: SiteContent;
} | null>(null);

function localeFromUrl(): Locale | null {
  const lang = new URLSearchParams(window.location.search).get("lang");
  return lang === "en" || lang === "es" ? lang : null;
}

function storedLocale(): Locale {
  return localeFromUrl() ?? (localStorage.getItem("mm-locale") === "es" ? "es" : "en");
}

function writeLocaleUrl(next: Locale) {
  const url = new URL(window.location.href);
  if (next === "es") url.searchParams.set("lang", "es");
  else url.searchParams.delete("lang");
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
