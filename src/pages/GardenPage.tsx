import React, { useState, useRef } from 'react';
import { FlowerCanvas } from '../components/FlowerGarden/FlowerCanvas';
import { GardenSidebar } from '../components/FlowerGarden/GardenSidebar';
import { BirthdayModal } from '../components/FlowerGarden/BirthdayModal';
import { FLOWER_THEMES } from '../utils/themes';
import { FlowerTheme, BookData } from '../types';

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white flex flex-row select-none">
      {/* 1. LEFT / CENTER: Main visual composition (Headline + Flower Canvas) */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Top Header: Centered above bouquet */}
        <header className="relative z-20 pt-8 sm:pt-10 px-4 text-center pointer-events-none shrink-0">
          <h2
            className="text-2xl sm:text-4xl md:text-5xl tracking-normal text-[#f3eed9] leading-tight font-serif drop-shadow-[0_2px_15px_rgba(243,238,217,0.2)]"
            style={{
              fontFamily: "'Playfair Display', 'Cinzel', Georgia, serif"
            }}
          >
            Happy Birthday<br />
            <span className="italic font-normal">Ka Auull</span> 🤍
          </h2>
        </header>

        {/* Main Canvas Area: 100% unobstructed, no bottom overlays */}
        <main className="flex-1 w-full h-full relative">
          <FlowerCanvas
            theme={currentTheme}
            isPlaying={isPlaying}
            onResetRef={resetRef}
            onReplayRef={replayRef}
            onAnimationComplete={() => {
              // Can trigger celebration
            }}
          />
        </main>
      </div>

      {/* 2. RIGHT: Vertical Sidebar on Desktop / Collapsible Drawer on Mobile */}
      <GardenSidebar
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onReplay={handleReplay}
        onReset={handleReset}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={onToggleMusic}
        onOpenMessage={() => setIsMessageOpen(true)}
        onBackToBook={onBackToBook}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(prev => !prev)}
      />

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
