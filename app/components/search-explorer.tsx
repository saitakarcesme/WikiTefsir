'use client';

import { FormEvent, useMemo, useState } from 'react';

const records = [
  { type: 'Ayet', title: 'Fâtiha Suresi, 5. Ayet', description: 'İbadet, dua ve yalnız Allah’tan yardım istemek', href: '#fatiha' },
  { type: 'Sure', title: 'Fâtiha Suresi', description: '1. sure · 7 ayet · Mekkî', href: '#fatiha' },
  { type: 'Kavram', title: 'Sabır', description: 'İlgili ayet, hadis ve tefsir kayıtları', href: '#iliskiler' },
  { type: 'Âlim', title: 'İmam Taberî', description: 'Câmiu’l-Beyân müellifi', href: '#alimler' },
  { type: 'Âlim', title: 'İbn Kesîr', description: 'Tefsîru’l-Kur’âni’l-Azîm müellifi', href: '#alimler' },
  { type: 'Külliyat', title: 'Sahîh-i Buhârî', description: 'Kütüb-i Sitte hadis koleksiyonu', href: '#hadisler' },
];

export function SearchExplorer() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('tr-TR');
    if (!normalized) return [];
    return records.filter((record) =>
      `${record.type} ${record.title} ${record.description}`
        .toLocaleLowerCase('tr-TR')
        .includes(normalized),
    );
  }, [query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="search-area">
      <form className="search-box" onSubmit={handleSubmit} role="search">
        <span className="search-icon" aria-hidden="true">⌕</span>
        <label className="sr-only" htmlFor="main-search">WikiTefsir’de ara</label>
        <input
          id="main-search"
          name="q"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSubmitted(false);
          }}
          placeholder="Ayet, hadis, konu veya âlim ara…"
          autoComplete="off"
        />
        <button type="submit">Ara <span aria-hidden="true">→</span></button>
      </form>

      {query && (
        <div className="search-results" aria-live="polite">
          {results.length ? (
            results.slice(0, 5).map((record) => (
              <a key={`${record.type}-${record.title}`} href={record.href} onClick={() => setQuery('')}>
                <span className="result-type">{record.type}</span>
                <span><strong>{record.title}</strong><small>{record.description}</small></span>
                <span aria-hidden="true">→</span>
              </a>
            ))
          ) : (
            <p>{submitted ? 'Bu ilk sürümde eşleşen doğrulanmış kayıt bulunamadı.' : 'Aramaya devam edin…'}</p>
          )}
        </div>
      )}
    </div>
  );
}
