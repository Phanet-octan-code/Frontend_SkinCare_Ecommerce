import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Sparkles, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnnouncementBar() {
  const { deliveryThreshold, format } = useCurrency();
  const { t } = useLanguage();

  return (
    <div className="bg-[#1F2520] text-[#DCE2DA] text-[11px] sm:text-xs py-1.5 sm:py-2 border-b border-white/10 select-none">
      <div className="container flex items-center justify-between gap-2 text-center md:text-left">
        {/* Left: Free delivery promotion message */}
        <div className="flex-1 flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[#E4EAE1] min-w-0">
          <Sparkles size={12} className="text-[var(--color-primary-light)] shrink-0" />
          <span className="font-normal tracking-wide truncate sm:whitespace-normal">
            {t('announcement.free_shipping', { threshold: format(deliveryThreshold) })}
          </span>
        </div>

        {/* Right: Track Order Link */}
        <div className="hidden md:flex items-center justify-end shrink-0">
          <Link
            to="/track"
            className="inline-flex items-center gap-1.5 text-[11px] text-[#A6B2A4] hover:text-white transition-colors py-0.5 px-1"
          >
            <HelpCircle size={12} />
            <span>{t('announcement.track_order')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
