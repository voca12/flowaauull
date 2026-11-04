import React from 'react';
import { Sparkles, Heart, Bookmark, ChevronRight } from 'lucide-react';
import { audioEngine } from '../../utils/audioSynth';
import { EditableText } from './EditableText';

interface BookCoverProps {
  coverTitle: string;
  recipientName: string;
  senderName: string;
  onOpenBook: () => void;
  onUpdateTitle: (title: string) => void;
}

export const BookCover: React.FC<BookCoverProps> = ({
  coverTitle,
  recipientName,
  senderName,
  onOpenBook,
  onUpdateTitle
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Closed Book Container */}
      <div
        onClick={() => {
          audioEngine.playPageTurnSound();
          onOpenBook();
        }}
        className="group relative cursor-pointer transform transition-all duration-500 hover:scale-103 hover:-translate-y-2 select-none"
        title="Click to open memory diary"
      >
        {/* Book Spine Shadow / 3D Thickness */}
        <div className="absolute top-2 -left-3 w-full h-full bg-[#241315] rounded-l-xl rounded-r-md -z-10 shadow-[0_20px_40px_rgba(0,0,0,0.6)]" />

        {/* Vintage Leather Book Cover */}
        <div className="relative w-[310px] sm:w-[380px] h-[460px] sm:h-[530px] rounded-l-md rounded-r-2xl bg-gradient-to-br from-[#6b2b38] via-[#521d28] to-[#3a131b] border-4 border-[#331018] p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl">
          
          {/* Pixel Filigree Golden Corners */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-amber-300/80" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-amber-300/80" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-amber-300/80" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-amber-300/80" />

          {/* Book Spine Texture Lines on the Left */}
          <div className="absolute top-0 left-0 bottom-0 w-8 border-r-2 border-dashed border-amber-900/40 bg-black/20 flex flex-col justify-around py-8">
            <div className="w-full h-1 bg-amber-400/30" />
            <div className="w-full h-1 bg-amber-400/30" />
            <div className="w-full h-1 bg-amber-400/30" />
            <div className="w-full h-1 bg-amber-400/30" />
          </div>

          {/* Hanging Ribbon Bookmark */}
          <div className="absolute -top-1 right-12 w-6 h-16 bg-gradient-to-b from-amber-400 to-amber-500 shadow-md border-x border-b border-amber-600 rounded-b-xs transform transition-transform group-hover:translate-y-2">
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-amber-600/30 clip-v" />
          </div>

          {/* Top Stamp / Year */}
          <div className="text-center pl-6 pt-3">
            <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-200 border border-amber-400/40 font-pixel text-[9px] tracking-widest uppercase rounded">
              A Special Birthday Edition
            </span>
          </div>

          {/* Center Title Frame */}
          <div className="pl-6 text-center my-auto">
            <div className="inline-block p-4 sm:p-5 rounded-lg border-2 border-dashed border-amber-300/60 bg-black/25 backdrop-blur-xs shadow-inner">
              <div className="flex justify-center mb-2">
                <Heart size={28} className="fill-rose-500 text-rose-400 floating-pixel" />
              </div>

              <h2 className="font-pixel text-sm sm:text-base text-amber-200 leading-relaxed tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <EditableText
                  value={coverTitle}
                  onSave={onUpdateTitle}
                  placeholder="Our Memory Diary"
                />
              </h2>

              <p className="mt-2 text-xs font-serif italic text-rose-200/90 tracking-wide">
                Dedicated to {recipientName}
              </p>
            </div>
          </div>

          {/* Heart Clasp Lock on Right Side */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-14 bg-gradient-to-r from-amber-500 to-amber-400 rounded-l-lg border-2 border-amber-600 shadow-lg flex items-center justify-center">
            <Heart size={16} className="fill-amber-700 text-amber-800" />
          </div>

          {/* Bottom Prompt: Click to Open */}
          <div className="pl-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-300/15 border border-amber-300/30 text-amber-200 font-pixel text-[9px] tracking-widest uppercase group-hover:bg-amber-300 group-hover:text-amber-950 transition-colors">
              <span>Click to open diary</span>
              <ChevronRight size={12} className="animate-pulse" />
            </div>

            <div className="mt-3 text-[10px] font-mono text-rose-300/60">
              Crafted with love by {senderName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
