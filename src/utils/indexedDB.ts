import { BookData, PhotoMemory } from '../types';

const DB_NAME = 'BirthdayMemoryBookDB';
const DB_VERSION = 1;
const STORE_NAME = 'book_state';
const STATE_KEY = 'current_memory_book';

const CONTENT_VERSION = 5;
const VERSION_KEY = 'content_version';

/**
 * Resolves local image paths to be compatible with Vite's base path on GitHub Pages
 * E.g., '/images/memory-1.jpg' -> './images/memory-1.jpg' or '/flowaa/images/memory-1.jpg'
 */
export function resolvePhotoUrl(url: string | undefined): string {
  if (!url) return '';

  // Data URLs, Blobs, or external URLs: return as-is
  if (
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.startsWith('http://') ||
    url.startsWith('https://')
  ) {
    return url;
  }

  // Remove leading slash if any
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  const base = import.meta.env.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;

  return `${normalizedBase}${cleanPath}`;
}

// Default starter photos pointing to local assets in public/images/
export const DEFAULT_PHOTOS: PhotoMemory[] = [
  {
    id: 'photo-1',
    dataUrl: '/images/memory-1.jpg',
    caption: 'Inii Barra masii maluuu',
    date: '17-8-25',
    rotation: -2,
    sticker: 'sparkle'
  },
  {
    id: 'photo-2',
    dataUrl: '/images/memory-2.jpg',
    caption: 'Lucuu, belajar bahasa inggris di mixue',
    date: '22-8-25',
    rotation: 3,
    sticker: 'heart'
  },
  {
    id: 'photo-3',
    dataUrl: '/images/memory-3.jpg',
    caption: 'Batikk',
    date: '21-11-25',
    rotation: -1.5,
    sticker: 'flower'
  },
  {
    id: 'photo-4',
    dataUrl: '/images/memory-4.jpg',
    caption: 'Wiii luluuss',
    date: '4-5-26',
    rotation: 2.5,
    sticker: 'ribbon'
  }
];

export const DEFAULT_BOOK_DATA: BookData = {
  recipientName: 'Ka Auull',
  senderName: 'Barra',
  coverTitle: 'Our Memories',
  letterTitle: 'Happy Birthday, Ma Luvv!',

  letterBody: `To my universe, my beloved empress,

Every moment spent with you feels like a page from a storybook I never want to put down. From our quiet interaction at Tiga Serangkai, you bring warmth, color, and magic into my life.

I built this little digital diary because we both loves flowers, as a reminder that love grows more beautiful with every passing second. Turn through these pages of our cherished memories, and at the end, I have a special bloom waiting for you.`,

  milestones: [
    { label: 'Smiles Shared', value: '∞' },
    { label: 'Favorite Memory', value: 'Every single one' },
    { label: 'Wishes For You', value: 'All of them' }
  ],

  checklist: [
    { id: 'c1', text: 'Stole my heart effortlessly', done: true },
    { id: 'c2', text: 'Cutest laugh in the entire universe', done: true },
    { id: 'c3', text: 'My favorite person to talk to every day', done: true },
    { id: 'c4', text: 'Looks gorgeous even when u angry', done: true },
    { id: 'c5', text: 'Deserves the happiest birthday ever', done: true },
    { id: 'c6', text: 'Take a trip to China together', done: false },
    { id: 'c7', text: 'Be an engineers couple', done: false },
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

/**
 * Synchronizes starter photos to local public images while preserving:
 * - User edited captions, dates, rotations, and stickers
 * - Any user uploaded photos
 * - Without wiping or resetting user data
 */
const STARTER_PHOTO_IDS = new Set(['photo-1', 'photo-2', 'photo-3', 'photo-4']);

function syncPhotos(savedPhotos: PhotoMemory[] | undefined): PhotoMemory[] {
  const defaultPhotoMap = new Map<string, PhotoMemory>(
    DEFAULT_PHOTOS.map((p) => [p.id, p])
  );

  const existingPhotos = Array.isArray(savedPhotos) ? [...savedPhotos] : [];

  // Update existing photos in place
  const updatedPhotos = existingPhotos.map((photo) => {
    const defaultMatch = defaultPhotoMap.get(photo.id);

    // If it's one of the default photos (photo-1 to photo-4)
    if (defaultMatch) {
      return {
        ...defaultMatch,
        ...photo,
        dataUrl: defaultMatch.dataUrl // Always use local reliable /images/memory-X.jpg
      };
    }

    // If an existing photo has a broken drive.google.com link, repair it based on id
    if (photo.dataUrl && photo.dataUrl.includes('drive.google.com')) {
      const repairMatch = DEFAULT_PHOTOS.find((dp) => dp.id === photo.id);
      if (repairMatch) {
        return {
          ...photo,
          dataUrl: repairMatch.dataUrl
        };
      }
    }

    // Keep user's custom uploaded photos as-is
    return photo;
  });

  // Ensure all 4 starter photos exist
  for (const defPhoto of DEFAULT_PHOTOS) {
    const exists = updatedPhotos.some((p) => p.id === defPhoto.id);
    if (!exists) {
      updatedPhotos.push(defPhoto);
    }
  }

  // Sort so photo-1..photo-4 appear in their intended order (photo-1 and 2 on Page 3, photo-3 and 4 on Page 4)
  // followed by any extra user-uploaded photos
  updatedPhotos.sort((a, b) => {
    const aIsDefault = STARTER_PHOTO_IDS.has(a.id);
    const bIsDefault = STARTER_PHOTO_IDS.has(b.id);
    if (aIsDefault && bIsDefault) {
      return a.id.localeCompare(b.id, undefined, { numeric: true });
    }
    if (aIsDefault && !bIsDefault) return -1;
    if (!aIsDefault && bIsDefault) return 1;
    return 0;
  });

  return updatedPhotos;
}

/**
 * Syncs checklist items:
 * - Replaces existing default items (c1-c8) with the latest text/done from DEFAULT_BOOK_DATA
 * - Preserves the done/checked state toggled by the user for default items
 * - Preserves any user-added items (IDs not in the default set)
 */
function syncChecklist(savedChecklist: BookData['checklist'] | undefined): BookData['checklist'] {
  const defaultIds = new Set(DEFAULT_BOOK_DATA.checklist.map((item) => item.id));
  const savedMap = new Map((savedChecklist ?? []).map((item) => [item.id, item]));

  // Start with fresh defaults, but carry over the user's toggled `done` state
  const merged: BookData['checklist'] = DEFAULT_BOOK_DATA.checklist.map((defItem) => {
    const saved = savedMap.get(defItem.id);
    return saved
      ? { ...defItem, done: saved.done } // keep user's toggled state, refresh text
      : { ...defItem };
  });

  // Append any user-added items (IDs not in default set)
  for (const item of savedChecklist ?? []) {
    if (!defaultIds.has(item.id)) {
      merged.push(item);
    }
  }

  return merged;
}

// Update selected default content while preserving user memories

async function syncDefaultContent(
  db: IDBDatabase,
  savedData: BookData
): Promise<BookData> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const versionRequest = store.get(VERSION_KEY);
    let updatedData = savedData;

    versionRequest.onsuccess = () => {
      const savedVersion = versionRequest.result ?? 0;

      const syncedPhotos = syncPhotos(savedData.photos);
      const syncedChecklist = syncChecklist(savedData.checklist);

      if (savedVersion < CONTENT_VERSION) {
        updatedData = {
          ...savedData,

          // Ambil konten terbaru dari DEFAULT_BOOK_DATA
          recipientName: DEFAULT_BOOK_DATA.recipientName,
          senderName: DEFAULT_BOOK_DATA.senderName,
          coverTitle: DEFAULT_BOOK_DATA.coverTitle,
          letterTitle: DEFAULT_BOOK_DATA.letterTitle,
          letterBody: DEFAULT_BOOK_DATA.letterBody,
          finalNote: DEFAULT_BOOK_DATA.finalNote,

          // Perbarui milestones
          milestones: DEFAULT_BOOK_DATA.milestones.map(item => ({ ...item })),

          // Perbarui teks checklist tanpa menghilangkan status done
          checklist: syncedChecklist,

          // Pertahankan foto yang sudah tersimpan
          photos: syncedPhotos
        };

        store.put(updatedData, STATE_KEY);
        store.put(CONTENT_VERSION, VERSION_KEY);
      } else {
        if (JSON.stringify(syncedPhotos) !== JSON.stringify(savedData.photos)) {
          updatedData = {
            ...savedData,
            photos: syncedPhotos
          };

          store.put(updatedData, STATE_KEY);
        }
      }
    };

    versionRequest.onerror = () => reject(versionRequest.error);

    tx.oncomplete = () => resolve(updatedData);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function loadBookData(): Promise<BookData> {
  try {
    const db = await openDB();

    const savedData = await new Promise<BookData | undefined>(
      (resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(STATE_KEY);

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }
    );

    if (savedData) {
      return await syncDefaultContent(db, {
        ...DEFAULT_BOOK_DATA,
        ...savedData
      });
    }

    await saveBookData(DEFAULT_BOOK_DATA);

    const versionTx = db.transaction(STORE_NAME, 'readwrite');
    versionTx.objectStore(STORE_NAME).put(
      CONTENT_VERSION,
      VERSION_KEY
    );

    await new Promise<void>((resolve, reject) => {
      versionTx.oncomplete = () => resolve();
      versionTx.onerror = () => reject(versionTx.error);
      versionTx.onabort = () => reject(versionTx.error);
    });

    return DEFAULT_BOOK_DATA;

  } catch (err) {
    console.warn('Failed to load from IndexedDB:', err);
    return DEFAULT_BOOK_DATA;
  }
}

export async function saveBookData(data: BookData): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    store.put(data, STATE_KEY);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function resetBookData(): Promise<BookData> {
  await saveBookData(DEFAULT_BOOK_DATA);
  return DEFAULT_BOOK_DATA;
}

/**
 * Resizes an image to fit nicely within standard dimensions before storing
 */
export function compressImage(
  file: File,
  maxDim = 1200,
  quality = 0.85
): Promise<string> {
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
