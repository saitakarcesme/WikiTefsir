import hadithCatalogJson from '@/data/hadith/hadeethenc-en.json';
import turkishHadithCatalogJson from '@/data/hadith/hadeethenc-tr.json';
import type { Locale } from '@/lib/locale';

export interface HadithCategory {
  id: string;
  title: string;
  hadeeths_count: string;
  parent_id: string | null;
}

export interface HadithRecord {
  id: string;
  title: string;
  hadeeth: string;
  attribution: string;
  grade: string;
  explanation: string;
  hints: string[];
  categories: string[];
  translations: string[];
  hadeeth_intro: string | null;
  hadeeth_ar: string;
  hadeeth_intro_ar: string | null;
  explanation_ar: string;
  hints_ar: string[];
  words_meanings_ar: unknown[];
  attribution_ar: string;
  grade_ar: string;
}

interface HadithTerms {
  url: string;
  attribution: string;
  publisher: string;
  verbatimOnly: boolean;
  versionRequired: boolean;
  sourceLinkRequired: boolean;
}

interface HadithCatalog {
  corpus: string;
  source: string;
  language: string;
  version: string;
  terms: HadithTerms;
  publicationFilter: {
    field: string;
    rule: string;
    sourceRecordCount: number;
    excludedRecordCount: number;
  };
  rootCategories: HadithCategory[];
  categories: HadithCategory[];
  records: HadithRecord[];
}

const catalog = hadithCatalogJson as HadithCatalog;
const turkishCatalog = turkishHadithCatalogJson as HadithCatalog;
const recordsById = new Map(catalog.records.map((record) => [record.id, record]));
const turkishRecordsById = new Map(turkishCatalog.records.map((record) => [record.id, record]));
const sharedRecordIds = new Set(catalog.records.flatMap((record) => turkishRecordsById.has(record.id) ? [record.id] : []));
const sharedEnglishRecords = catalog.records.filter((record) => sharedRecordIds.has(record.id));
const sharedTurkishRecords = turkishCatalog.records.filter((record) => sharedRecordIds.has(record.id));
const categoriesById = new Map(catalog.categories.map((category) => [category.id, category]));
const turkishCategoriesById = new Map(turkishCatalog.categories.map((category) => [category.id, category]));

export const hadithThemes = [
  'Worship & devotion', 'Character & manners', 'Family & home', 'Companions & community',
  'Neighbors & society', 'Knowledge & teaching', 'Governance & justice', 'Peace & agreements',
  'War & defense', 'Trade & wealth', 'Food, health & daily life', 'Hereafter & spiritual life',
  'General guidance',
] as const;
export type HadithTheme = typeof hadithThemes[number];

const themePatterns: Array<[HadithTheme, RegExp]> = [
  ['Worship & devotion', /prayer|salah|fast|ramadan|zak[aā]h|charity|hajj|pilgrimage|ablution|wudu|supplication|remembrance|mosque/iu],
  ['Character & manners', /manners|character|truth|lie|anger|humility|mercy|kindness|greeting|smile|patience|forgiv/iu],
  ['Family & home', /marriage|wife|wives|husband|child|children|parent|mother|father|kinship|relative|household|divorce/iu],
  ['Companions & community', /companion|ans[aā]r|muh[aā]jir|brother|community|congregation|people of the suffah|delegation/iu],
  ['Neighbors & society', /neighbor|guest|orphan|poor|needy|rights|society|road|public|sick person|funeral/iu],
  ['Knowledge & teaching', /knowledge|learn|teach|scholar|student|qur.?an|hadith|recitation|fatwa/iu],
  ['Governance & justice', /ruler|govern|leader|judge|judgment|justice|authority|obedience|caliph|office/iu],
  ['Peace & agreements', /peace|truce|treaty|covenant|agreement|protection|reconciliation|safe-conduct/iu],
  ['War & defense', /battle|war|fight|army|soldier|jihad|martyr|weapon|campaign|enemy/iu],
  ['Trade & wealth', /trade|sale|buy|wealth|money|debt|loan|usury|inheritance|property|market|wage/iu],
  ['Food, health & daily life', /food|eat|drink|medicine|illness|health|sleep|clothing|dress|clean|wash|travel|animal/iu],
  ['Hereafter & spiritual life', /death|grave|resurrection|paradise|hell|day of judgment|faith|belief|creed|destiny|angel/iu],
];

const themePatternsTr: Array<[HadithTheme, RegExp]> = [
  ['Worship & devotion', /namaz|salât|oruç|ramazan|zekât|sadaka|hac|umre|abdest|dua|zikir|mescid|ibadet/iu],
  ['Character & manners', /ahlak|edep|doğru|yalan|öfke|tevazu|merhamet|iyilik|selam|gülümse|sabır|aff/iu],
  ['Family & home', /evlilik|eş|hanım|koca|çocuk|anne|baba|akraba|aile|boşan/iu],
  ['Companions & community', /sahabe|ensar|muhacir|kardeş|cemaat|toplum|heyet/iu],
  ['Neighbors & society', /komşu|misafir|yetim|fakir|muhtaç|haklar|toplum|yol|hasta|cenaze/iu],
  ['Knowledge & teaching', /ilim|bilgi|öğren|öğret|âlim|alim|talebe|kur.?an|hadis|kıraat|fetva/iu],
  ['Governance & justice', /yönet|hükümdar|lider|hâkim|hakim|hüküm|adalet|otorite|itaat|halife/iu],
  ['Peace & agreements', /barış|sulh|antlaşma|anlaşma|ahit|eman|uzlaş/iu],
  ['War & defense', /savaş|cihad|ordu|asker|şehit|silah|sefer|düşman|müdafaa|savunma/iu],
  ['Trade & wealth', /ticaret|satış|alış|mal|para|borç|faiz|miras|mülk|pazar|ücret/iu],
  ['Food, health & daily life', /yemek|yiyecek|içmek|ilaç|hastalık|sağlık|uyku|elbise|temiz|yıka|yolculuk|hayvan/iu],
  ['Hereafter & spiritual life', /ölüm|kabir|diriliş|cennet|cehennem|kıyamet|iman|inanç|kader|melek|ahiret/iu],
];

export const hadithTerms = catalog.terms;
export const hadithVersion = catalog.version;

export function getAllHadiths() {
  return catalog.records;
}

// The bilingual directory intentionally exposes the intersection of the two
// independently published HadeethEnc corpora. This keeps record counts and
// stable IDs aligned without translating either source ourselves.
export function getAllHadithsForLocale(locale: Locale) { return locale === 'tr' ? sharedTurkishRecords : sharedEnglishRecords; }
export function getHadithByIdForLocale(id: string, locale: Locale) {
  if (!/^\d+$/u.test(id)) return undefined;
  if (!sharedRecordIds.has(id)) return undefined;
  return locale === 'tr' ? turkishRecordsById.get(id) : recordsById.get(id);
}
export function getHadithCategoriesForLocale(locale: Locale) { return locale === 'tr' ? turkishCatalog.categories : catalog.categories; }
export function getHadithStatsForLocale(locale: Locale) {
  const source = locale === 'tr' ? turkishCatalog : catalog;
  return { recordCount: sharedRecordIds.size, sourceRecordCount: source.publicationFilter.sourceRecordCount, excludedRecordCount: source.records.length - sharedRecordIds.size, categoryCount: source.categories.length, version: source.version, source: source.source };
}

export function getHadithById(id: string) {
  return /^\d+$/u.test(id) ? recordsById.get(id) : undefined;
}

export function getHadithHref(record: Pick<HadithRecord, 'id'>) {
  return `/hadith/${record.id}`;
}

export function getHadithCategories() {
  return catalog.categories;
}

export function getRootHadithCategories() {
  return catalog.rootCategories;
}

export function getCategoriesForHadith(record: HadithRecord) {
  return record.categories.flatMap((id) => {
    const category = categoriesById.get(id);
    return category ? [category] : [];
  });
}

export function getCategoriesForHadithLocale(record: HadithRecord, locale: Locale) {
  const source = locale === 'tr' ? turkishCategoriesById : categoriesById;
  return record.categories.flatMap((id) => {
    const category = source.get(id);
    return category ? [category] : [];
  });
}

export function getThemesForHadith(record: HadithRecord): HadithTheme[] {
  const categoryTitles = getCategoriesForHadith(record).map((category) => category.title).join(' ');
  const text = `${record.title} ${record.attribution} ${categoryTitles}`;
  const matches = themePatterns.flatMap(([theme, pattern]) => pattern.test(text) ? [theme] : []);
  return matches.length ? matches.slice(0, 3) : ['General guidance'];
}

export function getThemesForHadithLocale(record: HadithRecord, locale: Locale): HadithTheme[] {
  const categoryTitles = getCategoriesForHadithLocale(record, locale).map((category) => category.title).join(' ');
  const text = `${record.title} ${record.attribution} ${categoryTitles}`;
  const patterns = locale === 'tr' ? themePatternsTr : themePatterns;
  const matches = patterns.flatMap(([theme, pattern]) => pattern.test(text) ? [theme] : []);
  return matches.length ? matches.slice(0, 3) : ['General guidance'];
}

export function getHadithStats() {
  return {
    recordCount: catalog.records.length,
    sourceRecordCount: catalog.publicationFilter.sourceRecordCount,
    excludedRecordCount: catalog.publicationFilter.excludedRecordCount,
    categoryCount: catalog.categories.length,
    version: catalog.version,
    source: catalog.source,
  };
}
