import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '../../components/site-header';
import { SourceDrawer } from '../../components/source-drawer';
import { getAllScholars, getScholarBySlug } from '@/lib/scholars';

export function generateStaticParams() {
  return getAllScholars().map((scholar) => ({ slug: scholar.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const scholar = getScholarBySlug(slug);
  if (!scholar) return {};
  return { title: scholar.name, description: `${scholar.name}, their works and linked WikiTefsir records.` };
}

export default async function ScholarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scholar = getScholarBySlug(slug);
  if (!scholar) notFound();

  return (
    <main>
      <SiteHeader />
      <div className="profile-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Main page</Link><span>›</span><Link href="/scholars">Scholars</Link><span>›</span>{scholar.name}</nav>
        <header className="profile-hero">
          <div>
            <span className="section-kicker">Exegete profile</span>
            <h1>{scholar.name}</h1>
            <p className="profile-arabic" lang="ar" dir="rtl">{scholar.arabic}</p>
            <p>{scholar.summary}</p>
          </div>
        </header>

        <div className="profile-grid">
          <article className="profile-main">
            <section>
              <span className="section-kicker">Principal work</span>
              <h2>{scholar.work}</h2>
              <p>{scholar.linkedCorpus ? 'This work is connected to the Quran verse-by-verse. English Ibn Kathir is available where supplied by Quran.com; the pinned Arabic corpora preserve the original commentary text.' : 'This work is indexed as part of the Sunni tafsir library. A verified verse-by-verse digital corpus will be connected when its source and edition are ready.'}</p>
              {scholar.bookViewerUrl ? <div className="scholar-book-action"><SourceDrawer label={`Open ${scholar.work}`} title={`${scholar.name} — ${scholar.work}`} viewerUrl={scholar.bookViewerUrl} sourceUrl={scholar.bookSourceUrl} sourceLabel="Internet Archive" /></div> : null}
              <div className="record-stats"><span><strong>114</strong>Surahs</span><span><strong>{scholar.linkedCorpus ? scholar.commentaryCount.toLocaleString('en-US') : '—'}</strong>Linked records</span><span><strong>{scholar.linkedCorpus ? 'Live' : 'Indexed'}</strong>Corpus</span></div>
            </section>
            {scholar.linkedCorpus ? <section>
              <span className="section-kicker">Linked records</span>
              <div className="linked-record"><span>Al-Fatihah 1:1</span><strong>Sourced Arabic tafsir record</strong><Link href="/surah/fatiha#verse-1">Open record →</Link></div>
              <div className="linked-record"><span>Al-Baqarah 2:255</span><strong>Ayat al-Kursi tafsir record</strong><Link href="/surah/al-baqara#verse-255">Open record →</Link></div>
            </section> : null}
          </article>

          <aside className="profile-facts">
            <h2>At a glance</h2>
            <dl><div><dt>Period</dt><dd>{scholar.dates}</dd></div><div><dt>Geography</dt><dd>{scholar.place}</dd></div><div><dt>Fields</dt><dd>{scholar.field}</dd></div><div><dt>Work</dt><dd>{scholar.work}</dd></div></dl>
            {scholar.linkedCorpus ? <Link href="/surah/fatiha">View linked surah →</Link> : <Link href="/scholars">Return to scholars →</Link>}
          </aside>
        </div>
      </div>
    </main>
  );
}
