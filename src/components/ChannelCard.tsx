import React from 'react';
import type { MediaItem } from '../types';
import { Play, Radio, Plus, Check } from 'lucide-react';

interface ChannelCardProps {
  item: MediaItem;
  onPlay: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: boolean;
}

// Category accent colors for ambient card backgrounds
const CATEGORY_GRADIENTS: Record<string, string> = {
  Deportes: 'from-blue-900/40 via-zinc-900 to-black',
  Paraguay: 'from-red-950/40 via-zinc-900 to-black',
  Noticias: 'from-amber-950/40 via-zinc-900 to-black',
  Entretenimiento: 'from-purple-950/40 via-zinc-900 to-black',
  Premium: 'from-emerald-950/40 via-zinc-900 to-black',
  Peliculas: 'from-rose-950/40 via-zinc-900 to-black',
  Chile: 'from-sky-950/40 via-zinc-900 to-black',
  Colombia: 'from-yellow-950/40 via-zinc-900 to-black',
  Default: 'from-zinc-800/50 via-zinc-900 to-black',
};

export const ChannelCard: React.FC<ChannelCardProps> = ({
  item,
  onPlay,
  onToggleWatchlist,
  isInWatchlist
}) => {
  const categoryKey = item.channelCategory || item.genre[0] || 'Default';
  const gradientClass = CATEGORY_GRADIENTS[categoryKey] || CATEGORY_GRADIENTS.Default;

  return (
    <div 
      className="group relative flex-shrink-0 cursor-pointer select-none"
      onClick={() => onPlay(item)}
    >
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientClass} border border-white/10 apple-card-hover w-60 sm:w-68 aspect-video p-4 flex flex-col justify-between shadow-lg`}>
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Top Header: LIVE indicator & Category */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/80 backdrop-blur-md text-[10px] font-bold tracking-widest text-white uppercase border border-red-400/30">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>LIVE</span>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-semibold text-white/70 border border-white/10">
            {item.channelCategory || item.genre[0] || 'TV'}
          </span>
        </div>

        {/* Center: Prominent Channel Name */}
        <div className="relative z-10 text-center my-auto px-2">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md group-hover:text-purple-300 transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="text-[11px] font-medium text-white/50 tracking-wider uppercase mt-1">
            24/7 Broadcast
          </p>
        </div>

        {/* Bottom bar: Audio format badge */}
        <div className="relative z-10 flex items-center justify-between text-[10px] text-white/40 pt-1 border-t border-white/5">
          <span className="font-semibold tracking-wider text-white/60">HD Live</span>
          <span className="font-mono">RukaTV Channel</span>
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 z-30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(item);
            }}
            className="p-3.5 rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-all shadow-xl"
            aria-label={`Watch ${item.title}`}
          >
            <Play className="w-5 h-5 fill-black text-black ml-0.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(item);
            }}
            className="p-3 rounded-full glass-pill text-white hover:scale-110 active:scale-95 transition-all"
            aria-label={isInWatchlist ? "Remove channel" : "Add channel"}
          >
            {isInWatchlist ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Plus className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
