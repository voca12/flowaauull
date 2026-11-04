import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Check } from 'lucide-react';
import { audioEngine } from '../../utils/audioSynth';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  multiline = false,
  className = '',
  placeholder = 'Click to edit...',
  as: Component = 'span'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setCurrentText(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    audioEngine.playClickSound();
  };

  const handleFinishEdit = () => {
    setIsEditing(false);
    if (currentText.trim() !== value) {
      onSave(currentText.trim() || placeholder);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      handleFinishEdit();
    }
    if (e.key === 'Escape') {
      setCurrentText(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="relative inline-block w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            onBlur={handleFinishEdit}
            onKeyDown={handleKeyDown}
            className={`w-full p-2 bg-[#F8F6FF] border-2 border-dashed border-[#59418C] rounded text-[#11152E] outline-none resize-y min-h-[120px] ${className}`}
            rows={5}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            onBlur={handleFinishEdit}
            onKeyDown={handleKeyDown}
            className={`w-full px-2 py-1 bg-[#F8F6FF] border-b-2 border-dashed border-[#59418C] text-[#11152E] outline-none ${className}`}
          />
        )}
        <button
          onClick={handleFinishEdit}
          className="absolute right-1 bottom-1 p-1 bg-[#59418C] text-[#F8F6FF] rounded text-xs hover:bg-[#30234F]"
          title="Save text"
        >
          <Check size={12} />
        </button>
      </div>
    );
  }

  return (
    <Component
      onClick={handleStartEdit}
      className={`group relative cursor-pointer hover:bg-[#D8C8F0]/50 rounded px-1 -mx-1 transition-colors ${className}`}
      title="Click to personalize text"
    >
      <span>{value || placeholder}</span>
      <Pencil
        size={11}
        className="inline-block ml-1.5 opacity-0 group-hover:opacity-75 text-[#59418C] transition-opacity align-baseline"
      />
    </Component>
  );
};
