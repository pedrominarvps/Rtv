import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n/translations';
import { Globe, Check, X } from 'lucide-react';

export const LanguageModal: React.FC = () => {
  const { lang, setLang, t, isLangModalOpen, setIsLangModalOpen } = useTranslation();

  if (!isLangModalOpen) return null;

  const handleSelect = (code: SupportedLanguage) => {
    setLang(code);
    setIsLangModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn select-none"
      onClick={() => setIsLangModalOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/90">
              <Globe className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {t('langModal.title')}
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                {t('langModal.subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLangModalOpen(false)}
            className="p-2 rounded-full glass-pill text-white/60 hover:text-white transition-all"
            aria-label={t('langModal.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options list */}
        <div className="space-y-2 pt-2">
          {SUPPORTED_LANGUAGES.map((option) => {
            const isSelected = lang === option.code;
            return (
              <button
                key={option.code}
                onClick={() => handleSelect(option.code)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? 'bg-white/15 border-white/30 text-white shadow-lg'
                    : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="px-2.5 py-1 rounded-lg bg-black/50 text-[11px] font-mono font-bold tracking-wider text-white/80 border border-white/10">
                    {option.badge}
                  </span>
                  <div>
                    <span className="block text-sm font-semibold text-white">
                      {option.label}
                    </span>
                    <span className="block text-[11px] text-white/50">
                      {option.region}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-white/20" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-white/50">
          <span>{t('langModal.current')}:</span>
          <span className="font-semibold text-white/80">
            {SUPPORTED_LANGUAGES.find((opt) => opt.code === lang)?.label}
          </span>
        </div>
      </div>
    </div>
  );
};
