import apiClient from './api';

export const authService = {
  /**
   * Register a new customer
   * @param {{ name: string, email: string, password: string, password_confirmation: string, phone?: string }} data
   */
  async register(data) {
    const res = await apiClient.post('/customer/register', data);
    const token = res.data?.token || res.data?.data?.token;
    const customer = res.data?.customer || res.data?.data?.customer || res.data?.data;
    if (token) {
      localStorage.setItem('skincare_customer_token', token);
      localStorage.setItem('skincare_customer_user', JSON.stringify(customer));
    }
    return res.data;
  },

  /**
   * Login customer
   * @param {{ email: string, password: string }} data
   */
  async login(data) {
    const res = await apiClient.post('/customer/login', data);
    const token = res.data?.token || res.data?.data?.token;
    const customer = res.data?.customer || res.data?.data?.customer || res.data?.data;
    if (token) {
      localStorage.setItem('skincare_customer_token', token);
      localStorage.setItem('skincare_customer_user', JSON.stringify(customer));
    }
    return res.data;
  },

  /**
   * Request password reset instructions
   * @param {{ email: string }} data
   */
  async forgotPassword(data) {
    const res = await apiClient.post('/customer/forgot-password', data);
    return res.data;
  },

  /**
   * Reset password with token
   * @param {{ email: string, token: string, password: string, password_confirmation: string }} data
   */
  async resetPassword(data) {
    const res = await apiClient.post('/customer/reset-password', data);
    const token = res.data?.token || res.data?.data?.token;
    const customer = res.data?.customer || res.data?.data?.customer || res.data?.data;
    if (token) {
      localStorage.setItem('skincare_customer_token', token);
      localStorage.setItem('skincare_customer_user', JSON.stringify(customer));
    }
    return res.data;
  },

  /**
   * Logout customer
   */
  async logout() {
    try {
      await apiClient.post('/customer/logout');
    } finally {
      localStorage.removeItem('skincare_customer_token');
      localStorage.removeItem('skincare_customer_user');
    }
  },

  /**
   * Get current authenticated customer profile
   */
  async getProfile() {
    const res = await apiClient.get('/customer/profile');
    const customer = res.data?.customer || res.data?.data?.customer || res.data?.data;
    if (customer) {
      localStorage.setItem('skincare_customer_user', JSON.stringify(customer));
    }
    return res.data;
  },

  /**
   * Update profile details
   */
  async updateProfile(data) {
    const res = await apiClient.put('/customer/profile', data);
    const customer = res.data?.customer || res.data?.data?.customer || res.data?.data;
    if (customer) {
      localStorage.setItem('skincare_customer_user', JSON.stringify(customer));
    }
    return res.data;
  },

  /**
   * Update password with current password verification
   * @param {{ current_password: string, password: string, password_confirmation: string }} data
   */
  async updatePassword(data) {
    const res = await apiClient.put('/customer/password', data);
    return res.data;
  },

  /**
   * Retrieve cached customer session from localStorage
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('skincare_customer_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if token exists
   */
  hasToken() {
    return Boolean(localStorage.getItem('skincare_customer_token'));
  },
};

export default authService;
