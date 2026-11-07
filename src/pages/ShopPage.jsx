import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import catalogService from '../services/catalogService';
import wishlistService from '../services/wishlistService';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/LanguageContext';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import Pagination from '../components/product/Pagination';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import { ProductGridSkeleton } from '../components/feedback/LoadingSkeleton';
import EmptyState from '../components/feedback/EmptyState';
import ErrorState from '../components/feedback/ErrorState';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const cachedInitialCats = catalogService.getInitialCategories();
  const cachedInitialBrands = catalogService.getInitialBrands();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(
    () => (Array.isArray(cachedInitialCats?.data) ? cachedInitialCats.data : [])
  );
  const [brands, setBrands] = useState(
    () => (Array.isArray(cachedInitialBrands?.data) ? cachedInitialBrands.data : [])
  );
  const [wishlistedIds, setWishlistedIds] = useState(new Set());
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Derived filter state directly from URL query parameters (shareable URLs)
  const filters = {
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category_id') || '',
    brand: searchParams.get('brand') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    in_stock: searchParams.get('in_stock') || '',
    promotion: searchParams.get('promotion') || (searchParams.get('filter') === 'promotion' ? '1' : ''),
    sort: searchParams.get('sort') || (searchParams.get('filter') === 'popular' ? 'best_selling' : 'featured'),
    page: Number(searchParams.get('page')) || 1,
  };

  // Load categories and brands on mount
  useEffect(() => {
    Promise.allSettled([catalogService.getCategories(), catalogService.getBrands()])
      .then(([catRes, brandRes]) => {
        if (catRes.status === 'fulfilled' && Array.isArray(catRes.value?.data)) {
          const clean = catRes.value.data.filter((c) => {
            const upper = (c.name || '').toUpperCase();
            return (
              !upper.includes('TEST') &&
              !upper.includes('BULK') &&
              !upper.includes('DEMO') &&
              !upper.includes('SAMPLE')
            );
          });
          setCategories(clean);
        }
        if (brandRes.status === 'fulfilled' && Array.isArray(brandRes.value?.data)) {
          setBrands(brandRes.value.data);
        }
      });
  }, []);

  // Fetch wishlisted product IDs if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      wishlistService.getWishlist()
        .then((res) => {
          if (Array.isArray(res?.data)) {
            const ids = new Set(res.data.map((item) => item.product_id || item.id));
            setWishlistedIds(ids);
          }
        })
        .catch(() => {});
    } else {
      setWishlistedIds(new Set());
    }
  }, [isAuthenticated]);

  // Fetch products from Laravel REST API based on current query parameters
  const fetchProducts = useCallback(async (abortSignal) => {
    const signal = (abortSignal instanceof AbortSignal) ? abortSignal : undefined;
    const apiParams = {
      page: filters.page,
      per_page: 12,
      search: filters.search.trim() || undefined,
      category_id: filters.category_id || undefined,
      brand: filters.brand || undefined,
      min_price: filters.min_price || undefined,
      max_price: filters.max_price || undefined,
      in_stock_only: filters.in_stock ? 1 : undefined,
      has_discount: filters.promotion ? 1 : undefined,
      sort: filters.sort || 'featured',
    };

    const cached = catalogService.getInitialProducts(apiParams, true);
    if (cached && Array.isArray(cached.data)) {
      setProducts(cached.data);
      if (cached.pagination) setPagination(cached.pagination);
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await catalogService.getProducts(apiParams, { signal });
      if (Array.isArray(res?.data)) {
        setProducts(res.data);
        const pag = res.pagination || {
          current_page: 1,
          last_page: 1,
          total: res.data.length,
          per_page: 12,
        };
        setPagination(pag);
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED' || signal?.aborted) return;
      console.error('Failed to fetch products:', err);
      if (!cached && products.length === 0) {
        setError(err.userMessage || 'Unable to load products. Please check network connection.');
      }
    } finally {
      setLoading(false);
    }
  }, [
    filters.page,
    filters.search,
    filters.category_id,
    filters.brand,
    filters.min_price,
    filters.max_price,
    filters.in_stock,
    filters.promotion,
    filters.sort,
  ]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
  }, [fetchProducts]);

  // Handle individual filter change, resetting page to 1
  const handleFilterChange = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    // Always reset page to 1 when changing search/filter criteria
    if (key !== 'page') {
      nextParams.delete('page');
    }
    setSearchParams(nextParams);
  };

  // Reset all filters to clean catalog
  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Handle page navigation
  const handlePageChange = (newPage) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', newPage);
    setSearchParams(nextParams);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Category & Brand names for dynamic titles
  const selectedCategory = categories.find((c) => String(c.id) === String(filters.category_id));
  const pageTitle = selectedCategory
    ? selectedCategory.name
    : filters.brand
    ? `${filters.brand} ${t('shop.all_products')}`
    : filters.promotion
    ? t('shop.promotional_sets')
    : t('shop.all_products');

  const pageDescription = selectedCategory?.description ||
    t('shop.subtitle');

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-4 sm:py-6 md:py-8">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Reusable Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('shop.dispensary'), link: '/shop' },
            ...(selectedCategory ? [{ label: selectedCategory.name }] : []),
            ...(filters.brand && !selectedCategory ? [{ label: filters.brand }] : []),
          ]}
        />

        {/* Page Header */}
        <div className="mb-5 sm:mb-7">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--color-text-main)] mb-1.5">
            {pageTitle}
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            {pageDescription}
          </p>
        </div>

        {/* 2-Column Layout: Left Sidebar Filters + Right 4-Column Product Grid */}
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          {/* Left Sidebar: Filter Console (Flows naturally with the page so all filters can be scrolled up/down) */}
          <aside className="w-full lg:w-64 xl:w-72 shrink-0">
            <ProductFilters
              categories={categories}
              brands={brands}
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalResults={pagination.total || products.length}
            />
          </aside>

          {/* Right Main Catalog Body (4 Columns) */}
          <main className="flex-1 min-w-0 w-full">
            {loading && products.length === 0 ? (
              <ProductGridSkeleton count={12} columns={4} />
            ) : error && products.length === 0 ? (
              <ErrorState
                title={t('shop.catalogue_error')}
                message={error}
                onRetry={() => fetchProducts()}
              />
            ) : products.length === 0 ? (
              <EmptyState
                title={t('shop.no_products_found')}
                description={t('shop.no_products_found')}
                actionText={t('shop.reset_filters')}
                onAction={handleResetFilters}
              />
            ) : (
              <>
                <ProductGrid
                  products={products}
                  wishlistedIds={wishlistedIds}
                  columns={4}
                  onWishlistChange={(productId, isWish) => {
                    setWishlistedIds((prev) => {
                      const next = new Set(prev);
                      if (isWish) next.add(productId);
                      else next.delete(productId);
                      return next;
                    });
                  }}
                />

                {/* Pagination synced with API pagination */}
                <div className="mt-8 sm:mt-10">
                  <Pagination
                    currentPage={pagination.current_page || 1}
                    lastPage={pagination.last_page || 1}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
