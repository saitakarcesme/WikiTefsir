import conceptIndexJson from '@/data/concepts/concept-index.json';
import type { Locale } from '@/lib/locale';

interface LocalizedValue { en: string; tr: string }
interface GeneratedSemanticConcept {
  slug: string; title: LocalizedValue; arabic: string; scope: LocalizedValue;
  aliases: { en: string[]; tr: string[] }; related: string[]; verseRefs: string[]; hadithIds: string[];
}
interface GeneratedKeywordConcept {
  slug: string; kind: 'keyword'; locale: Locale; label: string; verseRefs: string[]; hadithIds: string[];
}
interface GeneratedFrom {
  quranArabicRecords: number;
  quranEnglishRecords: number;
  quranTurkishRecords: number;
  hadithEnglishRecords: number;
  hadithTurkishRecords: number;
}
interface ConceptIndex {
  schemaVersion: number; generatedFrom: GeneratedFrom; method: string;
  concepts: GeneratedSemanticConcept[]; keywords: GeneratedKeywordConcept[];
}

export interface ConceptRecord {
  slug: string; kind: 'semantic' | 'keyword'; title: string; titleTr: string; arabic: string;
  scope: string; scopeTr: string; verseRefs: Array<{ surah: number; ayah: number }>;
  hadithIds: string[]; related: string[]; locale?: Locale;
}

const index = conceptIndexJson as ConceptIndex;
const parseRefs = (refs: string[]) => refs.map((reference) => {
  const [surah, ayah] = reference.split(':').map(Number);
  return { surah, ayah };
});
const semanticConcepts: ConceptRecord[] = index.concepts.map((concept) => ({
  slug: concept.slug, kind: 'semantic', title: concept.title.en, titleTr: concept.title.tr,
  arabic: concept.arabic, scope: concept.scope.en, scopeTr: concept.scope.tr,
  verseRefs: parseRefs(concept.verseRefs), hadithIds: concept.hadithIds, related: concept.related,
}));
const keywordConcepts: ConceptRecord[] = index.keywords.map((concept) => ({
  slug: concept.slug, kind: 'keyword', title: concept.label, titleTr: concept.label, arabic: '',
  scope: concept.locale === 'tr' ? 'Turkish corpus keyword' : 'English corpus keyword',
  scopeTr: concept.locale === 'tr' ? 'Türkçe külliyat anahtar kelimesi' : 'İngilizce külliyat anahtar kelimesi',
  verseRefs: parseRefs(concept.verseRefs), hadithIds: concept.hadithIds, related: [], locale: concept.locale,
}));
const allConcepts = [...semanticConcepts, ...keywordConcepts];
const conceptsBySlug = new Map(allConcepts.map((concept) => [concept.slug, concept]));
const verseSemantic = new Map<string, ConceptRecord[]>();
const verseKeywords = new Map<string, ConceptRecord[]>();
const hadithSemantic = new Map<string, ConceptRecord[]>();
for (const concept of semanticConcepts) {
  for (const reference of concept.verseRefs) {
    const key = `${reference.surah}:${reference.ayah}`;
    verseSemantic.set(key, [...(verseSemantic.get(key) ?? []), concept]);
  }
  for (const id of concept.hadithIds) hadithSemantic.set(id, [...(hadithSemantic.get(id) ?? []), concept]);
}
for (const concept of keywordConcepts) {
  for (const reference of concept.verseRefs) {
    const key = `${reference.surah}:${reference.ayah}`;
    verseKeywords.set(key, [...(verseKeywords.get(key) ?? []), concept]);
  }
}

export function getAllConcepts() { return semanticConcepts; }
export function getAllKeywordConcepts(locale?: Locale) { return locale ? keywordConcepts.filter((item) => item.locale === locale) : keywordConcepts; }
export function getConceptBySlug(slug: string) { return conceptsBySlug.get(slug); }
export function getConceptHref(concept: Pick<ConceptRecord, 'slug'>) { return `/concept/${concept.slug}`; }
export function getConceptTitle(concept: ConceptRecord, locale: Locale) { return locale === 'tr' ? concept.titleTr : concept.title; }
export function getConceptScope(concept: ConceptRecord, locale: Locale) { return locale === 'tr' ? concept.scopeTr.replaceAll("'", '’') : concept.scope; }
export function getConceptsForVerse(surah: number, ayah: number) { return verseSemantic.get(`${surah}:${ayah}`) ?? []; }
export function getKeywordsForVerse(surah: number, ayah: number, locale: Locale, limit = 8) {
  return (verseKeywords.get(`${surah}:${ayah}`) ?? []).filter((item) => item.locale === locale).slice(0, limit);
}
export function getConceptsForHadith(id: string) { return hadithSemantic.get(id) ?? []; }
export function getConceptsForLabels(labels: string[]) {
  const normalized = labels.join(' ').toLocaleLowerCase('en-US');
  return semanticConcepts.filter((concept) => concept.title.toLocaleLowerCase('en-US').split(/\s+/u).some((word) => word.length > 3 && normalized.includes(word)));
}
export function getConceptIndexStats() {
  return { semanticCount: semanticConcepts.length, keywordCount: keywordConcepts.length, ...index.generatedFrom, method: index.method };
}
