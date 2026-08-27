import type { Metadata } from 'next';
import Link from 'next/link';
import { HadithDirectory } from '../components/hadith-directory';
import { SiteHeader } from '../components/site-header';
import { getAllHadiths, getHadithCategories, getHadithStats, hadithTerms } from '@/lib/hadith';

export const metadata: Metadata = {
  title: 'Sahih Hadis Kütüphanesi',
  description: 'Arapça metni, Türkçe tercümesi, tahrici ve derecesi doğrulanmış sahih hadis maddeleri.',
};

const collections = [
  { author: 'İmam Buhârî', title: 'el-Câmiu’s-Sahîh', short: 'B' },
  { author: 'İmam Müslim', title: 'el-Câmiu’s-Sahîh', short: 'M' },
  { author: 'Ebû Dâvûd', title: 'es-Sünen', short: 'ED' },
  { author: 'İmam Tirmizî', title: 'el-Câmiʿ', short: 'T' },
  { author: 'İmam Nesâî', title: 'es-Sünen', short: 'N' },
  { author: 'İbn Mâce', title: 'es-Sünen', short: 'İM' },
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
        <nav className="breadcrumbs" aria-label="İçerik yolu"><Link href="/">Ana sayfa</Link><span>›</span>Hadisler</nav>
        <header className="library-hero">
          <span className="section-kicker">Hadis kütüphanesi</span>
          <h1>{stats.recordCount.toLocaleString('tr-TR')} sahih hadis</h1>
          <p>Arapça metni, Türkçe tercümesi, tahrici ve hadis derecesiyle birlikte tek tek erişilebilen doğrulanmış başlangıç külliyatı.</p>
          <div className="library-stats" aria-label="Hadis külliyatı özeti">
            <span><strong>{stats.recordCount.toLocaleString('tr-TR')}</strong> sahih hadis</span>
            <span><strong>{stats.categoryCount}</strong> konu başlığı</span>
            <span><strong>v{stats.version}</strong> kaynak sürümü</span>
          </div>
        </header>

        <section className="notice-card library-notice">
          <strong>Kaynak ve kapsam notu</strong>
          <p>Bu sayfadaki kayıtlar, derece alanında açıkça “sahih” hükmü bulunan HadeethEnc maddeleridir. Metinler değiştirilmeden yayımlanır. Bu veri seti Kütüb-i Sitte’nin eksiksiz aktarımı değildir; altı eserin tam neşri kaynak ve numaralandırma doğrulamasında beklemektedir.</p>
          <a className="text-link" href={hadithTerms.url} target="_blank" rel="noreferrer">HadeethEnc kaynak ve kullanım şartları <span aria-hidden="true">↗</span></a>
        </section>

        <HadithDirectory records={records} />

        <section aria-labelledby="collections-title">
          <div className="section-title"><div><span className="section-kicker">Kaynak kapısı açık</span><h2 id="collections-title">Kütüb-i Sitte</h2></div><span className="review-status">Doğrulama sürüyor</span></div>
          <div className="hadith-collections">
            {collections.map((collection) => (
              <article key={collection.author}>
                <span className="book-monogram">{collection.short}</span>
                <div><small>{collection.author}</small><h3>{collection.title}</h3></div>
                <span className="status">Kaynak doğrulamasında</span>
              </article>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
