import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from '../i18n/LanguageContext';
import { formatDate } from '../utils/formatters';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import {
  CheckCircle2,
  Package,
  Printer,
  ArrowRight,
  Truck,
  MapPin,
  CreditCard,
  QrCode,
} from 'lucide-react';

export default function OrderSuccessPage() {
  const location = useLocation();
  const { format } = useCurrency();
  const { t } = useTranslation();

  const order = location.state?.order;
  const invoiceNumber = location.state?.invoiceNumber || order?.invoice_number;

  if (!order && !invoiceNumber) {
    return (
      <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
        <div className="container" style={{ textAlign: 'center', maxWidth: '560px' }}>
          <Package size={48} style={{ color: 'var(--color-primary)', margin: '0 auto 16px', opacity: 0.8 }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>
            {t('order_success.no_order_title')}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '0.92rem' }}>
            {t('order_success.no_order_desc')}
          </p>
          <Link to="/track" className="btn btn-primary">
            {t('announcement.track_order')}
          </Link>
        </div>
      </div>
    );
  }

  const items = order?.details || order?.items || [];
  const addressText =
    typeof order?.shipping_address === 'string'
      ? order.shipping_address
      : order?.shipping_address?.address_line1
      ? `${order.shipping_address.address_line1}, ${order.shipping_address.city || ''}`
      : 'Standard protected delivery';

  const recipientName =
    order?.customer_name ||
    (typeof order?.shipping_address === 'object' ? order?.shipping_address?.recipient_name : null) ||
    'Valued Customer';

  const paymentTypeLabels = {
    qr: t('checkout.khqr_payment'),
    card: t('checkout.card_payment'),
    cash: t('checkout.cod_payment'),
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container" style={{ maxWidth: '740px' }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('cart.title'), link: '/cart' },
            { label: t('common.confirmed') },
          ]}
        />

        {/* Success Banner */}
        <div
          style={{
            textAlign: 'center',
            padding: '36px 20px',
            backgroundColor: 'var(--color-success-bg)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(78, 124, 89, 0.25)',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#FFFFFF',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <CheckCircle2 size={30} />
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2rem',
              color: 'var(--color-text-main)',
              marginBottom: '6px',
            }}
          >
            {t('order_success.title')}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.94rem', maxWidth: '460px', margin: '0 auto' }}>
            {t('order_success.subtitle')}
          </p>
        </div>

        {/* Invoice Receipt Card */}
        <div className="card p-4 sm:p-8 mb-6">
          {/* Header */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: '18px',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: '20px',
              gap: '14px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t('order_success.invoice_ref')}
              </span>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                {order?.invoice_number || invoiceNumber}
              </div>
              {order?.tracking_number && (
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  {t('order_success.courier_tracking')}: <strong>{order.tracking_number}</strong>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t('order_success.date')}
              </span>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                {formatDate(order?.created_at || order?.sale_date || null, true)}
              </div>
            </div>
          </div>

          {/* Delivery & Fulfillment Details */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                <MapPin size={15} />
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  {t('order_success.destination')}
                </span>
              </div>
              <div style={{ fontSize: '0.86rem', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 600 }}>{recipientName}</div>
                <div style={{ color: 'var(--color-text-secondary)' }}>{addressText}</div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                <Truck size={15} />
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  {t('order_success.status')}
                </span>
              </div>
              <div style={{ fontSize: '0.86rem' }}>
                <span
                  className="badge badge-new"
                  style={{
                    marginBottom: '6px',
                    textTransform: 'capitalize',
                    backgroundColor: order?.status === 'confirmed' ? 'var(--color-success-bg)' : undefined,
                    color: order?.status === 'confirmed' ? 'var(--color-success)' : undefined,
                  }}
                >
                  {order?.status || t('common.confirmed')}
                </span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                {order?.payment_type === 'qr' ? <QrCode size={15} /> : <CreditCard size={15} />}
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  {t('order_success.payment_method_label')}
                </span>
              </div>
              <div style={{ fontSize: '0.86rem' }}>
                <div style={{ fontWeight: 600 }}>
                  {paymentTypeLabels[order?.payment_type] || order?.payment_type?.toUpperCase() || 'Bakong KHQR'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                  {t('order_success.payment_status')}: <strong>{order?.payment_status === 'paid' ? t('order_success.paid') : t('order_success.pending')}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Items summary */}
          {items.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>
                {t('order_success.purchased_formulations', { count: items.length })}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.88rem',
                      padding: '8px 0',
                      borderBottom: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 500 }}>{it.product_name || it.product?.name}</span>
                      <span style={{ color: 'var(--color-text-muted)', marginLeft: '8px' }}>
                        × {it.qty}
                      </span>
                    </div>
                    <span style={{ fontWeight: 600 }}>
                      {format(it.subtotal || it.total || (it.price || it.unit_price) * it.qty)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Totals */}
          <div
            style={{
              paddingTop: '14px',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '0.88rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>{t('common.subtotal')}</span>
              <span>{format(order?.subtotal)}</span>
            </div>

            {order?.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                <span>{t('cart.savings_promo')}</span>
                <span>-{format(order.discount)}</span>
              </div>
            )}

            {order?.tax !== undefined && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{t('common.tax')}</span>
                <span>{format(order.tax)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>{t('cart.delivery_fee')}</span>
              <span>{Number(order?.shipping_fee || 0) === 0 ? t('cart.complimentary') : format(order?.shipping_fee)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px dashed var(--color-border)',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--color-text-main)',
              }}
            >
              <span>{t('common.total')}</span>
              <span>{format(order?.final_total || order?.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full">
          <button type="button" onClick={() => window.print()} className="btn btn-outline btn-sm w-full sm:w-auto justify-center">
            <Printer size={15} />
            <span>{t('order_success.print_receipt')}</span>
          </button>

          <Link
            to={`/track?query=${encodeURIComponent(order?.invoice_number || invoiceNumber)}`}
            className="btn btn-outline btn-sm w-full sm:w-auto justify-center"
          >
            <Truck size={15} />
            <span>{t('order_success.track_order_btn')}</span>
          </Link>

          <Link to="/shop" className="btn btn-primary btn-sm w-full sm:w-auto justify-center">
            <span>{t('order_success.continue_btn')}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
