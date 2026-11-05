import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';

/**
 * Reusable Price and Discount Display Component
 * @param {number|string} regularPrice
 * @param {number|string} finalPrice
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} showDiscountBadge
 */
export default function PriceDisplay({
  regularPrice,
  finalPrice,
  size = 'md',
  showDiscountBadge = false,
  className = '',
}) {
  const { format } = useCurrency();

  const numRegular = Number(regularPrice) || 0;
  const numFinal = Number(finalPrice ?? regularPrice) || 0;
  const hasDiscount = numRegular > numFinal;
  const discountPercent = hasDiscount
    ? Math.round(((numRegular - numFinal) / numRegular) * 100)
    : 0;

  // Typography sizing scale
  const sizeStyles = {
    sm: {
      final: { fontSize: '1.02rem', fontWeight: 700, letterSpacing: '-0.01em' },
      regular: { fontSize: '0.82rem', fontWeight: 400 },
    },
    md: {
      final: { fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.01em' },
      regular: { fontSize: '0.86rem' },
    },
    lg: {
      final: { fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em' },
      regular: { fontSize: '1.1rem' },
    },
  }[size] || {
    final: { fontSize: '1.15rem', fontWeight: 700 },
    regular: { fontSize: '0.86rem' },
  };

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: size === 'lg' ? '12px' : '8px',
        flexWrap: 'wrap',
      }}
    >
      <span
        style={{
          color: 'var(--color-text-main)',
          ...sizeStyles.final,
        }}
      >
        {format(numFinal)}
      </span>

      {hasDiscount && (
        <span
          style={{
            color: 'var(--color-text-muted)',
            textDecoration: 'line-through',
            ...sizeStyles.regular,
          }}
        >
          {format(numRegular)}
        </span>
      )}

      {showDiscountBadge && hasDiscount && (
        <span
          className="badge badge-sale"
          style={{ fontSize: '0.7rem', padding: '2px 6px' }}
        >
          Save {discountPercent}%
        </span>
      )}
    </div>
  );
}
