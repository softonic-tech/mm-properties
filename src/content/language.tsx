import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { content as en, type SiteContent } from "@/content";
import { es } from "@/content/es";

export type Locale = "es" | "en";

const dictionaries: Record<Locale, SiteContent> = {
  es,
  en: en as unknown as SiteContent,
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  content: SiteContent;
} | null>(null);

function storedLocale(): Locale {
  const saved = localStorage.getItem("mm-locale");
  return saved === "en" || saved === "es" ? saved : "es";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(storedLocale);

  const setLocale = (next: Locale) => {
    localStorage.setItem("mm-locale", next);
    setLocaleState(next);
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title =
      locale === "es"
        ? "M&M Property | Costa del Sol"
        : "M&M Property | Costa del Sol";
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
