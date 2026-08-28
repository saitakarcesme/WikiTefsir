import Link from 'next/link';
import { KnowledgeGraphExplorer } from './components/knowledge-graph-explorer';
import { SearchExplorer } from './components/search-explorer';
import { SiteHeader } from './components/site-header';
import { SourceDrawer } from './components/source-drawer';
import { englishTranslationMetadata, getEnglishTranslation, getSurahByNumber, getVerse } from '@/lib/quran';
import { getQuranPdfSource } from '@/lib/sources';

const paths = [
  { label: 'Read the Quran', detail: '114 surahs with translation and three classical tafsirs', href: '/surahs' },
  { label: 'Follow a Quranic story', detail: 'Moses across eight source-linked narrative stages', href: '/person/musa' },
  { label: 'Browse authentic hadith', detail: '2,120 English records explicitly graded authentic', href: '/hadith' },
  { label: 'Explore ideas', detail: 'Concept articles connected to verses, people, and scholars', href: '/concepts' },
];

export default function Home() {
  const verse = getVerse(20, 14); const meaning = getEnglishTranslation(20, 14); const surah = getSurahByNumber(20);
  if (!verse || !meaning || !surah) throw new Error('Featured source is missing');
  const source = getQuranPdfSource(surah.startOffset + 13);

  return <main><SiteHeader />
    <div className="reader-home">
      <section className="reader-hero" aria-labelledby="home-title">
        <span className="reader-overline">Quran · Authentic hadith · Classical Sunni tafsir</span>
        <h1 id="home-title">Read the source.<br />Follow the connection.</h1>
        <p>WikiTefsir brings verses, hadiths, tafsirs, concepts, and people into one calm reading space—without hiding where a statement came from.</p>
        <div id="search"><SearchExplorer /></div>
        <div className="reader-hero-examples">Try <Link href="/person/musa">Moses</Link><Link href="/surah/al-baqara#verse-255">2:255</Link><Link href="/concept/revelation">revelation</Link><Link href="/hadith/1751">h:1751</Link></div>
      </section>

      <section className="reader-start" aria-labelledby="start-title"><div className="reader-section-heading"><span>Start somewhere</span><h2 id="start-title">Choose a reading path</h2></div><div>
        {paths.map((path, index) => <Link href={path.href} key={path.href}><small>0{index + 1}</small><span><strong>{path.label}</strong><em>{path.detail}</em></span><span aria-hidden="true">→</span></Link>)}
      </div></section>

      <article className="featured-reading" aria-labelledby="featured-reading-title">
        <div className="featured-reading-copy"><span className="reader-overline">A two-minute source trail</span><h2 id="featured-reading-title">“Indeed, I am Allah.”</h2><p>The Quran’s account of Moses is spread across multiple surahs. WikiTefsir turns those passages into a chronological reading path while keeping every statement attached to its verse.</p><div><Link href="/person/musa">Read the story of Moses →</Link><SourceDrawer title="Ta-Ha 20:14" description={`Rowwad English translation ${englishTranslationMetadata.version}, aligned to the exact page in QuranEnc's official mushaf PDF.`} pdfUrl={source?.pdfUrl} page={source?.page} sourceUrl="https://quranenc.com/en/browse/english_rwwad" sourceLabel="QuranEnc" /></div></div>
        <blockquote><p lang="ar" dir="rtl">{verse.text}</p><p>“{meaning.text}”</p><footer><Link href="/surah/ta-ha#verse-14">Ta-Ha 20:14</Link><span>QuranEnc Rowwad {englishTranslationMetadata.version}</span></footer></blockquote>
      </article>

      <KnowledgeGraphExplorer compact />

    </div>
    <footer className="reader-footer"><span>WikiTefsir</span><p>An independent source-first knowledge project.</p><nav><Link href="/surahs">Quran</Link><Link href="/hadith">Hadith</Link><Link href="/people">People</Link><Link href="/graph">Graph</Link></nav></footer>
  </main>;
}
