export const LOCALES = ["en", "es", "nl", "sv", "de"] as const;

export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function localeName(code: string) {
  if (code === "es") return "Spanish";
  if (code === "nl") return "Dutch";
  if (code === "sv") return "Swedish";
  if (code === "de") return "German";
  return "English";
}
