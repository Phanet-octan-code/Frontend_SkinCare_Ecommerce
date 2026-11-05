import React, { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { Search, RotateCcw, X, SlidersHorizontal, Sparkles, Check, ChevronDown } from 'lucide-react';

export default function ProductFilters({
  categories = [],
  brands = [],
  filters = {},
  onFilterChange,
  onResetFilters,
  totalResults = 0,
}) {
  const { t } = useTranslation();
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
    <div className="mb-6 sm:mb-8">
      {/* Mobile Quick Action Toolbar (< md) */}
      <div className="md:hidden flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('header.search_placeholder')}
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

      {/* Main Filter Console (Always open on md+, collapsible on mobile) */}
      <div className={`p-4 sm:p-6 rounded-2xl bg-white border border-[#ECE8DE] shadow-xs transition-all ${
        isMobileExpanded ? 'block' : 'hidden md:block'
      }`}>
        {/* Primary Bar: Search (Desktop), Category, Brand, and Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 items-center">
          {/* Search Input (Desktop) */}
          <div className="hidden md:block relative w-full min-w-0">
            <input
              type="text"
              placeholder={t('header.search_placeholder')}
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full pl-9 pr-8 h-10 sm:h-[42px] text-xs sm:text-sm rounded-xl bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] placeholder:text-[#8C9388] focus:outline-none focus:border-[#71856B] transition-colors"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#71856B]"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onFilterChange('search', '')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-0 text-[#8C9388] hover:text-[#1F2520] cursor-pointer p-1 flex items-center"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Selector */}
          <div className="w-full min-w-0">
            <label className="md:hidden block text-[11px] font-semibold text-[#71856B] uppercase mb-1">
              Category
            </label>
            <select
              value={filters.category_id || ''}
              onChange={(e) => onFilterChange('category_id', e.target.value)}
              className="w-full h-10 sm:h-[42px] px-3.5 text-xs sm:text-sm rounded-xl bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] focus:outline-none focus:border-[#71856B] transition-colors"
            >
              <option value="">{t('shop.all_categories')} ({categories.reduce((acc, c) => acc + (c.products_count || 0), 0)})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} {cat.products_count ? `(${cat.products_count})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Selector */}
          <div className="w-full min-w-0">
            <label className="md:hidden block text-[11px] font-semibold text-[#71856B] uppercase mb-1">
              Brand
            </label>
            <select
              value={filters.brand || ''}
              onChange={(e) => onFilterChange('brand', e.target.value)}
              className="w-full h-10 sm:h-[42px] px-3.5 text-xs sm:text-sm rounded-xl bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] focus:outline-none focus:border-[#71856B] transition-colors"
            >
              <option value="">{t('shop.all_brands')} ({brands.length})</option>
              {brands.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name} ({b.products_count})
                </option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="w-full min-w-0">
            <label className="md:hidden block text-[11px] font-semibold text-[#71856B] uppercase mb-1">
              Sort By
            </label>
            <select
              value={filters.sort || 'featured'}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              className="w-full h-10 sm:h-[42px] px-3.5 text-xs sm:text-sm font-medium rounded-xl bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] focus:outline-none focus:border-[#71856B] transition-colors"
            >
              <option value="featured">{t('shop.sort_featured')}</option>
              <option value="latest">{t('shop.sort_newest')}</option>
              <option value="best_selling">{t('shop.sort_featured')}</option>
              <option value="price_asc">{t('shop.sort_price_low')}</option>
              <option value="price_desc">{t('shop.sort_price_high')}</option>
              <option value="name_asc">{t('shop.sort_name')}</option>
            </select>
          </div>
        </div>

        {/* Second Row: Toggles (In Stock, On Sale, Advanced Price) */}
        <div className="mt-4 pt-4 border-t border-[#ECE8DE] flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap w-full md:w-auto">
            {/* In-Stock Filter */}
            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium select-none text-[#1F2520]">
              <input
                type="checkbox"
                checked={Boolean(filters.in_stock)}
                onChange={(e) => onFilterChange('in_stock', e.target.checked ? '1' : '')}
                className="rounded accent-[#71856B] w-4 h-4 cursor-pointer"
              />
              <span>{t('shop.in_stock_only')}</span>
            </label>

            {/* Active Promotions Filter */}
            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium select-none text-[#1F2520]">
              <input
                type="checkbox"
                checked={Boolean(filters.promotion)}
                onChange={(e) => onFilterChange('promotion', e.target.checked ? '1' : '')}
                className="rounded accent-[#71856B] w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Sparkles size={13} className="text-[#C29B38]" />
                {t('shop.promotions_only')}
              </span>
            </label>

            {/* Price Filtering: Quick Presets + Custom Range Inputs */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#8C9388] shrink-0">{t('shop.filter_by_price')}:</span>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
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
                      className={`px-2.5 py-1 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                        isSelected
                          ? 'border-[#71856B] bg-[#EEF2EB] text-[#4A5D45] font-semibold shadow-2xs'
                          : 'border-[#ECE8DE] bg-white text-[#5A6358] hover:border-[#71856B]/50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Min / Max Inputs */}
              <div className="inline-flex items-center gap-1 pl-1 border-l border-[#ECE8DE]">
                <div className="relative w-16">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-[#8C9388]">$</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={filters.min_price || ''}
                    onChange={(e) => onFilterChange('min_price', e.target.value)}
                    className="w-full pl-4 pr-1 h-7 text-xs rounded-lg bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] focus:outline-none focus:border-[#71856B]"
                    aria-label="Minimum price"
                  />
                </div>
                <span className="text-xs text-[#8C9388]">–</span>
                <div className="relative w-16">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-[#8C9388]">$</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={filters.max_price || ''}
                    onChange={(e) => onFilterChange('max_price', e.target.value)}
                    className="w-full pl-4 pr-1 h-7 text-xs rounded-lg bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520] focus:outline-none focus:border-[#71856B]"
                    aria-label="Maximum price"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Clear All / Active Filters Indicator */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#ECE8DE]">
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#71856B] hover:text-[#596D54] font-medium px-2 py-1 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>{t('shop.reset_filters')} ({activeFiltersCount})</span>
              </button>
            )}

            <span className="text-xs text-[#8C9388]">
              {t('shop.showing_results', { count: totalResults })}
            </span>
          </div>
        </div>

        {/* Active Filter Chips / Pills */}
        {activeFiltersCount > 0 && (
          <div className="mt-3.5 pt-3.5 border-t border-[#ECE8DE] flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-wider text-[#8C9388] font-semibold">
              Applied:
            </span>

            {filters.search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                Search: "{filters.search}"
                <X size={12} className="cursor-pointer text-[#71856B] hover:text-[#1F2520]" onClick={() => onFilterChange('search', '')} />
              </span>
            )}

            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                Category: {selectedCategory.name}
                <X size={12} className="cursor-pointer text-[#71856B] hover:text-[#1F2520]" onClick={() => onFilterChange('category_id', '')} />
              </span>
            )}

            {filters.brand && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                Brand: {filters.brand}
                <X size={12} className="cursor-pointer text-[#71856B] hover:text-[#1F2520]" onClick={() => onFilterChange('brand', '')} />
              </span>
            )}

            {(filters.min_price || filters.max_price) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                Price: {filters.min_price ? `$${filters.min_price}` : '$0'} – {filters.max_price ? `$${filters.max_price}` : 'Any'}
                <X
                  size={12}
                  className="cursor-pointer text-[#71856B] hover:text-[#1F2520]"
                  onClick={() => {
                    onFilterChange('min_price', '');
                    onFilterChange('max_price', '');
                  }}
                />
              </span>
            )}

            {filters.in_stock && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                In Stock Only
                <X size={12} className="cursor-pointer text-[#71856B] hover:text-[#1F2520]" onClick={() => onFilterChange('in_stock', '')} />
              </span>
            )}

            {filters.promotion && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#FAF9F5] border border-[#ECE8DE] text-[#1F2520]">
                Active Promotions
                <X size={12} className="cursor-pointer text-[#71856B] hover:text-[#1F2520]" onClick={() => onFilterChange('promotion', '')} />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
