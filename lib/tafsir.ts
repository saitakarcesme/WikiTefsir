import tafsirManifestJson from '@/data/tafsir/manifest.json';

export interface TafsirSource {
  id: string;
  author: string;
  work: string;
  school: string;
  terms: string;
  commentaryCount: number;
  sourceUnavailableCount?: number;
  parquetBytes: number;
  parquetSha256: string;
}

export interface TafsirRecord {
  source: TafsirSource;
  verseKey: string;
  text: string;
  hasCommentary: boolean;
  coverageStatus: string;
}

interface TafsirManifest {
  corpus: string;
  publisher: string;
  dataset: string;
  release: string;
  revision: string;
  upstreamRevision: string;
  termsUrl: string;
  rowApi: string;
  recordsPerSource: number;
  sources: TafsirSource[];
}

interface DatasetRow {
  verse_key: string;
  text: string;
  tafsir_id: string;
  has_commentary: boolean;
  coverage_status: string;
}

interface DatasetRowsResponse {
  num_rows_total: number;
  rows: Array<{ row: DatasetRow }>;
}

const manifest = tafsirManifestJson as TafsirManifest;

export const tafsirMetadata = {
  publisher: manifest.publisher,
  dataset: manifest.dataset,
  release: manifest.release,
  revision: manifest.revision,
  upstreamRevision: manifest.upstreamRevision,
  termsUrl: manifest.termsUrl,
};

export function getTafsirSources() {
  return manifest.sources;
}

async function verifyPublishedRevision() {
  const response = await fetch(`https://huggingface.co/api/datasets/${manifest.dataset}`, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Tafsir revision check returned ${response.status}`);
  const payload = await response.json() as { sha?: string };
  if (payload.sha !== manifest.revision) {
    throw new Error(`Tafsir dataset moved from ${manifest.revision} to ${payload.sha ?? 'unknown'}`);
  }
}

export async function getTafsirsForVerse(verseKey: string, globalOffset: number): Promise<TafsirRecord[]> {
  if (!/^\d{1,3}:\d{1,3}$/u.test(verseKey) || !Number.isInteger(globalOffset) || globalOffset < 0 || globalOffset >= 6236) {
    throw new Error(`Invalid tafsir coordinate: ${verseKey} at ${globalOffset}`);
  }
  await verifyPublishedRevision();

  return Promise.all(manifest.sources.map(async (source) => {
    const parameters = new URLSearchParams({
      dataset: manifest.dataset,
      config: source.id,
      split: 'train',
      offset: String(globalOffset),
      length: '1',
    });
    const response = await fetch(`${manifest.rowApi}?${parameters}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`${source.id}: Dataset Viewer returned ${response.status}`);
    const payload = await response.json() as DatasetRowsResponse;
    const row = payload.rows[0]?.row;
    if (payload.num_rows_total !== manifest.recordsPerSource || !row) throw new Error(`${source.id}: incomplete Dataset Viewer response`);
    if (row.verse_key !== verseKey || row.tafsir_id !== source.id) {
      throw new Error(`${source.id}: expected ${verseKey}, received ${row.verse_key ?? 'no row'}`);
    }
    if (row.has_commentary !== Boolean(row.text)) throw new Error(`${source.id} ${verseKey}: commentary flag mismatch`);

    return {
      source,
      verseKey: row.verse_key,
      text: row.text,
      hasCommentary: row.has_commentary,
      coverageStatus: row.coverage_status,
    };
  }));
}
