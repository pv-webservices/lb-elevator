import type { APIRoute } from 'astro';
import { SITE_URL } from '../data/config';
export const GET: APIRoute = () => {
  return new Response(
    `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap-index.xml\n`,
    { headers: { 'Content-Type': 'text/plain' } },
  );
};
