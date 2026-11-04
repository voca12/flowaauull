# 🌸 Happy Birthday! A Living Digital Gift

A personal, handcrafted interactive birthday gift website built with **React**, **TypeScript**, **Vite**, **HTML5 Canvas**, and **Tailwind CSS**.

Designed to be hosted entirely on **GitHub Pages** with zero backend required.

---

## 📖 Highlights & Features

### PAGE 1 — PIXEL ART MEMORY BOOK
- **Interactive Book Cover:** Starts closed with retro pixel-art vintage leather texture, golden filigree corners, ribbon bookmark, and heart clasp. Clicking opens the diary with realistic page-turn sound effects.
- **Two-Page Diary Navigation:** Flip through 8 full pages of memories with smooth spread transitions.
- **Editable Birthday Messages:** Click any title, letter, caption, or milestone to personalize the text inline with automatic persistence.
- **Scrapbook Photo Gallery:**
  - Real photo uploader that compresses and stores photos locally via **IndexedDB** (persists across page reloads).
  - Polaroid scrapbook frames with decorative washi tape, stamps, and playful rotation angles.
  - Editable captions and dates for every photo.
  - Delete or re-upload memories anytime.
- **Interactive Love Milestones & Checklists:** Checkable pixel hearts for things you adore about her and future bucket list dreams.
- **Secret Garden Portal:** Final page features an enchanted glowing button that triggers celebration confetti and reveals the ASCII flower garden!

---

### PAGE 2 — ASCII / SCANLINE PARTICLE FLOWER BOUQUET
Recreated faithfully from the reference video:
- **Exact Composition:** Pitch-black background with the iconic headline:
  > *"Who needs flowers when you can code them?"*
  in refined serif typography (`Playfair Display`).
- **Scanline & Particle Rendering:** Every petal, stem, leaf, and bud is procedurally rasterized from horizontal luminous scanlines with micro-ASCII particle highlights and glowing stamens.
- **Sequential Growth Sequence:**
  1. Complete black screen.
  2. Slender green stems emerge from the bottom and climb upward.
  3. Arched lily foliage develops along the base.
  4. Oval flower buds form at stem terminals.
  5. Buds swell and sequentially unfurl their 6 petals outward in 3D perspective.
  6. Ambient floating glowing dust particles drift softly around the bouquet.
- **5 Color Themes (with instant recoloring):**
  1. **Classic Garden** — Crimson, magenta, silver-white, peach coral, and amber gold.
  2. **Romantic Pink** — Blush, peony, ballerina pink, and deep rose.
  3. **Sunset Radiance** — Fiery orange, ruby red, and honey gold.
  4. **Lavender Whisper** — Royal violet, lilac mist, and periwinkle.
  5. **Pastel Dream** — Macaron pink, baby blue, and buttercup yellow.
- **Interactive Controls:**
  - Play / Pause / Replay / Reset animation.
  - Click anywhere on the canvas to trigger bloom sparkles.
  - Romantic Love Note modal card with personal message and confetti.
  - Seamless navigation back to the Memory Diary.

---

### 🎵 BUILT-IN WEB AUDIO SYNTHESIZER
- Zero external audio files or network dependencies.
- Synthesizes a soothing, gentle music-box lullaby melody in real time.
- Crisp procedural sound effects: paper page turns, pixel button clicks, and chime bloom sparkles.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to GitHub.
2. In your repository settings on GitHub:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Push to `main` branch or trigger the workflow under **Actions** > **Deploy to GitHub Pages**.
4. Your website will be live in seconds at `https://<username>.github.io/<repo-name>/`!
