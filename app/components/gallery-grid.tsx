'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { GalleryScene } from '@/lib/gallery-scenes';
import type { Locale } from '@/lib/locale';

export function GalleryGrid({ scenes, locale }: { scenes: GalleryScene[]; locale: Locale }) {
  const tr = locale === 'tr';
  const [filter, setFilter] = useState<'All' | GalleryScene['kind']>('All');
  const [flipped, setFlipped] = useState<number | null>(null);
  const visible = filter === 'All' ? scenes : scenes.filter((scene) => scene.kind === filter);

  return <>
    <div className="gallery-controls" aria-label={tr ? 'Eserleri filtrele' : 'Filter artworks'}>
      {(['All', 'Quran', 'Hadith'] as const).map((value) => <button className={filter === value ? 'active' : ''} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} key={value}>{tr ? ({ All: 'Tümü', Quran: 'Kur’an', Hadith: 'Hadis' } as const)[value] : value}</button>)}
      <span>{visible.length} {tr ? 'kaynak temelli sahne' : 'source-based scenes'}</span>
    </div>
    <div className="gallery-grid">
      {visible.map((scene) => {
        const isFlipped = flipped === scene.id;
        return <article className={`gallery-work gallery-work-${(scene.id % 5) + 1}${isFlipped ? ' flipped' : ''}`} key={scene.id}>
          <button type="button" className="gallery-flip" onClick={() => setFlipped(isFlipped ? null : scene.id)} aria-pressed={isFlipped} aria-label={`${isFlipped ? (tr ? 'Eseri göster' : 'Show artwork') : (tr ? 'Kaynağı göster' : 'Show source')}: ${scene.title}`}>
            <span className="gallery-card-inner">
              <span className="gallery-card-face gallery-card-front">
                {scene.image ? <Image src={scene.image} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" /> : <span className="gallery-awaiting"><span>{String(scene.id).padStart(3, '0')}</span><small>{tr ? 'Eser üretim bekliyor' : 'Artwork awaiting generation'}</small></span>}
                <span className="gallery-caption"><small>{tr ? (scene.kind === 'Quran' ? 'Kur’an sahnesi' : 'Hadis sahnesi') : `${scene.kind} scene`} {scene.id}</small><strong>{tr ? `Kaynak temelli sahne ${scene.id}` : scene.title}</strong></span>
              </span>
              <span className="gallery-card-face gallery-card-back">
                <small>{tr ? 'Kaynak kaydı' : 'Source record'}</small><strong>{scene.source}</strong><p>{tr ? 'Bu sahne, belirtilen kaynak kaydına dayalı yüz göstermeyen sanatsal bir yorumdur.' : scene.brief}</p><span>{tr ? 'Geri çevir' : 'Turn back'} ↺</span>
              </span>
            </span>
          </button>
        </article>;
      })}
    </div>
  </>;
}
