import hadithCatalogJson from '@/data/hadith/hadeethenc-en.json';

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
const recordsById = new Map(catalog.records.map((record) => [record.id, record]));
const categoriesById = new Map(catalog.categories.map((category) => [category.id, category]));

export const hadithTerms = catalog.terms;
export const hadithVersion = catalog.version;

export function getAllHadiths() {
  return catalog.records;
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
