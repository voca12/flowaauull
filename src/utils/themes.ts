import { FlowerTheme, ThemeId } from '../types';

export const FLOWER_THEMES: Record<ThemeId, FlowerTheme> = {
  classic: {
    id: 'classic',
    name: 'Classic Garden',
    description: 'Natural vivid flower hues — crimson, magenta, ivory, peach, and gold',
    previewColor: '#e63946',
    palette: {
      stems: ['#2d6a4f', '#40916c', '#52b788', '#74c69d'],
      leaves: ['#1b4332', '#2d6a4f', '#40916c', '#74c69d', '#95d5b2'],
      centerLily: ['#ff4d6d', '#c9184a', '#a4133c', '#800f2f', '#ff758f'], // Deep crimson / ruby
      leftLily: ['#d90429', '#ef233c', '#f72585', '#b5179e', '#7209b7'],   // Vibrant magenta / wine
      rightLily: ['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#e0aaff'],  // Silver white with soft violet tint
      bottomLily: ['#f4a261', '#e76f51', '#f3a261', '#ee8959', '#ffd166'], // Warm peach coral
      smallLily: ['#ffb703', '#fb8500', '#ffd166', '#fca311', '#ffe49e'],  // Golden amber
      buds: ['#590d22', '#800f2f', '#a4133c', '#e29578'],                  // Deep wine & cream buds
      anthers: '#ffea00',
      dust: ['#ffd166', '#ffb703', '#a7c957', '#ffffff', '#ffccd5']
    }
  },
  pink: {
    id: 'pink',
    name: 'Romantic Pink',
    description: 'Tender romance — blush, peony, deep rose, and ballerina pink',
    previewColor: '#ff70a6',
    palette: {
      stems: ['#285943', '#3d7a5d', '#559c7a', '#77c49e'],
      leaves: ['#1e4735', '#2c6148', '#428565', '#7bc9a4'],
      centerLily: ['#ff4d6d', '#ff758f', '#ff8fa3', '#c9184a', '#ffb3c1'], // Pure rose
      leftLily: ['#ff007f', '#ff1493', '#ff69b4', '#db2777', '#f472b6'],   // Hot pink / magenta
      rightLily: ['#ffe5ec', '#ffc2d1', '#ffb3c6', '#ffffff', '#fce7f3'],  // Blush baby pink
      bottomLily: ['#fb7185', '#f43f5e', '#e11d48', '#fda4af', '#ffe4e6'], // Coral rose
      smallLily: ['#ff85a1', '#fbb1bd', '#ff99c8', '#ffccd5', '#ffffff'],  // Soft pink accent
      buds: ['#be185d', '#9d174d', '#831843', '#fbcfe8'],                  // Deep berry buds
      anthers: '#fff0f5',
      dust: ['#ffb3c6', '#ffc2d1', '#ffe5ec', '#ffffff', '#f472b6']
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Radiance',
    description: 'Golden hour twilight — burning orange, fiery red, and honey gold',
    previewColor: '#f77f00',
    palette: {
      stems: ['#2d5016', '#437021', '#5e9432', '#7cb54b'],
      leaves: ['#213d10', '#345e1b', '#4e8529', '#78a84b', '#a2cf6e'],
      centerLily: ['#d00000', '#dc2f02', '#e85d04', '#f48c06', '#faa307'], // Fiery red-orange
      leftLily: ['#9d0208', '#ba181b', '#e5383b', '#ff6b35', '#ff9f1c'],   // Blood orange
      rightLily: ['#ffdd00', '#ffea00', '#fff066', '#ffffa8', '#ffffff'],  // Radiant gold & warm light
      bottomLily: ['#e76f51', '#f4a261', '#e9c46a', '#ee8959', '#f77f00'], // Terracotta peach
      smallLily: ['#ffaa00', '#ffb703', '#ffd166', '#ffe49e', '#fff3b0'],  // Bright amber
      buds: ['#6a040f', '#9d0208', '#dc2f02', '#ffba08'],                  // Dark cinder buds
      anthers: '#ffff3f',
      dust: ['#ffba08', '#faa307', '#f48c06', '#ffdd00', '#ffffff']
    }
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Whisper',
    description: 'Nocturne serenity — regal violet, enchanted lilac, and periwinkle mist',
    previewColor: '#9d4edd',
    palette: {
      stems: ['#1e4438', '#2d6150', '#41826d', '#5da88e'],
      leaves: ['#16362c', '#225243', '#33735e', '#59a68a'],
      centerLily: ['#5a189a', '#7b2cbf', '#9d4edd', '#c77dff', '#e0aaff'], // Royal violet
      leftLily: ['#3c096c', '#5a189a', '#7209b7', '#b5179e', '#d883ff'],   // Deep midnight purple
      rightLily: ['#e2d9f3', '#d0c4df', '#ede7f6', '#f3e8ff', '#ffffff'],  // Periwinkle moon
      bottomLily: ['#8338ec', '#9381ff', '#b8b8ff', '#c084fc', '#d8b4fe'], // Electric lilac
      smallLily: ['#a855f7', '#c084fc', '#d8b4fe', '#f3e8ff', '#e9d5ff'],  // Soft lavender
      buds: ['#240046', '#3c096c', '#5a189a', '#c77dff'],                  // Midnight velvet buds
      anthers: '#e0aaff',
      dust: ['#c77dff', '#e0aaff', '#9d4edd', '#ffffff', '#e9d5ff']
    }
  },
  pastel: {
    id: 'pastel',
    name: 'Pastel Dream',
    description: 'Cotton candy fantasy — baby blue, macaron pink, and buttercup yellow',
    previewColor: '#70d6ff',
    palette: {
      stems: ['#3a7d65', '#52a385', '#6fc7a4', '#99e2c4'],
      leaves: ['#2a5e4c', '#3d836b', '#5cb595', '#8de0be'],
      centerLily: ['#ff99c8', '#fcf6bd', '#d0f4de', '#a9def9', '#e4c1f9'], // Rainbow pastel blend
      leftLily: ['#ff85a1', '#ff9ebb', '#ffb3c6', '#ffd6e0', '#ffffff'],   // Pastel pink
      rightLily: ['#70d6ff', '#85e3ff', '#a0ecff', '#cbf3f0', '#ffffff'],  // Powder sky blue
      bottomLily: ['#ffd166', '#ffe382', '#fff0b3', '#ffffff', '#ffdfba'], // Buttercup cream
      smallLily: ['#c77dff', '#d896ff', '#e5b3fe', '#f3d1fe', '#ffffff'],  // Pastel lilac
      buds: ['#ff70a6', '#70d6ff', '#ffd166', '#c77dff'],                  // Candy pastel buds
      anthers: '#fff9a6',
      dust: ['#ff99c8', '#a9def9', '#fcf6bd', '#d0f4de', '#ffffff']
    }
  }
};

