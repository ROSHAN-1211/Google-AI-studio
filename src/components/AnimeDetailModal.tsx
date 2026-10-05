import React, { useState } from 'react';
import { X, Play, Star, Bookmark, Calendar, Film, Check, ThumbsUp, Send } from 'lucide-react';
import { Anime, Episode, Review, WatchStatus } from '../types/anime';
import confetti from 'canvas-confetti';

interface AnimeDetailModalProps {
  anime: Anime | null;
  onClose: () => void;
  onPlayEpisode: (anime: Anime, epNumber: number) => void;
  onUpdateWatchlist: (
    animeId: string,
    status: WatchStatus,
    progress: number,
    score: number
  ) => void;
  userWatchItem?: {
    status: WatchStatus;
    progress: number;
    userScore: number;
  };
}

export const AnimeDetailModal: React.FC<AnimeDetailModalProps> = ({
  anime,
  onClose,
  onPlayEpisode,
  onUpdateWatchlist,
  userWatchItem,
}) => {
  const [activeTab, setActiveTab] = useState<'episodes' | 'characters' | 'reviews'>('episodes');
  const [watchStatus, setWatchStatus] = useState<WatchStatus>(userWatchItem?.status || 'Watching');
  const [epProgress, setEpProgress] = useState<number>(userWatchItem?.progress || 0);
  const [userRating, setUserRating] = useState<number>(userWatchItem?.userScore || 0);
  const [reviewsList, setReviewsList] = useState<Review[]>(anime?.reviews || []);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewScore, setNewReviewScore] = useState(10);
  const [hasSaved, setHasSaved] = useState(false);

  if (!anime) return null;

  const handleSaveWatchlist = () => {
    onUpdateWatchlist(anime.id, watchStatus, epProgress, userRating);
    setHasSaved(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f43f5e', '#ec4899', '#6366f1'],
    });
    setTimeout(() => setHasSaved(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: 'You (Otaku Explorer)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      rating: newReviewScore,
      date: 'Just now',
      content: newReviewText.trim(),
      helpfulCount: 0,
      tag: newReviewScore >= 9 ? 'Masterpiece' : newReviewScore >= 7 ? 'Recommended' : 'Mixed',
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewText('');
  };

  const handleHelpful = (revId: string) => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === revId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0e1017] shadow-2xl my-auto max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close anime details"
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-slate-300 backdrop-blur-md transition hover:bg-black/90 hover:text-white cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Scroll Container */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Header Backdrop Banner */}
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-slate-900">
            <img
              src={anime.bannerImage}
              alt={anime.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-[#0e1017]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e1017]/80 via-transparent to-transparent" />
            
            {/* Play Hero Button in Banner */}
            <div className="absolute bottom-4 left-6 sm:left-8 flex items-center gap-3">
              <button
                onClick={() => onPlayEpisode(anime, 1)}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/30 transition hover:bg-rose-500 cursor-pointer"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Play Episode 1</span>
              </button>
            </div>
          </div>

          {/* Core Content */}
          <div className="px-6 py-5 sm:px-8">
            
            {/* Title & Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {anime.title}
                </h2>
                <p className="mt-0.5 text-xs text-rose-300 font-mono">
                  {anime.japaneseTitle} <span className="text-slate-500">· {anime.romajiTitle}</span>
                </p>
                
                {/* Unboxed Metadata (Zero-pill) */}
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span className="font-mono tabular-nums">{anime.score.toFixed(2)}</span>
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>Rank #{anime.rank}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{anime.format}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{anime.episodes} Episodes</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{anime.studio}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{anime.season}</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="shrink-0 flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Status: {anime.status}</span>
              </div>
            </div>

            {/* Synopsis */}
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Synopsis
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {anime.synopsis}
              </p>
            </div>

            {/* Genres */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
              <span className="text-slate-400 font-medium">Genres:</span>
              {anime.genres.map((g, idx) => (
                <React.Fragment key={g}>
                  <span className="text-slate-300">{g}</span>
                  {idx < anime.genres.length - 1 && (
                    <span aria-hidden="true" className="text-slate-600">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Personal Watchlist Controls Box */}
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Bookmark className="h-4 w-4 text-rose-400" />
                  <span>My Watchlist Tracking</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {/* Status Dropdown */}
                  <select
                    value={watchStatus}
                    onChange={(e) => setWatchStatus(e.target.value as WatchStatus)}
                    aria-label="Watch status"
                    className="rounded-lg border border-white/10 bg-[#161922] px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="Watching">Watching</option>
                    <option value="Plan to Watch">Plan to Watch</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Dropped">Dropped</option>
                  </select>

                  {/* Progress Input */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span>Ep</span>
                    <input
                      type="number"
                      min={0}
                      max={anime.episodes}
                      value={epProgress}
                      onChange={(e) => setEpProgress(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-14 rounded-lg border border-white/10 bg-[#161922] px-2 py-1.5 text-center text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <span>/ {anime.episodes}</span>
                  </div>

                  {/* Rating Selector */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span>Score</span>
                    <select
                      value={userRating}
                      onChange={(e) => setUserRating(parseInt(e.target.value))}
                      aria-label="User rating"
                      className="rounded-lg border border-white/10 bg-[#161922] px-2.5 py-1.5 text-xs font-mono text-amber-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    >
                      <option value={0}>- Select -</option>
                      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((s) => (
                        <option key={s} value={s}>
                          ★ {s} {s === 10 ? '(Masterpiece)' : s === 9 ? '(Great)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Save button */}
                  <button
                    onClick={handleSaveWatchlist}
                    className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-500 cursor-pointer"
                  >
                    {hasSaved ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <span>Save Progress</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Section Tabs */}
            <div className="mt-8 border-b border-white/10">
              <div className="flex items-center gap-6 text-xs sm:text-sm font-medium">
                <button
                  onClick={() => setActiveTab('episodes')}
                  className={`pb-3 transition-colors cursor-pointer ${
                    activeTab === 'episodes'
                      ? 'border-b-2 border-rose-500 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Episodes ({anime.episodesList.length})
                </button>
                <button
                  onClick={() => setActiveTab('characters')}
                  className={`pb-3 transition-colors cursor-pointer ${
                    activeTab === 'characters'
                      ? 'border-b-2 border-rose-500 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Characters & Cast ({anime.characters.length})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 transition-colors cursor-pointer ${
                    activeTab === 'reviews'
                      ? 'border-b-2 border-rose-500 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Community Reviews ({reviewsList.length})
                </button>
              </div>
            </div>

            {/* Tab 1: Episodes */}
            {activeTab === 'episodes' && (
              <div className="mt-4 space-y-2.5">
                {anime.episodesList.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => onPlayEpisode(anime, ep.number)}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/5 bg-[#12141c] p-3 transition hover:border-white/20 hover:bg-[#181a24] cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-900">
                        <img
                          src={ep.thumbnail}
                          alt={ep.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10">
                          <Play className="h-4 w-4 fill-white text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-rose-400">
                            EP {ep.number}
                          </span>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-rose-300">
                            {ep.title}
                          </h4>
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                          {ep.synopsis}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-slate-400 font-mono">
                      <span>{ep.duration}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayEpisode(anime, ep.number);
                        }}
                        className="rounded-lg bg-rose-600/20 px-2.5 py-1 text-xs font-medium text-rose-300 hover:bg-rose-600 hover:text-white"
                      >
                        Play
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Characters & Cast */}
            {activeTab === 'characters' && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {anime.characters.map((char) => (
                  <div
                    key={char.id}
                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-[#12141c] p-3"
                  >
                    <img
                      src={char.avatar}
                      alt={char.name}
                      referrerPolicy="no-referrer"
                      className="h-14 w-14 rounded-xl object-cover shrink-0 border border-white/10"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="truncate text-xs sm:text-sm font-bold text-slate-100">
                          {char.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">{char.role}</span>
                      </div>
                      <p className="text-[11px] text-rose-300 font-mono">{char.japaneseName}</p>
                      <p className="mt-1.5 text-xs italic text-slate-300 line-clamp-2">
                        "{char.quote}"
                      </p>
                      <div className="mt-2 text-[11px] text-slate-400">
                        VA: <span className="text-slate-200">{char.voiceActor.name}</span>{' '}
                        <span className="text-slate-400 font-mono">({char.voiceActor.japaneseName})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === 'reviews' && (
              <div className="mt-4 space-y-4">
                
                {/* Submit New Review Form */}
                <form
                  onSubmit={handleAddReview}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                >
                  <h4 className="text-xs font-semibold text-slate-200">Write a Community Review</h4>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xs text-slate-400">Your Rating:</span>
                    <select
                      value={newReviewScore}
                      onChange={(e) => setNewReviewScore(parseInt(e.target.value))}
                      aria-label="Review rating"
                      className="rounded-lg border border-white/10 bg-[#161922] px-2.5 py-1 text-xs font-mono text-amber-300"
                    >
                      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((s) => (
                        <option key={s} value={s}>
                          ★ {s} / 10
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Share your perspective on the animation, sound, pacing, and story..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="mt-2.5 w-full rounded-lg border border-white/10 bg-[#161922] p-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={!newReviewText.trim()}
                      className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Post Review</span>
                    </button>
                  </div>
                </form>

                {/* Review Cards */}
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-white/5 bg-[#12141c] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          referrerPolicy="no-referrer"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-200">{rev.author}</p>
                          <p className="text-[10px] text-slate-500">{rev.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-mono font-semibold text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span>{rev.rating} / 10</span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                      {rev.content}
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[11px] text-slate-400">
                      <span className="text-rose-400/80">{rev.tag}</span>
                      <button
                        onClick={() => handleHelpful(rev.id)}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>Helpful ({rev.helpfulCount})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
