import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations from './translations';

const LanguageContext = createContext();

const LANG_STORAGE_KEY = 'ai_civic_access_language';

export function LanguageProvider({ children }) {
  // Persist language selection locally
  const [language, setLanguage] = useState(() => {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      return stored === 'hi' || stored === 'en' ? stored : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = language;
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }, [language]);

  const t = useCallback(
    (key) => translations[language]?.[key] ?? translations.en[key] ?? key,
    [language],
  );

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
