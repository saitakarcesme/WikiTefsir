'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Locale } from '@/lib/locale';

export function StoryArtwork({ image, title, source, arabic, translation, locale }: {
  image: string;
  title: string;
  source: string;
  arabic: string;
  translation: string;
  locale: Locale;
}) {
  const [flipped, setFlipped] = useState(false);
  const tr = locale === 'tr';
  return <figure className={`story-artwork${flipped ? ' flipped' : ''}`}>
    <button type="button" onClick={() => setFlipped((value) => !value)} aria-pressed={flipped} aria-label={flipped ? (tr ? 'Görseli göster' : 'Show artwork') : (tr ? 'Ayeti göster' : 'Show verse')}>
      <span className="story-artwork-inner">
        <span className="story-artwork-face story-artwork-front"><Image src={image} alt="" fill unoptimized sizes="(max-width: 760px) 100vw, 850px" /></span>
        <span className="story-artwork-face story-artwork-back"><small>{source}</small><strong>{title}</strong><blockquote lang="ar" dir="rtl">{arabic}</blockquote><p>{translation}</p><span>{tr ? 'Görsele dön' : 'Turn back'} ↺</span></span>
      </span>
    </button>
  </figure>;
}
