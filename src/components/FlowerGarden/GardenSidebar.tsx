import React from 'react';
import { FlowerTheme, ThemeId } from '../../types';
import { FLOWER_THEMES } from '../../utils/themes';
import { audioEngine } from '../../utils/audioSynth';
import { 
  RotateCcw, 
  Play, 
  Pause, 
  Music, 
  VolumeX, 
  Mail, 
  BookOpen, 
  Sparkles, 
  Check, 
  SlidersHorizontal,
  X
} from 'lucide-react';

interface GardenSidebarProps {
  currentTheme: FlowerTheme;
  onSelectTheme: (theme: FlowerTheme) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReplay: () => void;
  onReset: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenMessage: () => void;
  onBackToBook: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const GardenSidebar: React.FC<GardenSidebarProps> = ({
  currentTheme,
  onSelectTheme,
  isPlaying,
  onTogglePlay,
  onReplay,
  onReset,
  isMusicPlaying,
  onToggleMusic,
  onOpenMessage,
  onBackToBook,
  isMobileOpen,
  onCloseMobile
}) => {
  const themes = Object.values(FLOWER_THEMES);

  const content = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 select-none overflow-y-auto custom-scrollbar">
      {/* 1. Header with Title */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#30234F]">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#A78BCE]" />
            <span className="font-serif text-sm tracking-wider text-[#F8F6FF] font-medium">
              Garden Controls
            </span>
          </div>

          {/* Close button for mobile drawer */}
          <button
            onClick={() => {
              audioEngine.playClickSound();
              onCloseMobile();
            }}
            className="md:hidden p-1.5 rounded-full text-[#A78BCE] hover:text-[#F8F6FF] hover:bg-[#30234F]/40"
            title="Close panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Themes Section */}
        <div className="mb-6">
          <div className="text-[10px] uppercase font-mono tracking-widest text-[#A78BCE] mb-2.5 font-semibold">
            Flower Themes
          </div>

          <div className="space-y-1.5">
            {themes.map((t) => {
              const isSelected = currentTheme.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    audioEngine.playClickSound();
                    onSelectTheme(t);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-serif transition-all duration-200 text-left ${
                    isSelected
                      ? 'bg-[#59418C] text-[#F8F6FF] shadow-md shadow-[#59418C]/30 ring-1 ring-[#A78BCE]/60'
                      : 'bg-[#191D3A]/60 hover:bg-[#30234F]/70 text-[#D8C8F0]'
                  }`}
                  title={t.description}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full inline-block shadow-xs transition-transform duration-200"
                      style={{
                        backgroundColor: t.previewColor,
                        boxShadow: isSelected ? `0 0 8px ${t.previewColor}` : 'none'
                      }}
                    />
                    <span className="tracking-wide font-medium">{t.name}</span>
                  </div>

                  {isSelected && (
                    <Check size={13} className="text-[#F8F6FF] stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Animation Controls Section */}
        <div className="mb-6">
          <div className="text-[10px] uppercase font-mono tracking-widest text-[#A78BCE] mb-2.5 font-semibold">
            Animation
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Play/Pause */}
            <button
              onClick={() => {
                audioEngine.playClickSound();
                onTogglePlay();
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#191D3A]/80 hover:bg-[#30234F] text-[#D8C8F0] hover:text-[#F8F6FF] border border-[#30234F] text-xs font-mono transition-all"
              title={isPlaying ? 'Pause growth' : 'Resume growth'}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} className="fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            {/* Replay */}
            <button
              onClick={() => {
                audioEngine.playClickSound();
                onReplay();
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#191D3A]/80 hover:bg-[#30234F] text-[#D8C8F0] hover:text-[#F8F6FF] border border-[#30234F] text-xs font-mono transition-all"
              title="Replay bloom from start"
            >
              <RotateCcw size={13} />
              <span>Replay</span>
            </button>
          </div>

          {/* Reset button */}
          <button
            onClick={() => {
              audioEngine.playClickSound();
              onReset();
            }}
            className="w-full mt-2 py-1.5 px-3 rounded-lg bg-[#191D3A]/50 hover:bg-[#191D3A] text-[#A78BCE]/80 hover:text-[#D8C8F0] border border-[#30234F]/40 text-[11px] font-mono transition-all text-center"
            title="Reset flower animation to empty"
          >
            Reset Animation
          </button>
        </div>
      </div>

      {/* 4. Bottom Actions: Music, Love Note & Return */}
      <div className="pt-4 border-t border-[#30234F] space-y-2">
        {/* Music Toggle */}
        <button
          onClick={onToggleMusic}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-serif transition-all ${
            isMusicPlaying
              ? 'bg-[#59418C]/40 border-[#A78BCE]/60 text-[#F8F6FF] shadow-[0_0_15px_rgba(167,139,206,0.3)]'
              : 'bg-[#191D3A]/70 border-[#30234F] text-[#D8C8F0] hover:text-[#F8F6FF]'
          }`}
          title={isMusicPlaying ? 'Mute romantic melody' : 'Play romantic music box'}
        >
          <div className="flex items-center gap-2">
            {isMusicPlaying ? (
              <Music size={14} className="animate-bounce text-[#A78BCE]" />
            ) : (
              <VolumeX size={14} />
            )}
            <span>Music Box</span>
          </div>
          <span className="text-[10px] font-mono uppercase text-[#A78BCE]">
            {isMusicPlaying ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Love Note Birthday Card */}
        <button
          onClick={() => {
            audioEngine.playClickSound();
            onOpenMessage();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#59418C] to-[#6d50a8] hover:from-[#6d50a8] hover:to-[#A78BCE] text-[#F8F6FF] font-serif text-xs tracking-wider shadow-lg shadow-[#59418C]/30 transition-all hover:scale-102"
        >
          <Mail size={14} />
          <span>Birthday Message 💌</span>
        </button>

        {/* Return to Memory Book */}
        <button
          onClick={() => {
            audioEngine.playPageTurnSound();
            onBackToBook();
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#191D3A]/60 hover:bg-[#191D3A] text-[#D8C8F0] hover:text-[#F8F6FF] border border-[#30234F] text-xs font-serif tracking-wide transition-all"
        >
          <BookOpen size={13} className="text-[#A78BCE]" />
          <span>Return to Diary</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR (Visible on md and larger) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 h-full bg-[#11152E]/80 backdrop-blur-md border-l border-[#59418C]/30 z-30 shrink-0 shadow-[-10px_0_30px_rgba(10,13,31,0.7)]">
        {content}
      </aside>

      {/* MOBILE COLLAPSIBLE DRAWER & FLOATING TOGGLE */}
      {/* Floating Toggle Button on Mobile (Top Right, unobtrusive) */}
      <button
        onClick={() => {
          audioEngine.playClickSound();
          if (isMobileOpen) {
            onCloseMobile();
          } else {
            // open
            onCloseMobile(); // toggles
          }
        }}
        className="md:hidden fixed top-4 right-4 z-40 p-2.5 rounded-full bg-[#11152E]/90 hover:bg-[#191D3A] border border-[#59418C]/50 text-[#D8C8F0] shadow-lg shadow-black/60 transition-transform active:scale-95 flex items-center gap-1.5"
        title="Open Themes & Controls"
      >
        <SlidersHorizontal size={15} className="text-[#A78BCE]" />
        <span className="text-[11px] font-mono tracking-wide pr-1">Controls</span>
      </button>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs animate-fade-in"
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-[#11152E]/95 backdrop-blur-lg border-l border-[#59418C]/40 z-50 transform transition-transform duration-300 ease-out shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
};
