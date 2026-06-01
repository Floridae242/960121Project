# แป้งละออง — Home Page Redesign Spec
**Date:** 2026-05-31  
**Branch:** Tle  
**Status:** Approved for implementation

---

## Overview

Redesign the 960121Project home page (`/`) from dark-luxury to **White Minimalist / Apple-Core** aesthetic. The page becomes a full immersive scrollytelling experience: a sticky 3D scene anchors the viewport while content panels scroll past it, revealing features progressively. Booking flow, auth pages, and all other routes remain untouched.

---

## Visual Identity

| Token | Value |
|-------|-------|
| Background | `#F8F8FA` (near-white) |
| Surface | `#FFFFFF` |
| Dark / Navy | `#1A1A2E` |
| Accent / Red | `#FF3B5C` |
| Muted text | `#666666` |
| Border | `#E8E8E8` |
| Contact bg | `#1A1A2E` (dark panel) |

**Typography:**
- Display / headlines: `font-weight: 900`, `letter-spacing: -0.04em`, `line-height: 1`
- Body: `font-weight: 400`, `line-height: 1.7`, `color: #666`
- Labels / eyebrows: `font-weight: 700`, `letter-spacing: 0.3em`, `text-transform: uppercase`, `font-size: 10–11px`

---

## Architecture

### Files Changed
- `src/pages/Home.jsx` — complete rewrite; imports new section components
- `src/index.css` — add CSS custom properties for new palette tokens

### New Components (`src/components/`)
| File | Purpose |
|------|---------|
| `NavBar.jsx` | Sticky white nav: logo · links · Book Now CTA |
| `HeroSection.jsx` | **Rewrite** — white bg, headline left, interactive 3D globe right |
| `GlobeModel.jsx` | Three.js R3F wireframe globe: lat/lon grid, two orbital red rings, cursor-reactive tilt, slow auto-rotation |
| `FeaturesSection.jsx` | Sticky 3D container + three scrolling feature panels |
| `FeaturePanel.jsx` | Single feature panel: large number, eyebrow label, Thai headline, body copy |
| `WorkshopsSection.jsx` | White grid of workshop cards; fetches from existing API |
| `WorkshopCardWhite.jsx` | Minimal white card: category · title · chef · price · Book button |
| `ContactSection.jsx` | Dark navy two-column section: copy/social left, form right |

### Files Kept As-Is
- `FloatingCroissant.jsx`, `BakeryRoom3D.jsx`, `BakeryIcon3D.jsx` — not used in new home, not deleted
- `AllClasses.jsx`, `FilterBar.jsx`, `PopularClasses.jsx` — replaced by new `WorkshopsSection`, not deleted
- `BookingModal.jsx`, `ProtectedRoute.jsx`, `SeatBadge.jsx` — reused
- All pages under `src/pages/` except `Home.jsx`

---

## Section Specs

### ① NavBar
- `position: sticky; top: 0; z-index: 50`
- White bg + `backdrop-filter: blur(12px)` + bottom border `#E8E8E8`
- Left: logo "แป้งละออง" with red period
- Center: text links — Classes · Chefs · About (smooth-scroll anchors)
- Right: "Book Now" button — navy fill, white text
- On scroll > 20px: add subtle `box-shadow`

### ② Hero Section
- Full viewport height (`100vh`), background `#F8F8FA`
- Two-column flex layout (equal halves):
  - **Left:** eyebrow → h1 ("ศิลปะแห่งการนวดแป้ง") → subtitle → "Start Exploring ↓" CTA button
  - **Right:** `<GlobeModel />` canvas, fills the column
- Scroll indicator bottom-left: vertical `1px` line + "SCROLL" label
- "Drag to rotate" hint bottom-right of globe
- Entry animation: headline and CTA fade up with 100ms stagger (Framer Motion)

### ③ GlobeModel (Three.js)
Built with `@react-three/fiber` + `@react-three/drei`. Rendered in a transparent Canvas.

**Geometry:**
- Outer wireframe sphere: `SphereGeometry(2, 24, 16)` rendered as `<mesh>` with `MeshBasicMaterial wireframe`
- Latitude rings: 5 flat `TorusGeometry` rings at Y positions (−1.5, −0.75, 0, 0.75, 1.5), scaled to match sphere radius at each latitude
- Orbital accent rings: 2 `TorusGeometry` rings tilted 15° and 30° off equator, material color `#FF3B5C`, slightly larger diameter
- Red glowing core: `SphereGeometry(0.15)` with `MeshStandardMaterial` emissive `#FF3B5C`
- Orbiting dot: small sphere on a rotating parent group, traces equatorial path

**Interaction:**
- Auto-rotation: `useFrame` increments `rotation.y += 0.003` each frame
- Cursor tilt: `onPointerMove` on Canvas → map `(x, y)` to `rotation.x` and `rotation.y` offset (max ±15°), lerped with `THREE.MathUtils.lerp` for smooth follow
- `PresentationControls` from drei wraps the scene for drag-rotate with spring snap-back
- Lights: `ambientLight intensity={0.8}` + `directionalLight position={[5,8,5]}`

### ④ Features Section (Sticky Scrollytelling)

```
<section style="position:relative">
  {/* Globe rendered first — sticky, left half */}
  <div style="position:sticky; top:0; height:100vh; z-index:0; pointer-events:none">
    <GlobeCanvas />   ← left 50% of viewport
  </div>

  {/* Panels overlap the sticky div via negative top margin */}
  <div style="margin-top:-100vh">
    <FeaturePanel 01 />   ← height:100vh, content on RIGHT half only
    <FeaturePanel 02 />
    <FeaturePanel 03 />
  </div>
</section>
```

**Why this works:** The sticky globe is rendered first in the DOM at `height:100vh`. The panel wrapper immediately follows with `margin-top:-100vh`, pulling it up to overlap the sticky element. As the user scrolls, panels slide over the globe while it stays pinned. `z-index` on panels must be higher than the sticky globe (`z-index:1` panels, `z-index:0` globe).

**StickyGlobe:** same `<GlobeModel />` instance, smaller scale (0.6×), centered in viewport. As each panel scrolls into the center, a `useEffect` + `IntersectionObserver` detects which panel is active and tweens the camera/rotation to a preset angle:
- Panel 01 (Expert Instructors): globe rotates to show "Europe" quadrant, ring glows brighter
- Panel 02 (Small Groups): globe tilts slightly, dot orbits faster
- Panel 03 (Premium Equipment): globe rotates to show full equatorial band

**FeaturePanel layout:**
- `position:relative; z-index:1; height:100vh`
- Right half of screen only (`margin-left: 50%; padding: 80px 48px`)
- Semi-transparent white background so globe shows through on left
- Large ghost number (72px, `color:#E8E8F0`) → red eyebrow label → Thai headline → body copy
- Framer Motion `whileInView` fade-up for text

**Three feature panels:**
| # | Eyebrow (EN) | Thai Headline | Thai Body |
|---|---|---|---|
| 01 | Expert Instructors | เชฟมืออาชีพระดับโลก | เรียนรู้จากเชฟที่ผ่านการฝึกอบรมระดับนานาชาติ |
| 02 | Small Groups | กลุ่มเล็ก ใส่ใจทุกคน | ไม่เกิน 12 คนต่อคลาส เชฟดูแลใกล้ชิดทุกขั้นตอน |
| 03 | Premium Equipment | อุปกรณ์ระดับโปรเฟสชันนัล | เตาอบ อุปกรณ์ และวัตถุดิบชั้นเลิศพร้อมสำหรับคุณ |

### ⑤ Workshops Section
- White background, `padding: 100px 48px`, `id="classes-section"`
- Header: red eyebrow "Best Sellers" → large navy title "คลาสยอดนิยม"
- Grid: `display:grid; grid-template-columns: repeat(3,1fr); gap:2px` (hairline gaps)
- Data: fetches from existing `fetchWorkshops()` API, shows all workshops (not just top 3)
- Filter bar: horizontal category filter pills above grid (reuse `FilterBar.jsx` with new white styling)
- "Book Now" CTA on each card opens existing `BookingModal`

**WorkshopCardWhite layout:**
- White card with `1px solid #E8E8E8` border
- Top: colored pill badge (if tag exists) · category label · title · chef
- Bottom: price + "จองเลย" outline button
- Hover: `background: #F8F8FA`, border darkens slightly
- Full card — no image (clean minimal)

### ⑥ Contact Section
- Background `#1A1A2E`, `padding: 100px 48px`
- Two-column grid (50/50):
  - **Left:** red eyebrow → large white headline "พร้อมเริ่มทำขนมแล้วหรือยัง?" → subtitle → social icon row (Facebook · Instagram · YouTube · LINE)
  - **Right:** form with inputs (Name, Email, Phone optional, Message textarea) + "ส่งข้อความ →" red submit button
- Form: `onSubmit` sends to backend `POST /api/contact` (if endpoint exists) or shows toast "ส่งแล้ว ขอบคุณ!" via `react-hot-toast`
- Social icons: 40×40 bordered squares, hover turns red

### ⑦ Footer
- `background: #111827`, `padding: 28px 48px`
- Flex row: logo left · copyright right
- Single line, minimal

---

## Animations Summary

| Element | Animation | Library |
|---------|-----------|---------|
| Hero headline + CTA | Fade-up stagger (0ms, 100ms, 200ms, 300ms) | Framer Motion |
| Feature panels | `whileInView` fade-up | Framer Motion |
| Workshop cards | `whileInView` stagger fade-up | Framer Motion |
| Globe auto-rotation | `useFrame` delta rotation | R3F |
| Globe cursor tilt | `onPointerMove` lerp | R3F / vanilla |
| Globe camera per-panel | `IntersectionObserver` → tween | vanilla JS |
| Nav shadow on scroll | `onScroll` listener | vanilla JS |
| Contact form submit | Toast notification | react-hot-toast |

---

## Scroll Performance Notes
- Globe canvas uses `frameloop="demand"` when not in hero (reduces GPU load while scrolling)
- Feature section uses `will-change: transform` on panels
- `IntersectionObserver` threshold `0.5` for panel detection
- No `scroll` event listeners — use IO everywhere possible

---

## Out of Scope
- Login / Register / ForgotPassword / ResetPassword pages — unchanged
- Booking page — unchanged
- Backend API changes — none required
- Mobile-specific layout — responsive but not a separate design
- Dark mode — not supported in this redesign
