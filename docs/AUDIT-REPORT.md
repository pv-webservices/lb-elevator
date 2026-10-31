# Website audit — 31 October 2026

Local repairs are implemented. Production still serves the older site. No commit, push, deployment, DNS change, activation submission or real enquiry was performed. Final verification results and Lighthouse measurements are recorded below after the final run.

## Setup established before changes

| Item | Evidence / result |
| --- | --- |
| Framework | Astro 7.4.2, static output; `npm run build` produces `dist/` |
| Hosting | Public HTTP responses identify Vercel; www DNS CNAME targets Vercel |
| DNS | Hostinger nameservers: `athena.dns-parking.com`, `apollo.dns-parking.com` |
| Deployment | User-specified Git deployment; remote is `https://github.com/pv-webservices/lb-elevator.git`; Vercel project/production-branch settings were not independently accessible |
| Original forms | Email-draft links, optional email, no native POST action; no active FormSubmit integration in the checked code |
| Canonical | Now fixed to the supplied `https://www.lbelevators.com/` |
| Live versus original build | Different script hashes **and body content**. The live header had the older single-location contact presentation; unchanged repository code had the newer Siliguri/New Delhi header. Production was already behind the repository before this audit. |

Raw evidence: `output/audit/live-before.json`, `live-before.html`, `version-before.json`. An isolated build of the original Git HEAD is retained under ignored `output/baseline/` for the performance comparison.

## Repairs by requested area

### 1. Error states and hosting

- Retained the branded 404 with home, main navigation, contact and phone links. Changed utility robots to `noindex, follow`, with no canonical. The existing live host already returned a genuine 404; the updated metadata requires deployment.
- Added `vercel.json`: Astro build/output settings, canonical-host redirect, `/index.html` and nested index redirects, consistent trailing slashes, the three requested security headers, and immutable one-year caching for hashed `/_astro/` assets.
- HTTPS redirection and HSTS are provided by Vercel and were observed live; no Apache or Netlify configuration was added.
- Added `/thank-you/`, noindex and excluded from the sitemap. It reports provider acceptance without claiming verified Inbox delivery.
- Added field messages, a summary, offline, timeout and delivery-failure states. Inputs remain populated on failure; Back/pageshow restores submit buttons. Phone/email alternatives remain visible.

### 2. Images, fonts and performance

- Centralised image rendering in `SiteImage.astro`, backed by an actual-dimensions manifest. Every rendered image has measured width/height, WebP candidates and sizes. The audit rejects dimensions that do not match the image file.
- LCP images use eager loading and high fetch priority; non-brand images below the fold use lazy loading. Video clips use `preload="none"` and visibility-based playback; reduced motion offers controls instead.
- Recompressed imagery, added width variants and smaller responsive logo candidates, and removed redundant legacy thumbnail variants and unused images. Original scans/camera media are outside the deployed output. SHA-256 checks found no exact duplicate public files.
- Removed the opening intro, its markup/script/styles and unused Manrope 400 weight. Hero text is immediately visible. Preloads are limited to critical body/display fonts.
- Fixed repeated forced layouts by reading geometry together before writing styles in the scroll handler.
- Maps now load only on request; direct Google Maps links also work without JavaScript. This removes Google's embedded-map scripts from the initial page load.
- Retained the cached external shared stylesheet after measuring the alternative of inlining it.

Lighthouse results are local mobile lab measurements, not deployed PageSpeed/CrUX results. Lab TBT does not measure field INP. Scores vary with machine load; the before/after reports use the same Lighthouse 13.5.0 and Chrome environment. Further live mobile measurements are required after deployment.

### 3. FormSubmit and email

All three forms — homepage, contact, quotation — use only FormSubmit, with `liftsbazar2025@gmail.com` as the sole recipient. Native POST fallback is `https://formsubmit.co/liftsbazar2025@gmail.com`; JavaScript uses its AJAX endpoint.

Required name/email/phone/message/consent fields are validated manually, including trimmed minimum/maximum lengths and 10–15 phone digits. Select options and consent are checked. Date validation is unit-tested; the current forms contain no date field. Errors have field associations and focus the first invalid input. Subjects, form type, project fields, source URL, visitor Reply-To and IST time are included where JavaScript permits; native submissions retain a meaningful static subject, form type, source page and visitor email.

`_next` points to the website's thank-you page; `_honey` is the provider-compatible trap. `_captcha=false` avoids a visible provider CAPTCHA step, as requested. This gives up CAPTCHA protection; the honeypot/provider filters remain, while browser validation and the short timer are bypassable enhancements. WhatsApp bypasses the timer and only opens a prefilled message for the visitor to send.

The privacy page now explains FormSubmit delivery to the personal Gmail address, the data sent, WhatsApp, on-demand Google Maps, and the pending retention/legal review. No Gmail password, SMTP credentials, custom mail server, mail API or function was introduced.

**Activation and real delivery remain unverified.** No alias was invented. FormSubmit's activation message must be opened by the client after an approved activation submission; if it supplies an alias, update both endpoints and tests consistently. A separately approved real enquiry must verify Inbox/Spam, subject, fields, Reply-To/reply behaviour and redirect. A successful AJAX response cannot establish Inbox placement. Native no-JS delivery may show FormSubmit activation/error pages; `_next` controls its successful return. On native navigation errors, use browser Back to recover the populated form.

Provider reachability was checked using body-free **OPTIONS**, not POST; it responded successfully. This did not test activation or email delivery. References: [FormSubmit options](https://formsubmit.co/documentation), [AJAX delivery](https://formsubmit.co/ajax-documentation).

### 4. SEO and indexing

- Unique titles within 65 characters, descriptions within 70–170 characters, one H1, sequential heading levels, image alternatives, canonical URLs, Open Graph/Twitter tags and a measured 1200×630 sharing image are checked across every built page.
- Added linked LocalBusiness, WebSite and breadcrumb JSON-LD, with `<` escaped. Binod Yadav is represented as the supplied **Managing Director** on About; founder status is unconfirmed and was not invented. There are no blog posts or FAQ sections, so Article/FAQ markup is not applicable.
- Robots allows crawling, including utility/legal pages and CSS/JS. The sitemap index references an auto-generated child sitemap containing exactly **18 indexable URLs**, with substantive-content lastmod date in `src/data/config.ts`.
- Privacy, terms, thank-you and 404 are `noindex, follow`, without canonicals and excluded from the sitemap. Navigation, footer, breadcrumbs, overview/detail links and related products/services remain connected. No articles exist requiring article-to-service links.
- Added `npm run audit`, which checks metadata, headings, schemas, icons, image dimensions/loading/candidates, internal paths/fragments and exact sitemap membership. Keep the content date and inventory current when publishing substantive changes.

### 5. Organisation and documentation

Tracked assets and existing documentation were moved with `git mv`. Web images are grouped into `brand/`, `catalogue/`, `illustrations/` and `photos/`; deployed names are lowercase and hyphenated. Brochures, brand artwork and editable image masters are under `source-files/`. Large original client media and generated PNGs are retained locally there and ignored by Git; back them up separately before sharing/cleaning this checkout.

README now describes actual Vercel Git deployment, FormSubmit activation, folder layout and every supported QA command. Historical QA is labelled under `docs/archive/`. The obsolete SEO verifier was replaced by the complete audit script. Source-preparation tools remain local authoring tools and do not ship in `dist/`.

### 6. Search Console

`docs/GOOGLE-SEARCH-CONSOLE.md` contains Hostinger TXT verification, launch checks, sitemap submission, all 18 canonical URLs grouped, suggested manual indexing batches of 10 and 8, exclusions, and weeks 1–4 follow-up. It explains XML styling messages and temporary processing while advising immediate checks for actual fetch errors. No Search Console property, DNS record or indexing request was created.

### 7. Favicon

Generated logo-derived square ICO 48, PNG 48/96/192/512, SVG and Apple 180 icons on solid white, plus the manifest. All pages link the family; robots permits it. Dimensions were checked locally. New icon URLs still need deployment before their live 200 status can pass.

Google can take days to weeks to update the search favicon. Requesting a homepage recrawl may help discovery, without guaranteeing timing or display. [Google favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search).

### 8. Verification and production boundary

`npm run verify:live` checks source fingerprint, canonical, redirects, headers, 404 metadata, sitemap, icons, hashed cache and form configuration without sending an enquiry. Its current failures are expected because the changed code has not been deployed; they must not be reported as live passes. Existing live HTTPS/www redirects, genuine 404 status and asset caching were observed, but updated SEO, redirects, headers, icons and FormSubmit remain pending deployment.

## Decisions and confirmations

1. Canonical domain is the supplied HTTPS **www** domain; all 18 business pages become indexable after deployment. No page titles needed changing; the short terms description was expanded.
2. Keep privacy/terms noindex until final business/legal copy is approved. Confirm retention, legal basis and processing arrangements; no legal approval is implied.
3. Confirm the supplied office addresses/phone numbers and map searches, brochure suitability/safety/efficiency statements, experience wording and representative imagery. No years, results, ratings, reviews, certification, response-time or technical performance claims were added.
4. Confirm founder identity/status before adding a founder relationship; current Person markup says Managing Director only.
5. CAPTCHA is disabled to retain the website experience. Honeypot/provider filtering remains; confirm this documented spam-protection tradeoff.
6. Approve commit/push/deployment separately when ready. Then authorise the activation and one real delivery test, with access to the client's Inbox/Spam and reply verification. Neither permission has been inferred from local QA.

## Final verification results

Final local source fingerprint: `591e348b545b69cb`. No commit, push or deployment.

- `npm run check`: passed, zero errors/warnings/hints.
- `npm run build`: passed; 22 HTML pages.
- `npm test`: passed form validation unit checks.
- `npm run audit`: passed, zero issues, 18 indexable URLs.
- `npm run test:browser`: passed all 110 route/width checks at 320, 375, 768, 1024 and 1440px; no horizontal overflow or missing images.
- Axe: 44 page scans (mobile and desktop) plus the invalid-form error-state check; zero violations. Keyboard skip link, focus return, menus, reduced motion and no-JS content/fallback checked.
- Browser: zero unexpected console errors or page exceptions. Chromium's expected resource error for the deliberately tested HTTP 404 document is excluded; its HTTP status is asserted separately.
- Form requests were intercepted throughout. Success/payload, validation, consent, honeypot, bot timer/WhatsApp exemption, offline, request timeout, provider/network/HTTP/malformed-response failures, Back/pageshow, prefill and native POST fallback passed.
- `git diff --check`: passed. Dependency audit: zero known vulnerabilities in the locked dependency set at audit time.
- Live deployment verification remains pending/failing for the unchanged public release; this is separate from local QA.

### Mobile Lighthouse comparison

| Mobile page | Score before → after | LCP before → after | CLS before → after | TBT before → after |
| --- | --- | --- | --- | --- |
| Homepage | 69 → 86 | 2.45 → 2.98 s | 0.00000 → 0.00000 | 1440 → 348 ms |
| Home Lifts | 78 → 80 | 2.83 → 2.16 s | 0.00000 → 0.00004 | 658 → 708 ms |

The latest measurements above compare the original isolated Git build with the repaired local build using Lighthouse 13.5.0. They precede the final error-colour and mobile spacing corrections, which do not change the performance implementation. Repeated local measurements varied considerably with machine/browser load; earlier high scores are not substituted for the latest figures. Homepage LCP remains about 3 seconds, and the inner page's TBT still needs investigation in a stable/live run. This is **not** a claim that performance work is fully accepted or that field INP passes. Recheck mobile PageSpeed/CrUX after the approved deployment and address remaining measured bottlenecks there.

Evidence: `output/playwright/qa-results.json`, `output/playwright/page-checks.json`, `output/audit/seo.json`, `output/audit/dependencies.json`, `output/lighthouse/before-*.{json,html}`, `output/lighthouse/after-*.{json,html}`. Full Lighthouse JSON is retained alongside each summary.
