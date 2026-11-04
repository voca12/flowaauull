export interface PhotoMemory {
  id: string;
  dataUrl: string;
  caption: string;
  date: string;
  rotation?: number;
  sticker?: 'heart' | 'star' | 'flower' | 'sparkle' | 'ribbon';
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface BookData {
  recipientName: string;
  senderName: string;
  coverTitle: string;
  letterTitle: string;
  letterBody: string;
  milestones: { label: string; value: string }[];
  checklist: ChecklistItem[];
  photos: PhotoMemory[];
  finalNote: string;
}

export type ThemeId = 'classic' | 'pink' | 'sunset' | 'lavender' | 'pastel';

export interface FlowerTheme {
  id: ThemeId;
  name: string;
  description: string;
  previewColor: string;
  palette: {
    stems: string[];       // Gradation for stems
    leaves: string[];      // Gradation for leaves
    centerLily: string[];  // Main top/center lily colors
    leftLily: string[];    // Mid-left lily colors
    rightLily: string[];   // Mid-right lily colors
    bottomLily: string[];  // Bottom lily colors
    smallLily: string[];   // Side/accent lilies
    buds: string[];        // Bud colors
    anthers: string;       // Pollen tips
    dust: string[];        // Floating ambient particles
  };
}

