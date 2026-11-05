import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n/LanguageContext';
import wishlistService from '../../services/wishlistService';
import PriceDisplay from './PriceDisplay';
import RatingDisplay from './RatingDisplay';
import ProductBadge from './ProductBadge';
import QuantitySelector from '../cart/QuantitySelector';
import { X, ShoppingBag, Heart, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Close modal on Escape key for accessibility
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const regularPrice = Number(product.sale_price ?? product.price) || 0;
  const finalPrice = Number(product.final_price ?? product.sale_price ?? product.price) || 0;
  const hasDiscount = Boolean(product.has_discount || regularPrice > finalPrice);
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - finalPrice) / regularPrice) * 100)
    : 0;

  const stockQty = Number(product.qty ?? product.stock ?? 0);
  const isOutOfStock = stockQty <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    addToCart(product, qty);
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 450);
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to save products to your wishlist.', 'info');
      return;
    }
    try {
      if (isWishlisted) {
        await wishlistService.remove(product.id);
        setIsWishlisted(false);
        showToast('Removed from wishlist', 'info');
      } else {
        await wishlistService.add(product.id);
        setIsWishlisted(true);
        showToast('Saved to wishlist', 'success');
      }
    } catch (err) {
      showToast(err.userMessage || 'Could not update wishlist', 'error');
    }
  };

  return (
    <div className="overlay bg-black/50 backdrop-blur-sm" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="modal-dialog w-full max-w-[680px] p-5 sm:p-7 rounded-3xl bg-white border border-[#ECE8DE] shadow-2xl relative max-h-[92vh] overflow-y-auto animate-[modalPop_0.24s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FAF9F5] border border-[#ECE8DE] flex items-center justify-center text-[#5A6358] hover:text-[#1F2520] hover:bg-white hover:scale-105 active:scale-90 transition-all cursor-pointer z-10 shadow-2xs"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
          {/* Image */}
          <div
            style={{
              aspectRatio: '1 / 1',
              backgroundColor: 'var(--color-surface-soft)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80';
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.84rem' }}>
                Élixir Botanique
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-primary)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              {product.category?.name || product.category_name || 'Active Skincare'}
            </span>

            <h3
              id="quick-view-title"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.35rem',
                fontWeight: 600,
                color: 'var(--color-text-main)',
                lineHeight: 1.3,
                marginBottom: '8px',
              }}
            >
              {product.name}
            </h3>

            {/* Ratings only when reviews exist */}
            {product.reviews_count > 0 && (
              <div style={{ marginBottom: '10px' }}>
                <RatingDisplay
                  rating={product.average_rating || product.rating_avg}
                  reviewCount={product.reviews_count}
                  starSize={12}
                />
              </div>
            )}

            {/* Price Box */}
            <div style={{ margin: '12px 0 14px' }}>
              <PriceDisplay
                regularPrice={regularPrice}
                finalPrice={finalPrice}
                size="md"
                showDiscountBadge={hasDiscount}
              />
            </div>

            {/* Short description */}
            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
                marginBottom: '18px',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.description ||
                'Clinical dermatological formulation designed to support the dermal moisture barrier.'}
            </p>

            {/* Stock indicator */}
            <div style={{ marginBottom: '18px' }}>
              {isOutOfStock ? (
                <ProductBadge type="soldout" label={t('common.out_of_stock')} />
              ) : stockQty <= 5 ? (
                <span className="badge badge-sale">{t('common.units_left', { count: stockQty })}</span>
              ) : (
                <span className="badge badge-new" style={{ color: 'var(--color-success)', borderColor: 'rgba(78, 124, 89, 0.3)' }}>
                  {t('common.in_stock')}
                </span>
              )}
            </div>

            {/* Actions with Tactile Micro-Interactions */}
            <div className="flex items-center gap-2.5 mb-4">
              <QuantitySelector
                value={qty}
                onChange={setQty}
                min={1}
                max={stockQty || 99}
                disabled={isOutOfStock}
                size="sm"
              />

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="btn btn-primary flex-1 active:scale-[0.98] transition-transform duration-150 cursor-pointer shadow-xs hover:shadow-md"
              >
                {isAdding ? <Check size={15} /> : <ShoppingBag size={15} />}
                <span>{isOutOfStock ? t('common.out_of_stock') : isAdding ? t('product.added_to_bag') : t('common.add_to_cart')}</span>
              </button>

              <button
                type="button"
                onClick={handleWishlistToggle}
                className={`btn btn-outline p-2.5 active:scale-90 transition-all duration-200 cursor-pointer ${
                  isWishlisted ? 'text-[#C55A48] border-[#F5D5CE] bg-[#FDF0ED]' : 'text-[#1F2520]'
                }`}
                aria-label={isWishlisted ? t('common.remove') : t('common.save')}
              >
                <Heart
                  size={16}
                  fill={isWishlisted ? '#C55A48' : 'none'}
                  stroke={isWishlisted ? '#C55A48' : 'currentColor'}
                  className={isWishlisted ? 'animate-[heartbeat_0.35s_ease-in-out]' : ''}
                />
              </button>
            </div>

            {/* Link to full product page */}
            <Link
              to={`/products/${product.slug || product.id}`}
              onClick={onClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
              }}
            >
              <span>{t('quickview.view_full')}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
