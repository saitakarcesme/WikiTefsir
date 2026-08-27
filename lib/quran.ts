import surahCatalogJson from '@/data/quran/surahs.json';
import verseCatalogJson from '@/data/quran/verses.json';
import englishTranslationCatalogJson from '@/data/quran/translation-en.json';

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

export interface TranslationRecord {
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

interface EnglishTranslationMetadata {
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

interface EnglishTranslationCatalog {
  corpus: string;
  source: string;
  translation: EnglishTranslationMetadata;
  republishingTerms: RepublishingTerms;
  records: TranslationRecord[];
}

const surahCatalog = surahCatalogJson as SurahCatalog;
const verseCatalog = verseCatalogJson as VerseCatalog;
const englishTranslationCatalog = englishTranslationCatalogJson as EnglishTranslationCatalog;

export const quranLicense = verseCatalog.license;
export const quranCopyrightNotice = verseCatalog.copyrightNotice;
export const englishTranslationMetadata = englishTranslationCatalog.translation;
export const englishTranslationTerms = englishTranslationCatalog.republishingTerms;

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
  return `/surah/${getSurahSlug(surah)}`;
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

export function getEnglishTranslationForSurah(surahNumber: number) {
  const surah = getSurahByNumber(surahNumber);
  if (!surah) return [];
  return englishTranslationCatalog.records.slice(surah.startOffset, surah.startOffset + surah.ayahCount);
}

export function getEnglishTranslation(surahNumber: number, ayahNumber: number) {
  const surah = getSurahByNumber(surahNumber);
  if (!surah || ayahNumber < 1 || ayahNumber > surah.ayahCount) return undefined;
  return englishTranslationCatalog.records[surah.startOffset + ayahNumber - 1];
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
    englishTranslationCount: englishTranslationCatalog.records.length,
    source: verseCatalog.source,
  };
}
