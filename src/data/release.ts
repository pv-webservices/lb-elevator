import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const hash = createHash('sha256');
const addFile = (path: string) => {
  const bytes = readFileSync(path);
  hash.update(path.replaceAll('\\', '/'));
  hash.update(/\.(astro|ts|mjs|json|css|svg|txt|webmanifest)$/.test(path) ? bytes.toString('utf8').replaceAll('\r\n', '\n') : bytes);
};
function addTree(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) addTree(path);
    else addFile(path);
  }
}
addTree('src');
addTree('public');
for (const path of ['astro.config.mjs','vercel.json','package-lock.json']) addFile(path);
export const release = hash.digest('hex').slice(0, 16);
