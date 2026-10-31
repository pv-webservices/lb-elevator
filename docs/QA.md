# Current QA — 31 October 2026

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

## Interaction evidence

- Keyboard skip link is visible on focus and reaches main content
- Desktop dropdown opens and closes with Escape
- Door selector switches door, text and enquiry link
- Floating WhatsApp link targets wa.me with a prefilled message
- Mobile menu and accordion are keyboard operable
- Gallery filtering, lightbox, Escape and focus return
- Office maps load only on request; external embed mocked
- All three forms: mocked success, payload, Back/pageshow, validation, consent, honeypot, offline, HTTP/network/JSON/provider failure, 20s timeout, WhatsApp and no-JS POST fallback passed; no real requests sent.
- Callback prefill and reduced motion
- Public content readable without JavaScript
