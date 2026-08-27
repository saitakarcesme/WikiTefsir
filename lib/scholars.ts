export const scholars = {
  taberi: {
    name: 'Al-Tabari',
    arabic: 'محمد بن جرير الطبري',
    dates: '3rd–4th centuries AH',
    place: 'Tabaristan · Baghdad',
    field: 'Tafsir, history and jurisprudence',
    work: 'Jami al-Bayan an Ta’wil Ay al-Quran',
    initials: 'T',
    commentaryCount: 6236,
    summary: 'An early Sunni exegete whose work brings together transmitted reports with linguistic and recitation analysis.',
  },
  'ibn-kesir': {
    name: 'Ibn Kathir',
    arabic: 'إسماعيل بن عمر بن كثير',
    dates: '8th century AH',
    place: 'Busra · Damascus',
    field: 'Tafsir, hadith and history',
    work: 'Tafsir al-Quran al-Azim',
    initials: 'IK',
    commentaryCount: 6236,
    summary: 'A Sunni exegete known for explaining the Quran through the Quran, hadith and reports from the early generations.',
  },
  kurtubi: {
    name: 'Al-Qurtubi',
    arabic: 'محمد بن أحمد القرطبي',
    dates: '7th century AH',
    place: 'Cordoba · Egypt',
    field: 'Tafsir and jurisprudence',
    work: 'Al-Jami li-Ahkam al-Quran',
    initials: 'Q',
    commentaryCount: 6234,
    summary: 'An Andalusian Sunni exegete whose work extensively treats legal rulings, language and transmitted reports.',
  },
} as const;

export type ScholarSlug = keyof typeof scholars;

export function getAllScholars() {
  return Object.entries(scholars).map(([slug, scholar]) => ({ slug: slug as ScholarSlug, ...scholar }));
}

export function getScholarBySlug(slug: string) {
  return scholars[slug as ScholarSlug];
}

export function getScholarHref(slug: ScholarSlug) {
  return `/scholars/${slug}`;
}
