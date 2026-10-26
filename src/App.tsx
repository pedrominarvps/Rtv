import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type { MediaItem } from './types';
import { fetchXtreamCatalog, fetchSeriesDetails, type XtreamCatalogData } from './services/xtreamService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { HomePage } from './pages/HomePage';
import { TvSeasonPage } from './pages/TvSeasonPage';
import { UpNextPage } from './pages/UpNextPage';
import { SearchPage } from './pages/SearchPage';
import { DetailPage } from './pages/DetailPage';
import { LegalPage } from './pages/LegalPage';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const navigate = useNavigate();

  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('apple_tv_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [playingState, setPlayingState] = useState<{ item: MediaItem; videoUrl?: string } | null>(null);
  const [resolvingSeries, setResolvingSeries] = useState<string | null>(null);

  // Xtream Catalog State (initialized empty with no mock/fake data)
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<XtreamCatalogData>({
    featuredHeroes: [],
    topTen: [],
    movies: [],
    series: [],
    liveChannels: [],
    allCatalog: [],
    source: 'xtream'
  });

  const loadCatalog = () => {
    setLoading(true);
    setErrorMessage(null);

    fetchXtreamCatalog()
      .then(data => {
        if (data.allCatalog.length > 0) {
          setCatalog(data);
        } else {
          setErrorMessage('No se encontraron contenidos en el servidor Xtream Code.');
        }
      })
      .catch(err => {
        console.error('Error connecting to Xtream server:', err);
        setErrorMessage('No se pudo establecer conexión con el servidor Xtream. Verifica las variables en .env o el estado del servidor.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Fetch live Xtream Codes data on mount
  useEffect(() => {
    loadCatalog();
  }, []);

  // Sync watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('apple_tv_watchlist', JSON.stringify(watchlistIds));
    } catch {
      // Storage unavailable fallback
    }
  }, [watchlistIds]);

  const toggleWatchlist = (item: MediaItem) => {
    setWatchlistIds(prev => 
      prev.includes(item.id) 
        ? prev.filter(id => id !== item.id) 
        : [...prev, item.id]
    );
  };

  const isInWatchlist = (id: string) => watchlistIds.includes(id);

  const handlePlay = async (item: MediaItem, videoUrl?: string) => {
    // If videoUrl is provided directly (e.g. from episode or channel)
    if (videoUrl) {
      setPlayingState({ item, videoUrl });
      return;
    }

    // If it's a series and no episode URL was passed, resolve Season 1 Episode 1
    if (item.type === 'series') {
      if (item.episodes && item.episodes.length > 0) {
        setPlayingState({ item, videoUrl: item.episodes[0].videoUrl });
        return;
      }

      setResolvingSeries(item.id);
      try {
        const episodes = await fetchSeriesDetails(item.id);
        if (episodes.length > 0) {
          item.episodes = episodes;
          setPlayingState({ item, videoUrl: episodes[0].videoUrl });
        } else {
          navigate(`/title/${item.id}`);
        }
      } catch (err) {
        console.error('Failed to load series episode:', err);
        navigate(`/title/${item.id}`);
      } finally {
        setResolvingSeries(null);
      }
      return;
    }

    // Default for movies and live channels
    setPlayingState({ item, videoUrl });
  };

  const watchlistItems = catalog.allCatalog.filter(item => watchlistIds.includes(item.id));
  
  // Continue watching simulated list
  const continueWatchingItems: MediaItem[] = catalog.featuredHeroes.slice(0, 2).map((item, i) => ({
    ...item,
    progressPercent: i === 0 ? 68 : 34
  }));

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-purple-500/30">
      {/* Top Navbar with Real Links */}
      <Navbar watchlistCount={watchlistIds.length} />

      {/* Main Content Area with Routing */}
      <main className="flex-1">
        {resolvingSeries && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/80 backdrop-blur-md border border-purple-500/30 text-xs text-white shadow-xl animate-fadeIn">
            <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
            <span>Cargando Episodio 1...</span>
          </div>
        )}

        <Routes>
          {/* Main Showcase / Home Page */}
          <Route
            path="/"
            element={
              <HomePage
                catalog={catalog}
                loading={loading}
                errorMessage={errorMessage}
                watchlistItems={watchlistItems}
                onPlay={handlePlay}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={isInWatchlist}
                onRetry={loadCatalog}
              />
            }
          />

          {/* TV Season / Live Channels */}
          <Route
            path="/tv-season"
            element={
              <TvSeasonPage
                liveChannels={catalog.liveChannels}
                loading={loading}
                onPlay={handlePlay}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={isInWatchlist}
              />
            }
          />

          {/* Up Next / Watchlist Queue */}
          <Route
            path="/up-next"
            element={
              <UpNextPage
                watchlistItems={watchlistItems}
                continueWatchingItems={continueWatchingItems}
                onPlay={handlePlay}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={isInWatchlist}
              />
            }
          />

          {/* Full Screen Dedicated Search Page */}
          <Route
            path="/search"
            element={
              <SearchPage
                catalog={catalog.allCatalog}
                loading={loading}
                onPlay={handlePlay}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={isInWatchlist}
              />
            }
          />

          {/* Full Page Details for Movies, Series, Channels */}
          <Route
            path="/title/:id"
            element={
              <DetailPage
                catalog={catalog.allCatalog}
                loading={loading}
                onPlay={handlePlay}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={isInWatchlist}
              />
            }
          />
          <Route
            path="/movie/:id"
            element={
              <DetailPage
                catalog={catalog.allCatalog}
                loading={loading}
                onPlay={handlePlay}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={isInWatchlist}
              />
            }
          />
          <Route
            path="/series/:id"
            element={
              <DetailPage
                catalog={catalog.allCatalog}
                loading={loading}
                onPlay={handlePlay}
                onToggleWatchlist={toggleWatchlist}
                isInWatchlist={isInWatchlist}
              />
            }
          />

          {/* Full Page Legal Documentation */}
          <Route path="/legal" element={<Navigate to="/legal/privacy" replace />} />
          <Route path="/legal/:tab" element={<LegalPage />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Embedded Video Player */}
      {playingState && (
        <VideoPlayerModal
          item={playingState.item}
          videoUrl={playingState.videoUrl}
          onClose={() => setPlayingState(null)}
        />
      )}
    </div>
  );
};

export default App;
