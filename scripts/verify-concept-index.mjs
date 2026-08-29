import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = JSON.parse(fs.readFileSync(path.join(root, 'data/concepts/concept-index.json'), 'utf8'));
const verseCount = JSON.parse(fs.readFileSync(path.join(root, 'data/quran/verses.json'), 'utf8')).records.length;
const hadithCount = JSON.parse(fs.readFileSync(path.join(root, 'data/hadith/hadeethenc-en.json'), 'utf8')).records.length;
if (index.generatedFrom.quranEnglishRecords !== verseCount || index.generatedFrom.quranTurkishRecords !== verseCount) throw new Error('Concept index does not cover both Quran translations');
if (index.generatedFrom.hadithEnglishRecords !== hadithCount) throw new Error('Concept index does not cover the authentic English hadith corpus');
if (index.concepts.length < 30) throw new Error('Semantic taxonomy is unexpectedly small');
if (index.keywords.length < 1000) throw new Error('Corpus vocabulary index is unexpectedly small');
const keywordSlugs = new Set();
for (const keyword of index.keywords) {
  if (keywordSlugs.has(keyword.slug)) throw new Error(`Duplicate keyword slug: ${keyword.slug}`);
  keywordSlugs.add(keyword.slug);
}
for (const concept of index.concepts) {
  if (!concept.title?.en || !concept.title?.tr || !concept.scope?.en || !concept.scope?.tr) throw new Error(`Missing bilingual metadata for ${concept.slug}`);
  if (!concept.verseRefs.length && !concept.hadithIds.length) throw new Error(`Concept has no generated links: ${concept.slug}`);
}
const prayer = index.concepts.find((concept) => concept.slug === 'prayer');
if (!prayer || prayer.verseRefs.length < 10 || prayer.hadithIds.length < 10) throw new Error('Prayer coverage regression');
console.log(`Concept index verified: ${index.concepts.length} semantic concepts, ${index.keywords.length} corpus keywords, prayer=${prayer.verseRefs.length} verses/${prayer.hadithIds.length} hadiths.`);
