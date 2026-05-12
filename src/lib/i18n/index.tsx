"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Lang, LANGS, translations, TranslationKey } from "./translations";

const STORAGE_KEY = "firmacheck-lang";

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function detectInitialLang(): Lang {
  if (typeof document !== "undefined") {
    const fromAttr = document.documentElement.dataset.lang as Lang | undefined;
    if (fromAttr && (LANGS as readonly string[]).includes(fromAttr)) {
      return fromAttr;
    }
  }
  return "cs";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("cs");

  useEffect(() => {
    setLangState(detectInitialLang());
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
    document.documentElement.lang = l;
    document.documentElement.dataset.lang = l;
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const dict = translations[lang];
    return {
      lang,
      setLang,
      t: (key, params) => {
        let str = dict[key] ?? key;
        if (params) {
          for (const [k, v] of Object.entries(params)) {
            str = str.replaceAll(`{${k}}`, v);
          }
        }
        return str;
      },
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used inside I18nProvider");
  return ctx;
}

export { LANGS, LANG_LABELS, LANG_SHORT } from "./translations";
export type { Lang } from "./translations";
