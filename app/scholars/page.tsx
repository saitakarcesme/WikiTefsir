import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/site-header';
import { getAllScholars, getScholarHref } from '@/lib/scholars';

export const metadata: Metadata = {
  title: 'Scholars',
  description: 'Sunni scholars whose sourced tafsir records are available in WikiTefsir.',
  openGraph: { images: [] },
  twitter: { images: [] },
};

export default function ScholarsPage() {
  const scholarRecords = getAllScholars();

  return (
    <main>
      <SiteHeader />
      <div className="encyclopedia-index-page scholars-index-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Main page</Link><span>›</span>Scholars</nav>
        <header className="index-article-header">
          <h1>Scholars</h1>
          <p>A growing index of classical and later Sunni exegetes, their principal works, and the verse records currently connected inside WikiTefsir.</p>
          <div className="index-summary"><span><strong>{scholarRecords.length}</strong> scholars</span><span><strong>{scholarRecords.filter((scholar) => scholar.linkedCorpus).length}</strong> linked corpora</span><span><strong>{scholarRecords.length}</strong> major works</span></div>
        </header>
        <nav className="page-tabs compact" aria-label="Scholar index tools"><span className="active">Scholar index</span><Link href="/surahs">Surahs</Link><Link href="/concepts">Concepts</Link></nav>
        <section className="concept-index scholar-index" aria-labelledby="scholar-index-title">
          <h2 id="scholar-index-title">Classical exegetes</h2>
          <div>
            {scholarRecords.map((scholar) => (
              <article key={scholar.slug}>
                <h3><Link href={getScholarHref(scholar.slug)}>{scholar.name}</Link></h3>
                <p className="concept-arabic" lang="ar" dir="rtl">{scholar.arabic}</p>
                <p>{scholar.summary}</p>
                <small>{scholar.linkedCorpus ? `${scholar.commentaryCount.toLocaleString('en-US')} linked verse records · ` : ''}{scholar.work}</small>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
