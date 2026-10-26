import React from 'react';
import { Link } from 'react-router-dom';
import type { MediaItem } from '../types';
import { Play, Plus, Check, Info } from 'lucide-react';

interface MediaCardProps {
  item: MediaItem;
  aspect?: 'poster' | 'landscape';
  showRank?: boolean;
  onPlay: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  aspect = 'landscape',
  showRank = false,
  onPlay,
  onOpenDetails,
  onToggleWatchlist,
  isInWatchlist
}) => {
  const isLandscape = aspect === 'landscape';

  return (
    <div className="group relative flex-shrink-0 cursor-pointer select-none">
      <div 
        className={`relative overflow-hidden rounded-xl bg-zinc-900 border border-white/5 apple-card-hover ${
          isLandscape 
            ? 'w-64 sm:w-72 md:w-80 aspect-video' 
            : 'w-40 sm:w-48 md:w-52 aspect-[2/3]'
        }`}
        onClick={() => onOpenDetails(item)}
      >
        {/* Cover Image */}
        <img
          src={isLandscape ? item.backdropUrl : item.posterUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient shadow for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          {item.isAppleOriginal && (
            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-white/90 border border-white/10">
              Original
            </span>
          )}
          {item.rottenTomatoes && (
            <span className="ml-auto px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-[#FA320A] border border-white/10">
              {item.rottenTomatoes.score}%
            </span>
          )}
        </div>

        {/* Rank Number for Top 10 */}
        {showRank && typeof item.rank === 'number' && (
          <div className="absolute -bottom-3 -left-1 z-20 pointer-events-none">
            <span className="text-7xl sm:text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] opacity-95">
              {item.rank}
            </span>
          </div>
        )}

        {/* Bottom Title / Info overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 z-10 flex flex-col justify-end">
          <Link
            to={`/title/${item.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(item);
            }}
            className="text-sm font-semibold text-white drop-shadow-sm truncate hover:underline block"
          >
            {item.title}
          </Link>
          <p className="text-[11px] text-white/70 truncate">
            {item.genre.slice(0, 2).join(' · ')}
          </p>

          {/* Progress bar if continuing watching */}
          {typeof item.progressPercent === 'number' && (
            <div className="w-full bg-white/20 h-1 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full" 
                style={{ width: `${item.progressPercent}%` }} 
              />
            </div>
          )}
        </div>

        {/* Quick Action Overlay on Hover */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2.5 z-30">
          {/* Quick Play */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(item);
            }}
            className="p-3 rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-all shadow-lg"
            aria-label={`Play ${item.title}`}
          >
            <Play className="w-4 h-4 fill-black text-black ml-0.5" />
          </button>

          {/* Watchlist Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(item);
            }}
            className="p-3 rounded-full glass-pill text-white hover:scale-110 active:scale-95 transition-all"
            aria-label={isInWatchlist ? "Remove from Up Next" : "Add to Up Next"}
          >
            {isInWatchlist ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Plus className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Details Page Link */}
          <Link
            to={`/title/${item.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(item);
            }}
            className="p-3 rounded-full glass-pill text-white hover:scale-110 active:scale-95 transition-all inline-flex items-center justify-center"
            aria-label={`View details for ${item.title}`}
          >
            <Info className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
};
