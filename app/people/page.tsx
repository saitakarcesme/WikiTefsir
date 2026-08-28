import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/site-header';
import { getAllProphets, getAllQuranicFigures, getPersonHref, type PersonRecord } from '@/lib/people';

export const metadata: Metadata = {
  title: 'People in the Quran',
  description: 'Quran-first articles for all 25 named prophets and major Quranic people, groups, angels, rulers, and unnamed figures.',
  openGraph: { images: [] }, twitter: { images: [] },
};

export default function PeoplePage() {
  const prophets = getAllProphets();
  const figures = getAllQuranicFigures();
  function cards(records: PersonRecord[]) { return records.map((person) => <Link href={getPersonHref(person)} key={person.slug}>
    <span className="reader-card-arabic" lang="ar" dir="rtl">{person.arabic}</span>
    <span><strong>{person.name}</strong><small>{person.role}</small><p>{person.introduction}</p><em>{person.quranNaming}</em></span>
    <span aria-hidden="true">→</span>
  </Link>); }
  return (
    <main><SiteHeader /><div className="reader-index-page">
      <nav className="breadcrumbs"><Link href="/">Home</Link><span>›</span>People</nav>
      <header className="reader-page-header"><span className="reader-overline">Connected articles</span><h1>People & figures in the Quran</h1><p>Read every Quran-named prophet in narrative order, then explore rulers, families, angels, adversaries, communities, and unnamed figures. Every stage returns to exact verses.</p><div className="people-counts"><a href="#prophets"><strong>25</strong><span>named prophets</span></a><a href="#figures"><strong>{figures.length}</strong><span>other figures</span></a></div></header>
      <section id="prophets" className="people-directory-section"><div className="reader-section-heading"><span>Complete named set</span><h2>Prophets in the Quran</h2></div><div className="reader-card-list" aria-label="Prophet articles">{cards(prophets)}</div></section>
      <section id="figures" className="people-directory-section"><div className="reader-section-heading"><span>People, beings & communities</span><h2>Other Quranic figures</h2></div><div className="reader-card-list" aria-label="Other Quranic figure articles">{cards(figures)}</div></section>
    </div></main>
  );
}
