import React, { useState, useEffect } from 'react';
import { BookCover } from '../components/MemoryBook/BookCover';
import { BookPages } from '../components/MemoryBook/BookPages';
import { BookData } from '../types';
import { saveBookData, resetBookData } from '../utils/indexedDB';
import { Music, VolumeX, Sparkles, Heart, RotateCcw } from 'lucide-react';
import { audioEngine } from '../utils/audioSynth';

interface MemoryPageProps {
  bookData: BookData;
  onUpdateBookData: (updated: BookData) => void;
  onEnterGarden: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export const MemoryPage: React.FC<MemoryPageProps> = ({
  bookData,
  onUpdateBookData,
  onEnterGarden,
  isMusicPlaying,
  onToggleMusic
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Background floating pixel hearts
  const [hearts] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 95,
      y: Math.random() * 95,
      delay: Math.random() * 5,
      scale: 0.6 + Math.random() * 0.8
    }))
  );

  const handleUpdate = (updated: BookData) => {
    onUpdateBookData(updated);
    saveBookData(updated);
  };

  const handleReset = async () => {
    if (window.confirm('Reset memory book to initial sample memories?')) {
      audioEngine.playClickSound();
      const fresh = await resetBookData();
      onUpdateBookData(fresh);
    }
  };

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-[#1e1014] text-neutral-100 flex flex-col justify-between py-6 px-3 select-none">
      {/* Background Pixel Warm Atmosphere */}
      <div className="absolute inset-0 bg-radial from-[#3d1822] via-[#210d13] to-[#12060a] pointer-events-none -z-10" />

      {/* Floating Pixel Hearts & Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
        {hearts.map((h) => (
          <div
            key={h.id}
            style={{
              left: `${h.x}%`,
              top: `${h.y}%`,
              animationDelay: `${h.delay}s`,
              transform: `scale(${h.scale})`
            }}
            className="absolute floating-pixel text-rose-500/25 select-none"
          >
            <Heart size={20} className="fill-current" />
          </div>
        ))}
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400 animate-pulse" />
          <span className="font-pixel text-[11px] text-rose-300 tracking-wider">
            Birthday Memory Book
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset to defaults button */}
          <button
            onClick={handleReset}
            className="p-2 rounded-full bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 text-xs transition-colors"
            title="Reset diary to defaults"
          >
            <RotateCcw size={14} />
          </button>

          {/* Music Toggle */}
          <button
            onClick={onToggleMusic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
              isMusicPlaying
                ? 'bg-rose-950/60 border-rose-500/60 text-rose-300 shadow-[0_0_12px_rgba(255,105,180,0.3)]'
                : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title={isMusicPlaying ? 'Mute melody' : 'Play melody'}
          >
            {isMusicPlaying ? (
              <Music size={13} className="animate-bounce" />
            ) : (
              <VolumeX size={13} />
            )}
            <span className="text-[10px]">Music</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Book */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-6">
        {!isOpen ? (
          <BookCover
            coverTitle={bookData.coverTitle}
            recipientName={bookData.recipientName}
            senderName={bookData.senderName}
            onOpenBook={() => setIsOpen(true)}
            onUpdateTitle={(title) => handleUpdate({ ...bookData, coverTitle: title })}
          />
        ) : (
          <BookPages
            bookData={bookData}
            onUpdateBookData={handleUpdate}
            onCloseBook={() => setIsOpen(false)}
            onEnterGarden={onEnterGarden}
          />
        )}
      </main>

      {/* Footer message */}
      <footer className="relative z-10 text-center py-2 text-[10px] font-mono text-rose-400/50">
        Click on any text or photo to personalize this diary • Stored locally in your browser
      </footer>
    </div>
  );
};
