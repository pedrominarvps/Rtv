import type { MediaItem, Episode } from '../types';

export interface XtreamConfig {
  server: string;
  user: string;
  pass: string;
  isConfigured: boolean;
}

export const getXtreamConfig = (): XtreamConfig => {
  const server = (import.meta.env.VITE_XTREAM_SERVER || '').replace(/\/+$/, '');
  const user = import.meta.env.VITE_XTREAM_USER || '';
  const pass = import.meta.env.VITE_XTREAM_PASS || '';

  return {
    server,
    user,
    pass,
    isConfigured: Boolean(server && user && pass),
  };
};

function fixImageUrl(url?: string): string {
  if (!url) {
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop';
  }
  let clean = url.trim();
  // Fix duplicate TMDB domain prefix if present
  if (clean.includes('https://image.tmdb.org/t/p/w500https://image.tmdb.org/t/p/w500/')) {
    clean = clean.replace('https://image.tmdb.org/t/p/w500https://image.tmdb.org/t/p/w500/', 'https://image.tmdb.org/t/p/w500/');
  }
  return clean;
}

export interface XtreamCatalogData {
  featuredHeroes: MediaItem[];
  topTen: MediaItem[];
  movies: MediaItem[];
  series: MediaItem[];
  liveChannels: MediaItem[];
  allCatalog: MediaItem[];
  source: 'xtream' | 'fallback';
}

export async function fetchXtreamCatalog(): Promise<XtreamCatalogData> {
  const { server, user, pass } = getXtreamConfig();
  const baseUrl = `${server}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`;

  try {
    // Parallel fetch for VOD movies, Series and Live TV streams
    const [vodRes, seriesRes, liveRes] = await Promise.all([
      fetch(`${baseUrl}&action=get_vod_streams`).then(r => r.json()).catch(() => []),
      fetch(`${baseUrl}&action=get_series`).then(r => r.json()).catch(() => []),
      fetch(`${baseUrl}&action=get_live_streams`).then(r => r.json()).catch(() => [])
    ]);

    const rawVod: any[] = Array.isArray(vodRes) ? vodRes : [];
    const rawSeries: any[] = Array.isArray(seriesRes) ? seriesRes : [];
    const rawLive: any[] = Array.isArray(liveRes) ? liveRes : [];

    // Map Movies
    const movies: MediaItem[] = rawVod.slice(0, 150).map((v) => {
      const ratingNum = parseFloat(v.rating || '7.5');
      const score = Math.min(100, Math.round(ratingNum * 10));
      const year = v.release_date ? parseInt(v.release_date.slice(0, 4)) : 2025;
      const ext = v.container_extension || 'mp4';
      const streamUrl = `${server}/movie/${user}/${pass}/${v.stream_id}.${ext}`;
      const img = fixImageUrl(v.poster || v.stream_icon);

      const fallbackUrls: string[] = [];
      // If TMDB ID is present, add high-quality videoapp.zip mirror
      if (v.tmdb_id) {
        fallbackUrls.push(`https://videoapp.zip/e/movie/${v.tmdb_id}`);
      }

      if (typeof v.stream_url === 'string') {
        try {
          const parsed = JSON.parse(v.stream_url);
          if (Array.isArray(parsed)) {
            parsed.forEach((u: any) => {
              if (typeof u === 'string' && u.startsWith('http') && !fallbackUrls.includes(u)) {
                fallbackUrls.push(u);
              }
            });
          }
        } catch {
          // Ignore parse errors
        }
      }

      return {
        id: `vod-${v.stream_id}`,
        title: v.name || 'Untitled Movie',
        type: 'movie',
        genre: v.genre_ids?.length ? ['Movies', 'Action'] : ['Cinema', 'Originals'],
        rating: ratingNum >= 8 ? 'TV-MA' : 'PG-13',
        rottenTomatoes: { score, certified: score >= 75 },
        year: isNaN(year) ? 2024 : year,
        durationOrSeasons: 'Feature Film',
        synopsis: v.plot || `Watch ${v.name} on demand in high definition on RukaTV.`,
        longDescription: v.plot || `${v.name} streaming with crystal clear audio and video.`,
        backdropUrl: img,
        posterUrl: img,
        streamVideoUrl: streamUrl,
        fallbackUrls,
        audioBadges: ['4K UHD', 'Dolby Vision', 'Dolby Atmos'],
        cast: ['Ruka Cast', 'Featured Talent'],
        creatorsOrDirectors: ['Ruka Cinema'],
        isAppleOriginal: score >= 80,
      };
    });

    // Map Series
    const seriesList: MediaItem[] = rawSeries.slice(0, 100).map((s) => {
      const ratingNum = parseFloat(s.rating || '8.0');
      const score = Math.min(100, Math.round(ratingNum * 10));
      const year = s.release_date ? parseInt(s.release_date.slice(0, 4)) : 2025;
      const img = fixImageUrl(s.cover || s.poster);

      return {
        id: `series-${s.series_id}`,
        title: s.name || 'Untitled Series',
        type: 'series',
        genre: ['Series', 'Drama'],
        rating: ratingNum >= 8 ? 'TV-MA' : 'TV-14',
        rottenTomatoes: { score, certified: score >= 75 },
        year: isNaN(year) ? 2025 : year,
        durationOrSeasons: 'Series',
        synopsis: s.plot || `Follow the complete series of ${s.name} exclusively on RukaTV.`,
        longDescription: s.plot || `All episodes and seasons of ${s.name} streaming with no interruptions.`,
        backdropUrl: img,
        posterUrl: img,
        streamVideoUrl: '', // Series plays season 1 episode 1 dynamically
        audioBadges: ['4K UHD', 'Dolby Atmos', 'Spatial Audio'],
        cast: ['Ruka Ensemble', 'Main Cast'],
        creatorsOrDirectors: ['Ruka Studios'],
        isAppleOriginal: true,
      };
    });

    // Filter out known unreachable hosts (e.g. 181.78.79.131 which times out / 502 Bad Gateway)
    const activeRawLive = rawLive.filter((ch: any) => {
      const rawUrl = typeof ch.stream_url === 'string' ? ch.stream_url : '';
      return !rawUrl.includes('181.78.79.131') && !rawUrl.includes('181.78.8.199');
    });

    // Map Live TV Channels with priority on verified functional channels
    const liveChannels: MediaItem[] = activeRawLive.map((ch: any) => {
      const rawDirect = typeof ch.stream_url === 'string' ? ch.stream_url.replace(/\\/g, '/') : '';
      const isHttpsDirect = rawDirect.startsWith('https://');
      const proxyUrl = `${server}/live/${user}/${pass}/${ch.stream_id}.m3u8`;

      // For direct HTTPS feeds (Paraguay, Spain, Europe), use direct HTTPS first
      const streamUrl = isHttpsDirect ? rawDirect : proxyUrl;
      const fallbackUrls = isHttpsDirect ? [proxyUrl] : (rawDirect ? [rawDirect] : []);

      return {
        id: `live-${ch.stream_id}`,
        title: ch.name || 'Live Channel',
        subtitle: `Category: ${ch.category_id || 'Live TV'}`,
        type: 'sports',
        genre: [ch.category_id || 'Live TV', 'Live Stream'],
        rating: 'TV-G',
        year: 2026,
        durationOrSeasons: 'Live Broadcast',
        synopsis: `Live broadcast of ${ch.name}. 24/7 uninterrupted feed.`,
        longDescription: `Watch ${ch.name} live in real time on RukaTV.`,
        backdropUrl: '',
        posterUrl: '',
        streamVideoUrl: streamUrl,
        fallbackUrls,
        audioBadges: ['HD Live', 'Dolby 5.1'],
        cast: ['Live Anchors', 'Presenters'],
        creatorsOrDirectors: [ch.category_id || 'Network'],
        isAppleOriginal: false,
        isLiveChannel: true,
        channelCategory: ch.category_id || 'TV',
      };
    });

    // Sort live channels so verified categories (Paraguay, Espana, Premium, Europa) are featured first
    const categoryOrder: Record<string, number> = {
      Paraguay: 1,
      Premium: 2,
      Espana: 3,
      Europa: 4,
      Deportes: 5,
    };

    liveChannels.sort((a, b) => {
      const catA = a.channelCategory || '';
      const catB = b.channelCategory || '';
      const orderA = categoryOrder[catA] || 99;
      const orderB = categoryOrder[catB] || 99;
      return orderA - orderB;
    });

    // Build Featured Heroes from top rated items with valid posters & plots
    const combinedValid = [...movies, ...seriesList].filter(i => i.backdropUrl && i.synopsis.length > 20);
    const sortedByRating = [...combinedValid].sort((a, b) => (b.rottenTomatoes?.score || 0) - (a.rottenTomatoes?.score || 0));

    const featuredHeroes = sortedByRating.slice(0, 5);
    const topTen = sortedByRating.slice(0, 10).map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

    const allCatalog = [...movies, ...seriesList, ...liveChannels];

    return {
      featuredHeroes: featuredHeroes.length > 0 ? featuredHeroes : movies.slice(0, 5),
      topTen,
      movies,
      series: seriesList,
      liveChannels,
      allCatalog,
      source: 'xtream'
    };
  } catch (error) {
    console.error('Error fetching Xtream Codes catalog:', error);
    throw error;
  }
}

/** Fetch detailed series info including season and episode list */
export async function fetchSeriesDetails(seriesIdStr: string): Promise<Episode[]> {
  const cleanId = seriesIdStr.replace('series-', '');
  const { server, user, pass } = getXtreamConfig();
  const url = `${server}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=get_series_info&series_id=${cleanId}`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    const episodesGroup = json.episodes || {};
    const results: Episode[] = [];

    Object.keys(episodesGroup).forEach((seasonKey) => {
      const seasonEpisodes: any[] = episodesGroup[seasonKey] || [];
      seasonEpisodes.forEach((ep) => {
        const ext = ep.container_extension || 'm3u8';
        const streamUrl = `${server}/series/${user}/${pass}/${ep.id}.${ext}`;
        const thumb = fixImageUrl(ep.info?.movie_image);

        results.push({
          id: `ep-${ep.id}`,
          seasonNumber: parseInt(seasonKey) || 1,
          episodeNumber: ep.episode_num || 1,
          title: ep.title || `Episode ${ep.episode_num}`,
          duration: ep.info?.duration_secs ? `${Math.round(ep.info.duration_secs / 60)} min` : '45 min',
          description: ep.info?.plot || 'No episode description available.',
          thumbnailUrl: thumb,
          videoUrl: streamUrl,
        });
      });
    });

    // Ensure episodes are sorted by season and episode number
    results.sort((a, b) => {
      if (a.seasonNumber !== b.seasonNumber) return a.seasonNumber - b.seasonNumber;
      return a.episodeNumber - b.episodeNumber;
    });

    return results;
  } catch (err) {
    console.error('Error fetching series details:', err);
    return [];
  }
}
