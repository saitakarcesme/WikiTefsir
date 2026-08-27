import {
  getAllSurahs,
  getSurahByNumber,
  getSurahHref,
  getTurkishMealForSurah,
  getVerse,
  getVersesForSurah,
} from '@/lib/quran';
import { getAllHadiths, getHadithById, getHadithHref } from '@/lib/hadith';

export interface QuranSearchResult {
  type: 'Ayet' | 'Sure' | 'Hadis';
  title: string;
  description: string;
  href: string;
  language?: 'ar' | 'tr';
}

function normalize(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/gu, '')
    .replace(/[ٱأإآ]/gu, 'ا')
    .replace(/ى/gu, 'ي')
    .replace(/ـ/gu, '')
    .replace(/[’'`]/gu, '')
    .toLocaleLowerCase('tr-TR')
    .replace(/\s+/gu, ' ')
    .trim();
}

const referencePattern = /^(\d{1,3})\s*[:/]\s*(\d{1,3})$/u;
const hadithReferencePattern = /^(?:h|hadis)\s*[:#]?\s*(\d+)$/iu;
const searchableSurahs = getAllSurahs().map((surah) => ({
  surah,
  normalizedText: normalize(`${surah.number} ${surah.nameArabic} ${surah.nameTransliterated} ${surah.nameEnglish}`),
}));
const searchableVerses = getAllSurahs().flatMap((surah) => {
  const meanings = getTurkishMealForSurah(surah.number);
  return getVersesForSurah(surah.number).map((verse, index) => {
    const meaning = meanings[index];
    if (!meaning || meaning.surah !== verse.surah || meaning.ayah !== verse.ayah) {
      throw new Error(`Turkish meal search index mismatch at ${verse.surah}:${verse.ayah}`);
    }

    return {
      surah,
      verse,
      meaning,
      normalizedArabic: normalize(verse.text),
      normalizedTurkish: normalize(`${meaning.text} ${meaning.footnotes}`),
    };
  });
});
const searchableHadiths = getAllHadiths().map((record) => ({
  record,
  normalizedArabic: normalize(`${record.hadeeth_ar} ${record.explanation_ar}`),
  normalizedTurkish: normalize(`${record.title} ${record.hadeeth} ${record.explanation} ${record.hints.join(' ')} ${record.attribution}`),
}));

function describeSurah(number: number, ayahCount: number, revelationType: 'Meccan' | 'Medinan') {
  return `${number}. sure · ${ayahCount} ayet · ${revelationType === 'Meccan' ? 'Mekkî' : 'Medenî'}`;
}

function verseResult(surahNumber: number, ayahNumber: number): QuranSearchResult | undefined {
  const surah = getSurahByNumber(surahNumber);
  const verse = getVerse(surahNumber, ayahNumber);
  if (!surah || !verse) return undefined;

  return {
    type: 'Ayet',
    title: `${surah.nameTransliterated}, ${ayahNumber}. Ayet`,
    description: verse.text,
    href: `${getSurahHref(surah)}#ayet-${ayahNumber}`,
    language: 'ar',
  };
}

export function searchQuran(rawQuery: string, limit = 12): QuranSearchResult[] {
  const query = rawQuery.trim().slice(0, 160);
  const hadithReference = query.match(hadithReferencePattern);
  if (hadithReference) {
    const record = getHadithById(hadithReference[1]);
    return record ? [{
      type: 'Hadis',
      title: `Sahih Hadis #${record.id}`,
      description: record.title,
      href: getHadithHref(record),
      language: 'tr',
    }] : [];
  }
  const reference = query.match(referencePattern);

  if (reference) {
    const result = verseResult(Number(reference[1]), Number(reference[2]));
    return result ? [result] : [];
  }

  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 2) return [];

  const results: QuranSearchResult[] = [];

  for (const { surah, normalizedText } of searchableSurahs) {
    if (normalizedText.includes(normalizedQuery)) {
      results.push({
        type: 'Sure',
        title: surah.nameTransliterated,
        description: describeSurah(surah.number, surah.ayahCount, surah.revelationType),
        href: getSurahHref(surah),
      });
      if (results.length >= limit) return results;
    }
  }

  const hadithResults: QuranSearchResult[] = [];
  for (const { record, normalizedArabic, normalizedTurkish } of searchableHadiths) {
    const matchesArabic = normalizedArabic.includes(normalizedQuery);
    const matchesTurkish = normalizedTurkish.includes(normalizedQuery);
    if (!matchesArabic && !matchesTurkish) continue;
    hadithResults.push({
      type: 'Hadis',
      title: `Sahih Hadis #${record.id}`,
      description: matchesArabic ? record.hadeeth_ar : record.title,
      href: getHadithHref(record),
      language: matchesArabic ? 'ar' : 'tr',
    });
  }
  results.push(...hadithResults.slice(0, Math.min(6, limit - results.length)));

  for (const { surah, verse, meaning, normalizedArabic, normalizedTurkish } of searchableVerses) {
    const matchesArabic = normalizedArabic.includes(normalizedQuery);
    const matchesTurkish = normalizedTurkish.includes(normalizedQuery);
    if (!matchesArabic && !matchesTurkish) continue;
    results.push({
      type: 'Ayet',
      title: `${surah.nameTransliterated}, ${verse.ayah}. Ayet`,
      description: matchesArabic ? verse.text : meaning.text,
      href: `${getSurahHref(surah)}#ayet-${verse.ayah}`,
      language: matchesArabic ? 'ar' : 'tr',
    });
    if (results.length >= limit) return results;
  }

  if (results.length < limit) results.push(...hadithResults.slice(6, 6 + limit - results.length));

  return results;
}
