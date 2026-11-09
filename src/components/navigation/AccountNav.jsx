import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { getCustomerAvatar } from '../../utils/customerAvatar';
import { User, MapPin, Package, Heart, Truck, LogOut, Sparkles, Camera } from 'lucide-react';

export default function AccountNav() {
  const { customer, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const avatarSrc = getCustomerAvatar(customer);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Get initials for avatar monogram
  const getInitials = (name) => {
    if (!name) return 'EB';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const navItems = [
    { label: t('account.profile_security') || 'Profile & Security', path: '/account/profile', icon: User },
    { label: 'Loyalty Privilège & Referrals', path: '/account/loyalty', icon: Sparkles },
    { label: 'Auto-Delivery Subscriptions', path: '/account/subscriptions', icon: Truck },
    { label: t('account.order_history') || 'Order History', path: '/account/orders', icon: Package },
    { label: t('account.delivery_addresses') || 'Saved Addresses', path: '/account/addresses', icon: MapPin },
    { label: t('account.saved_wishlist') || 'Wishlist', path: '/wishlist', icon: Heart },
    { label: t('account.track_order') || 'Track Order', path: '/track', icon: Truck },
  ];

  return (
    <div className="mb-8 sm:mb-10">
      {/* ─── 1. LUXURY MEMBER IDENTIFICATION BANNER ─── */}
      <div className="rounded-3xl bg-white border border-[#ECE8DE] p-5 sm:p-7 shadow-xs mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Monogram or Photo Avatar Badge */}
            <Link
              to="/account/profile"
              title="Edit Profile & Photo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-[#EEF2EB] text-[#71856B] border border-[#71856B]/25 flex items-center justify-center font-serif text-lg sm:text-xl font-bold tracking-wider shrink-0 shadow-2xs relative group no-underline hover:ring-2 hover:ring-[#71856B]/40 transition-all"
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={customer?.name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(customer?.name)
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                <Camera size={16} />
              </div>
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-serif text-lg sm:text-2xl font-normal text-[#1F2520] truncate">
                  {customer?.name || 'Valued Member'}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#71856B]/10 text-[#71856B] border border-[#71856B]/25">
                  <Sparkles size={11} className="text-[#C29B38]" /> Dispensary Member
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#5A6358] truncate mt-0.5 font-normal">
                {customer?.email || 'Authenticated Botanical Account'}
              </p>
            </div>
          </div>

          {/* Quick Sign Out Action */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#ECE8DE] hover:border-[#C55A48] hover:bg-[#C55A48]/5 text-xs font-medium text-[#5A6358] hover:text-[#C55A48] transition-all"
              title={t('account.sign_out')}
            >
              <LogOut size={13} />
              <span>{t('account.sign_out') || 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. DASHBOARD NAVIGATION TABS (PILL BAR) ─── */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl sm:rounded-full bg-white border border-[#ECE8DE] shadow-xs overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-150 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#1F2520] text-white shadow-xs'
                    : 'text-[#5A6358] hover:text-[#1F2520] hover:bg-[#FAF9F5]'
                }`
              }
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
