import type { APIRoute } from 'astro';
import { SITE_URL, CONTENT_MODIFIED } from '../data/config';
export const GET: APIRoute = () => new Response(
  `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${SITE_URL}/sitemap.xml</loc><lastmod>${CONTENT_MODIFIED}</lastmod></sitemap></sitemapindex>`,
  { headers: { 'Content-Type': 'application/xml' } },
);
