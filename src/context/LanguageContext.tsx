import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  type SupportedLanguage,
  type TranslationKey,
  type LanguageOption,
  SUPPORTED_LANGUAGES,
  translations,
} from '../i18n/translations';

interface LanguageContextType {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey) => string;
  currentOption: LanguageOption;
  isLangModalOpen: boolean;
  setIsLangModalOpen: (open: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectInitialLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem('rukatv_lang') as SupportedLanguage;
    if (saved && ['es', 'es-ES', 'en', 'pt'].includes(saved)) {
      return saved;
    }
  } catch {
    // Local storage unavailable
  }

  // Detect browser language
  if (typeof navigator !== 'undefined') {
    const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
    if (browserLang.startsWith('pt')) return 'pt';
    if (browserLang === 'es-es') return 'es-ES';
    if (browserLang.startsWith('es')) return 'es';
    if (browserLang.startsWith('en')) return 'en';
  }

  return 'es'; // Default to Spanish
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLanguage>(detectInitialLanguage);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const setLang = (newLang: SupportedLanguage) => {
    setLangState(newLang);
    try {
      localStorage.setItem('rukatv_lang', newLang);
    } catch {
      // Storage unavailable
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = (key: TranslationKey): string => {
    const langDict = translations[lang] || translations.es;
    return (langDict as Record<string, string>)[key] || translations.es[key] || key;
  };

  const currentOption = SUPPORTED_LANGUAGES.find((opt) => opt.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentOption,
        isLangModalOpen,
        setIsLangModalOpen,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
