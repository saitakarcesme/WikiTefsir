import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const taxonomy = read('data/concepts/taxonomy.json');
const verses = read('data/quran/verses.json').records;
const enVerses = read('data/quran/translation-en.json').records;
const trVerses = read('data/quran/meal-tr.json').records;
const enHadiths = read('data/hadith/hadeethenc-en.json').records;
const trHadiths = read('data/hadith/hadeethenc-tr.json').records;

const normalize = (value, locale = 'en-US') => String(value ?? '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/gu, '')
  .replace(/[’'`]/gu, '')
  .toLocaleLowerCase(locale)
  .replace(/[^\p{L}\p{N}]+/gu, ' ')
  .replace(/\s+/gu, ' ')
  .trim();

const stop = {
  en: new Set('a an and are as at be been being but by can did do does for from had has have he her hers him his i if in into is it its may me more most my no nor not of on one only or our ours she so than that the their theirs them then there these they this those through to too upon us was we were what when where which who will with you your yours'.split(' ').map((token) => normalize(token))),
  tr: new Set('acaba ama ancak artık asla aslında az bana bazen bazı ben beni benim beri bile bir bize bizi bizim bu bunu bunun burada bütün çok çünkü da daha dahi de değil diye en fakat gibi hem hep her hiç için ile ise kadar ki kim mi mı mu mü nasıl ne neden nerede niçin o olan olarak oldu onu onun orada öyle sana sen seni sizin şu şöyle ve veya ya yani yine yok zaten'.split(' ').map((token) => normalize(token, 'tr-TR'))),
};

function tokens(value, locale) {
  const localeName = locale === 'tr' ? 'tr-TR' : 'en-US';
  const seen = new Set();
  const result = [];
  for (const raw of String(value ?? '').toLocaleLowerCase(localeName).match(/[\p{L}\p{N}]+/gu) ?? []) {
    const key = normalize(raw, localeName);
    if (key.length < 3 || stop[locale].has(key) || /^\d+$/u.test(key) || seen.has(key)) continue;
    seen.add(key); result.push({ key, label: raw });
  }
  return result;
}

function containsAlias(text, aliases, locale) {
  const normalized = ` ${normalize(text, locale === 'tr' ? 'tr-TR' : 'en-US')} `;
  return aliases.some((alias) => normalized.includes(` ${normalize(alias, locale === 'tr' ? 'tr-TR' : 'en-US')} `));
}

const trHadithById = new Map(trHadiths.map((record) => [record.id, record]));
const semantic = taxonomy.concepts.map((concept) => ({ ...concept, verseRefs: [], hadithIds: [] }));
const keywordMap = new Map();
function addKeyword(locale, token, label, kind, id) {
  const slug = `${locale}-${token.replace(/ı/gu, 'i').replace(/ğ/gu, 'g').replace(/ş/gu, 's').replace(/ç/gu, 'c').replace(/ö/gu, 'o').replace(/ü/gu, 'u').replace(/[^a-z0-9]+/gu, '-')}`;
  // Turkish diacritics can collapse to the same URL-safe form (for example
  // zıhar/zihâr). Merge by public URL identity to avoid ambiguous routes.
  const key = slug;
  let record = keywordMap.get(key);
  if (!record) { record = { slug: `word-${slug}`, kind: 'keyword', locale, label, verseRefs: [], hadithIds: [] }; keywordMap.set(key, record); }
  if (kind === 'verse') record.verseRefs.push(id); else record.hadithIds.push(id);
}

for (let index = 0; index < verses.length; index += 1) {
  const verse = verses[index]; const en = enVerses[index]; const tr = trVerses[index];
  if (!en || !tr || en.surah !== verse.surah || tr.surah !== verse.surah || en.ayah !== verse.ayah || tr.ayah !== verse.ayah) throw new Error(`Verse alignment failure at offset ${index}`);
  const id = `${verse.surah}:${verse.ayah}`;
  for (const concept of semantic) if (containsAlias(`${en.text} ${en.footnotes}`, concept.aliases.en, 'en') || containsAlias(`${tr.text} ${tr.footnotes}`, concept.aliases.tr, 'tr')) concept.verseRefs.push(id);
  for (const token of tokens(`${en.text} ${en.footnotes}`, 'en')) addKeyword('en', token.key, token.label, 'verse', id);
  for (const token of tokens(`${tr.text} ${tr.footnotes}`, 'tr')) addKeyword('tr', token.key, token.label, 'verse', id);
}

for (const en of enHadiths) {
  const tr = trHadithById.get(en.id);
  const enText = `${en.title} ${en.hadeeth} ${en.explanation} ${en.hints.join(' ')}`;
  const trText = tr ? `${tr.title} ${tr.hadeeth} ${tr.explanation} ${tr.hints.join(' ')}` : '';
  for (const concept of semantic) if (containsAlias(enText, concept.aliases.en, 'en') || containsAlias(trText, concept.aliases.tr, 'tr')) concept.hadithIds.push(en.id);
  for (const token of tokens(enText, 'en')) addKeyword('en', token.key, token.label, 'hadith', en.id);
  if (tr) for (const token of tokens(trText, 'tr')) addKeyword('tr', token.key, token.label, 'hadith', en.id);
}

for (const record of keywordMap.values()) {
  record.verseRefs = [...new Set(record.verseRefs)];
  record.hadithIds = [...new Set(record.hadithIds)];
}
const keywords = [...keywordMap.values()]
  .filter((record) => record.verseRefs.length + record.hadithIds.length >= 2)
  .sort((a, b) => (b.verseRefs.length + b.hadithIds.length) - (a.verseRefs.length + a.hadithIds.length) || a.slug.localeCompare(b.slug));
const output = {
  schemaVersion: 1,
  generatedFrom: {
    quranArabicRecords: verses.length,
    quranEnglishRecords: enVerses.length,
    quranTurkishRecords: trVerses.length,
    hadithEnglishRecords: enHadiths.length,
    hadithTurkishRecords: trHadiths.length
  },
  method: 'Unicode-normalized token and whole-phrase matching; record links are generated from source corpora, never selected by verse ID.',
  concepts: semantic,
  keywords
};
const target = path.join(root, 'data/concepts/concept-index.json');
const temporaryTarget = `${target}.tmp`;
fs.writeFileSync(temporaryTarget, `${JSON.stringify(output)}\n`);
fs.renameSync(temporaryTarget, target);
console.log(`Wrote ${semantic.length} semantic concepts and ${keywords.length} corpus keywords to ${path.relative(root, target)}`);
