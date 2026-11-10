import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Check,
  TrendingUp,
  Bookmark,
  LayoutGrid,
  List,
  ThumbsUp,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { resolveImageUrl, handleImageError, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUrl';

const FALLBACK_IMAGE = DEFAULT_FALLBACK_IMAGE;

const ARTICLES = [
  {
    id: 1,
    title: 'The Dermal Barrier Architecture: Why Acid Mantle pH Matters',
    category: 'Dermatology',
    excerpt:
      'How the stratum corneum and intercellular lipids protect against pathogens and dehydration through physiological acidity buffering.',
    readTime: '4 min read',
    date: 'Nov 3, 2026',
    author: 'Dr. S. Vance, Formulation Chemist',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    featured: true,
    trending: true,
    trendingRank: 1,
    tags: ['AcidMantle', 'BarrierRepair', 'pHCalibration'],
    keyTakeaway: 'Maintaining skin acidity between pH 4.7 – 5.5 preserves the essential enzymes responsible for natural ceramide production.',
    content: `The human stratum corneum is frequently conceptualized as a biological brick wall: corneocyte protein envelopes represent the bricks, embedded within a continuous multi-lamellar lipid matrix comprised of ceramides, cholesterol, and free fatty acids.

When the surface pH rises above 5.5 due to harsh surfactant cleansing or alkaline tap water exposure, two critical enzymatic shifts occur:
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
      'A practical guide to cycling Vitamin C, retinoids, and hydroxy acids for optimal clinical efficacy without chronic erythema.',
    readTime: '3 min read',
    date: 'Oct 28, 2026',
    author: 'Elena Rostova, Dermal Specialist',
    image: 'https://images.unsplash.com/photo-1608248597359-5433246872a9?auto=format&fit=crop&w=800&q=80',
    featured: false,
    trending: true,
    trendingRank: 2,
    tags: ['ActiveCycling', 'Retinoids', 'VitaminC'],
    keyTakeaway: 'Reserve acidic antioxidants for morning defense and cellular retinoid repair for nightly circadian cycles.',
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
    title: 'The Synergistic Trinity: Niacinamide, Azelaic Acid & Centella',
    category: 'Ingredients',
    excerpt:
      'How combining Vitamin B3 with pharmaceutical botanical extracts calms reactive erythema and normalizes follicular keratinization.',
    readTime: '3 min read',
    date: 'Oct 20, 2026',
    author: 'Dispensary Lab Panel',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    featured: false,
    trending: true,
    trendingRank: 3,
    tags: ['Niacinamide', 'AzelaicAcid', 'Centella'],
    keyTakeaway: 'Combining 10% Azelaic Acid with 5% Niacinamide inhibits tyrosinase while suppressing inflammatory cytokine cascades.',
    content: `Niacinamide (Nicotinamide) is an essential precursor to NAD+ and NADP+ coenzymes involved in ATP synthesis and cellular DNA repair. When paired with 10% Azelaic Acid and Centella Asiatica titrated extract, the combination targets multiple pathways of cutaneous redness:
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
      'How varying Dalton molecular weights hydrate skin layers from surface moisture shield down to deep intercellular reservoirs.',
    readTime: '3 min read',
    date: 'Oct 15, 2026',
    author: 'Dispensary Lab Panel',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    featured: false,
    tags: ['HyaluronicAcid', 'MolecularWeight', 'DeepHydration'],
    keyTakeaway: 'Oligo-hyaluronan penetrates to viable epidermal layers while high-molecular polymers lock exterior water loss.',
    content: `Hyaluronic acid molecules behave fundamentally differently depending on their Dalton molecular mass:
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
      'Comparing non-nano zinc shields with modern organic photostable filters under conditions of warm tropical humidity and perspiration.',
    readTime: '3 min read',
    date: 'Oct 08, 2026',
    author: 'Dr. S. Vance, Formulation Chemist',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    featured: false,
    tags: ['SunProtection', 'UVFilters', 'TropicalDefense'],
    keyTakeaway: 'Non-nano zinc reflects UV rays without chemical sensitization, ideal for rosacea and heat-reactive skin types.',
    content: `Sunscreen formulations in tropical climates face unique environmental stresses: perspiration, elevated sebum secretion, and high ambient humidity. Non-nano Zinc Oxide provides exceptional photostability without systemic absorption, while modern hybrid organic filters deliver weightless cosmetic elegance without a white cast.`,
    relatedProducts: [
      { name: 'Beauty of Joseon Relief Sun: Rice + Probiotics', path: '/shop?search=joseon' },
    ],
  },
  {
    id: 6,
    title: 'Cold-Process Micro-Extraction: Preserving Botanical Polyphenols',
    category: 'Formulations',
    excerpt:
      'Why low-temperature supercritical extraction protects volatile botanical nutrients from denaturation.',
    readTime: '3 min read',
    date: 'Sep 29, 2026',
    author: 'Dispensary Lab Panel',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    featured: false,
    tags: ['SupercriticalExtraction', 'Antioxidants', 'BotanicalPurity'],
    keyTakeaway: 'Heat-free processing preserves up to 94% of antioxidant polyphenols that conventional distillation destroys.',
    content: `Botanical bioactives like green tea polyphenols, camellia flavonoids, and madecassoside are thermodynamically unstable. Conventional boiling degrades up to 60% of active antioxidants. Our dispensary cold processing guarantees maximum bioactive retention.`,
    relatedProducts: [
      { name: 'Beauty of Joseon Glow Serum : Propolis + Niacinamide', path: '/shop?search=glow' },
    ],
  },
];

const CATEGORIES = ['All', 'Dermatology', 'Ingredients', 'Formulations', 'Routines'];

const POPULAR_TAGS = [
  'AcidMantle',
  'BarrierRepair',
  'VitaminC',
  'Niacinamide',
  'ActiveCycling',
  'SunProtection',
];

export default function BlogPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [likedArticle, setLikedArticle] = useState(false);

  const toggleBookmark = (id, e) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredArticles = ARTICLES.filter((article) => {
    if (showBookmarksOnly && !bookmarkedIds.includes(article.id)) {
      return false;
    }
    const matchesCategory =
      selectedCategory === 'All' || article.category === selectedCategory;
    const matchesTag =
      !selectedTag || (article.tags && article.tags.includes(selectedTag));
    const matchesSearch =
      !searchQuery.trim() ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.tags && article.tags.some((tg) => tg.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesTag && matchesSearch;
  });

  const featuredArticle = ARTICLES.find((a) => a.featured) || ARTICLES[0];
  const trendingArticles = ARTICLES.filter((a) => a.trending).sort(
    (a, b) => (a.trendingRank || 99) - (b.trendingRank || 99)
  );

  const handleShare = (article) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (subscribedEmail) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setSubscribedEmail('');
      }, 4000);
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 md:py-16 select-none animate-[fadeIn_0.4s_ease-out]">
      <div className="container">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F2520] tracking-tight leading-tight mb-4">
            {t('blog.title_part1') || 'The Dermal'}{' '}
            <span className="italic font-serif text-[#71856B]">
              {t('blog.title_part2') || 'Compendium'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#5A6358] max-w-lg mx-auto leading-relaxed">
            Evidence-based skincare monographs, cellular ingredient synergies, and clinical barrier repair protocols.
          </p>
        </div>

        {/* NEW SECTION: Trending Monographs Ranked Strip */}
        <div className="mb-12 rounded-3xl bg-white border border-[#ECE8DE] p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#71856B]" />
              <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1F2520]">
                Trending Clinical Research
              </h3>
            </div>
            <span className="text-[11px] text-[#8C9388] hidden sm:inline">
              Most referenced by dispensary clients
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] hover:border-[#71856B]/40 hover:bg-white hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-serif text-base font-bold text-[#71856B]">
                      0{art.trendingRank}
                    </span>
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-[#8C9388]">
                      {art.category}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-[#1F2520] group-hover:text-[#71856B] transition-colors line-clamp-2 leading-snug mb-2">
                    {art.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#8C9388] pt-2 border-t border-[#ECE8DE]/60">
                  <span>{art.readTime}</span>
                  <span className="text-[#71856B] font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Explore</span>
                    <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Chips & Live Search Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-[#ECE8DE]">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
            {CATEGORIES.map((cat) => {
              const count =
                cat === 'All'
                  ? ARTICLES.length
                  : ARTICLES.filter((a) => a.category === cat).length;
              const isActive = selectedCategory === cat && !showBookmarksOnly;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowBookmarksOnly(false);
                  }}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#1F2520] text-white shadow-xs ring-2 ring-[#71856B]/20 scale-102'
                      : 'bg-white border border-[#ECE8DE] text-[#5A6358] hover:text-[#1F2520] hover:border-[#1F2520]/40 hover:bg-[#FAF9F5]'
                  }`}
                >
                  <span>{cat === 'All' ? (t('common.all') || 'All') : cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#FAF9F5] text-[#8C9388]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Bookmarks Filter Pill */}
            {bookmarkedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                className={`px-3.5 py-2 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  showBookmarksOnly
                    ? 'bg-[#71856B] text-white shadow-xs'
                    : 'bg-white border border-[#ECE8DE] text-[#71856B] hover:border-[#71856B]'
                }`}
              >
                <Bookmark size={12} />
                <span>Saved ({bookmarkedIds.length})</span>
              </button>
            )}
          </div>

          {/* Search Box & View Mode Toggle */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {/* View Mode Toggle Buttons */}
            <div className="inline-flex items-center p-1 rounded-full bg-white border border-[#ECE8DE] shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#1F2520] text-white' : 'text-[#8C9388] hover:text-[#1F2520]'
                }`}
                title="Grid view"
                aria-label="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#1F2520] text-white' : 'text-[#8C9388] hover:text-[#1F2520]'
                }`}
                title="List view"
                aria-label="List view"
              >
                <List size={14} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 md:w-72">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C9388] pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search active, topic, author..."
                className="w-full pl-9 pr-8 py-2 rounded-full bg-white border border-[#ECE8DE] text-xs text-[#1F2520] placeholder-[#8C9388] focus:outline-none focus:border-[#71856B] focus:ring-2 focus:ring-[#71856B]/15 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C9388] hover:text-[#1F2520] transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Popular Tags Quick Filter Row */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-1 text-xs text-[#8C9388]">
          <span className="flex items-center gap-1 shrink-0 font-medium text-[#1F2520]">
            <Tag size={12} className="text-[#71856B]" />
            <span>Topics:</span>
          </span>
          {POPULAR_TAGS.map((tg) => {
            const isTagActive = selectedTag === tg;
            return (
              <button
                key={tg}
                type="button"
                onClick={() => setSelectedTag(isTagActive ? '' : tg)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isTagActive
                    ? 'bg-[#71856B] text-white'
                    : 'bg-white border border-[#ECE8DE] text-[#5A6358] hover:border-[#71856B] hover:text-[#1F2520]'
                }`}
              >
                #{tg}
              </button>
            );
          })}
          {selectedTag && (
            <button
              type="button"
              onClick={() => setSelectedTag('')}
              className="text-[11px] text-[#C04A4A] hover:underline whitespace-nowrap ml-1 cursor-pointer"
            >
              Clear topic
            </button>
          )}
        </div>

        {/* Featured Editorial Monograph (Only when 'All' is active, no search, no tag) */}
        {selectedCategory === 'All' && !searchQuery && !selectedTag && !showBookmarksOnly && featuredArticle && (
          <div
            className="group mb-12 sm:mb-14 rounded-3xl bg-white border border-[#ECE8DE] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(31,37,32,0.08)] hover:-translate-y-1 transition-all duration-400 cursor-pointer"
            onClick={() => setActiveArticle(featuredArticle)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
              <div className="lg:col-span-7 p-7 sm:p-10 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#EEF2EB] text-[#71856B] text-[10.5px] font-bold tracking-wider uppercase border border-[#71856B]/25">
                      Featured Monograph
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF9F5] text-[#5A6358] text-[11px] font-medium border border-[#ECE8DE]">
                      {featuredArticle.category}
                    </span>
                    <span className="text-xs text-[#8C9388] flex items-center gap-1 ml-auto">
                      <Clock size={12} />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-normal text-[#1F2520] group-hover:text-[#71856B] transition-colors mb-3 leading-[1.25]">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#5A6358] leading-relaxed mb-6 font-normal">
                    {featuredArticle.excerpt}
                  </p>

                  {/* Tags */}
                  {featuredArticle.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {featuredArticle.tags.map((tg) => (
                        <span
                          key={tg}
                          className="text-[10.5px] px-2.5 py-0.5 rounded-full bg-[#FAF9F5] text-[#71856B] border border-[#ECE8DE]"
                        >
                          #{tg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-[#ECE8DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-[#5A6358]">
                    <div className="w-7 h-7 rounded-full bg-[#EEF2EB] text-[#71856B] flex items-center justify-center font-bold text-[11px]">
                      {featuredArticle.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-[#1F2520]">{featuredArticle.author}</div>
                      <div className="text-[10px] text-[#8C9388]">{featuredArticle.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(featuredArticle.id, e)}
                      className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
                        bookmarkedIds.includes(featuredArticle.id)
                          ? 'bg-[#71856B] text-white border-[#71856B]'
                          : 'bg-white border-[#ECE8DE] text-[#8C9388] hover:text-[#1F2520]'
                      }`}
                      title="Save article"
                      aria-label="Save article"
                    >
                      <Bookmark size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveArticle(featuredArticle);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#1F2520] group-hover:bg-[#71856B] text-white text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <span>Read Full Monograph</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#F4F1EA] relative min-h-[280px] lg:min-h-full overflow-hidden">
                <img
                  src={resolveImageUrl(featuredArticle.image)}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                  loading="lazy"
                  onError={(e) => handleImageError(e, FALLBACK_IMAGE)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Article Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-14">
            {filteredArticles.map((article, idx) => (
              <article
                key={article.id}
                className="bg-white rounded-3xl border border-[#ECE8DE] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(31,37,32,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer"
                onClick={() => setActiveArticle(article)}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* Thumbnail with Category Overlay */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F4F1EA]">
                  <img
                    src={resolveImageUrl(article.image)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                    loading="lazy"
                    onError={(e) => handleImageError(e, FALLBACK_IMAGE)}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#71856B] text-[10px] font-bold tracking-wider uppercase shadow-2xs border border-[#ECE8DE]/60">
                      {article.category}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(article.id, e)}
                    className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                      bookmarkedIds.includes(article.id)
                        ? 'bg-[#71856B] text-white'
                        : 'bg-white/80 text-[#8C9388] hover:text-[#1F2520] hover:bg-white'
                    }`}
                    aria-label="Bookmark article"
                  >
                    <Bookmark size={13} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#8C9388] mb-2.5">
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <Calendar size={12} className="text-[#8C9388]" />
                        {article.date}
                      </span>
                      <span className="text-[11px] flex items-center gap-1">
                        <Clock size={11} />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-semibold text-[#1F2520] group-hover:text-[#71856B] transition-colors mb-2.5 line-clamp-2 leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-[#5A6358] line-clamp-2 leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F0ECE3] flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-[#7A8578] truncate max-w-[150px]">
                      {article.author.split(',')[0]}
                    </span>
                    <span className="text-[#71856B] font-semibold group-hover:text-[#1F2520] group-hover:translate-x-1 transition-all inline-flex items-center gap-1">
                      <span>Read</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Article Compact List View */}
        {viewMode === 'list' && (
          <div className="space-y-4 mb-14">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#ECE8DE] hover:border-[#71856B]/40 hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#F4F1EA] shrink-0">
                    <img
                      src={resolveImageUrl(article.image)}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#71856B]">
                        {article.category}
                      </span>
                      <span className="text-[11px] text-[#8C9388]">• {article.readTime}</span>
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1F2520] group-hover:text-[#71856B] transition-colors truncate">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#5A6358] line-clamp-1 mt-0.5">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs text-[#8C9388] hidden lg:inline">{article.date}</span>
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(article.id, e)}
                    className={`p-2 rounded-full border transition-colors cursor-pointer ${
                      bookmarkedIds.includes(article.id)
                        ? 'bg-[#71856B] text-white border-[#71856B]'
                        : 'bg-[#FAF9F5] border-[#ECE8DE] text-[#8C9388] hover:text-[#1F2520]'
                    }`}
                    aria-label="Save article"
                  >
                    <Bookmark size={13} />
                  </button>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#71856B] group-hover:translate-x-1 transition-transform">
                    <span>Read</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#ECE8DE] p-8 max-w-md mx-auto mb-14 shadow-xs">
            <BookOpen size={40} className="mx-auto text-[#8C9388] mb-3" />
            <h3 className="font-serif text-xl font-semibold text-[#1F2520] mb-2">
              No Monographs Found
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6358] mb-5 leading-relaxed">
              We couldn&apos;t find any articles matching your search or filters. Try adjusting your query or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedTag('');
                setShowBookmarksOnly(false);
              }}
              className="px-6 py-2.5 rounded-full bg-[#1F2520] hover:bg-[#71856B] text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Elevated Dispensary Bulletin Newsletter Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1F2520] to-[#2B352D] text-white p-8 sm:p-12 md:p-14 text-center relative overflow-hidden shadow-lg">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#71856B]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#71856B]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#C5D0C3] block mb-2.5 font-semibold">
              DISPENSARY BULLETIN
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white mb-3">
              Receive Evidence-Based Skincare Monographs
            </h3>
            <p className="text-xs sm:text-sm text-[#DCE2DA] mb-7 leading-relaxed font-normal">
              Bi-weekly technical reviews, ingredient synergy charts, and early access to clinical batch releases. No promotional spam.
            </p>

            {isSubscribed ? (
              <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-medium inline-flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
                <CheckCircle2 size={16} className="text-[#86EFAC]" />
                <span>Thank you! You are now subscribed to the Dispensary Bulletin.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  value={subscribedEmail}
                  onChange={(e) => setSubscribedEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-white text-white placeholder-white/60 text-xs focus:outline-none transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-white text-[#1F2520] hover:bg-[#EEF2EB] text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer shadow-md active:scale-95"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Full Article Reader Modal with Backdrop Blur & Key Takeaways */}
      {activeArticle && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1200] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#ECE8DE] p-6 sm:p-9 relative animate-[scaleUp_0.25s_ease-out] no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close & Share Actions */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-[#EEF2EB] text-[#71856B] text-[10.5px] font-bold tracking-wider uppercase border border-[#71856B]/25">
                {activeArticle.category}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleBookmark(activeArticle.id)}
                  className={`p-2 rounded-full border transition-colors cursor-pointer ${
                    bookmarkedIds.includes(activeArticle.id)
                      ? 'bg-[#71856B] text-white border-[#71856B]'
                      : 'bg-[#FAF9F5] border-[#ECE8DE] text-[#5A6358] hover:text-[#1F2520]'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleShare(activeArticle)}
                  className="p-2 rounded-full bg-[#FAF9F5] border border-[#ECE8DE] text-[#5A6358] hover:text-[#1F2520] transition-colors cursor-pointer"
                  title="Copy link"
                  aria-label="Share article"
                >
                  {copiedLink ? <Check size={14} className="text-[#71856B]" /> : <Share2 size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="p-2 rounded-full bg-[#FAF9F5] border border-[#ECE8DE] text-[#5A6358] hover:text-[#1F2520] transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F2520] mb-3 leading-snug">
              {activeArticle.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-[#8C9388] pb-4 mb-5 border-b border-[#ECE8DE]">
              <span className="font-medium text-[#7A8578]">{activeArticle.author}</span>
              <span>•</span>
              <span>{activeArticle.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={11} /> {activeArticle.readTime}
              </span>
            </div>

            {/* Key Clinical Takeaway Callout */}
            {activeArticle.keyTakeaway && (
              <div className="p-4 rounded-2xl bg-[#EEF2EB] border border-[#71856B]/25 mb-6 text-xs text-[#1F2520]">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#71856B] text-[10.5px] mb-1">
                  <CheckCircle2 size={13} />
                  <span>Clinical Summary</span>
                </div>
                <p className="leading-relaxed font-medium">{activeArticle.keyTakeaway}</p>
              </div>
            )}

            <div className="rounded-2xl overflow-hidden aspect-[16/9] mb-6 bg-[#F4F1EA] shadow-xs">
              <img
                src={resolveImageUrl(activeArticle.image)}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, FALLBACK_IMAGE)}
              />
            </div>

            <div className="prose prose-sm max-w-none text-[#5A6358] leading-relaxed whitespace-pre-line mb-8 text-xs sm:text-sm">
              {activeArticle.content}
            </div>

            {/* Interactive Feedback & Likes */}
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE] mb-6 flex items-center justify-between text-xs">
              <span className="text-[#5A6358]">Was this clinical monograph informative?</span>
              <button
                type="button"
                onClick={() => setLikedArticle(!likedArticle)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors cursor-pointer border ${
                  likedArticle
                    ? 'bg-[#71856B] text-white border-[#71856B]'
                    : 'bg-white text-[#1F2520] border-[#ECE8DE] hover:border-[#71856B]'
                }`}
              >
                <ThumbsUp size={12} />
                <span>{likedArticle ? 'Thank you!' : 'Helpful'}</span>
              </button>
            </div>

            {/* Related Formulations in Catalog */}
            {activeArticle.relatedProducts && activeArticle.relatedProducts.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#ECE8DE]">
                <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#1F2520] mb-2.5 flex items-center gap-2">
                  <FlaskConical size={14} className="text-[#71856B]" />
                  <span>Related Formulations in Dispensary</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeArticle.relatedProducts.map((p) => (
                    <Link
                      key={p.name}
                      to={p.path}
                      onClick={() => setActiveArticle(null)}
                      className="px-3.5 py-1.5 rounded-full bg-white border border-[#ECE8DE] hover:border-[#71856B] text-xs font-medium text-[#1F2520] hover:text-[#71856B] transition-colors shadow-2xs no-underline"
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
