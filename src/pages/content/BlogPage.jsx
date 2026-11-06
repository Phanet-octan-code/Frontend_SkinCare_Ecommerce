import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Tag,
  FlaskConical,
  ShieldCheck,
  Search,
  CheckCircle2,
  X,
  Share2,
} from 'lucide-react';
import { resolveImageUrl, handleImageError, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUrl';

const FALLBACK_IMAGE = DEFAULT_FALLBACK_IMAGE;

const ARTICLES = [
  {
    id: 1,
    title: 'The Dermal Barrier Architecture: Why Acid Mantle pH (4.7 – 5.5) Is Crucial',
    category: 'Dermatology',
    excerpt:
      'Understanding the brick-and-mortar structure of the stratum corneum, intercellular lipids, and how alkaline soaps silently compromise physiological defense against pathogens.',
    readTime: '6 min read',
    date: 'Nov 3, 2026',
    author: 'Dr. S. Vance, Formulation Chemist',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    featured: true,
    content: `The human stratum corneum is frequently conceptualized as a biological brick wall: corneocyte protein envelopes represent the bricks, embedded within a continuous multi-lamellar lipid matrix comprised of ceramides, cholesterol, and free fatty acids.

When the surface pH rises above 5.5 due to harsh surfactant cleansing or tap water exposure, two critical enzymatic shifts occur:
1. Serine proteases (kallikreins) are accelerated, prematurely digesting the corneodesmosomal junctions that hold skin cells together.
2. Beta-glucocerebrosidase and acid sphingomyelinase (the enzymes that synthesize ceramides) are critically deactivated.

The clinical result is transepidermal water loss (TEWL), heightened allergen penetration, and chronic reactive inflammation. Formulary dispensary protocols recommend buffering daily cleansers and essences to a physiological pH of 4.7 – 5.2.`,
    relatedProducts: [
      { name: 'Cetaphil Gentle Skin Cleanser', path: '/shop?search=cetaphil' },
      { name: 'La Roche-Posay Toleriane Cleanser', path: '/shop?search=toleriane' },
    ],
  },
  {
    id: 2,
    title: 'Morning vs. Evening Active Scheduling: Avoiding Barrier Burnout',
    category: 'Routines',
    excerpt:
      'A practical guide to cycling L-Ascorbic Acid, Copper Peptides, Retinoids, and Alpha Hydroxy Acids without causing competitive neutralization or micro-inflammation.',
    readTime: '5 min read',
    date: 'Oct 28, 2026',
    author: 'Elena Rostova, Dermal Specialist',
    image: 'https://images.unsplash.com/photo-1608248597359-5433246872a9?auto=format&fit=crop&w=800&q=80',
    featured: false,
    content: `Applying multiple low-pH actives in single sessions is one of the most common causes of induced barrier compromise. 

Recommended dispensary rotation:
• Morning: Protect & Shield. Prioritize antioxidant defense with Vitamin C (L-Ascorbic Acid or ethylated derivatives), Ferulic Acid, followed by physiological ceramides and broad-spectrum SPF 50+.
• Evening: Repair & Cellular Renewal. Reserve active retinoids, exfoliating BHA/AHA solutions, or peptide repair complexes for nightly circadian healing cycles.`,
    relatedProducts: [
      { name: 'SkinCeuticals C E Ferulic', path: '/shop?search=skinceuticals' },
      { name: "Paula's Choice 2% BHA Liquid Exfoliant", path: '/shop?search=paula' },
    ],
  },
  {
    id: 3,
    title: 'The Synergistic Trinity: Niacinamide, Azelaic Acid & Centella Asiatica',
    category: 'Ingredients',
    excerpt:
      'How combining 2-5% Vitamin B3 with dicarboxylic acids calms post-inflammatory erythema (PIE) and balances sebum production without dermal peeling.',
    readTime: '4 min read',
    date: 'Oct 20, 2026',
    author: 'Dispensary Lab Team',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    featured: false,
    content: `Niacinamide (Nicotinamide) is an essential precursor to NAD+ and NADP+ coenzymes involved in ATP synthesis and cellular DNA repair. When paired with 10% Azelaic Acid, the combination targets multiple pathways of cutaneous redness:
• Inhibits melanogenesis at tyrosinase activation steps.
• Downregulates inflammatory interleukins (IL-1, IL-6, TNF-alpha).
• Normalizes hyperkeratinization within follicular infundibulum channels.`,
    relatedProducts: [
      { name: 'The Ordinary Niacinamide 10% + Zinc 1%', path: '/shop?search=niacinamide' },
      { name: 'Naturium Azelaic Topical Acid 10%', path: '/shop?search=azelaic' },
    ],
  },
  {
    id: 4,
    title: 'Multi-Depth Hyaluronic Acid: Why Molecular Weight Matters',
    category: 'Ingredients',
    excerpt:
      'Not all hyaluronic acid behaves identically. High molecular weight forms an occlusive hydration veil, while low molecular weight penetrates deep to signal endogenous repair.',
    readTime: '4 min read',
    date: 'Oct 15, 2026',
    author: 'Dispensary Lab Team',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    featured: false,
    content: `Hyaluronic acid spans a broad spectrum of Daltons:
• High Molecular Weight (1,500 – 1,800 kDa): Forms an imperceptible, moisture-binding matrix on the stratum corneum surface.
• Medium Molecular Weight (800 – 1,000 kDa): Enhances trans-epidermal hydration reservoirs.
• Low / Oligo Molecular Weight (under 50 kDa): Diffuses into the viable epidermis, stimulating fibroblast receptor activity.`,
    relatedProducts: [
      { name: 'Torriden Dive-In Low Molecular Hyaluronic Acid', path: '/shop?search=torriden' },
    ],
  },
  {
    id: 5,
    title: 'Mineral vs. Chemical UV Filters in Humid Environments',
    category: 'Formulations',
    excerpt:
      'A technical review of Zinc Oxide and Titanium Dioxide versus modern organic filters (Tinosorb S, Uvinul A Plus) under high ambient humidity and perspiration.',
    readTime: '6 min read',
    date: 'Oct 08, 2026',
    author: 'Dr. S. Vance, Formulation Chemist',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    featured: false,
    content: `Sunscreen formulations in tropical and subtropical climates face unique physical stresses: perspiration, sebum breakdown, and thermal degradation.
Physical mineral shields offer immediate, broad photostability with minimal irritation potential, while next-generation photostable organic filters offer weightless, invisible finishes on deeper skin tones.`,
    relatedProducts: [
      { name: 'Beauty of Joseon Relief Sun: Rice + Probiotics', path: '/shop?search=joseon' },
    ],
  },
  {
    id: 6,
    title: 'Cold-Process Micro-Extraction: Preserving Botanical Polyphenols',
    category: 'Formulations',
    excerpt:
      'How high-temperature decoctions denature volatile bioactive botanicals, and why supercritical CO2 and ultrasound micro-extraction yield higher potency.',
    readTime: '5 min read',
    date: 'Sep 29, 2026',
    author: 'Dispensary Lab Team',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    featured: false,
    content: `Botanical bioactives—such as green tea epigallocatechin gallate (EGCG), Centella asiatica madecassoside, and licorice root glabridin—are inherently thermo-labile.
Our dispensary extraction protocol relies on gentle supercritical cold processing to maintain 98.4% intact polyphenol structures.`,
    relatedProducts: [
      { name: 'Beauty of Joseon Glow Serum : Propolis + Niacinamide', path: '/shop?search=glow' },
    ],
  },
];

const CATEGORIES = ['All', 'Dermatology', 'Ingredients', 'Formulations', 'Routines'];

export default function BlogPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);

  const filteredArticles = ARTICLES.filter((article) => {
    const matchesCategory =
      selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = ARTICLES.find((a) => a.featured) || ARTICLES[0];

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-6 sm:py-10 md:py-14">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs items={[{ label: t('blog.breadcrumb') || 'Blog & Journal' }]} />
        </div>

        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDF2F4] text-[#E0567A] text-[11px] font-semibold tracking-wider uppercase mb-3 border border-[#E0567A]/20">
            <BookOpen size={13} />
            <span>{t('blog.badge') || 'Clinical Monographs & Botanical Science'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F2520] mb-3 sm:mb-4 tracking-tight">
            {t('blog.title_part1') || 'The Dermal'}{' '}
            <span className="italic font-serif text-[#E0567A]">{t('blog.title_part2') || 'Compendium'}</span>
          </h1>
          <p className="text-sm sm:text-base text-[#5A6358] leading-relaxed max-w-2xl mx-auto">
            {t('blog.subtitle') || 'Authoritative dermatological monographs, cellular research digests, and evidence-backed botanical formulating standards from our dispensary chemists.'}
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#ECE8DE]">
          {/* Categories */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1F2520] text-white shadow-xs'
                    : 'bg-white border border-[#ECE8DE] text-[#5A6358] hover:text-[#1F2520] hover:border-[#1F2520]/40'
                }`}
              >
                {cat === 'All' ? (t('common.all') || 'All') : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C9388]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, ingredients..."
              className="w-full pl-9 pr-8 py-2 rounded-full bg-white border border-[#ECE8DE] text-xs text-[#1F2520] placeholder-[#8C9388] focus:outline-none focus:border-[#E0567A] focus:ring-1 focus:ring-[#E0567A]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C9388] hover:text-[#1F2520]"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Featured Article Hero (When showing all and no search query) */}
        {selectedCategory === 'All' && !searchQuery && featuredArticle && (
          <div className="mb-12 rounded-3xl bg-white border border-[#ECE8DE] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)] transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#FDF2F4] text-[#E0567A] text-[11px] font-semibold tracking-wider uppercase border border-[#E0567A]/20">
                      Featured Monograph
                    </span>
                    <span className="text-xs text-[#8C9388] flex items-center gap-1">
                      <Clock size={12} />
                      {featuredArticle.readTime}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-3xl font-normal text-[#1F2520] mb-3 leading-snug">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-sm text-[#5A6358] leading-relaxed mb-6 font-normal">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#ECE8DE] mb-5">
                    <span className="text-xs font-medium text-[#7A8578]">{featuredArticle.author}</span>
                    <span className="text-xs text-[#8C9388]">{featuredArticle.date}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveArticle(featuredArticle)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1F2520] hover:bg-[#E0567A] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Read Full Monograph</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#F4F1EA] relative min-h-[260px] lg:min-h-full overflow-hidden">
                <img
                  src={resolveImageUrl(featuredArticle.image)}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  onError={(e) => handleImageError(e, FALLBACK_IMAGE)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl border border-[#ECE8DE] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
              onClick={() => setActiveArticle(article)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#F4F1EA]">
                <img
                  src={resolveImageUrl(article.image)}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => handleImageError(e, FALLBACK_IMAGE)}
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-[#1F2520] shadow-2xs border border-white/40">
                  {article.category}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
                  <Clock size={10} />
                  {article.readTime}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-[17px] sm:text-lg font-semibold text-[#1F2520] group-hover:text-[#E0567A] transition-colors mb-2 line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#5A6358] line-clamp-3 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-[#F0ECE3] flex items-center justify-between text-xs text-[#8C9388]">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#8C9388]" />
                    {article.date}
                  </span>
                  <span className="text-[#E0567A] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Read</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty Search Result */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#ECE8DE] p-8">
            <BookOpen size={36} className="mx-auto text-[#8C9388] mb-3" />
            <h3 className="font-serif text-xl font-semibold text-[#1F2520] mb-2">
              No Monographs Found
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6358] max-w-md mx-auto mb-5">
              We couldn&apos;t find any articles matching &ldquo;{searchQuery}&rdquo;. Try another
              ingredient or browsing by category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-5 py-2 rounded-full bg-[#1F2520] text-white text-xs font-semibold cursor-pointer hover:bg-[#E0567A] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Newsletter / Skincare Consultation Callout */}
        <div className="mt-14 rounded-3xl bg-[#1F2520] text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-md">
          <div className="relative z-10 max-w-xl mx-auto">
            <span className="text-[11px] tracking-[0.16em] uppercase text-[#DCE2DA] block mb-2 font-medium">
              DISPENSARY BULLETIN
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white mb-3">
              Receive Evidence-Based Skincare Monographs
            </h3>
            <p className="text-xs sm:text-sm text-[#DCE2DA] mb-6 leading-relaxed">
              Bi-weekly technical reviews, ingredient synergy charts, and early access to clinical batch
              releases. No promotional spam.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to the Dispensary Bulletin!');
              }}
              className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 text-xs focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#E0567A] hover:bg-[#D4476C] text-white text-xs font-semibold tracking-wide transition-colors whitespace-nowrap cursor-pointer shadow-xs"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Full Article Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1200] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#ECE8DE] p-6 sm:p-8 relative animate-[scaleUp_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF9F5] border border-[#ECE8DE] flex items-center justify-center text-[#5A6358] hover:text-[#1F2520] cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            {/* Category & Read Time */}
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-[#FDF2F4] text-[#E0567A] text-[11px] font-semibold tracking-wider uppercase border border-[#E0567A]/20">
                {activeArticle.category}
              </span>
              <span className="text-xs text-[#8C9388] flex items-center gap-1">
                <Clock size={12} />
                {activeArticle.readTime}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F2520] mb-3 leading-snug">
              {activeArticle.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-[#8C9388] pb-4 mb-5 border-b border-[#ECE8DE]">
              <span className="font-medium text-[#7A8578]">{activeArticle.author}</span>
              <span>•</span>
              <span>{activeArticle.date}</span>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-[16/9] mb-6 bg-[#F4F1EA]">
              <img
                src={resolveImageUrl(activeArticle.image)}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, FALLBACK_IMAGE)}
              />
            </div>

            <div className="prose prose-sm max-w-none text-[#5A6358] leading-relaxed whitespace-pre-line mb-8">
              {activeArticle.content}
            </div>

            {/* Related Dispensary Products */}
            {activeArticle.relatedProducts && activeArticle.relatedProducts.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE]">
                <h4 className="font-serif text-sm font-semibold text-[#1F2520] mb-2.5 flex items-center gap-2">
                  <FlaskConical size={14} className="text-[#E0567A]" />
                  <span>Related Formulations in Dispensary</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeArticle.relatedProducts.map((p) => (
                    <Link
                      key={p.name}
                      to={p.path}
                      onClick={() => setActiveArticle(null)}
                      className="px-3 py-1.5 rounded-full bg-white border border-[#ECE8DE] hover:border-[#1F2520] text-xs font-medium text-[#1F2520] transition-colors"
                    >
                      {p.name} →
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
