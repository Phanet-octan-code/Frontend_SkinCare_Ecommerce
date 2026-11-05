import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useTranslation } from '../../i18n/LanguageContext';
import QuantitySelector from './QuantitySelector';
import PriceDisplay from '../product/PriceDisplay';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../../utils/imageUrl';

export default function CartDrawer() {
  const {
    items,
    totalItemCount,
    subtotal,
    shippingFee,
    total,
    freeShippingDifference,
    freeShippingProgress,
    isCartOpen,
    closeCart,
    updateQty,
    removeFromCart,
  } = useCart();

  const { format } = useCurrency();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Close cart drawer on Escape key for accessibility
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="overlay" onClick={closeCart} style={{ zIndex: 1100 }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title')}
        className="drawer"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        {/* Drawer Header */}
        <div
          className="p-4 sm:p-5 border-b border-[#ECE8DE] flex items-center justify-between bg-white"
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-[#71856B]" />
            <h3 className="font-serif text-lg font-semibold text-[#1F2520] m-0">
              {t('cart.title')} ({totalItemCount})
            </h3>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label={t('common.close')}
            className="w-8 h-8 rounded-full bg-[#FAF9F5] hover:bg-[#ECE8DE] text-[#5A6358] hover:text-[#1F2520] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Free Shipping Indicator */}
        <div
          className="px-3.5 sm:px-5 py-2.5 sm:py-3 bg-[var(--color-surface-soft)] border-b border-[var(--color-border-subtle)]"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginBottom: '8px' }}>
            <Sparkles size={13} color="var(--color-primary)" />
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

        {/* Itemized List */}
        <div
          className="flex-1 overflow-y-auto p-3.5 sm:p-5 flex flex-col gap-3.5 sm:gap-4"
        >
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4">
              <div className="w-16 h-16 rounded-full bg-[#F4F6F2] text-[#71856B] flex items-center justify-center mb-4 border border-[#ECE8DE] shadow-2xs shrink-0">
                <ShoppingBag size={26} strokeWidth={1.5} />
              </div>
              <p className="font-serif text-xl font-normal text-[#1F2520] mb-2">
                {t('cart.empty_title')}
              </p>
              <p className="text-xs text-[#5A6358] mb-6 leading-relaxed max-w-xs">
                {t('cart.empty_desc')}
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1F2520] hover:bg-[#2F3A31] text-white text-xs font-semibold tracking-wide shadow-xs hover:shadow transition-all duration-200 active:scale-95 cursor-pointer no-underline mb-8"
                style={{ backgroundColor: '#1F2520', color: '#FFFFFF' }}
              >
                <span>{t('cart.start_shopping')}</span>
                <ArrowRight size={14} />
              </button>

              {/* Curated Recommendations to eliminate dead empty space */}
              <div className="w-full pt-6 border-t border-[#ECE8DE] text-left">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#71856B] block mb-3">
                  Trending in Dispensary
                </span>
                <div className="flex flex-col gap-2.5">
                  <Link
                    to="/shop?search=cleanser"
                    onClick={closeCart}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-white border border-[#ECE8DE] transition-all group no-underline"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#EEF2EB] text-[#71856B] flex items-center justify-center shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div className="min-w-0 pr-1">
                        <span className="text-xs font-semibold text-[#1F2520] block truncate group-hover:text-[#71856B]">
                          Botanical Gel Cleanser
                        </span>
                        <span className="text-[10px] text-[#8C9388] block">Gentle pH 5.5 Balancing</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#1F2520] shrink-0">$28.00</span>
                  </Link>

                  <Link
                    to="/shop?search=serum"
                    onClick={closeCart}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-white border border-[#ECE8DE] transition-all group no-underline"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#EEF2EB] text-[#71856B] flex items-center justify-center shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div className="min-w-0 pr-1">
                        <span className="text-xs font-semibold text-[#1F2520] block truncate group-hover:text-[#71856B]">
                          Hyaluronic Barrier Serum
                        </span>
                        <span className="text-[10px] text-[#8C9388] block">Multi-Molecular Hydration</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#1F2520] shrink-0">$46.00</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            items.map((item) => {
              const product = item.product || {};
              const unitPrice = product.final_price ?? product.price ?? 0;

              return (
                <div
                  key={item.product_id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--color-border-subtle)',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-surface-soft)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    {product.image_url ? (
                      <img
                        src={resolveImageUrl(product.image_url)}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3px', backgroundColor: '#F8F9F7' }}
                        onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80')}
                      />
                    ) : (
                      <div
                        style={{
                          fontSize: '0.62rem',
                          color: 'var(--color-text-muted)',
                          textAlign: 'center',
                          padding: '4px',
                        }}
                      >
                        Élixir Formula
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Link
                          to={`/products/${product.slug || product.id}`}
                          onClick={closeCart}
                          style={{
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            color: 'var(--color-text-main)',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product_id)}
                          aria-label="Remove item"
                          className="text-[#8C9388] hover:text-[#C55A48] hover:scale-110 active:scale-90 transition-all p-1 cursor-pointer ml-1.5"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {product.category_name}
                      </div>
                    </div>

                    {/* Quantity Selector & Price */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                      <QuantitySelector
                        value={item.qty}
                        onChange={(newVal) => updateQty(item.product_id, newVal)}
                        size="sm"
                      />

                      <PriceDisplay
                        regularPrice={product.price * item.qty}
                        finalPrice={unitPrice * item.qty}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div
            className="p-3.5 sm:p-5 border-t border-[#ECE8DE] bg-[var(--color-surface)]"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.86rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>{t('common.subtotal')}</span>
              <span style={{ fontWeight: 600 }}>{format(subtotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '0.86rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>{t('cart.estimated_delivery')}</span>
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
                marginBottom: '18px',
                fontSize: '1.05rem',
              }}
            >
              <span style={{ fontWeight: 700 }}>{t('common.total')}</span>
              <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{format(total)}</span>
            </div>

            <button
              type="button"
              onClick={handleCheckoutClick}
              className="w-full py-3.5 px-6 rounded-full bg-[#1F2520] hover:bg-[#2F3A31] text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all mb-2 cursor-pointer"
              style={{ backgroundColor: '#1F2520', color: '#FFFFFF' }}
            >
              <span>{t('cart.proceed_to_checkout')}</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => {
                closeCart();
                navigate('/cart');
              }}
              className="w-full py-2.5 px-6 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#ECE8DE] hover:border-[#1F2520] text-[#1F2520] text-xs font-semibold tracking-wide flex items-center justify-center transition-all cursor-pointer"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#ECE8DE', color: '#1F2520' }}
            >
              {t('cart.view_full_bag')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
