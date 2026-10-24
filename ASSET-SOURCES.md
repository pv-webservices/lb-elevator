# Asset sources and content boundaries

## Supplied material

- `public/image-1.jpeg`: original four-panel LB Elevators brochure. Source for the five solution categories, eight accurately matched door illustrations, application categories and business identity.
- `public/image-2.jpeg`: supplied business card. Source for the original logo artwork, Managing Director name and business contact information.
- `public/image-3.jpeg`: supplied printed logo mockup, retained unchanged.
- Supplied `LB Elevators Corporate Homepage Mockup UI.png`: visual/structural reference, not used as a flattened website image.
- Supplied pasted development brief: scope and confirmed business information. No unsupported experience, certification, capacity, speed, pricing, response or geographic claims were added.

`scripts/extract-logo.py` extracts the existing mark and wordmark from image-2 and places those original pixels together on white. It does not redraw or generate the logo. The final asset is `public/images/logo.webp`.

`scripts/prepare-assets.py` records exact brochure crop coordinates. Door files `door-solid.webp`, `door-auto.webp`, `door-half.webp`, `door-full.webp`, `door-telescopic.webp`, `door-ifd.webp`, `door-collapsible.webp`, and `door-swing.webp` retain the corresponding brochure illustration. Their source resolution is limited; larger originals would improve the technical catalogue. They were not replaced with AI depictions of technical door configurations.

Original product crops remain as `*-brochure.webp`. Original full JPEGs are retained. Building visuals and product concepts are representative and are not evidence of completed LB Elevators installations.

## Generated representative visuals

Created with the built-in image generation tool, then inspected and optimized as WebP. No generated image is a verified installation, specific available model, measured technical layout or client building.

Final workspace assets:

- `public/images/hero.webp`, `hero-mobile.webp`: contemporary elevator lobby.
- `public/images/passenger.webp`, `goods.webp`, `home.webp`, `hospital.webp`, `panoramic.webp`, plus corresponding `*-small.webp`: representative product categories. Main category images use a consistent 960 × 1200 crop; cards offer responsive sources.
- Application images `residential.webp`, `commercial.webp`, `healthcare.webp`, `hotel.webp`, `education.webp`, `industrial.webp`: representative architecture, with responsive small versions where used.

Generation prompts are documented in [IMAGE-PROMPTS.md](IMAGE-PROMPTS.md). They describe appearance only and do not establish technical product specifications.

Fonts are locally bundled Manrope and Source Sans 3 via Fontsource. Icons are a consistent local SVG stroke system. No third-party font or animation CDN is required.

## Public-facing boundaries

Gallery and applications pages identify representative visuals. No testimonials, social profiles, review scores, project statistics, credentials or unconfirmed service areas are published. The Google Maps link searches the supplied address; a verified place pin is still needed for an office-location embed. The supplied existing domain is recorded in README, but is not silently used as the new canonical origin.

## v2 generated visuals (OpenAI Image API)

Created 25 October 2026 with `gpt-image-2.5-sunburst` (hero-lobby, showcase-atrium, service-installation, service-maintenance) and `gpt-image-2.5-flare` (service-modernization, service-amc, process-shaft) through `scripts/images/generate.mjs`. Prompts, placements and alt text are in `src/data/generated-images.json`. Outputs are in `public/images/gen/`; untouched PNG originals are kept in `output/generated-originals/` and are not deployed.

These are representative visuals. They do not depict LB Elevators staff, completed installations, specific equipment models or client buildings. Technician images show anonymous, AI-generated people with faces turned away.
