import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import catalogService from '../../services/catalogService';
import { ArrowRight } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  // Fallback clinical categories
  const defaultCategories = [
    { id: 1, name: 'Cleansers & Washes', path: '/shop?category_id=1' },
    { id: 3, name: 'Serums & Ampoules', path: '/shop?category_id=3' },
    { id: 4, name: 'Moisturizers & Creams', path: '/shop?category_id=4' },
    { id: 5, name: 'Sunscreens & UV Shields', path: '/shop?category_id=5' },
    { id: 8, name: 'Masks & Treatments', path: '/shop?category_id=8' },
    { id: 2, name: 'Toners & Essences', path: '/shop?category_id=2' },
  ];

  // Fallback dispensary brands
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

    catalogService
      .getBrands()
      .then((res) => {
        if (Array.isArray(res?.data) && res.data.length > 0) {
          setBrands(res.data.slice(0, 8));
        }
      })
      .catch(() => {});
  }, []);

  const displayedCategories =
    categories.length > 0 ? categories : defaultCategories;
  const displayedBrands = brands.length > 0 ? brands : defaultBrands;

  // Active route matching
  const searchParams = new URLSearchParams(location.search);
  const path = location.pathname;
  const brandParam = searchParams.get('brand');
  const filterParam = searchParams.get('filter');
  const promotionParam = searchParams.get('promotion');

  const isHomeActive = path === '/';
  const isBrandsActive =
    path === '/brands' ||
    (path === '/shop' && (Boolean(brandParam) || filterParam === 'brands'));
  const isOffersActive =
    path === '/offers' ||
    (path === '/shop' && (promotionParam === '1' || filterParam === 'promotion'));
  const isCategoriesActive =
    (path === '/shop' || path === '/categories' || path.startsWith('/product/')) &&
    !isBrandsActive &&
    !isOffersActive;
  const isAboutActive = path === '/about';
  const isBlogActive = path.startsWith('/blog') || path.startsWith('/journal');

  // Dropdown hover timers
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

  const navItems = [
    {
      id: 'home',
      name: 'Home',
      path: '/',
      isActive: isHomeActive,
    },
    {
      id: 'categories',
      name: 'Categories',
      path: '/shop',
      isActive: isCategoriesActive,
      hasDropdown: true,
    },
    {
      id: 'brands',
      name: 'Brands',
      path: '/shop?filter=brands',
      isActive: isBrandsActive,
      hasDropdown: true,
    },
    {
      id: 'offers',
      name: 'Offers',
      path: '/shop?promotion=1',
      isActive: isOffersActive,
      badge: 'SALE',
    },
    {
      id: 'about',
      name: 'About Us',
      path: '/about',
      isActive: isAboutActive,
    },
    {
      id: 'blog',
      name: 'Blog',
      path: '/blog',
      isActive: isBlogActive,
    },
  ];

  return (
    // Hidden on responsive mobile screens (<768px), visible as clean desktop bar (>=768px)
    <nav
      className="hidden md:block bg-[#FAF9F5]/98 backdrop-blur-md border-b border-[#ECE8DE] sticky top-[72px] z-[1010] select-none transition-shadow"
      id="desktop-navbar"
      aria-label="Store navigation"
    >
      <div className="container relative">
        <div className="flex items-center justify-center gap-7 sm:gap-9 md:gap-11 lg:gap-14 xl:gap-16 h-12 md:h-13 px-4">
          {navItems.map((item) => {
            const hasMenu = item.hasDropdown;
            const isOpen = activeDropdown === item.id;

            return (
              <div
                key={item.id}
                className="relative shrink-0 h-full flex items-center"
                onMouseEnter={() => hasMenu && handleMouseEnter(item.id)}
                onMouseLeave={() => hasMenu && handleMouseLeave()}
              >
                <Link
                  to={item.path}
                  onClick={handleCloseDropdown}
                  className={`relative h-full flex items-center gap-1.5 px-3 sm:px-3.5 text-[13.5px] sm:text-sm lg:text-[14.5px] tracking-[0.02em] transition-colors duration-200 whitespace-nowrap group no-underline ${
                    item.isActive
                      ? 'text-[#E0567A] font-semibold'
                      : 'text-[#4A5568] hover:text-[#E0567A] font-medium'
                  }`}
                  aria-current={item.isActive ? 'page' : undefined}
                  aria-expanded={hasMenu ? isOpen : undefined}
                  aria-haspopup={hasMenu ? 'true' : undefined}
                >
                  <span>{item.name}</span>

                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-[#E0567A] text-white leading-none shadow-2xs">
                      {item.badge}
                    </span>
                  )}

                  {/* Active Underline Indicator Bar */}
                  {item.isActive && (
                    <span
                      className="absolute bottom-0 left-1 right-1 h-[2.5px] bg-[#E0567A] rounded-full transition-all duration-300 z-10"
                      aria-hidden="true"
                    />
                  )}
                </Link>

                {/* Dropdown Menu for Categories */}
                {item.id === 'categories' && isOpen && (
                  <div
                    className="absolute top-[calc(100%-2px)] left-1/2 -translate-x-1/2 w-80 bg-white rounded-2xl shadow-xl border border-[#ECE8DE] p-3.5 z-[1050] animate-[fadeIn_0.15s_ease-out]"
                    onMouseEnter={() => handleMouseEnter('categories')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="px-3 py-1.5 border-b border-[#ECE8DE] mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C9388]">
                        Product Categories
                      </span>
                      <Link
                        to="/shop"
                        onClick={handleCloseDropdown}
                        className="text-[11px] text-[#E0567A] hover:underline font-medium flex items-center gap-1"
                      >
                        <span>All Formulations</span>
                        <ArrowRight size={11} />
                      </Link>
                    </div>

                    <div className="flex flex-col gap-1 max-h-72 overflow-y-auto no-scrollbar">
                      {displayedCategories.map((cat) => {
                        const targetPath = cat.path || `/shop?category_id=${cat.id}`;
                        return (
                          <Link
                            key={cat.id || cat.name}
                            to={targetPath}
                            onClick={handleCloseDropdown}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#2D3748] hover:text-[#1F2520] hover:bg-[#FAF9F5] transition-colors group/item"
                          >
                            <span className="font-medium group-hover/item:text-[#E0567A] transition-colors">
                              {cat.name}
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

                {/* Dropdown Menu for Brands */}
                {item.id === 'brands' && isOpen && (
                  <div
                    className="absolute top-[calc(100%-2px)] left-1/2 -translate-x-1/2 w-80 bg-white rounded-2xl shadow-xl border border-[#ECE8DE] p-3.5 z-[1050] animate-[fadeIn_0.15s_ease-out]"
                    onMouseEnter={() => handleMouseEnter('brands')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="px-3 py-1.5 border-b border-[#ECE8DE] mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C9388]">
                        Featured Dispensary Brands
                      </span>
                      <Link
                        to="/shop?filter=brands"
                        onClick={handleCloseDropdown}
                        className="text-[11px] text-[#E0567A] hover:underline font-medium flex items-center gap-1"
                      >
                        <span>All Brands</span>
                        <ArrowRight size={11} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-1 max-h-72 overflow-y-auto no-scrollbar">
                      {displayedBrands.map((b) => {
                        const brandName = typeof b === 'string' ? b : b.name || b;
                        return (
                          <Link
                            key={brandName}
                            to={`/shop?brand=${encodeURIComponent(brandName)}`}
                            onClick={handleCloseDropdown}
                            className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-[#2D3748] hover:text-[#1F2520] hover:bg-[#FAF9F5] transition-colors group/item"
                          >
                            <span className="truncate font-medium group-hover/item:text-[#E0567A] transition-colors">
                              {brandName}
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
        </div>
      </div>
    </nav>
  );
}