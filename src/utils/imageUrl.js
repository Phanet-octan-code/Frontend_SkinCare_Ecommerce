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

export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80';

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

  // 4. Direct uploaded backend filename: "prod_xxx.jpg" or "cat_xxx.jpg"
  if (trimmed.startsWith('prod_') || trimmed.startsWith('cat_')) {
    const subfolder = trimmed.startsWith('cat_') ? 'categories' : 'products';
    return `${BACKEND_BASE_URL}/images/${subfolder}/${trimmed}`;
  }

  // 5. Local frontend public assets:
  // e.g. "/hero-skincare-set.jpg", "hero-skincare-set.jpg", "brand-story.jpg"
  const cleanAsset = trimmed.replace(/^\//, '');
  return `${FRONTEND_BASE_URL}${cleanAsset}`;
}

/**
 * Image error handler helper that gracefully cascades:
 * 1. If failed URL was from frontend base, try backend URL
 * 2. If failed URL was from backend /storage/, try /images/
 * 3. Fall back to curated skincare fallback
 */
export function handleImageError(e, fallback = DEFAULT_FALLBACK_IMAGE) {
  const currentSrc = e.currentTarget.src || '';

  // If already at fallback, stop to prevent infinite loops
  if (currentSrc === fallback) return;

  // If failed on frontend path (e.g. /Frontend_SkinCare_Ecommerce/hero-skincare-set.jpg), try backend host
  if (currentSrc.includes('github.io') || currentSrc.includes(FRONTEND_BASE_URL)) {
    const filename = currentSrc.split('/').pop()?.split('?')[0];
    if (filename && (filename.startsWith('hero-') || filename.includes('brand-story'))) {
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

  // If failed on backend /images/products/, try /storage/products/
  if (currentSrc.includes('/images/products/')) {
    const altSrc = currentSrc.replace('/images/products/', '/storage/products/');
    if (currentSrc !== altSrc) {
      e.currentTarget.src = altSrc;
      return;
    }
  }

  e.currentTarget.onerror = null;
  e.currentTarget.src = fallback;
}
