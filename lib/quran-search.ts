import {
  getAllSurahs,
  getSurahByNumber,
  getSurahHref,
  getEnglishTranslationForSurah,
  getVerse,
  getVersesForSurah,
} from '@/lib/quran';
import { getAllHadiths, getHadithById, getHadithHref } from '@/lib/hadith';
import { getAllConcepts, getConceptHref } from '@/lib/concepts';
import { getAllPeople, getPersonHref } from '@/lib/people';

export interface QuranSearchResult {
  type: 'Verse' | 'Surah' | 'Hadith' | 'Concept' | 'Person';
  title: string;
  description: string;
  href: string;
  language?: 'ar' | 'en';
}

function normalize(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/gu, '')
    .replace(/[ٱأإآ]/gu, 'ا')
    .replace(/ى/gu, 'ي')
    .replace(/ـ/gu, '')
    .replace(/[’'`]/gu, '')
    .toLocaleLowerCase('en-US')
    .replace(/\s+/gu, ' ')
    .trim();
}

const referencePattern = /^(\d{1,3})\s*[:/]\s*(\d{1,3})$/u;
const hadithReferencePattern = /^(?:h|hadith)\s*[:#]?\s*(\d+)$/iu;
const searchableSurahs = getAllSurahs().map((surah) => ({
  surah,
  normalizedText: normalize(`${surah.number} ${surah.nameArabic} ${surah.nameTransliterated} ${surah.nameEnglish}`),
}));
const searchableConcepts = getAllConcepts().map((concept) => ({
  concept,
  normalizedText: normalize(`${concept.title} ${concept.arabic} ${concept.scope}`),
}));
const searchablePeople = getAllPeople().map((person) => ({
  person,
  normalizedText: normalize(`${person.name} ${person.arabic} ${person.role} ${person.introduction} ${person.narrative.map((stage) => `${stage.title} ${stage.summary}`).join(' ')}`),
}));
const searchableVerses = getAllSurahs().flatMap((surah) => {
  const meanings = getEnglishTranslationForSurah(surah.number);
  return getVersesForSurah(surah.number).map((verse, index) => {
    const meaning = meanings[index];
    if (!meaning || meaning.surah !== verse.surah || meaning.ayah !== verse.ayah) {
      throw new Error(`English translation search index mismatch at ${verse.surah}:${verse.ayah}`);
    }

    return {
      surah,
      verse,
      meaning,
      normalizedArabic: normalize(verse.text),
      normalizedEnglish: normalize(`${meaning.text} ${meaning.footnotes}`),
    };
  });
});
const searchableHadiths = getAllHadiths().map((record) => ({
  record,
  normalizedArabic: normalize(`${record.hadeeth_ar} ${record.explanation_ar}`),
  normalizedEnglish: normalize(`${record.title} ${record.hadeeth} ${record.explanation} ${record.hints.join(' ')} ${record.attribution}`),
}));

function describeSurah(number: number, ayahCount: number, revelationType: 'Meccan' | 'Medinan') {
  return `Surah ${number} · ${ayahCount} verses · ${revelationType}`;
}

function verseResult(surahNumber: number, ayahNumber: number): QuranSearchResult | undefined {
  const surah = getSurahByNumber(surahNumber);
  const verse = getVerse(surahNumber, ayahNumber);
  if (!surah || !verse) return undefined;

  return {
    type: 'Verse',
    title: `${surah.nameTransliterated}, verse ${ayahNumber}`,
    description: verse.text,
    href: `${getSurahHref(surah)}#verse-${ayahNumber}`,
    language: 'ar',
  };
}

export function searchQuran(rawQuery: string, limit = 12): QuranSearchResult[] {
  const query = rawQuery.trim().slice(0, 160);
  const hadithReference = query.match(hadithReferencePattern);
  if (hadithReference) {
    const record = getHadithById(hadithReference[1]);
    return record ? [{
      type: 'Hadith',
      title: `Authentic Hadith #${record.id}`,
      description: record.title,
      href: getHadithHref(record),
      language: 'en',
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

  for (const { person, normalizedText } of searchablePeople) {
    if (!normalizedText.includes(normalizedQuery)) continue;
    results.push({ type: 'Person', title: person.name, description: person.introduction, href: getPersonHref(person), language: 'en' });
    if (results.length >= limit) return results;
  }

  for (const { concept, normalizedText } of searchableConcepts) {
    if (!normalizedText.includes(normalizedQuery)) continue;
    results.push({
      type: 'Concept',
      title: concept.title,
      description: concept.scope,
      href: getConceptHref(concept),
      language: 'en',
    });
    if (results.length >= limit) return results;
  }

  for (const { surah, normalizedText } of searchableSurahs) {
    if (normalizedText.includes(normalizedQuery)) {
      results.push({
        type: 'Surah',
        title: surah.nameTransliterated,
        description: describeSurah(surah.number, surah.ayahCount, surah.revelationType),
        href: getSurahHref(surah),
      });
      if (results.length >= limit) return results;
    }
  }

  const hadithResults: QuranSearchResult[] = [];
  for (const { record, normalizedArabic, normalizedEnglish } of searchableHadiths) {
    const matchesArabic = normalizedArabic.includes(normalizedQuery);
    const matchesEnglish = normalizedEnglish.includes(normalizedQuery);
    if (!matchesArabic && !matchesEnglish) continue;
    hadithResults.push({
      type: 'Hadith',
      title: `Authentic Hadith #${record.id}`,
      description: matchesArabic ? record.hadeeth_ar : record.title,
      href: getHadithHref(record),
      language: matchesArabic ? 'ar' : 'en',
    });
  }
  results.push(...hadithResults.slice(0, Math.min(6, limit - results.length)));

  for (const { surah, verse, meaning, normalizedArabic, normalizedEnglish } of searchableVerses) {
    const matchesArabic = normalizedArabic.includes(normalizedQuery);
    const matchesEnglish = normalizedEnglish.includes(normalizedQuery);
    if (!matchesArabic && !matchesEnglish) continue;
    results.push({
      type: 'Verse',
      title: `${surah.nameTransliterated}, verse ${verse.ayah}`,
      description: matchesArabic ? verse.text : meaning.text,
      href: `${getSurahHref(surah)}#verse-${verse.ayah}`,
      language: matchesArabic ? 'ar' : 'en',
    });
    if (results.length >= limit) return results;
  }

  if (results.length < limit) results.push(...hadithResults.slice(6, 6 + limit - results.length));

  return results;
}
