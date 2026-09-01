'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useDeferredValue, useEffect, useState } from 'react';
import type { Locale } from '@/lib/locale';

export interface HadithDirectoryRecord {
  id: string;
  title: string;
  attribution: string;
  grade: string;
  categories: string;
  themes: string[];
}

const pageSize = 30;

export function HadithDirectory({ initialRecords, total, themes, locale }: { initialRecords: HadithDirectoryRecord[]; total: number; themes: string[]; locale: Locale }) {
  const tr = locale === 'tr';
  const router = useRouter();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [records, setRecords] = useState(initialRecords);
  const [resultCount, setResultCount] = useState(total);
  const [loading, setLoading] = useState(false);
  const allLabel = tr ? 'Tümü' : 'All';
  const [activeTheme, setActiveTheme] = useState(allLabel);
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ lang: locale, limit: String(pageSize) });
        if (deferredQuery.trim().length >= 2) params.set('q', deferredQuery.trim());
        if (activeTheme !== allLabel) params.set('theme', activeTheme);
        const response = await fetch(`/api/hadith-directory?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Hadith directory request failed');
        const payload = await response.json() as { records: HadithDirectoryRecord[]; total: number };
        setRecords(payload.records); setResultCount(payload.total);
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, deferredQuery.trim().length >= 2 ? 150 : 0);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [activeTheme, allLabel, deferredQuery, locale]);

  const visible = records;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const first = visible[0];
    if (first) router.push(`/hadith/${first.id}`);
  }

  return (
    <section className="hadith-directory" aria-labelledby="hadith-directory-title">
      <div className="section-title">
        <div><span className="section-kicker">{tr ? 'Doğrulanmış külliyat' : 'Verified corpus'}</span><h2 id="hadith-directory-title">{tr ? 'Sahih hadisler' : 'Authentic hadiths'}</h2></div>
        <span className="review-status">{resultCount.toLocaleString(tr ? 'tr-TR' : 'en-US')} {tr ? 'kayıt' : 'records'}</span>
      </div>
      <div className="hadith-theme-filter" aria-label={tr ? 'Hadisleri hayat alanına göre filtrele' : 'Filter hadiths by life situation'}>
        {[allLabel, ...themes].map((theme) => <button className={activeTheme === theme ? 'active' : ''} type="button" aria-pressed={activeTheme === theme} key={theme} onClick={() => setActiveTheme(theme)}>{theme}</button>)}
      </div>
      <form className="library-search" role="search" onSubmit={handleSubmit}>
        <span aria-hidden="true">⌕</span>
        <label className="sr-only" htmlFor="hadith-search">{tr ? 'Hadislerde ara' : 'Search hadiths'}</label>
        <input
          id="hadith-search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          placeholder={tr ? 'Hadis başlığı, râvi, konu veya HadeethEnc numarası…' : 'Hadith title, attribution, topic or HadeethEnc number…'}
          autoComplete="off"
        />
        <button type="submit" disabled={!visible.length}>{tr ? 'Aç' : 'Open'}</button>
      </form>
      <div className="hadith-result-list" aria-live="polite" aria-busy={loading}>
        {visible.map((record) => (
          <article key={record.id}>
            <div className="hadith-result-meta">
              <span>HadeethEnc #{record.id}</span><span>{record.grade}</span><span>{record.themes[0]}</span>
            </div>
            <h3><Link href={`/hadith/${record.id}`}>{record.title}</Link></h3>
            {record.categories && <p>{record.categories}</p>}
            <Link className="text-link" href={`/hadith/${record.id}`}>{tr ? 'Hadis makalesini aç' : 'Open hadith article'} <span aria-hidden="true">→</span></Link>
          </article>
        ))}
        {!visible.length && <p className="empty-state">{tr ? 'Eşleşen sahih hadis kaydı bulunamadı.' : 'No matching authentic hadith record was found.'}</p>}
      </div>
      {records.length < resultCount && (
        <button className="load-more" type="button" disabled={loading} onClick={async () => {
          setLoading(true);
          const params = new URLSearchParams({ lang: locale, limit: String(pageSize), offset: String(records.length) });
          if (deferredQuery.trim().length >= 2) params.set('q', deferredQuery.trim());
          if (activeTheme !== allLabel) params.set('theme', activeTheme);
          const response = await fetch(`/api/hadith-directory?${params}`);
          const payload = await response.json() as { records: HadithDirectoryRecord[]; total: number };
          setRecords((current) => [...current, ...payload.records]); setResultCount(payload.total); setLoading(false);
        }}>
          {tr ? 'Daha fazla hadis göster' : 'Show more hadiths'}
        </button>
      )}
    </section>
  );
}
