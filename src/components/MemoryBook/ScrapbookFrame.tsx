import React, { useState } from 'react';
import { PhotoMemory } from '../../types';
import { EditableText } from './EditableText';
import { Trash2, Heart, Sparkles, Flower2, Bookmark, ImageOff } from 'lucide-react';
import { audioEngine } from '../../utils/audioSynth';
import { resolvePhotoUrl } from '../../utils/indexedDB';

interface ScrapbookFrameProps {
  photo: PhotoMemory;
  index?: number;
  onUpdateCaption: (id: string, newCaption: string) => void;
  onUpdateDate: (id: string, newDate: string) => void;
  onDelete: (id: string) => void;
}

export const ScrapbookFrame: React.FC<ScrapbookFrameProps> = ({
  photo,
  index = 0,
  onUpdateCaption,
  onUpdateDate,
  onDelete
}) => {
  const [imgError, setImgError] = useState(false);
  const resolvedSrc = resolvePhotoUrl(photo.dataUrl);

  const rotationStyle = {
    transform: `rotate(${photo.rotation ?? 0}deg)`
  };

  // Alternate frame style between Lavender, Purple, and Navy
  const frameStyles = [
    {
      border: 'border-[#A78BCE]/60',
      washi: 'washi-tape-lavender',
      accent: 'text-[#59418C]'
    },
    {
      border: 'border-[#59418C]/60',
      washi: 'washi-tape-purple',
      accent: 'text-[#30234F]'
    },
    {
      border: 'border-[#191D3A]/60',
      washi: 'washi-tape-navy',
      accent: 'text-[#11152E]'
    }
  ];

  const currentFrameStyle = frameStyles[index % frameStyles.length];

  const renderSticker = () => {
    switch (photo.sticker) {
      case 'heart':
        return <Heart size={20} className="fill-[#59418C] text-[#A78BCE]" />;
      case 'flower':
        return <Flower2 size={20} className="text-[#59418C] fill-[#D8C8F0]" />;
      case 'sparkle':
        return <Sparkles size={20} className="text-[#A78BCE] fill-[#D8C8F0]" />;
      default:
        return <Bookmark size={18} className="text-[#30234F] fill-[#A78BCE]" />;
    }
  };

  return (
    <div
      style={rotationStyle}
      className={`relative group polaroid-frame p-3 pb-4 rounded-sm border-2 ${currentFrameStyle.border} shadow-md max-w-xs mx-auto select-none bg-[#F8F6FF]`}
    >
      {/* Decorative Washi Tape at top-center */}
      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 ${currentFrameStyle.washi} rotate-1 z-10`} />

      {/* Cute Sticker on corner */}
      <div className="absolute -bottom-2 -right-2 z-20 transform rotate-12 drop-shadow-sm">
        {renderSticker()}
      </div>

      {/* Delete button on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          audioEngine.playClickSound();
          onDelete(photo.id);
        }}
        className="absolute top-2 right-2 p-1.5 bg-[#59418C] hover:bg-[#30234F] text-[#F8F6FF] rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow"
        title="Remove memory"
      >
        <Trash2 size={13} />
      </button>

      {/* Photograph Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#E8DEFA] rounded-xs border border-[#A78BCE]/40">
        {!imgError && resolvedSrc ? (
          <img
            src={resolvedSrc}
            alt={photo.caption}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#A78BCE]">
            <ImageOff size={32} className="opacity-50" />
            <span className="font-mono text-[10px] text-center px-2 opacity-60">
              Replace with your photo ✦
            </span>
          </div>
        )}
      </div>

      {/* Scrapbook Details: Date & Handwritten Caption (Dark Navy Text for Maximum Readability) */}
      <div className="mt-3 text-center px-1">
        <div className="text-[11px] font-mono tracking-widest text-[#59418C] uppercase mb-1 font-semibold">
          <EditableText
            value={photo.date}
            onSave={(newDate) => onUpdateDate(photo.id, newDate)}
            placeholder="Add date..."
          />
        </div>

        <div className="text-base sm:text-lg font-handwriting text-[#11152E] leading-snug font-bold">
          <EditableText
            value={photo.caption}
            onSave={(newCap) => onUpdateCaption(photo.id, newCap)}
            placeholder="Add a sweet caption..."
          />
        </div>
      </div>
    </div>
  );
};
