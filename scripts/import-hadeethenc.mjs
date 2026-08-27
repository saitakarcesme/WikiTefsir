#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(projectRoot, 'data', 'hadith');
const expectedVersion = '1.67.0';
const language = 'tr';
const apiBase = 'https://hadeethenc.com/api/v1';
const versionSourceUrl = 'https://hadeethenc.com/browse/download/tr';
const terms = {
  url: 'https://hadeethenc.com/en/home',
  attribution: 'HadeethEnc.com — Tercüme Edilmiş Nebevî Hadisler Ansiklopedisi',
  publisher: 'HadeethEnc.com',
  verbatimOnly: true,
  versionRequired: true,
  sourceLinkRequired: true,
};

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function fetchResponse(url, options = {}) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetch(url, {
      ...options,
      headers: { 'user-agent': 'WikiTefsir corpus importer/1.0', ...options.headers },
    });
    if (response.ok) return response;
    if (attempt === 4 || (response.status < 500 && response.status !== 429)) {
      throw new Error(`Request failed (${response.status}): ${url}`);
    }
    await delay(attempt * 350);
  }
  throw new Error(`Request failed: ${url}`);
}

async function fetchJson(url) {
  return (await fetchResponse(url)).json();
}

async function writeAtomic(path, contents) {
  const temporaryPath = `${path}.tmp`;
  await writeFile(temporaryPath, contents);
  await rename(temporaryPath, path);
}

async function mapConcurrent(items, concurrency, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

function verifyRecord(record) {
  const reference = `HadeethEnc ${record?.id ?? 'unknown'}`;
  assert(/^\d+$/u.test(record?.id), `${reference}: invalid id`);
  assert(typeof record.title === 'string' && record.title.length > 0, `${reference}: Turkish title is missing`);
  assert(typeof record.hadeeth === 'string' && record.hadeeth.length > 0, `${reference}: Turkish hadith is missing`);
  assert(typeof record.hadeeth_ar === 'string' && record.hadeeth_ar.length > 0, `${reference}: Arabic hadith is missing`);
  assert(typeof record.attribution === 'string' && record.attribution.length > 0, `${reference}: attribution is missing`);
  assert(typeof record.grade === 'string' && record.grade.length > 0, `${reference}: grade is missing`);
  assert(Array.isArray(record.categories) && record.categories.length > 0, `${reference}: categories are missing`);
  assert(Array.isArray(record.translations) && record.translations.includes(language), `${reference}: Turkish translation flag is missing`);
}

async function main() {
  const versionResponse = await fetchResponse(versionSourceUrl, { method: 'HEAD' });
  const versionMatch = versionResponse.url.match(/HadeethEnc\.com_tr-v([0-9.]+)\.xlsx$/u);
  assert(versionMatch, `Could not resolve HadeethEnc version from ${versionResponse.url}`);
  assert(versionMatch[1] === expectedVersion, `Expected HadeethEnc ${expectedVersion}, received ${versionMatch[1]}`);

  const [rootCategories, categories] = await Promise.all([
    fetchJson(`${apiBase}/categories/roots/?language=${language}`),
    fetchJson(`${apiBase}/categories/list/?language=${language}`),
  ]);
  assert(Array.isArray(rootCategories) && rootCategories.length === 7, 'Expected seven root categories');
  assert(Array.isArray(categories) && categories.length > rootCategories.length, 'Full category catalog is missing');

  const listings = await Promise.all(
    rootCategories.map((category) =>
      fetchJson(`${apiBase}/hadeeths/list/?language=${language}&category_id=${category.id}&page=1&per_page=5000`),
    ),
  );
  const ids = [...new Set(listings.flatMap((listing) => listing.data.map((record) => record.id)))]
    .sort((left, right) => Number(left) - Number(right));
  assert(ids.length === 2150, `Expected 2150 unique hadiths, received ${ids.length}`);

  let completed = 0;
  const records = await mapConcurrent(ids, 16, async (id) => {
    const record = await fetchJson(`${apiBase}/hadeeths/one/?language=${language}&id=${id}`);
    verifyRecord(record);
    completed += 1;
    if (completed % 100 === 0 || completed === ids.length) {
      process.stdout.write(`Fetched ${completed}/${ids.length} HadeethEnc records.\n`);
    }
    return record;
  });

  const catalog = {
    corpus: 'verified-hadiths',
    source: `hadeethenc-tr-${expectedVersion}`,
    language,
    version: expectedVersion,
    terms,
    rootCategories,
    categories,
    records,
  };
  const catalogBuffer = Buffer.from(`${JSON.stringify(catalog)}\n`, 'utf8');
  const manifest = {
    corpus: 'verified-hadiths',
    source: 'HadeethEnc.com',
    language,
    version: expectedVersion,
    recordCount: records.length,
    categoryCount: categories.length,
    terms,
    endpoints: {
      version: versionSourceUrl,
      roots: `${apiBase}/categories/roots/?language=${language}`,
      categories: `${apiBase}/categories/list/?language=${language}`,
      record: `${apiBase}/hadeeths/one/?language=${language}&id={id}`,
    },
    artifacts: [
      { filename: 'hadeethenc-tr.json', sha256: sha256(catalogBuffer), recordCount: records.length },
    ],
  };

  await mkdir(outputDir, { recursive: true });
  await writeAtomic(join(outputDir, 'hadeethenc-tr.json'), catalogBuffer);
  await writeAtomic(join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  process.stdout.write(`Imported ${records.length} verified hadith records from HadeethEnc ${expectedVersion}.\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
