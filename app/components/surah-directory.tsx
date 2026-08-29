'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/locale';

interface SurahDirectoryItem {
  number: number;
  nameArabic: string;
  nameTransliterated: string;
  nameEnglish: string;
  ayahCount: number;
  revelationType: 'Meccan' | 'Medinan';
  href: string;
}

export function SurahDirectory({ items, locale }: { items: SurahDirectoryItem[]; locale: Locale }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'Meccan' | 'Medinan'>('all');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('en-US');
    return items.filter((item) => {
      const matchesType = type === 'all' || item.revelationType === type;
      const searchable = `${item.number} ${item.nameArabic} ${item.nameTransliterated} ${item.nameEnglish}`
        .toLocaleLowerCase('en-US');
      return matchesType && (!normalized || searchable.includes(normalized));
    });
  }, [items, query, type]);

  return (
    <section aria-labelledby="directory-title">
      <div className="directory-toolbar">
        <div>
          <label className="sr-only" htmlFor="surah-search">{locale === 'tr' ? 'Surelerde ara' : 'Search surahs'}</label>
          <span aria-hidden="true">⌕</span>
          <input
            id="surah-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={locale === 'tr' ? 'Sure adı veya numarası…' : 'Surah name or number…'}
          />
        </div>
        <div className="directory-filters" aria-label="Revelation place filter">
          {[
            ['all', locale === 'tr' ? 'Tümü' : 'All'],
            ['Meccan', locale === 'tr' ? 'Mekki' : 'Meccan'],
            ['Medinan', locale === 'tr' ? 'Medeni' : 'Medinan'],
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

      <p className="directory-count" aria-live="polite">{locale === 'tr' ? `${filtered.length} sure gösteriliyor` : `Showing ${filtered.length} surahs`}</p>
      <div className="surah-directory" id="directory-title">
        {filtered.map((surah) => (
          <Link href={surah.href} className="surah-directory-card" key={surah.number}>
            <span className="surah-index">{surah.number}</span>
            <span>
              <strong>{surah.nameTransliterated}</strong>
              <small>{locale === 'tr' ? (surah.revelationType === 'Meccan' ? 'Mekki' : 'Medeni') : surah.revelationType} · {surah.ayahCount} {locale === 'tr' ? 'ayet' : 'verses'}</small>
            </span>
            <span className="surah-arabic" lang="ar" dir="rtl" translate="no">{surah.nameArabic}</span>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && <p className="directory-empty">{locale === 'tr' ? 'Bu filtrelerle eşleşen sure yok.' : 'No surah matches these filters.'}</p>}
    </section>
  );
}
