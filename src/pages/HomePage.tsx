import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MediaItem } from '../types';
import type { XtreamCatalogData } from '../services/xtreamService';
import { FlowcaseHero } from '../components/FlowcaseHero';
import { ShelfRail } from '../components/ShelfRail';
import { CatalogSkeleton } from '../components/CatalogSkeleton';
import { updatePageSeo } from '../utils/seo';
import { AlertCircle } from 'lucide-react';

interface HomePageProps {
  catalog: XtreamCatalogData;
  loading: boolean;
  errorMessage: string | null;
  watchlistItems: MediaItem[];
  onPlay: (item: MediaItem, videoUrl?: string) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (id: string) => boolean;
  onRetry: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  catalog,
  loading,
  errorMessage,
  watchlistItems,
  onPlay,
  onToggleWatchlist,
  isInWatchlist,
  onRetry,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSeo({
      title: 'Stream Originals, Movies & Live TV',
      description: 'Stream award-winning Ruka Originals, hit blockbuster movies, binge-worthy series, and 24/7 TV channels with RukaTV+.',
      url: window.location.href,
    });
  }, []);

  if (loading) {
    return <CatalogSkeleton />;
  }

  if (catalog.allCatalog.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 space-y-4 select-none animate-fadeIn pt-28">
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/20 text-red-400 shadow-2xl">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">No se pudo cargar el catálogo</h2>
        <p className="text-sm text-white/60 max-w-md">
          {errorMessage || 'Verifica la conexión con el servidor Xtream Code en .env o el estado de tu red.'}
        </p>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-white/90 active:scale-95 transition-all shadow-md"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Epic 8:3 Showcase Hero Banner */}
      {catalog.featuredHeroes.length > 0 && (
        <FlowcaseHero
          items={catalog.featuredHeroes}
          onPlay={onPlay}
          onOpenDetails={(item) => navigate(`/title/${item.id}`)}
          onToggleWatchlist={onToggleWatchlist}
          isInWatchlist={isInWatchlist}
        />
      )}

      {/* In Progress / Continue Watching (if user has active queue) */}
      {watchlistItems.length > 0 && (
        <ShelfRail
          title="Up Next"
          subtitle="Pick up right where you left off"
          items={watchlistItems}
          aspect="landscape"
          onPlay={onPlay}
          onOpenDetails={(item) => navigate(`/title/${item.id}`)}
          onToggleWatchlist={onToggleWatchlist}
          isInWatchlist={isInWatchlist}
        />
      )}

      {/* Top 10 on RukaTV with custom rankings */}
      {catalog.topTen.length > 0 && (
        <ShelfRail
          title="Top 10 on RukaTV"
          subtitle="The most-watched series and movies this week"
          items={catalog.topTen}
          aspect="poster"
          showRank={true}
          onPlay={onPlay}
          onOpenDetails={(item) => navigate(`/title/${item.id}`)}
          onToggleWatchlist={onToggleWatchlist}
          isInWatchlist={isInWatchlist}
        />
      )}

      {/* Movies Shelf */}
      {catalog.movies.length > 0 && (
        <ShelfRail
          title="Blockbuster Movies"
          subtitle="Stream hit feature films in 4K UHD and Dolby Atmos"
          items={catalog.movies}
          aspect="poster"
          onPlay={onPlay}
          onOpenDetails={(item) => navigate(`/title/${item.id}`)}
          onToggleWatchlist={onToggleWatchlist}
          isInWatchlist={isInWatchlist}
        />
      )}

      {/* Series Shelf */}
      {catalog.series.length > 0 && (
        <ShelfRail
          title="Top Series & Dramas"
          subtitle="Binge full seasons and exclusive episodes"
          items={catalog.series}
          aspect="landscape"
          onPlay={onPlay}
          onOpenDetails={(item) => navigate(`/title/${item.id}`)}
          onToggleWatchlist={onToggleWatchlist}
          isInWatchlist={isInWatchlist}
        />
      )}

      {/* Live TV Channels Shelf */}
      {catalog.liveChannels.length > 0 && (
        <ShelfRail
          title="Live TV Channels"
          subtitle="24/7 sports, news, and live broadcasts"
          items={catalog.liveChannels}
          aspect="landscape"
          isChannelRail={true}
          onPlay={onPlay}
          onOpenDetails={(item) => onPlay(item)}
          onToggleWatchlist={onToggleWatchlist}
          isInWatchlist={isInWatchlist}
        />
      )}

      {/* Additional Curated Feature Films */}
      {catalog.movies.length > 15 && (
        <ShelfRail
          title="Featured Cinema & Action"
          subtitle="Critically acclaimed movies streaming in 4K"
          items={catalog.movies.slice(15, 30)}
          aspect="landscape"
          onPlay={onPlay}
          onOpenDetails={(item) => navigate(`/title/${item.id}`)}
          onToggleWatchlist={onToggleWatchlist}
          isInWatchlist={isInWatchlist}
        />
      )}
    </div>
  );
};
