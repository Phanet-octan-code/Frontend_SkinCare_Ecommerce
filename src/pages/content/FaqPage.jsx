import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Package,
  Sparkles,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Phone,
} from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'Orders & Tracking',
    icon: Package,
    items: [
      {
        q: 'How do I track my skincare delivery in real-time?',
        a: 'Navigate to our Live Order Tracking page (/track). Enter your Invoice Reference (e.g. INV-20261022-0001) along with your billing email or phone number. Our system connects directly to our Laravel backend to provide authoritative status—from dispensary formulation to express courier handoff.',
      },
      {
        q: 'Can I cancel an order after placing it online?',
        a: 'Yes. If your order is in "pending" or "confirmed" status, you can initiate a cancellation directly from your Account Order Details page or by contacting our concierge. The order will be cancelled and the items immediately restored to our POS stock inventory.',
      },
      {
        q: 'How fast do you dispatch orders in Phnom Penh and the provinces?',
        a: 'Orders placed before 2:00 PM ICT in Phnom Penh qualify for same-day dispensary dispatch (delivered within 24 hours). Provincial deliveries across Cambodia arrive within 24–48 hours via climate-controlled courier partners.',
      },
    ],
  },
  {
    category: 'Formulations & Skin Safety',
    icon: Sparkles,
    items: [
      {
        q: 'Are your products authentic and batch-verified?',
        a: 'Every single product sold on our platform is 100% genuine, directly synced with our dispensary POS management system. We do not stock grey-market goods or unauthorized parallel imports.',
      },
      {
        q: 'How should I perform a patch test for active formulations?',
        a: 'Apply a pea-sized amount behind the ear or on the inner forearm for 24 hours. If no redness, itching, or inflammation occurs, you may incorporate the formulation into your regular regimen.',
      },
      {
        q: 'Are your products cruelty-free and non-comedogenic?',
        a: 'Yes. None of our formulations or raw active ingredients are tested on animals. All facial creams and emulsions are formulated to minimize pore congestion and respect the natural acid mantle.',
      },
    ],
  },
  {
    category: 'Payments & POS Security',
    icon: CreditCard,
    items: [
      {
        q: 'What payment methods do you support?',
        a: 'We accept Bakong KHQR (ABA Mobile, Wing, ACLEDA, and all Bakong member banking apps), major Credit/Debit Cards (Visa, Mastercard), and Cash on Delivery (COD) across Cambodia.',
      },
      {
        q: 'How does Bakong KHQR dynamic verification work?',
        a: 'When you place an order selecting KHQR, our backend generates an authoritative 5-minute dynamic QR code. Once you scan and pay from your banking app, our payment webhook verifies the transaction reference in real-time and confirms your order instantly.',
      },
      {
        q: 'Are card transactions encrypted and secured?',
        a: 'Yes. Raw card numbers and security codes are tokenized client-side and never stored on our database servers, conforming to rigorous PCI-DSS security principles.',
      },
    ],
  },
  {
    category: 'Returns & Tolerance Guarantee',
    icon: RotateCcw,
    items: [
      {
        q: 'What is your 14-Day Tolerance Guarantee?',
        a: 'If a botanical formulation causes an unexpected adverse reaction or does not suit your skin type, contact our dispensary care team within 14 days of delivery. We will coordinate an exchange for a compatible formula or issue boutique store credit.',
      },
      {
        q: 'How do I return a damaged or incorrect package?',
        a: 'If your parcel arrives damaged or with incorrect items, photograph the package and contact us immediately via phone (+855 23 888 999) or email. We will arrange a courier pickup and dispatch a replacement on the same day.',
      },
    ],
  },
];

export default function FaqPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const categories = ['All', ...FAQ_DATA.map((c) => c.category)];

  const filteredData = useMemo(() => {
    return FAQ_DATA.map((cat) => {
      if (activeCategory !== 'All' && cat.category !== activeCategory) {
        return null;
      }

      const filteredItems = cat.items.filter((item) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
      });

      if (filteredItems.length === 0) return null;

      return {
        ...cat,
        items: filteredItems,
      };
    }).filter(Boolean);
  }, [searchQuery, activeCategory]);

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: t('faq.breadcrumb') || 'FAQ' }]} />

        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEF2EB] text-[#71856B] text-xs font-semibold tracking-wider uppercase mb-3">
            <HelpCircle size={13} />
            <span>{t('faq.badge') || 'Clinical Knowledge Base'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F2520] mb-3 leading-tight">
            {t('faq.title_part1') || 'Frequently Addressed'}{' '}
            <span className="italic font-serif text-[#71856B]">{t('faq.title_part2') || 'Inquiries'}</span>
          </h1>
          <p className="text-sm sm:text-base text-[#5A6358] max-w-xl mx-auto leading-relaxed font-normal">
            {t('faq.subtitle') || 'Clear, authoritative guidance regarding our clinical formulations, live dispatch tracking, ingredient safety, and returns.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder={t('header.search_placeholder') || "Search by topic, e.g. KHQR, returns, ingredients..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-[#ECE8DE] bg-white text-xs sm:text-sm text-[#1F2520] focus:border-[#71856B] focus:ring-1 focus:ring-[#71856B] shadow-xs outline-none transition-all"
            />
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8578]" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#1F2520] text-white shadow-xs'
                  : 'bg-white border border-[#ECE8DE] text-[#5A6358] hover:text-[#1F2520] hover:border-[#71856B]/40'
              }`}
            >
              {cat === 'All' ? (t('common.all') || 'All') : cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion Lists */}
        {filteredData.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#ECE8DE] p-8 sm:p-12 shadow-xs text-center">
            <HelpCircle size={40} className="text-[#7A8578] mx-auto mb-3 opacity-40" />
            <h3 className="font-serif text-lg font-semibold text-[#1F2520] mb-1">
              No matching questions found
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6358] mb-4">
              Try adjusting your search query or explore another category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="px-5 py-2 rounded-full border border-[#1F2520] text-xs font-medium text-[#1F2520]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8 mb-12 sm:mb-16">
            {filteredData.map((cat) => {
              const CategoryIcon = cat.icon;
              return (
                <div key={cat.category}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#EEF2EB] text-[#71856B] flex items-center justify-center">
                      <CategoryIcon size={16} />
                    </div>
                    <h2 className="font-serif text-lg sm:text-xl font-normal text-[#1F2520]">
                      {cat.category}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {cat.items.map((item, idx) => {
                      const itemKey = `${cat.category}-${idx}`;
                      const isOpen = Boolean(openItems[itemKey]);

                      return (
                        <div
                          key={item.q}
                          className={`rounded-2xl bg-white border transition-all duration-300 ${
                            isOpen ? 'border-[#71856B]/60 shadow-xs' : 'border-[#ECE8DE] shadow-2xs hover:border-[#71856B]/30'
                          } overflow-hidden`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleItem(itemKey)}
                            aria-expanded={isOpen}
                            className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-serif text-sm sm:text-base font-normal text-[#1F2520] hover:text-[#71856B] transition-colors cursor-pointer"
                          >
                            <span className="font-medium text-[15px] sm:text-[16px]">{item.q}</span>
                            <div className="shrink-0">
                              <ChevronDown
                                size={18}
                                className={`transition-transform duration-300 ease-out ${
                                  isOpen ? 'rotate-180 text-[#71856B]' : 'text-[#8C9388]'
                                }`}
                              />
                            </div>
                          </button>

                          <div
                            className={`grid transition-all duration-300 ease-in-out ${
                              isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-[#5A6358] leading-relaxed border-t border-[#ECE8DE]/50 mt-1">
                                {item.a}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Concierge Card */}
        <div className="rounded-3xl bg-white border border-[#ECE8DE] p-6 sm:p-8 shadow-xs text-center">
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1F2520] mb-2">
            Still Have Questions?
          </h3>
          <p className="text-xs sm:text-sm text-[#5A6358] max-w-md mx-auto mb-6">
            Our licensed dispensary consultants are available for personalized formulation advice and order inquiries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
            >
              <MessageSquare size={14} />
              <span>Contact Concierge Desk</span>
            </Link>
            <a
              href="tel:+85523888999"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-[#ECE8DE] hover:border-[#1F2520] text-[#1F2520] text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-1.5 transition-all bg-white"
            >
              <Phone size={14} />
              <span>Call +855 23 888 999</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
