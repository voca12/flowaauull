import React, { useState, useEffect } from 'react';
import { MemoryPage } from './pages/MemoryPage';
import { GardenPage } from './pages/GardenPage';
import { BookData } from './types';
import { loadBookData, DEFAULT_BOOK_DATA } from './utils/indexedDB';
import { audioEngine } from './utils/audioSynth';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'memory' | 'garden'>('memory');
  const [bookData, setBookData] = useState<BookData>(DEFAULT_BOOK_DATA);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved memories from IndexedDB
  useEffect(() => {
    loadBookData().then((data) => {
      setBookData(data);
      setIsLoading(false);
    });
  }, []);

  const handleToggleMusic = () => {
    const playing = audioEngine.toggleMusic();
    setIsMusicPlaying(playing);
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#1e1014] text-rose-300 font-pixel text-xs">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p>Opening memories...</p>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen overflow-x-hidden bg-black">
      {currentPage === 'memory' ? (
        <MemoryPage
          bookData={bookData}
          onUpdateBookData={setBookData}
          onEnterGarden={() => setCurrentPage('garden')}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
        />
      ) : (
        <GardenPage
          bookData={bookData}
          onBackToBook={() => setCurrentPage('memory')}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
        />
      )}
    </div>
  );
};

export default App;

