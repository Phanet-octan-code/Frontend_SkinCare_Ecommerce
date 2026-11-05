import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import orderService from '../services/orderService';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/LanguageContext';
import { formatDate } from '../utils/formatters';
import { resolveImageUrl, handleImageError } from '../utils/imageUrl';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import {
  Search,
  Truck,
  CheckCircle2,
  Package,
  AlertCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  User,
  XCircle,
  RotateCcw,
} from 'lucide-react';

export default function OrderTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { customer, isAuthenticated } = useAuth();
  const { format } = useCurrency();
  const { t } = useTranslation();

  // Query parameter parsing
  const initialRef = searchParams.get('reference') || searchParams.get('query') || '';
  const initialId = searchParams.get('identifier') || (customer?.email || customer?.phone || '');

  const [reference, setReference] = useState(initialRef);
  const [identifier, setIdentifier] = useState(initialId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Auto-fill identifier if customer logs in
  useEffect(() => {
    if (customer && !identifier) {
      setIdentifier(customer.email || customer.phone || '');
    }
  }, [customer, identifier]);

  // Execute tracking search
  const handleSearch = async (refVal, idVal) => {
    const cleanRef = (refVal || reference).trim();
    const cleanId = (idVal || identifier).trim();

    if (!cleanRef) {
      setError('Please provide your order invoice number (e.g., INV-20261022-0001) or tracking reference.');
      return;
    }

    if (!cleanId) {
      setError('For security and privacy, please enter the billing email or phone number associated with the order.');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await orderService.trackOrder(cleanRef, cleanId);
      if (res?.data) {
        setOrder(res.data);
      } else {
        setError('No order found matching the provided reference and contact details.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.userMessage || 'No matching order could be found. Please verify your invoice number and contact details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on mount if parameters exist
  useEffect(() => {
    if (initialRef.trim() && initialId.trim()) {
      handleSearch(initialRef.trim(), initialId.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reference.trim() && identifier.trim()) {
      setSearchParams({ reference: reference.trim(), identifier: identifier.trim() });
      handleSearch(reference.trim(), identifier.trim());
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  // Determine current timeline progression based STRICTLY on confirmed backend status
  const getStatusStage = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered' || s === 'completed') return 4;
    if (s === 'shipped') return 3;
    if (s === 'processing' || s === 'confirmed') return 2;
    if (s === 'pending') return 1;
    return 1;
  };

  const isCancelled = ['cancelled', 'void'].includes((order?.status || '').toLowerCase());
  const isReturned = ['returned', 'refunded'].includes((order?.status || '').toLowerCase());
  const currentStep = getStatusStage(order?.status);

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: 'Track Order' }]} />

        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--color-primary)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Authoritative Dispatch Status
          </span>
          <h1 className="section-title" style={{ marginBottom: '8px' }}>
            Live Order & Courier Tracking
          </h1>
          <p className="section-desc" style={{ maxWidth: '580px', margin: '0 auto' }}>
            Check the real-time fulfillment, dispensary synthesis, and delivery progress for your botanical formulations.
          </p>
        </div>

        {/* Tracking Search Card */}
        <div
          className="card"
          style={{
            padding: 'clamp(16px, 3.5vw, 24px) clamp(14px, 3.5vw, 28px)',
            marginBottom: '32px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                gap: '16px',
                marginBottom: '18px',
              }}
            >
              {/* Reference Field */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="track-reference" className="form-label" style={{ fontSize: '0.82rem' }}>
                  Invoice or Tracking # <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="track-reference"
                    type="text"
                    placeholder="e.g. INV-20261022-0001"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ECE8DE] bg-white text-xs sm:text-sm text-[#1F2520] focus:border-[#71856B] focus:ring-1 focus:ring-[#71856B] outline-none transition-all"
                    required
                  />
                  <Search
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-text-muted)',
                    }}
                  />
                </div>
              </div>

              {/* Identifier Field (Email or Phone) */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="track-identifier" className="form-label" style={{ fontSize: '0.82rem' }}>
                  Billing Email or Phone Number <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="track-identifier"
                    type="text"
                    placeholder="e.g. client@example.com or 012345678"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ECE8DE] bg-white text-xs sm:text-sm text-[#1F2520] focus:border-[#71856B] focus:ring-1 focus:ring-[#71856B] outline-none transition-all"
                    required
                  />
                  <User
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-text-muted)',
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <p style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', margin: 0 }}>
                {isAuthenticated ? (
                  <span>
                    Logged in as <strong>{customer?.name}</strong>. Or view all purchases in{' '}
                    <Link to="/account/orders" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                      Order History
                    </Link>
                    .
                  </span>
                ) : (
                  'Orders can only be viewed by matching the contact details provided at checkout.'
                )}
              </p>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
              >
                {loading ? 'Verifying...' : 'Track Package'}
              </button>
            </div>
          </form>
        </div>

        {/* Error Feedback */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px 20px',
              backgroundColor: 'var(--color-danger-bg)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-danger)',
              fontSize: '0.88rem',
              marginBottom: '28px',
              border: '1px solid rgba(166, 68, 68, 0.25)',
              lineHeight: 1.5,
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '2px' }}>Lookup Failed</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Verified Order Results Display */}
        {order && (
          <div
            className="card"
            style={{
              padding: 'clamp(16px, 4vw, 32px)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Top Status Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                paddingBottom: '22px',
                borderBottom: '1px solid var(--color-border)',
                marginBottom: '28px',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 600,
                  }}
                >
                  Order Reference
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '2px' }}>
                  {order.invoice_number}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Placed on {order.formatted_date || formatDate(order.created_at)}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  className={`badge ${
                    isCancelled
                      ? 'badge-out-of-stock'
                      : isReturned
                      ? 'badge-sale'
                      : currentStep === 4
                      ? 'badge-new'
                      : 'badge-sale'
                  }`}
                  style={{
                    fontSize: '0.84rem',
                    padding: '6px 14px',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  {order.status || 'PROCESSING'}
                </span>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                  Payment:{' '}
                  <strong
                    style={{
                      color:
                        (order.payment_status || '').toLowerCase() === 'paid'
                          ? 'var(--color-success)'
                          : 'var(--color-warning)',
                    }}
                  >
                    {(order.payment_status || 'PENDING').toUpperCase()}
                  </strong>
                </div>
              </div>
            </div>

            {/* If Order is Cancelled or Returned, show explicit status notice instead of progressive delivery timeline */}
            {isCancelled ? (
              <div
                style={{
                  padding: '20px',
                  backgroundColor: 'rgba(166, 68, 68, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(166, 68, 68, 0.25)',
                  color: 'var(--color-danger)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '28px',
                }}
              >
                <XCircle size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 600, marginBottom: '2px' }}>
                    Order Cancelled
                  </h4>
                  <p style={{ fontSize: '0.84rem', margin: 0, opacity: 0.9 }}>
                    This order was cancelled and inventory has been returned to stock. If paid, funds have been queued for refund.
                  </p>
                </div>
              </div>
            ) : isReturned ? (
              <div
                style={{
                  padding: '20px',
                  backgroundColor: 'rgba(217, 119, 6, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(217, 119, 6, 0.25)',
                  color: '#B45309',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '28px',
                }}
              >
                <RotateCcw size={24} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 600, marginBottom: '2px' }}>
                    Returned to Dispensary
                  </h4>
                  <p style={{ fontSize: '0.84rem', margin: 0, opacity: 0.9 }}>
                    This order has been returned and processed under our 14-day client satisfaction tolerance guarantee.
                  </p>
                </div>
              </div>
            ) : (
              /* PROGRESS TIMELINE: Strictly adheres to confirmed backend status */
              <div style={{ marginBottom: '36px', padding: '0 8px' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    position: 'relative',
                    textAlign: 'center',
                  }}
                >
                  {/* Connecting track line */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '18px',
                      left: '12%',
                      right: '12%',
                      height: '2px',
                      backgroundColor: 'var(--color-border)',
                      zIndex: 0,
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: 'var(--color-primary)',
                        width: `${((Math.max(1, currentStep) - 1) / 3) * 100}%`,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>

                  {/* Step 1: Placed */}
                  <div style={{ position: 'relative', zIndex: 1, padding: '0 2px' }}>
                    <div
                      style={{
                        width: 'clamp(28px, 6vw, 36px)',
                        height: 'clamp(28px, 6vw, 36px)',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: currentStep >= 1 ? 'var(--color-primary)' : 'var(--color-surface)',
                        border: `2px solid ${currentStep >= 1 ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        color: currentStep >= 1 ? '#FFFFFF' : 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 6px',
                        boxShadow: currentStep === 1 ? '0 0 0 4px rgba(113, 133, 107, 0.2)' : 'none',
                      }}
                    >
                      <CheckCircle2 size={16} />
                    </div>
                    <div style={{ fontSize: 'clamp(0.68rem, 2vw, 0.82rem)', fontWeight: currentStep >= 1 ? 700 : 500, color: 'var(--color-text-main)', lineHeight: 1.2 }}>
                      Order Placed
                    </div>
                    <div style={{ fontSize: 'clamp(0.6rem, 1.8vw, 0.72rem)', color: 'var(--color-text-muted)', marginTop: '2px', lineHeight: 1.2 }}>
                      Logged in system
                    </div>
                  </div>

                  {/* Step 2: Formulating / Dispensing */}
                  <div style={{ position: 'relative', zIndex: 1, padding: '0 2px' }}>
                    <div
                      style={{
                        width: 'clamp(28px, 6vw, 36px)',
                        height: 'clamp(28px, 6vw, 36px)',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: currentStep >= 2 ? 'var(--color-primary)' : 'var(--color-surface)',
                        border: `2px solid ${currentStep >= 2 ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        color: currentStep >= 2 ? '#FFFFFF' : 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 6px',
                        boxShadow: currentStep === 2 ? '0 0 0 4px rgba(113, 133, 107, 0.2)' : 'none',
                      }}
                    >
                      <Package size={16} />
                    </div>
                    <div style={{ fontSize: 'clamp(0.68rem, 2vw, 0.82rem)', fontWeight: currentStep >= 2 ? 700 : 500, color: 'var(--color-text-main)', lineHeight: 1.2 }}>
                      Formulating
                    </div>
                    <div style={{ fontSize: 'clamp(0.6rem, 1.8vw, 0.72rem)', color: 'var(--color-text-muted)', marginTop: '2px', lineHeight: 1.2 }}>
                      Batch inspection
                    </div>
                  </div>

                  {/* Step 3: Shipped / In Transit */}
                  <div style={{ position: 'relative', zIndex: 1, padding: '0 2px' }}>
                    <div
                      style={{
                        width: 'clamp(28px, 6vw, 36px)',
                        height: 'clamp(28px, 6vw, 36px)',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: currentStep >= 3 ? 'var(--color-primary)' : 'var(--color-surface)',
                        border: `2px solid ${currentStep >= 3 ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        color: currentStep >= 3 ? '#FFFFFF' : 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 6px',
                        boxShadow: currentStep === 3 ? '0 0 0 4px rgba(113, 133, 107, 0.2)' : 'none',
                      }}
                    >
                      <Truck size={16} />
                    </div>
                    <div style={{ fontSize: 'clamp(0.68rem, 2vw, 0.82rem)', fontWeight: currentStep >= 3 ? 700 : 500, color: 'var(--color-text-main)', lineHeight: 1.2 }}>
                      In Transit
                    </div>
                    <div style={{ fontSize: 'clamp(0.6rem, 1.8vw, 0.72rem)', color: 'var(--color-text-muted)', marginTop: '2px', lineHeight: 1.2 }}>
                      {order.tracking_number ? 'Dispatched' : 'Awaiting'}
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div style={{ position: 'relative', zIndex: 1, padding: '0 2px' }}>
                    <div
                      style={{
                        width: 'clamp(28px, 6vw, 36px)',
                        height: 'clamp(28px, 6vw, 36px)',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: currentStep >= 4 ? 'var(--color-success)' : 'var(--color-surface)',
                        border: `2px solid ${currentStep >= 4 ? 'var(--color-success)' : 'var(--color-border)'}`,
                        color: currentStep >= 4 ? '#FFFFFF' : 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 6px',
                        boxShadow: currentStep === 4 ? '0 0 0 4px rgba(78, 124, 89, 0.2)' : 'none',
                      }}
                    >
                      <CheckCircle2 size={16} />
                    </div>
                    <div style={{ fontSize: 'clamp(0.68rem, 2vw, 0.82rem)', fontWeight: currentStep >= 4 ? 700 : 500, color: 'var(--color-text-main)', lineHeight: 1.2 }}>
                      Delivered
                    </div>
                    <div style={{ fontSize: 'clamp(0.6rem, 1.8vw, 0.72rem)', color: 'var(--color-text-muted)', marginTop: '2px', lineHeight: 1.2 }}>
                      Received
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Waybill / Tracking Banner when provided */}
            {order.tracking_number && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  backgroundColor: 'rgba(113, 133, 107, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(113, 133, 107, 0.25)',
                  marginBottom: '24px',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Truck size={18} color="var(--color-primary)" />
                  <div>
                    <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', display: 'block' }}>
                      Express Courier Waybill
                    </span>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', letterSpacing: '0.04em' }}>
                      {order.tracking_number}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(order.tracking_number)}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}
                >
                  {copiedTracking ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
                  <span>{copiedTracking ? 'Copied' : 'Copy Number'}</span>
                </button>
              </div>
            )}

            {/* Destination, Recipient & Payment Details Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                padding: '20px',
                backgroundColor: 'var(--color-surface-soft)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-subtle)',
                marginBottom: '28px',
                fontSize: '0.85rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                  <MapPin size={14} /> Shipping Destination
                </span>
                <strong style={{ color: 'var(--color-text-main)', display: 'block' }}>
                  {order.shipping_address?.address_line1 || order.customer_address || 'Phnom Penh'}
                </strong>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                  {order.shipping_address?.city || 'Phnom Penh, Cambodia'}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                  <User size={14} /> Recipient
                </span>
                <strong style={{ color: 'var(--color-text-main)', display: 'block' }}>
                  {order.shipping_address?.recipient_name || order.customer_name || 'Customer'}
                </strong>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                  Phone: {order.shipping_address?.phone || order.customer?.phone || 'On file'}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                  <CreditCard size={14} /> Payment Method
                </span>
                <strong style={{ color: 'var(--color-text-main)', display: 'block' }}>
                  {order.payment_type?.toUpperCase() || 'BAKONG KHQR'}
                </strong>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                  Status: {(order.payment_status || 'PENDING').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Itemized Order Package Details */}
            {order.items && order.items.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 600, marginBottom: '14px', color: 'var(--color-text-main)' }}>
                  Items in this Formulation Package ({order.items.length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {item.product_image ? (
                          <img
                            src={resolveImageUrl(item.product_image)}
                            alt={item.product_name}
                            loading="lazy"
                            decoding="async"
                            style={{
                              width: '44px',
                              height: '44px',
                              objectFit: 'contain',
                              padding: '3px',
                              borderRadius: 'var(--radius-xs)',
                              backgroundColor: 'var(--color-surface-soft)',
                            }}
                            onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80')}
                          />
                        ) : (
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              backgroundColor: 'var(--color-surface-soft)',
                              borderRadius: 'var(--radius-xs)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            <Package size={18} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                            {item.product_name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            Qty: {item.qty} × {format(item.price)}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-text-main)' }}>
                        {format(item.subtotal || item.price * item.qty)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Summary */}
            <div
              style={{
                borderTop: '1px solid var(--color-border)',
                paddingTop: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxWidth: '320px',
                marginLeft: 'auto',
                fontSize: '0.86rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Subtotal:</span>
                <span>{format(order.subtotal || order.final_total)}</span>
              </div>

              {Number(order.discount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-danger)' }}>
                  <span>Discounts Applied:</span>
                  <span>-{format(order.discount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Domestic Express Delivery:</span>
                <span>{Number(order.shipping_fee) === 0 ? 'Complimentary' : format(order.shipping_fee)}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: 'var(--color-text-main)',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--color-border)',
                  marginTop: '4px',
                }}
              >
                <span>Final Total:</span>
                <span>{format(order.final_total)}</span>
              </div>
            </div>

            {/* Authenticity Guarantee Footer */}
            <div
              style={{
                marginTop: '28px',
                paddingTop: '16px',
                borderTop: '1px solid var(--color-border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.78rem',
                color: 'var(--color-text-muted)',
              }}
            >
              <ShieldCheck size={16} color="var(--color-primary)" />
              <span>
                All items dispatched from our temperature-regulated Phnom Penh dispensary. Formulations backed by our 14-day tolerance guarantee.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
