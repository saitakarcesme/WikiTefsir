import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/site-header';
import { GalleryGrid } from '@/app/components/gallery-grid';
import { galleryScenes } from '@/lib/gallery-scenes';
import { getLocale } from '@/lib/server-locale';

export const metadata: Metadata = { title: 'Gallery', description: 'A source-indexed visual archive of Quran and authentic hadith scenes.', openGraph: { images: [] }, twitter: { images: [] } };

export default async function GalleryPage() {
  const locale = await getLocale(); const tr = locale === 'tr';
  return <main><SiteHeader /><div className="reader-index-page gallery-page">
    <nav className="breadcrumbs"><Link href="/">{tr ? 'Ana sayfa' : 'Home'}</Link><span>›</span>{tr ? 'Galeri' : 'Gallery'}</nav>
    <header className="reader-page-header gallery-header"><span className="reader-overline">{tr ? 'Görsel arşiv' : 'Visual archive'}</span><h1>{tr ? 'Galeri' : 'Gallery'}</h1><p>{tr ? 'Kur’an ve sahih hadislerden yüz sahne. Bir eseri çevirerek arkasındaki kaynak kaydını okuyun.' : 'One hundred scenes drawn from the Quran and authentic hadith. Select a work to turn it over and read the exact source record behind it.'}</p></header>
    <GalleryGrid scenes={galleryScenes} locale={locale} />
  </div></main>;
}
