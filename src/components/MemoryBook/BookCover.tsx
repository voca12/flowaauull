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
        {/* Book Spine Shadow / 3D Thickness - Midnight Navy Depth */}
        <div className="absolute top-2 -left-3 w-full h-full bg-[#0A0D1F] rounded-l-xl rounded-r-md -z-10 shadow-[0_25px_50px_rgba(10,13,31,0.85)]" />

        {/* Vintage Leather Book Cover - Deep Navy & Midnight Purple */}
        <div className="relative w-[310px] sm:w-[380px] h-[460px] sm:h-[530px] rounded-l-md rounded-r-2xl bg-gradient-to-br from-[#191D3A] via-[#11152E] to-[#0A0D1F] border-4 border-[#30234F] p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl">
          
          {/* Pixel Filigree Lavender Corners */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-[#A78BCE]" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-[#A78BCE]" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-[#A78BCE]" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-[#A78BCE]" />

          {/* Book Spine Texture Lines on the Left */}
          <div className="absolute top-0 left-0 bottom-0 w-8 border-r-2 border-dashed border-[#30234F] bg-[#11152E]/60 flex flex-col justify-around py-8">
            <div className="w-full h-1 bg-[#59418C]/50" />
            <div className="w-full h-1 bg-[#59418C]/50" />
            <div className="w-full h-1 bg-[#59418C]/50" />
            <div className="w-full h-1 bg-[#59418C]/50" />
          </div>

          {/* Hanging Ribbon Bookmark - Royal Purple & Lavender */}
          <div className="absolute -top-1 right-12 w-6 h-16 bg-gradient-to-b from-[#59418C] to-[#30234F] shadow-md border-x border-b border-[#A78BCE]/60 rounded-b-xs transform transition-transform group-hover:translate-y-2">
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#A78BCE]/25" />
          </div>

          {/* Top Stamp / Year */}
          <div className="text-center pl-6 pt-3">
            <span className="inline-block px-3 py-1 bg-[#30234F]/80 text-[#D8C8F0] border border-[#59418C] font-pixel text-[9px] tracking-widest uppercase rounded">
              A Special Birthday Edition
            </span>
          </div>

          {/* Center Title Frame */}
          <div className="pl-6 text-center my-auto">
            <div className="inline-block p-4 sm:p-5 rounded-lg border-2 border-dashed border-[#A78BCE]/70 bg-[#11152E]/80 backdrop-blur-xs shadow-inner">
              <div className="flex justify-center mb-2">
                <Heart size={28} className="fill-[#59418C] text-[#A78BCE] floating-pixel" />
              </div>

              <h2 className="font-pixel text-sm sm:text-base text-[#F8F6FF] leading-relaxed tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <EditableText
                  value={coverTitle}
                  onSave={onUpdateTitle}
                  placeholder="Our Memory Diary"
                />
              </h2>

              <p className="mt-2 text-xs font-serif italic text-[#D8C8F0] tracking-wide">
                Dedicated to {recipientName}
              </p>
            </div>
          </div>

          {/* Heart Clasp Lock on Right Side - Royal Purple with Lavender Heart */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-14 bg-gradient-to-r from-[#59418C] to-[#30234F] rounded-l-lg border-2 border-[#A78BCE] shadow-lg flex items-center justify-center">
            <Heart size={16} className="fill-[#D8C8F0] text-[#F8F6FF]" />
          </div>

          {/* Bottom Prompt: Click to Open */}
          <div className="pl-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#30234F] border border-[#A78BCE]/40 text-[#D8C8F0] font-pixel text-[9px] tracking-widest uppercase group-hover:bg-[#59418C] group-hover:text-[#F8F6FF] transition-all">
              <span>Click to open diary</span>
              <ChevronRight size={12} className="animate-pulse text-[#A78BCE]" />
            </div>

            <div className="mt-3 text-[10px] font-mono text-[#A78BCE]/70">
              Crafted with love by {senderName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
