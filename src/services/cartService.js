import apiClient from './api';

export const cartService = {
  /**
   * Request an authoritative real-time cart quote from Laravel API.
   * Calculates promotions, membership tier discounts, coupon codes, taxes, and shipping.
   * Also verifies live stock availability from POS database.
   *
   * @param {Array<{ product_id: number, qty: number }>} items
   * @param {string|null} couponCode
   */
  async getQuote(
    items,
    couponCode = null,
    redeemPoints = 0,
    referralCode = null,
    shippingZoneCode = null,
    shippingAddress = null,
    currency = null
  ) {
    const formattedItems = (items || []).map((item) => ({
      product_id: item.bundle_id ? null : (item.product_id || item.id),
      bundle_id: item.bundle_id || null,
      qty: Math.max(1, Number(item.qty) || 1),
    }));

    const res = await apiClient.post('/cart/quote', {
      items: formattedItems,
      coupon_code: couponCode ? String(couponCode).trim() : null,
      redeem_points: Number(redeemPoints) || 0,
      referral_code: referralCode ? String(referralCode).trim() : null,
      shipping_zone_code: shippingZoneCode || null,
      shipping_address: shippingAddress || null,
      currency: currency || null,
    });
    return res.data;
  },

  /**
   * Get server-side cart items for authenticated user or guest session
   */
  async getCart() {
    const res = await apiClient.get('/cart');
    return res.data;
  },

  /**
   * Sync local React cart into server storage (e.g. after customer logs in)
   * @param {Array<{ product_id: number, qty: number }>} items
   */
  async syncCart(items) {
    const formattedItems = (items || []).map((item) => ({
      product_id: item.product_id || item.id,
      qty: Math.max(1, Number(item.qty) || 1),
    }));

    const res = await apiClient.post('/cart/sync', {
      items: formattedItems,
    });
    return res.data;
  },

  /**
   * Add item to server cart
   */
  async addItem(productId, qty = 1) {
    const res = await apiClient.post('/cart/add', {
      product_id: productId,
      qty,
    });
    return res.data;
  },

  /**
   * Remove item from server cart
   */
  async removeItem(productId) {
    const res = await apiClient.delete(`/cart/${productId}`);
    return res.data;
  },
};

export default cartService;
