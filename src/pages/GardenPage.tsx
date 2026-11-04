import React, { useState, useRef } from 'react';
import { FlowerCanvas } from '../components/FlowerGarden/FlowerCanvas';
import { ThemeSelector } from '../components/ThemeSelector/ThemeSelector';
import { GardenControls } from '../components/FlowerGarden/GardenControls';
import { BirthdayModal } from '../components/FlowerGarden/BirthdayModal';
import { FLOWER_THEMES } from '../utils/themes';
import { FlowerTheme, BookData } from '../types';
import { audioEngine } from '../utils/audioSynth';

interface GardenPageProps {
  bookData: BookData;
  onBackToBook: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export const GardenPage: React.FC<GardenPageProps> = ({
  bookData,
  onBackToBook,
  isMusicPlaying,
  onToggleMusic
}) => {
  const [currentTheme, setCurrentTheme] = useState<FlowerTheme>(FLOWER_THEMES.classic);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  // References to reset and replay functions in canvas
  const resetRef = useRef<(() => void) | null>(null);
  const replayRef = useRef<(() => void) | null>(null);

  const handleReplay = () => {
    setIsPlaying(true);
    if (replayRef.current) {
      replayRef.current();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (resetRef.current) {
      resetRef.current();
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white flex flex-col justify-between select-none">
      {/* 1. TOP HEADER: Matching the reference video composition */}
      <header className="relative z-20 pt-8 sm:pt-10 px-4 text-center pointer-events-none">
        <h1
          className="text-2xl sm:text-4xl md:text-5xl tracking-normal text-[#f3eed9] leading-tight font-serif drop-shadow-[0_2px_15px_rgba(243,238,217,0.2)]"
          style={{
            fontFamily: "'Playfair Display', 'Cinzel', Georgia, serif"
          }}
        >
          Who needs flowers<br />
          when <span className="italic font-normal">you</span> can code them?
        </h1>
      </header>

      {/* 2. MAIN CENTER: The Procedural ASCII / Particle Flower Bouquet Canvas */}
      <main className="absolute inset-0 z-10 flex items-center justify-center">
        <FlowerCanvas
          theme={currentTheme}
          isPlaying={isPlaying}
          onResetRef={resetRef}
          onReplayRef={replayRef}
          onAnimationComplete={() => {
            // Can optionally pop the love note or trigger confetti
          }}
        />
      </main>

      {/* 3. BOTTOM CONTROLS & THEME SELECTOR: Minimal, non-intrusive floating bars */}
      <footer className="relative z-20 pb-6 px-4 flex flex-col items-center gap-3">
        {/* Color Theme Selector */}
        <ThemeSelector
          currentTheme={currentTheme}
          onSelectTheme={setCurrentTheme}
        />

        {/* Playback & Action Controls */}
        <GardenControls
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onReplay={handleReplay}
          onReset={handleReset}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={onToggleMusic}
          onOpenMessage={() => setIsMessageOpen(true)}
          onBackToBook={onBackToBook}
        />
      </footer>

      {/* Birthday Love Note Card */}
      <BirthdayModal
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        recipientName={bookData.recipientName}
        senderName={bookData.senderName}
      />
    </div>
  );
};
