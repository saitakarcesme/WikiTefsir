import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/site-header';
import { GalleryGrid } from '@/app/components/gallery-grid';
import { galleryScenes } from '@/lib/gallery-scenes';
import { getLocale } from '@/lib/server-locale';
import { getTranslation, getVerse } from '@/lib/quran';

export const metadata: Metadata = { title: 'Gallery', description: 'A source-indexed visual archive of Quran and authentic hadith scenes.', openGraph: { images: [] }, twitter: { images: [] } };

export default async function GalleryPage() {
  const locale = await getLocale(); const tr = locale === 'tr';
  const scenes = galleryScenes.map((scene) => {
    const reference = scene.source.match(/^Quran (\d{1,3}):(\d{1,3})(?:[–-](\d{1,3}))?/u);
    if (!reference) return scene;
    const surah = Number(reference[1]);
    const start = Number(reference[2]);
    const end = Math.min(Number(reference[3] ?? reference[2]), start + 5);
    const arabic: string[] = [];
    const translation: string[] = [];
    for (let ayah = start; ayah <= end; ayah += 1) {
      const verse = getVerse(surah, ayah);
      const meaning = getTranslation(surah, ayah, locale);
      if (verse) arabic.push(verse.text);
      if (meaning) translation.push(meaning.text);
    }
    return { ...scene, verseArabic: arabic.join(' '), verseText: translation.join(' ') };
  });
  return <main><SiteHeader /><div className="reader-index-page gallery-page">
    <nav className="breadcrumbs"><Link href="/">{tr ? 'Ana sayfa' : 'Home'}</Link><span>›</span>{tr ? 'Galeri' : 'Gallery'}</nav>
    <header className="reader-page-header gallery-header"><span className="reader-overline">{tr ? 'Görsel arşiv' : 'Visual archive'}</span><h1>{tr ? 'Galeri' : 'Gallery'}</h1><p>{tr ? 'Kur’an ve sahih hadislerden yüz sahne. Bir eseri çevirerek arkasındaki kaynak kaydını okuyun.' : 'One hundred scenes drawn from the Quran and authentic hadith. Select a work to turn it over and read the exact source record behind it.'}</p></header>
    <GalleryGrid scenes={scenes} locale={locale} />
  </div></main>;
}
