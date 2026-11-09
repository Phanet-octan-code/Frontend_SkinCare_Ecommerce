import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Sparkles, HelpCircle, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnnouncementBar() {
  const { currency, setCurrency, deliveryThreshold, format } = useCurrency();
  const { language, setLanguage, availableLanguages, t } = useLanguage();

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

        {/* Right: Controls & Preferences (Track Order | Currency | Language) */}
        <div className="hidden md:flex items-center justify-end gap-2.5 sm:gap-3 shrink-0">
          {/* Track Order Link */}
          <Link
            to="/track"
            className="inline-flex items-center gap-1.5 text-[11px] text-[#A6B2A4] hover:text-white transition-colors py-0.5 px-1"
          >
            <HelpCircle size={12} />
            <span>{t('announcement.track_order')}</span>
          </Link>

          {/* Divider */}
          <div className="w-px h-3 bg-white/20" />

          {/* Clean Currency Toggle Capsule (USD | KHR) */}
          <div className="inline-flex items-center bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 rounded-full p-0.5 gap-0.5 transition-colors">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-medium transition-all cursor-pointer ${
                currency === 'USD'
                  ? 'bg-[#71856B] text-white shadow-2xs font-semibold'
                  : 'text-[#B4C0B1] hover:text-white'
              }`}
              aria-label="Currency USD"
            >
              USD
            </button>
            <button
              type="button"
              onClick={() => setCurrency('KHR')}
              className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-medium transition-all cursor-pointer ${
                currency === 'KHR'
                  ? 'bg-[#71856B] text-white shadow-2xs font-semibold'
                  : 'text-[#B4C0B1] hover:text-white'
              }`}
              aria-label="Currency KHR"
            >
              KHR
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-3 bg-white/20" />

          {/* Clean Language Switcher Capsule */}
          <div className="inline-flex items-center bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 rounded-full p-0.5 pl-2 gap-1 transition-colors">
            <Globe size={11} className="text-[#8E9C8D] shrink-0" />
            {availableLanguages.map((lang) => {
              const isActive = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  title={lang.nativeName}
                  className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#71856B] text-white shadow-2xs font-semibold'
                      : 'text-[#B4C0B1] hover:text-white'
                  }`}
                  aria-label={`Language ${lang.nativeName}`}
                >
                  {lang.short}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
