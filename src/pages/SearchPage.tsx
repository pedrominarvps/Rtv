import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { MediaItem } from '../types';
import { MediaCard } from '../components/MediaCard';
import { ChannelCard } from '../components/ChannelCard';
import { updatePageSeo } from '../utils/seo';
import { useTranslation } from '../context/LanguageContext';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchPageProps {
  catalog: MediaItem[];
  loading: boolean;
  onPlay: (item: MediaItem, videoUrl?: string) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (id: string) => boolean;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  catalog,
  loading,
  onPlay,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(60);

  const categories = [
    { id: 'All', label: t('tv.all') },
    { id: 'Live TV', label: t('tv.header') },
    { id: 'Series', label: 'Series' },
    { id: 'Movies', label: t('tv.movies') },
    { id: 'Sports', label: t('tv.sports') },
    { id: 'Drama', label: 'Drama' },
    { id: 'Comedy', label: 'Comedy' },
    { id: 'Sci-Fi', label: 'Sci-Fi' },
  ];

  // Sync state with URL params
  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  // SEO Update
  useEffect(() => {
    updatePageSeo({
      title: query ? `${t('search.title')}: "${query}"` : t('search.title'),
      description: 'Search and stream thousands of movies, exclusive series, and 24/7 TV channels on RukaTV+.',
      url: window.location.href,
    });
  }, [query, t]);

  const filteredItems = useMemo(() => {
    return catalog.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Live TV' && !item.isLiveChannel) return false;
        if (selectedCategory === 'Series' && item.type !== 'series') return false;
        if (selectedCategory === 'Movies' && item.type !== 'movie') return false;
        if (selectedCategory === 'Sports' && item.type !== 'sports') return false;
        if (['Sci-Fi', 'Drama', 'Comedy'].includes(selectedCategory)) {
          if (!item.genre.some((g) => g.toLowerCase().includes(selectedCategory.toLowerCase()))) {
            return false;
          }
        }
      }

      // Search query filter
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchGenre = item.genre.some((g) => g.toLowerCase().includes(q));
      const matchCast = item.cast.some((c) => c.toLowerCase().includes(q));
      const matchSynopsis = item.synopsis.toLowerCase().includes(q);

      return matchTitle || matchGenre || matchCast || matchSynopsis;
    });
  }, [catalog, query, selectedCategory]);

  // Reset pagination when filter or search changes
  useEffect(() => {
    setVisibleCount(60);
  }, [query, selectedCategory]);

  // Infinite scroll listener for search grid
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
        setVisibleCount((prev) => Math.min(filteredItems.length, prev + 60));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredItems.length]);

  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 select-none animate-fadeIn space-y-8">
      {/* Search Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('search.title')}
        </h1>
        <p className="text-sm text-white/60 mt-1">
          {t('search.subtitle')}
        </p>
      </div>

      {/* Main Search Input */}
      <div className="relative max-w-3xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder={t('search.placeholder')}
          autoFocus
          className="w-full bg-white/10 text-white placeholder-white/40 pl-12 pr-10 py-4 rounded-2xl text-base font-medium border border-white/10 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all shadow-xl"
        />
        {query && (
          <button
            onClick={() => handleQueryChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            aria-label="Clear"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-white text-black shadow-md'
                : 'glass-pill text-white/70 hover:text-white'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Results Header Counter */}
      <div className="flex items-center justify-between text-xs text-white/50 font-medium border-b border-white/10 pb-3">
        <span>{filteredItems.length} {t('search.found')}</span>
        {query && <span>{t('search.showing')} "{query}"</span>}
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="py-24 flex items-center justify-center gap-3 text-white/60">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          <span>{t('search.loading')}</span>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {displayedItems.map((item) =>
              item.isLiveChannel ? (
                <ChannelCard
                  key={item.id}
                  item={item}
                  onPlay={onPlay}
                  onToggleWatchlist={onToggleWatchlist}
                  isInWatchlist={isInWatchlist(item.id)}
                />
              ) : (
                <MediaCard
                  key={item.id}
                  item={item}
                  aspect="poster"
                  onPlay={onPlay}
                  onOpenDetails={(target) => navigate(`/title/${target.id}`)}
                  onToggleWatchlist={onToggleWatchlist}
                  isInWatchlist={isInWatchlist(item.id)}
                />
              )
            )}
          </div>

          {visibleCount < filteredItems.length && (
            <div className="pt-4 pb-6 text-center">
              <button
                onClick={() => setVisibleCount((prev) => Math.min(filteredItems.length, prev + 60))}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all border border-white/10 backdrop-blur-md"
              >
                Cargar más ({displayedItems.length} de {filteredItems.length})
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-24 space-y-3">
          <p className="text-lg font-semibold text-white/80">{t('search.noResultsTitle')}</p>
          <p className="text-sm text-white/50 max-w-sm mx-auto">
            {t('search.noResultsDesc')}
          </p>
        </div>
      )}
    </div>
  );
};
