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
        {status === 'loading' ? 'Üç klasik tefsir yükleniyor…' : status === 'ready' ? 'Tefsirler yüklendi' : 'İbn Kesîr, Taberî ve Kurtubî tefsirlerini aç'}
      </button>
      {status === 'error' && <p className="tafsir-error">Kaynak doğrulaması şu anda tamamlanamadı. Lütfen yeniden deneyin.</p>}
      {payload && (
        <div className="tafsir-records">
          <div className="tafsir-caution">
            <strong>Klasik eser alıntısı</strong>
            <span>Bir tefsirde rivayet aktarılması, o rivayete otomatik olarak “sahih hadis” hükmü vermez.</span>
          </div>
          {payload.records.map((record) => (
            <details key={record.source.id}>
              <summary><span>{record.source.author}</span><small>{record.source.work} · {record.source.school}</small></summary>
              {record.hasCommentary
                ? <p lang="ar" dir="rtl">{record.text}</p>
                : <p className="tafsir-unavailable">Bu ayet için kaynak veri yorum sunmuyor ({record.coverageStatus}).</p>}
            </details>
          ))}
          <small className="tafsir-release">Quran Lab quran-tafsir {payload.release} · {payload.verseKey} · rev. {payload.revision.slice(0, 12)}</small>
        </div>
      )}
    </div>
  );
}
