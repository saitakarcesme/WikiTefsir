#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
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
  const manifest = JSON.parse(await readFile(join(corpusDir, 'meal-tr-manifest.json'), 'utf8'));
  assert(manifest.translationKey === 'turkish_rwwad', 'Unexpected Turkish translation key');
  assert(manifest.version === '1.0.4', 'Unexpected Turkish translation version');
  assert(manifest.recordCount === 6236, 'Manifest must declare 6236 records');
  assert(manifest.republishingTerms?.verbatimOnly === true, 'Verbatim-only terms flag is missing');
  assert(manifest.republishingTerms?.sourceLinkRequired === true, 'Source-link requirement is missing');

  for (const source of manifest.sources) {
    const buffer = await readFile(join(corpusDir, source.filename));
    assert(sha256(buffer) === source.sha256, `SHA-256 mismatch: ${source.filename}`);
  }

  for (const artifact of manifest.artifacts) {
    const buffer = await readFile(join(corpusDir, artifact.filename));
    assert(sha256(buffer) === artifact.sha256, `SHA-256 mismatch: ${artifact.filename}`);
  }

  const metadataSource = manifest.sources.find((source) => source.id === 'quranenc-turkish-translations-list');
  const databaseSource = manifest.sources.find((source) => source.id.startsWith('quranenc-turkish_rwwad-'));
  assert(metadataSource && databaseSource, 'QuranEnc source files are missing from the manifest');

  const metadata = JSON.parse(await readFile(join(corpusDir, metadataSource.filename), 'utf8'));
  const translation = metadata.translations?.find((item) => item.key === manifest.translationKey);
  assert(translation?.version === manifest.version, 'Metadata and manifest versions differ');
  assert(translation?.database_uncompressed_url === databaseSource.url, 'Metadata and manifest source URLs differ');

  const catalog = JSON.parse(await readFile(join(corpusDir, 'meal-tr.json'), 'utf8'));
  assert(catalog.records?.length === 6236, 'Portable meal catalog must contain 6236 records');
  assert(catalog.translation?.key === manifest.translationKey, 'Catalog translation key differs');
  assert(catalog.translation?.version === manifest.version, 'Catalog version differs');

  const database = new DatabaseSync(join(corpusDir, databaseSource.filename), { readOnly: true });
  const sourceRows = database.prepare(
    'SELECT id, sura, aya, translation, footnotes FROM translations ORDER BY id',
  ).all();
  database.close();
  assert(sourceRows.length === 6236, 'Source SQLite database must contain 6236 records');

  for (let index = 0; index < sourceRows.length; index += 1) {
    const source = sourceRows[index];
    const artifact = catalog.records[index];
    const reference = `${source.sura}:${source.aya}`;
    assert(artifact.id === Number(source.id), `Source id differs: ${reference}`);
    assert(artifact.surah === Number(source.sura) && artifact.ayah === Number(source.aya), `Reference differs: ${reference}`);
    assert(artifact.text === String(source.translation), `Meal text differs from verbatim source: ${reference}`);
    assert(artifact.footnotes === String(source.footnotes ?? ''), `Footnotes differ from verbatim source: ${reference}`);
  }

  process.stdout.write(`Verified ${sourceRows.length} verbatim Turkish meal records from QuranEnc ${manifest.version}.\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
