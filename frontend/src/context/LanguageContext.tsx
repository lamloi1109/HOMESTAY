"use client";

import React, { createContext, useContext, useState } from "react";

export type LanguageCode = "vi" | "en" | "cn" | "tw";

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "vi",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("gaoji-lang") as LanguageCode;
        if (saved && ["vi", "en", "cn", "tw"].includes(saved)) {
          return saved;
        }
      } catch {
        // Ignore localStorage error
      }
    }
    return "vi";
  });

  const setLang = (newLang: LanguageCode) => {
    setLangState(newLang);
    try {
      localStorage.setItem("gaoji-lang", newLang);
      const htmlLang = newLang === "cn" ? "zh-CN" : newLang === "tw" ? "zh-TW" : newLang;
      if (typeof document !== "undefined") {
        document.documentElement.lang = htmlLang;
      }
    } catch {
      // Ignore localStorage error
    }
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
