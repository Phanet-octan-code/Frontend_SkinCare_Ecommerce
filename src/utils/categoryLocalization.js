/**
 * Category Localization Utility
 * Dynamically resolves category names into English, Khmer, and Chinese.
 */

export const categoryNameMap = {
  'cleansers & washes': {
    en: 'Cleansers & Washes',
    km: 'ទឹកសម្អាត & ជែលលាងមុខ',
    zh: '洁面与卸妆',
  },
  'toners & essences': {
    en: 'Toners & Essences',
    km: 'ទឹកតប់ & អេសិន្ស',
    zh: '爽肤水与精华水',
  },
  'serums & ampoules': {
    en: 'Serums & Ampoules',
    km: 'សេរ៉ូម & អំពូលបំប៉ន',
    zh: '修护精华与安瓶',
  },
  'moisturizers & creams': {
    en: 'Moisturizers & Creams',
    km: 'គ្រីមផ្តល់សំណើម',
    zh: '保湿乳液与面霜',
  },
  'sunscreens & uv shields': {
    en: 'Sunscreens & UV Shields',
    km: 'ឡេការពារកម្ដៅថ្ងៃ',
    zh: '广谱防晒与隔离',
  },
  'exfoliants & peels': {
    en: 'Exfoliants & Peels',
    km: 'ផលិតផលជម្រុះកោសិកា',
    zh: '去角质与果酸',
  },
  'eye & lip care': {
    en: 'Eye & Lip Care',
    km: 'ថែរក្សាភ្នែក & បបូរមាត់',
    zh: '眼部与唇部护理',
  },
  'masks & treatments': {
    en: 'Masks & Treatments',
    km: 'ម៉ាស & ផលិតផលព្យាបាល',
    zh: '面膜与专研护理',
  },
};

export function getLocalizedCategoryName(category, language = 'en') {
  if (!category) return '';
  const rawName = typeof category === 'string' ? category : (category.name || category.raw_name || '');
  if (!rawName) return '';

  const lower = rawName.toLowerCase().trim();

  // 1. Direct match in dictionary
  for (const [key, mapping] of Object.entries(categoryNameMap)) {
    if (lower === key) {
      return mapping[language] || mapping.en || rawName;
    }
  }

  // 2. Substring & keyword matching
  if (lower.includes('cleanse') || lower.includes('wash')) {
    return categoryNameMap['cleansers & washes'][language] || rawName;
  }
  if (lower.includes('toner') || lower.includes('essence')) {
    return categoryNameMap['toners & essences'][language] || rawName;
  }
  if (lower.includes('serum') || lower.includes('ampoule')) {
    return categoryNameMap['serums & ampoules'][language] || rawName;
  }
  if (lower.includes('moistur') || lower.includes('cream')) {
    return categoryNameMap['moisturizers & creams'][language] || rawName;
  }
  if (lower.includes('sun') || lower.includes('uv') || lower.includes('shield') || lower.includes('spf')) {
    return categoryNameMap['sunscreens & uv shields'][language] || rawName;
  }
  if (lower.includes('exfoli') || lower.includes('peel') || lower.includes('scrub')) {
    return categoryNameMap['exfoliants & peels'][language] || rawName;
  }
  if (lower.includes('eye') || lower.includes('lip')) {
    return categoryNameMap['eye & lip care'][language] || rawName;
  }
  if (lower.includes('mask') || lower.includes('treat')) {
    return categoryNameMap['masks & treatments'][language] || rawName;
  }

  return rawName;
}
