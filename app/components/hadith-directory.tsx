'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

export interface HadithDirectoryRecord {
  id: string;
  title: string;
  attribution: string;
  grade: string;
  categories: string;
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

export function HadithDirectory({ records }: { records: HadithDirectoryRecord[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const filtered = useMemo(() => {
    const term = normalize(query);
    if (term.length < 2) return records;
    return records.filter((record) =>
      normalize(`${record.id} ${record.title} ${record.attribution} ${record.grade} ${record.categories}`).includes(term),
    );
  }, [query, records]);
  const visible = filtered.slice(0, visibleCount);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const first = visible[0];
    if (first) router.push(`/hadith/${first.id}`);
  }

  return (
    <section className="hadith-directory" aria-labelledby="hadith-directory-title">
      <div className="section-title">
        <div><span className="section-kicker">Verified corpus</span><h2 id="hadith-directory-title">Authentic hadiths</h2></div>
        <span className="review-status">{filtered.length.toLocaleString('en-US')} records</span>
      </div>
      <form className="library-search" role="search" onSubmit={handleSubmit}>
        <span aria-hidden="true">⌕</span>
        <label className="sr-only" htmlFor="hadith-search">Search hadiths</label>
        <input
          id="hadith-search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setVisibleCount(pageSize);
          }}
          placeholder="Hadith title, attribution, topic or HadeethEnc number…"
          autoComplete="off"
        />
        <button type="submit" disabled={!visible.length}>Open</button>
      </form>
      <div className="hadith-result-list" aria-live="polite">
        {visible.map((record) => (
          <article key={record.id}>
            <div className="hadith-result-meta">
              <span>HadeethEnc #{record.id}</span><span>{record.grade}</span><span>{record.attribution}</span>
            </div>
            <h3><Link href={`/hadith/${record.id}`}>{record.title}</Link></h3>
            {record.categories && <p>{record.categories}</p>}
            <Link className="text-link" href={`/hadith/${record.id}`}>Open hadith article <span aria-hidden="true">→</span></Link>
          </article>
        ))}
        {!visible.length && <p className="empty-state">No matching authentic hadith record was found.</p>}
      </div>
      {visibleCount < filtered.length && (
        <button className="load-more" type="button" onClick={() => setVisibleCount((count) => count + pageSize)}>
          Show more hadiths
        </button>
      )}
    </section>
  );
}
