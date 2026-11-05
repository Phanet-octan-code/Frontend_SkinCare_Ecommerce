/**
 * Centralized Application Configuration
 */
export const APP_CONFIG = {
  appName: import.meta.env.VITE_APP_NAME || 'Élixir Botanique',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://backend-skincare-ng5o.onrender.com/api/v1',
  defaultCurrency: 'USD',
  freeShippingThreshold: 50.0,
  taxRate: 5.0, // 5%
  exchangeRateKHR: 4100.0,
  defaultPageSize: 12,
  maxCartItemQty: 20,
};

export default APP_CONFIG;

