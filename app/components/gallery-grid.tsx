'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { galleryImageById } from '@/lib/gallery-images';
import type { GalleryScene } from '@/lib/gallery-scenes';
import type { Locale } from '@/lib/locale';

type GalleryDisplayScene = GalleryScene & { verseArabic?: string; verseText?: string };

export function GalleryGrid({ scenes, locale }: { scenes: GalleryDisplayScene[]; locale: Locale }) {
  const pageSize = 24;
  const tr = locale === 'tr';
  const [filter, setFilter] = useState<'All' | GalleryScene['kind']>('All');
  const [flipped, setFlipped] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const filtered = useMemo(() => filter === 'All' ? scenes : scenes.filter((scene) => scene.kind === filter), [filter, scenes]);
  const visible = filtered.slice(0, visibleCount);

  return <>
    <div className="gallery-controls" aria-label={tr ? 'Eserleri filtrele' : 'Filter artworks'}>
      {(['All', 'Quran', 'Hadith'] as const).map((value) => <button className={filter === value ? 'active' : ''} type="button" onClick={() => { setFilter(value); setVisibleCount(pageSize); setFlipped(null); }} aria-pressed={filter === value} key={value}>{tr ? ({ All: 'Tümü', Quran: 'Kur’an', Hadith: 'Hadis' } as const)[value] : value}</button>)}
      <span>{filtered.length} {tr ? 'kaynak temelli sahne' : 'source-based scenes'}</span>
    </div>
    <div className="gallery-grid">
      {visible.map((scene) => {
        const isFlipped = flipped === scene.id;
        const image = scene.image ?? galleryImageById[scene.id];
        return <article className={`gallery-work gallery-work-${(scene.id % 5) + 1}${isFlipped ? ' flipped' : ''}`} key={scene.id}>
          <button type="button" className="gallery-flip" onClick={() => setFlipped(isFlipped ? null : scene.id)} aria-pressed={isFlipped} aria-label={`${isFlipped ? (tr ? 'Eseri göster' : 'Show artwork') : (tr ? 'Kaynağı göster' : 'Show source')}: ${scene.title}`}>
            <span className="gallery-card-inner">
              <span className="gallery-card-face gallery-card-front">
                {image ? <Image src={image} alt="" fill loading={[1, 35, 69].includes(scene.id) ? 'eager' : 'lazy'} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" /> : <span className="gallery-awaiting"><span>{String(scene.id).padStart(3, '0')}</span><small>{tr ? 'Eser üretim bekliyor' : 'Artwork awaiting generation'}</small></span>}
              </span>
              <span className="gallery-card-face gallery-card-back">
                <small>{tr ? 'Kaynak kaydı' : 'Source record'}</small><strong>{scene.source}</strong>
                {scene.verseArabic ? <p className="gallery-source-arabic" lang="ar" dir="rtl">{scene.verseArabic}</p> : null}
                <p>{scene.verseText ?? (tr ? 'Bu sahne, belirtilen sahih hadis kaydının işaret ettiği olaya dayalı yüz göstermeyen sanatsal bir yorumdur.' : scene.brief)}</p>
                <span>{tr ? 'Geri çevir' : 'Turn back'} ↺</span>
              </span>
            </span>
          </button>
        </article>;
      })}
    </div>
    {visibleCount < filtered.length ? <button className="load-more gallery-load-more" type="button" onClick={() => setVisibleCount((count) => count + pageSize)}>
      {tr ? `Sonraki eserleri göster (${filtered.length - visible.length} kaldı)` : `Show more artworks (${filtered.length - visible.length} remaining)`}
    </button> : null}
  </>;
}
