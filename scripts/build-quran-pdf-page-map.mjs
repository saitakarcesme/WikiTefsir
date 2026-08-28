import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const input = path.join(root, 'tmp/pdfs/english_rwwad.txt');
const output = path.join(root, 'data/quran/pdf-pages.json');
const translation = JSON.parse(fs.readFileSync(path.join(root, 'data/quran/translation-en.json'), 'utf8'));
const pages = fs.readFileSync(input, 'utf8').split('\f');

function normalize(value) {
  return value
    .normalize('NFKD')
    .replace(/\[[0-9]+\]/gu, ' ')
    .replace(/[^a-zA-Z0-9]+/gu, ' ')
    .toLowerCase()
    .trim();
}

const normalizedPages = pages.map(normalize);
const candidates = translation.records.map((record) => {
  const words = normalize(record.text).split(' ').filter(Boolean);
  const needle = `${record.ayah} ${words.slice(0, Math.min(10, words.length)).join(' ')}`;
  return normalizedPages.flatMap((page, index) => page.includes(needle) ? [index + 1] : []);
});
const direct = candidates.map((matches) => matches.length === 1 ? matches[0] : null);
const manualPages = new Map([
  ['5:87', 123], ['16:123', 290], ['18:76', 314], ['21:83', 348],
  ['32:9', 448], ['43:86', 544], ['59:11', 618], ['68:43', 643],
]);

const records = translation.records.map((record, index) => {
  if (direct[index]) return direct[index];
  const manual = manualPages.get(`${record.surah}:${record.ayah}`);
  if (manual) return manual;

  let before = index - 1;
  let after = index + 1;
  while (before >= 0 && !direct[before]) before -= 1;
  while (after < direct.length && !direct[after]) after += 1;
  const lower = before >= 0 ? direct[before] : 1;
  const upper = after < direct.length ? direct[after] : pages.length;
  const constrained = candidates[index].filter((page) => page >= lower && page <= upper);
  if (constrained.length === 1) return constrained[0];
  if (lower === upper) return lower;
  throw new Error(`Could not verify PDF page for ${record.surah}:${record.ayah}`);
});

fs.writeFileSync(output, `${JSON.stringify({
  source: translation.translation.pdf_url,
  sourceVersion: translation.translation.version,
  generatedFrom: 'pdftotext -layout',
  records,
}, null, 2)}\n`);
process.stdout.write(`Mapped ${records.length} Quran verses to verified PDF pages.\n`);
