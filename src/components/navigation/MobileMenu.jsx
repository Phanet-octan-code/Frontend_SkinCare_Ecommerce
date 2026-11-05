import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../i18n/LanguageContext';
import catalogService from '../../services/catalogService';
import {
  X,
  Search,
  User,
  Package,
  MapPin,
  LogOut,
  HelpCircle,
  Sparkles,
  Percent,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';

export default function MobileMenu({ isOpen, onClose, onOpenSearch }) {
  const location = useLocation();
  const path = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const brandParam = searchParams.get('brand');
  const filterParam = searchParams.get('filter');
  const promotionParam = searchParams.get('promotion');
  const categoryParam = searchParams.get('category_id');

  const isHomeActive = path === '/';
  const isBrandsActive =
    path === '/brands' ||
    (path === '/shop' && (Boolean(brandParam) || filterParam === 'brands'));
  const isOffersActive =
    path === '/offers' ||
    (path === '/shop' && (promotionParam === '1' || filterParam === 'promotion'));
  const isCategoriesActive =
    (path === '/shop' ||
      path === '/categories' ||
      path.startsWith('/product/') ||
      path.startsWith('/products/')) &&
    !isBrandsActive &&
    !isOffersActive;
  const isAboutActive = path === '/about';
  const isBlogActive = path.startsWith('/blog') || path.startsWith('/journal');
  const isTrackActive = path === '/track' || path.startsWith('/tracking');
  const isContactActive = path === '/contact';
  const isFaqActive = path === '/faq';

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);

  const { customer, isAuthenticated, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage, availableLanguages, t } = useLanguage();

  const defaultBrands = [
    'Beauty of Joseon',
    'Torriden',
    'CeraVe',
    "Paula's Choice",
    'La Roche-Posay',
    'SkinCeuticals',
    'Dermalogica',
    'The Ordinary',
  ];

  useEffect(() => {
    if (isOpen) {
      // Auto-expand active accordion if browsing category or brand
      if (isCategoriesActive && categoryParam) {
        setIsCategoriesOpen(true);
      } else {
        setIsCategoriesOpen(false);
      }

      if (isBrandsActive && brandParam) {
        setIsBrandsOpen(true);
      } else {
        setIsBrandsOpen(false);
      }

      catalogService
        .getCategories()
        .then((res) => {
          if (Array.isArray(res?.data)) {
            const clean = res.data.filter((c) => {
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
        })
        .catch(() => {});

      catalogService
        .getBrands()
        .then((res) => {
          if (Array.isArray(res?.data) && res.data.length > 0) {
            setBrands(res.data.slice(0, 8));
          }
        })
        .catch(() => {});

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLinkClick = () => {
    onClose();
  };

  const displayedBrands = brands.length > 0 ? brands : defaultBrands;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1100] animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className="fixed top-0 bottom-0 left-0 w-full max-w-[320px] bg-white shadow-2xl p-5 flex flex-col justify-between overflow-y-auto animate-[slideRight_0.26s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#ECE8DE] mb-4">
            <Link to="/" onClick={handleLinkClick} className="no-underline select-none">
              <span className="brand-logo-title font-serif text-lg font-normal tracking-wide text-[#1F2520] block">
                ÉLIXIR <span className="brand-italic font-serif italic text-[#71856B] font-normal">BOTANIQUE</span>
              </span>
              <span className="brand-logo-tagline text-[9px] tracking-[0.16em] uppercase text-[#8C9388] block mt-0.5 font-medium">
                CLINICAL SKINCARE & DISPENSARY
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="p-1.5 rounded-full text-[#8C9388] hover:text-[#1F2520] hover:bg-[#FAF9F5] cursor-pointer transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Search Trigger button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#ECE8DE] text-xs text-[#8C9388] mb-5 cursor-pointer text-left hover:border-[#71856B]/50 transition-colors"
          >
            <Search size={15} className="text-[#71856B]" />
            <span>{t('header.search_placeholder')}</span>
          </button>

          {/* Main Navigation Links */}
          <nav className="flex flex-col gap-1 mb-5">
            {/* 1. Home */}
            <Link
              to="/"
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                isHomeActive
                  ? 'bg-[#FDF2F4] text-[#E0567A] font-semibold border border-[#E0567A]/25 shadow-2xs'
                  : 'text-[#1F2520] hover:bg-[#FAF9F5] font-medium border border-transparent'
              }`}
            >
              <span>Home</span>
              {isHomeActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0567A] shadow-xs" />
              )}
            </Link>

            {/* 2. Categories Accordion Toggle */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setIsCategoriesOpen((prev) => !prev)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 flex items-center justify-between cursor-pointer text-left ${
                  isCategoriesActive
                    ? 'bg-[#FDF2F4] text-[#E0567A] font-semibold border border-[#E0567A]/25 shadow-2xs'
                    : isCategoriesOpen
                    ? 'bg-[#FAF9F5] text-[#1F2520] font-medium border border-[#ECE8DE]'
                    : 'text-[#1F2520] hover:bg-[#FAF9F5] font-medium border border-transparent'
                }`}
                aria-expanded={isCategoriesOpen}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">Categories</span>
                  {isCategoriesActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E0567A] shadow-xs" />
                  )}
                </div>
                <ChevronDown
                  size={16}
                  className={`text-[#8C9388] transition-transform duration-200 ${
                    isCategoriesOpen ? 'rotate-180 text-[#E0567A]' : ''
                  }`}
                />
              </button>

              {/* Collapsible Categories List */}
              {isCategoriesOpen && (
                <div className="pl-3 pr-1 py-1.5 flex flex-col gap-0.5 border-l-2 border-[#E0567A]/30 my-1 ml-4 animate-[fadeIn_0.15s_ease-out]">
                  <Link
                    to="/shop"
                    onClick={handleLinkClick}
                    className={`px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      path === '/shop' && !categoryParam && !brandParam && !promotionParam
                        ? 'bg-[#FDF2F4] text-[#E0567A] font-bold border border-[#E0567A]/25'
                        : 'font-semibold text-[#E0567A] hover:bg-[#FDF2F4]'
                    }`}
                  >
                    <span>All Formulations</span>
                    <ArrowRight size={12} />
                  </Link>

                  {categories.map((cat) => {
                    const isThisCatActive =
                      isCategoriesActive && String(categoryParam) === String(cat.id);
                    return (
                      <Link
                        key={cat.id || cat.name}
                        to={`/shop?category_id=${cat.id}`}
                        onClick={handleLinkClick}
                        className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          isThisCatActive
                            ? 'bg-[#FDF2F4] text-[#E0567A] font-bold border border-[#E0567A]/25'
                            : 'text-[#5A6358] hover:text-[#1F2520] hover:bg-[#FAF9F5]'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {cat.products_count > 0 ? (
                          <span
                            className={`text-[10px] ${
                              isThisCatActive ? 'text-[#E0567A] font-semibold' : 'text-[#8C9388]'
                            }`}
                          >
                            ({cat.products_count})
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#8C9388] opacity-50">→</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Brands Accordion Toggle */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setIsBrandsOpen((prev) => !prev)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 flex items-center justify-between cursor-pointer text-left ${
                  isBrandsActive
                    ? 'bg-[#FDF2F4] text-[#E0567A] font-semibold border border-[#E0567A]/25 shadow-2xs'
                    : isBrandsOpen
                    ? 'bg-[#FAF9F5] text-[#1F2520] font-medium border border-[#ECE8DE]'
                    : 'text-[#1F2520] hover:bg-[#FAF9F5] font-medium border border-transparent'
                }`}
                aria-expanded={isBrandsOpen}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">Brands</span>
                  {isBrandsActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E0567A] shadow-xs" />
                  )}
                </div>
                <ChevronDown
                  size={16}
                  className={`text-[#8C9388] transition-transform duration-200 ${
                    isBrandsOpen ? 'rotate-180 text-[#E0567A]' : ''
                  }`}
                />
              </button>

              {/* Collapsible Brands List */}
              {isBrandsOpen && (
                <div className="pl-3 pr-1 py-1.5 flex flex-col gap-0.5 border-l-2 border-[#E0567A]/30 my-1 ml-4 animate-[fadeIn_0.15s_ease-out]">
                  <Link
                    to="/shop?filter=brands"
                    onClick={handleLinkClick}
                    className={`px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      path === '/shop' && filterParam === 'brands' && !brandParam
                        ? 'bg-[#FDF2F4] text-[#E0567A] font-bold border border-[#E0567A]/25'
                        : 'font-semibold text-[#E0567A] hover:bg-[#FDF2F4]'
                    }`}
                  >
                    <span>All Brands</span>
                    <ArrowRight size={12} />
                  </Link>

                  {displayedBrands.map((b) => {
                    const brandName = typeof b === 'string' ? b : b.name || b;
                    const isThisBrandActive =
                      isBrandsActive &&
                      brandParam &&
                      brandParam.toLowerCase() === brandName.toLowerCase();
                    return (
                      <Link
                        key={brandName}
                        to={`/shop?brand=${encodeURIComponent(brandName)}`}
                        onClick={handleLinkClick}
                        className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          isThisBrandActive
                            ? 'bg-[#FDF2F4] text-[#E0567A] font-bold border border-[#E0567A]/25'
                            : 'text-[#5A6358] hover:text-[#1F2520] hover:bg-[#FAF9F5]'
                        }`}
                      >
                        <span>{brandName}</span>
                        <span className="text-[10px] text-[#8C9388] opacity-50">→</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Offers */}
            <Link
              to="/shop?promotion=1"
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                isOffersActive
                  ? 'bg-[#FDF2F4] text-[#E0567A] font-bold border border-[#E0567A]/30 shadow-2xs'
                  : 'text-[#E0567A] hover:bg-[#FDF2F4]/60 font-semibold border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <Percent size={14} />
                <span>Offers</span>
                {isOffersActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0567A] shadow-xs" />
                )}
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-[#E0567A] text-white leading-none shadow-2xs">
                SALE
              </span>
            </Link>

            {/* 5. About Us */}
            <Link
              to="/about"
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                isAboutActive
                  ? 'bg-[#FDF2F4] text-[#E0567A] font-semibold border border-[#E0567A]/25 shadow-2xs'
                  : 'text-[#1F2520] hover:bg-[#FAF9F5] font-medium border border-transparent'
              }`}
            >
              <span>About Us</span>
              {isAboutActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0567A] shadow-xs" />
              )}
            </Link>

            {/* 6. Blog */}
            <Link
              to="/blog"
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                isBlogActive
                  ? 'bg-[#FDF2F4] text-[#E0567A] font-semibold border border-[#E0567A]/25 shadow-2xs'
                  : 'text-[#1F2520] hover:bg-[#FAF9F5] font-medium border border-transparent'
              }`}
            >
              <span>Blog</span>
              {isBlogActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0567A] shadow-xs" />
              )}
            </Link>

            <div className="h-px bg-[#ECE8DE] my-2" />

            {/* Track Order */}
            <Link
              to="/track"
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-colors ${
                isTrackActive
                  ? 'bg-[#FDF2F4] text-[#E0567A] font-semibold border border-[#E0567A]/20'
                  : 'text-[#5A6358] hover:text-[#1F2520] hover:bg-[#FAF9F5]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package size={14} />
                <span>{t('announcement.track_order')}</span>
              </div>
              {isTrackActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0567A] shadow-xs" />
              )}
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-colors ${
                isContactActive
                  ? 'bg-[#FDF2F4] text-[#E0567A] font-semibold border border-[#E0567A]/20'
                  : 'text-[#5A6358] hover:text-[#1F2520] hover:bg-[#FAF9F5]'
              }`}
            >
              <div className="flex items-center gap-2">
                <HelpCircle size={14} />
                <span>{t('nav.contact')}</span>
              </div>
              {isContactActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0567A] shadow-xs" />
              )}
            </Link>

            {/* FAQ */}
            <Link
              to="/faq"
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-colors ${
                isFaqActive
                  ? 'bg-[#FDF2F4] text-[#E0567A] font-semibold border border-[#E0567A]/20'
                  : 'text-[#5A6358] hover:text-[#1F2520] hover:bg-[#FAF9F5]'
              }`}
            >
              <div className="flex items-center gap-2">
                <HelpCircle size={14} />
                <span>{t('nav.faq')}</span>
              </div>
              {isFaqActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0567A] shadow-xs" />
              )}
            </Link>
          </nav>
        </div>

        {/* Account and Currency footer */}
        <div className="pt-4 border-t border-[#ECE8DE] mt-auto">
          {isAuthenticated ? (
            <div className="flex flex-col gap-1.5 mb-4">
              <div className="text-xs font-semibold text-[#1F2520] px-1 truncate">
                {customer?.name}
              </div>
              <Link
                to="/account/orders"
                onClick={handleLinkClick}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#5A6358] hover:bg-[#FAF9F5]"
              >
                <Package size={13} />
                <span>{t('nav.orders')}</span>
              </Link>
              <Link
                to="/account/addresses"
                onClick={handleLinkClick}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#5A6358] hover:bg-[#FAF9F5]"
              >
                <MapPin size={13} />
                <span>{t('nav.addresses')}</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  handleLinkClick();
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#A64444] hover:bg-[#F9EFEF] text-left cursor-pointer mt-1"
              >
                <LogOut size={13} />
                <span>{t('nav.sign_out')}</span>
              </button>
            </div>
          ) : (
            <div className="mb-4">
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#1F2520] hover:bg-[#2F3A31] text-white text-xs font-semibold tracking-wide transition-colors no-underline cursor-pointer"
                style={{ backgroundColor: '#1F2520', color: '#FFFFFF' }}
              >
                <User size={14} className="text-[#DCE2DA]" />
                <span className="text-white font-medium">{t('nav.sign_in')}</span>
              </Link>
            </div>
          )}

          {/* Language Switcher */}
          <div className="flex justify-between items-center mb-2.5 pt-2.5 border-t border-[#ECE8DE]">
            <span className="text-[11px] text-[#8C9388]">{t('common.language')}</span>
            <div className="flex gap-1">
              {availableLanguages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                    language === l.code
                      ? 'bg-[#71856B] text-white shadow-2xs'
                      : 'bg-[#FAF9F5] border border-[#ECE8DE] text-[#8C9388]'
                  }`}
                >
                  {l.short}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Switcher */}
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-[#8C9388]">{t('common.currency')}</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-[#71856B] text-white shadow-2xs'
                    : 'bg-[#FAF9F5] border border-[#ECE8DE] text-[#8C9388]'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('KHR')}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                  currency === 'KHR'
                    ? 'bg-[#71856B] text-white shadow-2xs'
                    : 'bg-[#FAF9F5] border border-[#ECE8DE] text-[#8C9388]'
                }`}
              >
                KHR (៛)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}