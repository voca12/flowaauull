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
      {/* Top Bar: Close Book & Page Indicator (Deep Purple & Lavender) */}
      <div className="w-full flex items-center justify-between mb-3 px-2 text-[#D8C8F0] font-pixel text-[10px]">
        <button
          onClick={() => {
            audioEngine.playPageTurnSound();
            onCloseBook();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#191D3A] hover:bg-[#30234F] text-[#D8C8F0] hover:text-[#F8F6FF] border border-[#59418C]/40 transition-colors"
          title="Close diary"
        >
          <BookX size={13} className="text-[#A78BCE]" />
          <span>Close Cover</span>
        </button>

        <div className="tracking-widest uppercase text-[#A78BCE] font-mono text-xs font-semibold">
          Pages {currentSpread * 2 + 1} - {currentSpread * 2 + 2} of 8
        </div>
      </div>

      {/* Two-Page Book Spread Container (Pale Lilac #F0EAF8 with Dark Purple & Deep Navy border) */}
      <div className="relative w-full rounded-2xl bg-[#F0EAF8] border-4 border-[#30234F] shadow-[0_20px_50px_rgba(17,21,46,0.6)] flex flex-col md:flex-row overflow-hidden min-h-[580px]">
        {/* Book Center Crease / Spine Shadow */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-[#A78BCE]/20 via-[#30234F]/30 to-[#A78BCE]/20 pointer-events-none z-20" />

        {/* ---------------- SPREAD 0: Welcome Letter & Milestones ---------------- */}
        {currentSpread === 0 && (
          <>
            {/* Left Page: Letter to My Love (Pale Lilac with Dark Navy text and Deep Purple Headings) */}
            <div className="flex-1 p-6 sm:p-10 border-b md:border-b-0 md:border-r border-[#D8C8F0] bg-[#F8F6FF] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-pixel text-[10px] text-[#59418C] uppercase tracking-widest font-bold">
                    Page 1
                  </span>
                  <div className="flex gap-1 text-[#A78BCE]">
                    <Heart size={14} className="fill-[#59418C] text-[#59418C]" />
                    <Sparkles size={14} className="text-[#A78BCE]" />
                  </div>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#30234F] mb-4 font-bold tracking-tight">
                  <EditableText
                    value={bookData.letterTitle}
                    onSave={(val) => onUpdateBookData({ ...bookData, letterTitle: val })}
                    placeholder="Happy Birthday, My Love!"
                  />
                </h3>

                <div className="font-handwriting text-lg sm:text-xl text-[#11152E] leading-relaxed space-y-3 font-semibold">
                  <EditableText
                    value={bookData.letterBody}
                    onSave={(val) => onUpdateBookData({ ...bookData, letterBody: val })}
                    multiline
                  />
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#D8C8F0] flex items-center justify-between">
                <span className="font-mono text-xs text-[#59418C] italic">
                  Always by your side
                </span>
                <span className="font-handwriting text-2xl text-[#30234F] font-bold">
                  {bookData.senderName}
                </span>
              </div>
            </div>

            {/* Right Page: Milestones & Counters */}
            <div className="flex-1 p-6 sm:p-10 bg-[#F0EAF8] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-[#59418C]">
                    <Flower2 size={16} />
                  </div>
                  <span className="font-pixel text-[10px] text-[#59418C] uppercase tracking-widest font-bold">
                    Page 2
                  </span>
                </div>

                <h3 className="font-pixel text-xs text-[#30234F] mb-6 uppercase tracking-wider font-bold">
                  Our Love Milestones
                </h3>

                {/* Milestone cards */}
                <div className="space-y-4">
                  {bookData.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-[#D8C8F0] bg-[#F8F6FF] shadow-xs flex items-center justify-between"
                    >
                      <span className="text-sm font-serif text-[#11152E] font-medium">
                        {m.label}
                      </span>
                      <span className="font-pixel text-xs text-[#59418C] font-bold">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cute Scrapbook Note */}
                <div className="mt-8 p-4 rounded-lg bg-[#E8DEFA] border border-[#A78BCE]/60 transform -rotate-1 relative">
                  <div className="absolute -top-2 left-6 w-12 h-4 washi-tape-lavender" />
                  <p className="font-handwriting text-lg text-[#11152E] leading-snug font-semibold">
                    "Meeting you was destiny, becoming your friend was a choice, but falling in love with you was totally out of my control."
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center text-xs font-mono text-[#59418C] font-medium">
                Turn page to view our photo gallery →
              </div>
            </div>
          </>
        )}

        {/* ---------------- SPREAD 1: Photo Scrapbook Gallery ---------------- */}
        {currentSpread === 1 && (
          <>
            {/* Left Page: Photos 1 & 2 */}
            <div className="flex-1 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-[#D8C8F0] bg-[#F8F6FF] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-pixel text-[10px] text-[#59418C] uppercase tracking-widest font-bold">
                    Page 3
                  </span>
                  <PhotoUploader onAddPhoto={handleAddPhoto} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-2">
                  {bookData.photos.slice(0, 2).map((photo, i) => (
                    <ScrapbookFrame
                      key={photo.id}
                      index={i}
                      photo={photo}
                      onUpdateCaption={handleUpdateCaption}
                      onUpdateDate={handleUpdateDate}
                      onDelete={handleDeletePhoto}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center font-mono text-xs text-[#59418C] mt-4 font-medium">
                Click any caption or date to edit
              </div>
            </div>

            {/* Right Page: Photos 3 & 4 */}
            <div className="flex-1 p-6 sm:p-8 bg-[#F0EAF8] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif italic text-sm text-[#30234F] font-semibold">
                    Cherished Snapshots
                  </span>
                  <span className="font-pixel text-[10px] text-[#59418C] uppercase tracking-widest font-bold">
                    Page 4
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-2">
                  {bookData.photos.slice(2, 4).map((photo, i) => (
                    <ScrapbookFrame
                      key={photo.id}
                      index={i + 2}
                      photo={photo}
                      onUpdateCaption={handleUpdateCaption}
                      onUpdateDate={handleUpdateDate}
                      onDelete={handleDeletePhoto}
                    />
                  ))}
                </div>

                {bookData.photos.length <= 2 && (
                  <div className="text-center py-10 border-2 border-dashed border-[#A78BCE] rounded-xl my-4">
                    <p className="font-handwriting text-xl text-[#59418C] font-semibold">
                      Add more memories by clicking the button on page 3! ✨
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center font-mono text-xs text-[#59418C] mt-4 font-medium">
                Memories frozen in time 💜
              </div>
            </div>
          </>
        )}

        {/* ---------------- SPREAD 2: Reasons Why I Love You & Bucket List ---------------- */}
        {currentSpread === 2 && (
          <>
            {/* Left Page: Reasons Why I Love You */}
            <div className="flex-1 p-6 sm:p-10 border-b md:border-b-0 md:border-r border-[#D8C8F0] bg-[#F8F6FF] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-pixel text-[10px] text-[#59418C] uppercase tracking-widest font-bold">
                    Page 5
                  </span>
                  <Heart size={16} className="text-[#59418C] fill-[#59418C]" />
                </div>

                <h3 className="font-pixel text-xs text-[#30234F] mb-6 uppercase tracking-wider font-bold">
                  Things I Adore About You
                </h3>

                <div className="space-y-3">
                  {bookData.checklist.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklist(item.id)}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#D8C8F0]/30 cursor-pointer transition-colors"
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                          item.done
                            ? 'bg-[#59418C] border-[#30234F] text-[#F8F6FF]'
                            : 'border-[#A78BCE] bg-white'
                        }`}
                      >
                        {item.done && <Check size={14} className="stroke-[3]" />}
                      </div>
                      <span
                        className={`font-handwriting text-lg ${
                          item.done ? 'font-bold text-[#11152E]' : 'text-[#59418C]'
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D8C8F0] text-right">
                <span className="text-xs font-mono text-[#59418C] font-medium">
                  Tap any item to check off!
                </span>
              </div>
            </div>

            {/* Right Page: Our Future Bucket List */}
            <div className="flex-1 p-6 sm:p-10 bg-[#F0EAF8] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handleAddChecklistItem}
                    className="flex items-center gap-1 text-[11px] font-pixel text-[#59418C] hover:text-[#30234F] font-bold"
                    title="Add new wish"
                  >
                    <Plus size={14} />
                    <span>Add Wish</span>
                  </button>
                  <span className="font-pixel text-[10px] text-[#59418C] uppercase tracking-widest font-bold">
                    Page 6
                  </span>
                </div>

                <h3 className="font-pixel text-xs text-[#30234F] mb-6 uppercase tracking-wider font-bold">
                  Our Next Adventures
                </h3>

                <div className="space-y-3">
                  {bookData.checklist.slice(5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklist(item.id)}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#D8C8F0]/30 cursor-pointer transition-colors"
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                          item.done
                            ? 'bg-[#59418C] border-[#30234F] text-[#F8F6FF]'
                            : 'border-[#A78BCE] bg-white'
                        }`}
                      >
                        {item.done && <Check size={14} className="stroke-[3]" />}
                      </div>
                      <span className="font-handwriting text-lg text-[#11152E] font-medium">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D8C8F0] text-center">
                <span className="text-xs font-mono text-[#59418C] font-medium">
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
            <div className="flex-1 p-6 sm:p-10 border-b md:border-b-0 md:border-r border-[#D8C8F0] bg-[#F8F6FF] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-pixel text-[10px] text-[#59418C] uppercase tracking-widest font-bold">
                    Page 7
                  </span>
                  <Sparkles size={16} className="text-[#59418C]" />
                </div>

                <h3 className="font-serif text-2xl text-[#30234F] mb-4 font-bold">
                  Flowers For You
                </h3>

                <p className="font-handwriting text-xl text-[#11152E] leading-relaxed font-semibold">
                  <EditableText
                    value={bookData.finalNote}
                    onSave={(val) => onUpdateBookData({ ...bookData, finalNote: val })}
                    multiline
                  />
                </p>

                <div className="my-6 p-4 rounded-xl bg-[#E8DEFA] border border-[#A78BCE]/60 text-center">
                  <p className="font-serif italic text-sm text-[#30234F] font-medium">
                    "I wanted to craft a bouquet as timeless as my love for you — one born from pure light, rhythm, and devotion."
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono text-[#59418C] font-semibold">
                Prepared with all my heart
              </div>
            </div>

            {/* Right Page: The Magical Portal to the ASCII Flower Garden! */}
            <div className="flex-1 p-6 sm:p-10 bg-gradient-to-b from-[#191D3A] to-[#11152E] text-white flex flex-col justify-between items-center text-center relative overflow-hidden">
              {/* Subtle background glow - Lavender & Royal Purple */}
              <div className="absolute inset-0 bg-radial from-[#59418C]/25 via-transparent to-transparent pointer-events-none" />

              <div className="w-full">
                <div className="flex items-center justify-between mb-4 text-[#D8C8F0] font-pixel text-[10px]">
                  <Sparkles size={16} className="text-[#A78BCE] animate-spin" />
                  <span>Page 8 (The Secret)</span>
                </div>

                <div className="my-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#59418C]/25 border-2 border-[#A78BCE]/50 flex items-center justify-center shadow-[0_0_30px_rgba(167,139,206,0.4)] animate-pulse">
                    <Flower2 size={40} className="text-[#D8C8F0]" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif text-[#F8F6FF] mb-3 font-semibold">
                  A Secret Flower Garden
                </h3>

                <p className="text-xs sm:text-sm font-mono text-[#D8C8F0]/90 max-w-xs mx-auto leading-relaxed mb-6 font-medium">
                  Behind this page lies a living digital bouquet coded uniquely for you. Watch them grow and bloom into the night.
                </p>

                {/* THE PORTAL BUTTON - Royal Purple with Lavender Hover */}
                <button
                  onClick={() => {
                    audioEngine.playBloomSparkleSound();
                    try {
                      confetti({
                        particleCount: 60,
                        spread: 80,
                        origin: { y: 0.6 },
                        colors: ['#A78BCE', '#D8C8F0', '#59418C', '#F8F6FF', '#ffd166']
                      });
                    } catch {
                      // ignore
                    }
                    onEnterGarden();
                  }}
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#59418C] via-[#6d50a8] to-[#59418C] hover:from-[#6d50a8] hover:to-[#A78BCE] text-[#F8F6FF] font-serif text-sm tracking-wider shadow-[0_0_25px_rgba(89,65,140,0.6)] hover:shadow-[0_0_35px_rgba(167,139,206,0.8)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Enter the Garden</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#D8C8F0]" />
                </button>
              </div>

              <div className="text-[11px] font-mono text-[#A78BCE] mt-4 font-semibold">
                Click to step into the garden ✨
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Navigation Buttons (Royal Purple & Navy) */}
      <div className="flex items-center justify-between w-full mt-4 px-2">
        <button
          onClick={handlePrevSpread}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#191D3A] hover:bg-[#30234F] text-[#D8C8F0] hover:text-[#F8F6FF] border border-[#59418C]/40 font-pixel text-[10px] tracking-wider transition-all hover:scale-105"
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
                  ? 'bg-[#A78BCE] w-6'
                  : 'bg-[#30234F] hover:bg-[#59418C]'
              }`}
              title={`Jump to spread ${idx + 1}`}
            />
          ))}
        </div>

        {currentSpread < totalSpreads - 1 ? (
          <button
            onClick={handleNextSpread}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#191D3A] hover:bg-[#30234F] text-[#D8C8F0] hover:text-[#F8F6FF] border border-[#59418C]/40 font-pixel text-[10px] tracking-wider transition-all hover:scale-105"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        ) : (
          <button
            onClick={onEnterGarden}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#59418C] hover:bg-[#6d50a8] text-[#F8F6FF] font-pixel text-[10px] tracking-wider shadow-lg shadow-[#11152E]/60 transition-all hover:scale-105"
          >
            <span>Garden</span>
            <Flower2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
