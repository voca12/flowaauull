import React from 'react';
import { RotateCcw, Play, Pause, Music, VolumeX, Mail, BookOpen, Sparkles } from 'lucide-react';
import { audioEngine } from '../../utils/audioSynth';

interface GardenControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReplay: () => void;
  onReset: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenMessage: () => void;
  onBackToBook: () => void;
}

export const GardenControls: React.FC<GardenControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onReplay,
  onReset,
  isMusicPlaying,
  onToggleMusic,
  onOpenMessage,
  onBackToBook
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2">
      {/* Return to Memory Book */}
      <button
        onClick={() => {
          audioEngine.playPageTurnSound();
          onBackToBook();
        }}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-rose-200 border border-neutral-800 text-xs tracking-wider transition-all hover:scale-105"
        title="Return to Pixel Memory Book"
      >
        <BookOpen size={14} className="text-rose-400" />
        <span>Memory Diary</span>
      </button>

      {/* Play / Pause Toggle */}
      <button
        onClick={() => {
          audioEngine.playClickSound();
          onTogglePlay();
        }}
        className="p-2 sm:px-3 sm:py-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs transition-all hover:scale-105 flex items-center gap-1.5"
        title={isPlaying ? 'Pause growth' : 'Resume growth'}
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-current" />}
        <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
      </button>

      {/* Replay */}
      <button
        onClick={() => {
          audioEngine.playClickSound();
          onReplay();
        }}
        className="p-2 sm:px-3 sm:py-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs transition-all hover:scale-105 flex items-center gap-1.5"
        title="Replay bloom animation from start"
      >
        <RotateCcw size={14} />
        <span className="hidden sm:inline">Replay</span>
      </button>

      {/* Music Toggle */}
      <button
        onClick={() => {
          onToggleMusic();
        }}
        className={`p-2 sm:px-3 sm:py-2 rounded-full border text-xs transition-all hover:scale-105 flex items-center gap-1.5 ${
          isMusicPlaying
            ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-[0_0_12px_rgba(255,105,180,0.3)]'
            : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-neutral-200'
        }`}
        title={isMusicPlaying ? 'Mute romantic melody' : 'Play romantic music box'}
      >
        {isMusicPlaying ? <Music size={14} className="animate-bounce" /> : <VolumeX size={14} />}
        <span className="hidden sm:inline">Music</span>
      </button>

      {/* Romantic Birthday Message Card */}
      <button
        onClick={() => {
          audioEngine.playClickSound();
          onOpenMessage();
        }}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30 text-xs font-serif tracking-wider transition-all hover:scale-105 animate-pulse"
        title="Open personal birthday message"
      >
        <Mail size={14} />
        <span>Love Note</span>
      </button>
    </div>
  );
};

