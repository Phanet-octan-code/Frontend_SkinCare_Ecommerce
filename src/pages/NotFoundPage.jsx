import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sparkles, Compass } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-[#FAF9F5] min-h-[75vh] flex items-center justify-center py-16 sm:py-24 px-4">
      <div className="container max-w-lg mx-auto text-center">
        {/* Monogram Badge */}
        <div className="w-16 h-16 rounded-full bg-[#EEF2EB] text-[#71856B] border border-[#71856B]/20 flex items-center justify-center mx-auto mb-6 shadow-2xs">
          <Compass size={28} strokeWidth={1.6} />
        </div>

        {/* 404 Heading */}
        <span className="text-xs uppercase font-bold tracking-[0.16em] text-[#71856B] block mb-2">
          Dispensary Route Notice
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#1F2520] mb-3 leading-tight">
          Formulation Not Located
        </h1>

        <p className="text-sm sm:text-base text-[#5A6358] max-w-md mx-auto mb-8 leading-relaxed font-normal">
          The skincare formulation, collection, or dispensary record you are seeking has been moved, reformulated, or archived.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            to="/shop"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98]"
          >
            <span>Explore Clinical Catalog</span>
            <ArrowRight size={15} />
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-[#ECE8DE] hover:border-[#1F2520] text-[#1F2520] text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center transition-all bg-white"
          >
            <span>Return to Boutique Homepage</span>
          </Link>
        </div>

        {/* Suggested Collections */}
        <div className="pt-6 border-t border-[#ECE8DE] text-xs text-[#7A8578]">
          <span className="block mb-2">Popular Dispensary Collections:</span>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/shop?category=Cleansers" className="text-[#71856B] hover:text-[#1F2520] underline underline-offset-2">
              Gentle Cleansers
            </Link>
            <span>•</span>
            <Link to="/shop?category=Serums" className="text-[#71856B] hover:text-[#1F2520] underline underline-offset-2">
              Active Antioxidant Serums
            </Link>
            <span>•</span>
            <Link to="/shop?category=Moisturizers" className="text-[#71856B] hover:text-[#1F2520] underline underline-offset-2">
              Barrier Creams
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
