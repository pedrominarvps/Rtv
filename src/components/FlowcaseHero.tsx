import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { MediaItem } from '../types';
import { RatingBadges } from './RatingBadges';
import { useTranslation } from '../context/LanguageContext';
import { Play, Plus, Check, Info, ChevronLeft, ChevronRight } from 'lucide-react';

interface FlowcaseHeroProps {
  items: MediaItem[];
  onPlay: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (id: string) => boolean;
}

export const FlowcaseHero: React.FC<FlowcaseHeroProps> = ({
  items,
  onPlay,
  onOpenDetails,
  onToggleWatchlist,
  isInWatchlist
}) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const activeItem = items[currentIndex] || items[0];

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, items.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const inWatchlist = isInWatchlist(activeItem.id);

  return (
    <section 
      className="relative w-full h-[76vh] min-h-[580px] max-h-[820px] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured Showcase"
    >
      {/* Background Image Carousel with Smooth Crossfade */}
      {items.map((item, idx) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <img
            src={item.backdropUrl}
            alt={item.title}
            className="w-full h-full object-cover object-center filter brightness-95"
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Cinematic Vignette Overlays (Apple TV dark gradient wash) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent w-full md:w-3/4" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 z-20">
        <div className="max-w-2xl space-y-4">
          {/* Ruka Original Label */}
          {activeItem.isAppleOriginal && (
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span>{t('hero.original')}</span>
            </div>
          )}

          {/* Title Lockup */}
          <Link
            to={`/title/${activeItem.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(activeItem);
            }}
            className="hover:underline focus:outline-none block"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
              {activeItem.title}
            </h1>
          </Link>

          {/* Tagline / Subtitle */}
          {activeItem.tagline && (
            <p className="text-lg sm:text-xl font-medium text-white/90 drop-shadow">
              {activeItem.tagline}
            </p>
          )}

          {/* Badges strip: Ratings, Rotten Tomatoes, 4K HDR */}
          <div className="pt-1">
            <RatingBadges
              rating={activeItem.rating}
              rottenTomatoes={activeItem.rottenTomatoes}
              audioBadges={activeItem.audioBadges.slice(0, 3)}
            />
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-white/80 line-clamp-3 leading-relaxed max-w-xl">
            {activeItem.synopsis}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {/* Primary: Stream Now */}
            <button
              onClick={() => onPlay(activeItem)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 active:scale-95 transition-all shadow-lg shadow-white/10"
            >
              <Play className="w-4 h-4 fill-black text-black" />
              <span>{t('hero.streamNow')}</span>
            </button>

            {/* Secondary: Add to Up Next */}
            <button
              onClick={() => onToggleWatchlist(activeItem)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all ${
                inWatchlist 
                  ? 'bg-white/30 text-white border border-white/40' 
                  : 'glass-pill text-white'
              }`}
            >
              {inWatchlist ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>{t('hero.inUpNext')}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-white" />
                  <span>{t('hero.addToUpNext')}</span>
                </>
              )}
            </button>

            {/* Tertiary: Info & Episodes */}
            <Link
              to={`/title/${activeItem.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(activeItem);
              }}
              className="p-3 rounded-full glass-pill text-white hover:text-white transition-all inline-flex items-center justify-center"
              aria-label={t('hero.moreInfo')}
            >
              <Info className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Carousel Indicators and Navigation Arrows */}
        <div className="absolute right-4 sm:right-8 bottom-16 flex items-center gap-3 z-30">
          {/* Arrow Left */}
          <button
            onClick={handlePrev}
            className="p-2 rounded-full glass-pill text-white/70 hover:text-white transition-all"
            aria-label="Previous Featured Item"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Pagination Bars */}
          <div className="flex items-center gap-1.5">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-7 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Arrow Right */}
          <button
            onClick={handleNext}
            className="p-2 rounded-full glass-pill text-white/70 hover:text-white transition-all"
            aria-label="Next Featured Item"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
