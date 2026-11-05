import React from 'react';
import { PackageOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionText,
  actionLink = '/shop',
  onAction,
}) {
  const { t } = useTranslation();

  const displayTitle = title || t('shop.no_products_found');
  const displayDescription = description || t('shop.no_products_found');
  const displayActionText = actionText || t('common.explore_products');

  return (
    <div className="w-full text-center py-12 sm:py-16 px-6 bg-white rounded-3xl border border-[#ECE8DE] shadow-xs my-6 max-w-xl mx-auto">
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-full bg-[#EEF2EB] text-[#71856B] flex items-center justify-center mx-auto mb-5 border border-[#ECE8DE] shadow-2xs">
        <Icon size={28} strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
        {displayTitle}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-sm text-[#5A6358] max-w-md mx-auto mb-6 leading-relaxed">
        {displayDescription}
      </p>

      {/* Action Button */}
      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <span>{displayActionText}</span>
          <ArrowRight size={14} />
        </button>
      ) : actionLink ? (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.98] no-underline"
        >
          <span>{displayActionText}</span>
          <ArrowRight size={14} />
        </Link>
      ) : null}
    </div>
  );
}
