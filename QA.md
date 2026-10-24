# LB Elevators — local QA

## v2 redesign — 25 October 2026

- `npm run check`: 0 errors, 0 warnings, 0 hints. `npm run build`: 21 pages.
- `npm test` (real Chrome against the local dev server): **147 route/viewport checks** at 320–1440px with no overflow, missing images or page errors; **42 axe scans, 0 violations** (contrast tokens were adjusted to pass).
- Interactions passed: desktop dropdown + Escape, door selector switching, floating WhatsApp link format, mobile menu and accordion, gallery filter/lightbox/focus return, form validation and email draft, mocked provider accept/reject and honeypot, enquiry context prefill, reduced motion, no-JavaScript readability.
- The door carousel checks were replaced by door-selector checks; the mobile-menu close check now waits for the fade-out.
- AI imagery: seven assets generated and visually reviewed (no text artefacts, plausible lift proportions, anonymous technicians); now live in hero, showcase, services, process, inner heroes and gallery.
- Not verified: physical devices, Safari/Firefox, real WhatsApp delivery and Lighthouse on the new build.

---

## v1 (previous build)

Verified on 24 October 2026. This is local implementation evidence, not deployment, live enquiry delivery, production indexing, formal accessibility certification or field Core Web Vitals evidence.

## Final verification

- `npm run check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: 21 HTML pages (20 public pages plus the branded 404), robots and sitemap.
- Prettier: source, configuration and verification scripts passed.
- Package installation/audit: 0 reported vulnerabilities at installation.
- Static checks: 1,124 internal file/link/image references resolved; one H1 and a meta description per HTML page.
- Real Google Chrome on production output through Astro preview: **147 route/viewport checks passed**, at 320, 390, 430, 768, 1024, 1280 and 1440 pixels. No detected horizontal overflow, missing images or JavaScript page errors.
- Axe: **42 scans**, all 21 pages at 390 and 1440 pixels, WCAG 2 A/AA, 2.1 AA and 2.2 AA tags; **no detected violations**. Scans used reduced motion to avoid sampling partially faded text. Normal motion and the reduced-motion override were checked separately.
- Unknown URLs return HTTP 404 with the branded page. Explicit `/404.html` returns 200 in Astro preview; actual unknown-path handling was tested. Configure the destination host's 404 handler before launch.

## Interactions

Desktop dropdowns and mobile accordion navigation open and close, including Escape and focus behavior. Door carousel controls advance the native horizontally scrollable track. Gallery filtering, lightbox opening, Escape dismissal and focus return pass.

Chrome touch emulation also passed menu, service accordion and carousel tap checks (`output/playwright/touch-results.json`). Representative product, service, door-catalogue and quote-page screenshots were inspected. Physical touch devices were not tested.

After the final decorative-image refinement, four additional route/viewport/image checks and four additional axe scans passed on the elevator index and door catalogue at 390 and 1440 pixels (`output/playwright/final-image-regression.json`).

Forms enforce required fields and preserve selected product, service, door and callback context. Email drafts are encoded and explicitly state that nothing has been sent. Mock-only intercepted provider acceptance/rejection and honeypot behavior pass; no external enquiry or email was sent. A deliberately reversed provider-success condition was caught by the focused test, then restored before the final successful suite.

Content and product links remain readable without JavaScript; navigation includes a no-JavaScript fallback. The hero animation is disabled by `prefers-reduced-motion`.

## SEO configuration

A build with the reserved test origin `https://lb-elevators.example.test` verified canonicals, 18 non-legal sitemap URLs and crawlable robots output. The environment was cleared and the preview rebuilt. The delivered unconfigured build is noindex, has no fabricated canonical origin and blocks crawling. Set the approved `PUBLIC_SITE_URL` before launch. Legal pages remain noindex pending approval.

Unique titles/descriptions, Open Graph metadata, LocalBusiness structured data, breadcrumbs and internal product/service links are implemented. Audit existing URLs and configure server-side 301 redirects when replacing the current site.

## Visual review

Desktop and mobile screenshots were reviewed against the supplied homepage. The original logo and navy/yellow identity, angular hero and complete section order are retained. Generated representative product/architecture concepts improve the large visuals; technical door images use their matching brochure panels. Sources, generation prompts and limited door-image resolution are documented in `ASSET-SOURCES.md` and `IMAGE-PROMPTS.md`. Images are not labelled as verified installations.

## Performance and verification limits

An earlier local mobile Lighthouse report showed performance 94, accessibility 100, best practices 100, LCP 2.4 s, TBT 190 ms and CLS 0.001. The CLI then exited with Windows `EPERM` during Chrome-profile cleanup. These measurements are **provisional** and predate the final responsive-image refinements; no final performance score or field INP is claimed. SEO was reduced because preview indexing is intentionally blocked. An earlier logo-link label/name mismatch was fixed.

Physical devices, assistive technology, other browsers, production hosting, live delivery and production indexing have not been validated. Repeat performance and indexing checks on the configured deployment.

## Evidence

- `output/playwright/qa-results.json` and `verification.log`: final successful matrix and interaction evidence.
- `output/playwright/homepage-1440.png` and `homepage-390.png`: final homepage screenshots.
- `output/playwright/mutation-check.log`: expected failure after deliberately reversing the success condition.
- `output/playwright/lighthouse-mobile.report.html` and `.json`: provisional earlier reports.
- `output/playwright/origin-build.log`: configured-origin build evidence.

## Launch requirements

1. Approve the domain/origin; configure hosting, HTTPS, cache policy, 404 handling and legacy redirects.
2. Approve a form endpoint, implement provider-side validation/spam protection/data handling, activate the recipient and verify actual email delivery. Until then, forms prepare explicit email drafts; direct call/email links also work.
3. Supply and approve final privacy and terms copy.
4. Verify the office map pin before embedding it. Confirm a WhatsApp-enabled number and social profiles before adding those controls.
5. Approve representative generated imagery; replace door illustrations with larger originals or add verified installation photos when available.

No deployment, production configuration change or live message sending was performed.
