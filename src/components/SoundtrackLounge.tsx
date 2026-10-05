import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Disc, Radio } from 'lucide-react';
import { SOUNDTRACK_DATABASE } from '../data/soundtrackData';
import { OSTTrack } from '../types/anime';
import { audioSynth } from '../utils/audioSynth';

export const SoundtrackLounge: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const currentTrack: OSTTrack = SOUNDTRACK_DATABASE[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioSynth.setTrackScale(currentTrack.bpm, currentTrack.keySignature);
      audioSynth.play();
    } else {
      audioSynth.pause();
    }

    return () => {
      audioSynth.pause();
    };
  }, [isPlaying, currentTrackIndex, currentTrack]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % SOUNDTRACK_DATABASE.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + SOUNDTRACK_DATABASE.length) % SOUNDTRACK_DATABASE.length);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioSynth.setVolume(val);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
            <Radio className="h-4 w-4 animate-pulse" />
            <span>Harmonic OST Player & Ambient Lo-Fi</span>
          </div>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
            Soundtrack Lounge
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Immerse yourself in synthesized anime themes and soothing lo-fi soundscapes generated via browser audio synthesis.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Active Vinyl / Visualizer Card */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#12141c] p-6 shadow-xl flex flex-col items-center text-center">
          
          {/* Animated Vinyl Disc Container */}
          <div className="relative my-4 flex items-center justify-center">
            <div
              className={`h-48 w-48 sm:h-56 sm:w-56 rounded-full border-4 border-white/10 p-2 shadow-2xl bg-gradient-to-tr from-slate-900 to-black ${
                isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''
              }`}
            >
              <img
                src={currentTrack.coverArt}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className="h-full w-full rounded-full object-cover shadow-inner opacity-80"
              />
              <div className="absolute inset-0 m-auto h-12 w-12 rounded-full border-2 border-slate-800 bg-[#090a0f] flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
              </div>
            </div>
          </div>

          {/* Track Info */}
          <div className="mt-2 w-full">
            <div className="text-[11px] font-mono font-semibold text-rose-400">
              {currentTrack.themeType} · {currentTrack.animeTitle}
            </div>
            <h3 className="mt-1 text-lg font-bold text-white">
              {currentTrack.title}
            </h3>
            <p className="text-xs text-slate-400">
              {currentTrack.artist}
            </p>
          </div>

          {/* Audio Visualizer Bars */}
          <div className="mt-6 flex items-end justify-center gap-1.5 h-10 w-full px-8">
            {[14, 28, 42, 65, 80, 52, 90, 75, 40, 60, 85, 30, 70, 45].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-rose-600 to-amber-400 transition-all duration-150"
                style={{
                  height: isPlaying ? `${Math.max(10, Math.sin(i + Date.now() * 0.005) * 35 + h * 0.45)}%` : '15%',
                  opacity: isPlaying ? 0.9 : 0.25,
                }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              aria-label="Previous track"
              className="p-2 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause track' : 'Play track'}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 fill-white" />
              ) : (
                <Play className="h-6 w-6 fill-white ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              aria-label="Next track"
              className="p-2 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="mt-5 flex items-center gap-2 w-48 justify-center text-slate-400">
            <Volume2 className="h-4 w-4" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={handleVolumeChange}
              aria-label="Volume slider"
              className="w-full accent-rose-500 h-1 cursor-pointer"
            />
          </div>

          {/* Details */}
          <div className="mt-4 flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span>{currentTrack.bpm} BPM</span>
            <span aria-hidden="true">·</span>
            <span>Key: {currentTrack.keySignature}</span>
          </div>

        </div>

        {/* Playlist List */}
        <div className="lg:col-span-7 rounded-2xl border border-white/5 bg-[#12141c] p-4 sm:p-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Soundtrack Curations ({SOUNDTRACK_DATABASE.length})
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Web Audio Synth Engine</span>
          </div>

          <div className="mt-3 divide-y divide-white/5">
            {SOUNDTRACK_DATABASE.map((track, idx) => {
              const isCurrent = idx === currentTrackIndex;
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl transition cursor-pointer ${
                    isCurrent
                      ? 'bg-rose-600/10 text-white'
                      : 'hover:bg-white/[0.03] text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="font-mono text-xs w-4 text-slate-500 tabular-nums">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-white/10">
                      <img
                        src={track.coverArt}
                        alt={track.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                      {isCurrent && isPlaying && (
                        <div className="absolute inset-0 bg-rose-600/50 flex items-center justify-center">
                          <Disc className="h-4 w-4 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs sm:text-sm font-semibold truncate ${isCurrent ? 'text-rose-400' : 'text-slate-100'}`}>
                        {track.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {track.artist} · <span className="text-slate-400">{track.animeTitle}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="hidden sm:inline text-[10px] rounded bg-white/5 px-2 py-0.5">
                      {track.themeType}
                    </span>
                    <span>{track.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </section>
  );
};
