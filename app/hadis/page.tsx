import type { Metadata } from 'next';
import Link from 'next/link';
import { HadithDirectory } from '../components/hadith-directory';
import { SiteHeader } from '../components/site-header';
import { getHadithStatsForLocale, hadithThemes } from '@/lib/hadith';
import { getHadithDirectoryRecords, getHadithThemeLabels } from '@/lib/hadith-directory-data';
import { getLocale } from '@/lib/server-locale';
import { localeNumber } from '@/lib/locale';

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

export default async function HadithPage() {
  const locale = await getLocale();
  const tr = locale === 'tr';
  const stats = getHadithStatsForLocale(locale);
  const records = getHadithDirectoryRecords(locale);
  const themes = getHadithThemeLabels(locale, hadithThemes);

  return (
    <main>
      <SiteHeader />
      <div className="library-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">{tr ? 'Ana sayfa' : 'Main page'}</Link><span>›</span>{tr ? 'Hadisler' : 'Hadiths'}</nav>
        <header className="library-hero">
          <span className="section-kicker">{tr ? 'Hadis kütüphanesi' : 'Hadith library'}</span>
          <h1>{stats.recordCount.toLocaleString(localeNumber(locale))} {tr ? 'sahih hadis' : 'authentic hadiths'}</h1>
          <p>{tr ? 'Arapça metni, Türkçe tercümesi, nispeti ve hadis derecesi ayrı ayrı erişilebilen doğrulanmış külliyat.' : 'A verified corpus with individually accessible Arabic text, English translation, attribution and hadith grade.'}</p>
          <div className="library-stats" aria-label="Hadith corpus summary">
            <span><strong>{stats.recordCount.toLocaleString(localeNumber(locale))}</strong> {tr ? 'sahih hadis' : 'authentic hadiths'}</span>
            <span><strong>{stats.categoryCount}</strong> {tr ? 'konu' : 'topics'}</span>
            <span><strong>v{stats.version}</strong> {tr ? 'kaynak sürümü' : 'source version'}</span>
          </div>
        </header>

        <HadithDirectory initialRecords={records.slice(0, 30)} total={records.length} themes={themes} locale={locale} />

        <section aria-labelledby="collections-title">
          <div className="section-title"><div><span className="section-kicker">{tr ? 'Kaynak çalışması sürüyor' : 'Source work in progress'}</span><h2 id="collections-title">{tr ? 'Kütüb-i Sitte' : 'The Six Books'}</h2></div><span className="review-status">{tr ? 'Doğrulama sürüyor' : 'Verification in progress'}</span></div>
          <div className="hadith-collections">
            {collections.map((collection) => (
              <article key={collection.author}>
                <span className="book-monogram">{collection.short}</span>
                <div><small>{collection.author}</small><h3>{collection.title}</h3></div>
                <span className="status">{tr ? 'Kaynak doğrulaması' : 'Source verification'}</span>
              </article>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
