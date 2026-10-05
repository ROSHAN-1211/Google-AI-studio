import React, { useState } from 'react';
import { Calendar, Clock, Play, Star, Bookmark } from 'lucide-react';
import { Anime } from '../types/anime';
import { AIR_DAYS } from '../data/animeData';

interface SimulcastScheduleProps {
  animeList: Anime[];
  onSelectAnime: (anime: Anime) => void;
  onPlayEpisode: (anime: Anime, ep?: number) => void;
  onToggleWatchlist: (animeId: string) => void;
  isInWatchlist: (animeId: string) => boolean;
}

export const SimulcastSchedule: React.FC<SimulcastScheduleProps> = ({
  animeList,
  onSelectAnime,
  onPlayEpisode,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  // Default to today's day of week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[new Date().getDay()] as typeof AIR_DAYS[number];

  const [selectedDay, setSelectedDay] = useState<typeof AIR_DAYS[number]>(todayName || 'Saturday');

  const filteredAnime = animeList.filter((a) => a.airDay === selectedDay);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
            <Calendar className="h-4 w-4" />
            <span>Weekly Simulcast Calendar</span>
          </div>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
            Broadcast Schedule
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Real-time episode broadcast releases synchronized with Tokyo television networks.
          </p>
        </div>

        {/* Local time badge info */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <span>Synchronized with Japan Standard Time (JST)</span>
        </div>
      </div>

      {/* Interactive Day of Week Tabs (Buttons/Segmented controls allowed per constitution) */}
      <div className="mt-6 flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-xl border border-white/10 bg-[#12141c]">
        {AIR_DAYS.map((day) => {
          const isToday = day === todayName;
          const isSelected = day === selectedDay;
          const count = animeList.filter((a) => a.airDay === day).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[100px] flex flex-col items-center justify-center py-2.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-rose-600 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>{day.slice(0, 3)}</span>
                {isToday && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="Today" />
                )}
              </div>
              <span className={`text-[10px] font-mono mt-0.5 tabular-nums ${isSelected ? 'text-rose-100' : 'text-slate-500'}`}>
                {count} {count === 1 ? 'Show' : 'Shows'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scheduled Shows Grid / List */}
      <div className="mt-8">
        {filteredAnime.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-[#12141c]/50 p-12 text-center">
            <Clock className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <h4 className="text-sm font-semibold text-slate-300">No Simulcast Scheduled</h4>
            <p className="mt-1 text-xs text-slate-500">
              Check other days of the week or browse the Discover catalog for on-demand anime.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAnime.map((anime) => {
              const inWatch = isInWatchlist(anime.id);
              return (
                <div
                  key={anime.id}
                  className="group flex flex-col rounded-xl border border-white/5 bg-[#12141c] overflow-hidden transition-all hover:border-white/20 hover:shadow-lg"
                >
                  <div
                    onClick={() => onSelectAnime(anime)}
                    className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <img
                      src={anime.bannerImage}
                      alt={anime.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-transparent to-black/40" />
                    
                    {/* Air Time Tag */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded bg-black/70 px-2 py-1 text-[11px] font-mono font-medium text-amber-300 backdrop-blur-sm">
                      <Clock className="h-3 w-3" />
                      <span>{anime.airTime}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(anime.id);
                      }}
                      className={`absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-lg border backdrop-blur-md transition cursor-pointer ${
                        inWatch
                          ? 'border-emerald-500/40 bg-emerald-500/30 text-emerald-300'
                          : 'border-white/10 bg-black/50 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Bookmark className={`h-3.5 w-3.5 ${inWatch ? 'fill-emerald-400' : ''}`} />
                    </button>

                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                      <span className="font-semibold text-rose-300">{anime.studio}</span>
                      <span className="flex items-center gap-1 text-amber-400 font-mono font-semibold">
                        <Star className="h-3 w-3 fill-amber-400" />
                        <span className="tabular-nums">{anime.score.toFixed(1)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <button
                      onClick={() => onSelectAnime(anime)}
                      className="text-left cursor-pointer focus:outline-none"
                    >
                      <h3 className="line-clamp-1 text-sm font-bold text-slate-100 group-hover:text-rose-400 transition-colors">
                        {anime.title}
                      </h3>
                      <p className="line-clamp-1 text-[11px] text-slate-500 font-mono">
                        {anime.japaneseTitle}
                      </p>
                    </button>

                    <p className="mt-2 line-clamp-2 text-xs text-slate-400 leading-relaxed">
                      {anime.synopsis}
                    </p>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400">
                        Total: <span className="font-mono text-slate-200">{anime.episodes} Ep</span>
                      </div>

                      <button
                        onClick={() => onPlayEpisode(anime, 1)}
                        className="flex items-center gap-1.5 rounded-lg bg-rose-600/20 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                      >
                        <Play className="h-3 w-3 fill-rose-300" />
                        <span>Watch Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </section>
  );
};
