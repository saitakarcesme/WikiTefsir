'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState, useTransition } from 'react';
import type { Locale } from '@/lib/locale';

interface SearchResult {
  type: 'Verse' | 'Surah' | 'Hadith' | 'Concept' | 'Person' | 'Scholar';
  title: string;
  description: string;
  href: string;
  language?: 'ar' | 'en' | 'tr';
}

export function SearchExplorer({ locale }: { locale: Locale }) {
  const tr = locale === 'tr';
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus('loading');
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&lang=${locale}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Search request failed');
        const payload = await response.json() as { results: SearchResult[] };
        setResults(payload.results);
        setStatus('ready');
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setResults([]);
        setStatus('error');
      }
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [locale, query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstResult = results[0];
    if (firstResult) startTransition(() => router.push(firstResult.href));
  }

  return (
    <div className="search-area">
      <form className="search-box" onSubmit={handleSubmit} role="search">
        <span className="search-icon" aria-hidden="true">⌕</span>
        <label className="sr-only" htmlFor="main-search">{tr ? 'Kur’an ve hadis külliyatında ara' : 'Search the Quran and hadith corpus'}</label>
        <input
          id="main-search"
          name="q"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            if (nextQuery.trim().length < 2) {
              setResults([]);
              setStatus('idle');
            }
          }}
          placeholder={tr ? 'Allah’ın sizi yönelttiği şeyi arayın…' : 'Search whatever Allah guides you to…'}
          autoComplete="off"
        />
        <button type="submit" disabled={query.trim().length < 2 || !results.length}>{tr ? 'Ara' : 'Search'} <span aria-hidden="true">→</span></button>
      </form>

      {query.trim().length >= 2 && (
        <div className="search-results" aria-live="polite" aria-busy={status === 'loading'}>
          {results.length ? (
            results.map((record) => (
              <Link prefetch key={`${record.type}-${record.href}`} href={record.href} onClick={() => setQuery('')}>
                <span className="result-type">{tr ? ({ Verse: 'Ayet', Surah: 'Sure', Hadith: 'Hadis', Concept: 'Kavram', Person: 'Kişi', Scholar: 'Âlim' } as const)[record.type] : record.type}</span>
                <span>
                  <strong>{record.title}</strong>
                  <small lang={record.language} dir={record.language === 'ar' ? 'rtl' : undefined}>{record.description}</small>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            ))
          ) : (
            <p>{status === 'loading' ? (tr ? 'Kur’an ve sahih hadis külliyatı aranıyor…' : 'Searching the Quran and authentic hadith corpus…') : status === 'error' ? (tr ? 'Arama geçici olarak kullanılamıyor.' : 'Search is temporarily unavailable.') : (tr ? 'Eşleşen doğrulanmış kayıt bulunamadı.' : 'No matching verified record was found.')}</p>
          )}
        </div>
      )}
    </div>
  );
}
