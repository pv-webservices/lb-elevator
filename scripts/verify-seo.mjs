import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const [html, sitemap, robots] = await Promise.all(
  ['dist/index.html', 'dist/sitemap.xml', 'dist/robots.txt'].map((p) =>
    readFile(p, 'utf8'),
  ),
);
if (process.argv.includes('--configured')) {
  assert.match(
    html,
    /rel="canonical" href="https:\/\/lb-elevators.example.test\//,
  );
  assert.equal((sitemap.match(/<url>/g) || []).length, 18);
  assert.match(robots, /Allow: \//);
  console.log(
    'Configured origin: canonical, sitemap and robots passed with a reserved test domain.',
  );
} else {
  assert.match(robots, /Disallow: \//);
  assert.doesNotMatch(html, /rel="canonical"/);
  assert.match(html, /noindex, nofollow/);
  console.log('Unconfigured preview: noindex and crawl blocking restored.');
}
