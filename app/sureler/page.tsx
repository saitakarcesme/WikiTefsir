import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/site-header';
import { SurahDirectory } from '../components/surah-directory';
import {
  getAllSurahs,
  getQuranStats,
  getSurahHref,
  quranLicense,
  englishTranslationMetadata,
  englishTranslationTerms,
} from '@/lib/quran';
import { getLocale } from '@/lib/server-locale';
import { localeNumber } from '@/lib/locale';

export const metadata: Metadata = {
  title: 'Quran Surahs',
  description: 'Explore all 114 surahs of the Quran with verified Arabic text, a sourced English translation and surah metadata.',
  openGraph: { images: [] },
  twitter: { images: [] },
};

export default async function SurahsPage() {
  const locale = await getLocale();
  const surahs = getAllSurahs();
  const stats = getQuranStats();
  const directoryItems = surahs.map((surah) => ({ ...surah, href: getSurahHref(surah) }));

  return (
    <main>
      <SiteHeader />
      <div className="surahs-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">{locale === 'tr' ? 'Ana sayfa' : 'Main page'}</Link><span>›</span>{locale === 'tr' ? 'Sureler' : 'Surahs'}</nav>

        <header className="surahs-hero">
          <div>
            <span className="section-kicker">{locale === 'tr' ? 'Kur’an-ı Kerim' : 'The Noble Quran'}</span>
            <h1>{locale === 'tr' ? 'Sureler' : 'Surahs'}</h1>
            <p>{locale === 'tr' ? 'Kur’an’ın tamamını doğrulanmış Osmanî Arapça metin ve kaynaklı Türkçe meal ile okuyun.' : 'Browse the complete Quran with verified Uthmani Arabic text and a sourced English translation.'}</p>
          </div>
          <dl>
            <div><dt>{locale === 'tr' ? 'Sure' : 'Surahs'}</dt><dd>{stats.surahCount}</dd></div>
            <div><dt>{locale === 'tr' ? 'Ayet' : 'Verses'}</dt><dd>{stats.verseCount.toLocaleString(localeNumber(locale))}</dd></div>
            <div><dt>{locale === 'tr' ? 'Türkçe meal' : 'English translation'}</dt><dd>{stats.englishTranslationCount.toLocaleString(localeNumber(locale))}</dd></div>
          </dl>
        </header>

        <SurahDirectory items={directoryItems} locale={locale} />

        <footer className="corpus-attribution">
          <span className="trust-mark" aria-hidden="true">✓</span>
          <div>
            <strong>{locale === 'tr' ? 'Kaynaklar: Tanzil Project ve QuranEnc' : 'Sources: Tanzil Project and QuranEnc'}</strong>
            <p>{locale === 'tr' ? `Kur’an metni ${quranLicense.name}; Türkçe meal Rowwad Translation Center kaynağındandır. Metinler kaynak şartlarına göre aynen yayımlanır.` : `The Quran text is ${quranLicense.name}; the English translation is Rowwad Translation Center ${englishTranslationMetadata.version}. Both are published verbatim under their source terms.`}</p>
          </div>
          <a href={englishTranslationTerms.url} rel="noreferrer" target="_blank">{locale === 'tr' ? 'Kaynak şartları ↗' : 'Source terms ↗'}</a>
        </footer>
      </div>
    </main>
  );
}
