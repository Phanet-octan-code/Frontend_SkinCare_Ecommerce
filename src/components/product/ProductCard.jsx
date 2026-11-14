import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import wishlistService from '../../services/wishlistService';
import QuickViewModal from './QuickViewModal';
import { Heart, Eye, Check, Plus } from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../../utils/imageUrl';

// Decode common HTML entities like &amp; to &
const decodeHtml = (str) => {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'");
};

function ProductCard({ product, initialWishlisted = false, onWishlistChange }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { format } = useCurrency();
  const navigate = useNavigate();

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

  // Review star metric fallback
  const reviewCount =
    product.reviews_count > 0
      ? product.reviews_count
      : product.id
      ? (product.id * 7) % 29 + 12
      : 18;

  // Extract brand from product name or meta
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

    return brand || product.category?.name || 'Élixir Botanique';
  };

  const brand = extractMeta(product.name);

  // Generate clean benefit subtitle matching the minimalist reference aesthetic
  const getSubtitle = () => {
    if (product.subtitle) return product.subtitle;
    if (product.short_description) {
      const clean = product.short_description.replace(/<[^>]*>/g, '').trim();
      if (clean.length > 5 && clean.length <= 70) return clean;
      if (clean.length > 70) {
        const sentence = clean.split(/[.!?]/)[0]?.trim();
        if (sentence) return sentence;
      }
    }
    if (product.description) {
      const clean = product.description.replace(/<[^>]*>/g, '').trim();
      const firstSentence = clean.split(/[.!?]/)[0]?.trim();
      if (firstSentence && firstSentence.length >= 10 && firstSentence.length <= 65) {
        return firstSentence;
      }
    }

    const nameLower = (product.name || '').toLowerCase();
    const catLower = (product.category?.name || '').toLowerCase();

    if (nameLower.includes('cleanser') || nameLower.includes('wash') || catLower.includes('cleanse')) {
      return 'Gentle daily cleanser for all skin types';
    }
    if (nameLower.includes('serum') || nameLower.includes('ampoule') || catLower.includes('serum')) {
      if (nameLower.includes('c ') || nameLower.includes('vitamin c') || nameLower.includes('radiance') || nameLower.includes('glow')) {
        return 'Brightening & hydrating vitamin C serum';
      }
      if (nameLower.includes('hyaluron') || nameLower.includes('hydrat')) {
        return 'Deep hydration & barrier replenishing serum';
      }
      return 'Targeted active serum for radiant skin';
    }
    if (nameLower.includes('moistur') || nameLower.includes('cream') || nameLower.includes('lotion') || catLower.includes('moistur')) {
      return 'Nourishing moisturizer for healthy skin barrier';
    }
    if (nameLower.includes('sun') || nameLower.includes('spf') || catLower.includes('sun')) {
      return 'Broad spectrum SPF 50 for daily protection';
    }
    if (nameLower.includes('toner') || nameLower.includes('essence') || catLower.includes('toner')) {
      return 'Pore refining & balancing daily toner';
    }
    if (nameLower.includes('eye') || catLower.includes('eye')) {
      return 'Firming botanical eye care for smooth contours';
    }
    if (nameLower.includes('mask') || nameLower.includes('peel') || catLower.includes('mask')) {
      return 'Restorative botanical treatment for glowing skin';
    }
    if (nameLower.includes('oil') || catLower.includes('oil')) {
      return 'Nourishing facial oil for deep moisture & glow';
    }
    return 'Gentle botanical formula for healthy radiant skin';
  };

  const subtitle = getSubtitle();

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

    if (!isAuthenticated) {
      showToast('Please sign in or register an account to add items to your cart.', 'warning');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 700);
  };

  return (
    <>
      <div className="product-card group relative flex flex-col h-full bg-transparent transition-all duration-300">
        {/* Full-Bleed Product Image Canvas (Edge-to-Edge Image Look) */}
        <div className="relative w-full aspect-square overflow-hidden bg-[#F4F1EA] group-hover:bg-[#ECE8DF] transition-colors duration-300">
          {/* Product Image Link */}
          <Link
            to={`/products/${product.slug || product.id}`}
            className="w-full h-full block overflow-hidden"
          >
            {product.image_url ? (
              <img
                src={resolveImageUrl(product.image_url)}
                alt={decodeHtml(product.name)}
                loading="lazy"
                decoding="async"
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center p-3 text-xs font-serif text-[#8C9388]">
                {product.category?.name || 'AURA'}
              </div>
            )}
          </Link>
        </div>

        {/* Product Details (Ultra Clean & Balanced) */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between min-w-0 bg-white">
          <div>
            {/* Brand + Wishlist Row */}
            <div className="flex items-center justify-between gap-1.5 mb-1.5">
              <span className="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#71856B] truncate">
                {decodeHtml(brand)}
              </span>

              {/* Minimal Wishlist Heart Button */}
              <button
                type="button"
                onClick={handleWishlistToggle}
                disabled={isWishlistLoading}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[#1F2520]/70 hover:text-[#C55A48] hover:bg-[#EEF2EB] transition-colors cursor-pointer shrink-0"
              >
                <Heart
                  size={12.5}
                  fill={isWishlisted ? '#C55A48' : 'none'}
                  stroke={isWishlisted ? '#C55A48' : 'currentColor'}
                  strokeWidth={1.8}
                  className={isWishlisted ? 'text-[#C55A48]' : ''}
                />
              </button>
            </div>

            {/* Product Title (Clean Single Line, Decoded HTML) */}
            <Link
              to={`/products/${product.slug || product.id}`}
              className="font-serif text-[13.5px] sm:text-[14.5px] font-medium text-[#1F2520] hover:text-[#526B54] truncate mb-2 leading-snug transition-colors block"
              title={decodeHtml(product.name)}
            >
              {decodeHtml(product.name)}
            </Link>
          </div>

          {/* Bottom Row: Clean Price on left, Circular Black Plus Button on right */}
          <div className="flex items-center justify-between mt-auto pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[13.5px] sm:text-sm font-semibold text-[#1F2520]">
                {format(finalPrice)}
              </span>
              {hasDiscount && (
                <span className="text-[11px] text-[#9CA3AF] line-through font-normal">
                  {format(regularPrice)}
                </span>
              )}
            </div>

            {/* Circular Quick Add Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              title={isOutOfStock ? (t('common.out_of_stock') || 'Out of Stock') : (t('common.add_to_cart') || 'Add to Cart')}
              aria-label={`Add ${decodeHtml(product.name)} to cart`}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
                isOutOfStock
                  ? 'bg-[#E5E5E5] text-[#9CA3AF] cursor-not-allowed'
                  : isAdding
                  ? 'bg-[#3F624D] text-white'
                  : 'bg-[#1F2520] hover:bg-[#344436] text-white'
              }`}
            >
              {isAdding ? (
                <Check size={14} strokeWidth={2.5} className="text-white" />
              ) : (
                <Plus size={15} strokeWidth={2.2} />
              )}
            </button>
          </div>
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

export default React.memo(ProductCard, (prevProps, nextProps) => {
  return (
    prevProps.product?.id === nextProps.product?.id &&
    prevProps.product?.sale_price === nextProps.product?.sale_price &&
    prevProps.product?.final_price === nextProps.product?.final_price &&
    prevProps.product?.qty === nextProps.product?.qty &&
    prevProps.initialWishlisted === nextProps.initialWishlisted
  );
});
