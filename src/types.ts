export type MediaType = 'series' | 'movie' | 'sports';

export type RatingCode = 'TV-MA' | 'TV-14' | 'PG-13' | 'PG' | 'TV-G' | 'R';

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  duration: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface MediaItem {
  id: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  type: MediaType;
  genre: string[];
  rating: RatingCode;
  rottenTomatoes?: {
    score: number;
    certified: boolean;
  };
  year: number;
  durationOrSeasons: string;
  synopsis: string;
  longDescription: string;
  backdropUrl: string;
  posterUrl: string;
  logoUrl?: string;
  streamVideoUrl: string;
  audioBadges: string[];
  cast: string[];
  creatorsOrDirectors: string[];
  episodes?: Episode[];
  rank?: number;
  isAppleOriginal?: boolean;
  matchPercentage?: number;
  progressPercent?: number; // for continue watching
  fallbackUrls?: string[];
  isLiveChannel?: boolean;
  channelCategory?: string;
}

export type ActiveTab = 'tv-plus' | 'mls' | 'up-next' | 'search';
