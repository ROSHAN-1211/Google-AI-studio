import React from 'react';
import { Search, Bookmark, Dices } from 'lucide-react';

interface NavbarProps {
  activeTab: 'discover' | 'schedule' | 'characters' | 'soundtrack' | 'watchlist';
  setActiveTab: (tab: 'discover' | 'schedule' | 'characters' | 'soundtrack' | 'watchlist') => void;
  watchlistCount: number;
  onOpenSearch: () => void;
  onOpenRoulette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  watchlistCount,
  onOpenSearch,
  onOpenRoulette,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#090a0f]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('discover')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-display text-2xl font-black tracking-tight text-white transition-colors group-hover:text-rose-400">
            Animura
          </span>
          <span className="ml-1 text-xs font-normal text-slate-500 font-sans tracking-widest uppercase">
            アニムラ
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links with hover states */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('discover')}
            className={`cursor-pointer transition-colors hover:text-white ${
              activeTab === 'discover' ? 'text-white font-semibold' : ''
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`cursor-pointer transition-colors hover:text-white ${
              activeTab === 'schedule' ? 'text-white font-semibold' : ''
            }`}
          >
            Simulcast
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`cursor-pointer transition-colors hover:text-white ${
              activeTab === 'characters' ? 'text-white font-semibold' : ''
            }`}
          >
            Characters
          </button>
          <button
            onClick={() => setActiveTab('soundtrack')}
            className={`cursor-pointer transition-colors hover:text-white ${
              activeTab === 'soundtrack' ? 'text-white font-semibold' : ''
            }`}
          >
            Soundtracks
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`cursor-pointer transition-colors hover:text-white flex items-center gap-1.5 ${
              activeTab === 'watchlist' ? 'text-white font-semibold' : ''
            }`}
          >
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="text-xs font-mono tabular-nums text-rose-400">
                ({watchlistCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-1 focus:ring-rose-500/50"
            title="Search Anime (Cmd+K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline rounded bg-white/10 px-1 py-0.5 text-[10px] font-mono text-slate-400">
              /
            </kbd>
          </button>

          <button
            onClick={onOpenRoulette}
            className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 transition-all hover:bg-rose-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
            title="Roll Random Anime"
          >
            <Dices className="h-3.5 w-3.5 text-rose-400" />
            <span className="hidden sm:inline">Anime Roulette</span>
          </button>

          <button
            onClick={() => setActiveTab('watchlist')}
            className="md:hidden flex items-center p-2 text-slate-400 hover:text-white"
            title="Watchlist"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* Mobile subnav bar */}
      <div className="flex md:hidden items-center justify-around border-t border-white/5 px-2 py-2 text-xs font-medium text-slate-400 bg-[#090a0f]">
        <button
          onClick={() => setActiveTab('discover')}
          className={`px-2 py-1 ${activeTab === 'discover' ? 'text-rose-400 font-semibold' : ''}`}
        >
          Discover
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-2 py-1 ${activeTab === 'schedule' ? 'text-rose-400 font-semibold' : ''}`}
        >
          Simulcast
        </button>
        <button
          onClick={() => setActiveTab('characters')}
          className={`px-2 py-1 ${activeTab === 'characters' ? 'text-rose-400 font-semibold' : ''}`}
        >
          Vault
        </button>
        <button
          onClick={() => setActiveTab('soundtrack')}
          className={`px-2 py-1 ${activeTab === 'soundtrack' ? 'text-rose-400 font-semibold' : ''}`}
        >
          OST
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`px-2 py-1 ${activeTab === 'watchlist' ? 'text-rose-400 font-semibold' : ''}`}
        >
          Watchlist {watchlistCount > 0 && `(${watchlistCount})`}
        </button>
      </div>
    </header>
  );
};
