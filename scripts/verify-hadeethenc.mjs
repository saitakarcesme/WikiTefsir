#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const dataDir = join(projectRoot, 'data', 'hadith');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

const [manifestBuffer, catalogBuffer] = await Promise.all([
  readFile(join(dataDir, 'manifest.json')),
  readFile(join(dataDir, 'hadeethenc-tr.json')),
]);
const manifest = JSON.parse(manifestBuffer);
const catalog = JSON.parse(catalogBuffer);
const artifact = manifest.artifacts.find((entry) => entry.filename === 'hadeethenc-tr.json');

assert(manifest.version === '1.67.0', `Unexpected manifest version: ${manifest.version}`);
assert(catalog.version === manifest.version, 'Catalog and manifest versions differ');
assert(manifest.sourceRecordCount === 2150, 'Expected 2150 records in the source release');
assert(manifest.recordCount === 1993, 'Expected 1993 explicitly sahih records');
assert(catalog.records.length === manifest.recordCount, 'Record count differs from manifest');
assert(catalog.categories.length === 433, 'Expected 433 HadeethEnc categories');
assert(catalog.rootCategories.length === 7, 'Expected seven HadeethEnc root categories');
assert(artifact?.sha256 === sha256(catalogBuffer), 'Hadith corpus checksum differs from manifest');
assert(artifact.recordCount === catalog.records.length, 'Artifact count differs from catalog');

const categoryIds = new Set(catalog.categories.map((category) => String(category.id)));
const recordIds = new Set();
for (const record of catalog.records) {
  const reference = `HadeethEnc ${record?.id ?? 'unknown'}`;
  assert(/^\d+$/u.test(record.id), `${reference}: invalid id`);
  assert(!recordIds.has(record.id), `${reference}: duplicate id`);
  recordIds.add(record.id);
  for (const field of ['title', 'hadeeth', 'hadeeth_ar', 'attribution', 'grade']) {
    assert(typeof record[field] === 'string' && record[field].trim().length > 0, `${reference}: ${field} is missing`);
  }
  assert(/sahih/iu.test(record.grade), `${reference}: grade is not explicitly sahih: ${record.grade}`);
  assert(Array.isArray(record.translations) && record.translations.includes('tr'), `${reference}: Turkish flag is missing`);
  assert(Array.isArray(record.categories) && record.categories.length > 0, `${reference}: categories are missing`);
  for (const category of record.categories) {
    assert(categoryIds.has(String(category)), `${reference}: unknown category ${category}`);
  }
}

process.stdout.write(
  `Verified ${catalog.records.length} explicitly sahih HadeethEnc records, ${catalog.categories.length} categories, and SHA-256 integrity.\n`,
);
