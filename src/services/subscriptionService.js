import apiClient from './api';

export const subscriptionService = {
  /**
   * Fetch customer's recurring skincare subscriptions
   */
  async getSubscriptions() {
    const res = await apiClient.get('/customer/subscriptions');
    return res.data?.data || [];
  },

  /**
   * Pause replenishment subscription
   */
  async pauseSubscription(id) {
    const res = await apiClient.post(`/customer/subscriptions/${id}/pause`);
    return res.data;
  },

  /**
   * Resume paused subscription
   */
  async resumeSubscription(id) {
    const res = await apiClient.post(`/customer/subscriptions/${id}/resume`);
    return res.data;
  },

  /**
   * Cancel replenishment plan with reason
   */
  async cancelSubscription(id, reason = 'Customer request') {
    const res = await apiClient.post(`/customer/subscriptions/${id}/cancel`, {
      reason,
    });
    return res.data;
  },
};

export default subscriptionService;

