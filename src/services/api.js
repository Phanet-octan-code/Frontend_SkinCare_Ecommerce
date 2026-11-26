import axios from 'axios';

/**
 * Centralized Axios instance for SkinCare E-Commerce
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-skincare-ng5o.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s to accommodate cloud hosting cold starts
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Sanctum Bearer token if customer is authenticated
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skincare_customer_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const currentLang = localStorage.getItem('skincare_boutique_lang') || 'en';
    config.headers['Accept-Language'] = currentLang;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors, session expiry, retry & format messages
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 1. If request was deliberately canceled (via AbortController or route change), reject immediately without retry
    if (
      axios.isCancel(error) ||
      error.name === 'CanceledError' ||
      error.code === 'ERR_CANCELED' ||
      error.config?.signal?.aborted
    ) {
      return Promise.reject(error);
    }

    const config = error.config;

    // Automatic retry up to 2 times for idempotent GET requests on transient network/timeout error (handles Render cold start wakeup)
    const isNetworkOrTimeout = (!error.response && error.request) || error.code === 'ECONNABORTED' || (error.message && error.message.includes('Network Error'));
    const isColdStartGateway = error.response && (error.response.status === 502 || error.response.status === 503 || error.response.status === 504);
    
    if (config && (config.method || 'get').toLowerCase() === 'get' && (config._retryCount || 0) < 2 && (isNetworkOrTimeout || isColdStartGateway)) {
      config._retryCount = (config._retryCount || 0) + 1;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      try {
        return await apiClient(config);
      } catch (retryError) {
        if (axios.isCancel(retryError) || retryError.config?.signal?.aborted) {
          return Promise.reject(retryError);
        }
        error = retryError;
      }
    }

    if (error.response) {
      const { status, data } = error.response;

      // Handle token expiration / unauthorized
      if (status === 401) {
        localStorage.removeItem('skincare_customer_token');
        localStorage.removeItem('skincare_customer_user');
        window.dispatchEvent(new CustomEvent('skincare:auth-unauthorized'));
      }

      // Extract best readable error message
      const message =
        data?.message ||
        data?.error ||
        (data?.errors && Object.values(data.errors)[0]?.[0]) ||
        'An unexpected error occurred with the request.';

      error.userMessage = message;
    } else if (error.request) {
      error.userMessage = 'Cannot connect to backend server. Please check your network or server status.';
    } else {
      error.userMessage = error.message;
    }

    return Promise.reject(error);
  }
);

/**
 * Health check utility to verify backend connection
 * @returns {Promise<{ isHealthy: boolean, data?: any, error?: string }>}
 */
export async function checkApiHealth() {
  try {
    const response = await apiClient.get('/store/settings');
    return {
      isHealthy: true,
      data: response.data,
    };
  } catch (error) {
    return {
      isHealthy: false,
      error: error.userMessage || error.message,
    };
  }
}

export default apiClient;
