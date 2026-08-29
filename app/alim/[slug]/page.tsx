import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '../../components/site-header';
import { SourceDrawer } from '../../components/source-drawer';
import { getAllScholars, getScholarBySlug } from '@/lib/scholars';
import { getLocale } from '@/lib/server-locale';

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
  const locale = await getLocale(); const tr = locale === 'tr';
  const { slug } = await params;
  const scholar = getScholarBySlug(slug);
  if (!scholar) notFound();

  return (
    <main>
      <SiteHeader />
      <div className="profile-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">{tr ? 'Ana sayfa' : 'Main page'}</Link><span>›</span><Link href="/scholars">{tr ? 'Âlimler' : 'Scholars'}</Link><span>›</span>{scholar.name}</nav>
        <header className="profile-hero">
          <div>
            <span className="section-kicker">{tr ? 'Müfessir profili' : 'Exegete profile'}</span>
            <h1>{scholar.name}</h1>
            <p className="profile-arabic" lang="ar" dir="rtl">{scholar.arabic}</p>
            <p>{tr ? `${scholar.name}, ${scholar.work} eseriyle tanınan Ehl-i Sünnet müfessiridir. Sayfa, doğrulanmış eser ve ayet bağlantılarını bir araya getirir.` : scholar.summary}</p>
          </div>
        </header>

        <div className="profile-grid">
          <article className="profile-main">
            <section>
              <span className="section-kicker">{tr ? 'Temel eser' : 'Principal work'}</span>
              <h2>{scholar.work}</h2>
              <p>{scholar.linkedCorpus ? (tr ? 'Bu eser Kur’an’a ayet ayet bağlanmıştır. Türkçe arayüzde kaynak tefsir metinleri güvenilir baskıların özgün dilini korur.' : 'This work is connected to the Quran verse-by-verse. English Ibn Kathir is available where supplied by Quran.com; the pinned Arabic corpora preserve the original commentary text.') : (tr ? 'Bu eser Ehl-i Sünnet tefsir kütüphanesinde dizinlenmiştir. Kaynağı ve baskısı doğrulanan ayet bazlı dijital külliyat hazır olduğunda bağlanacaktır.' : 'This work is indexed as part of the Sunni tafsir library. A verified verse-by-verse digital corpus will be connected when its source and edition are ready.')}</p>
              {scholar.bookViewerUrl ? <div className="scholar-book-action"><SourceDrawer label={`Open ${scholar.work}`} title={`${scholar.name} — ${scholar.work}`} viewerUrl={scholar.bookViewerUrl} sourceUrl={scholar.bookSourceUrl} sourceLabel="Internet Archive" /></div> : null}
              <div className="record-stats"><span><strong>114</strong>{tr ? 'Sure' : 'Surahs'}</span><span><strong>{scholar.linkedCorpus ? scholar.commentaryCount.toLocaleString(tr ? 'tr-TR' : 'en-US') : '—'}</strong>{tr ? 'Bağlı kayıt' : 'Linked records'}</span><span><strong>{scholar.linkedCorpus ? (tr ? 'Canlı' : 'Live') : (tr ? 'Dizinli' : 'Indexed')}</strong>{tr ? 'Külliyat' : 'Corpus'}</span></div>
            </section>
            {scholar.linkedCorpus ? <section>
              <span className="section-kicker">{tr ? 'Bağlı kayıtlar' : 'Linked records'}</span>
              <div className="linked-record"><span>Al-Fatihah 1:1</span><strong>Sourced Arabic tafsir record</strong><Link href="/surah/fatiha#verse-1">Open record →</Link></div>
              <div className="linked-record"><span>Al-Baqarah 2:255</span><strong>Ayat al-Kursi tafsir record</strong><Link href="/surah/al-baqara#verse-255">Open record →</Link></div>
            </section> : null}
          </article>

          <aside className="profile-facts">
            <h2>{tr ? 'Bir bakışta' : 'At a glance'}</h2>
            <dl><div><dt>{tr ? 'Dönem' : 'Period'}</dt><dd>{scholar.dates}</dd></div><div><dt>{tr ? 'Coğrafya' : 'Geography'}</dt><dd>{scholar.place}</dd></div><div><dt>{tr ? 'Alanlar' : 'Fields'}</dt><dd>{scholar.field}</dd></div><div><dt>{tr ? 'Eser' : 'Work'}</dt><dd>{scholar.work}</dd></div></dl>
            {scholar.linkedCorpus ? <Link href="/surah/fatiha">{tr ? 'Bağlı sureyi aç →' : 'View linked surah →'}</Link> : <Link href="/scholars">{tr ? 'Âlimlere dön →' : 'Return to scholars →'}</Link>}
          </aside>
        </div>
      </div>
    </main>
  );
}
