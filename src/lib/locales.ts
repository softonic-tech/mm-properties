export const LOCALES = ["en", "es", "de", "nl", "sv"] as const;

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

/** Language name as speakers would expect in the switcher. */
export function localeLabel(code: string) {
  if (code === "es") return "Español";
  if (code === "nl") return "Nederlands";
  if (code === "sv") return "Svenska";
  if (code === "de") return "German";
  return "English";
}
