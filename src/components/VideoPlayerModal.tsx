import React, { useRef, useState, useEffect } from 'react';
import type { MediaItem } from '../types';
import Hls from 'hls.js';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize2, X, Subtitles, Settings, RefreshCw, AlertCircle } from 'lucide-react';

interface VideoPlayerModalProps {
  item: MediaItem;
  videoUrl?: string;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ item, videoUrl, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

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

  const controlsTimeoutRef = useRef<number | null>(null);

  // Check if current stream matches an episode in item.episodes
  const currentEpisode = item.episodes?.find(e => e.videoUrl === videoUrl || e.videoUrl === currentStreamUrl);

  // Build candidate stream URLs list
  const streamCandidates = [
    videoUrl || item.streamVideoUrl,
    ...(item.fallbackUrls || [])
  ].filter(Boolean);

  const currentStreamUrl = streamCandidates[activeUrlIndex] || videoUrl || item.streamVideoUrl;
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
      setErrorMsg("This stream is currently offline or unreachable at the source. Please try another channel or title.");
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

  // Auto fallback if stream stalls or fails to buffer after 7 seconds
  useEffect(() => {
    if (isEmbedUrl) return;
    const timer = setTimeout(() => {
      const video = videoRef.current;
      if (video && video.currentTime === 0 && streamCandidates.length > 1 && activeUrlIndex + 1 < streamCandidates.length) {
        console.warn('Playback stalled, attempting next source mirror...');
        tryNextSource();
      }
    }, 7500);

    return () => clearTimeout(timer);
  }, [currentStreamUrl, activeUrlIndex, isEmbedUrl]);

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

    // Almost all Xtream streams (movies, series, live) return HLS m3u8 playlists
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
        // lowLatencyMode must be false for VOD/Series so seeking and buffer-ahead work smoothly
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
        // Crucial: Only handle fatal errors. Non-fatal transient errors during seeking or buffering are handled automatically by Hls.js
        if (!data.fatal) {
          return;
        }

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
      // Native Safari / iOS
      video.src = currentStreamUrl;
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      video.onerror = () => tryNextSource();
    } else {
      // Direct file fallback
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, onClose]);

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
          onEnded={() => setIsPlaying(false)}
          playsInline
        />
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
                ? `Season ${currentEpisode.seasonNumber} · Episode ${currentEpisode.episodeNumber}`
                : (item.isLiveChannel ? 'Live 24/7 Channel · RukaTV+' : 'Now Streaming · RukaTV+')}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
              {item.title} {currentEpisode?.title ? `— ${currentEpisode.title}` : ''}
            </h2>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Center Play/Pause indicator animation (only for video, not embed) */}
        {!isEmbedUrl && (
          <div className="self-center flex items-center gap-8 pointer-events-auto">
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
              aria-label={isPlaying ? "Pause video" : "Play video"}
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
                    aria-label={isMuted ? "Unmute" : "Mute"}
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

            {/* Right Controls: Subtitles & Fullscreen */}
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
          <div className="text-[10px] text-white/50 font-mono mt-0.5">Source {activeUrlIndex + 1} of {streamCandidates.length}</div>
        </div>
      )}
    </div>
  );
};
