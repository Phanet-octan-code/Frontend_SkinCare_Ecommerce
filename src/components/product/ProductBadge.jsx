import React from 'react';
import { useTranslation } from '../../i18n/LanguageContext';

/**
 * Reusable ProductBadge Component
 * @param {'sale' | 'new' | 'featured' | 'soldout' | 'custom'} type
 * @param {string} label
 * @param {number} discountPercent
 */
export default function ProductBadge({ type = 'new', label, discountPercent, className = '' }) {
  const { t } = useTranslation();

  if (type === 'sale') {
    return (
      <span className={`badge badge-sale ${className}`}>
        {discountPercent ? `-${discountPercent}%` : label || t('badge.sale')}
      </span>
    );
  }

  if (type === 'soldout') {
    return (
      <span className={`badge badge-soldout ${className}`}>
        {label || t('badge.sold_out')}
      </span>
    );
  }

  if (type === 'featured') {
    return (
      <span className={`badge badge-featured ${className}`}>
        {label || t('badge.featured')}
      </span>
    );
  }

  if (type === 'new') {
    return (
      <span className={`badge badge-new ${className}`}>
        {label || t('badge.new')}
      </span>
    );
  }

  return (
    <span className={`badge badge-subtle ${className}`}>
      {label}
    </span>
  );
}
