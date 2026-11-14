import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { getLocalizedCategoryName } from '../../utils/categoryLocalization';
import { getCustomerAvatar } from '../../utils/customerAvatar';
import catalogService from '../../services/catalogService';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  ChevronDown,
  LogOut,
  Package,
  MapPin,
  ArrowRight,
  X,
} from 'lucide-react';

export default function Header({ onOpenMobileMenu, onOpenSearch }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const { customer, isAuthenticated, logout } = useAuth();
  const { totalItemCount, openCart } = useCart();
  const { language, t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchExpanded(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSearchExpanded(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchExpanded(true);
        setTimeout(() => searchInputRef.current?.focus(), 80);
      }
    };
    if (isSearchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchExpanded]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (navSearchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(navSearchQuery.trim())}`);
      setIsSearchExpanded(false);
    }
  };

  // Curated clinical categories
  const defaultCategories = [
    { id: 1, name: 'Cleansers & Washes', path: '/shop?category_id=1' },
    { id: 3, name: 'Serums & Ampoules', path: '/shop?category_id=3' },
    { id: 4, name: 'Moisturizers & Creams', path: '/shop?category_id=4' },
    { id: 5, name: 'Sunscreens & UV Shields', path: '/shop?category_id=5' },
    { id: 8, name: 'Masks & Treatments', path: '/shop?category_id=8' },
    { id: 2, name: 'Toners & Essences', path: '/shop?category_id=2' },
  ];

  useEffect(() => {
    catalogService
      .getCategories()
      .then((res) => {
        if (Array.isArray(res?.data) && res.data.length > 0) {
          const clean = res.data.filter((c) => {
            const upper = (c.name || '').toUpperCase();
            return (
              !upper.includes('TEST') &&
              !upper.includes('BULK') &&
              !upper.includes('DEMO') &&
              !upper.includes('SAMPLE')
            );
          });
          setCategories(clean.slice(0, 8));
        }
      })
      .catch(() => {});
  }, []);

  const displayedCategories =
    categories.length > 0 ? categories : defaultCategories;

  // Active route matching
  const searchParams = new URLSearchParams(location.search);
  const path = location.pathname;
  const filterParam = searchParams.get('filter');
  const promotionParam = searchParams.get('promotion');

  const isHomeActive = path === '/';
  const isOffersActive =
    path === '/offers' ||
    (path === '/shop' && (promotionParam === '1' || filterParam === 'promotion'));
  const isCategoriesActive =
    (path === '/shop' ||
      path === '/categories' ||
      path.startsWith('/product/') ||
      path.startsWith('/products/')) &&
    !isOffersActive;
  const isAboutActive = path === '/about';
  const isBlogActive = path.startsWith('/blog') || path.startsWith('/journal');

  // Hover dropdown handlers with debounce
  const handleMouseEnter = (menuName) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleCloseDropdown = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(null);
  };

  const navLinks = [
    {
      id: 'home',
      name: t('nav.home') || 'Home',
      path: '/',
      isActive: isHomeActive,
    },
    {
      id: 'categories',
      name: t('nav.categories') || 'Categories',
      path: '/shop',
      isActive: isCategoriesActive,
      hasDropdown: true,
    },
    {
      id: 'offers',
      name: t('nav.offers') || 'Offers',
      path: '/shop?promotion=1',
      isActive: isOffersActive,
      badge: t('common.sale') || 'SALE',
    },
    {
      id: 'about',
      name: t('nav.about_us') || t('nav.about') || 'About Us',
      path: '/about',
      isActive: isAboutActive,
    },
    {
      id: 'blog',
      name: t('nav.blog') || 'Blog',
      path: '/blog',
      isActive: isBlogActive,
    },
  ];

  return (
    <header className="sticky top-0 z-[1020] bg-[#FAF9F5]/98 backdrop-blur-md border-b border-[#ECE8DE] shadow-[0_1px_3px_rgba(31,37,32,0.02)] select-none">
      <div className="container">
        <div className="flex items-center justify-between h-16 sm:h-17 md:h-[72px] gap-3 sm:gap-4 lg:gap-6 w-full">
          {/* Left Cluster: Mobile Menu Button (< lg) + Brand Name of Logo + Page Navigation Links */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 xl:gap-7 min-w-0">
            {/* Mobile Menu Toggle Button (< lg) */}
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-[#1F2520] hover:bg-white border border-transparent hover:border-[#ECE8DE] transition-colors active:scale-95 shrink-0 cursor-pointer"
              id="mobile-menu-trigger"
              aria-label="Open mobile menu"
            >
              <Menu size={20} />
            </button>

            {/* Brand Name of Logo (Clean Typography) */}
            <Link
              to="/"
              className="flex flex-col items-start leading-none no-underline select-none shrink-0 group py-0.5"
              aria-label="Élixir Botanique - Clinical Skincare"
            >
              <span className="brand-logo-title font-serif text-[17px] sm:text-lg lg:text-[19px] xl:text-xl font-normal tracking-[0.02em] text-[#1F2520] leading-none whitespace-nowrap group-hover:text-[#71856B] transition-colors">
                ÉLIXIR <span className="brand-italic font-serif italic text-[#71856B] font-normal">BOTANIQUE</span>
              </span>
              <span className="brand-logo-tagline text-[7px] sm:text-[7.5px] lg:text-[8px] font-medium tracking-[0.16em] uppercase text-[#8C9388] mt-1 whitespace-nowrap block">
                CLINICAL SKINCARE
              </span>
            </Link>

            {/* Subtle Divider between Brand Name and Nav Links on Desktop */}
            <div className="hidden lg:block w-px h-5 bg-[#ECE8DE] shrink-0 mx-1 xl:mx-1.5" aria-hidden="true" />

            {/* Navigation Links Aligned Left */}
            <nav
              className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-7"
              aria-label="Main navigation"
            >
              {navLinks.map((item) => {
                const hasMenu = item.hasDropdown;
                const isOpen = activeDropdown === item.id;

                return (
                  <div
                    key={item.id}
                    className="relative flex items-center shrink-0"
                    onMouseEnter={() => hasMenu && handleMouseEnter(item.id)}
                    onMouseLeave={() => hasMenu && handleMouseLeave()}
                  >
                    <Link
                      to={item.path}
                      onClick={handleCloseDropdown}
                      className={`relative py-1.5 flex items-center gap-1 text-xs lg:text-[13px] xl:text-sm font-medium tracking-normal transition-colors duration-150 whitespace-nowrap no-underline outline-none focus:outline-none focus-visible:outline-none ${
                        item.isActive
                          ? 'text-[#E0567A] font-semibold'
                          : 'text-[#374151] hover:text-[#E0567A]'
                      }`}
                      aria-current={item.isActive ? 'page' : undefined}
                      aria-expanded={hasMenu ? isOpen : undefined}
                    >
                      <span>{item.name}</span>

                      {hasMenu && (
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-200 text-[#8C9388] group-hover:text-[#E0567A] ${
                            isOpen ? 'rotate-180 text-[#E0567A]' : ''
                          }`}
                        />
                      )}

                      {item.badge && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold tracking-wider uppercase bg-[#E0567A] text-white leading-none shadow-2xs">
                          {item.badge}
                        </span>
                      )}

                      {/* Active Underline Indicator Bar - Hugs text directly underneath */}
                      {item.isActive && (
                        <span
                          className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#E0567A] rounded-full transition-all duration-300 z-10"
                          aria-hidden="true"
                        />
                      )}
                    </Link>

                    {/* Dropdown Menu for Categories */}
                    {item.id === 'categories' && isOpen && (
                      <div
                        className="absolute top-[calc(100%+8px)] left-0 w-72 bg-white rounded-2xl shadow-xl border border-[#ECE8DE] p-3.5 z-[1050] animate-[fadeIn_0.15s_ease-out]"
                        onMouseEnter={() => handleMouseEnter('categories')}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="px-3 py-1.5 border-b border-[#ECE8DE] mb-2 flex items-center justify-between">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C9388]">
                            {t('nav.categories')}
                          </span>
                          <Link
                            to="/shop"
                            onClick={handleCloseDropdown}
                            className="text-[11px] text-[#E0567A] hover:underline font-medium flex items-center gap-1"
                          >
                            <span>{t('nav.all_formulations')}</span>
                            <ArrowRight size={11} />
                          </Link>
                        </div>

                        <div className="flex flex-col gap-0.5 max-h-64 overflow-y-auto no-scrollbar">
                          {displayedCategories.map((cat) => {
                            const targetPath = cat.path || `/shop?category_id=${cat.id}`;
                            const categoryLabel = getLocalizedCategoryName(cat, language);
                            return (
                              <Link
                                key={cat.id || cat.name}
                                to={targetPath}
                                onClick={handleCloseDropdown}
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#2D3748] hover:text-[#1F2520] hover:bg-[#FAF9F5] transition-colors group/item"
                              >
                                <span className="font-medium group-hover/item:text-[#E0567A] transition-colors">
                                  {categoryLabel}
                                </span>
                                <span className="text-[#8C9388] text-[10px] group-hover/item:translate-x-0.5 transition-transform">
                                  →
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right Cluster: Search (near favorite) + Favorite + Bag + User Account */}
          <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 shrink-0">
            {/* Clean Expanding Search Button right next to favorite */}
            <div
              ref={searchContainerRef}
              className="relative hidden md:flex items-center"
            >
              <form
                onSubmit={handleSearchSubmit}
                className={`flex items-center rounded-full border bg-white transition-all duration-300 ease-in-out ${
                  isSearchExpanded
                    ? 'w-56 sm:w-64 md:w-72 lg:w-72 h-9 lg:h-10 px-3.5 border-[#71856B] shadow-sm ring-2 ring-[#71856B]/15'
                    : 'w-9 h-9 lg:w-10 lg:h-10 p-0 justify-center border-[#ECE8DE] hover:border-[#71856B] hover:bg-white cursor-pointer'
                }`}
                onClick={() => {
                  if (!isSearchExpanded) {
                    setIsSearchExpanded(true);
                    setTimeout(() => searchInputRef.current?.focus(), 80);
                  }
                }}
              >
                <button
                  type={isSearchExpanded ? 'submit' : 'button'}
                  className={`flex items-center justify-center shrink-0 text-[#1F2520] hover:text-[#71856B] transition-colors cursor-pointer ${
                    isSearchExpanded ? 'w-5 h-5 text-[#71856B]' : 'w-full h-full'
                  }`}
                  aria-label="Search"
                >
                  <Search size={16} />
                </button>

                {isSearchExpanded && (
                  <>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={navSearchQuery}
                      onChange={(e) => setNavSearchQuery(e.target.value)}
                      placeholder={t('header.search_placeholder') || 'Search formulas, ingredients...'}
                      className="w-full bg-transparent border-none text-xs text-[#1F2520] placeholder-[#8C9388] outline-none pl-2 pr-1"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSearchExpanded(false);
                        setNavSearchQuery('');
                      }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[#8C9388] hover:text-[#1F2520] hover:bg-[#FAF9F5] transition-colors shrink-0 cursor-pointer"
                      aria-label="Close search"
                    >
                      <X size={13} />
                    </button>
                  </>
                )}
              </form>
            </div>

            {/* Mobile Search Button (< md) */}
            <button
              type="button"
              onClick={onOpenSearch}
              id="mobile-search-btn"
              className="md:hidden inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full text-[#1F2520] hover:bg-white border border-transparent hover:border-[#ECE8DE] transition-colors cursor-pointer"
              aria-label="Open search"
            >
              <Search size={18} />
            </button>

            {/* Wishlist Link (Favorite) */}
            <Link
              to="/wishlist"
              className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full text-[#1F2520] hover:bg-white hover:text-[#E0567A] border border-transparent hover:border-[#ECE8DE] transition-all duration-150 active:scale-95"
              title="My Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={18} />
            </Link>

            {/* Shopping Bag Trigger */}
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full text-[#1F2520] hover:bg-white border border-transparent hover:border-[#ECE8DE] transition-all duration-150 active:scale-95 cursor-pointer"
              title="Shopping Bag"
              aria-label={`Shopping Bag with ${totalItemCount} items`}
            >
              <ShoppingBag size={18} />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1F2520] text-white rounded-full text-[9px] sm:text-[10px] font-bold min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] flex items-center justify-center px-1 shadow-2xs ring-2 ring-[#FAF9F5]">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* User Account Menu / Sign In */}
            {isAuthenticated ? (
              <div className="relative">
                {(() => {
                  const avatarSrc = getCustomerAvatar(customer);
                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="inline-flex items-center justify-center sm:justify-start gap-1.5 h-8 sm:h-9 lg:h-10 w-8 sm:w-auto p-0 sm:pl-1.5 sm:pr-3.5 rounded-full bg-white border border-[#ECE8DE] hover:border-[#71856B]/60 text-xs font-medium text-[#1F2520] cursor-pointer shadow-2xs hover:shadow-xs transition-colors"
                        aria-label="User Account"
                      >
                        <div className="w-7 h-7 sm:w-7 sm:h-7 rounded-full overflow-hidden bg-[#EEF2EB] text-[#4A5D45] flex items-center justify-center font-bold text-[11px] shrink-0 border border-[#71856B]/20">
                          {avatarSrc ? (
                            <img
                              src={avatarSrc}
                              alt={customer?.name || 'User'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            customer?.name ? customer.name.charAt(0).toUpperCase() : 'U'
                          )}
                        </div>
                        <span className="hidden sm:inline max-w-[85px] truncate font-medium">
                          {customer?.name?.split(' ')[0] || 'Account'}
                        </span>
                        <ChevronDown size={12} className="hidden sm:inline text-[#8C9388]" />
                      </button>

                      {isUserMenuOpen && (
                        <>
                          <div
                            onClick={() => setIsUserMenuOpen(false)}
                            className="fixed inset-0 z-[1030]"
                          />
                          <div className="absolute right-0 top-[120%] w-60 bg-white rounded-2xl shadow-xl border border-[#ECE8DE] p-2 z-[1040] flex flex-col animate-[fadeIn_0.15s_ease-out]">
                            {/* Member Identity Header with Avatar */}
                            <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-[#ECE8DE] mb-1.5 bg-[#FAF9F5]/70 rounded-xl">
                              <div className="w-9 h-9 rounded-full overflow-hidden bg-[#EEF2EB] text-[#4A5D45] border border-[#71856B]/25 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                {avatarSrc ? (
                                  <img
                                    src={avatarSrc}
                                    alt={customer?.name || 'User'}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  customer?.name ? customer.name.charAt(0).toUpperCase() : 'U'
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-[#1F2520] truncate">
                                  {customer?.name}
                                </p>
                                <p className="text-[11px] text-[#8C9388] truncate">
                                  {customer?.email}
                                </p>
                              </div>
                            </div>

                            <Link
                              to="/account/profile"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#5A6358] hover:text-[#1F2520] hover:bg-[#FAF9F5] transition-colors"
                            >
                              <User size={14} className="text-[#71856B]" />
                              <span>{t('account.profile_security') || 'Profile & Photo'}</span>
                            </Link>

                            <Link
                              to="/account/orders"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#5A6358] hover:text-[#1F2520] hover:bg-[#FAF9F5] transition-colors"
                            >
                              <Package size={14} />
                              <span>{t('nav.orders')}</span>
                            </Link>

                            <Link
                              to="/account/addresses"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#5A6358] hover:text-[#1F2520] hover:bg-[#FAF9F5] transition-colors"
                            >
                              <MapPin size={14} />
                              <span>{t('nav.addresses')}</span>
                            </Link>

                            <div className="h-px bg-[#ECE8DE] my-1" />

                            <button
                              type="button"
                              onClick={() => {
                                setIsUserMenuOpen(false);
                                logout();
                              }}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#A64444] hover:bg-[#F9EFEF] transition-colors w-full text-left cursor-pointer"
                            >
                              <LogOut size={14} />
                              <span>{t('nav.sign_out')}</span>
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 lg:h-10 px-3.5 sm:px-4 rounded-full bg-[#1F2520] hover:bg-[#2F3A31] text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-95 whitespace-nowrap cursor-pointer no-underline"
                style={{ backgroundColor: '#1F2520', color: '#FFFFFF' }}
                aria-label="Sign In"
              >
                <User size={14} className="text-[#DCE2DA] shrink-0" />
                <span className="text-white font-medium">{t('nav.sign_in') || 'Sign In'}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}