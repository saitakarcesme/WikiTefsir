'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useDeferredValue, useMemo, useState } from 'react';
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

function normalize(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[’'`]/gu, '')
    .toLocaleLowerCase('en-US')
    .replace(/\s+/gu, ' ')
    .trim();
}

export function HadithDirectory({ records, themes, locale }: { records: HadithDirectoryRecord[]; themes: string[]; locale: Locale }) {
  const tr = locale === 'tr';
  const router = useRouter();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const allLabel = tr ? 'Tümü' : 'All';
  const [activeTheme, setActiveTheme] = useState(allLabel);
  const filtered = useMemo(() => {
    const term = normalize(deferredQuery);
    return records.filter((record) => {
      if (activeTheme !== allLabel && !record.themes.includes(activeTheme)) return false;
      if (term.length < 2) return true;
      return normalize(`${record.id} ${record.title} ${record.attribution} ${record.grade} ${record.categories} ${record.themes.join(' ')}`).includes(term);
    });
  }, [activeTheme, allLabel, deferredQuery, records]);
  const visible = filtered.slice(0, visibleCount);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const first = visible[0];
    if (first) router.push(`/hadith/${first.id}`);
  }

  return (
    <section className="hadith-directory" aria-labelledby="hadith-directory-title">
      <div className="section-title">
        <div><span className="section-kicker">{tr ? 'Doğrulanmış külliyat' : 'Verified corpus'}</span><h2 id="hadith-directory-title">{tr ? 'Sahih hadisler' : 'Authentic hadiths'}</h2></div>
        <span className="review-status">{filtered.length.toLocaleString(tr ? 'tr-TR' : 'en-US')} {tr ? 'kayıt' : 'records'}</span>
      </div>
      <div className="hadith-theme-filter" aria-label="Filter hadiths by life situation">
        {[allLabel, ...themes].map((theme) => <button className={activeTheme === theme ? 'active' : ''} type="button" aria-pressed={activeTheme === theme} key={theme} onClick={() => { setActiveTheme(theme); setVisibleCount(pageSize); }}>{theme}</button>)}
      </div>
      <form className="library-search" role="search" onSubmit={handleSubmit}>
        <span aria-hidden="true">⌕</span>
        <label className="sr-only" htmlFor="hadith-search">{tr ? 'Hadislerde ara' : 'Search hadiths'}</label>
        <input
          id="hadith-search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setVisibleCount(pageSize);
          }}
          placeholder={tr ? 'Hadis başlığı, râvi, konu veya HadeethEnc numarası…' : 'Hadith title, attribution, topic or HadeethEnc number…'}
          autoComplete="off"
        />
        <button type="submit" disabled={!visible.length}>{tr ? 'Aç' : 'Open'}</button>
      </form>
      <div className="hadith-result-list" aria-live="polite">
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
      {visibleCount < filtered.length && (
        <button className="load-more" type="button" onClick={() => setVisibleCount((count) => count + pageSize)}>
          {tr ? 'Daha fazla hadis göster' : 'Show more hadiths'}
        </button>
      )}
    </section>
  );
}
