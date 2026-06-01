---
name: แป้งละออง — Pang-La-Ong
description: Warm artisan baking-workshop brand — editorial composition on a cream/caramel/espresso palette.
colors:
  caramel-crust: "#C08552"
  dark-espresso: "#4B2E2B"
  toasted-cocoa: "#8C5A3C"
  warm-cream: "#FFF8F0"
  bleached-flour: "#FFFFFF"
  pastry-edge: "#E8D5C4"
  burnt-sugar: "#3A2220"
typography:
  display:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "clamp(52px, 7.5vw, 96px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "clamp(36px, 5vw, 64px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'DM Sans', system-ui, sans-serif"
    fontSize: "clamp(15px, 1.3vw, 17px)"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "'DM Sans', system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.35em"
rounded:
  none: "0px"
  pill: "999px"
spacing:
  gutter: "clamp(20px, 5vw, 64px)"
  section: "clamp(64px, 10vw, 120px)"
components:
  button-primary:
    backgroundColor: "{colors.dark-espresso}"
    textColor: "{colors.warm-cream}"
    rounded: "{rounded.none}"
    padding: "16px 40px"
  button-primary-hover:
    backgroundColor: "{colors.caramel-crust}"
    textColor: "{colors.warm-cream}"
  button-outline:
    backgroundColor: "{colors.warm-cream}"
    textColor: "{colors.dark-espresso}"
    rounded: "{rounded.none}"
    padding: "16px 40px"
  chip-active:
    backgroundColor: "{colors.dark-espresso}"
    textColor: "{colors.bleached-flour}"
    rounded: "{rounded.none}"
    padding: "8px 20px"
  card:
    backgroundColor: "{colors.bleached-flour}"
    textColor: "{colors.dark-espresso}"
    rounded: "{rounded.none}"
    padding: "40px 36px"
  input:
    backgroundColor: "{colors.bleached-flour}"
    textColor: "{colors.dark-espresso}"
    rounded: "{rounded.none}"
    padding: "0 16px"
---

# Design System: แป้งละออง — Pang-La-Ong

## 1. Overview

**Creative North Star: "The Sunlit Bakehouse"**

This is the visual language of a warm, sunlit baking atelier rendered with the discipline of an editorial magazine. Everything sits on a soft Warm Cream ground (#FFF8F0), the color of proofing linen and morning light, so the surface itself feels like flour-dusted parchment rather than a screen. Hierarchy is carried by **scale contrast and composition**, not by boxes: a large Playfair display headline splits across lines with one word set in caramel italic, an eyebrow label in wide-tracked uppercase floats above it, and generous negative space lets each section breathe. The mood is inviting and crafted — premium enough to justify the price, never cold or exclusive.

The system rejects the generic. There are **no default card grids with uniform shadows, no centered hero with a gradient blob, no Tailwind-starter sterility**. Depth comes from warm atmosphere — a faint grain texture, soft espresso-tinted shadows that appear only on hover, and decorative caramel radial glows — not from heavy elevation. Color is used semantically along a strict 60-30-10 rhythm: cream dominates, caramel is the recurring accent, espresso is the rare deep punctuation (the Contact block, the footer, primary buttons at rest).

**Key Characteristics:**
- Editorial composition: scale contrast, asymmetry, wide-tracked eyebrow labels, split display headlines
- Warm, flour-and-caramel palette on a parchment-cream ground — warmth is identity, not decoration
- Sharp corners everywhere (0px radius); the crispness reads as editorial, not soft-SaaS
- Flat at rest, shadows only as a hover response; atmosphere from grain + caramel glows
- Playfair Display (with italic accents) paired with DM Sans for calm, readable Thai-first body

## 2. Colors

A warm, edible palette: parchment cream, caramelized crust, and dark espresso, with cocoa and pastry-edge neutrals between them.

### Primary
- **Caramel Crust** (#C08552): The signature brand accent and the "30" of the 60-30-10 rhythm. Used on the Final CTA block background, the italic display accent word, active filter chips' hover, button hover fills, eyebrow rules, and decorative glows. When the eye finds warmth, this is the source.

### Neutral
- **Warm Cream** (#FFF8F0): The dominant ground (the "60"). Page background, hero, light sections, and text-on-dark. The whole system floats on it.
- **Dark Espresso** (#4B2E2B): The ink and the rare deep surface (the "10"). Display/heading text, primary button at rest, the Contact section background, active chips. Its scarcity gives it weight.
- **Toasted Cocoa** (#8C5A3C): Muted body and secondary text, subheadlines, captions. Softer than espresso so long-form Thai copy stays calm.
- **Bleached Flour** (#FFFFFF): Card and input surfaces that lift a half-step off the cream ground without a hard border.
- **Pastry Edge** (#E8D5C4): Hairline borders, dividers, and input strokes — a warm tint, never neutral gray.
- **Burnt Sugar** (#3A2220): The footer, the deepest tone; closes the page like the bottom crust.

### Named Rules
**The 60-30-10 Rule.** Warm Cream owns ~60% of any view, Caramel Crust ~30%, Dark Espresso ~10%. Espresso's rarity is the point — when a whole section turns espresso (Contact, footer), it must earn it.

**The Warm-Neutral Rule.** There are no true grays. Every border, divider, and muted text value carries warmth (Pastry Edge, Toasted Cocoa). A cool `#888` gray is forbidden — it breaks the bakehouse light instantly.

## 3. Typography

**Display Font:** Playfair Display (with Georgia, serif fallback)
**Body Font:** DM Sans (with system-ui, sans-serif fallback)

**Character:** A high-contrast editorial serif against a calm, humanist sans. Playfair carries the romance and craft — especially in italic, where the accent word in a headline leans into caramel. DM Sans keeps body copy quiet, legible, and friendly for Thai and Latin alike. Loaded via Google Fonts with `display: swap`.

### Hierarchy
- **Display** (700, clamp(52px, 7.5vw, 96px), 1.05, -0.03em): Hero headline only. Split across lines, one word in caramel italic.
- **Headline** (700, clamp(36px, 5vw, 64px), 1.05, -0.03em): Section titles ("ทำไมต้องเลือก แป้งละออง", the Final CTA).
- **Title** (700, 22px, 1.25, -0.02em): Feature-card and workshop-card titles.
- **Body** (400, clamp(15px, 1.3vw, 17px), 1.75): Paragraphs and descriptions in Toasted Cocoa; keep measure ≤ ~60ch.
- **Label** (700, 11px, 0.35em tracking, UPPERCASE): Eyebrow kickers above headlines, in Caramel Crust.

### Named Rules
**The Italic Accent Rule.** In display and headline type, exactly one word leans — set in Playfair italic and Caramel Crust. One per headline. It is the system's signature; multiplying it cheapens it.

**The Wide-Track Label Rule.** Every uppercase label rides at 0.30–0.35em letter-spacing. Tight uppercase is forbidden; the airy tracking is what makes it read editorial, not corporate.

## 4. Elevation

Flat by default. Surfaces (cards, chips, inputs) rest directly on the cream/flour ground with no shadow; separation comes from the warm Pastry Edge hairline and tonal contrast. Shadows are a **response to state**, not a baseline — they bloom on hover to lift a card or button, then settle back. Every shadow is espresso-tinted (`rgba(75,46,43,...)`), never neutral black, so the depth stays warm. Additional depth is atmospheric: a 2–4% grain overlay and soft caramel radial glows behind the hero and CTA.

### Shadow Vocabulary
- **Resting CTA** (`box-shadow: 0 4px 24px rgba(75,46,43,0.25)`): Primary buttons at rest, a soft warm grounding.
- **Hover Lift** (`box-shadow: 0 8px 32px rgba(75,46,43,0.28)`; pair with `translateY(-2px)`): Buttons and cards on hover.
- **Card Float** (`box-shadow: 0 8px 40px rgba(75,46,43,0.10)`): Feature cards on hover, very diffuse.
- **Badge Whisper** (`box-shadow: 0 2px 12px rgba(75,46,43,0.08)`): Social-proof badges, barely-there.

### Named Rules
**The Warm-Shadow Rule.** Every shadow uses `rgba(75,46,43,α)` (espresso), never `rgba(0,0,0,α)`. A neutral-black shadow on this cream ground looks like a 2014 app — too dark, too cold.

## 5. Components

### Buttons
- **Shape:** Sharp, square corners (0px radius). No rounding, ever.
- **Primary:** Dark Espresso fill, Warm Cream text, Playfair italic 16px, 16px×40px padding, resting warm shadow.
- **Hover / Focus:** Fill shifts to Caramel Crust, `translateY(-2px)`, shadow deepens; ~250ms `cubic-bezier(0.16,1,0.3,1)`. Focus must add a visible `:focus-visible` ring (caramel outline) — currently relies on hover treatment, to be hardened.
- **Outline / Secondary:** Transparent/cream fill, espresso text + 2px espresso border; on hover, inverts to espresso fill with cream text.

### Chips (category filter)
- **Style:** Sharp, 1.5px Pastry Edge border, transparent fill, Toasted Cocoa text, 8px×20px padding, DM Sans 12px.
- **State:** Selected → Dark Espresso fill, Bleached Flour text, espresso border; icon inverts to match. Unselected hover lightens border toward caramel.

### Cards / Containers
- **Corner Style:** Sharp (0px).
- **Background:** Bleached Flour on the cream ground.
- **Shadow Strategy:** Flat at rest; Card Float on hover (see Elevation). A 2px caramel corner-accent bracket marks feature cards.
- **Border:** Hairline `rgba(192,133,82,0.15)` (caramel at low alpha), strengthening on hover.
- **Internal Padding:** Generous — 40px×36px for feature cards.

### Inputs / Fields
- **Style:** Sharp, 1.5px Pastry Edge stroke, Bleached Flour (or low-alpha on dark) fill, 44px height, DM Sans 14px.
- **Focus:** Border shifts to Dark Espresso. Needs a clear non-color focus affordance for AA — to be hardened alongside buttons.
- **Error:** Surfaced via toast, not inline field state (contact form).

### Navigation
- **Style:** Fixed top bar, transparent over the hero, transitioning to translucent cream with blur + Pastry Edge underline on scroll. Logo (Playfair italic) left, links center, espresso CTA right.
- **States:** Center links are Espresso at 0.6 opacity, rising to full with a caramel underline on hover. **Mobile (≤768px): center links hide**; logo-to-top and the CTA carry navigation (single-scroll landing).

### Signature: Social-Proof Badge
Small Bleached-Flour chip with a low-alpha caramel border, a stamp-corner bracket (2px caramel L-marks at opposing corners), an emoji glyph, a Playfair value, and a wide-tracked uppercase label. Used in a row beneath the hero CTAs (⭐4.9, 15+ เชฟ, 200+ นักเรียน).

## 6. Do's and Don'ts

### Do:
- **Do** keep the 60-30-10 rhythm: Warm Cream ground, Caramel Crust accent, Dark Espresso as rare deep punctuation.
- **Do** carry one Playfair-italic caramel accent word per display/headline — exactly one.
- **Do** keep every corner sharp (0px radius); crispness is the editorial signal.
- **Do** tint every shadow espresso (`rgba(75,46,43,α)`) and keep surfaces flat until hover.
- **Do** track uppercase labels at 0.30–0.35em and color them Caramel Crust.
- **Do** lead sections with a real class image, a chef, or social proof — show the craft to build trust.

### Don't:
- **Don't** ship the **generic template look** — no default Tailwind/shadcn card grids, no centered hero with a gradient blob, no uniform shadows. (PRODUCT.md anti-reference.)
- **Don't** drift toward **corporate SaaS** — no cold blue-and-white, no sterile B2B dashboard chrome. (PRODUCT.md anti-reference.)
- **Don't** go **loud or cluttered** — no competing accent colors, no high-density walls, no gratuitous motion. Motion clarifies; it never shouts. (PRODUCT.md anti-reference.)
- **Don't** use a true neutral gray for any border, divider, or muted text — use Pastry Edge / Toasted Cocoa. A cool gray breaks the bakehouse light.
- **Don't** use `rgba(0,0,0,α)` shadows — they read cold and dated on cream.
- **Don't** round corners. If it looks soft and bubbly, the radius crept above 0.
