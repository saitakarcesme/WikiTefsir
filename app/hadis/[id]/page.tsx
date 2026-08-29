import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '../../components/site-header';
import {
  getCategoriesForHadithLocale,
  getHadithById,
  getHadithByIdForLocale,
  getHadithHref,
  hadithVersion,
} from '@/lib/hadith';
import { getConceptHref, getConceptsForHadith, getConceptTitle } from '@/lib/concepts';
import { SourceDrawer } from '@/app/components/source-drawer';
import { getHadithPdfSource } from '@/lib/sources';
import { getLocale } from '@/lib/server-locale';

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
  const locale = await getLocale();
  const tr = locale === 'tr';
  const { id } = await params;
  const record = getHadithByIdForLocale(id, locale);
  if (!record) notFound();
  const categories = getCategoriesForHadithLocale(record, locale);
  const concepts = getConceptsForHadith(record.id);
  const pdfSource = getHadithPdfSource(record.id);

  return (
    <main>
      <SiteHeader />
      <div className="hadith-article-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">{tr ? 'Ana sayfa' : 'Main page'}</Link><span>›</span><Link href="/hadith">{tr ? 'Hadisler' : 'Hadiths'}</Link><span>›</span>#{record.id}</nav>
        <header className="hadith-article-header">
          <span className="section-kicker">{tr ? 'Sahih hadis makalesi' : 'Authentic hadith article'}</span>
          <h1>{record.title}</h1>
          <div className="article-facts"><span>{record.grade}</span><span>{record.attribution}</span><span>HadeethEnc #{record.id}</span></div>
        </header>

        <section className="hadith-text-card" aria-labelledby="arabic-text-title">
          <span className="section-kicker" id="arabic-text-title">{tr ? 'Arapça hadis metni' : 'Arabic hadith text'}</span>
          {record.hadeeth_intro_ar && <p className="hadith-intro" lang="ar" dir="rtl">{record.hadeeth_intro_ar}</p>}
          <p className="hadith-arabic" lang="ar" dir="rtl">{record.hadeeth_ar}</p>
          <div className="hadith-translation">
            <span>{tr ? 'Türkçe tercüme' : 'English translation'}</span>
            {record.hadeeth_intro && <p>{record.hadeeth_intro}</p>}
            <p>{record.hadeeth}</p>
          </div>
        </section>

        <div className="hadith-content-grid">
          <article className="hadith-explanation">
            <span className="section-kicker">{tr ? 'Açıklama' : 'Explanation'}</span>
            <h2>{tr ? 'Hadisin açıklaması' : 'Explanation of the hadith'}</h2>
            <p>{record.explanation}</p>
          </article>
          <aside className="hadith-source-box">
            <h2>{tr ? 'Kayıt ayrıntıları' : 'Record details'}</h2>
            <dl>
              <div><dt>{tr ? 'Derece' : 'Grade'}</dt><dd>{record.grade}</dd></div>
              <div><dt>{tr ? 'Nispet' : 'Attribution'}</dt><dd>{record.attribution}</dd></div>
              <div><dt>{tr ? 'Kayıt' : 'Record'}</dt><dd>HadeethEnc #{record.id}</dd></div>
              <div><dt>{tr ? 'Sürüm' : 'Version'}</dt><dd>{hadithVersion}</dd></div>
            </dl>
            <SourceDrawer
              label={pdfSource ? (tr ? 'PDF kaynağını aç' : 'View exact PDF source') : (tr ? 'Kaynak kaydını aç' : 'View source record')}
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
            <span className="section-kicker">{tr ? 'Dersler' : 'Lessons'}</span>
            <h2 id="benefits-title">{tr ? 'Hadisten çıkarılan faydalar' : 'Benefits from the hadith'}</h2>
            <ol>{record.hints.map((hint, index) => <li key={`${record.id}-${index}`}>{hint.trim()}</li>)}</ol>
          </section>
        )}

        {categories.length > 0 && (
          <section className="hadith-topics">
            <span className="section-kicker">{tr ? 'Konular' : 'Topics'}</span>
            <div>{categories.map((category) => <span key={category.id}>{category.title}</span>)}</div>
          </section>
        )}

        {concepts.length > 0 ? (
          <section className="hadith-concepts" aria-labelledby="hadith-concepts-title">
            <h2 id="hadith-concepts-title">{tr ? 'İlgili kavram makaleleri' : 'Related concept articles'}</h2>
            <p>{concepts.map((concept, index) => <span key={concept.slug}>{index > 0 ? ' · ' : ''}<Link href={getConceptHref(concept)}>{getConceptTitle(concept, locale)}</Link></span>)}</p>
          </section>
        ) : null}

      </div>
    </main>
  );
}
