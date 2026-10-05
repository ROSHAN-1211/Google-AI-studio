import React from 'react';

interface FooterProps {
  onNavClick: (tab: 'discover' | 'schedule' | 'characters' | 'soundtrack' | 'watchlist') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="mt-20 border-t border-white/5 bg-[#07080c] py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Brand Wordmark */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-black text-white">Animura</span>
              <span className="text-xs text-rose-500 font-mono">アニムラ</span>
            </div>
            <p className="mt-1 text-xs text-slate-400 max-w-md">
              The premier destination for Japanese animation discovery, simulcast broadcast tracking, and community archiving.
            </p>
          </div>

          {/* Clean Navigation Mirror */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <button
              onClick={() => onNavClick('discover')}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              Discover
            </button>
            <button
              onClick={() => onNavClick('schedule')}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              Simulcast
            </button>
            <button
              onClick={() => onNavClick('characters')}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              Characters
            </button>
            <button
              onClick={() => onNavClick('soundtrack')}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              Soundtracks
            </button>
            <button
              onClick={() => onNavClick('watchlist')}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              Watchlist
            </button>
          </div>
        </div>

        {/* Quiet Copyright and disclaimer */}
        <div className="mt-8 border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Animura Entertainment. All animation rights and trademarks belong to their respective production studios.</p>
          <p className="font-mono">Crafted for anime enthusiasts worldwide</p>
        </div>

      </div>
    </footer>
  );
};
