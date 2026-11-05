import axios from 'axios';
import apiClient from './api';

// Safe persistent session storage helper with memory fallback
const memoryStore = new Map();

const storage = {
  get(key, ttlMs = 0, allowStale = false) {
    // 1. Try memory
    const mem = memoryStore.get(key);
    const now = Date.now();
    if (mem && (ttlMs === 0 || now - mem.time < ttlMs || allowStale)) {
      return mem.data;
    }

    // 2. Try sessionStorage
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        const item = JSON.parse(raw);
        if (ttlMs === 0 || now - item.time < ttlMs || allowStale) {
          memoryStore.set(key, item);
          return item.data;
        }
        if (!allowStale) {
          sessionStorage.removeItem(key);
        }
      }
    } catch {
      // Ignore sessionStorage errors (e.g. private mode quota)
    }

    return null;
  },

  set(key, data) {
    const entry = { time: Date.now(), data };
    memoryStore.set(key, entry);
    try {
      sessionStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // Storage quota exceeded or disabled
    }
  },

  remove(key) {
    memoryStore.delete(key);
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },
};

const METADATA_TTL_MS = 10 * 60 * 1000; // 10 minutes TTL
const PRODUCTS_QUERY_TTL_MS = 3 * 60 * 1000; // 3 minutes TTL
const PRODUCT_DETAIL_TTL_MS = 2 * 60 * 1000; // 2 minutes TTL

// Active in-flight promise registry to deduplicate simultaneous requests
const inFlightRequests = new Map();

function hashParams(params = {}) {
  const sortedKeys = Object.keys(params).sort();
  const obj = {};
  for (const k of sortedKeys) {
    if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
      obj[k] = params[k];
    }
  }
  return JSON.stringify(obj);
}

export const catalogService = {
  /**
   * Synchronous helper to get cached products immediately on component mount (0ms first render)
   */
  getInitialProducts(params = {}, allowStale = true) {
    const key = `skincare_products_${hashParams(params)}`;
    return storage.get(key, PRODUCTS_QUERY_TTL_MS, allowStale);
  },

  /**
   * Synchronous helper to get cached categories immediately on component mount
   */
  getInitialCategories(allowStale = true) {
    return storage.get('skincare_categories', METADATA_TTL_MS, allowStale);
  },

  /**
   * Synchronous helper to get cached promotions immediately on component mount
   */
  getInitialPromotions(allowStale = true) {
    return storage.get('skincare_promotions', METADATA_TTL_MS, allowStale);
  },

  /**
   * Synchronous helper to get cached bestsellers immediately on component mount
   */
  getInitialBestsellers(limit = 8, allowStale = true) {
    return storage.get(`skincare_bestsellers_${limit}`, PRODUCTS_QUERY_TTL_MS, allowStale);
  },

  /**
   * Synchronous helper to get cached new arrivals immediately on component mount
   */
  getInitialNewArrivals(limit = 8, allowStale = true) {
    return storage.get(`skincare_new_arrivals_${limit}`, PRODUCTS_QUERY_TTL_MS, allowStale);
  },

  /**
   * Synchronous helper to get cached brands immediately on component mount
   */
  getInitialBrands(allowStale = true) {
    return storage.get('skincare_brands', METADATA_TTL_MS, allowStale);
  },

  /**
   * Fetch products with query parameters (search, category_id, min_price, max_price, in_stock, sort_by, sort_order, page, per_page).
   * Backed by persistent sessionStorage cache + deduplication of simultaneous requests + stale fallback.
   */
  async getProducts(params = {}, config = {}) {
    const key = `skincare_products_${hashParams(params)}`;

    // Return cached data if fresh and not forcing refresh
    if (!config.forceRefresh) {
      const cached = storage.get(key, PRODUCTS_QUERY_TTL_MS);
      if (cached) {
        return cached;
      }
    }

    // Deduplicate in-flight requests for the same query if no caller-specific AbortSignal is used
    if (!config.signal && inFlightRequests.has(key)) {
      return inFlightRequests.get(key);
    }

    const promise = apiClient
      .get('/store/products', {
        params,
        ...config,
      })
      .then((res) => {
        storage.set(key, res.data);
        return res.data;
      })
      .catch((err) => {
        // Fallback gracefully to stale cached data if available (preventing jarring blank / error state)
        const stale = storage.get(key, 0, true);
        if (stale && !axios.isCancel(err)) {
          return stale;
        }
        throw err;
      })
      .finally(() => {
        inFlightRequests.delete(key);
      });

    if (!config.signal) {
      inFlightRequests.set(key, promise);
    }
    return promise;
  },

  /**
   * Fetch featured products with in-flight deduplication, caching, and stale fallback
   */
  async getFeaturedProducts(limit = 8, config = {}) {
    const key = `skincare_featured_${limit}`;
    if (!config.forceRefresh) {
      const cached = storage.get(key, PRODUCTS_QUERY_TTL_MS);
      if (cached) return cached;
    }

    if (!config.signal && inFlightRequests.has(key)) {
      return inFlightRequests.get(key);
    }

    const promise = apiClient
      .get('/store/products/featured', {
        params: { per_page: limit },
        ...config,
      })
      .then((res) => {
        storage.set(key, res.data);
        return res.data;
      })
      .catch((err) => {
        const stale = storage.get(key, 0, true);
        if (stale && !axios.isCancel(err)) return stale;
        throw err;
      })
      .finally(() => {
        inFlightRequests.delete(key);
      });

    if (!config.signal) {
      inFlightRequests.set(key, promise);
    }
    return promise;
  },

  /**
   * Fetch best-selling products supported by actual backend sales data
   */
  async getBestsellers(limit = 8, config = {}) {
    const key = `skincare_bestsellers_${limit}`;
    if (!config.forceRefresh) {
      const cached = storage.get(key, PRODUCTS_QUERY_TTL_MS);
      if (cached) return cached;
    }

    if (!config.signal && inFlightRequests.has(key)) {
      return inFlightRequests.get(key);
    }

    const promise = apiClient
      .get('/store/products/bestsellers', {
        params: { limit },
        ...config,
      })
      .then((res) => {
        storage.set(key, res.data);
        return res.data;
      })
      .catch(async (err) => {
        const stale = storage.get(key, 0, true);
        if (stale && !axios.isCancel(err)) return stale;

        // Resilient fallback: Try featured formulations endpoint
        try {
          const featuredRes = await apiClient.get('/store/products/featured', config);
          if (Array.isArray(featuredRes.data?.data) && featuredRes.data.data.length > 0) {
            storage.set(key, featuredRes.data);
            return featuredRes.data;
          }
        } catch {}

        // Resilient fallback: Try general products catalog
        try {
          const catRes = await this.getProducts({ per_page: limit, sort: 'popular' });
          if (Array.isArray(catRes?.data) && catRes.data.length > 0) {
            const fallbackData = { success: true, data: catRes.data };
            storage.set(key, fallbackData);
            return fallbackData;
          }
        } catch {}

        throw err;
      })
      .finally(() => {
        inFlightRequests.delete(key);
      });

    if (!config.signal) {
      inFlightRequests.set(key, promise);
    }
    return promise;
  },

  /**
   * Fetch new arrival products supported by backend latest releases
   */
  async getNewArrivals(limit = 8, config = {}) {
    const key = `skincare_new_arrivals_${limit}`;
    if (!config.forceRefresh) {
      const cached = storage.get(key, PRODUCTS_QUERY_TTL_MS);
      if (cached) return cached;
    }

    if (!config.signal && inFlightRequests.has(key)) {
      return inFlightRequests.get(key);
    }

    const promise = apiClient
      .get('/store/products/new-arrivals', {
        params: { limit },
        ...config,
      })
      .then((res) => {
        storage.set(key, res.data);
        return res.data;
      })
      .catch(async (err) => {
        const stale = storage.get(key, 0, true);
        if (stale && !axios.isCancel(err)) return stale;

        // Resilient fallback: Try general catalog latest formulations
        try {
          const catRes = await this.getProducts({ per_page: limit, sort: 'latest' });
          if (Array.isArray(catRes?.data) && catRes.data.length > 0) {
            const fallbackData = { success: true, data: catRes.data };
            storage.set(key, fallbackData);
            return fallbackData;
          }
        } catch {}

        throw err;
      })
      .finally(() => {
        inFlightRequests.delete(key);
      });

    if (!config.signal) {
      inFlightRequests.set(key, promise);
    }
    return promise;
  },

  /**
   * Fetch a single product by slug or ID with short-lived caching and request deduplication.
   */
  async getProduct(identifier, config = {}) {
    const key = `skincare_product_${identifier}`;
    if (!config.forceRefresh) {
      const cached = storage.get(key, PRODUCT_DETAIL_TTL_MS);
      if (cached) return cached;
    }

    if (!config.signal && inFlightRequests.has(key)) {
      return inFlightRequests.get(key);
    }

    const promise = apiClient
      .get(`/store/products/${identifier}`, config)
      .then((res) => {
        storage.set(key, res.data);
        return res.data;
      })
      .catch((err) => {
        const stale = storage.get(key, 0, true);
        if (stale && !axios.isCancel(err)) return stale;
        throw err;
      })
      .finally(() => {
        inFlightRequests.delete(key);
      });

    if (!config.signal) {
      inFlightRequests.set(key, promise);
    }
    return promise;
  },

  /**
   * Fetch all active product categories with safe client caching and in-flight deduplication
   */
  async getCategories(forceRefresh = false) {
    const key = 'skincare_categories';
    if (!forceRefresh) {
      const cached = storage.get(key, METADATA_TTL_MS);
      if (cached) return cached;
    }

    if (inFlightRequests.has(key)) {
      return inFlightRequests.get(key);
    }

    const promise = apiClient
      .get('/store/categories')
      .then((res) => {
        storage.set(key, res.data);
        return res.data;
      })
      .catch((err) => {
        const stale = storage.get(key, 0, true);
        if (stale && !axios.isCancel(err)) return stale;
        throw err;
      })
      .finally(() => {
        inFlightRequests.delete(key);
      });

    inFlightRequests.set(key, promise);
    return promise;
  },

  /**
   * Fetch available brands with product counts with safe client caching and in-flight deduplication
   */
  async getBrands(forceRefresh = false) {
    const key = 'skincare_brands';
    if (!forceRefresh) {
      const cached = storage.get(key, METADATA_TTL_MS);
      if (cached) return cached;
    }

    if (inFlightRequests.has(key)) {
      return inFlightRequests.get(key);
    }

    const promise = apiClient
      .get('/store/brands')
      .then((res) => {
        storage.set(key, res.data);
        return res.data;
      })
      .catch((err) => {
        const stale = storage.get(key, 0, true);
        if (stale && !axios.isCancel(err)) return stale;
        throw err;
      })
      .finally(() => {
        inFlightRequests.delete(key);
      });

    inFlightRequests.set(key, promise);
    return promise;
  },

  /**
   * Fetch active promotions/banners with safe client caching and in-flight deduplication
   */
  async getPromotions(forceRefresh = false) {
    const key = 'skincare_promotions';
    if (!forceRefresh) {
      const cached = storage.get(key, METADATA_TTL_MS);
      if (cached) return cached;
    }

    if (inFlightRequests.has(key)) {
      return inFlightRequests.get(key);
    }

    const promise = apiClient
      .get('/store/promotions')
      .then((res) => {
        storage.set(key, res.data);
        return res.data;
      })
      .catch((err) => {
        const stale = storage.get(key, 0, true);
        if (stale && !axios.isCancel(err)) return stale;
        throw err;
      })
      .finally(() => {
        inFlightRequests.delete(key);
      });

    inFlightRequests.set(key, promise);
    return promise;
  },

  /**
   * Invalidate cached metadata when needed
   */
  invalidateMetadataCache() {
    storage.remove('skincare_categories');
    storage.remove('skincare_brands');
    storage.remove('skincare_promotions');
    inFlightRequests.clear();
  },

  /**
   * Fetch customer reviews for a product
   */
  async getReviews(productId, page = 1) {
    const res = await apiClient.get(`/store/products/${productId}/reviews`, {
      params: { page },
    });
    return res.data;
  },

  /**
   * Submit a review for a product (requires auth)
   */
  async submitReview(productId, reviewData) {
    const res = await apiClient.post(`/store/products/${productId}/reviews`, reviewData);
    // Invalidate product cache on review submit
    storage.remove(`skincare_product_${productId}`);
    return res.data;
  },
};

export default catalogService;
