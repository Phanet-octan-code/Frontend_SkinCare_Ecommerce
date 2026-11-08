import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import catalogService from '../services/catalogService';
import wishlistService from '../services/wishlistService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTranslation } from '../i18n/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PriceDisplay from '../components/product/PriceDisplay';
import RatingDisplay from '../components/product/RatingDisplay';
import ProductBadge from '../components/product/ProductBadge';
import ProductGallery from '../components/product/ProductGallery';
import ProductCard from '../components/product/ProductCard';
import ProductCarousel from '../components/product/ProductCarousel';
import QuantitySelector from '../components/cart/QuantitySelector';
import { DetailSkeleton } from '../components/feedback/LoadingSkeleton';
import ErrorState from '../components/feedback/ErrorState';
import {
  ShoppingBag,
  Zap,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  ChevronDown,
  ChevronUp,
  Star,
  Info,
} from 'lucide-react';

const RECENTLY_VIEWED_KEY = 'skincare_recently_viewed';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { format } = useCurrency();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Tabs for detailed specifications
  const [activeTab, setActiveTab] = useState('formulation'); // 'formulation' | 'usage' | 'shipping' | 'reviews'

  // Review submission form state
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Load product, related products, and sync recently viewed
  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      setError(null);
      setQty(1);

      try {
        const res = await catalogService.getProduct(slug);
        if (res?.data) {
          const item = res.data;
          setProduct(item);

          // Track recently viewed in localStorage
          try {
            const rawStored = localStorage.getItem(RECENTLY_VIEWED_KEY);
            const parsed = rawStored ? JSON.parse(rawStored) : [];
            const filtered = parsed.filter((p) => String(p.id) !== String(item.id));
            const updated = [
              {
                id: item.id,
                name: item.name,
                sale_price: item.sale_price,
                final_price: item.final_price,
                has_discount: item.has_discount,
                discount_label: item.discount_label,
                image_url: item.image_url,
                category: item.category,
                qty: item.qty,
                barcode: item.barcode,
              },
              ...filtered,
            ].slice(0, 8);
            localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
            setRecentlyViewed(filtered.slice(0, 6));
          } catch {
            // Non-critical local storage failure
          }

          // Fetch related products from same category
          if (item.category?.id) {
            catalogService
              .getProducts({ category_id: item.category.id, per_page: 6 })
              .then((catRes) => {
                if (Array.isArray(catRes?.data)) {
                  setRelatedProducts(catRes.data.filter((p) => String(p.id) !== String(item.id)));
                }
              })
              .catch(() => {});
          }

          // Populate reviews immediately from product payload if available, else fetch
          if (Array.isArray(item.reviews) && item.reviews.length > 0) {
            setReviews(item.reviews);
          } else {
            catalogService
              .getReviews(item.id)
              .then((rRes) => {
                if (Array.isArray(rRes?.data)) setReviews(rRes.data);
              })
              .catch(() => {});
          }
        } else {
          setError('Formulation not found in clinical database.');
        }
      } catch (err) {
        setError(err.userMessage || 'Could not load formulation details.');
      } finally {
        setLoading(false);
      }
    }

    loadProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Check wishlist status if authenticated
  useEffect(() => {
    if (isAuthenticated && product?.id) {
      wishlistService
        .getWishlist()
        .then((res) => {
          if (Array.isArray(res?.data)) {
            const found = res.data.some((w) => String(w.product_id || w.id) === String(product.id));
            setIsWishlisted(found);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, product?.id]);

  // Extract brand and size from product name
  const meta = useMemo(() => {
    if (!product) return { brand: null, size: null };
    const knownBrands = [
      'The Ordinary',
      'Beauty of Joseon',
      'COSRX',
      'CeraVe',
      'La Roche-Posay',
      "Paula's Choice",
      "Kiehl's",
      'Anua',
      'Skin1004',
      'Innisfree',
      'Mediheal',
      'Torriden',
      'Round Lab',
      'Isntree',
      'Haruharu Wonder',
      'Naturium',
      'SkinCeuticals',
      'Dermalogica',
      'Sunday Riley',
      'Laneige',
      'Sulwhasoo',
      'Klairs',
      'Some By Mi',
      'Dr. Jart+',
      'Goodal',
      "I'm From",
      'Purito',
    ];

    let brand = product.brand || null;
    if (!brand && product.name) {
      for (const b of knownBrands) {
        if (product.name.toLowerCase().startsWith(b.toLowerCase())) {
          brand = b;
          break;
        }
      }
    }

    const sizeMatch = product.name?.match(/\b(\d+(?:\.\d+)?\s*(?:ml|g|oz|fl\s*oz|sheets?))\b/i);
    const size = product.size || (sizeMatch ? sizeMatch[0] : null);

    return { brand, size };
  }, [product]);

  if (loading) {
    return (
      <div className="section" style={{ padding: '40px 0' }}>
        <div className="container">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="section" style={{ padding: '60px 0' }}>
        <div className="container">
          <ErrorState
            title="Formulation Unavailable"
            message={error || 'We could not locate this skincare formula.'}
            actionText="Return to Catalog"
            onAction={() => navigate('/shop')}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  const regularPrice = Number(product.sale_price ?? product.price) || 0;
  const finalPrice = Number(product.final_price ?? product.sale_price ?? product.price) || 0;
  const hasDiscount = Boolean(product.has_discount || regularPrice > finalPrice);
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - finalPrice) / regularPrice) * 100)
    : 0;

  // Auto-calculated total price based on selected quantity
  const totalRegularPrice = regularPrice * qty;
  const totalFinalPrice = finalPrice * qty;

  const stockQty = Number(product.qty ?? product.stock ?? 0);
  const isOutOfStock = stockQty <= 0;
  const isLowStock = stockQty > 0 && stockQty <= 5;

  // Add to Cart handler - requires authenticated user
  const handleAddToCart = () => {
    if (isOutOfStock) return;

    if (!isAuthenticated) {
      showToast('Please sign in or register an account to add items to your cart.', 'warning');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setIsAdding(true);
    addToCart(product, qty);
    setTimeout(() => setIsAdding(false), 600);
  };

  // Buy Now handler: Add to cart and immediately proceed to checkout
  const handleBuyNow = () => {
    if (isOutOfStock) return;

    if (!isAuthenticated) {
      showToast('Please sign in or register an account to proceed to checkout.', 'warning');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    addToCart(product, qty);
    navigate('/checkout');
  };

  // Wishlist Toggle
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to save products to your personal wishlist.', 'info');
      navigate('/login');
      return;
    }

    try {
      if (isWishlisted) {
        await wishlistService.remove(product.id);
        setIsWishlisted(false);
        showToast(`Removed "${product.name}" from your wishlist.`, 'info');
      } else {
        await wishlistService.add(product.id);
        setIsWishlisted(true);
        showToast(`Saved "${product.name}" to your wishlist.`, 'success');
      }
    } catch (err) {
      showToast(err.userMessage || 'Could not update wishlist.', 'error');
    }
  };

  // Review Submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to post a verified client review.', 'info');
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await catalogService.submitReview(product.id, {
        rating,
        title: reviewTitle,
        comment: reviewComment,
      });

      showToast('Thank you! Your verified client review has been recorded.', 'success');
      if (res?.data) {
        setReviews([res.data, ...reviews]);
      }
      setReviewTitle('');
      setReviewComment('');
    } catch (err) {
      showToast(err.userMessage || 'Failed to submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Routine placement guide helper based on category
  const getRoutineStep = (categoryName = '') => {
    const lower = categoryName.toLowerCase();
    if (lower.includes('cleanse')) return 'Step 1: Cleanse (AM/PM)';
    if (lower.includes('toner') || lower.includes('essence')) return 'Step 2: Balance & Prep (AM/PM)';
    if (lower.includes('exfoliant') || lower.includes('peel')) return 'Step 3: Exfoliate (PM 2-3x weekly)';
    if (lower.includes('serum') || lower.includes('ampoule')) return 'Step 4: Target Active (AM/PM)';
    if (lower.includes('mask')) return 'Step 5: Intensive Treatment (1-2x weekly)';
    if (lower.includes('moisturizer') || lower.includes('cream')) return 'Step 6: Barrier Lock (AM/PM)';
    if (lower.includes('sunscreen') || lower.includes('uv')) return 'Step 7: Photoprotection (AM Essential)';
    return 'Core Treatment Step (AM/PM)';
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen pt-6 pb-28 sm:py-12 md:py-16">
      <div className="container">
        {/* Reusable Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('shop.dispensary'), link: '/shop' },
            ...(product.category
              ? [{ label: product.category.name, link: `/shop?category_id=${product.category.id}` }]
              : []),
            { label: product.name },
          ]}
        />

        {/* Product Dual-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-10 sm:mb-14 lg:mb-18 items-start">
          {/* Left Column: Multi-Angle Interactive Gallery */}
          <div className="w-full">
            <ProductGallery
              mainImage={product.image_url}
              images={product.images}
              productName={product.name}
              hasDiscount={hasDiscount}
              discountPercent={discountPercent}
              isOutOfStock={isOutOfStock}
              isFeatured={Boolean(product.is_featured)}
            />
          </div>

          {/* Right Column: Specifications, Price, Stock & Actions */}
          <div className="flex flex-col w-full">
            {/* Brand & Volume Header */}
            <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#71856B]">
                {meta.brand || product.category?.name || 'Clinical Active'}
              </span>

              {meta.size && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF9F5] border border-[#ECE8DE] text-xs font-medium text-[#5A6358]">
                  {meta.size}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-[1.25] text-[#1F2520] mb-3">
              {product.name}
            </h1>

            {/* Rating & SKU Bar */}
            <div className="flex items-center gap-4 mb-5 flex-wrap text-xs text-[#7A8578]">
              {product.reviews_count > 0 ? (
                <RatingDisplay
                  rating={product.average_rating}
                  reviewCount={product.reviews_count}
                  starSize={14}
                />
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs text-[#5A6358]">
                  <Sparkles size={13} className="text-[#C29B38]" /> Certified Dispensary Batch
                </span>
              )}

              {product.barcode && (
                <span className="text-xs text-[#7A8578]">
                  SKU: <strong className="text-[#1F2520] font-medium">{product.barcode}</strong>
                </span>
              )}
            </div>

            {/* Price Box with Auto-Counting and Promotion Banner */}
            <div className="py-4 border-y border-[#ECE8DE] mb-5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <PriceDisplay
                  regularPrice={totalRegularPrice}
                  finalPrice={totalFinalPrice}
                  size="lg"
                  showDiscountBadge={true}
                />
                {qty > 1 && (
                  <span className="text-xs sm:text-sm text-[#7A8578] font-normal">
                    ({format(finalPrice)} each × {qty})
                  </span>
                )}
              </div>

              {product.promotion_name && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-[#71856B] font-medium">
                  <Sparkles size={13} className="text-[#C29B38]" />
                  <span>Promotion Applied: {product.promotion_name}</span>
                </div>
              )}
            </div>

            {/* Authentic Product Description */}
            <p className="text-sm leading-relaxed text-[#5A6358] mb-6 font-normal">
              {product.description ||
                'Targeted skincare solution formulated to support the physiological barrier layer, hydrate cellular structures, and deliver bio-available botanical actives.'}
            </p>

            {/* Stock Availability Indicator */}
            <div className="mb-6">
              {isOutOfStock ? (
                <div className="inline-flex items-center gap-2">
                  <ProductBadge type="soldout" label={t('product.out_of_stock_disclaimer')} />
                  <span className="text-xs text-[#7A8578]">
                    {t('product.replenishment_note')}
                  </span>
                </div>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#C55A48]/10 text-[#C55A48] border border-[#C55A48]/20">
                  {t('product.low_stock_disclaimer', { count: stockQty })}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#71856B]/10 text-[#71856B] border border-[#71856B]/25">
                  <CheckCircle2 size={13} /> {t('product.in_stock_ready', { count: stockQty })}
                </span>
              )}
            </div>

            {/* Purchasing Controls: Quantity, Add to Cart, Buy Now, Wishlist */}
            <div className="flex flex-col gap-3 mb-7">
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3 w-full">
                {/* Quantity Stepper */}
                <div className="flex justify-center xs:justify-start shrink-0">
                  <QuantitySelector
                    value={qty}
                    onChange={setQty}
                    min={1}
                    max={Math.max(1, stockQty)}
                    disabled={isOutOfStock}
                  />
                </div>

                {/* Primary Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAdding}
                  className="flex-1 min-h-[48px] px-6 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  style={{ backgroundColor: isAdding ? 'var(--color-success)' : '#1F2520', color: '#FFFFFF' }}
                >
                  <ShoppingBag size={17} />
                  <span>
                    {isOutOfStock
                      ? (t('product.sold_out') || 'Sold Out')
                      : isAdding
                      ? (t('product.added_to_bag') || 'Added to Bag')
                      : `${t('common.add_to_cart') || 'Add to Cart'} • ${format(totalFinalPrice)}`}
                  </span>
                </button>

                {/* Wishlist Toggle Button */}
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 active:scale-90 cursor-pointer ${
                    isWishlisted ? 'border-[#F5D5CE] bg-[#FDF0ED] text-[#C55A48]' : 'border-[#ECE8DE] hover:border-[#1F2520] text-[#1F2520]'
                  }`}
                  aria-label={isWishlisted ? t('common.remove') : t('common.save')}
                >
                  <Heart
                    size={18}
                    fill={isWishlisted ? '#C55A48' : 'none'}
                    stroke={isWishlisted ? '#C55A48' : 'currentColor'}
                    className={isWishlisted ? 'animate-[heartbeat_0.35s_ease-in-out]' : ''}
                  />
                </button>
              </div>

              {/* Buy Now Direct Action */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full min-h-[46px] rounded-full border border-[#1F2520] text-[#1F2520] hover:bg-[#1F2520] hover:text-white font-medium text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <Zap size={15} />
                <span>
                  {t('product.buy_now') || 'Buy Now with Express Checkout'} • {format(totalFinalPrice)}
                </span>
              </button>
            </div>

            {/* Trust and Dispensary Guarantees */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 p-4 sm:p-4.5 rounded-2xl bg-white border border-[#ECE8DE] shadow-xs text-xs text-[#5A6358]">
              <div className="flex items-center gap-2.5">
                <Truck size={16} className="text-[#71856B] shrink-0" />
                <span>{t('product.complimentary_over')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#71856B] shrink-0" />
                <span>{t('product.genuine_guarantee')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw size={16} className="text-[#71856B] shrink-0" />
                <span>{t('product.tolerance_guarantee')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={16} className="text-[#71856B] shrink-0" />
                <span>{t('product.same_day_dispatch')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Formulation Actives, Routine Placement, Shipping, Verified Reviews */}
        <div className="mb-14 sm:mb-18 lg:mb-20">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 sm:gap-3 border-b border-[#ECE8DE] mb-6 sm:mb-8 pb-3 overflow-x-auto no-scrollbar">
            {[
              { id: 'formulation', label: t('product.tab_formulation') },
              { id: 'usage', label: t('product.tab_usage') },
              { id: 'shipping', label: t('product.tab_shipping') },
              { id: 'reviews', label: t('product.tab_reviews', { count: reviews.length }) },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1F2520] text-white shadow-xs'
                      : 'text-[#5A6358] hover:text-[#1F2520] hover:bg-white border border-transparent hover:border-[#ECE8DE]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab 1: Formulation & Actives */}
          {activeTab === 'formulation' && (
            <div className="rounded-2xl bg-white border border-[#ECE8DE] p-6 sm:p-8 shadow-xs text-[#5A6358] text-sm leading-relaxed">
              <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1F2520] mb-3">
                Formulation Architecture
              </h3>
              <p className="mb-6 text-sm text-[#5A6358] leading-relaxed">
                {product.description ||
                  'Crafted with targeted active molecules calibrated to optimize cellular hydration and skin barrier resilience.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#ECE8DE]">
                <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#ECE8DE]">
                  <strong className="block text-xs uppercase tracking-wider text-[#71856B] mb-1 font-semibold">
                    Category
                  </strong>
                  <span className="text-sm font-medium text-[#1F2520]">{product.category?.name || 'Clinical Care'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#ECE8DE]">
                  <strong className="block text-xs uppercase tracking-wider text-[#71856B] mb-1 font-semibold">
                    Authentic Barcode
                  </strong>
                  <span className="text-sm font-medium text-[#1F2520] font-mono">{product.barcode || 'Batch Sealed'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#ECE8DE]">
                  <strong className="block text-xs uppercase tracking-wider text-[#71856B] mb-1 font-semibold">
                    Safety Standard
                  </strong>
                  <span className="text-sm font-medium text-[#1F2520]">Fragrance-free, paraben-free, cruelty-free</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-[#EEF2EB] border border-[#71856B]/20 text-xs text-[#5A6358] flex items-start gap-2.5">
                <Info size={16} className="text-[#71856B] shrink-0 mt-0.5" />
                <span>
                  Please consult individual product packaging for the definitive International Nomenclature of Cosmetic Ingredients (INCI) batch declaration.
                </span>
              </div>
            </div>
          )}

          {/* Tab 2: Routine & Application */}
          {activeTab === 'usage' && (
            <div className="rounded-2xl bg-white border border-[#ECE8DE] p-6 sm:p-8 shadow-xs text-[#5A6358] text-sm leading-relaxed">
              <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1F2520] mb-3">
                Recommended Skincare Regimen
              </h3>

              <div className="inline-block px-3.5 py-1.5 rounded-full bg-[#FAF9F5] border border-[#ECE8DE] text-xs font-semibold text-[#71856B] mb-4">
                {getRoutineStep(product.category?.name)}
              </div>

              <p className="mb-4 text-sm text-[#5A6358] leading-relaxed">
                Dispense 3–4 drops or a pea-sized amount onto cleanly cleansed, gently damp skin. Smooth over the face, neck, and décolletage using upward gliding motions. Allow 60 seconds for full absorption prior to layering heavier emulsions or oils.
              </p>
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#ECE8DE] space-y-2 text-xs sm:text-sm text-[#5A6358]">
                <p>
                  <strong className="text-[#1F2520]">Daytime Regimen:</strong> Always complete morning routines with broad-spectrum SPF photoprotection.
                </p>
                <p>
                  <strong className="text-[#1F2520]">Evening Regimen:</strong> Seal with a barrier-restoring night cream or facial oil.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Shipping & Returns */}
          {activeTab === 'shipping' && (
            <div className="rounded-2xl bg-white border border-[#ECE8DE] p-6 sm:p-8 shadow-xs text-[#5A6358] text-sm leading-relaxed">
              <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1F2520] mb-4">
                Delivery &amp; Satisfaction Policy
              </h3>
              <ul className="space-y-3 pl-5 list-disc text-xs sm:text-sm text-[#5A6358]">
                <li>
                  <strong className="text-[#1F2520]">Complimentary Domestic Courier:</strong> Free on all orders exceeding $50.00. Standard delivery within 1–2 business days.
                </li>
                <li>
                  <strong className="text-[#1F2520]">Climate-Controlled Packaging:</strong> Temperature-sensitive skincare formulations are packed with protective insulating packaging to preserve active molecular integrity.
                </li>
                <li>
                  <strong className="text-[#1F2520]">14-Day Tolerance Guarantee:</strong> If a formulation does not agree with your skin, return unopened products or contact our clinical support team within 14 days of delivery for a seamless exchange or credit.
                </li>
                <li>
                  <strong className="text-[#1F2520]">Trackable Dispatch:</strong> Real-time SMS and email tracking links dispatched immediately upon courier handoff.
                </li>
              </ul>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              {/* Existing Reviews List */}
              <div className="lg:col-span-7">
                <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1F2520] mb-4">
                  {t('product.tab_reviews', { count: reviews.length })}
                </h3>

                {reviews.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white border border-[#ECE8DE] text-center text-[#7A8578] shadow-xs">
                    <p className="font-serif text-base text-[#1F2520] mb-1">
                      {t('product.no_reviews')}
                    </p>
                    <p className="text-xs sm:text-sm">
                      {t('product.be_first_review')}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3.5">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="rounded-2xl bg-white border border-[#ECE8DE] p-5 sm:p-6 shadow-xs">
                        <div className="flex justify-between items-center mb-2.5 flex-wrap gap-2">
                          <RatingDisplay rating={rev.rating} showCount={false} starSize={13} />
                          <div className="flex items-center gap-2">
                            {rev.is_verified_purchase && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#71856B] bg-[#71856B]/10 px-2 py-0.5 rounded-full">
                                <CheckCircle2 size={12} /> {t('product.verified_buyer')}
                              </span>
                            )}
                            <span className="text-xs text-[#7A8578]">
                              {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Client Evaluation'}
                            </span>
                          </div>
                        </div>

                        {rev.title && (
                          <h4 className="text-sm font-semibold text-[#1F2520] mb-1">
                            {rev.title}
                          </h4>
                        )}

                        <p className="text-xs sm:text-sm text-[#5A6358] leading-relaxed">
                          {rev.comment}
                        </p>

                        <div className="mt-2.5 text-xs text-[#7A8578]">
                          — {rev.customer?.name || rev.customer_name || 'Client'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Review Box */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-white border border-[#ECE8DE] p-6 sm:p-7 shadow-xs">
                  <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1F2520] mb-4">
                    {t('product.write_review')}
                  </h3>

                  {!isAuthenticated ? (
                    <div className="text-center p-6 rounded-xl bg-[#FAF9F5] border border-[#ECE8DE]">
                      <p className="text-xs sm:text-sm text-[#5A6358] mb-4 leading-relaxed">
                        {t('product.login_to_review_desc')}
                      </p>
                      <Link
                        to="/login"
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-[#1F2520] text-xs font-medium text-[#1F2520] hover:bg-[#1F2520] hover:text-white transition-colors"
                      >
                        {t('product.login_to_review')}
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1F2520] mb-1.5">
                          {t('product.your_rating')}
                        </label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setRating(s)}
                              className="p-1 text-[#C29B38] hover:scale-110 transition-transform"
                            >
                              <Star size={20} fill={s <= rating ? '#C29B38' : 'none'} stroke={s <= rating ? '#C29B38' : '#ECE8DE'} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F2520] mb-1.5">
                          {t('product.review_title')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Calmed inflammation within 7 days"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#ECE8DE] bg-white text-xs sm:text-sm text-[#1F2520] focus:border-[#71856B] focus:ring-1 focus:ring-[#71856B] outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F2520] mb-1.5">
                          {t('product.review_comment')}
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Detail texture, absorption rate, skin tolerance, and results..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#ECE8DE] bg-white text-xs sm:text-sm text-[#1F2520] focus:border-[#71856B] focus:ring-1 focus:ring-[#71856B] outline-none transition-all resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="w-full py-3 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide shadow-xs active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {submittingReview ? t('product.submitting') : t('product.submit_review')}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary)', fontWeight: 600 }}>
                  {t('product.synergistic_care')}
                </span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', color: 'var(--color-text-main)', margin: '4px 0 0' }}>
                  {t('product.related_products')}
                </h2>
              </div>
              {product.category && (
                <Link
                  to={`/shop?category_id=${product.category.id}`}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--color-primary)', fontWeight: 600 }}
                >
                  {t('product.view_all_in_category', { category: product.category.name })}
                </Link>
              )}
            </div>

            <ProductCarousel products={relatedProducts} />
          </div>
        )}

        {/* Recently Viewed Products Section */}
        {recentlyViewed.length > 0 && (
          <div style={{ paddingTop: '32px', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary)', fontWeight: 600 }}>
                {t('product.dispensary_history')}
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', color: 'var(--color-text-main)', margin: '4px 0 0' }}>
                {t('product.recently_viewed')}
              </h2>
            </div>

            <ProductCarousel products={recentlyViewed} />
          </div>
        )}
      </div>

      {/* Mobile Sticky Add to Bag Bar (Viewport < 768px) */}
      <div className="fixed bottom-0 left-0 right-0 z-[1010] bg-white/95 backdrop-blur-md px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] border-t border-[#ECE8DE] shadow-[0_-4px_20px_rgba(31,37,32,0.08)] flex items-center justify-between gap-3 md:hidden">
        <div className="min-w-0">
          <span className="font-serif text-xs font-semibold text-[#1F2520] block truncate">
            {product.name}
          </span>
          <span className="text-sm font-bold text-[#71856B]">
            {format(finalPrice)}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 active:scale-90 transition-all duration-200 cursor-pointer ${
              isWishlisted ? 'border-[#F5D5CE] bg-[#FDF0ED] text-[#C55A48]' : 'border-[#ECE8DE] text-[#1F2520]'
            }`}
            aria-label="Wishlist"
          >
            <Heart
              size={16}
              fill={isWishlisted ? '#C55A48' : 'none'}
              stroke={isWishlisted ? '#C55A48' : 'currentColor'}
              className={isWishlisted ? 'animate-[heartbeat_0.35s_ease-in-out]' : ''}
            />
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="px-5 py-2.5 rounded-full bg-[#1F2520] text-white text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            style={{ backgroundColor: isAdding ? 'var(--color-success)' : '#1F2520', color: '#FFFFFF' }}
          >
            <ShoppingBag size={14} />
            <span>{isOutOfStock ? 'Sold Out' : isAdding ? 'Added ✓' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
