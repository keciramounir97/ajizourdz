import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import ar from "../i18n/ar.json";
import en from "../i18n/en.json";
import fr from "../i18n/fr.json";
import { Locale } from "../types/domain";

const translations: Record<Locale, Record<string, string>> = { fr, en, ar };
const storageKey = "ajizor-locale-v2";

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
} | null>(null);

function getInitialLocale(): Locale {
  const stored = localStorage.getItem(storageKey) as Locale | null;
  return stored && translations[stored] ? stored : "ar";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    localStorage.setItem(storageKey, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: string) => translations[locale][key] ?? key,
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("LocaleContext missing");
  return context;
}
