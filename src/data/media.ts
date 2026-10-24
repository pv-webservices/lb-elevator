// Resolves generated imagery at build time. A generated WebP is used once it
// exists in public/images/gen/; otherwise the existing project image is used,
// so no section ever renders an empty or placeholder image.
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import manifest from './generated-images.json';

export interface Media {
  src: string;
  srcset: string;
  alt: string;
  generated: boolean;
}

// Responsive widths of the existing (fallback) assets in public/images/.
const fallbackSets: Record<string, string> = {
  hero: '/images/hero-mobile.webp 768w, /images/hero.webp 1536w',
};

export function media(id: string): Media {
  const asset = manifest.assets.find((a) => a.id === id);
  if (!asset) throw new Error(`Unknown media id: ${id}`);
  const large = `/images/gen/${id}.webp`;
  // Matches imageConfig.output.widths in scripts/images/config.mjs.
  const sizes = asset.orientation === 'landscape' ? [900, 1536] : [600, 1000];
  if (existsSync(resolve('public', large.slice(1)))) {
    return {
      src: large,
      srcset: `/images/gen/${id}-sm.webp ${sizes[0]}w, ${large} ${sizes[1]}w`,
      alt: asset.alt,
      generated: true,
    };
  }
  const fb = asset.fallback;
  const small = existsSync(resolve('public/images', `${fb}-small.webp`))
    ? `/images/${fb}-small.webp 420w, `
    : '';
  return {
    src: `/images/${fb}.webp`,
    srcset: fallbackSets[fb] || `${small}/images/${fb}.webp 960w`,
    alt: asset.alt,
    generated: false,
  };
}
