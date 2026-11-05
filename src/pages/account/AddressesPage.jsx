import React, { useEffect, useState } from 'react';
import addressService from '../../services/addressService';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n/LanguageContext';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import AccountNav from '../../components/navigation/AccountNav';
import Input from '../../components/forms/Input';
import EmptyState from '../../components/feedback/EmptyState';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, X, Building, Home, Check } from 'lucide-react';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    label: 'Home',
    recipient_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: 'Phnom Penh',
    state_province: '',
    postal_code: '',
    is_default: false,
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchAddresses = async () => {
    try {
      const res = await addressService.getAddresses();
      if (Array.isArray(res?.data)) {
        setAddresses(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setFormError(null);
    setFormData({
      label: 'Home',
      recipient_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: 'Phnom Penh',
      state_province: '',
      postal_code: '',
      is_default: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setFormError(null);
    setFormData({
      label: addr.label || 'Home',
      recipient_name: addr.recipient_name || '',
      phone: addr.phone || '',
      address_line1: addr.address_line1 || '',
      address_line2: addr.address_line2 || '',
      city: addr.city || 'Phnom Penh',
      state_province: addr.state_province || '',
      postal_code: addr.postal_code || '',
      is_default: Boolean(addr.is_default),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.recipient_name.trim() || !formData.address_line1.trim() || !formData.phone.trim()) {
      setFormError('Recipient name, contact phone, and street address are required.');
      return;
    }

    setSaving(true);
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress.id, formData);
        showToast('Delivery address updated successfully.', 'success');
      } else {
        await addressService.createAddress(formData);
        showToast('New delivery address added.', 'success');
      }
      setIsModalOpen(false);
      fetchAddresses();
    } catch (err) {
      setFormError(err.userMessage || 'Failed to save address.');
      showToast(err.userMessage || 'Failed to save address.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (addr) => {
    try {
      await addressService.setDefault(addr.id, addr);
      showToast('Default delivery destination updated.', 'success');
      fetchAddresses();
    } catch (err) {
      showToast(err.userMessage || 'Failed to update default address.', 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this delivery address?')) return;
    try {
      await addressService.deleteAddress(id);
      showToast('Address removed from your address book.', 'info');
      fetchAddresses();
    } catch (err) {
      showToast(err.userMessage || 'Could not delete address.', 'error');
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('account.client_portal') || 'Client Portal', link: '/account/profile' },
            { label: t('account.addresses_title') || 'Saved Addresses' },
          ]}
        />

        {/* Global Account Navigation Bar */}
        <AccountNav />

        {/* Header Title & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F2520] mb-1">
              {t('account.addresses_title') || 'Delivery Destinations'}
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6358] font-normal">
              {t('account.addresses_desc') || 'Manage verified residential and commercial delivery locations for accelerated checkout.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs font-medium tracking-wide flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98] self-start sm:self-auto shrink-0"
          >
            <Plus size={15} />
            <span>{t('account.add_new_address') || 'Add New Address'}</span>
          </button>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-3xl bg-white border border-[#ECE8DE] p-6 h-36 animate-pulse shadow-xs" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-8 sm:p-12 shadow-xs text-center">
            <EmptyState
              icon={MapPin}
              title={t('account.no_addresses_title') || 'No Saved Addresses'}
              description={t('account.no_addresses_desc') || 'You have not added any delivery destinations yet. Add one now for seamless one-click ordering.'}
              actionText={t('account.add_new_address') || 'Add Address'}
              onAction={handleOpenAdd}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`rounded-3xl bg-white p-6 shadow-xs border transition-all flex flex-col justify-between ${
                  addr.is_default
                    ? 'border-[#71856B] ring-1 ring-[#71856B]/20'
                    : 'border-[#ECE8DE] hover:border-[#71856B]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base font-semibold text-[#1F2520]">
                        {addr.label || 'Destination'}
                      </span>
                      {addr.is_default && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#71856B]/10 text-[#71856B] border border-[#71856B]/20">
                          <Check size={11} /> Default
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(addr)}
                        className="p-1.5 rounded-full text-[#7A8578] hover:text-[#1F2520] hover:bg-[#FAF9F5] transition-colors"
                        title="Edit address"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="p-1.5 rounded-full text-[#7A8578] hover:text-[#C55A48] hover:bg-[#C55A48]/10 transition-colors"
                        title="Delete address"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs sm:text-sm text-[#5A6358] mb-4">
                    <p className="font-semibold text-[#1F2520]">{addr.recipient_name}</p>
                    <p>{addr.address_line1}</p>
                    {addr.address_line2 && <p className="text-[#7A8578]">{addr.address_line2}</p>}
                    <p>{addr.city}, Cambodia {addr.postal_code ? `(${addr.postal_code})` : ''}</p>
                    <p className="text-xs text-[#7A8578] pt-1 font-mono">Phone: {addr.phone}</p>
                  </div>
                </div>

                {!addr.is_default && (
                  <div className="pt-3 border-t border-[#ECE8DE]">
                    <button
                      type="button"
                      onClick={() => handleSetDefault(addr)}
                      className="text-xs font-semibold text-[#71856B] hover:text-[#1F2520] transition-colors"
                    >
                      Set as primary default destination →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── ADD / EDIT ADDRESS MODAL ─── */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white border border-[#ECE8DE] shadow-2xl relative max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-xl font-normal text-[#1F2520]">
                  {editingAddress ? 'Update Destination' : 'New Delivery Destination'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full text-[#7A8578] hover:text-[#1F2520] hover:bg-[#FAF9F5] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {formError && (
                <div className="p-3.5 rounded-xl bg-[#C55A48]/10 border border-[#C55A48]/20 text-[#C55A48] text-xs font-medium mb-4">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Label (e.g. Home, Boutique, Clinic)"
                    name="label"
                    placeholder="Home"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  />

                  <Input
                    label="Recipient Full Name"
                    name="recipient_name"
                    required
                    placeholder="Jane Doe"
                    value={formData.recipient_name}
                    onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                  />
                </div>

                <Input
                  label="Courier Contact Phone"
                  name="phone"
                  required
                  placeholder="+855 12 345 678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                <Input
                  label="Street Address / Residence"
                  name="address_line1"
                  required
                  placeholder="Street 51, Building B, Apt 4"
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                />

                <Input
                  label="Apartment, Suite, Unit (Optional)"
                  name="address_line2"
                  placeholder="Floor 2, Room 204"
                  value={formData.address_line2}
                  onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-3.5">
                  <Input
                    label="City / Province"
                    name="city"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />

                  <Input
                    label="Postal Code (Optional)"
                    name="postal_code"
                    placeholder="12000"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-[#5A6358] py-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="w-4 h-4 rounded text-[#71856B] focus:ring-[#71856B] accent-[#71856B]"
                  />
                  <span>Set as primary default delivery destination</span>
                </label>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#ECE8DE]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-[#ECE8DE] hover:border-[#1F2520] text-xs font-medium text-[#1F2520] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs font-medium tracking-wide shadow-xs active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingAddress ? 'Update Destination' : 'Save Destination'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
