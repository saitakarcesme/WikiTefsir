#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(projectRoot, 'data', 'quran');

const textSource = {
  id: 'tanzil-uthmani-1.1',
  url: 'https://tanzil.net/pub/download/index.php?quranType=uthmani&outType=txt-2&marks=true&sajdah=true&tatweel=true&agree=true',
  filename: 'tanzil-uthmani-1.1.txt',
};

const metadataSource = {
  id: 'tanzil-quran-metadata-1.0',
  url: 'https://tanzil.net/res/text/metadata/quran-data.xml',
  filename: 'tanzil-quran-data-1.0.xml',
};

const license = {
  name: 'Creative Commons Attribution 3.0',
  url: 'https://tanzil.net/docs/Text_License',
  attribution: 'Tanzil Project — https://tanzil.net',
  verbatimOnly: true,
};

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function download(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'WikiTefsir corpus importer/1.0' },
  });

  if (!response.ok) {
    throw new Error(`Download failed (${response.status}): ${url}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function parseVerses(rawText) {
  const verses = rawText
    .split(/\r?\n/u)
    .filter((line) => /^\d+\|\d+\|/u.test(line))
    .map((line) => {
      const firstSeparator = line.indexOf('|');
      const secondSeparator = line.indexOf('|', firstSeparator + 1);
      return {
        surah: Number(line.slice(0, firstSeparator)),
        ayah: Number(line.slice(firstSeparator + 1, secondSeparator)),
        text: line.slice(secondSeparator + 1),
      };
    });

  if (verses.length !== 6236) {
    throw new Error(`Expected 6236 verses, received ${verses.length}`);
  }

  if (!rawText.includes('PLEASE DO NOT REMOVE OR CHANGE THIS COPYRIGHT BLOCK')) {
    throw new Error('Tanzil copyright block is missing');
  }

  return verses;
}

function extractCopyrightNotice(rawText) {
  const marker = '# PLEASE DO NOT REMOVE OR CHANGE THIS COPYRIGHT BLOCK';
  const markerIndex = rawText.indexOf(marker);
  if (markerIndex === -1) throw new Error('Tanzil copyright block is missing');
  return rawText.slice(markerIndex).trimEnd();
}

function parseSurahs(metadataXml) {
  const surahs = [...metadataXml.matchAll(/<sura\s+([^>]+?)\s*\/>/gu)].map((match) => {
    const attributes = Object.fromEntries(
      [...match[1].matchAll(/(\w+)="([^"]*)"/gu)].map((attribute) => [attribute[1], attribute[2]]),
    );

    return {
      number: Number(attributes.index),
      ayahCount: Number(attributes.ayas),
      startOffset: Number(attributes.start),
      nameArabic: attributes.name,
      nameTransliterated: attributes.tname,
      nameEnglish: attributes.ename,
      revelationType: attributes.type,
      revelationOrder: Number(attributes.order),
      rukuCount: Number(attributes.rukus),
    };
  });

  if (surahs.length !== 114) {
    throw new Error(`Expected 114 surahs, received ${surahs.length}`);
  }

  return surahs;
}

function verifyStructure(verses, surahs) {
  for (const surah of surahs) {
    const records = verses.filter((verse) => verse.surah === surah.number);
    if (records.length !== surah.ayahCount) {
      throw new Error(`Surah ${surah.number}: expected ${surah.ayahCount}, received ${records.length}`);
    }

    records.forEach((verse, index) => {
      if (verse.ayah !== index + 1 || verse.text.length === 0) {
        throw new Error(`Invalid verse sequence at ${surah.number}:${verse.ayah}`);
      }
    });
  }
}

async function writeAtomic(path, contents) {
  const temporaryPath = `${path}.tmp`;
  await writeFile(temporaryPath, contents);
  await rename(temporaryPath, path);
}

async function main() {
  const [textBuffer, metadataBuffer] = await Promise.all([
    download(textSource.url),
    download(metadataSource.url),
  ]);

  const rawText = textBuffer.toString('utf8');
  const metadataXml = metadataBuffer.toString('utf8');
  const verses = parseVerses(rawText);
  const surahs = parseSurahs(metadataXml);
  verifyStructure(verses, surahs);

  const verseCatalog = {
    corpus: 'quran-verses',
    source: textSource.id,
    license,
    copyrightNotice: extractCopyrightNotice(rawText),
    records: verses,
  };

  const verseCatalogBuffer = Buffer.from(`${JSON.stringify(verseCatalog)}\n`, 'utf8');

  const manifest = {
    corpus: 'quran',
    verseCount: verses.length,
    surahCount: surahs.length,
    license,
    sources: [
      { ...textSource, sha256: sha256(textBuffer) },
      { ...metadataSource, sha256: sha256(metadataBuffer) },
    ],
    artifacts: [
      { filename: 'verses.json', sha256: sha256(verseCatalogBuffer), recordCount: verses.length },
    ],
  };

  const surahCatalog = {
    corpus: 'quran-surahs',
    source: metadataSource.id,
    license,
    records: surahs,
  };

  await mkdir(outputDir, { recursive: true });
  await writeAtomic(join(outputDir, textSource.filename), textBuffer);
  await writeAtomic(join(outputDir, metadataSource.filename), metadataBuffer);
  await writeAtomic(join(outputDir, 'verses.json'), verseCatalogBuffer);
  await writeAtomic(join(outputDir, 'surahs.json'), `${JSON.stringify(surahCatalog, null, 2)}\n`);
  await writeAtomic(join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  process.stdout.write(`Imported ${verses.length} verses across ${surahs.length} surahs.\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
