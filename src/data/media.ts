// Resolves generated imagery at build time. A generated WebP is used once it
// exists in public/images/illustrations/; otherwise the existing project image is used,
// so no section ever renders an empty or placeholder image.
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import manifest from './generated-images.json';
import imageSizes from './image-sizes.json';

export interface Media {
  src: string;
  srcset: string;
  alt: string;
  generated: boolean;
}

export function media(id: string): Media {
  const asset = manifest.assets.find((a) => a.id === id);
  if (!asset) throw new Error(`Unknown media id: ${id}`);
  const large = `/images/illustrations/${id}.webp`;
  // Matches imageConfig.output.widths in scripts/images/config.mjs.
  const sizes = asset.orientation === 'landscape' ? [900, 1536] : [600, 1000];
  if (existsSync(resolve('public', large.slice(1)))) {
    return {
      src: large,
      srcset: (imageSizes as Record<string, { srcset: string }>)[large]?.srcset ?? `${large} ${sizes[1]}w`,
      alt: asset.alt,
      generated: true,
    };
  }
  const fb = asset.fallback;
  const src = `/images/${fb === 'hero' ? 'illustrations' : 'catalogue'}/${fb}.webp`;
  return { src, srcset: (imageSizes as Record<string, { srcset: string }>)[src].srcset, alt: asset.alt, generated: false };
}
