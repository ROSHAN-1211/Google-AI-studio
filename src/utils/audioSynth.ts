// Web Audio API ambient anime synthesizer player
// Generates beautiful melodic chime patterns without relying on external MP3 hosts.

class AnimeAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;
  private masterGain: GainNode | null = null;
  private currentVolume = 0.5;
  private currentNoteIndex = 0;
  private trackBpm = 120;
  private trackScale: number[] = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C major pentatonic

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setTrackScale(bpm: number, rootKey: string) {
    this.trackBpm = bpm || 120;
    // Map different scales for anime feel
    if (rootKey.includes('Minor')) {
      // Natural minor / Insen scale
      this.trackScale = [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00];
    } else {
      // Pentatonic bright anime scale
      this.trackScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
    }
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainVal = 0.15) {
    if (!this.ctx || !this.masterGain) return;
    
    try {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // ignore audio context glitches
    }
  }

  public play() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;

    const beatInterval = (60 / this.trackBpm) * 500; // 8th notes

    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying) return;

      const baseFreq = this.trackScale[this.currentNoteIndex % this.trackScale.length];
      
      // Melody chime
      this.playTone(baseFreq, 0.45, 'triangle', 0.2);

      // Bass pad every 4th note
      if (this.currentNoteIndex % 4 === 0) {
        this.playTone(baseFreq / 2, 0.8, 'sine', 0.25);
      }

      // Sparkle harmony
      if (this.currentNoteIndex % 3 === 0) {
        const harmonyFreq = this.trackScale[(this.currentNoteIndex + 2) % this.trackScale.length] * 2;
        this.playTone(harmonyFreq, 0.35, 'sine', 0.1);
      }

      this.currentNoteIndex++;
    }, beatInterval);
  }

  public pause() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioSynth = new AnimeAudioSynthesizer();
