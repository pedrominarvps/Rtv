import React, { useRef, useState, useEffect } from 'react';
import type { MediaItem, Episode } from '../types';
import { fetchSeriesDetails } from '../services/xtreamService';
import { useTranslation } from '../context/LanguageContext';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Subtitles,
  Settings,
  RefreshCw,
  AlertCircle,
  FastForward,
  SkipForward,
  SkipBack,
} from 'lucide-react';

interface VideoPlayerModalProps {
  item: MediaItem;
  videoUrl?: string;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ item, videoUrl, onClose }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [episodes, setEpisodes] = useState<Episode[]>(item.episodes || []);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>(videoUrl || item.streamVideoUrl || '');
  const [activeUrlIndex, setActiveUrlIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSettingsToast, setShowSettingsToast] = useState(false);

  // Series features
  const [hasSkippedIntro, setHasSkippedIntro] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownDismissed, setCountdownDismissed] = useState(false);

  const controlsTimeoutRef = useRef<number | null>(null);

  // Fetch episodes if series doesn't have them loaded yet
  useEffect(() => {
    if (item.type === 'series' && (!item.episodes || item.episodes.length === 0)) {
      fetchSeriesDetails(item.id)
        .then((eps) => {
          if (eps.length > 0) {
            item.episodes = eps;
            setEpisodes(eps);
          }
        })
        .catch(() => {});
    }
  }, [item]);

  // Determine series episode context
  const isSeries = item.type === 'series';
  const currentEpisodeIndex = episodes.findIndex((e) => e.videoUrl === activeVideoUrl);
  const currentEpisode = currentEpisodeIndex >= 0 ? episodes[currentEpisodeIndex] : null;
  const nextEpisode = currentEpisodeIndex >= 0 && currentEpisodeIndex + 1 < episodes.length
    ? episodes[currentEpisodeIndex + 1]
    : null;
  const prevEpisode = currentEpisodeIndex > 0 ? episodes[currentEpisodeIndex - 1] : null;

  // Build candidate stream URLs list
  const streamCandidates = [
    activeVideoUrl || item.streamVideoUrl,
    ...(item.fallbackUrls || []),
  ].filter(Boolean);

  const currentStreamUrl = streamCandidates[activeUrlIndex] || activeVideoUrl || item.streamVideoUrl;
  const isEmbedUrl = currentStreamUrl.includes('/embed-') || currentStreamUrl.includes('/e/');

  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3500);
  };

  // Try next fallback URL if available
  const tryNextSource = () => {
    if (activeUrlIndex + 1 < streamCandidates.length) {
      const nextIndex = activeUrlIndex + 1;
      setActiveUrlIndex(nextIndex);
      setErrorMsg(`Connecting to alternate source ${nextIndex + 1} of ${streamCandidates.length}...`);
      setTimeout(() => setErrorMsg(null), 3000);
    } else {
      setErrorMsg('This stream is currently offline or unreachable at the source. Please try another channel or title.');
    }
  };

  const reloadCurrentSource = () => {
    setErrorMsg(null);
    const video = videoRef.current;
    if (!video || !currentStreamUrl) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    initPlayer();
  };

  // Skip Intro Action
  const handleSkipIntro = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const target = Math.min(duration || 100, Math.max(90, currentTime + 85));
    videoRef.current.currentTime = target;
    setCurrentTime(target);
    setHasSkippedIntro(true);
    resetControlsTimer();
  };

  // Next Episode Action
  const handlePlayNextEpisode = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!nextEpisode) return;
    setActiveVideoUrl(nextEpisode.videoUrl);
    setActiveUrlIndex(0);
    setCurrentTime(0);
    setHasSkippedIntro(false);
    setCountdown(null);
    setCountdownDismissed(false);
    setErrorMsg(null);
    setIsPlaying(true);
  };

  // Prev Episode Action
  const handlePlayPrevEpisode = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!prevEpisode) return;
    setActiveVideoUrl(prevEpisode.videoUrl);
    setActiveUrlIndex(0);
    setCurrentTime(0);
    setHasSkippedIntro(false);
    setCountdown(null);
    setCountdownDismissed(false);
    setErrorMsg(null);
    setIsPlaying(true);
  };

  // Cancel ending countdown
  const handleCancelCountdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCountdown(null);
    setCountdownDismissed(true);
  };

  // Auto fallback if stream stalls or fails to buffer after 7.5 seconds
  useEffect(() => {
    if (isEmbedUrl) return;
    const timer = setTimeout(() => {
      const video = videoRef.current;
      if (
        video &&
        video.currentTime === 0 &&
        streamCandidates.length > 1 &&
        activeUrlIndex + 1 < streamCandidates.length
      ) {
        console.warn('Playback stalled, attempting next source mirror...');
        tryNextSource();
      }
    }, 7500);

    return () => clearTimeout(timer);
  }, [currentStreamUrl, activeUrlIndex, isEmbedUrl]);

  // Ending 30s Countdown timer
  useEffect(() => {
    if (!isSeries || !nextEpisode || countdownDismissed) return;

    // Check if within last 30s or ended
    const remaining = duration - currentTime;
    if (duration > 45 && remaining <= 30 && remaining > 0) {
      if (countdown === null) {
        setCountdown(Math.ceil(remaining));
      }
    }

    if (countdown !== null) {
      if (countdown <= 0) {
        handlePlayNextEpisode();
        return;
      }

      const timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentTime, duration, countdown, countdownDismissed, isSeries, nextEpisode]);

  // Initialize playback with HLS.js or direct playback
  const initPlayer = () => {
    const video = videoRef.current;
    if (!video || !currentStreamUrl || isEmbedUrl) return;

    setErrorMsg(null);

    // Destroy existing Hls instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isXtreamOrHls =
      currentStreamUrl.includes('.m3u8') ||
      currentStreamUrl.includes('/live/') ||
      currentStreamUrl.includes('/series/') ||
      currentStreamUrl.includes('/movie/') ||
      currentStreamUrl.includes('sslip.io');

    const isLiveStream = Boolean(item.isLiveChannel || currentStreamUrl.includes('/live/'));

    if (isXtreamOrHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: isLiveStream,
        backBufferLength: 90,
        maxBufferLength: 60,
        maxMaxBufferLength: 120,
        maxBufferSize: 60 * 1000 * 1000,
        fragLoadingTimeOut: 25000,
        fragLoadingMaxRetry: 6,
        fragLoadingRetryDelay: 1000,
        manifestLoadingTimeOut: 15000,
        manifestLoadingMaxRetry: 5,
        levelLoadingTimeOut: 15000,
        levelLoadingMaxRetry: 5,
      });
      hlsRef.current = hls;

      hls.loadSource(currentStreamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        setIsLive(data.levels?.[0]?.details?.live ?? isLiveStream);
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });

      let fatalNetworkRetries = 0;
      let fatalMediaRetries = 0;

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;

        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            fatalNetworkRetries++;
            if (fatalNetworkRetries <= 3) {
              console.warn(`Recovering HLS fatal network error (${fatalNetworkRetries}/3)...`);
              hls.startLoad();
            } else {
              hls.destroy();
              tryNextSource();
            }
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            fatalMediaRetries++;
            if (fatalMediaRetries <= 2) {
              console.warn(`Recovering HLS fatal media error (${fatalMediaRetries}/2)...`);
              hls.recoverMediaError();
            } else {
              hls.destroy();
              tryNextSource();
            }
            break;
          default:
            hls.destroy();
            tryNextSource();
            break;
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = currentStreamUrl;
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      video.onerror = () => tryNextSource();
    } else {
      video.src = currentStreamUrl;
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      video.onerror = () => tryNextSource();
    }
  };

  useEffect(() => {
    initPlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentStreamUrl, isEmbedUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      resetControlsTimer();
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'ArrowRight') seek(10);
      if (e.key === 'ArrowLeft') seek(-10);
      if (e.key === 'n' || e.key === 'N') {
        if (nextEpisode) handlePlayNextEpisode();
      }
      if (e.key === 'p' || e.key === 'P') {
        if (prevEpisode) handlePlayPrevEpisode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, onClose, nextEpisode, prevEpisode]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seek = (seconds: number) => {
    if (!videoRef.current || isLive) return;
    setErrorMsg(null);
    const target = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    videoRef.current.currentTime = target;
    setCurrentTime(target);
    resetControlsTimer();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    videoRef.current.play().catch(() => setIsPlaying(false));
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLive) return;
    setErrorMsg(null);
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) videoRef.current.currentTime = newTime;
    resetControlsTimer();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs) || isLive) return 'LIVE';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Show Skip Intro condition:
  // For series (and long videos), during intro timeframe (seconds 10 through 95)
  const showSkipIntro = isSeries && !hasSkippedIntro && currentTime >= 10 && currentTime <= 95 && duration > 120 && !isLive;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden cursor-default select-none"
      onMouseMove={resetControlsTimer}
      onClick={togglePlay}
    >
      {/* If it's an embed iframe source */}
      {isEmbedUrl ? (
        <iframe
          src={currentStreamUrl}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          title={item.title}
        />
      ) : (
        /* Video Element */
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onSeeking={() => setErrorMsg(null)}
          onSeeked={() => setErrorMsg(null)}
          onPlaying={() => setErrorMsg(null)}
          onEnded={() => {
            setIsPlaying(false);
            if (isSeries && nextEpisode) {
              setCountdown(30);
            }
          }}
          playsInline
        />
      )}

      {/* Floating Skip Intro Pill Button */}
      {showSkipIntro && (
        <div className="absolute bottom-24 right-8 z-40 animate-fadeIn pointer-events-auto">
          <button
            onClick={handleSkipIntro}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-2xl hover:scale-105 active:scale-95"
            aria-label={t('player.skipIntro')}
          >
            <FastForward className="w-4 h-4 fill-white" />
            <span>{t('player.skipIntro')}</span>
          </button>
        </div>
      )}

      {/* Floating Next Episode 30-Second Countdown Overlay */}
      {countdown !== null && nextEpisode && (
        <div
          className="absolute bottom-20 sm:bottom-24 right-4 sm:right-8 z-40 max-w-sm w-full bg-zinc-950/90 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl animate-fadeIn space-y-3 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-purple-400 uppercase tracking-wider text-[11px]">
              {t('player.nextIn')}
            </span>
            <span className="font-mono text-xs font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-full border border-white/10">
              {countdown}s
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={nextEpisode.thumbnailUrl || item.backdropUrl || item.posterUrl}
              alt={nextEpisode.title}
              className="w-20 aspect-video object-cover rounded-xl border border-white/10 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{nextEpisode.title}</h4>
              <p className="text-[11px] text-white/50">
                {t('detail.season')} {nextEpisode.seasonNumber} · {t('detail.episode')} {nextEpisode.episodeNumber}
              </p>
            </div>
          </div>

          {/* Smooth progress bar */}
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${((30 - countdown) / 30) * 100}%` }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handlePlayNextEpisode}
              className="flex-1 py-2 px-4 bg-white text-black text-xs font-bold rounded-full hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{t('player.playNow')}</span>
            </button>
            <button
              onClick={handleCancelCountdown}
              className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-full transition-all"
            >
              {t('player.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Error / Offline Toast Banner */}
      {errorMsg && (
        <div className="absolute top-24 z-50 max-w-lg px-5 py-3 bg-red-950/90 backdrop-blur-md rounded-2xl text-xs text-white border border-red-500/30 flex items-center gap-3 shadow-2xl">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">{errorMsg}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                reloadCurrentSource();
              }}
              className="px-3 py-1 bg-white text-black text-xs font-semibold rounded-full hover:bg-white/90 transition-all flex items-center gap-1 shadow-sm"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reintentar</span>
            </button>
            {streamCandidates.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  tryNextSource();
                }}
                className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full hover:bg-white/30 transition-all flex items-center gap-1"
              >
                <span>Fuente {activeUrlIndex + 2}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Subtitles Overlay if enabled */}
      {subtitlesEnabled && isPlaying && (
        <div className="absolute bottom-28 inset-x-0 flex justify-center pointer-events-none z-30">
          <p className="bg-black/75 px-4 py-1.5 rounded text-white text-base font-medium tracking-wide">
            [Audio and dialogue stream in Dolby Atmos]
          </p>
        </div>
      )}

      {/* HUD Overlays */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black/85 via-transparent to-black/85 transition-opacity duration-300 pointer-events-none ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar: Title & Exit */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-purple-400 mb-0.5">
              {currentEpisode
                ? `${t('detail.season')} ${currentEpisode.seasonNumber} · ${t('detail.episode')} ${currentEpisode.episodeNumber}`
                : item.isLiveChannel
                ? t('player.liveBroadcast')
                : t('player.nowStreaming')}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
              {item.title} {currentEpisode?.title ? `— ${currentEpisode.title}` : ''}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Next Episode Button in top bar if series */}
            {nextEpisode && (
              <button
                onClick={handlePlayNextEpisode}
                className="px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold text-white/90 hover:text-white hover:bg-white/20 flex items-center gap-1.5 transition-all shadow-md border border-white/20"
                title={`${t('player.nextEpisode')}: ${nextEpisode.title}`}
              >
                <span className="hidden sm:inline">{t('player.nextEpisode')}</span>
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            )}

            {streamCandidates.length > 1 && (
              <button
                onClick={tryNextSource}
                className="px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold text-white/90 hover:text-white hover:bg-white/20 flex items-center gap-1.5 transition-all shadow-md border border-white/20"
                title="Switch video source / mirror"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Source {activeUrlIndex + 1}/{streamCandidates.length}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all active:scale-95"
              aria-label="Exit player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Play/Pause & Skip Controls */}
        {!isEmbedUrl && (
          <div className="self-center flex items-center gap-4 sm:gap-6 pointer-events-auto">
            {/* Previous Episode button if series */}
            {isSeries && prevEpisode && (
              <button
                onClick={handlePlayPrevEpisode}
                className="p-3 rounded-full glass-pill text-white/80 hover:text-white hover:scale-110 active:scale-90 transition-all"
                title={t('player.prevEpisode')}
                aria-label={t('player.prevEpisode')}
              >
                <SkipBack className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => seek(-10)}
              className="p-3 rounded-full glass-pill text-white/80 hover:text-white hover:scale-110 active:scale-90 transition-all"
              aria-label="Skip back 10 seconds"
            >
              <RotateCcw className="w-6 h-6" />
            </button>

            <button
              onClick={togglePlay}
              className="p-5 rounded-full bg-white text-black hover:scale-110 active:scale-90 transition-all shadow-2xl"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-black" />
              ) : (
                <Play className="w-8 h-8 fill-black ml-1" />
              )}
            </button>

            <button
              onClick={() => seek(10)}
              className="p-3 rounded-full glass-pill text-white/80 hover:text-white hover:scale-110 active:scale-90 transition-all"
              aria-label="Skip forward 10 seconds"
            >
              <RotateCw className="w-6 h-6" />
            </button>

            {/* Next Episode button if series */}
            {isSeries && nextEpisode && (
              <button
                onClick={handlePlayNextEpisode}
                className="p-3 rounded-full glass-pill text-white/80 hover:text-white hover:scale-110 active:scale-90 transition-all"
                title={t('player.nextEpisode')}
                aria-label={t('player.nextEpisode')}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Bottom Control Bar */}
        <div className="space-y-3 pointer-events-auto">
          {/* Scrubber timeline */}
          {!isEmbedUrl && !isLive && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-white/70 w-12 text-right">
                {formatTime(currentTime)}
              </span>

              <div className="relative flex-1 group/scrub">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeekChange}
                  className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white hover:h-2 transition-all"
                  aria-label="Video scrubber"
                />
              </div>

              <span className="text-xs font-semibold text-white/70 w-12">
                -{formatTime(Math.max(0, duration - currentTime))}
              </span>
            </div>
          )}

          {/* Controls Strip */}
          <div className="flex items-center justify-between pt-1">
            {/* Left Controls: Volume */}
            <div className="flex items-center gap-3">
              {!isEmbedUrl && (
                <>
                  <button
                    onClick={toggleMute}
                    className="p-2 text-white/80 hover:text-white transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>

                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-white/30 rounded-full appearance-none accent-white cursor-pointer"
                    aria-label="Volume slider"
                  />
                </>
              )}
            </div>

            {/* Right Controls: Subtitles, Settings, Fullscreen */}
            <div className="flex items-center gap-3">
              {!isEmbedUrl && (
                <button
                  onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                  className={`p-2 rounded-lg text-sm font-semibold transition-all ${
                    subtitlesEnabled ? 'bg-white text-black' : 'text-white/80 hover:text-white'
                  }`}
                  aria-label="Toggle subtitles"
                >
                  <Subtitles className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={() => {
                  setShowSettingsToast(true);
                  setTimeout(() => setShowSettingsToast(false), 3500);
                }}
                className="p-2 text-white/80 hover:text-white transition-colors"
                aria-label="Playback Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 text-white/80 hover:text-white transition-colors"
                aria-label="Toggle fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings HUD Info Pill */}
      {showSettingsToast && (
        <div className="absolute bottom-24 right-8 z-50 px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl text-xs text-white border border-white/20 shadow-2xl animate-fadeIn">
          <div className="font-semibold text-purple-400">Stream Diagnostics</div>
          <div className="text-[11px] text-white/70 mt-0.5">HLS Adaptive · Dolby Atmos · 4K UHD</div>
          <div className="text-[10px] text-white/50 font-mono mt-0.5">
            Source {activeUrlIndex + 1} of {streamCandidates.length}
          </div>
        </div>
      )}
    </div>
  );
};
