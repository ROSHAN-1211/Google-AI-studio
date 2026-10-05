import React, { useState, useEffect } from 'react';
import { Play, Info, Bookmark, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { Anime } from '../types/anime';

interface HeroBannerProps {
  featuredAnime: Anime[];
  onSelectAnime: (anime: Anime) => void;
  onPlayEpisode: (anime: Anime, episodeNumber?: number) => void;
  onToggleWatchlist: (animeId: string) => void;
  isInWatchlist: (animeId: string) => boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredAnime,
  onSelectAnime,
  onPlayEpisode,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto advance every 8 seconds if user is idle
  useEffect(() => {
    if (featuredAnime.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredAnime.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredAnime.length]);

  if (!featuredAnime || featuredAnime.length === 0) return null;

  const current = featuredAnime[currentIndex];
  const inWatchlist = isInWatchlist(current.id);

  return (
    <section className="relative w-full overflow-hidden bg-[#090a0f] pt-2">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Banner Frame */}
        <div className="relative aspect-[16/9] max-h-[580px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-slate-900">
          
          {/* Main Backdrop Image */}
          <img
            src={current.bannerImage}
            alt={current.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center transition-all duration-700 ease-out"
          />

          {/* Measured Contrast Scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090a0f]/90 via-[#090a0f]/40 to-transparent max-w-3xl" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
            
            {/* Unboxed Metadata (Zero-pill discipline) */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <span className="font-mono tabular-nums">{current.score.toFixed(2)}</span>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{current.format}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{current.episodes} Episodes</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{current.season}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{current.studio}</span>
            </div>

            {/* Title & Japanese subtitle */}
            <div className="mt-2.5 max-w-2xl">
              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance drop-shadow-md">
                {current.title}
              </h1>
              <p className="mt-1 text-xs sm:text-sm font-medium text-rose-300/80 tracking-wide">
                {current.japaneseTitle} <span className="text-slate-500">({current.romajiTitle})</span>
              </p>
            </div>

            {/* Synopsis */}
            <p className="mt-3 max-w-2xl text-xs sm:text-sm text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed">
              {current.synopsis}
            </p>

            {/* Genres unboxed with clean bullet separators */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              {current.genres.map((genre, idx) => (
                <React.Fragment key={genre}>
                  <span>{genre}</span>
                  {idx < current.genres.length - 1 && (
                    <span aria-hidden="true" className="text-slate-600">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onPlayEpisode(current, 1)}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-500 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Watch Episode 1</span>
              </button>

              <button
                onClick={() => onSelectAnime(current)}
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 cursor-pointer whitespace-nowrap"
              >
                <Info className="h-4 w-4" />
                <span>Details & Episodes</span>
              </button>

              <button
                onClick={() => onToggleWatchlist(current.id)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  inWatchlist
                    ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                    : 'border-white/15 bg-black/40 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${inWatchlist ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>

          </div>

          {/* Carousel Arrows */}
          <div className="absolute right-4 bottom-4 hidden sm:flex items-center gap-2 z-10">
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev - 1 + featuredAnime.length) % featuredAnime.length)
              }
              aria-label="Previous Featured Anime"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/50 text-white backdrop-blur-sm transition hover:bg-white/20 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % featuredAnime.length)
              }
              aria-label="Next Featured Anime"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/50 text-white backdrop-blur-sm transition hover:bg-white/20 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Thumbnail Selector Strip */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {featuredAnime.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`group flex items-center gap-3 rounded-xl border p-2 text-left transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'border-rose-500/60 bg-white/10 ring-1 ring-rose-500/40'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
              }`}
            >
              <img
                src={item.bannerImage}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="h-11 w-14 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-200 group-hover:text-white">
                  {item.title}
                </p>
                <p className="truncate text-[11px] text-slate-400">
                  {item.studio} · <span className="font-mono tabular-nums">★ {item.score.toFixed(1)}</span>
                </p>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
