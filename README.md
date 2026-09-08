<img width="1876" height="944" alt="image" src="https://github.com/user-attachments/assets/2eee9376-ff72-448f-afd2-5ddc64d4ce1f" />


# Implementation Plan: Calendo – One Photo a Day Calendar App

Calendo is a frictionless, tactile, local-first "one photo a day" visual diary and calendar. Built with modern web technologies (Vite + React + Lucide Icons + Tailwind-free custom CSS design system), it delivers instant gratification with zero sign-up friction, tactile interactions (slide-to-unlock, pinch/switch between month & year matrix), photo capture & editing filters, and secure IndexedDB storage.

---


## User Review Required

> [!IMPORTANT]
> **Key Architecture Decisions:**
> 1. **Default Zero-Friction vs Optional Auth**: Calendo opens straight into local-first mode (guest mode stored securely in browser IndexedDB). A sleek Account / Auth modal is available anytime to link an email/password or create an account for cloud backup sync.
> 2. **Unlock Screen**: Features the tactile "Slide to Unlock" slider + optional Biometrics/PIN toggle. Can be toggled on/off in Settings.
> 3. **Photo Storage**: High-resolution photos & compressed thumbnails are stored locally using browser IndexedDB with instant retrieval, memory safety, and export/backup tools (ZIP/JSON export).

---

## Core Features & Screens

### 1. Tactile Unlock Screen (Entry Point)
- Minimalist lock screen with current time, date, subtle ambient background preview, and custom smooth **"Slide to Unlock"** gesture slider.
- Optional Biometric / PIN / Password unlock toggleable from Settings.
- Quick bypass / remember unlock state for rapid access.

### 2. Main Calendar & Gallery Grid (Monthly View)
- 7-column calendar grid (Mon-Sun or Sun-Sat configurable).
- Filled days render the day's high-res photo thumbnail, subtle mood badge, and photo indicator.
- Empty days display a faint date stamp and a soft `+` button with hover glow to encourage daily capture.
- Active highlighted border on the current date (e.g., September 7, 2026).
- Top navigation bar with Month/Year dropdown selector (e.g., `September 2026 ▾`), prev/next month swipe & controls, streak counter (e.g. 🔥 14 Days), View Mode switcher (Month Grid, 12-Month Year Matrix, Timeline Feed).

### 3. Day Detail & Photo Capture Modal
- **Capture Bottom Sheet / Modal**:
  - Live device camera capture with flash/flip toggle.
  - Photo library upload & drag-and-drop.
  - Preset aesthetic sample photos for quick testing & instant delight.
- **Full-Screen Day Detail View**:
  - High-res photo viewer with zoom & pan.
  - Date stamp, location tag, weather/mood emoji, and rich journal caption/note.
  - **Integrated Photo Studio**:
    - Preset filters (Natural, Vintage Film, Warm Sunset, Noir B&W, Vivid, Muted Polaroid).
    - Crop / Rotate / Aspect ratio adjuster (1:1 Square, 4:5 Portrait, Original).
    - Adjustments (Brightness, Contrast, Saturation, Vignette).
  - Action toolbar: Replace photo, Download/Share card, Delete, and Left/Right navigation between days.

### 4. Year Matrix (12-Month Bird's-Eye Macro View)
- Interactive 12-month bird's-eye view presenting the entire year as a vibrant photo mosaic.
- Hover tooltips and instant click-to-zoom into any specific day or month.
- Year completion stats & streak overview.

### 5. Settings, Storage & Auth
- **Optional Email & Password Auth**: Local-first by default; users can sign up / log in to enable cloud sync simulation or multi-device export.
- **Data Privacy & Backup**: IndexedDB storage for unlimited photos offline, Export All (ZIP archive + JSON diary export), Import backup, Clear data.
- **Customization**: Theme switcher (Dark Velvet, Warm Sand, Clean Minimalist, Coral Dusk matching the Calendo logo), Lock screen toggle, First day of week preference.

---

## Proposed Changes

### Project Setup
- Setup a blazing-fast React 18 + Vite app with TypeScript and modern vanilla CSS design system.
- Lucide React icons, Canvas-based image processing, `idb-keyval` / Dexie-style IndexedDB storage wrapper.

### File Structure Plan

#### [NEW] [package.json](file:///c:/Users/user/Desktop/itooday/package.json)
#### [NEW] [index.html](file:///c:/Users/user/Desktop/itooday/index.html)
#### [NEW] [src/main.tsx](file:///c:/Users/user/Desktop/itooday/src/main.tsx)
#### [NEW] [src/App.tsx](file:///c:/Users/user/Desktop/itooday/src/App.tsx)
#### [NEW] [src/index.css](file:///c:/Users/user/Desktop/itooday/src/index.css) - Premium design system (coral & dark velvet palette, glassmorphism, animations)
#### [NEW] [src/types/index.ts](file:///c:/Users/user/Desktop/itooday/src/types/index.ts) - Diary entry, photo, user & filter interfaces
#### [NEW] [src/services/storage.ts](file:///c:/Users/user/Desktop/itooday/src/services/storage.ts) - IndexedDB persistence & backup exports
#### [NEW] [src/services/sampleData.ts](file:///c:/Users/user/Desktop/itooday/src/services/sampleData.ts) - Preloaded visual memories for instant visual gratification
#### [NEW] [src/components/LockScreen.tsx](file:///c:/Users/user/Desktop/itooday/src/components/LockScreen.tsx) - Tactile Slide-to-Unlock screen
#### [NEW] [src/components/CalendarGrid.tsx](file:///c:/Users/user/Desktop/itooday/src/components/CalendarGrid.tsx) - 7-column monthly visual grid
#### [NEW] [src/components/YearMatrix.tsx](file:///c:/Users/user/Desktop/itooday/src/components/YearMatrix.tsx) - 12-month bird's-eye photo mosaic
#### [NEW] [src/components/DayDetailModal.tsx](file:///c:/Users/user/Desktop/itooday/src/components/DayDetailModal.tsx) - Fullscreen view & photo studio editor
#### [NEW] [src/components/CaptureModal.tsx](file:///c:/Users/user/Desktop/itooday/src/components/CaptureModal.tsx) - Bottom sheet camera/upload capture
#### [NEW] [src/components/TimelineFeed.tsx](file:///c:/Users/user/Desktop/itooday/src/components/TimelineFeed.tsx) - Continuous scroll photo diary feed
#### [NEW] [src/components/AuthModal.tsx](file:///c:/Users/user/Desktop/itooday/src/components/AuthModal.tsx) - Email & password login/signup modal
#### [NEW] [src/components/SettingsModal.tsx](file:///c:/Users/user/Desktop/itooday/src/components/SettingsModal.tsx) - Privacy, backup, theme & lock settings
#### [NEW] [src/components/Header.tsx](file:///c:/Users/user/Desktop/itooday/src/components/Header.tsx) - Top bar with month picker & view switches

---

## Verification Plan

### Automated Verification
- Run `npm run build` or Vite typecheck to ensure zero compilation or bundling errors.

### Interactive Browser Verification
- Launch local dev server with `npm run dev`.
- Use browser testing to verify:
  1. Slide-to-unlock gesture unlocks into the calendar grid smoothly.
  2. 7-column month grid displays photos, empty slots with `+`, and highlights today's date.
  3. Uploading / capturing a photo saves to IndexedDB and updates the grid immediately.
  4. Photo studio filters, crop, and caption editing work seamlessly.
  5. Switching to Year Matrix presents the 12-month mosaic.
  6. Email & password authentication / guest mode toggle works cleanly.
