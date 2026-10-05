import React, { useState } from 'react';
import { X, Dices, Sparkles, Play, Info, RotateCw } from 'lucide-react';
import { Anime } from '../types/anime';
import confetti from 'canvas-confetti';

interface MoodRouletteModalProps {
  animeList: Anime[];
  isOpen: boolean;
  onClose: () => void;
  onSelectAnime: (anime: Anime) => void;
  onPlayAnime: (anime: Anime) => void;
}

const MOODS = [
  { id: 'action', label: 'Adrenaline & Battles', genre: 'Action', desc: 'Heart-pounding fight sequences and high stakes' },
  { id: 'fantasy', label: 'Mythic & World-Building', genre: 'Fantasy', desc: 'Enchanting lands, ancient magic, and epic quests' },
  { id: 'psych', label: 'Mind-Bending & Thrills', genre: 'Sci-Fi', desc: 'Complex plots, time twists, and psychological depths' },
  { id: 'cozy', label: 'Wholesome & Laughs', genre: 'Comedy', desc: 'Lighthearted comedy, slice-of-life, and comforting warmth' },
  { id: 'drama', label: 'Emotional & Moving', genre: 'Drama', desc: 'Compelling human journeys and tear-jerking resolutions' },
];

export const MoodRouletteModal: React.FC<MoodRouletteModalProps> = ({
  animeList,
  isOpen,
  onClose,
  onSelectAnime,
  onPlayAnime,
}) => {
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [pickedAnime, setPickedAnime] = useState<Anime | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    setIsSpinning(true);
    setPickedAnime(null);

    // Candidates matching mood
    const candidates = animeList.filter((a) => a.genres.includes(selectedMood.genre));
    const pool = candidates.length > 0 ? candidates : animeList;

    let iterations = 0;
    const interval = setInterval(() => {
      const randomCandidate = pool[Math.floor(Math.random() * pool.length)];
      setPickedAnime(randomCandidate);
      iterations++;

      if (iterations > 12) {
        clearInterval(interval);
        const finalPick = pool[Math.floor(Math.random() * pool.length)];
        setPickedAnime(finalPick);
        setIsSpinning(false);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#38bdf8', '#fbbf24'],
        });
      }
    }, 120);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e1017] p-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close anime roulette"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
            <Dices className="h-6 w-6" />
          </div>
          <h3 className="mt-3 font-display text-xl sm:text-2xl font-black text-white">
            Anime Mood Roulette
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Can't decide what to watch tonight? Pick a vibe and let fate decide.
          </p>
        </div>

        {/* Mood Selector Chips */}
        <div className="mt-5 space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Choose Your Tonight's Vibe:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MOODS.map((mood) => {
              const isSelected = selectedMood.id === mood.id;
              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                    isSelected
                      ? 'border-rose-500 bg-rose-600/15 text-white ring-1 ring-rose-500'
                      : 'border-white/5 bg-white/[0.02] text-slate-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="font-semibold">{mood.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{mood.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Spin Action */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition cursor-pointer"
          >
            <RotateCw className={`h-4 w-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Rolling for Destiny...' : 'Roll for Anime!'}</span>
          </button>
        </div>

        {/* Selected / Revealed Anime Card */}
        {pickedAnime && (
          <div className="mt-6 rounded-xl border border-white/10 bg-[#161822] p-4 transition-all">
            <div className="flex items-center gap-3">
              <img
                src={pickedAnime.bannerImage}
                alt={pickedAnime.title}
                referrerPolicy="no-referrer"
                className="h-16 w-24 rounded-lg object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  ★ Recommended Match
                </span>
                <h4 className="text-sm font-bold text-white truncate">
                  {pickedAnime.title}
                </h4>
                <p className="text-xs text-slate-400">
                  {pickedAnime.studio} · <span className="font-mono text-amber-400">★ {pickedAnime.score.toFixed(1)}</span>
                </p>
              </div>
            </div>

            <p className="mt-2.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {pickedAnime.synopsis}
            </p>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  onSelectAnime(pickedAnime);
                  onClose();
                }}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <Info className="h-3.5 w-3.5" />
                <span>Show Details</span>
              </button>
              <button
                onClick={() => {
                  onPlayAnime(pickedAnime);
                  onClose();
                }}
                className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 shadow-md shadow-rose-600/30"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Play Now</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
