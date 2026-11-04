import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, X, Volume2, Flower2 } from 'lucide-react';
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
      // Fire sweet romantic heart confetti
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff758f', '#ffb3c6', '#ffe5ec', '#c77dff', '#ffbe0b']
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg p-8 sm:p-10 rounded-2xl bg-[#0f0e13] border border-rose-500/30 text-rose-100 shadow-[0_0_50px_rgba(255,105,180,0.2)] text-center transform transition-all animate-scale-up"
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
          className="absolute top-4 right-4 p-2 text-rose-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          title="Close card"
        >
          <X size={20} />
        </button>

        {/* Decorative Top Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-500/10 border border-rose-400/30 text-rose-300">
            <Heart size={28} className="fill-rose-500/30 text-rose-400 animate-pulse" />
            <Sparkles size={16} className="absolute -top-1 -right-1 text-amber-300" />
          </div>
        </div>

        <h3 className="text-2xl sm:text-3xl font-normal tracking-wide text-rose-100 mb-2">
          Happy Birthday, <span className="italic font-medium text-rose-300">{recipientName}</span>
        </h3>

        <p className="text-xs tracking-widest uppercase text-rose-400/70 mb-6 font-mono">
          A living bouquet coded just for you
        </p>

        <div className="space-y-4 text-sm sm:text-base text-rose-200/90 leading-relaxed font-light mb-8 text-left border-y border-rose-500/20 py-5">
          <p>
            Real flowers wither after a few days, but these lines of code were crafted so you can always return to a bouquet that blooms forever.
          </p>
          <p>
            Thank you for bringing so much color, warmth, and melody into my world. May this new year of your life be filled with dreams coming true, endless laughter, and boundless happiness.
          </p>
          <p className="italic text-center text-rose-300 pt-2">
            "Every petal represents a reason why you are so cherished."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs font-mono text-rose-400/80">
            With endless love, <span className="text-white font-medium">{senderName}</span>
          </div>

          <button
            onClick={() => {
              audioEngine.playClickSound();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-serif text-sm tracking-wider shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
          >
            Adore the Garden 🌸
          </button>
        </div>
      </div>
    </div>
  );
};
