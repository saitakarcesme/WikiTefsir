import Link from 'next/link';
import { KnowledgeGraphExplorer } from './components/knowledge-graph-explorer';
import { SearchExplorer } from './components/search-explorer';
import { SiteHeader } from './components/site-header';
import { SourceDrawer } from './components/source-drawer';
import { getTranslation, getTranslationMetadata, getSurahByNumber, getVerse } from '@/lib/quran';
import { getQuranPdfSource } from '@/lib/sources';
import { getLocale } from '@/lib/server-locale';

export default async function Home() {
  const locale = await getLocale(); const tr = locale === 'tr';
  const paths = tr ? [
    { label: 'Kur’an’ı oku', detail: '114 sure, Türkçe meal ve üç klasik tefsir', href: '/surahs' },
    { label: 'Bir Kur’an kıssasını izle', detail: 'Musa’nın kaynak bağlantılı sekiz anlatı aşaması', href: '/person/musa' },
    { label: 'Sahih hadisleri incele', detail: 'Türkçe tercümesi doğrulanmış sahih hadis külliyatı', href: '/hadith' },
    { label: 'Kavramları keşfet', detail: 'Ayetlere, hadislere ve kişilere otomatik bağlanan kavramlar', href: '/concepts' },
  ] : [
    { label: 'Read the Quran', detail: '114 surahs with translation and three classical tafsirs', href: '/surahs' },
    { label: 'Follow a Quranic story', detail: 'Moses across eight source-linked narrative stages', href: '/person/musa' },
    { label: 'Browse authentic hadith', detail: '2,120 English records explicitly graded authentic', href: '/hadith' },
    { label: 'Explore ideas', detail: 'Concept articles generated across verses and authentic hadith', href: '/concepts' },
  ];
  const verse = getVerse(20, 14); const meaning = getTranslation(20, 14, locale); const surah = getSurahByNumber(20);
  if (!verse || !meaning || !surah) throw new Error('Featured source is missing');
  const source = getQuranPdfSource(surah.startOffset + 13);
  const translationMetadata = getTranslationMetadata(locale);

  return <main><SiteHeader />
    <div className="reader-home">
      <section className="reader-hero" aria-labelledby="home-title">
        <span className="reader-overline">{tr ? 'Kur’an · Sahih hadis · Klasik Ehl-i Sünnet tefsiri' : 'Quran · Authentic hadith · Classical Sunni tafsir'}</span>
        <h1 id="home-title">{tr ? <>Kaynağı oku.<br />Bağlantıyı izle.</> : <>Read the source.<br />Follow the connection.</>}</h1>
        <p>{tr ? 'WikiTefsir; ayetleri, hadisleri, tefsirleri, kavramları ve kişileri kaynağı görünür tutan sade bir okuma alanında birleştirir.' : 'WikiTefsir brings verses, hadiths, tafsirs, concepts, and people into one calm reading space—without hiding where a statement came from.'}</p>
        <div id="search"><SearchExplorer locale={locale} /></div>
        <div className="reader-hero-examples">{tr ? 'Deneyin' : 'Try'} <Link href="/person/musa">{tr ? 'Musa' : 'Moses'}</Link><Link href="/surah/al-baqara#verse-255">2:255</Link><Link href="/concept/revelation">{tr ? 'vahiy' : 'revelation'}</Link><Link href="/hadith/1751">h:1751</Link></div>
      </section>

      <section className="reader-start" aria-labelledby="start-title"><div className="reader-section-heading"><span>{tr ? 'Bir yerden başlayın' : 'Start somewhere'}</span><h2 id="start-title">{tr ? 'Bir okuma yolu seçin' : 'Choose a reading path'}</h2></div><div>
        {paths.map((path, index) => <Link href={path.href} key={path.href}><small>0{index + 1}</small><span><strong>{path.label}</strong><em>{path.detail}</em></span><span aria-hidden="true">→</span></Link>)}
      </div></section>

      <article className="featured-reading" aria-labelledby="featured-reading-title">
        <div className="featured-reading-copy"><span className="reader-overline">{tr ? 'İki dakikalık kaynak yolu' : 'A two-minute source trail'}</span><h2 id="featured-reading-title">{tr ? '“Şüphesiz ben Allah’ım.”' : '“Indeed, I am Allah.”'}</h2><p>{tr ? 'Kur’an’daki Musa anlatısı farklı surelere yayılır. WikiTefsir bu ayetleri kronolojik bir okuma yoluna dönüştürür ve her cümleyi asıl ayetine bağlı tutar.' : 'The Quran’s account of Moses is spread across multiple surahs. WikiTefsir turns those passages into a chronological reading path while keeping every statement attached to its verse.'}</p><div><Link href="/person/musa">{tr ? 'Musa kıssasını oku →' : 'Read the story of Moses →'}</Link><SourceDrawer title="Ta-Ha 20:14" description={tr ? `Rowwad Türkçe meal ${translationMetadata.version} kaynak kaydı.` : `Rowwad English translation ${translationMetadata.version}, aligned to the exact page in QuranEnc's official mushaf PDF.`} pdfUrl={source?.pdfUrl} page={source?.page} sourceUrl="https://quranenc.com" sourceLabel="QuranEnc" /></div></div>
        <blockquote><p lang="ar" dir="rtl">{verse.text}</p><p>“{meaning.text}”</p><footer><Link href="/surah/ta-ha#verse-14">Ta-Ha 20:14</Link><span>QuranEnc Rowwad {translationMetadata.version}</span></footer></blockquote>
      </article>

      <KnowledgeGraphExplorer compact locale={locale} />

    </div>
    <footer className="reader-footer"><span>WikiTefsir</span><p>{tr ? 'Bağımsız ve kaynak öncelikli bir bilgi projesi.' : 'An independent source-first knowledge project.'}</p><nav><Link href="/surahs">{tr ? 'Kur’an' : 'Quran'}</Link><Link href="/hadith">{tr ? 'Hadis' : 'Hadith'}</Link><Link href="/people">{tr ? 'Kişiler' : 'People'}</Link><Link href="/graph">{tr ? 'Grafik' : 'Graph'}</Link></nav></footer>
  </main>;
}
