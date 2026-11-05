import apiClient from './api';

export const orderService = {
  /**
   * Submit an online checkout order with server-side validation and idempotency protection
   * @param {Object} payload
   * @param {string|null} idempotencyKey
   */
  async checkout(payload, idempotencyKey = null) {
    const config = {};
    if (idempotencyKey) {
      config.headers = { 'X-Idempotency-Key': idempotencyKey };
    }
    const res = await apiClient.post('/customer/checkout', payload, config);
    return res.data;
  },

  /**
   * Authoritative backend payment verification for Bakong KHQR, Card Gateway, etc.
   * Never trust client-only payment status without server confirmation.
   * @param {number|string} orderIdentifier
   * @param {string} paymentType
   * @param {string|null} transactionRef
   */
  async verifyPayment(orderIdentifier, paymentType, transactionRef = null) {
    const res = await apiClient.post(`/orders/${orderIdentifier}/verify-payment`, {
      payment_type: paymentType,
      transaction_ref: transactionRef,
    });
    return res.data;
  },

  /**
   * Cancel an order and restore stock via centralized POS InventoryService
   * @param {number|string} orderId
   * @param {string} reason
   */
  async cancelOrder(orderId, reason = '') {
    const res = await apiClient.post(`/customer/orders/${orderId}/cancel`, {
      reason,
    });
    return res.data;
  },

  /**
   * Get authenticated customer order history (paginated)
   * @param {number} page
   */
  async getOrders(page = 1) {
    const res = await apiClient.get('/customer/orders', {
      params: { page },
    });
    return res.data;
  },

  /**
   * Get specific order details for authenticated customer
   * @param {number|string} orderId
   */
  async getOrder(orderId) {
    const res = await apiClient.get(`/customer/orders/${orderId}`);
    return res.data;
  },

  /**
   * Public order tracking by invoice number / tracking number and email / phone
   * @param {string} reference
   * @param {string} identifier
   */
  async trackOrder(reference, identifier) {
    const res = await apiClient.post('/orders/track', {
      reference,
      identifier,
    });
    return res.data;
  },
};

export default orderService;
