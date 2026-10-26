import React from 'react';
import type { MediaItem } from '../types';
import { MediaCard } from './MediaCard';
import { ChannelCard } from './ChannelCard';
import { Bookmark, Tv } from 'lucide-react';

interface UpNextSectionProps {
  watchlistItems: MediaItem[];
  continueWatchingItems: MediaItem[];
  onPlay: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (id: string) => boolean;
  onExplore: () => void;
}

export const UpNextSection: React.FC<UpNextSectionProps> = ({
  watchlistItems,
  continueWatchingItems,
  onPlay,
  onOpenDetails,
  onToggleWatchlist,
  isInWatchlist,
  onExplore
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-12 select-none animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Up Next
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Your personal queue and synced playback across all RukaTV devices.
        </p>
      </div>

      {/* Continue Watching (if any) */}
      {continueWatchingItems.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white/90">
            Continue Watching
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {continueWatchingItems.map(item => (
              <MediaCard
                key={item.id}
                item={item}
                aspect="landscape"
                onPlay={onPlay}
                onOpenDetails={onOpenDetails}
                onToggleWatchlist={onToggleWatchlist}
                isInWatchlist={isInWatchlist(item.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Watchlist Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white/90">
          Saved to Up Next ({watchlistItems.length})
        </h2>

        {watchlistItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {watchlistItems.map(item => (
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
                  onOpenDetails={onOpenDetails}
                  onToggleWatchlist={onToggleWatchlist}
                  isInWatchlist={isInWatchlist(item.id)}
                />
              )
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 rounded-2xl glass-card text-center space-y-4">
            <div className="p-4 rounded-full bg-white/10 text-white/70">
              <Bookmark className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Your queue is empty</h3>
            <p className="text-sm text-white/60 max-w-sm">
              Explore Ruka Originals, award-winning movies, and hit series. Add them to Up Next to easily continue watching later.
            </p>
            <button
              onClick={onExplore}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-white/90 active:scale-95 transition-all shadow-md"
            >
              <Tv className="w-4 h-4" />
              <span>Explore Originals</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
