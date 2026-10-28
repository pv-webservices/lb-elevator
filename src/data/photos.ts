// Supplied photographs and site videos prepared by scripts/import-site-media.py.
import manifest from './photos.json';

export interface Photo {
  id: string;
  alt: string;
  category: string;
  products: string[];
  src: string;
  small: string;
  srcset: string;
  w: number;
  h: number;
}

export interface Video {
  id: string;
  alt: string;
  src: string;
  poster: string;
  w: number;
  h: number;
}

export const photoCategories = manifest.categories;

export const photos: Photo[] = manifest.photos.map((p) => ({
  id: p.id,
  alt: p.alt,
  category: p.category,
  products: p.products,
  src: `/images/photos/${p.id}.webp`,
  small: `/images/photos/${p.id}-sm.webp`,
  srcset: `/images/photos/${p.id}-sm.webp 480w, /images/photos/${p.id}.webp ${p.w}w`,
  w: p.w,
  h: p.h,
}));

export const videos: Video[] = manifest.videos.map((v) => ({
  id: v.id,
  alt: v.alt,
  src: `/videos/${v.id}.mp4`,
  poster: `/videos/${v.id}.webp`,
  w: v.w,
  h: v.h,
}));

export function photo(id: string): Photo {
  const found = photos.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown photo id: ${id}`);
  return found;
}

export function video(id: string): Video {
  const found = videos.find((v) => v.id === id);
  if (!found) throw new Error(`Unknown video id: ${id}`);
  return found;
}

export const photosFor = (product: string) =>
  photos.filter((p) => p.products.includes(product));
