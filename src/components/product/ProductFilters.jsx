import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { getLocalizedCategoryName } from '../../utils/categoryLocalization';
import { Search, RotateCcw, X, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function ProductFilters({
  categories = [],
  brands = [],
  filters = {},
  onFilterChange,
  onResetFilters,
  totalResults = 0,
}) {
  const { t, language } = useLanguage();
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  // Quick price presets
  const pricePresets = [
    { label: 'All Prices', min: '', max: '' },
    { label: 'Under $20', min: '', max: '20' },
    { label: '$20 – $35', min: '20', max: '35' },
    { label: 'Over $35', min: '35', max: '' },
  ];

  // Active filters count for badge
  const activeFiltersCount = [
    filters.search,
    filters.category_id,
    filters.brand,
    filters.min_price || filters.max_price,
    filters.in_stock,
    filters.promotion,
  ].filter(Boolean).length;

  const selectedCategory = categories.find((c) => String(c.id) === String(filters.category_id));

  return (
    <div className="w-full">
      {/* Mobile Toolbar (< lg) */}
      <div className="lg:hidden flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('header.search_placeholder') || 'Search active formulas...'}
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-8 pr-7 h-10 text-xs rounded-full bg-white border border-[#ECE8DE] text-[#1F2520] placeholder:text-[#8C9388] focus:outline-none focus:border-[#71856B]"
          />
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#71856B]"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange('search', '')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8C9388] p-1"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className={`inline-flex items-center gap-1.5 px-3.5 h-10 rounded-full text-xs font-medium border transition-colors shrink-0 ${
            isMobileExpanded || activeFiltersCount > 0
              ? 'bg-[#1F2520] text-white border-[#1F2520]'
              : 'bg-white text-[#1F2520] border-[#ECE8DE]'
          }`}
        >
          <SlidersHorizontal size={13} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#71856B] text-white text-[10px] flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Main Left Filter Sidebar (Always open on lg+, toggleable on mobile) */}
      <div
        className={`filter-catalog-scroll p-4 sm:p-5 rounded-2xl bg-white border border-[#ECE8DE] shadow-2xs space-y-4 sm:space-y-5 lg:max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto overscroll-contain transition-all ${
          isMobileExpanded ? 'block mb-6' : 'hidden lg:block'
        }`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#D8D4CA transparent',
        }}
      >
        {/* Sticky Sidebar Header with Results and Reset */}
        <div className="sticky -top-4 sm:-top-5 -mt-4 sm:-mt-5 -mx-4 sm:-mx-5 p-4 sm:p-5 pb-3 border-b border-[#ECE8DE] bg-white rounded-t-2xl z-10 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-[#71856B]" />
            <span className="text-xs font-bold tracking-wider uppercase text-[#1F2520]">
              Filter Catalog
            </span>
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-[11px] text-[#71856B] hover:text-[#596D54] font-medium cursor-pointer"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Results Count Banner */}
        <div className="text-[11px] text-[#8C9388] font-medium">
          {t('shop.showing_results', { count: totalResults }) || `Showing ${totalResults} products`}
        </div>

        {/* Search Input (Desktop) */}
        <div>
          <label className="block text-[10.5px] font-semibold text-[#71856B] uppercase tracking-wider mb-1.5">
            Search
          </label>
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t('header.search_placeholder') || 'Search active formulas...'}
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full pl-8 pr-7 h-9 text-xs rounded-xl bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] placeholder:text-[#8C9388] focus:outline-none focus:border-[#71856B] transition-colors"
            />
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#71856B]"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onFilterChange('search', '')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8C9388] hover:text-[#1F2520] cursor-pointer p-0.5"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Sort By Dropdown */}
        <div>
          <label className="block text-[10.5px] font-semibold text-[#71856B] uppercase tracking-wider mb-1.5">
            Sort Order
          </label>
          <select
            value={filters.sort || 'featured'}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="w-full h-9 px-3 text-xs font-medium rounded-xl bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] focus:outline-none focus:border-[#71856B] transition-colors cursor-pointer"
          >
            <option value="featured">{t('shop.sort_featured') || 'Featured Formulations'}</option>
            <option value="latest">{t('shop.sort_newest') || 'Latest Releases'}</option>
            <option value="best_selling">{t('shop.sort_featured') || 'Best Sellers'}</option>
            <option value="price_asc">{t('shop.sort_price_low') || 'Price: Low to High'}</option>
            <option value="price_desc">{t('shop.sort_price_high') || 'Price: High to Low'}</option>
            <option value="name_asc">{t('shop.sort_name') || 'Alphabetical (A–Z)'}</option>
          </select>
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-[10.5px] font-semibold text-[#71856B] uppercase tracking-wider mb-1.5">
            {t('nav.categories') || 'Category'}
          </label>
          <select
            value={filters.category_id || ''}
            onChange={(e) => onFilterChange('category_id', e.target.value)}
            className="w-full h-9 px-3 text-xs rounded-xl bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] focus:outline-none focus:border-[#71856B] transition-colors cursor-pointer"
          >
            <option value="">{t('shop.all_categories') || 'All Categories'} ({categories.reduce((acc, c) => acc + (c.products_count || 0), 0)})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {getLocalizedCategoryName(cat, language)} {cat.products_count ? `(${cat.products_count})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Selector */}
        <div>
          <label className="block text-[10.5px] font-semibold text-[#71856B] uppercase tracking-wider mb-1.5">
            {t('nav.brands') || 'Brand / Lab'}
          </label>
          <select
            value={filters.brand || ''}
            onChange={(e) => onFilterChange('brand', e.target.value)}
            className="w-full h-9 px-3 text-xs rounded-xl bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] focus:outline-none focus:border-[#71856B] transition-colors cursor-pointer"
          >
            <option value="">{t('shop.all_brands') || 'All Brands'} ({brands.length})</option>
            {brands.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name} ({b.products_count})
              </option>
            ))}
          </select>
        </div>

        {/* Availability & Deals */}
        <div className="pt-3 border-t border-[#ECE8DE] space-y-2">
          <label className="block text-[10.5px] font-semibold text-[#71856B] uppercase tracking-wider mb-1">
            Availability
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#1F2520] select-none">
            <input
              type="checkbox"
              checked={Boolean(filters.in_stock)}
              onChange={(e) => onFilterChange('in_stock', e.target.checked ? '1' : '')}
              className="rounded accent-[#71856B] w-4 h-4 cursor-pointer"
            />
            <span>{t('shop.in_stock_only') || 'In Stock Only'}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#1F2520] select-none">
            <input
              type="checkbox"
              checked={Boolean(filters.promotion)}
              onChange={(e) => onFilterChange('promotion', e.target.checked ? '1' : '')}
              className="rounded accent-[#71856B] w-4 h-4 cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <Sparkles size={12} className="text-[#C29B38]" />
              {t('shop.promotions_only') || 'Special Offers Only'}
            </span>
          </label>
        </div>

        {/* Price Filter */}
        <div className="pt-3 border-t border-[#ECE8DE]">
          <label className="block text-[10.5px] font-semibold text-[#71856B] uppercase tracking-wider mb-2">
            {t('shop.filter_by_price') || 'Price Range'}
          </label>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {pricePresets.map((preset) => {
              const isSelected =
                String(filters.min_price || '') === preset.min &&
                String(filters.max_price || '') === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    onFilterChange('min_price', preset.min);
                    onFilterChange('max_price', preset.max);
                  }}
                  className={`px-2 py-1 rounded-full text-[10.5px] transition-all cursor-pointer border ${
                    isSelected
                      ? 'border-[#71856B] bg-[#EEF2EB] text-[#4A5D45] font-semibold shadow-2xs'
                      : 'border-[#ECE8DE] bg-[#FAF9F5] text-[#5A6358] hover:border-[#71856B]/50'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Custom Min / Max Inputs */}
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[#8C9388]">$</span>
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={filters.min_price || ''}
                onChange={(e) => onFilterChange('min_price', e.target.value)}
                className="w-full pl-4 pr-1.5 h-7 text-xs rounded-lg bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] focus:outline-none focus:border-[#71856B]"
                aria-label="Minimum price"
              />
            </div>
            <span className="text-xs text-[#8C9388]">–</span>
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[#8C9388]">$</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={filters.max_price || ''}
                onChange={(e) => onFilterChange('max_price', e.target.value)}
                className="w-full pl-4 pr-1.5 h-7 text-xs rounded-lg bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] focus:outline-none focus:border-[#71856B]"
                aria-label="Maximum price"
              />
            </div>
          </div>
        </div>

        {/* Active Applied Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="pt-3 border-t border-[#ECE8DE]">
            <span className="text-[10px] uppercase tracking-wider text-[#8C9388] font-semibold block mb-1.5">
              Applied Filters:
            </span>
            <div className="flex flex-wrap gap-1">
              {filters.search && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                  "{filters.search}"
                  <X size={10} className="cursor-pointer text-[#71856B]" onClick={() => onFilterChange('search', '')} />
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                  {getLocalizedCategoryName(selectedCategory, language)}
                  <X size={10} className="cursor-pointer text-[#71856B]" onClick={() => onFilterChange('category_id', '')} />
                </span>
              )}
              {filters.brand && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                  {filters.brand}
                  <X size={10} className="cursor-pointer text-[#71856B]" onClick={() => onFilterChange('brand', '')} />
                </span>
              )}
              {(filters.min_price || filters.max_price) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                  ${filters.min_price || '0'}–${filters.max_price || 'Any'}
                  <X size={10} className="cursor-pointer text-[#71856B]" onClick={() => { onFilterChange('min_price', ''); onFilterChange('max_price', ''); }} />
                </span>
              )}
              {filters.in_stock && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                  In Stock
                  <X size={10} className="cursor-pointer text-[#71856B]" onClick={() => onFilterChange('in_stock', '')} />
                </span>
              )}
              {filters.promotion && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                  Special Offers
                  <X size={10} className="cursor-pointer text-[#71856B]" onClick={() => onFilterChange('promotion', '')} />
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .filter-catalog-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .filter-catalog-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .filter-catalog-scroll::-webkit-scrollbar-thumb {
          background-color: #D8D4CA;
          border-radius: 9999px;
        }
        .filter-catalog-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #71856B;
        }
      `}</style>
    </div>
  );
}
