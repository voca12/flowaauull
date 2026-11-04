import { BookData, PhotoMemory } from '../types';

const DB_NAME = 'BirthdayMemoryBookDB';
const DB_VERSION = 1;
const STORE_NAME = 'book_state';
const STATE_KEY = 'current_memory_book';

// Default starter photos with cute romantic pixel-styled SVG illustrations
const DEFAULT_PHOTOS: PhotoMemory[] = [
  {
    id: 'photo-1',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23ffd1dc"/><circle cx="200" cy="180" r="90" fill="%23fff"/><path d="M150 170 Q165 150 180 170 Q195 190 200 205 Q205 190 220 170 Q235 150 250 170 Q260 190 200 240 Q140 190 150 170 Z" fill="%23ff4d6d"/><text x="200" y="320" font-family="sans-serif" font-size="20" font-weight="bold" fill="%237a3b4d" text-anchor="middle">The day we first met ✨</text></svg>',
    caption: 'The unforgettable day everything changed ✨',
    date: 'Day One',
    rotation: -2,
    sticker: 'sparkle'
  },
  {
    id: 'photo-2',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23ffe5b4"/><rect x="50" y="60" width="300" height="250" rx="15" fill="%23fff"/><circle cx="160" cy="170" r="45" fill="%23ff85a1"/><circle cx="240" cy="170" r="45" fill="%2370d6ff"/><path d="M140 250 Q200 280 260 250" stroke="%23ff70a6" stroke-width="8" fill="none" stroke-linecap="round"/><text x="200" y="340" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23936639" text-anchor="middle">Late night talks & laughter ☕</text></svg>',
    caption: 'Late night giggles and endless conversations ☕',
    date: 'A Cozy Evening',
    rotation: 3,
    sticker: 'heart'
  },
  {
    id: 'photo-3',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23d8e2dc"/><path d="M0 320 Q100 280 200 310 T400 290 L400 400 L0 400 Z" fill="%23a3b18a"/><circle cx="200" cy="130" r="50" fill="%23f4a261"/><path d="M180 180 L200 270 L220 180 Z" fill="%23264653"/><text x="200" y="350" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23344e41" text-anchor="middle">Our favorite sunset walk 🌅</text></svg>',
    caption: 'Watching the golden sunset together 🌅',
    date: 'Summer Days',
    rotation: -1.5,
    sticker: 'flower'
  },
  {
    id: 'photo-4',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23ede0d4"/><circle cx="200" cy="190" r="85" fill="%23e6ccb2"/><text x="200" y="195" font-size="65" text-anchor="middle" dominant-baseline="middle">🎂</text><text x="200" y="330" font-family="sans-serif" font-size="18" font-weight="bold" fill="%237f5539" text-anchor="middle">Another year sweeter 💖</text></svg>',
    caption: 'Celebrating the sweetest person in my world 🎂',
    date: 'Today & Always',
    rotation: 2.5,
    sticker: 'ribbon'
  }
];

export const DEFAULT_BOOK_DATA: BookData = {
  recipientName: 'My Beloved',
  senderName: 'Yours Always',
  coverTitle: 'Our Memory Diary',
  letterTitle: 'Happy Birthday, My Love!',
  letterBody: `To the most radiant, wonderful person in the world — Happy Birthday!

Every moment spent with you feels like a page from a storybook I never want to put down. From our quiet coffee dates to late-night laughter that leaves our stomachs aching, you bring warmth, color, and magic into my life.

I built this little digital diary and living garden just for you, as a reminder that love grows more beautiful with every passing second. Turn through these pages of our cherished memories, and at the end, I have a special bloom waiting for you...`,
  milestones: [
    { label: 'Smiles Shared', value: '∞' },
    { label: 'Favorite Memory', value: 'Every single one' },
    { label: 'Wishes For You', value: 'All of them' }
  ],
  checklist: [
    { id: 'c1', text: 'Stole my heart effortlessly', done: true },
    { id: 'c2', text: 'Cutest laugh in the entire universe', done: true },
    { id: 'c3', text: 'My favorite person to talk to every day', done: true },
    { id: 'c4', text: 'Looks gorgeous even when sleepy', done: true },
    { id: 'c5', text: 'Deserves the happiest birthday ever', done: true },
    { id: 'c6', text: 'Take a trip to Japan together', done: false },
    { id: 'c7', text: 'Adopt a cute pet companion', done: false },
    { id: 'c8', text: 'Grow old and make a million more memories', done: false }
  ],
  photos: DEFAULT_PHOTOS,
  finalNote: 'I wanted to give you flowers that never wither, never fade, and bloom only for you. Turn the page to see them dance into life...'
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadBookData(): Promise<BookData> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(STATE_KEY);
      req.onsuccess = () => {
        if (req.result) {
          resolve({ ...DEFAULT_BOOK_DATA, ...req.result });
        } else {
          // If first time, seed with default
          saveBookData(DEFAULT_BOOK_DATA).catch(console.error);
          resolve(DEFAULT_BOOK_DATA);
        }
      };
      req.onerror = () => {
        resolve(DEFAULT_BOOK_DATA);
      };
    });
  } catch (err) {
    console.warn('Failed to load from IndexedDB, using defaults:', err);
    return DEFAULT_BOOK_DATA;
  }
}

export async function saveBookData(data: BookData): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, STATE_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to save to IndexedDB:', err);
  }
}

export async function resetBookData(): Promise<BookData> {
  await saveBookData(DEFAULT_BOOK_DATA);
  return DEFAULT_BOOK_DATA;
}

/**
 * Resizes an image to fit nicely within standard dimensions before storing
 */
export function compressImage(file: File, maxDim = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
