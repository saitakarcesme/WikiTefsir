import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '../../components/site-header';
import { getAllConcepts, getConceptBySlug, getConceptHref } from '@/lib/concepts';
import { getSurahByNumber, getSurahHref, getTurkishMeal, getVerse } from '@/lib/quran';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllConcepts().map((concept) => ({ slug: concept.slug }));
}

type ConceptPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ConceptPageProps): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) return {};
  return {
    title: concept.title,
    description: `${concept.title}: ${concept.scope.toLocaleLowerCase('tr-TR')}.`,
    openGraph: { images: [] },
    twitter: { images: [] },
  };
}

export default async function ConceptPage({ params }: ConceptPageProps) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) notFound();
  const related = concept.related.flatMap((relatedSlug) => {
    const record = getConceptBySlug(relatedSlug);
    return record ? [record] : [];
  });

  return (
    <main>
      <SiteHeader />
      <div className="wiki-layout concept-article-layout">
        <aside className="wiki-toc" aria-label="Sayfa içeriği"><span>İçindekiler</span><a className="active" href="#giris">Giriş</a><a href="#ayetler">İlgili ayetler</a><a href="#baglantilar">İlgili kavramlar</a><a href="#kaynak">Kaynak notu</a></aside>
        <article className="wiki-article">
          <nav className="breadcrumbs" aria-label="İçerik yolu"><Link href="/">Ana sayfa</Link><span>›</span><Link href="/kavramlar">Kavramlar</Link><span>›</span>{concept.title}</nav>
          <header className="article-header" id="giris">
            <h1>{concept.title}</h1>
            <p className="article-arabic-title" lang="ar" dir="rtl">{concept.arabic}</p>
            <p className="article-lead">Bu madde, {concept.title.toLocaleLowerCase('tr-TR')} kavramıyla ilgili doğrulanmış Kur’an kayıtlarına ve WikiTefsir’deki bağlantılı maddelere toplu erişim sağlar.</p>
          </header>
          <section className="concept-verse-list" id="ayetler" aria-labelledby="concept-verses-title">
            <h2 id="concept-verses-title">Kur’an’daki ilgili kayıtlar</h2>
            {concept.verseRefs.map((reference) => {
              const surah = getSurahByNumber(reference.surah);
              const verse = getVerse(reference.surah, reference.ayah);
              const meaning = getTurkishMeal(reference.surah, reference.ayah);
              if (!surah || !verse || !meaning) throw new Error(`Concept reference is missing: ${reference.surah}:${reference.ayah}`);
              return (
                <article key={`${reference.surah}:${reference.ayah}`}>
                  <h3><Link href={`${getSurahHref(surah)}#ayet-${reference.ayah}`}>{surah.nameTransliterated} {reference.surah}:{reference.ayah}</Link></h3>
                  <p className="concept-verse-arabic" lang="ar" dir="rtl">{verse.text}</p>
                  <p>{meaning.text}</p>
                  {meaning.footnotes ? <small>{meaning.footnotes}</small> : null}
                </article>
              );
            })}
          </section>
          <section className="concept-related" id="baglantilar" aria-labelledby="related-title">
            <h2 id="related-title">İlgili kavramlar</h2>
            <p>{related.map((record, index) => <span key={record.slug}>{index > 0 ? ' · ' : ''}<Link href={getConceptHref(record)}>{record.title}</Link></span>)}</p>
          </section>
          <section className="notice-card" id="kaynak">
            <strong>Kaynak notu</strong>
            <p>Bu sayfadaki Arapça ayetler Tanzil Uthmani 1.1, Türkçe mealler QuranEnc Rowwad 1.0.4 kaynağından değiştirilmeden gösterilir. Kavram bağlantıları editoryal gezinme katmanıdır.</p>
          </section>
        </article>
        <aside className="wiki-infobox concept-infobox">
          <h2>{concept.title}</h2><p lang="ar" dir="rtl">{concept.arabic}</p>
          <dl><div><dt>Madde türü</dt><dd>Kavram</dd></div><div><dt>Ayet kaydı</dt><dd>{concept.verseRefs.length}</dd></div><div><dt>İlgili madde</dt><dd>{related.length}</dd></div></dl>
          <Link href="/kavramlar">Kavram dizinine dön</Link>
        </aside>
      </div>
    </main>
  );
}
