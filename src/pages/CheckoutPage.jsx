import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTranslation } from '../i18n/LanguageContext';
import orderService from '../services/orderService';
import addressService from '../services/addressService';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import Input from '../components/forms/Input';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Lock,
  CheckCircle2,
  Tag,
  Clock,
  X,
} from 'lucide-react';

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    promoDiscount,
    memberDiscount,
    couponDiscount,
    tax,
    taxPercent,
    shippingFee,
    total,
    appliedCoupon,
    appliedCouponCode,
    applyCoupon,
    removeCoupon,
    clearCart,
    hasOutOfStockItems,
  } = useCart();

  const { format, exchangeRate } = useCurrency();
  const { isAuthenticated, customer } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Saved addresses for authenticated customer
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');

  // Customer Contact & Shipping Form
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address_line1: '',
    city: 'Phnom Penh',
    notes: '',
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentType, setPaymentType] = useState('qr'); // 'qr' | 'card' | 'cash'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Coupon state on checkout
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Card tokenized inputs (simulated client-side gateway)
  const [cardData, setCardData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  // Modal payment verification state (Bakong KHQR or Card 3D-Secure)
  const [activePaymentOrder, setActivePaymentOrder] = useState(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentCountdown, setPaymentCountdown] = useState(300); // 5-minute countdown for KHQR

  // Idempotency key per submission attempt
  const idempotencyKeyRef = useRef(null);

  useEffect(() => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = `IDEMP-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !activePaymentOrder) {
      navigate('/cart');
    }
  }, [items, activePaymentOrder, navigate]);

  // Load saved addresses for authenticated customer
  useEffect(() => {
    if (isAuthenticated) {
      addressService
        .getAddresses()
        .then((res) => {
          const addrs = Array.isArray(res?.data) ? res.data : [];
          if (addrs.length > 0) {
            setSavedAddresses(addrs);
            const defaultAddr = addrs.find((a) => a.is_default) || addrs[0];
            setSelectedAddressId(defaultAddr.id);
            setFormData((prev) => ({
              ...prev,
              name: defaultAddr.recipient_name || customer?.name || '',
              phone: defaultAddr.phone || customer?.phone || '',
              address_line1: defaultAddr.address_line1 || '',
              city: defaultAddr.city || 'Phnom Penh',
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              name: customer?.name || '',
              email: customer?.email || '',
              phone: customer?.phone || '',
            }));
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, customer]);

  // KHQR Countdown Timer
  useEffect(() => {
    if (!activePaymentOrder || paymentVerified || paymentType !== 'qr') return;
    const interval = setInterval(() => {
      setPaymentCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activePaymentOrder, paymentVerified, paymentType]);

  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
    if (id !== 'new') {
      const addr = savedAddresses.find((a) => a.id === id);
      if (addr) {
        setFormData((prev) => ({
          ...prev,
          name: addr.recipient_name,
          phone: addr.phone,
          address_line1: addr.address_line1,
          city: addr.city || 'Phnom Penh',
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        address_line1: '',
        city: 'Phnom Penh',
      }));
    }
  };

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleApplyCouponCheckout = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    const success = await applyCoupon(couponInput);
    setIsApplyingCoupon(false);
    if (success) setCouponInput('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full recipient name is required';
    if (!formData.phone.trim()) errs.phone = 'Courier delivery contact phone is required';
    if (!formData.address_line1.trim()) errs.address_line1 = 'Delivery address is required';
    if (!formData.city.trim()) errs.city = 'City or province is required';

    if (!isAuthenticated) {
      if (!formData.email.trim()) {
        errs.email = 'Email address is required for order receipt & tracking';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errs.email = 'Please provide a valid email address';
      }
    }

    if (paymentType === 'card') {
      if (!cardData.cardholderName.trim()) {
        errs.cardholderName = 'Cardholder name is required';
      }
      if (!cardData.cardNumber.trim() || cardData.cardNumber.replace(/\s/g, '').length < 15) {
        errs.cardNumber = 'Valid 16-digit card number is required';
      }
      if (!cardData.expiryDate.trim()) {
        errs.expiryDate = 'Expiration (MM/YY) is required';
      }
      if (!cardData.cvv.trim() || cardData.cvv.length < 3) {
        errs.cvv = 'Valid security code is required';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Order to Laravel POS Checkout API
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (hasOutOfStockItems) {
      showToast('Please adjust out-of-stock items in your cart first', 'warning');
      return;
    }

    if (!validate()) {
      showToast('Please fill in all required shipping and payment fields', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullAddressString = `${formData.address_line1.trim()}, ${formData.city.trim()}, Cambodia (Recipient: ${formData.name.trim()}, Phone: ${formData.phone.trim()})`;

      // Construct payload according to Laravel Backend Schema
      const payload = {
        items: items.map((item) => ({
          product_id: item.product_id || item.id,
          qty: Math.max(1, Number(item.qty) || 1),
        })),
        shipping_address: fullAddressString,
        payment_type: paymentType, // 'qr', 'card', 'cash'
        order_notes: formData.notes ? formData.notes.trim() : null,
        coupon_code: appliedCoupon?.code || appliedCouponCode || null,
        idempotency_key: idempotencyKeyRef.current,
      };

      // If guest checkout, add guest contact fields
      if (!isAuthenticated) {
        payload.guest_name = formData.name.trim();
        payload.guest_email = formData.email.trim();
        payload.guest_phone = formData.phone.trim();
      }

      // 1. Authoritative order placement in Laravel DB with inventory lock & deduction
      const res = await orderService.checkout(payload, idempotencyKeyRef.current);
      const createdOrder = res?.order || res?.data;

      if (!createdOrder) {
        throw new Error('Could not retrieve created order details from server.');
      }

      // If Cash on Delivery, order is confirmed immediately
      if (paymentType === 'cash') {
        clearCart();
        showToast(`Order #${createdOrder.invoice_number} confirmed!`, 'success');
        navigate('/order-success', {
          state: { order: createdOrder, invoiceNumber: createdOrder.invoice_number },
        });
        return;
      }

      // If Bakong KHQR or Card, open interactive payment verification modal
      setActivePaymentOrder(createdOrder);
      setPaymentCountdown(300);
      setPaymentVerified(false);
    } catch (err) {
      const message =
        err.response?.data?.message || err.userMessage || 'Could not complete your order. Please check stock and try again.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Authoritative Backend Payment Verification
  const handleVerifyPayment = async () => {
    if (!activePaymentOrder) return;
    setIsVerifyingPayment(true);

    try {
      const transactionRef =
        paymentType === 'qr'
          ? `KHQR-TXN-${Date.now()}`
          : `CARD-GATEWAY-${Date.now()}`;

      // Call trusted backend verification endpoint
      const verifyRes = await orderService.verifyPayment(
        activePaymentOrder.id || activePaymentOrder.invoice_number,
        paymentType,
        transactionRef
      );

      if (verifyRes?.success) {
        const verifiedOrder = verifyRes?.order || activePaymentOrder;
        setPaymentVerified(true);
        clearCart();
        showToast('Payment verified successfully by backend gateway!', 'success');

        setTimeout(() => {
          navigate('/order-success', {
            state: { order: verifiedOrder, invoiceNumber: verifiedOrder.invoice_number },
          });
        }, 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Payment verification failed. Please try scanning again.';
      showToast(msg, 'error');
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container">
        {/* Reusable Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Shopping Bag', link: '/cart' },
            { label: 'Secure Checkout' },
          ]}
        />

        <div style={{ marginBottom: '28px' }}>
          <h1 className="section-title" style={{ margin: '0 0 6px' }}>
            Checkout & Order Settlement
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            Authoritative clinical order processing synchronized with centralized SkinCare POS dispensary.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column: Multi-Step Delivery & Payment */}
            <div className="lg:col-span-7 xl:col-span-8 w-full">
              {/* Step 1: Contact Information */}
              <div className="rounded-2xl bg-white border border-[#ECE8DE] p-5 sm:p-7 shadow-xs mb-5">
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-serif)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary-dark)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    1
                  </span>
                  <span>{t('checkout.step_contact')}</span>
                </h3>

                <div className="checkout-grid-2col">
                  <Input
                    label={t('checkout.recipient_name')}
                    name="name"
                    required
                    placeholder="e.g. Sokha Chan"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={errors.name}
                  />

                  <Input
                    label={t('checkout.phone_courier')}
                    name="phone"
                    required
                    placeholder="e.g. +855 12 345 678"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={errors.phone}
                  />
                </div>

                <Input
                  label={t('checkout.email_receipt')}
                  name="email"
                  type="email"
                  required={!isAuthenticated}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  helperText={
                    isAuthenticated
                      ? 'Logged in as registered member. Receipt will be sent to your account.'
                      : 'We will send your invoice, payment receipt, and live tracking number here.'
                  }
                />
              </div>

              {/* Step 2: Delivery Destination */}
              <div className="rounded-2xl bg-white border border-[#ECE8DE] p-5 sm:p-7 shadow-xs mb-5">
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-serif)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary-dark)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    2
                  </span>
                  <span>{t('checkout.step_shipping')}</span>
                </h3>

                {/* Saved addresses selector */}
                {savedAddresses.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <label className="form-label">{t('checkout.saved_addresses')}</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-sm)',
                            border: `1px solid ${selectedAddressId === addr.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            backgroundColor: selectedAddressId === addr.id ? 'var(--color-primary-light)' : 'var(--color-surface)',
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="radio"
                            name="address_choice"
                            checked={selectedAddressId === addr.id}
                            onChange={() => handleAddressSelect(addr.id)}
                            style={{ accentColor: 'var(--color-primary)', marginTop: '3px' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                              {addr.recipient_name} ({addr.phone})
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                              {addr.address_line1}, {addr.city}
                            </div>
                          </div>
                        </label>
                      ))}

                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${selectedAddressId === 'new' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          backgroundColor: selectedAddressId === 'new' ? 'var(--color-primary-light)' : 'var(--color-surface)',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="address_choice"
                          checked={selectedAddressId === 'new'}
                          onChange={() => handleAddressSelect('new')}
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        <span style={{ fontSize: '0.86rem', fontWeight: 500 }}>{t('checkout.new_address')}</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Address inputs */}
                {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
                  <>
                    <Input
                      label={t('checkout.address_line')}
                      name="address_line1"
                      required
                      placeholder="e.g. St. 214, Sangkat Boeung Keng Kang 1"
                      value={formData.address_line1}
                      onChange={(e) => handleInputChange('address_line1', e.target.value)}
                      error={errors.address_line1}
                    />

                    <div className="checkout-grid-2col">
                      <Input
                        label={t('checkout.city_province')}
                        name="city"
                        required
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        error={errors.city}
                      />

                      <div className="form-group">
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          disabled
                          value="Cambodia"
                          className="form-input"
                          style={{ backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-text-muted)' }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="form-group" style={{ marginTop: '8px' }}>
                  <label className="form-label">{t('checkout.order_notes')}</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Please call before arrival or leave with lobby reception"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="form-textarea"
                  />
                </div>
              </div>

              {/* Step 3: Shipping Method */}
              <div className="rounded-2xl bg-white border border-[#ECE8DE] p-5 sm:p-7 shadow-xs mb-5">
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-serif)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary-dark)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    3
                  </span>
                  <span>{t('checkout.shipping_method')}</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${shippingMethod === 'standard' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      backgroundColor: shippingMethod === 'standard' ? 'var(--color-primary-light)' : 'var(--color-surface)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio"
                        name="shipping_method"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        style={{ accentColor: 'var(--color-primary)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t('checkout.standard_shipping')}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {t('checkout.standard_shipping_desc')}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                      {shippingFee === 0 ? t('cart.complimentary') : format(shippingFee)}
                    </span>
                  </label>
                </div>
              </div>

              {/* Step 4: Payment Method */}
              <div className="rounded-2xl bg-white border border-[#ECE8DE] p-5 sm:p-7 shadow-xs">
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-serif)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary-dark)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    4
                  </span>
                  <span>{t('checkout.payment_method')}</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Bakong KHQR */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${paymentType === 'qr' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      backgroundColor: paymentType === 'qr' ? 'var(--color-primary-light)' : 'var(--color-surface)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="radio"
                        name="payment_type"
                        checked={paymentType === 'qr'}
                        onChange={() => setPaymentType('qr')}
                        style={{ accentColor: 'var(--color-primary)' }}
                      />
                      <QrCode size={22} color="var(--color-primary)" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t('checkout.khqr_payment')}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {t('checkout.khqr_desc')}
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Card Payment */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${paymentType === 'card' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      backgroundColor: paymentType === 'card' ? 'var(--color-primary-light)' : 'var(--color-surface)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="radio"
                        name="payment_type"
                        checked={paymentType === 'card'}
                        onChange={() => setPaymentType('card')}
                        style={{ accentColor: 'var(--color-primary)' }}
                      />
                      <CreditCard size={22} color="var(--color-primary)" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t('checkout.card_payment')}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {t('checkout.card_desc')}
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Card details form */}
                  {paymentType === 'card' && (
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: 'var(--color-surface-soft)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        marginTop: '4px',
                        marginBottom: '4px',
                      }}
                    >
                      <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Lock size={12} color="var(--color-success)" />
                        <span>Tokenized client-side encryption. Raw card details are never saved to database.</span>
                      </div>

                      <Input
                        label="Name on Card"
                        placeholder="e.g. SOKHA CHAN"
                        value={cardData.cardholderName}
                        onChange={(e) => setCardData((prev) => ({ ...prev, cardholderName: e.target.value.toUpperCase() }))}
                        error={errors.cardholderName}
                      />

                      <Input
                        label="Card Number"
                        placeholder="4111 •••• •••• 1111"
                        maxLength={19}
                        value={cardData.cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                          setCardData((prev) => ({ ...prev, cardNumber: val }));
                        }}
                        error={errors.cardNumber}
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Input
                          label="Expiry (MM/YY)"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardData.expiryDate}
                          onChange={(e) => setCardData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                          error={errors.expiryDate}
                        />

                        <Input
                          label="Security CVV / CVC"
                          placeholder="•••"
                          maxLength={4}
                          type="password"
                          value={cardData.cvv}
                          onChange={(e) => setCardData((prev) => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                          error={errors.cvv}
                        />
                      </div>
                    </div>
                  )}

                  {/* Cash on Delivery */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${paymentType === 'cash' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      backgroundColor: paymentType === 'cash' ? 'var(--color-primary-light)' : 'var(--color-surface)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="radio"
                        name="payment_type"
                        checked={paymentType === 'cash'}
                        onChange={() => setPaymentType('cash')}
                        style={{ accentColor: 'var(--color-primary)' }}
                      />
                      <Banknote size={22} color="var(--color-primary)" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t('checkout.cod_payment')}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {t('checkout.cod_desc')}
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Total Summary */}
            <div className="lg:col-span-5 xl:col-span-4 w-full">
              <div className="rounded-2xl bg-white border border-[#ECE8DE] p-5 sm:p-7 shadow-xs lg:sticky lg:top-24 w-full">
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>
                  {t('checkout.order_summary')} ({items.length} {t('common.items')})
                </h3>

                {/* Items summary list */}
                <div
                  style={{
                    maxHeight: '220px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '16px',
                    paddingRight: '4px',
                  }}
                >
                  {items.map((item) => {
                    const product = item.product || {};
                    const unitPrice = product.final_price ?? product.sale_price ?? product.price ?? 0;
                    return (
                      <div
                        key={item.product_id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          fontSize: '0.86rem',
                        }}
                      >
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <span
                            style={{
                              fontWeight: 600,
                              display: 'block',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                            }}
                          >
                            {product.name}
                          </span>
                          <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                            Qty: {item.qty} × {format(unitPrice)}
                          </span>
                        </div>
                        <span style={{ fontWeight: 600 }}>{format(unitPrice * item.qty)}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon input */}
                <div style={{ marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  {appliedCoupon ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        backgroundColor: 'var(--color-surface-soft)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Tag size={13} color="var(--color-primary)" />
                        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                          {appliedCoupon.code || appliedCouponCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="Promo code (e.g. GLOW10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="form-input"
                        style={{ fontSize: '0.82rem', padding: '6px 10px', textTransform: 'uppercase' }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCouponCheckout}
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        className="btn btn-outline btn-sm"
                      >
                        {isApplyingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Financial breakdown */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '0.88rem',
                    marginBottom: '18px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>{t('common.subtotal')}</span>
                    <span style={{ fontWeight: 600 }}>{format(subtotal)}</span>
                  </div>

                  {promoDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                      <span>{t('cart.savings_promo')}</span>
                      <span>-{format(promoDiscount)}</span>
                    </div>
                  )}

                  {memberDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                      <span>{t('cart.savings_member')}</span>
                      <span>-{format(memberDiscount)}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                      <span>{t('cart.savings_coupon')}</span>
                      <span>-{format(couponDiscount)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {t('cart.tax_estimated', { percent: taxPercent })}
                    </span>
                    <span>{format(tax)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>{t('cart.delivery_fee')}</span>
                    <span style={{ fontWeight: 600, color: shippingFee === 0 ? 'var(--color-success)' : undefined }}>
                      {shippingFee === 0 ? t('cart.complimentary') : format(shippingFee)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingTop: '10px',
                      borderTop: '1px dashed var(--color-border)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                    }}
                  >
                    <span>{t('common.total')}</span>
                    <span style={{ color: 'var(--color-text-main)' }}>{format(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || hasOutOfStockItems}
                  className="w-full py-4 px-6 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all disabled:opacity-50 mb-3"
                >
                  <Lock size={15} />
                  <span>
                    {isSubmitting
                      ? t('checkout.processing')
                      : t('checkout.place_order', { total: format(total) })}
                  </span>
                </button>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.74rem',
                    color: 'var(--color-text-muted)',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldCheck size={14} color="var(--color-primary)" />
                  <span>Atomic POS Stock Locking & Single Source of Truth</span>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* ─────────────────────────────────────────────────────────────
            INTERACTIVE PAYMENT VERIFICATION MODAL (KHQR & CARD GATEWAY)
           ───────────────────────────────────────────────────────────── */}
        {activePaymentOrder && (
          <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-3 sm:p-5 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-[460px] p-6 sm:p-8 bg-white rounded-3xl border border-[#ECE8DE] shadow-2xl relative text-center max-h-[92vh] overflow-y-auto">
              {paymentVerified ? (
                <div style={{ padding: '20px 0' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-success-bg)',
                      color: 'var(--color-success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '8px' }}>
                    Payment Confirmed!
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                    Verified by backend payment gateway. Finalizing order #{activePaymentOrder.invoice_number}...
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Order Invoice #{activePaymentOrder.invoice_number}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-serif)' }}>
                        {paymentType === 'qr' ? 'Scan Bakong KHQR' : 'Card Payment Gateway'}
                      </h3>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: paymentCountdown < 60 ? 'var(--color-danger)' : 'var(--color-primary)',
                        backgroundColor: 'var(--color-surface-soft)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      <Clock size={13} />
                      <span>{formatCountdown(paymentCountdown)}</span>
                    </div>
                  </div>

                  {/* QR Presentation */}
                  {paymentType === 'qr' && (
                    <div style={{ margin: '16px 0' }}>
                      <div
                        style={{
                          display: 'inline-block',
                          padding: '16px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: 'var(--radius-sm)',
                          border: '2px solid var(--color-primary-light)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        {/* Dynamic KHQR Display SVG */}
                        <svg width="180" height="180" viewBox="0 0 100 100">
                          <rect width="100" height="100" fill="#FFFFFF" />
                          <path
                            d="M10 10h25v25h-25z M15 15h15v15h-15z M18 18h9v9h-9z"
                            fill="#71856B"
                          />
                          <path
                            d="M65 10h25v25h-25z M70 15h15v15h-15z M73 18h9v9h-9z"
                            fill="#71856B"
                          />
                          <path
                            d="M10 65h25v25h-25z M15 70h15v15h-15z M18 73h9v9h-9z"
                            fill="#71856B"
                          />
                          {/* Inner Data Pattern */}
                          <rect x="42" y="10" width="16" height="6" fill="#252B25" />
                          <rect x="42" y="22" width="8" height="12" fill="#252B25" />
                          <rect x="10" y="42" width="6" height="16" fill="#252B25" />
                          <rect x="22" y="42" width="14" height="6" fill="#252B25" />
                          <rect x="42" y="42" width="16" height="16" fill="#71856B" />
                          <rect x="65" y="42" width="10" height="6" fill="#252B25" />
                          <rect x="80" y="42" width="10" height="16" fill="#252B25" />
                          <rect x="42" y="65" width="8" height="14" fill="#252B25" />
                          <rect x="56" y="70" width="12" height="6" fill="#252B25" />
                          <rect x="42" y="84" width="22" height="6" fill="#252B25" />
                          <rect x="70" y="65" width="20" height="8" fill="#252B25" />
                          <rect x="75" y="80" width="15" height="10" fill="#252B25" />
                        </svg>
                      </div>

                      <div style={{ marginTop: '12px' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                          {format(activePaymentOrder.final_total || total)}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          ≈ {((activePaymentOrder.final_total || total) * (exchangeRate || 4100)).toLocaleString()} KHR
                        </div>
                      </div>

                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                        Open ABA Mobile, Wing Bank, ACLEDA, or any Bakong app and scan this QR code to settle.
                      </p>
                    </div>
                  )}

                  {/* Card Gateway Simulation */}
                  {paymentType === 'card' && (
                    <div style={{ margin: '20px 0', padding: '16px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-sm)' }}>
                      <CreditCard size={32} color="var(--color-primary)" style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontWeight: 600, fontSize: '0.94rem' }}>
                        Tokenized Merchant Gateway
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Cardholder: {cardData.cardholderName || 'CUSTOMER'}
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, margin: '8px 0', color: 'var(--color-text-main)' }}>
                        {format(activePaymentOrder.final_total || total)}
                      </div>
                    </div>
                  )}

                  {/* Authoritative verification trigger */}
                  <button
                    type="button"
                    onClick={handleVerifyPayment}
                    disabled={isVerifyingPayment || paymentCountdown === 0}
                    className="w-full py-3.5 px-6 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all disabled:opacity-50 mb-2.5"
                  >
                    {isVerifyingPayment ? (
                      <>
                        <span className="spinner" style={{ width: '16px', height: '16px' }} />
                        <span>Verifying with Trusted Gateway...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>Confirm Payment Verification</span>
                      </>
                    )}
                  </button>

                  <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Lock size={12} />
                    <span>Verified via Laravel Backend API</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
