import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';
import brandStoryImg from '../../assets/brand-story.jpg';
import {
  ShieldCheck,
  Award,
  Leaf,
  CheckCircle2,
  ArrowRight,
  FlaskConical,
  HeartHandshake,
  Clock,
  Compass,
  Layers,
  Droplets,
  Microscope,
  Check,
  ExternalLink,
} from 'lucide-react';

export default function AboutPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('philosophy');

  const stats = [
    { label: 'Traceable Botanicals', value: '100%', sub: 'Pure cold-extracted' },
    { label: 'pH Balanced', value: '4.7 – 5.5', sub: 'Native microbiome sync' },
    { label: 'Clinical Human Panels', value: '0%', sub: 'Animal testing' },
    { label: 'Dispensary Guarantee', value: '14 Days', sub: 'Tolerance exchange' },
  ];

  const pillars = [
    {
      icon: Leaf,
      title: t('about.pillar1_title') || 'Bioactive Extracts',
      desc:
        t('about.pillar1_desc') ||
        'We source bioactive botanicals cultivated sustainably. Cold-process micro-extraction preserves fragile polyphenols, flavonoids, and phytosterols without high-heat degradation.',
      highlight: 'Cold-Supercritical Extraction',
    },
    {
      icon: FlaskConical,
      title: t('about.pillar2_title') || 'Clinical Rigor & pH Calibration',
      desc:
        t('about.pillar2_desc') ||
        'Every formulation is calibrated to physiological acidity (pH 4.7 – 5.5) to protect the acid mantle and natural lipid barrier enzymes.',
      highlight: 'Physiological Acidity',
    },
    {
      icon: ShieldCheck,
      title: 'Amber Glass Shielding',
      desc:
        'Cast from pharmaceutical-grade amber glass to shield active molecules like L-Ascorbic Acid and retinoids from destructive ultraviolet radiation.',
      highlight: 'UV Protection Cast',
    },
    {
      icon: HeartHandshake,
      title: t('about.pillar3_title') || 'POS Synced Dispensary',
      desc:
        t('about.pillar3_desc') ||
        'Our digital catalog synchronizes with our central laboratory inventory. Clients enjoy real-time stock availability and direct authenticity validation.',
      highlight: 'Direct Authenticity',
    },
  ];

  const commitments = [
    {
      title: 'Barrier-First Formulations',
      desc: 'Supporting the stratum corneum with physiological ceramides, fatty acids, and cholesterol without stripping surfactants.',
    },
    {
      title: 'Full Potency Transparency',
      desc: 'Every active ingredient is declared with its physiological concentration percentage on the clinical monograph.',
    },
    {
      title: 'Certified Cruelty-Free',
      desc: 'Formulations tested exclusively on consenting clinical human panels under strict dermatological observation.',
    },
    {
      title: '14-Day Tolerance Guarantee',
      desc: 'If a formula does not agree with your skin, our dispensary concierge coordinates a seamless exchange or credit.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Botanical Foraging & Selection',
      desc: 'Ethically harvested plant actives chosen for highest bioactive bioavailability.',
    },
    {
      num: '02',
      title: 'Supercritical Cold Extraction',
      desc: 'Low-temperature processing preserving fragile polyphenols and essential lipids.',
    },
    {
      num: '03',
      title: 'Clinical Formulation & pH Lock',
      desc: 'Buffered to match the healthy skin barrier range of pH 4.7 – 5.5.',
    },
    {
      num: '04',
      title: 'Laboratory Batch Sealing',
      desc: 'Poured into amber apothecary glass, batch numbered, and POS verified.',
    },
  ];

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16 select-none animate-[fadeIn_0.4s_ease-out]">
      <div className="container">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-[#1F2520] mb-5 leading-[1.18] tracking-tight">
            {t('about.title_part1') || 'Rooted in Botany.'}{' '}
            <span className="italic font-serif text-[#71856B]">
              {t('about.title_part2') || 'Calibrated by Science.'}
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#5A6358] max-w-2xl mx-auto leading-relaxed font-normal">
            {t('about.subtitle') ||
              'Skincare formulated to heal, fortify, and protect the dermal barrier with pure botanical potency and clinical precision.'}
          </p>

          {/* Quick Stats Pill Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-[#ECE8DE]">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="bg-white/70 hover:bg-white border border-[#ECE8DE] rounded-2xl p-3.5 sm:p-4 text-center transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5"
              >
                <div className="font-serif text-lg sm:text-xl lg:text-2xl font-semibold text-[#1F2520]">
                  {s.value}
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-[#71856B] mt-0.5">
                  {s.label}
                </div>
                <div className="text-[10px] text-[#8C9388] mt-0.5 hidden sm:block">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Image Banner with Floating Glass Badge */}
        <div className="group relative rounded-3xl overflow-hidden mb-16 sm:mb-20 shadow-[0_12px_40px_rgba(31,37,32,0.06)] border border-[#ECE8DE] aspect-[16/9] sm:aspect-[21/9] bg-[#EFECE4]">
          <img
            src={brandStoryImg}
            alt="Élixir Botanique Dispensary Laboratory"
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Floating Glassmorphism Badge */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 max-w-sm p-3.5 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg text-left transition-all duration-300 group-hover:bg-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#71856B] animate-ping" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#71856B]">
                Laboratory Dispensary
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#1F2520] leading-snug">
              Phnom Penh Central Dispensary &amp; Formulation Suite
            </p>
          </div>
        </div>

        {/* 4 Value Pillars Grid */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#71856B] block mb-2">
              OUR FOUR CORNERSTONES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#1F2520]">
              Built Upon Pure Dispensary Ethics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group p-6 sm:p-7 rounded-3xl bg-white border border-[#ECE8DE] hover:border-[#71856B]/40 shadow-xs hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF2EB] text-[#71856B] group-hover:bg-[#71856B] group-hover:text-white flex items-center justify-center mb-5 transition-all duration-300 shadow-2xs">
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#71856B] block mb-1.5">
                      {item.highlight}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-[#1F2520] group-hover:text-[#71856B] transition-colors mb-2.5">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5A6358] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F0ECE3] flex items-center gap-1.5 text-[11px] font-medium text-[#71856B]">
                    <CheckCircle2 size={13} />
                    <span>Clinical Standard Verified</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formulation Lifecycle Steps (Interactive Animated Strip) */}
        <div className="mb-16 sm:mb-20 bg-white rounded-3xl p-7 sm:p-10 border border-[#ECE8DE] shadow-xs">
          <div className="text-center max-w-lg mx-auto mb-10">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#71856B] block mb-2">
              FORMULATION PIPELINE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F2520]">
              From Seed to Sealed Amber Glass
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((st, i) => (
              <div
                key={st.num}
                className="relative flex flex-col p-5 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] hover:border-[#71856B]/40 hover:bg-[#EEF2EB]/40 transition-all duration-300 group"
              >
                <div className="font-serif text-3xl font-bold text-[#71856B]/30 group-hover:text-[#71856B] transition-colors mb-2">
                  {st.num}
                </div>
                <h4 className="font-serif text-base font-semibold text-[#1F2520] mb-2">
                  {st.title}
                </h4>
                <p className="text-xs text-[#5A6358] leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Dispensary Standard & Commitments Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16 sm:mb-20">
          {/* Left Column: Origin Story & Medical Compliance */}
          <div className="lg:col-span-6 flex flex-col justify-between p-7 sm:p-10 rounded-3xl bg-white border border-[#ECE8DE] shadow-xs">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2EB] text-[#71856B] text-[11px] font-semibold tracking-wider uppercase mb-3">
                <Compass size={12} />
                <span>Our Heritage</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F2520] mb-4">
                The Dispensary Standard
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-[#5A6358] leading-relaxed">
                <p>
                  Originating from a clinical skincare consultation counter in Phnom Penh, Élixir Botanique was developed in response to a regional market saturated with non-regulated bleaching agents and harsh synthetic fragrances.
                </p>
                <p>
                  We recognized that skin resilience cannot be forced through trauma. It must be nourished through biocompatible botanicals formulated strictly to physiological acidity.
                </p>
              </div>

              {/* Compliance Box */}
              <div className="mt-6 p-5 rounded-2xl bg-[#EEF2EB]/70 border border-[#71856B]/25">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-full bg-[#71856B] text-white flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <h4 className="font-serif font-semibold text-sm text-[#1F2520]">
                    Ministry of Commerce &amp; Pharmacy Registered
                  </h4>
                </div>
                <p className="text-xs text-[#5A6358] leading-relaxed mb-2">
                  Officially registered with the Ministry of Commerce (MoC) and Department of Drugs &amp; Cosmetics, Phnom Penh, Kingdom of Cambodia.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#71856B]/15 text-[11px] text-[#71856B] font-medium">
                  <span className="flex items-center gap-1">
                    <Check size={12} /> Laboratory Sealed
                  </span>
                  <span className="flex items-center gap-1">
                    <Check size={12} /> 100% Genuine Direct Supply
                  </span>
                  <span className="flex items-center gap-1">
                    <Check size={12} /> 14-Day Tolerance Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Core Dispensary Commitments */}
          <div className="lg:col-span-6 p-7 sm:p-10 rounded-3xl bg-white border border-[#ECE8DE] shadow-xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2EB] text-[#71856B] text-[11px] font-semibold tracking-wider uppercase mb-3">
                <Award size={12} />
                <span>Our Guarantees</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F2520] mb-5">
                4 Core Commitments to Your Skin
              </h2>

              <div className="space-y-3.5">
                {commitments.map((c, idx) => (
                  <div
                    key={c.title}
                    className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] hover:border-[#71856B]/40 hover:bg-white hover:shadow-xs transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#EEF2EB] text-[#71856B] group-hover:bg-[#71856B] group-hover:text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-colors">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-[#1F2520] group-hover:text-[#71856B] transition-colors mb-1">
                          {c.title}
                        </h4>
                        <p className="text-xs text-[#5A6358] leading-relaxed">
                          {c.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Elevated Luxury CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1F2520] to-[#2B352D] text-white p-8 sm:p-12 md:p-14 shadow-lg text-center relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#71856B]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#71856B]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#C5D0C3] block mb-3 font-semibold">
              EVIDENCE-BASED DISPENSARY CARE
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-white mb-4 leading-snug">
              Begin Your Clinical Botanical Ritual
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-[#DCE2DA] mb-8 leading-relaxed font-normal">
              Explore our curated formulations calibrated to restore barrier integrity, calm inflammation, and impart lasting dermal health.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#1F2520] hover:bg-[#EEF2EB] text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer no-underline"
              >
                <span>View Full Catalog</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/25 hover:border-white text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center transition-all bg-white/5 hover:bg-white/10 active:scale-95 cursor-pointer no-underline"
              >
                <span>Speak with Concierge</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
