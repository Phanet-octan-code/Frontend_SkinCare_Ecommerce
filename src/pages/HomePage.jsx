import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import catalogService from '../services/catalogService';
import storeService from '../services/storeService';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { useTranslation } from '../i18n/LanguageContext';
import ProductGrid from '../components/product/ProductGrid';
import ProductCarousel from '../components/product/ProductCarousel';
import CategoryCard from '../components/product/CategoryCard';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/feedback/LoadingSkeleton';
import ErrorState from '../components/feedback/ErrorState';
import { resolveImageUrl, handleImageError } from '../utils/imageUrl';
import heroSlide1 from '../assets/hero/hero.png';
import heroSlide2 from '../assets/hero/hero-campaign-old.jpg';
import heroSlide3 from '../assets/hero/hero-products-showcase.jpg';
import brandStoryImg from '../assets/brand-story.jpg';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Sun,
  Sparkle,
  ShieldCheck,
  Heart,
  Truck,
  Lock,
  Headphones,
  CheckCircle2,
  Sparkles,
  X,
  Mail,
  Star,
  Beaker,
  Award,
  Leaf,
  Tag,
  Percent,
  Clock,
  Compass,
} from 'lucide-react';

export default function HomePage() {
  const { format, deliveryThreshold } = useCurrency();
  const { showToast } = useToast();
  const { t } = useTranslation();

  // Initial cached data for instantaneous 0ms first render
  const cachedBestsellers = catalogService.getInitialBestsellers(10);
  const cachedNewArrivals = catalogService.getInitialNewArrivals(10);
  const cachedCategories = catalogService.getInitialCategories();
  const cachedPromotions = catalogService.getInitialPromotions();
  const cachedProducts = catalogService.getInitialProducts({ per_page: 12 });
  const cachedSettings = storeService.getInitialSettings();

  const [bestsellers, setBestsellers] = useState(() => (Array.isArray(cachedBestsellers?.data) ? cachedBestsellers.data : []));
  const [newArrivals, setNewArrivals] = useState(() => (Array.isArray(cachedNewArrivals?.data) ? cachedNewArrivals.data : []));
  const [categories, setCategories] = useState(() => (Array.isArray(cachedCategories?.data) ? cachedCategories.data : []));
  const [promotions, setPromotions] = useState(() => {
    if (Array.isArray(cachedPromotions?.data)) {
      const now = new Date();
      return cachedPromotions.data.filter((p) => !p.end_date || new Date(p.end_date) >= now);
    }
    return [];
  });
  const [catalogProducts, setCatalogProducts] = useState(() => (Array.isArray(cachedProducts?.data) ? cachedProducts.data : []));
  const [storeSettings, setStoreSettings] = useState(() => cachedSettings?.data || null);

  const [loading, setLoading] = useState(() => {
    return bestsellers.length === 0 && newArrivals.length === 0 && catalogProducts.length === 0;
  });
  const [error, setError] = useState(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null); // 'success' | 'error' | null
  const [newsletterMessage, setNewsletterMessage] = useState('');

  // Brand Philosophy Modal
  const [isPhilosophyOpen, setIsPhilosophyOpen] = useState(false);

  // Load all homepage data from live Laravel APIs
  const loadData = useCallback(async () => {
    if (bestsellers.length === 0 && newArrivals.length === 0) {
      setLoading(true);
    }
    setError(null);

    try {
      const [
        bestsellerResult,
        newArrivalResult,
        categoryResult,
        promotionResult,
        catalogResult,
        settingsResult,
      ] = await Promise.allSettled([
        catalogService.getBestsellers(10),
        catalogService.getNewArrivals(10),
        catalogService.getCategories(),
        catalogService.getPromotions(),
        catalogService.getProducts({ per_page: 12 }),
        storeService.getSettings(),
      ]);

      if (bestsellerResult.status === 'fulfilled' && Array.isArray(bestsellerResult.value?.data)) {
        setBestsellers(bestsellerResult.value.data);
      }

      if (newArrivalResult.status === 'fulfilled' && Array.isArray(newArrivalResult.value?.data)) {
        setNewArrivals(newArrivalResult.value.data);
      }

      if (categoryResult.status === 'fulfilled' && Array.isArray(categoryResult.value?.data)) {
        setCategories(categoryResult.value.data);
      }

      if (promotionResult.status === 'fulfilled' && Array.isArray(promotionResult.value?.data)) {
        const now = new Date();
        const activePromos = promotionResult.value.data.filter((p) => {
          if (!p.end_date) return true;
          return new Date(p.end_date) >= now;
        });
        setPromotions(activePromos);
      }

      if (catalogResult.status === 'fulfilled' && Array.isArray(catalogResult.value?.data)) {
        setCatalogProducts(catalogResult.value.data);
      }

      if (settingsResult.status === 'fulfilled' && settingsResult.value?.data) {
        setStoreSettings(settingsResult.value.data);
      }

      const availableCatalog = (catalogResult.status === 'fulfilled' && Array.isArray(catalogResult.value?.data))
        ? catalogResult.value.data
        : catalogProducts;

      if ((!bestsellerResult || bestsellerResult.status !== 'fulfilled' || !bestsellerResult.value?.data?.length) && availableCatalog.length > 0) {
        setBestsellers((prev) => (prev.length > 0 ? prev : availableCatalog.slice(0, 8)));
      }

      if ((!newArrivalResult || newArrivalResult.status !== 'fulfilled' || !newArrivalResult.value?.data?.length) && availableCatalog.length > 0) {
        setNewArrivals((prev) => (prev.length > 0 ? prev : availableCatalog.slice(0, 8)));
      }

      // Check if primary lists failed and we have no catalog data at all
      if (
        bestsellers.length === 0 &&
        newArrivals.length === 0 &&
        availableCatalog.length === 0 &&
        bestsellerResult.status === 'rejected' &&
        catalogResult.status === 'rejected'
      ) {
        setError('Could not connect to the dispensary catalog. Please check your connection.');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Homepage data loading error:', err);
      if (bestsellers.length === 0 && newArrivals.length === 0 && catalogProducts.length === 0) {
        setError(err.userMessage || 'Could not connect to the dispensary catalog.');
      }
    } finally {
      setLoading(false);
    }
  }, [bestsellers.length, newArrivals.length]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Clean customer-facing categories: strictly eliminate test / bulk categories, show ALL active categories in logical skincare regimen order
  const cleanCategories = useMemo(() => {
    const filtered = categories.filter((c) => {
      const upper = (c.name || '').toUpperCase();
      return (
        !upper.includes('TEST') &&
        !upper.includes('BULK') &&
        !upper.includes('DEMO') &&
        !upper.includes('SAMPLE')
      );
    });

    const categoryOrder = [
      'cleanse',
      'toner',
      'exfoli',
      'serum',
      'eye',
      'moistur',
      'mask',
      'sun',
    ];

    const sortFn = (a, b) => {
      const aLower = (a.name || '').toLowerCase();
      const bLower = (b.name || '').toLowerCase();
      const aIdx = categoryOrder.findIndex((k) => aLower.includes(k));
      const bIdx = categoryOrder.findIndex((k) => bLower.includes(k));
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return (a.name || '').localeCompare(b.name || '');
    };

    if (filtered.length > 0) {
      return [...filtered].sort(sortFn);
    }

    const defaults = [
      { id: 1, name: 'Cleansers & Washes', products_count: 3, subtitle: 'Gentle pH Balancing' },
      { id: 2, name: 'Toners & Essences', products_count: 2, subtitle: 'Hydrating Infusion' },
      { id: 6, name: 'Exfoliants & Peels', products_count: 1, subtitle: 'Gentle Dermal Resurfacing' },
      { id: 3, name: 'Serums & Ampoules', products_count: 2, subtitle: 'Concentrated Actives' },
      { id: 7, name: 'Eye & Lip Care', products_count: 1, subtitle: 'Micro-Vascular Hydration' },
      { id: 4, name: 'Moisturizers & Creams', products_count: 2, subtitle: 'Barrier Fortification' },
      { id: 8, name: 'Masks & Treatments', products_count: 1, subtitle: 'Intensive Dermal Care' },
      { id: 5, name: 'Sunscreens & UV Shields', products_count: 1, subtitle: 'Broad Spectrum Defense' },
    ];
    return defaults;
  }, [categories]);

  // Category Carousel Horizontal Scroll State and Handlers
  const categoryScrollRef = useRef(null);
  const [canScrollCatLeft, setCanScrollCatLeft] = useState(false);
  const [canScrollCatRight, setCanScrollCatRight] = useState(true);

  const checkCategoryScroll = useCallback(() => {
    if (!categoryScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
    setCanScrollCatLeft(scrollLeft > 8);
    setCanScrollCatRight(scrollLeft < scrollWidth - clientWidth - 8);
  }, []);

  useEffect(() => {
    const timer = setTimeout(checkCategoryScroll, 100);
    window.addEventListener('resize', checkCategoryScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkCategoryScroll);
    };
  }, [checkCategoryScroll, cleanCategories]);

  const scrollCategories = (direction) => {
    if (!categoryScrollRef.current) return;
    const scrollAmount = 300;
    categoryScrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkCategoryScroll, 350);
  };

  // Derive products that have active discounts or participate in active promotions
  const promotionalProducts = useMemo(() => {
    const combined = [...bestsellers, ...newArrivals, ...catalogProducts];
    const map = new Map();
    for (const item of combined) {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    }

    const unique = Array.from(map.values());
    const discounted = unique.filter((p) => {
      const regular = Number(p.sale_price || p.price || 0);
      const final = Number(p.final_price || p.sale_price || p.price || 0);
      return Boolean(p.has_discount || regular > final || (p.promotion_name && p.promotion_name.trim().length > 0));
    });

    // If active promotional products exist, return them; otherwise return top featured items for the promo showcase
    return discounted.length > 0 ? discounted.slice(0, 8) : unique.slice(0, 4);
  }, [bestsellers, newArrivals, catalogProducts]);

  // Newsletter submission handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setNewsletterStatus(null);
    setNewsletterMessage('');

    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please enter a valid email address.');
      return;
    }

    setNewsletterStatus('success');
    setNewsletterMessage('Welcome to the Élixir Journal. Your VIP confirmation has been recorded.');
    showToast('Subscribed to clinical newsletter!', 'success');
    setNewsletterEmail('');
  };

  // Hero slide state with auto-rotation & pause-on-hover
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  const heroSlides = useMemo(() => [
    {
      id: 'hydration-ritual',
      badge: t('hero.badge') || '100% PURE ACTIVES • CLINICAL DISPENSARY',
      badgeIcon: Droplets,
      titlePart1: t('hero.title_part1') || 'Triple Active Hydration',
      titlePart2: t('hero.title_part2') || 'Pure Botanicals & Dermal Renewal',
      subtitle: t('hero.subtitle') || 'A clinical master ritual featuring gentle pH 5.5 Cleanser, concentrated Hydrating Serum dropper, and deep moisture barrier cream formulated for 24-hour cellular replenishment.',
      image: heroSlide1,
      ctaPrimary: t('hero.cta_primary') || 'Shop The Ritual',
      ctaSecondary: t('hero.cta_secondary') || 'Clinical Consultation',
      pillTitle: t('hero.pill_slide1') || '01 Hydration Trio',
      accentColor: '#34D399',
      features: [
        t('hero.feature_hydration') || 'Deep Hydration',
        t('hero.feature_barrier') || 'Barrier Fortification',
        t('hero.feature_ph') || 'pH 5.5 Balanced',
      ],
      specimen: {
        title: t('hero.slide1_title') || 'Deep Moisture Complex',
        subtitle: t('hero.slide1_subtitle') || 'Cleanser • Serum • Barrier Cream',
        rating: '4.9/5',
        reviews: t('hero.verified_reviews') || '1,240+ verified reviews',
        badge: t('hero.slide1_badge') || '100% LAB VERIFIED',
      },
    },
    {
      id: 'cellular-renewal',
      badge: t('hero.slide2_badge') || 'CLINICAL DERMATOLOGY • BOTANICAL ESSENCE',
      badgeIcon: Sparkles,
      titlePart1: t('hero.slide2_title1') || 'Science-Led Skincare for',
      titlePart2: t('hero.slide2_title2') || 'Luminous, Resilient Skin',
      subtitle: t('hero.slide2_subtitle') || 'Curated pharmaceutical-grade formulations, active botanicals, and personalized dermatological regimens tested for clinical biocompatibility.',
      image: heroSlide2,
      ctaPrimary: t('hero.slide2_cta') || 'Explore Formulations',
      ctaSecondary: t('hero.cta_secondary') || 'Explore Collection',
      pillTitle: t('hero.pill_slide2') || '02 Cellular Renewal',
      accentColor: '#71856B',
      features: [
        t('hero.slide2_f1') || 'Cellular Renewal',
        t('hero.slide2_f2') || 'Anti-Oxidant Shield',
        t('hero.slide2_f3') || 'Biocompatible',
      ],
      specimen: {
        title: bestsellers[0]?.name || t('hero.slide2_specimen_title') || 'Aethel Active Crème',
        subtitle: bestsellers[0]?.category?.name || t('hero.slide2_specimen_subtitle') || 'Bio-Lipid Botanical Infusion',
        rating: '5.0/5',
        reviews: t('hero.slide2_reviews') || '890+ verified reviews',
        badge: t('hero.slide2_specimen_badge') || 'CLINICAL AWARD',
      },
    },
    {
      id: 'botanical-alchemy',
      badge: t('hero.slide3_badge') || 'STABILIZED BIO-ACTIVES • LIGHT-PROTECTED GLASS',
      badgeIcon: Leaf,
      titlePart1: t('hero.slide3_title1') || 'Clinical Active Potency',
      titlePart2: t('hero.slide3_title2') || 'Hand-Dispensed Purity',
      subtitle: t('hero.slide3_subtitle') || 'Cold-chain dispensed serums, restorative emulsions, and gentle botanical extracts engineered to illuminate the dermal mantle without irritation.',
      image: heroSlide3,
      ctaPrimary: t('hero.slide3_cta') || 'View Dispensary Catalog',
      ctaSecondary: t('hero.cta_secondary') || 'Our Philosophy',
      pillTitle: t('hero.pill_slide3') || '03 Pure Actives',
      accentColor: '#C29B38',
      features: [
        t('hero.slide3_f1') || 'Cold-Chain Handled',
        t('hero.slide3_f2') || 'Stabilized Actives',
        t('hero.slide3_f3') || 'Zero Additives',
      ],
      specimen: {
        title: bestsellers[1]?.name || t('hero.slide3_specimen_title') || 'Botanical Elixirs',
        subtitle: bestsellers[1]?.category?.name || t('hero.slide3_specimen_subtitle') || 'Vitamin C + Niacinamide 10%',
        rating: '4.95/5',
        reviews: t('hero.slide3_reviews') || '2,100+ verified reviews',
        badge: t('hero.slide3_specimen_badge') || 'BEST SELLER',
      },
    },
  ], [t, bestsellers]);

  useEffect(() => {
    if (isHeroHovered) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isHeroHovered, heroSlides.length]);

  const currentHero = heroSlides[activeSlide] || heroSlides[0];

  return (
    <div className="bg-[#FAF9F5] text-[var(--color-text-main)]">
      {/* ─── SECTION 3: HERO BANNER (EDITORIAL BOTANICAL & CLINICAL LUXURY) ─── */}
      <section className="relative bg-[#FAF9F5] py-10 sm:py-14 md:py-18 lg:py-20 overflow-hidden">
        {/* Subtle luminous ambient backdrop */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[540px] h-[540px] bg-white/80 rounded-none blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-[#EEF2EB]/60 rounded-none blur-3xl pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center justify-between">
            {/* Left Column: Eyebrow, 2-line Heading, Description, Benefits, CTA Buttons, Slide Switcher */}
            <div className="lg:col-span-7 xl:col-span-6 max-w-xl lg:max-w-2xl flex flex-col items-start text-left">
              {/* Eyebrow Tagline Badge (Borderless, Natural Soft Shadow) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-[#EEF2EB] text-[#4A5D45] text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase mb-4 sm:mb-5 shadow-xs transition-all duration-300">
                <currentHero.badgeIcon size={13} className="text-[#596D54] shrink-0 animate-pulse" />
                <span>{currentHero.badge}</span>
              </div>

              {/* Main Heading (Guaranteed 2 Clean Lines: Line 1 Black Serif, Line 2 Italic Sage Green) */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.85rem] lg:text-[3.25rem] xl:text-[3.6rem] font-normal text-[#1F2520] leading-[1.14] tracking-[-0.02em] mb-4 sm:mb-5 transition-all duration-300">
                <span className="block">{currentHero.titlePart1}</span>
                <span className="block italic font-serif text-[#546A50] mt-1 sm:mt-1.5">
                  {currentHero.titlePart2}
                </span>
              </h1>

              {/* Subtitle Description */}
              <p className="text-sm sm:text-base lg:text-[1.02rem] text-[#5A6358] leading-relaxed mb-5 sm:mb-6 max-w-lg font-normal transition-all duration-300">
                {currentHero.subtitle}
              </p>

              {/* Key Benefits Pill Row (Borderless, Clean Shadow) */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-6 sm:mb-7">
                {currentHero.features.map((feat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none bg-white text-[#3E4A3B] text-[11px] sm:text-xs font-semibold shadow-[0_2px_8px_rgba(31,37,32,0.06)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <CheckCircle2 size={13} className="text-[#388E3C] shrink-0" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto mb-7 sm:mb-9">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-none text-xs font-bold tracking-wider uppercase bg-[#1F2520] hover:bg-[#2C382D] text-white shadow-[0_10px_25px_rgba(31,37,32,0.25)] hover:shadow-[0_14px_30px_rgba(31,37,32,0.35)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer no-underline group"
                  style={{ backgroundColor: '#1F2520', color: '#FFFFFF' }}
                >
                  <span>{currentHero.ctaPrimary}</span>
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsPhilosophyOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-none text-xs font-bold tracking-wider uppercase text-[#1F2520] bg-white hover:bg-[#FAF9F5] shadow-[0_4px_16px_rgba(31,37,32,0.07)] hover:shadow-[0_6px_20px_rgba(31,37,32,0.12)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                  style={{ backgroundColor: '#FFFFFF', color: '#1F2520' }}
                >
                  <span>{currentHero.ctaSecondary}</span>
                </button>
              </div>

              {/* Slide Switcher Controls (Borderless, Organic Soft Shadows) */}
              <div className="flex items-center gap-3 sm:gap-4 w-full pt-2">
                {/* Slide Navigation Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                    className="w-8 h-8 rounded-none bg-white text-[#1F2520] flex items-center justify-center shadow-[0_2px_10px_rgba(31,37,32,0.08)] hover:shadow-[0_4px_14px_rgba(31,37,32,0.14)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
                    className="w-8 h-8 rounded-none bg-white text-[#1F2520] flex items-center justify-center shadow-[0_2px_10px_rgba(31,37,32,0.08)] hover:shadow-[0_4px_14px_rgba(31,37,32,0.14)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>

                {/* Slide Indicator Tabs */}
                <div className="flex items-center gap-2 flex-wrap">
                  {heroSlides.map((slide, idx) => {
                    const isActive = activeSlide === idx;
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setActiveSlide(idx)}
                        className={`px-3.5 py-1.5 rounded-none text-[11px] sm:text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-[#1F2520] text-white shadow-[0_4px_12px_rgba(31,37,32,0.2)] scale-100'
                            : 'bg-white text-[#5A6358] shadow-[0_2px_8px_rgba(31,37,32,0.05)] hover:bg-white hover:text-[#1F2520] hover:shadow-[0_4px_12px_rgba(31,37,32,0.1)]'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 ${isActive ? 'bg-[#34D399] animate-pulse' : 'bg-[#C5BFA9]'}`} />
                        <span>{slide.pillTitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Hero Product Visual (No Border and No Border-Radius - Clean Square Architectural Aesthetic) */}
            <div className="lg:col-span-5 xl:col-span-6 w-full flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
              <div
                className="relative w-full max-w-[540px] lg:max-w-[620px] xl:max-w-[680px] 2xl:max-w-[720px] group/hero"
                onMouseEnter={() => setIsHeroHovered(true)}
                onMouseLeave={() => setIsHeroHovered(false)}
              >
                {/* Animated Emerald & Aquamarine Glow Backdrop */}
                <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-tr from-[#71856B]/20 via-[#34D399]/15 to-[#38BDF8]/10 rounded-none blur-3xl opacity-70 group-hover/hero:opacity-90 transition-opacity duration-700 pointer-events-none" />

                {/* Main Luxury Frame - Light Botanical Studio Aesthetic (No Black Background) */}
                <div className="relative w-full aspect-[3/2] sm:aspect-[1.38/1] rounded-none overflow-hidden bg-gradient-to-br from-[#EDF3EC] via-[#F6F8F5] to-[#E3EDE1] shadow-[0_25px_60px_-15px_rgba(71,85,69,0.15),0_10px_25px_-5px_rgba(31,37,32,0.05)] transition-all duration-500 group-hover/hero:shadow-[0_35px_75px_-15px_rgba(71,85,69,0.22),0_15px_30px_-5px_rgba(31,37,32,0.08)] group-hover/hero:-translate-y-1 flex items-center justify-center">
                  
                  {/* Background Slides with smooth crossfade */}
                  {heroSlides.map((slide, idx) => {
                    const isActive = activeSlide === idx;
                    return (
                      <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out rounded-none flex items-center justify-center ${
                          isActive ? 'opacity-100 z-1 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                      >
                        <img
                          src={slide.image}
                          alt={slide.titlePart1}
                          loading="eager"
                          className="w-full h-full object-contain sm:object-cover object-center rounded-none scale-[1.01] group-hover/hero:scale-[1.04] transition-transform duration-700 ease-out"
                          onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80')}
                        />
                        {/* Subtle Glass Shimmer Sweep Animation */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none animate-hero-shimmer rounded-none" />
                      </div>
                    );
                  })}

                  {/* Floating Pill Top-Right: 100% Lab Verified (Luxury White Frosted Glass) */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 animate-hero-badge-1 pointer-events-none">
                    <div className="px-3.5 sm:px-4 py-2 rounded-none bg-white/95 backdrop-blur-md text-[#1F2520] border border-[#ECE8DE] shadow-[0_10px_25px_rgba(31,37,32,0.08)] flex items-center gap-2.5">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full bg-[#10B981] opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 bg-[#059669]" />
                      </span>
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-[#059669]">
                          {currentHero.specimen.badge}
                        </span>
                        <span className="text-[11px] sm:text-xs font-medium text-[#1F2520]">
                          {t('hero.dermatologist_tested') || 'Dermatologist Tested'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Glass Specimen Card Bottom-Left (Luxury White Frosted Glass) */}
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 max-w-[290px] animate-hero-badge-2 pointer-events-none">
                    <div className="p-3 sm:p-3.5 rounded-none bg-white/95 backdrop-blur-md text-[#1F2520] border border-[#ECE8DE] shadow-[0_16px_36px_rgba(31,37,32,0.1)] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-none bg-[#EEF2EB] text-[#059669] flex items-center justify-center shrink-0 shadow-inner">
                        <Droplets size={20} className="animate-bounce" style={{ animationDuration: '3s' }} />
                      </div>
                      <div className="min-w-0 pr-1 text-left">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10.5px] uppercase tracking-[0.14em] font-bold text-[#059669] block truncate">
                            {currentHero.specimen.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5A6358] font-normal truncate mb-1">
                          {currentHero.specimen.subtitle}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-[#F59E0B]">
                          <span>★★★★★</span>
                          <span className="text-[#7A8578] font-medium ml-1">
                            {currentHero.specimen.reviews}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Tag Bottom-Right (Luxury White Frosted Glass) */}
                  <div className="hidden sm:flex absolute bottom-6 right-6 z-10 items-center gap-1.5 px-3.5 py-1.5 rounded-none bg-white/92 backdrop-blur-md text-[#059669] border border-[#ECE8DE] text-[10px] font-semibold tracking-wider uppercase shadow-[0_6px_16px_rgba(31,37,32,0.06)] pointer-events-none">
                    <ShieldCheck size={13} className="text-[#059669]" />
                    <span className="text-[#1F2520] font-semibold">{t('hero.barrier_lock') || '24H Barrier Lock'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: BRAND TRUST AND SERVICE PILLARS (CLEAN FOUR-PILLAR ROW) ─── */}
      <section className="bg-white border-b border-[#ECE8DE] py-6 sm:py-7 relative z-10 shadow-[0_1px_3px_rgba(31,37,32,0.02)]">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-transparent lg:divide-[#ECE8DE]/60">
            {/* Pillar 1 */}
            <div className="flex items-center gap-3.5 px-2 lg:px-4">
              <div className="w-10 h-10 rounded-full bg-[#EEF2EB] text-[#71856B] flex items-center justify-center shrink-0 shadow-2xs">
                <Leaf size={18} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#1F2520] mb-0.5 truncate">
                  {t('pillars.genuine_title') || '100% Genuine Lab Verified'}
                </h4>
                <p className="text-[11px] sm:text-xs text-[#5A6358] truncate">
                  {t('pillars.genuine_desc') || 'Pure & Natural Ingredients'}
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-center gap-3.5 px-2 lg:px-4">
              <div className="w-10 h-10 rounded-full bg-[#EEF2EB] text-[#71856B] flex items-center justify-center shrink-0 shadow-2xs">
                <Beaker size={18} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#1F2520] mb-0.5 truncate">
                  No Harmful Additives
                </h4>
                <p className="text-[11px] sm:text-xs text-[#5A6358] truncate">
                  Safe For You & Your Skin
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-center gap-3.5 px-2 lg:px-4">
              <div className="w-10 h-10 rounded-full bg-[#EEF2EB] text-[#71856B] flex items-center justify-center shrink-0 shadow-2xs">
                <Award size={18} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#1F2520] mb-0.5 truncate">
                  Cold-Chain Handled
                </h4>
                <p className="text-[11px] sm:text-xs text-[#5A6358] truncate">
                  Good For You, Good For Earth
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex items-center gap-3.5 px-2 lg:px-4">
              <div className="w-10 h-10 rounded-full bg-[#EEF2EB] text-[#71856B] flex items-center justify-center shrink-0 shadow-2xs">
                <Truck size={18} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#1F2520] mb-0.5 truncate">
                  {t('pillars.shipping_title') || 'Complimentary Delivery'}
                </h4>
                <p className="text-[11px] sm:text-xs text-[#5A6358] truncate">
                  {t('pillars.shipping_desc', { threshold: format(deliveryThreshold) }) || 'On all orders over $50'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: SHOP BY CATEGORY (HORIZONTAL SCROLLABLE CAROUSEL WITH FORWARD/BACK CONTROLS) ─── */}
      <section className="py-12 sm:py-16 md:py-20 border-b border-[#ECE8DE] bg-[#FAF9F5] relative overflow-hidden">
        <div className="container relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div className="text-left max-w-xl">
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold tracking-wider uppercase text-[#1F2520] mb-2">
                {t('home.shop_by_category') || 'SHOP BY CATEGORY'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5A6358] leading-relaxed m-0">
                {t('home.shop_by_category_desc') || 'Explore specialized active solutions formulated to treat specific skin concerns.'}
              </p>
            </div>

            {/* Forward / Backward Scroll Controls */}
            <div className="flex items-center gap-2 self-start sm:self-end shrink-0">
              <button
                type="button"
                onClick={() => scrollCategories('left')}
                disabled={!canScrollCatLeft}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  canScrollCatLeft
                    ? 'border-[#1F2520]/25 text-[#1F2520] bg-white hover:bg-[#1F2520] hover:text-white shadow-2xs hover:shadow-xs'
                    : 'border-[#ECE8DE] text-gray-300 bg-white/50 cursor-not-allowed opacity-40'
                }`}
                aria-label="Previous categories"
                title="Scroll categories backward"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollCategories('right')}
                disabled={!canScrollCatRight}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  canScrollCatRight
                    ? 'border-[#1F2520] text-white bg-[#1F2520] hover:bg-[#2F3A31] shadow-2xs hover:shadow-xs'
                    : 'border-[#ECE8DE] text-gray-300 bg-white/50 cursor-not-allowed opacity-40'
                }`}
                aria-label="Next categories (Forward)"
                title="Scroll categories forward"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Smooth Horizontal Track with Left & Right Gradient Edge Fades */}
          <div className="relative">
            {canScrollCatLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[#FAF9F5] to-transparent pointer-events-none z-10 transition-opacity duration-300" />
            )}

            {canScrollCatRight && (
              <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#FAF9F5] to-transparent pointer-events-none z-10 transition-opacity duration-300" />
            )}

            <div
              ref={categoryScrollRef}
              onScroll={checkCategoryScroll}
              className="flex items-start gap-5 sm:gap-6 lg:gap-8 overflow-x-auto scroll-smooth py-3 px-1 select-none"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {cleanCategories.map((cat, idx) => (
                <div
                  key={cat.id || idx}
                  className="shrink-0 w-28 sm:w-32 lg:w-36 flex flex-col items-center"
                >
                  <CategoryCard category={cat} index={idx} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: BEST SELLERS SECTION (6 CLEAN MINIMALIST CARDS) ─── */}
      <section className="py-12 sm:py-16 md:py-18 bg-white border-b border-[#ECE8DE]">
        <div className="container">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div>
              <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-semibold tracking-wider uppercase text-[#1F2520] m-0">
                {t('home.best_selling_formulas') || 'BEST SELLERS'}
              </h2>
            </div>
            <Link
              to="/shop?filter=popular"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#1F2520] hover:text-[#71856B] transition-colors"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading && bestsellers.length === 0 && catalogProducts.length === 0 ? (
            <ProductGridSkeleton count={10} columns={5} />
          ) : error && bestsellers.length === 0 && catalogProducts.length === 0 ? (
            <ErrorState message={error} onRetry={loadData} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
              {(bestsellers.length > 0 ? bestsellers : catalogProducts).slice(0, 10).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── SECTION 7: NEW ARRIVALS (LATEST DISPENSARY RELEASES) ─── */}
      <section className="py-14 sm:py-18 md:py-20 border-b border-[#ECE8DE] bg-[#FAF9F5]">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 gap-4">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#71856B] block mb-2">
                Fresh Laboratory Batches
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1F2520] m-0">
                New Arrivals & Active Releases
              </h2>
            </div>
            <Link
              to="/shop?sort=newest"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#71856B] hover:text-[#596D54] transition-colors"
            >
              <span>View All New Formulations</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading && newArrivals.length === 0 ? (
            <ProductGridSkeleton count={10} columns={5} />
          ) : (
            <ProductGrid
              products={newArrivals.length > 0 ? newArrivals.slice(0, 10) : catalogProducts.slice(0, 10)}
              columns={5}
            />
          )}
        </div>
      </section>

      {/* ─── SECTION 8: DUAL SPLIT PROMOTIONAL BANNERS & EXCLUSIVE REWARDS ─── */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF9F5] border-b border-[#ECE8DE] relative overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Card 1: 20% OFF SITEWIDE Promo */}
            <div className="relative rounded-[24px] sm:rounded-[28px] bg-[#F7F5EE] border border-[#ECE8DE] p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300">
              {/* Left Text */}
              <div className="flex-1 text-left z-10">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#71856B] block mb-2 sm:mb-2.5">
                  {promotions[0]?.discount_formatted ? 'ACTIVE PROMOTION' : 'LIMITED TIME OFFER'}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-[2rem] font-medium text-[#1F2520] leading-tight mb-2">
                  {promotions[0]?.discount_formatted || '20% OFF SITEWIDE'}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#5A6358] mb-1 font-mono">
                  Use code: <span className="font-bold text-[#1F2520]">{promotions[0]?.name?.toUpperCase().replace(/\s+/g, '') || 'BOTANIQUE20'}</span>
                </p>
                <p className="text-[11px] sm:text-xs text-[#71856B] mb-6 line-clamp-1">
                  {promotions[0]?.description || 'Curated clinical skincare formulas & active botanicals.'}
                </p>
                <Link
                  to="/shop?promotion=1"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1F2520] hover:bg-[#2F3A31] text-white shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-95 cursor-pointer no-underline"
                >
                  <span>SHOP THE OFFER</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {/* Right Image Composition */}
              <div className="w-40 sm:w-48 lg:w-52 h-40 sm:h-48 rounded-2xl overflow-hidden bg-white/70 border border-[#ECE8DE] shadow-xs shrink-0 flex items-center justify-center p-2 transition-transform duration-500 hover:scale-105">
                <img
                  src={heroSlide3}
                  alt="Botanique Promotion"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80')}
                />
              </div>
            </div>

            {/* Card 2: JOIN ÉLIXIR REWARDS VIP Card */}
            <div className="relative rounded-[24px] sm:rounded-[28px] bg-[#F7F5EE] border border-[#ECE8DE] p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300">
              {/* Left Text */}
              <div className="flex-1 text-left z-10">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#71856B] block mb-2 sm:mb-2.5">
                  JOIN ÉLIXIR REWARDS
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-[2rem] font-medium text-[#1F2520] leading-tight mb-2">
                  EARN POINTS.<br />GET REWARDED.
                </h3>
                <p className="text-xs sm:text-[13px] text-[#5A6358] mb-6 max-w-xs leading-relaxed">
                  Earn points on every order and enjoy exclusive dispensary privileges and gifts.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1F2520] hover:bg-[#2F3A31] text-white shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-95 cursor-pointer no-underline"
                >
                  <span>JOIN NOW</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {/* Right VIP Card Graphic */}
              <div className="relative w-44 sm:w-48 lg:w-52 h-28 sm:h-32 rounded-2xl bg-gradient-to-br from-[#1E2E21] via-[#263A2B] to-[#121B14] text-[#F3EFE6] p-4 shadow-[0_12px_28px_rgba(31,37,32,0.22)] border border-[#485E48]/50 transform rotate-3 hover:rotate-0 transition-transform duration-300 flex flex-col justify-between shrink-0 select-none">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5">
                    <Leaf size={14} className="text-[#A3B89E]" />
                    <span className="font-serif text-[11px] tracking-wider uppercase font-semibold text-[#E5E0D4]">
                      Élixir Botanique
                    </span>
                  </div>
                  <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-[#A3B89E] px-1.5 py-0.5 rounded-full bg-white/10 border border-white/15">
                    VIP
                  </span>
                </div>
                <div className="z-10">
                  <span className="block text-[8px] tracking-[0.2em] uppercase text-[#8C9E89] mb-0.5 font-sans">
                    DISPENSARY REWARDS
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-white/90">
                    •••• •••• •••• 8892
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Promotional Qualifying Products Row */}
          {promotionalProducts.length > 0 && (
            <div className="mt-12 sm:mt-14">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#71856B] block mb-1">
                    Special Dispensary Offers
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-[#1F2520] m-0">
                    Qualifying Clinical Formulations
                  </h3>
                </div>
                <Link
                  to="/shop?promotion=1"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#1F2520] hover:text-[#71856B] transition-colors"
                >
                  <span>View All Offers</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
                {promotionalProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── SECTION 9: DAILY 4-STEP SKINCARE REGIMEN GUIDE & DERMAL TAXONOMY ─── */}
      <section className="py-14 sm:py-18 md:py-22 bg-white border-b border-[#ECE8DE]">
        <div className="container">
          {/* Sub-Section 9A: 4-Step Regimen Flow */}
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#71856B] block mb-2">
              Dermatological Method
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1F2520] mb-3">
              The Daily 4-Step Clinical Regimen
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Achieve cellular balance and barrier resilience through our structured dispensary sequence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16">
            {/* Step 1 */}
            <Link
              to="/shop?search=cleanse"
              className="group p-6 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] hover:bg-white hover:border-[#71856B]/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-widest text-[#71856B] font-mono">
                    STEP 01
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ECE8DE] text-[#71856B] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Droplets size={17} />
                  </div>
                </div>
                <h3 className="font-serif text-base font-medium text-[#1F2520] mb-1.5 group-hover:text-[#71856B] transition-colors">
                  Purify & pH Balance
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                  Gentle low-foam cleansing clears particulate pollutants without disrupting stratum corneum lipids.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#71856B] inline-flex items-center gap-1">
                Explore Cleansers <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Step 2 */}
            <Link
              to="/shop?search=toner"
              className="group p-6 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] hover:bg-white hover:border-[#71856B]/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-widest text-[#71856B] font-mono">
                    STEP 02
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ECE8DE] text-[#71856B] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkle size={17} />
                  </div>
                </div>
                <h3 className="font-serif text-base font-medium text-[#1F2520] mb-1.5 group-hover:text-[#71856B] transition-colors">
                  Infuse & Prime
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                  Botanical essences and micro-toners replenish bio-water to maximize downstream active bioavailability.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#71856B] inline-flex items-center gap-1">
                Explore Toners <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Step 3 */}
            <Link
              to="/shop?search=serum"
              className="group p-6 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] hover:bg-white hover:border-[#71856B]/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-widest text-[#71856B] font-mono">
                    STEP 03
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ECE8DE] text-[#71856B] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Beaker size={17} />
                  </div>
                </div>
                <h3 className="font-serif text-base font-medium text-[#1F2520] mb-1.5 group-hover:text-[#71856B] transition-colors">
                  Target & Correct
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                  High-potency clinical serums deliver calibrated actives (niacinamide, peptides, Vitamin C) straight to target cells.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#71856B] inline-flex items-center gap-1">
                Explore Serums <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Step 4 */}
            <Link
              to="/shop?search=cream"
              className="group p-6 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] hover:bg-white hover:border-[#71856B]/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-widest text-[#71856B] font-mono">
                    STEP 04
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ECE8DE] text-[#71856B] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck size={17} />
                  </div>
                </div>
                <h3 className="font-serif text-base font-medium text-[#1F2520] mb-1.5 group-hover:text-[#71856B] transition-colors">
                  Seal & Defend
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                  Rich lipid barrier crèmes lock in moisture, followed by broad-spectrum UVA/UVB mineral defense.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#71856B] inline-flex items-center gap-1">
                Explore Moisturizers <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Sub-Section 9B: Shop by Skin Concern */}
          <div className="pt-8 border-t border-[#ECE8DE]">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#71856B] block mb-2">
                Dermatological Prescription
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1F2520] mb-2">
                Shop by Skin Concern
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Concern 1 */}
              <Link
                to="/shop?search=hyaluronic"
                className="group p-5 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] hover:bg-white hover:border-[#71856B]/60 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ECE8DE] text-[#71856B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Droplets size={18} />
                  </div>
                  <h3 className="font-serif text-sm font-medium text-[#1F2520] mb-1 group-hover:text-[#71856B] transition-colors">
                    Hydration & Barrier
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed mb-3">
                    Multi-weight hyaluronic acid, ceramides, and squalane for compromised skin.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#71856B]">
                  Explore Regimen <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              {/* Concern 2 */}
              <Link
                to="/shop?search=peptides"
                className="group p-5 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] hover:bg-white hover:border-[#71856B]/60 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ECE8DE] text-[#71856B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="font-serif text-sm font-medium text-[#1F2520] mb-1 group-hover:text-[#71856B] transition-colors">
                    Anti-Aging & Firming
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed mb-3">
                    Matrixyl peptides, bio-retinol, and cold-pressed botanical lipids for collagen.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#71856B]">
                  Explore Regimen <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              {/* Concern 3 */}
              <Link
                to="/shop?search=bha"
                className="group p-5 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] hover:bg-white hover:border-[#71856B]/60 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ECE8DE] text-[#71856B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="font-serif text-sm font-medium text-[#1F2520] mb-1 group-hover:text-[#71856B] transition-colors">
                    Blemish & Clarifying
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed mb-3">
                    Salicylic acid 2%, niacinamide 10%, and zinc to decongest pores.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#71856B]">
                  Explore Regimen <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              {/* Concern 4 */}
              <Link
                to="/shop?search=vitamin%20c"
                className="group p-5 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] hover:bg-white hover:border-[#71856B]/60 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ECE8DE] text-[#71856B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Sun size={18} />
                  </div>
                  <h3 className="font-serif text-sm font-medium text-[#1F2520] mb-1 group-hover:text-[#71856B] transition-colors">
                    Radiance & Dark Spots
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed mb-3">
                    Stabilized L-ascorbic acid 15% and azelaic acid to unify dermal tone.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#71856B]">
                  Explore Regimen <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              {/* Concern 5 */}
              <Link
                to="/shop?search=centella"
                className="group p-5 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] hover:bg-white hover:border-[#71856B]/60 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ECE8DE] text-[#71856B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Heart size={18} />
                  </div>
                  <h3 className="font-serif text-sm font-medium text-[#1F2520] mb-1 group-hover:text-[#71856B] transition-colors">
                    Calming & Redness
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed mb-3">
                    Centella asiatica, panthenol B5, and bisabolol to soothe vascular reactivity.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#71856B]">
                  Explore Regimen <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 10: BRAND STORY & FORMULATION STANDARD (EDITORIAL HARMONY) ─── */}
      <section className="py-14 sm:py-18 md:py-24 bg-[#FAF9F5] border-b border-[#ECE8DE]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Story Imagery with Frosted Badge */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] border border-[#ECE8DE] shadow-sm">
                <img
                  src={brandStoryImg}
                  alt="Élixir Botanique Formulation Laboratory"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80')}
                />
              </div>

              {/* Floating frosted glass badge */}
              <div className="hidden sm:flex items-center gap-3 absolute bottom-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#ECE8DE] shadow-lg max-w-xs">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <Leaf size={18} />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-semibold text-[#1F2520]">100% Organic Extracts</span>
                  <span className="block text-[11px] text-[var(--color-text-muted)]">Laboratory verified biocompatibility</span>
                </div>
              </div>
            </div>

            {/* Story Narrative */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#71856B] block mb-2.5">
                Our Formulation Standard
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1F2520] leading-tight mb-4">
                Formulated Without Compromise. Tested for Real Clinical Efficacy.
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed mb-4">
                At Élixir Botanique, we reject the notion that skincare must choose between physiological biocompatibility and high-potency clinical results. Our botanical extracts are harvested in their most bioavailable states, then precisely calibrated alongside verified clinical actives.
              </p>
              <p className="text-xs sm:text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed mb-6">
                Every formulation in our dispensary is 100% free from synthetic dyes, micro-plastics, parabens, and denatured drying alcohols.
              </p>

              {/* Trust Pillars Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-7">
                <div className="p-3 rounded-xl bg-white border border-[#ECE8DE] text-center shadow-2xs">
                  <span className="block text-xs font-semibold text-[#1F2520] mb-0.5">🌿 100% Organic</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">Clean Botanicals</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#ECE8DE] text-center shadow-2xs">
                  <span className="block text-xs font-semibold text-[#1F2520] mb-0.5">🔬 Dermatologist</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">Approved & Tested</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#ECE8DE] text-center shadow-2xs">
                  <span className="block text-xs font-semibold text-[#1F2520] mb-0.5">🐰 Cruelty-Free</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">Sustainably Crafted</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPhilosophyOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-medium text-[#1F2520] bg-white hover:bg-[#FAF9F5] border border-[#ECE8DE] hover:border-[#71856B]/60 shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
              >
                <span>Read Our Formulation Pledge</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS & CLINICAL PROOF ─── */}
      <section className="py-14 sm:py-18 md:py-20 border-b border-[#ECE8DE] bg-white">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#71856B] block mb-2">
              Dermatological Proof
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1F2520] mb-3">
              Clinical Results & Real Reviews
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Verified experiences from our dispensary patrons and skincare clinic members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Review 1 */}
            <div className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#C29B38] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-current text-[#C29B38]" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#1F2520] leading-relaxed italic mb-5">
                  "The Niacinamide 10% restored my skin barrier within two weeks. My chronic redness is completely calm, and my complexion has never felt this balanced."
                </p>
              </div>
              <div className="pt-3 border-t border-[#ECE8DE] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#1F2520]">Camille L.</h4>
                  <span className="text-[10px] text-[#71856B]">Verified Buyer • Sensitive Skin</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] font-medium">
                  Verified
                </span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#C29B38] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-current text-[#C29B38]" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#1F2520] leading-relaxed italic mb-5">
                  "Pharmaceutical grade results without any stinging. The Torriden hyaluronic serum is pure silk on the skin and deeply plumping under moisturizer."
                </p>
              </div>
              <div className="pt-3 border-t border-[#ECE8DE] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#1F2520]">Dr. Elena S.</h4>
                  <span className="text-[10px] text-[#71856B]">Dermatology Consultant • Dry Skin</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] font-medium">
                  Verified
                </span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#C29B38] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-current text-[#C29B38]" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#1F2520] leading-relaxed italic mb-5">
                  "Finally an ecommerce dispensary that delivers real authentic clinical skincare with same-day cold-packed delivery. The batch tracking gives complete peace of mind."
                </p>
              </div>
              <div className="pt-3 border-t border-[#ECE8DE] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#1F2520]">Sophea M.</h4>
                  <span className="text-[10px] text-[#71856B]">Dispensary Member • Combination</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] font-medium">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 11: VALIDATED NEWSLETTER SUBSCRIPTION (LUXURY DISPENSARY JOURNAL) ─── */}
      <section className="relative bg-[#FAF9F5] py-14 sm:py-18 lg:py-20 text-center overflow-hidden">
        {/* Subtle luminous ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[320px] bg-white/70 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto px-4">
          {/* Centered circular icon badge */}
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-4 shadow-2xs">
            <Mail size={20} strokeWidth={1.8} />
          </div>

          {/* Eyebrow Tagline */}
          <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[var(--color-primary-dark)] block mb-2">
            Clinical Dispensary Journal
          </span>

          {/* Title in Editorial Serif */}
          <h3 className="font-serif text-2xl sm:text-3xl md:text-[2.25rem] font-normal text-[var(--color-text-main)] mb-3 tracking-[-0.01em]">
            {t('home.newsletter_title')}
          </h3>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-lg mx-auto mb-7 font-normal">
            {t('home.newsletter_desc')}
          </p>

          {/* Luxury Unified Pill Subscription Form */}
          <form onSubmit={handleNewsletterSubmit} className="w-full max-w-md mx-auto">
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center p-1.5 sm:p-2 rounded-2xl sm:rounded-full bg-white border border-[#ECE8DE] shadow-xs focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary-light)] transition-all">
              <input
                type="email"
                placeholder={t('home.newsletter_placeholder')}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm text-[var(--color-text-main)] bg-transparent border-0 focus:outline-none placeholder:text-[var(--color-text-muted)]"
                aria-label="Email for newsletter subscription"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full text-xs sm:text-sm font-medium tracking-wide bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-xs hover:shadow-sm transition-all duration-150 shrink-0 mt-2 sm:mt-0 active:scale-[0.99] cursor-pointer"
              >
                <span>{t('home.newsletter_button')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-2.5">
              Private formulation releases & dermatological advice. No spam ever.
            </p>
          </form>

          {/* Feedback states */}
          {newsletterStatus === 'success' && (
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-[var(--color-success)] bg-[var(--color-success-bg)] border border-[var(--color-success)]/20 px-4 py-2 rounded-full font-medium">
              <CheckCircle2 size={15} />
              <span>{newsletterMessage}</span>
            </div>
          )}
          {newsletterStatus === 'error' && (
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-[var(--color-danger)] bg-[var(--color-danger-bg)] border border-[var(--color-danger)]/20 px-4 py-2 rounded-full font-medium">
              <X size={15} />
              <span>{newsletterMessage}</span>
            </div>
          )}
          </div>
        </div>
      </section>

      {/* ─── PHILOSOPHY MODAL ─── */}
      {isPhilosophyOpen && (
        <div className="overlay" onClick={() => setIsPhilosophyOpen(false)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: 0 }}>
                Our 5 Formulation Pillars
              </h3>
              <button
                type="button"
                onClick={() => setIsPhilosophyOpen(false)}
                style={{ color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              <div>
                <strong style={{ color: 'var(--color-text-main)' }}>1. Physiologically Matched Actives:</strong> Formulations are calibrated to match the natural acidic mantle pH (4.8 - 5.5) of healthy dermal tissue.
              </div>
              <div>
                <strong style={{ color: 'var(--color-text-main)' }}>2. Barrier Repair Focus:</strong> Every active serum or exfoliator incorporates soothing lipid replenishers (ceramides, squalane, or panthenol) to prevent trans-epidermal water loss.
              </div>
              <div>
                <strong style={{ color: 'var(--color-text-main)' }}>3. Zero Synthetic Fragrances:</strong> 100% free from masking fragrances, drying phthalates, and synthetic aromatic compounds.
              </div>
              <div>
                <strong style={{ color: 'var(--color-text-main)' }}>4. Ethical & Cruelty-Free:</strong> Formulated ethically with certified cruelty-free testing and sustainably cultivated botanicals.
              </div>
              <div>
                <strong style={{ color: 'var(--color-text-main)' }}>5. Verified POS Batch Tracking:</strong> Every bottle sold is recorded into our integrated laboratory POS database with direct batch authentication.
              </div>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setIsPhilosophyOpen(false)}
                className="btn btn-primary btn-sm"
              >
                Close Formulation Pledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
