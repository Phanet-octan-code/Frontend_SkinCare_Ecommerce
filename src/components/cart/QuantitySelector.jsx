import React from 'react';
import { Plus, Minus } from 'lucide-react';

/**
 * Reusable Quantity Selector Component
 * @param {number} value
 * @param {(val: number) => void} onChange
 * @param {number} min
 * @param {number} max
 * @param {boolean} disabled
 * @param {'sm' | 'md'} size
 */
export default function QuantitySelector({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = 'md',
  className = '',
}) {
  const currentVal = Number(value) || 1;

  const handleDecrease = () => {
    if (currentVal > min && !disabled) {
      onChange(currentVal - 1);
    }
  };

  const handleIncrease = () => {
    if (currentVal < max && !disabled) {
      onChange(currentVal + 1);
    }
  };

  const padding = size === 'sm' ? '4px 8px' : '8px 12px';
  const minWidth = size === 'sm' ? '24px' : '32px';
  const fontSize = size === 'sm' ? '0.82rem' : '0.9rem';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--color-surface)',
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={currentVal <= min || disabled}
        className="transition-transform duration-150 active:scale-90 hover:bg-[#FAF9F5] rounded-l-md cursor-pointer disabled:cursor-not-allowed disabled:active:scale-100"
        style={{
          padding,
          color: currentVal <= min ? 'var(--color-border-hover)' : 'var(--color-text-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color var(--transition-fast)',
        }}
        aria-label="Decrease quantity"
      >
        <Minus size={iconSize} />
      </button>

      <span
        style={{
          minWidth,
          textAlign: 'center',
          fontSize,
          fontWeight: 600,
          color: 'var(--color-text-main)',
          userSelect: 'none',
        }}
      >
        {currentVal}
      </span>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={currentVal >= max || disabled}
        className="transition-transform duration-150 active:scale-90 hover:bg-[#FAF9F5] rounded-r-md cursor-pointer disabled:cursor-not-allowed disabled:active:scale-100"
        style={{
          padding,
          color: currentVal >= max ? 'var(--color-border-hover)' : 'var(--color-text-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color var(--transition-fast)',
        }}
        aria-label="Increase quantity"
      >
        <Plus size={iconSize} />
      </button>
    </div>
  );
}
