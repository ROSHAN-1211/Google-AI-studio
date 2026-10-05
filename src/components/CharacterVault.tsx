import React, { useState } from 'react';
import { Users, Search, Quote, Sparkles } from 'lucide-react';
import { Anime, Character } from '../types/anime';

interface CharacterVaultProps {
  animeList: Anime[];
  onSelectAnime: (anime: Anime) => void;
}

export const CharacterVault: React.FC<CharacterVaultProps> = ({ animeList, onSelectAnime }) => {
  const [roleFilter, setRoleFilter] = useState<'All' | 'Main' | 'Antagonist'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Flatten all characters
  const allCharacters: Character[] = animeList.flatMap((a) => a.characters);

  const filteredCharacters = allCharacters.filter((char) => {
    const matchesRole = roleFilter === 'All' || char.role === roleFilter;
    const matchesSearch =
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.japaneseName.includes(searchQuery) ||
      char.animeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.voiceActor.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
            <Users className="h-4 w-4" />
            <span>Character Archive & Voice Talents</span>
          </div>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
            Character Vault
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Legendary protagonists, antagonists, and the revered seiyuu behind their voices.
          </p>
        </div>

        {/* Search input & filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -mt-2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search character or actor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-lg border border-white/10 bg-[#12141c] pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#12141c] p-1 text-xs">
            {(['All', 'Main', 'Antagonist'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-md transition cursor-pointer font-medium ${
                  roleFilter === r
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Characters */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCharacters.map((char) => {
          const associatedAnime = animeList.find((a) => a.id === char.animeId);

          return (
            <div
              key={char.id}
              className="group relative flex flex-col rounded-2xl border border-white/5 bg-[#12141c] p-4 transition-all duration-300 hover:border-white/20 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <img
                  src={char.avatar}
                  alt={char.name}
                  referrerPolicy="no-referrer"
                  className="h-20 w-20 rounded-2xl object-cover border border-white/10 shrink-0 shadow-md transition-transform group-hover:scale-105"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-medium text-rose-400">
                      {char.role}
                    </span>
                    {associatedAnime && (
                      <button
                        onClick={() => onSelectAnime(associatedAnime)}
                        className="text-[10px] text-slate-400 hover:text-white transition truncate max-w-[120px] text-right cursor-pointer"
                        title={char.animeTitle}
                      >
                        {char.animeTitle}
                      </button>
                    )}
                  </div>

                  <h3 className="mt-0.5 truncate text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                    {char.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {char.japaneseName}
                  </p>

                  <div className="mt-2 text-[11px] text-slate-400">
                    CV: <span className="font-medium text-slate-200">{char.voiceActor.name}</span>{' '}
                    <span className="text-slate-500 font-mono">({char.voiceActor.japaneseName})</span>
                  </div>
                </div>
              </div>

              {/* Iconic Quote */}
              <div className="mt-4 rounded-xl border border-white/5 bg-black/30 p-3 relative">
                <Quote className="absolute top-2 left-2 h-4 w-4 text-rose-500/20" />
                <p className="pl-4 text-xs italic text-slate-300 leading-relaxed">
                  "{char.quote}"
                </p>
              </div>

              {/* Archetype / Traits Tags (Unboxed with ·) */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 pt-2 border-t border-white/5">
                <Sparkles className="h-3 w-3 text-amber-400/80" />
                {char.traits.map((trait, idx) => (
                  <React.Fragment key={trait}>
                    <span className="text-slate-300">{trait}</span>
                    {idx < char.traits.length - 1 && (
                      <span aria-hidden="true" className="text-slate-600">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
