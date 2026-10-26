import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MediaItem } from '../types';
import { UpNextSection } from '../components/UpNextSection';
import { updatePageSeo } from '../utils/seo';

interface UpNextPageProps {
  watchlistItems: MediaItem[];
  continueWatchingItems: MediaItem[];
  onPlay: (item: MediaItem, videoUrl?: string) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (id: string) => boolean;
}

export const UpNextPage: React.FC<UpNextPageProps> = ({
  watchlistItems,
  continueWatchingItems,
  onPlay,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSeo({
      title: 'Up Next Queue',
      description: 'Your personal queue and synced playback across all devices on RukaTV+.',
      url: window.location.href,
    });
  }, []);

  return (
    <div className="animate-fadeIn pb-16">
      <UpNextSection
        watchlistItems={watchlistItems}
        continueWatchingItems={continueWatchingItems}
        onPlay={onPlay}
        onOpenDetails={(item) => navigate(`/title/${item.id}`)}
        onToggleWatchlist={onToggleWatchlist}
        isInWatchlist={isInWatchlist}
        onExplore={() => navigate('/')}
      />
    </div>
  );
};
