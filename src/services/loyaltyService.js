import apiClient from './api';

export const loyaltyService = {
  /**
   * Fetch customer loyalty profile, tier status, referral code, and points ledger
   */
  async getLoyaltyProfile() {
    const res = await apiClient.get('/customer/loyalty');
    return res.data?.data || null;
  },

  /**
   * Validate a friend's referral code for checkout
   */
  async validateReferralCode(code, subtotal) {
    const res = await apiClient.post('/referral/validate', {
      code,
      subtotal,
    });
    return res.data?.data || null;
  },
};

export default loyaltyService;

