import {
  getAllSurahs,
  getSurahByNumber,
  getSurahHref,
  getEnglishTranslationForSurah,
  getTurkishTranslationForSurah,
  getTranslation,
  getVerse,
  getVersesForSurah,
} from '@/lib/quran';
import { getAllHadiths, getAllHadithsForLocale, getHadithById, getHadithHref } from '@/lib/hadith';
import { getAllConcepts, getAllKeywordConcepts, getConceptHref } from '@/lib/concepts';
import { getAllPeople, getPersonHref } from '@/lib/people';
import { getAllScholars, getScholarHref } from '@/lib/scholars';
import type { Locale } from '@/lib/locale';

export interface QuranSearchResult {
  type: 'Verse' | 'Surah' | 'Hadith' | 'Concept' | 'Person' | 'Scholar';
  title: string;
  description: string;
  href: string;
  language?: 'ar' | 'en' | 'tr';
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

function normalizeLatin(value: string) {
  return normalize(value)
    .replace(/\b(?:surah|sura|sure|chapter)\b/gu, ' ')
    .replace(/\bal[\s-]+/gu, '')
    .replace(/kh/gu, 'h')
    .replace(/q/gu, 'k')
    .replace(/([a-z]{3,})h\b/gu, '$1')
    .replace(/[^a-z0-9\s]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function editDistance(left: string, right: string) {
  if (left === right) return 0;
  if (!left.length) return right.length;
  if (!right.length) return left.length;
  const matrix = Array.from({ length: left.length + 1 }, () => Array<number>(right.length + 1).fill(0));
  for (let index = 0; index <= left.length; index += 1) matrix[index][0] = index;
  for (let index = 0; index <= right.length; index += 1) matrix[0][index] = index;
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      matrix[leftIndex][rightIndex] = Math.min(
        matrix[leftIndex][rightIndex - 1] + 1,
        matrix[leftIndex - 1][rightIndex] + 1,
        matrix[leftIndex - 1][rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
      if (leftIndex > 1 && rightIndex > 1 && left[leftIndex - 1] === right[rightIndex - 2] && left[leftIndex - 2] === right[rightIndex - 1]) {
        matrix[leftIndex][rightIndex] = Math.min(matrix[leftIndex][rightIndex], matrix[leftIndex - 2][rightIndex - 2] + 1);
      }
    }
  }
  return matrix[left.length][right.length];
}

function fuzzyScore(query: string, candidate: string) {
  if (!query || !candidate) return 0;
  if (candidate === query) return 120;
  if (candidate.startsWith(query)) return 105 - Math.min(20, candidate.length - query.length);
  if (candidate.includes(query)) return 88 - Math.min(24, candidate.indexOf(query));
  const queryTokens = query.split(' ');
  const candidateTokens = candidate.split(' ');
  let tokenScore = 0;
  for (const queryToken of queryTokens) {
    let best = Number.POSITIVE_INFINITY;
    for (const candidateToken of candidateTokens) best = Math.min(best, editDistance(queryToken, candidateToken));
    const allowance = Math.max(1, Math.round(queryToken.length * .4));
    if (best > allowance) return 0;
    tokenScore += 72 - best * 13;
  }
  return tokenScore / queryTokens.length;
}

const referencePattern = /^(\d{1,3})\s*[:/\s-]\s*(\d{1,3})$/u;
const namedReferencePattern = /^(.+?)[\s,:/\-]+(\d{1,3})$/u;
const hadithReferencePattern = /^(?:h|hadith|hadis)\s*[:#]?\s*(\d+)$/iu;
const searchableSurahs = getAllSurahs().map((surah) => ({
  surah,
  normalizedText: normalize(`${surah.number} ${surah.nameArabic} ${surah.nameTransliterated} ${surah.nameEnglish}`),
  fuzzyText: normalizeLatin(`${surah.nameTransliterated} ${surah.nameEnglish}`),
}));
const searchableConcepts = getAllConcepts().map((concept) => ({
  concept,
  normalizedText: normalize(`${concept.slug} ${concept.title} ${concept.titleTr} ${concept.arabic} ${concept.scope} ${concept.scopeTr}`),
}));
const searchableKeywords = getAllKeywordConcepts();
const searchablePeople = getAllPeople().map((person) => ({
  person,
  normalizedText: normalize(`${person.slug} ${person.name} ${person.arabic} ${person.role} ${person.introduction} ${person.narrative.map((stage) => `${stage.title} ${stage.summary}`).join(' ')}`),
}));
const searchableScholars = getAllScholars().map((scholar) => ({
  scholar,
  normalizedText: normalize(`${scholar.name} ${scholar.arabic} ${scholar.work} ${scholar.field}`),
}));
const searchableVerses = getAllSurahs().flatMap((surah) => {
  const meanings = getEnglishTranslationForSurah(surah.number);
  const turkishMeanings = getTurkishTranslationForSurah(surah.number);
  return getVersesForSurah(surah.number).map((verse, index) => {
    const meaning = meanings[index];
    if (!meaning || meaning.surah !== verse.surah || meaning.ayah !== verse.ayah) {
      throw new Error(`English translation search index mismatch at ${verse.surah}:${verse.ayah}`);
    }

    return {
      surah,
      verse,
      meaning,
      turkishMeaning: turkishMeanings[index],
      normalizedArabic: normalize(verse.text),
      normalizedEnglish: normalize(`${meaning.text} ${meaning.footnotes}`),
      normalizedTurkish: normalize(`${turkishMeanings[index]?.text ?? ''} ${turkishMeanings[index]?.footnotes ?? ''}`),
    };
  });
});
const turkishHadithById = new Map(getAllHadithsForLocale('tr').map((record) => [record.id, record]));
const searchableHadiths = getAllHadiths().map((record) => {
  const turkish = turkishHadithById.get(record.id);
  return {
    record,
    turkish,
    normalizedArabic: normalize(`${record.hadeeth_ar} ${record.explanation_ar}`),
    normalizedEnglish: normalize(`${record.title} ${record.hadeeth} ${record.explanation} ${record.hints.join(' ')} ${record.attribution}`),
    normalizedTurkish: turkish ? normalize(`${turkish.title} ${turkish.hadeeth} ${turkish.explanation} ${turkish.hints.join(' ')} ${turkish.attribution}`) : '',
  };
});

function describeSurah(number: number, ayahCount: number, revelationType: 'Meccan' | 'Medinan') {
  return `Surah ${number} · ${ayahCount} verses · ${revelationType}`;
}

function verseResult(surahNumber: number, ayahNumber: number, locale: Locale): QuranSearchResult | undefined {
  const surah = getSurahByNumber(surahNumber);
  const verse = getVerse(surahNumber, ayahNumber);
  if (!surah || !verse) return undefined;

  return {
    type: 'Verse',
    title: locale === 'tr' ? `${surah.nameTransliterated}, ${ayahNumber}. ayet` : `${surah.nameTransliterated}, verse ${ayahNumber}`,
    description: locale === 'tr' ? (getTranslation(surahNumber, ayahNumber, 'tr')?.text ?? verse.text) : verse.text,
    href: `${getSurahHref(surah)}#verse-${ayahNumber}`,
    language: locale === 'tr' ? 'tr' : 'ar',
  };
}

export function searchQuran(rawQuery: string, limit = 12, locale: Locale = 'en'): QuranSearchResult[] {
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
    const result = verseResult(Number(reference[1]), Number(reference[2]), locale);
    return result ? [result] : [];
  }

  const namedReference = query.match(namedReferencePattern);
  if (namedReference && !/^\d+$/u.test(namedReference[1].trim())) {
    const surahQuery = normalizeLatin(namedReference[1]);
    const rankedSurah = searchableSurahs
      .map(({ surah, fuzzyText }) => ({ surah, score: fuzzyScore(surahQuery, fuzzyText) }))
      .filter(({ score }) => score > 0)
      .sort((left, right) => right.score - left.score)[0]?.surah;
    if (rankedSurah) {
      const result = verseResult(rankedSurah.number, Number(namedReference[2]), locale);
      if (result) return [result];
    }
  }

  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 2) return [];

  const results: QuranSearchResult[] = [];
  const fuzzyQuery = normalizeLatin(query);

  const entityResults: Array<{ score: number; result: QuranSearchResult }> = [];

  for (const { person, normalizedText } of searchablePeople) {
    const score = normalizedText.includes(normalizedQuery) ? 100 : fuzzyScore(fuzzyQuery, normalizeLatin(`${person.slug} ${person.name}`));
    if (!score) continue;
    entityResults.push({ score, result: { type: 'Person', title: person.name, description: person.introduction, href: getPersonHref(person), language: 'en' } });
  }

  for (const { concept, normalizedText } of searchableConcepts) {
    const score = normalizedText.includes(normalizedQuery) ? 98 : fuzzyScore(fuzzyQuery, normalizeLatin(`${concept.slug} ${concept.title}`));
    if (!score) continue;
    const turkishMatch = normalize(`${concept.titleTr} ${concept.scopeTr}`).includes(normalizedQuery);
    entityResults.push({ score, result: { type: 'Concept', title: turkishMatch ? concept.titleTr : concept.title, description: turkishMatch ? concept.scopeTr : concept.scope, href: getConceptHref(concept), language: turkishMatch ? 'tr' : 'en' } });
  }

  for (const concept of searchableKeywords) {
    const label = normalize(concept.title);
    if (label !== normalizedQuery && !label.startsWith(normalizedQuery)) continue;
    entityResults.push({ score: label === normalizedQuery ? 97 : 76, result: { type: 'Concept', title: concept.title, description: `${concept.verseRefs.length} Quran · ${concept.hadithIds.length} hadith records`, href: getConceptHref(concept), language: concept.locale } });
    if (entityResults.length > limit * 4) break;
  }

  for (const { surah, normalizedText, fuzzyText } of searchableSurahs) {
    const score = normalizedText.includes(normalizedQuery) ? 110 : fuzzyScore(fuzzyQuery, fuzzyText);
    if (!score) continue;
    entityResults.push({ score, result: { type: 'Surah', title: surah.nameTransliterated, description: describeSurah(surah.number, surah.ayahCount, surah.revelationType), href: getSurahHref(surah) } });
  }

  for (const { scholar, normalizedText } of searchableScholars) {
    const score = normalizedText.includes(normalizedQuery) ? 96 : fuzzyScore(fuzzyQuery, normalizeLatin(scholar.name));
    if (!score) continue;
    entityResults.push({ score, result: { type: 'Scholar', title: scholar.name, description: `${scholar.field} · ${scholar.work}`, href: getScholarHref(scholar.slug), language: 'en' } });
  }

  results.push(...entityResults.sort((left, right) => right.score - left.score).slice(0, limit).map(({ result }) => result));
  if (results.length >= limit) return results;

  const hadithResults: QuranSearchResult[] = [];
  for (const { record, turkish, normalizedArabic, normalizedEnglish, normalizedTurkish } of searchableHadiths) {
    const matchesArabic = normalizedArabic.includes(normalizedQuery);
    const matchesEnglish = normalizedEnglish.includes(normalizedQuery);
    const matchesTurkish = normalizedTurkish.includes(normalizedQuery);
    if (!matchesArabic && !matchesEnglish && !matchesTurkish) continue;
    hadithResults.push({
      type: 'Hadith',
      title: `Authentic Hadith #${record.id}`,
      description: matchesArabic ? record.hadeeth_ar : matchesTurkish && turkish ? turkish.title : record.title,
      href: getHadithHref(record),
      language: matchesArabic ? 'ar' : matchesTurkish ? 'tr' : 'en',
    });
  }
  results.push(...hadithResults.slice(0, Math.min(6, limit - results.length)));

  for (const { surah, verse, meaning, turkishMeaning, normalizedArabic, normalizedEnglish, normalizedTurkish } of searchableVerses) {
    const matchesArabic = normalizedArabic.includes(normalizedQuery);
    const matchesEnglish = normalizedEnglish.includes(normalizedQuery);
    const matchesTurkish = normalizedTurkish.includes(normalizedQuery);
    if (!matchesArabic && !matchesEnglish && !matchesTurkish) continue;
    results.push({
      type: 'Verse',
      title: `${surah.nameTransliterated}, verse ${verse.ayah}`,
      description: matchesArabic ? verse.text : matchesTurkish && turkishMeaning ? turkishMeaning.text : meaning.text,
      href: `${getSurahHref(surah)}#verse-${verse.ayah}`,
      language: matchesArabic ? 'ar' : matchesTurkish ? 'tr' : 'en',
    });
    if (results.length >= limit) return results;
  }

  if (results.length < limit) results.push(...hadithResults.slice(6, 6 + limit - results.length));

  return results;
}
