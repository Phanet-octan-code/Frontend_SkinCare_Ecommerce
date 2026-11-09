import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import catalogService from '../services/catalogService';
import { useTranslation } from '../i18n/LanguageContext';
import { ArrowRight, Sparkles, Search } from 'lucide-react';

const CURATED_BRANDS = [
  { name: 'Beauty of Joseon', origin: 'South Korea', focus: 'Traditional Hanbang & Rice Probiotics' },
  { name: 'Torriden', origin: 'South Korea', focus: 'Low Molecular Hyaluronic Acid Hydration' },
  { name: 'CeraVe', origin: 'United States', focus: 'Essential Ceramides & MVE Barrier Technology' },
  { name: "Paula's Choice", origin: 'United States', focus: 'BHA Exfoliation & Calibrated Actives' },
  { name: 'La Roche-Posay', origin: 'France', focus: 'Thermal Spring Water & Sensitive Skin Care' },
  { name: 'SkinCeuticals', origin: 'United States', focus: 'High-Potency Vitamin C & Antioxidant Serums' },
  { name: 'Dermalogica', origin: 'United States', focus: 'Clinical Derm Grade Skin Health' },
  { name: 'The Ordinary', origin: 'Canada', focus: 'Clinical Formulations With Integrity' },
  { name: 'COSRX', origin: 'South Korea', focus: 'Snail Mucin & Centella Blemish Solutions' },
  { name: 'Anua', origin: 'South Korea', focus: 'Heartleaf 77% Soothing & Pore Control' },
  { name: 'Skin1004', origin: 'South Korea', focus: 'Madagascar Centella Asiatica Extracts' },
  { name: 'Innisfree', origin: 'South Korea', focus: 'Jeju Island Green Tea & Mineral Moisture' },
];

export default function BrandsPage() {
  const { t } = useTranslation();
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('ALL');

  useEffect(() => {
    catalogService
      .getBrands()
      .then((res) => {
        if (Array.isArray(res?.data) && res.data.length > 0) {
          const apiBrands = res.data.map((b) => {
            const name = typeof b === 'string' ? b : b.name || '';
            const match = CURATED_BRANDS.find((c) => c.name.toLowerCase() === name.toLowerCase());
            return {
              name,
              origin: match?.origin || 'Clinical Dispensary',
              focus: match?.focus || 'Botanical formulation',
              count: typeof b === 'object' ? b.products_count : null,
            };
          });
          setBrands(apiBrands);
        } else {
          setBrands(CURATED_BRANDS);
        }
      })
      .catch(() => {
        setBrands(CURATED_BRANDS);
      });
  }, []);

  const displayList = brands.length > 0 ? brands : CURATED_BRANDS;

  const alphabet = ['ALL', ...Array.from(new Set(displayList.map((b) => b.name.charAt(0).toUpperCase()))).sort()];

  const filteredBrands = displayList.filter((b) => {
    const matchesLetter = selectedLetter === 'ALL' || b.name.toUpperCase().startsWith(selectedLetter);
    const matchesSearch = !searchQuery.trim() || b.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLetter && matchesSearch;
  });

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-6 sm:py-10 md:py-14">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs items={[{ label: t('nav.brands') || 'Brands' }]} />
        </div>

        {/* Minimal Editorial Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2EB] text-[#71856B] text-[11px] font-semibold tracking-wider uppercase mb-2.5 border border-[#71856B]/20">
            <Sparkles size={13} />
            <span>Curated Dispensary Labs</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F2520]">
            Partner Brands
          </h1>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-5 border-b border-[#ECE8DE]">
          {/* Alphabet Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
            {alphabet.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => setSelectedLetter(letter)}
                className={`w-8 h-8 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                  selectedLetter === letter
                    ? 'bg-[#1F2520] text-white'
                    : 'bg-white border border-[#ECE8DE] text-[#5A6358] hover:border-[#71856B]'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C9388]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter brand name..."
              className="w-full pl-9 pr-3 h-9 text-xs rounded-full bg-white border border-[#ECE8DE] text-[#1F2520] placeholder-[#8C9388] focus:outline-none focus:border-[#71856B]"
            />
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredBrands.map((brand) => (
            <Link
              key={brand.name}
              to={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className="group p-5 rounded-2xl bg-white border border-[#ECE8DE] hover:border-[#71856B]/60 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#71856B] block mb-1">
                  {brand.origin}
                </span>
                <h3 className="font-serif text-lg font-medium text-[#1F2520] group-hover:text-[#71856B] transition-colors mb-3">
                  {brand.name}
                </h3>
              </div>

              <div className="pt-3 border-t border-[#FAF9F5] flex items-center justify-between text-xs font-semibold text-[#71856B]">
                <span>{brand.count ? `${brand.count} Formulations` : 'Explore Collection'}</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

