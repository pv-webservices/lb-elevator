# Google Search Console — LB Elevators

Prepared 31 October 2026. Canonical origin: https://www.lbelevators.com/.

## Before submitting URLs

Deploy the reviewed changes through the existing Vercel Git integration only after approval to commit/push. No deployment was performed by this audit.

- HTTPS must return 200 on the canonical host. HTTP and the non-www host must redirect to HTTPS www.
- `/index.html` must redirect to `/`; `/about-us` must redirect to `/about-us/`.
- `/robots.txt` must allow crawling and reference `/sitemap-index.xml`.
- `/sitemap-index.xml` must reference `/sitemap.xml`; the child sitemap must contain the 18 URLs below with lastmod dates.
- A random nonexistent URL must return HTTP **404**, display the branded error page, have `noindex, follow`, and omit a canonical.
- Check security headers and favicon URLs with `npm run verify:live`.
- Activate FormSubmit and verify one approved real enquiry, including Inbox/Spam, all fields, subject, Reply-To and the website thank-you redirect. A mocked test cannot establish inbox delivery.
- Approve the draft privacy policy and terms, office details, representative imagery and remaining brochure claims before treating launch as complete.

The current public deployment was crawl-blocked at the start of the audit. Run the checks again after deploying; local results do not establish live behaviour.

## Domain verification in Hostinger

DNS lookup on 31 October 2026 returned `athena.dns-parking.com` and `apollo.dns-parking.com`; DNS is managed at Hostinger. The www CNAME points to Vercel. Do not change nameservers, A/CNAME records or mail records for Search Console verification.

1. Open [Google Search Console](https://search.google.com/search-console/) using the account that should own the property.
2. Add property → **Domain** → enter `lbelevators.com` (no scheme, path or www).
3. Copy the complete `google-site-verification=…` TXT value Google supplies. It is a public verification record, not a Gmail password.
4. In Hostinger hPanel, open **Domains → Domain portfolio → lbelevators.com → DNS / Nameservers → DNS records**. Labels may vary slightly; use the DNS Zone Editor for this domain.
5. Add a **TXT** record with Name `@`, the copied Google value as Content, and the default TTL. Preserve all existing TXT records.
6. Save and return to Search Console → Verify. If DNS has not propagated, retry later; allow up to 24–48 hours. Leave the verification TXT record in place after verification.

References: [Google ownership verification](https://support.google.com/webmasters/answer/9008080), [Hostinger TXT records](https://www.hostinger.com/support/1583664-how-to-manage-txt-records-at-hostinger/).

## Submit the sitemap

Select the verified Domain property → Sitemaps → submit `https://www.lbelevators.com/sitemap-index.xml`. For a URL-prefix property, the field may accept just `sitemap-index.xml`.

The index references the child sitemap containing every **indexable** page, including product and service details. Utility and draft legal pages are deliberately excluded. A sitemap helps discovery; it does not guarantee indexing or ranking.

An XML browser message saying “no style information” is normal: a sitemap is machine-readable data, not a designed webpage. Pending processing can be temporary during the first 24 hours. A temporary “Couldn't fetch” can also occur, but treat it as a reason to check the live XML URL, HTTP status, robots access and Search Console error details immediately; 24 hours is not a guaranteed grace period. If URLs are healthy, retry after propagation/processing and investigate persistent errors.

Reference: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).

## Exact indexable URL inventory: 18

### Main business pages — 9

- https://www.lbelevators.com/
- https://www.lbelevators.com/about-us/
- https://www.lbelevators.com/elevators/
- https://www.lbelevators.com/services/
- https://www.lbelevators.com/elevator-door-types/
- https://www.lbelevators.com/applications/
- https://www.lbelevators.com/gallery/
- https://www.lbelevators.com/contact-us/
- https://www.lbelevators.com/request-a-quote/

### Elevator details — 5

- https://www.lbelevators.com/elevators/passenger-lifts/
- https://www.lbelevators.com/elevators/goods-lifts/
- https://www.lbelevators.com/elevators/home-lifts/
- https://www.lbelevators.com/elevators/hospital-lifts/
- https://www.lbelevators.com/elevators/capsule-panoramic-lifts/

### Service details — 4

- https://www.lbelevators.com/services/elevator-installation/
- https://www.lbelevators.com/services/elevator-maintenance/
- https://www.lbelevators.com/services/elevator-modernization/
- https://www.lbelevators.com/services/amc-service/

`npm run audit` verifies this inventory against the built HTML and sitemap. Update this guide whenever routes or indexing decisions change.

## Manual Request indexing batches

Use URL Inspection → Test live URL → Request indexing after live checks pass. Google controls quotas; approximately 10 per day is a suggested work schedule, not a promised allowance. Do not repeatedly request an unchanged URL.

**Day 1 — 10 priority pages:** homepage, contact-us, request-a-quote, elevators, services, elevators/passenger-lifts, elevators/home-lifts, elevators/goods-lifts, services/elevator-installation, services/elevator-maintenance (use the full canonical URLs above).

**Day 2 — 8 pages:** about-us, elevator-door-types, applications, gallery, elevators/hospital-lifts, elevators/capsule-panoramic-lifts, services/elevator-modernization, services/amc-service.

## Do not request indexing

- `/404.html` and nonexistent URLs: error pages, HTTP 404, `noindex, follow`.
- `/thank-you/`: delivery acknowledgement with no search value; `noindex, follow`.
- `/privacy-policy/` and `/terms-and-conditions/`: incomplete business/legal review; currently `noindex, follow`. Confirm whether to index them after approved final copy is supplied.
- Duplicate host/protocol, `/index.html`, and tracking/query variations: submit the clean HTTPS www URL instead.

Noindex pages remain crawlable so Google can read the noindex directive. Do not add robots.txt Disallow rules for them.

## Favicon

The homepage and all other pages link the favicon family and manifest. Verify HTTP 200 for `/favicon.ico`, `/favicon.svg`, `/favicon-48x48.png`, `/favicon-96x96.png`, `/favicon-192x192.png`, `/favicon-512x512.png`, `/apple-touch-icon.png` and `/site.webmanifest` after deployment.

Google may take days to weeks to update the search icon. Requesting indexing of the homepage can prompt a recrawl, but cannot guarantee a faster update or that Google will display the icon. Keep the icon URL stable and crawlable.

Reference: [Google favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search).

## Weeks 1–4

1. **Week 1:** confirm sitemap success and inspect priority URLs. Check Pages for blocked/noindex, redirect, canonical and server errors. Expected exclusions are the four utility/legal routes above. Validate LocalBusiness, WebSite and breadcrumb markup in Google's Rich Results Test / Schema.org validator; Search Console only shows reports for supported detected features.
2. **Week 2:** review discovered/crawled-but-not-indexed URLs and canonical selections; improve relevant content/internal links where needed. Review mobile PageSpeed and available Core Web Vitals field data. New or low-traffic sites may have insufficient field data. Lab TBT is not field INP.
3. **Week 3:** verify Google Business Profile ownership and accurate real-world name, addresses, phone numbers and website. Confirm each office is eligible before creating separate listings; never invent reviews or locations. Add/verify the domain in Bing Webmaster Tools and submit the sitemap, or import the verified Search Console property when offered.
4. **Week 4:** review clicks, impressions, queries and indexed pages; fix concrete errors and compare mobile performance. Check breadcrumbs and organization markup where supported. There are currently no blog posts or FAQ sections, so Article/FAQ markup and associated reports are not applicable; a missing optional report is not itself a failure. Do not promise an FAQ rich result.
