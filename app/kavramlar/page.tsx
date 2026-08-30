import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/site-header';
import { getAllConcepts, getAllKeywordConcepts, getConceptHref, getConceptIndexStats, getConceptScope, getConceptTitle } from '@/lib/concepts';
import { getLocale } from '@/lib/server-locale';
import { localeNumber } from '@/lib/locale';

export const metadata: Metadata = {
  title: 'Concepts',
  description: 'An index of Islamic concepts linked to Quran verses and verified source records in IslamWiki.',
  openGraph: { images: [] },
  twitter: { images: [] },
};

export default async function ConceptsPage() {
  const locale = await getLocale();
  const concepts = getAllConcepts();
  const stats = getConceptIndexStats();
  const keywords = getAllKeywordConcepts(locale).slice(0, 120);
  const tr = locale === 'tr';

  return (
    <main>
      <SiteHeader />
      <div className="encyclopedia-index-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">{tr ? 'Ana sayfa' : 'Main page'}</Link><span>›</span>{tr ? 'Kavramlar' : 'Concepts'}</nav>
        <header className="index-article-header">
          <h1>{tr ? 'Kavramlar' : 'Concepts'}</h1>
          <p>{tr ? 'Kavram bağlantıları elle seçilmiş birkaç ayetten değil; İngilizce ve Türkçe Kur’an mealleriyle sahih hadis külliyatının sürümlenmiş JSON indeksinden üretilir.' : 'Concept links are generated from a versioned JSON index of the English and Turkish Quran translations and the authentic hadith corpus—not from a few manually selected verses.'}</p>
          <div className="index-summary"><span><strong>{concepts.length}</strong> {tr ? 'anlam kümesi' : 'semantic concepts'}</span><span><strong>{stats.keywordCount.toLocaleString(localeNumber(locale))}</strong> {tr ? 'külliyat etiketi' : 'corpus tags'}</span><span><strong>{stats.quranEnglishRecords.toLocaleString(localeNumber(locale))}</strong> {tr ? 'taranan ayet' : 'indexed verses'}</span></div>
        </header>
        <nav className="page-tabs compact" aria-label="Concept index tools"><span className="active">{tr ? 'Kavram dizini' : 'Article index'}</span><Link href="/surahs">{tr ? 'Sureler' : 'Surahs'}</Link><Link href="/hadith">{tr ? 'Hadisler' : 'Hadiths'}</Link></nav>
        <section className="concept-index" aria-labelledby="concept-index-title">
          <h2 id="concept-index-title">{tr ? 'Anlam kavramları' : 'Semantic concepts'}</h2>
          <div>
            {concepts.map((concept) => (
              <article key={concept.slug}>
                <h3><Link href={getConceptHref(concept)}>{getConceptTitle(concept, locale)}</Link></h3>
                <p className="concept-arabic" lang="ar" dir="rtl">{concept.arabic}</p>
                <p>{getConceptScope(concept, locale)}</p>
                <small>{concept.verseRefs.length.toLocaleString(localeNumber(locale))} {tr ? 'ayet · ' : 'verses · '}{concept.hadithIds.length.toLocaleString(localeNumber(locale))} {tr ? 'sahih hadis' : 'authentic hadiths'}</small>
              </article>
            ))}
          </div>
        </section>
        <section className="corpus-keyword-index" aria-labelledby="keyword-index-title">
          <div className="section-title"><div><span className="section-kicker">{tr ? 'Otomatik JSON etiketleri' : 'Generated JSON tags'}</span><h2 id="keyword-index-title">{tr ? 'Külliyat söz varlığı' : 'Corpus vocabulary'}</h2></div><span className="review-status">{stats.keywordCount.toLocaleString(localeNumber(locale))} {tr ? 'etiket' : 'tags'}</span></div>
          <p>{tr ? 'Aşağıda en sık geçen etiketlerin bir bölümü yer alır. Diğer etiketlere ana aramadan ulaşabilirsiniz.' : 'A sample of the most connected tags appears below. Every other indexed term is addressable through the main search.'}</p>
          <div className="keyword-cloud">{keywords.map((keyword) => <Link href={getConceptHref(keyword)} key={keyword.slug}><strong>{keyword.title}</strong><small>{keyword.verseRefs.length + keyword.hadithIds.length}</small></Link>)}</div>
        </section>
      </div>
    </main>
  );
}
