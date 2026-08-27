import Link from 'next/link';
import { KnowledgeGraph } from './components/knowledge-graph';
import { SearchExplorer } from './components/search-explorer';
import { SiteHeader } from './components/site-header';
import { getEnglishTranslation, getVerse, englishTranslationMetadata } from '@/lib/quran';

const collections = [
  { name: 'The Noble Quran', detail: '114 surahs, 6,236 verses and a sourced English translation', href: '/surahs' },
  { name: 'Authentic hadiths', detail: '2,120 verified Arabic–English records', href: '/hadith' },
  { name: 'Al-Tabari', detail: 'Jami al-Bayan · 6,236 verse records', href: '/scholars/taberi' },
  { name: 'Ibn Kathir', detail: 'Tafsir al-Quran al-Azim · 6,236 verse records', href: '/scholars/ibn-kesir' },
  { name: 'Al-Qurtubi', detail: 'Al-Jami li-Ahkam al-Quran · 6,234 commentaries', href: '/scholars/kurtubi' },
];

export default function Home() {
  const featuredVerse = getVerse(1, 5);
  const featuredMeaning = getEnglishTranslation(1, 5);
  if (!featuredVerse || !featuredMeaning) throw new Error('Featured Quran record is missing');

  return (
    <main>
      <SiteHeader />
      <div className="wiki-home-layout">
        <aside className="portal-sidebar" aria-label="WikiTefsir sections">
          <strong>Contents</strong>
          <Link className="active" href="/">Main page</Link>
          <Link href="/surahs">Quran surahs</Link>
          <Link href="/hadith">Authentic hadiths</Link>
          <Link href="/concepts">Concepts</Link>
          <Link href="/scholars">Scholars</Link>
          <a href="#knowledge-network">Knowledge network</a>
          <a href="#methodology">Source policy</a>
          <span>Scope</span>
          <a href="#coverage">Current data</a>
          <a href="#methodology">Verification method</a>
        </aside>

        <div className="wiki-home-main">
          <nav className="page-tabs" aria-label="Page tools">
            <span className="active">Main page</span>
            <a href="#coverage">Contents</a>
            <a href="#methodology">Sources</a>
          </nav>

          <header className="wiki-welcome" id="explore">
            <div>
              <h1>Welcome to WikiTefsir</h1>
              <p>An open knowledge encyclopedia connecting the Quran, authentic hadiths and classical Sunni tafsir works to their sources.</p>
            </div>
            <dl aria-label="WikiTefsir coverage">
              <div><dt>Surahs</dt><dd>114</dd></div>
              <div><dt>Verses</dt><dd>6,236</dd></div>
              <div><dt>Authentic hadiths</dt><dd>2,120</dd></div>
              <div><dt>Tafsir records</dt><dd>18,708</dd></div>
            </dl>
          </header>

          <section className="wiki-search-section" id="search" aria-labelledby="search-title">
            <h2 id="search-title">Search the encyclopedia</h2>
            <SearchExplorer />
            <p>Examples: <Link href="/surah/fatiha">Al-Fatihah</Link>, <Link href="/surah/al-baqara#verse-255">2:255</Link>, <Link href="/hadith/1751">h:1751</Link></p>
          </section>

          <div className="wiki-home-columns" id="coverage">
            <section className="portal-panel portal-featured" aria-labelledby="featured-title">
              <h2 id="featured-title">Featured article</h2>
              <div className="portal-panel-body">
                <p className="portal-arabic" lang="ar" dir="rtl" translate="no">{featuredVerse.text}</p>
                <p className="portal-translation">“{featuredMeaning.text}”</p>
                <p>
                  <Link href="/surah/fatiha"><strong>Surah Al-Fatihah</strong></Link> is the first surah of the Quran.
                  This article brings together <Link href="/surah/fatiha#verse-5">verse 1:5</Link>, the Rowwad English translation and
                  the sourced Arabic tafsirs of Ibn Kathir, al-Tabari and al-Qurtubi.
                </p>
                <p className="portal-source">Translation: QuranEnc Rowwad {englishTranslationMetadata.version}</p>
                <Link className="wiki-more-link" href="/surah/fatiha#verse-5">Read the full article →</Link>
              </div>
            </section>

            <section className="portal-panel portal-corpus" aria-labelledby="corpus-title">
              <h2 id="corpus-title">Corpora and works</h2>
              <div className="portal-list">
                {collections.map((collection) => (
                  <Link href={collection.href} key={collection.name}>
                    <strong>{collection.name}</strong>
                    <span>{collection.detail}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="portal-panel portal-about" id="methodology" aria-labelledby="method-title">
              <h2 id="method-title">About WikiTefsir</h2>
              <div className="portal-panel-body">
                <p>WikiTefsir separates religious source text from editorial explanation. Every record shows its source, version and, where available, its location within the work.</p>
                <ul>
                  <li>Quran text: Tanzil Uthmani 1.1</li>
                  <li>English translation: QuranEnc Rowwad {englishTranslationMetadata.version}</li>
                  <li>Hadith corpus: HadeethEnc 1.25.0</li>
                  <li>Classical tafsirs: Quran Lab 1.40.0</li>
                </ul>
                <p>The complete Six Books corpus is still undergoing edition and source verification; current coverage is never presented as broader than it is.</p>
              </div>
            </section>

            <section className="portal-panel portal-navigation" aria-labelledby="navigation-title">
              <h2 id="navigation-title">Explore the encyclopedia</h2>
              <div className="portal-panel-body">
                <ul>
                  <li><Link href="/surahs">Index of 114 surahs</Link></li>
                  <li><Link href="/hadith">Authentic hadith index</Link></li>
                  <li><Link href="/concepts">Concept article index</Link></li>
                  <li><Link href="/scholars">Scholar directory</Link></li>
                  <li><Link href="/scholars/ibn-kesir">Ibn Kathir article</Link></li>
                  <li><Link href="/scholars/kurtubi">Al-Qurtubi article</Link></li>
                </ul>
              </div>
            </section>
          </div>

          <div id="knowledge-network"><KnowledgeGraph /></div>

          <footer className="wiki-footer">
            <p>WikiTefsir is an independent knowledge project that prioritizes source integrity. Texts are published under their respective source and reuse terms.</p>
            <nav><a href="#methodology">Source policy</a><a href="#coverage">Coverage</a><Link href="/surahs">Surahs</Link><Link href="/hadith">Hadiths</Link></nav>
          </footer>
        </div>
      </div>
    </main>
  );
}
