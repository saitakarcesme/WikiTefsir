import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '../../components/site-header';
import {
  getCategoriesForHadith,
  getHadithById,
  getHadithHref,
  hadithTerms,
  hadithVersion,
} from '@/lib/hadith';
import { getConceptHref, getConceptsForLabels } from '@/lib/concepts';

type HadithPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: HadithPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getHadithById(id);
  if (!record) return {};

  return {
    title: `Sahih Hadis #${record.id}`,
    description: record.title,
    alternates: { canonical: getHadithHref(record) },
    openGraph: { images: [] },
    twitter: { images: [] },
  };
}

export default async function HadithDetailPage({ params }: HadithPageProps) {
  const { id } = await params;
  const record = getHadithById(id);
  if (!record) notFound();
  const categories = getCategoriesForHadith(record);
  const concepts = getConceptsForLabels(categories.map((category) => category.title));

  return (
    <main>
      <SiteHeader />
      <div className="hadith-article-page">
        <nav className="breadcrumbs" aria-label="İçerik yolu"><Link href="/">Ana sayfa</Link><span>›</span><Link href="/hadis">Hadisler</Link><span>›</span>#{record.id}</nav>
        <header className="hadith-article-header">
          <span className="section-kicker">Sahih hadis maddesi</span>
          <h1>{record.title}</h1>
          <div className="article-facts"><span>{record.grade}</span><span>{record.attribution}</span><span>HadeethEnc #{record.id}</span></div>
        </header>

        <section className="hadith-text-card" aria-labelledby="arabic-text-title">
          <span className="section-kicker" id="arabic-text-title">Arapça hadis metni</span>
          {record.hadeeth_intro_ar && <p className="hadith-intro" lang="ar" dir="rtl">{record.hadeeth_intro_ar}</p>}
          <p className="hadith-arabic" lang="ar" dir="rtl">{record.hadeeth_ar}</p>
          <div className="hadith-translation">
            <span>Türkçe tercüme</span>
            {record.hadeeth_intro && <p>{record.hadeeth_intro}</p>}
            <p>{record.hadeeth}</p>
          </div>
        </section>

        <div className="hadith-content-grid">
          <article className="hadith-explanation">
            <span className="section-kicker">Açıklama</span>
            <h2>Hadisin izahı</h2>
            <p>{record.explanation}</p>
          </article>
          <aside className="hadith-source-box">
            <h2>Kayıt künyesi</h2>
            <dl>
              <div><dt>Derece</dt><dd>{record.grade}</dd></div>
              <div><dt>Tahric / nispet</dt><dd>{record.attribution}</dd></div>
              <div><dt>Kayıt</dt><dd>HadeethEnc #{record.id}</dd></div>
              <div><dt>Sürüm</dt><dd>{hadithVersion}</dd></div>
            </dl>
            <a href={hadithTerms.url} target="_blank" rel="noreferrer">Kaynak ve kullanım şartları ↗</a>
          </aside>
        </div>

        {record.hints.length > 0 && (
          <section className="hadith-benefits" aria-labelledby="benefits-title">
            <span className="section-kicker">Çıkarımlar</span>
            <h2 id="benefits-title">Hadisten faydalar</h2>
            <ol>{record.hints.map((hint, index) => <li key={`${record.id}-${index}`}>{hint.trim()}</li>)}</ol>
          </section>
        )}

        {categories.length > 0 && (
          <section className="hadith-topics">
            <span className="section-kicker">Konu başlıkları</span>
            <div>{categories.map((category) => <span key={category.id}>{category.title}</span>)}</div>
          </section>
        )}

        {concepts.length > 0 ? (
          <section className="hadith-concepts" aria-labelledby="hadith-concepts-title">
            <h2 id="hadith-concepts-title">İlgili kavram maddeleri</h2>
            <p>{concepts.map((concept, index) => <span key={concept.slug}>{index > 0 ? ' · ' : ''}<Link href={getConceptHref(concept)}>{concept.title}</Link></span>)}</p>
          </section>
        ) : null}

        <section className="notice-card verified-source-notice">
          <strong>Metin bütünlüğü</strong>
          <p>Arapça metin, Türkçe tercüme, açıklama ve faydalar HadeethEnc {hadithVersion} kaydından içerik değişikliği yapılmadan yayımlanmıştır.</p>
        </section>
      </div>
    </main>
  );
}
