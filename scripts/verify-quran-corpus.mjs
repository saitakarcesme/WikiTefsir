#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const corpusDir = join(projectRoot, 'data', 'quran');

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  const manifest = JSON.parse(await readFile(join(corpusDir, 'manifest.json'), 'utf8'));
  const catalog = JSON.parse(await readFile(join(corpusDir, 'surahs.json'), 'utf8'));

  assert(manifest.license?.verbatimOnly === true, 'Verbatim-only license flag is missing');
  assert(manifest.verseCount === 6236, 'Manifest verse count must be 6236');
  assert(manifest.surahCount === 114, 'Manifest surah count must be 114');
  assert(catalog.records?.length === 114, 'Surah catalog must contain 114 records');

  for (const source of manifest.sources) {
    const buffer = await readFile(join(corpusDir, source.filename));
    assert(sha256(buffer) === source.sha256, `SHA-256 mismatch: ${source.filename}`);
  }

  const textSource = manifest.sources.find((source) => source.id === 'tanzil-uthmani-1.1');
  assert(textSource, 'Tanzil text source is missing from manifest');
  const rawText = await readFile(join(corpusDir, textSource.filename), 'utf8');
  const verseLines = rawText.split(/\r?\n/u).filter((line) => /^\d+\|\d+\|/u.test(line));
  assert(verseLines.length === 6236, 'Checked-in text must contain 6236 verse lines');
  assert(rawText.includes('PLEASE DO NOT REMOVE OR CHANGE THIS COPYRIGHT BLOCK'), 'Copyright block is missing');

  let globalOffset = 0;
  for (const surah of catalog.records) {
    assert(surah.number >= 1 && surah.number <= 114, `Invalid surah number: ${surah.number}`);
    assert(surah.startOffset === globalOffset, `Invalid start offset for surah ${surah.number}`);

    for (let ayah = 1; ayah <= surah.ayahCount; ayah += 1) {
      const expectedPrefix = `${surah.number}|${ayah}|`;
      assert(verseLines[globalOffset]?.startsWith(expectedPrefix), `Invalid verse sequence: ${surah.number}:${ayah}`);
      assert(verseLines[globalOffset].length > expectedPrefix.length, `Empty verse text: ${surah.number}:${ayah}`);
      globalOffset += 1;
    }
  }

  assert(globalOffset === verseLines.length, 'Surah catalog does not cover every verse');
  process.stdout.write(`Verified ${verseLines.length} verses, ${catalog.records.length} surahs and ${manifest.sources.length} source hashes.\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
