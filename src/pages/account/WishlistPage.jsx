import React, { useEffect, useState } from 'react';
import wishlistService from '../../services/wishlistService';
import ProductGrid from '../../components/product/ProductGrid';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import AccountNav from '../../components/navigation/AccountNav';
import { ProductGridSkeleton } from '../../components/feedback/LoadingSkeleton';
import EmptyState from '../../components/feedback/EmptyState';
import { useTranslation } from '../../i18n/LanguageContext';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const fetchWishlist = async () => {
    try {
      const res = await wishlistService.getWishlist();
      if (Array.isArray(res?.data)) {
        const items = res.data.map((item) => item.product || item);
        setProducts(items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleWishlistChange = (productId, isWish) => {
    if (!isWish) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('account.client_portal') || 'Client Portal', link: '/account/profile' },
            { label: t('account.saved_wishlist') || 'Saved Wishlist' },
          ]}
        />

        {/* Global Account Navigation Bar */}
        <AccountNav />

        {/* Header Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F2520] mb-1 flex items-center gap-2.5">
              <span>{t('account.wishlist_title') || 'Curated Wishlist'}</span>
              {!loading && products.length > 0 && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#71856B]/10 text-[#71856B] border border-[#71856B]/20">
                  {products.length} {products.length === 1 ? 'Formulation' : 'Formulations'}
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6358] font-normal">
              {t('account.wishlist_desc') || 'Your personal collection of saved skincare formulations and targeted regimens.'}
            </p>
          </div>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} columns={4} />
        ) : products.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-8 sm:p-14 shadow-xs text-center">
            <EmptyState
              icon={Heart}
              title={t('account.empty_wishlist_title') || 'Your Wishlist is Empty'}
              description={t('account.empty_wishlist_desc') || 'Save botanical formulations while browsing our clinical dispensary for quick access and replenishment.'}
              actionText={t('account.explore_dispensary') || 'Explore Formulations'}
              actionLink="/shop"
            />
          </div>
        ) : (
          <ProductGrid
            products={products}
            wishlistedIds={new Set(products.map((p) => p.id))}
            onWishlistChange={handleWishlistChange}
            columns={4}
          />
        )}
      </div>
    </div>
  );
}
