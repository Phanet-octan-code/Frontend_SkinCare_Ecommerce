import React, { useState, useEffect } from 'react';
import loyaltyService from '../../services/loyaltyService';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';
import AccountNav from '../../components/navigation/AccountNav';
import LoadingSkeleton from '../../components/feedback/LoadingSkeleton';

export default function LoyaltyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const { showToast } = useToast();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    let mounted = true;
    loyaltyService
      .getLoyaltyProfile()
      .then((res) => {
        if (mounted) {
          setData(res);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) setError('Unable to load loyalty profile at this time.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const copyReferralCode = () => {
    if (!data?.referral?.code) return;
    navigator.clipboard.writeText(data.referral.code);
    setCopied(true);
    showToast(`Referral code "${data.referral.code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const copyReferralLink = () => {
    if (!data?.referral?.share_url) return;
    navigator.clipboard.writeText(data.referral.share_url);
    showToast('Referral invitation link copied to clipboard!', 'success');
  };

  const tierColors = {
    Platinum: 'bg-[#2C2A29] text-[#EDE8DF] border-[#5A5550]',
    Gold: 'bg-[#D9A74A] text-white border-[#B58530]',
    Silver: 'bg-[#8E9092] text-white border-[#707274]',
    Bronze: 'bg-[#B07E58] text-white border-[#8F613E]',
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-serif text-[#2C2A29] mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AccountNav />
          </div>

          <div className="lg:col-span-3 space-y-8">
            {loading ? (
              <div className="bg-white rounded-2xl p-8 border border-[#EBE6DF]">
                <LoadingSkeleton height="40px" width="50%" className="mb-4" />
                <LoadingSkeleton height="120px" className="rounded-xl mb-6" />
                <LoadingSkeleton height="200px" className="rounded-xl" />
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl p-8 border border-[#EBE6DF] text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-[#7C8B72] text-white rounded-full text-xs font-semibold"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* Hero Loyalty Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE6DF] shadow-sm relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#7C8B72] font-semibold">
                        Skinora Privilège Circle
                      </span>
                      <h2 className="text-2xl font-serif text-[#2C2A29] mt-1">
                        Loyalty Rewards & Tiers
                      </h2>
                    </div>

                    <div
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs ${
                        tierColors[data?.tier?.name] || tierColors.Bronze
                      }`}
                    >
                      ★ {data?.tier?.name} Member
                    </div>
                  </div>

                  {/* Points and Monetary Value Balance */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-[#F9F7F3] rounded-xl border border-[#EBE6DF] mb-6">
                    <div>
                      <span className="text-xs text-[#6B6561] block mb-1">Available Points</span>
                      <span className="text-3xl font-serif font-bold text-[#2C2A29]">
                        {data?.current_points?.toLocaleString() || 0}
                      </span>
                      <span className="text-[11px] text-[#7C8B72] block mt-0.5">Points</span>
                    </div>

                    <div>
                      <span className="text-xs text-[#6B6561] block mb-1">Redeemable Worth</span>
                      <span className="text-3xl font-serif font-bold text-[#7C8B72]">
                        {formatPrice(data?.points_dollar_value || 0)}
                      </span>
                      <span className="text-[11px] text-[#A09A93] block mt-0.5">
                        Apply at checkout (100 pts = $5)
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-[#6B6561] block mb-1">Tier Multiplier</span>
                      <span className="text-3xl font-serif font-bold text-[#2C2A29]">
                        {data?.tier?.points_multiplier || 1}×
                      </span>
                      <span className="text-[11px] text-[#7C8B72] block mt-0.5">
                        {data?.tier?.discount_percentage > 0
                          ? `+${data.tier.discount_percentage}% Storewide Perk`
                          : 'Standard Accrual'}
                      </span>
                    </div>
                  </div>

                  {/* Progress to Next Tier */}
                  {data?.next_tier ? (
                    <div className="border-t border-[#F0EBE3] pt-5">
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-[#6B6561]">
                          Next Tier: <strong className="text-[#2C2A29]">{data.next_tier.name}</strong>
                        </span>
                        <span className="text-[#7C8B72] font-semibold">
                          {data.next_tier.points_needed} more points needed
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#EBE6DF] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#7C8B72] transition-all duration-500 rounded-full"
                          style={{ width: `${data.next_tier.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-[#F0EBE3] pt-4 text-xs text-[#7C8B72] font-semibold flex items-center gap-1.5">
                      <span>✨</span> You have achieved our highest VIP tier: Platinum Status!
                    </div>
                  )}
                </div>

                {/* Referral Invitation Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE6DF] shadow-sm">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7C8B72] font-semibold mb-1">
                    <span>💌</span> Give ${data?.referral?.referee_discount}, Get {data?.referral?.reward_points} Points
                  </div>
                  <h3 className="text-xl font-serif text-[#2C2A29] mb-2">
                    Invite Friends to Skinora
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B6561] leading-relaxed mb-6">
                    Share your unique invitation code with friends. They will receive{' '}
                    <strong>${data?.referral?.referee_discount} off</strong> their very first order, and you will earn{' '}
                    <strong>{data?.referral?.reward_points} loyalty points</strong> once their order is confirmed!
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="flex-1 flex items-center bg-[#F9F7F3] border border-[#EBE6DF] rounded-xl px-4 py-2.5">
                      <span className="text-xs text-[#A09A93] mr-2">Code:</span>
                      <span className="font-mono font-bold text-sm text-[#2C2A29] select-all">
                        {data?.referral?.code}
                      </span>
                    </div>

                    <button
                      onClick={copyReferralCode}
                      className="px-5 py-2.5 bg-[#7C8B72] text-white rounded-xl text-xs font-semibold hover:bg-[#68765F] transition-all shrink-0"
                    >
                      {copied ? 'Copied!' : 'Copy Code'}
                    </button>

                    <button
                      onClick={copyReferralLink}
                      className="px-5 py-2.5 bg-white border border-[#7C8B72] text-[#7C8B72] rounded-xl text-xs font-semibold hover:bg-[#F4F6F2] transition-all shrink-0"
                    >
                      Copy Invite Link
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#F0EBE3] flex gap-6 text-xs text-[#6B6561]">
                    <div>
                      Friends Invited: <strong className="text-[#2C2A29]">{data?.referral?.total_referrals_made || 0}</strong>
                    </div>
                    <div>
                      Successful Rewards: <strong className="text-[#7C8B72]">{data?.referral?.successful_referrals || 0}</strong>
                    </div>
                  </div>
                </div>

                {/* Points Activity History */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE6DF] shadow-sm">
                  <h3 className="text-lg font-serif text-[#2C2A29] mb-4">Points Activity Ledger</h3>

                  {data?.recent_history?.length === 0 ? (
                    <p className="text-xs text-[#A09A93] py-4">No points activity recorded yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-[#F0EBE3] text-[#A09A93] uppercase tracking-wider font-semibold">
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Description</th>
                            <th className="pb-3 text-right">Points</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0EBE3]">
                          {data?.recent_history?.map((tx) => (
                            <tr key={tx.id}>
                              <td className="py-3 text-[#6B6561]">{tx.date}</td>
                              <td className="py-3 text-[#2C2A29] font-medium">{tx.description}</td>
                              <td className="py-3 text-right font-bold">
                                {tx.points > 0 ? (
                                  <span className="text-[#4F6C41]">+{tx.points}</span>
                                ) : (
                                  <span className="text-red-600">{tx.points}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

