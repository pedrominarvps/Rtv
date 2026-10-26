import React, { useState, useMemo } from 'react';
import type { MediaItem } from '../types';
import { ChannelCard } from './ChannelCard';
import { Play, Trophy, Calendar, Radio } from 'lucide-react';

interface MlsSectionProps {
  mlsItems: MediaItem[];
  onPlay: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (id: string) => boolean;
}

export const MlsSection: React.FC<MlsSectionProps> = ({
  mlsItems,
  onPlay,
  onToggleWatchlist,
  isInWatchlist
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    mlsItems.forEach(item => {
      if (item.channelCategory) cats.add(item.channelCategory);
      else if (item.genre[0]) cats.add(item.genre[0]);
    });
    return ['All', ...Array.from(cats)];
  }, [mlsItems]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return mlsItems;
    return mlsItems.filter(item => 
      item.channelCategory === selectedCategory || item.genre.includes(selectedCategory)
    );
  }, [mlsItems, selectedCategory]);

  const featuredMatch = mlsItems[0];

  if (mlsItems.length === 0) {
    return (
      <div className="pt-32 pb-24 text-center select-none space-y-3">
        <p className="text-lg font-semibold text-white/80">No hay canales de televisión disponibles</p>
        <p className="text-sm text-white/50">Verifica la conexión con el servidor Xtream Code.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 select-none animate-fadeIn space-y-12">
      {/* Live Spotlight Banner */}
      {featuredMatch && (
        <section className="relative w-full h-[55vh] min-h-[420px] max-h-[600px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950 via-zinc-950 to-black" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 z-10">
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/80 backdrop-blur-md text-white text-xs font-bold tracking-wider uppercase border border-red-500/30">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Live 24/7 on RukaTV+</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {featuredMatch.title}
              </h1>

              <p className="text-sm sm:text-base text-white/80">
                {featuredMatch.synopsis}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onPlay(featuredMatch)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 active:scale-95 transition-all shadow-lg"
                >
                  <Play className="w-4 h-4 fill-black text-black ml-0.5" />
                  <span>Watch Channel</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Live TV Channels Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>TV Season Live Channels</span>
            </h2>
            <p className="text-xs text-white/60 mt-0.5">
              Stream 24/7 television channels directly from the Xtream server.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/60">
            <Calendar className="w-4 h-4" />
            <span>{filteredItems.length} Available Channels</span>
          </div>
        </div>

        {/* Category Pills */}
        {categories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-white text-black shadow-md' 
                    : 'glass-pill text-white/70 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid of Clean Channels Highlighting Name */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredItems.map(item => (
            <ChannelCard
              key={item.id}
              item={item}
              onPlay={onPlay}
              onToggleWatchlist={onToggleWatchlist}
              isInWatchlist={isInWatchlist(item.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
