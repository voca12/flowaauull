import React, { useRef, useState } from 'react';
import { ImagePlus, Upload, X, Sparkles } from 'lucide-react';
import { compressImage } from '../../utils/indexedDB';
import { PhotoMemory } from '../../types';
import { audioEngine } from '../../utils/audioSynth';

interface PhotoUploaderProps {
  onAddPhoto: (photo: PhotoMemory) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onAddPhoto }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('Today');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const compressedDataUrl = await compressImage(file, 900, 0.85);
      setPreviewUrl(compressedDataUrl);
      setIsProcessing(false);
      audioEngine.playClickSound();
    } catch (err) {
      console.error('Failed to process image:', err);
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (!previewUrl) return;

    const stickers: ('heart' | 'star' | 'flower' | 'sparkle' | 'ribbon')[] = [
      'heart', 'flower', 'sparkle', 'ribbon'
    ];
    const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
    const randomRotation = (Math.random() - 0.5) * 6;

    const newPhoto: PhotoMemory = {
      id: `photo-${Date.now()}`,
      dataUrl: previewUrl,
      caption: caption.trim() || 'A sweet moment together ✨',
      date: date.trim() || 'Special Memory',
      rotation: randomRotation,
      sticker: randomSticker
    };

    onAddPhoto(newPhoto);
    audioEngine.playBloomSparkleSound();

    // Reset and close
    setPreviewUrl(null);
    setCaption('');
    setDate('Today');
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button - Royal Purple with Lavender border */}
      <button
        onClick={() => {
          audioEngine.playClickSound();
          setIsOpen(true);
        }}
        className="flex items-center gap-2 px-3.5 py-2 rounded-lg border-2 border-dashed border-[#59418C] hover:border-[#A78BCE] bg-[#D8C8F0]/30 hover:bg-[#D8C8F0]/60 text-[#30234F] font-pixel text-[10px] tracking-wider transition-all hover:scale-102"
      >
        <ImagePlus size={15} className="text-[#59418C]" />
        <span>Add Memory</span>
      </button>

      {/* Upload Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11152E]/70 backdrop-blur-xs select-none animate-fade-in">
          <div className="relative w-full max-w-md p-6 bg-[#F0EAF8] rounded-xl border-4 border-[#30234F] shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-[#59418C] hover:text-[#11152E] p-1"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4 text-[#30234F]">
              <Sparkles size={18} className="text-[#59418C]" />
              <h3 className="font-pixel text-xs">Add a Scrapbook Photo</h3>
            </div>

            {/* Image Preview / File Drop Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-square w-full max-w-[240px] mx-auto rounded-lg border-2 border-dashed border-[#A78BCE] hover:border-[#59418C] bg-[#F8F6FF] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-[#59418C]">
                  <Upload size={32} className="mx-auto mb-2 text-[#59418C]" />
                  <p className="text-xs font-mono font-medium">
                    {isProcessing ? 'Processing image...' : 'Click to choose photo'}
                  </p>
                </div>
              )}
            </div>

            {/* Inputs */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#30234F] mb-1 font-semibold">
                  Caption / Memory Note:
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Our sweetest trip together 💕"
                  className="w-full px-3 py-1.5 text-sm bg-[#F8F6FF] border border-[#A78BCE] rounded text-[#11152E] focus:border-[#59418C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#30234F] mb-1 font-semibold">
                  Date / Occasion:
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. Summer Vacation, 2026"
                  className="w-full px-3 py-1.5 text-sm bg-[#F8F6FF] border border-[#A78BCE] rounded text-[#11152E] focus:border-[#59418C] focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-mono text-[#30234F] hover:bg-[#D8C8F0]/40 rounded font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={!previewUrl || isProcessing}
                onClick={handleSave}
                className={`px-5 py-2 font-pixel text-[10px] text-[#F8F6FF] rounded bg-[#59418C] hover:bg-[#30234F] shadow transition-all ${
                  !previewUrl ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                Paste in Book ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
