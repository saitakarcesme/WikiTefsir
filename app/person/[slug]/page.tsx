import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/app/components/site-header';
import { SourceDrawer } from '@/app/components/source-drawer';
import { getAllPeople, getPersonBySlug } from '@/lib/people';
import { getConceptBySlug, getConceptHref, getConceptTitle } from '@/lib/concepts';
import { getTranslation, getSurahByNumber, getSurahHref, getVerse } from '@/lib/quran';
import { getQuranPdfSource } from '@/lib/sources';
import { getLocale } from '@/lib/server-locale';
import { getPersonIntro, getPersonKind, getPersonName } from '@/lib/person-locale';

export const dynamicParams = false;
export function generateStaticParams() { return getAllPeople().map((person) => ({ slug: person.slug })); }
type PersonPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const person = getPersonBySlug((await params).slug);
  if (!person) return {};
  return { title: `${person.name} in the Quran`, description: person.introduction, openGraph: { images: [] }, twitter: { images: [] } };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const locale = await getLocale(); const tr = locale === 'tr';
  const person = getPersonBySlug((await params).slug);
  if (!person) notFound();
  return <main><SiteHeader /><div className="person-reader-layout">
    <aside className="reader-rail"><span>{tr ? 'Bu sayfada' : 'On this page'}</span>{person.narrative.map((stage, index) => <a href={`#${stage.id}`} key={stage.id}>{index + 1}. {tr ? `Bölüm ${index + 1}` : stage.title}</a>)}</aside>
    <article className="reader-article">
      <nav className="breadcrumbs"><Link href="/">{tr ? 'Ana sayfa' : 'Home'}</Link><span>›</span><Link href="/people">{tr ? 'Kişiler' : 'People'}</Link><span>›</span>{getPersonName(person, locale)}</nav>
      <header className="reader-article-header"><span className="reader-overline">{tr ? `Kur’an’da ${getPersonKind(person, locale)}` : `${person.kind} in the Quran`}</span><h1>{getPersonName(person, locale)}</h1><p className="reader-arabic-title" lang="ar" dir="rtl">{person.arabic}</p><p className="reader-deck">{getPersonIntro(person, locale)}</p><div className="reader-metadata"><span>{getPersonKind(person, locale)}</span><span>{person.narrative.length} {tr ? 'kıssa bölümü' : 'story chapters'}</span><span>{person.keyReferences.length} {tr ? 'ana kaynak' : 'key references'}</span></div><p className="quran-naming-note">{tr ? 'Bu okuma yolu yalnızca Kur’an’da açıkça yer alan olay ve tasvirleri kullanır.' : person.quranNaming}</p></header>
      <section className="quran-timeline person-story-flow" aria-labelledby="timeline-title"><div className="reader-section-heading"><span>{tr ? 'Sureler boyunca' : 'Across the surahs'}</span><h2 id="timeline-title">{tr ? 'Ayetler üzerinden kıssa' : 'The story through its verses'}</h2><p>{tr ? 'Kesintisiz okuyun: her pasaj açık ve anlatı sırasına göre düzenlenmiştir.' : 'Read continuously: every passage is already open and arranged in narrative order.'}</p></div>
        {person.narrative.map((stage, stageIndex) => <article id={stage.id} key={stage.id} className="timeline-stage">
          <div className="timeline-marker"><span>{String(stageIndex + 1).padStart(2, '0')}</span></div>
          <div className="timeline-content"><h3>{tr ? `${getPersonName(person, locale)} · ${stageIndex + 1}. bölüm` : stage.title}</h3>{tr ? null : <p className="timeline-summary">{stage.summary}</p>}
            <div className="timeline-references">{stage.references.map((reference) => {
              const surah = getSurahByNumber(reference.surah); const verse = getVerse(reference.surah, reference.ayah); const meaning = getTranslation(reference.surah, reference.ayah, locale);
              if (!surah || !verse || !meaning) throw new Error(`Missing person reference ${reference.surah}:${reference.ayah}`);
              const source = getQuranPdfSource(surah.startOffset + reference.ayah - 1);
              return <article className="story-verse" key={`${reference.surah}:${reference.ayah}`}><header><Link href={`${getSurahHref(surah)}#verse-${reference.ayah}`}>{surah.nameTransliterated} {reference.surah}:{reference.ayah}</Link></header><div className="timeline-verse"><p lang="ar" dir="rtl">{verse.text}</p><p>{meaning.text}</p><div><SourceDrawer label={tr ? 'Kaynağı aç' : 'Open source'} title={`${surah.nameTransliterated} ${reference.surah}:${reference.ayah}`} pdfUrl={source?.pdfUrl} page={source?.page} sourceUrl="https://quranenc.com" sourceLabel="QuranEnc" /></div></div></article>;
            })}</div>
          </div>
        </article>)}
      </section>
      <p className="person-closing-note">{tr ? 'Kur’an’ın vermediği biyografik ayrıntılar bu anlatıya eklenmez.' : person.closingNote}</p>
      <section className="reader-related"><h2>{tr ? 'İlgili kavramlar' : 'Related concepts'}</h2><div>{person.concepts.flatMap((slug) => { const concept = getConceptBySlug(slug); return concept ? [<Link href={getConceptHref(concept)} key={slug}>{getConceptTitle(concept, locale)}</Link>] : []; })}</div></section>
    </article>
  </div></main>;
}
