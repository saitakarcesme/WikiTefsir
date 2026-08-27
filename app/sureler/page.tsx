import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/site-header';
import { SurahDirectory } from '../components/surah-directory';
import { getAllSurahs, getQuranStats, getSurahHref, quranLicense } from '@/lib/quran';

export const metadata: Metadata = {
  title: 'Kur’an Sureleri',
  description: 'Kur’an-ı Kerîm’in 114 suresini doğrulanmış Arapça metin ve sure bilgileriyle keşfedin.',
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
            <p>Doğrulanmış Uthmani Arapça metni, sure sırası ve yapısal bilgilerle Kur’an’ın tamamında gezinin.</p>
          </div>
          <dl>
            <div><dt>Sure</dt><dd>{stats.surahCount}</dd></div>
            <div><dt>Ayet</dt><dd>{stats.verseCount.toLocaleString('tr-TR')}</dd></div>
            <div><dt>Metin</dt><dd>Uthmani</dd></div>
          </dl>
        </header>

        <SurahDirectory items={directoryItems} />

        <footer className="corpus-attribution">
          <span className="trust-mark" aria-hidden="true">✓</span>
          <div>
            <strong>Metin kaynağı: Tanzil Project</strong>
            <p>Kur’an metni değiştirilmeden kullanılır. {quranLicense.name} lisansı ve kaynak bağlantısı her sure sayfasında korunur.</p>
          </div>
          <a href="https://tanzil.net" rel="noreferrer" target="_blank">Kaynağı aç ↗</a>
        </footer>
      </div>
    </main>
  );
}
