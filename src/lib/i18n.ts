export type Locale = "sl" | "hr" | "en";

export const DEFAULT_LOCALE: Locale = "sl";
export const SUPPORTED_LOCALES: readonly Locale[] = ["sl", "hr", "en"];

export const localeNames: Record<Locale, string> = {
  sl: "Slovenščina",
  hr: "Hrvatski",
  en: "English",
};

export const localeLanguageNames: Record<Locale, string> = {
  sl: "slovenščini",
  hr: "hrvaščini",
  en: "English",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "sl" || value === "hr" || value === "en";
}

export function localePrefix(locale: Locale): string {
  return locale === "sl" ? "" : `/${locale}`;
}

export function localizePath(locale: Locale, path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "sl") return normalized;
  if (normalized === "/") return `/${locale}/`;
  return `/${locale}${normalized}`;
}

export function canonicalUrl(locale: Locale, path = "/"): string {
  return `https://nuvelistudio.com${localizePath(locale, path)}`;
}

export function hreflangLinks(path = "/") {
  return [
    { rel: "alternate", hrefLang: "sl", href: canonicalUrl("sl", path) },
    { rel: "alternate", hrefLang: "hr", href: canonicalUrl("hr", path) },
    { rel: "alternate", hrefLang: "en", href: canonicalUrl("en", path) },
    { rel: "alternate", hrefLang: "x-default", href: canonicalUrl("sl", path) },
  ];
}

export function htmlLang(locale: Locale): string {
  return locale;
}
