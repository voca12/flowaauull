import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, X, Flower2 } from 'lucide-react';
import { audioEngine } from '../../utils/audioSynth';

interface BirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  senderName: string;
}

export const BirthdayModal: React.FC<BirthdayModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  senderName
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire romantic purple & gold celebration confetti
      try {
        confetti({
          particleCount: 55,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#A78BCE', '#D8C8F0', '#59418C', '#F8F6FF', '#ffd166']
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0D1F]/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg p-8 sm:p-10 rounded-2xl bg-[#11152E] border border-[#59418C]/60 text-[#F8F6FF] shadow-[0_0_50px_rgba(89,65,140,0.35)] text-center transform transition-all animate-scale-up"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif"
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            audioEngine.playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-[#A78BCE] hover:text-[#F8F6FF] rounded-full hover:bg-[#30234F]/50 transition-colors"
          title="Close card"
        >
          <X size={20} />
        </button>

        {/* Decorative Top Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#30234F] border border-[#A78BCE]/40 text-[#D8C8F0]">
            <Heart size={28} className="fill-[#59418C] text-[#A78BCE] animate-pulse" />
            <Sparkles size={16} className="absolute -top-1 -right-1 text-[#ffd166]" />
          </div>
        </div>

        <h3 className="text-2xl sm:text-3xl font-normal tracking-wide text-[#F8F6FF] mb-2">
          Happy Birthday, <span className="italic font-medium text-[#D8C8F0]">{recipientName}</span>
        </h3>

        <p className="text-xs tracking-widest uppercase text-[#A78BCE] mb-6 font-mono font-semibold">
          A living bouquet coded just for you
        </p>

        <div className="space-y-4 text-sm sm:text-base text-[#D8C8F0]/95 leading-relaxed font-light mb-8 text-left border-y border-[#30234F] py-5">
          <p>
            Real flowers wither after a few days, but these lines of code were crafted so you can always return to a bouquet that blooms forever.
          </p>
          <p>
            Thank you for bringing so much color, warmth, and melody into my world. May this new year of your life be filled with dreams coming true, endless laughter, and boundless happiness.
          </p>
          <p className="italic text-center text-[#A78BCE] pt-2 font-medium">
            "Every petal represents a reason why you are so cherished."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs font-mono text-[#A78BCE]">
            With endless love, <span className="text-white font-medium">{senderName}</span>
          </div>

          <button
            onClick={() => {
              audioEngine.playClickSound();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#59418C] hover:bg-[#A78BCE] text-[#F8F6FF] font-serif text-sm tracking-wider shadow-lg shadow-[#59418C]/40 transition-all hover:scale-105"
          >
            Adore the Garden 🌸
          </button>
        </div>
      </div>
    </div>
  );
};
