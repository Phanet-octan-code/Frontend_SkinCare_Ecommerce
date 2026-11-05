import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from '../i18n/LanguageContext';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import QuantitySelector from '../components/cart/QuantitySelector';
import PriceDisplay from '../components/product/PriceDisplay';
import EmptyState from '../components/feedback/EmptyState';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Tag,
  AlertTriangle,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    totalItemCount,
    subtotal,
    promoDiscount,
    memberDiscount,
    couponDiscount,
    tax,
    taxPercent,
    shippingFee,
    total,
    freeShippingDifference,
    freeShippingProgress,
    appliedCoupon,
    appliedCouponCode,
    isQuoteLoading,
    quoteError,
    outOfStockItems,
    hasOutOfStockItems,
    updateQty,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { format } = useCurrency();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    const success = await applyCoupon(couponInput);
    setIsApplyingCoupon(false);
    if (success) {
      setCouponInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
        <div className="container">
          <Breadcrumbs items={[{ label: t('cart.title') }]} />
          <EmptyState
            icon={ShoppingBag}
            title={t('cart.empty_title')}
            description={t('cart.empty_desc')}
            actionText={t('cart.start_shopping')}
            actionLink="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container">
        {/* Reusable Breadcrumbs */}
        <Breadcrumbs items={[{ label: t('cart.title') }]} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
          <h1 className="section-title" style={{ margin: 0 }}>
            {t('cart.title')} ({totalItemCount} {totalItemCount === 1 ? t('common.item') : t('common.items')})
          </h1>
          {isQuoteLoading && (
            <span style={{ fontSize: '0.82rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="spinner" style={{ width: '12px', height: '12px' }} />
              Updating pricing...
            </span>
          )}
        </div>

        {/* Stock warning alert */}
        {hasOutOfStockItems && (
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#991B1B',
              fontSize: '0.88rem',
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <div>
              {t('cart.stock_notice')}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Items Table / List */}
          <div className="lg:col-span-7 xl:col-span-8 min-w-0">
            {/* Free Shipping Alert Bar */}
            <div
              className="p-4 sm:p-5 mb-5 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] shadow-xs"
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm mb-2">
                <Sparkles size={15} color="var(--color-primary)" />
                {freeShippingDifference === 0 ? (
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                    {t('cart.qualified_free_shipping')}
                  </span>
                ) : (
                  <span>
                    {t('cart.free_shipping_hint', { amount: format(freeShippingDifference) })}
                  </span>
                )}
              </div>
              <div
                style={{
                  height: '5px',
                  backgroundColor: 'var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${freeShippingProgress}%`,
                    height: '100%',
                    backgroundColor: freeShippingDifference === 0 ? 'var(--color-success)' : 'var(--color-primary)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div className="rounded-2xl bg-white border border-[#ECE8DE] overflow-hidden shadow-xs">
              <div
                className="hidden md:grid grid-cols-[3fr_1.2fr_1.2fr_1.2fr_auto] gap-4 p-3.5 sm:px-5 bg-[#FAF9F5] border-b border-[#ECE8DE] text-xs font-bold text-[#71856B] uppercase tracking-[0.1em]"
                id="cart-table-header"
              >
                <div>{t('cart.table_formula')}</div>
                <div style={{ textAlign: 'center' }}>{t('cart.table_price')}</div>
                <div style={{ textAlign: 'center' }}>{t('cart.table_quantity')}</div>
                <div style={{ textAlign: 'right' }}>{t('cart.table_total')}</div>
                <div></div>
              </div>

              {items.map((item) => {
                const product = item.product || {};
                const unitPrice = product.final_price ?? product.sale_price ?? product.price ?? 0;
                const lineTotal = unitPrice * item.qty;

                // Check POS stock warning
                const stockWarning = outOfStockItems.find((o) => o.product_id === item.product_id);

                return (
                  <div
                    key={item.product_id}
                    className="p-3.5 sm:p-5 border-b border-[#ECE8DE] flex flex-col md:grid md:grid-cols-[3fr_1.2fr_1.2fr_1.2fr_auto] gap-3 md:gap-4 items-stretch md:items-center"
                    style={{
                      backgroundColor: stockWarning ? '#FFF5F5' : undefined,
                    }}
                  >
                    {/* Formula & Mobile Price */}
                    <div className="flex gap-3 sm:gap-3.5 items-center min-w-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#FAF9F5] overflow-hidden shrink-0 border border-[#ECE8DE] flex items-center justify-center p-1">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/products/${product.slug || product.id}`}
                          className="text-xs sm:text-sm font-semibold text-text-main block leading-snug mb-0.5 truncate hover:text-primary"
                        >
                          {product.name}
                        </Link>
                        <span className="text-[11px] sm:text-xs text-text-muted block truncate">
                          {product.category_name}
                        </span>
                        {/* Mobile unit price inline */}
                        <div className="md:hidden mt-1">
                          <PriceDisplay
                            regularPrice={product.price}
                            finalPrice={unitPrice}
                            size="sm"
                          />
                        </div>
                        {stockWarning && (
                          <div className="text-danger text-xs mt-1 font-semibold">
                            Only {stockWarning.available_qty} left in stock (Requested {item.qty})
                          </div>
                        )}
                      </div>
                      {/* Mobile Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product_id)}
                        aria-label="Remove item"
                        className="md:hidden p-1.5 text-text-muted hover:text-danger cursor-pointer self-start"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Unit Price (Desktop Column) */}
                    <div className="hidden md:block text-center">
                      <PriceDisplay
                        regularPrice={product.price}
                        finalPrice={unitPrice}
                        size="sm"
                      />
                    </div>

                    {/* Quantity & Mobile Total Row */}
                    <div className="flex items-center justify-between md:justify-center pt-2 md:pt-0 border-t border-dashed border-[#ECE8DE] md:border-0">
                      <div className="flex items-center gap-2">
                        <span className="md:hidden text-xs text-text-muted">Qty:</span>
                        <QuantitySelector
                          value={item.qty}
                          onChange={(val) => updateQty(item.product_id, val)}
                          size="sm"
                        />
                      </div>
                      <div className="md:hidden font-semibold text-sm text-text-main">
                        {format(lineTotal)}
                      </div>
                    </div>

                    {/* Line Total (Desktop Column) */}
                    <div className="hidden md:block text-right font-semibold text-sm">
                      {format(lineTotal)}
                    </div>

                    {/* Remove (Desktop Column) */}
                    <div className="hidden md:block">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product_id)}
                        aria-label="Remove item"
                        className="p-1.5 text-text-muted hover:text-danger cursor-pointer flex items-center justify-center rounded-sm transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions below table */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
              <Link to="/shop" className="btn btn-outline btn-sm w-full sm:w-auto justify-center">
                ← {t('common.continue_shopping')}
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="btn btn-ghost btn-sm text-xs text-danger w-full sm:w-auto justify-center"
              >
                {t('cart.clear_cart')}
              </button>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="lg:col-span-5 xl:col-span-4 min-w-0 w-full">
            <div className="rounded-2xl bg-white border border-[#ECE8DE] p-5 sm:p-7 shadow-xs">
              <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1F2520] mb-4">
                {t('cart.order_summary')}
              </h3>

              {/* Coupon / Promotion Code Input */}
              <div style={{ marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Tag size={13} color="var(--color-primary)" />
                  <span>{t('cart.promo_code')}</span>
                </label>

                {appliedCoupon ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: 'var(--color-surface-soft)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-primary-light)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}>
                      <CheckCircle2 size={14} color="var(--color-success)" />
                      <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                        {appliedCoupon.code || appliedCouponCode}
                      </span>
                      {appliedCoupon.description && (
                        <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                          ({appliedCoupon.description})
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        padding: '2px',
                      }}
                      title={t('common.remove')}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="e.g. GLOW10, SAVE5"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="form-input"
                      style={{ textTransform: 'uppercase', fontSize: '0.86rem', padding: '8px 12px' }}
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="btn btn-outline btn-sm"
                      style={{ flexShrink: 0 }}
                    >
                      {isApplyingCoupon ? '...' : t('cart.apply_code')}
                    </button>
                  </form>
                )}
                {quoteError && (
                  <div style={{ color: 'var(--color-danger)', fontSize: '0.76rem', marginTop: '6px' }}>
                    {quoteError}
                  </div>
                )}
              </div>

              {/* Cost breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px', fontSize: '0.88rem' }}>
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
                  <span style={{ color: 'var(--color-text-muted)' }}>{t('cart.tax_estimated', { percent: taxPercent })}</span>
                  <span>{format(tax)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{t('cart.delivery_fee')}</span>
                  <span style={{ fontWeight: 600, color: shippingFee === 0 ? 'var(--color-success)' : undefined }}>
                    {shippingFee === 0 ? t('cart.complimentary') : format(shippingFee)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  borderTop: '1px dashed var(--color-border)',
                  marginBottom: '20px',
                  fontSize: '1.15rem',
                }}
              >
                <span style={{ fontWeight: 700 }}>{t('cart.final_total')}</span>
                <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{format(total)}</span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                disabled={hasOutOfStockItems}
                className="w-full py-3.5 px-6 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all disabled:opacity-50 mb-3.5"
              >
                <span>{t('cart.proceed_to_checkout')}</span>
                <ArrowRight size={16} />
              </button>

              {hasOutOfStockItems && (
                <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', textAlign: 'center', marginBottom: '10px' }}>
                  {t('cart.resolve_stock_warning')}
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.78rem',
                  color: 'var(--color-text-muted)',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={15} color="var(--color-primary)" />
                <span>{t('cart.pos_inventory_guarantee')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-item-mobile-price {
          display: none;
        }
        @media (max-width: 768px) {
          #cart-table-header {
            display: none !important;
          }
          .cart-item-mobile-price {
            display: block !important;
          }
          .cart-item-row {
            display: grid !important;
            grid-template-columns: 1fr auto !important;
            grid-template-areas:
              "formula remove"
              "qty     total" !important;
            gap: 12px 10px !important;
            padding: 16px 14px !important;
            align-items: center !important;
          }
          .cart-item-col-formula { grid-area: formula; }
          .cart-item-col-remove { grid-area: remove; align-self: start; }
          .cart-item-col-price { display: none !important; }
          .cart-item-col-qty { grid-area: qty; justify-self: start; }
          .cart-item-col-total { grid-area: total; justify-self: end; text-align: right !important; font-size: 1.05rem !important; }
        }
      `}</style>
    </div>
  );
}
