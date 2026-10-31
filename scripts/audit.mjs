import assert from 'node:assert/strict';
import { readdir, readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { load } from 'cheerio';
const root = resolve('dist');
const origin = 'https://www.lbelevators.com';
const imageSizes = JSON.parse(await readFile('src/data/image-sizes.json', 'utf8'));
const walk = async dir => (await Promise.all((await readdir(dir, { withFileTypes: true })).map(e => e.isDirectory() ? walk(resolve(dir, e.name)) : [resolve(dir, e.name)]))).flat();
const files = await walk(root);
const pages = new Map();
for (const file of files.filter(f => f.endsWith('.html'))) {
  const route = '/' + relative(root, file).replaceAll('\\', '/').replace(/index\.html$/, '');
  pages.set(route, load(await readFile(file, 'utf8')));
}
const issues = [], titles = new Set(), descriptions = new Set(), indexable = [];
const check = (pass, message) => { if (!pass) issues.push(message); };
for (const [route, $] of pages) {
  const title = $('title').text(), description = $('meta[name=description]').attr('content') || '';
  const robots = $('meta[name=robots]').attr('content');
  const noindex = robots?.includes('noindex');
  check(title.length > 0 && title.length <= 65, `${route}: title length ${title.length}`);
  check(!titles.has(title), `${route}: duplicate title`); titles.add(title);
  check(description.length >= 70 && description.length <= 170, `${route}: description length ${description.length}`);
  check(!descriptions.has(description), `${route}: duplicate description`); descriptions.add(description);
  check($('h1').length === 1, `${route}: exactly one H1 required`);
  let level = 0;
  $('h1,h2,h3,h4,h5,h6').each((_i, el) => { const next = Number(el.tagName[1]); check(next <= level + 1, `${route}: skipped H${level} → H${next}`); level = next; });
  check(noindex ? robots === 'noindex, follow' : robots === 'index, follow, max-image-preview:large', `${route}: robots value`);
  check(noindex ? $('link[rel=canonical]').length === 0 : $('link[rel=canonical]').attr('href') === origin + route, `${route}: canonical`);
  if (!noindex) { indexable.push(origin + route); check(/^\/(?:[a-z0-9-]+\/)*$/.test(route), `${route}: URL format`); }
  for (const property of ['title','description','url','type','site_name','image','image:width','image:height','image:alt']) check(Boolean($(`meta[property="og:${property}"]`).attr('content')), `${route}: missing og:${property}`);
  for (const name of ['card','title','description','image','image:alt']) check(Boolean($(`meta[name="twitter:${name}"]`).attr('content')), `${route}: missing twitter:${name}`);
  check($('meta[property="og:image:width"]').attr('content') === '1200' && $('meta[property="og:image:height"]').attr('content') === '630', `${route}: OG dimensions`);
  check($('link[rel=icon]').length >= 4 && $('link[rel=manifest]').length === 1 && $('link[rel=apple-touch-icon]').length === 1, `${route}: icon family`);
  const schemas = [];
  $('script[type="application/ld+json"]').each((_i, el) => {
    const raw = $(el).html(); check(!raw.includes('<'), `${route}: unescaped JSON-LD`);
    try { const parsed = JSON.parse(raw); schemas.push(...(parsed['@graph'] || [parsed])); } catch { issues.push(`${route}: invalid JSON-LD`); }
  });
  const business = schemas.find(s => s['@type'] === 'LocalBusiness');
  check(business?.['@id'] && business.address && business.telephone && business.logo, `${route}: business schema fields`);
  check(schemas.some(s => s['@type'] === 'WebSite'), `${route}: WebSite schema`);
  if (route !== '/' && route !== '/404.html') check(schemas.some(s => s['@type'] === 'BreadcrumbList'), `${route}: breadcrumb schema`);
  if (route === '/about-us/') check(schemas.some(s => s['@type'] === 'Person'), `${route}: director schema`);
  if ($('article[data-post]').length) check(schemas.some(s => s['@type'] === 'Article') && $('meta[property="og:type"]').attr('content') === 'article', `${route}: Article schema/type`);
  if ($('[data-faq]').length) check(schemas.some(s => s['@type'] === 'FAQPage'), `${route}: FAQ schema`);
  $('img').each((_i, el) => {
    const dimensions = imageSizes[$(el).attr('src')];
    if (dimensions) check(Number($(el).attr('width')) === dimensions.width && Number($(el).attr('height')) === dimensions.height, `${route}: image dimensions must match file ${$(el).attr('src')}`);
    check($(el).attr('alt') !== undefined, `${route}: missing alt`);
    check(Number($(el).attr('width')) > 0 && Number($(el).attr('height')) > 0, `${route}: image dimensions`);
    if ($(el).attr('fetchpriority') === 'high') check($(el).attr('loading') === 'eager', `${route}: LCP loading`);
    else if (!$(el).attr('src')?.includes('/brand/')) check($(el).attr('loading') === 'lazy', `${route}: below-fold loading`);
    check(Boolean($(el).attr('srcset')), `${route}: responsive image`);
  });
  const refs = [];
  $('[href],[src],[poster],[data-full]').each((_i, el) => { for (const attr of ['href','src','poster','data-full']) if ($(el).attr(attr)) refs.push($(el).attr(attr)); });
  $('[srcset],[imagesrcset]').each((_i, el) => { for (const attr of ['srcset','imagesrcset']) for (const part of ($(el).attr(attr) || '').split(',')) if (part.trim()) refs.push(part.trim().split(/\s+/)[0]); });
  for (const ref of refs) {
    let url; try { url = new URL(ref, origin + route); } catch { issues.push(`${route}: invalid URL ${ref}`); continue; }
    if (url.origin !== origin) continue;
    const target = resolve(root, '.' + decodeURIComponent(url.pathname), url.pathname.endsWith('/') ? 'index.html' : '');
    try { await stat(target); } catch { issues.push(`${route}: broken reference ${ref}`); }
    if (url.hash) {
      const targetPage = pages.get(url.pathname);
      if (targetPage) check(targetPage('[id]').toArray().some(el => targetPage(el).attr('id') === decodeURIComponent(url.hash.slice(1))), `${route}: missing fragment ${ref}`);
    }
  }
}
const sitemap = load(await readFile('dist/sitemap.xml', 'utf8'), { xmlMode: true });
const urls = sitemap('url > loc').map((_i,e) => sitemap(e).text()).get();
check(JSON.stringify([...urls].sort()) === JSON.stringify([...indexable].sort()), 'Sitemap must exactly match indexable pages');
check(urls.length === new Set(urls).size, 'Duplicate sitemap URLs');
check(sitemap('url > lastmod').length === urls.length, 'Missing sitemap lastmod');
const robots = await readFile('dist/robots.txt','utf8');
check(robots.includes('Allow: /') && !robots.includes('Disallow:') && robots.includes(`${origin}/sitemap-index.xml`), 'robots.txt crawl access / sitemap');
check((await readFile('dist/sitemap-index.xml','utf8')).includes(`${origin}/sitemap.xml`), 'Sitemap index child');
await mkdir('output/audit', { recursive: true });
await writeFile('output/audit/seo.json', JSON.stringify({ pages: pages.size, indexable, issues }, null, 2));
console.log(JSON.stringify({ pages: pages.size, indexable: indexable.length, issues }, null, 2));
assert.deepEqual(issues, []);
