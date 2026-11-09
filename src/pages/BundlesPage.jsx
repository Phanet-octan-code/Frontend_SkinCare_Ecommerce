import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import catalogService from '../services/catalogService';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import LoadingSkeleton from '../components/feedback/LoadingSkeleton';

export default function BundlesPage() {
  const [bundles, setBundles] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all, bundle, gift_set
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addBundleToCart } = useCart();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    catalogService
      .getBundles()
      .then((data) => {
        if (mounted) {
          setBundles(data || []);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError('Unable to load promotional bundles at this time.');
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredBundles = bundles.filter((b) => {
    if (activeTab === 'all') return true;
    return b.type === activeTab;
  });

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#7C8B72] font-semibold">
            Curated Collections & Rituals
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2C2A29] mt-2 mb-4">
            Product Bundles & Luxury Gift Sets
          </h1>
          <p className="text-sm sm:text-base text-[#6B6561] leading-relaxed">
            Experience complete skincare regimens designed by dermatological experts. Each curated bundle pairs synergistically active formulas with special set savings and complimentary treats.
          </p>

          {/* Filter Navigation */}
          <div className="inline-flex rounded-full bg-white p-1.5 shadow-sm border border-[#EBE6DF] mt-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-[#7C8B72] text-white shadow-sm'
                  : 'text-[#6B6561] hover:text-[#2C2A29]'
              }`}
            >
              All Sets ({bundles.length})
            </button>
            <button
              onClick={() => setActiveTab('bundle')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'bundle'
                  ? 'bg-[#7C8B72] text-white shadow-sm'
                  : 'text-[#6B6561] hover:text-[#2C2A29]'
              }`}
            >
              Routine Bundles
            </button>
            <button
              onClick={() => setActiveTab('gift_set')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'gift_set'
                  ? 'bg-[#7C8B72] text-white shadow-sm'
                  : 'text-[#6B6561] hover:text-[#2C2A29]'
              }`}
            >
              Luxury Gift Sets
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-[#EBE6DF] shadow-sm">
                <LoadingSkeleton height="280px" className="rounded-xl mb-4" />
                <LoadingSkeleton height="24px" width="70%" className="mb-2" />
                <LoadingSkeleton height="16px" width="40%" className="mb-4" />
                <LoadingSkeleton height="44px" className="rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EBE6DF] max-w-lg mx-auto p-8 shadow-sm">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#7C8B72] text-white rounded-full text-sm font-medium hover:bg-[#68765F]"
            >
              Retry
            </button>
          </div>
        ) : filteredBundles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EBE6DF] max-w-lg mx-auto p-8 shadow-sm">
            <p className="text-[#6B6561] mb-4">No curated bundles found in this category.</p>
            <button
              onClick={() => setActiveTab('all')}
              className="px-6 py-2.5 bg-[#7C8B72] text-white rounded-full text-sm font-medium hover:bg-[#68765F]"
            >
              View All Offers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBundles.map((bundle) => {
              const inStock = bundle.available_qty > 0;
              const isGiftSet = bundle.type === 'gift_set';

              return (
                <div
                  key={bundle.id}
                  className="bg-white rounded-2xl border border-[#EBE6DF] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Image & Badges */}
                    <div className="relative aspect-square bg-[#F5F2EC] overflow-hidden group">
                      <img
                        src={bundle.image_url}
                        alt={bundle.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {isGiftSet ? (
                          <span className="bg-[#D9A74A] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            Gift Set
                          </span>
                        ) : (
                          <span className="bg-[#7C8B72] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            Routine Bundle
                          </span>
                        )}
                        {bundle.savings_amount > 0 && (
                          <span className="bg-[#2C2A29] text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-sm">
                            Save {formatPrice(bundle.savings_amount)} ({bundle.savings_percentage}%)
                          </span>
                        )}
                      </div>

                      {!inStock && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
                          <span className="bg-[#6B6561] text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="p-6">
                      <h3 className="font-serif text-lg text-[#2C2A29] font-medium leading-snug mb-2">
                        {bundle.name}
                      </h3>
                      {bundle.description && (
                        <p className="text-xs text-[#6B6561] line-clamp-2 leading-relaxed mb-4">
                          {bundle.description}
                        </p>
                      )}

                      {/* Packaging info */}
                      {bundle.packaging_details && (
                        <div className="flex items-center gap-1.5 text-xs text-[#7C8B72] bg-[#F4F6F2] px-3 py-1.5 rounded-lg mb-4">
                          <span>🎁</span>
                          <span className="truncate">{bundle.packaging_details}</span>
                        </div>
                      )}

                      {/* Included Items */}
                      <div className="border-t border-[#F0EBE3] pt-3 mb-4">
                        <span className="text-[11px] uppercase tracking-wider text-[#A09A93] font-semibold block mb-2">
                          Includes {bundle.items?.length || 0} Full-Size Formulas:
                        </span>
                        <ul className="space-y-1.5 text-xs text-[#4A4643]">
                          {bundle.items?.map((item) => (
                            <li key={item.id} className="flex items-center justify-between">
                              <span className="truncate pr-2">
                                <span className="font-medium text-[#2C2A29]">{item.quantity}×</span>{' '}
                                {item.product_name}
                              </span>
                              {item.is_free_gift && (
                                <span className="bg-[#E7EFE3] text-[#4F6C41] text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                                  Free Gift
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="p-6 pt-0 border-t border-[#F0EBE3] flex items-center justify-between mt-auto">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-serif font-bold text-[#2C2A29]">
                          {formatPrice(bundle.price)}
                        </span>
                        {bundle.original_price > bundle.price && (
                          <span className="text-xs text-[#A09A93] line-through">
                            {formatPrice(bundle.original_price)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#7C8B72] block">
                        {bundle.available_qty > 5
                          ? 'In Stock'
                          : bundle.available_qty > 0
                          ? `Only ${bundle.available_qty} left`
                          : 'Temporarily Unavailable'}
                      </span>
                    </div>

                    <button
                      onClick={() => addBundleToCart(bundle, 1)}
                      disabled={!inStock}
                      className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                        inStock
                          ? 'bg-[#7C8B72] text-white hover:bg-[#68765F] shadow-sm hover:shadow'
                          : 'bg-[#E5E0D8] text-[#A09A93] cursor-not-allowed'
                      }`}
                    >
                      {inStock ? 'Add Set' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

