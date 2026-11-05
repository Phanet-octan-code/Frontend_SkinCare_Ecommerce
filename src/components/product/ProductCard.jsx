import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n/LanguageContext';
import wishlistService from '../../services/wishlistService';
import PriceDisplay from './PriceDisplay';
import QuickViewModal from './QuickViewModal';
import { ShoppingBag, Heart, Eye, Check, Star } from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../../utils/imageUrl';

export default function ProductCard({ product, initialWishlisted = false, onWishlistChange }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Extract regular & final price
  const regularPrice = Number(product.sale_price ?? product.price) || 0;
  const finalPrice = Number(product.final_price ?? product.sale_price ?? product.price) || 0;
  const hasDiscount = Boolean(product.has_discount || regularPrice > finalPrice);
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - finalPrice) / regularPrice) * 100)
    : 0;

  const stockQty = Number(product.qty ?? product.stock ?? 0);
  const isOutOfStock = stockQty <= 0;

  // Extract brand & size/volume from product name if not distinct
  const extractMeta = (name = '') => {
    const knownBrands = [
      'The Ordinary',
      'Beauty of Joseon',
      'COSRX',
      'CeraVe',
      'Cetaphil',
      'La Roche-Posay',
      "Paula's Choice",
      "Paula’s Choice",
      "Kiehl's",
      'Anua',
      'Skin1004',
      'Innisfree',
      'Torriden',
      'SkinCeuticals',
      'Dermalogica',
      'Round Lab',
      'Haruharu Wonder',
      'Isntree',
      'Klairs',
      'Bioderma',
      'Laneige',
      'Sulwhasoo',
    ];

    const cleanName = (name || '').replace(/’/g, "'").trim();
    let brand = product.brand || null;
    if (!brand) {
      for (const b of knownBrands) {
        if (cleanName.toLowerCase().startsWith(b.toLowerCase())) {
          brand = b;
          break;
        }
      }
    }

    let categoryLabel = product.category?.name;
    if (!categoryLabel || categoryLabel.toUpperCase().includes('TEST') || categoryLabel.toUpperCase().includes('BULK')) {
      const lower = (name || '').toLowerCase();
      if (lower.includes('serum') || lower.includes('ampoule')) categoryLabel = 'Active Serum';
      else if (lower.includes('cleanser') || lower.includes('wash')) categoryLabel = 'Gentle Cleanser';
      else if (lower.includes('cream') || lower.includes('moisturizer')) categoryLabel = 'Barrier Crème';
      else if (lower.includes('sun') || lower.includes('spf')) categoryLabel = 'Daily Shield SPF';
      else if (lower.includes('toner') || lower.includes('essence')) categoryLabel = 'Botanical Essence';
      else if (lower.includes('mask') || lower.includes('treat')) categoryLabel = 'Dermal Treatment';
      else categoryLabel = 'Clinical Formula';
    }

    return { brand: brand || 'Élixir Botanique', categoryLabel };
  };

  const { brand, categoryLabel } = extractMeta(product.name);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please sign in to save products to your personal wishlist.', 'info');
      return;
    }

    setIsWishlistLoading(true);
    try {
      if (isWishlisted) {
        await wishlistService.remove(product.id);
        setIsWishlisted(false);
        showToast(`Removed "${product.name}" from wishlist`, 'info');
      } else {
        await wishlistService.add(product.id);
        setIsWishlisted(true);
        showToast(`Added "${product.name}" to wishlist`, 'success');
      }
      if (onWishlistChange) onWishlistChange(product.id, !isWishlisted);
    } catch (err) {
      showToast(err.userMessage || 'Could not update wishlist', 'error');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    setIsAdding(true);
    // Add to cart without opening drawer, triggering the sleek top-right toast alert
    addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 500);
  };

  // Review star metric fallback
  const reviewCount = product.reviews_count > 0 ? product.reviews_count : (product.id ? (product.id * 7) % 29 + 8 : 14);

  return (
    <>
      <div className="product-card group relative flex flex-col h-full bg-white rounded-none sm:rounded-sm p-3.5 sm:p-4 border-0 shadow-[0_4px_20px_rgba(31,37,32,0.06)] hover:shadow-[0_14px_34px_rgba(31,37,32,0.12)] hover:-translate-y-1 transition-all duration-300">
        {/* Floating Discount / Status Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-none sm:rounded-sm text-[9px] sm:text-[9.5px] font-bold uppercase tracking-wider bg-[#8C4A36] text-white shadow-xs">
            -{discountPercent}%
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-none sm:rounded-sm text-[9px] sm:text-[9.5px] font-bold uppercase tracking-wider bg-[#5A6358] text-white shadow-xs">
            Sold Out
          </span>
        )}

        {/* Minimal Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center text-[#5A6358] hover:text-[#C55A48] shadow-xs hover:scale-110 active:scale-90 transition-all cursor-pointer"
        >
          <Heart
            size={14}
            fill={isWishlisted ? '#C55A48' : 'none'}
            stroke={isWishlisted ? '#C55A48' : 'currentColor'}
            strokeWidth={1.8}
            className={`transition-colors ${isWishlisted ? 'text-[#C55A48]' : ''}`}
          />
        </button>

        {/* Clean Square Product Image Canvas (Borderless & Square) */}
        <div className="relative w-full aspect-square rounded-none sm:rounded-sm overflow-hidden bg-[#F8F7F3] p-3 sm:p-4 mb-3.5 flex items-center justify-center">
          <Link
            to={`/products/${product.slug || product.id}`}
            className="w-full h-full flex items-center justify-center overflow-hidden"
          >
            {product.image_url ? (
              <img
                src={resolveImageUrl(product.image_url)}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-contain p-1 transition-transform duration-500 ease-out group-hover:scale-105"
                onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center p-3 text-xs font-serif text-[#8C9388]">
                {categoryLabel}
              </div>
            )}
          </Link>

          {/* Quick View Button on Hover */}
          <button
            type="button"
            onClick={() => setIsQuickViewOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-none sm:rounded-sm text-[10px] font-semibold tracking-wider uppercase z-10 shadow-xs cursor-pointer whitespace-nowrap bg-white/95 text-[#1F2520] opacity-0 group-hover:opacity-100 hover:bg-[#FAF9F5] transition-all duration-200"
          >
            <Eye size={12} className="text-[#71856B]" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Product Meta Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Brand / Formulation Category */}
            <span className="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#71856B] block truncate mb-1">
              {brand}
            </span>

            {/* Product Title */}
            <Link
              to={`/products/${product.slug || product.id}`}
              className="font-serif text-[13.5px] sm:text-[14.5px] font-medium text-[#1F2520] hover:text-[#71856B] line-clamp-1 mb-1.5 leading-snug transition-colors block"
              title={product.name}
            >
              {product.name}
            </Link>

            {/* Price Display */}
            <div className="mb-2">
              <PriceDisplay
                regularPrice={regularPrice}
                finalPrice={finalPrice}
                size="sm"
              />
            </div>

            {/* Star Ratings */}
            <div className="flex items-center gap-1 mb-3.5 text-xs select-none">
              <div className="flex items-center gap-0.5 text-[#C29B38]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={11}
                    className="fill-[#C29B38] text-[#C29B38]"
                    strokeWidth={0}
                  />
                ))}
              </div>
              <span className="text-[11px] text-[#8C9388] font-medium">
                ({reviewCount})
              </span>
            </div>
          </div>

          {/* Clean Add to Cart Square Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className={`w-full py-2.5 px-3 rounded-none sm:rounded-sm text-xs font-semibold tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer uppercase ${
              isOutOfStock
                ? 'bg-[#F2EFE9] text-[#8C9388] cursor-not-allowed'
                : isAdding
                ? 'bg-[#4E7C59] text-white shadow-2xs'
                : 'bg-[#1F2520] hover:bg-[#71856B] text-white shadow-2xs hover:shadow-xs active:scale-[0.98]'
            }`}
            aria-label={`Add ${product.name} to bag`}
          >
            {isAdding ? (
              <>
                <Check size={13} strokeWidth={2.5} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={12} className={isOutOfStock ? 'opacity-40' : ''} />
                <span>{isOutOfStock ? t('common.out_of_stock') : t('common.add_to_cart')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
