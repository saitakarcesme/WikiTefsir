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

export const metadata: Metadata = {
  title: 'Quran Surahs',
  description: 'Explore all 114 surahs of the Quran with verified Arabic text, a sourced English translation and surah metadata.',
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
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Main page</Link><span>›</span>Surahs</nav>

        <header className="surahs-hero">
          <div>
            <span className="section-kicker">The Noble Quran</span>
            <h1>Surahs</h1>
            <p>Browse the complete Quran with verified Uthmani Arabic text and a sourced English translation.</p>
          </div>
          <dl>
            <div><dt>Surahs</dt><dd>{stats.surahCount}</dd></div>
            <div><dt>Verses</dt><dd>{stats.verseCount.toLocaleString('en-US')}</dd></div>
            <div><dt>English translation</dt><dd>{stats.englishTranslationCount.toLocaleString('en-US')}</dd></div>
          </dl>
        </header>

        <SurahDirectory items={directoryItems} />

        <footer className="corpus-attribution">
          <span className="trust-mark" aria-hidden="true">✓</span>
          <div>
            <strong>Sources: Tanzil Project and QuranEnc</strong>
            <p>The Quran text is {quranLicense.name}; the English translation is Rowwad Translation Center {englishTranslationMetadata.version}. Both are published verbatim under their source terms.</p>
          </div>
          <a href={englishTranslationTerms.url} rel="noreferrer" target="_blank">Source terms ↗</a>
        </footer>
      </div>
    </main>
  );
}
