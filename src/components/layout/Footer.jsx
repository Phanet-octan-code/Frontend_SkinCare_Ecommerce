import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Award, MapPin, Phone } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import leafLogo from '../../assets/logo/leaf.png';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#1F2520] text-[#D4DDD2] border-t border-[#2F3930] pt-14 sm:pt-16 pb-8 sm:pb-10 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── 1. VALUE HIGHLIGHTS / CLINICAL PROMISES (FOUR ELEVATED BLOCKS) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-12 sm:pb-14 border-b border-white/10 mb-12 sm:mb-14">
          {/* Feature 1: Clinical Efficacy */}
          <div className="flex items-start gap-3.5 p-4 sm:p-4.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary-light)] shrink-0 mt-0.5">
              <Award size={18} strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wide mb-1">
                {t('features.clinical_title')}
              </h4>
              <p className="text-[11px] sm:text-xs text-[#9EAEA0] leading-relaxed">
                {t('features.clinical_desc')}
              </p>
            </div>
          </div>

          {/* Feature 2: Climate-Controlled Delivery */}
          <div className="flex items-start gap-3.5 p-4 sm:p-4.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary-light)] shrink-0 mt-0.5">
              <Truck size={18} strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wide mb-1">
                {t('features.delivery_title')}
              </h4>
              <p className="text-[11px] sm:text-xs text-[#9EAEA0] leading-relaxed">
                {t('features.delivery_desc')}
              </p>
            </div>
          </div>

          {/* Feature 3: Potent Bio-Actives */}
          <div className="flex items-start gap-3.5 p-4 sm:p-4.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary-light)] shrink-0 mt-0.5">
              <ShieldCheck size={18} strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wide mb-1">
                {t('features.active_title')}
              </h4>
              <p className="text-[11px] sm:text-xs text-[#9EAEA0] leading-relaxed">
                {t('features.active_desc')}
              </p>
            </div>
          </div>

          {/* Feature 4: Certified Dispensary Advice */}
          <div className="flex items-start gap-3.5 p-4 sm:p-4.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary-light)] shrink-0 mt-0.5">
              <RefreshCw size={18} strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wide mb-1">
                {t('features.consult_title')}
              </h4>
              <p className="text-[11px] sm:text-xs text-[#9EAEA0] leading-relaxed">
                {t('features.consult_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* ─── 2. MAIN FOOTER NAVIGATION GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 sm:pb-14">
          {/* Brand Identity & Location (5 columns on desktop) */}
          <div className="lg:col-span-5 pr-0 lg:pr-6">
            <Link to="/" className="inline-flex items-center gap-3 mb-3.5 group select-none" aria-label="Élixir Botanique - Clinical Skincare">
              <img
                src={leafLogo}
                alt="Élixir Botanique Leaf Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 group-hover:scale-105 transition-transform duration-200"
              />
              <div className="flex flex-col items-start leading-none">
                <span className="brand-logo-title font-serif text-xl sm:text-2xl font-normal tracking-wide text-white block">
                  ÉLIXIR <span className="brand-italic font-serif italic text-[var(--color-primary-light)] font-normal">BOTANIQUE</span>
                </span>
                <span className="brand-logo-tagline text-[10px] tracking-[0.2em] uppercase text-[#8E9C8D] block mt-1 font-medium">
                  CLINICAL SKINCARE
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm leading-relaxed text-[#A6B2A4] mb-5 max-w-sm font-normal">
              {t('footer.about_desc')}
            </p>

            <div className="space-y-2 text-xs text-[#8E9C8D]">
              <p className="flex items-start gap-2.5">
                <MapPin size={14} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                <span>#42 Preah Norodom Blvd, Phnom Penh, Cambodia</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone size={14} className="text-[var(--color-primary)] shrink-0" />
                <span>
                  Dispensary Hotline:{' '}
                  <a href="tel:+85523888999" className="text-white/90 hover:text-white transition-colors underline-offset-2 hover:underline">
                    +855 23 888 999
                  </a>
                </span>
              </p>
            </div>
          </div>

          {/* Column 2: Formulations & Catalog (2 columns on desktop) */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.15em] mb-4 text-white/90">
              {t('nav.categories')}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/shop" className="text-[#A6B2A4] hover:text-white transition-colors inline-block">
                  {t('nav.shop')}
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=popular" className="text-[#A6B2A4] hover:text-white transition-colors inline-block">
                  {t('shop.sort_featured')}
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=promotion" className="text-[#A6B2A4] hover:text-white transition-colors inline-block">
                  {t('common.discount')}
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-[#A6B2A4] hover:text-white transition-colors inline-block">
                  {t('announcement.track_order')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: The Clinic & Institution (2 columns on desktop) */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.15em] mb-4 text-white/90">
              {t('footer.shop_title')}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/about" className="text-[#A6B2A4] hover:text-white transition-colors inline-block">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#A6B2A4] hover:text-white transition-colors inline-block">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-[#A6B2A4] hover:text-white transition-colors inline-block">
                  {t('nav.faq')}
                </Link>
              </li>
              <li>
                <Link to="/account/profile" className="text-[#A6B2A4] hover:text-white transition-colors inline-block">
                  {t('nav.account')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Client Care & Policies (3 columns on desktop) */}
          <div className="lg:col-span-3 sm:col-span-1">
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.15em] mb-4 text-white/90">
              {t('footer.support_title')}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/shipping-policy" className="text-[#A6B2A4] hover:text-white transition-colors inline-block">
                  {t('nav.shipping_policy')}
                </Link>
              </li>
              <li>
                <Link to="/returns-policy" className="text-[#A6B2A4] hover:text-white transition-colors inline-block">
                  {t('nav.returns_policy')}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-[#A6B2A4] hover:text-white transition-colors inline-block">
                  {t('nav.privacy_policy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#A6B2A4] hover:text-white transition-colors inline-block">
                  {t('nav.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── 3. BOTTOM COPYRIGHT & TRUST CLEARANCE BAR ─── */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#818E7F] text-center md:text-left">
          <p>
            © {CURRENT_YEAR} Élixir Botanique Skincare Co. Integrated with SkinCare POS System.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-[#97A395]">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="text-white/20">•</span>
            <span className="text-[#7F8D7E]">Bakong KHQR • Visa • Mastercard • Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
