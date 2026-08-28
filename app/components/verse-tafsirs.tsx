'use client';

import { useState } from 'react';

interface TafsirPayload {
  verseKey: string;
  release: string;
  revision: string;
  records: Array<{
    source: { id: string; author: string; work: string; school: string };
    text: string;
    hasCommentary: boolean;
    coverageStatus: string;
  }>;
  englishTafsir: null | {
    author: string;
    work: string;
    language: 'English';
    text: string;
    sourceUrl: string;
  };
}

export function VerseTafsirs({ surah, ayah }: { surah: number; ayah: number }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [payload, setPayload] = useState<TafsirPayload>();

  async function loadTafsirs() {
    if (status === 'ready') return;
    setStatus('loading');
    try {
      const response = await fetch(`/api/tafsir?surah=${surah}&ayah=${ayah}`);
      if (!response.ok) throw new Error(`Tafsir request failed: ${response.status}`);
      setPayload(await response.json() as TafsirPayload);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="verse-tafsirs">
      <button type="button" onClick={loadTafsirs} disabled={status === 'loading'} aria-expanded={status === 'ready'}>
        {status === 'loading' ? 'Loading English and Arabic tafsirs…' : status === 'ready' ? 'Tafsirs loaded' : 'Read English and Arabic tafsirs'}
      </button>
      {status === 'error' && <p className="tafsir-error">Source verification could not be completed. Please try again.</p>}
      {payload && (
        <div className="tafsir-records">
          {payload.englishTafsir ? <article className="english-tafsir">
            <header><div><span>English tafsir</span><h3>{payload.englishTafsir.work}</h3></div><a href={payload.englishTafsir.sourceUrl} target="_blank" rel="noreferrer">Quran.com ↗</a></header>
            <p>{payload.englishTafsir.text}</p>
          </article> : null}
          {payload.records.map((record) => (
            <details key={record.source.id}>
              <summary><span>{record.source.author}</span><small>Arabic · {record.source.work} · {record.source.school}</small></summary>
              {record.hasCommentary
                ? <p lang="ar" dir="rtl">{record.text}</p>
                : <p className="tafsir-unavailable">The source provides no commentary for this verse ({record.coverageStatus}).</p>}
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
