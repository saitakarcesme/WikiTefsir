import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/site-header';
import { getAllConcepts, getConceptHref } from '@/lib/concepts';

export const metadata: Metadata = {
  title: 'Concepts',
  description: 'An index of Islamic concepts linked to Quran verses and verified source records in WikiTefsir.',
  openGraph: { images: [] },
  twitter: { images: [] },
};

export default function ConceptsPage() {
  const concepts = getAllConcepts();

  return (
    <main>
      <SiteHeader />
      <div className="encyclopedia-index-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Main page</Link><span>›</span>Concepts</nav>
        <header className="index-article-header">
          <h1>Concepts</h1>
          <p>Concept articles linked to Quran verses and verified source records in WikiTefsir.</p>
        </header>
        <nav className="page-tabs compact" aria-label="Concept index tools"><span className="active">Article index</span><Link href="/surahs">Surahs</Link><Link href="/hadith">Hadiths</Link></nav>
        <section className="concept-index" aria-labelledby="concept-index-title">
          <h2 id="concept-index-title">Concept articles</h2>
          <div>
            {concepts.map((concept) => (
              <article key={concept.slug}>
                <h3><Link href={getConceptHref(concept)}>{concept.title}</Link></h3>
                <p className="concept-arabic" lang="ar" dir="rtl">{concept.arabic}</p>
                <p>{concept.scope}</p>
                <small>{concept.verseRefs.length} selected verse records</small>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
