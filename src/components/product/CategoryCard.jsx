import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Sparkles, Beaker, Sun, ShieldCheck, Leaf, Heart, Eye } from 'lucide-react';
import { resolveImageUrl } from '../../utils/imageUrl';
import { useLanguage } from '../../i18n/LanguageContext';
import { getLocalizedCategoryName } from '../../utils/categoryLocalization';

// Verified 200 OK high-resolution studio botanical images for circular dispensary categories
const defaultCategoryVisuals = {
  cleanser: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
  toner: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=400&q=80',
  serum: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
  moisturizer: 'https://images.unsplash.com/photo-1608248597359-5433246872a9?auto=format&fit=crop&w=400&q=80',
  sunscreen: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80',
  exfoliant: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80',
  eye: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=400&q=80',
  mask: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80',
  skincare: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
};

export default function CategoryCard({ category, index = 0 }) {
  const { language, t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [customFailed, setCustomFailed] = useState(false);

  if (!category) return null;

  const targetUrl = category.path || `/shop?category_id=${category.id}`;
  const displayName = getLocalizedCategoryName(category, language);
  const name = category.name || '';
  const lower = name.toLowerCase();

  // Resolve matching image: custom image first, then verified default based on category name
  const getFallbackImage = () => {
    if (lower.includes('cleanse') || lower.includes('wash')) return defaultCategoryVisuals.cleanser;
    if (lower.includes('toner') || lower.includes('essence')) return defaultCategoryVisuals.toner;
    if (lower.includes('serum') || lower.includes('ampoule')) return defaultCategoryVisuals.serum;
    if (lower.includes('moistur') || lower.includes('cream')) return defaultCategoryVisuals.moisturizer;
    if (lower.includes('sun') || lower.includes('uv') || lower.includes('shield') || lower.includes('spf')) return defaultCategoryVisuals.sunscreen;
    if (lower.includes('exfoli') || lower.includes('peel') || lower.includes('scrub')) return defaultCategoryVisuals.exfoliant;
    if (lower.includes('eye') || lower.includes('lip')) return defaultCategoryVisuals.eye;
    if (lower.includes('mask') || lower.includes('treat')) return defaultCategoryVisuals.mask;
    if (lower.includes('skin')) return defaultCategoryVisuals.skincare;
    
    // Index-based fallback with verified 200 OK images
    const fallbacks = [
      defaultCategoryVisuals.cleanser,
      defaultCategoryVisuals.serum,
      defaultCategoryVisuals.moisturizer,
      defaultCategoryVisuals.sunscreen,
      defaultCategoryVisuals.toner,
      defaultCategoryVisuals.exfoliant,
      defaultCategoryVisuals.eye,
      defaultCategoryVisuals.mask,
    ];
    return fallbacks[index % fallbacks.length];
  };

  const getImage = () => {
    const customUrl = category.image_url || category.image;
    if (customUrl && !customFailed) return resolveImageUrl(customUrl);
    return getFallbackImage();
  };

  const handleImageError = () => {
    if ((category.image_url || category.image) && !customFailed) {
      setCustomFailed(true);
    } else {
      setImageError(true);
    }
  };

  const getFallbackIcon = () => {
    if (lower.includes('cleanse')) return <Droplets size={26} strokeWidth={1.8} />;
    if (lower.includes('serum')) return <Beaker size={26} strokeWidth={1.8} />;
    if (lower.includes('sun')) return <Sun size={26} strokeWidth={1.8} />;
    if (lower.includes('mask')) return <ShieldCheck size={26} strokeWidth={1.8} />;
    if (lower.includes('moistur')) return <Leaf size={26} strokeWidth={1.8} />;
    if (lower.includes('eye')) return <Eye size={26} strokeWidth={1.8} />;
    return <Sparkles size={26} strokeWidth={1.8} />;
  };

  return (
    <Link
      to={targetUrl}
      className="group flex flex-col items-center text-center no-underline cursor-pointer select-none transition-transform duration-300 hover:-translate-y-1"
      aria-label={`Shop category: ${name}`}
    >
      {/* Signature Circular Avatar Container */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-30 lg:h-30 xl:w-32 xl:h-32 rounded-full p-1 border-2 border-[#ECE8DE] group-hover:border-[#71856B] bg-[#F7F5F0] shadow-2xs group-hover:shadow-md transition-all duration-300">
        <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
          {!imageError ? (
            <img
              src={getImage()}
              alt={name}
              loading="lazy"
              onError={handleImageError}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-[#EEF2EB] text-[#71856B] flex items-center justify-center">
              {getFallbackIcon()}
            </div>
          )}
        </div>
      </div>

      {/* Category Name & "Shop Now" Action */}
      <div className="mt-3 sm:mt-3.5 flex flex-col items-center w-full px-1">
        <h3 className="font-serif text-[11.5px] sm:text-xs lg:text-[12.5px] font-semibold text-[#1F2520] tracking-wider uppercase m-0 leading-snug group-hover:text-[#71856B] transition-colors line-clamp-2 text-center min-h-[2.4rem] flex items-center justify-center max-w-[140px] sm:max-w-[160px]">
          {displayName}
        </h3>
        <span className="text-[10.5px] sm:text-[11px] font-medium text-[#71856B] group-hover:text-[#1F2520] inline-flex items-center gap-1 mt-1 transition-colors">
          <span>{t('common.shop_now') || 'Shop Now'}</span>
          <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
