import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/site-header';
import { getAllPeople, getPersonHref } from '@/lib/people';

export const metadata: Metadata = {
  title: 'People in the Quran',
  description: 'Quran-first person articles and connected narrative reading paths.',
  openGraph: { images: [] }, twitter: { images: [] },
};

export default function PeoplePage() {
  return (
    <main><SiteHeader /><div className="reader-index-page">
      <nav className="breadcrumbs"><Link href="/">Home</Link><span>›</span>People</nav>
      <header className="reader-page-header"><span className="reader-overline">Connected articles</span><h1>People in the Quran</h1><p>Follow a person across surahs without losing the source trail. Every stage links back to the exact verses.</p></header>
      <section className="reader-card-list" aria-label="Person articles">
        {getAllPeople().map((person) => <Link href={getPersonHref(person)} key={person.slug}>
          <span className="reader-card-arabic" lang="ar" dir="rtl">{person.arabic}</span>
          <span><strong>{person.name}</strong><small>{person.role}</small><p>{person.introduction}</p></span>
          <span aria-hidden="true">→</span>
        </Link>)}
      </section>
    </div></main>
  );
}
