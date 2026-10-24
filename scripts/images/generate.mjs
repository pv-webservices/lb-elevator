// Server-side image generation. Runs in Node only; the API key is read from
// the environment (or the git-ignored .env) and never reaches the browser.
//
//   node scripts/images/generate.mjs                 generate missing assets
//   node scripts/images/generate.mjs --plan          show routing, call nothing
//   node scripts/images/generate.mjs --only=a,b      limit to asset ids
//   node scripts/images/generate.mjs --force         regenerate existing files
//   node scripts/images/generate.mjs --upgrade=id    redo an asset on Sunburst
//   node scripts/images/generate.mjs --reoptimize    rebuild WebPs from saved originals (no API calls)
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { imageConfig, routeImage } from './config.mjs';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }),
);
const manifest = JSON.parse(await readFile(resolve('src/data/generated-images.json'), 'utf8'));
const only = args.only ? new Set(String(args.only).split(',')) : null;
const upgrade = args.upgrade ? new Set(String(args.upgrade).split(',')) : new Set();
const outDir = resolve(imageConfig.output.dir);

async function loadKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  try {
    const env = await readFile(resolve('.env'), 'utf8');
    const line = env.split(/\r?\n/).find((l) => l.startsWith('OPENAI_API_KEY='));
    // Accept quoted values (KEY="..." or KEY='...') as dotenv does.
    return line?.slice('OPENAI_API_KEY='.length).trim().replace(/^(['"])(.*)\1$/, '$2') || '';
  } catch {
    return '';
  }
}

const exists = (p) => access(p).then(() => true, () => false);

async function generate(asset, route, key) {
  const response = await fetch(imageConfig.endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: route.model,
      prompt: `${asset.prompt}\n\n${manifest.style}`,
      size: route.size,
      quality: route.quality,
      n: 1,
    }),
    signal: AbortSignal.timeout(imageConfig.requestTimeoutMs),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${response.status} ${body.error?.message || response.statusText}`);
  }
  const item = body.data?.[0];
  if (item?.b64_json) return Buffer.from(item.b64_json, 'base64');
  if (item?.url) return Buffer.from(await (await fetch(item.url)).arrayBuffer());
  throw new Error('Response contained no image data');
}

async function optimize(asset, buffer) {
  await mkdir(outDir, { recursive: true });
  // Keep the untouched original out of public/ so it is never deployed.
  await mkdir(resolve('output/generated-originals'), { recursive: true });
  await writeFile(resolve('output/generated-originals', `${asset.id}.png`), buffer);
  const [large, small] = imageConfig.output.widths[asset.orientation];
  const quality = imageConfig.output.webpQuality;
  await sharp(buffer).resize({ width: large, withoutEnlargement: true }).webp({ quality }).toFile(resolve(outDir, `${asset.id}.webp`));
  await sharp(buffer).resize({ width: small }).webp({ quality: quality - 2 }).toFile(resolve(outDir, `${asset.id}-sm.webp`));
}

if (args.reoptimize) {
  for (const asset of manifest.assets) {
    if (only && !only.has(asset.id)) continue;
    const original = resolve('output/generated-originals', `${asset.id}.png`);
    if (!(await exists(original))) continue;
    await optimize(asset, await readFile(original));
    console.log(`reoptimized ${asset.id}`);
  }
  process.exit(0);
}

const key = args.plan ? '' : await loadKey();
if (!args.plan && !key) {
  console.error('OPENAI_API_KEY is not set. Add it to the environment or the git-ignored .env file.');
  process.exit(1);
}

let failed = 0;
for (const asset of manifest.assets) {
  if (only && !only.has(asset.id)) continue;
  const route = routeImage(asset, { forcePremium: upgrade.has(asset.id) });
  const label = `${asset.id.padEnd(22)} ${route.tier.padEnd(8)} ${route.quality.padEnd(6)} ${route.size.padEnd(9)} ${route.reason}`;
  if (args.plan) {
    console.log(label);
    continue;
  }
  const target = resolve(outDir, `${asset.id}.webp`);
  if (!args.force && !upgrade.has(asset.id) && (await exists(target))) {
    console.log(`skip     ${asset.id} (already generated)`);
    continue;
  }
  try {
    console.log(`generate ${label}`);
    await optimize(asset, await generate(asset, route, key));
    console.log(`saved    ${imageConfig.output.dir}/${asset.id}.webp`);
  } catch (error) {
    failed++;
    console.error(`failed   ${asset.id}: ${error.message}`);
  }
}
process.exitCode = failed ? 1 : 0;
