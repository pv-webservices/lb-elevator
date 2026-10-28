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

## Supplied photographs and videos (October 2026)

A folder of 50 photographs and 10 phone videos was supplied for site use. `scripts/import-site-media.py "<folder>"` prepares the selected files listed in `src/data/photos.json`: WebP photos in `public/images/photos/` (`<id>.webp` and `<id>-sm.webp`) and muted, trimmed H.264 clips with WebP posters in `public/videos/`. Crops remove phone UI, letterboxing and a camera watermark. Originals are not deployed.

Placements: homepage About image and "Cabin designs & finishes" section, a photo section on each elevator page, a "From the field" section with a clip on each service page, the About Us story image, and new photo filters plus a video section in the gallery. The gallery note describes these as supplied photographs of available designs, finishes and site work, not a portfolio of specific client projects.

Not used, deliberately:

- `image-26`: a stamp-paper legal agreement with personal details. Never publish.
- `image-9`, `image-12`, `image-38`, `image-37`, `image-40`: carry a cabin supplier's watermark or are photos of a supplier catalogue/PDF.
- `image-49` (duplicate of `image-47`), `image-36` (188 × 250), `image-5` (small render), `image-45`, `image-48`, `image-17`, `image-23`–`25`, `image-30`, `image-32`, `image-43` (phone screenshots, low quality, near-duplicates, identifiable people or third-party branding).
- `video-4` (shaky landscape, 3 min), `video-5` (third-party brand signage), `video-3` (short, shop signage), `video-9` (identifiable person on camera).

Confirm with LB Elevators that they hold the rights to publish the selected photographs, several of which appear to be taken at trade exhibitions.
