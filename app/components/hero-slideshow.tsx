'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/locale';
import { SearchExplorer } from './search-explorer';

const HERO_SCENES = [
  { src: '/stories/musa/sinai.webp', reference: 'Ta-Ha 20:14', alt: 'A moonlit mountain landscape' },
  { src: '/stories/yusuf/dream.webp', reference: 'Yusuf 12:4', alt: 'A quiet night sky above an ancient landscape' },
  { src: '/stories/maryam/announcement.webp', reference: 'Maryam 19:16–21', alt: 'A peaceful secluded chamber filled with light' },
  { src: '/stories/nuh/ark.webp', reference: 'Hud 11:37', alt: 'A wooden ark being built beneath a wide sky' },
  { src: '/stories/ibrahim/house.webp', reference: 'Al-Baqarah 2:127', alt: 'Ancient stone foundations in a desert valley' },
] as const;

export function HeroSlideshow({ locale }: { locale: Locale }) {
  const tr = locale === 'tr';
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_SCENES.length);
    }, 8000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="reader-hero" aria-labelledby="home-title">
      <div className="reader-hero-scenes" aria-hidden="true">
        {HERO_SCENES.map((scene, index) => (
          <Image
            key={scene.src}
            className={index === activeIndex ? 'is-active' : undefined}
            src={scene.src}
            alt=""
            fill
            priority={index === 0}
            loading={index === 0 ? 'eager' : 'lazy'}
            sizes="(max-width: 760px) 100vw, 1080px"
          />
        ))}
      </div>
      <div className="reader-hero-shade" aria-hidden="true" />
      <div className="reader-hero-content">
        <h1 id="home-title">{tr ? <>Kaynağı oku.<br />Bağlantıyı izle.</> : <>Read the source.<br />Follow the connection.</>}</h1>
        <div id="search" className="reader-search-control"><SearchExplorer locale={locale} /></div>
      </div>
      <p className="reader-hero-reference" aria-live="polite">{HERO_SCENES[activeIndex].reference}</p>
    </section>
  );
}
