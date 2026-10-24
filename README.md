# LB Elevators

Static Astro business website based on the supplied LB Elevators homepage mockup and brochure. Includes 20 public pages and a branded 404, five product detail pages, four service detail pages, an eight-door catalogue, gallery, enquiry and quotation flows.

## Local development

Use a current Node version supported by Astro 7 (this build was verified on Node 24.19.0).

```powershell
npm ci
npm run dev
```

The local URL is printed by Astro. For production output:

```powershell
npm run check
npm run build
npm run preview
```

Upload the contents of `dist/` to static hosting. Configure directory index handling and the host's custom 404 handler to serve `404.html` with HTTP 404. The project does not need a database or a Node process in production. No deployment has been performed.

## Production configuration

Copy `.env.example` to `.env` and set `PUBLIC_SITE_URL` to the approved HTTPS origin before building. Without an origin, pages are noindex, robots blocks crawling and sitemap contains no URLs. With an origin, canonicals, social metadata and sitemap use that exact origin. Legal review pages remain noindex. The generated sitemap is `/sitemap.xml`.

The existing domain in the brief is `https://www.liftsbazar.in/`; it was not assumed to be the deployment origin. Its current page content could not be fetched during this run. Audit existing URLs and configure server-side 301 redirects before replacing an existing site.

## Enquiries and quotes

By default, forms validate locally and prepare an explicitly labelled email draft. The visitor clicks the resulting link, reviews the email in their own email app and sends it. The site never reports this as sent. Direct email and telephone links are available. A configured email application is needed for mailto links.

An approved form provider can be configured with `PUBLIC_FORM_ENDPOINT`. It must accept HTTPS cross-origin `multipart/form-data` POST requests and return JSON `{ "success": true }` only after acceptance. The frontend handles pending, rejection, timeout, malformed response and network failure. Endpoint validation, sanitization, rate limits, honeypot enforcement, spam protection, privacy handling and email delivery must be supplied by that provider/server. The client-side honeypot is an enhancement, not server-side spam protection.

Do not set a provider endpoint without confirming this contract. Activate the recipient, verify provider-side validation/spam controls, and test actual delivery before launch. No live enquiry or email was sent during development. If a provider uses another response shape, adapt and test the handler before enabling it.

WhatsApp: a floating WhatsApp button, a contact-panel link and a "Send via WhatsApp" form option open `wa.me` with a prefilled message for the visitor to review and send. They use the primary phone (+91 9679112375) by default — **confirm it is WhatsApp-enabled**, or set `PUBLIC_WHATSAPP_NUMBER` (international format, digits only) before building. Social links remain omitted because no social profiles were supplied.

The contact panel embeds a Google Maps address search for Champasari Main Road, Siliguri, plus an "Open in Google Maps" link. Replace it with a verified place pin when available.

## Image generation (server-side)

New hero, showcase, service and process imagery is generated with the OpenAI Image API by `npm run images` (Node only; the key stays in `OPENAI_API_KEY` and is never shipped to the browser). Model routing, quality, sizes and prompts are configured in `scripts/images/config.mjs` and `src/data/generated-images.json`; see `IMAGE-PROMPTS.md`. Until assets exist in `public/images/gen/`, every placement falls back to an existing project image. Rebuild after generating.

## Content and assets

Repeated business, product, service and application content lives in `src/data/site.ts`. See `DESIGN.md` for the design system and scroll interactions and `ASSET-SOURCES.md` for provenance and image limitations. No project counts, certifications, capacities, speeds, pricing or response guarantees are asserted.

Privacy and terms pages clearly state that approved legal copy is pending. Complete their review before public launch.

## Verification

```powershell
npm run check
npm run build
npm test
```

`npm test` requires a running local server on port 4321 (override with `TEST_URL`) and an installed Google Chrome. It checks static internal references, metadata and heading structure, then uses real Chromium for route/viewport, image, axe and interaction checks. It does not send messages or test live delivery. Evidence is written to `output/playwright/`. See `QA.md` for the final run and limits.

## Reference documentation

The industry presentation was reviewed at [Hybon Elevators](https://www.hybonelevators.com/). No Hybon branding, claims or assets were copied. Astro's [static routing](https://docs.astro.build/en/guides/routing/) and [configuration reference](https://docs.astro.build/en/reference/configuration-reference/) informed implementation.
