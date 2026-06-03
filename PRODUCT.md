# Product

## Register

brand

## Users

People in and around Chiang Mai who want to learn artisan baking hands-on — hobbyist bakers, gift-experience buyers, and small groups looking for a creative outing. They arrive curious but undecided: browsing on mobile, comparing classes, weighing price, schedule, and whether a class fits their skill level. The job to be done is **"help me confidently pick and book the right baking class"** — discover what's offered, trust the chef and the experience, and reserve a seat without friction.

## Product Purpose

แป้งละออง (Pang-La-Ong) markets and sells seats to professional-led baking workshops. The site exists to turn curiosity into bookings: showcase the classes and the people behind them, convey the warmth and craft of the experience, and carry the visitor from landing → class browse → seat selection → booking. Success = a visitor who lands cold leaves with a confirmed, paid reservation, and remembers the brand as warm, credible, and worth coming back to.

## Brand Personality

Warm · crafted · editorial. The voice is inviting and human — like a skilled baker welcoming you into a sunlit kitchen, not a marketplace upselling you. Premium but approachable: confident enough to feel worth the price, never cold or exclusive. Thai-first copy with a calm, encouraging tone. Emotional goals: comfort, craft, and invitation — the visitor should feel *"I could do this, and I'd enjoy it."*

## Anti-references

- **Generic template look** — default Tailwind/shadcn/Bootstrap card grids, stock centered hero with a gradient blob, uniform spacing and shadows. Output must look intentional and specific, not like an unmodified starter.
- **Corporate SaaS** — sterile blue-and-white B2B aesthetic, cold and impersonal. The opposite of the warmth the food/craft context needs.
- **Loud / cluttered** — competing accent colors, high density, gratuitous animation fighting for attention. Motion and emphasis must clarify, not shout.

## Design Principles

1. **Editorial over template** — earn attention through hierarchy, composition, and atmosphere (grain, layering, asymmetry), not uniform card grids. Every surface should look believable in a real product screenshot.
2. **Warmth is the brand** — the cream/caramel/espresso palette and Playfair + DM Sans pairing are identity, not decoration. Preserve them; branch out only when the UX clearly wins.
3. **Show the craft, build the trust** — lead with real class imagery, the chefs, and social proof. Credibility converts here more than persuasion copy.
4. **Conversion is a calm path, not a hard sell** — guide landing → browse → book with clear, low-friction steps and honest scarcity (real seat availability), never dark patterns.
5. **Motion clarifies flow** — scroll reveals, the 3D hero, and micro-interactions exist to direct attention and add life, and must degrade gracefully when motion is reduced.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**, with particular emphasis on **motion sensitivity** given the scroll-reveal sections, framer-motion staggering, and the 3D hero. Honor `prefers-reduced-motion` (disable/curtail reveals, auto-rotate, and parallax; provide static fallbacks for the 3D scene). Maintain AA color contrast across the warm palette (watch caramel-on-cream and muted-brown body text), full keyboard navigation with visible `:focus-visible` states, and responsive layouts verified down to 375px with no horizontal overflow.
