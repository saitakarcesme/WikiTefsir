#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(await readFile(join(projectRoot, 'data', 'tafsir', 'manifest.json')));
const online = process.argv.includes('--online');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(manifest.dataset === 'quranlab/quran-tafsir', 'Unexpected tafsir dataset');
assert(/^[a-f0-9]{40}$/u.test(manifest.revision), 'Tafsir revision must be a Git SHA-1');
assert(manifest.recordsPerSource === 6236, 'Every tafsir source must retain all 6,236 ayah rows');
assert(manifest.sources.length === 3, 'Expected three accepted classical tafsir sources');
assert(new Set(manifest.sources.map((source) => source.id)).size === 3, 'Tafsir source ids must be unique');

for (const source of manifest.sources) {
  assert(/^tafsir-[a-z]+-ar$/u.test(source.id), `Invalid source id: ${source.id}`);
  assert(source.terms === 'public-domain', `${source.id}: unexpected terms`);
  assert(source.commentaryCount + (source.sourceUnavailableCount ?? 0) === 6236, `${source.id}: coverage does not total 6,236`);
  assert(Number.isInteger(source.parquetBytes) && source.parquetBytes > 0, `${source.id}: invalid Parquet size`);
  assert(/^[a-f0-9]{64}$/u.test(source.parquetSha256), `${source.id}: invalid LFS SHA-256`);
}

if (online) {
  for (const source of manifest.sources) {
    const filename = `${source.id}/train-00000-of-00001.parquet`;
    const url = `https://huggingface.co/datasets/${manifest.dataset}/resolve/${manifest.revision}/${filename}`;
    const response = await fetch(url, { method: 'HEAD', redirect: 'manual' });
    assert(response.status === 302, `${source.id}: expected a pinned artifact redirect, received ${response.status}`);
    assert(response.headers.get('x-repo-commit') === manifest.revision, `${source.id}: revision header mismatch`);
    assert(Number(response.headers.get('x-linked-size')) === source.parquetBytes, `${source.id}: artifact size mismatch`);
    assert(response.headers.get('x-linked-etag')?.replaceAll('"', '') === source.parquetSha256, `${source.id}: LFS SHA-256 mismatch`);
  }
}

process.stdout.write(
  `Verified ${manifest.sources.length} pinned tafsir sources and ${manifest.sources.length * manifest.recordsPerSource} ayah rows${online ? ' against Hugging Face' : ''}.\n`,
);
