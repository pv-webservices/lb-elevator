# LB Elevators — design system (v2 redesign)

A static Astro marketing site. The v2 redesign keeps the brand (original logo, navy + signal yellow, the brochure's four-colour rule and angled stripes) and moves the presentation toward a premium, scroll-led experience inspired by the motion patterns of hybonelevators.com (no Hybon content, branding or assets used).

## Tokens (`src/styles/global.css` `:root`)

- Colour: navy `#031128 / #041a3d / #062b63`, blue `#0b4a93`, yellow `#ffca05`, brand rule blue/yellow/green/red, ink `#0b1a33`, muted `#5d6880`, paper `#f4f6fa`. Small amber text uses `--amber-text #8a6100` (4.5:1 on white).
- Type: Manrope 800 for display, Source Sans 3 for reading, Instrument Serif italic (`.serif`) for one accent phrase per heading. All fonts are self-hosted via Fontsource.
- Layout: `.wrap` = viewport minus `clamp(16px, 5vw, 80px)` gutters, max 1560px (≈80–90% on large screens). Full-bleed sections for hero, showcase, services, process and footer.
- Radius 10 / 18 / 28px. Section rhythm `clamp(72px, 9vw, 140px)`.
- Buttons (`.btn` + `btn-primary | btn-dark | btn-outline | btn-ghost-light | btn-whatsapp`): directional fill on hover, icon nudge, no shine/glow. Touch devices get the fill on press.

## Signature interactions (`src/scripts/interactions.ts`)

One rAF-throttled scroll handler writes CSS variables; CSS reads them with transform/opacity only.

- **Door-opening intro** — once per session, ~2s, skipped for reduced motion, never blocks input.
- **Floor indicator** — fixed elevator display (≥1360px) showing the current section as a floor (`data-floor`).
- **Sticky stacked product cards** — Hybon-style stack beside a pinned index; earlier cards scale and dim (`--cover`).
- **Expanding showcase** — a rounded inset image opens to full-bleed (`--pin`).
- **Pinned horizontal services** — vertical scroll drives a horizontal track on ≥901px; native swipe with scroll-snap below.
- **Elevator-shaft values timeline** — a cabin travels the shaft line as you scroll (`--mid`).
- **Word-by-word statement**, parallax media frames, reveal-on-scroll, marquee, door selector with closing/opening door leaves.

`prefers-reduced-motion` disables pinning, intro, word reveal and animations; every section remains readable without JavaScript.

## Imagery

`src/data/media.ts` resolves AI-generated assets from `public/images/gen/` when present and otherwise falls back to existing project images, so no section ever shows a placeholder. See `IMAGE-PROMPTS.md`.
