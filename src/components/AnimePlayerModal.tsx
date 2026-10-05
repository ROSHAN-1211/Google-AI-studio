import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SkipForward,
  RotateCcw,
  Languages,
  Subtitles,
  Settings,
  ChevronRight,
  ListVideo,
} from 'lucide-react';
import { Anime, Episode } from '../types/anime';

interface AnimePlayerModalProps {
  anime: Anime | null;
  initialEpisodeNumber?: number;
  onClose: () => void;
  onProgressUpdate?: (animeId: string, episodeNumber: number) => void;
}

export const AnimePlayerModal: React.FC<AnimePlayerModalProps> = ({
  anime,
  initialEpisodeNumber = 1,
  onClose,
  onProgressUpdate,
}) => {
  const [currentEpNum, setCurrentEpNum] = useState(initialEpisodeNumber);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(124); // Start ~2 min in
  const totalDuration = 1450; // ~24:10
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEpDrawer, setShowEpDrawer] = useState(false);
  const [audioTrack, setAudioTrack] = useState<'Japanese (Original)' | 'English (Dub)'>('Japanese (Original)');
  const [subtitleLang, setSubtitleLang] = useState<'English' | 'Spanish' | 'French' | 'Off'>('English');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSettings, setShowSettings] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentEp: Episode | undefined =
    anime?.episodesList.find((e) => e.number === currentEpNum) || anime?.episodesList[0];

  // Playback timer ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalDuration]);

  // Report progress
  useEffect(() => {
    if (anime && onProgressUpdate) {
      onProgressUpdate(anime.id, currentEpNum);
    }
  }, [anime, currentEpNum, onProgressUpdate]);

  // Canvas ambient anime particles / simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = ['#f43f5e', '#6366f1', '#06b6d4', '#eab308', '#ffffff'];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 1,
        speedX: (Math.random() - 0.5) * 1.2,
        speedY: (Math.random() - 0.5) * 0.8 - 0.5,
        opacity: Math.random() * 0.7 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle luminous particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!anime) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const handleSkipIntro = () => {
    // Skip 85s opening
    setCurrentTime((prev) => Math.min(totalDuration, prev + 85));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setCurrentTime(Math.floor(pos * totalDuration));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md">
      <div
        ref={containerRef}
        className="relative flex flex-col h-full w-full sm:h-auto sm:max-h-[95vh] sm:max-w-6xl overflow-hidden sm:rounded-2xl border border-white/10 bg-[#07080c] shadow-2xl"
      >
        
        {/* Top Floating Header */}
        <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              aria-label="Back to library"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                {anime.title}
              </h3>
              <p className="text-[11px] text-rose-300 font-mono">
                Episode {currentEpNum}: {currentEp?.title || 'Episode Title'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEpDrawer(!showEpDrawer)}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-sm transition hover:bg-white/10 cursor-pointer"
            >
              <ListVideo className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Episodes</span>
            </button>
          </div>
        </div>

        {/* Video Canvas Stage */}
        <div className="relative aspect-video w-full flex-1 sm:flex-none max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
          
          {/* Animated Background Anime Backdrop */}
          <img
            src={anime.bannerImage}
            alt={anime.title}
            referrerPolicy="no-referrer"
            className={`h-full w-full object-cover transition-opacity duration-500 ${
              isPlaying ? 'opacity-70 scale-105' : 'opacity-40 scale-100'
            }`}
          />

          {/* Canvas for kinetic particles / magic sparks */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
          />

          {/* Subtitle simulation preview */}
          {subtitleLang !== 'Off' && (
            <div className="absolute bottom-16 sm:bottom-20 inset-x-0 flex justify-center px-4 pointer-events-none z-20">
              <div className="rounded bg-black/60 px-3 py-1 text-center text-xs sm:text-sm font-medium text-amber-200 backdrop-blur-sm drop-shadow-md">
                "{currentEp?.synopsis.slice(0, 75)}..."
              </div>
            </div>
          )}

          {/* Quick Skip Intro Button (Appears during first 90s) */}
          {currentTime < 95 && (
            <button
              onClick={handleSkipIntro}
              className="absolute bottom-20 right-6 z-20 flex items-center gap-2 rounded-lg border border-white/20 bg-black/80 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-rose-600 hover:border-rose-600 cursor-pointer"
            >
              <SkipForward className="h-3.5 w-3.5" />
              <span>Skip Intro (85s)</span>
            </button>
          )}

          {/* Big Center Play/Pause button on screen click */}
          <div
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
          >
            {!isPlaying && (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-600/90 text-white shadow-2xl backdrop-blur-sm transition-transform hover:scale-110">
                <Play className="h-8 w-8 fill-white ml-1" />
              </div>
            )}
          </div>

          {/* Episode Drawer Overlay */}
          {showEpDrawer && (
            <div className="absolute inset-y-0 right-0 z-40 w-72 sm:w-80 bg-[#090b11]/95 border-l border-white/10 p-4 overflow-y-auto backdrop-blur-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Select Episode
                </h4>
                <button
                  onClick={() => setShowEpDrawer(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {anime.episodesList.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setCurrentEpNum(ep.number);
                      setCurrentTime(0);
                      setIsPlaying(true);
                      setShowEpDrawer(false);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition ${
                      ep.number === currentEpNum
                        ? 'bg-rose-600/20 border border-rose-500/40 text-white'
                        : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold text-rose-400">
                      EP {ep.number}
                    </span>
                    <span className="truncate text-xs">{ep.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Settings Menu Popup */}
          {showSettings && (
            <div className="absolute bottom-16 right-4 z-40 w-60 rounded-xl border border-white/10 bg-[#12141c]/95 p-3 text-xs shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                <span className="font-semibold text-white">Playback Settings</span>
                <button onClick={() => setShowSettings(false)} className="text-slate-400">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                <div>
                  <span className="text-[11px] text-slate-400">Audio Track</span>
                  <div className="mt-1 flex gap-1">
                    {(['Japanese (Original)', 'English (Dub)'] as const).map((track) => (
                      <button
                        key={track}
                        onClick={() => setAudioTrack(track)}
                        className={`flex-1 rounded px-2 py-1 text-[10px] ${
                          audioTrack === track
                            ? 'bg-rose-600 text-white font-medium'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {track.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400">Subtitles</span>
                  <div className="mt-1 grid grid-cols-2 gap-1">
                    {(['English', 'Spanish', 'French', 'Off'] as const).map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSubtitleLang(sub)}
                        className={`rounded px-2 py-1 text-[10px] ${
                          subtitleLang === sub
                            ? 'bg-rose-600 text-white font-medium'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400">Speed</span>
                  <div className="mt-1 flex gap-1">
                    {[0.75, 1, 1.25, 1.5].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`flex-1 rounded px-2 py-1 text-[10px] font-mono ${
                          playbackSpeed === spd
                            ? 'bg-rose-600 text-white font-medium'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Player Controls Bar */}
          <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4">
            
            {/* Scrubber Progress Bar */}
            <div
              onClick={handleSeek}
              className="group/scrub relative mb-3 h-1.5 w-full cursor-pointer rounded-full bg-white/20 transition-all hover:h-2"
            >
              <div
                className="h-full rounded-full bg-rose-500 transition-all"
                style={{ width: `${(currentTime / totalDuration) * 100}%` }}
              />
              <div
                className="absolute top-1/2 -mt-1.5 -ml-1.5 h-3 w-3 rounded-full bg-white shadow opacity-0 group-hover/scrub:opacity-100 transition"
                style={{ left: `${(currentTime / totalDuration) * 100}%` }}
              />
            </div>

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between text-slate-200">
              
              {/* Left Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 transition cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 fill-white" />
                  ) : (
                    <Play className="h-4 w-4 fill-white" />
                  )}
                </button>

                <button
                  onClick={() => setCurrentTime((prev) => Math.max(0, prev - 10))}
                  aria-label="Rewind 10 seconds"
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 transition text-slate-300 hover:text-white cursor-pointer"
                  title="Rewind 10s"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>

                {/* Volume slider */}
                <div className="flex items-center gap-1.5 group/vol">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 text-slate-300 hover:text-white"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 accent-rose-500 h-1 cursor-pointer"
                  />
                </div>

                {/* Timestamp */}
                <span className="text-[11px] font-mono tabular-nums text-slate-400">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  aria-label="Playback settings"
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 transition text-slate-300 hover:text-white cursor-pointer"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>

                <button
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 transition text-slate-300 hover:text-white cursor-pointer"
                  title="Fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
