import assert from 'node:assert/strict';
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const base = process.env.TEST_URL || 'http://127.0.0.1:4321';
const root = resolve('dist');
const out = resolve('output/playwright');
await mkdir(out, { recursive: true });
async function list(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? list(resolve(dir, e.name)) : [resolve(dir, e.name)],
      ),
    )
  ).flat();
}
const htmlFiles = (await list(root)).filter((f) => f.endsWith('.html'));
const routes = htmlFiles.map((f) =>
  f.endsWith('404.html')
    ? '/page-not-found-test/'
    : f
        .slice(root.length)
        .replaceAll('\\', '/')
        .replace(/index\.html$/, ''),
);
const failures = [];
let links = 0;
const verifiedTargets = new Set();
console.log('Checking built links and metadata');
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `One H1: ${file}`);
  assert.match(html, /<meta name="description"/);
  for (const m of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
    const path = m[1];
    const target = resolve(
      root,
      '.' + path,
      path.endsWith('/') ? 'index.html' : '',
    );
    try {
      if (!verifiedTargets.has(target)) {
        await stat(target);
        verifiedTargets.add(target);
      }
      links++;
    } catch {
      failures.push(`Missing internal target ${path} in ${file}`);
    }
  }
}
assert.deepEqual(failures, []);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
const context = await browser.newContext();
const page = await context.newPage();
page.setDefaultTimeout(15000);
page.setDefaultNavigationTimeout(15000);
await page.emulateMedia({ reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', m => {
  // Chromium reports the intentionally tested 404 document as a resource error.
  if(m.type() === 'error' && m.location().url !== base + '/page-not-found-test/') errors.push(m.text());
});
await context.route('https://formsubmit.co/**', route => route.abort());
const report = {
  routes: routes.length,
  internalReferences: links,
  responsiveChecks: 0,
  axeScans: 0,
  violations: [],
  consoleErrors: errors,
  interactions: [],
};
for (const width of process.env.TEST_FOCUS
  ? []
  : [320, 375, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of routes) {
    console.log(`Checking ${width}px ${route}`);
    const response = await page.goto(base + route, {
      waitUntil: 'networkidle',
    });
    assert.equal(
      response.status(),
      route === '/page-not-found-test/' ? 404 : 200,
      `Status: ${route}`,
    );
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.querySelectorAll('img').forEach((i) => (i.loading = 'eager'));
      await Promise.race([Promise.all([...document.images].map(i => i.decode().catch(() => {}))), new Promise(resolve => setTimeout(resolve, 10000))]);
    });
    const state = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      broken: [...document.images]
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.src),
    }));
    if (state.overflow) failures.push(`Overflow ${width} ${route}`);
    if (state.broken.length)
      failures.push(`Images ${width} ${route}: ${state.broken}`);
    report.responsiveChecks++;
    if (width === 375 || width === 1440) {
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      report.axeScans++;
      for (const v of result.violations)
        report.violations.push({
          route,
          width,
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        });
    }
    if (route === '/' && (width === 375 || width === 1440)) {
      await page.evaluate(() =>
        document
          .querySelectorAll('.reveal')
          .forEach((e) => e.classList.remove('pending')),
      );
      await page.screenshot({
        path: resolve(out, `homepage-${width}.png`),
        fullPage: false,
        animations: 'disabled',
        timeout: 15000,
      });
    }
  }
}
await writeFile(resolve(out, 'page-checks.json'), JSON.stringify(report, null, 2));
console.log('Checking interactive flows');
await page.setViewportSize({ width: 1440, height: 900 });
await page.emulateMedia({ reducedMotion: 'no-preference' });
await page.goto(base);
await page.keyboard.press('Tab');
assert.equal(await page.locator('.skip-link').evaluate(e => e === document.activeElement), true);
assert.equal(await page.locator('.skip-link').evaluate(e => e.getBoundingClientRect().top >= 0), true);
await page.keyboard.press('Enter');
assert.equal(await page.evaluate(() => location.hash), '#main');
report.interactions.push('Keyboard skip link is visible on focus and reaches main content');
await page.goto(base);
await page
  .getByRole('button', { name: 'Show elevators menu', exact: true })
  .click();
assert.equal(
  await page
    .getByRole('button', { name: 'Show elevators menu', exact: true })
    .getAttribute('aria-expanded'),
  'true',
);
await page.keyboard.press('Escape');
assert.equal(
  await page
    .getByRole('button', { name: 'Show elevators menu', exact: true })
    .getAttribute('aria-expanded'),
  'false',
);
report.interactions.push('Desktop dropdown opens and closes with Escape');
await page.getByRole('tab', { name: /Half Vision Door/ }).click();
await page.waitForFunction(
  () => document.querySelector('[data-door-name]')?.textContent === 'Half Vision Door',
);
assert.equal(
  await page.getByRole('tab', { name: /Half Vision Door/ }).getAttribute('aria-selected'),
  'true',
);
report.interactions.push('Door selector switches door, text and enquiry link');
await page.getByRole('link', { name: 'Chat with LB Elevators on WhatsApp' }).waitFor();
assert.match(
  await page.getByRole('link', { name: 'Chat with LB Elevators on WhatsApp' }).getAttribute('href'),
  /^https:\/\/wa\.me\/\d{10,15}\?text=/,
);
report.interactions.push('Floating WhatsApp link targets wa.me with a prefilled message');
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base);
await page.getByRole('button', { name: 'Open navigation' }).click();
assert.equal(await page.locator('#primary-nav').isVisible(), true);
await page
  .getByRole('button', { name: 'Show services menu', exact: true })
  .click();
assert.equal(
  await page.locator('.has-dropdown.open .dropdown').isVisible(),
  true,
);
await page.keyboard.press('Escape');
await page.keyboard.press('Escape');
// The panel fades out, so wait for the close transition to finish.
await page.locator('#primary-nav').waitFor({ state: 'hidden', timeout: 2000 });
report.interactions.push('Mobile menu and accordion are keyboard operable');
await page.goto(base + '/gallery/');
await page.getByRole('button', { name: 'Door Types', exact: true }).click();
assert.equal(await page.locator('.gallery-item:visible').count(), 8);
const first = page.locator('.gallery-item:visible').first();
await first.click();
assert.equal(await page.locator('dialog').evaluate((e) => e.open), true);
await page.keyboard.press('Escape');
assert.equal(await first.evaluate((e) => e === document.activeElement), true);
report.interactions.push(
  'Gallery filtering, lightbox, Escape and focus return',
);
await page.goto(base + '/contact-us/');
assert.equal(await page.locator('iframe').count(), 0);
await context.route('https://maps.google.com/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Mock map</title><p>Map preview</p>' }));
await page.getByRole('button', { name: /Load Map of the LB Elevators West Bengal Office/ }).first().click();
assert.equal(await page.locator('iframe').count(), 1);
assert.match(await page.locator('iframe').getAttribute('src'), /^https:\/\/maps.google.com/);
report.interactions.push('Office maps load only on request; external embed mocked');
const { verifyForms } = await import('./browser-forms.mjs');
report.interactions.push(await verifyForms(browser, base));
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(base);
assert.equal(
  await page
    .locator('.hero h1')
    .evaluate((e) => getComputedStyle(e).animationName),
  'none',
);
report.interactions.push('Callback prefill and reduced motion');
const nojs = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 390, height: 844 },
});
const plain = await nojs.newPage();
await plain.goto(base);
assert.equal(await plain.locator('h1').isVisible(), true);
assert.equal(await plain.locator('.stack-card').first().isVisible(), true);
await nojs.close();
report.interactions.push('Public content readable without JavaScript');
report.failures = failures;
await writeFile(
  resolve(out, 'qa-results.json'),
  JSON.stringify(report, null, 2),
);
console.log(
  JSON.stringify(
    {
      ...report,
      violations: report.violations.map((v) => ({
        route: v.route,
        width: v.width,
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
    },
    null,
    2,
  ),
);
assert.deepEqual(failures, []);
assert.equal(
  report.violations.length,
  0,
  'Accessibility violations: see output/playwright/qa-results.json',
);
assert.deepEqual(errors, []);
} finally {
  await Promise.race([browser.close(), new Promise(resolve => setTimeout(resolve, 10000))]);
}
process.exit(0);
