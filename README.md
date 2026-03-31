# text-to-handwriting

A client-side tool that converts typed text into handwriting-style rendered A4 pages with PNG/PDF export. No server, no signup, no data leaves the browser.

**Live:** [https://text-to-handwriting-jet.vercel.app/]

---

## Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + Vite 7 |
| State | Zustand 5 (slice pattern) |
| Styling | Tailwind CSS 4 |
| Persistence | IndexedDB (pages, fonts) + localStorage (settings) |
| Export | html2canvas + jsPDF |
| Build output | Single self-contained HTML file (`vite-plugin-singlefile`) |

---

## Getting Started

```bash
git clone https://github.com/SatvikHGupta/text-to-handwriting
cd text-to-handwriting
npm install
npm run dev
```

```bash
npm run build    # outputs dist/index.html (single file, fully portable)
npm run preview  # preview the production build locally
```

---

## Project Structure

```
src/
├── store.js                  # Zustand root - merges all slices
├── store/
│   ├── defaults.js           # A4 dims + all default setting values
│   ├── settingsSlice.js      # Visual settings + noise seed
│   ├── pagesSlice.js         # Page CRUD + IDB sync
│   ├── fontsSlice.js         # Font registry (builtin / local / custom)
│   ├── drawingSlice.js       # Active drawing tool state
│   └── uiSlice.js            # Dark mode, zoom, modals, mobile tab
├── utils/
│   ├── noise.js              # Murmur3 PRNG - seeded per-line/word noise
│   ├── paper.js              # Tag parser, paper background CSS, content padding
│   ├── fonts.js              # Font registration + @font-face injection
│   ├── idb.js                # IndexedDB wrapper (pages / meta / fonts stores)
│   ├── canvasOps.js          # Pure canvas drawing primitives
│   └── export/
│       ├── capture.js        # html2canvas capture (zoom reset + font wait)
│       ├── download.js       # PNG/PDF single + multi-page download
│       └── filename.js       # Export filename builder
├── hooks/
│   ├── useBreakpoint.js      # mobile / tablet / desktop detection
│   ├── useExport.js          # Export flow state machine
│   ├── useDrawingCanvas.js   # Canvas draw + undo/redo + persistence
│   └── useFontUpload.js      # Font file validation + IDB save
└── components/
    ├── page/                 # Rendering engine (HandwritingPage, InkLayer, LineRenderer, MarginOverlays)
    ├── sidebar/              # Setting sections (Font, Ink, Line, Word, Letter, Paper, Margins)
    └── modals/               # Export, FontPicker, Help, ColorTags
```

---

## How the Rendering Works

Text goes through this pipeline on every keystroke:

```
raw text
  → parseText()          splits into lines → segments (by <tag>) → words
  → InkLayer             maps lines to LineRenderer components
  → computeLineNoise()   per-line slope / spacing / font-size variation
  → computeWordNoise()   per-word baseline / rotation / spacing variation
  → CSS inline styles    final handwriting render
```

Noise is deterministic - same seed always produces the same visual output, so the page doesn't jitter on re-render. Uses a Murmur3 finalizer hash (replaced `Math.sin()` which caused visible periodic patterns).

The page has explicit z-index layers:

```
z=0  paper lines (lined / grid background)
z=1  ink layer (text)
z=2  margin overlays (text in margin areas)
z=5  drawing canvas (freehand on top)
```

---

## Inline Text Styling (Tag System)

Users can style text inline using short tags:

```
<bl>blue text</bl>
<r>red text</r>
<f18>font size 18</f18>
```

Full color map is in `utils/paper.js → COLOR_TAG_MAP`. Font size tags follow `<fN>` where N is any integer.

---

## Adding Local Fonts

Drop any `.ttf / .otf / .woff / .woff2` file into `/public/fonts/`. Vite picks it up automatically at build time via:

```js
import.meta.glob('/public/fonts/*.{ttf,otf,woff,woff2}', { eager: true, as: 'url' })
```

No code changes needed. The font name is derived from the filename (`my-font.ttf` → `My Font`).

---

## Persistence Model

| Data | Storage | Key |
|---|---|---|
| Settings, zoom, dark mode | localStorage | `handwriting-settings` |
| Page text + drawings | IndexedDB | `pages` store, keyed by UUID |
| Page order + current index | IndexedDB | `meta` store, key `notebook` |
| Custom uploaded fonts | IndexedDB | `fonts` store, keyed by name |

Pages and fonts are loaded from IDB on mount via `loadFromDB()` in `store.js`.

---

## Export Pipeline

1. User opens Export modal → `useExport` hook manages state
2. For each page: switch to it → wait 400ms for React render → `captureElement()`
3. `captureElement()`: waits for fonts, resets CSS zoom to 1, runs html2canvas at 3× scale, restores zoom
4. Canvas → `toDataURL('image/png')` → download, or → jsPDF → `.save()`
5. Multi-page PDF: pages added sequentially to one jsPDF doc
6. Filename format: `FontName.hndtotxt[pageNum].ext`

---

## State Architecture

```js
useStore = create(persist(
  settingsSlice + pagesSlice + fontsSlice + drawingSlice + uiSlice
))
```

- `persist()` selectively saves to localStorage via `partialize` (settings + UI prefs only)
- Pages and fonts go to IndexedDB manually (too large / binary for localStorage)
- All slices are flat - no nested state

---

## Responsive Layouts

| Breakpoint | Layout |
|---|---|
| `< 640px` (mobile) | Full-screen tab panels: Page / Text / Settings. Bottom tab bar. |
| `640–1023px` (tablet) | Canvas fills width. Sidebar overlays on open. Compact text editor. |
| `≥ 1024px` (desktop) | Classic 3-panel: Sidebar \| Canvas \| TextEditor |

Zoom auto-fits the page to screen width on mobile/tablet on mount.

---

## Key Constraints

- Max 30 pages (`MAX_PAGES` in `pagesSlice.js`)
- Max undo history: 30 snapshots per session (`MAX_UNDO` in `useDrawingCanvas.js`)
- Supported font upload formats: `.ttf .otf .woff .woff2`
- Export scale: 3× (2382×3369px for A4) - hardcoded in `capture.js`
- Grid cell size: 102.5px - hardcoded in `paper.js`

---

## Author

**Satvik Hemant Gupta** - [github.com/SatvikHGupta](https://github.com/SatvikHGupta)


## DO Not Sue me

I just searched free .ttf files and surfed around few websites then downloaded the fonts which I liked. Do NOT SUE ME for this, I used what I saw and was provided.