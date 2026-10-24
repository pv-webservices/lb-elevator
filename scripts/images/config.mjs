// Central configuration for server-side OpenAI image generation.
// Every value can be overridden through environment variables so models,
// quality tiers and sizes can change without touching the generator.
const env = process.env;

export const imageConfig = {
  endpoint: env.OPENAI_IMAGE_ENDPOINT || 'https://api.openai.com/v1/images/generations',
  models: {
    // Default, cost-efficient model for routine website imagery.
    flare: env.OPENAI_IMAGE_MODEL_FLARE || 'gpt-image-2.5-flare',
    // Premium model for hero, photoreal, architectural or detail-sensitive work.
    sunburst: env.OPENAI_IMAGE_MODEL_SUNBURST || 'gpt-image-2.5-sunburst',
  },
  quality: {
    default: env.OPENAI_IMAGE_QUALITY_DEFAULT || 'medium',
    premium: env.OPENAI_IMAGE_QUALITY_PREMIUM || 'high',
  },
  sizes: {
    square: env.OPENAI_IMAGE_SIZE_SQUARE || '1024x1024',
    landscape: env.OPENAI_IMAGE_SIZE_LANDSCAPE || '1536x1024',
    portrait: env.OPENAI_IMAGE_SIZE_PORTRAIT || '1024x1536',
  },
  output: {
    dir: 'public/images/gen',
    // Responsive widths written for every generated asset (largest first).
    widths: { landscape: [1536, 900], portrait: [1000, 600], square: [1000, 600] },
    webpQuality: Number(env.IMAGE_WEBP_QUALITY || 80),
  },
  requestTimeoutMs: Number(env.OPENAI_IMAGE_TIMEOUT_MS || 180000),
};

// Placement priorities that always justify the premium tier.
const PREMIUM_PLACEMENTS = new Set(['hero', 'banner']);
// Subject traits that need the premium model's precision.
const PREMIUM_TRAITS = new Set([
  'photoreal-architecture',
  'interior-space',
  'industrial-machinery',
  'people-at-work',
  'complex-lighting',
  'multiple-subjects',
  'reference-edit',
]);

/**
 * Pick model and quality for an asset from its placement and traits, so
 * nobody has to choose a model per image. `forcePremium` is used when a
 * Flare result was reviewed and judged insufficient for an important asset.
 */
export function routeImage(asset, { forcePremium = false } = {}) {
  const premiumPlacement = PREMIUM_PLACEMENTS.has(asset.placement);
  const traitHits = (asset.traits || []).filter((t) => PREMIUM_TRAITS.has(t));
  // One trait alone is not enough on a supporting image; two signal real complexity.
  const complex = traitHits.length >= 2 || (traitHits.length >= 1 && asset.importance === 'high');
  const useSunburst = forcePremium || premiumPlacement || complex;
  const highQuality = premiumPlacement || asset.importance === 'high';
  return {
    model: useSunburst ? imageConfig.models.sunburst : imageConfig.models.flare,
    tier: useSunburst ? 'sunburst' : 'flare',
    quality: highQuality ? imageConfig.quality.premium : imageConfig.quality.default,
    size: imageConfig.sizes[asset.orientation],
    reason: forcePremium
      ? 'upgraded after insufficient Flare result'
      : premiumPlacement
        ? `${asset.placement} placement`
        : complex
          ? `complex subject (${traitHits.join(', ')})`
          : 'standard supporting visual',
  };
}
