#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const corpusDir = join(projectRoot, 'data', 'quran');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

async function main() {
  const manifest = JSON.parse(await readFile(join(corpusDir, 'meal-tr-manifest.json'), 'utf8'));
  assert(manifest.translationKey === 'turkish_rwwad', 'Unexpected Turkish translation key');
  assert(manifest.recordCount === 6236, 'Turkish manifest must declare 6236 records');
  assert(manifest.republishingTerms?.verbatimOnly === true, 'Turkish verbatim-only terms flag is missing');
  for (const source of manifest.sources) {
    const buffer = await readFile(join(corpusDir, source.filename));
    assert(sha256(buffer) === source.sha256, `SHA-256 mismatch: ${source.filename}`);
  }
  for (const artifact of manifest.artifacts) {
    const buffer = await readFile(join(corpusDir, artifact.filename));
    assert(sha256(buffer) === artifact.sha256, `SHA-256 mismatch: ${artifact.filename}`);
  }
  const databaseSource = manifest.sources.find((source) => source.id.startsWith('quranenc-turkish_rwwad-'));
  assert(databaseSource, 'Turkish QuranEnc SQLite source is missing');
  const catalog = JSON.parse(await readFile(join(corpusDir, 'meal-tr.json'), 'utf8'));
  const database = new DatabaseSync(join(corpusDir, databaseSource.filename), { readOnly: true });
  const sourceRows = database.prepare('SELECT id, sura, aya, translation, footnotes FROM translations ORDER BY id').all();
  database.close();
  assert(sourceRows.length === 6236 && catalog.records?.length === 6236, 'Turkish source and catalog must contain 6236 records');
  for (let index = 0; index < sourceRows.length; index += 1) {
    const source = sourceRows[index];
    const artifact = catalog.records[index];
    const reference = `${source.sura}:${source.aya}`;
    assert(artifact.surah === Number(source.sura) && artifact.ayah === Number(source.aya), `Reference differs: ${reference}`);
    assert(artifact.text === String(source.translation), `Turkish text differs from verbatim source: ${reference}`);
    assert(artifact.footnotes === String(source.footnotes ?? ''), `Turkish footnotes differ from verbatim source: ${reference}`);
  }
  process.stdout.write(`Verified ${sourceRows.length} verbatim Turkish translation records from QuranEnc ${manifest.version}.\n`);
}

main().catch((error) => { process.stderr.write(`${error.stack ?? error.message}\n`); process.exitCode = 1; });
