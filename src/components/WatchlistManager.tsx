import React, { useState } from 'react';
import { Bookmark, Plus, Trash2, Star, Play, CheckCircle2, ListFilter, Download, Upload } from 'lucide-react';
import { Anime, UserWatchlistItem, WatchStatus } from '../types/anime';

interface WatchlistManagerProps {
  watchlist: UserWatchlistItem[];
  animeList: Anime[];
  onSelectAnime: (anime: Anime) => void;
  onPlayEpisode: (anime: Anime, ep?: number) => void;
  onUpdateWatchlist: (
    animeId: string,
    status: WatchStatus,
    progress: number,
    score: number
  ) => void;
  onRemoveFromWatchlist: (animeId: string) => void;
  onImportWatchlist?: (items: UserWatchlistItem[]) => void;
}

export const WatchlistManager: React.FC<WatchlistManagerProps> = ({
  watchlist,
  animeList,
  onSelectAnime,
  onPlayEpisode,
  onUpdateWatchlist,
  onRemoveFromWatchlist,
  onImportWatchlist,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Map watchlist items with anime metadata
  const enrichedItems = watchlist
    .map((item) => {
      const anime = animeList.find((a) => a.id === item.animeId);
      return { item, anime };
    })
    .filter((entry): entry is { item: UserWatchlistItem; anime: Anime } => Boolean(entry.anime));

  const filteredItems = enrichedItems.filter((entry) => {
    if (selectedStatus === 'All') return true;
    return entry.item.status === selectedStatus;
  });

  // Calculate statistics
  const totalEpisodesWatched = enrichedItems.reduce((acc, curr) => acc + curr.item.progress, 0);
  const scoredItems = enrichedItems.filter((entry) => entry.item.userScore > 0);
  const meanScore =
    scoredItems.length > 0
      ? (scoredItems.reduce((acc, curr) => acc + curr.item.userScore, 0) / scoredItems.length).toFixed(1)
      : '0.0';

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(watchlist, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `animura_watchlist_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && onImportWatchlist) {
            onImportWatchlist(parsed);
          }
        } catch {
          // invalid json
        }
      };
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
            <Bookmark className="h-4 w-4" />
            <span>Personal Collection & Tracker</span>
          </div>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
            My Anime Library
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Keep track of your current shows, log watched episodes, and score your favorites.
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-4 sm:gap-6 rounded-2xl border border-white/10 bg-[#12141c] p-4 text-center">
          <div>
            <span className="block text-xl sm:text-2xl font-mono font-bold text-white tabular-nums">
              {enrichedItems.length}
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Total Shows</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <span className="block text-xl sm:text-2xl font-mono font-bold text-rose-400 tabular-nums">
              {totalEpisodesWatched}
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Episodes</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <span className="block text-xl sm:text-2xl font-mono font-bold text-amber-400 tabular-nums">
              ★ {meanScore}
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Mean Score</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Export/Import Controls */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 rounded-xl border border-white/10 bg-[#12141c]">
          {['All', 'Watching', 'Plan to Watch', 'Completed', 'On Hold', 'Dropped'].map((status) => {
            const count = enrichedItems.filter((e) => (status === 'All' ? true : e.item.status === status)).length;
            const isSelected = selectedStatus === status;

            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{status}</span>
                <span className="ml-1.5 font-mono text-[10px] opacity-75 tabular-nums">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Export / Import Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            title="Export watchlist as JSON"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>

          <label className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer">
            <Upload className="h-3.5 w-3.5" />
            <span>Import</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Library Table / Cards List */}
      <div className="mt-6">
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-[#12141c]/50 p-12 text-center">
            <Bookmark className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <h4 className="text-sm font-semibold text-slate-300">No Anime in this Category</h4>
            <p className="mt-1 text-xs text-slate-500">
              Browse the catalog and click "+ Add to Watchlist" to start tracking your anime journey.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map(({ item, anime }) => {
              const percentWatched = Math.min(100, Math.round((item.progress / anime.episodes) * 100));

              return (
                <div
                  key={item.animeId}
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-white/5 bg-[#12141c] p-4 transition-all hover:border-white/20 hover:bg-[#161822]"
                >
                  {/* Left: Thumbnail & Titles */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div
                      onClick={() => onSelectAnime(anime)}
                      className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-900 cursor-pointer"
                    >
                      <img
                        src={anime.bannerImage}
                        alt={anime.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/5">
                        <Play className="h-4 w-4 fill-white text-white" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <button
                        onClick={() => onSelectAnime(anime)}
                        className="text-left cursor-pointer focus:outline-none"
                      >
                        <h4 className="truncate text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                          {anime.title}
                        </h4>
                        <p className="truncate text-xs text-slate-400 font-mono">
                          {anime.japaneseTitle}
                        </p>
                      </button>

                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                        <span>{anime.format}</span>
                        <span aria-hidden="true">·</span>
                        <span>{anime.studio}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-400 font-mono font-medium">
                          ★ {anime.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center: Progress & Status */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    {/* Status selector */}
                    <select
                      value={item.status}
                      onChange={(e) =>
                        onUpdateWatchlist(anime.id, e.target.value as WatchStatus, item.progress, item.userScore)
                      }
                      aria-label="Anime status"
                      className="rounded-lg border border-white/10 bg-[#0e1017] px-2.5 py-1 text-xs text-slate-200"
                    >
                      <option value="Watching">Watching</option>
                      <option value="Plan to Watch">Plan to Watch</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Dropped">Dropped</option>
                    </select>

                    {/* Progress Bar & +1 Increment */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-24 sm:w-28">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                          <span>{item.progress}/{anime.episodes}</span>
                          <span>{percentWatched}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full transition-all"
                            style={{ width: `${percentWatched}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          onUpdateWatchlist(
                            anime.id,
                            item.progress + 1 >= anime.episodes ? 'Completed' : item.status,
                            Math.min(anime.episodes, item.progress + 1),
                            item.userScore
                          )
                        }
                        disabled={item.progress >= anime.episodes}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-rose-600 hover:text-white hover:border-rose-600 disabled:opacity-30 transition cursor-pointer"
                        title="Watched +1 Episode"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Score Selector */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400">Score:</span>
                      <select
                        value={item.userScore}
                        onChange={(e) =>
                          onUpdateWatchlist(
                            anime.id,
                            item.status,
                            item.progress,
                            parseInt(e.target.value)
                          )
                        }
                        aria-label="User rating"
                        className="rounded-lg border border-white/10 bg-[#0e1017] px-2 py-1 text-xs font-mono text-amber-300"
                      >
                        <option value={0}>-</option>
                        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((s) => (
                          <option key={s} value={s}>
                            ★ {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Play & Delete Action */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onPlayEpisode(anime, Math.min(anime.episodes, item.progress + 1))}
                        className="flex items-center gap-1 rounded-lg bg-rose-600/20 px-2.5 py-1 text-xs font-medium text-rose-300 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                        title="Resume playback"
                      >
                        <Play className="h-3 w-3 fill-rose-300" />
                        <span>Resume</span>
                      </button>

                      <button
                        onClick={() => onRemoveFromWatchlist(anime.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="h-4 w-4" />
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
