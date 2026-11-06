import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useTranslation } from '../../i18n/LanguageContext';
import authService from '../../services/authService';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import AccountNav from '../../components/navigation/AccountNav';
import Input from '../../components/forms/Input';
import { getCustomerAvatar, saveCustomerAvatar, compressImageFile } from '../../utils/customerAvatar';
import { User, Lock, Save, ShieldCheck, Award, Package, CreditCard, Sparkles, CheckCircle2, Camera, Upload, Trash2 } from 'lucide-react';

export default function ProfilePage() {
  const { customer, updateCustomerState, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const { format } = useCurrency();
  const { t } = useTranslation();

  // Profile fields
  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [address, setAddress] = useState(customer?.address || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Avatar fields & file input
  const [avatar, setAvatar] = useState(() => getCustomerAvatar(customer));
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState(null);

  // Sync state if customer updates
  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setPhone(customer.phone || '');
      setAddress(customer.address || '');
      setAvatar(getCustomerAvatar(customer));
    }
  }, [customer]);

  const getInitials = (userName) => {
    if (!userName) return 'EB';
    const parts = userName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (JPG, PNG, or WebP).', 'warning');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image file size must be under 8MB.', 'warning');
      return;
    }

    setAvatarLoading(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 400, 0.88);
      setAvatar(compressedDataUrl);

      // Save locally immediately
      saveCustomerAvatar(customer, compressedDataUrl);
      const updatedCustomer = { ...customer, avatar: compressedDataUrl };
      updateCustomerState(updatedCustomer);

      // Also attempt backend update
      try {
        await authService.updateProfile({
          name: name.trim() || customer.name,
          email: customer.email,
          avatar: compressedDataUrl,
        });
      } catch (apiErr) {
        // Even if remote backend doesn't support avatar column, local persistence ensures zero loss
        console.warn('Backend avatar sync warning:', apiErr);
      }

      showToast('Profile photo updated successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to process image.', 'error');
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarLoading(true);
    try {
      setAvatar(null);
      saveCustomerAvatar(customer, null);
      const updatedCustomer = { ...customer, avatar: null };
      updateCustomerState(updatedCustomer);

      try {
        await authService.updateProfile({
          name: name.trim() || customer.name,
          email: customer.email,
          avatar: null,
        });
      } catch (apiErr) {
        console.warn('Backend avatar sync warning:', apiErr);
      }

      showToast('Profile photo removed.', 'info');
    } catch (err) {
      showToast('Failed to remove profile photo.', 'error');
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError(null);

    if (!name.trim()) {
      setProfileError('Full name is required.');
      return;
    }

    setProfileLoading(true);
    try {
      const res = await authService.updateProfile({
        name: name.trim(),
        email: customer.email,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        avatar: avatar || undefined,
      });

      const updated = res.customer || res.data?.customer || res.data;
      if (updated) {
        // Keep avatar in updated state
        if (avatar && !updated.avatar) {
          updated.avatar = avatar;
        }
        updateCustomerState(updated);
      }
      showToast('Profile information successfully updated.', 'success');
    } catch (err) {
      setProfileError(err.userMessage || 'Failed to update profile information.');
      showToast(err.userMessage || 'Failed to update profile.', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdError(null);

    if (!currentPassword) {
      setPwdError('Current password is required to authorize password updates.');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New password confirmation does not match.');
      return;
    }

    setPwdLoading(true);
    try {
      await authService.updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      showToast('Your security credentials have been updated.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwdError(err.userMessage || 'Failed to change password. Please verify your current password.');
      showToast(err.userMessage || 'Password update failed.', 'error');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('account.client_portal') || 'Client Portal', link: '/account/profile' },
            { label: t('account.profile_security') || 'Profile & Security' },
          ]}
        />

        {/* Global Account Navigation Bar */}
        <AccountNav />

        {/* Section Header */}
        <div className="mb-6">
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F2520] mb-1">
            {t('account.profile_title') || 'Client Dashboard & Settings'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6358] font-normal">
            {t('account.profile_desc') || 'Manage your authenticated dispensary credentials, security parameters, and profile details.'}
          </p>
        </div>

        {/* Membership Tier & Loyalty Overview Cards */}
        {customer && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-8">
            {/* Stat 1: Loyalty Tier */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ECE8DE] shadow-xs">
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.1em] text-[#71856B] block mb-1">
                Dispensary Tier
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Award size={18} className="text-[#C29B38] shrink-0" />
                <span className="font-serif text-base sm:text-lg font-semibold text-[#1F2520]">
                  {customer.membership_level || 'Client'} Tier
                </span>
              </div>
            </div>

            {/* Stat 2: Membership ID */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ECE8DE] shadow-xs">
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.1em] text-[#7A8578] block mb-1">
                Membership Code
              </span>
              <div className="mt-1 font-mono text-sm sm:text-base font-semibold text-[#1F2520]">
                {customer.membership_number || 'EB-MEMBER'}
              </div>
            </div>

            {/* Stat 3: Completed Orders */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ECE8DE] shadow-xs">
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.1em] text-[#7A8578] block mb-1">
                Fulfilled Orders
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Package size={17} className="text-[#71856B] shrink-0" />
                <span className="text-base sm:text-lg font-bold text-[#1F2520]">
                  {customer.completed_orders_count || 0}
                </span>
              </div>
            </div>

            {/* Stat 4: Member Status */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ECE8DE] shadow-xs">
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.1em] text-[#7A8578] block mb-1">
                Account Status
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle2 size={16} className="text-[#71856B] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#71856B]">
                  Verified Client
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Profile Photo & Avatar Card */}
        <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 sm:p-7 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
            {/* Avatar Circle with Camera Quick-Action */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-[#EEF2EB] text-[#71856B] border-2 border-[#71856B]/25 flex items-center justify-center font-serif text-xl sm:text-2xl font-bold tracking-wider shadow-xs ring-4 ring-[#FAF9F5]">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={customer?.name || 'User avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(name || customer?.name)
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white flex items-center justify-center shadow-md border-2 border-white transition-transform hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-50"
                title="Change Photo"
                aria-label="Upload customer photo"
              >
                <Camera size={14} />
              </button>
            </div>

            {/* Avatar Details & Actions */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap mb-1">
                <h3 className="font-serif text-base sm:text-lg font-normal text-[#1F2520]">
                  {t('account.profile_photo') || 'Customer Profile Photo'}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF9F5] border border-[#ECE8DE] text-[#7A8578]">
                  {avatar ? 'Custom Photo' : 'Default Monogram'}
                </span>
              </div>
              <p className="text-xs text-[#7A8578] mb-3 max-w-lg">
                Personalize your member experience. Your image will be displayed across your order confirmations, header navigation, and client dispensary dashboard.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading}
                  className="px-4 py-2 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Upload size={13} />
                  <span>{avatarLoading ? 'Processing...' : (avatar ? 'Replace Photo' : 'Upload Image')}</span>
                </button>

                {avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={avatarLoading}
                    className="px-3.5 py-2 rounded-full bg-white hover:bg-[#C55A48]/5 border border-[#ECE8DE] hover:border-[#C55A48] text-[#5A6358] hover:text-[#C55A48] text-xs font-medium tracking-wide flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dual Column: Personal Details & Password Security */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Card 1: Personal Details */}
          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 sm:p-8 shadow-xs">
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1F2520] mb-4 flex items-center gap-2">
              <User size={18} className="text-[#71856B]" />
              <span>{t('account.personal_details') || 'Personal Information'}</span>
            </h3>

            {profileError && (
              <div className="p-3.5 rounded-xl bg-[#C55A48]/10 border border-[#C55A48]/20 text-[#C55A48] text-xs font-medium mb-4">
                {profileError}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                label={t('account.full_name') || 'Full Name'}
                name="name"
                required
                placeholder="e.g. Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label={t('account.phone_number') || 'Phone Number'}
                name="phone"
                placeholder="+855 12 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div>
                <label className="block text-xs font-semibold text-[#1F2520] mb-1.5">
                  {t('account.email_address') || 'Email Address'}
                </label>
                <input
                  type="email"
                  disabled
                  value={customer?.email || ''}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ECE8DE] bg-[#FAF9F5] text-xs sm:text-sm text-[#7A8578] cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2520] mb-1.5">
                  {t('account.default_address') || 'Delivery Address'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. St. 214, Sangkat Boeung Keng Kang 1, Phnom Penh"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ECE8DE] bg-white text-xs sm:text-sm text-[#1F2520] focus:border-[#71856B] focus:ring-1 focus:ring-[#71856B] outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <Save size={15} />
                <span>{profileLoading ? t('account.saving') || 'Saving...' : t('account.save_changes') || 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>

          {/* Card 2: Password Security */}
          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 sm:p-8 shadow-xs">
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1F2520] mb-4 flex items-center gap-2">
              <Lock size={18} className="text-[#71856B]" />
              <span>{t('account.security_password') || 'Security & Credentials'}</span>
            </h3>

            {pwdError && (
              <div className="p-3.5 rounded-xl bg-[#C55A48]/10 border border-[#C55A48]/20 text-[#C55A48] text-xs font-medium mb-4">
                {pwdError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label={t('account.current_password') || 'Current Password'}
                name="current_password"
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <Input
                label={t('account.new_password') || 'New Password'}
                name="new_password"
                type="password"
                required
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <Input
                label={t('account.confirm_password') || 'Confirm New Password'}
                name="confirm_password"
                type="password"
                required
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="submit"
                disabled={pwdLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#1F2520] text-[#1F2520] hover:bg-[#1F2520] hover:text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <ShieldCheck size={15} />
                <span>{pwdLoading ? t('account.updating') || 'Updating...' : t('account.update_password') || 'Update Password'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
