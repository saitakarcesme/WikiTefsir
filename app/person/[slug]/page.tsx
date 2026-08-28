import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/app/components/site-header';
import { SourceDrawer } from '@/app/components/source-drawer';
import { PersonRelationDiagram } from '@/app/components/person-relation-diagram';
import { getAllPeople, getPersonBySlug } from '@/lib/people';
import { getConceptBySlug, getConceptHref } from '@/lib/concepts';
import { getEnglishTranslation, getSurahByNumber, getSurahHref, getVerse } from '@/lib/quran';
import { getQuranPdfSource } from '@/lib/sources';

export const dynamicParams = false;
export function generateStaticParams() { return getAllPeople().map((person) => ({ slug: person.slug })); }
type PersonPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const person = getPersonBySlug((await params).slug);
  if (!person) return {};
  return { title: `${person.name} in the Quran`, description: person.introduction, openGraph: { images: [] }, twitter: { images: [] } };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const person = getPersonBySlug((await params).slug);
  if (!person) notFound();
  return <main><SiteHeader /><div className="person-reader-layout">
    <aside className="reader-rail"><span>On this page</span>{person.narrative.map((stage, index) => <a href={`#${stage.id}`} key={stage.id}>{index + 1}. {stage.title}</a>)}</aside>
    <article className="reader-article">
      <nav className="breadcrumbs"><Link href="/">Home</Link><span>›</span><Link href="/people">People</Link><span>›</span>{person.name}</nav>
      <header className="reader-article-header"><span className="reader-overline">Quran-first {person.kind.toLowerCase()} article</span><h1>{person.name}</h1><p className="reader-arabic-title" lang="ar" dir="rtl">{person.arabic}</p><p className="reader-deck">{person.introduction}</p><div className="reader-metadata"><span>{person.role}</span><span>{person.narrative.length} narrative stages</span><span>{person.keyReferences.length} key references</span></div><p className="quran-naming-note">{person.quranNaming}</p></header>
      <aside className="scope-note"><strong>Reading method</strong><p>{person.quranScope}</p></aside>
      <PersonRelationDiagram person={person} />
      <section className="quran-timeline" aria-labelledby="timeline-title"><div className="reader-section-heading"><span>Across the surahs</span><h2 id="timeline-title">Narrative reading path</h2></div>
        {person.narrative.map((stage, stageIndex) => <article id={stage.id} key={stage.id} className="timeline-stage">
          <div className="timeline-marker"><span>{String(stageIndex + 1).padStart(2, '0')}</span></div>
          <div className="timeline-content"><h3>{stage.title}</h3><p className="timeline-summary">{stage.summary}</p>
            <div className="timeline-references">{stage.references.map((reference) => {
              const surah = getSurahByNumber(reference.surah); const verse = getVerse(reference.surah, reference.ayah); const meaning = getEnglishTranslation(reference.surah, reference.ayah);
              if (!surah || !verse || !meaning) throw new Error(`Missing person reference ${reference.surah}:${reference.ayah}`);
              const source = getQuranPdfSource(surah.startOffset + reference.ayah - 1);
              return <details key={`${reference.surah}:${reference.ayah}`}><summary><span>{surah.nameTransliterated} {reference.surah}:{reference.ayah}</span><small>{meaning.text}</small></summary><div className="timeline-verse"><p lang="ar" dir="rtl">{verse.text}</p><p>{meaning.text}</p><div><Link href={`${getSurahHref(surah)}#verse-${reference.ayah}`}>Open verse article</Link><SourceDrawer label="View source" title={`${surah.nameTransliterated} ${reference.surah}:${reference.ayah}`} description="Exact page in the official QuranEnc Rowwad mushaf PDF." pdfUrl={source?.pdfUrl} page={source?.page} sourceUrl="https://quranenc.com/en/browse/english_rwwad" sourceLabel="QuranEnc" /></div></div></details>;
            })}</div>
          </div>
        </article>)}
      </section>
      <aside className="scope-note closing-note"><strong>Where this sequence ends</strong><p>{person.closingNote}</p></aside>
      <aside className="scope-note"><strong>Visual policy</strong><p>WikiTefsir does not depict prophets. Future visual layers for this story will use licensed maps, landscapes, manuscripts, and source-labeled diagrams without presenting disputed geography as Quranic certainty.</p></aside>
      <section className="reader-related"><h2>Related concepts</h2><div>{person.concepts.flatMap((slug) => { const concept = getConceptBySlug(slug); return concept ? [<Link href={getConceptHref(concept)} key={slug}>{concept.title}</Link>] : []; })}</div></section>
    </article>
  </div></main>;
}
