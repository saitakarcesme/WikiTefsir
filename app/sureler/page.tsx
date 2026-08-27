import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/site-header';
import { SurahDirectory } from '../components/surah-directory';
import {
  getAllSurahs,
  getQuranStats,
  getSurahHref,
  quranLicense,
  turkishMealMetadata,
  turkishMealTerms,
} from '@/lib/quran';

export const metadata: Metadata = {
  title: 'Kur’an Sureleri',
  description: 'Kur’an-ı Kerîm’in 114 suresini doğrulanmış Arapça metin, kaynaklı Türkçe meal ve sure bilgileriyle keşfedin.',
  openGraph: { images: [] },
  twitter: { images: [] },
};

export default function SurahsPage() {
  const surahs = getAllSurahs();
  const stats = getQuranStats();
  const directoryItems = surahs.map((surah) => ({ ...surah, href: getSurahHref(surah) }));

  return (
    <main>
      <SiteHeader />
      <div className="surahs-page">
        <nav className="breadcrumbs" aria-label="İçerik yolu"><Link href="/">Ana sayfa</Link><span>›</span>Sureler</nav>

        <header className="surahs-hero">
          <div>
            <span className="section-kicker">Kur’an-ı Kerîm</span>
            <h1>Sureler</h1>
            <p>Doğrulanmış Uthmani Arapça metin ve kaynaklı Türkçe meal ile Kur’an’ın tamamında gezinin.</p>
          </div>
          <dl>
            <div><dt>Sure</dt><dd>{stats.surahCount}</dd></div>
            <div><dt>Ayet</dt><dd>{stats.verseCount.toLocaleString('tr-TR')}</dd></div>
            <div><dt>Türkçe meal</dt><dd>{stats.turkishMealCount.toLocaleString('tr-TR')}</dd></div>
          </dl>
        </header>

        <SurahDirectory items={directoryItems} />

        <footer className="corpus-attribution">
          <span className="trust-mark" aria-hidden="true">✓</span>
          <div>
            <strong>Kaynaklar: Tanzil Project ve QuranEnc</strong>
            <p>Kur’an metni {quranLicense.name}; Türkçe meal Rowwad Tercüme Merkezi {turkishMealMetadata.version}. Her iki içerik de kaynak şartlarına göre değiştirilmeden yayımlanır.</p>
          </div>
          <a href={turkishMealTerms.url} rel="noreferrer" target="_blank">Kaynak şartları ↗</a>
        </footer>
      </div>
    </main>
  );
}
