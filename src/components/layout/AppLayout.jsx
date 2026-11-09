import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import FlashSaleBanner from '../promotions/FlashSaleBanner';
import Header from './Header';
import PromotionBanner from './PromotionBanner';
import MobileMenu from '../navigation/MobileMenu';
import SearchOverlay from './SearchOverlay';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import ToastContainer from '../feedback/ToastContainer';
import ScrollToTop from './ScrollToTop';

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  // Global Ctrl+K / Cmd+K search shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Accessible Skip to Content Link for Keyboard and Screen Reader Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#1F2520] focus:text-white focus:rounded-full focus:shadow-xl focus:text-xs focus:font-medium focus:ring-2 focus:ring-[#71856B]"
      >
        Skip to main content
      </a>

      <ScrollToTop />
      <AnnouncementBar />
      <FlashSaleBanner />
      <Header
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <PromotionBanner />

      <main
        id="main-content"
        role="main"
        tabIndex="-1"
        key={location.pathname}
        className="page-transition focus:outline-none"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Outlet />
      </main>

      <Footer />
      <CartDrawer />
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => {
          setIsMobileMenuOpen(false);
          setIsSearchOpen(true);
        }}
      />
      <ToastContainer />
    </div>
  );
}
