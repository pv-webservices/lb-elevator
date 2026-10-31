import lighthouse from 'lighthouse';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
const phase = process.argv[2] || 'after';
const reservation = createServer();
await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve));
const port = reservation.address().port;
await new Promise(resolve => reservation.close(resolve));
const browser = await chromium.launch({ channel: 'chrome', args: [`--remote-debugging-port=${port}`], headless: true });
await mkdir('output/lighthouse', { recursive: true });
try {
  for (const [name, path] of [['home', '/'], ['inner', '/elevators/home-lifts/']]) {
    const result = await lighthouse(`${process.env.PERF_URL || "http://127.0.0.1:4321"}${path}`, { port, output: 'html', onlyCategories: ['performance'], logLevel: 'error' });
    const { lhr } = result;
    await writeFile(`output/lighthouse/${phase}-${name}-full.json`, JSON.stringify(lhr));
    await writeFile(`output/lighthouse/${phase}-${name}.html`, result.report);
    const metrics = { lighthouseVersion: lhr.lighthouseVersion, score: lhr.categories.performance.score * 100, LCP: lhr.audits['largest-contentful-paint'].numericValue, CLS: lhr.audits['cumulative-layout-shift'].numericValue, TBT: lhr.audits['total-blocking-time'].numericValue,
      issues: Object.values(lhr.audits).filter(a => a.score !== null && a.score < 1 && a.details).map(a => ({ id: a.id, title: a.title, displayValue: a.displayValue })) };
    await writeFile(`output/lighthouse/${phase}-${name}.json`, JSON.stringify(metrics, null, 2));
    console.log(phase, name, JSON.stringify(metrics));
  }
} finally {
  // Extra CDP sessions can delay Chrome shutdown after the reports are written.
  await Promise.race([browser.close(), new Promise(resolve => setTimeout(resolve, 10000))]);
}
process.exit(0);
