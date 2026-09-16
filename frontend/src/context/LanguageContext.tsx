"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";

export type LanguageCode = "vi" | "en" | "cn" | "tw";

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "vi",
  setLang: () => {},
});

const LANGUAGE_STORAGE_KEY = "gaoji-lang";
const LANGUAGE_CHANGE_EVENT = "gaoji-language-change";
const SUPPORTED_LANGUAGES: LanguageCode[] = ["vi", "en", "cn", "tw"];
let memoryLanguage: LanguageCode = "vi";

const getServerLanguage = (): LanguageCode => "vi";

const getStoredLanguage = (): LanguageCode => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode | null;
    return saved && SUPPORTED_LANGUAGES.includes(saved) ? saved : memoryLanguage;
  } catch {
    return memoryLanguage;
  }
};

const subscribeToLanguage = (onStoreChange: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === LANGUAGE_STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
  };
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // The server snapshot stays Vietnamese during hydration; React reads localStorage
  // immediately after hydration without rendering different server/client text.
  const lang = useSyncExternalStore(
    subscribeToLanguage,
    getStoredLanguage,
    getServerLanguage,
  );

  useEffect(() => {
    document.documentElement.lang = lang === "cn" ? "zh-CN" : lang === "tw" ? "zh-TW" : lang;
  }, [lang]);

  const setLang = (newLang: LanguageCode) => {
    memoryLanguage = newLang;
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch {
      // Ignore localStorage error
    }
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
