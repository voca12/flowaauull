import React, { useState } from 'react';
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

  // Background floating pixel hearts and stars (Lavender & Soft Lilac)
  const [decorations] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 95,
      y: Math.random() * 95,
      delay: Math.random() * 5,
      scale: 0.6 + Math.random() * 0.8,
      isStar: i % 2 === 0
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
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-[#11152E] text-[#F8F6FF] flex flex-col justify-between py-6 px-3 select-none">
      {/* Background Pixel Warm Atmosphere - Deep Navy & Midnight Purple */}
      <div className="absolute inset-0 bg-radial from-[#191D3A] via-[#11152E] to-[#0A0D1F] pointer-events-none -z-10" />

      {/* Floating Pixel Hearts & Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
        {decorations.map((d) => (
          <div
            key={d.id}
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              animationDelay: `${d.delay}s`,
              transform: `scale(${d.scale})`
            }}
            className="absolute floating-pixel text-[#A78BCE]/30 select-none"
          >
            {d.isStar ? (
              <Sparkles size={18} className="fill-current text-[#D8C8F0]/35" />
            ) : (
              <Heart size={18} className="fill-current text-[#A78BCE]/30" />
            )}
          </div>
        ))}
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#D8C8F0] animate-pulse" />
          <span className="font-pixel text-[11px] text-[#A78BCE] tracking-wider">
            Birthday Memory Book
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset to defaults button */}
          <button
            onClick={handleReset}
            className="p-2 rounded-full bg-[#191D3A] hover:bg-[#30234F] text-[#D8C8F0] hover:text-[#F8F6FF] border border-[#59418C]/40 text-xs transition-colors"
            title="Reset diary to defaults"
          >
            <RotateCcw size={14} />
          </button>

          {/* Music Toggle */}
          <button
            onClick={onToggleMusic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
              isMusicPlaying
                ? 'bg-[#59418C] border-[#A78BCE] text-[#F8F6FF] shadow-[0_0_15px_rgba(167,139,206,0.35)]'
                : 'bg-[#191D3A] border-[#30234F] text-[#A78BCE] hover:text-[#F8F6FF]'
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
      <footer className="relative z-10 text-center py-2 text-[10px] font-mono text-[#A78BCE]/60">
        Click on any text or photo to personalize this diary • Stored locally in your browser
      </footer>
    </div>
  );
};
