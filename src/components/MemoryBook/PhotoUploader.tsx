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
      {/* Trigger Button */}
      <button
        onClick={() => {
          audioEngine.playClickSound();
          setIsOpen(true);
        }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-rose-300 hover:border-rose-400 bg-rose-50/50 hover:bg-rose-100/60 text-rose-700 font-pixel text-[10px] tracking-wider transition-all hover:scale-102"
      >
        <ImagePlus size={16} />
        <span>Add New Memory</span>
      </button>

      {/* Upload Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="relative w-full max-w-md p-6 bg-[#fffdfa] rounded-xl border-4 border-[#5a3825] shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 p-1"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4 text-[#5a3825]">
              <Sparkles size={18} className="text-amber-500" />
              <h3 className="font-pixel text-xs">Add a Scrapbook Photo</h3>
            </div>

            {/* Image Preview / File Drop Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-square w-full max-w-[240px] mx-auto rounded-lg border-2 border-dashed border-neutral-300 hover:border-rose-400 bg-neutral-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors"
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
                <div className="text-center p-4 text-neutral-400">
                  <Upload size={32} className="mx-auto mb-2 text-rose-400" />
                  <p className="text-xs font-mono">
                    {isProcessing ? 'Processing image...' : 'Click to choose photo'}
                  </p>
                </div>
              )}
            </div>

            {/* Inputs */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                  Caption / Memory Note:
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Our sweetest trip together 💕"
                  className="w-full px-3 py-1.5 text-sm bg-neutral-50 border border-neutral-300 rounded focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                  Date / Occasion:
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. Summer Vacation, 2026"
                  className="w-full px-3 py-1.5 text-sm bg-neutral-50 border border-neutral-300 rounded focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-mono text-neutral-600 hover:bg-neutral-100 rounded"
              >
                Cancel
              </button>
              <button
                disabled={!previewUrl || isProcessing}
                onClick={handleSave}
                className={`px-5 py-2 font-pixel text-[10px] text-white rounded bg-rose-600 hover:bg-rose-500 shadow transition-all ${
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
