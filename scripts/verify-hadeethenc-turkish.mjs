#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const dataDir = join(projectRoot, 'data', 'hadith');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const catalog = JSON.parse(await readFile(join(dataDir, 'hadeethenc-tr.json'), 'utf8'));

assert(catalog.language === 'tr', 'Turkish HadeethEnc language marker is missing');
assert(catalog.source === `hadeethenc-tr-${catalog.version}`, 'Turkish HadeethEnc source/version marker differs');
assert(catalog.terms?.verbatimOnly === true && catalog.terms?.sourceLinkRequired === true, 'Turkish HadeethEnc reuse terms are incomplete');
assert(catalog.records.length === catalog.publicationFilter.sourceRecordCount - catalog.publicationFilter.excludedRecordCount, 'Turkish authentic record count differs from the source filter');
const categoryIds = new Set(catalog.categories.map((category) => String(category.id)));
for (const record of catalog.records) {
  assert(/^\d+$/u.test(record.id), `Invalid Turkish HadeethEnc id: ${record.id}`);
  assert(/sahih/iu.test(record.grade), `Turkish record is not explicitly graded sahih: ${record.id}`);
  assert(record.translations.includes('tr'), `Turkish source flag is missing: ${record.id}`);
  for (const field of ['title', 'hadeeth', 'hadeeth_ar', 'attribution', 'grade']) assert(typeof record[field] === 'string' && record[field].trim(), `${record.id}: ${field} is missing`);
  for (const category of record.categories) assert(categoryIds.has(String(category)), `${record.id}: unknown category ${category}`);
}
process.stdout.write(`Verified ${catalog.records.length} Turkish-source sahih HadeethEnc records and ${catalog.categories.length} Turkish-source categories.\n`);
