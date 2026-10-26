import React from 'react';
import { RukaTvLogo } from './RukaTvLogo';
import { Loader2 } from 'lucide-react';

export const CatalogSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-10 select-none animate-fadeIn">
      {/* Hero Showcase Skeleton */}
      <section className="relative w-full h-[72vh] min-h-[520px] max-h-[760px] overflow-hidden bg-gradient-to-b from-zinc-900/60 via-zinc-950 to-black">
        {/* Ambient subtle light orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Center Connecting Spinner & Logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 space-y-4">
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
            <RukaTvLogo className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-white/80 shadow-lg">
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            <span>Conectando y sincronizando catálogo Xtream...</span>
          </div>
        </div>

        {/* Shimmer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 max-w-7xl mx-auto space-y-4 z-20 opacity-40">
          <div className="h-4 w-28 bg-white/10 rounded-full animate-pulse" />
          <div className="h-10 sm:h-14 w-80 sm:w-96 bg-white/10 rounded-xl animate-pulse" />
          <div className="h-4 w-64 bg-white/10 rounded-full animate-pulse" />
          <div className="flex items-center gap-3 pt-2">
            <div className="h-10 w-32 bg-white/10 rounded-full animate-pulse" />
            <div className="h-10 w-36 bg-white/10 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Shelf Rails Skeletons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top 10 Poster Shelf Skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-48 bg-white/10 rounded-md animate-pulse" />
          <div className="h-3.5 w-72 bg-white/5 rounded-md animate-pulse" />
          <div className="flex gap-4 overflow-hidden pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="w-40 sm:w-48 md:w-52 aspect-[2/3] rounded-xl bg-zinc-900/80 border border-white/5 animate-pulse flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Blockbuster Movies Shelf Skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-56 bg-white/10 rounded-md animate-pulse" />
          <div className="h-3.5 w-64 bg-white/5 rounded-md animate-pulse" />
          <div className="flex gap-4 overflow-hidden pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="w-40 sm:w-48 md:w-52 aspect-[2/3] rounded-xl bg-zinc-900/80 border border-white/5 animate-pulse flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Series Shelf Skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-52 bg-white/10 rounded-md animate-pulse" />
          <div className="h-3.5 w-80 bg-white/5 rounded-md animate-pulse" />
          <div className="flex gap-4 overflow-hidden pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="w-64 sm:w-72 md:w-80 aspect-video rounded-xl bg-zinc-900/80 border border-white/5 animate-pulse flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
