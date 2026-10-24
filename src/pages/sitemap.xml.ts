import type { APIRoute } from 'astro';
import { products, services } from '../data/site';
export const GET: APIRoute = () => {
  const origin = import.meta.env.PUBLIC_SITE_URL;
  const paths = [
    '/',
    '/about-us/',
    '/elevators/',
    ...products.map((p) => `/elevators/${p.slug}/`),
    '/services/',
    ...services.map((s) => `/services/${s.slug}/`),
    '/elevator-door-types/',
    '/applications/',
    '/gallery/',
    '/contact-us/',
    '/request-a-quote/',
  ];
  const urls = origin
    ? paths
        .map(
          (path) =>
            `<url><loc>${new URL(path, origin).href.replaceAll('&', '&amp;')}</loc></url>`,
        )
        .join('')
    : '';
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
