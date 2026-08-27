'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

interface SurahDirectoryItem {
  number: number;
  nameArabic: string;
  nameTransliterated: string;
  nameEnglish: string;
  ayahCount: number;
  revelationType: 'Meccan' | 'Medinan';
  href: string;
}

export function SurahDirectory({ items }: { items: SurahDirectoryItem[] }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'Meccan' | 'Medinan'>('all');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('tr-TR');
    return items.filter((item) => {
      const matchesType = type === 'all' || item.revelationType === type;
      const searchable = `${item.number} ${item.nameArabic} ${item.nameTransliterated} ${item.nameEnglish}`
        .toLocaleLowerCase('tr-TR');
      return matchesType && (!normalized || searchable.includes(normalized));
    });
  }, [items, query, type]);

  return (
    <section aria-labelledby="directory-title">
      <div className="directory-toolbar">
        <div>
          <label className="sr-only" htmlFor="surah-search">Surelerde ara</label>
          <span aria-hidden="true">⌕</span>
          <input
            id="surah-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sure adı veya numarası…"
          />
        </div>
        <div className="directory-filters" aria-label="Nüzul yeri filtresi">
          {[
            ['all', 'Tümü'],
            ['Meccan', 'Mekkî'],
            ['Medinan', 'Medenî'],
          ].map(([value, label]) => (
            <button
              className={type === value ? 'active' : ''}
              key={value}
              onClick={() => setType(value as typeof type)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="directory-count" aria-live="polite">{filtered.length} sure gösteriliyor</p>
      <div className="surah-directory" id="directory-title">
        {filtered.map((surah) => (
          <Link href={surah.href} className="surah-directory-card" key={surah.number}>
            <span className="surah-index">{surah.number}</span>
            <span>
              <strong>{surah.nameTransliterated}</strong>
              <small>{surah.revelationType === 'Meccan' ? 'Mekkî' : 'Medenî'} · {surah.ayahCount} ayet</small>
            </span>
            <span className="surah-arabic" lang="ar" dir="rtl" translate="no">{surah.nameArabic}</span>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && <p className="directory-empty">Bu filtrelerle eşleşen sure bulunamadı.</p>}
    </section>
  );
}
