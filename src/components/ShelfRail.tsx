import React, { useRef, useState, useEffect } from 'react';
import type { MediaItem } from '../types';
import { MediaCard } from './MediaCard';
import { ChannelCard } from './ChannelCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ShelfRailProps {
  title: string;
  subtitle?: string;
  items: MediaItem[];
  aspect?: 'poster' | 'landscape';
  showRank?: boolean;
  isChannelRail?: boolean;
  onPlay: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (id: string) => boolean;
}

export const ShelfRail: React.FC<ShelfRailProps> = ({
  title,
  subtitle,
  items,
  aspect = 'landscape',
  showRank = false,
  isChannelRail = false,
  onPlay,
  onOpenDetails,
  onToggleWatchlist,
  isInWatchlist
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [visibleCount, setVisibleCount] = useState(40);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    // Progressively append more cards when scrolling near the end
    if (scrollLeft + clientWidth >= scrollWidth - 600) {
      setVisibleCount((prev) => Math.min(items.length, prev + 30));
    }
  };

  useEffect(() => {
    setVisibleCount(Math.min(items.length, 40));
  }, [items]);

  useEffect(() => {
    checkScroll();
    const current = scrollRef.current;
    if (current) {
      current.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (current) current.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [items, visibleCount]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    // When clicking right arrow, also pre-load more items if needed
    if (direction === 'right' && visibleCount < items.length) {
      setVisibleCount((prev) => Math.min(items.length, prev + 30));
    }
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (items.length === 0) return null;

  const displayedItems = items.slice(0, visibleCount);

  return (
    <div className="relative py-4 select-none">
      {/* Shelf Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-baseline justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white/95">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-white/60 font-normal mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Shelf Rail Container */}
      <div className="relative group/rail">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 hover:bg-black/90 hover:scale-110 active:scale-95 transition-all shadow-xl"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex items-start gap-3 sm:gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 pb-3 pt-1"
          style={{ scrollSnapType: 'x proximity' }}
        >
          {displayedItems.map((item) => (
            isChannelRail || item.isLiveChannel ? (
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
                aspect={aspect}
                showRank={showRank}
                onPlay={onPlay}
                onOpenDetails={onOpenDetails}
                onToggleWatchlist={onToggleWatchlist}
                isInWatchlist={isInWatchlist(item.id)}
              />
            )
          ))}
        </div>

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 hover:bg-black/90 hover:scale-110 active:scale-95 transition-all shadow-xl"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
