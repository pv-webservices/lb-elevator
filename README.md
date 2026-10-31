# LB Elevators

Static Astro 7 website for https://www.lbelevators.com/, deployed through Git to Vercel. DNS is managed in Hostinger. The audit confirmed Vercel response headers, Hostinger nameservers and a Vercel www CNAME; access to the Vercel dashboard/connected production branch was not available.

## Develop and verify

Use Node 24 and npm. `npm ci` installs the locked dependencies. No email credentials are needed.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development at the URL Astro prints |
| `npm run check` | Astro and TypeScript checks |
| `npm run build` | Generate static `dist/` |
| `npm test` | Form validation unit tests |
| `npm run audit` | Audit all built pages, metadata, schemas, links, images and sitemap |
| `npm run preview -- --port 4321` | Serve the production build locally |
| `npm run test:browser` | All pages at 320, 375, 768, 1024 and 1440px; axe, interactions and mocked form tests; requires preview and installed Google Chrome |
| `npm run perf` | Mobile Lighthouse on homepage and Home Lifts; requires preview and Chrome |
| `npm run verify:live` | Read-only checks of production release fingerprint, headers, redirects, 404, sitemap, icons and form configuration; FormSubmit OPTIONS only, never submits email |
| `npm run assets` | Rebuild responsive WebPs, image dimensions manifest, sharing card and favicon family; Python/Pillow required |
| `npm run images:plan` | Show existing optional image-generation routing without API calls |

Evidence is saved under `output/audit/`, `output/playwright/` and `output/lighthouse/`. These folders are ignored by Git. Tests intercept the entire FormSubmit origin before form interaction. A mocked acceptance is not proof of activation, inbox delivery or reply behaviour.

## Structure

```text
src/components/       Shared Astro components, including forms and responsive images
src/data/             Business data, media manifests, canonical origin and content date
src/layouts/          Shared metadata, navigation, footer and structured data
src/pages/            18 indexable routes, legal/utility pages, robots and sitemaps
src/scripts/          Navigation, motion, maps, gallery, form validation and delivery
src/styles/           Site styles and accessibility states
public/images/brand/          Logos and 1200x630 sharing card
public/images/catalogue/      Elevator, door and application visuals
public/images/illustrations/  Representative architectural/service imagery
public/images/photos/         Supplied cabin and site photographs
public/videos/                Compressed website clips and posters
public/                       Favicon family, manifest and font licences
source-files/                 Brochures and editable masters, outside dist
source-files/client-media/    Local original photos/videos (Git ignored)
source-files/generated-originals/  Local generated PNG masters (Git ignored)
scripts/              QA and asset preparation tools
docs/                 Search Console guide, audit report and design/provenance notes
vercel.json           Build, redirects, slash policy, security headers, hashed asset cache
```

The asset inventory was checked for exact duplicates using SHA-256. Original camera files and brochure source scans are outside `public/`. Some master-to-web copies are intentionally retained for future editing. `SiteImage.astro` supplies measured intrinsic dimensions and responsive WebP candidates. Run `npm run assets`, build and audit after changing imagery. Existing one-time source-import scripts are authoring tools and are never shipped to visitors; review their input locations before use.

## Production deployment

1. Review the changes and launch decisions in `docs/AUDIT-REPORT.md`. Do not treat local QA as deployment or live email acceptance.
2. In the existing Vercel project, confirm this Git repository and the intended production branch. Framework: Astro; build: `npm run build`; output: `dist`; Node: 24. No functions, database, SMTP or mail server are used.
3. Set the Vercel production domain to `www.lbelevators.com`, retaining the existing non-www-to-www redirect and platform HTTP-to-HTTPS redirect. Keep Hostinger's DNS records pointed at Vercel; do not upload the site to Hostinger Apache hosting.
4. Canonical origin is fixed in `astro.config.mjs` and `src/data/config.ts`; stale `PUBLIC_SITE_URL` and `PUBLIC_FORM_ENDPOINT` environment variables are no longer used. Vercel previews should retain Vercel's automatic noindex response header.
5. Only after permission to commit/push, let Git deployment publish the reviewed build. This audit does not commit, push, deploy or change remote settings.
6. Run `npm run verify:live` against the approved build. Then follow `docs/GOOGLE-SEARCH-CONSOLE.md` for indexing.

The sitemap index is `/sitemap-index.xml`; its child `/sitemap.xml` contains exactly 18 indexable URLs. Privacy, terms, thank-you and 404 are `noindex, follow`, have no canonical and are excluded. They remain crawlable. Update `CONTENT_MODIFIED` in `src/data/config.ts` on substantive published content changes; it deliberately does not change on every build.

## FormSubmit delivery and activation

All three forms (homepage, contact and quotation) POST only to `https://formsubmit.co/liftsbazar2025@gmail.com`. JavaScript enhances this with the FormSubmit AJAX endpoint, inline validation, consent, honeypot, a short bot timer, loading state and a 20-second timeout. Errors retain the controls' values. Back/pageshow restores enabled buttons. The no-JavaScript fallback uses browser validation and the normal provider POST with `_next` pointing to our `/thank-you/` page. FormSubmit uses the named `email` field for Reply-To; AJAX also supplies `_replyto` explicitly.

`_captcha=false` avoids the provider's visible CAPTCHA page; the compatible `_honey` field remains active. This trades CAPTCHA protection for the requested website experience. Client-side checks/timer can be bypassed, so they are not a server-side security guarantee. FormSubmit controls its own service filtering. Additional activation/provider error pages may still appear during native no-JS delivery; the configured `_next` applies after successful acceptance. Server errors during no-JS navigation require the browser Back button to return to entered details.

**Activation is pending verification.** Ask for permission before the first real activation/test submission. The client must open the FormSubmit activation message in Inbox or Spam and approve it. If it supplies an alias, replace both form action and AJAX endpoint consistently, retaining the same sole recipient, then update and rerun tests. Do not invent an alias or request a Gmail password. After activation, one separately approved real enquiry must verify Inbox/Spam, subject, all submitted fields, Reply-To, reply behaviour and thank-you redirect. Inbox placement cannot be guaranteed by frontend code.

No email was sent during this audit. The WhatsApp option only opens a prefilled message for the visitor to review and send to +91 9679112375. The privacy page explains FormSubmit/Gmail processing but still requires business/legal approval.

Optional image generation remains a local authoring tool. Its key is read only from the ignored `.env` or process environment and is never included in the website. Do not place credentials in Git.
