import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { RukaTvLogo } from './RukaTvLogo';
import { useTranslation } from '../context/LanguageContext';
import { Search, Bookmark, Tv, Radio, User, Menu, X, Globe } from 'lucide-react';

interface NavbarProps {
  watchlistCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ watchlistCount }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t, currentOption, setIsLangModalOpen } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: '/', label: t('nav.home'), icon: Tv, end: true },
    { to: '/tv-season', label: t('nav.tvSeason'), icon: Radio },
    { to: '/up-next', label: t('nav.upNext'), icon: Bookmark, badge: watchlistCount },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'glass-nav py-3.5 border-b border-white/10 shadow-2xl shadow-black/80' 
            : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="text-white hover:opacity-85 transition-opacity focus:outline-none"
              aria-label="RukaTV+ Home"
            >
              <RukaTvLogo className="h-6 w-auto" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-white/15 text-white shadow-inner font-semibold' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 opacity-75" />
                    <span>{item.label}</span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 bg-white/20 text-[11px] rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right: Language, Search & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Language Toggle Pill */}
            <button
              onClick={() => setIsLangModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
              title={t('langModal.title')}
              aria-label={t('langModal.title')}
            >
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-mono text-[11px] font-bold">{currentOption.badge}</span>
            </button>

            {/* Search Trigger Route Link */}
            <Link
              to="/search"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                location.pathname === '/search'
                  ? 'bg-white text-black border-white shadow-sm'
                  : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/15 hover:text-white hover:border-white/25'
              }`}
              aria-label={t('nav.search')}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('nav.search')}...</span>
            </Link>

            {/* Sign In / Account Pill */}
            <button
              onClick={() => alert("Ruka Account")}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90 active:scale-95 transition-all shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('nav.signIn')}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-nav border-b border-white/10 px-4 pt-3 pb-6 animate-fadeIn">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-white/20 text-white font-semibold' 
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="px-2 py-0.5 bg-white/20 text-xs rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}

              <div className="pt-3 border-t border-white/10 space-y-2">
                <Link
                  to="/search"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('nav.search')}</span>
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLangModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span>{currentOption.label}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-white/20 text-xs rounded-md font-mono font-bold">
                    {currentOption.badge}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
