import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '../../components/site-header';
import { getAllConcepts, getConceptBySlug, getConceptHref } from '@/lib/concepts';
import { getSurahByNumber, getSurahHref, getEnglishTranslation, getVerse } from '@/lib/quran';
import { SourceDrawer } from '@/app/components/source-drawer';
import { getPeopleForVerse, getPersonHref } from '@/lib/people';
import { getQuranPdfSource } from '@/lib/sources';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllConcepts().map((concept) => ({ slug: concept.slug }));
}

type ConceptPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ConceptPageProps): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) return {};
  return {
    title: concept.title,
    description: `${concept.title}: ${concept.scope.toLocaleLowerCase('en-US')}.`,
    openGraph: { images: [] },
    twitter: { images: [] },
  };
}

export default async function ConceptPage({ params }: ConceptPageProps) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) notFound();
  const related = concept.related.flatMap((relatedSlug) => {
    const record = getConceptBySlug(relatedSlug);
    return record ? [record] : [];
  });
  const people = [...new Map(concept.verseRefs.flatMap((reference) => getPeopleForVerse(reference.surah, reference.ayah)).map((person) => [person.slug, person])).values()];

  return (
    <main>
      <SiteHeader />
      <div className="wiki-layout concept-article-layout">
        <aside className="wiki-toc" aria-label="Page contents"><span>Contents</span><a className="active" href="#introduction">Introduction</a><a href="#verses">Related verses</a><a href="#related">Related concepts</a><a href="#source">Source note</a></aside>
        <article className="wiki-article">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Main page</Link><span>›</span><Link href="/concepts">Concepts</Link><span>›</span>{concept.title}</nav>
          <header className="article-header" id="introduction">
            <h1>{concept.title}</h1>
            <p className="article-arabic-title" lang="ar" dir="rtl">{concept.arabic}</p>
            <p className="article-lead">This article provides unified access to verified Quran records concerning {concept.title.toLocaleLowerCase('en-US')} and to related WikiTefsir articles.</p>
          </header>
          <section className="concept-at-a-glance" aria-labelledby="glance-title">
            <span className="reader-overline">At a glance</span>
            <h2 id="glance-title">A source trail for {concept.title.toLocaleLowerCase('en-US')}</h2>
            <p>{concept.scope}. This page groups a small, editorially selected set of Quran records so readers can move from the concept to the original verse, its translation, and the classical tafsir layer.</p>
            <dl><div><dt>Quran records</dt><dd>{concept.verseRefs.length}</dd></div><div><dt>Related concepts</dt><dd>{related.length}</dd></div><div><dt>Connected people</dt><dd>{people.length}</dd></div></dl>
          </section>
          <section className="concept-verse-list" id="verses" aria-labelledby="concept-verses-title">
            <h2 id="concept-verses-title">Related records in the Quran</h2>
            {concept.verseRefs.map((reference) => {
              const surah = getSurahByNumber(reference.surah);
              const verse = getVerse(reference.surah, reference.ayah);
              const meaning = getEnglishTranslation(reference.surah, reference.ayah);
              if (!surah || !verse || !meaning) throw new Error(`Concept reference is missing: ${reference.surah}:${reference.ayah}`);
              const source = getQuranPdfSource(surah.startOffset + reference.ayah - 1);
              return (
                <article key={`${reference.surah}:${reference.ayah}`}>
                  <h3><Link href={`${getSurahHref(surah)}#verse-${reference.ayah}`}>{surah.nameTransliterated} {reference.surah}:{reference.ayah}</Link></h3>
                  <p className="concept-verse-arabic" lang="ar" dir="rtl">{verse.text}</p>
                  <p>{meaning.text}</p>
                  {meaning.footnotes ? <small>{meaning.footnotes}</small> : null}
                  <div className="concept-source-actions"><SourceDrawer label="View exact source" title={`${surah.nameTransliterated} ${reference.surah}:${reference.ayah}`} description="Exact page in the official QuranEnc Rowwad mushaf PDF." pdfUrl={source?.pdfUrl} page={source?.page} sourceUrl="https://quranenc.com/en/browse/english_rwwad" sourceLabel="QuranEnc" /><Link href={`${getSurahHref(surah)}#verse-${reference.ayah}`}>Open full verse article</Link></div>
                </article>
              );
            })}
          </section>
          {people.length > 0 ? <section className="concept-related" aria-labelledby="people-title"><h2 id="people-title">People connected to this concept</h2><p>{people.map((person, index) => <span key={person.slug}>{index > 0 ? ' · ' : ''}<Link href={getPersonHref(person)}>{person.name}</Link></span>)}</p></section> : null}
          <section className="concept-related" id="related" aria-labelledby="related-title">
            <h2 id="related-title">Related concepts</h2>
            <p>{related.map((record, index) => <span key={record.slug}>{index > 0 ? ' · ' : ''}<Link href={getConceptHref(record)}>{record.title}</Link></span>)}</p>
          </section>
          <section className="notice-card" id="source">
            <strong>Source note</strong>
            <p>Arabic verses are shown verbatim from Tanzil Uthmani 1.1 and English translations from QuranEnc Rowwad 1.0.19. Concept links form an editorial navigation layer.</p>
          </section>
        </article>
        <aside className="wiki-infobox concept-infobox">
          <h2>{concept.title}</h2><p lang="ar" dir="rtl">{concept.arabic}</p>
          <dl><div><dt>Article type</dt><dd>Concept</dd></div><div><dt>Verse records</dt><dd>{concept.verseRefs.length}</dd></div><div><dt>Related articles</dt><dd>{related.length}</dd></div></dl>
          <Link href="/concepts">Return to concept index</Link>
        </aside>
      </div>
    </main>
  );
}
