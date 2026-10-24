import type { APIRoute } from 'astro';
export const GET: APIRoute = () => {
  const origin = import.meta.env.PUBLIC_SITE_URL;
  return new Response(
    origin
      ? `User-agent: *\nAllow: /\nDisallow: /privacy-policy/\nDisallow: /terms-and-conditions/\nSitemap: ${new URL('/sitemap.xml', origin).href}\n`
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain' } },
  );
};
