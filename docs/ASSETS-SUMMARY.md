# Downloaded Assets Summary

All assets have been successfully downloaded to `public/assets/`.

## ✅ Fonts (11 files)
**Location:** `public/assets/fonts/`

- **Playfair Display** (elegant serif for headings) - weights: 400, 600, 700
- **Inter** (clean sans-serif for body text) - weights: 300, 400, 600
- All fonts downloaded as `.woff2` (modern, compressed format)
- Import via: `<link rel="stylesheet" href="/assets/fonts/fonts.css">`

**License:** SIL Open Font License (OFL) - free for commercial use

---

## ✅ Icons (6 SVG files)
**Location:** `public/assets/icons/`

Memory game icons (use `currentColor` for easy theming):
- `heart.svg` - For Tap Hearts game (scales to any size)
- `rings.svg` - Wedding rings
- `cake.svg` - Wedding cake
- `flowers.svg` - Floral bouquet
- `toast.svg` - Champagne glasses
- `invitation.svg` - Invitation card

All SVG files are original, accessible (ARIA labels), and editable.

---

## ✅ Visual Decorations (4 SVG files)
**Location:** `public/assets/images/`

- `background-pattern.svg` - Soft repeating pattern for app background
- `floral-corner.svg` - Bottom-left corner decoration
- `floral-corner-tl.svg` - Top-left corner
- `floral-corner-tr.svg` - Top-right corner
- `floral-corner-br.svg` - Bottom-right corner

---

## ✅ Audio (1 file)
**Location:** `public/assets/audio/`

- `romantic-bg.mp3` - Background music track (royalty-free)

**License:** Free for commercial use (Bensound)

---

## ✅ Photos (2 placeholder images)
**Location:** `public/assets/images/`

- `couple-1.jpg` - Placeholder wedding photo (800px wide)
- `couple-2.jpg` - Placeholder romantic photo (800px wide)

**License:** Unsplash License (free, no attribution required)

⚠️ **Action Required:** Replace these placeholder images with your actual couple photos before deployment.

---

## 📝 Still Needed (Your Content)

Edit these in your config file:

1. **Word Puzzle:** Final word list (couple names + keywords)
2. **Wedding Details:**
   - Couple names
   - Date & time
   - Venue name & address
   - Dress code
   - RSVP link/URL

---

## How to Use Assets

### In HTML:
```html
<!-- Fonts -->
<link rel="stylesheet" href="/assets/fonts/fonts.css">

<!-- Icons -->
<img src="/assets/icons/heart.svg" alt="Heart" width="64" height="64">

<!-- Background -->
<div style="background-image: url(/assets/images/background-pattern.svg)"></div>
```

### In CSS:
```css
body {
  font-family: 'Inter', sans-serif;
  background: url(/assets/images/background-pattern.svg);
}

h1 {
  font-family: 'Playfair Display', serif;
}
```

### In React/JS:
```jsx
import heartIcon from '/assets/icons/heart.svg';
import couplePhoto from '/assets/images/couple-1.jpg';

<img src={heartIcon} alt="Heart" />
```

---

## Re-run Downloads

If you need to re-download or update assets:

```powershell
.\download-assets.ps1
```

The script will overwrite existing files with fresh downloads.
