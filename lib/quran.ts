import surahCatalogJson from '@/data/quran/surahs.json';
import verseCatalogJson from '@/data/quran/verses.json';
import turkishMealCatalogJson from '@/data/quran/meal-tr.json';

export type RevelationType = 'Meccan' | 'Medinan';

export interface SurahRecord {
  number: number;
  ayahCount: number;
  startOffset: number;
  nameArabic: string;
  nameTransliterated: string;
  nameEnglish: string;
  revelationType: RevelationType;
  revelationOrder: number;
  rukuCount: number;
}

export interface VerseRecord {
  surah: number;
  ayah: number;
  text: string;
}

export interface MealRecord {
  id: number;
  surah: number;
  ayah: number;
  text: string;
  footnotes: string;
}

export interface QuranLicense {
  name: string;
  url: string;
  attribution: string;
  verbatimOnly: boolean;
}

interface SurahCatalog {
  corpus: string;
  source: string;
  license: QuranLicense;
  records: SurahRecord[];
}

interface VerseCatalog {
  corpus: string;
  source: string;
  license: QuranLicense;
  copyrightNotice: string;
  records: VerseRecord[];
}

interface TurkishMealTranslation {
  key: string;
  version: string;
  title: string;
  description: string;
  last_update: number;
}

interface RepublishingTerms {
  url: string;
  attribution: string;
  publisher: string;
  verbatimOnly: boolean;
  versionRequired: boolean;
  sourceLinkRequired: boolean;
}

interface TurkishMealCatalog {
  corpus: string;
  source: string;
  translation: TurkishMealTranslation;
  republishingTerms: RepublishingTerms;
  records: MealRecord[];
}

const surahCatalog = surahCatalogJson as SurahCatalog;
const verseCatalog = verseCatalogJson as VerseCatalog;
const turkishMealCatalog = turkishMealCatalogJson as TurkishMealCatalog;

export const quranLicense = verseCatalog.license;
export const quranCopyrightNotice = verseCatalog.copyrightNotice;
export const turkishMealMetadata = turkishMealCatalog.translation;
export const turkishMealTerms = turkishMealCatalog.republishingTerms;

function normalizeSlug(value: string) {
  return value
    .toLocaleLowerCase('en-US')
    .replace(/['’]/gu, '')
    .replace(/aa/gu, 'a')
    .replace(/ee/gu, 'i')
    .replace(/oo/gu, 'u')
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '');
}

export function getSurahSlug(surah: SurahRecord) {
  if (surah.number === 1) return 'fatiha';
  return normalizeSlug(surah.nameTransliterated);
}

export function getAllSurahs() {
  return surahCatalog.records;
}

export function getSurahByNumber(number: number) {
  if (!Number.isInteger(number) || number < 1 || number > 114) return undefined;
  return surahCatalog.records[number - 1];
}

export function getSurahBySlug(slug: string) {
  return surahCatalog.records.find((surah) => getSurahSlug(surah) === slug);
}

export function getSurahHref(surah: SurahRecord) {
  return `/sure/${getSurahSlug(surah)}`;
}

export function getVersesForSurah(surahNumber: number) {
  const surah = getSurahByNumber(surahNumber);
  if (!surah) return [];
  return verseCatalog.records.slice(surah.startOffset, surah.startOffset + surah.ayahCount);
}

export function getVerse(surahNumber: number, ayahNumber: number) {
  const surah = getSurahByNumber(surahNumber);
  if (!surah || ayahNumber < 1 || ayahNumber > surah.ayahCount) return undefined;
  return verseCatalog.records[surah.startOffset + ayahNumber - 1];
}

export function getTurkishMealForSurah(surahNumber: number) {
  const surah = getSurahByNumber(surahNumber);
  if (!surah) return [];
  return turkishMealCatalog.records.slice(surah.startOffset, surah.startOffset + surah.ayahCount);
}

export function getTurkishMeal(surahNumber: number, ayahNumber: number) {
  const surah = getSurahByNumber(surahNumber);
  if (!surah || ayahNumber < 1 || ayahNumber > surah.ayahCount) return undefined;
  return turkishMealCatalog.records[surah.startOffset + ayahNumber - 1];
}

export function getAdjacentSurahs(surahNumber: number) {
  return {
    previous: getSurahByNumber(surahNumber - 1),
    next: getSurahByNumber(surahNumber + 1),
  };
}

export function getQuranStats() {
  return {
    surahCount: surahCatalog.records.length,
    verseCount: verseCatalog.records.length,
    turkishMealCount: turkishMealCatalog.records.length,
    source: verseCatalog.source,
  };
}
