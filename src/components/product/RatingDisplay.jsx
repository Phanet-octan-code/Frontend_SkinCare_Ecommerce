import React from 'react';
import { Star } from 'lucide-react';

/**
 * Reusable Rating Display Component
 * @param {number} rating
 * @param {number} reviewCount
 * @param {number} starSize
 * @param {boolean} showCount
 */
export default function RatingDisplay({
  rating = 5,
  reviewCount,
  starSize = 13,
  showCount = true,
  className = '',
}) {
  const numRating = Number(rating) || 5;
  const roundedStars = Math.round(numRating);

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.82rem',
      }}
    >
      <div style={{ display: 'inline-flex', gap: '2px', color: 'var(--color-accent-gold)' }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={starSize}
            fill={s <= roundedStars ? 'var(--color-accent-gold)' : 'none'}
            stroke={s <= roundedStars ? 'var(--color-accent-gold)' : '#D0CAC0'}
            strokeWidth={1.5}
          />
        ))}
      </div>

      <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
        {numRating.toFixed(1)}
      </span>

      {showCount && reviewCount !== undefined && (
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
