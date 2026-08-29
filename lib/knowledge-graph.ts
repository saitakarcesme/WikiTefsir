import { getAllConcepts, getAllKeywordConcepts, getConceptBySlug, getConceptHref, getConceptTitle } from '@/lib/concepts';
import { getAllHadithsForLocale, getHadithByIdForLocale, getHadithCategoriesForLocale, getHadithHref } from '@/lib/hadith';
import type { Locale } from '@/lib/locale';
import { getAllPeople, getPersonBySlug, getPersonHref } from '@/lib/people';
import { getPersonKind, getPersonName } from '@/lib/person-locale';
import { getAllScholars, getScholarHref } from '@/lib/scholars';
import { getAllSurahs, getSurahByNumber, getSurahHref, getTranslation } from '@/lib/quran';

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  eyebrow: string;
  childCount: number;
  href?: string;
}

export interface KnowledgeGraphBranch {
  node: KnowledgeGraphNode;
  parentId: string | null;
  children: KnowledgeGraphNode[];
}

const t = (locale: Locale, en: string, tr: string) => locale === 'tr' ? tr : en;
const personKinds = ['Prophet', 'Person', 'Ruler', 'Adversary', 'Angel', 'Group', 'Unnamed figure'] as const;

function rootBranch(locale: Locale): KnowledgeGraphBranch {
  const nodes: KnowledgeGraphNode[] = [
    { id: 'quran', label: t(locale, 'The Quran', 'Kur’an'), eyebrow: t(locale, 'Revelation', 'Vahiy'), childCount: 114 },
    { id: 'hadith', label: t(locale, 'Authentic hadith', 'Sahih hadis'), eyebrow: t(locale, 'Corpus', 'Külliyat'), childCount: getHadithCategoriesForLocale(locale).filter((item) => item.parent_id === null).length },
    { id: 'people', label: t(locale, 'People', 'Kişiler'), eyebrow: t(locale, 'Quranic index', 'Kur’an dizini'), childCount: personKinds.length },
    { id: 'concepts', label: t(locale, 'Concepts', 'Kavramlar'), eyebrow: t(locale, 'Semantic index', 'Anlam dizini'), childCount: getAllConcepts().length + 2 },
    { id: 'scholars', label: t(locale, 'Scholars', 'Âlimler'), eyebrow: t(locale, 'Tafsir', 'Tefsir'), childCount: getAllScholars().length },
    { id: 'stories', label: t(locale, 'Stories', 'Kıssalar'), eyebrow: t(locale, 'Reading paths', 'Okuma yolları'), childCount: getAllPeople().filter((person) => person.narrative.length > 1).length, href: '/stories' },
  ];
  return { node: { id: 'allah', label: 'الله', eyebrow: t(locale, 'All knowledge returns to Allah', 'Bütün bilgi Allah’a döner'), childCount: nodes.length }, parentId: null, children: nodes };
}

function quranBranch(locale: Locale): KnowledgeGraphBranch {
  const children = getAllSurahs().map((surah) => ({ id: `surah:${surah.number}`, label: `${surah.number}. ${surah.nameTransliterated}`, eyebrow: surah.nameArabic, childCount: surah.ayahCount, href: getSurahHref(surah) }));
  return { node: { id: 'quran', label: t(locale, 'The Quran', 'Kur’an'), eyebrow: t(locale, '114 surahs', '114 sure'), childCount: children.length, href: '/surahs' }, parentId: 'allah', children };
}

function surahBranch(id: string, locale: Locale): KnowledgeGraphBranch | undefined {
  const number = Number(id.split(':')[1]);
  const surah = getSurahByNumber(number);
  if (!surah) return undefined;
  const children = Array.from({ length: surah.ayahCount }, (_, index) => {
    const ayah = index + 1;
    const meaning = getTranslation(number, ayah, locale);
    return { id: `ayah:${number}:${ayah}`, label: `${number}:${ayah}`, eyebrow: meaning?.text.slice(0, 72) || t(locale, 'Verse', 'Ayet'), childCount: 0, href: `${getSurahHref(surah)}#verse-${ayah}` };
  });
  return { node: { id, label: surah.nameTransliterated, eyebrow: surah.nameArabic, childCount: children.length, href: getSurahHref(surah) }, parentId: 'quran', children };
}

function hadithBranch(locale: Locale): KnowledgeGraphBranch {
  const categories = getHadithCategoriesForLocale(locale);
  const children = categories.filter((category) => category.parent_id === null).map((category) => ({ id: `hadith-category:${category.id}`, label: category.title, eyebrow: t(locale, 'Category', 'Kategori'), childCount: Number(category.hadeeths_count) || 0 }));
  return { node: { id: 'hadith', label: t(locale, 'Authentic hadith', 'Sahih hadis'), eyebrow: t(locale, 'Language-source corpus', 'Dil kaynağı külliyatı'), childCount: children.length, href: '/hadith' }, parentId: 'allah', children };
}

function hadithCategoryBranch(id: string, locale: Locale): KnowledgeGraphBranch | undefined {
  const categoryId = id.split(':')[1];
  const categories = getHadithCategoriesForLocale(locale);
  const category = categories.find((item) => item.id === categoryId);
  if (!category) return undefined;
  const subcategories = categories.filter((item) => item.parent_id === categoryId);
  const directRecords = getAllHadithsForLocale(locale).filter((record) => record.categories.includes(categoryId));
  const children = [
    ...subcategories.map((item) => ({ id: `hadith-category:${item.id}`, label: item.title, eyebrow: t(locale, 'Subcategory', 'Alt kategori'), childCount: Number(item.hadeeths_count) || 0 })),
    ...directRecords.map((record) => ({ id: `hadith-record:${record.id}`, label: record.title, eyebrow: `HadeethEnc #${record.id}`, childCount: 0, href: getHadithHref(record) })),
  ];
  return { node: { id, label: category.title, eyebrow: t(locale, 'Hadith category', 'Hadis kategorisi'), childCount: children.length }, parentId: category.parent_id ? `hadith-category:${category.parent_id}` : 'hadith', children };
}

function peopleBranch(locale: Locale): KnowledgeGraphBranch {
  const people = getAllPeople();
  const children = personKinds.flatMap((kind) => {
    const matching = people.filter((person) => person.kind === kind);
    return matching.length ? [{ id: `people-kind:${kind}`, label: getPersonKind(matching[0], locale), eyebrow: t(locale, 'Group', 'Grup'), childCount: matching.length }] : [];
  });
  return { node: { id: 'people', label: t(locale, 'People', 'Kişiler'), eyebrow: t(locale, 'Quranic people', 'Kur’an’daki kişiler'), childCount: children.length, href: '/people' }, parentId: 'allah', children };
}

function peopleKindBranch(id: string, locale: Locale): KnowledgeGraphBranch | undefined {
  const kind = id.slice('people-kind:'.length);
  const people = getAllPeople().filter((person) => person.kind === kind);
  if (!people.length) return undefined;
  const children = people.map((person) => ({ id: `person:${person.slug}`, label: getPersonName(person, locale), eyebrow: getPersonKind(person, locale), childCount: person.keyReferences.length + person.concepts.length + (person.narrative.length > 1 ? 1 : 0), href: getPersonHref(person) }));
  return { node: { id, label: getPersonKind(people[0], locale), eyebrow: t(locale, 'Quranic people', 'Kur’an’daki kişiler'), childCount: children.length }, parentId: 'people', children };
}

function conceptsBranch(locale: Locale): KnowledgeGraphBranch {
  const children: KnowledgeGraphNode[] = [
    ...getAllConcepts().map((concept) => ({ id: `concept:${concept.slug}`, label: getConceptTitle(concept, locale), eyebrow: t(locale, 'Concept', 'Kavram'), childCount: concept.verseRefs.length + concept.hadithIds.filter((id) => getHadithByIdForLocale(id, locale)).length, href: getConceptHref(concept) })),
    { id: 'keywords:en', label: 'English corpus words', eyebrow: 'English source', childCount: getAllKeywordConcepts('en').length },
    { id: 'keywords:tr', label: 'Türkçe külliyat kelimeleri', eyebrow: 'Türkçe kaynak', childCount: getAllKeywordConcepts('tr').length },
  ];
  return { node: { id: 'concepts', label: t(locale, 'Concepts', 'Kavramlar'), eyebrow: t(locale, 'Corpus-derived', 'Külliyattan türetilmiş'), childCount: children.length, href: '/concepts' }, parentId: 'allah', children };
}

function keywordBranch(id: string, locale: Locale): KnowledgeGraphBranch | undefined {
  const [, sourceLocale, ...prefixParts] = id.split(':');
  if (sourceLocale !== 'en' && sourceLocale !== 'tr') return undefined;
  const prefix = prefixParts.join(':');
  const localeTag = sourceLocale === 'tr' ? 'tr-TR' : 'en-US';
  const keywords = getAllKeywordConcepts(sourceLocale).filter((item) => item.title.toLocaleLowerCase(localeTag).startsWith(prefix));
  const label = sourceLocale === 'tr' ? 'Türkçe külliyat kelimeleri' : 'English corpus words';
  if (!prefix || keywords.length > 140) {
    const nextPrefixes = new Map<string, number>();
    for (const keyword of keywords) {
      const normalized = keyword.title.toLocaleLowerCase(localeTag);
      const next = normalized.slice(0, Math.max(1, prefix.length + 1));
      nextPrefixes.set(next, (nextPrefixes.get(next) ?? 0) + 1);
    }
    const children = [...nextPrefixes].sort(([a], [b]) => a.localeCompare(b, localeTag)).map(([next, count]) => ({ id: `keywords:${sourceLocale}:${next}`, label: `${next}…`, eyebrow: t(locale, 'Word group', 'Kelime grubu'), childCount: count }));
    return { node: { id, label: prefix ? `${prefix}…` : label, eyebrow: sourceLocale === 'tr' ? 'Türkçe kaynak' : 'English source', childCount: children.length }, parentId: prefix.length > 1 ? `keywords:${sourceLocale}:${prefix.slice(0, -1)}` : prefix ? `keywords:${sourceLocale}` : 'concepts', children };
  }
  const children = keywords.map((concept) => ({ id: `concept:${concept.slug}`, label: concept.title, eyebrow: `${concept.verseRefs.length} ${t(locale, 'verses', 'ayet')}`, childCount: concept.verseRefs.length + concept.hadithIds.filter((recordId) => getHadithByIdForLocale(recordId, locale)).length, href: getConceptHref(concept) }));
  return { node: { id, label: `${prefix}…`, eyebrow: sourceLocale === 'tr' ? 'Türkçe kaynak' : 'English source', childCount: children.length }, parentId: prefix.length > 1 ? `keywords:${sourceLocale}:${prefix.slice(0, -1)}` : `keywords:${sourceLocale}`, children };
}

function scholarsBranch(locale: Locale): KnowledgeGraphBranch {
  const children = getAllScholars().map((scholar) => ({ id: `scholar:${scholar.slug}`, label: scholar.name, eyebrow: scholar.work, childCount: 0, href: getScholarHref(scholar.slug) }));
  return { node: { id: 'scholars', label: t(locale, 'Scholars', 'Âlimler'), eyebrow: t(locale, 'Classical tafsir', 'Klasik tefsir'), childCount: children.length, href: '/scholars' }, parentId: 'allah', children };
}

function storiesBranch(locale: Locale): KnowledgeGraphBranch {
  const children = getAllPeople().filter((person) => person.narrative.length > 1).map((person) => ({ id: `story:${person.slug}`, label: getPersonName(person, locale), eyebrow: `${person.narrative.length} ${t(locale, 'chapters', 'bölüm')}`, childCount: 0, href: `/stories/${person.slug}` }));
  return { node: { id: 'stories', label: t(locale, 'Stories', 'Kıssalar'), eyebrow: t(locale, 'Source-led reading paths', 'Kaynak temelli okuma yolları'), childCount: children.length, href: '/stories' }, parentId: 'allah', children };
}

function personBranch(id: string, locale: Locale): KnowledgeGraphBranch | undefined {
  const person = getPersonBySlug(id.slice('person:'.length));
  if (!person) return undefined;
  const references = new Map<string, KnowledgeGraphNode>();
  for (const reference of [...person.keyReferences, ...person.narrative.flatMap((stage) => stage.references)]) {
    const surah = getSurahByNumber(reference.surah);
    if (!surah) continue;
    const key = `${reference.surah}:${reference.ayah}`;
    references.set(key, { id: `ayah:${key}`, label: key, eyebrow: surah.nameTransliterated, childCount: 0, href: `${getSurahHref(surah)}#verse-${reference.ayah}` });
  }
  const conceptNodes = person.concepts.flatMap((slug) => {
    const concept = getConceptBySlug(slug);
    return concept ? [{ id: `concept:${concept.slug}`, label: getConceptTitle(concept, locale), eyebrow: t(locale, 'Concept', 'Kavram'), childCount: concept.verseRefs.length + concept.hadithIds.filter((recordId) => getHadithByIdForLocale(recordId, locale)).length, href: getConceptHref(concept) }] : [];
  });
  const storyNode = person.narrative.length > 1 ? [{ id: `story:${person.slug}`, label: t(locale, 'Read the complete story', 'Kıssanın tamamını oku'), eyebrow: `${person.narrative.length} ${t(locale, 'chapters', 'bölüm')}`, childCount: 0, href: `/stories/${person.slug}` }] : [];
  const children = [...storyNode, ...conceptNodes, ...references.values()];
  return { node: { id, label: getPersonName(person, locale), eyebrow: getPersonKind(person, locale), childCount: children.length, href: getPersonHref(person) }, parentId: `people-kind:${person.kind}`, children };
}

function conceptBranch(id: string, locale: Locale): KnowledgeGraphBranch | undefined {
  const concept = getConceptBySlug(id.slice('concept:'.length));
  if (!concept) return undefined;
  const verseNodes = concept.verseRefs.map((reference) => {
    const surah = getSurahByNumber(reference.surah);
    return { id: `ayah:${reference.surah}:${reference.ayah}`, label: `${reference.surah}:${reference.ayah}`, eyebrow: surah?.nameTransliterated || t(locale, 'Verse', 'Ayet'), childCount: 0, href: surah ? `${getSurahHref(surah)}#verse-${reference.ayah}` : '/surahs' };
  });
  const hadithNodes = concept.hadithIds.flatMap((recordId) => {
    const record = getHadithByIdForLocale(recordId, locale);
    return record ? [{ id: `hadith-record:${record.id}`, label: record.title, eyebrow: `HadeethEnc #${record.id}`, childCount: 0, href: getHadithHref(record) }] : [];
  });
  const children = [...verseNodes, ...hadithNodes];
  return { node: { id, label: getConceptTitle(concept, locale), eyebrow: concept.arabic || t(locale, 'Corpus word', 'Külliyat kelimesi'), childCount: children.length, href: getConceptHref(concept) }, parentId: 'concepts', children };
}

export function getKnowledgeGraphBranch(id: string, locale: Locale): KnowledgeGraphBranch | undefined {
  if (id === 'allah') return rootBranch(locale);
  if (id === 'quran') return quranBranch(locale);
  if (id.startsWith('surah:')) return surahBranch(id, locale);
  if (id === 'hadith') return hadithBranch(locale);
  if (id.startsWith('hadith-category:')) return hadithCategoryBranch(id, locale);
  if (id === 'people') return peopleBranch(locale);
  if (id.startsWith('people-kind:')) return peopleKindBranch(id, locale);
  if (id.startsWith('person:')) return personBranch(id, locale);
  if (id === 'concepts') return conceptsBranch(locale);
  if (id.startsWith('keywords:')) return keywordBranch(id, locale);
  if (id.startsWith('concept:')) return conceptBranch(id, locale);
  if (id === 'scholars') return scholarsBranch(locale);
  if (id === 'stories') return storiesBranch(locale);
  return undefined;
}
