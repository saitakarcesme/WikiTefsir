import type { Metadata } from 'next';
import Link from 'next/link';
import { HadithDirectory } from '../components/hadith-directory';
import { SiteHeader } from '../components/site-header';
import { getAllHadithsForLocale, getHadithById, getHadithCategoriesForLocale, getHadithStatsForLocale, getThemesForHadith, hadithThemes } from '@/lib/hadith';
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
  const categoryNames = new Map(getHadithCategoriesForLocale(locale).map((category) => [category.id, category.title]));
  const themeTranslations = new Map<string, string>([['Worship & devotion','İbadet'],['Character & manners','Ahlak ve edep'],['Family & home','Aile ve ev'],['Companions & community','Sahabe ve toplum'],['Neighbors & society','Komşuluk ve toplum'],['Knowledge & teaching','İlim ve eğitim'],['Governance & justice','Yönetim ve adalet'],['Peace & agreements','Barış ve antlaşmalar'],['War & defense','Savaş ve savunma'],['Trade & wealth','Ticaret ve mal'],['Food, health & daily life','Yeme, sağlık ve günlük hayat'],['Hereafter & spiritual life','Ahiret ve manevi hayat'],['General guidance','Genel rehberlik']]);
  const records = getAllHadithsForLocale(locale).map((record) => {
    const sourceRecord = getHadithById(record.id) ?? record;
    return ({
    id: record.id,
    title: record.title,
    attribution: record.attribution,
    grade: record.grade,
    categories: record.categories.flatMap((id) => categoryNames.get(id) ?? []).join(' · '),
    themes: getThemesForHadith(sourceRecord).map((theme) => tr ? (themeTranslations.get(theme) ?? theme) : theme),
  }); });
  const themes = [...hadithThemes].map((theme) => tr ? (themeTranslations.get(theme) ?? theme) : theme);

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

        <HadithDirectory records={records} themes={themes} locale={locale} />

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
