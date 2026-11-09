import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import subscriptionService from '../../services/subscriptionService';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';
import AccountNav from '../../components/navigation/AccountNav';
import LoadingSkeleton from '../../components/feedback/LoadingSkeleton';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingSub, setCancellingSub] = useState(null);
  const [cancelReason, setCancelReason] = useState('Routine completed / overstocked');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();
  const { formatPrice } = useCurrency();

  const loadSubscriptions = () => {
    setLoading(true);
    subscriptionService
      .getSubscriptions()
      .then((data) => {
        setSubscriptions(data || []);
        setError(null);
      })
      .catch((err) => {
        setError('Unable to load your subscriptions at this time.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handlePause = async (id) => {
    try {
      await subscriptionService.pauseSubscription(id);
      showToast('Replenishment plan paused.', 'info');
      loadSubscriptions();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to pause plan.', 'error');
    }
  };

  const handleResume = async (id) => {
    try {
      await subscriptionService.resumeSubscription(id);
      showToast('Replenishment plan resumed!', 'success');
      loadSubscriptions();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to resume plan.', 'error');
    }
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancellingSub) return;
    setIsSubmitting(true);
    try {
      await subscriptionService.cancelSubscription(cancellingSub.id, cancelReason);
      showToast('Subscription has been cancelled.', 'info');
      setCancellingSub(null);
      loadSubscriptions();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel subscription.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-serif text-[#2C2A29] mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AccountNav />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE6DF] shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#7C8B72] font-semibold">
                    Replenishment Auto-Delivery
                  </span>
                  <h2 className="text-2xl font-serif text-[#2C2A29] mt-1">
                    Skincare Subscriptions
                  </h2>
                </div>

                <Link
                  to="/shop"
                  className="px-4 py-2 border border-[#7C8B72] text-[#7C8B72] rounded-full text-xs font-semibold hover:bg-[#F4F6F2] transition-all"
                >
                  + Add Products to Auto-Delivery
                </Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((n) => (
                    <div key={n} className="p-4 border border-[#EBE6DF] rounded-xl">
                      <LoadingSkeleton height="20px" width="40%" className="mb-2" />
                      <LoadingSkeleton height="16px" width="70%" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-3 text-sm">{error}</p>
                  <button
                    onClick={loadSubscriptions}
                    className="px-4 py-2 bg-[#7C8B72] text-white rounded-full text-xs font-semibold"
                  >
                    Retry
                  </button>
                </div>
              ) : subscriptions.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#EBE6DF] rounded-xl p-8">
                  <span className="text-3xl block mb-2">🌿</span>
                  <h3 className="font-serif text-lg text-[#2C2A29] mb-1">No Active Subscriptions</h3>
                  <p className="text-xs text-[#6B6561] max-w-md mx-auto mb-6">
                    Never run out of your essential serums or moisturizers. Choose "Subscribe & Save 10%" on any product to enjoy free auto-delivery on your schedule.
                  </p>
                  <Link
                    to="/shop"
                    className="px-6 py-2.5 bg-[#7C8B72] text-white rounded-full text-xs font-semibold hover:bg-[#68765F]"
                  >
                    Explore Skincare Catalog
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((sub) => {
                    const isActive = sub.status === 'active';
                    const isPaused = sub.status === 'paused';
                    const isCancelled = sub.status === 'cancelled';

                    return (
                      <div
                        key={sub.id}
                        className="p-5 border border-[#EBE6DF] rounded-xl hover:border-[#D5CFC5] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          {sub.image_url && (
                            <img
                              src={sub.image_url}
                              alt={sub.item_name}
                              className="w-16 h-16 object-cover rounded-lg border border-[#EBE6DF]"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-serif font-medium text-[#2C2A29] text-base">
                                {sub.item_name}
                              </h4>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  isActive
                                    ? 'bg-[#E7EFE3] text-[#4F6C41]'
                                    : isPaused
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {sub.status}
                              </span>
                            </div>

                            <p className="text-xs text-[#6B6561]">
                              Quantity: <strong>{sub.quantity}</strong> | Deliver every{' '}
                              <strong>{sub.billing_interval_days} days</strong>
                            </p>
                            <p className="text-xs text-[#7C8B72] font-semibold mt-0.5">
                              {formatPrice(sub.recurring_subtotal)} / delivery{' '}
                              <span className="text-[#A09A93] font-normal">
                                (Saved {sub.discount_percentage}%)
                              </span>
                            </p>

                            {isActive && sub.next_billing_date && (
                              <p className="text-[11px] text-[#A09A93] mt-1">
                                Next Scheduled Dispatch: <strong>{sub.next_billing_date}</strong>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Controls */}
                        {!isCancelled && (
                          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                            {isActive ? (
                              <button
                                onClick={() => handlePause(sub.id)}
                                className="px-3.5 py-1.5 border border-[#D5CFC5] text-[#6B6561] rounded-lg text-xs font-medium hover:bg-[#F9F7F3]"
                              >
                                Pause Plan
                              </button>
                            ) : isPaused ? (
                              <button
                                onClick={() => handleResume(sub.id)}
                                className="px-3.5 py-1.5 bg-[#7C8B72] text-white rounded-lg text-xs font-medium hover:bg-[#68765F]"
                              >
                                Resume Plan
                              </button>
                            ) : null}

                            <button
                              onClick={() => setCancellingSub(sub)}
                              className="px-3 py-1.5 text-xs text-red-600 hover:text-red-800 font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {cancellingSub && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#EBE6DF]">
            <h3 className="text-lg font-serif text-[#2C2A29] mb-2">Cancel Auto-Delivery?</h3>
            <p className="text-xs text-[#6B6561] leading-relaxed mb-4">
              You will lose the <strong>10% Subscribe & Save discount</strong> on future replenishments of{' '}
              <strong>{cancellingSub.item_name}</strong>.
            </p>

            <form onSubmit={handleCancelSubmit}>
              <label className="block text-xs font-semibold text-[#2C2A29] mb-1">
                Please let us know your reason:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#D5CFC5] bg-[#FDFBF7] mb-6 focus:outline-[#7C8B72]"
              >
                <option value="Routine completed / overstocked">Routine completed / currently overstocked</option>
                <option value="Skin condition improved">My skin concern is resolved</option>
                <option value="Switching to a different product">Switching to a different skincare ritual</option>
                <option value="Budget / financial preference">Financial / budget adjustment</option>
                <option value="Other feedback">Other feedback</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancellingSub(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium text-[#6B6561] hover:text-[#2C2A29]"
                >
                  Keep Subscription
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
                >
                  {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

