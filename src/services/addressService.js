import apiClient from './api';

export const addressService = {
  /**
   * Get all addresses for authenticated customer
   */
  async getAddresses() {
    const res = await apiClient.get('/customer/addresses');
    return res.data;
  },

  /**
   * Create a new delivery address
   * @param {Object} data
   */
  async createAddress(data) {
    const res = await apiClient.post('/customer/addresses', data);
    return res.data;
  },

  /**
   * Update an existing address
   * @param {number} id
   * @param {Object} data
   */
  async updateAddress(id, data) {
    const res = await apiClient.put(`/customer/addresses/${id}`, data);
    return res.data;
  },

  /**
   * Delete an address
   * @param {number} id
   */
  async deleteAddress(id) {
    const res = await apiClient.delete(`/customer/addresses/${id}`);
    return res.data;
  },

  /**
   * Set address as primary default
   * @param {number} id
   * @param {Object} existingAddress
   */
  async setDefault(id, existingAddress = {}) {
    const res = await apiClient.put(`/customer/addresses/${id}`, {
      recipient_name: existingAddress.recipient_name,
      phone: existingAddress.phone,
      address_line1: existingAddress.address_line1,
      city: existingAddress.city || 'Phnom Penh',
      is_default: true,
    });
    return res.data;
  },
};

export default addressService;
