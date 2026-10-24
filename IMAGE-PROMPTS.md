# Image generation

## v2 redesign assets (OpenAI Image API)

The seven new assets, their prompts, placements, alt text and fallbacks live in [`src/data/generated-images.json`](src/data/generated-images.json). Generation runs **server-side only** in Node (`scripts/images/generate.mjs`); the API key is read from `OPENAI_API_KEY` (environment or the git-ignored `.env`) and is never bundled into the site.

```bash
npm run images:plan      # show model / quality / size routing, no API calls
npm run images           # generate any missing assets
node scripts/images/generate.mjs --upgrade=service-amc   # redo one on the premium model
```

Routing (`scripts/images/config.mjs`) is automatic:

| Asset | Placement | Model | Quality | Size |
| --- | --- | --- | --- | --- |
| hero-lobby | Homepage hero | gpt-image-2.5-sunburst | high | 1536×1024 |
| showcase-atrium | Expanding showcase banner | gpt-image-2.5-sunburst | high | 1536×1024 |
| service-installation | Services panel | gpt-image-2.5-sunburst | medium | 1024×1536 |
| service-maintenance | Services panel | gpt-image-2.5-sunburst | medium | 1024×1536 |
| service-modernization | Services panel | gpt-image-2.5-flare | medium | 1024×1536 |
| service-amc | Services panel | gpt-image-2.5-flare | medium | 1024×1536 |
| process-shaft | Process background | gpt-image-2.5-flare | medium | 1536×1024 |

Hero and banner placements always use Sunburst + high. Supporting images use Flare unless they combine complex traits (people at work with machinery, photoreal architecture with complex lighting). Model names, qualities and sizes can be overridden with `OPENAI_IMAGE_*` environment variables.

Each result is saved untouched to `output/generated-originals/` (not deployed) and written to `public/images/gen/<id>.webp` plus a smaller `<id>-sm.webp` (WebP q80). Rebuild the site afterwards; `src/data/media.ts` switches each placement from its fallback to the generated file automatically, and generated images join the gallery.

Status: **generated 25 October 2026** — all seven produced on the first pass (routing as above) and reviewed; none needed a Sunburst upgrade or regeneration. Total weight of the 14 WebP files is about 1.3 MB; each page loads only the sizes it needs. `npm run images -- --reoptimize` (or `node scripts/images/generate.mjs --reoptimize`) rebuilds the WebPs from the saved originals without calling the API.

## v1 assets (existing)

All imagery below used the built-in image generation tool. Optimized final images are saved in `public/images/`; these prompts are not claims about supplied equipment or completed projects.

- **hero.webp** — refined contemporary commercial lobby, three stainless steel center-opening elevator doors in dark marble surrounds, warm lighting, no people or text.
- **panoramic.webp** — cylindrical panoramic glass elevator cabin in a tall glass-and-steel atrium.
- **passenger / goods / home / hospital.webp** — representative category interiors (empty passenger cabin, goods lift with unbranded boxes, glass villa home lift, hospital bed lift with empty trolley).
- **residential / commercial / healthcare / hotel / education / industrial.webp** — representative Indian building exteriors, no people, cars, signage or text.
