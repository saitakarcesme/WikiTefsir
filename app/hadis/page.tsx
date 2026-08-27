import type { Metadata } from 'next';
import Link from 'next/link';
import { HadithDirectory } from '../components/hadith-directory';
import { SiteHeader } from '../components/site-header';
import { getAllHadiths, getHadithCategories, getHadithStats, hadithTerms } from '@/lib/hadith';

export const metadata: Metadata = {
  title: 'Authentic Hadith Library',
  description: 'Verified authentic hadith articles with Arabic text, English translation, attribution and grade.',
};

const collections = [
  { author: 'Imam al-Bukhari', title: 'Sahih al-Bukhari', short: 'B' },
  { author: 'Imam Muslim', title: 'Sahih Muslim', short: 'M' },
  { author: 'Abu Dawud', title: 'Sunan Abi Dawud', short: 'AD' },
  { author: 'Imam al-Tirmidhi', title: 'Jami al-Tirmidhi', short: 'T' },
  { author: 'Imam al-Nasa’i', title: 'Sunan al-Nasa’i', short: 'N' },
  { author: 'Ibn Majah', title: 'Sunan Ibn Majah', short: 'IM' },
];

export default function HadithPage() {
  const stats = getHadithStats();
  const categoryNames = new Map(getHadithCategories().map((category) => [category.id, category.title]));
  const records = getAllHadiths().map((record) => ({
    id: record.id,
    title: record.title,
    attribution: record.attribution,
    grade: record.grade,
    categories: record.categories.flatMap((id) => categoryNames.get(id) ?? []).join(' · '),
  }));

  return (
    <main>
      <SiteHeader />
      <div className="library-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Main page</Link><span>›</span>Hadiths</nav>
        <header className="library-hero">
          <span className="section-kicker">Hadith library</span>
          <h1>{stats.recordCount.toLocaleString('en-US')} authentic hadiths</h1>
          <p>A verified corpus with individually accessible Arabic text, English translation, attribution and hadith grade.</p>
          <div className="library-stats" aria-label="Hadith corpus summary">
            <span><strong>{stats.recordCount.toLocaleString('en-US')}</strong> authentic hadiths</span>
            <span><strong>{stats.categoryCount}</strong> topics</span>
            <span><strong>v{stats.version}</strong> source version</span>
          </div>
        </header>

        <section className="notice-card library-notice">
          <strong>Source and coverage note</strong>
          <p>These are HadeethEnc records whose English grade explicitly begins with “Authentic”. Texts are published verbatim. This dataset is not a complete edition of the Six Books; full book, chapter, chain and numbering verification remains in progress.</p>
          <a className="text-link" href={hadithTerms.url} target="_blank" rel="noreferrer">HadeethEnc source and reuse terms <span aria-hidden="true">↗</span></a>
        </section>

        <HadithDirectory records={records} />

        <section aria-labelledby="collections-title">
          <div className="section-title"><div><span className="section-kicker">Source work in progress</span><h2 id="collections-title">The Six Books</h2></div><span className="review-status">Verification in progress</span></div>
          <div className="hadith-collections">
            {collections.map((collection) => (
              <article key={collection.author}>
                <span className="book-monogram">{collection.short}</span>
                <div><small>{collection.author}</small><h3>{collection.title}</h3></div>
                <span className="status">Source verification</span>
              </article>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
