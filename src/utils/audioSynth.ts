/**
 * Web Audio API based ambient romantic music box & sound effects.
 * Synthesizes gentle music box / celesta notes playing a romantic melody,
 * along with soothing page flip and chime sound effects.
 */

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private timerId: number | null = null;
  private currentNoteIndex = 0;

  // Romantic Pentatonic/Lydian melody notes (MIDI numbers or frequencies)
  // Plays a soothing, dreamlike loop
  private readonly melody: number[] = [
    // Phrase 1 (Gentle arpeggio)
    60, 64, 67, 71, 72, 76, 71, 67,
    65, 69, 72, 76, 77, 81, 76, 72,
    64, 67, 71, 74, 76, 79, 74, 71,
    62, 65, 69, 72, 74, 77, 74, 69,
    // Phrase 2 (Emotional lift)
    60, 67, 72, 76, 79, 83, 79, 76,
    57, 64, 69, 72, 76, 81, 76, 72,
    58, 65, 70, 74, 77, 82, 77, 74,
    55, 62, 67, 71, 74, 79, 74, 71
  ];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private midiToFreq(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  public toggleMusic(): boolean {
    if (this.isPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public startMusic() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    const ctx = this.getContext();
    this.currentNoteIndex = 0;

    const playNext = () => {
      if (!this.isPlaying) return;
      const note = this.melody[this.currentNoteIndex % this.melody.length];
      this.playMusicBoxNote(note, 0.14);
      this.currentNoteIndex++;

      // Gentle variable rhythm (~420ms per note)
      const interval = 430;
      this.timerId = window.setTimeout(playNext, interval);
    };

    playNext();
  }

  public stopMusic() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Delicate bell/music-box chime tone
   */
  private playMusicBoxNote(midi: number, gainAmount = 0.12) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const freq = this.midiToFreq(midi);

    // Main fundamental sine wave
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Harmonic bell overtone (chime warmth)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.01, now);

    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    // Fast attack, long warm decay
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.exponentialRampToValueAtTime(gainAmount, now + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.exponentialRampToValueAtTime(gainAmount * 0.35, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    // Soft lowpass filter to create a warm music-box timber
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, now);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(filter);
    gain2.connect(filter);
    filter.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.9);
    osc2.stop(now + 1.9);
  }

  /**
   * Sound effect: Book page flip (soft paper rustle)
   */
  public playPageTurnSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.22;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.linearRampToValueAtTime(600, now + 0.2);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // Audio might not have had user gesture yet
    }
  }

  /**
   * Sound effect: Sweet pixel click / tap
   */
  public playClickSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // ignore
    }
  }

  /**
   * Sound effect: Bloom sparkle chime
   */
  public playBloomSparkleSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const chords = [72, 76, 79, 84, 88];
      chords.forEach((note, idx) => {
        setTimeout(() => {
          this.playMusicBoxNote(note, 0.09);
        }, idx * 70);
      });
    } catch {
      // ignore
    }
  }
}

export const audioEngine = new RomanticAudioEngine();

