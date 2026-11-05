import apiClient from './api';

export const wishlistService = {
  /**
   * Get all wishlist products for authenticated customer
   */
  async getWishlist() {
    const res = await apiClient.get('/customer/wishlist');
    return res.data;
  },

  /**
   * Add a product to wishlist
   * @param {number} productId
   */
  async add(productId) {
    const res = await apiClient.post('/customer/wishlist', { product_id: productId });
    return res.data;
  },

  /**
   * Remove a product from wishlist
   * @param {number} productId
   */
  async remove(productId) {
    const res = await apiClient.delete(`/customer/wishlist/${productId}`);
    return res.data;
  },
};

export default wishlistService;
