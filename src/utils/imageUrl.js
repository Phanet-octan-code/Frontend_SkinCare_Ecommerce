/**
 * Centralized Image URL Resolver for SkinCare E-Commerce
 * Handles:
 * 1. Backend API images (relative or full URLs from Render / Laravel)
 * 2. Local frontend public assets with correct Vite base path (GitHub Pages / repo subpaths)
 * 3. Rewriting localhost / 127.0.0.1 to production Render backend
 * 4. Fallback skincare imagery if missing or broken
 */

const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://backend-skincare-ng5o.onrender.com/api/v1';

// Backend host origin, e.g. "https://backend-skincare-ng5o.onrender.com"
export const BACKEND_BASE_URL = RAW_API_BASE.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

// Frontend base path, e.g. "/Frontend_SkinCare_Ecommerce/" on GitHub Pages or "/" in dev
export const FRONTEND_BASE_URL = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');

export const SVG_FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Crect width='800' height='800' fill='%23F4F1EA'/%3E%3Ccircle cx='400' cy='360' r='140' fill='%23EEF2EB'/%3E%3Cpath d='M360 260h80v40h-80zM375 220h50v40h-50zM350 300h100c15 0 25 10 25 25v190c0 20-15 35-35 35H360c-20 0-35-15-35-35V325c0-15 10-25 25-25z' fill='%2371856B' fill-opacity='0.45'/%3E%3Ctext x='400' y='600' font-family='serif' font-size='22' text-anchor='middle' fill='%235A6358' letter-spacing='3'%3EÉLIXIR BOTANIQUE%3C/text%3E%3Ctext x='400' y='630' font-family='sans-serif' font-size='12' text-anchor='middle' fill='%238C9388' letter-spacing='2'%3ECLINICAL DISPENSARY%3C/text%3E%3C/svg%3E";

export const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80';

/**
 * Resolves any image path into a guaranteed valid, environment-aware URL.
 * @param {string} path - URL or relative path
 * @param {string} fallback - fallback image URL
 * @returns {string} Fully qualified or base-aware image URL
 */
export function resolveImageUrl(path, fallback = DEFAULT_FALLBACK_IMAGE) {
  if (!path || typeof path !== 'string') return fallback;

  const trimmed = path.trim();
  if (!trimmed) return fallback;

  // 1. Data URLs or blob URLs
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // 2. Full HTTP / HTTPS URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    // If backend generated a localhost URL (e.g. APP_URL=http://localhost)
    // rewrite it to the live backend URL so it works in deployed environments!
    if (trimmed.includes('localhost') || trimmed.includes('127.0.0.1')) {
      const pathname = trimmed.replace(/^https?:\/\/[^\/]+/, '');
      return `${BACKEND_BASE_URL}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
    }
    return trimmed;
  }

  // 3. Backend storage or images paths:
  // e.g. "storage/products/..." or "images/products/..." or "/storage/..." or "/images/..."
  if (
    trimmed.startsWith('storage/') ||
    trimmed.startsWith('/storage/') ||
    trimmed.startsWith('images/') ||
    trimmed.startsWith('/images/')
  ) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${BACKEND_BASE_URL}${cleanPath}`;
  }

  // 4. Local frontend public assets:
  // e.g. "/hero-skincare-set.jpg", "hero-skincare-set.jpg", "brand-story.jpg"
  const cleanAsset = trimmed.replace(/^\//, '');
  return `${FRONTEND_BASE_URL}${cleanAsset}`;
}

/**
 * Image error handler helper that gracefully cascades:
 * 1. If failed URL was from frontend base, try backend URL
 * 2. If failed URL was from backend, try frontend base
 * 3. Fall back to curated skincare fallback
 */
export function handleImageError(e, fallback = DEFAULT_FALLBACK_IMAGE) {
  const currentSrc = e.currentTarget.src || '';

  // If already at SVG fallback, stop
  if (currentSrc.startsWith('data:image/svg+xml')) return;

  // If already at chosen fallback, fall back to pure SVG placeholder
  if (currentSrc === fallback) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = SVG_FALLBACK_IMAGE;
    return;
  }

  // If failed on frontend path (e.g. /Frontend_SkinCare_Ecommerce/hero-skincare-set.jpg), try backend host
  if (currentSrc.includes('github.io') || currentSrc.includes(FRONTEND_BASE_URL)) {
    const filename = currentSrc.split('/').pop()?.split('?')[0];
    if (filename && filename.startsWith('hero-')) {
      const backendHeroUrl = `${BACKEND_BASE_URL}/images/hero/${filename}`;
      if (currentSrc !== backendHeroUrl) {
        e.currentTarget.src = backendHeroUrl;
        return;
      }
    }
  }

  // If failed on backend /storage/ path, try /images/ path
  if (currentSrc.includes('/storage/products/')) {
    const altSrc = currentSrc.replace('/storage/products/', '/images/products/');
    if (currentSrc !== altSrc) {
      e.currentTarget.src = altSrc;
      return;
    }
  }

  // Fall back to designated image fallback, and if that errors too, give SVG
  e.currentTarget.onerror = () => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = SVG_FALLBACK_IMAGE;
  };
  e.currentTarget.src = fallback;
}

