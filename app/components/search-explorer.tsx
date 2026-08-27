'use client';

import { FormEvent, useEffect, useState } from 'react';

interface SearchResult {
  type: 'Ayet' | 'Sure' | 'Hadis' | 'Kavram';
  title: string;
  description: string;
  href: string;
  language?: 'ar' | 'tr';
}

export function SearchExplorer() {
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
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
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
  }, [query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstResult = results[0];
    if (firstResult) window.location.assign(firstResult.href);
  }

  return (
    <div className="search-area">
      <form className="search-box" onSubmit={handleSubmit} role="search">
        <span className="search-icon" aria-hidden="true">⌕</span>
        <label className="sr-only" htmlFor="main-search">Kur’an ve hadis külliyatında ara</label>
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
          placeholder="Sure, ayet, meal, hadis, kavram veya h:1751 ara…"
          autoComplete="off"
        />
        <button type="submit" disabled={query.trim().length < 2 || !results.length}>Ara <span aria-hidden="true">→</span></button>
      </form>

      {query.trim().length >= 2 && (
        <div className="search-results" aria-live="polite" aria-busy={status === 'loading'}>
          {results.length ? (
            results.map((record) => (
              <a key={`${record.type}-${record.href}`} href={record.href} onClick={() => setQuery('')}>
                <span className="result-type">{record.type}</span>
                <span>
                  <strong>{record.title}</strong>
                  <small lang={record.language} dir={record.language === 'ar' ? 'rtl' : undefined}>{record.description}</small>
                </span>
                <span aria-hidden="true">→</span>
              </a>
            ))
          ) : (
            <p>{status === 'loading' ? 'Kur’an ve sahih hadis külliyatında aranıyor…' : status === 'error' ? 'Arama şu anda yanıt veremiyor.' : 'Eşleşen doğrulanmış kayıt bulunamadı.'}</p>
          )}
        </div>
      )}
    </div>
  );
}
