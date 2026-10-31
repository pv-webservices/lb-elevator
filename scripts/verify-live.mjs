// Read-only checks. Never POST to FormSubmit or trigger activation from this script.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
const origin = 'https://www.lbelevators.com';
const results = [], failures = [];
const check = (pass, name) => { results.push({ name, pass: Boolean(pass) }); if (!pass) failures.push(name); };
async function get(path) { const response = await fetch(path.startsWith('http') ? path : origin + path, { redirect: 'manual', signal: AbortSignal.timeout(20000) }); return { response, body: await response.text() }; }
const { response: home, body } = await get('/');
const local = load(await readFile('dist/index.html','utf8')), live = load(body);
check(home.status === 200, 'HTTPS homepage 200');
const release = local('meta[name=lb-release]').attr('content');
check(release && release === live('meta[name=lb-release]').attr('content'), 'Live source fingerprint matches local build');
check(live('link[rel=canonical]').attr('href') === origin + '/', 'Homepage canonical');
for (const [path, expected] of [['http://www.lbelevators.com/', origin+'/'],['https://lbelevators.com/',origin+'/'],['/index.html',origin+'/'],['/about-us',origin+'/about-us/']]) {
  const { response } = await get(path);
  const location = response.headers.get('location');
  check([301,308].includes(response.status) && location && new URL(location, origin).href === expected, `Permanent redirect ${path}`);
}
for (const name of ['x-content-type-options','referrer-policy','x-frame-options']) check(Boolean(home.headers.get(name)), `Header ${name}`);
const { response: missing, body: missingHtml } = await get('/nonexistent-lb-audit-page/');
const errorPage = load(missingHtml);
check(missing.status === 404 && errorPage('meta[name=robots]').attr('content') === 'noindex, follow' && !errorPage('link[rel=canonical]').length, 'Branded 404 status and metadata');
const { body: robots } = await get('/robots.txt');
check(robots.includes('Allow: /') && !robots.includes('Disallow:') && robots.includes(origin+'/sitemap-index.xml'), 'robots allows crawling and sitemap');
for (const path of ['/sitemap-index.xml','/sitemap.xml']) {
  const { response, body } = await get(path);
  check(response.status === 200 && body === await readFile('dist'+path,'utf8'), `Sitemap matches build: ${path}`);
}
for (const path of ['/favicon.ico','/favicon.svg','/favicon-48x48.png','/favicon-96x96.png','/favicon-192x192.png','/favicon-512x512.png','/apple-touch-icon.png','/site.webmanifest','/thank-you/']) {
  const { response } = await get(path); check(response.status === 200, `HTTP 200 ${path}`);
}
const script = live('script[src]').first().attr('src');
if (script) { const { response } = await get(script); check(response.headers.get('cache-control')?.includes('31536000'), 'Hashed assets long cache'); }
check(live('form[data-enquiry]').attr('action') === 'https://formsubmit.co/liftsbazar2025@gmail.com', 'Live FormSubmit POST fallback');
check(live('form[data-enquiry]').attr('data-endpoint') === 'https://formsubmit.co/ajax/liftsbazar2025@gmail.com', 'Live AJAX endpoint');
check(live('a.float-whatsapp').attr('href')?.startsWith('https://wa.me/919679112375?text='), 'Live WhatsApp recipient');
// OPTIONS has no submission body and does not test email delivery.
const provider = await fetch('https://formsubmit.co/ajax/liftsbazar2025@gmail.com', { method: 'OPTIONS', signal: AbortSignal.timeout(20000) });
check(provider.ok, 'FormSubmit CORS endpoint reachable (OPTIONS only; delivery untested)');
await mkdir('output/audit',{ recursive:true });
await writeFile('output/audit/live-verification.json', JSON.stringify({ checkedAt: new Date().toISOString(), results, failures }, null, 2));
console.log(JSON.stringify({ results, failures }, null, 2));
assert.deepEqual(failures, [], 'Live deployment checks failed; see output/audit/live-verification.json');
