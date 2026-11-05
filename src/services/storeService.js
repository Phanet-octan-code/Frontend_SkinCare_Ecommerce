import apiClient from './api';

let settingsCache = null;
let settingsCacheTime = 0;
let settingsPromise = null;
const SETTINGS_TTL_MS = 10 * 60 * 1000; // 10 minutes

export const storeService = {
  /**
   * Synchronous helper to get cached settings immediately on component mount
   */
  getInitialSettings() {
    if (settingsCache && Date.now() - settingsCacheTime < SETTINGS_TTL_MS) {
      return settingsCache;
    }
    try {
      const raw = sessionStorage.getItem('skincare_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.time < SETTINGS_TTL_MS) {
          settingsCache = parsed.data;
          settingsCacheTime = parsed.time;
          return parsed.data;
        }
      }
    } catch {
      // Ignore
    }
    return null;
  },

  /**
   * Get public storefront settings (store name, currency, contact, delivery threshold)
   * Deduplicates concurrent in-flight requests and caches for 10 minutes.
   */
  async getSettings(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && settingsCache && now - settingsCacheTime < SETTINGS_TTL_MS) {
      return settingsCache;
    }

    if (!forceRefresh) {
      const initial = this.getInitialSettings();
      if (initial) return initial;
    }

    if (!forceRefresh && settingsPromise) {
      return settingsPromise;
    }

    settingsPromise = apiClient
      .get('/store/settings')
      .then((res) => {
        settingsCache = res.data;
        settingsCacheTime = Date.now();
        try {
          sessionStorage.setItem(
            'skincare_settings',
            JSON.stringify({ time: settingsCacheTime, data: res.data })
          );
        } catch {
          // Ignore
        }
        return res.data;
      })
      .catch((err) => {
        if (settingsCache) return settingsCache;
        const initial = this.getInitialSettings();
        if (initial) return initial;
        throw err;
      })
      .finally(() => {
        settingsPromise = null;
      });

    return settingsPromise;
  },

  /**
   * Get store summary statistics
   */
  async getStats() {
    const res = await apiClient.get('/store/stats');
    return res.data;
  },
};

export default storeService;
