import React from 'react';
import { Star, Play, Bookmark } from 'lucide-react';
import { Anime } from '../types/anime';

interface AnimeCardProps {
  anime: Anime;
  onSelect: (anime: Anime) => void;
  onPlay: (anime: Anime, ep?: number) => void;
  onToggleWatchlist: (animeId: string) => void;
  isInWatchlist: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  onSelect,
  onPlay,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#12141c] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-black/50">
      
      {/* Visual Cover Asset */}
      <div
        onClick={() => onSelect(anime)}
        className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-slate-900 cursor-pointer"
      >
        <img
          src={anime.bannerImage}
          alt={anime.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Measured Contrast Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-transparent to-black/30" />

        {/* Hover Quick Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100 bg-black/40">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(anime, 1);
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
            title="Watch Episode 1"
          >
            <Play className="h-5 w-5 fill-white ml-0.5" />
          </button>
        </div>

        {/* Top Floating Watchlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(anime.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-lg border backdrop-blur-md transition-all cursor-pointer ${
            isInWatchlist
              ? 'border-emerald-500/40 bg-emerald-500/30 text-emerald-300'
              : 'border-white/10 bg-black/50 text-slate-300 hover:bg-black/70 hover:text-white'
          }`}
          title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Bookmark className={`h-4 w-4 ${isInWatchlist ? 'fill-emerald-400' : ''}`} />
        </button>

        {/* Bottom Format & Ep Count */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-medium text-slate-300">
          <span className="text-xs font-mono font-semibold text-amber-300 flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-300" />
            <span className="tabular-nums">{anime.score.toFixed(2)}</span>
          </span>
          <span className="text-slate-300 font-mono">
            {anime.episodes} Ep{anime.episodes > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Card Info Body */}
      <div className="flex flex-1 flex-col p-3.5">
        
        {/* Unboxed Metadata (Zero-pill) */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>{anime.format}</span>
          <span aria-hidden="true">·</span>
          <span>{anime.studio}</span>
          <span aria-hidden="true">·</span>
          <span>{anime.year}</span>
        </div>

        {/* Title */}
        <button
          onClick={() => onSelect(anime)}
          className="mt-1 text-left cursor-pointer focus:outline-none"
        >
          <h3 className="line-clamp-1 text-sm font-bold text-slate-100 transition-colors group-hover:text-rose-400">
            {anime.title}
          </h3>
          <p className="line-clamp-1 text-[11px] text-slate-500 font-mono">
            {anime.japaneseTitle}
          </p>
        </button>

        {/* Synopsis snippet */}
        <p className="mt-2 line-clamp-2 text-xs text-slate-400 leading-relaxed">
          {anime.synopsis}
        </p>

        {/* Genres unboxed with · separator */}
        <div className="mt-auto pt-3 flex flex-wrap items-center gap-1 text-[11px] text-slate-400">
          {anime.genres.slice(0, 3).map((genre, idx) => (
            <React.Fragment key={genre}>
              <span>{genre}</span>
              {idx < Math.min(anime.genres.length, 3) - 1 && (
                <span aria-hidden="true" className="text-slate-600">·</span>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>

    </div>
  );
};
