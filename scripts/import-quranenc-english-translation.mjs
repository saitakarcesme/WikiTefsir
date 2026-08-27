#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(projectRoot, 'data', 'quran');
const translationKey = 'english_rwwad';
const expectedVersion = '1.0.19';
const metadataSource = {
  id: 'quranenc-english-translations-list',
  url: 'https://quranenc.com/api/v1/translations/list/en?localization=en',
  filename: 'quranenc-english-translations-list.json',
};
const databaseSource = {
  id: `quranenc-${translationKey}-${expectedVersion}`,
  url: 'https://quranenc.com/downloads/sqlite/english_rwwad.sqlite',
  filename: `quranenc-${translationKey}-${expectedVersion}.sqlite`,
};
const republishingTerms = {
  url: 'https://quranenc.com/en/home/api',
  attribution: 'QuranEnc.com — Encyclopedia of the Noble Quran',
  publisher: 'Rowwad Translation Center and partner organizations',
  verbatimOnly: true,
  versionRequired: true,
  sourceLinkRequired: true,
};

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function download(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'WikiTefsir corpus importer/1.0' },
  });

  if (!response.ok) throw new Error(`Download failed (${response.status}): ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function writeAtomic(path, contents) {
  const temporaryPath = `${path}.tmp`;
  await writeFile(temporaryPath, contents);
  await rename(temporaryPath, path);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function verifySequence(records, surahs) {
  assert(records.length === 6236, `Expected 6236 meal records, received ${records.length}`);

  let offset = 0;
  for (const surah of surahs) {
    for (let ayah = 1; ayah <= surah.ayahCount; ayah += 1) {
      const record = records[offset];
      assert(record?.id === offset + 1, `Unexpected source id at offset ${offset}`);
      assert(record.surah === surah.number && record.ayah === ayah, `Invalid meal sequence: ${surah.number}:${ayah}`);
      assert(record.text.length > 0, `Empty meal text: ${surah.number}:${ayah}`);
      offset += 1;
    }
  }

  assert(offset === records.length, 'Surah catalog does not cover every meal record');
}

async function main() {
  const [metadataBuffer, databaseBuffer, surahCatalogBuffer] = await Promise.all([
    download(metadataSource.url),
    download(databaseSource.url),
    readFile(join(outputDir, 'surahs.json')),
  ]);

  const metadata = JSON.parse(metadataBuffer.toString('utf8'));
  const translation = metadata.translations?.find((item) => item.key === translationKey);
  assert(translation, `Translation is missing from metadata: ${translationKey}`);
  assert(translation.version === expectedVersion, `Expected version ${expectedVersion}, received ${translation.version}`);
  assert(translation.database_uncompressed_url === databaseSource.url, 'Metadata database URL changed');

  const temporaryDir = await mkdtemp(join(tmpdir(), 'wikitafsir-meal-'));
  const temporaryDatabasePath = join(temporaryDir, 'source.sqlite');

  try {
    await writeFile(temporaryDatabasePath, databaseBuffer);
    const database = new DatabaseSync(temporaryDatabasePath, { readOnly: true });
    const sourceRows = database.prepare(
      'SELECT id, sura, aya, translation, footnotes FROM translations ORDER BY id',
    ).all();
    database.close();

    const records = sourceRows.map((row) => ({
      id: Number(row.id),
      surah: Number(row.sura),
      ayah: Number(row.aya),
      text: String(row.translation),
      footnotes: String(row.footnotes ?? ''),
    }));
    const surahCatalog = JSON.parse(surahCatalogBuffer.toString('utf8'));
    verifySequence(records, surahCatalog.records);

    const catalog = {
      corpus: 'quran-english-translation',
      source: databaseSource.id,
      translation,
      republishingTerms,
      records,
    };
    const catalogBuffer = Buffer.from(`${JSON.stringify(catalog)}\n`, 'utf8');
    const manifest = {
      corpus: 'quran-english-translation',
      translationKey,
      version: translation.version,
      recordCount: records.length,
      republishingTerms,
      sources: [
        { ...metadataSource, sha256: sha256(metadataBuffer) },
        { ...databaseSource, sha256: sha256(databaseBuffer) },
      ],
      artifacts: [
        { filename: 'translation-en.json', sha256: sha256(catalogBuffer), recordCount: records.length },
      ],
    };

    await mkdir(outputDir, { recursive: true });
    await writeAtomic(join(outputDir, metadataSource.filename), metadataBuffer);
    await writeAtomic(join(outputDir, databaseSource.filename), databaseBuffer);
    await writeAtomic(join(outputDir, 'translation-en.json'), catalogBuffer);
    await writeAtomic(join(outputDir, 'translation-en-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

    process.stdout.write(`Imported ${records.length} English translation records from QuranEnc ${translation.version}.\n`);
  } finally {
    await rm(temporaryDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
