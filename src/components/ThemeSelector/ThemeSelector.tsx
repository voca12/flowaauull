import React from 'react';
import { FLOWER_THEMES } from '../../utils/themes';
import { FlowerTheme, ThemeId } from '../../types';
import { audioEngine } from '../../utils/audioSynth';

interface ThemeSelectorProps {
  currentTheme: FlowerTheme;
  onSelectTheme: (theme: FlowerTheme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme
}) => {
  const themes = Object.values(FLOWER_THEMES);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-black/60 backdrop-blur-md rounded-full border border-neutral-800 shadow-xl max-w-xl mx-auto">
      <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono pl-3 hidden sm:inline">
        Theme:
      </span>
      {themes.map((t) => {
        const isSelected = currentTheme.id === t.id;
        return (
          <button
            key={t.id}
            onClick={() => {
              audioEngine.playClickSound();
              onSelectTheme(t);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif transition-all duration-300 ${
              isSelected
                ? 'bg-neutral-800 text-white shadow-md ring-1 ring-white/40 scale-105'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/80'
            }`}
            title={t.description}
          >
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shadow-sm transition-transform duration-300"
              style={{
                backgroundColor: t.previewColor,
                boxShadow: isSelected ? `0 0 8px ${t.previewColor}` : 'none'
              }}
            />
            <span className="tracking-wide">{t.name}</span>
          </button>
        );
      })}
    </div>
  );
};
