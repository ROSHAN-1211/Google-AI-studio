import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Play, Star, ArrowRight } from 'lucide-react';
import { Anime } from '../types/anime';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  animeList: Anime[];
  onSelectAnime: (anime: Anime) => void;
  onPlayAnime: (anime: Anime) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  animeList,
  onSelectAnime,
  onPlayAnime,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown handler for Escape or /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? animeList.filter((a) => {
        const q = query.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.japaneseTitle.includes(q) ||
          a.romajiTitle.toLowerCase().includes(q) ||
          a.studio.toLowerCase().includes(q) ||
          a.genres.some((g) => g.toLowerCase().includes(q)) ||
          a.characters.some((c) => c.name.toLowerCase().includes(q))
        );
      })
    : animeList.slice(0, 5); // default trending if empty

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0e1017] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 bg-[#12141c]">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime title, studio, genre, or character..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="rounded bg-white/10 px-2 py-0.5 text-[11px] font-mono text-slate-300 hover:bg-white/20"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {query.trim() ? `Search Results (${results.length})` : 'Popular Searches'}
          </div>

          {results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No anime found matching "{query}". Try checking by genre or studio.
            </div>
          ) : (
            results.map((anime) => (
              <div
                key={anime.id}
                onClick={() => {
                  onSelectAnime(anime);
                  onClose();
                }}
                className="group flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-white/10 hover:bg-[#161824] transition cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={anime.bannerImage}
                    alt={anime.title}
                    referrerPolicy="no-referrer"
                    className="h-12 w-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-rose-400 truncate">
                      {anime.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {anime.japaneseTitle} · {anime.studio} · {anime.episodes} Ep
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className="flex items-center gap-1 text-xs font-mono font-semibold text-amber-400">
                    <Star className="h-3 w-3 fill-amber-400" />
                    <span>{anime.score.toFixed(1)}</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayAnime(anime);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white transition"
                    title="Play anime"
                  >
                    <Play className="h-3.5 w-3.5 fill-rose-300" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
