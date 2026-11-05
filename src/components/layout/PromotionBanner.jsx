import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, Tag } from 'lucide-react';
import catalogService from '../../services/catalogService';
import { useCurrency } from '../../context/CurrencyContext';
import { useTranslation } from '../../i18n/LanguageContext';

const DISMISS_KEY = 'elixir_dismissed_promo_banner_v1';

export default function PromotionBanner() {
  const { format } = useCurrency();
  const { t } = useTranslation();

  // Initial cached promotions for instant 0ms first render
  const cached = catalogService.getInitialPromotions();
  const [promotions, setPromotions] = useState(() => {
    if (Array.isArray(cached?.data)) {
      const now = new Date();
      return cached.data.filter((p) => !p.end_date || new Date(p.end_date) >= now);
    }
    return [];
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isPaused, setIsPaused] = useState(false);

  // Fetch live active promotions and discounts from the backend API
  useEffect(() => {
    let isMounted = true;
    catalogService
      .getPromotions()
      .then((res) => {
        if (!isMounted) return;
        if (Array.isArray(res?.data) && res.data.length > 0) {
          const now = new Date();
          const active = res.data.filter((p) => !p.end_date || new Date(p.end_date) >= now);
          if (active.length > 0) {
            setPromotions(active);
          }
        }
      })
      .catch((err) => {
        console.warn('Could not load live promotions from API:', err?.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Automatic gentle rotation with cross-fade if multiple promotions exist (pauses on hover)
  useEffect(() => {
    if (promotions.length <= 1 || isPaused || isDismissed) return;

    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % promotions.length);
        setFade(true);
      }, 220);
    }, 6500);

    return () => clearInterval(timer);
  }, [promotions.length, isPaused, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, 'true');
    } catch {
      // Storage unavailable
    }
  };

  // Do not render if explicitly dismissed by user
  if (isDismissed) return null;

  // Curated fallback promotion if database has no active promotions
  const activePromo =
    promotions.length > 0
      ? promotions[currentIndex % promotions.length]
      : {
          id: 'welcome',
          name: 'Grand Opening Celebration — Storewide Clinical Skincare',
          discount_formatted: '10% OFF',
          discount_type: 'percentage',
          discount_value: 10,
        };

  // Format message text elegantly
  const formatPromoMessage = (promo) => {
    if (promo.id === 'welcome') {
      return 'on all evidence-based formulations. Use code WELCOME10 at checkout 🎉';
    }

    if (promo.discount_type === 'fixed') {
      return `off selected dispensary treatments. ${promo.name} 🎉`;
    }

    // Percentage discount
    return `off your clinical skincare order. ${promo.name} 🎉`;
  };

  const promoMessage = formatPromoMessage(activePromo);
  const discountHighlight = activePromo.discount_formatted
    ? `Get ${activePromo.discount_formatted}`
    : 'Special Offer:';

  return (
    <aside
      role="region"
      aria-label="Current Promotion"
      className="w-full bg-transparent py-2 sm:py-3 transition-all duration-300 animate-[fadeIn_0.25s_ease-out]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        <div className="relative flex items-center justify-between gap-3 sm:gap-4 px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#FAF3F6] border border-[#F6D8E2] shadow-[0_1px_3px_rgba(224,86,122,0.06)] hover:border-[#F0C5D3] transition-all">
          {/* Centered Promotional Content Group */}
          <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-[13px] text-[#2D3748] min-w-0 pr-1">
            {/* Pink discount tag icon */}
            <span
              className="text-base sm:text-lg select-none shrink-0"
              role="img"
              aria-label="discount tag"
            >
              🏷️
            </span>

            {/* Promotion message text with smooth cross-fade */}
            <span
              className={`font-normal text-[#2D3748] truncate sm:whitespace-normal transition-opacity duration-200 ${
                fade ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <strong className="font-semibold text-[#1F2520]">
                {discountHighlight}
              </strong>{' '}
              <span className="text-[#4A5568]">{promoMessage}</span>
            </span>

            {/* "Get Started" White Pill Button */}
            <Link
              to="/shop?promotion=1"
              className="inline-flex items-center justify-center px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-[#1F2520] bg-white hover:bg-[#FAF9F5] border border-[#ECE8DE] shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-95 shrink-0 whitespace-nowrap ml-1 sm:ml-2 no-underline group"
            >
              <span>Get Started</span>
              <ArrowRight
                size={12}
                className="ml-1 text-[#E0567A] transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Right Dismiss Button (✕) */}
          <button
            type="button"
            onClick={handleDismiss}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[#8C9388] hover:text-[#1F2520] hover:bg-black/5 transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss promotion banner"
            title="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
