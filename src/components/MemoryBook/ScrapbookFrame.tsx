import React from 'react';
import { PhotoMemory } from '../../types';
import { EditableText } from './EditableText';
import { Trash2, Heart, Sparkles, Flower2, Bookmark } from 'lucide-react';
import { audioEngine } from '../../utils/audioSynth';

interface ScrapbookFrameProps {
  photo: PhotoMemory;
  onUpdateCaption: (id: string, newCaption: string) => void;
  onUpdateDate: (id: string, newDate: string) => void;
  onDelete: (id: string) => void;
}

export const ScrapbookFrame: React.FC<ScrapbookFrameProps> = ({
  photo,
  onUpdateCaption,
  onUpdateDate,
  onDelete
}) => {
  const rotationStyle = {
    transform: `rotate(${photo.rotation ?? 0}deg)`
  };

  const renderSticker = () => {
    switch (photo.sticker) {
      case 'heart':
        return <Heart size={20} className="fill-rose-400 text-rose-500" />;
      case 'flower':
        return <Flower2 size={20} className="text-pink-500 fill-pink-200" />;
      case 'sparkle':
        return <Sparkles size={20} className="text-amber-400 fill-amber-200" />;
      default:
        return <Bookmark size={18} className="text-amber-600 fill-amber-400" />;
    }
  };

  return (
    <div
      style={rotationStyle}
      className="relative group polaroid-frame p-3 pb-4 rounded-sm border border-neutral-200/80 shadow-md max-w-xs mx-auto select-none bg-white"
    >
      {/* Decorative Washi Tape at top-center or corner */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 washi-tape-pink rotate-1 z-10" />

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
        className="absolute top-2 right-2 p-1.5 bg-rose-500/80 hover:bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow"
        title="Remove memory"
      >
        <Trash2 size={13} />
      </button>

      {/* Photograph Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 rounded-xs border border-neutral-300/40">
        <img
          src={photo.dataUrl}
          alt={photo.caption}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Scrapbook Details: Date & Handwritten Caption */}
      <div className="mt-3 text-center px-1">
        <div className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase mb-1">
          <EditableText
            value={photo.date}
            onSave={(newDate) => onUpdateDate(photo.id, newDate)}
            placeholder="Add date..."
          />
        </div>

        <div className="text-base sm:text-lg font-handwriting text-neutral-800 leading-snug font-semibold">
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
