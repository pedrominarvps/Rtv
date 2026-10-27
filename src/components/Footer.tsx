import React from 'react';
import { Link } from 'react-router-dom';
import { RukaTvLogo } from './RukaTvLogo';
import { useTranslation } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, currentOption, setIsLangModalOpen } = useTranslation();

  return (
    <footer className="w-full bg-black border-t border-white/10 text-white/50 text-xs py-10 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top: Logo & Language selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <RukaTvLogo className="h-5 w-auto text-white/70" />
            <span className="text-white/40">|</span>
            <span className="text-white/80 font-medium">{t('footer.tagline')}</span>
          </div>

          {/* Interactive Region & Language Switcher Button */}
          <button
            onClick={() => setIsLangModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer text-xs"
            aria-label={t('langModal.title')}
          >
            <Globe className="w-4 h-4 text-purple-400" />
            <span className="font-medium">{currentOption.label}</span>
          </button>
        </div>

        {/* Legal and compliance disclaimer */}
        <div className="space-y-2 text-[11px] leading-relaxed text-white/40">
          <p>{t('footer.disclaimer1')}</p>
          <p>{t('footer.disclaimer2')}</p>
        </div>

        {/* Links & Copyright */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-white/5 text-[11px]">
          <div>
            Copyright © {new Date().getFullYear()} RukaTV Inc. {t('footer.rights')}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/60">
            <Link 
              to="/legal/privacy" 
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t('footer.privacy')}
            </Link>
            <span className="text-white/30">·</span>
            <Link 
              to="/legal/terms" 
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t('footer.terms')}
            </Link>
            <span className="text-white/30">·</span>
            <Link 
              to="/legal/sales" 
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t('footer.sales')}
            </Link>
            <span className="text-white/30">·</span>
            <Link 
              to="/legal/legal" 
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t('footer.legal')}
            </Link>
            <span className="text-white/30">·</span>
            <Link 
              to="/legal/support" 
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t('footer.support')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
