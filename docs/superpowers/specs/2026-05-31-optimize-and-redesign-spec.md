# แป้งละออง — Optimize & Redesign Remaining Pages Spec
**Date:** 2026-05-31  
**Branch:** Tle  
**Status:** Approved for implementation

---

## Overview

Two-part work:
1. **Performance & cleanup** — remove dead components, eliminate per-card WebGL canvas jank by swapping BakeryIcon3D for static `shaded.png` renders.
2. **Page redesigns** — restyle AuthLayout, Login, Register, ForgotPassword, ResetPassword, and Booking to match the white-minimalist palette (`#F8F8FA` / `#1A1A2E` / `#FF3B5C`). All existing logic stays untouched.

---

## Visual Identity (inherited from home redesign)

| Token | Value |
|-------|-------|
| `--wm-bg` | `#F8F8FA` |
| `--wm-surface` | `#FFFFFF` |
| `--wm-navy` | `#1A1A2E` |
| `--wm-red` | `#FF3B5C` |
| `--wm-muted` | `#666666` |
| `--wm-border` | `#E8E8E8` |

These are already in `src/index.css`. No new tokens needed.

---

## Part 1 — Performance & Cleanup

### 1A. Copy shaded.png renders into public

Copy from Downloads into project so they're served statically:

| Source | Destination |
|--------|-------------|
| `~/Downloads/Floating 3D Bakery Elements (Best for Feature Cards : Categories)/The Croissant Icon/shaded.png` | `public/models/croissant/shaded.png` |
| `~/Downloads/Floating 3D Bakery Elements (Best for Feature Cards : Categories)/Pink Glazed Donut Icon/shaded.png` | `public/models/donut/shaded.png` |
| `~/Downloads/Floating 3D Bakery Elements (Best for Feature Cards : Categories)/Colorful Macarons Icon/shaded.png` | `public/models/macaron/shaded.png` |
| `~/Downloads/Floating 3D Bakery Elements (Best for Feature Cards : Categories)/Sourdough Bread Icon/shaded.png` | `public/models/bread/shaded.png` |

### 1B. Update WorkshopCardWhite — replace BakeryIcon3D canvas with static img

Remove `import BakeryIcon3D` and `import { Suspense }` from `WorkshopCardWhite.jsx`.

Replace the 3D icon overlay with:
```jsx
const EMOJI_TO_SHADED = {
  "🥐": "/models/croissant/shaded.png",
  "🍩": "/models/donut/shaded.png",
  "🎂": "/models/macaron/shaded.png",
  "🍞": "/models/bread/shaded.png",
  "🧁": "/models/macaron/shaded.png",
};

// In JSX — inside the image overlay div, replace BakeryIcon3D:
{workshop.emoji && EMOJI_TO_SHADED[workshop.emoji] && (
  <img
    src={EMOJI_TO_SHADED[workshop.emoji]}
    alt=""
    style={{
      position: "absolute", top: "8px", right: "8px",
      width: "72px", height: "72px",
      objectFit: "contain",
      filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))",
      pointerEvents: "none",
    }}
  />
)}
```

### 1C. Delete dead components

These files are imported nowhere — delete all of them:

- `src/components/FloatingCroissant.jsx`
- `src/components/AllClasses.jsx`
- `src/components/PopularClasses.jsx`
- `src/components/WorkshopCard.jsx`
- `src/components/FilterBar.jsx`
- `src/components/GlobeModel.jsx`
- `src/components/SeatBadge.jsx`

Verify with `npm run build` after deletion — no import errors expected.

---

## Part 2 — AuthLayout Redesign

### File: `src/components/AuthLayout.jsx`

Complete rewrite. Two-column split layout.

**Structure:**
```
<main> (full height, white bg)
  <div class="two-col"> (flex row on md+, single col on mobile)
    <!-- Left panel: navy bg, branding + static bakery image -->
    <div class="left-panel"> (flex:1, hidden on mobile, navy bg)
      - Logo "แป้งละออง." (white text, red period)
      - Tagline (white/50 text)
      - Decorative <img src="/models/room/shaded.png"> (opacity 0.85, bottom-right positioned)
        Note: Copy shaded.png from ~/Downloads/The 3D Isometric Bakery Room... to public/models/room/shaded.png
    </div>

    <!-- Right panel: light bg, scrollable form area -->
    <div class="right-panel"> (flex:1, wm-bg, flex col, justify center, min-height 100vh)
      - Back link "← แป้งละออง." (navy, top-left, visible on mobile only via logo)
      - Centered card (max-w 400px, white surface, 40px padding, border wm-border)
        - Title (navy, 28px, font-weight 800)
        - Subtitle (muted, 14px)
        - {children} — form content
        - {footer} — footer links
    </div>
  </div>
</main>
```

**Input styling** (applied via className on existing Radix/shadcn Input components):
- Override with inline style or className: border `#E8E8E8`, focus border `#1A1A2E`, height 48px, font-size 14px
- Labels: navy, font-weight 600, 12px, letter-spacing 0.04em, uppercase

**Button styling:**
- Primary submit: background `#1A1A2E`, white text, no border-radius (square), full width, 48px height, uppercase tracking
- Hover: `#2d2d4e`

**Links** (footer area): `color: var(--wm-red)`, no underline by default, underline on hover

**Copy shaded.png for room:**  
`~/Downloads/The 3D Isometric Bakery Room (Best for Hero Section)/shaded.png` → `public/models/room/shaded.png`

---

## Part 3 — Booking Page Redesign

### File: `src/pages/Booking.jsx`

**Keep all existing state, logic, API calls, and JSX structure exactly as-is.** Only change styling (className strings and inline styles). No new components.

#### Header bar
- Background: `#fff`, border-bottom: `1px solid #E8E8E8`
- Back arrow + "กลับ": `color: var(--wm-navy)`, hover: `var(--wm-red)`
- Title "จองคลาส": navy, font-weight 800

#### Page background
- `background: var(--wm-bg)` replacing dark/amber bg

#### Workshop selection cards
- Background: `#fff`, border: `1px solid #E8E8E8`
- Selected state: border `#1A1A2E`, background `#F8F8FA`
- Title: navy, category: red uppercase label, chef: muted
- Remove all `amber-*` and `orange-*` Tailwind classes

#### Slot selection buttons
- Unselected: border `#E8E8E8`, text `#666`, background transparent
- Selected: border `#1A1A2E`, background `#1A1A2E`, text white
- Full/unavailable: border `#ddd`, text `#bbb`, cursor-not-allowed

#### Seat grid
- Available seats: border `#1A1A2E`, background white, navy text
- Selected seats: background `#1A1A2E`, text white
- Booked seats: background `#E8E8E8`, text `#bbb`, cursor-not-allowed
- Legend labels: navy/muted/red consistent with palette

#### Name/phone form
- Input border: `#E8E8E8`, focus: `#1A1A2E` outline
- Labels: navy, 12px uppercase tracking
- Submit button: `background: #1A1A2E`, white text, full width, 48px

#### Confirmation screen
- White card, navy checkmark icon (or green — keep existing CheckCircle2)
- Booking ID: red accent
- "จองสำเร็จ!" headline: navy
- Back-to-home button: navy outline → filled hover

#### Booking.jsx — remove these Tailwind classes (replace inline):
Replace all `amber-*`, `orange-*`, `yellow-*` color utilities with inline styles using `--wm-*` tokens.

---

## Files Changed

| Action | File |
|--------|------|
| Copy | `public/models/croissant/shaded.png` (from Downloads) |
| Copy | `public/models/donut/shaded.png` |
| Copy | `public/models/macaron/shaded.png` |
| Copy | `public/models/bread/shaded.png` |
| Copy | `public/models/room/shaded.png` |
| Modify | `src/components/WorkshopCardWhite.jsx` |
| Delete | `src/components/FloatingCroissant.jsx` |
| Delete | `src/components/AllClasses.jsx` |
| Delete | `src/components/PopularClasses.jsx` |
| Delete | `src/components/WorkshopCard.jsx` |
| Delete | `src/components/FilterBar.jsx` |
| Delete | `src/components/GlobeModel.jsx` |
| Delete | `src/components/SeatBadge.jsx` |
| Rewrite | `src/components/AuthLayout.jsx` |
| Restyle | `src/pages/Booking.jsx` (logic unchanged) |

---

## Out of Scope
- Login.jsx / Register.jsx / ForgotPassword.jsx / ResetPassword.jsx — their styling comes entirely from AuthLayout; no changes needed to these files individually.
- Backend API changes — none.
- Booking.jsx logic — untouched (workshop fetch, slot select, seat pick, form submit, confirmation state).
- BakeryIcon3D.jsx — kept (still used in BakeryRoom context if needed); just not imported in WorkshopCardWhite.
