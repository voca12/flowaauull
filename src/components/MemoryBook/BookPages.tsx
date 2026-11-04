import React, { useState } from 'react';
import { BookData, PhotoMemory, ChecklistItem } from '../../types';
import { EditableText } from './EditableText';
import { ScrapbookFrame } from './ScrapbookFrame';
import { PhotoUploader } from './PhotoUploader';
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Sparkles, 
  Flower2, 
  Plus, 
  BookX, 
  ArrowRight,
  Check
} from 'lucide-react';
import { audioEngine } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';

interface BookPagesProps {
  bookData: BookData;
  onUpdateBookData: (updated: BookData) => void;
  onCloseBook: () => void;
  onEnterGarden: () => void;
}

export const BookPages: React.FC<BookPagesProps> = ({
  bookData,
  onUpdateBookData,
  onCloseBook,
  onEnterGarden
}) => {
  const [currentSpread, setCurrentSpread] = useState(0);
  const totalSpreads = 4; // Spreads 0, 1, 2, 3

  const handleNextSpread = () => {
    if (currentSpread < totalSpreads - 1) {
      audioEngine.playPageTurnSound();
      setCurrentSpread(prev => prev + 1);
    }
  };

  const handlePrevSpread = () => {
    if (currentSpread > 0) {
      audioEngine.playPageTurnSound();
      setCurrentSpread(prev => prev - 1);
    } else {
      audioEngine.playPageTurnSound();
      onCloseBook();
    }
  };

  // Photo handlers
  const handleAddPhoto = (photo: PhotoMemory) => {
    const updatedPhotos = [photo, ...bookData.photos];
    onUpdateBookData({ ...bookData, photos: updatedPhotos });
  };

  const handleDeletePhoto = (id: string) => {
    const updatedPhotos = bookData.photos.filter(p => p.id !== id);
    onUpdateBookData({ ...bookData, photos: updatedPhotos });
  };

  const handleUpdateCaption = (id: string, newCaption: string) => {
    const updatedPhotos = bookData.photos.map(p =>
      p.id === id ? { ...p, caption: newCaption } : p
    );
    onUpdateBookData({ ...bookData, photos: updatedPhotos });
  };

  const handleUpdateDate = (id: string, newDate: string) => {
    const updatedPhotos = bookData.photos.map(p =>
      p.id === id ? { ...p, date: newDate } : p
    );
    onUpdateBookData({ ...bookData, photos: updatedPhotos });
  };

  // Checklist handler
  const handleToggleChecklist = (id: string) => {
    audioEngine.playClickSound();
    const updatedList = bookData.checklist.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    onUpdateBookData({ ...bookData, checklist: updatedList });
  };

  const handleAddChecklistItem = () => {
    audioEngine.playClickSound();
    const newItem: ChecklistItem = {
      id: `check-${Date.now()}`,
      text: 'New memory or promise together 💕',
      done: true
    };
    onUpdateBookData({
      ...bookData,
      checklist: [...bookData.checklist, newItem]
    });
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center select-none p-2 sm:p-4">
      {/* Top Bar: Close Book & Page Indicator */}
      <div className="w-full flex items-center justify-between mb-3 px-2 text-rose-300 font-pixel text-[10px]">
        <button
          onClick={() => {
            audioEngine.playPageTurnSound();
            onCloseBook();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/60 hover:bg-neutral-800 text-rose-300 border border-rose-900/40 transition-colors"
          title="Close diary"
        >
          <BookX size={13} />
          <span>Close Cover</span>
        </button>

        <div className="tracking-widest uppercase text-neutral-400 font-mono text-xs">
          Pages {currentSpread * 2 + 1} - {currentSpread * 2 + 2} of 8
        </div>
      </div>

      {/* Two-Page Book Spread Container */}
      <div className="relative w-full rounded-2xl bg-[#fdfbf7] border-4 border-[#4a2e2b] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row overflow-hidden min-h-[580px]">
        {/* Book Center Crease / Spine Shadow */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-neutral-400/20 via-neutral-600/30 to-neutral-400/20 pointer-events-none z-20" />

        {/* ---------------- SPREAD 0: Welcome Letter & Milestones ---------------- */}
        {currentSpread === 0 && (
          <>
            {/* Left Page: Letter to My Love */}
            <div className="flex-1 p-6 sm:p-10 border-b md:border-b-0 md:border-r border-amber-200/80 bg-[#fffdfa] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-pixel text-[10px] text-rose-500 uppercase tracking-widest">
                    Page 1
                  </span>
                  <div className="flex gap-1 text-rose-400">
                    <Heart size={14} className="fill-current" />
                    <Sparkles size={14} />
                  </div>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-neutral-800 mb-4 font-bold tracking-tight">
                  <EditableText
                    value={bookData.letterTitle}
                    onSave={(val) => onUpdateBookData({ ...bookData, letterTitle: val })}
                    placeholder="Happy Birthday, My Love!"
                  />
                </h3>

                <div className="font-handwriting text-lg sm:text-xl text-neutral-700 leading-relaxed space-y-3 font-medium">
                  <EditableText
                    value={bookData.letterBody}
                    onSave={(val) => onUpdateBookData({ ...bookData, letterBody: val })}
                    multiline
                  />
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-amber-200/60 flex items-center justify-between">
                <span className="font-mono text-xs text-neutral-400 italic">
                  Always by your side
                </span>
                <span className="font-handwriting text-2xl text-rose-600 font-bold">
                  {bookData.senderName}
                </span>
              </div>
            </div>

            {/* Right Page: Milestones & Counters */}
            <div className="flex-1 p-6 sm:p-10 bg-[#fffdfa] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-500">
                    <Flower2 size={16} />
                  </div>
                  <span className="font-pixel text-[10px] text-rose-500 uppercase tracking-widest">
                    Page 2
                  </span>
                </div>

                <h3 className="font-pixel text-xs text-neutral-700 mb-6 uppercase tracking-wider">
                  Our Love Milestones
                </h3>

                {/* Milestone cards */}
                <div className="space-y-4">
                  {bookData.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 shadow-xs flex items-center justify-between"
                    >
                      <span className="text-sm font-serif text-neutral-700">
                        {m.label}
                      </span>
                      <span className="font-pixel text-xs text-rose-600">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cute Scrapbook Note */}
                <div className="mt-8 p-4 rounded-lg bg-pink-50 border border-pink-200 transform -rotate-1 relative">
                  <div className="absolute -top-2 left-6 w-12 h-4 washi-tape-pink" />
                  <p className="font-handwriting text-lg text-rose-800 leading-snug">
                    "Meeting you was destiny, becoming your friend was a choice, but falling in love with you was totally out of my control."
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center text-xs font-mono text-neutral-400">
                Turn page to view our photo gallery →
              </div>
            </div>
          </>
        )}

        {/* ---------------- SPREAD 1: Photo Scrapbook Gallery ---------------- */}
        {currentSpread === 1 && (
          <>
            {/* Left Page: Photos 1 & 2 */}
            <div className="flex-1 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-amber-200/80 bg-[#fffdfa] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-pixel text-[10px] text-rose-500 uppercase tracking-widest">
                    Page 3
                  </span>
                  <PhotoUploader onAddPhoto={handleAddPhoto} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-2">
                  {bookData.photos.slice(0, 2).map((photo) => (
                    <ScrapbookFrame
                      key={photo.id}
                      photo={photo}
                      onUpdateCaption={handleUpdateCaption}
                      onUpdateDate={handleUpdateDate}
                      onDelete={handleDeletePhoto}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center font-mono text-xs text-neutral-400 mt-4">
                Click any caption or date to edit
              </div>
            </div>

            {/* Right Page: Photos 3 & 4 */}
            <div className="flex-1 p-6 sm:p-8 bg-[#fffdfa] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif italic text-sm text-neutral-500">
                    Cherished Snapshots
                  </span>
                  <span className="font-pixel text-[10px] text-rose-500 uppercase tracking-widest">
                    Page 4
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-2">
                  {bookData.photos.slice(2, 4).map((photo) => (
                    <ScrapbookFrame
                      key={photo.id}
                      photo={photo}
                      onUpdateCaption={handleUpdateCaption}
                      onUpdateDate={handleUpdateDate}
                      onDelete={handleDeletePhoto}
                    />
                  ))}
                </div>

                {bookData.photos.length <= 2 && (
                  <div className="text-center py-10 border-2 border-dashed border-amber-200 rounded-xl my-4">
                    <p className="font-handwriting text-xl text-neutral-400">
                      Add more memories by clicking the button on page 3! ✨
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center font-mono text-xs text-neutral-400 mt-4">
                Memories frozen in time 💕
              </div>
            </div>
          </>
        )}

        {/* ---------------- SPREAD 2: Reasons Why I Love You & Bucket List ---------------- */}
        {currentSpread === 2 && (
          <>
            {/* Left Page: Reasons Why I Love You */}
            <div className="flex-1 p-6 sm:p-10 border-b md:border-b-0 md:border-r border-amber-200/80 bg-[#fffdfa] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-pixel text-[10px] text-rose-500 uppercase tracking-widest">
                    Page 5
                  </span>
                  <Heart size={16} className="text-rose-500 fill-rose-500" />
                </div>

                <h3 className="font-pixel text-xs text-neutral-800 mb-6 uppercase tracking-wider">
                  Things I Adore About You
                </h3>

                <div className="space-y-3">
                  {bookData.checklist.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklist(item.id)}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-rose-50/70 cursor-pointer transition-colors"
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                          item.done
                            ? 'bg-rose-500 border-rose-600 text-white'
                            : 'border-neutral-300 bg-white'
                        }`}
                      >
                        {item.done && <Check size={14} className="stroke-[3]" />}
                      </div>
                      <span
                        className={`font-handwriting text-lg text-neutral-800 ${
                          item.done ? 'font-semibold text-neutral-900' : 'text-neutral-500'
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 text-right">
                <span className="text-xs font-mono text-neutral-400">
                  Tap any item to check off!
                </span>
              </div>
            </div>

            {/* Right Page: Our Future Bucket List */}
            <div className="flex-1 p-6 sm:p-10 bg-[#fffdfa] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handleAddChecklistItem}
                    className="flex items-center gap-1 text-[11px] font-pixel text-rose-600 hover:text-rose-700"
                    title="Add new wish"
                  >
                    <Plus size={14} />
                    <span>Add Wish</span>
                  </button>
                  <span className="font-pixel text-[10px] text-rose-500 uppercase tracking-widest">
                    Page 6
                  </span>
                </div>

                <h3 className="font-pixel text-xs text-neutral-800 mb-6 uppercase tracking-wider">
                  Our Next Adventures
                </h3>

                <div className="space-y-3">
                  {bookData.checklist.slice(5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklist(item.id)}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-amber-50 cursor-pointer transition-colors"
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                          item.done
                            ? 'bg-amber-500 border-amber-600 text-white'
                            : 'border-neutral-300 bg-white'
                        }`}
                      >
                        {item.done && <Check size={14} className="stroke-[3]" />}
                      </div>
                      <span className="font-handwriting text-lg text-neutral-800">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 text-center">
                <span className="text-xs font-mono text-neutral-400">
                  A lifetime of dreams waiting for us ✈️
                </span>
              </div>
            </div>
          </>
        )}

        {/* ---------------- SPREAD 3: The Final Teaser & Portal to Flower Garden ---------------- */}
        {currentSpread === 3 && (
          <>
            {/* Left Page: Love Poem / Final Note */}
            <div className="flex-1 p-6 sm:p-10 border-b md:border-b-0 md:border-r border-amber-200/80 bg-[#fffdfa] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-pixel text-[10px] text-rose-500 uppercase tracking-widest">
                    Page 7
                  </span>
                  <Sparkles size={16} className="text-amber-500" />
                </div>

                <h3 className="font-serif text-2xl text-neutral-800 mb-4 font-bold">
                  Flowers For You
                </h3>

                <p className="font-handwriting text-xl text-neutral-700 leading-relaxed font-medium">
                  <EditableText
                    value={bookData.finalNote}
                    onSave={(val) => onUpdateBookData({ ...bookData, finalNote: val })}
                    multiline
                  />
                </p>

                <div className="my-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200/70 text-center">
                  <p className="font-serif italic text-sm text-neutral-600">
                    "I wanted to craft a bouquet as timeless as my love for you — one born from pure light, rhythm, and devotion."
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono text-neutral-400">
                Prepared with all my heart
              </div>
            </div>

            {/* Right Page: The Magical Portal to the ASCII Flower Garden! */}
            <div className="flex-1 p-6 sm:p-10 bg-gradient-to-b from-[#14121a] to-[#0a080e] text-white flex flex-col justify-between items-center text-center relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-radial from-rose-500/10 via-transparent to-transparent pointer-events-none" />

              <div className="w-full">
                <div className="flex items-center justify-between mb-4 text-rose-400 font-pixel text-[10px]">
                  <Sparkles size={16} className="text-amber-400 animate-spin" />
                  <span>Page 8 (The Secret)</span>
                </div>

                <div className="my-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/20 border-2 border-rose-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(255,105,180,0.3)] animate-pulse">
                    <Flower2 size={40} className="text-rose-300" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif text-[#f3eed9] mb-3">
                  A Secret Flower Garden
                </h3>

                <p className="text-xs sm:text-sm font-mono text-rose-200/80 max-w-xs mx-auto leading-relaxed mb-6">
                  Behind this page lies a living digital bouquet coded uniquely for you. Watch them grow and bloom into the night.
                </p>

                {/* THE PORTAL BUTTON */}
                <button
                  onClick={() => {
                    audioEngine.playBloomSparkleSound();
                    try {
                      confetti({
                        particleCount: 60,
                        spread: 80,
                        origin: { y: 0.6 }
                      });
                    } catch {
                      // ignore
                    }
                    onEnterGarden();
                  }}
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-serif text-sm tracking-wider shadow-[0_0_25px_rgba(255,75,110,0.5)] hover:shadow-[0_0_35px_rgba(255,75,110,0.8)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Enter the Garden</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="text-[11px] font-mono text-neutral-400 mt-4">
                Click to step into the garden ✨
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between w-full mt-4 px-2">
        <button
          onClick={handlePrevSpread}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-rose-200 border border-neutral-800 font-pixel text-[10px] tracking-wider transition-all hover:scale-105"
        >
          <ChevronLeft size={14} />
          <span>{currentSpread === 0 ? 'Cover' : 'Previous'}</span>
        </button>

        {/* Quick Spread Dots */}
        <div className="flex gap-2">
          {Array.from({ length: totalSpreads }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                audioEngine.playPageTurnSound();
                setCurrentSpread(idx);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSpread === idx
                  ? 'bg-rose-500 w-6'
                  : 'bg-neutral-700 hover:bg-neutral-500'
              }`}
              title={`Jump to spread ${idx + 1}`}
            />
          ))}
        </div>

        {currentSpread < totalSpreads - 1 ? (
          <button
            onClick={handleNextSpread}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-rose-200 border border-neutral-800 font-pixel text-[10px] tracking-wider transition-all hover:scale-105"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        ) : (
          <button
            onClick={onEnterGarden}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-pixel text-[10px] tracking-wider shadow-lg shadow-rose-900/40 transition-all hover:scale-105"
          >
            <span>Garden</span>
            <Flower2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
