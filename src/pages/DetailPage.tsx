import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { MediaItem, Episode } from '../types';
import { fetchSeriesDetails } from '../services/xtreamService';
import { updatePageSeo } from '../utils/seo';
import { RatingBadges } from '../components/RatingBadges';
import { ShelfRail } from '../components/ShelfRail';
import { Play, Plus, Check, Share2, Film, ChevronLeft, Loader2 } from 'lucide-react';

interface DetailPageProps {
  catalog: MediaItem[];
  loading: boolean;
  onPlay: (item: MediaItem, videoUrl?: string) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (id: string) => boolean;
}

export const DetailPage: React.FC<DetailPageProps> = ({
  catalog,
  loading,
  onPlay,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<MediaItem | null>(null);
  const [activeSeason, setActiveSeason] = useState(1);
  const [copiedShare, setCopiedShare] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Match item from catalog
  useEffect(() => {
    if (!id || catalog.length === 0) return;
    const found = catalog.find(
      (m) => m.id === id || m.id === `vod-${id}` || m.id === `series-${id}` || m.id === `live-${id}`
    );
    if (found) {
      setItem(found);
    }
  }, [id, catalog]);

  // Load episodes if it's a series
  useEffect(() => {
    if (!item) return;

    if (item.episodes && item.episodes.length > 0) {
      setEpisodes(item.episodes);
      return;
    }

    if (item.type === 'series' && item.id.startsWith('series-')) {
      setLoadingEpisodes(true);
      fetchSeriesDetails(item.id)
        .then((eps) => {
          setEpisodes(eps);
          item.episodes = eps;
          if (eps.length > 0) {
            setActiveSeason(eps[0].seasonNumber);
          }
        })
        .finally(() => setLoadingEpisodes(false));
    } else {
      setEpisodes([]);
    }
  }, [item]);

  // Dynamic SEO meta tags & Schema.org JSON-LD
  useEffect(() => {
    if (!item) return;

    const isSeries = item.type === 'series';
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': isSeries ? 'TVSeries' : 'Movie',
      name: item.title,
      description: item.synopsis || item.longDescription,
      image: item.backdropUrl || item.posterUrl,
      genre: item.genre,
      datePublished: item.year?.toString(),
      director: item.creatorsOrDirectors.map((d) => ({ '@type': 'Person', name: d })),
      actor: item.cast.map((c) => ({ '@type': 'Person', name: c })),
      ...(isSeries && episodes.length > 0
        ? {
            numberOfSeasons: Array.from(new Set(episodes.map((e) => e.seasonNumber))).length,
            numberOfEpisodes: episodes.length,
          }
        : {}),
    };

    updatePageSeo({
      title: `${item.title} (${item.year})`,
      description: item.synopsis || item.longDescription,
      image: item.backdropUrl || item.posterUrl,
      url: window.location.href,
      type: isSeries ? 'video.tv_show' : 'video.movie',
      jsonLd,
    });
  }, [item, episodes]);

  if (loading || (!item && catalog.length === 0)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 pt-24 text-white/60">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        <p className="text-sm">Cargando detalles de RukaTV+...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center space-y-4 select-none">
        <h1 className="text-2xl font-bold text-white">Título no encontrado</h1>
        <p className="text-sm text-white/60">
          El contenido que buscas no está disponible en el catálogo actual.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all"
        >
          Volver a Inicio
        </button>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(item.id);
  const seasons = Array.from(new Set(episodes.map((ep) => ep.seasonNumber))).sort((a, b) => a - b);
  const currentSeasonEpisodes = episodes.filter((ep) => ep.seasonNumber === activeSeason);

  // Recommendations: same genre items excluding current item
  const relatedItems = catalog
    .filter((m) => m.id !== item.id && m.type === item.type)
    .slice(0, 12);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleStreamClick = () => {
    if (item.type === 'series') {
      if (episodes.length > 0) {
        onPlay(item, episodes[0].videoUrl);
      } else {
        fetchSeriesDetails(item.id).then((eps) => {
          if (eps.length > 0) {
            onPlay(item, eps[0].videoUrl);
          } else {
            onPlay(item);
          }
        });
      }
    } else {
      onPlay(item);
    }
  };

  return (
    <article className="pt-20 pb-20 select-none animate-fadeIn space-y-12">
      {/* Full-Bleed Cinematic Hero Banner */}
      <section className="relative w-full h-[62vh] min-h-[460px] max-h-[700px] overflow-hidden">
        <img
          src={item.backdropUrl}
          alt={item.title}
          className="w-full h-full object-cover object-center filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent w-full md:w-3/4" />

        {/* Back navigation pill */}
        <div className="absolute top-6 left-4 sm:left-8 z-30">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white border border-white/10 hover:bg-black/80 transition-all text-xs font-semibold shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 z-20">
          <div className="max-w-2xl space-y-4">
            {item.isAppleOriginal && (
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-purple-400">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span>Ruka Original</span>
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-md">
              {item.title}
            </h1>

            {/* Badges Strip */}
            <div className="flex flex-wrap items-center gap-3">
              <RatingBadges
                rating={item.rating}
                rottenTomatoes={item.rottenTomatoes}
                audioBadges={item.audioBadges}
              />
              <span className="text-xs text-white/60">·</span>
              <span className="text-xs font-semibold text-white/80">{item.year}</span>
              <span className="text-xs text-white/60">·</span>
              <span className="text-xs text-white/80">{item.durationOrSeasons}</span>
              <span className="text-xs text-white/60">·</span>
              <span className="text-xs text-white/80">{item.genre.join(', ')}</span>
            </div>

            {/* Synopsis */}
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl line-clamp-3">
              {item.synopsis}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleStreamClick}
                className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 active:scale-95 transition-all shadow-lg"
              >
                <Play className="w-4 h-4 fill-black text-black ml-0.5" />
                <span>Stream Now</span>
              </button>

              <button
                onClick={() => onToggleWatchlist(item)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold transition-all ${
                  inWatchlist
                    ? 'bg-white/30 text-white border border-white/40'
                    : 'glass-pill text-white hover:bg-white/20'
                }`}
              >
                {inWatchlist ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>In Up Next</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Up Next</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-full glass-pill text-white/80 hover:text-white transition-all text-xs flex items-center gap-1.5"
                title="Share link"
                aria-label="Share title"
              >
                <Share2 className="w-4 h-4" />
                {copiedShare && <span className="text-[10px] pr-1">Link Copied</span>}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Info Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* About & Production Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-base font-bold tracking-wide text-white uppercase text-xs text-white/50">
              Overview
            </h2>
            <p className="text-base text-white/90 leading-relaxed">
              {item.longDescription || item.synopsis}
            </p>
          </div>

          <div className="space-y-4 text-xs text-white/70 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
            <div>
              <span className="block text-white/40 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Starring
              </span>
              <p className="text-white/90 font-medium text-sm">
                {item.cast.join(', ')}
              </p>
            </div>

            <div>
              <span className="block text-white/40 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Direction & Studio
              </span>
              <p className="text-white/90 font-medium text-sm">
                {item.creatorsOrDirectors.join(', ')}
              </p>
            </div>

            <div>
              <span className="block text-white/40 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Audio & Video Capabilities
              </span>
              <p className="text-white/90 font-medium text-sm">
                {item.audioBadges.join(' · ')}
              </p>
            </div>
          </div>
        </section>

        {/* Series Episodes Section */}
        {item.type === 'series' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <Film className="w-5 h-5 text-purple-400" />
                <span>Episodes</span>
              </h2>

              {seasons.length > 1 && (
                <div className="flex items-center gap-2">
                  {seasons.map((seasonNum) => (
                    <button
                      key={seasonNum}
                      onClick={() => setActiveSeason(seasonNum)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        activeSeason === seasonNum
                          ? 'bg-white text-black'
                          : 'glass-pill text-white/70 hover:text-white'
                      }`}
                    >
                      Season {seasonNum}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loadingEpisodes ? (
              <div className="flex items-center justify-center py-16 gap-3 text-white/60 text-sm">
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                <span>Loading episodes from server...</span>
              </div>
            ) : currentSeasonEpisodes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentSeasonEpisodes.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => onPlay(item, ep.videoUrl)}
                    className="group flex flex-col rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 cursor-pointer transition-all hover:bg-white/10 shadow-lg"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={ep.thumbnailUrl}
                        alt={ep.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-3 rounded-full bg-white text-black shadow-xl">
                          <Play className="w-4 h-4 fill-black text-black ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-md text-[10px] font-semibold text-white/90 rounded-md">
                        {ep.duration}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] font-semibold text-white/50 mb-1">
                          Episode {ep.episodeNumber}
                        </div>
                        <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                          {ep.title}
                        </h3>
                        <p className="text-xs text-white/60 line-clamp-2 mt-1 leading-relaxed">
                          {ep.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-white/50">
                Select "Stream Now" above to start playback.
              </div>
            )}
          </section>
        )}

        {/* Related Titles Shelf */}
        {relatedItems.length > 0 && (
          <section className="pt-6">
            <ShelfRail
              title="More to Watch"
              subtitle={`Similar ${item.type === 'series' ? 'series' : 'movies'} you might enjoy`}
              items={relatedItems}
              aspect={item.type === 'series' ? 'landscape' : 'poster'}
              onPlay={onPlay}
              onOpenDetails={(target) => navigate(`/title/${target.id}`)}
              onToggleWatchlist={onToggleWatchlist}
              isInWatchlist={isInWatchlist}
            />
          </section>
        )}
      </div>
    </article>
  );
};
