# Unlock Our Love – Extended Implementation Guide (Build-Ready)

This document converts the game design into an implementation spec you can hand to a developer and build as a **mobile-first web app**.

**Non-negotiable UX (exactly as specified):**

1. Intro screen → **Start the Journey**
2. Level 1: Word Puzzle → unlocks **Wedding Date**
3. Level 2: Tap Hearts → reveals **Venue, Time, Dress code, RSVP hint**
4. Level 3: Memory Game → unlocks final screen
5. Final Invitation screen → shows all details + **confetti**, **WhatsApp share**, **Replay**
6. **Background music toggle** (available globally or at least on all screens)
7. Optional personalized greeting: “Welcome, Rahul!”

Anything listed later as “Optional” is out-of-scope unless you intentionally enable it.

---

## Table of Contents
1. [Scope & Requirements](#scope--requirements)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Configuration Model](#configuration-model)
5. [State Model & Navigation](#state-model--navigation)
6. [Screen Specifications](#screen-specifications)
7. [Mini-Game Logic Details](#mini-game-logic-details)
8. [Visual, Motion, Audio](#visual-motion-audio)
9. [Share Links (WhatsApp)](#share-links-whatsapp)
10. [Accessibility & Mobile UX](#accessibility--mobile-ux)
11. [Performance & Reliability](#performance--reliability)
12. [Testing Strategy](#testing-strategy)
13. [Deployment](#deployment)
14. [Optional Add-ons](#optional-add-ons)

---

## Scope & Requirements

### Functional requirements
- Guests must complete 3 mini-games in order to reveal the final invitation.
- Progress is deterministic: Level 2 is locked until Level 1 complete; Level 3 locked until Level 2 complete; Final locked until Level 3 complete.
- Each mini-game must have clear completion criteria.
- Final screen must show:
  - Couple’s names
  - Date & Time
  - Venue
  - Dress code
  - RSVP link
  - Confetti animation
  - WhatsApp share button
  - Replay option

### Non-functional requirements
- Mobile-first (touch targets, safe areas, 1-hand use).
- Works offline after first load (optional but recommended via service worker).
- Fast: initial load should be lightweight; optimize images/audio.
- No guest data must be required to play.

### Privacy/safety assumptions
- RSVP link points to an external form/site (Google Form, Typeform, custom RSVP page, etc.).
- If personalization by name is used, it should be query-string based (e.g., `?name=Rahul`). Avoid storing personal data.

---

## Tech Stack

Recommended: **React + TypeScript + Vite** (small bundle, fast dev loop).

- UI: React
- Build: Vite
- Styling: CSS Modules or plain CSS (mobile-first)
- Animations: CSS keyframes (enough for hearts + flips); optional Framer Motion
- Audio: HTMLAudioElement (or Howler.js if you want better mobile handling)
- Confetti: `canvas-confetti` (small, reliable)

You can implement in Vue/Svelte similarly; the logic below stays the same.

---

## Project Structure

Suggested structure (React/Vite):

```
/
  public/
    assets/
      icons/              # rings, cake, flowers, hearts (SVG/PNG)
      images/             # backgrounds, couple photos (optional)
      audio/              # romantic tune (mp3/ogg)
  src/
    app/
      App.tsx
      routes.ts           # optional (can keep single-screen state too)
      state.ts            # game state + persistence
    config/
      invitation.config.ts
      invitation.config.schema.md
    screens/
      IntroScreen.tsx
      WordPuzzleScreen.tsx
      TapHeartsScreen.tsx
      MemoryGameScreen.tsx
      FinalInvitationScreen.tsx
    games/
      wordPuzzle/
        generator.ts
        types.ts
        validateSelection.ts
      tapHearts/
        types.ts
        spawn.ts
      memory/
        types.ts
        shuffle.ts
    ui/
      Button.tsx
      Card.tsx
      Modal.tsx           # only if you decide to reveal heart info in a modal
      MusicToggle.tsx
    utils/
      storage.ts
      clamp.ts
      random.ts
      share.ts
    styles/
      tokens.css
      global.css
```

Note: “Modal” is optional. A simple inline reveal card is also acceptable.

---

## Configuration Model

Create one config file that controls all editable invitation content.

### Example config (TypeScript)

```ts
export type InvitationConfig = {
  couple: {
    partner1: string;
    partner2: string;
  };
  event: {
    dateLabel: string;   // e.g., "12 Feb 2026"
    timeLabel: string;   // e.g., "6:30 PM"
    venueName: string;   // e.g., "The Grand Palace"
    venueAddress?: string;
    dressCode: string;   // e.g., "Pastel / Indian Festive"
    rsvpUrl: string;
  };
  wordPuzzle: {
    words: string[];     // e.g., ["PRIYA","ARJUN","LOVE","WEDDING"]
    gridSize: number;    // e.g., 10
    allowDiagonal: boolean;
  };
  tapHearts: {
    reveals: Array<{ key: "VENUE" | "TIME" | "DRESS" | "RSVP"; label: string; value: string }>;
  };
  memoryGame: {
    pairs: Array<{ id: string; iconPath: string; label: string }>;
  };
  share: {
    gameUrl: string;     // canonical URL to the game
  };
};
```

### Config constraints
- `wordPuzzle.words` should be uppercase A–Z only (or normalize on load).
- Keep puzzle words fairly short for a mobile grid.
- Ensure `tapHearts.reveals` is exactly 4 items to match the design.
- Memory pairs count should be even and fit comfortably on mobile (e.g., 6 pairs = 12 cards).

---

## State Model & Navigation

Avoid routing complexity: use a single-page app with a screen enum.

### Suggested state

```ts
type Screen = "INTRO" | "WORD" | "HEARTS" | "MEMORY" | "FINAL";

type Progress = {
  screen: Screen;
  musicEnabled: boolean;
  completed: {
    wordPuzzle: boolean;
    tapHearts: boolean;
    memory: boolean;
  };
};
```

### Persistence
- Store `Progress` in `localStorage` so guests can resume.
- “Replay” clears progress and returns to Intro.

---

## Screen Specifications

### 1) Intro Screen
**UI:**
- Title + short welcome text: “Play this fun game to reveal our wedding invitation!”
- Optional greeting: “Welcome, Rahul!” (from `?name=`)
- Primary button: **Start the Journey**
- Music toggle (icon/button)

**Action:** Start → go to Word Puzzle.

### 2) Level 1: Word Puzzle
**UI:**
- Letter grid
- List of target words (found words visually marked)
- Instruction: “Tap the first and last letter of each word.”

**Completion reward UI:**
- When all words found, reveal **wedding date** (use `config.event.dateLabel`) and advance to Hearts.

### 3) Level 2: Tap Hearts
**UI:**
- Floating hearts; tap to reveal one detail per heart.
- After tapping a heart, it becomes “used” (fade out / disappear) and the detail is shown.

**Completion:**
- All hearts tapped → proceed to Memory.

### 4) Level 3: Memory Game
**UI:**
- Grid of face-down cards
- Tap to flip; match pairs

**Completion:**
- All pairs matched → proceed to Final.

### 5) Final Invitation Screen
**UI:**
- Show all invitation details from config
- Confetti animation
- WhatsApp share button
- Replay button

---

## Mini-Game Logic Details

### Level 1: Word Puzzle (tap first + last letter)

#### Data structures

```ts
type Cell = { row: number; col: number; char: string };

type PlacedWord = {
  word: string;
  start: { row: number; col: number };
  end: { row: number; col: number };
  direction: { dr: number; dc: number };
};

type WordPuzzleState = {
  grid: string[][];
  placed: PlacedWord[];
  found: Set<string>;
  selection?: { start?: Cell; end?: Cell };
};
```

#### Placement algorithm (simple + reliable)
1. Normalize words: trim, uppercase, remove spaces.
2. For each word, attempt random placements up to N tries:
   - Choose direction from allowed set:
     - Horizontal: (0,1), (0,-1)
     - Vertical: (1,0), (-1,0)
     - Diagonal (optional): (1,1), (1,-1), (-1,1), (-1,-1)
   - Choose a start cell such that the end cell remains inside the grid.
   - Check collisions: allow overlap only when letters match.
3. If a word cannot be placed, increase grid size or re-run with a fresh grid.

#### Selection validation (start/end taps)
When user taps two cells:
1. Compute vector `(dr, dc)` from start→end.
2. Normalize to unit step (e.g., dr in {-1,0,1}, dc in {-1,0,1}).
3. Walk along the line and build string.
4. Match against target words in either direction.

Edge cases:
- If start=end, ignore.
- If taps are not aligned to a permitted direction, reject.
- If selected string isn’t a target or already found, reject.

#### Reward behavior
- Immediately mark word as found and highlight its path.
- When all words found: set `completed.wordPuzzle = true`, reveal date, advance.

### Level 2: Tap Hearts

#### Data structures

```ts
type HeartReveal = { id: string; label: string; value: string };

type Heart = {
  id: string;
  xPct: number;
  size: "S" | "M" | "L";
  reveal: HeartReveal;
  tapped: boolean;
};
```

#### Spawn/layout rules
- Spawn exactly 4 hearts (one per reveal).
- Distribute positions using percentages (e.g., 15–85% in X/Y) to support any device size.
- Ensure hearts don’t overlap too much (simple distance check in % space).

#### Interaction
- On tap: mark heart `tapped=true`, show reveal text, then fade heart.
- After all 4 tapped: set `completed.tapHearts = true` and advance.

Implementation options for showing the reveal:
- Inline “reveal card” that updates each tap (simplest)
- Modal (slightly heavier)

### Level 3: Memory Game

#### Data structures

```ts
type MemoryCard = {
  id: string;
  pairId: string;
  faceIconPath: string;
  faceLabel: string;
  state: "DOWN" | "UP" | "MATCHED";
};

type MemoryState = {
  cards: MemoryCard[];
  firstUpId?: string;
  secondUpId?: string;
  lock: boolean; // prevents third flip during comparison
};
```

#### Rules
- Tap flips a DOWN card to UP.
- When two cards are UP:
  - Lock input
  - If `pairId` matches: set both to MATCHED
  - Else: wait ~600–900ms then flip both DOWN
  - Unlock
- Completion: all cards MATCHED → set `completed.memory=true` and advance.

---

## Visual, Motion, Audio

### Colors & typography
- Use a pastel palette (pink/blush/ivory) with gold accents.
- Headings: elegant serif; body: clean sans-serif.

### Animations
- Floating hearts: CSS keyframes with slight drift + vertical movement.
- Memory cards: CSS 3D flip.
- Confetti on final: `canvas-confetti` burst on first entry to Final.

### Audio (music toggle)
- Provide a music toggle that:
  - Starts/stops background track
  - Remembers preference in localStorage

Mobile note: iOS requires user interaction before playing audio. The “Start the Journey” button can be used as the first interaction to start music if enabled.

---

## Share Links (WhatsApp)

WhatsApp share is typically just a `wa.me` link with encoded text.

### Message template

```
You're invited to {Partner1} & {Partner2}'s wedding!
Date: {Date} at {Time}
Venue: {Venue}
Dress code: {Dress}
RSVP: {RSVP}
Play our invitation game: {GameUrl}
```

### Link format
- `https://wa.me/?text=${encodeURIComponent(message)}`

---

## Accessibility & Mobile UX

- Touch targets: minimum 44×44 px.
- Avoid hover-only interactions.
- Add ARIA labels for:
  - Music toggle
  - Cards (Memory)
  - Hearts (Tap level)
- Provide readable contrast for text on pastel backgrounds.
- Support reduced motion where possible (`prefers-reduced-motion`) by reducing heart drift and confetti intensity.

---

## Performance & Reliability

- Use optimized SVG icons where possible.
- Preload only critical assets; lazy-load optional photos.
- Compress audio (and offer a short loop).
- Cache-bust builds and enable long-term caching for hashed assets.

---

## Testing Strategy

### Unit tests (logic)
- Word placement never writes outside grid.
- Word selection validation detects correct words in both directions.
- Memory matching logic handles lock/unlock correctly.

### E2E tests (Playwright/Cypress)
- Can complete each level and reach Final.
- Final screen shows all configured details.
- Replay resets progress.

---

## Deployment

Recommended: Vercel or Netlify.

- Set a canonical public URL for `config.share.gameUrl`.
- If using a custom domain, configure HTTPS.
- Ensure SPA fallback is enabled (all routes serve `index.html`) if you add routing.

---

## Optional Add-ons

Only implement these if you explicitly want them:

- QR code for RSVP (renders `config.event.rsvpUrl` as a QR)
- Countdown timer to wedding date
- Language toggle (English/Hinglish)
- Photo gallery or slideshow (display on Final screen)
- Analytics (privacy-respecting, optional)

---

## Implementation Checklist (Suggested Order)

1. Create config model and fill with your real details.
2. Build screen shell and global state + localStorage persistence.
3. Implement Word Puzzle generator + UI + completion reward.
4. Implement Tap Hearts animation + reveal + completion.
5. Implement Memory game logic + card UI + completion.
6. Implement Final screen + confetti + WhatsApp share + replay.
7. Add music toggle and verify mobile audio behavior.
8. Add tests, optimize assets, deploy.

