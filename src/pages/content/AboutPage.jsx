import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import { resolveImageUrl, handleImageError } from '../../utils/imageUrl';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Leaf,
  CheckCircle2,
  ArrowRight,
  FlaskConical,
  HeartHandshake,
  MapPin,
  Clock,
  Phone,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEF2EB] text-[#71856B] text-xs font-semibold tracking-wider uppercase mb-3">
            <Leaf size={13} />
            <span>The Dispensary Philosophy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F2520] mb-4 leading-tight">
            Rooted in Botany. <br className="hidden sm:inline" />
            <span className="italic font-serif text-[#71856B]">Calibrated by Science.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#5A6358] max-w-2xl mx-auto leading-relaxed font-normal">
            Élixir Botanique was founded on an unyielding principle: skincare should heal, fortify, and protect the dermal barrier without synthetic fillers, endocrine disruptors, or compromised molecular potency.
          </p>
        </div>

        {/* Highlight Image Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-12 sm:mb-16 shadow-xs border border-[#ECE8DE] aspect-[16/9] sm:aspect-[21/9]">
          <img
            src={resolveImageUrl('/brand-story.jpg')}
            alt="Élixir Botanique Dispensary Laboratory"
            className="w-full h-full object-cover"
            onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F2520]/80 via-[#1F2520]/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <span className="text-xs uppercase tracking-[0.14em] text-[#D4DDD2] block mb-1">
              Flagship Boutique &amp; Compounding Counter
            </span>
            <h3 className="font-serif text-lg sm:text-2xl font-normal text-white">
              #42 Preah Norodom Blvd, Phnom Penh, Kingdom of Cambodia
            </h3>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12 sm:mb-16">
          <div className="p-6 rounded-3xl bg-white border border-[#ECE8DE] shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center mb-4">
              <Leaf size={20} />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#1F2520] mb-2">
              Bioactive Extracts
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6358] leading-relaxed">
              We source bioactive botanicals cultivated sustainably. Cold-process micro-extraction preserves fragile polyphenols, flavonoids, and phytosterols.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#ECE8DE] shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center mb-4">
              <FlaskConical size={20} />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#1F2520] mb-2">
              Clinical Rigor &amp; pH Balance
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6358] leading-relaxed">
              Every formulation is tested for stability, biocompatibility, and physiological acidity (pH 4.7 – 5.5) to protect the skin’s native microbiome.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#ECE8DE] shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2EB] text-[#71856B] flex items-center justify-center mb-4">
              <HeartHandshake size={20} />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#1F2520] mb-2">
              POS Synced Dispensary
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6358] leading-relaxed">
              Our digital catalog synchronizes with our central laboratory inventory. Clients enjoy real-time stock availability and direct authenticity validation.
            </p>
          </div>
        </div>

        {/* Detailed Brand Story Card */}
        <div className="rounded-3xl bg-white border border-[#ECE8DE] p-7 sm:p-10 shadow-xs mb-12 sm:mb-16 text-sm text-[#5A6358] leading-relaxed space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
            The Dispensary Standard
          </h2>
          <p>
            Originating from a clinical skincare consultation counter in Phnom Penh, Élixir Botanique was developed in response to a market saturated with non-regulated bleaching agents and synthetic fragrances. Our dermatological chemists partnered with sustainable regional botanists to engineer non-comedogenic, barrier-restoring emulsions calibrated for humid tropical and urban environments.
          </p>
          <p>
            Each bottle and jar is cast from pharmaceutical-grade amber glass to shield active molecules like L-Ascorbic Acid and Granactive Retinoid from ultraviolet degradation. We formulate without parabens, phthalates, synthetic colorants, sulfates, or artificial perfumes.
          </p>

          <div className="my-6 p-5 rounded-2xl bg-[#EEF2EB] border border-[#71856B]/20 text-xs sm:text-sm text-[#1F2520]">
            <h4 className="font-serif font-semibold text-sm sm:text-base text-[#1F2520] mb-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#71856B]" />
              <span>Certified Pharmacy &amp; MoC Compliance</span>
            </h4>
            <p className="text-[#5A6358] mb-2">
              Registered with the Ministry of Commerce (MoC) and Department of Drugs &amp; Cosmetics, Phnom Penh, Kingdom of Cambodia.
            </p>
            <p className="text-[11px] text-[#7A8578]">
              Batch Clearance: Laboratory sealed • 100% Genuine Direct Supply • 14-Day Tolerance Exchange Guarantee
            </p>
          </div>

          <h3 className="font-serif text-lg font-semibold text-[#1F2520] pt-2">
            Our 4 Core Dispensary Commitments
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-[#5A6358] pl-4 list-disc">
            <li>
              <strong className="text-[#1F2520]">Barrier-First Formulations:</strong> Supporting the stratum corneum without aggressive stripping or synthetic emulsifiers.
            </li>
            <li>
              <strong className="text-[#1F2520]">Disclosed Potency:</strong> Every active ingredient declared with its physiological concentration percentage.
            </li>
            <li>
              <strong className="text-[#1F2520]">Certified Cruelty-Free:</strong> Formulations tested exclusively on consenting clinical human panels.
            </li>
            <li>
              <strong className="text-[#1F2520]">14-Day Tolerance Guarantee:</strong> If a formula does not agree with your skin, our concierge coordinates a seamless exchange or credit.
            </li>
          </ul>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl bg-[#FAF9F5] border border-[#ECE8DE] p-8 sm:p-10 shadow-xs text-center">
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
            Explore Our Curated Formulations
          </h3>
          <p className="text-xs sm:text-sm text-[#5A6358] mb-6 max-w-md mx-auto">
            Browse targeted cleansers, active antioxidant serums, and physiological barrier creams.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98]"
            >
              <span>View Product Catalog</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-7 py-3 rounded-full border border-[#ECE8DE] hover:border-[#1F2520] text-[#1F2520] text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center transition-all bg-white"
            >
              <span>Contact Dispensary Care</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
