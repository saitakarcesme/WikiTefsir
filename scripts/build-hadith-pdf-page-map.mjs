import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data/hadith/hadeethenc-en.json'), 'utf8'));

function normalize(value) {
  return value.normalize('NFKD').replace(/[^a-zA-Z0-9]+/gu, ' ').toLowerCase().trim();
}

const pages = [];
for (let part = 1; part <= 8; part += 1) {
  const input = path.join(root, `tmp/pdfs/Hadeethenc_en_part${part}.txt`);
  fs.readFileSync(input, 'utf8').split('\f').forEach((text, index) => pages.push({ part, page: index + 1, text: normalize(text) }));
}

const records = {};
for (const hadith of catalog.records) {
  const needle = normalize(hadith.title);
  const matches = pages.filter((record) => record.text.includes(needle));
  if (matches.length === 1) records[hadith.id] = { part: matches[0].part, page: matches[0].page };
  else if (matches.length > 1 && matches.every((record) => record.part === matches[0].part)) {
    const pageNumbers = matches.map((record) => record.page);
    if (Math.max(...pageNumbers) - Math.min(...pageNumbers) <= 2) records[hadith.id] = { part: matches[0].part, page: Math.min(...pageNumbers) };
  }
}

// Confirmed against the rendered heading on part 3, page 380; the PDF omits
// one comma that is present in the current dataset title.
records['1751'] = { part: 3, page: 380 };

fs.writeFileSync(path.join(root, 'data/hadith/pdf-pages.json'), `${JSON.stringify({
  source: 'https://hadeethenc.com/downloads/pdf/Hadeethenc_en/Hadeethenc_en_part{part}.pdf',
  sourceVersion: catalog.version,
  methodology: 'Exact normalized full-title match; ambiguous and unmatched records are intentionally omitted.',
  records,
}, null, 2)}\n`);
process.stdout.write(`Mapped ${Object.keys(records).length} hadiths to exact PDF pages; omitted unverified alignments.\n`);
