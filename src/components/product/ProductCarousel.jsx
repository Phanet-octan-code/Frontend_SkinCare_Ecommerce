import React, { useRef, useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable ProductCarousel Component
 * @param {string} title
 * @param {string} subtitle
 * @param {Array} products
 * @param {Set} wishlistedIds
 * @param {Function} onWishlistChange
 */
export default function ProductCarousel({
  title,
  subtitle,
  products = [],
  wishlistedIds = new Set(),
  onWishlistChange,
  className = '',
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 350);
    }
  };

  if (!products.length) return null;

  return (
    <div className={`product-carousel ${className}`} style={{ position: 'relative' }}>
      {/* Header with Title & Navigation Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '24px',
        }}
      >
        <div>
          {subtitle && <span className="section-subtitle">{subtitle}</span>}
          {title && <h2 className="section-title" style={{ margin: 0 }}>{title}</h2>}
        </div>

        {/* Arrow Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="btn btn-outline btn-sm"
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              opacity: canScrollLeft ? 1 : 0.35,
              cursor: canScrollLeft ? 'pointer' : 'default',
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="btn btn-outline btn-sm"
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              opacity: canScrollRight ? 1 : 0.35,
              cursor: canScrollRight ? 'pointer' : 'default',
            }}
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="carousel-track flex gap-2.5 sm:gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-3 no-scrollbar"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="shrink-0 w-[175px] xs:w-[200px] sm:w-[240px] md:w-[275px] snap-start flex flex-col"
          >
            <ProductCard
              product={product}
              initialWishlisted={wishlistedIds.has(product.id)}
              onWishlistChange={onWishlistChange}
            />
          </div>
        ))}
      </div>

      <style>{`
        .carousel-track::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
