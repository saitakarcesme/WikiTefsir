import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/site-header';
import { getAllScholars, getScholarHref } from '@/lib/scholars';
import { getLocale } from '@/lib/server-locale';

export const metadata: Metadata = {
  title: 'Scholars',
  description: 'Sunni scholars whose sourced tafsir records are available in WikiTefsir.',
  openGraph: { images: [] },
  twitter: { images: [] },
};

export default async function ScholarsPage() {
  const locale = await getLocale(); const tr = locale === 'tr';
  const scholarRecords = getAllScholars();

  return (
    <main>
      <SiteHeader />
      <div className="encyclopedia-index-page scholars-index-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">{tr ? 'Ana sayfa' : 'Main page'}</Link><span>›</span>{tr ? 'Âlimler' : 'Scholars'}</nav>
        <header className="index-article-header">
          <h1>{tr ? 'Âlimler' : 'Scholars'}</h1>
          <p>{tr ? 'Klasik ve sonraki dönem Ehl-i Sünnet müfessirleri, temel eserleri ve WikiTefsir’de bağlantılı ayet kayıtları için gelişen bir dizin.' : 'A growing index of classical and later Sunni exegetes, their principal works, and the verse records currently connected inside WikiTefsir.'}</p>
          <div className="index-summary"><span><strong>{scholarRecords.length}</strong> {tr ? 'âlim' : 'scholars'}</span><span><strong>{scholarRecords.filter((scholar) => scholar.linkedCorpus).length}</strong> {tr ? 'bağlı külliyat' : 'linked corpora'}</span><span><strong>{scholarRecords.length}</strong> {tr ? 'temel eser' : 'major works'}</span></div>
        </header>
        <nav className="page-tabs compact" aria-label="Scholar index tools"><span className="active">{tr ? 'Âlim dizini' : 'Scholar index'}</span><Link href="/surahs">{tr ? 'Sureler' : 'Surahs'}</Link><Link href="/concepts">{tr ? 'Kavramlar' : 'Concepts'}</Link></nav>
        <section className="concept-index scholar-index" aria-labelledby="scholar-index-title">
          <h2 id="scholar-index-title">{tr ? 'Klasik müfessirler' : 'Classical exegetes'}</h2>
          <div>
            {scholarRecords.map((scholar) => (
              <article key={scholar.slug}>
                <h3><Link href={getScholarHref(scholar.slug)}>{scholar.name}</Link></h3>
                <p className="concept-arabic" lang="ar" dir="rtl">{scholar.arabic}</p>
                <p>{tr ? `${scholar.name}, ${scholar.work} eseriyle tanınan Ehl-i Sünnet müfessiridir.` : scholar.summary}</p>
                <small>{scholar.linkedCorpus ? `${scholar.commentaryCount.toLocaleString(tr ? 'tr-TR' : 'en-US')} ${tr ? 'bağlı ayet kaydı' : 'linked verse records'} · ` : ''}{scholar.work}</small>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
