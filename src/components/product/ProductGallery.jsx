import React, { useState, useEffect } from 'react';
import ProductBadge from './ProductBadge';
import { ZoomIn, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export default function ProductGallery({
  mainImage,
  images = [],
  productName,
  hasDiscount = false,
  discountPercent = 0,
  isOutOfStock = false,
  isFeatured = false,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isHoverZooming, setIsHoverZooming] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

  // Images list: strictly respects provided images, does NOT synthesize or mock extra images
  const galleryImages = React.useMemo(() => {
    if (Array.isArray(images)) {
      const validImages = images.filter((img) => typeof img === 'string' && img.trim().length > 0);
      if (validImages.length > 0) {
        return validImages;
      }
    }
    if (mainImage && typeof mainImage === 'string' && mainImage.trim().length > 0) {
      return [mainImage];
    }
    return ['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'];
  }, [mainImage, images]);

  // Keep selectedIndex within bounds
  useEffect(() => {
    if (selectedIndex >= galleryImages.length) {
      setSelectedIndex(0);
    }
  }, [galleryImages.length, selectedIndex]);

  const currentImage = galleryImages[selectedIndex] || galleryImages[0];

  // Handle ESC key to close zoom modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsZoomOpen(false);
    };
    if (isZoomOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isZoomOpen]);

  // Handle mouse move for hover magnifying
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomCoords({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Main Image Box */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-soft)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'zoom-in',
        }}
        onMouseEnter={() => setIsHoverZooming(true)}
        onMouseLeave={() => setIsHoverZooming(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsZoomOpen(true)}
      >
        {/* Badges Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          {hasDiscount && <ProductBadge type="sale" discountPercent={discountPercent} />}
          {isFeatured && !hasDiscount && <ProductBadge type="featured" label="Best Seller" />}
          {isOutOfStock && <ProductBadge type="soldout" label="Sold Out" />}
        </div>

        {/* Zoom Hint Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomOpen(true);
          }}
          className="btn btn-ghost btn-sm"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            borderRadius: 'var(--radius-full)',
            width: '36px',
            height: '36px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-xs)',
            zIndex: 3,
            color: 'var(--color-text-main)',
            border: '1px solid var(--color-border-subtle)',
          }}
          aria-label="Enlarge image"
        >
          <ZoomIn size={16} />
        </button>

        {/* Display Image with Subtle Zoom Hover Effect */}
        <img
          src={currentImage}
          alt={productName}
          loading="eager"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '16px',
            transition: isHoverZooming ? 'none' : 'transform 0.3s ease',
            transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
            transform: isHoverZooming ? 'scale(1.25)' : 'scale(1)',
          }}
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Enlarge Hint Pill on Bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '5px 12px',
            backgroundColor: 'rgba(37, 43, 37, 0.75)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            letterSpacing: '0.04em',
            pointerEvents: 'none',
            opacity: isHoverZooming ? 0 : 0.9,
            transition: 'opacity var(--transition-fast)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <ZoomIn size={12} />
          <span>Click to Enlarge</span>
        </div>
      </div>

      {/* Thumbnails Row - Only render when product has multiple photos (> 1) */}
      {galleryImages.length > 1 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(galleryImages.length, 5)}, 1fr)`,
            gap: '12px',
          }}
        >
          {galleryImages.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={`thumb-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                style={{
                  aspectRatio: '1 / 1',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  border: '2px solid',
                  borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: 'var(--color-surface-soft)',
                  cursor: 'pointer',
                  padding: '2px',
                  position: 'relative',
                  transition: 'all var(--transition-fast)',
                  opacity: isSelected ? 1 : 0.75,
                }}
                aria-label={`View angle ${idx + 1} of ${galleryImages.length}`}
              >
                <img
                  src={img}
                  alt={`${productName} view ${idx + 1}`}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '3px',
                    borderRadius: '2px',
                    backgroundColor: 'var(--color-surface-soft)',
                  }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Enlarged Lightbox Modal */}
      {isZoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsZoomOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 24, 20, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          {/* Modal Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '850px',
              width: '100%',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary)', fontWeight: 600 }}>
                  High-Resolution Inspection
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>
                  {productName}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{
                  borderRadius: 'var(--radius-full)',
                  width: '36px',
                  height: '36px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-main)',
                }}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Large Image Showcase */}
            <div
              style={{
                position: 'relative',
                maxHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FAF9F6',
                overflow: 'hidden',
                padding: '24px',
              }}
            >
              <img
                src={currentImage}
                alt={productName}
                style={{
                  maxWidth: '100%',
                  maxHeight: '65vh',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80';
                }}
              />

              {/* Prev / Next controls - Only rendered if multiple images */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
                    }}
                    className="btn btn-outline"
                    style={{
                      position: 'absolute',
                      left: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      borderRadius: 'var(--radius-full)',
                      width: '42px',
                      height: '42px',
                      padding: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
                    }}
                    className="btn btn-outline"
                    style={{
                      position: 'absolute',
                      right: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      borderRadius: 'var(--radius-full)',
                      width: '42px',
                      height: '42px',
                      padding: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Footer with Thumbnails - Only rendered if multiple images */}
            {galleryImages.length > 1 && (
              <div
                style={{
                  padding: '14px 24px',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                  borderTop: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                }}
              >
                {galleryImages.map((img, idx) => (
                  <button
                    key={`modal-thumb-${idx}`}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: '2px solid',
                      borderColor: selectedIndex === idx ? 'var(--color-primary)' : 'var(--color-border)',
                      padding: '2px',
                      backgroundColor: 'var(--color-surface)',
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '3px',
                        borderRadius: '2px',
                        backgroundColor: 'var(--color-surface-soft)',
                      }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
