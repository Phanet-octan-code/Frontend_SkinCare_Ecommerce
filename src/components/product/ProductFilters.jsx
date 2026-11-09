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
    { label: 'All', min: '', max: '' },
    { label: '<$20', min: '', max: '20' },
    { label: '$20–$35', min: '20', max: '35' },
    { label: '>$35', min: '35', max: '' },
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
      <div className="lg:hidden flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('header.search_placeholder') || 'Search formulas...'}
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-8 pr-7 h-9 text-xs rounded-full bg-white border border-[#ECE8DE] text-[#1F2520] placeholder:text-[#8C9388] focus:outline-none focus:border-[#71856B]"
          />
          <Search
            size={13}
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
          className={`inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-medium border transition-colors shrink-0 ${
            isMobileExpanded || activeFiltersCount > 0
              ? 'bg-[#1F2520] text-white border-[#1F2520]'
              : 'bg-white text-[#1F2520] border-[#ECE8DE]'
          }`}
        >
          <SlidersHorizontal size={12} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#71856B] text-white text-[10px] flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Main Filter Sidebar (Clean & Minimalist) */}
      <div
        className={`filter-sidebar-scroll rounded-2xl bg-white border border-[#ECE8DE] shadow-xs transition-all lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto overscroll-contain ${
          isMobileExpanded ? 'block mb-6 max-h-[80vh] overflow-y-auto' : 'hidden lg:block'
        }`}
      >
        {/* Compact Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs px-4 py-2.5 border-b border-[#ECE8DE] z-10 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={13} className="text-[#71856B]" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#1F2520]">
              Filter Catalog
            </span>
            <span className="text-[10px] text-[#8C9388] font-normal">
              ({totalResults})
            </span>
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-[11px] text-[#71856B] hover:text-[#526B54] font-medium cursor-pointer"
            >
              <RotateCcw size={10} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Streamlined Filter Body */}
        <div className="p-3.5 sm:p-4 space-y-3">
          {/* Quick Search */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t('header.search_placeholder') || 'Search formulas...'}
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full pl-7 pr-6 h-8 text-xs rounded-lg bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] placeholder:text-[#8C9388] focus:outline-none focus:border-[#71856B] transition-colors"
            />
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#71856B]"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onFilterChange('search', '')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8C9388] hover:text-[#1F2520] cursor-pointer"
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-[10px] font-semibold text-[#71856B] uppercase tracking-wider mb-1">
              {t('nav.categories') || 'Category'}
            </label>
            <select
              value={filters.category_id || ''}
              onChange={(e) => onFilterChange('category_id', e.target.value)}
              className="w-full h-8 px-2.5 text-xs rounded-lg bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] focus:outline-none focus:border-[#71856B] transition-colors cursor-pointer"
            >
              <option value="">{t('shop.all_categories') || 'All Categories'}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {getLocalizedCategoryName(cat, language)} {cat.products_count ? `(${cat.products_count})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Selector */}
          <div>
            <label className="block text-[10px] font-semibold text-[#71856B] uppercase tracking-wider mb-1">
              {t('nav.brands') || 'Brand'}
            </label>
            <select
              value={filters.brand || ''}
              onChange={(e) => onFilterChange('brand', e.target.value)}
              className="w-full h-8 px-2.5 text-xs rounded-lg bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] focus:outline-none focus:border-[#71856B] transition-colors cursor-pointer"
            >
              <option value="">{t('shop.all_brands') || 'All Brands'}</option>
              {brands.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name} {b.products_count ? `(${b.products_count})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <label className="block text-[10px] font-semibold text-[#71856B] uppercase tracking-wider mb-1">
              Sort
            </label>
            <select
              value={filters.sort || 'featured'}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              className="w-full h-8 px-2.5 text-xs rounded-lg bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] focus:outline-none focus:border-[#71856B] transition-colors cursor-pointer"
            >
              <option value="featured">{t('shop.sort_featured') || 'Featured'}</option>
              <option value="latest">{t('shop.sort_newest') || 'Latest Releases'}</option>
              <option value="best_selling">Best Sellers</option>
              <option value="price_asc">{t('shop.sort_price_low') || 'Price: Low to High'}</option>
              <option value="price_desc">{t('shop.sort_price_high') || 'Price: High to Low'}</option>
              <option value="name_asc">{t('shop.sort_name') || 'Alphabetical (A–Z)'}</option>
            </select>
          </div>

          {/* Availability & Offers */}
          <div className="pt-2 border-t border-[#ECE8DE] space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#1F2520] select-none hover:text-[#71856B] transition-colors">
              <input
                type="checkbox"
                checked={Boolean(filters.promotion)}
                onChange={(e) => onFilterChange('promotion', e.target.checked ? '1' : '')}
                className="rounded accent-[#71856B] w-3.5 h-3.5 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Sparkles size={11} className="text-[#C29B38]" />
                <span>Special Offers</span>
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#1F2520] select-none hover:text-[#71856B] transition-colors">
              <input
                type="checkbox"
                checked={Boolean(filters.in_stock)}
                onChange={(e) => onFilterChange('in_stock', e.target.checked ? '1' : '')}
                className="rounded accent-[#71856B] w-3.5 h-3.5 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Price Range */}
          <div className="pt-2 border-t border-[#ECE8DE]">
            <label className="block text-[10px] font-semibold text-[#71856B] uppercase tracking-wider mb-1.5">
              Price
            </label>
            <div className="grid grid-cols-4 gap-1">
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
                    className={`py-1 rounded-md text-[10.5px] transition-all cursor-pointer border text-center ${
                      isSelected
                        ? 'border-[#71856B] bg-[#EEF2EB] text-[#4A5D45] font-semibold'
                        : 'border-[#ECE8DE] bg-[#FAF9F5] text-[#5A6358] hover:border-[#71856B]/50'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Applied Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="pt-2 border-t border-[#ECE8DE]">
              <div className="flex flex-wrap gap-1">
                {filters.search && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                    "{filters.search}"
                    <X size={9} className="cursor-pointer text-[#71856B]" onClick={() => onFilterChange('search', '')} />
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                    {getLocalizedCategoryName(selectedCategory, language)}
                    <X size={9} className="cursor-pointer text-[#71856B]" onClick={() => onFilterChange('category_id', '')} />
                  </span>
                )}
                {filters.brand && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                    {filters.brand}
                    <X size={9} className="cursor-pointer text-[#71856B]" onClick={() => onFilterChange('brand', '')} />
                  </span>
                )}
                {(filters.min_price || filters.max_price) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                    ${filters.min_price || '0'}–${filters.max_price || '∞'}
                    <X size={9} className="cursor-pointer text-[#71856B]" onClick={() => { onFilterChange('min_price', ''); onFilterChange('max_price', ''); }} />
                  </span>
                )}
                {filters.in_stock && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                    In Stock
                    <X size={9} className="cursor-pointer text-[#71856B]" onClick={() => onFilterChange('in_stock', '')} />
                  </span>
                )}
                {filters.promotion && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                    Special Offers
                    <X size={9} className="cursor-pointer text-[#71856B]" onClick={() => onFilterChange('promotion', '')} />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .filter-sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: #71856B #F0ECE1;
        }
        .filter-sidebar-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .filter-sidebar-scroll::-webkit-scrollbar-track {
          background: #F0ECE1;
          border-radius: 9999px;
          margin: 4px 0;
        }
        .filter-sidebar-scroll::-webkit-scrollbar-thumb {
          background-color: #71856B;
          border-radius: 9999px;
        }
        .filter-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #4A5D45;
        }
      `}</style>
    </div>
  );
}
