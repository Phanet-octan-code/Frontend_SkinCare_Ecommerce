import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import en from './locales/en.json';
import km from './locales/km.json';
import zh from './locales/zh.json';

const translations = {
  en,
  km,
  zh,
};

export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', short: 'EN', nativeName: 'English' },
  { code: 'km', name: 'ភាសាខ្មែរ', short: 'KM', nativeName: 'ភាសាខ្មែរ' },
  { code: 'zh', name: '简体中文', short: 'ZH', nativeName: '简体中文' },
];

const STORAGE_KEY = 'skincare_boutique_lang';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'en' || saved === 'km' || saved === 'zh')) {
        return saved;
      }
      // Check browser navigator language
      const navLang = navigator.language || navigator.userLanguage || '';
      if (navLang.startsWith('km')) return 'km';
      if (navLang.startsWith('zh')) return 'zh';
    } catch {
      // Fallback
    }
    return 'en';
  });

  const setLanguage = useCallback((newLang) => {
    if (newLang === 'en' || newLang === 'km' || newLang === 'zh') {
      setLanguageState(newLang);
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
      } catch (e) {
        console.warn('Failed to save language to localStorage', e);
      }
    }
  }, []);

  // Synchronize document.documentElement attributes whenever language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.classList.remove('lang-en', 'lang-km', 'lang-zh');
    document.documentElement.classList.add(`lang-${language}`);

    if (document.body) {
      document.body.classList.remove('lang-en', 'lang-km', 'lang-zh');
      document.body.classList.add(`lang-${language}`);
    }
  }, [language]);

  /**
   * Helper translation function supporting nested keys (e.g., 'common.add_to_cart')
   * and parameter interpolation like {{threshold}} or {{count}}.
   */
  const t = useCallback(
    (key, params = {}) => {
      if (!key) return '';

      const keys = key.split('.');
      let current = translations[language];

      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          current = null;
          break;
        }
      }

      // Fallback to English if translation is missing in the chosen language
      if (current === null || current === undefined) {
        let fallback = translations.en;
        for (const k of keys) {
          if (fallback && typeof fallback === 'object' && k in fallback) {
            fallback = fallback[k];
          } else {
            fallback = null;
            break;
          }
        }
        current = fallback !== null && fallback !== undefined ? fallback : key;
      }

      if (typeof current !== 'string') {
        return String(current || key);
      }

      // Perform interpolation for {{param}}
      let result = current;
      if (params && typeof params === 'object') {
        Object.entries(params).forEach(([paramKey, paramVal]) => {
          const regex = new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g');
          result = result.replace(regex, String(paramVal ?? ''));
        });
      }

      return result;
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      availableLanguages: AVAILABLE_LANGUAGES,
      currentLanguageMeta: AVAILABLE_LANGUAGES.find((l) => l.code === language) || AVAILABLE_LANGUAGES[0],
      t,
    }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export const useTranslation = useLanguage;

