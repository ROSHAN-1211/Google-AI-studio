import React, { useState, useEffect } from 'react';
import {
  Flame,
  TrendingUp,
  Sparkles,
  Filter,
  Grid,
  List,
  Compass,
} from 'lucide-react';
import { ANIME_DATABASE, GENRE_LIST } from './data/animeData';
import { Anime, AnimeFormat, UserWatchlistItem, WatchStatus } from './types/anime';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { AnimeCard } from './components/AnimeCard';
import { AnimeDetailModal } from './components/AnimeDetailModal';
import { AnimePlayerModal } from './components/AnimePlayerModal';
import { SimulcastSchedule } from './components/SimulcastSchedule';
import { CharacterVault } from './components/CharacterVault';
import { SoundtrackLounge } from './components/SoundtrackLounge';
import { WatchlistManager } from './components/WatchlistManager';
import { MoodRouletteModal } from './components/MoodRouletteModal';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';

const INITIAL_WATCHLIST: UserWatchlistItem[] = [
  {
    animeId: 'frieren-journey',
    status: 'Watching',
    progress: 18,
    userScore: 10,
    updatedAt: new Date().toISOString(),
    favorite: true,
  },
  {
    animeId: 'solo-leveling-arise',
    status: 'Watching',
    progress: 14,
    userScore: 9,
    updatedAt: new Date().toISOString(),
    favorite: true,
  },
  {
    animeId: 'cyberpunk-edgerunners',
    status: 'Completed',
    progress: 10,
    userScore: 10,
    updatedAt: new Date().toISOString(),
    favorite: true,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'discover' | 'schedule' | 'characters' | 'soundtrack' | 'watchlist'>('discover');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'popularity' | 'episodes' | 'year'>('score');
  
  // Watchlist state with localStorage
  const [watchlist, setWatchlist] = useState<UserWatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('animura_watchlist_v1');
      return saved ? JSON.parse(saved) : INITIAL_WATCHLIST;
    } catch {
      return INITIAL_WATCHLIST;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('animura_watchlist_v1', JSON.stringify(watchlist));
    } catch {
      // ignore
    }
  }, [watchlist]);

  // Modals state
  const [detailAnime, setDetailAnime] = useState<Anime | null>(null);
  const [playerState, setPlayerState] = useState<{
    isOpen: boolean;
    anime: Anime | null;
    episodeNumber: number;
  }>({
    isOpen: false,
    anime: null,
    episodeNumber: 1,
  });
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global keyboard shortcut for search ('/' or 'Cmd+K')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.metaKey && e.key === 'k')) && !isSearchOpen) {
        const activeElem = document.activeElement;
        const isInput = activeElem?.tagName === 'INPUT' || activeElem?.tagName === 'TEXTAREA';
        if (!isInput) {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Watchlist helpers
  const isInWatchlist = (animeId: string) => {
    return watchlist.some((item) => item.animeId === animeId);
  };

  const handleToggleWatchlist = (animeId: string) => {
    if (isInWatchlist(animeId)) {
      setWatchlist((prev) => prev.filter((i) => i.animeId !== animeId));
    } else {
      const newItem: UserWatchlistItem = {
        animeId,
        status: 'Watching',
        progress: 0,
        userScore: 0,
        updatedAt: new Date().toISOString(),
        favorite: false,
      };
      setWatchlist((prev) => [newItem, ...prev]);
    }
  };

  const handleUpdateWatchlist = (
    animeId: string,
    status: WatchStatus,
    progress: number,
    score: number
  ) => {
    setWatchlist((prev) => {
      const exists = prev.find((item) => item.animeId === animeId);
      if (exists) {
        return prev.map((item) =>
          item.animeId === animeId
            ? { ...item, status, progress, userScore: score, updatedAt: new Date().toISOString() }
            : item
        );
      } else {
        const newItem: UserWatchlistItem = {
          animeId,
          status,
          progress,
          userScore: score,
          updatedAt: new Date().toISOString(),
          favorite: false,
        };
        return [newItem, ...prev];
      }
    });
  };

  const handleRemoveFromWatchlist = (animeId: string) => {
    setWatchlist((prev) => prev.filter((i) => i.animeId !== animeId));
  };

  const handleOpenPlayer = (anime: Anime, epNumber: number = 1) => {
    setPlayerState({
      isOpen: true,
      anime,
      episodeNumber: epNumber,
    });
  };

  // Filtered Discover Anime
  const filteredAnime = ANIME_DATABASE.filter((anime) => {
    const matchesGenre = selectedGenre === 'All' || anime.genres.includes(selectedGenre);
    const matchesFormat = selectedFormat === 'All' || anime.format === selectedFormat;
    return matchesGenre && matchesFormat;
  }).sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'popularity') return a.popularity - b.popularity;
    if (sortBy === 'episodes') return b.episodes - a.episodes;
    if (sortBy === 'year') return b.year - a.year;
    return 0;
  });

  const featuredSpotlights = ANIME_DATABASE.filter((a) => a.featured);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 selection:bg-rose-500/30 selection:text-rose-200">
      
      {/* Navigation Bar (Strict 3-zone Top Bar Contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchlistCount={watchlist.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenRoulette={() => setIsRouletteOpen(true)}
      />

      {/* Main Content Area */}
      <main>
        {activeTab === 'discover' && (
          <div>
            {/* Cinematic Hero Showcase Carousel */}
            <HeroBanner
              featuredAnime={featuredSpotlights}
              onSelectAnime={(anime) => setDetailAnime(anime)}
              onPlayEpisode={(anime, ep) => handleOpenPlayer(anime, ep || 1)}
              onToggleWatchlist={handleToggleWatchlist}
              isInWatchlist={isInWatchlist}
            />

            {/* Catalog Discovery Section */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-8">
              
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
                    <Compass className="h-4 w-4" />
                    <span>Comprehensive Archive</span>
                  </div>
                  <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
                    Explore Anime
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-400">
                    Filter across genres, broadcast formats, and critical acclaim.
                  </p>
                </div>

                {/* Format Filter & Sorter */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Format Filter */}
                  <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#12141c] p-1 text-xs">
                    {['All', 'TV', 'Movie'].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setSelectedFormat(fmt)}
                        className={`px-3 py-1 rounded-md transition cursor-pointer font-medium ${
                          selectedFormat === fmt
                            ? 'bg-rose-600 text-white font-semibold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>

                  {/* Sorter Dropdown */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      aria-label="Sort anime by"
                      className="rounded-lg border border-white/10 bg-[#12141c] px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    >
                      <option value="score">Highest Rated</option>
                      <option value="popularity">Most Popular</option>
                      <option value="episodes">Episode Count</option>
                      <option value="year">Release Year</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Genre Selector Bar (Segmented Controls) */}
              <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {GENRE_LIST.map((genre) => {
                  const isSelected = selectedGenre === genre;
                  return (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-white text-slate-900 font-bold shadow-sm'
                          : 'border border-white/10 bg-[#12141c] text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>

              {/* Grid of Anime Cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredAnime.map((anime) => (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                    onSelect={(a) => setDetailAnime(a)}
                    onPlay={(a, ep) => handleOpenPlayer(a, ep || 1)}
                    onToggleWatchlist={handleToggleWatchlist}
                    isInWatchlist={isInWatchlist(anime.id)}
                  />
                ))}
              </div>

            </section>
          </div>
        )}

        {/* Simulcast Broadcast Schedule Tab */}
        {activeTab === 'schedule' && (
          <SimulcastSchedule
            animeList={ANIME_DATABASE}
            onSelectAnime={(a) => setDetailAnime(a)}
            onPlayEpisode={(a, ep) => handleOpenPlayer(a, ep || 1)}
            onToggleWatchlist={handleToggleWatchlist}
            isInWatchlist={isInWatchlist}
          />
        )}

        {/* Character Vault Tab */}
        {activeTab === 'characters' && (
          <CharacterVault
            animeList={ANIME_DATABASE}
            onSelectAnime={(a) => setDetailAnime(a)}
          />
        )}

        {/* Soundtrack Lounge Tab */}
        {activeTab === 'soundtrack' && <SoundtrackLounge />}

        {/* Watchlist Manager Tab */}
        {activeTab === 'watchlist' && (
          <WatchlistManager
            watchlist={watchlist}
            animeList={ANIME_DATABASE}
            onSelectAnime={(a) => setDetailAnime(a)}
            onPlayEpisode={(a, ep) => handleOpenPlayer(a, ep || 1)}
            onUpdateWatchlist={handleUpdateWatchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
            onImportWatchlist={(items) => setWatchlist(items)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavClick={(tab) => setActiveTab(tab)} />

      {/* Anime Detail Drawer / Modal */}
      {detailAnime && (
        <AnimeDetailModal
          anime={detailAnime}
          onClose={() => setDetailAnime(null)}
          onPlayEpisode={(anime, epNum) => {
            setDetailAnime(null);
            handleOpenPlayer(anime, epNum);
          }}
          onUpdateWatchlist={handleUpdateWatchlist}
          userWatchItem={watchlist.find((i) => i.animeId === detailAnime.id)}
        />
      )}

      {/* Episode Video Player Modal */}
      {playerState.isOpen && playerState.anime && (
        <AnimePlayerModal
          anime={playerState.anime}
          initialEpisodeNumber={playerState.episodeNumber}
          onClose={() => setPlayerState({ isOpen: false, anime: null, episodeNumber: 1 })}
          onProgressUpdate={(animeId, epNum) => {
            const currentItem = watchlist.find((w) => w.animeId === animeId);
            if (currentItem && epNum > currentItem.progress) {
              handleUpdateWatchlist(animeId, currentItem.status, epNum, currentItem.userScore);
            }
          }}
        />
      )}

      {/* Anime Mood Roulette Modal */}
      <MoodRouletteModal
        animeList={ANIME_DATABASE}
        isOpen={isRouletteOpen}
        onClose={() => setIsRouletteOpen(false)}
        onSelectAnime={(a) => setDetailAnime(a)}
        onPlayAnime={(a) => handleOpenPlayer(a, 1)}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        animeList={ANIME_DATABASE}
        onSelectAnime={(a) => setDetailAnime(a)}
        onPlayAnime={(a) => handleOpenPlayer(a, 1)}
      />

    </div>
  );
}
