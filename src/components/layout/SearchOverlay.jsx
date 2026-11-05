import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import catalogService from '../../services/catalogService';
import PriceDisplay from '../product/PriceDisplay';
import { resolveImageUrl, handleImageError } from '../../utils/imageUrl';

export default function SearchOverlay({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const popularSearches = [
    'Niacinamide',
    'Hyaluronic Acid',
    'Vitamin C',
    'Bakuchiol',
    'Centella Asiatica',
    'Ceramides',
    'Salicylic Acid',
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen, onClose]);

  // Debounced search preview
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const abortController = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await catalogService.getProducts(
          { search: query.trim(), per_page: 5 },
          { signal: abortController.signal }
        );
        if (Array.isArray(res?.data)) {
          setResults(res.data);
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
          console.error('Search error:', err);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [query]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/shop?search=${encodeURIComponent(tag)}`);
    onClose();
  };

  const handleProductClick = (slugOrId) => {
    navigate(`/products/${slugOrId}`);
    onClose();
  };

  return (
    <div
      className="overlay items-start pt-8 sm:pt-20 p-4 sm:p-6 bg-black/50 backdrop-blur-sm z-[1050] overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Product Search"
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#ECE8DE] p-5 sm:p-7 relative animate-[modalPop_0.22s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
          <Search size={20} className="text-[#71856B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t('search.input_placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none text-base sm:text-lg text-[#1F2520] placeholder:text-[#8C9388] font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[#8C9388] hover:text-[#1F2520] p-1 cursor-pointer"
              aria-label={t('common.close')}
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 rounded-full text-xs font-medium text-[#8C9388] hover:text-[#1F2520] bg-[#FAF9F5] border border-[#ECE8DE] cursor-pointer"
          >
            Esc
          </button>
        </form>

        <div className="h-px bg-[#ECE8DE] my-4 sm:my-5" />

        {/* Live Results Preview */}
        {loading ? (
          <div className="py-8 text-center text-[#8C9388] text-xs sm:text-sm">
            {t('common.loading')}
          </div>
        ) : results.length > 0 ? (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#71856B] mb-3">
              {t('search.suggested_formulations')}
            </div>
            <div className="flex flex-col gap-2">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.slug || product.id)}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-[#FAF9F5] border border-transparent hover:border-[#ECE8DE] cursor-pointer transition-all hover:translate-x-1 duration-200"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-lg bg-[#F7F5F0] overflow-hidden shrink-0 flex items-center justify-center">
                      {product.image_url ? (
                        <img
                          src={resolveImageUrl(product.image_url)}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                          onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80')}
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <span className="font-serif text-xs sm:text-sm font-medium text-[#1F2520] block truncate">
                        {product.name}
                      </span>
                      <span className="text-[11px] text-[#8C9388] block truncate">
                        {product.category?.name || 'Clinical Formulation'}
                      </span>
                    </div>
                  </div>

                  <PriceDisplay
                    regularPrice={product.price}
                    finalPrice={product.final_price ?? product.price}
                    size="sm"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-white bg-[#1F2520] hover:bg-[#71856B] hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <span>{t('search.view_all_results', { query })}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : query.trim().length >= 2 ? (
          <div className="py-8 text-center text-[#8C9388] text-xs sm:text-sm">
            {t('search.no_results')}
          </div>
        ) : (
          /* Popular Searches */
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#71856B] mb-3">
              <Sparkles size={13} className="text-[#C29B38]" />
              <span>{t('search.trending_ingredients')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#5A6358] bg-[#FAF9F5] border border-[#ECE8DE] hover:border-[#71856B] hover:text-[#1F2520] hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-2xs"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
