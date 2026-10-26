import React, { useEffect } from 'react';
import type { MediaItem } from '../types';
import { MlsSection } from '../components/MlsSection';
import { CatalogSkeleton } from '../components/CatalogSkeleton';
import { updatePageSeo } from '../utils/seo';

interface TvSeasonPageProps {
  liveChannels: MediaItem[];
  loading: boolean;
  onPlay: (item: MediaItem, videoUrl?: string) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (id: string) => boolean;
}

export const TvSeasonPage: React.FC<TvSeasonPageProps> = ({
  liveChannels,
  loading,
  onPlay,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  useEffect(() => {
    updatePageSeo({
      title: 'TV Season · Live 24/7 Channels',
      description: 'Stream over 200 live television channels, sports, and international broadcasts in high definition on RukaTV+.',
      url: window.location.href,
    });
  }, []);

  if (loading) {
    return <CatalogSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      <MlsSection
        mlsItems={liveChannels}
        onPlay={onPlay}
        onOpenDetails={(item) => onPlay(item)}
        onToggleWatchlist={onToggleWatchlist}
        isInWatchlist={isInWatchlist}
      />
    </div>
  );
};
