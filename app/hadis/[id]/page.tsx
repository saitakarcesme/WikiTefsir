import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '../../components/site-header';
import {
  getCategoriesForHadith,
  getHadithById,
  getHadithHref,
  hadithVersion,
} from '@/lib/hadith';
import { getConceptHref, getConceptsForLabels } from '@/lib/concepts';
import { SourceDrawer } from '@/app/components/source-drawer';
import { getHadithPdfSource } from '@/lib/sources';

type HadithPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: HadithPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getHadithById(id);
  if (!record) return {};

  return {
    title: `Authentic Hadith #${record.id}`,
    description: record.title,
    alternates: { canonical: getHadithHref(record) },
    openGraph: { images: [] },
    twitter: { images: [] },
  };
}

export default async function HadithDetailPage({ params }: HadithPageProps) {
  const { id } = await params;
  const record = getHadithById(id);
  if (!record) notFound();
  const categories = getCategoriesForHadith(record);
  const concepts = getConceptsForLabels(categories.map((category) => category.title));
  const pdfSource = getHadithPdfSource(record.id);

  return (
    <main>
      <SiteHeader />
      <div className="hadith-article-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Main page</Link><span>›</span><Link href="/hadith">Hadiths</Link><span>›</span>#{record.id}</nav>
        <header className="hadith-article-header">
          <span className="section-kicker">Authentic hadith article</span>
          <h1>{record.title}</h1>
          <div className="article-facts"><span>{record.grade}</span><span>{record.attribution}</span><span>HadeethEnc #{record.id}</span></div>
        </header>

        <section className="hadith-text-card" aria-labelledby="arabic-text-title">
          <span className="section-kicker" id="arabic-text-title">Arabic hadith text</span>
          {record.hadeeth_intro_ar && <p className="hadith-intro" lang="ar" dir="rtl">{record.hadeeth_intro_ar}</p>}
          <p className="hadith-arabic" lang="ar" dir="rtl">{record.hadeeth_ar}</p>
          <div className="hadith-translation">
            <span>English translation</span>
            {record.hadeeth_intro && <p>{record.hadeeth_intro}</p>}
            <p>{record.hadeeth}</p>
          </div>
        </section>

        <div className="hadith-content-grid">
          <article className="hadith-explanation">
            <span className="section-kicker">Explanation</span>
            <h2>Explanation of the hadith</h2>
            <p>{record.explanation}</p>
          </article>
          <aside className="hadith-source-box">
            <h2>Record details</h2>
            <dl>
              <div><dt>Grade</dt><dd>{record.grade}</dd></div>
              <div><dt>Attribution</dt><dd>{record.attribution}</dd></div>
              <div><dt>Record</dt><dd>HadeethEnc #{record.id}</dd></div>
              <div><dt>Version</dt><dd>{hadithVersion}</dd></div>
            </dl>
            <SourceDrawer
              label={pdfSource ? 'View exact PDF source' : 'View source record'}
              title={`Authentic Hadith #${record.id}`}
              description={pdfSource ? `Exact title-aligned location in HadeethEnc English PDF, part ${pdfSource.part}.` : 'This record is verified in the current HadeethEnc dataset, but its wording is not aligned with enough certainty to the older PDF edition.'}
              pdfUrl={pdfSource?.pdfUrl}
              page={pdfSource?.page}
              sourceUrl={`https://hadeethenc.com/en/browse/hadith/${record.id}`}
              sourceLabel="HadeethEnc record"
            />
          </aside>
        </div>

        {record.hints.length > 0 && (
          <section className="hadith-benefits" aria-labelledby="benefits-title">
            <span className="section-kicker">Lessons</span>
            <h2 id="benefits-title">Benefits from the hadith</h2>
            <ol>{record.hints.map((hint, index) => <li key={`${record.id}-${index}`}>{hint.trim()}</li>)}</ol>
          </section>
        )}

        {categories.length > 0 && (
          <section className="hadith-topics">
            <span className="section-kicker">Topics</span>
            <div>{categories.map((category) => <span key={category.id}>{category.title}</span>)}</div>
          </section>
        )}

        {concepts.length > 0 ? (
          <section className="hadith-concepts" aria-labelledby="hadith-concepts-title">
            <h2 id="hadith-concepts-title">Related concept articles</h2>
            <p>{concepts.map((concept, index) => <span key={concept.slug}>{index > 0 ? ' · ' : ''}<Link href={getConceptHref(concept)}>{concept.title}</Link></span>)}</p>
          </section>
        ) : null}

      </div>
    </main>
  );
}
